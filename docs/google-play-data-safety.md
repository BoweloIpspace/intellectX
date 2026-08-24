# Google Play Data Safety Engineering Inventory

Status date: 2026-08-24

This document is an engineering evidence inventory for the current IntellectX Android release. It is **not** a completed or submitted Google Play Data Safety declaration. The final Play Console answers must be checked against the exact signed artifact, current production configuration, provider retention settings, and Google Play's then-current definitions before submission.

## Release scope

- Android package: `com.intellectx.app`
- Native architecture: Capacitor remote production WebView over HTTPS
- Production site: `https://intellectx-lovat.vercel.app`
- Current production mode: `mobile-local-convex`
- Learner identity and progress: device-local
- Published learning content: Convex
- Device-local quiz grading: same-origin Vercel server route `/api/quiz-grading`
- Clerk-backed learner identity: not configured in the current production mobile mode
- Mobile payments: disabled

Google Play treats data transmitted from an app-controlled WebView and data transmitted by SDKs/libraries as part of the app's data handling. On-device-only processing is different from off-device transmission, so this inventory separates those paths explicitly.

## Data-flow inventory

| Data element | Current storage / processing | Leaves the device? | Current destination and purpose | Evidence / caveat |
| --- | --- | --- | --- | --- |
| Local learner name and email | WebView local storage/profile snapshot | Not sent by the device-local quiz-grading payload | Used to distinguish local learner profiles on that device | Local profile code stores snapshots by learner key; the grading route does not read name or email. Ordinary provider network metadata is separate from these profile fields. |
| Selected courses and study preferences | Device-local WebView storage | Content request identifiers may be sent when the app asks for the selected published content | Convex content queries | Do not describe these local profile fields as cloud-synced learner records in the current mode. |
| Quiz history and unfinished quiz state | Device-local WebView storage | Selected answer indexes are transmitted for authoritative grading | Vercel `/api/quiz-grading` | The route uses `Cache-Control: no-store`; local-profile submissions are not written to Convex learner-attempt records by this route. Provider request/log retention still needs external verification. |
| Quiz check request | Processed server-side | Yes | Vercel grading route | Request contains quiz ID, question ID, and selected answer index. |
| Final quiz submission | Processed server-side | Yes | Vercel grading route | Request contains quiz ID, submission ID, and selected answer indexes. |
| Past-paper progress and revealed-answer state | Device-local WebView storage | Published paper/question identifiers are used to request content | Convex | Model answer/explanation is requested only after the learner explicitly chooses **Reveal answer**. |
| Published course and Past Paper content | Convex backend | Yes, content is returned to the app | Convex | These are learning-content records, not the device-local learner profile. |
| IP address, user agent, request timing, and similar transport/operational metadata | May be observed by hosting/backend providers during HTTPS requests | Yes, by nature of network delivery | Vercel and Convex service operation/security | Exact logging, retention, and Play Data Safety classification are provider/configuration facts that must be verified before final declaration. Do not invent a retention period. |

## Device-local keys currently covered by profile deletion

The local profile isolation/deletion layer currently covers:

- `intellectx:course-selection`
- `intellectx:academic-profile`
- `intellectx:quiz-attempt-history`
- `intellectx:lesson-progress-history`
- `intellectx:mobile-study-activity`
- `intellectx:past-paper-progress`
- `intellectx:quiz-progress`
- the learner-specific `intellectx:local-profile-data:<user-key>` snapshot

Logging out preserves the same learner's local snapshot. **Delete local profile & data**, clearing Android app data, or uninstalling the app removes the applicable device-local learner data. Android backup is disabled.

## Android permissions and platform storage

The source manifest requests one Android platform permission:

- `android.permission.INTERNET` — required for the production remote WebView and backend requests.

AndroidX Core also adds the app-private `com.intellectx.app.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION` to the Gradle-merged manifest, together with a `signature`-level declaration. This is an application-scoped compatibility permission used for non-exported dynamic receivers; it is not a request for camera, location, contacts, microphone, storage, or another Android platform capability. CI allowlists it only when the expected signature-level declaration is present.

The release contract also requires:

- `android:allowBackup="false"`
- `android:usesCleartextTraffic="false"`
- a network-security policy with `cleartextTrafficPermitted="false"`
- `FileProvider` not exported

CI checks both the source manifest and the Gradle-merged manifest so an SDK or dependency cannot silently add a new platform permission without failing the release gate.

## Third-party / service-provider review

### Vercel

Used for the production Next.js application and the same-origin quiz-grading endpoint. The final Data Safety declaration must verify the project's actual request/log retention configuration and any platform processing that qualifies under Google's definitions.

### Convex

Used for published course and Past Paper content and related backend functions. In `mobile-local-convex` mode, protected learner-owned mutations remain fail-closed because verified Clerk identity is not available. Final Play answers must still account for request/transport metadata and current Convex operational retention behavior.

### Clerk

`@clerk/nextjs` exists in the repository for supported cloud-auth configurations, but current production mobile logs show Clerk publishable/secret/JWT issuer values are absent. The current Android learner release therefore does not use Clerk account-backed learner identity. Reassess Data Safety before enabling Clerk in production.

### Paddle

`@paddle/paddle-js` exists for the web product, but the native Android learner boundary excludes checkout/billing and the current production mobile release keeps payments disabled. Before Play submission, verify the final native runtime does not initiate Paddle collection on learner routes.

### Other SDKs/libraries

Before submission, inspect the exact signed artifact and runtime traffic for any analytics, crash reporting, advertising, attribution, push, or other SDK collection. Do not infer "no collection" solely from package names or source-manifest permissions.

## Play declaration decision points still requiring external verification

Before filling the Play Console form, verify and record:

1. Vercel production request/log retention and whether any optional analytics/logging products are enabled.
2. Convex production request/operational log behavior and retention relevant to the shipped app.
3. Runtime network traffic from the exact signed AAB on a physical Android device or Play pre-launch environment.
4. That Clerk and Paddle remain inactive on the shipped native learner routes unless the policy and Data Safety declaration are updated first.
5. Whether any newly added SDK contributes collection or sharing beyond the flows documented here.
6. The final Google Play classification for quiz interactions and provider transport metadata, including whether any qualifying processing is ephemeral and whether service-provider transfers count as sharing under the current Play definitions.
7. That the public Privacy Policy and Play Data Safety answers describe the same release behavior.

## Source-of-truth references

Repository evidence:

- `src/app/api/quiz-grading/route.ts`
- `src/lib/local-learner-profile-data.ts`
- `src/app/(legal)/privacy-policy/page.tsx`
- `android/app/src/main/AndroidManifest.xml`
- `android/app/src/main/res/xml/network_security_config.xml`
- `capacitor.config.ts`
- `src/lib/feature-scope.ts`

External policy reference to re-check at submission time:

- Google Play Data Safety guidance: `https://support.google.com/googleplay/android-developer/answer/10787469`
- AndroidX Core merged-manifest source for the private receiver permission: `https://android.googlesource.com/platform/prebuilts/sdk/+/refs/heads/main/current/androidx/manifests/androidx.core_core/AndroidManifest.xml`

Because Google Play policy and provider behavior can change independently of this repository, this document must remain an evidence input rather than a substitute for final Play Console verification.
