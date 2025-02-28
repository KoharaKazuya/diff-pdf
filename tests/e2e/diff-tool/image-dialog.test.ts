import { expect, test } from '../../lib/test';

test.describe("画像の拡大表示ダイアログ", () => {
  test.beforeEach(async ({ initialize }) => {
    await initialize();
  });

  test("ファイルの中身を表示している画像をクリックするとダイアログが表示される", async ({ page, attachPDF }) => {
    await attachPDF("left", "2020.pdf");

    await page.getByText('1', { exact: true }).click();

    await expect(page.getByRole("dialog")).toBeAttached();
  });

  test("差分を表示している画像をクリックするとダイアログが表示される", async ({ page, attachPDF }) => {
    await attachPDF("left", "2020.pdf");
    await attachPDF("right", "2021.pdf");

    await page.getByText('差分', { exact: true }).first().click();

    await expect(page.getByRole("dialog")).toBeAttached();
  });

  test("ダイアログは Esc キーで非表示にできる", async ({ page, attachPDF }) => {
    await attachPDF("left", "2020.pdf");
    await page.getByText('1', { exact: true }).click();
    await expect(page.getByRole("dialog")).toBeAttached();

    await page.press("body", "Escape");

    await expect(page.getByRole("dialog")).toHaveCount(0);
  });
});
