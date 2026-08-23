import { mutation } from "./_generated/server";
import { getAuthenticatedLearnerUserKey } from "./lib/identity";

export const deleteMyLearnerData = mutation({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Authenticated learner identity is required for account data deletion.");
    }

    const userKey = getAuthenticatedLearnerUserKey(identity);
    const [
      academicProfiles,
      courseSelections,
      lessonProgress,
      quizAttempts,
      studyStats,
      notes,
      entitlements,
      billingEvents,
    ] = await Promise.all([
      ctx.db.query("academicProfiles").withIndex("by_user", (q) => q.eq("userKey", userKey)).collect(),
      ctx.db.query("courseSelections").withIndex("by_user", (q) => q.eq("userKey", userKey)).collect(),
      ctx.db.query("lessonProgress").withIndex("by_user", (q) => q.eq("userKey", userKey)).collect(),
      ctx.db.query("quizAttempts").withIndex("by_user", (q) => q.eq("userKey", userKey)).collect(),
      ctx.db.query("studyStats").withIndex("by_user", (q) => q.eq("userKey", userKey)).collect(),
      ctx.db.query("notes").withIndex("by_user", (q) => q.eq("userKey", userKey)).collect(),
      ctx.db.query("entitlements").withIndex("by_user", (q) => q.eq("userKey", userKey)).collect(),
      ctx.db.query("billingWebhookEvents").withIndex("by_user", (q) => q.eq("userKey", userKey)).collect(),
    ]);

    const seenSubscriptionKeys = new Set<string>();
    for (const entitlement of entitlements) {
      const provider = entitlement.provider?.trim();
      const providerSubscriptionId = entitlement.providerSubscriptionId?.trim();
      if (!provider || !providerSubscriptionId) continue;

      const tombstoneKey = `${provider}\u0000${providerSubscriptionId}`;
      if (seenSubscriptionKeys.has(tombstoneKey)) continue;
      seenSubscriptionKeys.add(tombstoneKey);

      const existingTombstone = await ctx.db
        .query("billingSubscriptionTombstones")
        .withIndex("by_provider_subscription", (q) =>
          q.eq("provider", provider).eq("providerSubscriptionId", providerSubscriptionId),
        )
        .first();

      if (!existingTombstone) {
        await ctx.db.insert("billingSubscriptionTombstones", {
          provider,
          providerSubscriptionId,
          deletedAt: Date.now(),
        });
      }
    }

    for (const document of academicProfiles) await ctx.db.delete(document._id);
    for (const document of courseSelections) await ctx.db.delete(document._id);
    for (const document of lessonProgress) await ctx.db.delete(document._id);
    for (const document of quizAttempts) await ctx.db.delete(document._id);
    for (const document of studyStats) await ctx.db.delete(document._id);
    for (const document of notes) await ctx.db.delete(document._id);
    for (const document of entitlements) await ctx.db.delete(document._id);

    for (const billingEvent of billingEvents) {
      await ctx.db.patch(billingEvent._id, {
        userKey: undefined,
        providerCustomerId: undefined,
      });
    }

    const counts = {
      academicProfiles: academicProfiles.length,
      courseSelections: courseSelections.length,
      lessonProgress: lessonProgress.length,
      quizAttempts: quizAttempts.length,
      studyStats: studyStats.length,
      notes: notes.length,
      entitlements: entitlements.length,
      billingEventsScrubbed: billingEvents.length,
    };

    const deletedAt = Date.now();
    const receiptId = await ctx.db.insert("accountDeletionReceipts", {
      deletedAt,
      counts,
    });

    return {
      receiptId,
      deletedAt,
      counts,
    };
  },
});
