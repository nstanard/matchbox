describe('ListBox component', () => {
  it('renders correctly', () => {
    cy.visit('/iframe.html?path=Visual-Regression__ListBox');
    cy.get('#listbox-9Label').eq(0).click({ force: true });
    cy.wait(500);
    cy.percySnapshot('ListBox', { widths: [1280] });
  });
});
