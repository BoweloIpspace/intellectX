import { expect, test } from "@playwright/test";

async function simulateNativeAndroid(page: import("@playwright/test").Page, authorizeLaunch = false) {
  await page.addInitScript((authorized) => {
    (window as Window & {
      Capacitor?: {
        isNativePlatform: () => boolean;
        getPlatform: () => string;
      };
    }).Capacitor = {
      isNativePlatform: () => true,
      getPlatform: () => "android",
    };

    if (authorized) {
      window.sessionStorage.setItem("intellectx:native-launch-authenticated", "1");
    }
  }, authorizeLaunch);
}

async function seedCourseSelection(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const selectedAt = Date.now();
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

async function seedLearner(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "intellectx:learner-session",
      JSON.stringify({
        name: "Boundary Learner",
        email: "boundary.learner@intellectx.local",
        role: "student",
      }),
    );
  });
}

test("native learner launch authorization survives a full WebView reload", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedCourseSelection(page);
  await page.goto("/login");

  await page.getByLabel("Email").fill("persistent.learner@intellectx.local");
  await page.getByRole("button", { name: "Log in", exact: true }).click();
  await expect(page).toHaveURL(/\/mobile-study$/);
  await expect(page.getByRole("heading", { name: "Your courses" })).toBeVisible();

  await page.reload();

  await expect(page).toHaveURL(/\/mobile-study$/);
  await expect(page.getByRole("heading", { name: "Your courses" })).toBeVisible();
  await expect(page.getByText("Sign in to continue")).toHaveCount(0);
});

test("native logout clears the active learner session and returns to learner login", async ({ page }) => {
  await simulateNativeAndroid(page, true);
  await seedLearner(page);
  await seedCourseSelection(page);
  await page.goto("/mobile-profile");

  await expect(page.getByText("boundary.learner@intellectx.local")).toBeVisible();
  await page.getByRole("button", { name: "Logout" }).click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("Sign in to continue")).toBeVisible();
  await expect
    .poll(() => page.evaluate(() => window.localStorage.getItem("intellectx:learner-session")))
    .toBeNull();
  await expect
    .poll(() => page.evaluate(() => window.sessionStorage.getItem("intellectx:native-launch-authenticated")))
    .toBeNull();
});

test("native auth never exposes staff demo routing", async ({ page }) => {
  await simulateNativeAndroid(page);
  await page.goto("/login");

  await expect(page.getByText("Sign in to continue")).toBeVisible();
  await expect(page.getByText("Staff UI demo")).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Demo as Admin/i })).toHaveCount(0);
  await expect(page.getByRole("button", { name: /Demo as Instructor/i })).toHaveCount(0);
});

test("native runtime redirects staff and commerce web routes back to mobile Home", async ({ page }) => {
  await simulateNativeAndroid(page, true);
  await seedLearner(page);
  await seedCourseSelection(page);

  for (const pathname of ["/admin", "/instructor", "/pricing", "/checkout", "/subscription", "/billing"]) {
    await page.goto(pathname, { waitUntil: "domcontentloaded" });
    await expect(page).toHaveURL(/\/mobile-study$/);
    await expect(page.getByRole("heading", { name: "Your courses" })).toBeVisible();
  }
});

test("native learner screens contain no purchase or premium affordances", async ({ page }) => {
  await simulateNativeAndroid(page, true);
  await seedLearner(page);
  await seedCourseSelection(page);
  await page.goto("/mobile-study");

  await expect(page.getByRole("link", { name: "intellectX", exact: true })).toBeVisible();
  const mobileNav = page.getByRole("navigation", { name: "Mobile study navigation" });
  for (const tab of ["Home", "Infographies", "Quizzes", "Exams"]) {
    await expect(mobileNav.getByRole("link", { name: tab, exact: true })).toBeVisible();
  }
  await expect(page.getByText(/upgrade|premium|subscribe|subscription|checkout|restore purchase/i)).toHaveCount(0);

  await page.getByRole("link", { name: /AI Study Systems/i }).click();
  await expect(page.getByText(/upgrade|premium|subscribe|subscription|checkout|restore purchase/i)).toHaveCount(0);
});
