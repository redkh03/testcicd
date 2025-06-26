// cypress/support/commands.js
Cypress.Commands.add('login', (username = 'testuser', password = 'password123') => {
  cy.visit('http://localhost:3000/login');

  cy.get('input[placeholder="Nom d\'utilisateur"]').type(username);
  cy.get('input[placeholder="Mot de passe"]').type(password);
  cy.contains('Se connecter').click();

  cy.url().should('not.include', '/login');
});
