# SupportFlow

Projeto próprio de sistema de chamados, construído para praticar desenvolvimento de software a partir de problemas comuns de suporte.

**Estágio:** aplicação em desenvolvimento, validada localmente com dados fictícios. Não representa software utilizado por clientes em produção.

## Stack

- Front-end: React, TypeScript e Vite.
- Backend: Node.js, Express e TypeScript.
- Persistência: PostgreSQL, migrations SQL e consultas parametrizadas nos repositórios.
- Autenticação: JWT Bearer e bcrypt para senhas.
- Verificação: Vitest e Supertest nos testes de integração de backend.

## O que está implementado

- Autenticação e perfis de solicitante, agente, gestor e administrador.
- Categorias, abertura e acompanhamento de chamados.
- Atribuição, prioridade e transições de status.
- Comentários públicos/internos e histórico de eventos.
- Políticas SLA e dashboard operacional.
- Notificações internas por usuário.
- Registro de diagnóstico técnico por chamado.

O diagnóstico armazena evidências e anotações: não executa o SQL informado nem chama uma IA. O SLA é calculado em tempo corrido, sem calendário comercial.

## Executar localmente

Requisitos: Node.js 20+ e PostgreSQL. Execute os comandos da raiz deste monorepo.

```powershell
Copy-Item .env.example .env
npm.cmd ci
```

Preencha a conexão de **um banco de desenvolvimento próprio**, um `JWT_SECRET` aleatório com no mínimo 32 caracteres e os campos de bootstrap descritos no `.env.example`. Não publique esses valores.

```powershell
npm.cmd run db:migrate
npm.cmd run bootstrap:admin
npm.cmd run dev:backend
```

Em outro terminal:

```powershell
npm.cmd run dev:frontend
```

Endereços padrão: front-end `http://localhost:5173`, backend `http://localhost:3000/health`. Antes de executar migrations, conferir a conexão configurada. Não usar banco de produção.

## Testes e build

Use `TEST_DATABASE_URL` de um **banco de testes distinto** de `DATABASE_URL`; prepare suas migrations antes da suíte. A aplicação bloqueia testes quando o armazenamento não está isolado.

```powershell
npm.cmd run build
npm.cmd run test
```

Na revisão de 05/10/2026, as quatro migrations, o build completo e **77 testes em cinco arquivos de integração** passaram em ambiente temporário isolado. Login, dashboard, chamados e detalhe técnico foram abertos no navegador com dados fictícios. Isso não cobre todos os casos de operação nem certifica segurança de produção.

## Capturas

Copie para `docs/screenshots/` os arquivos reais de `linkedin-assets/screenshots/` antes de incluir os links abaixo no README publicado:

- `supportflow-dashboard-desktop.png`;
- `supportflow-dashboard-mobile.png`;
- `supportflow-chamados-desktop.png`;
- `supportflow-detalhe-desktop.png`.

As capturas usam dados fictícios. Os indicadores não são resultados de clientes reais.

## Documentação

- [API](docs/API.md)
- [Arquitetura](docs/ARCHITECTURE.md)
- [Banco de dados](docs/DATABASE.md)

## Autor

[Lucas Santana da Paz](https://github.com/Japapaz696) · [Portfólio](https://japapaz696.github.io/Repositorio-Curriculo/)
