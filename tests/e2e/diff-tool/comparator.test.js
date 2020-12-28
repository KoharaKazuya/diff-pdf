const { initialize, attachPDF } = require("../../lib/page");

beforeAll(async () => {
  await initialize({ quickTour: true });
});

describe("PDF ファイルの比較ロジック", () => {
  beforeEach(async () => {
    await initialize();
  });

  it("ファイルを２つ選択すると差分が表示できる", async () => {
    await attachPDF("left", "2020.pdf");
    await attachPDF("right", "2021.pdf");

    await page.waitForSelector('[aria-label="PDF page difference"]');
  });

  it("ページ数の異なるファイルを比較したときにも全ページ表示される", async () => {
    await attachPDF("left", "2020.pdf");
    await attachPDF("right", "1.pdf");

    await page.waitForSelector('"9"');
  });

  it("比較結果として一致かそうでないかがテキストとして表示される", async () => {
    await attachPDF("left", "2020.pdf");
    await attachPDF("right", "2021.pdf");

    await page.waitForSelector('"一致"');
    await page.waitForSelector('"差分"');
  });

  it("差分があるページのみ表示できる", async () => {
    await attachPDF("left", "2020.pdf");
    await attachPDF("right", "2021.pdf");
    await page.waitForSelector('"一致"');

    await page.click("[role=switch]");

    await page.waitForSelector('"一致"', { state: "hidden" });
  });

  it("不正な PDF を選択するとダイアログでエラーメッセージが表示される", async () => {
    await attachPDF("left", "2020.pdf");

    await Promise.all([
      new Promise((resolve, reject) => {
        page.on("dialog", (dialog) => {
          const message = dialog.message();
          if (message.includes("失敗")) {
            resolve(dialog);
          } else {
            reject(`invalid dialog message: ${message}`);
          }
        });
      }).then((dialog) => dialog.dismiss()),
      attachPDF("right", "invalid.pdf"),
    ]);
  });
});
