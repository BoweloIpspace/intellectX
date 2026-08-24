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
- Mobile Progress combines quiz results with completed and in-progress past-paper practice instead of reporting quizzes alone.
- Mobile Profile summarizes selected courses, quiz attempts, past-paper completion/in-progress state, study preferences, learner-session behavior, and Android build information.
- BGCSE Biology 0572/03 October/November 2019 is represented as seven ordered questions totaling 70 marks, with its 1h15 duration and 8-page metadata recorded in the database contract.
- Visual/source-dependent Biology 2019 questions include accessible digital source material before **Reveal answer** rather than relying on missing examination figures.
- Biology 2019 reconstructed artwork is explicitly labelled as an IntellectX study reconstruction; the app does not present reconstructed Q3/Q6 artwork or instructional model answers as an official examination facsimile/mark scheme.
- Past Papers have an admin-only CRUD workspace for paper metadata, publication state, question ordering, marks, source material, model answers, and explanations.
- Past Paper create/update/delete operations are protected by trusted Convex admin RBAC and recorded in the append-only audit log; paper deletion cascades to its question rows and records each destructive question deletion before the paper deletion.
- Admin-managed Past Paper visual references accept only safe app-relative paths and require an accessibility description whenever a visual asset path is stored.
- Past Paper records distinguish repository-controlled seed data from manual admin data using `seedManaged` provenance. Admin edits intentionally become manual records.
- Biology 2019 has an explicit deterministic release-seed entrypoint. Normal reconciliation is non-destructive; deliberate `reset: true` reconciliation removes canonical duplicates and stale Biology 2019 Paper 3 seed-managed/legacy rows while protecting manual records, other Biology years, other paper codes, and unrelated courses.
- Production environment validation supports intentional local-only, `mobile-local-convex`, or fully configured Clerk + Convex modes while rejecting partial Clerk configuration.
- Payments remain disabled for the free mobile product.
- CI runs typecheck, zero-warning lint, unit tests, a production dependency audit, a production build, and Playwright against `next start` rather than `next dev`.
- Critical production mobile E2E runs without CI retries in production-server mode.
- Browser security headers include CSP, frame protection, MIME protection, referrer policy, permissions policy, and HSTS on the Vercel production deployment.
- Framework dependencies are on the audited Next.js 16.3.1 / React 19.2.8 line.
- Android version code/name can be supplied by CI properties instead of being permanently hardcoded.
- CI builds and validates an unsigned release AAB in addition to the debug APK.
- Android emulator lifecycle instrumentation verifies activity recreation, orientation, cold process restart, production WebView rendering, Android Back, and relaunch behavior.
- Release workflows verify the Gradle-merged Android manifest against the explicit one-permission policy rather than trusting only the source manifest.
- A manual signed-release workflow is present and requires secret-backed upload-key material, explicit version code/name, Gradle fail-closed signing, signature verification, and keystore cleanup. It cannot produce a signed artifact until the upload key secrets are configured.
- A reusable release-candidate engineering workflow orchestrates web/test, debug APK, unsigned release AAB, and Android emulator lifecycle gates on the same Git ref.
- Android lifecycle automation also exercises the packaged offline error screen and recovery back to the production learner experience after connectivity returns.
- `docs/google-play-data-safety.md` records the current device-local, Vercel, Convex, permissions, deletion, and unresolved provider-retention evidence needed for the Play Data Safety declaration.

## Intentionally supported deployment modes

### Local-only mobile mode

No Clerk or Convex variables are configured. Learner identity/profile/history remain device-local. Quiz answer keys remain server-only and the Vercel grading route performs authoritative quiz checks/submission. DB-backed Past Papers are unavailable because no learning database is configured.

### Convex content + local learner mode

`NEXT_PUBLIC_CONVEX_URL` is configured while Clerk is intentionally absent. Learner-visible course and Past Paper content comes from Convex. Learner identity and progress remain device-local, and standard quiz grading uses the server-authoritative Vercel route. Protected learner-owned Convex mutations remain fail-closed.

### Full cloud mode

All Clerk + Convex production variables are configured together. Partial configuration is rejected. Clerk/Convex dashboard setup and secrets are external account work and are not stored in the repository.

## Still requires external setup or physical-device work

- After any release-hardening merge, verify separately that the intended Vercel production deployment is `READY` on the exact expected `main` SHA before calling that code live.
- Run the deterministic Past Paper release seed against the intended production Convex deployment only when an explicit production content audit proves that release content needs reconciliation. Code deployment alone is not a reason to seed or reset production data.
- Confirm that the existing production Convex target `bowelojay978:intellectx-61f15` is the intended permanent production account/project before freezing the Play candidate; do not rename or migrate it without proof.
- Configure Clerk + Convex only if cloud accounts/sync are desired. The admin Past Paper workspace requires a trusted authenticated admin identity when used outside non-production demo tooling.
- Create and securely store the Android upload key, configure the four signed-release secrets (`INTELLECTX_UPLOAD_KEYSTORE_BASE64`, store password, key alias, and key password), and enable/confirm Play App Signing before the first Play upload.
- Run the signed-release workflow with an explicit monotonic `versionCode` and intended `versionName`, then keep the resulting checksum with the exact candidate SHA.
- Complete the provider-retention/runtime-network verification listed in `docs/google-play-data-safety.md`, then complete Play Console Data Safety using the exact shipped behavior.
- Complete Play Console app listing, content rating, app access, target audience, and other policy declarations.
- Replace or approve final launcher/splash/store branding assets.
- Run real-device QA for Android Back/predictive Back, cold start, resume, process death, slow/offline networking, interrupted quiz submissions, safe areas, keyboard, and multiple Android versions/screen sizes.
- Keep the current remote-WebView release architecture decision explicit. The APK currently loads the production Vercel app through Capacitor `server.url`; moving to a bundled frontend would be a separate architecture change.
- If exact licensed/source-authenticated Biology 2019 Q3/Q6 examination artwork or an official marking scheme becomes available, replace the disclosed study adaptations through the Past Paper content-management workflow rather than silently changing provenance.

## Release-candidate gate

Before calling a store candidate ready, all of the following must be green on the exact candidate commit/ref:

1. `npm ci`
2. production dependency audit
3. typecheck
4. **zero-warning lint** (`--max-warnings=0`)
5. unit tests
6. production build
7. production-server E2E
8. Capacitor Android sync
9. debug APK build + merged-manifest policy check
10. unsigned release AAB build + merged-manifest policy check
11. Android emulator lifecycle/WebView/offline-recovery verification
12. signed release AAB built with the upload key and independently signature-verified
13. real-device QA on the signed candidate
14. Vercel production verification on the exact merged candidate SHA before declaring the web-backed app live
15. final Play Data Safety/provider-retention review against the exact signed artifact

The reusable `Release candidate engineering gate` covers repository-controlled gates 1–11. Gates 12–15 remain release operations that require signing secrets, physical/device or provider evidence, and/or post-merge production verification.
