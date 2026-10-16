// Instituto Khuririm · interações leves (sem dependências)
(function () {
  // Menu mobile
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('menu');
  if (toggle && nav) {
    var setOpen = function (open) {
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
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
      var original = btn.textContent;
      var avisar = function (texto) {
        btn.textContent = texto;
        setTimeout(function () { btn.textContent = original; }, 2500);
      };
      if (!navigator.clipboard) { avisar('Copie manualmente'); return; }
      navigator.clipboard.writeText(valor).then(function () { avisar('Copiado!'); }, function () { avisar('Copie manualmente'); });
    });
  });

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
