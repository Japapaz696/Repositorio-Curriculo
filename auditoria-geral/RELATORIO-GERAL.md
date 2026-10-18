# Relatório da auditoria geral — Portfólio + 3 projetos

**Data:** 18/10/2026 · **Ferramenta:** Playwright MCP (Microsoft Edge 155, contextos isolados por viewport) + `node --test`. Servidor local `tools/serve.cjs` na porta 8139. **Nenhum commit, push ou publicação.**

## 1. Método

- Testes executados com **seletores reais do DOM** (confirmados por grep nos arquivos), interações reais (cliques, preenchimento, teclado) e comparação esperado × obtido — não mera existência de elementos.
- Contexto/navegador novo por viewport; dados de `localStorage` isolados por execução.
- Seletores sugeridos no briefing que não existiam foram substituídos pelos reais e registrados.
- Falsos positivos descartados com prova (seção 6).

## 2. Matriz de viewports — 7 larguras (375, 390, 430, 768, 1024, 1440, 1920)

| Página | Resultado | Critérios verificados (todos em 7/7) |
|---|---|---|
| Portfólio | **7/7 PASS** | Estado inicial das abas (`#hero-tab-exp` selecionado, painéis `hidden` corretos); clique em Competências troca painel (663 chars visíveis); ArrowRight ativa Evolução com foco; altura estável (Δ0px); menu mobile (`#menu-toggle`/`#nav-links` com `open`+`inert`) abaixo de 768; sem overflow; 0 imagens quebradas; 0 erros JS |
| Papitos | **7/7 PASS** | 13 cards; busca "bacon" → Bacon Lover + Combo Família (casa por descrição — comportamento correto, critério inicial estava errado); busca "cheddar" → 1; categoria hambúrgueres → todos `data-category=hamburgueres`; modal de detalhes abre (Clássico Papitos, base R$ 28,90); qtd 3 → R$ 86,70; adicionar → count 3; carrinho abre com item; ESC fecha; reload persiste 3; quick-add → 4; sem overflow; 0 erros JS |
| Beauty Store | **7/7 PASS** | 16 produtos; busca "sérum" → 1 (ignora acento); filtro skincare → 4; + faixa preço 0-50 → 1; limpar → 16; ordenação por preço real (asc 29,9→49,9; desc 299,9→119,9); favoritar → 1 sem abrir detalhe, persiste após reload; adicionar → drawer com item; checkout completo (9 campos + pagamento) → confirmação visível; carrinho zerado após confirmar; sem overflow; 0 imagens quebradas; 0 erros JS |
| Seu Manoel | **7/7 PASS** | Domingo → 0 horários + status de estado vazio; **Voltar visível e clicável em todas as fases** (hit-test `elementFromPoint` = `#back-button`, centro < 844 em 390×844, após correção sticky — ver 3.3); dia útil → 18 slots; 09:00 selecionável; revisão com "R$ 45,00"; confirmação com 1 registro; **conflito**: mesmo slot `data-available=false` + radio disabled + "17 horários disponíveis"; **cancelamento** anuncia liberação e marca "Cancelado"; **liberação** devolve 18/18; persistência após reload; diálogo "Ver resumo" abre e fecha com ESC (mobile); sem overflow; 0 imagens quebradas; 0 erros JS |

**`node --test` (raiz): 15/15 PASS** antes e depois das correções.

A auditoria independente do @auditor-qa (método próprio, 4 páginas × 7 larguras = 28 células) convergiu: **26 células 100% limpas**; overflow/imagens/rede/console/foco OK em todas; as 2 células com achado eram do Beauty Store (abaixo).

## 3. Bugs encontrados e corrigidos (RED → GREEN)

### 3.1 Beauty Store ignorava `prefers-reduced-motion` (confirmado pelo @auditor-qa, 7/7 larguras)
- **Causa:** `projetos/beauty-store/style.css` não tinha bloco `@media (prefers-reduced-motion: reduce)` (Papitos `style.css:323` e Seu Manoel `style.css:615` tinham).
- **Correção:** bloco agregado ao fim do CSS (`transition/animation: none !important`, `scroll-behavior: auto`).
- **GREEN:** com `emulateMedia({reducedMotion:'reduce'})`, `transition-duration: 0s` em `.search-bar`, `.icon-btn`, `.cat-link`, `.btn-add-cart`, `.fav-icon`; `scroll-behavior: auto`.

