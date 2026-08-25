import { describe, expect, it } from "vitest";

import { getSeedQuizAnswer } from "../../convex/seedQuizAnswers";
import { MAT111_COURSE_ID, mat111Course } from "@/data/mat111-course";
import { mat111Lessons } from "@/data/mat111-lessons";
import { mat111Quizzes } from "@/data/mat111-quizzes";
import { getCourse } from "@/data/courses";
import { getQuiz } from "@/data/quizzes";
import { buildLearnerCatalog } from "@/lib/learner-catalog-client";

const liveCourse = {
  stableId: "live-course",
  slug: "live-course",
  title: "Live Course",
  description: "Published Convex content.",
  subject: "Test",
  level: "Beginner",
  duration: "1h",
  accent: "from-sky-500/20 via-white to-emerald-400/20",
  reviewStatus: "approved" as const,
  publicationStatus: "published" as const,
};

describe("MAT111 lecture-note test content", () => {
  it("exposes the three requested MAT111 lecture topics with two quizzes each", () => {
    expect(mat111Course.lessonIds).toEqual(["mat111-week-9", "mat111-week-11", "mat111-week-14"]);
    expect(mat111Lessons.map((lesson) => lesson.title)).toEqual([
      "Exponential and Logarithmic Functions",
      "Trigonometric Functions of Any Angle",
      "Complex Numbers",
    ]);

    for (const lesson of mat111Lessons) {
      expect(mat111Quizzes.filter((quiz) => quiz.lessonId === lesson.id)).toHaveLength(2);
    }
  });

  it("keeps public answers hidden while every MAT111 question has server authority", () => {
    for (const quiz of mat111Quizzes) {
      expect(quiz.courseId).toBe(MAT111_COURSE_ID);
      expect(quiz.questions.some((question) => question.choices.length === 0)).toBe(true);

      for (const question of quiz.questions) {
        expect(question.answerIndex).toBe(-1);
        expect(question.explanation).toBe("");

        const authority = getSeedQuizAnswer(quiz.id, question.id);
        if (question.choices.length === 0) {
          expect(authority.answerIndex).toBe(-1);
          expect(authority.explanation.trim().length).toBeGreaterThan(0);
        } else {
          expect(authority.answerIndex).toBeGreaterThanOrEqual(0);
          expect(authority.answerIndex).toBeLessThan(question.choices.length);
        }
      }
    }
  });

  it("resolves MAT111 through server fallbacks for direct quiz routes", () => {
    expect(getCourse(MAT111_COURSE_ID)?.title).toBe("MAT111 Introductory Mathematics I");
    expect(getQuiz("mat111-week14-complex-operations")?.courseId).toBe(MAT111_COURSE_ID);
  });

  it("overlays MAT111 onto a healthy live catalog but stays fail-closed if no live course is learner-visible", () => {
    const healthyCatalog = buildLearnerCatalog({
      convexCourses: [liveCourse],
      convexLessons: [],
      convexQuizzes: [],
    });
    expect(healthyCatalog.courseById.get(MAT111_COURSE_ID)?.title).toBe(mat111Course.title);
    expect(healthyCatalog.lessons.filter((lesson) => lesson.courseId === MAT111_COURSE_ID)).toHaveLength(3);
    expect(healthyCatalog.quizzes.filter((quiz) => quiz.courseId === MAT111_COURSE_ID)).toHaveLength(6);

    const failClosedCatalog = buildLearnerCatalog({
      convexCourses: [{ ...liveCourse, publicationStatus: "unpublished" as const }],
      convexLessons: [],
      convexQuizzes: [],
    });
    expect(failClosedCatalog.courseById.has(MAT111_COURSE_ID)).toBe(false);
  });
});
