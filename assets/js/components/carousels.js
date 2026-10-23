// Instituto Khuririm · carousels
(function () {
  window.SiteComponents = window.SiteComponents || {};
  window.SiteComponents.initCarousels = function () {
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
          sponsorsTrack.scrollBy({ left: direction * (slide.getBoundingClientRect().width + gap), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
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
          galleryTrack.scrollBy({ left: direction * (slide.getBoundingClientRect().width + gap), behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
        });
      });
      galleryTrack.addEventListener('scroll', updateGalleryButtons, { passive: true });
      window.addEventListener('resize', updateGalleryButtons);
      updateGalleryButtons();
    }
  };
})();