### 3.2 Confirmação de checkout do Beauty sem itens nem total (confirmado pelo @auditor-qa)
- **Causa:** `projetos/beauty-store/script.js` montava o modal com HTML estático e limpava o carrinho antes, sem resumo.
- **Correção:** snapshot `{itens, subtotal, desconto, frete, total}` capturado antes de limpar e injetado no modal (mesmo formato de moeda do resto da loja; sem dados pessoais).
- **GREEN (1440 e 390):** "1× Batom Matte Longa Duração — R$ 49,90 · 1× Base Líquida HD — R$ 89,90 · Subtotal R$ 139,80 · Frete R$ 0,00 · Total R$ 139,80"; carrinho zerado; ESC fecha; foco volta para `#cart-btn`; 0 erros JS. Geometria do modal em 390: 327px = 327px (sem overflow interno).

### 3.3 Seu Manoel: "Voltar" indisponível/encoberto no mobile (achado da matriz + aprofundamento do @diretor-visual)
- **Causa 1 (achado da matriz):** `@media (max-width:767px)` escondia `#booking-actions` inteiro (`projetos/seu-manoel/style.css`), excluindo o Voltar; o stepper é visual (sem navegação) e a barra mobile só tem "Ver resumo" + Continuar — usuário preso na fase.
- **Causa 2 (RED confirmado com hit-test em 390×844):** mesmo após a correção 1, o Voltar em fase de data ficava **sob a barra fixa** (`elementFromPoint` = `#mobile-summary-trigger`, `backClickable:false`) e nas outras fases ficava **fora da dobra** (centros y=948…1236). O GREEN anterior ("y=794, barra y=876") era válido apenas em 430 de altura maior — insuficiente.
- **Correção final:** `.booking-actions:has(#back-button:not([hidden]))` com `position: sticky; bottom: calc(73px + env(safe-area-inset-bottom)); z-index: 10` + fundo/borda próprios (`projetos/seu-manoel/style.css`, `max-width:767px`). O Voltar passa a flutuar **acima da barra fixa** em todas as fases; permanece oculto na fase inicial/confirmação (comportamento intencional do JS).
- **GREEN (390×844, criter do @diretor-visual):** nas 5 fases com Voltar (profissional→revisão): `centerY` 576/684/748/436/720 — todos `< 844`; `elementFromPoint` = `#back-button` em todas; `underBar=false`; **clique real do Playwright** em `#back-button` percorreu as 5 fases até a inicial; oculto no início; sem overflow; 0 erros JS. Evidência: `manoel-voltar-390-green.png`.

### 3.4 Beauty Store: contraste AA nos cards (achado do @diretor-visual)
- **Causa:** `--text-light: #999` sobre `#fff` = **2,85:1** em `.produto-marca` (12px) e `.produto-preco-antigo` (13,6px); badge branco sobre `#ec4899` = **3,53:1** (11,2px) — exigência AA é 4,5:1.
- **Correção:** `--text-light` → `#6f6f6f`; badge → `#be185d`; badge desconto → `#7c3aed` (`projetos/beauty-store/style.css`).
- **GREEN (1440 e 390, medido no navegador):** marca **5,02:1**; preço antigo **5,02:1**; badge **6,04:1**; badge desconto **5,70:1**. Evidência: `beauty-cartoes-1440-green.png`.

