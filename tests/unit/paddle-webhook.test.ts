import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";

import {
  mapPaddleWebhookToEntitlementEvent,
  parsePaddleSignatureHeader,
  verifyPaddleWebhookSignature,
} from "../../convex/lib/paddleWebhook";

function signatureHeader(rawBody: string, secret: string, timestamp: number, extraSignatures: string[] = []) {
  const signature = createHmac("sha256", secret).update(`${timestamp}:${rawBody}`).digest("hex");
  return [`ts=${timestamp}`, ...extraSignatures.map((value) => `h1=${value}`), `h1=${signature}`].join(";");
}

describe("Paddle webhook signature verification", () => {
  it("accepts a valid HMAC signature inside the tolerance window", async () => {
    const rawBody = JSON.stringify({ event_id: "evt_1" });
    const secret = "pdl_ntfset_secret";
    const timestamp = 1_800_000_000;

    await expect(
      verifyPaddleWebhookSignature({
        rawBody,
        secret,
        signatureHeader: signatureHeader(rawBody, secret, timestamp),
        now: timestamp * 1000,
      }),
    ).resolves.toBe(true);
  });

  it("rejects an invalid signature and a stale valid signature", async () => {
    const rawBody = "{}";
    const timestamp = 1_800_000_000;

    await expect(
      verifyPaddleWebhookSignature({
        rawBody,
        secret: "correct-secret",
        signatureHeader: signatureHeader(rawBody, "wrong-secret", timestamp),
        now: timestamp * 1000,
      }),
    ).resolves.toBe(false);

    await expect(
      verifyPaddleWebhookSignature({
        rawBody,
        secret: "correct-secret",
        signatureHeader: signatureHeader(rawBody, "correct-secret", timestamp),
        now: (timestamp + 10) * 1000,
      }),
    ).resolves.toBe(false);
  });

  it("supports Paddle key rotation headers with multiple h1 signatures", async () => {
    const rawBody = "{\"ok\":true}";
    const secret = "rotation-secret";
    const timestamp = 1_800_000_000;
    const unrelated = "0".repeat(64);

    await expect(
      verifyPaddleWebhookSignature({
        rawBody,
        secret,
        signatureHeader: signatureHeader(rawBody, secret, timestamp, [unrelated]),
        now: timestamp * 1000,
      }),
    ).resolves.toBe(true);
  });

  it("rejects malformed signature headers", () => {
    expect(parsePaddleSignatureHeader(null)).toBeNull();
    expect(parsePaddleSignatureHeader("ts=abc;h1=1234")).toBeNull();
    expect(parsePaddleSignatureHeader("ts=1800000000")).toBeNull();
  });
});

describe("Paddle event mapping", () => {
  it("maps a subscription creation with trusted custom data", () => {
    expect(
      mapPaddleWebhookToEntitlementEvent({
        event_id: "evt_created",
        event_type: "subscription.created",
        notification_id: "ntf_created",
        occurred_at: "2026-08-23T00:00:00.000Z",
        data: {
          id: "sub_123",
          customer_id: "ctm_123",
          status: "active",
          custom_data: {
            app_user_id: "auth:https://issuer.example|user_1",
            product_key: "intellectx.scholar",
          },
          current_billing_period: {
            ends_at: "2026-09-23T00:00:00.000Z",
          },
        },
      }),
    ).toEqual({
      verified: true,
      billingEventType: "subscription_created",
      userKey: "auth:https://issuer.example|user_1",
      productKey: "intellectx.scholar",
      provider: "paddle",
      providerCustomerId: "ctm_123",
      providerSubscriptionId: "sub_123",
      providerEventId: "evt_created",
      providerEventType: "subscription.created",
      providerNotificationId: "ntf_created",
      currentPeriodEndsAt: Date.parse("2026-09-23T00:00:00.000Z"),
      occurredAt: Date.parse("2026-08-23T00:00:00.000Z"),
    });
  });

  it("maps pause, resume, cancellation, and past-due subscription changes", () => {
    const base = {
      event_id: "evt_1",
      occurred_at: "2026-08-23T00:00:00.000Z",
      data: { id: "sub_1", customer_id: "ctm_1" },
    };

    expect(mapPaddleWebhookToEntitlementEvent({ ...base, event_type: "subscription.paused" })?.billingEventType).toBe(
      "subscription_paused",
    );
    expect(mapPaddleWebhookToEntitlementEvent({ ...base, event_type: "subscription.resumed" })?.billingEventType).toBe(
      "subscription_resumed",
    );
    expect(mapPaddleWebhookToEntitlementEvent({ ...base, event_type: "subscription.canceled" })?.billingEventType).toBe(
      "subscription_cancelled",
    );
    expect(mapPaddleWebhookToEntitlementEvent({ ...base, event_type: "subscription.past_due" })?.billingEventType).toBe(
      "payment_failed",
    );

    expect(
      mapPaddleWebhookToEntitlementEvent({
        ...base,
        event_type: "subscription.updated",
        data: { ...base.data, status: "past_due" },
      })?.billingEventType,
    ).toBe("payment_failed");
  });

  it("maps completed transactions and failed transaction payments using subscription identity", () => {
    const base = {
      event_id: "evt_txn",
      occurred_at: "2026-08-23T00:00:00.000Z",
      data: {
        id: "txn_1",
        subscription_id: "sub_1",
        customer_id: "ctm_1",
        custom_data: {
          app_user_id: "auth:https://issuer.example|user_1",
          product_key: "intellectx.scholar",
        },
      },
    };

    expect(
      mapPaddleWebhookToEntitlementEvent({ ...base, event_type: "transaction.completed" })?.billingEventType,
    ).toBe("checkout_completed");
    expect(
      mapPaddleWebhookToEntitlementEvent({ ...base, event_type: "transaction.payment_failed" })?.billingEventType,
    ).toBe("payment_failed");
  });

  it("revokes access only for approved full refunds and lets existing subscription mapping supply identity", () => {
    const event = mapPaddleWebhookToEntitlementEvent({
      event_id: "evt_refund",
      event_type: "adjustment.updated",
      occurred_at: "2026-08-23T00:00:00.000Z",
      data: {
        id: "adj_1",
        action: "refund",
        status: "approved",
        type: "full",
        subscription_id: "sub_1",
        customer_id: "ctm_1",
      },
    });

    expect(event?.billingEventType).toBe("payment_refunded");
    expect(event?.userKey).toBeUndefined();
    expect(event?.productKey).toBeUndefined();

    expect(
      mapPaddleWebhookToEntitlementEvent({
        event_id: "evt_partial",
        event_type: "adjustment.updated",
        occurred_at: "2026-08-23T00:00:00.000Z",
        data: {
          action: "refund",
          status: "approved",
          type: "partial",
          subscription_id: "sub_1",
        },
      }),
    ).toBeNull();
  });

  it("ignores unsupported or incomplete provider events", () => {
    expect(
      mapPaddleWebhookToEntitlementEvent({
        event_id: "evt_unknown",
        event_type: "customer.updated",
        occurred_at: "2026-08-23T00:00:00.000Z",
        data: { id: "ctm_1" },
      }),
    ).toBeNull();

    expect(
      mapPaddleWebhookToEntitlementEvent({
        event_id: "evt_missing_sub",
        event_type: "transaction.completed",
        occurred_at: "2026-08-23T00:00:00.000Z",
        data: { id: "txn_1" },
      }),
    ).toBeNull();
  });
});
