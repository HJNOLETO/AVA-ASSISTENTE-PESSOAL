@echo off
REM ================================================
REM AVA Assistant v3.1 - Menu Principal
REM Clique duplo para usar
REM ================================================

setlocal enabledelayedexpansion

:menu
cls
echo.
echo ================================================
echo  AVA ASSISTANT v3.1 - MENU PRINCIPAL
echo ================================================
echo.
echo Opcoes:
echo  [1] Limpar ambiente
echo  [2] Iniciar dev server (http://localhost:5173)
echo  [3] Parar todos os servidores
echo  [4] Verificar processos ativos
echo  [0] Sair
echo.
set /p choice="Escolha uma opcao: "

if "%choice%"=="1" goto clean
if "%choice%"=="2" goto start
if "%choice%"=="3" goto stop
if "%choice%"=="4" goto check
if "%choice%"=="0" goto exit

echo [ERRO] Opcao invalida!
pause
goto menu

:clean
cls
echo.
echo [LIMPANDO AMBIENTE]
echo.
powershell -ExecutionPolicy Bypass -Command "cd '%cd%\..\'; .\scripts\clean.ps1"
echo.
pause
goto menu

:start
cls
echo.
echo [INICIANDO SERVIDOR]
echo.
powershell -NoExit -ExecutionPolicy Bypass -File "%~dp0..\scripts\start-server.ps1"
goto menu

:stop
cls
echo.
echo [PARANDO SERVIDORES]
echo.
taskkill /F /IM node.exe 2>nul
taskkill /F /IM tsx.exe 2>nul
echo [OK] Servidores parados
pause
goto menu

:check
cls
echo.
echo [VERIFICANDO PROCESSOS]
echo.
powershell -ExecutionPolicy Bypass -Command "Get-Process node,tsx,powershell -ErrorAction SilentlyContinue | Format-Table Name, ID, CPU, Memory; pause"
goto menu

:exit
cls
echo Ate logo!
timeout /t 2 /nobreak
exit /b 0
