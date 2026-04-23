#!/bin/bash
# AVA CLI Wrapper Script para Linux / Mac / Git-Bash

COMMAND=$1

show_help() {
    echo ""
    echo "========================================================="
    echo "                  GERENCIADOR AVA CLI"
    echo "========================================================="
    echo "Uso: ./ava-cli.sh [comando] [argumentos...]"
    echo ""
    echo "Comandos Disponíveis:"
    echo "  ask \"mensagem\"      Envia uma mensagem pro CLI Autônomo no Docker."
    echo "                      (Ex: ./ava-cli.sh ask \"Liste meus arquivos\")"
    echo ""
    echo "  build               Reconstrói a imagem Docker do CLI do zero."
    echo ""
    echo "  stop                Derruba possiveis containers ava-cli travados"
    echo "                      em background ou encerra a rede do Compose."
    echo "========================================================="
    echo ""
}

case "$COMMAND" in
    ask)
        echo "[SISTEMA] Iniciando run CLI no Docker..."
        # Pula o primeiro argumento e passa os demais
        shift
        docker compose -f docker-compose.cli.yml run --rm ava-cli ask "$@"
        ;;
    build)
        echo "[SISTEMA] Reconstruindo a imagem ava-cli sem usar cache..."
        docker compose -f docker-compose.cli.yml build --no-cache
        ;;
    stop)
        echo "[SISTEMA] Removendo containers pendentes ou redes do ava-cli..."
        docker compose -f docker-compose.cli.yml down
        ;;
    *)
        show_help
        ;;
esac
