# AGENT_LOOP

## Estados do ciclo

`INTENT_PARSE -> PLAN -> GUARD_VALIDATE -> DRY_RUN -> CONFIRM -> EXECUTE -> UPDATE_DB_RAG -> FEEDBACK`

Implementacao: `server/agents/agent-loop.ts`

## Regras de seguranca

- Anti-loop:
  - maximo de `12` tool calls por ciclo (configuravel)
  - aborta em repeticao de batch de intents/tool calls
- Human-in-the-loop:
  - middleware `requireConfirmation()` para risco medio/alto
- Dry-run:
  - reforcado via `evaluateToolExecution()` (Tool Registry)

## Integracao com contexto

Antes do planejamento:

- carrega `userSettings`
- consulta `memoryEntries` por palavras-chave
- enriquece prompt com `query + context.memory + context.preferences`

Depois da execucao:

- grava `audit_logs` (ciclo do agente)
- grava `memoryEntries` de contexto

## Integracao no CLI

- `cli/index.ts` suporta modo novo via `AVA_AGENT_LOOP_V2=true`.
- Sem flag, loop legado permanece ativo para compatibilidade.
