import { describe, expect, it } from "vitest";

import { getSeedQuizAnswer } from "../../convex/seedQuizAnswers";
import { MAT111_COURSE_ID, mat111Course } from "@/data/mat111-course";
import { mat111ExamPapers } from "@/data/mat111-exams";
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

const expectedLessonIds = [
  "mat111-week-2",
  "mat111-week-3",
  "mat111-week-4",
  "mat111-week-5",
  "mat111-week-9",
  "mat111-week-10",
  "mat111-week-11",
  "mat111-week-13",
  "mat111-week-14",
  "mat111-week-15",
];

describe("MAT111 supplied lecture-note course", () => {
  it("keeps all supplied lecture weeks inside one MAT111 seed course with two quizzes per topic", () => {
    expect(mat111Course.lessonIds).toEqual(expectedLessonIds);
    expect(mat111Lessons.map((lesson) => lesson.id)).toEqual(expectedLessonIds);
    expect(mat111Lessons).toHaveLength(10);
    expect(mat111Quizzes).toHaveLength(20);
    expect(mat111Quizzes.flatMap((quiz) => quiz.questions)).toHaveLength(80);

    for (const lesson of mat111Lessons) {
      expect(lesson.posterUrl).toMatch(/^\/mat111\/week\d+/);
      expect(lesson.content.length).toBeGreaterThanOrEqual(4);
      expect(mat111Quizzes.filter((quiz) => quiz.lessonId === lesson.id)).toHaveLength(2);
    }
  });

  it("keeps public answers hidden while every MAT111 seed quiz question has server authority", () => {
    for (const quiz of mat111Quizzes) {
      expect(quiz.courseId).toBe(MAT111_COURSE_ID);
      expect(quiz.questions).toHaveLength(4);
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

  it("keeps three structured MAT111 seed practice papers without labelling them official past papers", () => {
    expect(mat111ExamPapers).toHaveLength(3);
    expect(mat111ExamPapers.map((paper) => paper.paperCode)).toEqual(["MAT111-P1", "MAT111-P2", "MAT111-P3"]);
    for (const paper of mat111ExamPapers) {
      expect(paper.courseStableId).toBe(MAT111_COURSE_ID);
      expect(paper.session).toBe("Lecture-note practice");
      expect(paper.questions).toHaveLength(6);
      expect(paper.totalMarks).toBe(60);
      expect(paper.questions.every((question) => !("choices" in question))).toBe(true);
    }
  });

  it("keeps MAT111 seed records available only for explicit import and seeding", () => {
    expect(getCourse(MAT111_COURSE_ID)?.title).toBe("MAT111 Introductory Mathematics I");
    expect(getQuiz("mat111-week15-de-moivre-roots")?.courseId).toBe(MAT111_COURSE_ID);
  });

  it("does not inject bundled MAT111 into the production learner catalog", () => {
    const healthyCatalog = buildLearnerCatalog({
      convexCourses: [liveCourse],
      convexLessons: [],
      convexQuizzes: [],
    });
    expect(healthyCatalog.courseById.get("live-course")?.title).toBe("Live Course");
    expect(healthyCatalog.courseById.has(MAT111_COURSE_ID)).toBe(false);
    expect(healthyCatalog.lessons.some((lesson) => lesson.courseId === MAT111_COURSE_ID)).toBe(false);
    expect(healthyCatalog.quizzes.some((quiz) => quiz.courseId === MAT111_COURSE_ID)).toBe(false);

    const failClosedCatalog = buildLearnerCatalog({
      convexCourses: [{ ...liveCourse, publicationStatus: "unpublished" as const }],
      convexLessons: [],
      convexQuizzes: [],
    });
    expect(failClosedCatalog.courses).toEqual([]);
    expect(failClosedCatalog.courseById.has(MAT111_COURSE_ID)).toBe(false);
  });
});
