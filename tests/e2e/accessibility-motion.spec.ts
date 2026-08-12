import { expect, test } from "@playwright/test";

test("public homepage renders cleanly under reduced motion without duplicated marquee content", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");

  await expect(page.getByRole("heading", { name: /Built for/i })).toBeVisible();
  await expect(page.getByText("clearer next moves")).toBeVisible();
  await expect(page.getByText("Learn with context")).toBeVisible();
  await expect(page.locator("body")).not.toContainText("Application error");
  await expect(page.getByTestId("infinite-slider-track")).toHaveCount(0);
});
