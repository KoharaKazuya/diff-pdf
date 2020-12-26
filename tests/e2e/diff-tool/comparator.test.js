const { baseURL, initialize, attachPDF } = require("../../lib/page");

beforeAll(async () => {
  await initialize();
});

describe("PDF ファイルの比較ロジック", () => {
  beforeEach(async () => {
    await page.goto(`${baseURL}/`);
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
});
