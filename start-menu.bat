@echo off
REM Atalho para abrir o menu do AVA Assistant
REM Clique duplo para executar

setlocal enabledelayedexpansion

REM Obter diretório do script
for %%I in ("%~dp0.") do set "scriptDir=%%~fI"

REM Verificar se estamos no diretório correto
if not exist "scripts\menu.ps1" (
    echo Erro: arquivo scripts\menu.ps1 nao encontrado
    echo Execute este arquivo do diretorio raiz do projeto
    pause
    exit /b 1
)

REM Abrir PowerShell 5.1 com o script de menu
powershell -NoExit -ExecutionPolicy Bypass -File "scripts\menu.ps1"
