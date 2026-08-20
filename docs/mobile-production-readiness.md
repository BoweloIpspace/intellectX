# Mobile Production Readiness

Status date: 2026-08-20

## Product contract

The native IntellectX app is a **free, quiz-only learner experience** with Home, Quizzes, Progress, and Profile navigation. Flashcards, notes, courses, dashboard, search, pricing, checkout, instructor, and admin surfaces are outside the native product.

## Completed production-hardening work

- Native scope is quiz-only and the Capacitor app starts at `/mobile-study`.
- The Android target is API 36 and cleartext traffic is disabled.
- Android backups are disabled so device-local learner/profile/quiz state is not copied by Android backup services.
- The native local learner flow is labeled honestly as a device-local profile and does not collect a fake password.
- The native auth return path preserves the selected quiz and guards against pre-hydration form submission races.
- When Convex is not configured, production quiz grading uses a Node-only server route with server-only answer keys, no-store responses, request validation, and a small request-size guard.
- When Convex is configured, the fallback grading route fails closed and Convex remains authoritative.
- Production environment validation allows either an intentional fully local mobile mode or a fully configured Clerk + Convex mode; partial mixed configuration is rejected.
- Payments must remain disabled for the free mobile product and insecure local user-key fallback is rejected by the production gate.
- CI runs typecheck, lint, unit tests, a production dependency audit, a production build, and Playwright against `next start` rather than `next dev`.
- Critical production mobile E2E runs without CI retries in production-server mode.
- Browser security headers include CSP, frame protection, MIME protection, referrer policy, permissions policy, and HSTS on the Vercel production deployment.
- Framework dependencies are upgraded to the audited Next.js 16.3.1 / React 19.2.8 line.
- Android version code/name can be supplied by CI properties instead of being permanently hardcoded.
- CI can build and validate an **unsigned release AAB** in addition to the debug APK. This validates release compilation before signing credentials are introduced.

## Intentionally supported deployment modes

### Local-only mobile mode

No Clerk or Convex variables are configured. Learner identity/profile/history remain device-local. Quiz answer keys remain server-only and the Vercel grading route performs authoritative checks/submission.

### Full cloud mode

All Clerk + Convex production variables are configured together. Partial configuration is rejected. Clerk/Convex dashboard setup and secrets are external account work and are not stored in the repository.

## Still requires external setup or physical-device work

- Configure Clerk + Convex only if cloud accounts/sync are desired.
- Create and securely store the Android upload key / configure Play App Signing before a Play upload.
- Complete Play Console app listing, Data Safety, content rating, app access, target audience, and policy declarations.
- Replace or approve final launcher/splash/store branding assets.
- Run real-device QA for Android back/predictive back, cold start, resume, process death, slow/offline networking, interrupted quiz submissions, safe areas, keyboard, and multiple Android versions/screen sizes.
- Decide whether the final store architecture should continue loading the Vercel app through Capacitor `server.url` or move to a bundled native web frontend. The current remote-WebView model remains an explicit release architecture decision.

## Release-candidate gate

Before calling a store candidate ready, all of the following should be green on the exact candidate commit:

1. `npm ci`
2. production dependency audit
3. typecheck
4. lint
5. unit tests
6. production build
7. production-server E2E
8. Capacitor Android sync
9. debug APK build
10. release AAB build
11. signed release AAB after upload-key setup
12. real-device QA
