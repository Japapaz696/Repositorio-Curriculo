# Papitos — chapa editorial

Status: proposta para aprovação; produção ainda não alterada. Base: briefing do usuário, diagnóstico real e consulta independente ao diretor visual.

## Intenção e resultado esperado
Transformar Hero e apresentação do cardápio de modo perceptível, com fotografia gastronômica dominante e linguagem própria de cartaz culinário. Não transportar o estilo do portfólio principal, não usar um hambúrguer flutuando dentro de um quadrado, não transformar a etapa em refatoração da aplicação.

## Restrições vinculantes
- Apenas `projetos/papitos/`; preservar alterações existentes. Git inicial `8626f1f`, somente `nul` não rastreado.
- Sem alterar Beauty Store, Seu Manoel, portfólio principal, configuração OpenCode, bibliotecas ou checkout.
- Sem commit, push, publicação ou instalação de dependências.
- Preservar 13 produtos + 3 combos, IDs, preços atuais, ingredientes, adicionais, identidade completa de notas, cálculo, persistência, pesquisa/categorias e eventos delegados.
- Conteúdo e valores são demonstrativos. Sem inventar avaliações, promoções, história, serviços ou fotografia de produtos reais.

## Direção escolhida
Composição assimétrica, texto à esquerda e fotografia lateral integrada à direita (aproximadamente 45/55 no desktop). Alternativas descartadas: foto full-bleed atrás de todo o texto (contraste e recorte frágeis) e diner retrô claro/quadriculado (afasta do briefing e vira decoração).

Paleta proposta pelo diretor: carvão `#100D0B`, superfície tostada `#211A16`, creme `#F6EBDD`, areia `#C3AE9C`, laranja `#FF8A3D`. Bordas derivadas do creme; CTA laranja com texto carvão. Contrastes finais medidos, não presumidos. Mapear aos tokens existentes para manter coerência visual de produto/carrinho, sem mudar sua geometria ou ciclo funcional.

Manter fontes atuais: Bebas Neue nos grandes títulos e Inter em leitura, preços e controles. Preços com numerais tabulares, não fonte condensada. Sem novas requisições de famílias tipográficas.

## Hero
- Header compacto com marca sem emoji/gradiente, ícones SVG decorativos com nomes acessíveis nos controles. Link Cardápio e Combos; retirar link para avaliações sem lastro.
- Texto: aviso “Hamburgueria · projeto demonstrativo”; H1 curto “Burger no seu estilo.”; apoio “Explore o cardápio, personalize seu burger e experimente o carrinho.” Sem superlativos ou promessas de entrega.
- CTA principal “Explorar cardápio” (âncora); link secundário “Ver combos” (âncora). Produto em destaque: Clássico Papitos, preço atual do catálogo, botão de personalização usando `data-action="details"` e `data-id="1"` existentes. Sem novo fluxo de compra.
- Fotografia grande, com superfície de apoio visível e fundo com profundidade; sem borda quadrada ou flutuação. Área aproximada de 640×480px em desktop, podendo encostar visualmente na borda direita da composição. Legenda “Fotografia ilustrativa”. Não cobrir a região crítica do alimento com título/controles.
- Mobile 375–430px: alinhamento esquerdo, margem ~20px, título 56–64px ajustado por clamp, apoio curto, CTA+link sem duas linhas de grandes botões e foto larga com ~230–260px de altura. Meta em 390×844: CTA e parte substancial da foto na primeira tela, sem fixar altura que corte conteúdo.
- Entrada única de título/imagem em 350–450ms, deslocamento <=12px; microinteração hover/focus no destaque com zoom <=1,025. Sem loop, parallax, dependência de hover ou JS para exibir o conteúdo. Reduced-motion remove animação e mantém estado final legível.

