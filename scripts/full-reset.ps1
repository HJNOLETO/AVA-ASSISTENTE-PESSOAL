# Script Completo: Limpar + Iniciar Dev - AVA Assistant v3.1
# Combina limpeza e início do servidor
# Uso: .\scripts\full-reset.ps1

Write-Host "[RESET COMPLETO + START - AVA Assistant]" -ForegroundColor Cyan
Write-Host ""

# Executar limpeza
Write-Host "[Etapa 1] Limpeza de ambiente..." -ForegroundColor Yellow
.\scripts\clean.ps1

# Verificar se a limpeza foi bem-sucedida
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Erro durante limpeza!" -ForegroundColor Red
    exit 1
}

# Aguardar um pouco
Write-Host ""
Write-Host "[Aguardando 2 segundos...]" -ForegroundColor Gray
Start-Sleep -Seconds 2

# Executar start dev
Write-Host ""
Write-Host "[Etapa 2] Iniciando dev server..." -ForegroundColor Yellow
.\scripts\start-dev.ps1
