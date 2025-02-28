import { expect, test } from '../../lib/test';

test.describe("ストレージによるデータの永続性", () => {
  test.beforeEach(async ({ initialize }) => {
    await initialize();
  });

  test("リロードしても以前の状態を記憶している", async ({ page, browserName }) => {
    test.skip(browserName === 'webkit', 'Safari ではプライベートブランジング中は IndexedDB が使えない');

    await page.goto("/");
    await expect(page.getByRole("progressbar")).toHaveCount(0);

    await expect(page.getByRole('dialog', { name: 'このサイトについて', exact: true })).toHaveCount(0);
  });
});
