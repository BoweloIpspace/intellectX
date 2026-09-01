import { describe, expect, it } from "vitest";
import { MAT111_COURSE_ID } from "./mat111-course";
import {
  getMat111InfographyPages,
  getMat111MobileExamPapersByLesson,
  mat111ExpandedQuizzes,
  mat111MobileExamPapers,
  mat111MobileTopics,
} from "./mat111-mobile-study";
import { getMat111QuizzesByCourse } from "./mat111-quizzes";

const expectedWeeks = [2, 3, 4, 5, 9, 10, 11, 13, 14, 15];

describe("MAT111 mobile study expansion", () => {
  it("keeps the supplied lecture weeks in the intended horizontal swipe order", () => {
    expect(mat111MobileTopics.map((topic) => topic.week)).toEqual(expectedWeeks);
  });

  it("publishes exactly ten infographic pages for every topic", () => {
    expect(mat111MobileTopics).toHaveLength(10);
    for (const topic of mat111MobileTopics) {
      expect(getMat111InfographyPages(topic.lessonId)).toHaveLength(10);
      expect(topic.pages.every((page) => page.title.trim().length > 0 && page.body.trim().length > 0)).toBe(true);
    }
  });

  it("provides seven mobile quiz sets per topic without changing the shared MAT111 catalog", () => {
    const existing = getMat111QuizzesByCourse(MAT111_COURSE_ID);

    for (const topic of mat111MobileTopics) {
      const existingForTopic = existing.filter((quiz) => quiz.lessonId === topic.lessonId);
      const expandedForTopic = mat111ExpandedQuizzes.filter((quiz) => quiz.lessonId === topic.lessonId);

      expect(existingForTopic).toHaveLength(2);
      expect(expandedForTopic).toHaveLength(5);
      expect(existingForTopic.length + expandedForTopic.length).toBe(7);
      expect(expandedForTopic.every((quiz) => quiz.questions.length >= 2)).toBe(true);
    }
  });

  it("provides five lecture-note exam practice sets per topic", () => {
    expect(mat111MobileExamPapers).toHaveLength(50);

    for (const topic of mat111MobileTopics) {
      const papers = getMat111MobileExamPapersByLesson(topic.lessonId);
      expect(papers).toHaveLength(5);
      expect(papers.every((paper) => paper.questions.length === 4)).toBe(true);
      expect(papers.every((paper) => paper.description.includes("not represented as an archived institutional past paper"))).toBe(true);
    }
  });

  it("uses unique ids for mobile-only quizzes and exam practice", () => {
    const quizIds = mat111ExpandedQuizzes.map((quiz) => quiz.id);
    const paperIds = mat111MobileExamPapers.map((paper) => paper.stableId);

    expect(new Set(quizIds).size).toBe(quizIds.length);
    expect(new Set(paperIds).size).toBe(paperIds.length);
  });
});
