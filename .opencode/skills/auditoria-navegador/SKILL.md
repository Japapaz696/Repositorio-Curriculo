---
name: auditoria-navegador
description: Testar interfaces no navegador com Playwright e gerar evidencias de problemas reais de responsividade, acessibilidade e interacoes.
compatibility: opencode
---

# Teste antes de afirmar

## Preparar
- Confirmar diretorio Git correto e `git status --short`.
- Reusar suites de Playwright existentes em `tests/` antes de criar outras.
- Abrir paginas via HTTP (evitar `file://` com scripts ES modules).
- Preferir Playwright MCP se conectado; do contrario usar Playwright local existente.
- Confirmar se um MCP externo pede aprovacao antes da execucao.

## Matriz minima
Desktop/movel em 375, 390, 430, 768, 1024 e 1440px.
Para cada pagina relevante: HTTP, JS exceptions, requests 4xx, imagens quebradas, scrollWidth>innerWidth, navegação, modais, teclado, forms.
Verificar especificamente Seu Manoel, Papitos, Beauty Store e portfólio inicial.

## Entrega
- Data e comando usado (sem expor segredos).
- Tabela contendo pagina, viewport, resultado, falhas reproduziveis e caminhos dos screenshots.
- Relatorio separado para hipoteses e para bugs confirmados.
- Se nao tiver navegador disponivel, declarar NAO TESTADO; nao declarar aprovado.
- Nao fazer commit, push ou deploy.
