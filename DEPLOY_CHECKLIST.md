# DEPLOY_CHECKLIST

## Flags obrigatorias

- `AVA_TOOL_REGISTRY_DYNAMIC=true`
- `AVA_AGENT_LOOP_V2=true`
- `AVA_LEGAL_RAG_ENABLED=true`
- `AVA_MEMORY_BLOCK_SENSITIVE=true`

## .env.example

Veja `.env.example` na raiz. Campos minimos: banco SQLite, provider Ollama e paths de ingestao.

## Migracao Drizzle

Opcao 1 (recomendada):

```bash
pnpm db:push
```

Opcao 2 (manual):

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

## Troubleshooting

- Ollama indisponivel: validar `OLLAMA_BASE_URL` e `ollama list`.
- Embedding lento: reduzir carga de ingestao por lote e manter fila sequencial.
- SQLite lock: manter WAL ativo e evitar execucoes concorrentes de escrita.
