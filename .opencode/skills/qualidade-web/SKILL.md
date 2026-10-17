---
name: qualidade-web
description: Revisao de HTML CSS JavaScript para acessibilidade WCAG, performance, responsividade, formulários, estados e depuracao segura.
compatibility: opencode
---

# Engenharia frontend verificavel

1. Confirmar problema reproduzido ou demonstrado no codigo antes de corrigir.
2. Trabalhar com diffs pequenos e preservar alteracoes nao commitadas.
3. HTML: landmarks, rotulos, foco, botoes versus links, estados ARIA validos.
4. CSS: tokens, contraste de texto, breakpoints, overflow, fontes, reduced motion.
5. JS: protecao de localStorage corrompido, promessas, erros, navegacao por teclado, formulários.
6. Dependencias e media: evitar duplicatas e hotlinks frageis; nao alterar caminho sem conferir referencias.
7. Executar testes de regressao reais. Reportar comando/resultado e falhas remanescentes.
8. Nao 'corrigir' overflow mascarando todo o layout com overflow-x:hidden sem investigar causa.
9. Se qualquer teste falhar, corrigir ou classificar como pendente com causa.
10. Sem commit, push, publicacao ou alteracoes fora do repositorio sem autorizacao.
