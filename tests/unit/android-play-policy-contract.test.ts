import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { describe, expect, it } from "vitest";

const root = process.cwd();
const manifestPath = path.join(root, "android/app/src/main/AndroidManifest.xml");
const checkerPath = path.join(root, "scripts/check-android-manifest.mjs");

function runChecker(targetPath: string) {
  return spawnSync(process.execPath, [checkerPath, targetPath], {
    cwd: root,
    encoding: "utf8",
  });
}

describe("Android Google Play policy contract", () => {
  it("allows only the INTERNET permission and keeps release security flags fail-closed", () => {
    const result = runChecker(manifestPath);
    expect(result.status, result.stderr).toBe(0);
    expect(result.stdout).toContain("Permissions: android.permission.INTERNET");

    const variables = readFileSync(path.join(root, "android/variables.gradle"), "utf8");
    const capacitor = readFileSync(path.join(root, "capacitor.config.ts"), "utf8");
    const networkPolicy = readFileSync(
      path.join(root, "android/app/src/main/res/xml/network_security_config.xml"),
      "utf8",
    );

    expect(variables).toContain("targetSdkVersion = 36");
    expect(variables).toContain("compileSdkVersion = 36");
    expect(capacitor).toContain('INTELLECTX_APP_ID = "com.intellectx.app"');
    expect(networkPolicy).toContain('cleartextTrafficPermitted="false"');
  });

  it("rejects an unexpected dangerous or unrelated permission", () => {
    const directory = mkdtempSync(path.join(tmpdir(), "intellectx-manifest-"));
    try {
      const source = readFileSync(manifestPath, "utf8");
      const mutated = source.replace(
        "</manifest>",
        '    <uses-permission android:name="android.permission.CAMERA" />\n</manifest>',
      );
      const mutatedPath = path.join(directory, "AndroidManifest.xml");
      writeFileSync(mutatedPath, mutated);

      const result = runChecker(mutatedPath);
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain("unexpected permission(s): android.permission.CAMERA");
    } finally {
      rmSync(directory, { recursive: true, force: true });
    }
  });
});
