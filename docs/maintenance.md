# Manutenção do site

## Execução e publicação

No VS Code, execute a tarefa **Instituto Khuririm: prévia local** e abra
`http://127.0.0.1:8767/`. O mesmo servidor pode ser iniciado por
`scripts/serve-site.ps1`. Não abra diretórios por `file://`.
Não há build nem gerenciador de pacotes.
O mapa de arquivos e a rotina de validação estão em [project-structure.md](project-structure.md).
A publicação deve disponibilizar `index.html`, as quatro pastas de páginas e `assets/` mantendo a estrutura
relativa. A documentação não é necessária para servir o site.
Preserve as configurações existentes da hospedagem e do Git.

## Conteúdo e acessibilidade

O conteúdo agora está distribuído entre `index.html`, `programas/index.html`,
`quem-somos/index.html`, `transparencia/index.html` e `apoie/index.html`.
O contato permanece no fim da página inicial; as páginas internas usam links
para `/#contato` por meio da base relativa. Preserve IDs e links entre páginas.
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
4. `assets/css/sections.css`: história, programas, transparência,
   apoio e contato.
5. `assets/css/hero.css`: apresentação inicial, fundo animado, fotos e pilares.
6. `assets/css/pages.css`: páginas internas, resumos e formulário demonstrativo.

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
7. `components/hero-photos.js` registra `initHeroPhotos` para a pilha de fotos.
8. `main.js` chama essas funções de `window.SiteComponents` uma única vez e
   atualiza o ano do rodapé.
9. `pages.js` indica a página atual e controla a demonstração do formulário.

Não adicione `async` nem repita as inicializações: isso pode alterar a ordem
de execução ou duplicar eventos. Cada componente mantém suas variáveis locais
à inicialização. Menu e PIX dependem de `SiteI18n.t()`.
A Clipboard API requer contexto seguro, como HTTPS ou localhost; quando
indisponível, o botão mantém a orientação de cópia manual.

## Traduções

Os dicionários PT/EN/ES e o mecanismo permanecem em `assets/js/i18n.js`.
Adicione a mesma chave nos três idiomas e associe-a ao HTML por `data-i18n`.
Para atributos, use `data-i18n-alt`, `data-i18n-aria-label`, `data-i18n-content`
e `data-i18n-placeholder`.
Preserve as chaves e o uso de `textContent`, sem injetar HTML nas traduções.
Preserve `window.SiteI18n`, o evento `languagechange`, a chave de armazenamento
`khuririm-language`, `html.lang` e `aria-pressed`. Verifique a preferência após
recarregar e com armazenamento bloqueado.

## Imagens e fontes

Todas as imagens em `assets/img/brand`, `flags`, `gallery`, `photos`, `sponsors`
e `backgrounds` e as fontes
em `assets/fonts/` são mantidas. Não remova variantes apenas porque não aparecem
em um `src`. Ao substituir imagens, revise `src`, `srcset`, `sizes`, dimensões,
texto alternativo e traduções. Preserve carregamento lazy das imagens secundárias
e prioridade da imagem principal. A foto principal atual é `alunas-jiu-jitsu.jpg`,
com preload no HTML e marcação `data-hero-primary`. Ao introduzir variantes,
mantenha `imagesrcset` e `imagesizes` do preload alinhados ao `srcset` da imagem.

## SEO e integrações

Cada página contém título, descrição, URL canônica, Open Graph e cartão do Twitter;
a página inicial também mantém JSON-LD. Ao trocar domínio ou marca, revise URLs absolutas de `og:image` e
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
a foto é aberta diretamente. O bloco `apoiadores` pertence à seção `apoie`.
A classe `sponsors-static` mantém os dois cartões lado a lado. Ao incluir mais
apoiadores, revise esse modo e o carrossel em `components/carousels.js`.
O carrossel atual possui controles manuais; rolagem automática ainda não foi implementada.

Após mudanças, confira o console e a rede do navegador, o carregamento das
imagens e fontes e as telas de 1440 e 390 pixels. Verifique os três idiomas,
a preferência após recarregar, menu mobile, Escape, PIX, carrosséis, modal,
âncoras, links sociais, navegação por teclado e redução de movimento.

## Revisão de navegação de 22/10/2026

O seletor de idiomas acompanha o menu em telas de até 1000 px e retorna ao
cabeçalho no desktop. O botão de voltar ao topo aparece após 400 px de rolagem.
Os carrosséis respeitam a preferência de movimento reduzido do sistema.

Nesta revisão, o Edge headless abriu o HTML local e verificou PT/EN/ES em
320, 390, 768, 1000, 1001, 1366 e 1920 px. Passaram as verificações de ausência
de rolagem horizontal, erros JavaScript, âncoras inválidas e traduções de texto
ausentes, além do carregamento das imagens sem lazy loading, posição dos idiomas,
menu móvel, fechamento com Escape e visibilidade do botão de voltar ao topo.
A revisão não verificou hospedagem, Clipboard API em HTTPS ou outros navegadores.

## Atualizações de 23/10/2026

Os rótulos pequenos das seções e os dois botões da hero foram removidos.
O título inicial ocupa duas linhas responsivas, e os quatro pilares permanecem
lado a lado também no celular. Os estilos da hero ficam isolados em `hero.css`.

A hero reúne três fotos; a foto das duas alunas aparece primeiro. A seleção
funciona por mouse, toque, gesto horizontal e teclado. O fundo usa uma única
fotografia animada por transformação CSS, com degradê e textura SVG sobrepostos.
`prefers-reduced-motion` desativa a animação e as transições das fotos.

Caporezzo e Lapidare possuem cartões clicáveis com os respectivos links do
Instagram, indicação discreta no hover e foco visível. Suas imagens ficam em
`assets/img/sponsors/`. A logo da Lapidare foi fornecida em 150 × 150 pixels;
uma versão maior poderá melhorar a nitidez em telas de alta densidade.

A cópia de publicação do Sites fica isolada em `.sites-preview/`, ignorada pelo
Git. Um push para o GitHub não atualiza automaticamente o Sites. A prévia já
publicada é pública; não envie repositório, arquivos internos ou credenciais
junto dos arquivos destinados ao navegador.

Após a reorganização, a validação local verificou os oito scripts JavaScript,
os recursos do HTML/CSS, 24 IDs únicos, âncoras e JSON-LD. O Edge headless
verificou o fundo e a hero em 320, 390, 768, 1024, 1440 e 1920 px, incluindo
movimento reduzido, seleção por mouse e gesto de toque. Os apoiadores passaram
em 320, 390, 768 e 1440 px nos três idiomas. Não houve erros JavaScript nem
rolagem horizontal nesses cenários.

## Implementação da prévia aprovada em 24/10/2026

A navegação passou a usar páginas separadas para programas, quem somos,
transparência e apoio. O contato permanece no fim da página inicial. A hero
voltou a apresentar um único botão, “Apoiar o Instituto”, que abre a página
de apoio, conforme a prévia aprovada.

O formulário da página Apoie reproduz a prévia e valida os dados no navegador.
Seu envio continua demonstrativo: nenhuma mensagem é transmitida ou armazenada.
Antes de habilitar inscrições reais, configure o serviço de envio e os itens
pendentes descritos em `pending-content.md`.

O verificador local agora percorre as cinco páginas. A conferência visual em
1440, 1024, 768, 390 e 320 px comparou a implementação com a prévia aprovada.
Também foram verificados navegação, seleção de fotos, galeria, cópia da chave
PIX, idiomas e os estados do formulário. Esta etapa não incluiu publicação.
