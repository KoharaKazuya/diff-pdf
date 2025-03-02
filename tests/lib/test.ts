import { test as base, expect } from '@playwright/test';
import path from 'node:path';

export const test = base.extend<{
  initialize(): Promise<void>;
  attachPDF(side: 'left' | 'right', file: string): Promise<void>;
}>({
  /**
   * ユーザーがこのサイトを利用開始するステップを実行する
   */
  async initialize({ page }, use) {
    await use(async () => {
      await base.step('initialize', async () => {
        await page.goto(`/`);

        // ダイアログを閉じる
        await expect(page.getByRole('dialog', { name: 'このサイトについて', exact: true })).toBeAttached();
        await expect(async () => {
          await page.getByRole('button', { name: "使ってみる" }).click();
          await expect(page.getByRole('dialog', { name: 'このサイトについて', exact: true })).toHaveCount(0);
        }).toPass();
      });
    });
  },

  async attachPDF({ page }, use) {
    await use(async (side, file) => {
      await base.step('attachPDF', async () => {
        const fileChooserPromise = page.waitForEvent('filechooser');
        await page.getByText('新しくファイルを追加するには、ここにファイルをドラッグ＆ドロップするか、クリックしてファイルを選択してください').nth(side === 'left' ? 0 : 1).click();
        const fileChooser = await fileChooserPromise;
        await fileChooser.setFiles(path.resolve(__dirname, "../fixtures", file));
        await page.getByRole('button', { name: file }).getByText(file).isVisible();
      });
    });
  }
});

export { expect } from '@playwright/test';
