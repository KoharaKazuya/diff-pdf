const path = require("path");

module.exports = {
  baseURL: "http://localhost:3000",

  fixturePath(relativePath) {
    return path.resolve(__dirname, "../fixtures", relativePath);
  },

  /**
   * @param {'left' | 'right'} side
   */
  async attachPDF(side, file) {
    await page.setInputFiles(
      `(//input[@type="file"])[${side === "left" ? 1 : 2}]`,
      module.exports.fixturePath(file)
    );
  },
};