## Cardápio e combos
- Reunir título, contagem, pesquisa e categorias numa entrada de seção compacta. Preservar IDs `menu-search`, `category-list`, `menu-result`, `menu-grid`, `combos-grid` e destinos `cardapio`/`combos`.
- Categorias visíveis, com estado selecionado por cor e linha/borda; podem quebrar linhas no mobile, sem opções escondidas. Não criar novas categorias nem filtros.
- Cards: 3 colunas desktop, 2 tablet e 1 mobile. Foto 16:10, nome, descrição completa, preço e adicionar na base. Não comprimir nome/preço lado a lado. Ação de detalhes/personalização explicitamente identificada abaixo da fotografia; botão de adição rápida separado, sem interativos aninhados.
- Nome/descrição/preço com hierarquia previsível. Alterações de hover/focus discretas, sem salto constante de cards. Estado vazio da pesquisa preservado.
- Combos com superfície quente distinta, composição dos itens e somente preço atual. Remover preço riscado e texto de promoção. Renomear apenas a apresentação de `combo-1` para “Combo Bacon”, mantendo ID e preço. Não usar “mais vendido”, urgência, desconto ou economia inventados.
- Substituir seção de avaliações fictícias por explicação breve de três ações reais da demonstração: escolher, personalizar, experimentar o carrinho. Não é serviço real nem avaliação.

## Fotografias e credibilidade
Curar a correspondência semântica: Bacon Lover não pode ser carne fatiada; combo não pode sugerir fotografia fiel de um conjunto inexistente. Preferir reutilizar fontes atuais adequadas, baixadas como arquivos locais responsivos quando licença/uso forem verificados. Sem dependências de conversão novas: formatos JPEG/WebP servidos pela fonte são suficientes. Registrar origem/licença e caráter ilustrativo; não usar imagens com origem/licença incertas. A seleção final e os recortes são decisões do implementador, condicionados à inspeção visual.

Para combo fotografado por um componente, legenda “Imagem ilustrativa de um dos itens”. Não fabricar composição que se anuncie como foto real da refeição. Hero eager/fetchpriority high, dimensões explícitas; catálogo lazy e fallback SVG existente preservado. Não reescrever a estrutura do catálogo por causa das fotos.

## Arquitetura e limites da implementação
HTML/CSS nativos existentes. JS apenas para composição visual de `renderMenu`/`renderCombos`, referências de mídia e texto demonstrativo; sem mudar regras de carrinho, personalização, busca ou checkout. Usar delegação global já existente para o destaque do Hero. Reutilizar IDs/classes consumidos pelas suítes; eventual ajuste de teste estritamente estrutural deve preservar asserções de comportamento e ser explicado.

Adicionar skip link/landmark main, dimensões de imagens, theme-color/color-scheme, foco visível e alvos >=44px. Garantir âncoras não encobertas pelo header/filtros. Conteúdo principal visível sem execução de animação; sem-JS não ganha carrinho falso: informar limitação real do catálogo dinâmico se necessário.

## Verificação e aceitação
Antes de produção: baseline fotográfica e Node existentes; revisão final independente do drawer. Novos comportamentos (destaque do Hero/rotulagem demo) com testes que falhem antes e passem depois. Manter suítes B2, B3, robustez e `node --test` verdes.

Edge MCP em 375,390,430,768,1024,1440,1920px: overflow, imagem quebrada/fallback e coerência visual, console/rede, contraste, teclado, foco, reduced-motion, navegação mobile, busca+categoria, personalização completa e carrinho. Revalidar altura extrema do drawer após mudança de tokens. Não alterar checkout para satisfazer testes.

Capturas antes/depois separadas de Hero, entrada do cardápio/produtos e carrinho em 1440 e 390. Corrigir a captura inicial do cardápio mobile para incluir ferramentas e primeiro produto, pois `scrollIntoViewIfNeeded` registrou trecho intermediário. Diretor visual julga composição/capturas reais; auditor QA julga fluxos/telas pequenas. Informar limitações de leitor real/aparelho físico/outros browsers.

Entrega: diagnóstico, direção adotada, melhorias reais, capturas, testes PASS/FAIL, arquivos alterados, conteúdo real vs demonstração, pendências. Parar para avaliação humana; não avançar outro projeto.

## Decisões deixadas ao implementador
Escolha final de recortes de fotografia, medidas fluidas precisas, bordas/raios e animação dentro dos limites acima. Nenhuma dessas escolhas autoriza nova função, dependência, promessa comercial ou alteração de outro projeto.
