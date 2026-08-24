import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function readSource(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

const productionUrl = "https://intellectx-lovat.vercel.app";
const staleProductionUrl = "https://intellect-x-coral.vercel.app";

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

    expect(gitignoreSource).toContain("*.jks");
    expect(gitignoreSource).toContain("*.keystore");
    expect(gitignoreSource).toContain("android/keystore.properties");
    expect(gitignoreSource).toContain("android/signing.properties");
  });
});
