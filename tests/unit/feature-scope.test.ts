import { describe, expect, it } from "vitest";

import { isCommerceEnabledOnSurface, isFeatureAllowedOnMobile, isRouteWebOnly } from "@/lib/feature-scope";

describe("native mobile feature scope", () => {
  it("keeps the free native mobile surface quiz-only", () => {
    expect(isFeatureAllowedOnMobile("quizzes")).toBe(true);
    expect(isFeatureAllowedOnMobile("flashcards")).toBe(false);
    expect(isFeatureAllowedOnMobile("notes")).toBe(false);
  });

  it("keeps commerce disabled on native mobile without changing the web commerce contract", () => {
    expect(isCommerceEnabledOnSurface("mobile")).toBe(false);
    expect(isCommerceEnabledOnSurface("web")).toBe(true);
  });

  it("allows native quiz home, quizzes, past papers, progress, profile, auth, onboarding, and legal routes", () => {
    for (const pathname of [
      "/mobile-study",
      "/mobile-quizzes",
      "/mobile-past-papers",
      "/mobile-past-papers/bgcse-biology-2019-paper-3",
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

  it("keeps staff, commerce, flashcards, and full web learner surfaces outside native scope", () => {
    for (const pathname of [
      "/",
      "/courses",
      "/dashboard",
      "/progress",
      "/quizzes",
      "/flashcards",
      "/past-papers/bgcse-biology-2019-paper-3",
      "/mobile-flashcards",
      "/mobile-notes",
      "/admin",
      "/admin/users",
      "/instructor",
      "/checkout",
      "/pricing",
      "/subscription",
      "/billing",
    ]) {
      expect(isRouteWebOnly(pathname)).toBe(true);
    }
  });

  it("does not allow lookalike paths that only share a string prefix", () => {
    expect(isRouteWebOnly("/mobile-quizzesevil")).toBe(true);
    expect(isRouteWebOnly("/mobile-past-papersevil")).toBe(true);
    expect(isRouteWebOnly("/mobile-profile-extra")).toBe(true);
    expect(isRouteWebOnly("/loginsomething")).toBe(true);
    expect(isRouteWebOnly("/authentic-looking")).toBe(true);
  });
});
