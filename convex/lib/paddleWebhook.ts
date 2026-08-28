import type { BillingLifecycleEventType } from "./billingLifecycle";

export const PADDLE_WEBHOOK_SIGNATURE_TOLERANCE_SECONDS = 5;
export const PADDLE_SCHOLAR_PRODUCT_KEY = "intellectx.scholar";

export type PaddleWebhookConfig = {
  scholarPriceId?: string | null;
};

export type MappedPaddleBillingEvent = {
  verified: true;
  billingEventType: BillingLifecycleEventType;
  userKey?: string;
  productKey?: string;
  provider: "paddle";
  providerCustomerId: string;
  providerSubscriptionId: string;
  providerEventId: string;
  currentPeriodEndsAt?: number;
  occurredAt?: number;
};

type PaddleWebhookEnvelope = {
  event_id: string;
  event_type: string;
  occurred_at?: string;
  data: Record<string, unknown>;
};

type ParsedPaddleSignature = {
  timestamp: number;
  signatures: string[];
};

function nonEmptyString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : null;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value) ? (value as Record<string, unknown>) : null;
}

function parseDateMs(value: unknown) {
  if (typeof value !== "string") return undefined;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : undefined;
}

function getCustomData(data: Record<string, unknown>) {
  return asRecord(data.custom_data);
}

function getUserKey(data: Record<string, unknown>) {
  return nonEmptyString(getCustomData(data)?.app_user_id) ?? undefined;
}

function getPriceIds(data: Record<string, unknown>) {
  if (!Array.isArray(data.items)) return [];

  return data.items.flatMap((item) => {
    const itemRecord = asRecord(item);
    const price = asRecord(itemRecord?.price);
    const priceId = nonEmptyString(price?.id);
    return priceId ? [priceId] : [];
  });
}

function getProductKey(data: Record<string, unknown>, config: PaddleWebhookConfig) {
  const scholarPriceId = nonEmptyString(config.scholarPriceId);
  if (!scholarPriceId) return undefined;
  return getPriceIds(data).includes(scholarPriceId) ? PADDLE_SCHOLAR_PRODUCT_KEY : undefined;
}

function getCurrentPeriodEndsAt(data: Record<string, unknown>) {
  const currentPeriod = asRecord(data.current_billing_period);
  return parseDateMs(currentPeriod?.ends_at);
}

function parseEnvelope(payload: unknown): PaddleWebhookEnvelope {
  const envelope = asRecord(payload);
  const eventId = nonEmptyString(envelope?.event_id);
  const eventType = nonEmptyString(envelope?.event_type);
  const data = asRecord(envelope?.data);

  if (!eventId || !eventType || !data) {
    throw new Error("Paddle webhook payload is malformed.");
  }

  return {
    event_id: eventId,
    event_type: eventType,
    occurred_at: nonEmptyString(envelope?.occurred_at) ?? undefined,
    data,
  };
}

export function mapPaddleWebhookEvent(payload: unknown, config: PaddleWebhookConfig): MappedPaddleBillingEvent | null {
  const envelope = parseEnvelope(payload);
  const data = envelope.data;
  const customerId = nonEmptyString(data.customer_id);
  const occurredAt = parseDateMs(envelope.occurred_at);

  let billingEventType: BillingLifecycleEventType | null = null;
  let subscriptionId: string | null = null;

  switch (envelope.event_type) {
    case "subscription.created":
    case "subscription.activated":
      billingEventType = "subscription_created";
      subscriptionId = nonEmptyString(data.id);
      break;
    case "subscription.canceled":
      billingEventType = "subscription_cancelled";
      subscriptionId = nonEmptyString(data.id);
      break;
    case "subscription.past_due":
      billingEventType = "payment_failed";
      subscriptionId = nonEmptyString(data.id);
      break;
    case "transaction.completed":
      if (data.origin !== "subscription_recurring") return null;
      billingEventType = "subscription_renewed";
      subscriptionId = nonEmptyString(data.subscription_id);
      break;
    case "transaction.payment_failed":
      billingEventType = "payment_failed";
      subscriptionId = nonEmptyString(data.subscription_id);
      break;
    case "adjustment.updated":
      if (data.action !== "refund" || data.status !== "approved") return null;
      billingEventType = "payment_refunded";
      subscriptionId = nonEmptyString(data.subscription_id);
      break;
    default:
      return null;
  }

  if (!billingEventType || !customerId || !subscriptionId) {
    throw new Error("Paddle billing event is missing required customer or subscription metadata.");
  }

  return {
    verified: true,
    billingEventType,
    userKey: getUserKey(data),
    productKey: getProductKey(data, config),
    provider: "paddle",
    providerCustomerId: customerId,
    providerSubscriptionId: subscriptionId,
    providerEventId: envelope.event_id,
    currentPeriodEndsAt: getCurrentPeriodEndsAt(data),
    occurredAt,
  };
}

export function parsePaddleSignatureHeader(header: string | null | undefined): ParsedPaddleSignature | null {
  if (!header) return null;

  let timestamp: number | null = null;
  const signatures: string[] = [];

  for (const part of header.split(";")) {
    const separator = part.indexOf("=");
    if (separator < 1) continue;
    const key = part.slice(0, separator).trim();
    const value = part.slice(separator + 1).trim();

    if (key === "ts" && /^\d+$/.test(value)) {
      timestamp = Number(value);
    } else if (key === "h1" && /^[a-f0-9]{64}$/i.test(value)) {
      signatures.push(value.toLowerCase());
    }
  }

  if (!Number.isSafeInteger(timestamp) || timestamp === null || signatures.length === 0) {
    return null;
  }

  return { timestamp, signatures };
}

function bytesToHex(bytes: Uint8Array) {
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function timingSafeHexEqual(left: string, right: string) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

export async function createPaddleSignature(rawBody: string, timestamp: number, secret: string) {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(`${timestamp}:${rawBody}`));
  return bytesToHex(new Uint8Array(signature));
}

export async function verifyPaddleWebhookSignature({
  rawBody,
  signatureHeader,
  secret,
  nowMs = Date.now(),
  toleranceSeconds = PADDLE_WEBHOOK_SIGNATURE_TOLERANCE_SECONDS,
}: {
  rawBody: string;
  signatureHeader: string | null | undefined;
  secret: string;
  nowMs?: number;
  toleranceSeconds?: number;
}) {
  const parsed = parsePaddleSignatureHeader(signatureHeader);
  const normalizedSecret = secret.trim();

  if (!parsed || !normalizedSecret) return false;

  const nowSeconds = Math.floor(nowMs / 1000);
  if (Math.abs(nowSeconds - parsed.timestamp) > toleranceSeconds) return false;

  const expected = await createPaddleSignature(rawBody, parsed.timestamp, normalizedSecret);
  return parsed.signatures.some((signature) => timingSafeHexEqual(expected, signature));
}
