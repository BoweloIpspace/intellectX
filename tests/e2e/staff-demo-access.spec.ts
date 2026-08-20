import { expect, test } from "@playwright/test";

// The staff demo flow only exists in local-fallback development mode (no Clerk keys).
const clerkConfigured = Boolean(
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY || process.env.CLERK_SECRET_KEY,
);
test.skip(clerkConfigured, "Staff demo access requires local-fallback mode without Clerk keys.");
test.skip(
  process.env.PLAYWRIGHT_SERVER_MODE === "production",
  "Staff demo shortcuts are intentionally disabled in production builds.",
);

test("login page shows staff demo entry buttons in local-fallback mode", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByRole("button", { name: "Demo as Admin" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Demo as Instructor" })).toBeVisible();
});

test("demo as admin enters the admin workspace", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Demo as Admin" }).click();

  await expect(page).toHaveURL(/\/admin$/);
  await expect(page.getByRole("heading", { name: "Course workflow control center" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Exit demo" })).toBeVisible();
});

test("demo as instructor enters the instructor workspace", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Demo as Instructor" }).click();

  await expect(page).toHaveURL(/\/instructor$/);
  await expect(
    page.getByRole("heading", { name: "Build and manage focused learning experiences" }),
  ).toBeVisible();
  await expect(page.getByRole("button", { name: "Exit demo" })).toBeVisible();
});

test("demo instructor cannot reach admin routes", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Demo as Instructor" }).click();
  await expect(page).toHaveURL(/\/instructor$/);

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Staff access is locked" })).toBeVisible();
});

test("exit demo clears the session and staff routes lock again", async ({ page }) => {
  await page.goto("/login");
  await page.getByRole("button", { name: "Demo as Admin" }).click();
  await expect(page).toHaveURL(/\/admin$/);

  await page.getByRole("button", { name: "Exit demo" }).click();
  await expect(page).toHaveURL(/\/login$/);

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Staff access is locked" })).toBeVisible();
});
