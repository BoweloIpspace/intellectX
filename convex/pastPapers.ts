import { queryGeneric } from "convex/server";
import { v } from "convex/values";
import { isLearnerVisibleCourseRecord, learnerCourseVisibilityOptions } from "./lib/courseWorkflow";

function hasFreeLearnerAccess(record: { accessLevel?: string }) {
  return record.accessLevel !== "paid";
}

async function getVisibleCourse(ctx: any, courseStableId: string) {
  const course = await ctx.db
    .query("courses")
    .withIndex("by_stable_id", (q: any) => q.eq("stableId", courseStableId))
    .first();

  if (!course || !isLearnerVisibleCourseRecord(course, learnerCourseVisibilityOptions) || !hasFreeLearnerAccess(course)) {
    return null;
  }

  return course;
}

async function getPaperQuestions(ctx: any, paperStableId: string) {
  const questions = await ctx.db
    .query("pastPaperQuestions")
    .withIndex("by_paper_stable_id", (q: any) => q.eq("paperStableId", paperStableId))
    .collect();

  return questions.sort((left: any, right: any) => left.order - right.order);
}

export const getPastPapersByCourse = queryGeneric({
  args: { courseStableId: v.string() },
  handler: async (ctx, args) => {
    const course = await getVisibleCourse(ctx, args.courseStableId);

    if (!course) {
      return [];
    }

    const papers = await ctx.db
      .query("pastPapers")
      .withIndex("by_course_stable_id", (q: any) => q.eq("courseStableId", args.courseStableId))
      .collect();

    return papers
      .filter((paper: any) => paper.published && hasFreeLearnerAccess(paper))
      .sort((left: any, right: any) => left.order - right.order)
      .map(({ _creationTime, ...paper }: any) => paper);
  },
});

export const getPastPaperById = queryGeneric({
  args: { paperId: v.string() },
  handler: async (ctx, args) => {
    const paper = await ctx.db
      .query("pastPapers")
      .withIndex("by_stable_id", (q: any) => q.eq("stableId", args.paperId))
      .first();

    if (!paper || !paper.published || !hasFreeLearnerAccess(paper)) {
      return null;
    }

    const course = await getVisibleCourse(ctx, paper.courseStableId);

    if (!course) {
      return null;
    }

    const questions = await getPaperQuestions(ctx, paper.stableId);

    return {
      ...paper,
      questions: questions.map((question: any) => ({
        stableId: question.stableId,
        questionNumber: question.questionNumber,
        prompt: question.prompt,
        marks: question.marks,
        modelAnswer: question.modelAnswer,
        explanation: question.explanation,
        order: question.order,
      })),
    };
  },
});
