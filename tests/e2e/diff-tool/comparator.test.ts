import { type Dialog } from 'playwright/test';
import { expect, test } from '../../lib/test';

test.describe("PDF ファイルの比較ロジック", () => {
  test.beforeEach(async ({ initialize }) => {
    await initialize();
  });

  test("ファイルを２つ選択すると差分が表示できる", async ({ page, attachPDF }) => {
    await attachPDF("left", "2020.pdf");
    await attachPDF("right", "2021.pdf");

    await expect(page.getByLabel('PDF page difference').first()).toBeAttached();
  });

  test("ページ数の異なるファイルを比較したときにも全ページ表示される", async ({ page, attachPDF }) => {
    await attachPDF("left", "2020.pdf");
    await attachPDF("right", "1.pdf");

    await expect(page.getByText('9', { exact: true })).toBeAttached();
  });

  test("比較結果として一致かそうでないかがテキストとして表示される", async ({ page, attachPDF }) => {
    await attachPDF("left", "2020.pdf");
    await attachPDF("right", "2021.pdf");

    await expect(page.getByText('一致').first()).toBeAttached();
    await expect(page.getByText('差分').first()).toBeAttached();
  });

  test("差分があるページのみ表示できる", async ({ page, attachPDF }) => {
    await attachPDF("left", "2020.pdf");
    await attachPDF("right", "2021.pdf");
    await expect(page.getByText('一致').first()).toBeAttached();

    await page.click("[role=switch]");

    await expect(page.getByText('一致')).toHaveCount(0);
  });

  test("不正な PDF を選択するとダイアログでエラーメッセージが表示される", async ({ page, attachPDF }) => {
    await attachPDF("left", "2020.pdf");

    const dialogPromise = new Promise<Dialog>((resolve, reject) => {
        page.on("dialog", (dialog) => {
          const message = dialog.message();
          if (message.includes("失敗")) {
            resolve(dialog);
          } else {
            reject(`invalid dialog message: ${message}`);
          }
        });
      }).then((dialog) => dialog.dismiss());
    await attachPDF("right", "invalid.pdf");

    await dialogPromise;
  });
});
