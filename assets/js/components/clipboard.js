// Instituto Khuririm · clipboard
(function () {
  window.SiteComponents = window.SiteComponents || {};
  window.SiteComponents.initClipboard = function () {
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
  };
})();
