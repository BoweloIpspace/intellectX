# IntellectX mobile runtime architecture

## Current release decision

The Android app remains a **Capacitor remote-WebView shell** for the current mobile release. It loads the production mobile frontend from `https://intellectx-lovat.vercel.app` and starts at `/mobile-study`.

This is deliberate for the current codebase because the mobile product still depends on Next.js server routes and the production deployment environment. Converting the app to a fully bundled/offline Capacitor frontend would be a separate architecture project, not a release hardening patch.

## What constitutes a mobile release

An Android binary alone does not freeze the React/Next.js frontend. A release therefore has four independently identifiable pieces:

1. Android shell version (`INTELLECTX_VERSION_NAME`).
2. Production frontend version/build SHA.
3. Production Convex backend deployment.
4. Production learning-content/database revision.

The Android shell announces its version in `appStartPath` using `nativeShellVersion`. The frontend stores that version and can route known-incompatible shells to `/mobile-update-required`. The Profile screen exposes non-secret frontend and shell build metadata for support/debugging.

Legacy APKs created before the shell-version handshake are treated as compatible for now so an existing installed app is not remotely bricked before a replacement APK is distributed. New versioned shells can be retired by raising `MOBILE_MIN_SUPPORTED_SHELL_VERSION` only after a replacement build is available.

## Local learner identity decision

The current mobile release uses **device-local learner profiles**, not cloud accounts. A normalized email is the stable local profile identifier. Clerk remains an optional future/full-cloud mode and must not be partially configured.

Multiple local learner profiles on one device are supported. On logout, the active learner's course selection, academic profile, quiz history, and lesson progress are snapshotted under that learner's normalized local identity. Entering the same email restores that learner's data; entering another email starts/restores a separate local profile.

Deleting a local profile is distinct from logout:

- **Logout** preserves that profile's isolated study data on the device.
- **Delete local profile & data** removes only the current profile's local study data and active session.

No local profile should be described as a verified online account, and local learner keys must not be trusted by protected production Convex mutations.

## Launch and recovery contract

The native shell always begins at `/mobile-study`. The mobile frontend then owns these decisions:

- no learner session → `/login`
- learner session but no selected courses → `/mobile-quizzes?setup=1`
- learner session with selected courses → mobile Home
- native navigation to a web-only route → mobile Home/course setup
- known unsupported Android shell → `/mobile-update-required`

Malformed local learner sessions are discarded rather than crashing. App reload/process recreation should recover from the persisted local session and learner data. Network/bootstrap failure is handled by Capacitor's packaged `mobile-error.html` page.

## Release verification implication

Because the frontend is remote, Android APK compilation is not sufficient evidence that the user-visible mobile product works. A production release gate must verify the live production frontend/backend flow as well as the Android shell. Browser-based Capacitor simulation is useful for route logic, while Android emulator/device checks are still needed for WebView lifecycle, process recreation, Back behavior, and configuration changes.
