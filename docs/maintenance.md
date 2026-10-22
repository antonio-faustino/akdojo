# Manutenção do site

## Execução e publicação

Sirva a raiz via HTTP, conforme o README. Não há build nem gerenciador de pacotes.
A publicação deve disponibilizar `index.html` e `assets/` mantendo a estrutura
relativa. A documentação não é necessária para servir o site.
Preserve as configurações existentes da hospedagem e do Git.

## Conteúdo e acessibilidade

O `index.html` contém a página completa. Preserve IDs e âncoras, incluindo
`inicio`, `sobre`, `programas`, `transparencia`, `apoie`, `contato` e `aulas`.
Classes e atributos `data-*` também são utilizados pelos scripts do site.
Mantenha títulos, link para pular ao conteúdo, textos alternativos, rótulos ARIA,
foco visível e operação por teclado. O menu fecha com Escape e a ampliação de
fotos utiliza o elemento nativo `dialog`. Preserve os ajustes para telas pequenas
e as regras de `prefers-reduced-motion`.

## Estilos

O HTML carrega os arquivos nesta ordem:

1. `assets/css/base.css`: fontes, tokens de marca, estilos globais e foco.
2. `assets/css/layout.css`: contêiner, cabeçalho, menu, idiomas e rodapé.
3. `assets/css/components.css`: botões, cards, citações, carrosséis, modal, PIX,
   botões sociais e animações.
4. `assets/css/sections.css`: apresentação, história, programas, transparência,
   apoio e contato.

As media queries ficam na responsabilidade correspondente. A ordem das regras
dentro de cada arquivo importa para a cascata. Verifique os três idiomas e
telas largas e estreitas ao alterar estilos compartilhados. Os caminhos
`url(../fonts/...)` são relativos ao CSS; preserve esse nível de pasta.

## JavaScript

Os scripts são clássicos e usam `defer`, nesta ordem no HTML:

1. `i18n.js` disponibiliza `window.SiteI18n` e aplica o idioma inicial.
2. `components/navigation.js` registra `initNavigation`.
3. `components/clipboard.js` registra `initClipboard`.
4. `components/carousels.js` registra `initCarousels` para galeria e apoiadores.
5. `components/lightbox.js` registra `initLightbox` para ampliar fotos.
6. `components/animations.js` registra `initAnimations`.
7. `main.js` chama essas funções de `window.SiteComponents` uma única vez e
   atualiza o ano do rodapé.

Não adicione `async` nem repita as inicializações: isso pode alterar a ordem
de execução ou duplicar eventos. Cada componente mantém suas variáveis locais
à inicialização. Menu e PIX dependem de `SiteI18n.t()`.
A Clipboard API requer contexto seguro, como HTTPS ou localhost; quando
indisponível, o botão mantém a orientação de cópia manual.

## Traduções

Os dicionários PT/EN/ES e o mecanismo permanecem em `assets/js/i18n.js`.
Adicione a mesma chave nos três idiomas e associe-a ao HTML por `data-i18n`.
Para atributos, use `data-i18n-alt`, `data-i18n-aria-label` e `data-i18n-content`.
Preserve as chaves e o uso de `textContent`, sem injetar HTML nas traduções.
Preserve `window.SiteI18n`, o evento `languagechange`, a chave de armazenamento
`khuririm-language`, `html.lang` e `aria-pressed`. Verifique a preferência após
recarregar e com armazenamento bloqueado.

## Imagens e fontes

Todas as imagens em `assets/img/brand`, `flags`, `gallery` e `photos` e as fontes
em `assets/fonts/` são mantidas. Não remova variantes apenas porque não aparecem
em um `src`. Ao substituir imagens, revise `src`, `srcset`, `sizes`, dimensões,
texto alternativo e traduções. Preserve carregamento lazy das imagens secundárias
e prioridade da imagem principal. Seu preload também contém `imagesrcset` e
`imagesizes`, que devem acompanhar alterações.

## SEO e integrações

O HTML contém título, descrição, URL canônica, Open Graph, cartão do Twitter
e JSON-LD. Ao trocar domínio ou marca, revise URLs absolutas de `og:image` e
logo no JSON-LD, favicon, apple-touch-icon e preloads. A reorganização mantém
esses valores.
WhatsApp, Instagram e Google Maps estão no HTML. Ao trocar telefone ou perfil,
revise os links correspondentes em todas as seções e nos botões flutuantes.

## Verificação manual

Na organização final de 22/10/2026, foram verificadas a sintaxe dos sete scripts,
209 chaves em cada um dos dicionários PT/EN/ES, recursos locais e âncoras.
No Edge headless, as larguras 320, 390, 768, 1024, 1366 e 1920 px passaram nos
três idiomas, sem rolagem horizontal nem erros JavaScript, com a foto principal
carregada. Menu móvel, Escape e ampliação de fotos também passaram. Essas
verificações não substituem a confirmação dos dados pelo responsável.

Na revisão de 22/10/2026, o Edge headless verificou as larguras 320, 360, 390,
600, 768, 820, 1000, 1024, 1280, 1366, 1440 e 1920 px em PT/EN, sem rolagem
horizontal, sobreposição no cabeçalho ou erros JavaScript. Menu móvel e modal
de fotos também foram verificados. Safari e Firefox não foram executados;
confira esses navegadores antes de afirmar compatibilidade validada.

O menu possui fallback de altura com `vh`, e o listener de mudança de largura
aceita a API antiga de MediaQueryList. Em navegadores sem `dialog.showModal`,
a foto é aberta diretamente. A classe `sponsors-single` deve ser removida se
novos apoiadores forem adicionados ao carrossel.

Após mudanças, confira o console e a rede do navegador, o carregamento das
imagens e fontes e as telas de 1440 e 390 pixels. Verifique os três idiomas,
a preferência após recarregar, menu mobile, Escape, PIX, carrosséis, modal,
âncoras, links sociais, navegação por teclado e redução de movimento.
