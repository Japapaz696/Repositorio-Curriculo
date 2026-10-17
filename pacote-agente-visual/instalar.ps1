param(
    [Parameter(Mandatory=$true)]
    [string]$Projeto
)
$ErrorActionPreference = 'Stop'
$origem = $PSScriptRoot
$destino = [IO.Path]::GetFullPath($Projeto)
if (-not (Test-Path -LiteralPath (Join-Path $destino 'index.html'))) {
    throw "Pasta destino nao contem index.html: $destino. Selecione a raiz do portfolio."
}
$arquivos = @(
    'CLAUDE.md', 'AGENTS.md', 'PROMPTS-PARA-AGENTE.md',
    '.claude/agents/diretor-visual.md', '.claude/agents/auditor-visual.md',
    '.claude/skills/revisao-visual/SKILL.md',
    'tools/visual-audit.cjs', 'tools/asset-report.cjs',
    'referencias/seu-manoel.jpeg', 'referencias/papitos.jpeg', 'referencias/beauty-store.jpeg'
)
foreach ($rel in $arquivos) {
    $source = Join-Path $origem $rel
    $target = Join-Path $destino $rel
    $parent = Split-Path -Parent $target
    if (-not (Test-Path -LiteralPath $parent)) {
        New-Item -ItemType Directory -Path $parent -Force | Out-Null
    }
    if (Test-Path -LiteralPath $target) {
        Write-Host "JA EXISTE (nao alterado): $rel" -ForegroundColor Yellow
        continue
    }
    Copy-Item -LiteralPath $source -Destination $target
    Write-Host "INSTALADO: $rel" -ForegroundColor Green
}
Write-Host "`nPronto. Abra o portfolio no VS Code e leia PROMPTS-PARA-AGENTE.md" -ForegroundColor Cyan
Write-Host "Para testar: npm install; npx playwright install chromium; node tools/visual-audit.cjs"
