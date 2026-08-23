import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("account deletion backend contract", () => {
  const accountLifecycle = readFileSync("convex/accountLifecycle.ts", "utf8");
  const entitlements = readFileSync("convex/entitlements.ts", "utf8");
  const schema = readFileSync("convex/schema.ts", "utf8");

  it("derives deletion ownership from authenticated Convex identity", () => {
    expect(accountLifecycle).toContain("ctx.auth.getUserIdentity()");
    expect(accountLifecycle).toContain("getAuthenticatedLearnerUserKey(identity)");
    expect(accountLifecycle).toContain("args: {}");
  });

  it("deletes learner-owned records and scrubs retained billing identity", () => {
    for (const table of [
      "academicProfiles",
      "courseSelections",
      "lessonProgress",
      "quizAttempts",
      "studyStats",
      "notes",
      "entitlements",
    ]) {
      expect(accountLifecycle).toContain(`query(\"${table}\")`);
    }

    expect(accountLifecycle).toContain("userKey: undefined");
    expect(accountLifecycle).toContain("providerCustomerId: undefined");
  });

  it("creates subscription tombstones and ignores all future events for deleted subscriptions", () => {
    expect(schema).toContain("billingSubscriptionTombstones: defineTable");
    expect(schema).toContain('v.literal("ignored_deleted")');
    expect(accountLifecycle).toContain('query("billingSubscriptionTombstones")');
    expect(entitlements).toContain('processingStatus: "ignored_deleted"');
    expect(entitlements).toContain('action: "ignored_deleted" as const');
  });
});
