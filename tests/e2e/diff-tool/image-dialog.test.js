const { initialize, attachPDF } = require("../../lib/page");

beforeAll(async () => {
  await initialize({ quickTour: true });
});

describe("画像の拡大表示ダイアログ", () => {
  beforeEach(async () => {
    await initialize();
  });

  it("ファイルの中身を表示している画像をクリックするとダイアログが表示される", async () => {
    await attachPDF("left", "2020.pdf");

    await page.click('"1"');

    await page.waitForSelector("[role=dialog]");
  });

  it("差分を表示している画像をクリックするとダイアログが表示される", async () => {
    await attachPDF("left", "2020.pdf");
    await attachPDF("right", "2021.pdf");

    await page.click('"差分"');

    await page.waitForSelector("[role=dialog]");
  });

  it("ダイアログは Esc キーで非表示にできる", async () => {
    await attachPDF("left", "2020.pdf");
    await page.click('"1"');
    await page.waitForSelector("[role=dialog]");

    await page.press("body", "Escape");

    await page.waitForSelector("[role=dialog]", { state: "hidden" });
  });
});
