import { expect, test } from '../../lib/test';

test.describe("画面内リンクによる画面遷移", () => {
  test.beforeEach(async ({ initialize }) => {
    await initialize();
  });

  test("全ての画面に遷移できる", async ({ page }) => {
    // /about
    await page.getByRole("link", { name: 'About', exact: true }).click();
    await expect(page.getByText(
      "このサイトは2つの PDF を画像比較し、差分を強調表示します。"
    )).toBeAttached();
    // / 
    await page.getByRole("link", { name: "Diff PDF", exact: true }).click();
    await expect(page.getByText("ここにファイルを").first()).toBeAttached();
  });
});
