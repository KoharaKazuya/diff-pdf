import { expect, test } from '../../lib/test';

test.describe("初回アクセス時のユーザーに対する説明", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/");
  });

  test("このサイトの説明を表示する", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("このサイトについて")).toBeAttached();
  });
});
