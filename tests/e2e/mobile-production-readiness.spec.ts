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
  });
}

async function seedLocalLearner(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "intellectx:learner-session",
      JSON.stringify({
        name: "Mobile Learner",
        email: "mobile.learner@intellectx.local",
        role: "student",
      }),
    );
  });
}

async function seedCourseSelection(
  page: import("@playwright/test").Page,
  selectedCourseIds = ["ai-study-systems"],
) {
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

async function openPromptingTopic(page: import("@playwright/test").Page) {
  await page.goto("/mobile-study");
  await page.getByRole("link", { name: /AI Study Systems/i }).click();
  await expect(page).toHaveURL(/\/mobile-quizzes\?course=ai-study-systems$/);
  await page.getByRole("link", { name: /Prompting for Learning/i }).click();
  await expect(page).toHaveURL(/\/mobile-quizzes\?course=ai-study-systems&topic=prompting-for-learning$/);
}

const contextualMobileQuizUrl =
  /\/quiz\/ai-study-systems-check\?from=mobile&course=ai-study-systems&topic=prompting-for-learning$/;

test("fresh native launch starts at learner login with signup available", async ({ page }) => {
  await simulateNativeAndroid(page);
  await page.goto("/mobile-study");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("Continue on this device")).toBeVisible();
  await expect(page.getByRole("link", { name: "Create one" })).toHaveAttribute("href", "/signup");
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveCount(0);
});

test("native signup keeps the authenticated hamburger gated", async ({ page }) => {
  await simulateNativeAndroid(page);
  await page.goto("/signup");

  await expect(page.getByText("Create a local learner profile")).toBeVisible();
  await expect(page.getByRole("button", { name: "Open menu" })).toHaveCount(0);
});

test("new native signup chooses courses then lands on Home with those courses", async ({ page }) => {
  await simulateNativeAndroid(page);
  await page.goto("/signup");

  await page.getByLabel("Name").fill("New Mobile Learner");
  await page.getByLabel("Email").fill("new.mobile.learner@intellectx.local");
  await page.getByRole("button", { name: "Choose courses" }).click();

  await expect(page).toHaveURL(/\/mobile-quizzes\?setup=1$/);
  await expect(page.getByRole("heading", { name: "Choose your courses" })).toBeVisible();
  await page.getByRole("button", { name: /AI Study Systems/i }).click();
  await expect(page.getByText("1 / 5 selected")).toBeVisible();
  const continueButton = page.getByRole("button", { name: "Continue to Home" });
  await expect(continueButton).toBeInViewport();
  await continueButton.click();

  await expect(page).toHaveURL(/\/mobile-study$/);
  await expect(page.getByRole("heading", { name: "Your courses" })).toBeVisible();
  await expect(page.getByRole("link", { name: /AI Study Systems/i })).toBeVisible();
  await expect(page.getByText(/\d+ quizzes?/)).toBeVisible();
  await expect(page.getByRole("link", { name: /Critical Thinking Lab/i })).toHaveCount(0);
});

test("signed-in native learner does not remain on login", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLocalLearner(page);
  await seedCourseSelection(page);
  await page.goto("/login");

  await expect(page).toHaveURL(/\/mobile-study$/);
  await expect(page.getByRole("heading", { name: "Your courses" })).toBeVisible();
  await expect(page.getByText("Continue on this device")).toHaveCount(0);
});

test("selected course opens topics and each topic opens its quiz list", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLocalLearner(page);
  await seedCourseSelection(page);

  await page.goto("/mobile-study");
  await page.getByRole("link", { name: /AI Study Systems/i }).click();

  await expect(page).toHaveURL(/\/mobile-quizzes\?course=ai-study-systems$/);
  await expect(page.getByRole("heading", { name: "AI Study Systems", exact: true })).toBeVisible();
  await expect(page.getByRole("link", { name: /Prompting for Learning/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Memory Systems/i })).toBeVisible();
  await expect(page.getByRole("link", { name: /Weekly Review/i })).toBeVisible();

  await page.getByRole("link", { name: /Memory Systems/i }).click();
  await expect(page).toHaveURL(/topic=memory-systems$/);
  await expect(page.getByRole("heading", { name: "Memory Systems", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Memory Systems Check", exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Weekly Review Check", exact: true })).toHaveCount(0);
});

