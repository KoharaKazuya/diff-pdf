const { baseURL, attachPDF } = require("../../lib/page");

describe("PDF ファイルを選択する Picker 部分", () => {
  beforeEach(async () => {
    await page.goto(`${baseURL}/`);
  });

  it("初期状態では履歴が空", async () => {
    await page.click("[aria-haspopup=listbox]");

    await page.waitForSelector('"2020.pdf"', { state: "detached" });
  });

  it("ファイルを選択すると PDF がプレビューできる", async () => {
    await attachPDF("left", "2020.pdf");

    await page.waitForSelector('[aria-label="PDF page 9"]');
  });

  it("ファイルを選択すると履歴に残る", async () => {
    await attachPDF("left", "2020.pdf");
    await page.click("[aria-haspopup=listbox]");

    await page.waitForSelector('"2020.pdf"');
  });

  it("ファイルを選択するとそのファイルのファイル名が表示される", async () => {
    await attachPDF("left", "2020.pdf");

    await page.waitForSelector('"2020.pdf"');
  });

  it("左でファイルを追加すると、右のドロップダウンにも選択肢が追加される", async () => {
    await attachPDF("left", "2020.pdf");
    await page.click('(//*[@aria-haspopup="listbox"])[2]');

    await page.waitForSelector('"2020.pdf"');
  });
});
