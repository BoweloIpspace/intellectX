import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";

import config, {
  INTELLECTX_APP_ID,
  INTELLECTX_PRODUCTION_SERVER_URL,
  resolveCapacitorEnvironment,
  resolveCapacitorServerUrl,
} from "../../capacitor.config";

describe("Capacitor production configuration", () => {
  it("keeps the production shell pinned to the IntellectX package and HTTPS production host", () => {
    expect(INTELLECTX_APP_ID).toBe("com.intellectx.app");
    expect(config.appId).toBe(INTELLECTX_APP_ID);
    expect(config.webDir).toBe("public");
    expect(config.server?.url).toBe(INTELLECTX_PRODUCTION_SERVER_URL);
    expect(config.server?.cleartext).toBe(false);
    expect(config.server?.appStartPath).toMatch(/^\/login\?nativeShellVersion=/);
    expect(config.server?.errorPath).toMatch(/^mobile-error\.html\?nativeShellVersion=/);

    const startShellVersion = new URL(config.server?.appStartPath ?? "", INTELLECTX_PRODUCTION_SERVER_URL).searchParams.get(
      "nativeShellVersion",
    );
    const errorShellVersion = new URL(config.server?.errorPath ?? "", "https://localhost/").searchParams.get(
      "nativeShellVersion",
    );
    expect(errorShellVersion).toBe(startShellVersion);
  });

  it("defaults to production and rejects unknown environment names", () => {
    expect(resolveCapacitorEnvironment(undefined)).toBe("production");
    expect(resolveCapacitorEnvironment(" production ")).toBe("production");
    expect(resolveCapacitorEnvironment("development")).toBe("development");
    expect(() => resolveCapacitorEnvironment("preview")).toThrow(/Unsupported INTELLECTX_CAPACITOR_ENV/);
  });

  it("never lets production inherit a development server override", () => {
    expect(resolveCapacitorServerUrl("production", "https://dev.example.com")).toBe(INTELLECTX_PRODUCTION_SERVER_URL);
  });

  it("requires an explicit HTTPS development server", () => {
    expect(() => resolveCapacitorServerUrl("development", undefined)).toThrow(/DEV_SERVER_URL is required/);
    expect(() => resolveCapacitorServerUrl("development", "http://localhost:3000")).toThrow(/must use https/);
    expect(resolveCapacitorServerUrl("development", "https://preview.example.com/path")).toBe("https://preview.example.com");
  });

  it("keeps Android cleartext traffic disabled at both manifest and network-policy layers", () => {
    const manifest = readFileSync(resolve(process.cwd(), "android/app/src/main/AndroidManifest.xml"), "utf8");
    const networkPolicy = readFileSync(
      resolve(process.cwd(), "android/app/src/main/res/xml/network_security_config.xml"),
      "utf8",
    );

    expect(manifest).toContain('android:usesCleartextTraffic="false"');
    expect(manifest).toContain('android:networkSecurityConfig="@xml/network_security_config"');
    expect(networkPolicy).toContain('cleartextTrafficPermitted="false"');
    expect(networkPolicy).toContain('<certificates src="system" />');
  });
});