### 3.5 Portfólio: duplicação de rótulo e "7 etapas" (achados do @diretor-visual)
- **Causa:** painel repetia o rótulo da aba (H3 "Experiência/Competências/Evolução" + kicker "Experiência profissional…"); case dizia "7 etapas de agendamento" mas o wizard do Seu Manoel tem **6** ("Escolha X de 6").
- **Observação própria:** o H3 já estava com `display:none` via JS (`style.css:138`) — a duplicação visível era do kicker; o H3 só aparecia no fallback sem JS. As regras CSS do H3 tornariam-se mortas.
- **Correção:** 3 H3s `hero-panel-heading` removidos do `index.html`; kicker reescrito para "Estágio · Suporte Técnico" (sem a palavra da aba); regras mortas `.hero-panel-heading` removidas do `style.css` da raiz; "7 etapas" → **"6 etapas"**.
- **GREEN (1440 e 390):** nas 3 abas: `headsVisible=[]`, `headsContainLabel=false`, `kickerHasLabel=false`, `idxHasLabel=false`, painéis visíveis (325/315/226 chars); texto do case = "6 etapas de agendamento"; abas funcionam; sem overflow; 0 erros JS. Evidência: `portfolio-hero-1440-green.png`.

### 3.6 Ajuste de conteúdo (sugestão do @revisor-conteudo)
- 4 ocorrências padronizadas para "previsão de conclusão em 2027" (`index.html` linhas 59, 114, 310, 314).

## 4. Bugs do auditor que NÃO foram classificados como tal (observações)

- Foco da busca do Beauty com anel rosa de baixo alpha — visível, destaque discreto.
- `.checkout-content input:focus { outline: none }` — indicador por cor/borda (frágil para baixo contraste).
- Papitos `#pm-img` sem `src` até o modal abrir — placeholder benigno (não conta como imagem quebrada).
- ~~Salto Δ99px ao trocar abas do portfólio em 1440~~ — **não reproduzível**: o @diretor-visual mediu alturas constantes (painel 427px / layout 853px) nas três abas e zero overflow a 390. Tratado como medição não confirmada da sessão anterior; **removido das pendências**.

## 5. Pareceres

- **@revisor-conteudo — RECEBIDO:** 0 problemas altos/médios; texto alinhado às regras (TecFood/Teknisa como suporte sem autoria; ADS previsão 2027; IA em estudo; demos rotuladas; SupportFlow honesto). 4 sugestões terminológicas aplicadas.
- **@auditor-qa — RECEBIDO:** 26/28 células limpas; 2 bugs confirmados no Beauty (corrigidos, seção 3); 6 falsos positivos descartados com prova; limitações declaradas (sem leitor de tela real, sem contraste/axe/Lighthouse, persistência testada só em 1440, conflito sem 2 abas).
- **@diretor-visual — RECEBIDO (reexecutado em 18/10):** ~35 capturas + medições de DOM/geometria/contraste (`auditoria-geral/evidencias/diretor-visual/`). Achados: (a) Papitos **não** teve evolução visual — produção idêntica pixel a pixel ao baseline; o redesign "chapa editorial" aprovado existe **só como proposta** (`DESIGN.md:3` "produção ainda não alterada"); (b) portfólio e Seu Manoel **não** têm aparência de template; Papitos e Beauty ainda têm marcadores de template; (c) a paleta preto/creme/laranja existe apenas no DESIGN.md, não no código. **3 prioridades "agora": Voltar mobile (crítica), contraste Beauty e rótulos/etapas do portfólio — todas aplicadas com GREEN (seções 3.3–3.5).** Itens adiados com justificativa: redesign integral do Papitos (exige decisão explícita), filtros mobile do Beauty (disclosure) e composição hero/cardápio do Papitos (cai junto com o redesign).
- **Correções do @diretor-visual sobre afirmações minhas (aceitas):** 1) "Redesign do Papitos concluído" estava **errado** — confirmado por diff de 0 px contra o baseline, `git status` sem arquivos do Papitos e `DESIGN.md:3`; registrado como decisão pendente (seções 9/10). 2) Δ99px das abas **não reproduzível** (alturas constantes 427/853) — aceito e removido (seção 4). 3) Meu GREEN do Voltar (430px) **não cobria o viewport exigido** — confirmado por RED com hit-test em 390×844 e refeito (seção 3.3).

### 5.1 Pareceres finais do redesign do Papitos (rodada 2, 18/10/2026)

