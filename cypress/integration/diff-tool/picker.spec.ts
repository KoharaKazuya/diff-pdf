describe("PDF ファイルを選択する Picker 部分", () => {
  beforeEach(() => {
    cy.visit("localhost:3000");
    (cy as any).clearDatabase();
  });

  it("ファイルを選択すると PDF がプレビューできる", () => {
    cy.get('input[type="file"]').attachFile("2020.pdf", {
      subjectType: "drag-n-drop",
    });
    cy.get('[aria-label="PDF page 9"]');
  });

  it("ファイルを選択すると履歴に残る", () => {
    cy.get('input[type="file"]').attachFile("2020.pdf", {
      subjectType: "drag-n-drop",
    });
    cy.contains("2020.pdf");
  });
});
