# Instituto Khuririm

Site institucional estático em HTML, CSS e JavaScript, com versões em português,
inglês e espanhol. Não há dependências de aplicação nem etapa de build.

## Situação do projeto

**95% concluído**, conforme avaliação do responsável. A estrutura e os recursos
estão implementados; a conclusão depende da confirmação dos dados e conteúdos
listados em [docs/pending-content.md](docs/pending-content.md).

## Executar localmente

Sirva a raiz com um servidor HTTP estático. Se tiver Python 3 instalado:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Abra `http://127.0.0.1:8000/`. Em sistemas que usam `python3`, substitua o comando.
A cópia de chave PIX funciona em HTTPS ou localhost; quando a cópia automática
não está disponível, o botão orienta a cópia manual.

## Organização

- `index.html`: conteúdo, navegação, metadados e integrações.
- `assets/css/`: estilos globais, layout, componentes e seções.
- `assets/js/i18n.js`: traduções PT/EN/ES e preferência de idioma.
- `assets/js/components/`: menu, galeria, modal, cópia PIX e animações.
- `assets/img/` e `assets/fonts/`: recursos locais.
- `docs/maintenance.md`: instruções de edição e verificação.
- `docs/pending-content.md`: informações pendentes e critérios de conclusão.

## Publicação

Publique `index.html` e `assets/` mantendo os caminhos relativos. A pasta
`.sites-preview/` contém a cópia isolada do ChatGPT Sites e está ignorada pelo
Git; não faz parte da publicação no domínio definitivo. Alterações no GitHub
não atualizam automaticamente essa cópia privada.

O domínio definitivo `.org.br` ainda depende de confirmação. Antes do lançamento,
revise a URL canônica, Open Graph e JSON-LD, que atualmente usam o domínio
`institutokhuririm.com.br`. Não trate o domínio atual como o destino aprovado.

## Verificação

Confira PT/EN/ES, navegação por âncoras, menu móvel, teclado, galeria, ampliação,
PIX e carregamento de imagens em telas pequenas e grandes. Registros anteriores
de verificação e limitações estão no guia de manutenção.
