import type { CapacitorConfig } from "@capacitor/cli";

export const INTELLECTX_APP_ID = "com.intellectx.app";
export const INTELLECTX_PRODUCTION_SERVER_URL = "https://intellectx-lovat.vercel.app";

export type IntellectXCapacitorEnvironment = "production" | "development";

export function resolveCapacitorEnvironment(value = process.env.INTELLECTX_CAPACITOR_ENV): IntellectXCapacitorEnvironment {
  const normalized = value?.trim().toLowerCase();

  if (!normalized || normalized === "production") {
    return "production";
  }

  if (normalized === "development") {
    return "development";
  }

  throw new Error(`Unsupported INTELLECTX_CAPACITOR_ENV value: ${value}`);
}

export function resolveCapacitorServerUrl(
  environment: IntellectXCapacitorEnvironment,
  developmentUrl = process.env.INTELLECTX_CAPACITOR_DEV_SERVER_URL,
) {
  if (environment === "production") {
    return INTELLECTX_PRODUCTION_SERVER_URL;
  }

  const candidate = developmentUrl?.trim();
  if (!candidate) {
    throw new Error("INTELLECTX_CAPACITOR_DEV_SERVER_URL is required when INTELLECTX_CAPACITOR_ENV=development");
  }

  const parsed = new URL(candidate);
  if (parsed.protocol !== "https:") {
    throw new Error("INTELLECTX_CAPACITOR_DEV_SERVER_URL must use https");
  }

  return parsed.origin;
}

const nativeShellVersion = process.env.INTELLECTX_VERSION_NAME?.trim() || "1.0.0";
const capacitorEnvironment = resolveCapacitorEnvironment();
const serverUrl = resolveCapacitorServerUrl(capacitorEnvironment);
const encodedNativeShellVersion = encodeURIComponent(nativeShellVersion);

const config: CapacitorConfig = {
  appId: INTELLECTX_APP_ID,
  appName: "IntellectX",
  webDir: "public",
  server: {
    url: serverUrl,
    cleartext: false,
    appStartPath: `/mobile-study?nativeShellVersion=${encodedNativeShellVersion}`,
    errorPath: `mobile-error.html?nativeShellVersion=${encodedNativeShellVersion}`,
  },
};

export default config;
