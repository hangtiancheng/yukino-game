import { expect, test } from "@playwright/test";

test.describe("not-found route", (): void => {
  test("renders the 404 page for unknown paths", async ({
    page,
  }): Promise<void> => {
    await page.goto("./this-path-does-not-exist");
    await expect(page.getByRole("heading", { name: "404" })).toBeVisible();
    await expect(page.getByText(/route missing/i)).toBeVisible();
    await expect(
      page.getByRole("link", { name: /return home/i }),
    ).toBeVisible();
  });

  test("the 404 link navigates back to the home route", async ({
    page,
  }): Promise<void> => {
    await page.goto("./missing");
    await page.getByRole("link", { name: /return home/i }).click();
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /yukino tetris/i }),
    ).toBeVisible();
  });
});
