# IntellectX Mobile Quiz Product Contract

Status date: 2026-08-20

## Product promise

The native IntellectX mobile application is a **free, quiz-only learner product**.

The native app exists to help learners discover quizzes, answer questions, review feedback, see results, and track quiz practice over time. Monetization and the broader course-authoring platform are intentionally outside this mobile product surface.

## Native navigation

The native bottom navigation is fixed to four destinations:

1. **Home** — `/mobile-study`
2. **Quizzes** — `/mobile-quizzes` and `/quiz/...`
3. **Progress** — `/mobile-progress`
4. **Profile** — `/mobile-profile`

The Capacitor app starts on `/mobile-study`.

## Allowed native supporting routes

Authentication, onboarding, quiz detail, and required legal routes remain allowed because they support the quiz experience.

## Explicitly out of scope for native mobile

- Payments, checkout, subscriptions, premium access, and paid entitlements
- Flashcards
- Lesson notes and full lesson/course experiences
- Course selection and course management
- Instructor workspace
- Admin workspace
- Desktop dashboard/search/navigation

Those capabilities may continue to exist in the web application. They are not part of the native mobile app contract.

## Enforcement

- `src/lib/feature-scope.ts` is the authoritative native feature/route allowlist.
- `NativeMobileSurfaceBoundary` redirects web-only native navigation back to the mobile Home surface, while preserving the existing signed-in root restore path into the quiz library.
- `MobileAppShell` exposes only Home, Quizzes, Progress, and Profile in Capacitor.
- Unit and mobile Playwright coverage assert the quiz-only native contract.
