describe("PDF ファイルの比較ロジック", () => {
  beforeEach(() => {
    cy.visit("localhost:3000");
    (cy as any).clearDatabase();
  });

  it("ファイルを２つ選択すると差分が表示できる", () => {
    cy.get('input[type="file"]').eq(0).attachFile("2020.pdf", {
      subjectType: "drag-n-drop",
    });
    cy.get('input[type="file"]').eq(1).attachFile("2021.pdf", {
      subjectType: "drag-n-drop",
    });

    cy.get('[aria-label="PDF page difference"]');
  });
});
