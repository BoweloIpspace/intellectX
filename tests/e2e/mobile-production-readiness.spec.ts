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

test("native mobile home is quiz-only with Home, Quizzes, Progress, and Profile navigation", async ({ page }) => {
  await simulateNativeAndroid(page);
  await page.goto("/mobile-study");

  await expect(page.getByRole("heading", { name: "Free quiz practice" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Quiz library" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Flashcards" })).toHaveCount(0);

  const mobileNav = page.getByRole("navigation", { name: "Mobile study navigation" });
  await expect(mobileNav.getByRole("link")).toHaveText(["Home", "Quizzes", "Progress", "Profile"]);
  await expect(mobileNav.getByRole("link", { name: "Flashcards" })).toHaveCount(0);
});

test("mobile quiz detail stays inside the quiz-only native shell", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLocalLearner(page);
  await page.goto("/mobile-quizzes");

  const startQuiz = page.getByRole("link", { name: /Start quiz/i }).first();
  await expect(startQuiz).toHaveAttribute("href", /\/quiz\/.+\?from=mobile$/);
  await startQuiz.click();

  await expect(page).toHaveURL(/\/quiz\/.+\?from=mobile$/);
  await expect(page.getByText("Free mobile")).toBeVisible();
  const mobileNav = page.getByRole("navigation", { name: "Mobile study navigation" });
  await expect(mobileNav).toBeVisible();
  await expect(mobileNav.getByRole("link", { name: "Quizzes", exact: true })).toHaveAttribute("aria-current", "page");
  await expect(mobileNav.getByRole("link", { name: "Flashcards" })).toHaveCount(0);
  await expect(page.getByRole("link", { name: "Courses", exact: true })).toHaveCount(0);
  await expect(page.locator("footer")).toHaveCount(0);
});

test("signed-out native learner returns to the selected quiz after local-profile continue", async ({ page }) => {
  await simulateNativeAndroid(page);
  await page.goto("/mobile-quizzes");

  const startQuiz = page.getByRole("link", { name: /Start quiz/i }).first();
  const quizHref = await startQuiz.getAttribute("href");
  expect(quizHref).toMatch(/^\/quiz\/.+\?from=mobile$/);
  await startQuiz.click();

  await expect(page).toHaveURL(/\/login\?returnTo=%2Fquiz%2F.+%3Ffrom%3Dmobile$/);
  await expect(page.getByLabel("Password")).toHaveCount(0);
  await page.getByLabel("Email").fill("mobile.return@intellectx.local");
  const continueButton = page.getByRole("button", { name: "Continue", exact: true });
  await expect(continueButton).toBeEnabled();
  await continueButton.click();

  await expect(page).toHaveURL(new RegExp(`${quizHref!.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`), { timeout: 10_000 });
  await expect(page.getByText("Free mobile")).toBeVisible();
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

test("native app redirects flashcards and other web-only routes back to mobile Home", async ({ page }) => {
  await simulateNativeAndroid(page);
  await page.goto("/mobile-flashcards", { waitUntil: "domcontentloaded" });

  await expect(page).toHaveURL(/\/mobile-study$/);
  await expect(page.getByRole("heading", { name: "Free quiz practice" })).toBeVisible();
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