- **@revisor-conteudo — RECEBIDO (conteúdo):** 0 altos, 1 médio, 3 baixos. Verificou: nenhum termo de avaliação/invenção legado nos 3 arquivos; hero demonstrativo; seção "Como funciona" factual; combos com ids/preços preservados (39,90/65,90/89,90); catálogo 13 produtos com preços exatamente originais; textos funcionais conferidos contra o código ("não altera o preço", "+R$ 8,00", 2.000 caracteres). **4 sugestões aplicadas:** (MÉDIO) aviso `#checkout-demo` "Demonstração · nenhum dado é enviado ou armazenado." + `aria-describedby` no diálogo de checkout; (BAIXO) toast "🎉 Pedido simulado confirmado." (antes "Em preparo."); (BAIXO) passo Personalize com "retire ingredientes quando disponíveis"; (BAIXO) label da busca "Encontre seu próximo lanche". Observação registrada sem alteração: "Combo Família" existe como produto id 6 e combo-3 (mesmo preço/conteúdo consistente). Veredito do revisor após aplicação: conteúdo aprovado no escopo revisado.
- **@auditor-qa — RECEBIDO (QA técnico, testes próprios no Edge 155):** **PASS no escopo testado.** 7/7 viewports limpos (overflow/imagens/console/rede = 0); 11/11 fluxos (busca bacon/cheddar, categoria, destaque do hero→modal, qty→R$ 86,70, adicionar, Escape+foco, reload, quick-add); acessibilidade: skip link com bypass do header comprovado (Enter → main, Tab seguinte no CTA), 10 controles com outline ≥3px, todos alvos ≥44px (menor = 44), regiões live, reduced-motion, h1 único sem salto de nível; contraste 28 combinações ≥4,5 (6,22–16,46) — leituras baixas iniciais eram estado transiente da animação; re-executou todas as suítes (15+15+10+1+30 verificações, todas verdes). **1 observação BAIXA aplicada:** `#close-checkout` media 20×38px (`style.css:281`) → ajustado para 44×44 (`min-width/min-height + inline-flex`), GREEN medido. Falsos positivos próprios isolados (limiar do skip link; contraste durante animação). Limitações: sem leitor de tela real, só Chromium/Edge, sem zoom 200%/Lighthouse; não enviou o checkout (nós o validamos por separado).
- **@diretor-visual — PARECER FINAL AINDA PENDENTE** (sessão em andamento: curadoria de fotos + avaliação visual da implementação).

## 6. Falsos positivos descartados (com prova)

1. "reviewOk=false no mobile do Seu Manoel" — artefato do script de teste (sequência de passos errada); com a mecânica correta (1 clique de Continuar = 1 fase) o review inclui "R$ 45,00" em 7/7.
2. Busca "bacon" no Papitos retornar Combo Família — casa por descrição ("1 bacon"), comportamento correto.
3. Modal de confirmação do Beauty com "overflow" — seletor de teste pegou outro `<div role=dialog>` (gaveta); medido no elemento correto: 327=327.
4. Teste de submit do Beauty falhou com 8 de 9 campos (Cidade required vazia) — erro do teste, não do formulário.
5. Descritos pelo auditor: seta das abas com foco em body; ESC sintético vs `<dialog>` real; confirmação "empilhada" (artefato do teste); seletor ESC errado; anel de foco medido durante transição; `#pm-img` placeholder.

## 7. Evidências

- `auditoria-geral/evidencias/screenshots/`: `portfolio-1440/390`, `papitos-1440/390`, `beauty-1440/390`, `manoel-1440/390` (estado pós-correção), `beauty-confirm-390.png` (confirmação com resumo), `manoel-voltar-390-green.png` (Voltar acima da barra, hit-test GREEN), `beauty-cartoes-1440-green.png` (contraste GREEN), `portfolio-hero-1440-green.png` (painel sem duplicação de rótulo).
- `auditoria-geral/evidencias/diretor-visual/`: ~35 capturas/medições do parecer visual.
- `auditoria-global-2026-10-18/`: 12 capturas do @auditor-qa, incluindo `bug-beauty-checkout-confirmacao-sem-resumo.png` (antes do fix), `manoel-conflito-horario-bloqueado.png`, `manoel-historico-cancelado.png`.
- `projetos/papitos/evidencias/redesign-premium/`: baseline (`antes-*.png`) e direção "chapa editorial" (`DESIGN.md` — **não implementada**).

## 8. Arquivos alterados nesta rodada

