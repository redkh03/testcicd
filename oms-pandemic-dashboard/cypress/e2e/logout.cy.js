describe('Déconnexion (Logout)', () => {
  beforeEach(() => {
    // 🔐 Se connecter d'abord
    cy.login();
  });

  it('se déconnecte correctement et redirige vers la page de connexion', () => {
    // 🧭 Cliquer sur le bouton ou lien de déconnexion
    cy.contains('Logout').click(); // adapte si ton bouton s'appelle "Logout" ou autre

    // ✅ Vérifie que l'URL change vers /login
    cy.url().should('include', '/login');

    // ✅ Vérifie que le token est supprimé (si applicable)
    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.be.null;
    });
  });
});
