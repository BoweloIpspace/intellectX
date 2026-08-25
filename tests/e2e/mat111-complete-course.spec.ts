import { expect, test } from "@playwright/test";

const MAT111 = "mat111-introductory-mathematics-i";

async function seedMat111NativeLearner(page: import("@playwright/test").Page) {
  await page.addInitScript((courseId) => {
    (window as Window & {
      Capacitor?: { isNativePlatform: () => boolean; getPlatform: () => string };
    }).Capacitor = {
      isNativePlatform: () => true,
      getPlatform: () => "android",
    };
    window.sessionStorage.setItem("intellectx:native-launch-authenticated", "1");
    window.localStorage.setItem(
      "intellectx:learner-session",
      JSON.stringify({ name: "MAT111 Learner", email: "mat111.learner@intellectx.local", role: "student" }),
    );
    const selectedAt = Date.now();
    window.localStorage.setItem(
      "intellectx:course-selection",
      JSON.stringify({
        selectedCourseIds: [courseId],
        selectedAt,
        gracePeriodEndsAt: selectedAt + 7 * 24 * 60 * 60 * 1000,
        lockedAt: null,
        locked: false,
      }),
    );
  }, MAT111);
}

test("MAT111 stays one course with all supplied lecture-note topics", async ({ page }) => {
  await seedMat111NativeLearner(page);
  await page.goto(`/mobile-quizzes?course=${MAT111}`);

  await expect(page.getByRole("heading", { name: "MAT111 Introductory Mathematics I" })).toBeVisible();
  await expect(page.getByText("Combinations, Composition and Inverse Functions", { exact: true })).toBeVisible();
  await expect(page.getByText("Cartesian Plane, Circles and Lines", { exact: true })).toBeVisible();
  await expect(page.getByText("Exponential Equations, Angles and Right-Triangle Trigonometry", { exact: true })).toBeVisible();
  await expect(page.getByText("Analytic Trigonometry", { exact: true })).toBeVisible();
  await expect(page.getByText("The Complex Plane, Polar Form and De Moivre's Theorem", { exact: true })).toBeVisible();
});

test("MAT111 infographies use lecture-note visuals and link back to topic quizzes", async ({ page }) => {
  await seedMat111NativeLearner(page);
  await page.goto("/mobile-infographies");

  const firstInfography = page.getByRole("article").first();
  await expect(firstInfography.getByRole("heading", { name: "Combinations, Composition and Inverse Functions" })).toBeVisible();
  await expect(firstInfography.getByRole("img", { name: "Combinations, Composition and Inverse Functions study diagram" })).toBeVisible();
  await expect(firstInfography.getByRole("link", { name: /Open topic quizzes/i })).toBeVisible();
});

test("MAT111 Exams exposes three structured practice papers with protected answer reveal", async ({ page }) => {
  await seedMat111NativeLearner(page);
  await page.goto("/mobile-past-papers");

  await expect(page.getByText("MAT111 Introductory Mathematics I", { exact: true })).toBeVisible();
  await expect(page.getByText("3 exam papers", { exact: true })).toBeVisible();
  await page.getByRole("link", { name: /MAT111 Introductory Mathematics I/i }).click();

  await expect(page.getByRole("heading", { name: "Practice papers" })).toBeVisible();
  await expect(page.getByText("MAT111 Practice Paper 1: Functions and Geometry", { exact: true })).toBeVisible();
  await expect(page.getByText("MAT111 Practice Paper 2: Exponentials and Trigonometry", { exact: true })).toBeVisible();
  await expect(page.getByText("MAT111 Practice Paper 3: Complex Numbers", { exact: true })).toBeVisible();

  await page.getByRole("link", { name: /MAT111 Practice Paper 1: Functions and Geometry/i }).click();
  await expect(page.getByRole("heading", { name: "Question 1" })).toBeVisible();
  await page.getByRole("button", { name: "Reveal answer" }).click();
  await expect(page.getByText("Model answer", { exact: true })).toBeVisible();
  await expect(page.getByText(/x\^2\+2x-4/)).toBeVisible();
});
