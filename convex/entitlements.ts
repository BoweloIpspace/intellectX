import { internalMutationGeneric, queryGeneric } from "convex/server";
import { v } from "convex/values";
import {
  getEntitlementStatusForBillingEvent,
  prepareVerifiedEntitlementWrite,
} from "./lib/billingLifecycle";
import { getEntitlementAccessDecision } from "./lib/entitlements";
import { resolveLearnerUserKey } from "./lib/identity";

const billingEventTypeValidator = v.union(
  v.literal("checkout_completed"),
  v.literal("subscription_created"),
  v.literal("subscription_renewed"),
  v.literal("subscription_cancelled"),
  v.literal("subscription_expired"),
  v.literal("payment_failed"),
  v.literal("payment_refunded"),
);

function normalizeOptional(value: string | undefined) {
  const normalized = value?.trim();
  return normalized || undefined;
}

export const getPaidAccessDecision = queryGeneric({
  args: {
    userKey: v.string(),
    productKey: v.string(),
  },
  handler: async (ctx, args) => {
    const { userKey } = await resolveLearnerUserKey(ctx, args);
    const entitlements = await ctx.db
      .query("entitlements")
      .withIndex("by_user", (q) => q.eq("userKey", userKey))
      .filter((q) => q.eq(q.field("productKey"), args.productKey))
      .collect();
    const entitlement = entitlements.sort((left, right) => right.updatedAt - left.updatedAt)[0] ?? null;

    return getEntitlementAccessDecision({
      accessLevel: "paid",
      entitlement: entitlement
        ? {
            status: entitlement.status,
            currentPeriodEndsAt: entitlement.currentPeriodEndsAt,
          }
        : null,
    });
  },
});

export const applyVerifiedBillingEntitlementEvent = internalMutationGeneric({
  args: {
    verified: v.literal(true),
    billingEventType: billingEventTypeValidator,
    userKey: v.string(),
    productKey: v.string(),
    provider: v.string(),
    providerCustomerId: v.string(),
    providerSubscriptionId: v.string(),
    providerEventId: v.optional(v.string()),
    currentPeriodEndsAt: v.optional(v.number()),
    occurredAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const entitlementWrite = prepareVerifiedEntitlementWrite(args);

    if (!getEntitlementStatusForBillingEvent(args.billingEventType)) {
      throw new Error("Unknown billing lifecycle event type cannot update entitlements.");
    }

    const existingEntitlement = await ctx.db
      .query("entitlements")
      .withIndex("by_user_product_provider_subscription", (q) =>
        q.eq("userKey", entitlementWrite.userKey),
      )
      .filter((q) => q.eq(q.field("productKey"), entitlementWrite.productKey))
      .filter((q) => q.eq(q.field("provider"), entitlementWrite.provider))
      .filter((q) => q.eq(q.field("providerSubscriptionId"), entitlementWrite.providerSubscriptionId))
      .first();

    const patch = {
      productKey: entitlementWrite.productKey,
      status: entitlementWrite.status,
      provider: entitlementWrite.provider,
      providerCustomerId: entitlementWrite.providerCustomerId,
      providerSubscriptionId: entitlementWrite.providerSubscriptionId,
      providerEventId: entitlementWrite.providerEventId,
      lastBillingEventType: entitlementWrite.lastBillingEventType,
      currentPeriodEndsAt: entitlementWrite.currentPeriodEndsAt,
      updatedAt: entitlementWrite.updatedAt,
    };

    if (existingEntitlement) {
      await ctx.db.patch(existingEntitlement._id, patch);

      return {
        action: "updated",
        entitlementId: existingEntitlement._id,
        status: entitlementWrite.status,
      };
    }

    const entitlementId = await ctx.db.insert("entitlements", {
      userKey: entitlementWrite.userKey,
      ...patch,
    });

    return {
      action: "inserted",
      entitlementId,
      status: entitlementWrite.status,
    };
  },
});

