# Production Readiness Tracker

This document tracks true production blockers only. It does not frame the product as MVP-ready or free-launch-ready; it focuses on the conditions that must be satisfied before IntellectX can be treated as production-ready.

Related references:

- [docs/real-auth-activation.md](./real-auth-activation.md)
- [docs/security-env-audit.md](./security-env-audit.md)
- [docs/route-access-matrix.md](./route-access-matrix.md)
- [docs/billing-entitlement-lifecycle.md](./billing-entitlement-lifecycle.md)

## 1. Current production readiness estimate

- Status: Not production-ready.
- Current posture: Auth and billing code foundations are implemented, but production environment configuration, provider connectivity, real identity QA, billing lifecycle QA, and final deployment validation remain incomplete.
- Production decision: Do not treat this build as production-ready until the blockers below are cleared and re-validated.

## 2. Completed production hardening

The following hardening work is in place and should be considered completed foundation work, not a production release signal by itself:

- Fail-closed Convex identity policy for user-owned data paths.
- Entitlement access foundation for paid-content gating.
- Billing entitlement lifecycle foundation for verified provider events.
- Paddle Convex HTTP webhook endpoint at `/webhooks/paddle`.
- Raw-body Paddle HMAC-SHA256 signature and timestamp verification before event parsing.
- Strict Paddle lifecycle event mapping into internal entitlement lifecycle events.
- Durable provider-event receipts for duplicate webhook replay protection.
- Stale provider events are recorded but cannot overwrite newer entitlement state.
- Verified Paddle events are wired only to the internal server-side entitlement mutation path.
- Clerk-to-Convex auth configuration code is present and remains fail-closed until a valid HTTPS `CLERK_JWT_ISSUER_DOMAIN` is supplied; the application ID is `convex`.
- Route and data access matrix documenting auth and access boundaries.
- Mobile scope locked away from paid flows so mobile entry points do not imply paid access.
- Placeholder admin and instructor routes exist as locked, non-production-ready surfaces until real RBAC, server authorization, and audit logging are implemented.
- Staff routes have fail-closed runtime protection around the current placeholders. Access is denied unless trusted Clerk session claims resolve to an allowed staff role, but production RBAC is still incomplete until the real claim source is configured and QA'd.
- A server-side course workflow foundation is in place for instructor/admin course review. Convex mutations fail closed without trusted staff role claims, learner-facing reads remain approved plus published only, and workflow actions append audit logs.
- User-owned learner Convex sync no longer requires a local browser learner session in Clerk+Convex mode. Profile, course selection, quiz attempt, lesson progress, and study activity calls can omit client `userKey` and resolve through authenticated Convex identity once Clerk-to-Convex auth is configured.
- Learner course, lesson, and quiz detail routes support Convex-backed catalog records where the parent course is approved and published, while preserving static fallback and paid-content fail-closed behavior.

## 3. Remaining critical blockers

These items are still blocking production readiness:

- Clerk environment keys must be configured and verified in the intended production environments.
- `CLERK_JWT_ISSUER_DOMAIN` must be configured in the Convex production environment before production identity can be trusted.
- The existing production Clerk-to-Convex auth configuration must be deployed with the real issuer and validated.
- The Clerk Convex JWT template and trusted staff role claim path must be configured and verified.
- Real Clerk-to-Convex identity QA must prove protected routes and user-owned Convex reads/writes resolve through trusted identity.
- `PADDLE_WEBHOOK_SECRET` must be configured in the Convex environment.
- `PADDLE_SCHOLAR_PRICE_ID` must be configured in the Convex environment.
- The Paddle notification destination must be configured to the deployed `/webhooks/paddle` endpoint and verified reachable.
- Real provider webhook delivery must prove signature verification, durable replay protection, and server entitlement writes end to end.
- Subscription lifecycle QA must be completed for renewal, cancellation, expiry/cancellation-at-period-end, refund, and payment failure scenarios.
- A production deployment smoke pass must be completed against the real deployment environment.
- Admin and instructor workflow placeholders must remain locked until trusted auth-claim RBAC is configured, propagated to Convex identity, integrated into real dashboards, and QA'd.
- Real course workflow enforcement has server mutations and audit logging, but production remains blocked until Clerk role claim configuration and end-to-end staff workflow QA are completed.

## 4. What must stay disabled

The following must remain disabled until the blockers above are resolved:

- Checkout
- Paid access
- `ALLOW_LOCAL_USERKEY_FALLBACK` in production

These controls must not be enabled as a shortcut around auth, webhook verification, or entitlements.

## 5. Not production-ready until

- [x] Clerk-to-Convex auth configuration code exists and fails closed without a valid issuer.
- [x] Paddle webhook endpoint code exists.
- [x] Paddle webhook signature verification is enforced in code.
- [x] Durable duplicate-event replay protection is implemented and regression-tested.
- [x] Stale webhook events cannot overwrite newer entitlement state.
- [x] Verified Paddle lifecycle events are wired to internal server-side entitlement writes.
- [ ] Clerk env keys are configured and verified in the target production environment.
- [ ] `CLERK_JWT_ISSUER_DOMAIN` is configured in the Convex environment.
- [ ] The Clerk Convex JWT template is named `convex` and includes the trusted staff role claim path selected for staff workflow QA.
- [ ] The Clerk-to-Convex auth configuration is deployed with the real issuer and validated.
- [ ] Real Clerk-to-Convex identity QA passes for authenticated access and protected data paths.
- [ ] `PADDLE_WEBHOOK_SECRET` is configured in Convex.
- [ ] `PADDLE_SCHOLAR_PRICE_ID` is configured in Convex.
- [ ] The deployed Paddle webhook endpoint is reachable from Paddle.
- [ ] Paddle sandbox/simulator delivery proves valid signatures are accepted and invalid signatures are rejected.
- [ ] Real provider events prove server-side entitlement writes end to end.
- [ ] Subscription lifecycle QA passes for active, renewed, cancelled, expired/cancellation-at-period-end, refunded, and payment-failed states.
- [ ] A production deployment smoke pass succeeds without bypassing guardrails.
- [ ] Checkout and paid access remain disabled until the above checks are complete.
- [ ] Clerk staff role claims are configured, propagated to Convex identity, and QA'd for instructor/admin workflow mutations.
