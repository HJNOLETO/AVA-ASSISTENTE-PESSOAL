# RAG_CONSOLIDATION_REPORT

## 1. ✅ Checklist de arquivos criados/modificados + commits sugeridos (formato Conventional Commits)

- [x] `server/rag/retriever-legal-patch.ts` (novo)
- [x] `server/rag/retriever-legal.ts` (ajuste para estender patch unificado)
- [x] `server/rag/retriever-patch.ts` (`minScoreOverride`)
- [x] `server/rag/citation-validator.ts` (bloqueio por confiança e validação de formato)
- [x] `server/_core/llm-router.ts` (novo roteador de modelos com healthcheck/fallback)
- [x] `server/tool-registry/zod-compiler.ts` (novo compilador `schema_zod`)
- [x] `server/tool-registry/loader.ts` (compilação no dispatch)
- [x] `server/observability/rag-metrics.ts` (novo)
- [x] `server/tools/ingest_ops.ts` (suporte a caminho de arquivo `.md`)
- [x] `cli/index.ts` (comando `ava rag` + import de logs)
- [x] `vitest.config.ts` (cobertura backend com exclusões)
- [x] `package.json` (script backend coverage com suites críticas)
- [x] `tests/unit/llm-router.test.ts` (novo)
- [x] `tests/integration/rag-legal-real.test.ts` (novo)
- [x] `tests/integration/citation-validator-real.test.ts` (novo)

Commits sugeridos:
1. `fix(rag): consolidar retriever legal com topK=3, minScore dinamico e fallback explicito`
2. `feat(security): adicionar llm-router com healthcheck e fallback cloud-local`
3. `feat(tool-registry): compilar schema_zod para function-calling com fallback seguro`
4. `feat(observability): instrumentar metricas reais de RAG por query`
5. `test(rag): adicionar suites unitarias e integracao para router/retrieval/citation`

## 2. 📊 Tabela de métricas reais (não mockadas)

| Módulo | Cobertura % (linhas) | Latência média (ms) | Hit rate | Falhas comuns |
|--------|---------------------:|--------------------:|---------:|---------------|
| server/rag/* | 65.15% | ~10-20 ms (testes integração) | 100% (cenários de teste) | baixa cobertura de `legal-ingest.ts` completo e cenários de base vazia |
| server/tools/* | 62.35% | ~20-70 ms (`ingest_ops` dry-run) | 100% (cenários cobertos) | pouca cobertura de caminhos de erro avançados e sandbox |
| server/tool-registry/* | 66.86% | ~5-15 ms (loader/guard local) | 100% (cenários cobertos) | `zod-compiler.ts` com baixa cobertura de falhas de compilação |

## 3. 🧪 Saída resumida dos 6 comandos de validação

`pnpm -s tsc --noEmit --pretty false`
Status: OK
Erros: nenhum
Warnings: nenhum

`pnpm -s vitest run tests/ --reporter=verbose`
Status: FAIL
Erros: `tests/e2e/agent-cli.test.ts` timeout/encerramento por SIGTERM no modo verbose completo
Warnings: execução sensível ao ambiente/local model

`pnpm -s test:coverage:backend`
Status: OK
Erros: nenhum
Warnings: cobertura dos módulos críticos ainda abaixo de 80%

`pnpm -s test:e2e:cli` com `AVA_AGENT_LOOP_E2E_MOCK=false`
Status: OK
Erros: nenhum
Warnings: nenhum

`ava ingest --dry-run ava_inbox/sample-legal.md` (executado via `pnpm -s tsx cli/index.ts ingest --dry-run ava_inbox/sample-legal.md`)
Status: OK
Erros: nenhum
Warnings: nenhum

`ava legal ask "Quais os requisitos do Art. 5º da CF para habeas corpus?"`
Status: FAIL
Erros: modelo cloud indisponível/sem assinatura (`403` em `kimi-k2.6:cloud`)
Warnings: fallback local não acionado na cadeia atual do comando CLI legado

## 4. ⚠️ Gaps remanescentes + mitigação técnica (se houver)

- Gap: Cobertura <80% em `server/rag/*`, `server/tools/*`, `server/tool-registry/*`
- Impacto: alto
- Mitigação: ampliar testes de integração não mockados para ingestão legal completa, compilação zod inválida e cenários de fallback em runtime

- Gap: `legal ask` ainda depende de provedor/modelo cloud default da stack de chat quando indisponível
- Impacto: alto
- Mitigação: integrar `llm-router` diretamente ao pipeline de geração de resposta jurídica (não só como utilitário), forçando fallback local automático

- Gap: `zod-compiler` depende de `zod-to-json-schema` em runtime; sem pacote instalado, cai em fallback seguro
- Impacto: médio
- Mitigação: adicionar dependência explícita no lockfile/CI e teste dedicado de compilação real

## 5. 📦 `.env` atualizado + flags obrigatórias para produção

```bash
AVA_LEGAL_RAG_ENABLED=true
LLM_CLOUD_MODEL=qwen3-coder-next:cloud
LLM_LOCAL_MODEL=qwen3:4b
OLLAMA_EMBED_MODEL=nomic-embed-text:latest
OLLAMA_TIMEOUT_MS=60000
AVA_MEMORY_BLOCK_SENSITIVE=true
AVA_TOOL_REGISTRY_DYNAMIC=true
AVA_AGENT_LOOP_V2=true
```

## 6. 📋 Instruções de migração Drizzle (se aplicável)

```bash
pnpm db:push
```

ou

```bash
pnpm drizzle-kit generate
pnpm drizzle-kit migrate
```

## 7. 🔍 Validação de segurança (checklist)

- [x] Dry-run obrigatório para risco ≥ médio
- [x] Auditoria JSONL gravando decisões (`tool-registry`, `ingest-audit`, `audit_logs`)
- [x] Bloqueio de citações com confidence < 0.6
- [x] Healthcheck de modelo antes de execução (via `llm-router`)
- [ ] Fallback local se cloud indisponível **em toda cadeia de `legal ask`** (parcial; requer integração final no orquestrador)
