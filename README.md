# Instituto Khuririm

Site institucional estático em HTML, CSS e JavaScript puro, com layout responsivo,
traduções PT/EN e recursos locais. Não há dependências de aplicação nem etapa de build.

## Desenvolvimento

Com Python 3 instalado, execute na raiz do projeto:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Em ambientes que utilizam `python3`, substitua `python` por `python3`.
Abra http://127.0.0.1:8000/. O servidor Python é destinado ao desenvolvimento.

## Organização

```text
index.html                  Conteúdo, seções, acessibilidade e SEO
assets/css/base.css         Fontes, variáveis, tipografia e estilos globais
assets/css/layout.css       Contêineres, cabeçalho, menu, idiomas e rodapé
assets/css/components.css   Botões, cards, carrosséis, modal e animações
assets/css/sections.css     Estilos específicos das seções
assets/js/i18n.js           Dicionários PT/EN e controle do idioma
assets/js/main.js           Inicialização dos componentes e ano do rodapé
assets/js/components/       Menu, PIX, carrosséis, modal e animações
assets/img/                 Marca, bandeiras, galeria e fotografias
assets/fonts/               Outfit e DM Sans em WOFF2
docs/maintenance.md        Guia de manutenção
```

Os CSS são carregados na ordem `base`, `layout`, `components`, `sections`.
Os scripts usam `defer`: primeiro `i18n.js`, depois os componentes e por último
`main.js`. O site pode ser servido diretamente por uma hospedagem estática.

## Idiomas (PT/EN)

O seletor utiliza `data-language="pt"` e `data-language="en"`. O arquivo
`assets/js/i18n.js` mantém o dicionário `translations` com as mesmas chaves nos
dois idiomas. Use `data-i18n="chave"` para textos e `data-i18n-alt`,
`data-i18n-aria-label` ou `data-i18n-content` para atributos.

As traduções são aplicadas com `textContent`; marque separadamente os trechos
que contenham links ou destaques. Menu e PIX utilizam `SiteI18n.t(chave)`.
A preferência fica em `localStorage`, na chave `khuririm-language`. O padrão
é português; armazenamento bloqueado não impede a troca de idioma.

## Conteúdo e manutenção

Consulte [docs/maintenance.md](docs/maintenance.md) para editar conteúdo,
imagens, estilos e interações. Os campos entre colchetes, como CNPJ e links
de relatórios, ainda precisam ser preenchidos. O endereço e o mapa já estão
presentes na página. O script de estatísticas Cloudflare do domínio original
não está incluído nesta cópia.
