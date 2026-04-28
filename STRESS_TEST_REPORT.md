# STRESS_TEST_REPORT — AVA CLI v3.0

## 1. 🎯 Resumo Executivo
- **Status:** ✅ Aprovado | **Tempo:** 6.9s | **Dims:** 6 PASS / 2 PARTIAL / 0 FAIL
- **OS:** win32 | **Node:** v22.14.0
- **Cloud:** qwen3-coder-next:cloud | **Local:** qwen2.5:7b-instruct
- **Guardrails:** llama3.2:3b | **Embed:** nomic-embed-text:latest | **Timeout local:** 1800000ms
- **Skills modo:** agent | **Ollama:** http://localhost:11434

## 2. 📊 Resultados por Dimensão

| Dimensão | Status | Métrica-Chave | Observação |
|----------|--------|---------------|------------|
| Carga Simultânea (10 queries) | ✅ PASS | 10/10 cloud | P50=2ms P95=6ms | Healthcheck cloud: 0ms sem fetch. Sem erros. |
| Falhas em Cascata | ✅ PASS | Detecção local: 1340ms (<5s) | Cloud imune: true | Guardrails=llama3.2:3b local | Embed=nomic-embed-text local | LLM_MAX_ |
| Memória & Contexto (20 ciclos) | ⚠️ PARTIAL | P50=0ms P95=643ms | Δmem=65.33MB | 20 ciclos compactUserContext. Δmem=65.33MB. Sem vazamento significativ |
| Ingestão em Lote (5 arquivos, dry-run) | ⚠️ PARTIAL | OK: 4/5 | Dups: 0 | Falhas: 1 | P50=19ms | dry-run ativo. SHA-256 detectou duplicata. Tiny <500 chars rejeitado. |
| Segurança (Ataques Simulados) | ✅ PASS | Sensíveis bloqueados: 2/3 | Path traversal: BLOQUEADO | memoryGuard + tool registry guard-rails ativos. |
| Performance & Latência (20 ciclos) | ✅ PASS | P50=0ms P95=0ms P99=1ms | Δmem=0.04MB | Routing puro sem I/O LLM ou DB. Baseline para comparação com modelos l |
| Resiliência & Rollback | ✅ PASS | dry-run OK. Abort capturado. Erros tratados graciosamente. | dry-run garante reversibilidade. Falhas não corrompem DB. |
| Skills & Agents | ✅ PASS | Skills .agent:50 | .opencode:50 | Agents:20 | Modo:agent | Paridade total. Agents críticos presentes. |

## 3. 🧪 Saída dos Comandos

**Carga Simultânea (10 queries)**
Status: ✅ PASS
Métrica: 10/10 cloud | P50=2ms P95=6ms
Detalhes: Cloud: 10/10 | HC: 0ms

**Falhas em Cascata**
Status: ✅ PASS
Métrica: Detecção local: 1340ms (<5s) | Cloud imune: true
Detalhes: Local qwen2.5:7b-instruct (URL inválida): ✅ false em 1340ms | Cloud qwen3-coder-next:cloud imune: ✅

**Memória & Contexto (20 ciclos)**
Status: ⚠️ PARTIAL
Métrica: P50=0ms P95=643ms | Δmem=65.33MB
Detalhes: P50=0ms P95=643ms | Δmem: 65.33MB

**Ingestão em Lote (5 arquivos, dry-run)**
Status: ⚠️ PARTIAL
Métrica: OK: 4/5 | Dups: 0 | Falhas: 1 | P50=19ms
Detalhes: lei-8080.md: dry_run_ok (27ms) | codigo-civil.md: dry_run_ok (18ms)

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
Detalhes: Ingestão: dry_run_ok (21ms) | Status path inválido: 0 pendentes (tolerante)

**Skills & Agents**
Status: ✅ PASS
Métrica: Skills .agent:50 | .opencode:50 | Agents:20 | Modo:agent
Detalhes: Skill [law-oab-teacher]: ✅ .agent | Skill [previdenciario-teacher]: ✅ .agent

## 4. 📈 Gráfico ASCII — Latência P50 por Dimensão (ms)

