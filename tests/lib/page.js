const path = require("path");

module.exports = {
  baseURL: "http://localhost:3000",

  fixturePath(relativePath) {
    return path.resolve(__dirname, "../fixtures", relativePath);
  },

  /**
   * ユーザーがこのサイトを利用開始するステップを実行する
   */
  async initialize({ quickTour = browserName === "webkit" } = {}) {
    await page.goto(`${module.exports.baseURL}/`);
    if (quickTour) await page.click("text=使ってみる");
  },

  /**
   * @param {'left' | 'right'} side
   */
  async attachPDF(side, file) {
    const input = `(//input[@type="file"])[${side === "left" ? 1 : 2}]`;
    const listbox = `(//*[@aria-haspopup="listbox"])[${
      side === "left" ? 1 : 2
    }]`;

    await page.setInputFiles(input, []);
    await page.evaluate(() => new Promise(requestAnimationFrame));
    await page.setInputFiles(input, module.exports.fixturePath(file));
    await page.waitForSelector(`${listbox} >> "${file}"`);
  },
};
