# Instituto Khuririm — site em desenvolvimento

Esta pasta é a fonte do site. As páginas são `index.html`, `programas/`,
`quem-somos/`, `transparencia/` e `apoie/`; Contato fica no fim da página inicial.

## Abrir no VS Code

1. Abra a pasta `akdojo-original` no VS Code.
2. Execute **Terminal → Executar Tarefa → Instituto Khuririm: prévia local**.
3. Abra **http://127.0.0.1:8767/** no navegador do VS Code ou em outro navegador.

Mantenha o terminal da tarefa aberto enquanto navega. Para encerrá-la, pressione
Ctrl+C. Também é possível iniciá-la no PowerShell:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File scripts/serve-site.ps1
```

Não abra `file:///.../programas/` nem outras pastas por `file://`: a navegação
entre páginas usa URLs HTTP e cada pasta é servida pelo respectivo `index.html`.

## Endereços

- **Prévia pública para avaliação:** <https://instituto-khuririm-previa.antoniiotales.chatgpt.site/>. Em 24/10/2026, a versão 13 com as cinco páginas foi publicada nesse projeto Sites.
- **Prévia local do código nesta pasta:** <http://127.0.0.1:8767/>. Só funciona nesta máquina e enquanto a tarefa estiver em execução.
- **Site original de referência:** `institutokhuririm.com.br`. Este projeto não o modifica nem publica nele.

O formulário em Apoie valida os campos, mas **simula o envio**; ainda não há
serviço de e-mail configurado. A pasta `.sites-preview/` contém apenas checkouts
e pacotes de publicação ignorados pelo Git; não é a fonte para editar o site.

Para validação técnica e manutenção, consulte [project-structure.md](docs/project-structure.md)
e [maintenance.md](docs/maintenance.md).
