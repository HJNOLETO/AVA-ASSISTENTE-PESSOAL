# Menu Interativo Principal - AVA Assistant v3.1
# Uso: .\scripts\menu.ps1

# Configuracao inicial
$ErrorActionPreference = "SilentlyContinue"
$WarningPreference = "SilentlyContinue"

function Show-Menu {
    Clear-Host
    Write-Host "[MENU PRINCIPAL - AVA Assistant v3.1]" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Escolha uma opção:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "  [1]  🧹  Limpar Ambiente (cache, node_modules, processos)" -ForegroundColor White
    Write-Host "  [2]  🔍  Verificar Servidores Ativos" -ForegroundColor White
    Write-Host "  [3]  🟢  Iniciar Dev Server (Vite - porta 5173)" -ForegroundColor White
    Write-Host "  [4]  🏭  Build + Produção (Build e iniciar servidor)" -ForegroundColor White
    Write-Host "  [5]  🔄  Reset Completo (Limpar + Iniciar Dev)" -ForegroundColor White
    Write-Host "  [6]  📊  Status Completo do Sistema" -ForegroundColor White
    Write-Host "  [7]  🛑  Parar Todos os Servidores" -ForegroundColor White
    Write-Host "  [8]  📋  Verificar Portas em Uso" -ForegroundColor White
    Write-Host "  [9]  📚  Ver Documentação dos Scripts" -ForegroundColor White
    Write-Host "  [10] 🚀  Iniciar TODOS os Servidores (Vite+Backend)" -ForegroundColor Cyan
    Write-Host "  [0]  ❌  Sair" -ForegroundColor Red
    Write-Host ""
    Write-Host "────────────────────────────────────────────────────────────" -ForegroundColor Gray
}