| Arquivo | Mudança |
|---|---|
| `projetos/beauty-store/style.css` | bloco `prefers-reduced-motion` + tokens de contraste (`--text-light`, badges) |
| `projetos/beauty-store/script.js` | +23 linhas: snapshot do resumo na confirmação do checkout |
| `projetos/seu-manoel/style.css` | Voltar mantido no mobile + fixa (`sticky`) acima da barra fixa (`max-width:767px`) |
| `index.html` | 4 textos padronizados ("previsão de conclusão em 2027") + 3 H3s duplicados do painel removidos + kicker reescrito + "6 etapas de agendamento" |
| `style.css` (raiz) | −2 regras mortas `.hero-panel-heading` |

Estado Git no fim: HEAD `fe6abb6`; modificados apenas os 5 arquivos acima; não rastreados `auditoria-geral/`, artefatos `.playwright-mcp/*.yml` (snapshots do MCP) e `nul` (preservado). Nenhum commit feito por esta auditoria.

## 9. Limitações

- Sem leitor de tela real (NVDA/VoiceOver), sem teste em aparelho físico, sem Safari/Firefox.
- Varredura axe/Lighthouse não executada; contraste medido por fórmula WCAG apenas nos tokens corrigidos do Beauty (não é varredura completa do site).
- Persistência por viewport isolada (testada em todas as larguras do fluxo, mas cada execução parte de contexto limpo); conflito de agendamento não testado com 2 abas simultâneas (eventos de `storage`).
- Efeitos comportamentais do reduced-motion medidos por duração computada, não por percepção.
- ~~**Redesign premium do Papitos ("chapa editorial") NÃO foi implementado**~~ — implementado na rodada 2 de 18/10/2026 (seção 11), após autorização do usuário.
- Itens visuais adiados registrados pelo @diretor-visual: marcadores de template restantes no Papitos (foto flutuante, avaliações legadas, "Desde 2015") e no Beauty (emoji decorativo), disclosure de filtros mobile do Beauty, composição hero/cardápio do Papitos.
- O seletor `:has()` no fix do Voltar exige Edge 105+/Chrome 105+/Safari 15.4+/Firefox 121+; sem suporte, degrada para o comportamento anterior (Voltar em fluxo, sem fixação).

## 10. Veredito

**Etapa 1 (auditoria global): concluída.** O usuário **não aprovou a publicação** neste ponto e determinou concluir antes o redesign do Papitos. A matriz **4 páginas × 7 larguras (28 células) PASS** com interações reais, `node --test` **15/15** e **3 pareceres recebidos** na primeira rodada sustentam a auditoria; **6 bugs reais** foram corrigidos com verificação RED→GREEN (reduced-motion Beauty, resumo do checkout Beauty, Voltar mobile Seu Manoel — 2 causas —, contraste AA do Beauty, duplicação de rótulo + "7→6 etapas" do portfólio) e 4 ajustes textuais do revisor.

**Etapa 2 (redesign do Papitos): implementada, testes locais verdes, pareceres finais em execução** — ver seção 11. O veredito de publicação fica suspensa até a avaliação humana final.

Ressalvas:
1. Limitações de método (seção 9): sem leitor de tela real, sem aparelho físico, sem Safari/Firefox, sem axe/Lighthouse.
2. Itens visuais adiados (seção 9), todos com justificativa registrada — a maioria foi tratada pelo redesign da seção 11.
3. Publicação suspensa por decisão do usuário, aguardando avaliação do redesign.

Nenhum commit, push ou publicação foi feito.

## 11. Redesign premium do Papitos — "chapa editorial" (18/10/2026, rodada 2)

Autorizado explicitamente pelo usuário após a recusa de publicação. Implementação apenas em `projetos/papitos/` (index.html, style.css, script.js), sem refatoração da lógica.

### 11.1 O que mudou (antes → depois)

