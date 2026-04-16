@echo off
REM Script de Emergencia - Para TUDO
REM Use se os servidores travam ou derram

setlocal enabledelayedexpansion

cls
echo [PARADA DE EMERGENCIA - AVA Assistant]
echo.

echo [AVISO] Finalizando TODOS os processos...
echo.

REM Matar Node.js
echo [1/3] Matando processos Node.js...
taskkill /F /IM node.exe 2>nul
if %ERRORLEVEL% EQU 0 (
    echo   [OK] Processos Node.js finalizados
) else (
    echo   [INFO] Nenhum processo Node.js encontrado
)

echo.

REM Limpar portas
echo [2/3] Liberando portas...
for %%P in (5173,5174,3000,3001,8080) do (
    for /f "tokens=5" %%A in ('netstat -ano ^| findstr :%%P') do (
        taskkill /F /PID %%A 2>nul
        echo   [OK] Porta %%P liberada
    )
)

echo.

REM Fechar abas PowerShell
echo [3/3] Fechando abas PowerShell...
taskkill /F /IM pwsh.exe 2>nul
taskkill /F /IM powershell.exe 2>nul
echo   [OK] Abas fechadas

echo.
echo [PARADA DE EMERGENCIA CONCLUIDA]
echo.
echo Proximos passos:
echo    - Use: start-all-servers.bat (para reiniciar)
echo    - Use: .\scripts\menu.ps1 (para menu completo)
echo.

pause
