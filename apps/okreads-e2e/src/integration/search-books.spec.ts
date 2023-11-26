describe('When: Use the search feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should be able to search books by title', () => {
    cy.get('input[type="search"]').type('javascript');

    cy.get('form').submit();

    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 0);
  });

  it('Then: I should see search results as I am typing', () => {
    cy.get('input[type="search"]').type('java');

    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 0);
  });
});