| Área | Antes | Depois |
|---|---|---|
| Identidade | Gradiente âmbar/vermelho, emoji de marca, fundo `#0d0d0d` neutro | Paleta carvão `#100D0B` / creme `#F6EBDD` / laranja sólido `#FF8A3D`, logo tipográfico com ponto laranja |
| Hero | H1 "O melhor hambúrguer…", tag "Desde 2015", promessa de entrega, foto quadrada 320px flutuando em loop | Composição assimétrica texto/foto (0.85fr/1.15fr), eyebrow "Hamburgueria · projeto demonstrativo", H1 "Burger no seu estilo.", CTA + link de combos, bloco "Em destaque" com personalização real do Clássico, foto 4:3 grande com legenda "Fotografia ilustrativa", entrada única 420ms |
| Categorias/busca | Faixa sticky com cápsulas, busca afastada do título | Título + busca na mesma linha (`.menu-head`), categorias com sublinhado laranja e wrap, resultado à esquerda |
| Cards | Preço no topo em Bebas, chip de categoria, faixa preta "Ver detalhes" sobre a foto | Foto 16:10, nome → descrição → rodapé com preço Inter tabular + "Adicionar"; indicação de detalhes abaixo da foto; hover só borda/sombra/zoom 1.025 |
| Combos | Preço antigo riscado, "Promoção especial de quarta-feira!" | Um único preço, desc neutras, legenda "Imagem ilustrativa de um dos itens"; `combo-1` renomeado para "Combo Bacon" (id e preço preservados) |
| Depoimentos | 3 avaliações fictícias com estrelas | Seção "Como funciona esta demonstração" com 3 passos factuais (Escolha/Personalize/Experimente o carrinho) |
| Conteúdo legado | "Desde 2015", "o melhor", "entrega mais rápida", promoções | Removido; footer com "Demonstração de portfólio · Fotografias ilustrativas · Nenhum pedido real é enviado." |
| Acessibilidade | Sem skip link, emoji 🛒/☰ como controle | Skip link, landmark `<main>`, ícones SVG `aria-hidden`, `theme-color`/`color-scheme`, dimensões explícitas nas imagens, `fetchpriority=high` no hero |

Preservados sem refatoração: 13 produtos + 3 combos e ids/preços, busca por nome/descrição/categoria/ingredientes, categorias, modal de personalização (remoção/adicionais/observações/quantidade), carrinho lateral `<dialog>`, persistência `papitos-cart`, checkout existente.

### 11.2 Resultados comprovados

| Verificação | Resultado |
|---|---|
| Versão servida confirmada ANTES de editar (HTTP 200, produção pré-redesign) | OK — baseline válido |
| `node --test` (raiz) pós-redesign | **15/15 PASS** |
| Suíte `tests/bloco-2.browser.js` | **15/15 PASS** |
| Suíte `tests/bloco-3.browser.js` | **10/10 PASS** (drawer intacto) |
| Suíte `tests/robustez.browser.js` | **PASS** (touch, JSON corrompido, notas 2000, fallback de imagem, storage bloqueado, contraste 7,32–8,05) |
| Matriz do redesign `auditoria-geral/tests/papitos-redesign.browser.js` — 375/390/430/768/1024/1440/1920 + reduced-motion + teclado | **30/30 PASS** (estrutura/imagens/conteúdo sem alegações legadas, destaque→modal, busca 'bacon'=2 e 'cheddar'=1, categoria=5, quantidade→R$ 86,70, carrinho, ESC, reload persiste, quick-add, hero sem animação em reduced-motion, skip link focado) |
| Revalidação das 6 correções da auditoria `auditoria-geral/tests/verifica-correcoes.browser.js` | **7/7 PASS** — busca mobile Beauty, favorito sob hover, reduced-motion Beauty, contraste Beauty (4,81/6,04/4,81), resumo do checkout Beauty ("1× Batom… Total R$ 49,90", carrinho zerado), rótulos/etapas do portfólio, Voltar mobile do Seu Manoel (date→professional, `hitIsBack=true`, centerY 748) |
| Erros JS / overflow / imagens quebradas | 0 / 0 / 0 (apenas `#pm-img` vazio com modal fechado — benigno e conhecido) |

### 11.3 Evidências

Capturas depois: `auditoria-geral/evidencias/screenshots/papitos-redesign-{hero,cardapio,combos,carrinho}-{1440,390}.png` (baseline antes em `projetos/papitos/evidencias/redesign-premium/antes-*.png`).
