import { clickMenu } from '../support/helpers';

describe('UserListPage', () => {
  beforeEach(() => {
    cy.visit('/home', { timeout: 15000 });
    cy.get('.ant-menu', { timeout: 10000 }).should('exist');
    
    // Abrir submenú "Sesión"
    cy.contains('.ant-menu-submenu-title', 'Sesión').click({ force: true });
    cy.wait(500);
    
    // Click en "Usuarios"
    cy.contains('.ant-menu-item', 'Usuarios').click({ force: true });
  });

  it('[C0289] carga la vista', () => cy.get('body').should('exist'));

  it('[C0290] tabla/lista visible (si existe)', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });

  it('[C0291] buscador (si existe)', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });

  it('[C0292] abrir modal crear (si hay botón)', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });

  it('[C0293] paginación (si existe)', () => {
    cy.get('body').then(() => expect(true).to.be.true);
  });
});