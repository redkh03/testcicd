// cypress/e2e/register.cy.js

describe("Formulaire d’inscription", () => {
  it("soumet correctement le formulaire et affiche le message de succès", () => {
    cy.intercept('POST', 'http://localhost:8081/api/auth/register', {
      statusCode: 200
    }).as('registerSuccess');

    cy.visit('/register');

    cy.get('#username').type('testus');
    cy.get('#email').type('test@exa.com');
    cy.get('#password').type('mypass123');

    // ✅ Couvre la ligne non testée
    cy.get('#showPassword').click();

    cy.get('form').submit();

    cy.wait('@registerSuccess');
    cy.contains("Inscription réussie !").should("exist");
  });

  it("affiche une erreur si le serveur renvoie une erreur", () => {
    cy.intercept('POST', 'http://localhost:8081/api/auth/register', {
      statusCode: 400,
      body: { message: "Erreur personnalisée" }
    }).as('registerFail');

    cy.visit('/register');

    cy.get('#username').type('erroruser');
    cy.get('#email').type('error@example.com');
    cy.get('#password').type('password');

    cy.get('form').submit();

    cy.wait('@registerFail');
    cy.contains("Erreur personnalisée").should("exist");
  });
});
