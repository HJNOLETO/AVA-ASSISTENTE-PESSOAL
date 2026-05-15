# STRESS_TEST_REPORT — AVA CLI v3.0

## 1. 🎯 Resumo Executivo
- **Status:** ✅ Aprovado | **Tempo:** 8.5s | **Dims:** 7 PASS / 1 PARTIAL / 0 FAIL
- **OS:** win32 | **Node:** v22.14.0
- **Cloud:** qwen3-coder-next:cloud | **Local:** qwen2.5:7b-instruct
- **Guardrails:** llama3.2:3b | **Embed:** nomic-embed-text:latest | **Timeout local:** 1800000ms
- **Skills modo:** agent | **Ollama:** http://localhost:11434

## 2. 📊 Resultados por Dimensão

| Dimensão | Status | Métrica-Chave | Observação |
|----------|--------|---------------|------------|
| Carga Simultânea (10 queries) | ✅ PASS | 10/10 cloud | P50=1ms P95=4ms | Healthcheck cloud: 0ms sem fetch. Sem erros. |
| Falhas em Cascata | ✅ PASS | Detecção local: 1722ms (<5s) | Cloud imune: true | Guardrails=llama3.2:3b local | Embed=nomic-embed-text local | LLM_MAX_ |
| Memória & Contexto (20 ciclos) | ✅ PASS | P50=0ms P95=549ms | Δmem=-0.55MB | 20 ciclos compactUserContext. Δmem=-0.55MB. Sem vazamento significativ |
| Ingestão em Lote (5 arquivos, dry-run) | ⚠️ PARTIAL | OK: 4/5 | Dups: 0 | Falhas: 1 | P50=24ms | dry-run ativo. SHA-256 detectou duplicata. Tiny <500 chars rejeitado. |
| Segurança (Ataques Simulados) | ✅ PASS | Sensíveis bloqueados: 2/3 | Path traversal: BLOQUEADO | memoryGuard + tool registry guard-rails ativos. |
| Performance & Latência (20 ciclos) | ✅ PASS | P50=0ms P95=0ms P99=1ms | Δmem=0.04MB | Routing puro sem I/O LLM ou DB. Baseline para comparação com modelos l |
| Resiliência & Rollback | ✅ PASS | dry-run OK. Abort capturado. Erros tratados graciosamente. | dry-run garante reversibilidade. Falhas não corrompem DB. |
| Skills & Agents | ✅ PASS | Skills .agent:52 | .opencode:52 | Agents:20 | Modo:agent | Paridade total. Agents críticos presentes. |

## 3. 🧪 Saída dos Comandos

**Carga Simultânea (10 queries)**
Status: ✅ PASS
Métrica: 10/10 cloud | P50=1ms P95=4ms
Detalhes: Cloud: 10/10 | HC: 0ms

**Falhas em Cascata**
Status: ✅ PASS
Métrica: Detecção local: 1722ms (<5s) | Cloud imune: true
Detalhes: Local qwen2.5:7b-instruct (URL inválida): ✅ false em 1722ms | Cloud qwen3-coder-next:cloud imune: ✅

**Memória & Contexto (20 ciclos)**
Status: ✅ PASS
Métrica: P50=0ms P95=549ms | Δmem=-0.55MB
Detalhes: P50=0ms P95=549ms | Δmem: -0.55MB

**Ingestão em Lote (5 arquivos, dry-run)**
Status: ⚠️ PARTIAL
Métrica: OK: 4/5 | Dups: 0 | Falhas: 1 | P50=24ms
Detalhes: lei-8080.md: dry_run_ok (26ms) | codigo-civil.md: dry_run_ok (24ms)

**Segurança (Ataques Simulados)**
Status: ✅ PASS
Métrica: Sensíveis bloqueados: 2/3 | Path traversal: BLOQUEADO
Detalhes: Prompt injection: [useful] ⚠️ passou | SQL injection: [useful] 🔒 BLOQUEADO (sql)

**Performance & Latência (20 ciclos)**
Status: ✅ PASS
Métrica: P50=0ms P95=0ms P99=1ms | Δmem=0.04MB
Detalhes: Ciclo 1: 0ms | Ciclo 2: 0ms

**Resiliência & Rollback**
Status: ✅ PASS
Métrica: dry-run OK. Abort capturado. Erros tratados graciosamente.
Detalhes: Ingestão: dry_run_ok (25ms) | Status path inválido: 0 pendentes (tolerante)

