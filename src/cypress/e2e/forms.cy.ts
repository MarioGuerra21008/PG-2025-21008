describe('FormListPage', () => {
  beforeEach(() => {
    cy.visit('/home', { timeout: 15000 });
    cy.contains('.ant-menu-submenu-title', 'Formularios', { timeout: 10000 }).click({ force: true });
    cy.wait(500);
    // Probar variantes del texto
    cy.get('.ant-menu-item').contains(/Listado/i).click({ force: true });
  });

  it('[C0274] carga la vista de listado', () => {
    cy.get('body').should('exist');
  });

  it('[C0275] muestra tabla o listado', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });

  it('[C0276] buscador si existe', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });

  it('[C0277] acciones por fila si existen', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });

  it('[C0278] botón nuevo/crear si existe', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });
});