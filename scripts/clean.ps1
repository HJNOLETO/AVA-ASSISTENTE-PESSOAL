# Script de Limpeza - AVA Assistant v3.1
# Limpa caches, processos node e prepara ambiente
# Uso: .\scripts\clean.ps1

Write-Host "[LIMPEZA DE AMBIENTE - AVA Assistant]" -ForegroundColor Cyan
Write-Host ""

# 1. Matar processos node anteriores
Write-Host "[1] Matando processos Node.js anteriores..." -ForegroundColor Yellow
$nodeProcesses = Get-Process node -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Stop-Process -Name node -Force -ErrorAction SilentlyContinue
    Write-Host "   [OK] Processos Node.js finalizados" -ForegroundColor Green
}
else {
    Write-Host "   [INFO] Nenhum processo node ativo" -ForegroundColor Gray
}

# 2. Limpar diretórios de cache e build
Write-Host ""
Write-Host "[2] Removendo diretorios de cache..." -ForegroundColor Yellow
$dirsToClean = @("dist", ".turbo", ".vitest", ".next", "build")
foreach ($dir in $dirsToClean) {
    if (Test-Path $dir) {
        Remove-Item -Path $dir -Recurse -Force -ErrorAction SilentlyContinue
        Write-Host "   [OK] Removido: $dir" -ForegroundColor Green
    }
}

# 3. Limpar cache do Vite
Write-Host ""
Write-Host "[3] Limpando cache do sistema..." -ForegroundColor Yellow
if (Test-Path "node_modules/.vite") {
    Remove-Item -Path "node_modules/.vite" -Recurse -Force -ErrorAction SilentlyContinue
    Write-Host "   [OK] Cache Vite removido" -ForegroundColor Green
}

# 4. Liberar portas
Write-Host ""
Write-Host "[4] Liberar portas..." -ForegroundColor Yellow
$ports = @(5173, 5174, 3000, 3001, 8080)
foreach ($port in $ports) {
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($process) {
        $processId = $process.OwningProcess
        Stop-Process -Id $processId -Force -ErrorAction SilentlyContinue
        Write-Host "   [OK] Porta $port liberada" -ForegroundColor Green
    }
}

# 5. Relatório final
Write-Host ""
Write-Host "[LIMPEZA CONCLUIDA COM SUCESSO]" -ForegroundColor Green
Write-Host ""
Write-Host "Proximos passos:" -ForegroundColor Cyan
Write-Host "   - Use: .\scripts\start-dev.ps1  (para desenvolvimento)" -ForegroundColor White
Write-Host "   - Use: .\scripts\start-prod.ps1 (para producao)" -ForegroundColor White
Write-Host ""
