// Instituto Khuririm · animations
(function () {
  window.SiteComponents = window.SiteComponents || {};
  window.SiteComponents.initAnimations = function () {
    // Animação de entrada nas seções
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduce && 'IntersectionObserver' in window) {
      var items = document.querySelectorAll('.section-head, .card, .value, .support-card, .gallery img, .split-media, .split-text');
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { entry.target.classList.add('is-visible'); io.unobserve(entry.target); }
        });
      }, { threshold: 0.12 });
      items.forEach(function (el) { el.classList.add('reveal'); io.observe(el); });
    }
  };
})();
