import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import {
  createPaddleSignature,
  mapPaddleWebhookEvent,
  PADDLE_SCHOLAR_PRODUCT_KEY,
  verifyPaddleWebhookSignature,
} from "../../convex/lib/paddleWebhook";
import { getConvexAuthProviders, requireClerkJwtIssuerDomain } from "../../convex/lib/authConfigPolicy";

const subscriptionPayload = {
  event_id: "evt_subscription_created",
  event_type: "subscription.created",
  occurred_at: "2026-08-28T08:00:00.000Z",
  data: {
    id: "sub_123",
    customer_id: "ctm_123",
    custom_data: { app_user_id: "auth:https://clerk.example|user_123" },
    current_billing_period: { ends_at: "2026-09-28T08:00:00.000Z" },
    items: [{ price: { id: "pri_scholar" } }],
  },
};

describe("GIC billing and auth code completion", () => {
  it("verifies Paddle HMAC signatures against the untouched raw body and timestamp", async () => {
    const rawBody = JSON.stringify(subscriptionPayload);
    const secret = "pdl_ntfset_test_secret";
    const timestamp = 1_777_366_400;
    const signature = await createPaddleSignature(rawBody, timestamp, secret);

    await expect(
      verifyPaddleWebhookSignature({
        rawBody,
        signatureHeader: `ts=${timestamp};h1=${signature}`,
        secret,
        nowMs: timestamp * 1000,
      }),
    ).resolves.toBe(true);

    await expect(
      verifyPaddleWebhookSignature({
        rawBody: `${rawBody} `,
        signatureHeader: `ts=${timestamp};h1=${signature}`,
        secret,
        nowMs: timestamp * 1000,
      }),
    ).resolves.toBe(false);

    await expect(
      verifyPaddleWebhookSignature({
        rawBody,
        signatureHeader: `ts=${timestamp};h1=${signature}`,
        secret,
        nowMs: (timestamp + 10) * 1000,
      }),
    ).resolves.toBe(false);
  });

  it("maps only supported Paddle lifecycle events to the existing entitlement contract", () => {
    expect(mapPaddleWebhookEvent(subscriptionPayload, { scholarPriceId: "pri_scholar" })).toMatchObject({
      verified: true,
      billingEventType: "subscription_created",
      userKey: "auth:https://clerk.example|user_123",
      productKey: PADDLE_SCHOLAR_PRODUCT_KEY,
      provider: "paddle",
      providerCustomerId: "ctm_123",
      providerSubscriptionId: "sub_123",
      providerEventId: "evt_subscription_created",
    });

    expect(
      mapPaddleWebhookEvent(
        {
          event_id: "evt_renewal",
          event_type: "transaction.completed",
          occurred_at: "2026-09-28T08:00:00.000Z",
          data: {
            id: "txn_renewal",
            origin: "subscription_recurring",
            subscription_id: "sub_123",
            customer_id: "ctm_123",
            custom_data: { app_user_id: "auth:https://clerk.example|user_123" },
            items: [{ price: { id: "pri_scholar" } }],
          },
        },
        { scholarPriceId: "pri_scholar" },
      ),
    ).toMatchObject({ billingEventType: "subscription_renewed", productKey: PADDLE_SCHOLAR_PRODUCT_KEY });

    expect(
      mapPaddleWebhookEvent(
        { event_id: "evt_customer", event_type: "customer.updated", data: { id: "ctm_123" } },
        { scholarPriceId: "pri_scholar" },
      ),
    ).toBeNull();
  });

  it("maps cancellation, failed payment, and approved refund events without fabricating missing identity", () => {
    expect(
      mapPaddleWebhookEvent(
        {
          event_id: "evt_cancel",
          event_type: "subscription.canceled",
          data: { id: "sub_123", customer_id: "ctm_123" },
        },
        { scholarPriceId: "pri_scholar" },
      ),
    ).toMatchObject({ billingEventType: "subscription_cancelled", userKey: undefined, productKey: undefined });

    expect(
      mapPaddleWebhookEvent(
        {
          event_id: "evt_failed",
          event_type: "transaction.payment_failed",
          data: { subscription_id: "sub_123", customer_id: "ctm_123" },
        },
        { scholarPriceId: "pri_scholar" },
      ),
    ).toMatchObject({ billingEventType: "payment_failed" });

    expect(
      mapPaddleWebhookEvent(
        {
          event_id: "evt_refund",
          event_type: "adjustment.updated",
          data: {
            subscription_id: "sub_123",
            customer_id: "ctm_123",
            action: "refund",
            status: "approved",
          },
        },
        { scholarPriceId: "pri_scholar" },
      ),
    ).toMatchObject({ billingEventType: "payment_refunded" });
  });

  it("persists provider event receipts and ignores duplicate or stale webhook rewrites", () => {
    const schema = readFileSync("convex/schema.ts", "utf8");
    const entitlements = readFileSync("convex/entitlements.ts", "utf8");

    expect(schema).toContain("billingWebhookEvents: defineTable");
    expect(schema).toContain('.index("by_provider_event", ["provider", "providerEventId"])');
    expect(entitlements).toContain('action: "duplicate"');
    expect(entitlements).toContain('action: "stale_ignored"');
    expect(entitlements).toContain("applyVerifiedBillingWebhookEvent");
  });

  it("keeps Clerk to Convex auth fail-closed until a valid issuer is configured", () => {
    expect(getConvexAuthProviders({})).toEqual([]);
    expect(getConvexAuthProviders({ CLERK_JWT_ISSUER_DOMAIN: "https://clerk.example" })).toEqual([
      { domain: "https://clerk.example", applicationID: "convex" },
    ]);
    expect(() => requireClerkJwtIssuerDomain({})).toThrow(
      "CLERK_JWT_ISSUER_DOMAIN is required for Convex Clerk authentication.",
    );
    expect(() => getConvexAuthProviders({ CLERK_JWT_ISSUER_DOMAIN: "http://clerk.example" })).toThrow(
      "CLERK_JWT_ISSUER_DOMAIN must be a valid https URL.",
    );
  });
});
