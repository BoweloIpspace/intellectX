import { describe, expect, it } from "vitest";
import { summarizeMobilePractice } from "@/lib/mobile-practice-summary";

const quizAttempts = [
  {
    quizId: "quiz-1",
    quizTitle: "Quiz One",
    score: 2,
    totalQuestions: 4,
    percentage: 50,
    completedAt: "2026-08-24T10:00:00.000Z",
  },
  {
    quizId: "quiz-2",
    quizTitle: "Quiz Two",
    score: 4,
    totalQuestions: 4,
    percentage: 100,
    completedAt: "2026-08-24T11:00:00.000Z",
  },
];

const pastPapers = [
  {
    paperId: "paper-1",
    courseId: "biology",
    title: "2019 Paper 3",
    currentIndex: 6,
    revealedQuestionIds: ["q1", "q2", "q2"],
    finished: true,
    updatedAt: 1,
  },
  {
    paperId: "paper-2",
    courseId: "biology",
    title: "2020 Paper 3",
    currentIndex: 2,
    revealedQuestionIds: ["q1"],
    finished: false,
    updatedAt: 2,
  },
];

describe("mobile practice summary", () => {
  it("combines completed quiz and past-paper practice without counting unfinished papers as completed", () => {
    const summary = summarizeMobilePractice(quizAttempts, pastPapers);

    expect(summary.quizAttemptCount).toBe(2);
    expect(summary.quizAveragePercentage).toBe(75);
    expect(summary.pastPaperCount).toBe(2);
    expect(summary.completedPastPaperCount).toBe(1);
    expect(summary.inProgressPastPaperCount).toBe(1);
    expect(summary.revealedPastPaperAnswerCount).toBe(3);
    expect(summary.totalPracticeCount).toBe(3);
  });

  it("returns honest zero values before the learner has any practice", () => {
    expect(summarizeMobilePractice([], [])).toEqual({
      quizAttemptCount: 0,
      quizAveragePercentage: 0,
      pastPaperCount: 0,
      completedPastPaperCount: 0,
      inProgressPastPaperCount: 0,
      revealedPastPaperAnswerCount: 0,
      totalPracticeCount: 0,
    });
  });
});
