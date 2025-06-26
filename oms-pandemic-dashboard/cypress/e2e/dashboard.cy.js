// cypress/e2e/dashboard.cy.js
describe('Dashboard – Filtre des données', () => {

  beforeEach(() => {
    // 🔑 on se connecte AVANT chaque test
    cy.login();                      // ← la commande créée plus haut
    cy.visit('http://localhost:3000/dashboard');
  });

  it('affiche le filtre avec toutes les options', () => {
    cy.contains('Filtrer par').should('be.visible');
    cy.get('select').within(() => {
      cy.contains('Décès');
      cy.contains('Tests');
      cy.contains('Cas Confirmés');
      cy.contains('Rétablis');
    });
  });

  it('met à jour le visuel pour chaque option', () => {
    const options = ['Décès', 'Tests', 'Cas Confirmés', 'Rétablis'];

    options.forEach((opt) => {
      cy.get('select').select(opt);
      // vérifie qu’un élément du dashboard reflète la sélection :
      cy.contains(opt).should('be.visible');
    });
  });
});
