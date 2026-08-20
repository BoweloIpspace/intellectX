# Mobile Production Readiness

Status date: 2026-08-20

Development branch: `mobile/quiz-scope-navigation`

## Product contract

The native IntellectX app is now defined as a **free, quiz-only learner experience**. The detailed contract lives in `docs/mobile-quiz-product-contract.md`.

Native navigation is limited to:

1. Home
2. Quizzes
3. Progress
4. Profile

Flashcards, notes, courses, dashboard, search, pricing, checkout, instructor, and admin surfaces are not part of the native product. Authentication continuation, onboarding, quiz detail routes, and legal routes remain allowed because they support the learner quiz flow.

## Scope and navigation work

- Restricts the native feature allowlist to quizzes only.
- Removes `/mobile-flashcards` from the native route allowlist.
- Adds quiz-focused `/mobile-progress` and `/mobile-profile` routes.
- Uses Home, Quizzes, Progress, and Profile as the native bottom navigation.
- Starts the Capacitor wrapper at `/mobile-study`.
- Redirects native web-only navigation back to mobile Home, while retaining the existing signed-in root restore behavior into the quiz library.
- Keeps quiz detail routes inside the mobile shell.
- Updates native onboarding copy to describe the quiz-only experience.
- Updates the packaged mobile connectivity error screen to retry at mobile Home.
- Adds unit and Playwright coverage for the quiz-only feature scope and four-tab native navigation.
- Preserves legacy browser-only preview routes without exposing them inside the native Capacitor runtime.

## Still required before store release

Completing product scope and navigation does not make the Android build store-ready. Remaining work includes authentication/device validation, production mobile architecture, Android build/signing, app assets, security hardening, release configuration, and real-device QA.

Validation still needs to include:

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm run test:unit`
- `npm run build`
- focused mobile Playwright tests
- full E2E suite
- Android `npx cap sync android`
- Android debug/release builds
- real-device checks for safe areas, back navigation, authentication, quizzes, progress, profile, offline/error behavior, and app resume

## Remaining architectural risk

`capacitor.config.ts` still uses `server.url` to load the deployed Vercel application. This remains a separate production architecture decision for the later mobile-release work and is not resolved by the scope/navigation milestone.
