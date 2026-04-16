@echo off
REM Script para iniciar TODO o servidor (Vite + Backend)
REM Clique duplo para executar

setlocal enabledelayedexpansion

REM Executar script PowerShell
powershell -NoExit -ExecutionPolicy Bypass -File "scripts\start-server.ps1"

cd /d "%cd%"
pnpm dev

pause

