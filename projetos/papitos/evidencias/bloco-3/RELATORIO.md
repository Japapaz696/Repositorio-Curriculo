# Papitos — Bloco 3: carrinho lateral

Data: 18/10/2026. Escopo: somente o drawer do Papitos e sua integração com a edição de produtos e o checkout existente. Sem cupons, novo checkout, dependências, commit, push ou publicação.

## Resultado implementado

- Modal central substituído por `<dialog>` nativo: 420px à direita no desktop e largura integral até 480px.
- Cabeçalho, lista com rolagem interna e resumo separados; controles alcançáveis também em viewport baixo.
- Fundo inerte, foco contido, Escape, botão fechar e clique no backdrop; restauração de foco e rolagem ao sair.
- Edição retorna ao carrinho após salvar/cancelar; passagem ao checkout existente sem timer fixo e sem duas camadas modais abertas.
- Identidade escura/âmbar preservada; reduced-motion elimina a transição. Observações completas, preços e persistência do Bloco 2 preservados.

## Testes reais

Playwright MCP com Microsoft Edge 155 (`Edg/155.0.0.0`), contextos isolados fechados no fim. Suítes em `projetos/papitos/tests/`.

| Verificação | Resultado |
| --- | --- |
| B3: geometria lateral e modalidade nativa | PASS |
| B3: 10 linhas e observações completas, fechar/total alcançáveis | PASS |
| B3: cinco ciclos, Escape/botão/backdrop, foco/scroll e interrupção da entrada | PASS |
| B3: editar, cancelar, salvar e passagem ao checkout | PASS |
| B3: excluir última linha e saída do estado vazio | PASS |
| B3: sete viewports, resize, landscape e capturas | PASS |
| B3: reduced-motion e armazenamento indisponível | PASS |
| B3: toque emulado em 390×844, editar/cancelar/fechar | PASS |
| B3: alturas extremas — 390/844px de largura × 180/260px de altura | PASS — editar, finalizar e fechar alcançáveis |
| B3: console e rede | PASS — zero erros/falhas |
| Regressão Bloco 2 | 15 PASS / 0 FAIL |
| Robustez existente: JSON inválido, notas de 2.000 caracteres, SVG e storage | PASS |
| `node --test` na raiz (7 Papitos + 8 regras de agenda existentes) | 15 PASS / 0 FAIL |
| `node --check projetos/papitos/script.js` | exit 0 |
| `git diff --check` | exit 0; avisos LF/CRLF, sem erros de whitespace |

Matriz: 375/390/430×844 e 768/1024/1440/1920×900. Em todas, drawer dentro do viewport, sem overflow horizontal ou imagens quebradas medidas. Adicional: 844×390 com fechar e finalizar alcançáveis. Não é uma medição de todos os estados possíveis do site.

### Histórico de falhas e correções

Antes da implementação, a suíte B3 teve 4 PASS / 4 FAIL: modal central com 480px, sem modalidade nativa, scroll de fundo liberado e sem a geometria mobile exigida. Após implementação: 8 PASS / 0 FAIL; adicionado cenário de toque emulado, rodada final: **9 PASS / 0 FAIL**.

A revisão técnica independente encontrou uma falha importante em 844×180: lista com altura zero, impedindo clicar em editar. A reprodução local confirmou `cart-body.clientHeight=0`; o teste novo falhou também por finalizar encoberto em 390×180. Causa: cabeçalho/resumo sem encolhimento e contêiner externo sem rolagem alternativa. Correção restrita ao CSS: até 480px de altura, usar uma única rolagem no drawer e deixar lista/resumo com altura natural. Teste RED→GREEN: **10 PASS / 0 FAIL**, incluindo as quatro combinações de largura/altura extrema. Regressões B2, robustez e Node novamente verdes após a correção. Não houve nova rodada de revisão independente: a correção foi verificada pelo implementador com teste reproduzível.

A primeira regressão B2 teve 11 PASS / 4 FAIL: uma asserção de foco executava antes do evento nativo assíncrono `close`, provocando falhas em cascata. Trace confirmou reabertura/foco no evento seguinte (~16ms). O teste passou a aguardar o estado aberto do carrinho antes de verificar foco; asserções mantidas, sem alteração de produção para mascarar timing. Nova rodada: 15 PASS / 0 FAIL. Capturas da regressão foram redirecionadas para `regressao/`, preservando as evidências históricas do B2.

Reprodução B3 no MCP: `browser_run_code_unsafe` com `filename: projetos/papitos/tests/bloco-3.browser.js`. B2 e robustez usam os arquivos correspondentes; o teste B2 precisa do redirecionamento de capturas descrito acima para não sobrescrever evidências históricas.

## Revisões

- Diretor visual: aprovado para revisão humana, sem P0/P1 visuais, após ler as quatro capturas e o CSS. Movimento não avaliado por imagens estáticas.
- Auditor técnico independente: fluxos usuais aprovados, incluindo edição da 10ª linha com notas longas, retorno de foco/posição, transferência ao checkout e 20 ciclos rápidos de 10ms sem estado residual. Encontrou a falha importante de altura extrema descrita acima, corrigida com teste de regressão. Não executou as suítes completas nem concedeu autorização de merge.

Refinamentos opcionais adiados: scrollbar clara no mobile; respiro entre observações e quantidade; ênfase repetida nos links “Editar personalização”. Não reduzir controles nem esconder personalizações.

## Capturas

- Antes: [desktop](antes-1440.png) · [mobile](antes-390.png).
- Depois: [desktop](carrinho-1440.png) · [mobile](carrinho-390.png).
- Regressão de altura extrema: [844×180 — editar](carrinho-844x180-editar.png).

## Arquivos desta etapa

- Produção: `projetos/papitos/index.html`, `style.css`, `script.js`.
- Testes: novo `tests/bloco-3.browser.js`; espera de estado no teste `tests/bloco-2.browser.js`.
- Documentação/evidências: este diretório e `docs/superpowers/plans/2026-10-18-papitos-bloco-3-carrinho.md`.
- `cart-core.js` e regras de identidade não alterados nesta etapa. Alterações prévias na raiz do portfólio preservadas.

## Decisões e limites

1. Trabalho no checkout indicado, sem worktree: o B2 não commitado está nele. Custo: alterações compartilham o diretório; mitigação por escopo e diff.
2. Ledger/evidências permanentes em vez de workspace Bash e commits: Windows e proibição de commits. Custo: acompanhamento manual validado por testes.
3. Espera de estado no teste legado: evento `close` assíncrono. Custo: poderia ocultar retorno tardio; timeout e asserção de foco continuam ativos.

Carrinho, personalização e cálculos são reais no navegador; entrega/retirada e finalização continuam demonstrações. Nenhum pedido é enviado. Só abertura/fechamento do checkout foram testados nesta etapa, não todo seu formulário. Não testados: leitores de tela reais, aparelho físico, Safari/Firefox e auditoria WCAG completa. Toque foi emulado, não físico.

Novo refinamento do Hero está enfileirado para depois desta entrega; não iniciado no Bloco 3.

Itens que o auditor deixou fora de julgamento foram mantidos fora desta entrega: regras/formulário de checkout, confirmação, cupons, alterações da raiz, leitores de tela e outros navegadores. Essas áreas não recebem aprovação por extensão. Storage indisponível desde o carregamento foi coberto pela suíte de robustez do implementador, não pelo auditor. Custo dessas delimitações: cobertura limitada aos cenários explicitamente registrados, não certificação integral do produto.
