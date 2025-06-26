// cypress/e2e/login.cy.js

describe('Formulaire de connexion', () => {
  it('se connecte avec un nom d’utilisateur et un mot de passe valides', () => {
    cy.intercept('POST', 'http://localhost:8081/api/auth/login', {
      statusCode: 200,
      body: 'fake-jwt-token'
    }).as('loginSuccess');

    cy.visit('/login');
    cy.get('input[placeholder="Nom d\'utilisateur"]').type('testuser');
    cy.get('input[placeholder="Mot de passe"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginSuccess');
    cy.url().should('include', '/dashboard');
  });

  it('affiche une erreur si aucun token n’est renvoyé', () => {
    cy.intercept('POST', 'http://localhost:8081/api/auth/login', {
      statusCode: 200,
      body: null
    }).as('noToken');

    cy.visit('/login');
    cy.get('input[placeholder="Nom d\'utilisateur"]').type('testuser');
    cy.get('input[placeholder="Mot de passe"]').type('password123');
    cy.get('button[type="submit"]').click();

    cy.wait('@noToken');
    cy.contains('Token non reçu !').should('exist');
  });

  it('affiche une erreur si identifiants incorrects', () => {
    cy.intercept('POST', 'http://localhost:8081/api/auth/login', {
      statusCode: 401,
      body: { message: 'Unauthorized' }
    }).as('loginFail');

    cy.visit('/login');
    cy.get('input[placeholder="Nom d\'utilisateur"]').type('wronguser');
    cy.get('input[placeholder="Mot de passe"]').type('wrongpass');
    cy.get('button[type="submit"]').click();

    cy.wait('@loginFail');
    cy.contains('Identifiants incorrects').should('exist');
  });
});
