@echo off
REM Menu simplificado - Abre PowerShell com opcoes basicas

setlocal enabledelayedexpansion

:menu
cls
echo.
echo [MENU PRINCIPAL - AVA Assistant v3.1]
echo.
echo Opcoes:
echo  [1] Limpar ambiente
echo  [2] Verificar servidores ativos
echo  [3] Iniciar dev server
echo  [4] Build + Producao
echo  [5] Reset completo
echo  [6] Parar todos os servidores
echo  [7] Iniciar TODOS os servidores
echo  [0] Sair
echo.
set /p choice="Digite a opcao: "

if "%choice%"=="1" goto clean
if "%choice%"=="2" goto check
if "%choice%"=="3" goto dev
if "%choice%"=="4" goto prod
if "%choice%"=="5" goto reset
if "%choice%"=="6" goto stop
if "%choice%"=="7" goto all
if "%choice%"=="0" goto exit

echo Opcao invalida!
pause
goto menu

:clean
cls
echo.
echo [1] Limpando ambiente...
powershell -ExecutionPolicy Bypass -Command "cd '%cd%'; .\scripts\clean.ps1"
echo.
pause
goto menu

:check
cls
echo.
echo [2] Verificando servidores...
powershell -ExecutionPolicy Bypass -Command "cd '%cd%'; Get-Process node -ErrorAction SilentlyContinue | Format-Table; pause"
goto menu

:dev
cls
echo.
echo [3] Iniciando dev server...
powershell -ExecutionPolicy Bypass -Command "cd '%cd%'; pnpm dev"
goto menu

:prod
cls
echo.
echo [4] Build + Producao...
powershell -ExecutionPolicy Bypass -Command "cd '%cd%'; pnpm build"
echo.
pause
goto menu

:reset
cls
echo.
echo [5] Reset completo...
powershell -ExecutionPolicy Bypass -Command "cd '%cd%'; .\scripts\clean.ps1; pnpm dev"
goto menu

:stop
cls
echo.
echo [6] Parando servidores...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM powershell.exe 2>nul
echo Concluido!
echo.
pause
goto menu

:all
cls
echo.
echo [7] Iniciando TODOS os servidores...
echo.
call start-all-servers.bat
echo.
echo [SERVIDOR FOI PARADO]
pause
goto menu

:exit
cls
echo Ate logo!
timeout /t 2 /nobreak
exit /b 0
