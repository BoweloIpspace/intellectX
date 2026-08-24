import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";

function source(file: string) {
  return readFileSync(path.resolve(process.cwd(), file), "utf8");
}

describe("Capacitor mobile launch contract", () => {
  it("launches the production mobile surface at authentication with a versioned Android shell", () => {
    const capacitor = source("capacitor.config.ts");

    expect(capacitor).toContain(
      'export const INTELLECTX_PRODUCTION_SERVER_URL = "https://intellectx-lovat.vercel.app"',
    );
    expect(capacitor).toContain("resolveCapacitorServerUrl");
    expect(capacitor).toContain("url: serverUrl");
    expect(capacitor).toContain("appStartPath: `/login?nativeShellVersion=${encodedNativeShellVersion}`");
    expect(capacitor).toContain("errorPath: `mobile-error.html?nativeShellVersion=${encodedNativeShellVersion}`");
    expect(capacitor).toContain("cleartext: false");
    expect(capacitor).not.toContain("_vercel_share");
    expect(capacitor).not.toContain("wary-meerkat-937");
  });

  it("packages a bounded themed network-failure retry that returns to authentication", () => {
    const errorPage = source("public/mobile-error.html");

    expect(errorPage).toContain("You're offline.");
    expect(errorPage).toContain("intellectX");
    expect(errorPage).toContain('const productionOrigin="https://intellectx-lovat.vercel.app"');
    expect(errorPage).toContain('new URL("/login",productionOrigin)');
    expect(errorPage).toContain('errorParams.get("nativeShellVersion")');
    expect(errorPage).toContain("const maxProbeAttempts=5");
    expect(errorPage).toContain("await fetch(probeUrl");
    expect(errorPage).toContain("window.location.replace(productionLoginUrl.toString())");
    expect(errorPage).toContain("Try again");
  });
});
