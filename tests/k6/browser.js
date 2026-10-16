import { browser } from 'k6/browser';
import { check, group } from 'k6';
import { Counter } from 'k6/metrics';
const completedFlows = new Counter('completed_browser_flows');

const BASE_URL = __ENV.BASE_URL || 'http://127.0.0.1:8000/';
// Substitua IDs e links se mudar o HTML, o telefone ou o perfil do instituto.
const ANCHORS = ['sobre', 'programas', 'transparencia', 'apoie', 'contato'];
const WHATSAPP_PREFIX = 'https://wa.me/5534992000208?text=';
const INSTAGRAM_URL = 'https://www.instagram.com/institutokhuririm/';

export const options = {
  scenarios: {
    interactions: {
      executor: 'shared-iterations', vus: 1, iterations: 1,
      options: { browser: { type: 'chromium' } },
    },
  },
  thresholds: { checks: ['rate==1'], completed_browser_flows: ['count==1'] },
};

export default async function () {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  completedFlows.add(0);
  try {
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    group('01 · Abrir a página', () => {
      check(page, { 'título carregado': p => p.url().startsWith(BASE_URL) });
    });

    for (const language of ['en', 'pt']) {
      await page.locator(`[data-language="${language}"]`).click();
      const state = await page.evaluate(function () { return {
        lang: document.documentElement.lang,
        saved: localStorage.getItem('khuririm-language'),
        heading: document.querySelector('h1').textContent,
      }; });
      // group() não aceita callback async; ações aguardadas ficam antes do grupo de verificações.
      group(`02 · Trocar idioma para ${language.toUpperCase()}`, () => {
        check(state, {
          'idioma aplicado': s => s.lang === (language === 'pt' ? 'pt-BR' : 'en'),
          'preferência salva': s => s.saved === language,
          'título traduzido': s => s.heading.includes(language === 'pt' ? 'Transformando vidas.' : 'Transforming lives.'),
        });
      });
    }
    await page.reload({ waitUntil: 'networkidle' });
    const savedLang = await page.locator('html').getAttribute('lang');
    group('03 · Persistência após recarregar', () => {
      check(savedLang, { 'português permanece ativo': lang => lang === 'pt-BR' });
    });

    for (const id of ANCHORS) {
      await page.locator(`#menu a[href="#${id}"]`).click();
      const result = await page.evaluate(function (sectionId) { return {
        hash: location.hash, exists: !!document.getElementById(sectionId),
      }; }, id);
      group(`04 · Navegar para #${id}`, () => {
        check(result, { 'navegação interna funciona': r => r.hash === `#${id}` && r.exists });
      });
    }

    // Executa cliques reais, interceptando SOMENTE estes dois links antes da navegação.
    // Confirma o destino sem abrir abas ou enviar tráfego ao WhatsApp/Instagram.
    await page.evaluate(function () {
      window.socialClicks = {};
      for (const selector of ['.wa-float', '.instagram-float']) {
        document.querySelector(selector).addEventListener('click', function (event) {
          event.preventDefault();
          window.socialClicks[selector] = event.currentTarget.href;
        });
      }
    });
    for (const [selector, label, expected] of [
      ['.wa-float', 'WhatsApp', WHATSAPP_PREFIX],
      ['.instagram-float', 'Instagram', INSTAGRAM_URL],
    ]) {
      await page.locator(selector).click();
      const destination = await page.evaluate(function (key) { return window.socialClicks[key]; }, selector);
      group(`05 · Clicar em ${label}`, () => {
        check(destination, { 'clique aponta ao destino correto': url => !!url && (label === 'WhatsApp' ? url.startsWith(expected) : url === expected) });
      });
    }
    completedFlows.add(1);
  } finally {
    await page.close();
  }
}
