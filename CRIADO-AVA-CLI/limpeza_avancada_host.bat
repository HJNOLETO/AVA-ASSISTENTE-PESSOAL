@echo off
color 0A
title Limpeza Avançada de Host (by AVA)

echo.
echo ===========================================
echo   Iniciando Limpeza Avançada do Sistema
echo ===========================================
echo.

echo [1/5] Limpando arquivos temporarios do usuario...
del /s /q "%TEMP%\*.*" >nul 2>&1
if exist "%SystemRoot%\\Temp" (
    echo [2/5] Limpando arquivos temporarios do sistema...
    del /s /q "%SystemRoot%\\Temp\\*.*" >nul 2>&1
)

echo.
echo [3/5] Limpando cache DNS...
ipconfig /flushdns >nul
echo.

echo [4/5] Limpando cache de atualizacao do Windows (SoftwareDistribution)...
net stop wuauserv >nul
del /s /q "%SystemRoot%\\SoftwareDistribution\\Download\\*.*" >nul 2>&1
net start wuauserv >nul
echo.

echo [5/5] Removendo arquivos temporarios de prefetch (pode impactar levemente a inicializacao apos a limpeza)...
del /s /q "%SystemRoot%\\Prefetch\\*.*" >nul 2>&1
echo.

echo ===========================================
echo   Limpeza Avançada Concluida!
echo   Revise a saida para quaisquer erros.
echo ===========================================
echo.
pause