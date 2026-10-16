# Instituto Khuririm

Versão estática do site https://institutokhuririm.com.br/, preparada como base para melhorias.

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
