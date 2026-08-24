import { beforeEach, describe, expect, it } from "vitest";

import {
  MOBILE_PAST_PAPER_PROGRESS_KEY,
  MOBILE_QUIZ_PROGRESS_KEY,
  MOBILE_STUDY_ACTIVITY_KEY,
  clearMobilePastPaperProgress,
  clearMobileQuizProgress,
  readMobilePastPaperProgress,
  readMobilePastPaperProgresses,
  readMobileQuizProgress,
  readMobileStudyActivity,
  writeMobilePastPaperProgress,
  writeMobileQuizProgress,
  writeMobileStudyActivity,
} from "@/lib/mobile-study-state";

beforeEach(() => {
  localStorage.clear();
});

describe("mobile study resume state", () => {
  it("stores and validates the latest resumable activity", () => {
    writeMobileStudyActivity({
      kind: "quiz",
      href: "/quiz/example?from=mobile",
      title: "Example quiz",
      courseId: "course-a",
      quizId: "example",
      updatedAt: 10,
    });

    expect(readMobileStudyActivity()).toMatchObject({
      kind: "quiz",
      quizId: "example",
      courseId: "course-a",
    });

    localStorage.setItem(MOBILE_STUDY_ACTIVITY_KEY, JSON.stringify({ kind: "quiz", href: 42 }));
    expect(readMobileStudyActivity()).toBeNull();
    expect(localStorage.getItem(MOBILE_STUDY_ACTIVITY_KEY)).toBeNull();
  });

  it("stores multiple past-paper positions and returns the newest first", () => {
    writeMobilePastPaperProgress({
      paperId: "paper-a",
      courseId: "biology",
      title: "Paper A",
      currentIndex: 1,
      revealedQuestionIds: ["q1"],
      finished: false,
      updatedAt: 100,
    });
    writeMobilePastPaperProgress({
      paperId: "paper-b",
      courseId: "biology",
      title: "Paper B",
      currentIndex: 3,
      revealedQuestionIds: [],
      finished: true,
      updatedAt: 200,
    });

    expect(readMobilePastPaperProgress("paper-a")).toMatchObject({ currentIndex: 1, finished: false });
    expect(readMobilePastPaperProgresses().map((item) => item.paperId)).toEqual(["paper-b", "paper-a"]);

    clearMobilePastPaperProgress("paper-a");
    expect(readMobilePastPaperProgress("paper-a")).toBeNull();
    expect(localStorage.getItem(MOBILE_PAST_PAPER_PROGRESS_KEY)).toContain("paper-b");
  });

  it("persists checked mobile quiz state with a real deadline and clears it after completion", () => {
    writeMobileQuizProgress({
      quizId: "quiz-a",
      currentIndex: 1,
      selectedIndex: 2,
      submitted: true,
      answers: [0],
      feedback: {
        questionId: "q2",
        answerIndex: 2,
        explanation: "Because it is correct.",
        correct: true,
      },
      deadlineAt: Date.now() + 60_000,
      submissionId: "submission-a",
      updatedAt: Date.now(),
    });

    expect(readMobileQuizProgress("quiz-a")).toMatchObject({
      currentIndex: 1,
      selectedIndex: 2,
      submitted: true,
      submissionId: "submission-a",
    });
    expect(readMobileQuizProgress("different-quiz")).toBeNull();

    clearMobileQuizProgress();
    expect(localStorage.getItem(MOBILE_QUIZ_PROGRESS_KEY)).toBeNull();
  });
});
