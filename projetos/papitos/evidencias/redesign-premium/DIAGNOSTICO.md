# Diagnóstico visual — Papitos

## Baseline real
- Git: `8626f1f`, arquivos rastreados limpos na preparação; `nul` pré-existente preservado.
- Edge MCP 155: capturas desktop 1440×900 e mobile 390×844, em contexto isolado; sem overflow horizontal medido nesses dois estados.
- `node --test`: 15 PASS / 0 FAIL antes do redesign.
- Nenhuma mudança no HTML/CSS/JS nesta preparação.

## Problemas observados nas capturas e código
- Hero: imagem pequena, quadrada e com flutuação infinita; pouca relação espacial com a tipografia. Mobile ocupa quase toda a primeira tela antes do fim da fotografia.
- Cards: fotografia do Bacon Lover mostra carne fatiada, não hambúrguer; outras imagens precisam de curadoria visual, não apenas teste HTTP. Preço compete com o título na mesma linha. Etiqueta de personalização ocupa uma faixa pesada sobre toda foto.
- Pesquisa/categorias: bloco alto e apartado do título do catálogo; aparência de controles genéricos. Preservar busca combinada e sua semântica.
- Conteúdo legado sem evidência: história desde 2015, superlativos/entrega mais rápida, avaliações com nomes/estrelas e desconto com preço riscado. Trocar por apresentação demonstrativa, não criar novas alegações.
- Carrinho e personalização: não reconstruir; auditor independente está verificando o último ajuste de telas muito baixas.

## Web Interface Guidelines — revisão inicial focalizada
Fonte oficial consultada em 18/10/2026. Não constitui auditoria WCAG completa.

- `projetos/papitos/index.html:47` — imagem crítica sem dimensões explícitas/fetchpriority.
- `projetos/papitos/index.html:18` — emoji de marca sem tratamento semântico decorativo.
- `projetos/papitos/index.html:13` — falta link de salto e landmark main para o conteúdo principal.
- `projetos/papitos/script.js:57` — helper de imagens sem dimensões intrínsecas explícitas.
- `projetos/papitos/style.css:99` — flutuação decorativa infinita; substituir por entrada breve e estado estático.
- `projetos/papitos/index.html:3` — tema escuro sem declaração color-scheme/theme-color.

## Uso da consulta UI/UX Pro Max
Consultas `artisan burger restaurant editorial dark` e retry `burger restaurant warm cinematic`, ambas `--design-system`. A primeira sugeriu paleta editorial rosa e estilo Swiss/SaaS, incompatíveis com o briefing. A segunda reconheceu restaurante/paleta quente, mas manteve o estilo Swiss e fundo claro. Não persistir nem aplicar esses sistemas como se fossem adequados: direção de arte será específica do Papitos. Reter apenas recomendações gerais verificáveis: contraste >=4,5, foco visível, alvos >=44px, hover discreto e reduced-motion.

## Evidências
`antes-{hero,cardapio,carrinho,pagina}-{1440,390}.png` neste diretório. Fotos externas atuais são referências ilustrativas, não prova de pratos reais do estabelecimento.
