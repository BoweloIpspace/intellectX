import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function readSource(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

const productionUrl = "https://intellectx-lovat.vercel.app";
const staleProductionUrl = "https://intellect-x-coral.vercel.app";

const packageSource = readSource("package.json");
const siteConfigSource = readSource("src/lib/site-config.ts");
const capacitorSource = readSource("capacitor.config.ts");
const layoutSource = readSource("src/app/layout.tsx");
const sitemapSource = readSource("src/app/sitemap.ts");
const robotsSource = readSource("src/app/robots.ts");
const privacySource = readSource("src/app/(legal)/privacy-policy/page.tsx");
const legalPageSource = readSource("src/components/legal/legal-page.tsx");
const mobileStudyPageSource = readSource("src/app/mobile-study/page.tsx");
const mobileStudyHomeSource = readSource("src/components/education/mobile-study-home.tsx");
const mobileQuizzesPageSource = readSource("src/app/mobile-quizzes/page.tsx");
const mobileProgressPageSource = readSource("src/app/mobile-progress/page.tsx");
const mobileProfilePageSource = readSource("src/app/mobile-profile/page.tsx");
const featureScopeSource = readSource("src/lib/feature-scope.ts");
const androidBuildSource = readSource("android/app/build.gradle");
const androidReleaseWorkflowSource = readSource(".github/workflows/android-release-aab.yml");
const signedReleaseWorkflowSource = readSource(".github/workflows/android-signed-release-aab.yml");
const candidateGateWorkflowSource = readSource(".github/workflows/release-candidate-gate.yml");
const lifecycleWorkflowSource = readSource(".github/workflows/android-lifecycle.yml");
const manifestCheckerSource = readSource("scripts/check-android-manifest.mjs");
const mobileErrorSource = readSource("public/mobile-error.html");
const dataSafetySource = readSource("docs/google-play-data-safety.md");
const gitignoreSource = readSource(".gitignore");

describe("Google Play release-readiness contracts", () => {
  it("keeps public metadata aligned with the Capacitor production origin", () => {
    expect(siteConfigSource).toContain(`INTELLECTX_PUBLIC_SITE_URL = "${productionUrl}"`);
    expect(capacitorSource).toContain(`INTELLECTX_PRODUCTION_SERVER_URL = "${productionUrl}"`);

    for (const source of [siteConfigSource, layoutSource, sitemapSource, robotsSource, privacySource]) {
      expect(source).not.toContain(staleProductionUrl);
    }

    expect(layoutSource).toContain("new URL(INTELLECTX_PUBLIC_SITE_URL)");
    expect(layoutSource).toContain("url: INTELLECTX_PUBLIC_SITE_URL");
    expect(sitemapSource).toContain("`${INTELLECTX_PUBLIC_SITE_URL}${route}`");
    expect(robotsSource).toContain("`${INTELLECTX_PUBLIC_SITE_URL}/sitemap.xml`");
  });

  it("describes the actual native learner product instead of the retired quiz-only scope", () => {
    expect(mobileStudyPageSource).toContain("Mobile Study Home - IntellectX");
    expect(mobileStudyPageSource).toContain("past-paper practice experience");
    expect(mobileStudyHomeSource).not.toContain("quiz-only");
    expect(featureScopeSource).not.toContain("free quiz product");
    expect(mobileQuizzesPageSource).toContain("Practice quizzes and past papers");
    expect(mobileProgressPageSource).not.toContain(">Quiz progress<");
    expect(mobileProfilePageSource).not.toContain(">Quiz learner profile<");
    expect(mobileErrorSource).toContain("Your local study data remains on this device");
    expect(mobileErrorSource).not.toContain("Your local quiz data remains on this device");
  });

  it("keeps the Android privacy policy tied to the shipped data flow", () => {
    expect(privacySource).toContain('effectiveDate="August 24, 2026"');
    expect(privacySource).toContain("device-local");
    expect(privacySource).toContain("Vercel");
    expect(privacySource).toContain("Convex");
    expect(privacySource).toContain("Delete local profile & data");
    expect(privacySource).toContain('title: "Retention and Deletion"');
    expect(privacySource).toContain("does not use Clerk account-backed learner identity");
    expect(privacySource).toContain("does not enable mobile payments");
    expect(privacySource).toContain("INTELLECTX_PRIVACY_CONTACT_URL");
    expect(siteConfigSource).toContain("https://github.com/BoweloIpspace/intellectX/issues");
    expect(privacySource).not.toContain('title: "AI Features"');
    expect(privacySource).not.toContain('title: "Payments"');
    expect(privacySource).not.toContain("reviewed by a qualified legal professional");
    expect(legalPageSource).toContain('effectiveDate = "June 28, 2026"');
  });

  it("keeps Android release signing secret-driven and fail-closed when required", () => {
    expect(androidBuildSource).toContain("INTELLECTX_UPLOAD_STORE_FILE");
    expect(androidBuildSource).toContain("INTELLECTX_UPLOAD_STORE_PASSWORD");
    expect(androidBuildSource).toContain("INTELLECTX_UPLOAD_KEY_ALIAS");
    expect(androidBuildSource).toContain("INTELLECTX_UPLOAD_KEY_PASSWORD");
    expect(androidBuildSource).toContain("INTELLECTX_REQUIRE_RELEASE_SIGNING");
    expect(androidBuildSource).toContain("if (anyReleaseSigningValue && !releaseSigningConfigured)");
    expect(androidBuildSource).toContain("if (requireReleaseSigning && !releaseSigningConfigured)");
    expect(androidBuildSource).toContain("!uploadStoreFileRef.isFile()");
    expect(androidBuildSource).toContain("signingConfig signingConfigs.release");
    expect(androidBuildSource).not.toContain("signingConfig signingConfigs.debug");

    expect(androidReleaseWorkflowSource).toContain("Verify signed release fails closed without credentials");
    expect(androidReleaseWorkflowSource).toContain('INTELLECTX_REQUIRE_RELEASE_SIGNING: "true"');
    expect(androidReleaseWorkflowSource).toContain(
      "Signed Android release required, but upload-key credentials are not fully configured.",
    );

    expect(gitignoreSource).toContain("*.jks");
    expect(gitignoreSource).toContain("*.keystore");
    expect(gitignoreSource).toContain("android/keystore.properties");
    expect(gitignoreSource).toContain("android/signing.properties");
  });

  it("provides a manual signed-AAB path without putting signing material in source", () => {
    expect(signedReleaseWorkflowSource).toContain("workflow_dispatch");
    expect(signedReleaseWorkflowSource).not.toContain("pull_request:");
    expect(signedReleaseWorkflowSource).not.toContain("push:");
    expect(signedReleaseWorkflowSource).toContain("secrets.INTELLECTX_UPLOAD_KEYSTORE_BASE64");
    expect(signedReleaseWorkflowSource).toContain("secrets.INTELLECTX_UPLOAD_STORE_PASSWORD");
    expect(signedReleaseWorkflowSource).toContain("secrets.INTELLECTX_UPLOAD_KEY_ALIAS");
    expect(signedReleaseWorkflowSource).toContain("secrets.INTELLECTX_UPLOAD_KEY_PASSWORD");
    expect(signedReleaseWorkflowSource).toContain('INTELLECTX_REQUIRE_RELEASE_SIGNING: "true"');
    expect(signedReleaseWorkflowSource).toContain("base64 --decode");
    expect(signedReleaseWorkflowSource).toContain("keytool -list");
    expect(signedReleaseWorkflowSource).toContain("jarsigner -verify -strict");
    expect(signedReleaseWorkflowSource).toContain("Remove temporary signing files");
    expect(signedReleaseWorkflowSource).toContain('rm -f "$RUNNER_TEMP/intellectx-upload.jks"');
    expect(signedReleaseWorkflowSource).not.toContain("signingConfigs.debug");
  });

  it("orchestrates engineering gates and enforces a zero-warning lint budget", () => {
    expect(packageSource).toContain('"lint": "eslint . --max-warnings=0"');
    expect(candidateGateWorkflowSource).toContain("./.github/workflows/build-test.yml");
    expect(candidateGateWorkflowSource).toContain("./.github/workflows/android-debug-apk.yml");
    expect(candidateGateWorkflowSource).toContain("./.github/workflows/android-release-aab.yml");
    expect(candidateGateWorkflowSource).toContain("./.github/workflows/android-lifecycle.yml");
    expect(candidateGateWorkflowSource).toContain("Exact-ref engineering gates 1-11 are green.");
  });

  it("checks merged Android permissions and exercises offline recovery", () => {
    expect(manifestCheckerSource).toContain('new Set(["android.permission.INTERNET"])');
    expect(manifestCheckerSource).toContain("unexpected permission(s)");
    expect(androidReleaseWorkflowSource).toContain("Verify merged Android manifest policy");
    expect(lifecycleWorkflowSource).toContain("Verify offline fallback and network recovery");
    expect(lifecycleWorkflowSource).toContain("airplane-mode enable");
    expect(lifecycleWorkflowSource).toContain("airplane-mode disable");
    expect(lifecycleWorkflowSource).toContain("IntellectX is temporarily unavailable");
  });

  it("keeps Data Safety documentation evidence-based instead of claiming submission is complete", () => {
    expect(dataSafetySource).toContain("engineering evidence inventory");
    expect(dataSafetySource).toContain("not** a completed or submitted Google Play Data Safety declaration");
    expect(dataSafetySource).toContain("mobile-local-convex");
    expect(dataSafetySource).toContain("Vercel");
    expect(dataSafetySource).toContain("Convex");
    expect(dataSafetySource).toContain("provider request/log retention");
    expect(dataSafetySource).toContain("android.permission.INTERNET");
    expect(dataSafetySource).toContain("exact signed artifact");
    expect(dataSafetySource).toContain("support.google.com/googleplay/android-developer/answer/10787469");
  });
});
