# Remoção de conteúdo indevido e duplicado

## Por que

O repositório é público e faz parte do material de candidatura. Antes desta limpeza ele tinha 143,5 MB e continha:

- `documentos/LEADS-prospeccao.xlsx` e `documentos/novos-leads.txt` — material comercial de prospecção, que não deve ficar público;
- arquivos de captura acidental no root (`cd`, `utput`, `opencode`, `how --stat --oneline 5a92307`);
- artefatos de ferramentas locais versionados (`.playwright-mcp/`, `.visual-audit/`, `.claude-temp/`);
- dezenas de capturas de trabalho em andamento misturadas ao site publicado;
- vídeos repetidos: o mesmo arquivo aparecia até quatro vezes.

## O que foi removido do versionamento

| Caminho | Motivo |
| --- | --- |
| `documentos/` | material comercial (prospecção de leads) |
| `cd`, `utput`, `opencode`, `how --stat --oneline 5a92307` | arquivos vazios gerados por engano |
| `.playwright-mcp/` | 371 capturas de sessão de ferramenta local |
| `.visual-audit/` | relatórios de auditoria local |
| `.claude-temp/` | script temporário |
| `opencode.json.backup-20261018` | backup de configuração local |
| `screenshot-*.png`, `final-*.png`, `audit-1440-full.png`, `evidencia-menu-mobile-aberto.png`, `portfolio-desktop-1440.png`, `portfolio-mobile-390.png` | capturas soltas no root |
| `antes/`, `depois/`, `previews/` | comparações de trabalho em andamento |
| `assets/creative/` | cópia duplicada dos vídeos |
| `assets/ai-creative-lab/projeto-01/video/` | segunda cópia dos mesmos vídeos |

Esses arquivos continuam no disco. Foram apenas retirados do git e adicionados ao `.gitignore`, então o trabalho local não foi perdido.

## O que foi mantido de propósito

- `projetos/` — as três demonstrações navegáveis (Papitos, Beauty Store, Seu Manoel) e as evidências que estão referenciadas nos relatórios;
- `assets/project-previews/` e `assets/ai-creative-lab/experimento-0*` — imagens e vídeos que o `index.html` realmente exibe;
- `linkedin-assets/` — material de apoio à candidatura;
- `tests/` e `tools/` — scripts de validação do próprio portfólio;
- `SupportFlow/` e `01-task-master-ai/` — projetos reais.

## Impacto medido

- 529 arquivos saíram do versionamento;
- cerca de 60,5 MB de mídia duplicada ou de trabalho em andamento saíram do repositório (≈43% do peso anterior).

## O que ainda falta, e exige aprovação

O histórico do git ainda contém os arquivos removidos, inclusive `documentos/LEADS-prospeccao.xlsx` e `documentos/novos-leads.txt`. Qualquer pessoa consegue recuperá-los por commits antigos.

Limpar de verdade exige **reescrita de histórico** (`git filter-repo`) e **force-push**, ação destrutiva que muda todos os hashes do repositório. O procedimento seguro está descrito em `docs/SEGURANCA-DADOS.md`, incluindo backup privado, impacto em branches e nas cópias existentes.
