import http from 'k6/http';
import { check, group, sleep } from 'k6';
import { parseHTML } from 'k6/html';
import { Rate } from 'k6/metrics';
const scriptErrors = new Rate('script_errors');

// Substitua pelo endereço do SEU ambiente de homologação. Também aceita BASE_URL via CLI.
const BASE_URL = (__ENV.BASE_URL || 'http://127.0.0.1:8000/').replace(/\/?$/, '/');
const ORIGIN = BASE_URL.match(/^https?:\/\/[^/]+/)[0];
// Substitua estes IDs se as seções do HTML mudarem. Fragmentos # não chegam ao servidor.
const ANCHORS = ['inicio', 'sobre', 'programas', 'transparencia', 'apoie', 'contato', 'aulas'];
// Substitua pelos links reais se mudar o telefone ou o perfil. Não enviamos requisições a eles.
const WHATSAPP_PREFIX = 'https://wa.me/5534992000208?text=';
const INSTAGRAM_URL = 'https://www.instagram.com/institutokhuririm/';
const smoke = __ENV.SMOKE === '1';

export const options = {
  scenarios: {
    visitors: {
      executor: 'ramping-vus',
      startVUs: smoke ? 1 : 10,
      stages: smoke ? [
        { duration: '2s', target: 2 },
        { duration: '2s', target: 0 },
      ] : [
        { duration: '15s', target: 10 }, // começa com 10 usuários
        { duration: '30s', target: 50 }, // aumento gradual
        { duration: '1m', target: 50 }, // mantém 50 usuários simultâneos por 1 minuto
        { duration: '15s', target: 0 }, // encerra gradualmente
      ],
      gracefulRampDown: '15s',
    },
  },
  thresholds: {
    http_req_failed: ['rate<0.01'],
    http_req_duration: ['p(95)<1500'],
    'http_req_duration{kind:document}': ['p(95)<1000'],
    checks: ['rate==1'],
    script_errors: ['rate==0'],
  },
  // Limita o paralelismo por usuário; 50 VUs não significa 50 requisições/s.
  batchPerHost: 6,
  discardResponseBodies: true,
};

// Resolve somente arquivos do próprio site; nunca gera carga em terceiros.
function localAsset(path) {
  if (!path || /^(data:|javascript:|#)/i.test(path)) return null;
  let url;
  if (/^https?:\/\//i.test(path)) url = path;
  else if (path.startsWith('//')) url = BASE_URL.split(':')[0] + ':' + path;
  else url = path.startsWith('/') ? ORIGIN + path : BASE_URL + path.replace(/^\.\//, '');
  return url.startsWith(ORIGIN + '/') ? url : null;
}

function visit() {
  let document;
  group('01 · Abrir a página', () => {
    const response = http.get(BASE_URL, {
      responseType: 'text', redirects: 0, tags: { kind: 'document', name: 'page' },
    });
    check(response, {
      'página responde HTTP 200': r => r.status === 200,
      'HTML do instituto recebido': r => !!r.body && r.body.includes('Instituto Khuririm'),
    });
    if (response.status === 200 && response.body) document = parseHTML(response.body);
  });
  if (!document) { sleep(1); return; }

  group('02 · Recursos da página e idiomas', () => {
    const urls = new Set();
    // Inclui imagens (também as lazy), scripts, CSS e fontes declaradas no HTML.
    const resources = document.find('img[src], script[src], link[href]');
    for (let index = 0; index < resources.size(); index++) {
      const element = resources.eq(index);
      const path = element.attr('src') || element.attr('href');
      const url = localAsset(path);
      if (url) urls.add(url);
    }
    const responses = http.batch([...urls].map(url => ({
      method: 'GET', url, params: { redirects: 0, tags: { kind: 'asset' } },
    })));
    responses.forEach(response => check(response, { 'recurso responde HTTP 200': r => r.status === 200 }));
    check(document, {
      'seletor PT existe': d => d.find('[data-language="pt"]').size() === 1,
      'seletor EN existe': d => d.find('[data-language="en"]').size() === 1,
      'dicionário de tradução carregável': d => d.find('script[src="assets/js/i18n.js"]').size() === 1,
    });
    // k6/http não executa JavaScript: clique, tradução e localStorage são testados em browser.js.
  });

  group('03 · Links para seções internas', () => {
    ANCHORS.forEach(id => check(document, {
      [`âncora #${id} e destino existem`]: d => d.find(`[href="#${id}"]`).size() > 0 && d.find(`[id="${id}"]`).size() === 1,
    }));
    // Não fazemos GET /#sobre: seria apenas outra requisição à mesma página.
  });

  group('04 · Botão WhatsApp', () => {
    check(document.find('.wa-float'), {
      'WhatsApp aponta para o contato correto': a => (a.attr('href') || '').startsWith(WHATSAPP_PREFIX),
      'WhatsApp abre em nova aba': a => a.attr('target') === '_blank',
    });
  });

  group('05 · Botão Instagram', () => {
    check(document.find('.instagram-float'), {
      'Instagram aponta para o perfil correto': a => a.attr('href') === INSTAGRAM_URL,
      'Instagram abre em nova aba': a => a.attr('target') === '_blank',
    });
  });
  // Tempo de leitura entre visitas; cada iteração representa uma visita sem cache.
  sleep(smoke ? 0.2 : 2 + Math.random() * 3);
}

// Exceções de execução também reprovam o teste, mesmo com checks anteriores aprovados.
export default function () {
  try {
    visit();
    scriptErrors.add(false);
  } catch (error) {
    scriptErrors.add(true);
    throw error;
  }
}
