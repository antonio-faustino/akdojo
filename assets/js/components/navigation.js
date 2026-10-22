// Instituto Khuririm · navigation
(function () {
  window.SiteComponents = window.SiteComponents || {};
  window.SiteComponents.initNavigation = function () {
    var header = document.querySelector('.site-header');
    // Menu mobile
    var toggle = document.querySelector('.menu-toggle');
    var nav = document.getElementById('menu');
    if (toggle && nav) {
      var setOpen = function (open) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', window.SiteI18n.t(open ? 'menu.close' : 'menu.open'));
        nav.classList.toggle('is-open', open);
        if (header) header.classList.toggle('has-open-menu', open);
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
      var brand = header && header.querySelector('.brand');
      if (brand) brand.addEventListener('click', function () { setOpen(false); });
      var desktopQuery = window.matchMedia('(min-width: 1001px)');
      var handleDesktopChange = function (event) {
        if (event.matches) setOpen(false);
      };
      if (desktopQuery.addEventListener) desktopQuery.addEventListener('change', handleDesktopChange);
      else desktopQuery.addListener(handleDesktopChange);
    }

    if (!header || !nav) return;

    // Mantém o cabeçalho legível e indica a seção atual sem alterar a URL.
    var sections = Array.from(nav.querySelectorAll('a[href^="#"]')).map(function (link) {
      return { link: link, target: document.getElementById(link.hash.slice(1)) };
    }).filter(function (item) { return item.target; });
    var framePending = false;
    var updateHeader = function () {
      framePending = false;
      header.classList.toggle('is-scrolled', window.scrollY > 32);
      var anchorLine = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) + 2;
      var current = sections[0];
      sections.forEach(function (item) {
        if (item.target.getBoundingClientRect().top <= anchorLine) current = item;
      });
      if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2) current = sections[sections.length - 1];
      sections.forEach(function (item) {
        if (item === current) item.link.setAttribute('aria-current', 'location');
        else item.link.removeAttribute('aria-current');
      });
    };
    var scheduleUpdate = function () {
      if (!framePending) {
        framePending = true;
        window.requestAnimationFrame(updateHeader);
      }
    };
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate);
    window.addEventListener('pageshow', scheduleUpdate);
    window.addEventListener('load', scheduleUpdate);
    window.addEventListener('hashchange', scheduleUpdate);
    document.addEventListener('languagechange', scheduleUpdate);
    updateHeader();
  };
})();
