import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import {
  decideMigrationRegistration,
  normalizeMigrationKey,
  normalizeMigrationRegistration,
} from "./lib/migrationGuard";

export const getMigrationRegistration = internalQuery({
  args: { migrationKey: v.string() },
  handler: async (ctx, args) => {
    const migrationKey = normalizeMigrationKey(args.migrationKey);
    return await ctx.db
      .query("migrationLedger")
      .withIndex("by_key", (q) => q.eq("migrationKey", migrationKey))
      .first();
  },
});

export const registerMigrationApplied = internalMutation({
  args: {
    migrationKey: v.string(),
    checksum: v.string(),
    note: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const incoming = normalizeMigrationRegistration(args.migrationKey, args.checksum);
    const existing = await ctx.db
      .query("migrationLedger")
      .withIndex("by_key", (q) => q.eq("migrationKey", incoming.migrationKey))
      .first();
    const decision = decideMigrationRegistration(existing, incoming);

    if (decision === "checksum_mismatch") {
      throw new Error("Migration key was already registered with a different checksum.");
    }

    if (decision === "already_applied") {
      return {
        action: "already_applied" as const,
        migrationId: existing?._id ?? null,
        appliedAt: existing?.appliedAt ?? null,
      };
    }

    const appliedAt = Date.now();
    const migrationId = await ctx.db.insert("migrationLedger", {
      ...incoming,
      note: args.note?.trim() || undefined,
      appliedAt,
    });

    return { action: "registered" as const, migrationId, appliedAt };
  },
});
