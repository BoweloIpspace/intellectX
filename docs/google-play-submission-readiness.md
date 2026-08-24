# Google Play submission readiness pack

Status date: 2026-08-24

This file prepares repository-grounded Google Play listing and review evidence. It is **not** evidence that a Play Console listing, declaration, review, or release has been submitted or approved.

## Prepared listing fields

Machine-readable copy lives in `docs/google-play-store-metadata.json`.

- App name: **IntellectX**
- Package: `com.intellectx.app`
- Category: **Education**
- Short description: **Practice quizzes and past papers with local progress tracking.**
- Privacy policy: `https://intellectx-lovat.vercel.app/privacy-policy`
- Support URL: `https://github.com/BoweloIpspace/intellectX/issues`

The full description is intentionally limited to behavior evidenced by the shipped Android learner product: device-local learner profiles, selected courses, quizzes, Past Papers, resume/progress/profile flows, server-authoritative standard quiz grading, answer-on-demand Past Papers, and no native billing/admin/instructor/flashcard/note surfaces.

## App access evidence for review

The native learner experience does not require a server account password. A reviewer can create a device-local learner profile with a name and email address and then choose courses. Admin and instructor workspaces are outside the Android learner product and are not review credentials for the native app.

Do not provide or invent production admin credentials in Play Console review instructions.

## Policy evidence already prepared

- Data handling and unresolved provider-retention evidence: `docs/google-play-data-safety.md`
- Privacy policy behavior: `/privacy-policy`
- Native route/product boundary: `src/lib/feature-scope.ts`
- Android permission policy: `scripts/check-android-manifest.mjs`
- Release signing workflow: `.github/workflows/android-signed-release-aab.yml`
- Release/rollback procedure: `docs/mobile-release-rollback.md`
- Exact live deployment evidence: `/api/release-health` plus `.github/workflows/live-production-smoke.yml`

## Fields that require owner/provider evidence before Play submission

These are intentionally **not guessed** in the repository:

1. Developer support email required by the Play listing.
2. Target audience / age-group selection.
3. Final content-rating questionnaire answers and resulting rating.
4. Final Data Safety answers after provider-retention/runtime-network verification is complete.
5. Play App Signing enrollment and upload-key configuration.
6. Final store screenshots, feature graphic, and store-asset approval.
7. Release track/tester selection and any account-specific testing requirements shown by Play Console.

## Submission rule

Only copy the prepared metadata into Play Console after the exact signed candidate, production deployment SHA, privacy/Data Safety evidence, and store assets all refer to the same release. If any shipped behavior changes, refresh this pack before submission.
