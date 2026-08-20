import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.intellectx.app",
  appName: "IntellectX",
  webDir: "public",
  server: {
    url: "https://intellectx-lovat.vercel.app",
    cleartext: false,
    appStartPath: "/mobile-study",
    errorPath: "mobile-error.html",
  },
};

export default config;
