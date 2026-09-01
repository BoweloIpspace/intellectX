import { mat111FeynmanSeedQuizAnswers } from "../../convex/mat111FeynmanSeedQuizAnswers";
import { mat111Course } from "../../src/data/mat111-course";
import { mat111FeynmanPagesByLesson } from "../../src/data/mat111-feynman-pages";
import { mat111FeynmanQuizzes } from "../../src/data/mat111-feynman-quizzes";
import { mat111Lessons } from "../../src/data/mat111-lessons";
import { mat111Quizzes } from "../../src/data/mat111-quizzes";
import { describe, expect, it } from "vitest";

describe("MAT111 Feynman learning flow", () => {
  it("gives every MAT111 topic exactly ten detailed infographic pages", () => {
    expect(mat111Lessons).toHaveLength(10);

    for (const lesson of mat111Lessons) {
      const pages = mat111FeynmanPagesByLesson[lesson.id];
      expect(pages, lesson.id).toBeDefined();
      expect(pages, lesson.id).toHaveLength(10);

      for (const page of pages) {
        expect(page.title.trim().length).toBeGreaterThan(3);
        expect(page.simpleExplanation.trim().length).toBeGreaterThan(40);
        expect(page.workedExample.trim().length).toBeGreaterThan(20);
        expect(page.teachBack.trim().length).toBeGreaterThan(20);
      }
    }
  });

  it("keeps exactly five quizzes for every MAT111 topic/week", () => {
    const allQuizzes = [...mat111Quizzes, ...mat111FeynmanQuizzes];

    for (const lesson of mat111Lessons) {
      const topicQuizzes = allQuizzes.filter((quiz) => quiz.lessonId === lesson.id);
      expect(topicQuizzes, lesson.id).toHaveLength(5);
    }

    expect(allQuizzes).toHaveLength(50);
    expect(mat111Course.quizIds).toHaveLength(50);
    expect(new Set(mat111Course.quizIds).size).toBe(50);
  });

  it("adds three four-question Feynman-aligned quiz sets to every topic", () => {
    expect(mat111FeynmanQuizzes).toHaveLength(30);

    for (const lesson of mat111Lessons) {
      const added = mat111FeynmanQuizzes.filter((quiz) => quiz.lessonId === lesson.id);
      expect(added).toHaveLength(3);
      expect(added.map((quiz) => quiz.difficulty).sort()).toEqual(["Applied", "Challenge", "Foundational"]);

      for (const quiz of added) {
        expect(quiz.questions).toHaveLength(4);
        expect(quiz.questions.every((question) => question.answerIndex === -1)).toBe(true);
        expect(quiz.questions.every((question) => question.explanation === "")).toBe(true);
        expect(quiz.questions[3]?.choices).toEqual([]);
      }
    }
  });

  it("keeps answer keys and explanations server-side with full new-question coverage", () => {
    const expectedQuestionKeys = new Set(
      mat111FeynmanQuizzes.flatMap((quiz) => quiz.questions.map((question) => `${quiz.id}:${question.id}`)),
    );
    const answerKeys = new Set(
      mat111FeynmanSeedQuizAnswers.map((answer) => `${answer.quizId}:${answer.questionId}`),
    );

    expect(expectedQuestionKeys.size).toBe(120);
    expect(mat111FeynmanSeedQuizAnswers).toHaveLength(120);
    expect(answerKeys).toEqual(expectedQuestionKeys);
    expect(mat111FeynmanSeedQuizAnswers.every((answer) => answer.explanation.trim().length > 20)).toBe(true);
  });
});
