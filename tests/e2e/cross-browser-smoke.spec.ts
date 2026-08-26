import { expect, test } from "@playwright/test";

test("public landing renders core navigation", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator("body")).not.toContainText("Application error");
  await expect(page.getByText("IntellectX").first()).toBeVisible();
  await expect(page.getByRole("link", { name: "Login", exact: true }).first()).toBeVisible();
});

test("learner login renders usable credentials fields", async ({ page }) => {
  await page.goto("/login");

  await expect(page.getByLabel("Email")).toBeVisible();
  await expect(page.getByLabel("Password")).toBeVisible();
});

test("privacy policy renders as a public support page", async ({ page }) => {
  await page.goto("/privacy-policy");

  await expect(page.getByRole("heading", { name: "Privacy Policy" })).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Application error");
});
