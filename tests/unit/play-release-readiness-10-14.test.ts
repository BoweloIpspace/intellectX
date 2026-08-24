import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

import { getPublicReleaseHealth } from "@/lib/release-health";

function source(relativePath: string) {
  return readFileSync(path.join(process.cwd(), relativePath), "utf8");
}

const manifest = source("android/app/src/main/AndroidManifest.xml");
const launcherBackground = source("android/app/src/main/res/values/ic_launcher_background.xml");
const adaptiveLauncher = source("android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml");
const adaptiveRoundLauncher = source("android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml");
const legacyLauncher = source("android/app/src/main/res/mipmap-anydpi/ic_launcher.xml");
const launchScreen = source("android/app/src/main/res/drawable/intellectx_launch_screen.xml");
const rollbackRunbook = source("docs/mobile-release-rollback.md");
const liveWorkflow = source(".github/workflows/live-production-smoke.yml");
const playwrightConfig = source("playwright.config.ts");
const liveSmokeSpec = source("tests/e2e/live-production-smoke.spec.ts");
const storePack = source("docs/google-play-submission-readiness.md");
const storeMetadata = JSON.parse(source("docs/google-play-store-metadata.json")) as {
  appName: string;
  packageName: string;
  category: string;
  shortDescription: string;
  fullDescription: string;
  privacyPolicyUrl: string;
  supportUrl: string;
};

describe("Google Play release-readiness items 10-14", () => {
  it("uses IntellectX launcher and splash resources across legacy and adaptive Android launchers", () => {
    expect(manifest).toContain('android:icon="@mipmap/ic_launcher"');
    expect(manifest).toContain('android:roundIcon="@mipmap/ic_launcher_round"');
    expect(manifest).not.toContain('android:icon="@drawable/intellectx_app_icon"');
    expect(launcherBackground).toContain("#0F172A");
    expect(adaptiveLauncher).toContain('@drawable/intellectx_splash_mark');
    expect(adaptiveRoundLauncher).toContain('@drawable/intellectx_splash_mark');
    expect(legacyLauncher).toContain("#22D3EE");
    expect(launchScreen).toContain("#0F172A");
    expect(launchScreen).toContain("@drawable/intellectx_splash_mark");
  });

  it("documents layer-specific rollback without weakening production auth or resetting content", () => {
    expect(rollbackRunbook).toContain("Capacitor remote-WebView shell");
    expect(rollbackRunbook).toContain("last known-good `READY` production deployment SHA");
    expect(rollbackRunbook).toContain("higher** version code");
    expect(rollbackRunbook).toContain("Do not run seed/reset mutations merely because frontend code rolled back");
    expect(rollbackRunbook).toContain("Never use `ALLOW_LOCAL_USERKEY_FALLBACK`");
    expect(rollbackRunbook).toContain("real-device QA is repeated when the signed Android binary changes");
  });

  it("exposes a minimal public release-health contract without accepting an invalid build SHA", () => {
    const validSha = "a".repeat(40);
    expect(getPublicReleaseHealth({ ...process.env, VERCEL_GIT_COMMIT_SHA: validSha })).toEqual({
      status: "ok",
      app: "IntellectX",
      commitSha: validSha,
      productionUrl: "https://intellectx-lovat.vercel.app",
      mobileArchitecture: "remote-webview",
      mobileCommerceEnabled: false,
    });
    expect(getPublicReleaseHealth({ ...process.env, VERCEL_GIT_COMMIT_SHA: "not-a-sha" }).commitSha).toBeNull();
  });

  it("adds an exact-SHA live production smoke gate without starting a local server", () => {
    expect(playwrightConfig).toContain("PLAYWRIGHT_BASE_URL");
    expect(playwrightConfig).toContain("useExternalServer");
    expect(liveWorkflow).toContain("https://intellectx-lovat.vercel.app");
    expect(liveWorkflow).toContain("EXPECTED_DEPLOYMENT_SHA");
    expect(liveWorkflow).toContain("wait-for-live-production.mjs");
    expect(liveWorkflow).toContain("live-production-smoke.spec.ts");
    expect(liveSmokeSpec).toContain("release-health exposes only the expected release contract");
    expect(liveSmokeSpec).toContain("live native Home exposes the selected course catalog");
    expect(liveSmokeSpec).toContain('["/admin", "/checkout", "/mobile-flashcards"]');
  });

  it("keeps the prepared Play listing factual and explicitly separates external owner decisions", () => {
    expect(storeMetadata.appName).toBe("IntellectX");
    expect(storeMetadata.packageName).toBe("com.intellectx.app");
    expect(storeMetadata.category).toBe("Education");
    expect(storeMetadata.shortDescription.length).toBeLessThanOrEqual(80);
    expect(storeMetadata.fullDescription.length).toBeLessThanOrEqual(4000);
    expect(storeMetadata.privacyPolicyUrl).toBe("https://intellectx-lovat.vercel.app/privacy-policy");
    expect(storeMetadata.supportUrl).toBe("https://github.com/BoweloIpspace/intellectX/issues");
    expect(storePack).toContain("not** evidence that a Play Console listing, declaration, review, or release has been submitted or approved");
    expect(storePack).toContain("Developer support email required by the Play listing");
    expect(storePack).toContain("Target audience / age-group selection");
    expect(storePack).toContain("Final Data Safety answers");
    expect(storePack).not.toContain("Play Console submission is complete");
  });
});
