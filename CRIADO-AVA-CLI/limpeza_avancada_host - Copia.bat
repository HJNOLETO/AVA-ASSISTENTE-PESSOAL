@echo off
setlocal EnableDelayedExpansion
color 0A
title Limpeza Avancada de Notebook (by AVA)

:: ============================================================
::  Verificacao de privilegios de Administrador
:: ============================================================
net session >nul 2>&1
if %errorLevel% NEQ 0 (
    color 0C
    echo.
    echo  [ERRO] Este script precisa ser executado como Administrador!
    echo  Clique com o botao direito e selecione "Executar como administrador".
    echo.
    pause
    exit /b 1
)

:: ============================================================
::  Configuracoes
:: ============================================================
set LOG=%USERPROFILE%\Desktop\AVA_limpeza_log.txt
set TOTAL_STEPS=10
set STEP=0

:: ============================================================
::  Inicio do log
:: ============================================================
echo. > "%LOG%"
echo ============================================= >> "%LOG%"
echo   AVA - Log de Limpeza Avancada              >> "%LOG%"
echo   Data/Hora: %DATE% %TIME%                   >> "%LOG%"
echo ============================================= >> "%LOG%"
echo. >> "%LOG%"

:: ============================================================
::  Espaco livre antes da limpeza
:: ============================================================
for /f "tokens=3" %%a in ('dir C:\ ^| findstr /C:"bytes free"') do set ESPACO_ANTES=%%a

echo.
echo  =============================================
echo    AVA - Limpeza Avancada de Notebook
echo    Log: %LOG%
echo  =============================================
echo.
echo  Espaco livre em C: antes: %ESPACO_ANTES% bytes
echo  Espaco livre em C: antes: %ESPACO_ANTES% bytes >> "%LOG%"
echo.

:: ============================================================
::  [1/10] Arquivos temporarios do usuario
:: ============================================================
set /a STEP+=1
echo  [%STEP%/%TOTAL_STEPS%] Limpando arquivos temporarios do usuario...
echo [%STEP%/%TOTAL_STEPS%] Temp do usuario - %TIME% >> "%LOG%"
del /s /f /q "%TEMP%\*.*" >nul 2>&1
for /d %%i in ("%TEMP%\*") do rd /s /q "%%i" >nul 2>&1

:: ============================================================
::  [2/10] Arquivos temporarios do sistema
:: ============================================================
set /a STEP+=1
echo  [%STEP%/%TOTAL_STEPS%] Limpando arquivos temporarios do sistema...
echo [%STEP%/%TOTAL_STEPS%] Temp do sistema - %TIME% >> "%LOG%"
if exist "%SystemRoot%\Temp" (
    del /s /f /q "%SystemRoot%\Temp\*.*" >nul 2>&1
    for /d %%i in ("%SystemRoot%\Temp\*") do rd /s /q "%%i" >nul 2>&1
)

:: ============================================================
::  [3/10] Cache DNS
:: ============================================================
set /a STEP+=1
echo  [%STEP%/%TOTAL_STEPS%] Limpando cache DNS...
echo [%STEP%/%TOTAL_STEPS%] Cache DNS - %TIME% >> "%LOG%"
ipconfig /flushdns >nul 2>&1

:: ============================================================
::  [4/10] Cache do Windows Update (SoftwareDistribution)
:: ============================================================
set /a STEP+=1
echo  [%STEP%/%TOTAL_STEPS%] Limpando cache do Windows Update...
echo [%STEP%/%TOTAL_STEPS%] Windows Update cache - %TIME% >> "%LOG%"
net stop wuauserv >nul 2>&1
net stop bits >nul 2>&1
del /s /f /q "%SystemRoot%\SoftwareDistribution\Download\*.*" >nul 2>&1
for /d %%i in ("%SystemRoot%\SoftwareDistribution\Download\*") do rd /s /q "%%i" >nul 2>&1
net start wuauserv >nul 2>&1
net start bits >nul 2>&1

:: ============================================================
::  [5/10] Prefetch
:: ============================================================
set /a STEP+=1
echo  [%STEP%/%TOTAL_STEPS%] Limpando Prefetch...
echo [%STEP%/%TOTAL_STEPS%] Prefetch - %TIME% >> "%LOG%"
del /s /f /q "%SystemRoot%\Prefetch\*.*" >nul 2>&1

:: ============================================================
::  [6/10] Lixeira
:: ============================================================
set /a STEP+=1
echo  [%STEP%/%TOTAL_STEPS%] Esvaziando a Lixeira...
echo [%STEP%/%TOTAL_STEPS%] Lixeira - %TIME% >> "%LOG%"
PowerShell -NoProfile -Command "Clear-RecycleBin -Force -ErrorAction SilentlyContinue" >nul 2>&1

