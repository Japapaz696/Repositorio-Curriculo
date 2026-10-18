# Prompts prontos para o agente — Portfólio Lucas

Cole UM prompt de cada vez no chat do Claude Code/OmniRoute, com a pasta do portfólio aberta no VS Code. O agente deve ler `CLAUDE.md`, usar `diretor-visual` para melhorias e `auditor-visual` para QA (se a interface suportar subagentes); caso contrário, executar os passos diretamente.

## Prompt 1 — Auditoria inicial (recomendado antes de mexer)

```text
Trabalhe exclusivamente neste repositório do meu portfólio. Leia primeiro CLAUDE.md e os arquivos reais index.html, style.css, script.js, README.md e os três projetos em projetos/. Não reescreva nada ainda.

Faça uma auditoria visual e técnica completa. Compare as capas em referencias/ com as telas verdadeiras dos projetos, separando o que é mockup do que está implementado. Gere capturas reais em 375, 390, 768, 1024 e 1440px usando tools/visual-audit.cjs. Rode tools/asset-report.cjs. Abra e inspecione as screenshots; não confie só no log.

Entregue: 10 problemas concretos com arquivo e seletor provável, P0/P1/P2, 3 caminhos de design coerentes com o site atual, sua recomendação e um plano em 3 etapas com critérios de aceitação. Não altere nenhum arquivo sem me apresentar primeiro o plano.
```

## Prompt 2 — Melhorar a home (executar depois de revisar o plano)

```text
Atue como diretor de arte e engenheiro de interface sênior. Leia CLAUDE.md, revise o diagnóstico anterior e melhore a home do meu portfólio, sem trocar HTML/CSS/JS por outro framework.

Objetivos: primeira dobra forte e legível, destaque para três projetos reais, diferenciação entre capa conceitual e screenshot real, tipografia/ritmo/cores consistentes, melhor CTA para ver projetos e entrar em contato. Preserve meus textos factuais e funcionalidades existentes. Não transforme projetos demonstrativos em produtos comerciais falsos.

Faça alterações pequenas. Gere screenshots antes/depois em desktop e celular, execute auditoria automatizada e teste menu, tema, busca e links dos projetos. Corrija eventuais regressões e só então resuma as mudanças, evidências e pendências. Não dê push automaticamente.
```

## Prompt 3 — Refazer apresentação dos três cases

```text
Melhore a apresentação visual dos meus três cases: Seu Manoel, Papitos e Beauty Store. Leia CLAUDE.md e observe as capas fornecidas em referencias/.

Seu Manoel: atmosfera premium preta e vermelho discreto; Papitos: energia gastronômica escura e laranja; Beauty Store: visual refinado com rosa suave e contraste controlado. Use as capas somente como identidade de apresentação; gere screenshots reais das aplicações executáveis e mostre claramente os dois tipos de mídia.

Padronize proporção, alinhamento, tipografia, escala de informações e CTAs dos três cases. Inclua problema, solução, tecnologias que realmente usei, limitações honestas, principais funcionalidades, link da demo e link do código. Evite efeitos exagerados. Inspecione mobile e desktop antes e depois. Não invente checkout pago, backend ou agendamento real.
```

## Prompt 4 — Auditoria de responsividade e UX

```text
Assuma o papel de auditor-visual independente. Não mude arquivos inicialmente. Execute tools/visual-audit.cjs e revise o relatório e cada screenshot gerada em 375, 390, 768, 1024 e 1440px. Teste navegação por teclado, foco, menu mobile, contraste percebido, CTA, todas as imagens, fluxo de agendamento, carrinho, favoritos e checkout demonstrativo.

Classifique problemas confirmados como P0, P1 e P2, e indique exatamente como reproduzir, arquivo afetado e proposta de correção. Após minha autorização, corrija em lotes e execute tudo de novo. Evite correções cosméticas que escondam bugs de overflow.
```

## Prompt 5 — Atualização profissional e SEO

```text
Releia os arquivos do portfólio e me apresente um checklist factual antes de alterar qualquer texto biográfico. Verifique se meu vínculo com a Teknisa foi encerrado, se a previsão de conclusão de ADS está em 2027 e se React/Node/API são claramente rotulados como estudos quando apropriado. Não invente experiências ou certificações.

Melhore as descrições de três projetos para recrutadores e clientes, com linguagem objetiva e evidência. Implemente metatags Open Graph/Twitter Card usando imagem de capa real e URL absoluta correta, revise título, description e links. Confirme que o site funciona em GitHub Pages no subdiretório /Repositorio-Curriculo/. Teste antes de concluir. Não publique sem confirmação.
```
