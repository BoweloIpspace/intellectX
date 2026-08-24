import { INTELLECTX_PUBLIC_SITE_URL } from "@/lib/site-config";

export const INTELLECTX_MOBILE_ARCHITECTURE = "remote-webview" as const;

type ReleaseHealthEnv = {
  VERCEL_GIT_COMMIT_SHA?: string;
};

export type PublicReleaseHealth = {
  status: "ok";
  app: "IntellectX";
  commitSha: string | null;
  productionUrl: string;
  mobileArchitecture: typeof INTELLECTX_MOBILE_ARCHITECTURE;
  mobileCommerceEnabled: false;
};

function normalizeCommitSha(value: string | undefined) {
  const candidate = value?.trim().toLowerCase();
  return candidate && /^[0-9a-f]{40}$/.test(candidate) ? candidate : null;
}

export function getPublicReleaseHealth(
  env: ReleaseHealthEnv = { VERCEL_GIT_COMMIT_SHA: process.env.VERCEL_GIT_COMMIT_SHA },
): PublicReleaseHealth {
  return {
    status: "ok",
    app: "IntellectX",
    commitSha: normalizeCommitSha(env.VERCEL_GIT_COMMIT_SHA),
    productionUrl: INTELLECTX_PUBLIC_SITE_URL,
    mobileArchitecture: INTELLECTX_MOBILE_ARCHITECTURE,
    mobileCommerceEnabled: false,
  };
}
