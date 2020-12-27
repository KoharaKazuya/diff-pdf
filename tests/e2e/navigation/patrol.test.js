const { initialize } = require("../../lib/page");

beforeAll(async () => {
  await initialize({ quickTour: true });
});

describe("画面内リンクによる画面遷移", () => {
  beforeEach(async () => {
    await initialize();
  });

  it("全ての画面に遷移できる", async () => {
    // /about
    await page.click("text=About");
    await page.waitForSelector(
      "text=このサイトは2つの PDF を画像比較し、差分を強調表示します。"
    );
    // /
    await page.click('text="Diff PDF"');
    await page.waitForSelector("text=ここにファイルを");
  });
});
