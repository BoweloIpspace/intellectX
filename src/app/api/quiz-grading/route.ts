import "server-only";

import { getQuiz } from "@/data/quizzes";
import {
  gradeQuizAnswers,
  normalizeQuizSubmissionId,
  validateQuizAnswer,
  type AuthoritativeQuizQuestionRecord,
} from "../../../../convex/lib/quizIntegrity";
import { getSeedQuizAnswer } from "../../../../convex/seedQuizAnswers";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_GRADING_BODY_BYTES = 32 * 1024;

function jsonResponse(body: unknown, status = 200) {
  return Response.json(body, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
      "X-Content-Type-Options": "nosniff",
    },
  });
}

function errorResponse(error: unknown, status = 400) {
  return jsonResponse(
    { error: error instanceof Error ? error.message : "Unable to grade this quiz request." },
    status,
  );
}

function getAuthoritativeFallbackQuiz(quizId: string) {
  const quiz = getQuiz(quizId);

  if (!quiz) {
    return null;
  }

  const questions: AuthoritativeQuizQuestionRecord[] = quiz.questions.map((question, order) => {
    const answer = getSeedQuizAnswer(quiz.id, question.id);

    return {
      stableId: question.id,
      prompt: question.prompt,
      choices: question.choices,
      answerIndex: answer.answerIndex,
      explanation: answer.explanation,
      order,
    };
  });

  return { quiz, questions };
}

export async function POST(request: Request) {
  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  if (!contentType.includes("application/json")) {
    return errorResponse(new Error("Quiz grading requests must use application/json."), 415);
  }

  const contentLength = Number(request.headers.get("content-length"));
  if (Number.isFinite(contentLength) && contentLength > MAX_GRADING_BODY_BYTES) {
    return errorResponse(new Error("Quiz grading request is too large."), 413);
  }

  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return errorResponse(new Error("Quiz grading request must contain valid JSON."));
  }

  if (!body || typeof body !== "object") {
    return errorResponse(new Error("Quiz grading request is invalid."));
  }

  const payload = body as Record<string, unknown>;

  if (typeof payload.quizId !== "string") {
    return errorResponse(new Error("Quiz ID is required."));
  }

  const authoritative = getAuthoritativeFallbackQuiz(payload.quizId);

  if (!authoritative) {
    return errorResponse(new Error("Quiz is not available."), 404);
  }

  try {
    if (payload.action === "check") {
      if (typeof payload.questionId !== "string" || typeof payload.answer !== "number") {
        throw new Error("Question ID and numeric answer are required.");
      }

      const question = authoritative.questions.find((item) => item.stableId === payload.questionId);

      if (!question) {
        throw new Error("Quiz question does not exist.");
      }

      const answer = validateQuizAnswer(question, payload.answer);

      if (answer < 0) {
        throw new Error("A question check requires a selected answer.");
      }

      return jsonResponse({
        questionId: question.stableId,
        answerIndex: question.answerIndex,
        explanation: question.explanation,
        correct: answer === question.answerIndex,
      });
    }

    if (payload.action === "submit") {
      if (typeof payload.submissionId !== "string" || !Array.isArray(payload.answers)) {
        throw new Error("Submission ID and answers are required.");
      }

      if (!payload.answers.every((answer) => typeof answer === "number")) {
        throw new Error("Quiz answers must be numeric indexes.");
      }

      const submissionId = normalizeQuizSubmissionId(payload.submissionId);
      const grading = gradeQuizAnswers(authoritative.questions, payload.answers as number[]);

      return jsonResponse({
        attemptId: `local:${submissionId}`,
        quizId: authoritative.quiz.id,
        quizTitle: authoritative.quiz.title,
        score: grading.score,
        totalQuestions: grading.totalQuestions,
        percentage: grading.percentage,
        completedAt: Date.now(),
        answers: grading.answers,
        questionResults: grading.questionResults,
      });
    }

    throw new Error("Unsupported quiz grading action.");
  } catch (error) {
    return errorResponse(error);
  }
}
