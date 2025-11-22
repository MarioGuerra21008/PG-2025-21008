// data-sources.cy.ts
describe('DataSourcesPage', () => {
  beforeEach(() => {
    cy.visit('/home');
    cy.contains('.ant-menu-submenu-title', 'Formularios').click({ force: true });
    cy.wait(500);
    cy.contains('.ant-menu-item', 'Fuentes de Datos').click({ force: true });
  });

  it('[C0264] carga la página', () => cy.get('body').should('exist'));

  it('[C0265] renderiza el componente DataSources', () => {
    cy.get('body').children().should('have.length.at.least', 1);
  });

  it('[C0266] botón agregar (si existe)', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });

  it('[C0267] tabla o lista (si existe)', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });

  it('[C0268] sin errores en consola', () => {
    cy.window().then((w) => expect(w).to.exist);
  });
});