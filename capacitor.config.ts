import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.intellectx.app",
  appName: "IntellectX",
  webDir: "public",
  server: {
    url: "https://intellectx-git-mobile-bi-1b52c3-medicalappmedapp-6162s-projects.vercel.app",
    cleartext: false,
    appStartPath: "/mobile-study?_vercel_share=DRcOr5js9xLHCh9VIRycevmZyd4Uttq2",
    errorPath: "mobile-error.html",
  },
};

export default config;
