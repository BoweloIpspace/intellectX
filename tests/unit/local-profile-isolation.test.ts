import { beforeEach, describe, expect, it } from "vitest";

import { loadAcademicProfile, saveAcademicProfile } from "@/lib/academic-profile";
import { getEmptyCourseSelection, loadCourseSelection, saveCourseSelection } from "@/lib/course-selection";
import { readLessonProgressHistory, writeLessonProgressHistory } from "@/lib/lesson-progress-history";
import { clearLearnerSession, createLearnerSession, getLearnerSession } from "@/lib/learner-session";
import {
  readMobilePastPaperProgress,
  readMobileQuizProgress,
  readMobileStudyActivity,
  writeMobilePastPaperProgress,
  writeMobileQuizProgress,
  writeMobileStudyActivity,
} from "@/lib/mobile-study-state";
import { readQuizAttemptHistory, saveQuizAttemptHistoryItem } from "@/lib/quiz-attempt-history";

function createProfile(name: string, email: string) {
  createLearnerSession({ name, email, role: "student" });
}

function saveCourse(courseId: string) {
  const now = Date.now();
  saveCourseSelection({
    ...getEmptyCourseSelection(),
    selectedCourseIds: [courseId],
    selectedAt: now,
    gracePeriodEndsAt: now + 7 * 24 * 60 * 60 * 1000,
  });
}

beforeEach(() => {
  localStorage.clear();
});

describe("local learner profile isolation", () => {
  it("keeps course, profile, progress, and resumable study state isolated by normalized learner email", () => {
    createProfile("Learner A", "A@Example.com");
    saveCourse("bgcse-biology");
    saveAcademicProfile({
      educationLevel: "Senior",
      curriculumOrInstitution: "Botswana curriculum",
      gradeOrYear: "Form 5",
      subjectsOrModules: ["Biology"],
    });
    saveQuizAttemptHistoryItem({
      quizId: "quiz-a",
      quizTitle: "Quiz A",
      score: 1,
      totalQuestions: 1,
    });
    writeLessonProgressHistory([
      {
        lessonId: "lesson-a",
        status: "completed",
        progress: 100,
        updatedAt: "2026-08-24T08:00:00.000Z",
      },
    ]);
    writeMobilePastPaperProgress({
      paperId: "paper-a",
      courseId: "bgcse-biology",
      title: "2019 Paper 3",
      currentIndex: 2,
      revealedQuestionIds: ["q1"],
      finished: false,
      updatedAt: 100,
    });
    writeMobileQuizProgress({
      quizId: "quiz-in-progress-a",
      currentIndex: 0,
      selectedIndex: 1,
      submitted: false,
      answers: [],
      feedback: null,
      deadlineAt: Date.now() + 60_000,
      submissionId: "submission-a",
      updatedAt: 100,
    });
    writeMobileStudyActivity({
      kind: "past-paper",
      href: "/mobile-past-papers/paper-a",
      title: "2019 Paper 3",
      courseId: "bgcse-biology",
      paperId: "paper-a",
      updatedAt: 100,
    });

    clearLearnerSession();
    expect(getLearnerSession()).toBeNull();
    expect(loadCourseSelection().selectedCourseIds).toEqual([]);
    expect(loadAcademicProfile()).toBeNull();
    expect(readQuizAttemptHistory()).toEqual([]);
    expect(readLessonProgressHistory()).toEqual([]);
    expect(readMobilePastPaperProgress("paper-a")).toBeNull();
    expect(readMobileQuizProgress("quiz-in-progress-a")).toBeNull();
    expect(readMobileStudyActivity()).toBeNull();

    createProfile("Learner B", "b@example.com");
    expect(loadCourseSelection().selectedCourseIds).toEqual([]);
    expect(loadAcademicProfile()).toBeNull();
    expect(readQuizAttemptHistory()).toEqual([]);
    expect(readLessonProgressHistory()).toEqual([]);
    expect(readMobilePastPaperProgress("paper-a")).toBeNull();
    expect(readMobileQuizProgress("quiz-in-progress-a")).toBeNull();
    expect(readMobileStudyActivity()).toBeNull();
    saveCourse("ai-study-systems");
    clearLearnerSession();

    createProfile("Learner A", "a@example.com");
    expect(loadCourseSelection().selectedCourseIds).toEqual(["bgcse-biology"]);
    expect(loadAcademicProfile()?.subjectsOrModules).toEqual(["Biology"]);
    expect(readQuizAttemptHistory().map((attempt) => attempt.quizId)).toEqual(["quiz-a"]);
    expect(readLessonProgressHistory().map((item) => item.lessonId)).toEqual(["lesson-a"]);
    expect(readMobilePastPaperProgress("paper-a")).toMatchObject({ currentIndex: 2 });
    expect(readMobileQuizProgress("quiz-in-progress-a")).toMatchObject({ selectedIndex: 1 });
    expect(readMobileStudyActivity()).toMatchObject({ paperId: "paper-a" });
  });

  it("deleting a local profile removes only that learner's data", () => {
    createProfile("Learner A", "a@example.com");
    saveCourse("bgcse-biology");
    clearLearnerSession();

    createProfile("Learner B", "b@example.com");
    saveCourse("ai-study-systems");
    clearLearnerSession();

    createProfile("Learner A", "a@example.com");
    expect(loadCourseSelection().selectedCourseIds).toEqual(["bgcse-biology"]);
    clearLearnerSession({ deleteLocalData: true });

    createProfile("Learner B", "b@example.com");
    expect(loadCourseSelection().selectedCourseIds).toEqual(["ai-study-systems"]);
    clearLearnerSession();

    createProfile("Learner A", "a@example.com");
    expect(loadCourseSelection().selectedCourseIds).toEqual([]);
  });

  it("does not give orphaned global state to a newly entered learner after a corrupt session", () => {
    localStorage.setItem("intellectx:learner-session", "{bad json");
    localStorage.setItem(
      "intellectx:course-selection",
      JSON.stringify({
        selectedCourseIds: ["private-old-course"],
        selectedAt: Date.now(),
        gracePeriodEndsAt: Date.now() + 1000,
        lockedAt: null,
        locked: false,
      }),
    );
    localStorage.setItem(
      "intellectx:mobile-study-activity",
      JSON.stringify({
        kind: "past-paper",
        href: "/mobile-past-papers/private-paper",
        title: "Private old activity",
        paperId: "private-paper",
        updatedAt: Date.now(),
      }),
    );

    createProfile("New Learner", "new@example.com");

    expect(loadCourseSelection().selectedCourseIds).toEqual([]);
    expect(readMobileStudyActivity()).toBeNull();
  });
});
