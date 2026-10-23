// Pilha de fotos: mouse, toque, teclado e gesto horizontal.
(function () {
  var stack = document.querySelector('[data-hero-stack]');
  if (!stack) return;
  var photos = Array.from(stack.querySelectorAll('[data-hero-photo]'));
  var selectors = Array.from(stack.querySelectorAll('[data-hero-select]'));
  var primary = photos.findIndex(function (photo) { return photo.hasAttribute('data-hero-primary'); });
  var active = primary < 0 ? 0 : primary;
  var hoverReady = 0;
  var hover = window.matchMedia('(hover: hover) and (pointer: fine)');

  function select(index) {
    active = (index + photos.length) % photos.length;
    photos.forEach(function (photo, i) {
      photo.classList.remove('is-front', 'is-left', 'is-right');
      photo.classList.add(i === active ? 'is-front' : (i === (active + 1) % photos.length ? 'is-left' : 'is-right'));
      photo.setAttribute('aria-pressed', String(i === active));
      selectors[i].setAttribute('aria-pressed', String(i === active));
    });
  }
  function labelControls() {
    photos.forEach(function (photo, i) {
      var label = photo.querySelector('img').alt;
      photo.setAttribute('aria-label', label);
      selectors[i].setAttribute('aria-label', label);
    });
  }
  photos.forEach(function (photo, i) {
    photo.addEventListener('click', function () { select(i); });
    selectors[i].addEventListener('click', function () { select(i); });
  });
  stack.addEventListener('pointermove', function (event) {
    if (!hover.matches || event.pointerType !== 'mouse' || Date.now() < hoverReady) return;
    var photo = event.target.closest('[data-hero-photo]');
    var index = photos.indexOf(photo);
    if (index < 0 || index === active) return;
    hoverReady = Date.now() + 600;
    select(index);
  });
  stack.addEventListener('keydown', function (event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    select(active + (event.key === 'ArrowRight' ? 1 : -1));
    selectors[active].focus();
  });
  var start = null;
  var suppressClick = false;
  stack.addEventListener('pointerdown', function (event) {
    if (event.pointerType === 'mouse') return;
    start = { x: event.clientX, y: event.clientY };
  });
  stack.addEventListener('pointerup', function (event) {
    if (!start) return;
    var dx = event.clientX - start.x;
    var dy = event.clientY - start.y;
    start = null;
    if (Math.abs(dx) < 40 || Math.abs(dx) <= Math.abs(dy)) return;
    suppressClick = true;
    select(active + (dx < 0 ? 1 : -1));
    window.setTimeout(function () { suppressClick = false; }, 0);
  });
  stack.addEventListener('pointercancel', function () { start = null; });
  stack.addEventListener('click', function (event) {
    if (suppressClick) { event.preventDefault(); event.stopImmediatePropagation(); }
  }, true);
  document.addEventListener('languagechange', labelControls);
  select(active);
  labelControls();
})();
