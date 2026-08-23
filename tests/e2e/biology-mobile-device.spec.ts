import { expect, test } from "@playwright/test";

test("native learner can open Biology 2019 Paper 3 and reveal an answer", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "Capacitor", {
      configurable: true,
      value: {
        isNativePlatform: () => true,
        getPlatform: () => "android",
      },
    });

    const now = Date.now();
    window.localStorage.setItem(
      "intellectx:learner-session",
      JSON.stringify({ name: "Device Tester", email: "device-test@intellectx.local", role: "student" }),
    );
    window.localStorage.setItem(
      "intellectx:course-selection",
      JSON.stringify({
        selectedCourseIds: ["bgcse-biology"],
        selectedAt: now,
        gracePeriodEndsAt: now + 7 * 24 * 60 * 60 * 1000,
        lockedAt: null,
        locked: false,
      }),
    );
  });

  await page.goto("/mobile-study");
  await expect(page.getByText("BGCSE Biology", { exact: true })).toBeVisible({ timeout: 20_000 });

  await page.getByText("BGCSE Biology", { exact: true }).click();
  await expect(page.getByText("Past Papers", { exact: true })).toBeVisible({ timeout: 20_000 });

  await page.getByText("Past Papers", { exact: true }).click();
  await expect(page.getByText("2019 Paper 3", { exact: true })).toBeVisible({ timeout: 20_000 });

  await page.getByText("2019 Paper 3", { exact: true }).click();
  await expect(page.getByRole("button", { name: "Reveal answer" })).toBeVisible({ timeout: 20_000 });

  await page.getByRole("button", { name: "Reveal answer" }).click();
  await expect(page.getByText("Model answer", { exact: true })).toBeVisible();
  await expect(page.getByText("Question 1", { exact: true })).toBeVisible();
});
