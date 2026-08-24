import { beforeEach, describe, expect, it } from "vitest";

import { loadAcademicProfile, saveAcademicProfile } from "@/lib/academic-profile";
import { getEmptyCourseSelection, loadCourseSelection, saveCourseSelection } from "@/lib/course-selection";
import { readLessonProgressHistory, writeLessonProgressHistory } from "@/lib/lesson-progress-history";
import { clearLearnerSession, createLearnerSession, getLearnerSession } from "@/lib/learner-session";
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
  it("keeps course, profile, quiz, and lesson data isolated by normalized learner email", () => {
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

    clearLearnerSession();
    expect(getLearnerSession()).toBeNull();
    expect(loadCourseSelection().selectedCourseIds).toEqual([]);
    expect(loadAcademicProfile()).toBeNull();
    expect(readQuizAttemptHistory()).toEqual([]);
    expect(readLessonProgressHistory()).toEqual([]);

    createProfile("Learner B", "b@example.com");
    expect(loadCourseSelection().selectedCourseIds).toEqual([]);
    expect(loadAcademicProfile()).toBeNull();
    expect(readQuizAttemptHistory()).toEqual([]);
    expect(readLessonProgressHistory()).toEqual([]);
    saveCourse("ai-study-systems");
    clearLearnerSession();

    createProfile("Learner A", "a@example.com");
    expect(loadCourseSelection().selectedCourseIds).toEqual(["bgcse-biology"]);
    expect(loadAcademicProfile()?.subjectsOrModules).toEqual(["Biology"]);
    expect(readQuizAttemptHistory().map((attempt) => attempt.quizId)).toEqual(["quiz-a"]);
    expect(readLessonProgressHistory().map((item) => item.lessonId)).toEqual(["lesson-a"]);
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

    createProfile("New Learner", "new@example.com");

    expect(loadCourseSelection().selectedCourseIds).toEqual([]);
  });
});
