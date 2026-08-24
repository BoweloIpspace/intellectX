# Mobile release rollback and recovery

Status date: 2026-08-24

## Release model

The shipped Android app is a Capacitor remote-WebView shell. A mobile release therefore has four independently versioned parts: the Android shell, the Vercel frontend/API deployment, the Convex backend deployment, and published learning content. Treat those parts separately during rollback; never use a content reset or authentication downgrade as a substitute for reverting the failing layer.

## Frontend/API rollback

1. Identify the exact failing Vercel production deployment SHA and the last known-good `READY` production deployment SHA.
2. Restore only a previously verified production deployment. Do not promote a PR preview or unknown workspace build merely because it is newer.
3. Verify `https://intellectx-lovat.vercel.app/api/release-health` reports the intended commit SHA.
4. Run the live-production smoke workflow against that SHA before declaring recovery complete.
5. Confirm the native learner boundary still excludes checkout, billing, admin/instructor, flashcards, and notes.

A frontend rollback does not change installed Android binaries. The packaged `mobile-error.html` fallback remains available when the remote frontend cannot load, and its retry path must continue to target only the fixed production origin.

## Android shell rollback

Google Play version codes are monotonic. Do not attempt to publish an older `versionCode` as a rollback. If the installed shell itself is defective, build a corrected shell from the last known-good native source with a **higher** version code, sign it with the same configured upload key, run the full release-candidate gate plus real-device QA, and publish it through the intended Play track.

Do not raise `MOBILE_MIN_SUPPORTED_SHELL_VERSION` until a verified replacement Android build is actually available to affected users. Legacy/versionless shells remain compatible unless a deliberate release decision says otherwise.

## Convex/backend rollback

- Prefer forward-compatible code fixes and additive migrations.
- Do not run seed/reset mutations merely because frontend code rolled back.
- Never use `ALLOW_LOCAL_USERKEY_FALLBACK` to recover access; production remains fail-closed.
- Run deterministic Past Paper reconciliation only after an explicit production content audit proves it is needed. Normal reconciliation must remain non-destructive; `reset: true` requires evidence and must preserve manual/unrelated records.

## Incident order

1. Stop further promotion of the failing candidate.
2. Determine which of the four release parts changed.
3. Restore or patch only that part using the rules above.
4. Re-run the relevant exact-SHA verification: repository engineering gate, live-production smoke, signed-artifact verification, and/or content audit.
5. Record the recovered SHA/version identifiers before resuming release work.

## Evidence required before calling a rollback complete

- exact Android version code/name when the shell changed;
- exact Vercel production commit SHA when the frontend/API changed;
- exact Convex deployment identity when backend code changed;
- content reconciliation result when published learning content changed;
- no production auth fallback or destructive seed/reset was introduced;
- live learner smoke checks are green after Vercel changes;
- real-device QA is repeated when the signed Android binary changes.
