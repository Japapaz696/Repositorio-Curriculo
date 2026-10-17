# Portfólio Lucas — diretrizes permanentes do agente

## Contexto verificado
- Repositório: `Japapaz696/Repositorio-Curriculo`, site em GitHub Pages no subcaminho `/Repositorio-Curriculo/`.
- O projeto raiz é **HTML + CSS + JavaScript sem framework e sem build**: `index.html`, `style.css`, `script.js`.
- Subprojetos independentes: `projetos/seu-manoel`, `projetos/papitos`, `projetos/beauty-store`.
- Playwright consta em `package.json`; existem scripts antigos `capture*.cjs`, alguns com caminhos absolutos de uma máquina. Não assumir que esses scripts antigos sejam confiáveis.
- Objetivo: um portfólio crível para recrutadores e potenciais clientes, com qualidade visual de produto real, não apenas de mockup.

## Responsabilidade do agente
Atuar como diretor de arte, designer UI/UX e desenvolvedor front-end sênior. Sempre unir VISUAL + USABILIDADE + FUNCIONAMENTO + PROVA. Antes de modificar, inspecionar os arquivos e o estado atual. Trabalhar por pequenas etapas e mostrar evidências.

## Critérios de design
1. Dar protagonismo aos projetos que realmente funcionam. Primeira dobra: proposta de valor clara, projetos em destaque e CTA de contato.
2. Escolher e justificar a direção visual do portfólio, respeitando a identidade existente. Propor o dark graphite/azul/ciano apenas como opção; não trocar toda a paleta sem contexto ou solicitação.
3. Fazer tipografia com hierarquia objetiva; usar escala consistente de espaçamento, contraste, grid, bordas e cantos.
4. Capas recebidas em `referencias/` são **referências cinematográficas de apresentação**. Diferenciar capa conceitual, screenshot real e demo executável. Não falsificar screenshot de funcionalidade inexistente.
5. Identidade dos cases: Seu Manoel (preto/carvão, vermelho discreto), Papitos (preto, laranja energético), Beauty Store (grafite, rosa suave). No portfólio, padronizar proporção e apresentação; dentro de cada case, preservar personalidade.
6. Mobile first e responsividade REAL: verificar 375/390/768/1024/1440px; menu, imagens, caixas, toque e leitura.
7. Usar estados de hover, foco visível, loading, vazio, erro, confirmação e movimento com `prefers-reduced-motion`.
8. Usar imagens otimizadas, largura/altura, lazy loading quando adequado, e não esconder problemas com `overflow-x: hidden`.
9. Não criar aparência de projeto real de cliente quando é demonstração. Não afirmar backend, pagamento ou agendamento real se não existem.
10. Não adicionar React, Tailwind, Next.js ou novo framework sem justificar benefício e autorização; preferir corrigir stack existente.

## Qualidade e validação obrigatórias
1. Ler `index.html`, `style.css`, `script.js`, páginas dos três projetos, `README.md` e assets afetados.
2. Avaliar o antes: gerar screenshots locais com Playwright nos viewports relevantes, inspecionar os arquivos gerados e identificar 3–5 mudanças de maior impacto.
3. Alterar em lotes pequenos, sem reescrever o produto inteiro ou quebrar fluxos de compra, reserva e navegação.
4. Rodar `node tools/visual-audit.cjs` e `node tools/asset-report.cjs` (se os arquivos estiverem instalados no repositório). Corrigir problemas confirmados.
5. Testar interativamente pelo menos: menu mobile, alternância de tema, abertura dos cases, carrinho, agendamento, favoritos e checkout simulado; não declarar isso testado sem executar.
6. Revisar console, links, imagens, quebra horizontal, foco de teclado, `alt`, nomenclatura dos botões e carregamento.
7. Informar explicitamente: arquivos alterados, diferenças visuais, testes que passaram, pendências e evidências/screenshots. Não dizer '100%' sem teste.

## Regras de preservação
- Não mexer em `CortAI`, `OMNIROUTE` nem em projetos fora deste repositório.
- Não remover projetos, histórico nem assets sem confirmação; sugerir limpeza de duplicados primeiro.
- Não inserir segredos, tokens ou dados pessoais inéditos em código público.
- Não sobrescrever arquivos de configuração existentes sem comparar/diff e obter aprovação.
- Não publicar ou fazer push automaticamente: preparar alterações para revisão.
- Nunca inventar métricas, empresas clientes, certificações, experiência profissional ou funcionalidades.
