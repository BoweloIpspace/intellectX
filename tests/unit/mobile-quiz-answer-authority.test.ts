import { describe, expect, it } from "vitest";

import { quizzes } from "@/data/quizzes";
import { getSeedQuizAnswer } from "../../convex/seedQuizAnswers";

describe("mobile quiz answer authority", () => {
  it("has a server-side answer and explanation for every bundled learner-visible quiz question", () => {
    const seenQuizIds = new Set<string>();

    for (const quiz of quizzes) {
      expect(seenQuizIds.has(quiz.id), `duplicate learner-visible quiz id ${quiz.id}`).toBe(false);
      seenQuizIds.add(quiz.id);

      for (const question of quiz.questions) {
        const authority = getSeedQuizAnswer(quiz.id, question.id);
        expect(authority.answerIndex).toBeGreaterThanOrEqual(0);
        expect(authority.answerIndex).toBeLessThan(question.choices.length);
        expect(authority.explanation.trim().length).toBeGreaterThan(0);
      }
    }

    expect(seenQuizIds).toEqual(
      new Set(["ai-study-systems-check", "critical-thinking-check", "exam-accelerator-check"]),
    );
  });
});
