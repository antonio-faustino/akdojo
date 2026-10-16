# Carga e interações com K6

A página é estática, com interações em JavaScript. Trocar idioma e navegar por
âncoras não faz novas requisições ao servidor. Os botões sociais abrem terceiros.
Por isso, os testes separam capacidade HTTP de comportamento no navegador.

## Preparação

Instale o K6 seguindo https://grafana.com/docs/k6/latest/set-up/install-k6/.
Para `browser.js`, instale também Chrome ou Chromium. Scripts validados com K6
1.3.0 e Chromium. Execute os comandos abaixo a partir da raiz do repositório.

Para testar a cópia local, em outro terminal:

```sh
python3 -m http.server 8000 --bind 127.0.0.1
```

## Verificação rápida local

```sh
k6 run -e SMOKE=1 tests/k6/load.js
k6 run tests/k6/browser.js
```

Se o K6 não detectar o Chromium, configure `K6_BROWSER_EXECUTABLE_PATH` com o
caminho do executável. Neste ambiente ele fica em `/usr/bin/chromium`.

## Carga: 10 → 50 → 0 usuários

Substitua `https://seu-site.example/` pelo endereço final, com HTTPS e barra no
final. Prefira homologação. Execute carga apenas na infraestrutura sob sua
responsabilidade, em janela combinada com a hospedagem.

```sh
k6 run -e BASE_URL=https://seu-site.example/ tests/k6/load.js
```

O perfil padrão mantém 10 VUs por 15s, sobe até 50 em 30s, mantém 50 por 1 minuto
e reduz até zero em 15s. Há até 15s adicionais para terminar visitas em andamento.
Cada visita solicita HTML e recursos locais em paralelo, seguidos de 2 a 5s de
leitura. Sem cache entre visitas, o teste representa visitas novas percorrendo a
galeria, incluindo imagens lazy; não reproduz exatamente o cache ou o waterfall
real de um navegador. Apenas as URLs declaradas no HTML são solicitadas; recursos
carregados exclusivamente por CSS ou JavaScript futuro devem ser acrescentados.
Redirecionamentos HTTP não são seguidos: use a URL final para evitar resultados
que incluam destinos inesperados.

Os grupos verificam carregamento, recursos/idiomas, âncoras, WhatsApp e Instagram.
O teste HTTP não executa cliques, JavaScript nem localStorage. As URLs externas
são verificadas no HTML, sem gerar requisições aos serviços terceiros.

Critérios iniciais, ajustáveis ao SLA da hospedagem:

- menos de 1% de falhas HTTP;
- 95% das respostas em menos de 1500ms;
- 95% das respostas HTML em menos de 1000ms;
- todas as verificações funcionais aprovadas.

## Navegador: cliques reais

```sh
k6 run -e BASE_URL=https://seu-site.example/ tests/k6/browser.js
```

Usa um navegador, uma visita. Verifica PT/EN, conteúdo traduzido, localStorage,
recarga, cliques nas âncoras e nos dois ícones flutuantes. Os cliques sociais são
interceptados antes de abrir novas abas; o destino é validado sem visitar
WhatsApp ou Instagram. Não valida o atendimento nem o funcionamento desses
serviços externos. As funções de `group()` são síncronas: operações assíncronas
do navegador são aguardadas antes das verificações de cada grupo.

Não execute 50 navegadores para medir apenas capacidade do servidor estático:
isso pode saturar a máquina que gera o teste antes da hospedagem. Rode o teste
HTTP de carga e este teste de navegador separadamente. A métrica
`completed_browser_flows` exige que o roteiro inteiro termine, para que uma
exceção antes das últimas verificações não pareça um resultado aprovado.

## Interpretação

50 VUs significam 50 visitantes simultâneos, não 50 requisições por segundo.
Observe `http_reqs`, `http_req_failed`, percentis e checks junto das métricas
de CPU, memória, rede, conexões e logs da hospedagem/CDN. Uma execução aprovada
não garante que o servidor nunca cairá. Para encontrar seu limite, aumente a
carga em etapas posteriores com monitoramento; para estabilidade, mantenha a
carga por mais tempo. O perfil atual é uma carga com pico controlado, não uma
busca automática pelo ponto de ruptura.

## Validação realizada

Testes executados apenas contra a cópia local com servidor Python; nenhum teste
de carga foi executado no domínio público. Os resultados locais verificam os
scripts, não a capacidade de produção. Python http.server serve para desenvolvimento,
não para avaliar a hospedagem definitiva.