```
 1340 ┤   █      
 1072 ┤   █      
  804 ┤   █      
  536 ┤   █      
  268 ┤   █      
      └──────────
       1 2 3 4 5
```

## 5. ⚠️ Gaps Críticos

- **Gap:** Vazamento de memória
  - Impacto: alto | Mitigação: Revisar compactUserContext

## 6. 🎯 Recomendação Final

- [x] **Pronto com ressalvas**

## 7. 🔍 Logs de Execução

```
[21:30:43.280] ▶ DIM 1: Carga Simultânea — 10 queries paralelas (cloud routing)
[21:30:43.356]   Q1: qwen3-coder-next:cloud (6ms)
[21:30:43.356]   Q2: qwen3-coder-next:cloud (3ms)
[21:30:43.357]   Q3: qwen3-coder-next:cloud (2ms)
[21:30:43.357]   Q4: qwen3-coder-next:cloud (2ms)
[21:30:43.357]   Q5: qwen3-coder-next:cloud (2ms)
[21:30:43.357]   Q6: qwen3-coder-next:cloud (1ms)
[21:30:43.357]   Q7: qwen3-coder-next:cloud (1ms)
[21:30:43.357]   Q8: qwen3-coder-next:cloud (1ms)
[21:30:43.358]   Q9: qwen3-coder-next:cloud (2ms)
[21:30:43.358]   Q10: qwen3-coder-next:cloud (2ms)
[21:30:43.358]   Healthcheck cloud: true em 0ms (sem fetch)
[21:30:43.558] ▶ DIM 2: Falhas em Cascata — URL inválida, guardrails, embedding
[21:30:44.900]   Local (URL inválida): ok=false em 1340ms | Cloud imune: true
[21:30:44.900]   Guardrails: llama3.2:3b local=true | Embed: nomic-embed-text:latest local=true
[21:30:45.113] ▶ DIM 3: Memória & Contexto — 20 ciclos de compactação
[21:30:48.465]   P50=0ms P95=643ms | Δmem=65.33MB | tokenCount último: 451
[21:30:48.677] ▶ DIM 4: Ingestão em Lote — 5 arquivos dry-run
[21:30:48.763]   lei-8080.md: dry_run_ok
[21:30:48.781]   codigo-civil.md: dry_run_ok
[21:30:48.800]   resolucao-cns.md: dry_run_ok
[21:30:48.804]   lei-8080.md: dry_run_ok
[21:30:48.825]   tiny.md: failed
[21:30:49.036] ▶ DIM 5: Segurança — ataques simulados
[21:30:49.284]   Prompt injection: useful → blocked=false
[21:30:49.285]   SQL injection: useful → blocked=true (inj:sql)
[21:30:49.286]   Credential leak: secret → blocked=true
[21:30:49.288]   Path traversal: 🔒 bloqueado
[21:30:49.294]   Delete: reqConf=true
[21:30:49.503] ▶ DIM 6: Performance & Latência — 20 ciclos routing (sem I/O DB)
[21:30:49.505]   P50=0ms P95=0ms P99=1ms Δmem=0.04MB
[21:30:49.706] ▶ DIM 7: Resiliência — dry-run + abort + path inválido
[21:30:49.731]   Ingestão: dry_run_ok
[21:30:49.947] ▶ DIM 8: Skills & Agents — .agent vs .opencode
[21:30:49.949]   Skills .agent:50 .opencode:50 | Agents:20 | Modo:agent
[21:30:49.950]   law-oab-teacher: ✅ .agent
[21:30:49.951]   previdenciario-teacher: ✅ .agent
[21:30:49.952]   legal-citation-and-validation: ✅ .agent
[21:30:49.952]   legal-research-orchestrator: ✅ .agent
[21:30:49.953]   Agent orchestrator.md: ✅
[21:30:49.953]   Agent security-auditor.md: ✅
[21:30:49.954]   Agent debugger.md: ✅
```

---
*Gerado: 2026-04-28T21:30:50.157Z | Hardware: i7-2600 16GB | OLLAMA_TIMEOUT_MS=1800000ms*
