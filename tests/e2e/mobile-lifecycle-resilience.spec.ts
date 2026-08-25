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

async function seedLocalLearner(page: import("@playwright/test").Page, email = "lifecycle@intellectx.local") {
  await page.addInitScript((learnerEmail) => {
    window.localStorage.setItem(
      "intellectx:learner-session",
      JSON.stringify({ name: "Lifecycle Learner", email: learnerEmail, role: "student" }),
    );
  }, email);
}

async function seedCourseSelection(page: import("@playwright/test").Page, selectedCourseIds = ["ai-study-systems"]) {
  await page.addInitScript((courseIds) => {
    const selectedAt = Date.now();
    window.localStorage.setItem(
      "intellectx:course-selection",
      JSON.stringify({
        selectedCourseIds: courseIds,
        selectedAt,
        gracePeriodEndsAt: selectedAt + 7 * 24 * 60 * 60 * 1000,
        lockedAt: null,
        locked: false,
      }),
    );
  }, selectedCourseIds);
}

async function createLocalProfile(page: import("@playwright/test").Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("Email").fill(email);
  await page.getByRole("button", { name: "Log in", exact: true }).click();
}

test("corrupt session is discarded and orphaned course state is not inherited by the next learner", async ({ page }) => {
  await simulateNativeAndroid(page);
  await page.goto("/login");
  await page.evaluate(() => {
    window.localStorage.setItem("intellectx:learner-session", "{broken json");
    window.localStorage.setItem(
      "intellectx:course-selection",
      JSON.stringify({
        selectedCourseIds: ["ai-study-systems"],
        selectedAt: Date.now(),
        gracePeriodEndsAt: Date.now() + 7 * 24 * 60 * 60 * 1000,
        lockedAt: null,
        locked: false,
      }),
    );
  });

  await page.goto("/mobile-study");
  await expect(page).toHaveURL(/\/login\?native=1$/);

  await page.getByLabel("Email").fill("fresh-after-corruption@intellectx.local");
  await page.getByRole("button", { name: "Log in", exact: true }).click();

  await expect(page).toHaveURL(/\/mobile-quizzes\?setup=1$/);
  await expect(page.getByText("0 / 5 selected")).toBeVisible();
});

test("webview reload preserves the authorized learner and selected-course launch state", async ({ page }) => {
  await simulateNativeAndroid(page, true);
  await seedLocalLearner(page);
  await seedCourseSelection(page);

  await page.goto("/mobile-study");
  await expect(page.getByRole("link", { name: /AI Study Systems/i })).toBeVisible();

  await page.reload();

  await expect(page).toHaveURL(/\/mobile-study$/);
  await expect(page.getByRole("link", { name: /AI Study Systems/i })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile study navigation" })).toBeVisible();
});

test("mobile course navigation keeps browser-history Back inside the native Home flow", async ({ page }) => {
  await simulateNativeAndroid(page, true);
  await seedLocalLearner(page);
  await seedCourseSelection(page);

  await page.goto("/mobile-study");
  await page.getByRole("link", { name: /AI Study Systems/i }).click();
  await expect(page).toHaveURL(/\/mobile-quizzes\?course=ai-study-systems$/);

  await page.goBack();

  await expect(page).toHaveURL(/\/mobile-study$/);
  await expect(page.getByRole("heading", { name: "Your courses" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile study navigation" })).toBeVisible();
});

test("mobile shell remains usable across portrait and landscape viewport changes", async ({ page }) => {
  await simulateNativeAndroid(page, true);
  await seedLocalLearner(page);
  await seedCourseSelection(page);

  await page.setViewportSize({ width: 360, height: 740 });
  await page.goto("/mobile-study");
  await expect(page.getByRole("link", { name: /AI Study Systems/i })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile study navigation" })).toBeVisible();

  await page.setViewportSize({ width: 740, height: 360 });
  await expect(page.getByRole("link", { name: /AI Study Systems/i })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile study navigation" })).toBeVisible();
});

test("logging out preserves one local profile without exposing it to a different email", async ({ page }) => {
  await simulateNativeAndroid(page);
  await createLocalProfile(page, "profile-a@intellectx.local");
  await page.getByRole("button", { name: /AI Study Systems/i }).click();
  await page.getByRole("button", { name: "Continue to Home" }).click();
  await expect(page).toHaveURL(/\/mobile-study$/);

  await page.goto("/mobile-profile");
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await expect(page).toHaveURL(/\/login\?native=1$/);

  await createLocalProfile(page, "profile-b@intellectx.local");
  await expect(page).toHaveURL(/\/mobile-quizzes\?setup=1$/);
  await expect(page.getByText("0 / 5 selected")).toBeVisible();

  await page.goto("/mobile-profile");
  await page.getByRole("button", { name: "Logout", exact: true }).click();
  await createLocalProfile(page, "profile-a@intellectx.local");

  await expect(page).toHaveURL(/\/mobile-study$/);
  await expect(page.getByRole("link", { name: /AI Study Systems/i })).toBeVisible();
});

test("delete local profile requires confirmation and removes only that profile state", async ({ page }) => {
  await simulateNativeAndroid(page);
  await createLocalProfile(page, "delete-me@intellectx.local");
  await page.getByRole("button", { name: /AI Study Systems/i }).click();
  await page.getByRole("button", { name: "Continue to Home" }).click();

  await page.goto("/mobile-profile");
  await page.getByRole("button", { name: "Delete local profile & data" }).click();
  await expect(page.getByText("Delete this local profile and its study data?")).toBeVisible();
  await page.getByRole("button", { name: "Delete profile", exact: true }).click();
  await expect(page).toHaveURL(/\/login\?native=1$/);

  await createLocalProfile(page, "delete-me@intellectx.local");
  await expect(page).toHaveURL(/\/mobile-quizzes\?setup=1$/);
  await expect(page.getByText("0 / 5 selected")).toBeVisible();
});

test("known stale Android shell is visibly blocked and routed to the update-required screen", async ({ page }) => {
  await simulateNativeAndroid(page, true);
  await seedLocalLearner(page);
  await seedCourseSelection(page);

  await page.goto("/mobile-study?nativeShellVersion=0.9.9");

  await expect(page.getByRole("heading", { name: "IntellectX update required" })).toBeVisible();
  await expect(page).toHaveURL(/\/mobile-update-required$/);
  await expect(page.getByRole("navigation", { name: "Mobile study navigation" })).toBeHidden();
});

test("supported Android shell version is recorded and visible in Profile build information", async ({ page }) => {
  await simulateNativeAndroid(page, true);
  await seedLocalLearner(page);
  await seedCourseSelection(page);

  await page.goto("/mobile-study?nativeShellVersion=1.0.0");
  await expect(page.getByRole("heading", { name: "Your courses" })).toBeVisible();
  await page.goto("/mobile-profile");

  await expect(page.getByText("App build")).toBeVisible();
  await expect(page.getByText("1.0.0", { exact: true })).toBeVisible();
});
