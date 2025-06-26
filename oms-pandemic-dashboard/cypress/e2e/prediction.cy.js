describe('Page Prédictions IA – tests fonctionnels', () => {
  beforeEach(() => {
    cy.login();

    cy.contains('Prédictions IA').click();

    cy.url().should('include', '/prediction');
    cy.contains('Prédiction IA').should('be.visible');
  });

  const typesDePrediction = [
    'Capacité hospitalière',
    'Charge virale',
    'Propagation géographique'
  ];

  typesDePrediction.forEach((type) => {
    it(`lance une prédiction : ${type}`, () => {
      cy.get('select').select(type);
      cy.get('#country').clear().type('Morocco');
      cy.contains('Lancer la prédiction').click();
      cy.contains(type).should('be.visible');
    });
  });

  it('empêche la prédiction si aucun pays n’est renseigné', () => {
    cy.get('select').select('Capacité hospitalière');
    cy.get('#country').clear();
    cy.contains('Lancer la prédiction').click();
    cy.contains("Chargement...").should('not.exist');
  });

  it('affiche une erreur si le pays est invalide', () => {
    cy.get('select').select('Capacité hospitalière');
    cy.get('#country').clear().type('invalid_country_name_xyz');
    cy.contains('Lancer la prédiction').click();

    cy.contains("Erreur lors de l'appel à l'IA ou à l'API statistiques.").should('be.visible');
  });

  it('affiche la carte et la légende pour la propagation géographique', () => {
    cy.get('select').select('Propagation géographique');
    cy.get('#country').clear().type('Morocco');
    cy.contains('Lancer la prédiction').click();

    cy.get('svg').should('exist');
    cy.contains('Légende des couleurs').should('be.visible');
    cy.contains('Risque Élevé').should('exist');
  });

  it('affiche les résultats textuels pour les autres types de prédiction', () => {
    cy.get('select').select('Charge virale');
    cy.get('#country').clear().type('Morocco');
    cy.contains('Lancer la prédiction').click();

    cy.get('div').contains('Résultats de prédiction').should('not.exist');
    cy.get('pre, p').should('exist');
  });
});
