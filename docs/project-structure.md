# Estrutura do projeto

Site estático do Instituto Khuririm, em HTML, CSS e JavaScript, com idiomas
PT/EN/ES. Não há dependências de aplicação, instalação ou etapa de build.

## Arquivos e responsabilidades

| Caminho | Responsabilidade |
| --- | --- |
| `README.md` | Entrada rápida: endereços da prévia e execução no VS Code. |
| `.vscode/tasks.json` | Tarefa do VS Code para servir o site por HTTP. |
| `index.html` | Página inicial, hero, resumos, galeria e contato. |
| `programas/index.html` | Programas e aulas gratuitas. |
| `quem-somos/index.html` | História, missão, valores, fundador e padrinho. |
| `transparencia/index.html` | Informações institucionais e dados existentes de recebimento. |
| `apoie/index.html` | Formas de apoio, apoiadores e formulário demonstrativo. |
| `assets/css/base.css` | Fontes, cores, tipografia e acessibilidade global. |
| `assets/css/layout.css` | Cabeçalho, navegação, contêineres e rodapé. |
| `assets/css/components.css` | Botões, cartões, galeria e componentes compartilhados. |
| `assets/css/sections.css` | Seções de conteúdo e apoiadores. |
| `assets/css/hero.css` | Hero, fotos interativas, pilares, fundo e responsividade. |
| `assets/css/pages.css` | Estilos da distribuição em páginas e do formulário. |
| `assets/js/i18n.js` | Traduções e preferência de idioma. |
| `assets/js/components/` | Um arquivo por componente. |
| `assets/js/main.js` | Inicialização dos componentes e ano do rodapé. |
| `assets/js/pages.js` | Navegação ativa e formulário demonstrativo. |
| `assets/img/brand/` | Identidade visual e imagens de compartilhamento. |
| `assets/img/backgrounds/` | Fundo da hero e textura. |
| `assets/img/photos/` | Fotos institucionais e da hero. |
| `assets/img/gallery/` | Galeria e variantes de resolução. |
| `assets/img/sponsors/` | Imagens e marcas dos apoiadores. |
| `assets/img/flags/`, `assets/fonts/` | Bandeiras e fontes locais. |
| `scripts/check-site.ps1` | Validação dos recursos e da sintaxe JavaScript. |
| `scripts/serve-site.ps1` | Servidor HTTP local para testar as rotas por pasta. |
| `docs/maintenance.md` | Orientações de edição e registros de validação. |
| `docs/pending-content.md` | Informações e aprovações ainda pendentes. |

## Execução local

No VS Code, execute a tarefa **Instituto Khuririm: prévia local**. No PowerShell:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/serve-site.ps1
```

Abra `http://127.0.0.1:8767/`. A cópia automática do PIX requer HTTPS ou localhost.
Também é possível servir a raiz com outro servidor HTTP estático. Com Python instalado:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Nesse exemplo, abra `http://127.0.0.1:8000/`.

## Validação

No PowerShell, execute a partir da raiz:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/check-site.ps1
git diff --check
```

O script verifica as cinco páginas, recursos locais do HTML e CSS, `srcset`, âncoras, IDs únicos e
JSON-LD. Com Node.js disponível, também verifica a sintaxe de todos os scripts.
Para um executável fora do PATH, passe `-JavaScriptRuntime 'C:/caminho/node.exe'`.
Sem Node.js, a ausência da checagem de sintaxe é informada explicitamente.

Antes de publicar, confira os três idiomas, menu, fotos da hero, galeria, PIX,
links dos apoiadores, teclado e movimento reduzido em telas pequenas e grandes.

## Publicação

Os arquivos necessários à hospedagem são `index.html`, `programas/`, `quem-somos/`,
`transparencia/`, `apoie/` e `assets/`. Preserve os
caminhos relativos. Documentação, scripts de manutenção, histórico Git e arquivos
locais não fazem parte do pacote público.

O formulário ainda é uma simulação local. Não publique a página Apoie como canal
de recebimento de inscrições antes de configurar e validar o envio real.

`.sites-preview/` contém o checkout e os artefatos isolados do Sites. Essa pasta,
logs e arquivos `.env` são ignorados pelo Git. GitHub e Sites têm fluxos distintos
de publicação. O domínio definitivo e outros dados continuam registrados nas
[pendências](pending-content.md).

`.editorconfig` define UTF-8, dois espaços e final de linha LF; `.gitattributes`
padroniza os arquivos de texto no Git. Imagens originais e variantes existentes
são preservadas, incluindo `hero-background.png.png`, mantida como original legado.
