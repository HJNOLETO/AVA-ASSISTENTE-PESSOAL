# PowerShell starter for AVA Assistant

param(
    [switch]$FirstTime = $false,
    [switch]$SkipServer = $false,
    [switch]$SkipClient = $false,
    [switch]$NoNewWindows = $false,
    [switch]$SkipChecks = $false
)

$Colors = @{
    Success = "Green"
    Error   = "Red"
    Warning = "Yellow"
    Info    = "Cyan"
}

function Write-Color {
    param([string]$Message, [string]$Color)
    Write-Host $Message -ForegroundColor $Color
}

function Write-Header {
    param([string]$Title)
    Write-Host ""
    Write-Host "==== $Title ====" -ForegroundColor Cyan
}

function Invoke-OrExit {
    param([string]$Command, [string]$ErrorMessage)
    Invoke-Expression $Command
    if ($LASTEXITCODE -ne 0) {
        Write-Color $ErrorMessage $Colors.Error
        exit 1
    }
}

function Start-TerminalCommand {
    param(
        [string]$WorkingDir,
        [string]$Command,
        [string]$Title
    )

    $escapedDir = $WorkingDir.Replace("'", "''")
    $full = "Set-Location '$escapedDir'; `$Host.UI.RawUI.WindowTitle = '$Title'; $Command"
    Start-Process -FilePath "powershell" -ArgumentList "-NoExit", "-Command", $full | Out-Null
}

$ScriptDir = if ($PSScriptRoot) { $PSScriptRoot } else { (Get-Location).Path }

Write-Header "AVA Assistant - Inicializador"
Write-Color "Projeto: $ScriptDir" $Colors.Info

Write-Header "Verificando ambiente"
try {
    $nodeVersion = node --version
    Write-Color "Node.js OK: $nodeVersion" $Colors.Success
} catch {
    Write-Color "Node.js nao encontrado. Instale Node.js v20+" $Colors.Error
    exit 1
}

try {
    $pnpmVersion = pnpm --version
    Write-Color "pnpm OK: $pnpmVersion" $Colors.Success
} catch {
    Write-Color "pnpm nao encontrado. Instale com: npm i -g pnpm" $Colors.Error
    exit 1
}

Push-Location $ScriptDir

if ($FirstTime) {
    Write-Header "Primeira execucao"
    Invoke-OrExit -Command "pnpm install" -ErrorMessage "Falha ao instalar dependencias"
    Write-Color "Dependencias instaladas" $Colors.Success
}

if (-not (Test-Path ".env")) {
    Write-Header "Criando .env padrao"
    @"
DATABASE_URL=file:./sqlite_v2.db
NODE_ENV=development
LOCAL_GUEST_MODE=true
OAUTH_SERVER_URL=http://localhost:3000
VITE_ANALYTICS_WEBSITE_ID=
VITE_ANALYTICS_ENDPOINT=
"@ | Set-Content ".env"
    Write-Color ".env criado" $Colors.Success
} else {
    Write-Color ".env encontrado" $Colors.Success
}

if (-not $SkipChecks) {
    Write-Header "Validacoes"
    Invoke-OrExit -Command "pnpm db:push" -ErrorMessage "Falha em pnpm db:push"
    Invoke-OrExit -Command "pnpm check" -ErrorMessage "Falha em pnpm check"
    Write-Color "Banco e TypeScript validados" $Colors.Success
}

$serverCommand = "$env:NODE_ENV='development'; $env:LOCAL_GUEST_MODE='true'; pnpm dev"
$clientCommand = "pnpm exec vite"

Write-Header "Iniciando servicos"

if ($NoNewWindows) {
    if (-not $SkipClient) {
        Write-Color "No modo -NoNewWindows, o cliente deve rodar em outro terminal." $Colors.Warning
        Write-Color "Comando cliente: pnpm exec vite" $Colors.Info
    }

    if (-not $SkipServer) {
        Write-Color "Iniciando servidor neste terminal..." $Colors.Info
        Invoke-Expression $serverCommand
    } else {
        Write-Color "Servidor ignorado (-SkipServer)." $Colors.Warning
    }
} else {
    if (-not $SkipServer) {
        Start-TerminalCommand -WorkingDir $ScriptDir -Command $serverCommand -Title "AVA Server"
        Write-Color "Servidor iniciado em nova janela." $Colors.Success
    }

    if (-not $SkipClient) {
        Start-TerminalCommand -WorkingDir $ScriptDir -Command $clientCommand -Title "AVA Client"
        Write-Color "Cliente iniciado em nova janela." $Colors.Success
    }

    Write-Host ""
    Write-Color "URLs esperadas:" $Colors.Info
    Write-Color "- App: http://localhost:5173" $Colors.Info
    Write-Color "- API: http://localhost:3000 (ou porta alternativa)" $Colors.Info
}

Pop-Location
