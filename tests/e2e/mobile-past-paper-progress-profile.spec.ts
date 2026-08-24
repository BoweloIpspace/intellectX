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

async function seedLearnerPractice(page: import("@playwright/test").Page) {
  await page.addInitScript(() => {
    const now = Date.now();
    window.localStorage.setItem(
      "intellectx:learner-session",
      JSON.stringify({
        name: "Practice Learner",
        email: "practice.learner@intellectx.local",
        role: "student",
      }),
    );
    window.localStorage.setItem(
      "intellectx:course-selection",
      JSON.stringify({
        selectedCourseIds: ["ai-study-systems", "bgcse-biology"],
        selectedAt: now,
        gracePeriodEndsAt: now + 7 * 24 * 60 * 60 * 1000,
        lockedAt: null,
        locked: false,
      }),
    );
    window.localStorage.setItem(
      "intellectx:quiz-attempt-history",
      JSON.stringify([
        {
          quizId: "quiz-1",
          quizTitle: "Quiz One",
          score: 2,
          totalQuestions: 4,
          percentage: 50,
          completedAt: new Date(now - 10_000).toISOString(),
        },
        {
          quizId: "quiz-2",
          quizTitle: "Quiz Two",
          score: 4,
          totalQuestions: 4,
          percentage: 100,
          completedAt: new Date(now - 5_000).toISOString(),
        },
      ]),
    );
    window.localStorage.setItem(
      "intellectx:past-paper-progress",
      JSON.stringify({
        "bgcse-biology-2019-paper-3": {
          paperId: "bgcse-biology-2019-paper-3",
          courseId: "bgcse-biology",
          title: "2019 Paper 3",
          currentIndex: 6,
          revealedQuestionIds: ["q1", "q2", "q3"],
          finished: true,
          updatedAt: now - 2_000,
        },
        "bgcse-biology-2020-paper-3": {
          paperId: "bgcse-biology-2020-paper-3",
          courseId: "bgcse-biology",
          title: "2020 Paper 3",
          currentIndex: 2,
          revealedQuestionIds: ["q1"],
          finished: false,
          updatedAt: now - 1_000,
        },
      }),
    );
  });
}

test("mobile Progress combines quiz scores with completed and resumable past-paper practice", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLearnerPractice(page);
  await page.goto("/mobile-progress");

  await expect(page.getByRole("heading", { name: "Quiz progress" })).toBeVisible();
  const overview = page.getByRole("region", { name: "Practice overview" });
  await expect(overview.getByText("75%", { exact: true })).toBeVisible();
  await expect(overview.getByText("2 attempts", { exact: true })).toBeVisible();
  await expect(overview.getByText("1", { exact: true })).toBeVisible();
  await expect(overview.getByText("completed · 1 in progress", { exact: true })).toBeVisible();

  await expect(page.getByText("Past paper practice", { exact: true })).toBeVisible();
  await expect(page.getByRole("heading", { name: "2019 Paper 3" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "2020 Paper 3" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Review completion" })).toHaveAttribute(
    "href",
    "/mobile-past-papers/bgcse-biology-2019-paper-3",
  );
  await expect(page.getByRole("link", { name: "Resume paper" })).toHaveAttribute(
    "href",
    "/mobile-past-papers/bgcse-biology-2020-paper-3",
  );
});

test("mobile Profile reports only the current learner profile's saved study data", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLearnerPractice(page);
  await page.goto("/mobile-profile");

  await expect(page.getByRole("heading", { name: "Quiz learner profile" })).toBeVisible();
  await expect(page.getByText("Study data on this device", { exact: true })).toBeVisible();
  await expect(page.getByText("Selected courses", { exact: true })).toBeVisible();
  await expect(page.getByText("Quiz attempts · 75% avg", { exact: true })).toBeVisible();
  await expect(page.getByText("Past papers completed", { exact: true })).toBeVisible();
  await expect(page.getByText("Past papers in progress", { exact: true })).toBeVisible();
  await expect(page.getByText(/4 past-paper model answers have been revealed/)).toBeVisible();
  await expect(page.getByText(/Deleting the local profile removes its selected courses, quiz history, unfinished quiz state, and past-paper progress/)).toBeVisible();
});

test("a completed past paper is not offered as resumable study on Home", async ({ page }) => {
  await simulateNativeAndroid(page);
  await seedLearnerPractice(page);
  await page.addInitScript(() => {
    window.localStorage.setItem(
      "intellectx:mobile-study-activity",
      JSON.stringify({
        kind: "past-paper",
        href: "/mobile-past-papers/bgcse-biology-2019-paper-3",
        title: "2019 Paper 3",
        subtitle: "Question 7 of 7",
        courseId: "bgcse-biology",
        paperId: "bgcse-biology-2019-paper-3",
        updatedAt: Date.now(),
      }),
    );
  });

  await page.goto("/mobile-study");

  await expect(page.getByRole("region", { name: "Resume study" })).toHaveCount(0);
});
