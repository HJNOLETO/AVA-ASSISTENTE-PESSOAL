# TOOLS_REGISTRY

## Arquivo de configuracao

- Caminho: `config/tools.json`
- Campos por tool:
  - `name`
  - `description`
  - `risk_level` (`low|medium|high`)
  - `requires_confirmation`
  - `schema_json` (JSON Schema exposto ao LLM)
  - `schema_zod` (documentacao do schema tipado)
  - `dry_run_cmd`
  - `exec_fn`

## Validacao e carga

- Loader: `server/tool-registry/loader.ts`
- Schema Zod: `server/tool-registry/types.ts`
- Export para function-calling: `getRegistryAsTools()`

## Guard e auditoria

- Guard: `server/tool-registry/guard.ts`
- Auditoria JSONL: `data/tool-registry-audit.jsonl`
- Regras aplicadas:
  - risco `medium/high` exige `dry_run=true`
  - `requires_confirmation=true` exige confirmacao explicita

## Feature flags

- `AVA_TOOL_REGISTRY_DYNAMIC=true`: ativa tools dinamicas no `getAvailableTools()`.
- fallback automatico para tools legadas quando config estiver invalida/vazia.

## Como adicionar nova tool

1. Adicionar item em `config/tools.json`.
2. Definir `schema_json` valido.
3. Configurar `risk_level` e `requires_confirmation`.
4. (Opcional) mapear handler no CLI/servidor.
5. Rodar testes: `pnpm test`.
