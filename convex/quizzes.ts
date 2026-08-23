import { v } from "convex/values";
import type { Doc } from "./_generated/dataModel";
import { mutation, query, type DatabaseReader } from "./_generated/server";
import { isLearnerVisibleCourseRecord, learnerCourseVisibilityOptions } from "./lib/courseWorkflow";
import { resolveLearnerUserKey } from "./lib/identity";
import {
  gradeQuizAnswers,
  normalizeQuizSubmissionId,
  quizAnswersMatch,
  toLearnerQuizQuestionPayload,
  validateQuizAnswer,
} from "./lib/quizIntegrity";
import { consumeFixedWindowRateLimit } from "./lib/rateLimit";

type ReadContext = { db: DatabaseReader };
type VisibleQuizAttempt = Doc<"quizAttempts"> & {
  quizTitle: string;
  courseStableId: string;
  courseTitle: string;
};

const QUIZ_CHECK_RATE_LIMIT = { limit: 180, windowMs: 60_000 } as const;
const QUIZ_SUBMIT_RATE_LIMIT = { limit: 30, windowMs: 60_000 } as const;

async function getLearnerVisibleCourseByStableId(ctx: ReadContext, courseStableId: string) {
  const course = await ctx.db
    .query("courses")
    .withIndex("by_stable_id", (q) => q.eq("stableId", courseStableId))
    .first();

  if (!course || !isLearnerVisibleCourseRecord(course, learnerCourseVisibilityOptions)) {
    return null;
  }

  return course;
}

function hasFreeLearnerAccess(record: { accessLevel?: "free" | "paid" }) {
  return record.accessLevel !== "paid";
}

async function getQuestionRecordsByQuizStableId(ctx: ReadContext, quizStableId: string) {
  const questions = await ctx.db
    .query("questions")
    .withIndex("by_quiz_stable_id", (q) => q.eq("quizStableId", quizStableId))
    .collect();

  return questions.sort((left, right) => left.order - right.order);
}

async function getAccessibleQuiz(ctx: ReadContext, quizStableId: string) {
  const quiz = await ctx.db
    .query("quizzes")
    .withIndex("by_stable_id", (q) => q.eq("stableId", quizStableId))
    .first();

  if (!quiz || !hasFreeLearnerAccess(quiz)) {
    return null;
  }

  const course = await getLearnerVisibleCourseByStableId(ctx, quiz.courseStableId);

  if (!course || !hasFreeLearnerAccess(course)) {
    return null;
  }

  return { quiz, course };
}

async function buildLearnerQuizPayload(ctx: ReadContext, quiz: Doc<"quizzes">) {
  const questions = await getQuestionRecordsByQuizStableId(ctx, quiz.stableId);

  return {
    ...quiz,
    questions: questions.map(toLearnerQuizQuestionPayload),
  };
}

function buildQuizAttemptResult(
  attempt: Doc<"quizAttempts">,
  quizTitle: string,
  questions: Doc<"questions">[],
) {
  const grading = gradeQuizAnswers(questions, attempt.answers);

  return {
    attemptId: attempt._id,
    quizId: attempt.quizId,
    quizTitle,
    score: attempt.score,
    totalQuestions: attempt.totalQuestions,
    percentage: attempt.percentage ?? grading.percentage,
    completedAt: attempt.completedAt,
    answers: [...attempt.answers],
    questionResults: grading.questionResults,
  };
}

export const listQuizzes = query({
  args: {},
  handler: async (ctx) => {
    const quizzes = await ctx.db.query("quizzes").collect();
    const visibleQuizzes: Array<Awaited<ReturnType<typeof buildLearnerQuizPayload>>> = [];

    for (const quiz of quizzes) {
      const course = await getLearnerVisibleCourseByStableId(ctx, quiz.courseStableId);

      if (!course || !hasFreeLearnerAccess(course) || !hasFreeLearnerAccess(quiz)) {
        continue;
      }

      visibleQuizzes.push(await buildLearnerQuizPayload(ctx, quiz));
    }

    return visibleQuizzes;
  },
});

export const getQuizzesByCourse = query({
  args: { courseStableId: v.string() },
  handler: async (ctx, args) => {
    const course = await getLearnerVisibleCourseByStableId(ctx, args.courseStableId);

    if (!course || !hasFreeLearnerAccess(course)) {
      return [];
    }

    const quizzes = await ctx.db
      .query("quizzes")
      .withIndex("by_course_stable_id", (q) => q.eq("courseStableId", args.courseStableId))
      .collect();

    return await Promise.all(
      quizzes.filter(hasFreeLearnerAccess).map(async (quiz) => await buildLearnerQuizPayload(ctx, quiz)),
    );
  },
});

