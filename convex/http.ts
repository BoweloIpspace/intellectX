import { httpRouter } from "convex/server";
import { internal } from "./_generated/api";
import { httpAction } from "./_generated/server";
import {
  mapPaddleWebhookToEntitlementEvent,
  sha256Hex,
  verifyPaddleWebhookSignature,
} from "./lib/paddleWebhook";

const MAX_WEBHOOK_BODY_BYTES = 256 * 1024;

function jsonResponse(status: number, body: Record<string, unknown>) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8" },
  });
}

const http = httpRouter();

http.route({
  path: "/webhooks/paddle",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const webhookSecret = process.env.PADDLE_WEBHOOK_SECRET?.trim();
    if (!webhookSecret) {
      console.error(JSON.stringify({ event: "paddle_webhook_unconfigured" }));
      return jsonResponse(503, { ok: false, error: "Webhook processing is not configured." });
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_WEBHOOK_BODY_BYTES) {
      return jsonResponse(413, { ok: false, error: "Webhook payload is too large." });
    }

    const signatureHeader = request.headers.get("Paddle-Signature");
    const signatureValid = await verifyPaddleWebhookSignature({
      rawBody,
      signatureHeader,
      secret: webhookSecret,
    });

    if (!signatureValid) {
      console.warn(JSON.stringify({ event: "paddle_webhook_signature_rejected" }));
      return jsonResponse(401, { ok: false, error: "Invalid webhook signature." });
    }

    let payload: unknown;
    try {
      payload = JSON.parse(rawBody) as unknown;
    } catch {
      return jsonResponse(400, { ok: false, error: "Webhook payload is not valid JSON." });
    }

    const mappedEvent = mapPaddleWebhookToEntitlementEvent(payload);
    if (!mappedEvent) {
      return new Response(null, { status: 204 });
    }

    const rawPayloadHash = await sha256Hex(rawBody);

    try {
      const result = await ctx.runMutation(internal.entitlements.applyVerifiedBillingEntitlementEvent, {
        verified: true,
        billingEventType: mappedEvent.billingEventType,
        userKey: mappedEvent.userKey,
        productKey: mappedEvent.productKey,
        provider: mappedEvent.provider,
        providerCustomerId: mappedEvent.providerCustomerId,
        providerSubscriptionId: mappedEvent.providerSubscriptionId,
        providerEventId: mappedEvent.providerEventId,
        providerEventType: mappedEvent.providerEventType,
        providerNotificationId: mappedEvent.providerNotificationId,
        rawPayloadHash,
        currentPeriodEndsAt: mappedEvent.currentPeriodEndsAt,
        occurredAt: mappedEvent.occurredAt,
      });

      return jsonResponse(200, {
        ok: true,
        action: result.action,
        status: result.status,
      });
    } catch (error) {
      console.error(
        JSON.stringify({
          event: "paddle_webhook_processing_failed",
          providerEventId: mappedEvent.providerEventId,
          providerEventType: mappedEvent.providerEventType,
          message: error instanceof Error ? error.message : "Unknown billing processing error",
        }),
      );
      return jsonResponse(422, { ok: false, error: "Verified billing event could not be applied safely." });
    }
  }),
});

export default http;
