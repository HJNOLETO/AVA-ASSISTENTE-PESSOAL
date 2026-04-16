# Script para Build e Modo Producao - AVA Assistant v3.1
# Constroi a aplicacao e inicia em modo producao
# Uso: .\scripts\start-prod.ps1

Write-Host "[BUILD E PRODUCAO - AVA Assistant]" -ForegroundColor Cyan
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

# Verificar dependências
Write-Host ""
Write-Host "[2] Verificando dependencias..." -ForegroundColor Yellow
if (-not (Test-Path "node_modules")) {
    Write-Host "   [AVISO] Instalando dependencias..." -ForegroundColor Yellow
    pnpm install
}
Write-Host "   [OK] Dependencias OK" -ForegroundColor Green

# Verificação TypeScript
Write-Host ""
Write-Host "[3] Verificacao TypeScript..." -ForegroundColor Yellow
pnpm check
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Erro na compilacao TypeScript!" -ForegroundColor Red
    exit 1
}
Write-Host "   [OK] TypeScript OK" -ForegroundColor Green

# Build
Write-Host ""
Write-Host "[4] Construindo aplicacao..." -ForegroundColor Yellow
pnpm build
if ($LASTEXITCODE -ne 0) {
    Write-Host "[ERRO] Erro durante build!" -ForegroundColor Red
    exit 1
}
Write-Host "   [OK] Build concluido" -ForegroundColor Green

# Executar testes (opcional)
Write-Host ""
Write-Host "[5] Executando testes..." -ForegroundColor Yellow
pnpm test
if ($LASTEXITCODE -ne 0) {
    Write-Host "[AVISO] Alguns testes falharam" -ForegroundColor Yellow
}

# Iniciar servidor
Write-Host ""
Write-Host "[SERVIDOR PRODUCAO INICIANDO]" -ForegroundColor Green
Write-Host ""
Write-Host "Acesse em: http://localhost:3000" -ForegroundColor Cyan
Write-Host "Pressione CTRL+C para parar o servidor" -ForegroundColor Yellow
Write-Host ""

# Aguardar 3 segundos
Start-Sleep -Seconds 3

# Iniciar servidor (ajuste conforme necessário)
# pnpm start  # Se tiver script 'start' definido
# ou
node dist/index.js  # Se tiver arquivo de entrada
