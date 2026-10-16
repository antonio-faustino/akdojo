# Instituto Khuririm

Versão estática do site em andamento...

## Desenvolvimento

Requer Python 3. Não há dependências para instalar nem etapa de build.

```sh
cd /workspace/akdojo
python3 -m http.server 8000 --bind 127.0.0.1
```

- `index.html`: conteúdo e estrutura da página.
- `assets/css/style.css`: cores, tipografia e layout responsivo.
- `assets/js/main.js`: menu mobile, copiar PIX e animações.
- `assets/img/` e `assets/fonts/`: imagens e fontes locais.

O conteúdo, os links e os campos entre colchetes foram preservados do original. Horários, endereço, dados institucionais e mapa ainda precisam ser preenchidos. O script de estatísticas Cloudflare do domínio original não foi incluído nesta cópia.

Validação feita em Chromium nas larguras de 1440 e 390 pixels: carregamento dos recursos, navegação interna, menu mobile e cópia da chave PIX. Esta versão ainda não foi publicada na internet.

## Idiomas (PT/EN)

O seletor no cabeçalho usa botões `data-language="pt"` e `data-language="en"`.
O arquivo `assets/js/i18n.js` mantém o dicionário `translations`, separado em
`pt` e `en`. Associe um texto do HTML à chave com `data-i18n="chave"` e adicione
a mesma chave aos dois idiomas. Textos são aplicados via `textContent`;
para preservar destaques ou links, marque cada trecho separadamente.

Para traduzir atributos, use `data-i18n-alt="chave"`,
`data-i18n-aria-label="chave"` ou `data-i18n-content="chave"`.
`main.js` usa `SiteI18n.t(chave)` para mensagens dinâmicas de menu e PIX.
A preferência fica em `localStorage`, na chave `khuririm-language`.
O padrão é português; preferências inválidas ou armazenamento bloqueado
não impedem o uso do seletor. O atributo `lang` da página e o estado
`aria-pressed` dos botões acompanham o idioma ativo.

## Testes de carga e navegação

Veja [tests/k6/README.md](tests/k6/README.md) para os testes HTTP e de navegador,
com estágios de 10 a 50 usuários e instruções de execução.
