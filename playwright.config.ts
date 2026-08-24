import { defineConfig, devices } from "@playwright/test";

const useProductionServer = process.env.PLAYWRIGHT_SERVER_MODE === "production";
const externalBaseUrl = process.env.PLAYWRIGHT_BASE_URL?.trim();
const useExternalServer = Boolean(externalBaseUrl);

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  workers: 1,
  retries: process.env.CI && !useProductionServer && !useExternalServer ? 2 : 0,
  reporter: "list",
  use: {
    baseURL: externalBaseUrl || "http://127.0.0.1:3005",
    trace: "on-first-retry",
  },
  webServer: useExternalServer
    ? undefined
    : {
        command: useProductionServer ? "npm run start -- -p 3005" : "npm run dev -- -p 3005",
        url: "http://127.0.0.1:3005",
        reuseExistingServer: !process.env.CI && !useProductionServer,
        timeout: 120_000,
      },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
});
