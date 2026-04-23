@echo off
setlocal

REM AVA CLI Wrapper Script para Windows
REM Este script facilita a interacao com o CLI Docker sem a necessidade de digitar comandos complexos.

if "%~1"=="" goto help
if "%~1"=="help" goto help
if "%~1"=="ask" goto ask
if "%~1"=="build" goto build
if "%~1"=="stop" goto stop

:help
echo.
echo =========================================================
echo                   GERENCIADOR AVA CLI
echo =========================================================
echo Uso: ava-cli.bat [comando] [argumentos...]
echo.
echo Comandos Disponiveis:
echo   ask "mensagem"      Envia uma mensagem pro CLI Autonomo no Docker.
echo                       (Ex: ava-cli.bat ask "Liste meus arquivos")
echo.
echo   build               Reconstroi a imagem Docker do CLI do zero (otimizado).
echo                       Ideal quando novos pacotes node_modules forem adicionados.
echo.
echo   stop                Derruba e limpa possiveis containers ava-cli travados
echo                       em background ou encerra a rede temporaria do Compose.
echo =========================================================
goto end

:ask
REM Execução Rápida NATIVA (Ignorando Docker para evitar travamentos no Windows WSL2)
echo [SISTEMA] Iniciando run CLI Nativo (Sem Docker)...
npx tsx cli/index.ts %*
goto end

:build
echo [SISTEMA] Reconstruindo a imagem ava-cli sem usar cache...
docker compose -f docker-compose.cli.yml build --no-cache
goto end

:stop
echo [SISTEMA] Removendo containers pendentes ou redes do ava-cli...
docker compose -f docker-compose.cli.yml down
goto end

:end
endlocal
