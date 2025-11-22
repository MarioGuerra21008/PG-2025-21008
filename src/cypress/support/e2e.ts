import '@cypress/code-coverage/support';

Cypress.Commands.add('maybe', (selector: string) => {
  cy.document().then((doc) => {
    const $found = Cypress.$(doc.body).find(selector);
    if ($found.length === 0) {
      cy.wrap(Cypress.$('<div style="display:none"></div>'), { log: false });
    } else {
      cy.wrap($found, { log: false });
    }
  });
  return cy.get('body', { log: false }).then(() => cy.document().then((doc) => {
    return cy.wrap(Cypress.$(doc.body).find(selector));
  }));
});