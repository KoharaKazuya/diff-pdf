import { expect, test } from '../../lib/test';

test.describe("URL による画面遷移", () => {
  const data = {
    "/": "ここにファイルを",
    "/about": "このサイトは2つの PDF を画像比較し、差分を強調表示します。",
  };

  for (const [path, text] of Object.entries(data)) {
    const url = `${path}`;
    test(`ページ ${url} に URL でアクセスできる`, async ({ page }) => {
      await page.goto(url);
      if (await page.getByRole('button', { name: "使ってみる" }).count()) {
        await page.getByRole('button', { name: "使ってみる" }).click();
      }
      await expect(page.getByText(text).first()).toBeAttached();
    });
  }
});
