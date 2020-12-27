const { initialize } = require("../../lib/page");

beforeAll(async () => {
  await initialize({ quickTour: true });
});

describe("ストレージによるデータの永続性", () => {
  it("リロードしても以前の状態を記憶している", async () => {
    if (browserName === "webkit") return; // Safari ではプライベートブランジング中は IndexedDB が使えない

    await initialize({ quickTour: false });
    await page.waitForSelector("[role=progressbar]", { state: "hidden" });

    await page.waitForSelector("text=使ってみる", { state: "hidden" });
  });
});
