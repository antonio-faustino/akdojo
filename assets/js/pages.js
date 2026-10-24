// Navigation and demonstrative interest form for the multipage site.
(function () {
  'use strict';

  var page = document.documentElement.getAttribute('data-site-page');
  var pageKeys = {
    'inicio': 'text005',
    'programas': 'text007',
    'quem-somos': 'text006',
    'transparencia': 'text008',
    'apoie': 'text009'
  };
  var navLinks = document.querySelectorAll('#menu a');

  function refreshNavigation() {
    navLinks.forEach(function (link) {
      var href = link.getAttribute('href');
      var active = (page === 'inicio' && href === './') ||
        (page === 'programas' && href === './programas/') ||
        (page === 'quem-somos' && href === './quem-somos/') ||
        (page === 'transparencia' && href === './transparencia/') ||
        (page === 'apoie' && href === './apoie/');
      if (page === 'inicio' && location.hash === '#contato') active = href === './#contato';
      if (active) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
    document.title = window.SiteI18n.t(pageKeys[page] || 'text005') + ' — Instituto Khuririm';
  }
  refreshNavigation();
  window.addEventListener('hashchange', refreshNavigation);
  document.addEventListener('languagechange', refreshNavigation);

  var dialog = document.getElementById('preview-interest-dialog');
  if (!dialog) return;

  var form = document.getElementById('preview-interest-form');
  var result = document.getElementById('preview-form-result');
  var context = document.getElementById('preview-interest-context');
  var nameField = document.getElementById('preview-name');
  var emailField = document.getElementById('preview-email');
  var consentField = document.getElementById('preview-consent');
  var nameError = document.getElementById('preview-name-error');
  var emailError = document.getElementById('preview-email-error');
  var consentError = document.getElementById('preview-consent-error');
  var contextKeys = {
    voluntario: 'preview.form.contextVolunteer',
    empresa: 'preview.form.contextCompany',
    projeto: 'preview.form.contextProject'
  };

  function selection() {
    var checked = form.querySelector('input[name="interest"]:checked');
    return checked ? checked.value : 'projeto';
  }

  function updateContext() {
    context.textContent = window.SiteI18n.t(contextKeys[selection()]);
  }

  function clearErrors() {
    nameError.textContent = '';
    emailError.textContent = '';
    consentError.textContent = '';
    nameField.removeAttribute('aria-invalid');
    emailField.removeAttribute('aria-invalid');
    consentField.removeAttribute('aria-invalid');
  }

  function openForm(interest) {
    form.reset();
    form.hidden = false;
    result.hidden = true;
    clearErrors();
    var radio = form.querySelector('input[name="interest"][value="' + interest + '"]');
    (radio || form.querySelector('input[name="interest"][value="projeto"]')).checked = true;
    updateContext();
    dialog.showModal();
    nameField.focus();
  }

  document.querySelectorAll('[data-interest]').forEach(function (button) {
    button.addEventListener('click', function () { openForm(button.dataset.interest); });
  });
  document.querySelectorAll('[data-dialog-close]').forEach(function (button) {
    button.addEventListener('click', function () { dialog.close(); });
  });
  form.querySelectorAll('input[name="interest"]').forEach(function (radio) {
    radio.addEventListener('change', updateContext);
  });
  document.addEventListener('languagechange', updateContext);

  nameField.addEventListener('input', function () {
    if (nameField.value.trim().length >= 2) {
      nameError.textContent = '';
      nameField.removeAttribute('aria-invalid');
    }
  });
  emailField.addEventListener('input', function () {
    if (emailField.checkValidity()) {
      emailError.textContent = '';
      emailField.removeAttribute('aria-invalid');
    }
  });
  consentField.addEventListener('change', function () {
    if (consentField.checked) {
      consentError.textContent = '';
      consentField.removeAttribute('aria-invalid');
    }
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    clearErrors();
    var invalid = [];
    if (nameField.value.trim().length < 2) {
      nameError.textContent = window.SiteI18n.t('preview.form.errorName');
      nameField.setAttribute('aria-invalid', 'true');
      invalid.push(nameField);
    }
    if (!emailField.checkValidity()) {
      emailError.textContent = window.SiteI18n.t('preview.form.errorEmail');
      emailField.setAttribute('aria-invalid', 'true');
      invalid.push(emailField);
    }
    if (!consentField.checked) {
      consentError.textContent = window.SiteI18n.t('preview.form.errorConsent');
      consentField.setAttribute('aria-invalid', 'true');
      invalid.push(consentField);
    }
    if (invalid.length) {
      invalid[0].focus();
      return;
    }
    // This is a visual validation demo. No request, storage, or notification occurs.
    form.hidden = true;
    result.hidden = false;
    form.reset();
    result.querySelector('button').focus();
  });

  dialog.addEventListener('close', function () {
    form.reset();
    form.hidden = false;
    result.hidden = true;
    clearErrors();
  });
})();
