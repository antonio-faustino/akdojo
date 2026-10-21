// Instituto Khuririm · navigation
(function () {
  window.SiteComponents = window.SiteComponents || {};
  window.SiteComponents.initNavigation = function () {
    // Menu mobile
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('menu');
    if (toggle && nav) {
      var setOpen = function (open) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', window.SiteI18n.t(open ? 'menu.close' : 'menu.open'));
        nav.classList.toggle('is-open', open);
      };
      toggle.addEventListener('click', function () {
        setOpen(toggle.getAttribute('aria-expanded') !== 'true');
      });
      nav.addEventListener('click', function (e) {
        if (e.target.closest('a')) setOpen(false);
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) { setOpen(false); toggle.focus(); }
      });
    }
  };
})();
