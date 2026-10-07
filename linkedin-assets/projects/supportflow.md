# SupportFlow — sistema de chamados

**Categoria:** Projeto próprio em desenvolvimento · Full-stack.

**Texto pronto para LinkedIn:**

Desenvolvi o SupportFlow como projeto próprio para praticar a organização de chamados de suporte. A aplicação reúne React, TypeScript e Vite no front-end, Node.js/Express no backend e PostgreSQL com migrations. Implementei autenticação JWT, acesso por perfil, fluxo de chamados, comentários, histórico, dashboard, políticas SLA e registro de diagnóstico técnico. Validei o build e os testes de integração em ambiente isolado; o projeto segue em desenvolvimento.

**Problema / objetivo:** Explorar a organização do atendimento de suporte, o acompanhamento de chamados e as diferenças de acesso entre solicitante, agente, gestor e administrador.

**O que desenvolvi:** Interface React, API Express, persistência PostgreSQL, contratos compartilhados em TypeScript e testes de integração do backend.

**Tecnologias reais:** React, TypeScript, Vite, Node.js, Express, PostgreSQL, JWT, bcrypt, Vitest e Supertest.

**Funcionalidades:**

- Login e controle de acesso por perfil
- Abertura, listagem, atribuição e transições de chamados
- Comentários públicos/internos e histórico
- Dashboard, políticas SLA e notificações internas
- Registro de diagnóstico técnico por chamado

**Aprendizado / destaque:** Integração entre interface, API e banco; organização de regras de negócio, autenticação e validação por testes.

**Resultado verificado:** Build completo e 77 testes em cinco arquivos de integração passaram em ambiente isolado. Dashboard e chamados foram abertos com dados fictícios.

**Limites:** Projeto em desenvolvimento. SLA em tempo corrido. O diagnóstico registra evidências; não executa SQL nem um agente de IA. TypeScript é stack do projeto, sem atribuir senioridade ao autor.

**Demo:** Validada localmente. Usar código e capturas; operação online autenticada não comprovada.

**GitHub:** https://github.com/Japapaz696/SupportFlow

**Imagem principal:** [screenshots/supportflow-dashboard-desktop.png](screenshots/supportflow-dashboard-desktop.png).