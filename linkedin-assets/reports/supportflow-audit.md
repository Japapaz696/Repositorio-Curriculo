# SupportFlow — auditoria e validação para apresentação profissional

Verificação concluída em 05/10/2026. Projeto próprio; não é experiência de emprego nem produto declarado pronto para produção.

## Resultado

SupportFlow é o principal projeto técnico recomendado para o LinkedIn. O código local contém um monorepo React/TypeScript/Vite, Express/TypeScript e PostgreSQL, com migrations, autenticação JWT, permissões por perfil e fluxos de chamados. Foi possível executar a interface real com backend e banco isolados, capturar telas e rodar a suíte de integração.

## Evidências no código

Os caminhos abaixo são relativos a `SupportFlow/SupportFlow/`.

| Afirmação | Evidência |
| --- | --- |
| Monorepo e build de três workspaces | `package.json`; `apps/frontend/package.json`; `apps/backend/package.json`; `packages/shared/package.json` |
| React e Vite com TypeScript | `apps/frontend/src/App.tsx`, `main.tsx`, `pages/`, manifests e tsconfigs |
| Express, JWT, bcrypt e PostgreSQL | `apps/backend/package.json`, `src/app.ts`, `src/services/auth.service.ts`, `src/database/pool.ts` |
| Autenticação e usuário revalidado no banco | `src/middleware/auth.middleware.ts`, `src/services/auth.service.ts` |
| Perfis requester, agent, manager e admin | Tipos em `packages/shared/`, middleware de autorização e serviços de chamados |
| Chamados: abertura, listagem, atribuição, estados e comentários | `src/services/tickets.service.ts`; `apps/frontend/src/pages/TicketsPage.tsx`, `CreateTicketForm.tsx`, `TicketDetailPage.tsx` |
| Comentários públicos/internos e histórico | Serviços/repositórios de chamados e testes M4 |
| SLA e dashboard | `src/services/sla-policies.service.ts`, `dashboard.service.ts`; páginas `SlaPoliciesPage.tsx`, `DashboardPage.tsx`; testes M5 |
| Notificações internas por usuário | `src/services/notifications.service.ts`; `NotificationsPanel.tsx`; migration 003 e testes M6 |
| Registro de diagnóstico técnico por chamado | `src/services/ticket-technical-diagnostics.service.ts`; `TicketTechnicalDiagnosticPanel.tsx`; migration 004 e testes M7 |
| Quatro migrations | `src/database/migrations/001_initial_schema.sql` até `004_ticket_technical_diagnostics.sql` |
| Testes de integração | `auth.integration.test.ts`, `m4.integration.test.ts`, `m5.integration.test.ts`, `m6.integration.test.ts`, `m7.integration.test.ts` |

## Validação executada

- A cópia temporária recuperada não tem `.env` do projeto original.
- PostgreSQL próprio em `127.0.0.1:55439`; banco de demonstração `supportflow_demo` e banco separado `supportflow_linkedin_verification`.
- Quatro migrations aplicadas no banco de verificação.
- **5 arquivos de teste, 77 testes passaram**, com Vitest 5.0.2. Log: [supportflow-tests.txt](supportflow-tests.txt).
- Typecheck do backend passou. Log: [supportflow-backend-typecheck.txt](supportflow-backend-typecheck.txt).
- `npm.cmd run build` passou: shared, backend TypeScript, frontend TypeScript/Vite; 43 módulos no build front-end.
- Backend `/health`: HTTP 200, `status: ok`.
- Login, dashboard, lista de chamados e detalhe/diagnóstico abertos pelo navegador na aplicação local real; 7 capturas, nenhum `pageerror` e nenhum overflow horizontal nas telas capturadas.
- Capturas realizadas com Playwright Core 1.63.0 e Chromium; respostas da API não foram simuladas. Só hosts loopback foram permitidos no navegador de SupportFlow.

O primeiro comando de teste da retomada usou o mesmo valor para `DATABASE_URL` e `TEST_DATABASE_URL`; a proteção do projeto corretamente rejeitou essa configuração antes de executar testes. O script de verificação foi corrigido para usar bancos distintos. A primeira tentativa está preservada em [supportflow-tests-first-attempt.txt](supportflow-tests-first-attempt.txt). Isso foi um erro na configuração da verificação, sem falha de teste funcional atribuída ao projeto.

## Limites que devem acompanhar a apresentação

- O diagnóstico técnico **registra** logs, endpoint, resumo e evidência SQL; não executa consultas fornecidas nem chama um modelo de IA.
- SLA usa tempo corrido. Não apresentar calendário comercial ou escalonamento automático como implementados.
- Os testes existentes são de integração do backend. As capturas no navegador validam os fluxos percorridos, mas não são uma suíte E2E completa de regressão.
- A demo publicada informada no GitHub não teve todos os fluxos autenticados validados nesta execução. Para Destaques, priorizar o repositório e as imagens locais identificadas.
- Autenticação, RBAC e testes não equivalem a certificação de segurança ou prontidão de produção.
- Os números do dashboard capturado representam **sete tickets fictícios**, não clientes, atendimentos ou resultados profissionais de Lucas.
- TypeScript é tecnologia verificada neste projeto. Sua presença no código não prova domínio independente e não foi promovida automaticamente a competência principal do perfil.

## Descrição curta pronta

Desenvolvi o SupportFlow como projeto próprio para praticar a organização de chamados de suporte. A aplicação reúne React, TypeScript e Vite no front-end, Node.js/Express no backend e PostgreSQL com migrations. Implementei autenticação JWT, acesso por perfil, fluxo de chamados, comentários, histórico, dashboard, políticas SLA e registro de diagnóstico técnico. Validei o build e os testes de integração em ambiente isolado; o projeto segue em desenvolvimento.

Código: https://github.com/Japapaz696/SupportFlow

Imagem principal: `screenshots/supportflow-dashboard-desktop.png`. Complementos: `supportflow-dashboard-mobile.png`, `supportflow-chamados-desktop.png` e `supportflow-detalhe-desktop.png`.
