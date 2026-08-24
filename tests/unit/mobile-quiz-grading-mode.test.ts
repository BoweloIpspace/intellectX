import { describe, expect, it } from "vitest";

import { getQuizGradingMode, usesAuthenticatedConvexQuizGrading } from "@/lib/mobile-quiz-grading-mode";

describe("mobile quiz grading mode", () => {
  it("uses the server grader for device-local learner modes even when Convex content is configured", () => {
    expect(getQuizGradingMode("local-fallback")).toBe("server-fallback");
    expect(getQuizGradingMode("convex-only")).toBe("server-fallback");
    expect(getQuizGradingMode("clerk-only")).toBe("server-fallback");
  });

  it("uses protected Convex grading only when Clerk and Convex are both configured", () => {
    expect(getQuizGradingMode("clerk-convex-ready")).toBe("convex-authenticated");
    expect(usesAuthenticatedConvexQuizGrading("clerk-convex-ready")).toBe(true);
    expect(usesAuthenticatedConvexQuizGrading("convex-only")).toBe(false);
  });
});
