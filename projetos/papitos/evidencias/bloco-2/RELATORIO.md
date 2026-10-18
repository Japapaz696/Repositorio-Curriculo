# Papitos — Bloco 2: implementação e evidências

Data: 18/10/2026. Alvo: `http://127.0.0.1:8139/projetos/papitos/`.
Navegador confirmado pelo user agent: Microsoft Edge 155, via Playwright MCP.

## Diagnóstico real e mudanças

No início desta execução, pesquisa e ProductModal estavam AUSENTES (ambos com contagem zero no DOM), e o carregamento descartava os produtos com ID numérico. Os relatos anteriores de conclusão não correspondiam aos arquivos. Baseline no Edge: FAIL para pesquisa, modal e restauração do carrinho numérico. Primeiro teste Node: FAIL pela ausência de `cart-core.js`.

Implementado nos arquivos, sem dependências novas:
- Pesquisa normalizada por nome, descrição, categoria e ingredientes cadastrados, combinada com categoria e estado vazio.
- Botão de detalhes com nome acessível e indicação persistente, separado da adição rápida. Nenhum interativo aninhado.
- Dialog nativo: ingredientes, remoções, adicionais demonstrativos, notas de até 2.000 caracteres, quantidade e preço dinâmico.
- Identidade como tupla JSON de ID base, remoções, adicionais e NOTAS COMPLETAS. Sem hash, concatenação ambígua ou truncamento.
- Migração dos IDs numéricos/string e do legado personalizado com `baseId`, `remove`, `addons` e `notes`. O preço é recalculado pelo catálogo; linhas inválidas não invalidam as válidas.
- Edição/substituição da configuração no carrinho; quantidades, remoção e totais em centavos.
- Renderização por propriedades DOM/textContent; IDs especiais nunca interpolados como código, HTML ou seletor.
- Fallback SVG local válido, foco, Escape, contenção de Tab, scroll do produto e reduced-motion.

## Execução reproduzível

- Lógica: `node --test projetos/papitos/tests/cart.test.cjs` — 7 PASS, 0 FAIL.
- Suite Node completa descoberta no repositório: `node --test` — 15 PASS, 0 FAIL (7 Papitos + 8 testes existentes Seu Manoel; nenhum arquivo deste último foi alterado).
- Playwright MCP: `browser_run_code_unsafe` com `filename: projetos/papitos/tests/bloco-2.browser.js` — 15 PASS, 0 FAIL na rodada final.
- Robustez/toque emulado: mesmo executor com `filename: projetos/papitos/tests/robustez.browser.js` — PASS.

As suites de navegador usam contextos novos, preservando o carrinho e a página do usuário. A suite de robustez fecha seu contexto em `finally`.

## Matriz dos 15 cenários — rodada final

| # | Cenário | Resultado | Evidência medida |
|---|---|---|---|
| 1 | Pesquisa nome/descrição/ingrediente/categoria | PASS | CLASSICO PAPITOS=1, picles=2, coleslaw=1, bebidas=3 |
| 2 | Categoria + pesquisa e limpeza | PASS | Bebidas+picles=0; limpar mantém 3 bebidas; Todos=13 |
| 3 | Detalhes mouse/Enter/Space | PASS | Dialog abre nos três; zero botões/links interativos aninhados |
| 4 | Remover ingrediente | PASS | Tomate selecionado; preço base R$28,90 mantido |
| 5 | Adicionais | PASS | Bacon R$4,90: unidade vai a R$33,80 |
| 6 | Quantidade | PASS | Mínimo 1; duas unidades R$67,60 |
| 7 | Preços/totais | PASS | Subtotal R$67,60; delivery R$75,60; retirada R$67,60 |
| 8 | Observações | PASS | 110 caracteres completos com aspas e `<svg>` renderizados como texto |
| 9 | Configurações distintas | PASS | Notas iguais após mais de 80 caracteres, mas diferentes ao final: duas linhas; quick-add fica em terceira linha |
| 10 | Persistência/migração | PASS | Reload preserva; ID numérico, combo string e `_custom` com baseId renderizados |
| 11 | Incrementar/decrementar/remover | PASS | Quantidade 2→3→2; remoção específica; foco não se perde no rerender |
| 12 | Editar/cancelar/Escape/botão/foco | PASS | Cancelar não altera; salvar substitui; foco retorna ao controle válido |
| 13 | Viewports e capturas | PASS | Página, dialog e carrinho sem overflow X nos 7 tamanhos; dialog dentro do viewport |
| 14 | Reduced-motion/Tab/scroll | PASS | animation:none; ciclo Tab/Shift+Tab contido; scroll bloqueado e restaurado |
| 15 | Console/requisições/imagens | PASS | 0 erros JS/console, 0 requests falhos, 0 respostas >=400; 0 imagens quebradas medidas |