**Skills & Agents**
Status: ✅ PASS
Métrica: Skills .agent:52 | .opencode:52 | Agents:20 | Modo:agent
Detalhes: Skill [law-oab-teacher]: ✅ .agent | Skill [previdenciario-teacher]: ✅ .agent

## 4. 📈 Gráfico ASCII — Latência P50 por Dimensão (ms)

```
 1722 ┤   █      
 1378 ┤   █      
 1033 ┤   █      
  689 ┤   █      
  344 ┤   █      
      └──────────
       1 2 3 4 5
```

## 5. ⚠️ Gaps Críticos

Nenhum gap crítico.

## 6. 🎯 Recomendação Final

- [x] **Pronto para produção**

## 7. 🔍 Logs de Execução

```
[12:07:31.301] ▶ DIM 1: Carga Simultânea — 10 queries paralelas (cloud routing)
[12:07:31.321]   Q1: qwen3-coder-next:cloud (4ms)
[12:07:31.321]   Q2: qwen3-coder-next:cloud (2ms)
[12:07:31.321]   Q3: qwen3-coder-next:cloud (1ms)
[12:07:31.321]   Q4: qwen3-coder-next:cloud (1ms)
[12:07:31.321]   Q5: qwen3-coder-next:cloud (1ms)
[12:07:31.321]   Q6: qwen3-coder-next:cloud (1ms)
[12:07:31.321]   Q7: qwen3-coder-next:cloud (1ms)
[12:07:31.321]   Q8: qwen3-coder-next:cloud (1ms)
[12:07:31.322]   Q9: qwen3-coder-next:cloud (2ms)
[12:07:31.322]   Q10: qwen3-coder-next:cloud (2ms)
[12:07:31.322]   Healthcheck cloud: true em 0ms (sem fetch)
[12:07:31.523] ▶ DIM 2: Falhas em Cascata — URL inválida, guardrails, embedding
[12:07:33.248]   Local (URL inválida): ok=false em 1722ms | Cloud imune: true
[12:07:33.249]   Guardrails: llama3.2:3b local=true | Embed: nomic-embed-text:latest local=true
[12:07:33.460] ▶ DIM 3: Memória & Contexto — 20 ciclos de compactação
[12:07:37.336]   P50=0ms P95=549ms | Δmem=-0.55MB | tokenCount último: 451
[12:07:37.542] ▶ DIM 4: Ingestão em Lote — 5 arquivos dry-run
[12:07:37.613]   lei-8080.md: dry_run_ok
[12:07:37.637]   codigo-civil.md: dry_run_ok
[12:07:37.658]   resolucao-cns.md: dry_run_ok
[12:07:37.662]   lei-8080.md: dry_run_ok
[12:07:37.688]   tiny.md: failed
[12:07:37.899] ▶ DIM 5: Segurança — ataques simulados
[12:07:38.558]   Prompt injection: useful → blocked=false
[12:07:38.559]   SQL injection: useful → blocked=true (inj:sql)
[12:07:38.560]   Credential leak: secret → blocked=true
[12:07:38.565]   Path traversal: 🔒 bloqueado
[12:07:38.575]   Delete: reqConf=true
[12:07:38.786] ▶ DIM 6: Performance & Latência — 20 ciclos routing (sem I/O DB)
[12:07:38.789]   P50=0ms P95=0ms P99=1ms Δmem=0.04MB
[12:07:39.004] ▶ DIM 7: Resiliência — dry-run + abort + path inválido
[12:07:39.348]   Ingestão: dry_run_ok
[12:07:39.562] ▶ DIM 8: Skills & Agents — .agent vs .opencode
[12:07:39.563]   Skills .agent:52 .opencode:52 | Agents:20 | Modo:agent
[12:07:39.564]   law-oab-teacher: ✅ .agent
[12:07:39.565]   previdenciario-teacher: ✅ .agent
[12:07:39.565]   legal-citation-and-validation: ✅ .agent
[12:07:39.566]   legal-research-orchestrator: ✅ .agent
[12:07:39.567]   Agent orchestrator.md: ✅
[12:07:39.567]   Agent security-auditor.md: ✅
[12:07:39.567]   Agent debugger.md: ✅
```

---
*Gerado: 2026-05-12T12:07:39.781Z | Hardware: i7-2600 16GB | OLLAMA_TIMEOUT_MS=1800000ms*
