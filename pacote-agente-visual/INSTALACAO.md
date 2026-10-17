# Pacote de agente visual — portfólio Lucas

Preparado para o repositório `Japapaz696/Repositorio-Curriculo`, usando Claude Code com OmniRoute (Claude como interface) e opcionalmente Codex.

## Conteúdo

- `CLAUDE.md`: regras permanentes de implementação e direção visual para Claude Code.
- `AGENTS.md`: instruções de compatibilidade para Codex.
- `.claude/agents/diretor-visual.md`: subagente para melhorias visuais.
- `.claude/agents/auditor-visual.md`: subagente para QA independente.
- `.claude/skills/revisao-visual/SKILL.md`: processo de revisão visual repetível.
- `tools/visual-audit.cjs`: gera PNGs e relatório JSON/Markdown de 4 páginas em 5 resoluções.
- `tools/asset-report.cjs`: encontra mídias grandes e duplicadas pelo SHA-256 sem excluí-las.
- `referencias/`: três capas originais fornecidas para orientar a apresentação.
- `PROMPTS-PARA-AGENTE.md`: cinco comandos prontos para colar no chat.
- `instalar.ps1`: instala sem sobrescrever arquivos existentes.

## Como instalar no Windows

1. Extraia o ZIP em uma pasta separada, como `Downloads\pacote-agente-visual`.
2. Abra PowerShell no local onde extraiu o pacote.
3. Execute (troque a pasta por onde está seu repositório):

```powershell
powershell -NoProfile -ExecutionPolicy Bypass -File .\instalar.ps1 -Projeto "C:\Users\Lucas\Documents\OMNIROUTE\Curr-culo-"
```

O instalador **pula arquivos que já existirem**. Se houver `CLAUDE.md` ou outras regras prévias, mescle manualmente em vez de substituir sem revisar.

Abra a pasta do repositório no VS Code (a pasta que contém `index.html` e `style.css`). Reinicie a sessão do Claude Code se necessário para carregar os novos agentes e skills. O OmniRoute continua responsável pelos modelos; o pacote não modifica a configuração dos provedores.

## Comandos de validação

Na raiz do repositório:

```powershell
npm install
npx playwright install chromium
node tools/visual-audit.cjs
node tools/asset-report.cjs
```

Saídas em `.visual-audit/`: capturas PNG, `report.json`, `report.md` e `asset-report.md`.

Se quiser analisar a versão publicada em vez da cópia local:

```powershell
node tools/visual-audit.cjs --base-url=https://japapaz696.github.io/Repositorio-Curriculo/
```

A auditoria externa depende de rede e do que realmente estiver publicado. A análise automatizada NÃO substitui conferir visualmente as capturas e testar interações.

**Recomendação:** acrescente `.visual-audit/` ao `.gitignore` para não enviar relatórios e screenshots ao GitHub. O seu repositório já ignora `.claude/`, então subagentes e skills ficam **apenas locais** quando instalados nessa pasta, a menos que você altere intencionalmente essa regra.

## Qual prompt usar primeiro

Comece com **Prompt 1 — Auditoria inicial**, em `PROMPTS-PARA-AGENTE.md`. Depois de revisar o diagnóstico, siga para Prompt 2 ou Prompt 3.

## Limitações honestas

- Os scripts validam erros frequentes, mas NÃO calculam nota Lighthouse nem conformidade WCAG completa.
- Não há conexão automática do agente aos serviços de edição de imagens: as referências são fotos fornecidas pelo usuário, não arquivos de interface.
- Não é um instalador de modelos de IA. Funciona com os provedores já configurados, desde que o agente tenha acesso a arquivos e terminal.
- As quatro páginas e os caminhos são os encontrados no repositório consultado em outubro de 2026; caso a estrutura mude, atualize `PAGES` em `tools/visual-audit.cjs`.
