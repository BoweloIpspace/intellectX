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
    window.localStorage.setItem(
      "intellectx:academic-profile",
      JSON.stringify({
        educationLevel: "University / Varsity",
        curriculumOrInstitution: "UB",
        gradeOrYear: "Year 1",
        subjectsOrModules: [],
      }),
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

test("MAT111 Exams does not inject fixture-backed practice papers into the learner runtime", async ({ page }) => {
  await seedMat111NativeLearner(page);
  await page.goto("/mobile-past-papers");

  await expect(page.getByRole("heading", { name: "Long-form exam practice" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "No exams for your selected courses yet" })).toBeVisible();
  await expect(page.getByText("Only published production exam content for your selected courses appears here.")).toBeVisible();
  await expect(page.getByText("MAT111 Practice Paper 1: Functions and Geometry", { exact: true })).toHaveCount(0);
});