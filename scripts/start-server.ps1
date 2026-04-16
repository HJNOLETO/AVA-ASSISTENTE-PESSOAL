# Script para iniciar o servidor completo
# Uso: powershell -ExecutionPolicy Bypass -File "scripts\start-server.ps1"

Write-Host "[INICIANDO SERVIDOR COMPLETO - AVA Assistant]" -ForegroundColor Cyan
Write-Host ""

# Limpar ambiente
Write-Host "[1] Limpando ambiente..." -ForegroundColor Yellow
& .\scripts\clean.ps1

Write-Host ""

# Matar processos anteriores
Write-Host "[2] Matando todos os processos anteriores..." -ForegroundColor Yellow
Stop-Process -Name node -Force -ErrorAction SilentlyContinue
Stop-Process -Name powershell -Force -ErrorAction SilentlyContinue
Stop-Process -Name pwsh -Force -ErrorAction SilentlyContinue
Write-Host "[OK] Processos finalizados" -ForegroundColor Green

Write-Host ""

# Liberar portas
Write-Host "[3] Liberando portas..." -ForegroundColor Yellow
$ports = @(5173, 5174, 3000, 3001, 8080)
foreach ($port in $ports) {
    $connection = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    if ($connection) {
        Stop-Process -Id $connection.OwningProcess -Force -ErrorAction SilentlyContinue
    }
}
Write-Host "[OK] Portas liberadas" -ForegroundColor Green

Write-Host ""
Write-Host "[LIMPEZA CONCLUIDA]" -ForegroundColor Green
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "[INICIANDO VITE + BACKEND]" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Conectar em:" -ForegroundColor White
Write-Host "  - Frontend: http://localhost:5173" -ForegroundColor Green
Write-Host "  - Backend:  http://localhost:3000" -ForegroundColor Green
Write-Host ""
Write-Host "Para parar: Pressione CTRL+C" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Aguardar 2 segundos
Start-Sleep -Seconds 2

# Executar servidor
Write-Host "Iniciando pnpm dev..." -ForegroundColor Yellow
Write-Host ""

pnpm dev
