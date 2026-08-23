import { expect, test } from "@playwright/test";

test("production-safe quiz grading fallback answers and completes without Convex", async ({ request }) => {
  const checkResponse = await request.post("/api/quiz-grading", {
    data: {
      action: "check",
      quizId: "ai-study-systems-check",
      questionId: "q1",
      answer: 1,
    },
  });

  expect(checkResponse.ok()).toBeTruthy();
  expect(checkResponse.headers()["cache-control"]).toContain("no-store");
  await expect(checkResponse.json()).resolves.toMatchObject({
    questionId: "q1",
    answerIndex: 1,
    correct: true,
  });

  const submitResponse = await request.post("/api/quiz-grading", {
    data: {
      action: "submit",
      quizId: "ai-study-systems-check",
      submissionId: "production-e2e-attempt",
      answers: [1, 0, 1],
    },
  });

  expect(submitResponse.ok()).toBeTruthy();
  await expect(submitResponse.json()).resolves.toMatchObject({
    quizId: "ai-study-systems-check",
    totalQuestions: 3,
    score: 3,
    percentage: 100,
  });
});

test("production responses include the hardened browser security policy", async ({ request }) => {
  const response = await request.get("/mobile-study");
  const headers = response.headers();

  expect(headers["content-security-policy"]).toContain("default-src 'self'");
  expect(headers["content-security-policy"]).toContain("frame-ancestors 'none'");
  expect(headers["content-security-policy"]).toContain("object-src 'none'");
  expect(headers["x-content-type-options"]).toBe("nosniff");
  expect(headers["x-frame-options"]).toBe("DENY");
});
