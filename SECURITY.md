# Segurança — Portfólio (Repositorio-Curriculo)

Este documento descreve a postura de segurança do portfólio estático e das demonstrações embutidas.

## Escopo

- Site estático publicado no GitHub Pages (sem backend próprio).
- Demonstrações: Seu Manoel, Beauty Store e Papitos (JavaScript no navegador, `localStorage`).
- Demos externas carregadas em `<iframe>` com `sandbox="allow-scripts allow-same-origin allow-forms allow-modals"` e `referrerPolicy="no-referrer"`.

## Controles implementados

- **XSS (armazenado):** dados vindos do `localStorage` (carrinho, favoritos) são escapados com `escapeHtml` antes de serem interpolados em `innerHTML` (Beauty Store). Papitos e Seu Manoel usam `createElement` + `textContent`, sem `innerHTML` com dados dinâmicos.
- **XSS (refletido):** não há parâmetros de URL consumidos em renderização.
- **Iframes:** demos carregadas com timeout de 8s e handler de erro; sandbox restringe capacidades.
- **Links externos:** todos os `target="_blank"` usam `rel="noopener"`.
- **Privacidade:** sem coleta de dados; formulários são demonstrativos e não enviam informações.
- **Segredos:** nenhum token, chave ou credencial no repositório. `.env` e artefatos locais estão no `.gitignore`.

## Como reportar

Abra uma issue em https://github.com/Japapaz696/Repositorio-Curriculo com o título `[security]` e uma descrição reproduzível. Não inclua dados pessoais.

## Limitações conhecidas

- Site estático: sem CSP configurado no servidor (GitHub Pages). A mitigação de XSS é feita no código (escape + DOM seguro).
- Demonstrações usam `localStorage` (dados locais, não sensíveis).