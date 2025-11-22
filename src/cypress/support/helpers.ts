export const ensureSidebarOpen = () => {
  cy.visit('/home', { failOnStatusCode: false, timeout: 15000 });
  cy.get('.ant-menu', { timeout: 10000 }).should('exist');

  // Expandir todos los submenús (Formularios y Sesión)
  cy.get('.ant-menu-submenu-title').each(($title) => {
    cy.wrap($title).then(($t) => {
      const isOpen = $t.parent().hasClass('ant-menu-submenu-open');
      if (!isOpen) {
        cy.wrap($t).click({ force: true });
        cy.wait(300);
      }
    });
  });
};

export const clickFirstMenuLabel = (labels: string[]) => {
  ensureSidebarOpen();
  
  for (const label of labels) {
    cy.get('body').then($body => {
      const $found = $body.find('.ant-menu-item, .ant-menu-submenu-title, .ant-menu-title-content')
        .filter((i, el) => {
          const text = Cypress.$(el).text().trim();
          return text === label;
        });
      
      if ($found.length > 0) {
        cy.wrap($found.first()).click({ force: true });
        return false; // break
      }
    });
  }
};

export const clickMenu = (label: string) => {
  ensureSidebarOpen();
  
  cy.get('.ant-menu-item, .ant-menu-submenu-title, .ant-menu-title-content')
    .contains(label)
    .first()
    .click({ force: true });
  
  cy.wait(300);
};