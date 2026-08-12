import { describe, expect, it } from "vitest";

import {
  isServerRouteGuardEnabled,
  resolveRouteGuardDecision,
} from "@/lib/route-guard-policy";

describe("server route guard policy", () => {
  describe("isServerRouteGuardEnabled", () => {
    it("is disabled when Clerk server or publishable keys are missing", () => {
      expect(isServerRouteGuardEnabled({})).toBe(false);
      expect(isServerRouteGuardEnabled({ CLERK_SECRET_KEY: "sk_test_1" })).toBe(false);
      expect(
        isServerRouteGuardEnabled({ NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_1" }),
      ).toBe(false);
    });

    it("is enabled only when both Clerk keys are present", () => {
      expect(
        isServerRouteGuardEnabled({
          CLERK_SECRET_KEY: "sk_test_1",
          NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_1",
        }),
      ).toBe(true);
    });
  });

  describe("resolveRouteGuardDecision", () => {
    it("allows public and non-guarded paths regardless of auth state", () => {
      expect(resolveRouteGuardDecision({ pathname: "/", authenticated: false })).toBe("allow");
      expect(resolveRouteGuardDecision({ pathname: "/pricing", authenticated: false })).toBe(
        "allow",
      );
      expect(resolveRouteGuardDecision({ pathname: "/login", authenticated: false })).toBe(
        "allow",
      );
      expect(resolveRouteGuardDecision({ pathname: "/checkout", authenticated: false })).toBe(
        "allow",
      );
      expect(
        resolveRouteGuardDecision({ pathname: "/checkout_redirect/success", authenticated: false }),
      ).toBe("allow");
      expect(
        resolveRouteGuardDecision({ pathname: "/mobile-quizzes", authenticated: false }),
      ).toBe("allow");
      expect(
        resolveRouteGuardDecision({ pathname: "/mobile-flashcards", authenticated: false }),
      ).toBe("allow");
    });

    it("redirects signed-out users to login on learner app paths", () => {
      const learnerPaths = [
        "/onboarding",
        "/dashboard",
        "/profile",
        "/search",
        "/courses",
        "/courses/ai-study-systems",
        "/flashcards",
        "/quizzes",
        "/progress",
        "/learn/prompting-for-learning",
        "/quiz/ai-study-systems-check",
      ];

      for (const pathname of learnerPaths) {
        expect(
          resolveRouteGuardDecision({ pathname, authenticated: false }),
          `${pathname} should redirect signed-out users to login`,
        ).toBe("redirect-login");
      }
    });

    it("redirects signed-out users to login on staff paths", () => {
      expect(
        resolveRouteGuardDecision({ pathname: "/admin", authenticated: false }),
      ).toBe("redirect-login");
      expect(
        resolveRouteGuardDecision({ pathname: "/admin/course-review", authenticated: false }),
      ).toBe("redirect-login");
      expect(
        resolveRouteGuardDecision({ pathname: "/instructor", authenticated: false }),
      ).toBe("redirect-login");
      expect(
        resolveRouteGuardDecision({ pathname: "/instructor/courses/new", authenticated: false }),
      ).toBe("redirect-login");
    });

    it("allows authenticated users on learner paths regardless of role claims", () => {
      expect(resolveRouteGuardDecision({ pathname: "/courses", authenticated: true })).toBe(
        "allow",
      );
      expect(
        resolveRouteGuardDecision({
          pathname: "/dashboard",
          authenticated: true,
          claims: { metadata: { role: "learner" } },
        }),
      ).toBe("allow");
    });

    it("redirects authenticated users without a trusted staff role away from staff routes", () => {
      expect(
        resolveRouteGuardDecision({ pathname: "/admin", authenticated: true, claims: {} }),
      ).toBe("redirect-courses");
      expect(
        resolveRouteGuardDecision({
          pathname: "/admin",
          authenticated: true,
          claims: { metadata: { role: "learner" } },
        }),
      ).toBe("redirect-courses");
      expect(
        resolveRouteGuardDecision({
          pathname: "/admin",
          authenticated: true,
          claims: { publicMetadata: { role: "instructor" } },
        }),
      ).toBe("redirect-courses");
      expect(
        resolveRouteGuardDecision({
          pathname: "/instructor",
          authenticated: true,
          claims: { metadata: { role: "learner" } },
        }),
      ).toBe("redirect-courses");
    });

    it("allows staff roles on their authorized staff routes using trusted claim paths", () => {
      expect(
        resolveRouteGuardDecision({
          pathname: "/admin/course-review",
          authenticated: true,
          claims: { staff: { role: "admin" } },
        }),
      ).toBe("allow");
      expect(
        resolveRouteGuardDecision({
          pathname: "/admin/instructors",
          authenticated: true,
          claims: { metadata: { role: "admin" } },
        }),
      ).toBe("allow");
      expect(
        resolveRouteGuardDecision({
          pathname: "/instructor/courses/new",
          authenticated: true,
          claims: { metadata: { role: "instructor" } },
        }),
      ).toBe("allow");
      expect(
        resolveRouteGuardDecision({
          pathname: "/instructor",
          authenticated: true,
          claims: { appMetadata: { role: "admin" } },
        }),
      ).toBe("allow");
    });
  });
});
