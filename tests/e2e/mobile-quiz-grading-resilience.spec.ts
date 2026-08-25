import { expect, test } from "@playwright/test";

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
    window.sessionStorage.setItem("intellectx:native-launch-authenticated", "1");
  });
}

async function seedLocalLearner(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const selectedAt = Date.now();
    window.localStorage.setItem(
      "intellectx:learner-session",
      JSON.stringify({
        name: "Grading Learner",
        email: "grading.learner@intellectx.local",
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

async function openBundledMobileQuiz(page: import("@playwright/test").Page) {
  await page.goto(
    "/quiz/ai-study-systems-check?from=mobile&course=ai-study-systems&topic=prompting-for-learning",
  );
  await expect(page.getByRole("heading", { name: "AI Study Systems Check" })).toBeVisible();
}

test("local-profile quiz grading automatically retries transient connection failures", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLocalLearner(page);

  let gradingRequests = 0;
  await page.route("**/api/quiz-grading", async (route) => {
    gradingRequests += 1;
    if (gradingRequests < 3) {
      await route.abort("connectionfailed");
      return;
    }
    await route.continue();
  });

  await openBundledMobileQuiz(page);
  await page.getByRole("radio", { name: /Explain, question me, diagnose gaps/i }).click();
  await page.getByRole("button", { name: "Submit answer" }).click();

  await expect(page.getByText("Correct", { exact: true })).toBeVisible();
  expect(gradingRequests).toBe(3);
});

test("failed final submission preserves progress and retries with the same submission id", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLocalLearner(page);

  let failSubmissions = true;
  const submissionIds: string[] = [];
  await page.route("**/api/quiz-grading", async (route) => {
    const request = route.request();
    const payload = request.postDataJSON() as { action?: string; submissionId?: string };

    if (payload.action === "submit" && payload.submissionId) {
      submissionIds.push(payload.submissionId);
      if (failSubmissions) {
        await route.abort("connectionfailed");
        return;
      }
    }

    await route.continue();
  });

  await openBundledMobileQuiz(page);

  await page.getByRole("radio", { name: /Explain, question me, diagnose gaps/i }).click();
  await page.getByRole("button", { name: "Submit answer" }).click();
  await expect(page.getByText("Correct", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next question" }).click();

  await page.getByRole("radio", { name: /The original source material and your own retrieval attempt/i }).click();
  await page.getByRole("button", { name: "Submit answer" }).click();
  await expect(page.getByText("Correct", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Next question" }).click();

  await page.getByRole("radio", { name: /A small plan with priority topics/i }).click();
  await page.getByRole("button", { name: "Submit answer" }).click();
  await expect(page.getByText("Correct", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "See results" }).click();

  await expect(page.getByText(/Connection problem\. Your selected answer and quiz progress are still saved/i)).toBeVisible();
  await expect(page.getByRole("button", { name: "Try saving again" })).toBeVisible();
  expect(submissionIds).toHaveLength(3);
  expect(new Set(submissionIds).size).toBe(1);

  failSubmissions = false;
  await page.getByRole("button", { name: "Try saving again" }).click();

  await expect(page.getByText("100% score")).toBeVisible();
  expect(submissionIds).toHaveLength(4);
  expect(new Set(submissionIds).size).toBe(1);
});
