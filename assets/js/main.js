// Instituto Khuririm · interações leves (sem dependências)
(function () {
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

  // Copiar chave PIX
  document.querySelectorAll('[data-copy]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var el = document.querySelector(btn.getAttribute('data-copy'));
      if (!el) return;
      var valor = btn.getAttribute('data-copy-value') || el.textContent.trim();
      var resetTimer;
      var avisar = function (key) {
        btn.textContent = window.SiteI18n.t(key);
        clearTimeout(resetTimer);
        resetTimer = setTimeout(function () {
          btn.textContent = window.SiteI18n.t(btn.dataset.i18n);
        }, 2500);
      };
      if (!navigator.clipboard) { avisar('copy.manual'); return; }
      navigator.clipboard.writeText(valor).then(function () { avisar('copy.success'); }, function () { avisar('copy.manual'); });
    });
  });

  // Carrossel de apoiadores
  var sponsorsTrack = document.getElementById('sponsors-track');
  var sponsorsButtons = document.querySelectorAll('[data-sponsors-direction]');
  if (sponsorsTrack && sponsorsButtons.length) {
    var updateSponsorsButtons = function () {
      var maxScroll = sponsorsTrack.scrollWidth - sponsorsTrack.clientWidth;
      sponsorsButtons.forEach(function (button) {
        var direction = Number(button.getAttribute('data-sponsors-direction'));
        button.disabled = direction < 0
          ? sponsorsTrack.scrollLeft <= 1
          : sponsorsTrack.scrollLeft >= maxScroll - 1;
      });
    };
    sponsorsButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var slide = sponsorsTrack.querySelector('.sponsor-slide');
        if (!slide) return;
        var gap = parseFloat(window.getComputedStyle(sponsorsTrack).columnGap) || 0;
        var direction = Number(button.getAttribute('data-sponsors-direction'));
        sponsorsTrack.scrollBy({ left: direction * (slide.getBoundingClientRect().width + gap), behavior: 'smooth' });
      });
    });
    sponsorsTrack.addEventListener('scroll', updateSponsorsButtons, { passive: true });
    window.addEventListener('resize', updateSponsorsButtons);
    updateSponsorsButtons();
  }

  // Carrossel e visualizacao ampliada da galeria
  var galleryTrack = document.getElementById('gallery-track');
  var galleryButtons = document.querySelectorAll('[data-gallery-direction]');
  if (galleryTrack && galleryButtons.length) {
    var updateGalleryButtons = function () {
      var maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
      galleryButtons.forEach(function (button) {
        var direction = Number(button.getAttribute('data-gallery-direction'));
        button.disabled = direction < 0
          ? galleryTrack.scrollLeft <= 1
          : galleryTrack.scrollLeft >= maxScroll - 1;
      });
    };
    galleryButtons.forEach(function (button) {
      button.addEventListener('click', function () {
        var slide = galleryTrack.querySelector('.gallery-slide');
        if (!slide) return;
        var gap = parseFloat(window.getComputedStyle(galleryTrack).columnGap) || 0;
        var direction = Number(button.getAttribute('data-gallery-direction'));
        galleryTrack.scrollBy({ left: direction * (slide.getBoundingClientRect().width + gap), behavior: 'smooth' });
      });
    });
    galleryTrack.addEventListener('scroll', updateGalleryButtons, { passive: true });
    window.addEventListener('resize', updateGalleryButtons);
    updateGalleryButtons();
  }

  var lightbox = document.querySelector('.gallery-lightbox');
  if (lightbox) {
    var lightboxImage = lightbox.querySelector('.gallery-lightbox-image');
    var closeLightbox = lightbox.querySelector('.gallery-lightbox-close');
    document.querySelectorAll('.gallery-image-button').forEach(function (button) {
      button.addEventListener('click', function () {
        var image = button.querySelector('img');
        if (!image || !lightboxImage) return;
        lightboxImage.src = image.currentSrc || image.src;
        lightboxImage.alt = image.alt;
        lightbox.showModal();
      });
    });
    if (closeLightbox) closeLightbox.addEventListener('click', function () { lightbox.close(); });
    lightbox.addEventListener('click', function (event) {
      if (event.target === lightbox) lightbox.close();
    });
  }

  // Ano no rodapé
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

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
})();
