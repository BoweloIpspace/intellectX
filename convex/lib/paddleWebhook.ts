import type { BillingLifecycleEventType } from "./billingLifecycle";

const DEFAULT_SIGNATURE_TOLERANCE_SECONDS = 5;
const SHA256_HEX_LENGTH = 64;

export type PaddleSignature = {
  timestamp: number;
  signatures: string[];
};

export type PaddleMappedEntitlementEvent = {
  verified: true;
  billingEventType: BillingLifecycleEventType;
  userKey?: string;
  productKey?: string;
  provider: "paddle";
  providerCustomerId?: string;
  providerSubscriptionId: string;
  providerEventId: string;
  providerEventType: string;
  providerNotificationId?: string;
  currentPeriodEndsAt?: number;
  occurredAt: number;
};

type UnknownRecord = Record<string, unknown>;

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(record: UnknownRecord | null, key: string) {
  const value = record?.[key];
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function readRecord(record: UnknownRecord | null, key: string) {
  const value = record?.[key];
  return isRecord(value) ? value : null;
}

function parseTimestamp(value: unknown) {
  if (typeof value !== "string" || !value.trim()) return undefined;
  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) && timestamp > 0 ? timestamp : undefined;
}

function hexToBytes(hex: string) {
  if (hex.length !== SHA256_HEX_LENGTH || !/^[a-f0-9]+$/i.test(hex)) {
    return null;
  }

  const bytes = new Uint8Array(hex.length / 2);
  for (let index = 0; index < hex.length; index += 2) {
    bytes[index / 2] = Number.parseInt(hex.slice(index, index + 2), 16);
  }
  return bytes;
}

export function parsePaddleSignatureHeader(header: string | null | undefined): PaddleSignature | null {
  if (!header) return null;

  let timestamp: number | null = null;
  const signatures: string[] = [];

  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 1) continue;

    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();

    if (key === "ts") {
      const parsed = Number(value);
      if (Number.isInteger(parsed) && parsed > 0) timestamp = parsed;
    } else if (key === "h1" && hexToBytes(value)) {
      signatures.push(value.toLowerCase());
    }
  }

  if (!timestamp || signatures.length === 0) return null;
  return { timestamp, signatures };
}

export async function verifyPaddleWebhookSignature({
  rawBody,
  signatureHeader,
  secret,
  now = Date.now(),
  toleranceSeconds = DEFAULT_SIGNATURE_TOLERANCE_SECONDS,
}: {
  rawBody: string;
  signatureHeader: string | null | undefined;
  secret: string;
  now?: number;
  toleranceSeconds?: number;
}) {
  const parsed = parsePaddleSignatureHeader(signatureHeader);
  const normalizedSecret = secret.trim();

  if (!parsed || !normalizedSecret || !Number.isFinite(now) || toleranceSeconds < 0) {
    return false;
  }

  const timestampAgeSeconds = Math.abs(now / 1000 - parsed.timestamp);
  if (timestampAgeSeconds > toleranceSeconds) {
    return false;
  }

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(normalizedSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const signedPayload = encoder.encode(`${parsed.timestamp}:${rawBody}`);

  for (const signature of parsed.signatures) {
    const bytes = hexToBytes(signature);
    if (bytes && (await crypto.subtle.verify("HMAC", key, bytes, signedPayload))) {
      return true;
    }
  }

  return false;
}

export async function sha256Hex(value: string) {
  const digest = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function mapSubscriptionStatus(status: string | undefined): BillingLifecycleEventType | null {
  switch (status) {
    case "active":
      return "subscription_renewed";
    case "trialing":
      return "subscription_created";
    case "paused":
      return "subscription_paused";
    case "past_due":
      return "payment_failed";
    case "canceled":
      return "subscription_cancelled";
    default:
      return null;
  }
}

function resolveBillingEventType(eventType: string, data: UnknownRecord): BillingLifecycleEventType | null {
  switch (eventType) {
    case "subscription.created":
    case "subscription.trialing":
      return "subscription_created";
    case "subscription.activated":
      return "subscription_renewed";
    case "subscription.resumed":
      return "subscription_resumed";
    case "subscription.paused":
      return "subscription_paused";
    case "subscription.canceled":
      return "subscription_cancelled";
    case "subscription.past_due":
      return "payment_failed";
    case "subscription.updated":
      return mapSubscriptionStatus(readString(data, "status"));
    case "transaction.completed":
      return "checkout_completed";
    case "transaction.payment_failed":
    case "transaction.past_due":
      return "payment_failed";
    case "adjustment.updated": {
      const isApprovedFullRefund =
        readString(data, "action") === "refund" &&
        readString(data, "status") === "approved" &&
        readString(data, "type") === "full";
      return isApprovedFullRefund ? "payment_refunded" : null;
    }
    default:
      return null;
  }
}

export function mapPaddleWebhookToEntitlementEvent(payload: unknown): PaddleMappedEntitlementEvent | null {
  if (!isRecord(payload)) return null;

  const providerEventId = readString(payload, "event_id");
  const providerEventType = readString(payload, "event_type");
  const occurredAt = parseTimestamp(payload.occurred_at);
  const providerNotificationId = readString(payload, "notification_id");
  const data = readRecord(payload, "data");

  if (!providerEventId || !providerEventType || !occurredAt || !data) {
    return null;
  }

  const billingEventType = resolveBillingEventType(providerEventType, data);
  if (!billingEventType) return null;

  const isSubscriptionEvent = providerEventType.startsWith("subscription.");
  const providerSubscriptionId = isSubscriptionEvent
    ? readString(data, "id")
    : readString(data, "subscription_id");

  if (!providerSubscriptionId) return null;

  const customData = readRecord(data, "custom_data");
  const currentBillingPeriod = readRecord(data, "current_billing_period");
  const currentPeriodEndsAt = parseTimestamp(currentBillingPeriod?.ends_at);

  return {
    verified: true,
    billingEventType,
    userKey: readString(customData, "app_user_id"),
    productKey: readString(customData, "product_key"),
    provider: "paddle",
    providerCustomerId: readString(data, "customer_id"),
    providerSubscriptionId,
    providerEventId,
    providerEventType,
    providerNotificationId,
    currentPeriodEndsAt,
    occurredAt,
  };
}
