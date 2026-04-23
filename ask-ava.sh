#!/usr/bin/env sh
docker-compose -f docker-compose.cli.yml run --rm ava-cli npx tsx cli/index.ts ask "$*"
