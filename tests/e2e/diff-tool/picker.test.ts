import { expect, test } from '../../lib/test';

test.describe("PDF ファイルを選択する Picker 部分", () => {
  test.beforeEach(async ({ initialize }) => {
    await initialize();
  });

  test("初期状態では履歴が空", async ({ page }) => {
    await page.click("[aria-haspopup=listbox]");

    await expect(page.getByText('2020.pdf')).toHaveCount(0);
  });

  test("ファイルを選択すると PDF がプレビューできる", async ({ page, attachPDF }) => {
    await attachPDF("left", "2020.pdf");

    await expect(page.getByLabel('PDF page 9')).toBeAttached();
  });

  test("ファイルを選択すると履歴に残る", async ({ page, attachPDF }) => {
    await attachPDF("left", "2020.pdf");
    await page.click("[aria-haspopup=listbox]");

    await expect(page.getByRole('listbox').getByText('2020.pdf', { exact: true })).toBeAttached();
  });

  test("履歴は 10 件までしか残らない", async ({ page, attachPDF }) => {
    for (let i = 0; i < 15; i++) {
      await attachPDF("left", "1.pdf");
    }
    await page.click("[aria-haspopup=listbox]");

    await expect(page.getByRole('listbox').getByText('1.pdf', { exact: true })).toHaveCount(10);
  });

  test("ファイルを選択するとそのファイルのファイル名が表示される", async ({ page, attachPDF }) => {
    await attachPDF("left", "2020.pdf");

    await expect(page.getByText('2020.pdf', { exact: true })).toBeAttached();
  });

  test("左でファイルを追加すると、右のドロップダウンにも選択肢が追加される", async ({ page, attachPDF }) => {
    await attachPDF("left", "2020.pdf");
    await page.locator("[aria-haspopup=listbox]").nth(1).click();

    await expect(page.getByRole('listbox').getByText('2020.pdf', { exact: true })).toBeAttached();
  });
});