function Option-1-Clean {
    Write-Host ""
    Write-Host "Executando: .\scripts\clean.ps1" -ForegroundColor Yellow
    Write-Host ""
    & .\scripts\clean.ps1
    
    Write-Host ""
    Write-Host "✅ Limpeza concluída!" -ForegroundColor Green
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Option-2-CheckServers {
    Clear-Host
    Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  🔍 VERIFICAR SERVIDORES ATIVOS                        ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    
    # Verificar Node.js
    Write-Host "📌 Processos Node.js:" -ForegroundColor Yellow
    $nodeProcs = Get-Process node -ErrorAction SilentlyContinue
    if ($nodeProcs) {
        $nodeProcs | Format-Table -Property Id, ProcessName, CPU, Memory -AutoSize
    } else {
        Write-Host "   ℹ Nenhum processo Node.js ativo" -ForegroundColor Gray
    }
    
    Write-Host ""
    
    # Verificar portas principais
    Write-Host "📌 Portas em Uso:" -ForegroundColor Yellow
    $ports = @(
        [PSCustomObject]@{Port=5173; Service="Vite Dev"},
        [PSCustomObject]@{Port=3000; Service="Node Server"},
        [PSCustomObject]@{Port=3001; Service="API"},
        [PSCustomObject]@{Port=5174; Service="Vite (alt)"},
        [PSCustomObject]@{Port=8080; Service="Outro Serviço"}
    )
    
    foreach ($portInfo in $ports) {
        $conn = Get-NetTCPConnection -LocalPort $portInfo.Port -ErrorAction SilentlyContinue
        if ($conn) {
            $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            Write-Host "   ✓ Porta $($portInfo.Port) [$($portInfo.Service)]: ATIVA - PID $($conn.OwningProcess) ($($proc.ProcessName))" -ForegroundColor Green
        } else {
            Write-Host "   ○ Porta $($portInfo.Port) [$($portInfo.Service)]: livre" -ForegroundColor Gray
        }
    }
    
    Write-Host ""
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Option-3-StartDev {
    Write-Host ""
    Write-Host "Executando: .\scripts\start-dev.ps1" -ForegroundColor Yellow
    Write-Host ""
    & .\scripts\start-dev.ps1
}

function Option-4-StartProd {
    Write-Host ""
    Write-Host "Executando: .\scripts\start-prod.ps1" -ForegroundColor Yellow
    Write-Host ""
    & .\scripts\start-prod.ps1
}

function Option-5-FullReset {
    Write-Host ""
    $confirm = Read-Host "⚠️  Deseja executar reset COMPLETO (limpeza + dev server)? (s/n)"
    if ($confirm -eq 's' -or $confirm -eq 'S') {
        & .\scripts\full-reset.ps1
    } else {
        Write-Host "❌ Operação cancelada" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    }
}

function Option-6-SystemStatus {
    Clear-Host
    Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  📊 STATUS COMPLETO DO SISTEMA                         ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    
    # Versões
    Write-Host "📌 Versões Instaladas:" -ForegroundColor Yellow
    $nodeVer = node --version 2>$null
    $npmVer = npm --version 2>$null
    $pnpmVer = pnpm --version 2>$null
    
    Write-Host "   • Node.js: $nodeVer" -ForegroundColor White
    Write-Host "   • npm: $npmVer" -ForegroundColor White
    Write-Host "   • pnpm: $pnpmVer" -ForegroundColor White
    
    Write-Host ""
    
    # Verificar se node_modules existe
    Write-Host "📌 Dependências:" -ForegroundColor Yellow
    if (Test-Path "node_modules") {
        $moduleCount = (Get-ChildItem -Path "node_modules" -Directory).Count
        Write-Host "   ✓ node_modules encontrado ($moduleCount pacotes)" -ForegroundColor Green
    } else {
        Write-Host "   ✗ node_modules NÃO encontrado" -ForegroundColor Red
    }
    
    Write-Host ""
    
    # Verificar pastas principais
    Write-Host "📌 Estrutura do Projeto:" -ForegroundColor Yellow
    $folders = @("client", "server", "shared", "drizzle", "docs", "scripts")
    foreach ($folder in $folders) {
        if (Test-Path $folder) {
            Write-Host "   ✓ $folder/" -ForegroundColor Green
        } else {
            Write-Host "   ✗ $folder/ (não encontrado)" -ForegroundColor Red
        }
    }
    
    Write-Host ""
    
    # TypeScript Check
    Write-Host "📌 Verificação TypeScript:" -ForegroundColor Yellow
    Write-Host "   Executando pnpm check..." -ForegroundColor Gray
    pnpm check 2>&1 | Select-Object -First 5
    
    Write-Host ""
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Option-7-StopServers {
    Write-Host ""
    Write-Host "🛑 Parando todos os servidores..." -ForegroundColor Yellow
    
    # Matar Node.js
    $nodeProcs = Get-Process node -ErrorAction SilentlyContinue
    if ($nodeProcs) {
        Stop-Process -Name node -Force -ErrorAction SilentlyContinue
        Write-Host "   ✓ Processos Node.js finalizados" -ForegroundColor Green
    } else {
        Write-Host "   ℹ Nenhum processo Node.js ativo" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "✅ Todos os servidores foram parados!" -ForegroundColor Green
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Option-8-CheckPorts {
    Clear-Host
    Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  📋 VERIFICAÇÃO DETALHADA DE PORTAS                    ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    
    $ports = @(5173, 5174, 3000, 3001, 8080, 8000, 8888)
    
    Write-Host "Analisando portas..." -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($port in $ports) {
        $conn = Get-NetTCPConnection -LocalPort $port -State Listen -ErrorAction SilentlyContinue
        if ($conn) {
            $proc = Get-Process -Id $conn.OwningProcess -ErrorAction SilentlyContinue
            Write-Host "Porta $port - EM USO" -ForegroundColor Red
            Write-Host "  └─ Processo: $($proc.ProcessName) (PID: $($conn.OwningProcess))" -ForegroundColor Yellow
            Write-Host "  └─ Memória: $([math]::Round($proc.WorkingSet/1MB, 2)) MB" -ForegroundColor Gray
        } else {
            Write-Host "Porta $port - Livre" -ForegroundColor Green
        }
    }
    
    Write-Host ""
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Option-9-ShowDocs {
    Clear-Host
    Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
    Write-Host "║  📚 DOCUMENTAÇÃO DOS SCRIPTS                           ║" -ForegroundColor Cyan
    Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
    Write-Host ""
    
    if (Test-Path "scripts/README.md") {
        Get-Content "scripts/README.md" | Out-Host
    } else {
        Write-Host "❌ Arquivo scripts/README.md não encontrado" -ForegroundColor Red
    }
    
    Write-Host ""
    Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
}

function Option-10-StartAll {
    Write-Host ""
    Write-Host "🚀 Iniciando servidor completo..." -ForegroundColor Yellow
    Write-Host ""
    
    # Limpar primeiro
    Write-Host "🧹 Limpando ambiente..." -ForegroundColor Gray
    & .\scripts\clean.ps1
    
    Write-Host ""
    Write-Host "🟢 Iniciando Vite + Backend..." -ForegroundColor Cyan
    Write-Host ""
    Write-Host "📍 Acesse em: http://localhost:5173" -ForegroundColor Green
    Write-Host "⏹️  Pressione CTRL+C para parar" -ForegroundColor Yellow
    Write-Host ""
    
    # Aguardar 2 segundos
    Start-Sleep -Seconds 2
    
    # Executar pnpm dev (que já inclui backend)
    pnpm dev
}

# Loop principal
while ($true) {
    Show-Menu
    
    $choice = Read-Host "Digite a opção"
    
    switch ($choice) {
        "1" { Option-1-Clean }
        "2" { Option-2-CheckServers }
        "3" { Option-3-StartDev }
        "4" { Option-4-StartProd }
        "5" { Option-5-FullReset }
        "6" { Option-6-SystemStatus }
        "7" { Option-7-StopServers }
        "8" { Option-8-CheckPorts }
        "9" { Option-9-ShowDocs }
        "10" { Option-10-StartAll }
        "0" {
            Clear-Host
            Write-Host "╔══════════════════════════════════════════════════════════╗" -ForegroundColor Cyan
            Write-Host "║  👋 Até logo! AVA Assistant v3.1                        ║" -ForegroundColor Cyan
            Write-Host "╚══════════════════════════════════════════════════════════╝" -ForegroundColor Cyan
            Write-Host ""
            exit
        }
        default {
            Write-Host ""
            Write-Host "❌ Opção inválida! Tente novamente." -ForegroundColor Red
            Write-Host ""
            Write-Host "Pressione qualquer tecla para voltar ao menu..." -ForegroundColor Gray
            $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        }
    }
}