Viewports: 375, 390, 430 × 844; 768, 1024, 1440, 1920 × 900.

### Transparência sobre as rodadas intermediárias

A primeira rodada da suite retornou 10 PASS/5 FAIL. Uma expectativa de teste estava errada: “CLASSICO” encontra também Combo Família pela descrição. Outra verificava foco antes do evento assíncrono `close` do dialog terminar; três cenários posteriores falharam em cascata. A segunda rodada teve 14 PASS/1 FAIL por verificar restauração de scroll antes desse mesmo evento. Foram corrigidos os testes para usar a busca específica e aguardar o estado real do dialog/carrinho. A rodada final completa retornou 15/15. As capturas foram refeitas após aguardar o fim das animações, não durante o fade.

## Robustez e amostra de contraste

Teste separado no Edge com toque EMULADO em 390×844:
- JSON corrompido: carrinho inicia vazio sem exceção.
- Duas notas de 2.000 caracteres, diferentes apenas no último: preservadas e com IDs distintos.
- Armazenamento bloqueado: adição continua funcionando em memória.
- Falha de imagem induzida: fallback local carregou com largura natural 640; SVG HTTP 200; zero erros XML.
- Sete amostras de texto/controles do ProductModal: razões de contraste entre **7,04:1 e 8,58:1**. Isto NÃO constitui auditoria WCAG completa.

## Auditoria independente

`auditor-qa`, sessão `ses_eb08f9b8affePWm5fYgfQy5o0T`: sem bloqueantes confirmados nos cenários executados. Executou os 7 testes Node; verificou notas de 2.000 caracteres, migração, buscas, separação dos controles, dialog/teclado, reduced-motion, SVG, IDs sintéticos com caracteres especiais e ausência de injeção HTML. Mediu ausência de overflow da página fechada em 375/390/430/768/1024/1440. Usou contexto isolado; não alterou arquivos. A presente tabela final é a bateria do implementador, não atribuída integralmente ao auditor.

## Capturas

- Antes: `antes-desktop.png`, `antes-mobile.png`.
- Produto: `modal-1440.png`, `modal-390.png`.
- Carrinho: `carrinho-1440.png`, `carrinho-390.png`.

As notas com `<svg>` nas capturas são dados sintéticos deliberados do teste de segurança, não código executado.

## Arquivos desta entrega

Produção (apenas `projetos/papitos/`): `index.html`, `style.css`, `script.js`, novo `cart-core.js` e `assets/imagem-indisponivel.svg`.
Testes: `tests/cart.test.cjs`, `tests/bloco-2.browser.js`, `tests/robustez.browser.js`.
Documentação/capturas: `evidencias/bloco-2/`.
Alterações preexistentes do portfólio principal foram preservadas, não feitas nesta entrega.

## Reais, simulações e limites

Busca, interação, validação, cálculo, edição e persistência são funcionais no navegador. Produtos, adicionais, preços e personalizações são uma demonstração; nenhum pedido/pagamento é enviado. Carrinho permanece no modal existente: NÃO foi convertido em drawer, não foram adicionados cupons nem reformulado checkout. Bloco 3, Beauty Store e Seu Manoel não foram iniciados.

Não testados: leitores de tela reais, dispositivo físico, Firefox/Safari, auditoria WCAG integral, zoom 200–400%, carga/performance quantitativa ou checkout. Fotos externas continuam dependentes do Unsplash, com fallback local. Compatibilidade legada foi verificada para os formatos descritos; configurações inválidas ou produtos não reconhecidos são descartados, não adivinhados.

Sem commit, push, publicação, dependências ou alterações de provedores/plugins/skills/MCP. Aprovação visual do usuário permanece pendente.