export const applyVerifiedBillingWebhookEvent = internalMutationGeneric({
  args: {
    verified: v.literal(true),
    billingEventType: billingEventTypeValidator,
    userKey: v.optional(v.string()),
    productKey: v.optional(v.string()),
    provider: v.string(),
    providerCustomerId: v.string(),
    providerSubscriptionId: v.string(),
    providerEventId: v.string(),
    currentPeriodEndsAt: v.optional(v.number()),
    occurredAt: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const provider = args.provider.trim();
    const providerEventId = args.providerEventId.trim();
    const providerSubscriptionId = args.providerSubscriptionId.trim();

    if (!provider || !providerEventId || !providerSubscriptionId) {
      throw new Error("Verified billing webhook provider metadata is incomplete.");
    }

    const receipt = await ctx.db
      .query("billingWebhookEvents")
      .withIndex("by_provider_event", (q) => q.eq("provider", provider))
      .filter((q) => q.eq(q.field("providerEventId"), providerEventId))
      .first();

    if (receipt) {
      return {
        action: "duplicate" as const,
        entitlementId: receipt.entitlementId,
        status: null,
      };
    }

    const existingEntitlement = await ctx.db
      .query("entitlements")
      .withIndex("by_provider_subscription", (q) => q.eq("provider", provider))
      .filter((q) => q.eq(q.field("providerSubscriptionId"), providerSubscriptionId))
      .first();

    const suppliedUserKey = normalizeOptional(args.userKey);
    const suppliedProductKey = normalizeOptional(args.productKey);

    if (existingEntitlement && suppliedUserKey && existingEntitlement.userKey !== suppliedUserKey) {
      throw new Error("Billing webhook user metadata does not match the existing subscription owner.");
    }

    if (existingEntitlement && suppliedProductKey && existingEntitlement.productKey !== suppliedProductKey) {
      throw new Error("Billing webhook product metadata does not match the existing subscription product.");
    }

    const userKey = suppliedUserKey ?? existingEntitlement?.userKey;
    const productKey = suppliedProductKey ?? existingEntitlement?.productKey;

    if (!userKey || !productKey) {
      throw new Error("Billing webhook cannot resolve a trusted user and product for this subscription.");
    }

    const entitlementWrite = prepareVerifiedEntitlementWrite({
      ...args,
      provider,
      providerEventId,
      providerSubscriptionId,
      userKey,
      productKey,
    });

    if (existingEntitlement && entitlementWrite.updatedAt < existingEntitlement.updatedAt) {
      await ctx.db.insert("billingWebhookEvents", {
        provider,
        providerEventId,
        billingEventType: entitlementWrite.lastBillingEventType,
        providerCustomerId: entitlementWrite.providerCustomerId,
        providerSubscriptionId,
        userKey,
        productKey,
        occurredAt: args.occurredAt,
        processedAt: Date.now(),
        entitlementId: existingEntitlement._id,
      });

      return {
        action: "stale_ignored" as const,
        entitlementId: existingEntitlement._id,
        status: existingEntitlement.status,
      };
    }

    const patch = {
      productKey: entitlementWrite.productKey,
      status: entitlementWrite.status,
      provider: entitlementWrite.provider,
      providerCustomerId: entitlementWrite.providerCustomerId,
      providerSubscriptionId: entitlementWrite.providerSubscriptionId,
      providerEventId: entitlementWrite.providerEventId,
      lastBillingEventType: entitlementWrite.lastBillingEventType,
      currentPeriodEndsAt: entitlementWrite.currentPeriodEndsAt,
      updatedAt: entitlementWrite.updatedAt,
    };

    let entitlementId;
    let action: "inserted" | "updated";

    if (existingEntitlement) {
      await ctx.db.patch(existingEntitlement._id, patch);
      entitlementId = existingEntitlement._id;
      action = "updated";
    } else {
      entitlementId = await ctx.db.insert("entitlements", {
        userKey: entitlementWrite.userKey,
        ...patch,
      });
      action = "inserted";
    }

    await ctx.db.insert("billingWebhookEvents", {
      provider,
      providerEventId,
      billingEventType: entitlementWrite.lastBillingEventType,
      providerCustomerId: entitlementWrite.providerCustomerId,
      providerSubscriptionId,
      userKey: entitlementWrite.userKey,
      productKey: entitlementWrite.productKey,
      occurredAt: args.occurredAt,
      processedAt: Date.now(),
      entitlementId,
    });

    return {
      action,
      entitlementId,
      status: entitlementWrite.status,
    };
  },
});
