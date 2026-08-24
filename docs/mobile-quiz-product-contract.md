# IntellectX Mobile Learner Product Contract

Status date: 2026-08-24

## Product promise

The native IntellectX mobile application is a **free learner practice product** built around selected courses, quizzes, past papers, progress, and a learner profile.

The native app exists to help learners choose the courses they are studying, open the practice available for those courses, answer standard quizzes with authoritative grading, work through DB-backed past papers with answer-on-demand reveal, resume unfinished practice, review progress, and keep study data isolated to the active learner profile.

Monetization and the broader course-authoring platform remain outside the native mobile product surface.

## Native navigation

The native bottom navigation is fixed to four destinations:

1. **Home** — `/mobile-study`
2. **Quizzes** — `/mobile-quizzes`, `/quiz/...`, `/mobile-past-papers`, and `/mobile-past-papers/...`
3. **Progress** — `/mobile-progress`
4. **Profile** — `/mobile-profile`

The Capacitor app starts on `/mobile-study`.

## Native course and practice flow

- New learners choose from learner-visible published courses before entering Home.
- Home shows only the learner's selected available courses.
- A selected course can expose quiz topics, Past Papers, or both.
- Standard quiz answer checks and final scoring are authoritative and never trust browser answer keys.
- Past-paper prompts load without model answers. A model answer and explanation are requested only after **Reveal answer**.
- Unfinished quizzes and past papers can resume on the same learner profile.
- Completed past papers are saved as completed practice and are not offered as unfinished Home resume activity.
- Progress includes quiz results and past-paper completion/in-progress state.
- Profile exposes the current learner session, the study data saved for that learner, study preferences, and Android build information.

## Allowed native supporting routes

Authentication, onboarding/course setup, quiz detail, past-paper detail, and required legal/update routes remain allowed because they support the learner practice experience.

## Explicitly out of scope for native mobile

- Payments, checkout, subscriptions, premium access, and paid entitlements
- Flashcards
- Lesson notes and full lesson/video consumption
- Course authoring or course-management workspaces
- Instructor workspace
- Admin workspace
- Desktop dashboard/search/navigation

Those capabilities may continue to exist in the web application. They are not part of the native mobile app contract.

## Data and identity boundary

- The current mobile release supports device-local learner profiles when Clerk is intentionally absent.
- Local learner course selection, quiz history, unfinished quiz state, past-paper progress, and study preferences are isolated by normalized learner identity on the device.
- Logging out preserves the local profile for the same learner email; deleting a local profile removes only that profile's device-local data.
- Public learner content may come from Convex in `mobile-local-convex` mode, while protected learner-owned Convex mutations continue to require verified cloud identity.
- `ALLOW_LOCAL_USERKEY_FALLBACK` must remain disabled in production.

## Enforcement

- `src/lib/feature-scope.ts` is the authoritative native feature/route allowlist.
- `NativeMobileSurfaceBoundary` redirects web-only native navigation back to mobile Home.
- `MobileAppShell` exposes only Home, Quizzes, Progress, and Profile in Capacitor.
- `src/lib/mobile-study-state.ts` owns resumable quiz/past-paper practice state.
- `src/lib/local-learner-profile-data.ts` keeps learner-local study data isolated across local profiles.
- Unit, Playwright, Android build, and emulator lifecycle coverage enforce the native contract.
