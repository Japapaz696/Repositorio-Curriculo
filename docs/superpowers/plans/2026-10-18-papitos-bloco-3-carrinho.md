# Papitos — carrinho lateral (Bloco 3) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Substituir o carrinho central por um drawer lateral acessível, sem perder nenhuma função do Bloco 2.

**Architecture:** Manter catálogo, `cart-core.js`, IDs completos, persistência e renderização das linhas existentes. Usar `<dialog>` nativo para o carrinho, com abertura à direita, foco e fundo inerte; centralizar seu ciclo de abertura/fechamento para integrar a edição no ProductModal e a passagem ao checkout existente. Sem bibliotecas novas.

**Tech Stack:** HTML, CSS, JavaScript nativo; Node test runner; Playwright MCP com Microsoft Edge.

**Spec:** Escopo incremental aprovado na conversa (carrinho lateral responsivo com edição), retomado pelo usuário com “pode continuar”. Baseline verificável: `projetos/papitos/evidencias/bloco-2/RELATORIO.md` e testes do Bloco 2.

## Global Constraints

- Escopo apenas Papitos, Bloco 3; não iniciar Beauty Store ou Seu Manoel.
- Sem commit, push, publicação, instalação ou mudanças nas configurações OpenCode.
- Preservar alterações anteriores e todas as observações na identidade das linhas.
- Cupons, nova finalização e reformulação visual geral ficam para etapas posteriores.
- Checkout existente deve continuar alcançável; só sua integração de abertura/fechamento pode ser ajustada, não o formulário ou regras de negócio.
- Manter a identidade escura/âmbar, Inter e Bebas Neue.
- Desktop: drawer à direita com largura máxima de 420px e limite de 92vw; até 480px: ocupar toda a largura.
- Cabeçalho e resumo acessíveis; lista com rolagem interna. Em telas baixas, permitir rolagem do resumo sem esconder controles.
- Animação de abertura/fechamento de até 250ms, apenas transform/opacity; reduced-motion elimina a transição.

## Review Focus

1. Abrir/fechar repetidamente ou durante transição não deve deixar fundo bloqueado, overlay órfão ou foco perdido.
2. Editar e cancelar/salvar deve devolver ao drawer e a um controle existente, sem perder a chave completa da configuração.
3. Notas de 2.000 caracteres e várias linhas não podem empurrar o total ou o fechar para fora da área alcançável.
4. Carrinho vazio e exclusão da última linha devem manter uma saída acessível e foco válido.
5. Viewport baixo/resize, reduced-motion e armazenamento indisponível não devem impedir fechar, editar ou finalizar.

---

### Task 1: Drawer acessível e integração sem regressões

**Files:**
- Modify: `projetos/papitos/index.html` — contêiner e semântica do carrinho.
- Modify: `projetos/papitos/style.css` — posicionamento, backdrop, rolagem, movimento e breakpoints.
- Modify: `projetos/papitos/script.js` — ciclo do drawer e integração com edição/checkout.
- Create: `projetos/papitos/tests/bloco-3.browser.js` — teste reproduzível pelo MCP.
- Preserve: `projetos/papitos/cart-core.js` e `tests/cart.test.cjs`, salvo bug comprovado.

**Interfaces:**
- Consumes: `renderCart()`, `saveCart()`, `updateTotal()`, `openProductModal(product, item, trigger)` e controles/IDs existentes `cart-modal`, `close-cart`, `cart-body`, `cart-footer`, `finalizar`.
- Produces: `openCartDrawer({ restoreFocus = true } = {})` e `closeCartDrawer(reason = 'dismiss')`; razões `dismiss`, `edit`, `checkout`. Dismiss restaura foco ao acionador; edit/checkout transferem foco ao próximo modal, sem salto para o fundo.
- Mantém os eventos delegados de quantidade, remover e editar; mantém `.active` sincronizada para compatibilidade com a bateria do Bloco 2.

- [x] **Step 1: Escrever e executar regressões vermelhas de geometria e modalidade.** Em 1440×900, afirmar `right <= innerWidth`, `abs(right-innerWidth) <= 1`, `width <= 420` e altura de viewport; em 390×844, largura integral. Exigir dialog aberto e fundo não interativo. A baseline central atual deve falhar.
- [x] **Step 2: Implementar HTML/CSS e `openCartDrawer`/`closeCartDrawer`.** Aplicar os valores das restrições; guardar/restaurar scroll e foco; não mascarar overflow global. Fechar por botão, Escape e clique fora do painel, sem fechar ao clicar no conteúdo.
- [x] **Step 3: Integrar os dois destinos existentes.** Edição fecha/suspende o drawer, abre o produto e retorna ao drawer após cancelar/salvar. Finalizar transfere ao checkout atual sem timers fixos desnecessários, nem duas camadas modais ativas.
- [x] **Step 4: Testar os cinco itens de Review Focus.** Incluir abrir/fechar 5 vezes, editar notas especiais completas, cancelar/salvar, esvaziar carrinho, 2.000 caracteres, 10 linhas, resize 1440→390, 844×390, reduced-motion e storage bloqueado. Exigir foco válido e restauração de scroll ao encerrar o fluxo.
- [x] **Step 5: Executar regressões completas.** `node --test`; MCP com `tests/bloco-2.browser.js`, `tests/robustez.browser.js` e `tests/bloco-3.browser.js`. Resultado exigido: zero falhas; registrar falhas externas separadamente, sem ocultá-las.
- [x] **Step 6: Capturar e revisar.** Antes/depois do drawer em 1440 e 390; matriz 375/390/430/768/1024/1440/1920, sem overflow, imagens quebradas ou erros JS. Solicitar `auditor-qa` e `diretor-visual` somente leitura, em contextos isolados de navegador.
- [x] **Step 7: Entregar evidências e parar.** Criar `projetos/papitos/evidencias/bloco-3/RELATORIO.md` com PASS/FAIL reais, arquivos, limitações e capturas. Aguardar aprovação antes dos cupons/checkout; não commitar.

## Auto-revisão do plano

Escopo e interfaces conferidos com os arquivos reais. Os cinco riscos têm cenários no Step 4. A migração e identidade não serão redesenhadas; permanecem cobertas pela bateria existente. Não há decisões que exijam novo produto, backend ou serviço externo.
