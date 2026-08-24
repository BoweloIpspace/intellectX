import type { CapacitorConfig } from "@capacitor/cli";

const nativeShellVersion = process.env.INTELLECTX_VERSION_NAME?.trim() || "1.0.0";

const config: CapacitorConfig = {
  appId: "com.intellectx.app",
  appName: "IntellectX",
  webDir: "public",
  server: {
    url: "https://intellectx-lovat.vercel.app",
    cleartext: false,
    appStartPath: `/mobile-study?nativeShellVersion=${encodeURIComponent(nativeShellVersion)}`,
    errorPath: "mobile-error.html",
  },
};

export default config;