test("mobile quiz detail preserves topic context inside the native quiz shell", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLocalLearner(page);
  await seedCourseSelection(page);
  await openPromptingTopic(page);

  const startQuiz = page.getByRole("link", { name: /Start quiz/i }).first();
  await expect(startQuiz).toHaveAttribute(
    "href",
    "/quiz/ai-study-systems-check?from=mobile&course=ai-study-systems&topic=prompting-for-learning",
  );
  await startQuiz.click();

  await expect(page).toHaveURL(contextualMobileQuizUrl);
  await expect(page.getByText("Free mobile")).toBeVisible();
  const mobileNav = page.getByRole("navigation", { name: "Mobile study navigation" });
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "Quizzes", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(mobileNav.getByRole("link", { name: "Flashcards" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Courses", exact: true })).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
  await expect(page.getByRole("button", { name: "Submit answer" })).toBeInViewport();

  const backToTopic = page.getByRole("link", { name: "Back to topic" });
  await expect(backToTopic).toHaveAttribute(
    "href",
    "/mobile-quizzes?course=ai-study-systems&topic=prompting-for-learning",
  );
  await backToTopic.click();
  await expect(page).toHaveURL(/\/mobile-quizzes\?course=ai-study-systems&topic=prompting-for-learning$/);
  await expect(page.getByRole("heading", { name: "Prompting for Learning", exact: true })).toBeVisible();
});

test("unfinished native quiz restores checked state after reload and resumes from Home", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLocalLearner(page);
  await seedCourseSelection(page);
  await openPromptingTopic(page);

  await page.getByRole("link", { name: /Start quiz/i }).first().click();
  await expect(page).toHaveURL(contextualMobileQuizUrl);

  const choices = page.getByRole("radio");
  await expect(choices).toHaveCount(4);
  await choices.nth(1).click();
  await page.getByRole("button", { name: "Submit answer" }).click();
  await expect(page.getByText("Correct", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next question" })).toBeVisible();

  await expect
    .poll(() =>
      page.evaluate(() => {
        const saved = window.localStorage.getItem("intellectx:quiz-progress");
        return saved ? (JSON.parse(saved) as { submitted?: boolean }).submitted : null;
      }),
    )
    .toBe(true);

  await page.reload();
  await expect(page).toHaveURL(contextualMobileQuizUrl);
  await expect(page.getByRole("radio").nth(1)).toHaveAttribute("aria-checked", "true");
  await expect(page.getByText("Correct", { exact: true })).toBeVisible();
  await expect(page.getByRole("button", { name: "Next question" })).toBeVisible();

  await page.goto("/mobile-study");
  const resumeRegion = page.getByRole("region", { name: "Resume study" });
  await expect(resumeRegion).toBeVisible();
  await expect(resumeRegion.getByRole("heading", { name: "AI Study Systems Check" })).toBeVisible();
  await resumeRegion.getByRole("link", { name: "Continue" }).click();

  await expect(page).toHaveURL(contextualMobileQuizUrl);
  await expect(page.getByRole("radio").nth(1)).toHaveAttribute("aria-checked", "true");
  await expect(page.getByRole("button", { name: "Next question" })).toBeVisible();
});

test("signed-out native course access returns to login before course selection", async ({ page }) => {
  await simulateNativeAndroid(page);
  await page.goto("/mobile-quizzes");

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Choose your courses" })).toHaveCount(0);
});

test("native login with no course selection sends learner to course setup", async ({ page }) => {
  await simulateNativeAndroid(page);
  await page.goto("/login");

  await page.getByLabel("Email").fill("mobile.return@intellectx.local");
  await page.getByRole("button", { name: "Continue", exact: true }).click();

  await expect(page).toHaveURL(/\/mobile-quizzes\?setup=1$/);
  await expect(page.getByRole("heading", { name: "Choose your courses" })).toBeVisible();
});

test("native profile logout goes straight to login without visiting the public landing route", async ({ page }) => {
  await simulateNativeAndroid(page);
  await page.goto("/login");
  await page.evaluate(() => {
    const selectedAt = Date.now();
    window.localStorage.setItem(
      "intellectx:learner-session",
      JSON.stringify({
        name: "Mobile Learner",
        email: "mobile.learner@intellectx.local",
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

  const navigatedPaths: string[] = [];
  page.on("framenavigated", (frame) => {
    if (frame === page.mainFrame()) {
      navigatedPaths.push(new URL(frame.url()).pathname);
    }
  });

  await page.goto("/mobile-profile");
  const logoutButton = page.getByRole("button", { name: "Logout", exact: true });
  await expect(logoutButton).toBeInViewport();
  navigatedPaths.length = 0;
  await logoutButton.click();

  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByText("Continue on this device")).toBeVisible();
  expect(navigatedPaths).not.toContain("/");
});

test("native direct quiz deep links resolve to the quiz-only mobile shell", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLocalLearner(page);
  await page.goto("/quiz/ai-study-systems-check", { waitUntil: "domcontentloaded" });

  await expect(page.getByText("Free mobile")).toBeVisible();
  const mobileNav = page.getByRole("navigation", { name: "Mobile study navigation" });
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "Quizzes", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(mobileNav.getByRole("link", { name: "Flashcards" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Courses", exact: true })).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
});

test("native app redirects flashcards and other web-only routes back through mobile Home", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLocalLearner(page);
  await seedCourseSelection(page);
  await page.goto("/mobile-flashcards", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/mobile-study$/);
  await expect(page.getByRole("heading", { name: "Your courses" })).toBeVisible();
});

test("native progress and profile routes remain inside the quiz product", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLocalLearner(page);

  await page.goto("/mobile-progress");
  await expect(page.getByRole("heading", { name: "Quiz progress" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile study navigation" }).getByRole("link", { name: "Progress" })).toHaveAttribute("aria-current", "page");

  await page.goto("/mobile-profile");
  await expect(page.getByRole("heading", { name: "Quiz learner profile" })).toBeVisible();
  await expect(page.getByRole("navigation", { name: "Mobile study navigation" }).getByRole("link", { name: "Profile" })).toHaveAttribute("aria-current", "page");
});
