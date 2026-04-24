@echo off
setlocal

set "OLLAMA_PROBE_URL=%OLLAMA_BASE_URL%"
if "%OLLAMA_PROBE_URL%"=="" set "OLLAMA_PROBE_URL=http://localhost:11434"
if "%ASK_AVA_OLLAMA_TIMEOUT_MS%"=="" set "ASK_AVA_OLLAMA_TIMEOUT_MS=300000"

powershell -NoProfile -Command "$u='%OLLAMA_PROBE_URL%'; try { $r=Invoke-WebRequest -UseBasicParsing -Uri ($u.TrimEnd('/') + '/api/tags') -TimeoutSec 4; if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { exit 0 } else { exit 1 } } catch { exit 1 }"
if not %errorlevel%==0 goto :fallback

docker compose -f docker-compose.cli.yml run --rm --no-deps -e OLLAMA_CHAT_TIMEOUT_MS=%ASK_AVA_OLLAMA_TIMEOUT_MS% -e OLLAMA_TIMEOUT_MS=%ASK_AVA_OLLAMA_TIMEOUT_MS% ava-cli-runtime ask %*
if %errorlevel%==0 goto :eof

echo [ask-ava] Ollama padrao falhou. Tentando modelo local mais leve (llama3.2:latest)...
docker compose -f docker-compose.cli.yml run --rm --no-deps -e OLLAMA_CHAT_TIMEOUT_MS=180000 -e OLLAMA_TIMEOUT_MS=180000 ava-cli-runtime ask %* --provider ollama --model llama3.2:latest
if %errorlevel%==0 goto :eof

:fallback
echo [ask-ava] Falha no provider padrao. Tentando fallback com Gemini...
docker compose -f docker-compose.cli.yml run --rm --no-deps ava-cli-runtime ask %* --provider gemini
exit /b %errorlevel%
