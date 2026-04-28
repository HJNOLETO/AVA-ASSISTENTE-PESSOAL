# ARCHITECTURE

## Fluxo macro (ASCII)

```text
CLI/Telegram/Web
      |
      v
  Agent Loop V2 (feature flag)
  INTENT_PARSE -> PLAN -> GUARD_VALIDATE -> DRY_RUN -> CONFIRM -> EXECUTE -> UPDATE_DB_RAG -> FEEDBACK
      |                                  |
      |                                  +--> Tool Registry (config/tools.json + Zod)
      |                                              |
      |                                              +--> Audit JSONL (data/tool-registry-audit.jsonl)
      v
RAG Retriever Patch
query + memory + preferences
      |
      +--> vector search (minScore dinamico)
      +--> fallback keyword (explicito)
      +--> truncateSmart (contexto seguro)
      |
      v
LLM prompt final + resposta
      |
      v
SQLite/Drizzle (audit_logs, memoryEntries, systemLogs)
```

## Fluxo legal consolidado (Ingest -> RAG -> Agent Loop -> Audit)

```text
ava ingest [path]
   |
   +--> server/tools/ingest_ops.ts
           |- valida markdown (# Titulo, >=500 chars)
           |- dedup SHA-256 (externalId)
           |- chunking hierarquico legal ou smartChunk
           |- embedding Ollama (nomic-embed-text)
           |- persistencia documents + documentChunks
           |- audit JSONL (data/ingest-audit.jsonl)
           |- move arquivo para processed/failed

ava legal ask "..."
   |
   +--> server/rag/retriever-legal.ts (estende retriever-patch)
   +--> prompt juridico restritivo + chunks
   +--> citation-validator (<0.6 => bloqueio)
   +--> audit_logs + resposta final
```

## Componentes

- `server/tool-registry/*`: loader, tipos, guard e auditoria JSONL.
- `server/rag/retriever-patch.ts`: retrieval corrigido e tunavel.
- `server/rag/metrics.ts`: latencia/hit-rate/fallback em `systemLogs`.
- `server/agents/agent-loop.ts`: pipeline formal do agente com anti-loop e confirmacao humana.
- `cli/index.ts`: integracao opcional com `AVA_AGENT_LOOP_V2=true`.

## Decisoes tecnicas

- Nao quebra de compatibilidade: feature flags e fallback legado mantidos.
- Validacao estrita com Zod no registro dinamico.
- Politica de seguranca: risco medio/alto exige dry-run; confirmacao humana mediada no loop.
