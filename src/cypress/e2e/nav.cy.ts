import { clickMenu } from '../support/helpers';

describe('Navegación via sidebar', () => {
  beforeEach(() => {
    cy.visit('/home', { failOnStatusCode: false, timeout: 15000 });
    cy.get('.ant-menu', { timeout: 10000 }).should('exist');
  });

  it('[C0279] abre dashboard', () => {
    cy.contains('.ant-menu-item', 'Dashboard').click({ force: true });
    cy.contains('Dashboard').should('exist');
  });

  it('[C0280] abre formularios en listado', () => {
    cy.contains('.ant-menu-submenu-title', 'Formularios').click({ force: true });
    cy.wait(500);
    cy.get('.ant-menu-item').contains(/Listado/i).click({ force: true });
    cy.get('body').should('exist');
  });

  it('[C0281] abre sesión en terminales', () => {
    cy.contains('.ant-menu-submenu-title', 'Sesión').click({ force: true });
    cy.wait(500);
    cy.contains('.ant-menu-item', 'Terminales').click({ force: true });
    cy.get('body').should('exist');
  });

  it('[C0282] abre sesión en usuarios', () => {
    cy.contains('.ant-menu-submenu-title', 'Sesión').click({ force: true });
    cy.wait(500);
    cy.contains('.ant-menu-item', 'Usuarios').click({ force: true });
    cy.get('body').should('exist');
  });

  it('[C0283] abre formularios en fuentes de datos', () => {
    cy.contains('.ant-menu-submenu-title', 'Formularios').click({ force: true });
    cy.wait(500);
    cy.contains('.ant-menu-item', 'Fuentes de Datos').click({ force: true });
    cy.get('body').should('exist');
  });
});