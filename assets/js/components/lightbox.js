// Instituto Khuririm · lightbox
(function () {
  window.SiteComponents = window.SiteComponents || {};
  window.SiteComponents.initLightbox = function () {
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
  };
})();
