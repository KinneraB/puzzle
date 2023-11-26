describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
    cy.get('input[type="search"]').type('javascript');
    cy.get('form').submit();
    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 0);
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should be able to undo add book action on reading list', () => {
    removeAllItemsFromReadingList();
    cy.get('[data-testing="want-to-read-btn"]').first().click();
    cy.get('[data-testing="reading-list-item"]').should('have.length', 1);
    cy.get('.mat-simple-snackbar').should('be.visible');

    cy.get('.mat-simple-snackbar-action .mat-button').click();
    cy.get('[data-testing="reading-list-item"]').should('not.exist');
  });

  it('Then: I should be able to undo remove book action on reading list', () => {
    removeAllItemsFromReadingList();
    cy.get('[data-testing="want-to-read-btn"]').first().click();
    cy.get('[data-testing="reading-list-item"]').should('have.length', 1);

    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="remove-btn"]').first().click();
    cy.get('[data-testing="reading-list-item"]').should('not.exist');
    cy.get('.mat-simple-snackbar').should('be.visible');

    cy.get('.mat-simple-snackbar-action .mat-button').click();
    cy.get('[data-testing="reading-list-item"]').should('have.length', 1);
  });
});

function removeAllItemsFromReadingList() {
  cy.get('[data-testing="toggle-reading-list"]').click();
  cy.get('[data-testing="reading-list-container"]').then((container) => {
    container.find('[data-testing="remove-btn"]').trigger('click');
  });
  cy.get('[data-testing="close-btn"]').click();
}