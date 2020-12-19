const { baseURL } = require("../../lib/page");

describe("画面内リンクによる画面遷移", () => {
  it("全ての画面に遷移できる", async () => {
    await page.goto(`${baseURL}/`);
    // /about
    await page.click("text=About");
    await page.waitForSelector(
      "text=2つの PDF を画像比較し、差分を強調表示するツールです。"
    );
    // /
    await page.click('text="Diff PDF"');
    await page.waitForSelector("text=ここにファイルを");
  });
});
