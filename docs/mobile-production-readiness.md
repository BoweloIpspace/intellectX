# Mobile Production Readiness

Status date: 2026-08-24

## Product contract

The native IntellectX app is a **free learner practice experience** with Home, Quizzes, Progress, and Profile navigation. Learners choose published courses and can use the quizzes and past papers available for those courses. Payments, flashcards, notes, full lesson consumption, instructor/admin workspaces, and desktop-only navigation remain outside the native product.

## Completed production-hardening work

- Native scope starts at `/mobile-study` and stays inside Home, Quizzes/Past Papers, Progress, and Profile.
- The Android target is API 36 and cleartext traffic is disabled.
- Android backups are disabled so device-local learner/profile/practice state is not copied by Android backup services.
- Native local learner profiles are labeled honestly as device-local and do not collect fake passwords.
- Local learner course selection, study preferences, quiz history, unfinished quiz state, and past-paper progress are isolated between normalized learner identities.
- Logging out preserves the same learner's local profile; confirmed profile deletion removes only that learner's local data.
- The native auth return path preserves selected quiz destinations and guards against pre-hydration form submission races.
- Selected learner-visible courses can expose quiz topics, Past Papers, or both.
- Standard quizzes preserve contextual Back navigation, restore unfinished checked state, use an absolute deadline, and resume from Home.
- Production quiz grading selects the backend from the trusted auth capability rather than merely from the presence of a Convex URL.
- Device-local learners use the Node-only `/api/quiz-grading` path with server-only answer keys, request validation, no-store responses, retryable transient failure handling, and stable submission IDs.
- Protected Convex learner grading and quiz-history hydration are reserved for verified Clerk + Convex learner identity. `ALLOW_LOCAL_USERKEY_FALLBACK` remains rejected by the production gate.
- Every bundled learner-visible mobile quiz is covered by a server-side authoritative answer/explanation contract.
- DB-backed past papers keep model answers out of the initial paper payload and request model answer/explanation only after **Reveal answer**.
- Past-paper question position, revealed-answer state, and completion are saved per local learner profile. Completed papers are not presented as unfinished Home resume activity.
- Mobile Progress now combines quiz results with completed and in-progress past-paper practice instead of reporting quizzes alone.
- Mobile Profile now summarizes selected courses, quiz attempts, past-paper completion/in-progress state, study preferences, learner-session behavior, and Android build information.
- BGCSE Biology 0572/03 October/November 2019 is represented as seven ordered questions totaling 70 marks, with its 1h15 duration and 8-page metadata recorded in the database contract.
- Visual/source-dependent Biology 2019 questions now include accessible digital source material before **Reveal answer** rather than relying on missing examination figures.
- Biology 2019 reconstructed artwork is explicitly labelled as an IntellectX study reconstruction; the app does not present reconstructed Q3/Q6 artwork or instructional model answers as an official examination facsimile/mark scheme.
- Production environment validation supports intentional local-only, `mobile-local-convex`, or fully configured Clerk + Convex modes while rejecting partial Clerk configuration.
- Payments must remain disabled for the free mobile product.
- CI runs typecheck, lint, unit tests, a production dependency audit, a production build, and Playwright against `next start` rather than `next dev`.
- Critical production mobile E2E runs without CI retries in production-server mode.
- Browser security headers include CSP, frame protection, MIME protection, referrer policy, permissions policy, and HSTS on the Vercel production deployment.
- Framework dependencies are on the audited Next.js 16.3.1 / React 19.2.8 line.
- Android version code/name can be supplied by CI properties instead of being permanently hardcoded.
- CI builds and validates an unsigned release AAB in addition to the debug APK.
- Android emulator lifecycle instrumentation verifies activity recreation, orientation, cold process restart, production WebView rendering, Android Back, and relaunch behavior.

## Intentionally supported deployment modes

### Local-only mobile mode

No Clerk or Convex variables are configured. Learner identity/profile/history remain device-local. Quiz answer keys remain server-only and the Vercel grading route performs authoritative quiz checks/submission. DB-backed Past Papers are unavailable because no learning database is configured.

### Convex content + local learner mode

`NEXT_PUBLIC_CONVEX_URL` is configured while Clerk is intentionally absent. Learner-visible course and Past Paper content comes from Convex. Learner identity and progress remain device-local, and standard quiz grading uses the server-authoritative Vercel route. Protected learner-owned Convex mutations remain fail-closed.

### Full cloud mode

All Clerk + Convex production variables are configured together. Partial configuration is rejected. Clerk/Convex dashboard setup and secrets are external account work and are not stored in the repository.

## Still requires external setup or physical-device work

- Promote the desired verified `main` commit to the intended Vercel production deployment when release deployment work resumes.
- Configure Clerk + Convex only if cloud accounts/sync are desired.
- Create and securely store the Android upload key / configure Play App Signing before a Play upload.
- Complete Play Console app listing, Data Safety, content rating, app access, target audience, and policy declarations.
- Replace or approve final launcher/splash/store branding assets.
- Run real-device QA for Android back/predictive back, cold start, resume, process death, slow/offline networking, interrupted quiz submissions, safe areas, keyboard, and multiple Android versions/screen sizes.
- Keep the current remote-WebView release architecture decision explicit. The APK currently loads the production Vercel app through Capacitor `server.url`; moving to a bundled frontend would be a separate architecture change.
- If exact licensed/source-authenticated Biology 2019 Q3/Q6 examination artwork or an official marking scheme becomes available, replace the disclosed study adaptations through the past-paper content-management workflow rather than silently changing provenance.

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
10. unsigned release AAB build
11. Android emulator lifecycle/WebView verification
12. signed release AAB after upload-key setup
13. real-device QA
