import { expect, test } from "@playwright/test";

test.describe("fullscreen route", (): void => {
  test("exposes the game stage as an application region", async ({
    page,
  }): Promise<void> => {
    await page.goto("./fullscreen");
    await expect(
      page.getByRole("application", { name: /yukino tetris game stage/i }),
    ).toBeVisible();
  });

  test("offers an exit-fullscreen link back to home", async ({
    page,
  }): Promise<void> => {
    await page.goto("./fullscreen");
    const exitLink = page.getByRole("link", {
      name: /exit fullscreen/i,
    });
    await expect(exitLink).toBeVisible();
    await exitLink.click();
    await expect(page).toHaveURL(/\/$/);
    await expect(
      page.getByRole("heading", { level: 1, name: /yukino tetris/i }),
    ).toBeVisible();
  });
});