export const getQuizById = query({
  args: { quizId: v.string() },
  handler: async (ctx, args) => {
    const accessible = await getAccessibleQuiz(ctx, args.quizId);

    if (!accessible) {
      return null;
    }

    return await buildLearnerQuizPayload(ctx, accessible.quiz);
  },
});

export const checkQuizAnswer = mutation({
  args: {
    userKey: v.optional(v.string()),
    quizId: v.string(),
    questionId: v.string(),
    answer: v.number(),
  },
  handler: async (ctx, args) => {
    const { userKey } = await resolveLearnerUserKey(ctx, args);
    await consumeFixedWindowRateLimit(ctx, {
      key: `quiz-check:${userKey}`,
      policy: QUIZ_CHECK_RATE_LIMIT,
    });

    const accessible = await getAccessibleQuiz(ctx, args.quizId);

    if (!accessible) {
      throw new Error("Quiz is not available to this learner.");
    }

    const questions = await getQuestionRecordsByQuizStableId(ctx, args.quizId);
    const question = questions.find((item) => item.stableId === args.questionId);

    if (!question) {
      throw new Error("Quiz question does not exist.");
    }

    const answer = validateQuizAnswer(question, args.answer);

    if (answer < 0) {
      throw new Error("A question check requires a selected answer.");
    }

    return {
      questionId: question.stableId,
      answerIndex: question.answerIndex,
      explanation: question.explanation,
      correct: answer === question.answerIndex,
    };
  },
});

export const submitQuizAttempt = mutation({
  args: {
    userKey: v.optional(v.string()),
    quizId: v.string(),
    submissionId: v.string(),
    answers: v.array(v.number()),
  },
  handler: async (ctx, args) => {
    const { userKey } = await resolveLearnerUserKey(ctx, args);
    await consumeFixedWindowRateLimit(ctx, {
      key: `quiz-submit:${userKey}`,
      policy: QUIZ_SUBMIT_RATE_LIMIT,
    });

    const accessible = await getAccessibleQuiz(ctx, args.quizId);

    if (!accessible) {
      throw new Error("Quiz is not available to this learner.");
    }

    const submissionId = normalizeQuizSubmissionId(args.submissionId);
    const questions = await getQuestionRecordsByQuizStableId(ctx, args.quizId);
    const grading = gradeQuizAnswers(questions, args.answers);
    const existingAttempt = await ctx.db
      .query("quizAttempts")
      .withIndex("by_user_submission_id", (q) => q.eq("userKey", userKey).eq("submissionId", submissionId))
      .first();

    if (existingAttempt) {
      if (existingAttempt.quizId !== args.quizId || !quizAnswersMatch(existingAttempt.answers, grading.answers)) {
        throw new Error("Quiz submission ID cannot be reused for different attempt data.");
      }

      return buildQuizAttemptResult(existingAttempt, accessible.quiz.title, questions);
    }

    const completedAt = Date.now();
    const attemptId = await ctx.db.insert("quizAttempts", {
      userKey,
      quizId: accessible.quiz.stableId,
      submissionId,
      score: grading.score,
      totalQuestions: grading.totalQuestions,
      answers: grading.answers,
      quizTitle: accessible.quiz.title,
      percentage: grading.percentage,
      completedAt,
    });

    return {
      attemptId,
      quizId: accessible.quiz.stableId,
      quizTitle: accessible.quiz.title,
      score: grading.score,
      totalQuestions: grading.totalQuestions,
      percentage: grading.percentage,
      completedAt,
      answers: grading.answers,
      questionResults: grading.questionResults,
    };
  },
});

export const getQuizAttempts = query({
  args: { userKey: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { userKey } = await resolveLearnerUserKey(ctx, args);
    const attempts = await ctx.db
      .query("quizAttempts")
      .withIndex("by_user", (q) => q.eq("userKey", userKey))
      .collect();
    const visibleAttempts: VisibleQuizAttempt[] = [];

    for (const attempt of attempts) {
      const quiz = await ctx.db
        .query("quizzes")
        .withIndex("by_stable_id", (q) => q.eq("stableId", attempt.quizId))
        .first();

      if (!quiz) {
        continue;
      }

      const course = await getLearnerVisibleCourseByStableId(ctx, quiz.courseStableId);

      if (course && hasFreeLearnerAccess(course) && hasFreeLearnerAccess(quiz)) {
        visibleAttempts.push({
          ...attempt,
          quizTitle: attempt.quizTitle ?? quiz.title,
          courseStableId: quiz.courseStableId,
          courseTitle: course.title,
        });
      }
    }

    return visibleAttempts.sort((left, right) => right.completedAt - left.completedAt);
  },
});