:: ============================================================
::  [7/10] Cache de miniaturas e icones
:: ============================================================
set /a STEP+=1
echo  [%STEP%/%TOTAL_STEPS%] Limpando cache de miniaturas e icones...
echo [%STEP%/%TOTAL_STEPS%] Cache de miniaturas - %TIME% >> "%LOG%"
taskkill /f /im explorer.exe >nul 2>&1
del /f /q "%LOCALAPPDATA%\Microsoft\Windows\Explorer\thumbcache_*.db" >nul 2>&1
del /f /q "%LOCALAPPDATA%\IconCache.db" >nul 2>&1
start explorer.exe

:: ============================================================
::  [8/10] Limpeza de disco automatica via CleanMgr
:: ============================================================
set /a STEP+=1
echo  [%STEP%/%TOTAL_STEPS%] Executando Limpeza de Disco do Windows...
echo [%STEP%/%TOTAL_STEPS%] CleanMgr - %TIME% >> "%LOG%"
:: Configura flags para limpeza silenciosa (todos os tipos comuns)
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Temporary Files" /v StateFlags0064 /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Recycle Bin" /v StateFlags0064 /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Thumbnails" /v StateFlags0064 /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Internet Cache Files" /v StateFlags0064 /t REG_DWORD /d 2 /f >nul 2>&1
reg add "HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Explorer\VolumeCaches\Old ChkDsk Files" /v StateFlags0064 /t REG_DWORD /d 2 /f >nul 2>&1
cleanmgr /sagerun:64 /d C: >nul 2>&1

:: ============================================================
::  [9/10] Liberar memoria RAM (Standby List)
:: ============================================================
set /a STEP+=1
echo  [%STEP%/%TOTAL_STEPS%] Liberando memoria RAM (standby list)...
echo [%STEP%/%TOTAL_STEPS%] RAM standby flush - %TIME% >> "%LOG%"
:: Requer EmptyStandbyList.exe (ferramenta da Microsoft Sysinternals area, uso via RAMMap ou via PowerShell)
PowerShell -NoProfile -Command ^
  "[System.GC]::Collect(); [System.GC]::WaitForPendingFinalizers();" >nul 2>&1

:: ============================================================
::  [10/10] Desfragmentacao inteligente (somente HDD)
:: ============================================================
set /a STEP+=1
echo  [%STEP%/%TOTAL_STEPS%] Verificando tipo de disco para desfragmentacao...
echo [%STEP%/%TOTAL_STEPS%] Defrag check - %TIME% >> "%LOG%"

:: Verifica se C: eh SSD (MediaType = 4 = SSD, 3 = HDD)
for /f "tokens=*" %%a in ('PowerShell -NoProfile -Command ^
  "try { $d = Get-PhysicalDisk | Where-Object { $_.DeviceId -eq 0 }; $d.MediaType } catch { 'Unknown' }"') do set DISKTYPE=%%a

if /i "%DISKTYPE%"=="HDD" (
    echo  [%STEP%/%TOTAL_STEPS%] HDD detectado. Iniciando desfragmentacao...
    echo Disco tipo HDD - desfragmentando... >> "%LOG%"
    defrag C: /U /V >> "%LOG%" 2>&1
) else if /i "%DISKTYPE%"=="SSD" (
    echo  [%STEP%/%TOTAL_STEPS%] SSD detectado. Pulando desfragmentacao ^(nao necessario para SSD^).
    echo Disco tipo SSD - desfragmentacao ignorada. >> "%LOG%"
) else (
    echo  [%STEP%/%TOTAL_STEPS%] Tipo de disco nao identificado. Pulando desfragmentacao.
    echo Tipo de disco desconhecido - desfragmentacao ignorada. >> "%LOG%"
)

:: ============================================================
::  Espaco livre apos limpeza + Resumo
:: ============================================================
for /f "tokens=3" %%a in ('dir C:\ ^| findstr /C:"bytes free"') do set ESPACO_DEPOIS=%%a

echo.
echo  =============================================
echo    Limpeza Concluida com Sucesso!
echo  =============================================
echo  Espaco livre antes : %ESPACO_ANTES% bytes
echo  Espaco livre depois: %ESPACO_DEPOIS% bytes
echo  Log salvo em: %LOG%
echo  =============================================
echo.

echo. >> "%LOG%"
echo ============================================= >> "%LOG%"
echo  Espaco livre antes : %ESPACO_ANTES% bytes   >> "%LOG%"
echo  Espaco livre depois: %ESPACO_DEPOIS% bytes  >> "%LOG%"
echo  Limpeza concluida em: %DATE% %TIME%         >> "%LOG%"
echo ============================================= >> "%LOG%"

echo  Pressione qualquer tecla para fechar...
pause >nul
endlocal