const { baseURL } = require("../../lib/page");

describe("初回アクセス時のユーザーに対する説明", () => {
  beforeEach(async () => {
    await page.goto(`${baseURL}/`);
  });

  it("このサイトの説明を表示する", async () => {
    await page.waitForSelector("text=このサイトについて");
  });
});
