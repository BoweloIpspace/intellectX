import { describe, expect, it } from "vitest";

import {
  decideMigrationRegistration,
  normalizeMigrationRegistration,
} from "../../convex/lib/migrationGuard";

describe("migration ledger guard", () => {
  it("normalizes stable migration identifiers", () => {
    expect(normalizeMigrationRegistration(" 2026-08-add-billing-ledger ", " sha256:abc123 ")).toEqual({
      migrationKey: "2026-08-add-billing-ledger",
      checksum: "sha256:abc123",
    });
  });

  it("rejects unsafe or unstable identifiers", () => {
    expect(() => normalizeMigrationRegistration("", "sha256:abc")).toThrow();
    expect(() => normalizeMigrationRegistration("migration with spaces", "sha256:abc")).toThrow();
  });

  it("allows an unapplied migration and makes identical registration idempotent", () => {
    const incoming = { migrationKey: "2026-08-add-billing-ledger", checksum: "sha256:abc" };
    expect(decideMigrationRegistration(null, incoming)).toBe("apply");
    expect(decideMigrationRegistration(incoming, incoming)).toBe("already_applied");
  });

  it("fails closed if a migration key is reused for different code", () => {
    expect(
      decideMigrationRegistration(
        { migrationKey: "2026-08-add-billing-ledger", checksum: "sha256:old" },
        { migrationKey: "2026-08-add-billing-ledger", checksum: "sha256:new" },
      ),
    ).toBe("checksum_mismatch");
  });
});
