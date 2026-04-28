# TOOLS_REGISTRY

## Arquivo de configuracao

- Caminho: `config/tools.json`
- Campos por tool:
  - `name`
  - `description`
  - `risk_level` (`low|medium|high`)
  - `requires_confirmation`
  - `schema_zod` (`"z.object({ ... })"` em string, obrigatorio)
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
2. Definir `schema_zod` valido em formato string.
3. Configurar `risk_level` e `requires_confirmation`.
4. (Opcional) mapear handler no CLI/servidor.
5. Rodar testes: `pnpm test`.

## Novas tools (consolidacao final)

- `ingest_ops`
  - objetivo: ingestao local de `.md` com deduplicacao SHA-256, fila de embeddings e auditoria.
  - schema_zod: `z.object({ action: z.enum(['run','status']), path: z.string().optional(), dry_run: z.boolean().optional() })`
  - risco: `low` (dry-run opcional).

- `legal_rag_ops`
  - objetivo: orquestracao de consulta juridica e fontes legais.
  - schema_zod: `z.object({ action: z.enum(['ingest','ask','sources']), path: z.string().optional(), query: z.string().optional(), dry_run: z.boolean().optional() })`
  - risco: `medium` (exige confirmacao e log de auditoria).
