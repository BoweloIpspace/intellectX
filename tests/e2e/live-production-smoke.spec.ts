import { expect, test } from "@playwright/test";

const liveProductionSmokeEnabled = process.env.LIVE_PRODUCTION_SMOKE === "true";
const expectedDeploymentSha = process.env.EXPECTED_DEPLOYMENT_SHA?.trim().toLowerCase();

test.skip(!liveProductionSmokeEnabled, "Live production smoke tests run only in the dedicated post-deploy workflow.");

async function simulateNativeAndroid(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    (window as Window & {
      Capacitor?: {
        isNativePlatform: () => boolean;
        getPlatform: () => string;
      };
    }).Capacitor = {
      isNativePlatform: () => true,
      getPlatform: () => "android",
    };
  });
}

async function seedLocalLearner(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const selectedAt = Date.now();
    window.localStorage.setItem(
      "intellectx:learner-session",
      JSON.stringify({
        name: "Release Smoke Learner",
        email: "release-smoke@example.com",
        role: "student",
      }),
    );
    window.localStorage.setItem(
      "intellectx:course-selection",
      JSON.stringify({
        selectedCourseIds: ["ai-study-systems"],
        selectedAt,
        gracePeriodEndsAt: selectedAt + 7 * 24 * 60 * 60 * 1000,
        lockedAt: null,
        locked: false,
      }),
    );
  });
}

test("live release-health exposes only the expected release contract", async ({ request }) => {
  expect(expectedDeploymentSha).toMatch(/^[0-9a-f]{40}$/);

  const response = await request.get(`/api/release-health?smoke=${Date.now()}`);
  expect(response.ok()).toBeTruthy();
  expect(response.headers()["cache-control"]).toContain("no-store");

  const body = await response.json();
  expect(body).toEqual({
    status: "ok",
    app: "IntellectX",
    commitSha: expectedDeploymentSha,
    productionUrl: "https://intellectx-lovat.vercel.app",
    mobileArchitecture: "remote-webview",
    mobileCommerceEnabled: false,
  });
});

test("fresh native production launch reaches device-local learner login", async ({ page }) => {
  await simulateNativeAndroid(page);
  await page.goto("/mobile-study");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("Continue on this device")).toBeVisible();
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveCount(0);
});

test("live native progress and profile remain inside the learner product", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLocalLearner(page);

  await page.goto("/mobile-progress");
  await expect(page.getByRole("heading", { name: "Study progress" })).toBeVisible();

  await page.goto("/mobile-profile");
  await expect(page.getByRole("heading", { name: "Learner profile" })).toBeVisible();
  await expect(page.getByText("Free mobile")).toBeVisible();
});

test("live native runtime rejects web-only admin, checkout, and flashcards routes", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLocalLearner(page);

  for (const path of ["/admin", "/checkout", "/mobile-flashcards"]) {
    await page.goto(path, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/mobile-study$/);
    await expect(page.getByText("Free mobile")).toBeVisible();
  }
});
