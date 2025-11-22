describe('Auth', () => {
  beforeEach(() => {
    cy.visit('/', { failOnStatusCode: false });
    cy.contains('button', 'Entrar', { timeout: 10000 }).should('be.visible');
  });

  it('[C0254] muestra formulario, logo y link', () => {
    cy.get('input#login_username').should('exist');
    cy.get('input#login_password').should('exist');
    cy.get('img[src*="Santa-Ana-logo"]').should('exist');
    cy.contains('button', 'Entrar').should('exist');
  });

  it('[C0255] permite escribir credenciales', () => {
    cy.get('input#login_username').type('test@example.com');
    cy.get('input#login_password').type('secret123');
  });

  it('[C0256] botón submit está presente', () => {
    cy.contains('button', 'Entrar').should('not.be.disabled');
  });

  it('[C0257] link "¿Olvidaste tu contraseña?" existe', () => {
    cy.get('a[href="/reset-password"]').should('exist');
  });

  it('[C0258] volver a / muestra el login de nuevo', () => {
    cy.visit('/');
    cy.contains('button', 'Entrar', { timeout: 10000 }).should('be.visible');
  });
});