# Papitos — redesign premium do Hero e cardápio

## Escopo
Somente Papitos: Hero, apresentação do catálogo e combos, navegação visual. Preservar personalização, carrinho e checkout existente. Sem dependências, commits, push ou publicação. Hero do portfólio principal adiado.

## Preparação e acompanhamento
- [x] Git conferido: HEAD `8626f1f`, nenhum arquivo rastreado modificado; apenas `?? nul` pré-existente. Preservar integralmente.
- [x] Revisão independente final do drawer, especialmente alturas pequenas.
- [x] Capturas antes: Hero/cardápio/carrinho em desktop e mobile via Edge MCP.
- [ ] Direção de arte consultada; descrição visual submetida à aprovação.
- [ ] Plano de execução e testes de regressão antes das mudanças funcionais.
- [ ] Implementação visual sem reconstruir lógica.
- [ ] Testes sete resoluções e revisões visual/técnica finais.
- [ ] Capturas depois e relatório para avaliação humana.

## Achados iniciais
Hero atual usa imagem quadrada de 320px com flutuação infinita e gradiente no título. Cards têm fotos com fontes externas e tratamento genérico. Conteúdo legado inclui “Desde 2015”, entrega mais rápida, depoimentos com nomes/estrelas e preços riscados/promos sem lastro. Substituir a apresentação dessas alegações por informação demonstrativa neutra, sem inventar novas; preservar dados funcionais/IDs/preços-base.

## Revisões da preparação
- Diretor visual: direção “Chapa editorial”, foto lateral grande integrada, preto quente/creme/laranja sólido, cards com preço Inter e ferramentas compactas. Consulta somente leitura das capturas/código.
- Auditor QA: drawer aprovado no escopo focado. Matriz 375/390/430 × 180/260/390: 9/9 com uma linha e 9/9 com dez linhas/notas longas; cliques reais, foco e scroll; cenário adicional reabrir 390×180 passou. Zero bugs confirmados. Sem aprovação por extensão do redesign/checkout/WCAG completo.
- Builder check da descrição `DESIGN.md`: “nothing important left”. Nenhum arquivo de produção alterado; aguardando aprovação da direção.
- Baseline mobile do cardápio refeita para mostrar pesquisa/categorias e primeiro produto, em vez de trecho intermediário. Contextos de navegador encerrados.
- Estado Git após preparação: `nul` pré-existente + novo diretório de evidências desta etapa. Nenhuma alteração rastreada; não declarar a árvore inteira limpa após gerar artefatos.
