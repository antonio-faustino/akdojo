// Inicialização única. Os componentes e SiteI18n são carregados antes deste arquivo.
(function () {
  var components = window.SiteComponents;
  components.initNavigation();
  components.initClipboard();
  components.initCarousels();
  components.initLightbox();
  components.initHeroPhotos();

  // Ano no rodapé
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  components.initAnimations();
})();
