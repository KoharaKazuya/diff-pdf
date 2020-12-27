const { baseURL, initialize } = require("../../lib/page");

beforeAll(async () => {
  await initialize({ quickTour: true });
});

describe("URL による画面遷移", () => {
  const data = {
    "/": "text=ここにファイルを",
    "/about": "text=このサイトは2つの PDF を画像比較し、差分を強調表示します。",
  };

  for (const [path, selector] of Object.entries(data)) {
    const url = `${baseURL}${path}`;
    it(`ページ ${url} に URL でアクセスできる`, async () => {
      await page.goto(url);
      await page.waitForSelector(selector);
    });
  }
});
