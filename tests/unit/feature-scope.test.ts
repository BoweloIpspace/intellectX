import { describe, expect, it } from "vitest";

import { isFeatureAllowedOnMobile, isRouteWebOnly } from "@/lib/feature-scope";

describe("native mobile feature scope", () => {
  it("keeps the free native mobile surface quiz-only", () => {
    expect(isFeatureAllowedOnMobile("quizzes")).toBe(true);
    expect(isFeatureAllowedOnMobile("flashcards")).toBe(false);
    expect(isFeatureAllowedOnMobile("notes")).toBe(false);
  });

  it("allows native quiz home, quizzes, progress, profile, auth, onboarding, and legal routes", () => {
    for (const pathname of [
      "/mobile-study",
      "/mobile-quizzes",
      "/mobile-progress",
      "/mobile-profile",
      "/quiz/ai-study-systems-check",
      "/login",
      "/signup",
      "/forgot-password",
      "/auth/continue",
      "/onboarding",
      "/privacy-policy",
      "/terms-and-conditions",
      "/refund-policy",
    ]) {
      expect(isRouteWebOnly(pathname)).toBe(false);
    }
  });

  it("keeps flashcards and full web learner surfaces outside native scope", () => {
    for (const pathname of [
      "/",
      "/courses",
      "/dashboard",
      "/progress",
      "/quizzes",
      "/flashcards",
      "/mobile-flashcards",
      "/mobile-notes",
    ]) {
      expect(isRouteWebOnly(pathname)).toBe(true);
    }
  });

  it("does not allow lookalike paths that only share a string prefix", () => {
    expect(isRouteWebOnly("/mobile-quizzesevil")).toBe(true);
    expect(isRouteWebOnly("/mobile-profile-extra")).toBe(true);
    expect(isRouteWebOnly("/loginsomething")).toBe(true);
    expect(isRouteWebOnly("/authentic-looking")).toBe(true);
  });
});
