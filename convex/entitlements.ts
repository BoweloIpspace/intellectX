import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";
import {
  decideBillingEventWrite,
  prepareVerifiedEntitlementWrite,
} from "./lib/billingLifecycle";
import { getEntitlementAccessDecision } from "./lib/entitlements";
import { resolveLearnerUserKey } from "./lib/identity";

const billingEventTypeValidator = v.union(
  v.literal("checkout_completed"),
  v.literal("subscription_created"),
  v.literal("subscription_renewed"),
  v.literal("subscription_paused"),
  v.literal("subscription_resumed"),
  v.literal("subscription_cancelled"),
  v.literal("subscription_expired"),
  v.literal("payment_failed"),
  v.literal("payment_refunded"),
);

function normalizeOptionalString(value: string | undefined) {
  const normalized = value?.trim();
  return normalized || undefined;
}

export const getPaidAccessDecision = query({
  args: {
    userKey: v.optional(v.string()),
    productKey: v.string(),
  },
  handler: async (ctx, args) => {
    const { userKey } = await resolveLearnerUserKey(ctx, args);
    const entitlements = await ctx.db
      .query("entitlements")
      .withIndex("by_user_product", (q) => q.eq("userKey", userKey).eq("productKey", args.productKey))
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

export const applyVerifiedBillingEntitlementEvent = internalMutation({
  args: {
    verified: v.literal(true),
    billingEventType: billingEventTypeValidator,
    userKey: v.optional(v.string()),
    productKey: v.optional(v.string()),
    provider: v.string(),
    providerCustomerId: v.optional(v.string()),
    providerSubscriptionId: v.string(),
    providerEventId: v.string(),
    providerEventType: v.optional(v.string()),
    providerNotificationId: v.optional(v.string()),
    rawPayloadHash: v.optional(v.string()),
    currentPeriodEndsAt: v.optional(v.number()),
    occurredAt: v.number(),
  },
  handler: async (ctx, args) => {
    const processedAt = Date.now();
    const provider = args.provider.trim();
    const providerEventId = args.providerEventId.trim();
    const providerSubscriptionId = args.providerSubscriptionId.trim();

    if (!provider || !providerEventId || !providerSubscriptionId) {
      throw new Error("Provider, provider event ID, and provider subscription ID are required.");
    }

    const priorEvent = await ctx.db
      .query("billingWebhookEvents")
      .withIndex("by_provider_event", (q) => q.eq("provider", provider).eq("providerEventId", providerEventId))
      .first();

    if (priorEvent) {
      return {
        action: "duplicate" as const,
        entitlementId: priorEvent.entitlementId ?? null,
        status: priorEvent.entitlementStatus ?? null,
      };
    }

    const subscriptionEntitlements = await ctx.db
      .query("entitlements")
      .withIndex("by_provider_subscription", (q) =>
        q.eq("provider", provider).eq("providerSubscriptionId", providerSubscriptionId),
      )
      .collect();

    if (subscriptionEntitlements.length > 1) {
      throw new Error("Billing subscription maps to multiple entitlement records; refusing an ambiguous update.");
    }

    const mappedEntitlement = subscriptionEntitlements[0] ?? null;
    const suppliedUserKey = normalizeOptionalString(args.userKey);
    const suppliedProductKey = normalizeOptionalString(args.productKey);
    const suppliedCustomerId = normalizeOptionalString(args.providerCustomerId);

    if (mappedEntitlement && suppliedUserKey && suppliedUserKey !== mappedEntitlement.userKey) {
      throw new Error("Billing event user identity does not match the existing subscription mapping.");
    }
    if (mappedEntitlement && suppliedProductKey && suppliedProductKey !== mappedEntitlement.productKey) {
      throw new Error("Billing event product identity does not match the existing subscription mapping.");
    }
    if (
      mappedEntitlement?.providerCustomerId &&
      suppliedCustomerId &&
      suppliedCustomerId !== mappedEntitlement.providerCustomerId
    ) {
      throw new Error("Billing event customer identity does not match the existing subscription mapping.");
    }

    const entitlementWrite = prepareVerifiedEntitlementWrite(
      {
        verified: true,
        billingEventType: args.billingEventType,
        userKey: suppliedUserKey ?? mappedEntitlement?.userKey,
        productKey: suppliedProductKey ?? mappedEntitlement?.productKey,
        provider,
        providerCustomerId: suppliedCustomerId ?? mappedEntitlement?.providerCustomerId,
        providerSubscriptionId,
        providerEventId,
        currentPeriodEndsAt: args.currentPeriodEndsAt,
        occurredAt: args.occurredAt,
      },
      processedAt,
    );

    const existingEntitlement = mappedEntitlement;
    const writeDecision = decideBillingEventWrite(existingEntitlement, {
      providerEventId: entitlementWrite.providerEventId,
      occurredAt: entitlementWrite.providerOccurredAt,
    });

    if (writeDecision !== "apply") {
      await ctx.db.insert("billingWebhookEvents", {
        provider: entitlementWrite.provider,
        providerEventId: entitlementWrite.providerEventId,
        providerEventType: args.providerEventType ?? entitlementWrite.lastBillingEventType,
        providerNotificationId: args.providerNotificationId,
        providerCustomerId: entitlementWrite.providerCustomerId,
        providerSubscriptionId: entitlementWrite.providerSubscriptionId,
        userKey: entitlementWrite.userKey,
        productKey: entitlementWrite.productKey,
        occurredAt: entitlementWrite.providerOccurredAt,
        receivedAt: processedAt,
        processedAt,
        processingStatus: writeDecision === "duplicate" ? "duplicate" : "ignored_stale",
        entitlementId: existingEntitlement?._id,
        entitlementStatus: existingEntitlement?.status,
        rawPayloadHash: args.rawPayloadHash,
      });

      return {
        action: writeDecision === "duplicate" ? ("duplicate" as const) : ("ignored_stale" as const),
        entitlementId: existingEntitlement?._id ?? null,
        status: existingEntitlement?.status ?? null,
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
      providerOccurredAt: entitlementWrite.providerOccurredAt,
      updatedAt: entitlementWrite.updatedAt,
      ...(entitlementWrite.currentPeriodEndsAt !== undefined
        ? { currentPeriodEndsAt: entitlementWrite.currentPeriodEndsAt }
        : {}),
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
      provider: entitlementWrite.provider,
      providerEventId: entitlementWrite.providerEventId,
      providerEventType: args.providerEventType ?? entitlementWrite.lastBillingEventType,
      providerNotificationId: args.providerNotificationId,
      providerCustomerId: entitlementWrite.providerCustomerId,
      providerSubscriptionId: entitlementWrite.providerSubscriptionId,
      userKey: entitlementWrite.userKey,
      productKey: entitlementWrite.productKey,
      occurredAt: entitlementWrite.providerOccurredAt,
      receivedAt: processedAt,
      processedAt,
      processingStatus: "applied",
      entitlementId,
      entitlementStatus: entitlementWrite.status,
      rawPayloadHash: args.rawPayloadHash,
    });

    return {
      action,
      entitlementId,
      status: entitlementWrite.status,
    };
  },
});
