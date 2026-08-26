import { beforeEach, describe, expect, it, vi } from "vitest";

const { convexQueryMock, getQuizMock } = vi.hoisted(() => ({
  convexQueryMock: vi.fn(),
  getQuizMock: vi.fn(),
}));

vi.mock("server-only", () => ({}));
vi.mock("@/data/quizzes", () => ({ getQuiz: getQuizMock }));
vi.mock("@/lib/education-data", () => ({
  convexEnv: {
    url: "https://example.convex.cloud",
    isConfigured: true,
  },
}));
vi.mock("@/lib/convex-api", () => ({
  convexApi: {
    quizzes: {
      checkLocalQuizAnswer: "checkLocalQuizAnswer",
      revealLocalStructuredQuizAnswer: "revealLocalStructuredQuizAnswer",
      submitLocalQuizAttempt: "submitLocalQuizAttempt",
    },
  },
}));
vi.mock("convex/browser", () => ({
  ConvexHttpClient: class {
    constructor(_url: string) {}

    query(...args: unknown[]) {
      return convexQueryMock(...args);
    }
  },
}));
vi.mock("../../convex/seedQuizAnswers", () => ({
  getSeedQuizAnswer: vi.fn(),
}));

describe("quiz grading authority", () => {
  beforeEach(() => {
    convexQueryMock.mockReset();
    getQuizMock.mockReset();
  });

  it("grades through Convex when the learner catalog is Convex-backed, even when a static quiz has the same quiz ID", async () => {
    const expected = {
      questionId: "ai-study-systems-check-ai-study-systems-q1",
      answerIndex: 1,
      explanation: "Server-side feedback",
      correct: true,
    };
    convexQueryMock.mockResolvedValue(expected);
    getQuizMock.mockImplementation(() => {
      throw new Error("Static fallback must not be read when Convex is configured.");
    });

    const { POST } = await import("../../src/app/api/quiz-grading/route");
    const response = await POST(
      new Request("http://localhost/api/quiz-grading", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          action: "check",
          quizId: "ai-study-systems-check",
          questionId: "ai-study-systems-check-ai-study-systems-q1",
          answer: 1,
        }),
      }),
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(expected);
    expect(getQuizMock).not.toHaveBeenCalled();
    expect(convexQueryMock).toHaveBeenCalledTimes(1);
    expect(convexQueryMock).toHaveBeenCalledWith("checkLocalQuizAnswer", {
      quizId: "ai-study-systems-check",
      questionId: "ai-study-systems-check-ai-study-systems-q1",
      answer: 1,
    });
  });
});
