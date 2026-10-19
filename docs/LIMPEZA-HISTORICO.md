# Limpeza de histórico — situação e procedimento

Documento de preparação. **Nada foi reescrito nem enviado.** A reescrita do
histórico depende de autorização específica, porque troca o passado dos dois
repositórios publicados.

Data da análise: 2026-10-19.

## O que ainda está exposto no histórico

Dois repositórios guardam versões antigas de arquivos que já saíram do
versionamento atual. Qualquer pessoa com o clone consegue recuperá-las por
`git log` / `git cat-file`, mesmo depois dos pull requests.

### Japapaz696/Site-veronica

| Item | Valor |
| --- | --- |
| Arquivo sensível | `data/agendamentos.json` (dados reais de agendamento) |
| Commits que tocam o arquivo | 2 |
| Commit mais antigo | `76200f7` |
| Commit mais recente | `a6f0ee6` (branch do PR) |
| Tags | nenhuma |
| Branches remotas | `main`, `fix/site-veronica-containment` |
| Refs de PR no servidor | `refs/pull/1/head`, `refs/pull/1/merge` |
| Ainda no versionamento atual | não |

O arquivo continua no disco (fora da web) e está ignorado pelo git. Foi
substituído por `data/agendamentos.example.json`, vazio, para documentar o
formato.

### Japapaz696/Repositorio-Curriculo

| Item | Valor |
| --- | --- |
| Caminhos sensíveis | `documentos/`, `.playwright-mcp/`, `.visual-audit/`, `.claude-temp/` |
| Commits que tocam esses caminhos | 10 |
| Commit mais antigo | `356e8f7` |
| Commit mais recente | `aab0340` (branch do PR) |
| Tags | nenhuma |
| Branches remotas | `main`, `chore/portfolio-privacy` |
| Refs de PR no servidor | `refs/pull/1/head`, `refs/pull/1/merge` |
| Ainda no versionamento atual | não |

O commit `356e8f7` é o que expõe o material comercial
(`documentos/LEADS-prospeccao.xlsx` e `documentos/novos-leads.txt`). Os demais
trazem apenas capturas de ferramentas locais.

## Caminho sensível aninhado (corrigido no procedimento)

A primeira versão do filtro usava `--path .visual-audit/`, que **não** alcança
`pacote-agente-visual/.visual-audit/`. O `git filter-repo` distingue:

- `--path .visual-audit/` → só o caminho de raiz;
- `--path-glob '**/.visual-audit/**'` → só os aninhados.

É preciso **os dois**. Sem isso, um relatório de auditoria sobrevive à limpeza.
O ensaio confirmou a diferença.

## Ensaio executado (em cópias descartáveis)

A reescrita foi rodada em cópias fora dos repositorios reais, sem remoto:

| Verificação | Site-veronica | Repositorio-Curriculo |
| --- | --- | --- |
| Commits antes | 11 | 31 |
| Commits depois | 11 | 29 |
| Ocorrências sensíveis depois | **0** | **0** |
| Branches preservadas | 2 | 2 |
| Arquivos sensíveis mantidos no disco | sim | sim |
| Testes após a reescrita | **59/59 verdes** | não se aplica |

Os commits caem de 31 para 29 no portfólio porque dois commits ficam vazios
depois de remover os únicos arquivos que tocavam.

## Backup privado (feito e verificado)

Destino: `C:\Users\Lucas\Downloads\_BACKUP-PRIVADO-P0`

Fica fora de qualquer repositório git e fora do OneDrive (que sincroniza só
Desktop, Documentos e Imagens). Contém:

- os três arquivos sensíveis, com hash SHA-256 conferido;
- cópia completa do `.git` dos dois repositórios;
- `VERIFICACAO-INTEGRIDADE.json` com os resultados.

Integridade comprovada: os blobs sensíveis são recuperáveis do backup
(`data/agendamentos.json` 301 B, `LEADS-prospeccao.xlsx` 21.127 B,
`novos-leads.txt` 262 B).

## Procedimento, quando autorizado

1. Confirmar que o backup privado está íntegro e recente.
2. Garantir os pull requests **mesclados** antes da reescrita, senão o HEAD
   reescrito perde as correções.
3. Em cada repositório, rodar:

   ```
   git filter-repo --force \
     --path data/agendamentos.json --invert-paths
   ```

   ```
   git filter-repo --force \
     --path documentos/ --invert-paths \
     --path .playwright-mcp/ --invert-paths \
     --path .visual-audit/ --invert-paths --path-glob '**/.visual-audit/**' --invert-paths \
     --path .claude-temp/ --invert-paths --path-glob '**/.claude-temp/**' --invert-paths
   ```

4. Conferir: `git rev-list --all --objects` não deve retornar nenhum caminho
   sensível.
5. Rodar a suíte de testes.
6. Force-push com lease explícito, uma branch por vez.
7. **Fechar os pull requests antigos ou abrir novos**, porque as refs
   `refs/pull/1/*` guardam os commits antigos no servidor. Enquanto existirem,
   o material continua alcançável pela URL do PR. O suporte do GitHub remove as
   refs de PR depois de um tempo quando o PR é fechado, mas não é instantâneo.
8. Apagar o repositório não é necessário. Se quiser garantia imediata, a única
   forma é recriar o repositório, o que troca todas as URLs.

## Ordem recomendada

O ganho real vem primeiro de **parar de publicar**, não de reescrever:

1. mesclar o PR do portfólio (o Pages para de servir `documentos/`);
2. mesclar o PR do Site-veronica e publicar (some a exposição de `server.js` e
   `data/`);
3. rotacionar a senha administrativa;
4. só então avaliar a reescrita do histórico, que é cosmética do ponto de vista
   do acesso público.

## O que este documento não faz

- não executa a reescrita;
- não faz force-push;
- não apaga repositórios;
- não contém dados dos arquivos sensíveis.
