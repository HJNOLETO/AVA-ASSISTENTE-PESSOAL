#!/usr/bin/env sh

OLLAMA_PROBE_URL="${OLLAMA_BASE_URL:-http://localhost:11434}"
ASK_AVA_OLLAMA_TIMEOUT_MS="${ASK_AVA_OLLAMA_TIMEOUT_MS:-300000}"

probe_ollama() {
  curl --silent --show-error --max-time 4 --output /dev/null "${OLLAMA_PROBE_URL%/}/api/tags"
}

if probe_ollama; then
  docker compose -f docker-compose.cli.yml run --rm --no-deps \
    -e OLLAMA_CHAT_TIMEOUT_MS="$ASK_AVA_OLLAMA_TIMEOUT_MS" \
    -e OLLAMA_TIMEOUT_MS="$ASK_AVA_OLLAMA_TIMEOUT_MS" \
    ava-cli-runtime ask "$@"
  status=$?
  if [ "$status" -eq 0 ]; then
    exit 0
  fi

  echo "[ask-ava] Ollama padrao falhou. Tentando modelo local mais leve (llama3.2:latest)..."
  docker compose -f docker-compose.cli.yml run --rm --no-deps \
    -e OLLAMA_CHAT_TIMEOUT_MS=180000 \
    -e OLLAMA_TIMEOUT_MS=180000 \
    ava-cli-runtime ask "$@" --provider ollama --model llama3.2:latest
  status=$?
  if [ "$status" -eq 0 ]; then
    exit 0
  fi
fi

echo "[ask-ava] Falha no provider padrao. Tentando fallback com Gemini..."
docker compose -f docker-compose.cli.yml run --rm --no-deps ava-cli-runtime ask "$@" --provider gemini
