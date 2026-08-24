import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";
import { INTELLECTX_PRIVACY_CONTACT_URL, INTELLECTX_PUBLIC_SITE_URL } from "@/lib/site-config";

export const metadata: Metadata = {
  title: "Privacy Policy - IntellectX",
  description: "How the current IntellectX Android learner app handles device-local and service data.",
};

export default function PrivacyPolicy() {
  return (
    <LegalPage
      title="Privacy Policy"
      description="This policy describes the data handling of the current IntellectX Android learner app and the web services it uses."
      effectiveDate="August 24, 2026"
      sections={[
        {
          title: "Current Android Release",
          body: [
            `The IntellectX Android learner app loads the production IntellectX service at ${INTELLECTX_PUBLIC_SITE_URL} through a Capacitor WebView over HTTPS. The native learner product provides selected courses, quizzes, past-paper practice, Progress, and Profile.`,
            "The current Android release is a free learner experience. Mobile payments, billing, flashcards, notes, instructor workspaces, and admin workspaces are outside the native learner product.",
          ],
        },
        {
          title: "Data Stored on This Device",
          body: [
            "In the current production mode, learner identity and study progress are device-local. The app can store the learner name and email entered for the local profile, selected courses, study preferences, quiz history, unfinished quiz state, past-paper progress, and related local study activity in the app WebView storage.",
            "Local learner data is isolated by the normalized learner identity used on that device. Logging out preserves that learner's local profile so the same learner can resume later, while the in-app Delete local profile & data action removes that learner's saved local study data.",
            "Android backup is disabled for the IntellectX app. Local app data is also removed when Android app data is cleared or the app is uninstalled.",
          ],
        },
        {
          title: "Data Sent to IntellectX Services",
          body: [
            "Vercel hosts the IntellectX web application and the server-side quiz-grading endpoint. Normal HTTPS requests necessarily send network and request information needed to deliver the service.",
            "For device-local learners, quiz checking sends the quiz ID, question ID, and selected answer index to the IntellectX server. Final quiz submission sends the quiz ID, a submission ID, and selected answer indexes. The current grading route does not send the learner's local name or email as part of that grading payload, returns no-store responses, and does not write those local-profile submissions to Convex learner records.",
            "Convex provides published learning content such as courses and Past Papers in the current production mode. Protected learner-owned Convex operations require verified account identity and fail closed when that identity is not available.",
          ],
        },
        {
          title: "Service Providers and Current Connections",
          body: [
            "The current Android release uses Vercel for application hosting and server-side quiz grading, and Convex for published learning content and related backend functions.",
            "The current production Android learner mode does not use Clerk account-backed learner identity and does not enable mobile payments. If a future release changes the services or data flows used by the Android app, this policy must be updated before that change is released.",
          ],
        },
        {
          title: "Security",
          body: [
            "The Android app is configured to use HTTPS for its production WebView and does not permit cleartext production traffic. The production web service also applies browser security headers including content security policy, frame protection, MIME protection, referrer policy, permissions policy, and HSTS.",
            "Production-like Convex environments reject browser-supplied local learner identity fallback by default. Protected learner mutations require verified identity rather than trusting an email address, local storage value, or query parameter as authentication.",
          ],
        },
        {
          title: "Retention and Deletion",
          body: [
            "Device-local learner data remains on the device until the learner deletes the local profile, Android app data is cleared, or the app is uninstalled. Logging out alone does not delete that learner's saved local study data.",
            "The current device-local quiz-grading route does not create a Convex learner attempt record. Hosting and backend providers may retain operational logs according to the configuration and retention rules of those services; IntellectX does not use this policy to claim a provider retention period that has not been verified.",
            "Published course and Past Paper records stored in Convex are learning-content records rather than the device-local learner profile described above.",
          ],
        },
        {
          title: "Your Choices",
          body: [
            "A learner can use the Profile screen to log out or to delete the current local profile and its saved study data. Clearing Android app data or uninstalling the app also removes device-local app data.",
            "Learners should avoid placing sensitive personal information into ordinary profile or support fields when it is not needed for the learning experience.",
          ],
        },
        {
          title: "Privacy Contact and Policy Updates",
          body: [
            `Privacy questions about the current IntellectX release can be raised through the project contact channel at ${INTELLECTX_PRIVACY_CONTACT_URL}. Because repository issues are public, do not include passwords, authentication tokens, private study records, or other sensitive personal information in a public issue.`,
            "This policy will be updated when the Android app's material data collection, storage, sharing, identity, or service-provider behavior changes.",
          ],
        },
      ]}
    />
  );
}
