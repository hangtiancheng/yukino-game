import { expect, test } from "@playwright/test";

test.describe("home route", (): void => {
  test("renders the Yukino Tetris hero", async ({ page }): Promise<void> => {
    await page.goto("./");
    await expect(
      page.getByRole("heading", { level: 1, name: /yukino tetris/i }),
    ).toBeVisible();
    await expect(page.getByText(/space drop/i)).toBeVisible();
  });

  test("exposes player name input and leaderboard", async ({
    page,
  }): Promise<void> => {
    await page.goto("./");
    await expect(page.getByText(/top scores/i)).toBeVisible();
    await page.getByRole("button", { name: /settings/i }).click();
    await expect(page.getByLabel(/player name/i)).toBeVisible();
  });

  test("lets players switch to hell difficulty", async ({
    page,
  }): Promise<void> => {
    await page.goto("./");
    await page.getByRole("button", { name: /settings/i }).click();
    const hellButton = page.getByRole("button", { name: /hell/i });
    await hellButton.click();
    await expect(hellButton).toHaveAttribute("aria-pressed", "true");
    await expect(page.getByText(/^hell\s*\d+$/i)).toBeVisible();
  });

  test("hard dropping raises the score HUD", async ({
    page,
  }): Promise<void> => {
    await page.goto("./");
    const score = page.getByText(/^score\s*\d+$/i);
    await expect(score).toHaveText(/score\s*0000000/i);
    await page.keyboard.press("Space");
    await expect(score).not.toHaveText(/score\s*0000000/i);
  });
});
