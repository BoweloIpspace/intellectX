import { describe, expect, it } from "vitest";

import {
  decideBillingEventWrite,
  getEntitlementStatusForBillingEvent,
  prepareVerifiedEntitlementWrite,
  type BillingLifecycleEventType,
  type VerifiedBillingEntitlementEvent,
} from "../../convex/lib/billingLifecycle";

const activeEvents = [
  "checkout_completed",
  "subscription_created",
  "subscription_renewed",
  "subscription_resumed",
] as const satisfies BillingLifecycleEventType[];

const inactiveEventExpectations = [
  ["subscription_paused", "paused"],
  ["subscription_cancelled", "cancelled"],
  ["subscription_expired", "expired"],
  ["payment_failed", "payment_failed"],
  ["payment_refunded", "refunded"],
] as const satisfies ReadonlyArray<readonly [BillingLifecycleEventType, string]>;

function verifiedEvent(overrides: Partial<VerifiedBillingEntitlementEvent> = {}): VerifiedBillingEntitlementEvent {
  return {
    verified: true,
    billingEventType: "subscription_created",
    userKey: "auth:https://clerk.example|user_123",
    productKey: "intellectx.scholar",
    provider: "paddle",
    providerCustomerId: "ctm_123",
    providerSubscriptionId: "sub_123",
    providerEventId: "evt_123",
    currentPeriodEndsAt: 2000,
    occurredAt: 1000,
    ...overrides,
  };
}

describe("billing lifecycle entitlement mapping", () => {
  it("maps successful subscription events to active entitlement", () => {
    for (const eventType of activeEvents) {
      expect(getEntitlementStatusForBillingEvent(eventType)).toBe("active");
      expect(prepareVerifiedEntitlementWrite(verifiedEvent({ billingEventType: eventType })).status).toBe("active");
    }
  });

  it("maps pause, cancellation, expiry, failure, and refund events to inactive states", () => {
    for (const [eventType, status] of inactiveEventExpectations) {
      expect(getEntitlementStatusForBillingEvent(eventType)).toBe(status);
      expect(prepareVerifiedEntitlementWrite(verifiedEvent({ billingEventType: eventType })).status).toBe(status);
    }
  });

  it("fails closed for missing or unknown lifecycle events", () => {
    expect(getEntitlementStatusForBillingEvent(null)).toBeNull();
    expect(getEntitlementStatusForBillingEvent("invoice_updated")).toBeNull();
    expect(() =>
      prepareVerifiedEntitlementWrite(
        verifiedEvent({ billingEventType: "invoice_updated" as BillingLifecycleEventType }),
      ),
    ).toThrow("Unknown billing lifecycle event type cannot update entitlements.");
  });

  it("requires verified server or provider data before preparing an entitlement write", () => {
    expect(() => prepareVerifiedEntitlementWrite({ ...verifiedEvent(), verified: false as unknown as true })).toThrow(
      "Verified billing event data is required before updating entitlements.",
    );
  });

  it("requires durable event identity and provider occurrence time", () => {
    expect(() => prepareVerifiedEntitlementWrite({ ...verifiedEvent(), providerEventId: "" })).toThrow(
      "providerEventId is required",
    );
    expect(() => prepareVerifiedEntitlementWrite({ ...verifiedEvent(), occurredAt: 0 })).toThrow(
      "occurredAt must be a positive finite timestamp",
    );
  });

  it("normalizes provider metadata while separating provider time from processing time", () => {
    expect(
      prepareVerifiedEntitlementWrite(
        verifiedEvent({
          userKey: " auth:https://clerk.example|user_123 ",
          productKey: " intellectx.scholar ",
          provider: " paddle ",
          providerCustomerId: " ctm_123 ",
          providerSubscriptionId: " sub_123 ",
          providerEventId: " evt_123 ",
        }),
        3000,
      ),
    ).toEqual({
      userKey: "auth:https://clerk.example|user_123",
      productKey: "intellectx.scholar",
      status: "active",
      provider: "paddle",
      providerCustomerId: "ctm_123",
      providerSubscriptionId: "sub_123",
      providerEventId: "evt_123",
      lastBillingEventType: "subscription_created",
      currentPeriodEndsAt: 2000,
      providerOccurredAt: 1000,
      updatedAt: 3000,
    });
  });

  it("rejects frontend-style entitlement claims without provider subscription metadata", () => {
    expect(() =>
      prepareVerifiedEntitlementWrite({
        verified: true,
        billingEventType: "checkout_completed",
        userKey: "auth:https://clerk.example|user_123",
        productKey: "intellectx.scholar",
        providerEventId: "evt_123",
        occurredAt: 1000,
      }),
    ).toThrow("provider is required for a verified billing entitlement event.");
  });
});

describe("billing event ordering", () => {
  it("applies events newer than the stored provider occurrence time", () => {
    expect(
      decideBillingEventWrite(
        { providerEventId: "evt_old", providerOccurredAt: 1000 },
        { providerEventId: "evt_new", occurredAt: 1001 },
      ),
    ).toBe("apply");
  });

  it("treats the same provider event as a duplicate", () => {
    expect(
      decideBillingEventWrite(
        { providerEventId: "evt_same", providerOccurredAt: 1000 },
        { providerEventId: "evt_same", occurredAt: 1001 },
      ),
    ).toBe("duplicate");
  });

  it("rejects older or equal-time different events as stale", () => {
    expect(
      decideBillingEventWrite(
        { providerEventId: "evt_current", providerOccurredAt: 1000 },
        { providerEventId: "evt_old", occurredAt: 999 },
      ),
    ).toBe("stale");
    expect(
      decideBillingEventWrite(
        { providerEventId: "evt_current", providerOccurredAt: 1000 },
        { providerEventId: "evt_tie", occurredAt: 1000 },
      ),
    ).toBe("stale");
  });
});
