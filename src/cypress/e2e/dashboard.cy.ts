import { clickMenu } from '../support/helpers';

describe('DashboardPage', () => {
  beforeEach(() => {
    cy.visit('/home');
    clickMenu('Dashboard');
  });

  it('[C0259] renderiza contenedor', () => {
    cy.contains('Dashboard').should('exist');
  });

  it('[C0260] muestra las 3 cards de métricas', () => {
    cy.contains('Usuarios Totales').should('exist');
    cy.contains('Usuarios Activos').should('exist');
    cy.contains('% Activos').should('exist');
  });

  it('[C0261] gráficas renderizan (canvas de @ant-design/charts)', () => {
    cy.get('canvas').should('have.length.at.least', 4);
  });

  it('[C0262] títulos de gráficas visibles', () => {
    cy.contains('Cantidad de formularios recibidos por fecha').should('exist');
    cy.contains('Respuestas por tipo de formulario').should('exist');
    cy.contains('Cantidad de terminales por usuario').should('exist');
  });

  it('[C0263] sidebar sigue visible', () => {
    cy.get('.ant-menu').should('exist');
  });
});