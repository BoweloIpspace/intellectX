import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";
import {
  mapPaddleWebhookEvent,
  verifyPaddleWebhookSignature,
} from "./lib/paddleWebhook";

const http = httpRouter();
const MAX_PADDLE_WEBHOOK_BYTES = 256 * 1024;

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store, max-age=0",
      "x-content-type-options": "nosniff",
    },
  });
}

http.route({
  path: "/webhooks/paddle",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const secret = process.env.PADDLE_WEBHOOK_SECRET?.trim();
    if (!secret) {
      return json({ error: "Paddle webhook verification is not configured." }, 503);
    }

    const contentLength = Number(request.headers.get("content-length"));
    if (Number.isFinite(contentLength) && contentLength > MAX_PADDLE_WEBHOOK_BYTES) {
      return json({ error: "Paddle webhook payload is too large." }, 413);
    }

    const rawBody = await request.text();
    if (new TextEncoder().encode(rawBody).byteLength > MAX_PADDLE_WEBHOOK_BYTES) {
      return json({ error: "Paddle webhook payload is too large." }, 413);
    }

    const signatureValid = await verifyPaddleWebhookSignature({
      rawBody,
      signatureHeader: request.headers.get("paddle-signature"),
      secret,
    });

    if (!signatureValid) {
      return json({ error: "Invalid or expired Paddle webhook signature." }, 401);
    }

    let payload: unknown;
    try {
      payload = JSON.parse(rawBody);
    } catch {
      return json({ error: "Paddle webhook payload must be valid JSON." }, 400);
    }

    let mapped;
    try {
      mapped = mapPaddleWebhookEvent(payload, {
        scholarPriceId: process.env.PADDLE_SCHOLAR_PRICE_ID,
      });
    } catch (error) {
      return json(
        { error: error instanceof Error ? error.message : "Paddle webhook payload is invalid." },
        400,
      );
    }

    if (!mapped) {
      return json({ ok: true, ignored: true });
    }

    try {
      const result = await ctx.runMutation(internal.entitlements.applyVerifiedBillingWebhookEvent, mapped);
      return json({ ok: true, result });
    } catch (error) {
      console.error("Failed to apply verified Paddle billing webhook", error);
      return json({ error: "Verified Paddle billing event could not be applied." }, 422);
    }
  }),
});

export default http;
