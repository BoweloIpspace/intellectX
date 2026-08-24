import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

describe("mobile quiz sync policy", () => {
  it("does not query protected Convex attempt history for device-local profiles", () => {
    const source = readFileSync(path.resolve(process.cwd(), "src/components/education/quiz-attempt-history-sync.tsx"), "utf8");

    expect(source).toContain("usesAuthenticatedConvexQuizGrading()");
    expect(source).toContain('identity.source !== "authenticated-convex"');
    expect(source).toContain("convexApi.quizzes.getQuizAttempts");
  });
});
