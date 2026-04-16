@echo off
REM Script para reiniciar RAPIDO (Kill + Restart)
REM Mata tudo e reinicia todos os servidores

setlocal enabledelayedexpansion

cls
echo [QUICK RESTART - AVA Assistant]
echo.

echo Etapa 1: Finalizando servidores atuais...
taskkill /F /IM node.exe 2>nul
taskkill /F /IM pwsh.exe 2>nul
taskkill /F /IM powershell.exe 2>nul
echo [OK] Concluido

echo.
echo Etapa 2: Aguardando 2 segundos...
timeout /t 2 /nobreak

echo.
echo Etapa 3: Iniciando novos servidores...
call start-all-servers.bat
