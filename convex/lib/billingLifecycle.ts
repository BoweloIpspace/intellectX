import type { EntitlementStatus } from "./entitlements";

export const billingLifecycleEventTypes = [
  "checkout_completed",
  "subscription_created",
  "subscription_renewed",
  "subscription_paused",
  "subscription_resumed",
  "subscription_cancelled",
  "subscription_expired",
  "payment_failed",
  "payment_refunded",
] as const;

export type BillingLifecycleEventType = (typeof billingLifecycleEventTypes)[number];
export type BillingEntitlementStatus = Exclude<EntitlementStatus, "none">;

export type VerifiedBillingEntitlementEvent = {
  verified: true;
  billingEventType: BillingLifecycleEventType;
  userKey: string;
  productKey: string;
  provider: string;
  providerCustomerId: string;
  providerSubscriptionId: string;
  providerEventId: string;
  currentPeriodEndsAt?: number | null;
  occurredAt: number;
};

export type EntitlementWrite = {
  userKey: string;
  productKey: string;
  status: BillingEntitlementStatus;
  provider: string;
  providerCustomerId: string;
  providerSubscriptionId: string;
  providerEventId: string;
  lastBillingEventType: BillingLifecycleEventType;
  currentPeriodEndsAt?: number;
  providerOccurredAt: number;
  updatedAt: number;
};

export type ExistingEntitlementVersion = {
  providerEventId?: string | null;
  providerOccurredAt?: number | null;
  updatedAt?: number | null;
} | null | undefined;

export type BillingEventWriteDecision = "apply" | "duplicate" | "stale";

export function getEntitlementStatusForBillingEvent(
  eventType: string | null | undefined,
): BillingEntitlementStatus | null {
  switch (eventType) {
    case "checkout_completed":
    case "subscription_created":
    case "subscription_renewed":
    case "subscription_resumed":
      return "active";
    case "subscription_paused":
      return "paused";
    case "subscription_cancelled":
      return "cancelled";
    case "subscription_expired":
      return "expired";
    case "payment_failed":
      return "payment_failed";
    case "payment_refunded":
      return "refunded";
    default:
      return null;
  }
}

function requireNonEmpty(value: string | null | undefined, fieldName: string) {
  const trimmed = value?.trim();

  if (!trimmed) {
    throw new Error(`${fieldName} is required for a verified billing entitlement event.`);
  }

  return trimmed;
}

function requireTimestamp(value: number | null | undefined, fieldName: string) {
  if (typeof value !== "number" || !Number.isFinite(value) || value <= 0) {
    throw new Error(`${fieldName} must be a positive finite timestamp.`);
  }

  return value;
}

export function decideBillingEventWrite(
  existing: ExistingEntitlementVersion,
  incoming: Pick<VerifiedBillingEntitlementEvent, "providerEventId" | "occurredAt">,
): BillingEventWriteDecision {
  const incomingEventId = requireNonEmpty(incoming.providerEventId, "providerEventId");
  const incomingOccurredAt = requireTimestamp(incoming.occurredAt, "occurredAt");

  if (existing?.providerEventId?.trim() === incomingEventId) {
    return "duplicate";
  }

  const previousOccurredAt =
    typeof existing?.providerOccurredAt === "number"
      ? existing.providerOccurredAt
      : typeof existing?.updatedAt === "number"
        ? existing.updatedAt
        : null;

  if (typeof previousOccurredAt === "number" && incomingOccurredAt <= previousOccurredAt) {
    return "stale";
  }

  return "apply";
}

export function prepareVerifiedEntitlementWrite(
  event: Partial<VerifiedBillingEntitlementEvent> | null | undefined,
  now = Date.now(),
): EntitlementWrite {
  if (!event || event.verified !== true) {
    throw new Error("Verified billing event data is required before updating entitlements.");
  }

  const status = getEntitlementStatusForBillingEvent(event.billingEventType);

  if (!status || !event.billingEventType) {
    throw new Error("Unknown billing lifecycle event type cannot update entitlements.");
  }

  const providerOccurredAt = requireTimestamp(event.occurredAt, "occurredAt");
  const write: EntitlementWrite = {
    userKey: requireNonEmpty(event.userKey, "userKey"),
    productKey: requireNonEmpty(event.productKey, "productKey"),
    status,
    provider: requireNonEmpty(event.provider, "provider"),
    providerCustomerId: requireNonEmpty(event.providerCustomerId, "providerCustomerId"),
    providerSubscriptionId: requireNonEmpty(event.providerSubscriptionId, "providerSubscriptionId"),
    providerEventId: requireNonEmpty(event.providerEventId, "providerEventId"),
    lastBillingEventType: event.billingEventType,
    providerOccurredAt,
    updatedAt: now,
  };

  if (typeof event.currentPeriodEndsAt === "number" && Number.isFinite(event.currentPeriodEndsAt)) {
    write.currentPeriodEndsAt = event.currentPeriodEndsAt;
  }

  return write;
}
