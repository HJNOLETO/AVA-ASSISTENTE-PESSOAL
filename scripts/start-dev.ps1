# Script para Iniciar Dev Server - AVA Assistant v3.1
# Inicia o Vite dev server com Node.js
# Uso: .\scripts\start-dev.ps1

Write-Host "[INICIANDO DEV SERVER - AVA Assistant]" -ForegroundColor Cyan
Write-Host ""

# Verificar se pnpm está instalado
Write-Host "[1] Verificando ambiente..." -ForegroundColor Yellow
$pnpmCheck = pnpm --version 2>$null
if (-not $pnpmCheck) {
    Write-Host "[ERRO] pnpm nao esta instalado!" -ForegroundColor Red
    Write-Host "   Instale com: npm install -g pnpm" -ForegroundColor Yellow
    exit 1
}
Write-Host "   [OK] pnpm versao: $pnpmCheck" -ForegroundColor Green

# Verificar se node_modules existe
Write-Host ""
Write-Host "[2] Verificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "   [AVISO] node_modules nao encontrado. Instalando..." -ForegroundColor Yellow
    pnpm install
    Write-Host "   [OK] Dependencias instaladas" -ForegroundColor Green
}
else {
    Write-Host "   [OK] node_modules ja existe" -ForegroundColor Green
}

# Executar verificação TypeScript
Write-Host ""
Write-Host "[3] Compilacao TypeScript..." -ForegroundColor Yellow
pnpm check
if ($LASTEXITCODE -ne 0) {
    Write-Host "[AVISO] pnpm check retornou erros" -ForegroundColor Yellow
    Write-Host "   Continuando mesmo assim..." -ForegroundColor Gray
}

# Iniciar servidor de desenvolvimento
Write-Host ""
Write-Host "[DEV SERVER INICIANDO EM 3 SECS]" -ForegroundColor Green
Write-Host ""
Write-Host "Acesse em: http://localhost:5173" -ForegroundColor Cyan
Write-Host "Pressione CTRL+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

# Aguardar 3 segundos
Start-Sleep -Seconds 3

# Executar pnpm dev
pnpm dev
