import { describe, expect, it } from "vitest";
import {
  evaluateMobileLocalProductionEnv,
  evaluateProductionEnv,
} from "../../scripts/check-production-env.mjs";

describe("production environment checks", () => {
  it("requires the complete cloud auth/backend set in full production mode", () => {
    const report = evaluateProductionEnv({ NEXT_PUBLIC_PAYMENTS_ENABLED: "false" });

    expect(report.errors).toContain("missing NEXT_PUBLIC_CONVEX_URL");
    expect(report.errors).toContain("missing NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY");
    expect(report.errors).toContain("missing CLERK_SECRET_KEY");
    expect(report.errors).toContain("missing CLERK_JWT_ISSUER_DOMAIN");
  });

  it("allows an intentional local-only mobile production configuration", () => {
    const report = evaluateMobileLocalProductionEnv({ NEXT_PUBLIC_PAYMENTS_ENABLED: "false" });

    expect(report.mode).toBe("mobile-local");
    expect(report.errors).toEqual([]);
  });

  it("rejects partially configured cloud auth/backend values", () => {
    const report = evaluateMobileLocalProductionEnv({
      NEXT_PUBLIC_CONVEX_URL: "https://example.convex.cloud",
      NEXT_PUBLIC_PAYMENTS_ENABLED: "false",
    });

    expect(report.errors.some((error) => error.includes("fully configured or fully absent"))).toBe(true);
  });

  it("accepts the complete cloud auth/backend set", () => {
    const report = evaluateMobileLocalProductionEnv({
      NEXT_PUBLIC_CONVEX_URL: "https://example.convex.cloud",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_example",
      CLERK_SECRET_KEY: "sk_test_example",
      CLERK_JWT_ISSUER_DOMAIN: "https://clerk.example.com",
      NEXT_PUBLIC_PAYMENTS_ENABLED: "false",
    });

    expect(report.mode).toBe("full-cloud");
    expect(report.errors).toEqual([]);
  });

  it("rejects insecure production fallback and mobile payments flags", () => {
    const report = evaluateMobileLocalProductionEnv({
      ALLOW_LOCAL_USERKEY_FALLBACK: "true",
      NEXT_PUBLIC_PAYMENTS_ENABLED: "true",
    });

    expect(report.errors).toContain("ALLOW_LOCAL_USERKEY_FALLBACK must be unset or false for production");
    expect(report.errors).toContain("NEXT_PUBLIC_PAYMENTS_ENABLED must remain false for the free mobile product");
  });

  it("rejects a non-https Clerk issuer when cloud auth is configured", () => {
    const report = evaluateMobileLocalProductionEnv({
      NEXT_PUBLIC_CONVEX_URL: "https://example.convex.cloud",
      NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY: "pk_test_example",
      CLERK_SECRET_KEY: "sk_test_example",
      CLERK_JWT_ISSUER_DOMAIN: "http://clerk.example.com",
      NEXT_PUBLIC_PAYMENTS_ENABLED: "false",
    });

    expect(report.errors).toContain("CLERK_JWT_ISSUER_DOMAIN must be an https URL");
  });
});
