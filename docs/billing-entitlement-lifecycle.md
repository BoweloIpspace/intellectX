# Billing Entitlement Lifecycle

Payments and checkout remain disabled. This document defines the production entitlements lifecycle used by verified Paddle webhook handling before any paid content is exposed.

## Event Contract

Only server/provider-verified billing events may write entitlement records. Frontend state, checkout query params, localStorage, pricing cards, and checkout success redirects are not entitlement proof.

Supported lifecycle events:

| Event | Entitlement outcome | Access effect |
| --- | --- | --- |
| `checkout_completed` | `active` | Allows paid access only after server write succeeds. |
| `subscription_created` | `active` | Allows paid access. |
| `subscription_renewed` | `active` | Keeps or restores paid access. |
| `subscription_cancelled` | `cancelled` | Blocks paid access. |
| `subscription_expired` | `expired` | Blocks paid access. |
| `payment_failed` | `payment_failed` | Blocks paid access. |
| `payment_refunded` | `refunded` | Blocks paid access. |

Unknown, malformed, unsigned, or unsupported billing events fail closed and must not update entitlements.

## Convex Write Path

`entitlements.applyVerifiedBillingEntitlementEvent` remains the generic internal entitlement mutation.

Verified Paddle webhooks use `entitlements.applyVerifiedBillingWebhookEvent`, which additionally:

- requires a provider event ID;
- stores a durable provider-event receipt;
- returns an idempotent duplicate result for an already processed provider event;
- ignores stale lifecycle events instead of overwriting newer entitlement state;
- resolves later lifecycle events through the existing provider subscription when Paddle does not repeat learner/product metadata;
- rejects learner/product metadata that conflicts with the existing subscription owner.

Both mutations are internal Convex mutations and cannot be called directly by learner clients.

## Paddle Webhook Endpoint

The Convex HTTP endpoint is:

- `POST /webhooks/paddle`

The endpoint:

- requires `PADDLE_WEBHOOK_SECRET` in the Convex environment;
- reads and verifies the untouched raw request body;
- verifies the `Paddle-Signature` timestamp and HMAC-SHA256 signature before parsing JSON;
- applies a five-second signature timestamp tolerance;
- supports multiple `h1` signatures for Paddle secret rotation;
- maps only supported Paddle subscription, renewal, payment-failure, and approved-refund events;
- requires `PADDLE_SCHOLAR_PRICE_ID` to identify the Scholar product on initial provider events;
- calls only the internal verified webhook entitlement mutation after signature verification;
- stores provider event receipts for replay protection.

Supported Paddle mappings currently include:

| Paddle event | IntellectX lifecycle event |
| --- | --- |
| `subscription.created` | `subscription_created` |
| `subscription.activated` | `subscription_created` |
| `transaction.completed` with `origin=subscription_recurring` | `subscription_renewed` |
| `subscription.canceled` | `subscription_cancelled` |
| `subscription.past_due` | `payment_failed` |
| `transaction.payment_failed` | `payment_failed` |
| approved refund `adjustment.updated` | `payment_refunded` |

Other Paddle events are acknowledged without entitlement mutation.

Checkout success redirects never call entitlement writes directly and are never treated as paid access proof.

## Remaining Configuration / Verification

- Configure the real Paddle webhook secret in Convex as `PADDLE_WEBHOOK_SECRET`.
- Configure the live Scholar Paddle price ID in Convex as `PADDLE_SCHOLAR_PRICE_ID`.
- Configure the Paddle notification destination to the deployed Convex `/webhooks/paddle` URL.
- Verify webhook delivery with Paddle sandbox/simulator and then the intended production environment.
- Complete real Clerk + Convex environment configuration and authenticated identity QA.
- Complete subscription lifecycle QA across renewal, cancellation, expiry/cancellation-at-period-end, refund, and payment failure.
- Keep checkout disabled until auth, entitlements, provider configuration, and production verification are complete.
