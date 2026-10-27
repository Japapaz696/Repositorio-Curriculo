# Plano-mestre — GitHub e portfólio (Lucas Santana da Paz)

Documento local de controle. Não contém segredos. Atualizado em 2026-10-26.

## 1. Objetivo principal

Transformar o GitHub e os projetos em uma apresentação profissional, consistente e tecnicamente sólida, demonstrando habilidades como estudante de Análise e Desenvolvimento de Sistemas e desenvolvedor em formação. Melhorar qualidade visual, usabilidade, acessibilidade, responsividade, arquitetura, segurança, testes, documentação, READMEs, CI, histórico de commits e demonstrações publicadas. Construir portfólio pessoal autoral, com projetos reais, identidade visual própria e estudos de caso honestos. Usar OpenCode com skills, ferramentas, MCPs e agentes pertinentes.

## 2. Ambiente global

- AGENTS.md global: `C:\Users\Lucas\.config\opencode\AGENTS.md` (instalado, carregado e confirmado).
- OpenCode v2.1.4, desktop em `C:\Users\Lucas\AppData\Local\Programs\@opencodedesktop\OpenCode.exe`.
- Skills globais confirmadas em `C:\Users\Lucas\.agents\skills\`: design-taste-frontend, fix-security-vulnerabilities-with-strix, frontend-design, impeccable, penetration-testing-with-strix, ui-animation, web-design-guidelines.
- Skills adicionais em `C:\Users\Lucas\.config\opencode\skills\`: design-taste-frontend, fix-security-vulnerabilities-with-strix, frontend-design, impeccable, karpathy-guidelines, penetration-testing-with-strix, skill-creator, ui-animation, web-design-guidelines.
- Plugins: `opencode plugin list` retornou "No plugins found" (configurados historicamente via cache/npm, mas nenhum plugin ativo confirmado nesta sessão).
- MCPs: `opencode mcp list` retornou "No MCP servers configured".
- Agentes disponíveis: build (primário), plan (primário), explore (subagente), general (subagente), compaction/summary/title (internos).
- Playwright disponível via `C:\Users\Lucas\AppData\Local\Temp\opencode\portfolio-tests\node_modules\playwright`.
- GitHub CLI autenticado como Japapaz696 (escopos gist, read:org, repo, workflow).
- Vercel CLI não instalado; sem token Vercel no ambiente (bloqueio para reatribuição de alias).

## 3. Inventário de repositórios e estado confirmado

### Portfólio principal (Repositorio-Curriculo) — PR #6 aberto (fallback de e-mail)
- Caminho: `C:\Users\Lucas\Documents\OMNIROUTE\portfolio-email-pr` (worktree a partir de `origin/main` em `06c8495`)
- Branch: `fix/portfolio-email-fallback-pr`
- HEAD: `ed962b40c7ae14d4f67d3a921fc93c40bd4516ec`
- PR #6: https://github.com/Japapaz696/Repositorio-Curriculo/pull/6 (aberto, pronto para revisão, mergeable)
- Commit: `fix(contact): open mailto when clipboard copy fails` (script.js, 4 inserções)
- Diff contra origin/main: apenas a correção de e-mail (sem repetir a mudança de acessibilidade do PR #5).
- Testes: 21/21 booking-rules OK; Playwright 320/390/768/1440 px sem overflow/erros; cenário de clipboard falho confirmou "Abrindo e-mail…" e navegação para mailto.
- CI: success.
- Status: branch publicada, PR aberto. Sem merge/deploy.

### Portfólio principal (Repositorio-Curriculo) — novo commit local (anterior):
- Caminho: `C:\Users\Lucas\Documents\OMNIROUTE\portfolio-work`
- Branch: `fix/portfolio-email-fallback`
- HEAD: `eb150b5ed1f6e58d778c7fc657da5b383e8e90ce`
- Commit: `fix(contact): open mailto when clipboard copy fails` (script.js, 4 inserções)
- Correção: quando a cópia para a área de transferência falha, o link de e-mail agora abre o cliente de e-mail (mailto) em vez de deixar o link inerte.
- Testes: 21/21 booking-rules OK; Playwright 320/390/768/1440 px sem overflow/erros; teste de clipboard falho confirmou "Abrindo e-mail…" e navegação para mailto.
- Capturas: `C:\Users\Lucas\AppData\Local\Temp\opencode\portfolio-before\` e `portfolio-palette\`
- Status: commit local. Sem push/PR (aguardando aprovação).

### Portfólio principal (Repositorio-Curriculo) — PR #5 incorporado (anterior):

### Portfólio principal (Repositorio-Curriculo) — novo commit local (demo loading)
- Caminho: `C:\Users\Lucas\Documents\OMNIROUTE\portfolio-work`
- Branch: `fix/portfolio-demo-loading`
- HEAD: `7a43b4e52b0147f205ba6d04f19234dea1be5c4b`
- Commit: `fix(demo): add loading timeout and error handling for iframe` (script.js, 18 inserções)
- Melhoria: timeout de 8s e handler de erro para iframes de demonstração que não carregam.
- Testes: 21/21 booking-rules OK; smoke Playwright em 4 larguras sem overflow/erros; demo dialog abre/fecha corretamente.
- Capturas: `C:\Users\Lucas\AppData\Local\Temp\opencode\portfolio-before\` e `portfolio-palette\`
- Status: commit local. Sem push/PR (aguardando aprovação).
- Caminho: `C:\Users\Lucas\Documents\OMNIROUTE\portfolio-work` (worktree a partir de `origin/main` em `de9f51d`)
- Branch: `feat/portfolio-editorial-quality`
- HEAD: `66fb04d61a70195d2204176aac813fa058caaaf7`
- Branch: `feat/portfolio-editorial-quality` (preservada)
- Commit original: `66fb04d61a70195d2204176aac813fa058caaaf7`
- Merge commit (squash): `06c8495e1c4484c49c2202ed5637f14241340b81`
- Main atual: `06c8495e1c4484c49c2202ed5637f14241340b81`
- CI: success; Pages build and deployment: success.
- Publicação: https://japapaz696.github.io/Repositorio-Curriculo/ (verificado: script.js contém getPaletteButtons/focusPaletteButton).
- Melhoria: navegação por teclado na paleta de comandos (Ctrl+K).
- Testes: 21/21 booking-rules OK; Playwright 320/390/768/1440 px sem overflow/erros.
- Status: concluído e publicado.

### Portfólio principal (Repositorio-Curriculo) — trabalho em andamento (anterior):
- Caminho: `C:\Users\Lucas\Documents\OMNIROUTE\portfolio-work` (worktree criado a partir de `origin/main` em `de9f51d`)
- Branch: `feat/portfolio-editorial-quality`
- HEAD: `66fb04d61a70195d2204176aac813fa058caaaf7`
- Commit: `feat(a11y): add keyboard navigation to command palette` (1 arquivo, 52 inserções)
- Testes: 21/21 booking-rules OK; smoke Playwright em 4 larguras (320/390/768/1440) sem overflow/erros; paleta com ArrowDown/Up, Home/End, Escape verificados.
- Capturas: `C:\Users\Lucas\AppData\Local\Temp\opencode\portfolio-before\` e `portfolio-palette\`
- Status: commit local, sem push/PR (aguardando aprovação).

### SupportFlow — https://github.com/Japapaz696/SupportFlow
- Caminho: `C:\Users\Lucas\Documents\OMNIROUTE\SupportFlow\SupportFlow`
- Branch atual: `fix/supportflow-mobile-dashboard`
- HEAD: `d11164a2b4d58510376e02da95b3a1456a675c70`
- Árvore: limpa
- PR #4: "fix(frontend): improve mobile dashboard density and bar charts" — aberto, pronto para revisão, sem conflitos, checks Vercel passaram.
- Merge #4 ainda não autorizado. Nenhuma alteração de código pendente.
- Publicação: alias `support-flow-green.vercel.app` aponta para deployment antigo (`b85eac89...`); deployment de produção do merge (`c11e2905...`) em `support-flow-rj7ou3se4-support-flow5.vercel.app` (bloqueado por SSO). Reatribuição de alias bloqueada por falta de CLI/token Vercel.
- Pendência registrada: validação visual autenticada do dashboard mobile em produção (limitação de SSO).

### SQL Lab — https://github.com/Japapaz696/sql-lab
- Caminho: `C:\Users\Lucas\AppData\Local\Temp\opencode\sql-lab-p0`
- Branch atual: `fix/render-blueprint-safety` (criada a partir de `fix/p0-seguranca-e-ux` em 97cd679)
- HEAD: `a91975d` (commit do fix render.yaml)
- Árvore: limpa
- Branch anterior `fix/p0-seguranca-e-ux` (HEAD 97cd679) tem 2 commits à frente de `origin/main` (84fb57e): `48f12fb fix: fecha abuso, isolamento de sessao e contraste do laboratorio` e `97cd679 docs: registra runbook da migracao e rollback minimo`. Esses commits NÃO estão em origin/main — provavelmente foram squashados ou re-aplicados via commits de segurança já presentes em main (e05ccdf, 32ad23a, 783877c, etc.). Reconciliação ainda pendente: verificar se o trabalho é redundante.
- PR #1 ("fix: fecha abuso, isolamento de sessão e contraste do SQL Lab") marcado como MERGED.
- PR #2 ("fix(render): disable autoDeploy to match panel") aberto em https://github.com/Japapaz696/sql-lab/pull/2.
- render.yaml: autoDeploy alterado de true para false (branch fix/render-blueprint-safety). healthCheckPath mantido /health. Diferença adicional registrada: painel usa `npm ci`, YAML contém `npm ci --include=dev` (deixado intocado — último deploy bem-sucedido).
- Vulnerabilidade corrigida: body-parser 2.3.0 → 2.4.0 (GHSA-27r3-jxmh-p828). package-lock.json atualizado (6 linhas). `npm audit --omit=dev --audit-level=high`: 0 vulnerabilidades. `npm run validate`: 136 testes aprovados (3 shared, 99 api, 34 web), build OK. CI do PR #2: SUCESSO (commit 98464b5). PR mergeable, sem conflitos.
- Publicação GitHub Pages: HTTP 200 em https://japapaz696.github.io/sql-lab/.
- API Render: GET /health → 200 {"status":"ok"}; GET /ready → 200 {"status":"ok","banco":"ok"}. API funcional, banco disponível.
- Configuração de health check no painel Render: BLOQUEADA — sem CLI/token Vercel/Render autenticado; interface de login não acessível.
- Testes: 136 testes registrados (3 shared, 99 api, 34 web). Não reexecutados nesta reconciliação.

### Lucas Dev — https://github.com/Japapaz696/Lucas
- Caminho: `C:\Users\Lucas\AppData\Local\Temp\opencode\Lucas`
- Branch atual: `fix/lucas-dev-p0`
- HEAD: `a2494d4558dd994c130e0013eea2644fbbaa66b1`
- Árvore: limpa
- PR #2: incorporado à main (merge commit `566287c954fcabcf9a8faace3d5d00f23e287301`). Main atualizada.
- GitHub Pages: `built`, HTTP 200 em https://japapaz696.github.io/Lucas/.
- Contatos confirmados: WhatsApp +55 31 97340-3545, e-mail lucaspaz696@gmail.com.
- Projeto Verônica: links desativados (sem navegação), sem reativação.
- Testes: pricing regression OK, smoke Playwright em 4 larguras OK.
- Status: concluído.

### Lucas AI — https://github.com/Japapaz696/IA-Automa-es-
- Caminho: `C:\Users\Lucas\AppData\Local\Temp\opencode\lucas-ai`
- Branch atual: `main`
- HEAD: `801bc7c0570304506fe24beea4cc1ec4449b08df` (local main, atrás do remoto que está em `29457d1e...`)
- Trabalho em `feat/local-attendance-automation` publicado e incorporado via PR #1 (merge commit `29457d1e6443bcc7b42d6f7a85633a421dfda33e`).
- GitHub Pages: `built`, HTTP 200 em https://japapaz696.github.io/IA-Automa-es-/.
- Testes: 20/20 unitários + Playwright em 4 larguras + axe zero violações (CI verde).
- Status: concluído.

### Portfolio-Anna — https://github.com/Japapaz696/Portfolio-Anna
- Caminho: `C:\Users\Lucas\AppData\Local\Temp\opencode\Portfolio-Anna`
- Branch atual: `fix/portfolio-anna-p0`
- HEAD: `1cc59b8de3af5580223cc3ec2d5cad8931ae90f8`
- PR #2: incorporado à main (merge commit `566287c954fcabcf9a8faace3d5d00f23e287301`).
- GitHub Pages: `built`, HTTP 200 em https://japapaz696.github.io/Portfolio-Anna/.
- Status: concluído.

### Portfólio principal (Repositorio-Curriculo) — https://github.com/Japapaz696/Repositorio-Curriculo
- Caminho: `C:\Users\Lucas\Documents\OMNIROUTE\Curr-culo-`
- Branch atual: `main`
- HEAD: `6bc6036`
- Árvore: 1 arquivo não rastreado (`nul` — artefato de redirecionamento, não intencional)
- Worktrees:
  - `C:\Users\Lucas\Documents\OMNIROUTE\Curr-culo-publish-prep` (branch `prep/publish`, HEAD `0b03fdb`) — com vários arquivos não rastreados (ferramentas de captura, worktrees copiados).
  - `C:\Users\Lucas\Documents\OMNIROUTE\Curr-culo-publish-v2` (branch `prep/publish-v2`, HEAD `33a2fc5`) — com 19 alterações não commitadas.
- Branches remotas: `main`, `chore/organizacao-e-ci`, `docs/supportflow-196-testes`, `redesign/portfolio-v1`.
- Commit `320e162` (redesign Editorial Monograph) é ancestral de `main` — já incorporado.
- Status: redesign editorial já em main; pendências de reconciliação de branches/worktrees e publicação. Não tocar sem decisão.

### Outros repositórios relevantes
- barbearia (Japapaz696/barbearia): não localizado como repo principal no workspace atual (apenas em worktrees de agentes).
- Portfolio-Anna: concluído.
- Site-veronica: não tocar sem autorização.
- `-Conhe-a-e-agende-sua-consulta`, `IA-Automa-es-`, `Lucas`, `Repositorio-Curriculo`, `Site-veronica`, `sql-lab`, `SupportFlow`: confirmados.

## 4. Bloqueios e autorizações pendentes

1. **Vercel — reatribuição de alias** `support-flow-green.vercel.app`: bloqueada por falta de CLI/token Vercel no ambiente.
2. **SQL Lab — Render/Neon**: verificar estado real da API e privilégios do banco (somente leitura, sem autorização para alterações).
3. **Portfólio principal**: reconciliar worktrees `prep/publish` e `prep/publish-v2` e branches antes de continuar redesign.
4. **SupportFlow — dashboard autenticado em produção**: SSO impede validação visual; não inventar credenciais.

## 5. Ordem de prioridade (atualizada 2026-10-26)

1. **SQL Lab — PR #2** aberto: https://github.com/Japapaz696/sql-lab/pull/2 (autoDeploy false). Aguardando revisão/merge. Verificar se os 2 commits locais (48f12fb, 97cd679) são redundantes com main antes de decidir.
2. **SQL Lab — saúde da API e Neon** confirmadas: GET /health → 200, GET /ready → 200 com banco ok. Sem alterações necessárias.
3. **Portfólio principal** — reconciliar worktrees `prep/publish` e `prep/publish-v2` e branches antes de continuar redesign.
4. **SupportFlow** — alias Vercel público desatualizado (bloqueio de CLI/token); validação visual autenticada pendente (SSO).
5. **Lucas Dev, Lucas AI, Portfolio-Anna** — concluídos; não tocar.

## 6. Próxima tarefa concreta (atualizada 2026-10-26)

**SQL Lab — reconciliação de commits**: verificar se `48f12fb` e `97cd679` (locais) já estão representados em `origin/main` (via squash ou re-aplicação), comparando arquivos alterados. Se redundantes, considerar descartar a branch local (após confirmação). Se contêm trabalho não incorporado, preparar PR de reconciliação.

Já concluído:
- API Render: GET /health → 200 {"status":"ok"}; GET /ready → 200 {"status":"ok","banco":"ok"}. API e banco funcionais.
- PR #2 aberto para ajuste de autoDeploy (true → false) no render.yaml.
- Bloqueio: configuração de health check no painel Render não foi possível (sem CLI/token Render autenticado).

Critérios de conclusão:
- Documentar se os commits locais são redundantes ou contêm trabalho não incorporado.
- Confirmar health da API Render e estado do banco Neon (somente leitura) — CONCLUÍDO.
- Registrar bloqueios de acesso — CONCLUÍDO (Render CLI/token ausente).
- Não alterar produção.

## 7. Evidências reais desta reconciliação

- `git status`, `git log`, `git branch -a`, `git worktree list` executados.
- GitHub API consultada para PRs e deployments.
- Curl executado para GitHub Pages (SQL Lab, Lucas Dev, Lucas AI, Portfolio-Anna, SupportFlow).
- Nenhum arquivo de aplicação alterado nesta etapa.
- Arquivo de controle criado: `C:\Users\Lucas\Documents\OMNIROUTE\PLANO-MESTRE-GITHUB-PORTFOLIO.md`.

## 8. Limitações

- Vercel CLI não instalado; sem token Vercel (bloqueio para reatribuição de alias).
- Render/Neon não verificados nesta etapa (requer credenciais/acesso).
- Worktrees do portfólio com arquivos não rastreados não foram tocados.
- Branch `fix/p0-seguranca-e-ux` do sql-lab tem 2 commits não em main; não foi feito merge automático.
EOF
Write-Host "PLANO-MESTRE criado"

## 9. Atualizacao de sessao — 2026-10-26 (reconciliacao e melhoria local)

### SQL Lab
- Commits locais 48f12fb e 97cd679 confirmados REDUNDANTES com origin/main (PR #1 merge commit 0d622bc).
- PR #2 (fix/render-blueprint-safety) confirmado MERGED (merge commit 1fe6a0f), incluindo autoDeploy false e body-parser 2.4.0.
- origin/main fast-forwarded para 1fe6a0f; branch local fix/render-blueprint-safety reconciliada (HEAD 1fe6a0f).
- Testes reexecutados: 136/136 (3 shared + 99 api + 34 web), exit 0. Baseline confirmado.
- Bloqueio externo permanece: configuracao de health check no painel Render (sem CLI/token).

### Portfolio principal (Repositorio-Curriculo)
- main local fast-forwarded para 3ae8939 (inclui PR #5 a11y paleta e PR #6 fallback de e-mail).
- Melhoria aplicada localmente em branch fix/demo-loading-timeout (commit f57b1f5): timeout de 8s + handler de erro para iframes de demo, cherry-pick do commit 7a43b4e da branch fix/portfolio-demo-loading.
- Verificacao: 21/21 booking-rules OK; Playwright 320/390/768/1440 px sem overflow (0 elementos) e 0 erros de console; dialog de demo abre, mostra 'Carregando interface local...', oculta apos carga e fecha corretamente.
- main preservado em 3ae8939 (sem push/PR).
- Worktrees prep/publish e prep/publish-v2 nao tocados (mantem arquivos nao rastreados de auditoria).

### Bloqueios externos (sem alteracao)
- Vercel alias support-flow-green.vercel.app (sem CLI/token).
- Render/Neon painel (sem CLI/token).
- SupportFlow dashboard autenticado em producao (SSO).
- Site-veronica: nao tocado (divergencia de branches, sem autorizacao).

### Proxima prioridade sugerida
- Abrir PR para fix/demo-loading-timeout quando autorizado (push/PR). Ou investigar a proxima melhoria de maior impacto (ex.: seguranca/a11y das demos embutidas, cobertura de testes).
## 10. Atualizacao de sessao — 2026-10-26 (seguranca, qualidade e publicacao)

### Tarefa 1 — Demo loading (publicado)
- Branch fix/demo-loading-timeout (commit f57b1f5) publicada em origin/fix/demo-loading-timeout.
- PR #7 aberto: https://github.com/Japapaz696/Repositorio-Curriculo/pull/7 (sem merge).
- Testes: 21/21 booking-rules; Playwright 320/390/768/1440 px (0 overflow, 0 erros); dialog de demo validado.

### Tarefa 2 — Seguranca e qualidade (publicado)
- Branch fix/beauty-store-xss-escape (commit 2e359a8) publicada em origin/fix/beauty-store-xss-escape.
- PR #8 aberto: https://github.com/Japapaz696/Repositorio-Curriculo/pull/8 (sem merge).
- Novo utilitario projetos/beauty-store/sanitize.js (escapeHtml, UMD) + 5 testes (sanitize.test.mjs, 5/5 OK).
- Aplicado escapeHtml em renderProdutos, openDetail, renderFavoritos, renderCart e modal de confirmacao (Beauty Store).
- Auditoria: papitos ja usa createElement/textContent (seguro); seu-manoel usa createElement/textContent (seguro); portfolio principal nao usa innerHTML com dados externos.
- Playwright (1280x800): 0 erros de console; detalhe abre; carrinho renderiza 1 item.

### Documentacao de seguranca (publicado)
- Branch docs/security-posture (commit 677b749) publicada em origin/docs/security-posture.
- PR #9 aberto: https://github.com/Japapaz696/Repositorio-Curriculo/pull/9 (sem merge).
- Novo arquivo SECURITY.md.

### Estado do Git
- main preservado em 3ae8939 (= origin/main). Sem merge em nenhuma PR.
- Branches remotas novas: fix/demo-loading-timeout, fix/beauty-store-xss-escape, docs/security-posture.
- Worktrees prep/publish e prep/publish-v2 nao tocados.

### Bloqueios externos (sem alteracao)
- Vercel alias, Render/Neon painel, SupportFlow SSO, Site-veronica (sem autorizacao).

### Proxima prioridade sugerida
- Revisar/mergear PRs quando autorizado. Ou avancar para redesign de maior impacto (identidade visual, acessibilidade) com base em auditoria, ou novo projeto diferenciador (API + SQL + testes).
