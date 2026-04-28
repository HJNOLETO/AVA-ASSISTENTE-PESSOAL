# CORREÇÕES NECESSÁRIAS — AVA CLI v3.0
**Baseado em:** `STRESS_TEST_REPORT.md` (2026-04-28) | Stress Test: 5 PASS / 3 PARTIAL / 0 FAIL

---

## Prioridade 🔴 Alta

### C1 — `compactUserContext()` — Acúmulo de Memória (122MB / 20 ciclos)

**Origem:** DIM 3 (⚠️ PARTIAL) — Δmem=122.53MB em 20 ciclos consecutivos  
**Arquivo:** `server/context/manager.ts`  
**Problema:** A cada chamada, `searchMemoryByKeywords` e `upsertUserContext` retêm referências no heap do SQLite driver. Após 20 ciclos, o GC não libera o acúmulo das queries intermediárias.

**Correções necessárias:**
- [ ] Adicionar profiler de memória embutido: medir `heapUsed` antes/depois e logar se Δ > 5MB
- [ ] Limitar memórias retornadas: `mem.slice(0, 12)` → `mem.slice(0, 5)` para reduzir pressão
- [ ] Forçar `PRAGMA optimize` após N upserts para liberar WAL do SQLite
- [ ] Adicionar flag `AVA_CONTEXT_MAX_CYCLES=20` e limpar cache interno ao atingir limite

```typescript
// server/context/manager.ts — profiler embutido ao final de compactUserContext
const heapAfter = process.memoryUsage().heapUsed;
const deltaMB = (heapAfter - _heapBefore) / 1024 / 1024;
if (deltaMB > 5) {
  console.warn(`[compactUserContext] Δmem=${deltaMB.toFixed(2)}MB — possível acúmulo`);
}
```

---

### C2 — `guard.ts` — Ausência de Pré-filtro para Injeção (Prompt/SQL/Shell)

**Origem:** DIM 5 — `Prompt injection` e `SQL injection` classificados como `useful` (não bloqueados)  
**Arquivos:** `server/tool-registry/guard.ts`, `server/security/memoryGuard.ts`  
**Problema:** O `memoryGuard` classifica *para armazenamento*, não detecta intenção maliciosa. Não existe pré-filtro de injeção antes da execução de ferramentas.

**Correções necessárias:**
- [ ] Criar `detectInjectionAttempt(input)` em `server/security/memoryGuard.ts`
- [ ] Integrar ao `evaluateToolExecution` em `guard.ts` — bloquear se score > 0.7
- [ ] Cobrir padrões: SQL (`DELETE/DROP/INSERT + FROM/WHERE`), Prompt (`ignore all rules`, `DAN mode`), Shell (`; rm -rf`, `| curl`)
- [ ] Registrar no audit log com `risk: "injection_attempt"`

```typescript
// server/security/memoryGuard.ts — nova função
const INJECTION_PATTERNS = [
  { type: "sql",    pattern: /\b(DELETE|DROP|INSERT|UPDATE|TRUNCATE)\b.+\b(FROM|INTO|TABLE|WHERE)\b/i },
  { type: "prompt", pattern: /ignore\s+(all|todas)\s+(rules?|regras?)|you\s+are\s+now|DAN\s+mode/i },
  { type: "shell",  pattern: /[;|&]\s*(rm|curl|wget|nc|bash|sh|cmd|powershell)/i },
];

export function detectInjectionAttempt(input: string): { detected: boolean; type?: string } {
  for (const { type, pattern } of INJECTION_PATTERNS) {
    if (pattern.test(input)) return { detected: true, type };
  }
  return { detected: false };
}
```

---

## Prioridade 🟠 Média

### C3 — `ingest_ops.ts` — Ingestão Sem Resiliência e Sem Auto-título

**Origem:** DIM 4 (⚠️ PARTIAL) — `resolucao-cns.md` falhou; duplicata não detectada em dry-run  
**Arquivos:** `server/tools/ingest_ops.ts`, `server/rag/legal-ingest.ts`  
**Problemas:**
1. Arquivos válidos mas pequenos rejeitados sem mensagem clara
2. Duplicata SHA-256 não detectada em modo dry-run (retornou `dry_run_ok` em vez de `duplicado`)
3. Arquivos sem `# Título` no cabeçalho não recebem auto-título

**Correções necessárias:**
- [ ] **Auto-título:** se content não começa com `#`, inserir `# ${basename}` automaticamente
- [ ] **Threshold adaptativo:** reduzir mínimo de 500 → 200 chars (normas curtas são válidas)
- [ ] **SHA-256 em dry-run:** calcular hash e verificar duplicatas no DB mesmo em modo seco
- [ ] **Log claro:** `{ status: "failed", reason: "conteudo_abaixo_minimo", minChars, atual }` em vez de `failed` genérico
- [ ] **Checkpoint:** salvar progresso em `ava_inbox/.ingest_checkpoint.json` para retomar após interrupção

```typescript
// server/tools/ingest_ops.ts — auto-título + threshold adaptativo
function prepareContent(raw: string, filePath: string): string {
  const trimmed = raw.trim();
  const hasTitle = /^#{1,3}\s+\S/.test(trimmed);
  return hasTitle ? trimmed : `# ${path.basename(filePath, path.extname(filePath))}\n\n${trimmed}`;
}
const MIN_CHARS = parseInt(process.env.AVA_INGEST_MIN_CHARS ?? "200");
```

---

### C4 — Skills Jurídicas Ausentes em `.agent` (exclusivas em `.opencode`)

**Origem:** DIM 8 (⚠️ PARTIAL) — 3 skills críticas inacessíveis no modo `agent`  
**Skills afetadas:**
- `legal-citation-and-validation/` — validação de citações jurídicas
- `legal-research-orchestrator/` — pesquisa jurídica multi-fonte  
- `professor-mestre-da-oab/` — preparação OAB

**Correções necessárias:**
- [ ] Copiar as 3 pastas para `.agent/skills/`
- [ ] Atualizar `.agent/skills/doc.md` com as novas entradas
- [ ] Adicionar validação no startup do CLI para skills jurídicas críticas

```powershell
# Executar no diretório do projeto:
Copy-Item .opencode\skills\legal-citation-and-validation .agent\skills\ -Recurse
Copy-Item .opencode\skills\legal-research-orchestrator .agent\skills\ -Recurse
Copy-Item .opencode\skills\professor-mestre-da-oab .agent\skills\ -Recurse
```

---

## Prioridade 🟡 Baixa

### C5 — `compactUserContext()` — Latência Alta (P50=464ms)

**Causa:** `searchMemoryByKeywords` faz busca full-scan sem índice por `userId`  
- [ ] Verificar e adicionar índice em `memories.userId` no schema Drizzle
- [ ] Cache de 30s para resultado de `compactUserContext` com mesma query+userId
- [ ] Usar `LIMIT 5` em `searchMemoryByKeywords` em vez de `LIMIT 50` + slice posterior

---

### C6 — `llm-router.ts` — Cache de Healthcheck Ausente (1.3s por detecção de falha)

**Causa:** Cada chamada faz fetch real, 1357ms para detectar Ollama indisponível  
- [ ] Cache de resultado do `checkModelHealth` por 30s por modelo
- [ ] Adicionar `AVA_HEALTHCHECK_CACHE_TTL_MS=30000` como flag configurável

---

### C7 — `checkModelHealth` Ignora `OLLAMA_TIMEOUT_MS` do `.env`

**Causa:** Usa timeout hardcoded de 5000ms, ignorando `OLLAMA_TIMEOUT_MS=1800000`  
- [ ] Usar `parseInt(process.env.OLLAMA_HEALTH_TIMEOUT_MS ?? process.env.OLLAMA_TIMEOUT_MS ?? "5000")` como padrão
- [ ] Criar `OLLAMA_HEALTH_TIMEOUT_MS` separado do timeout de inferência

---

## Resumo — Arquivos e Prioridades

| Arquivo | Correção | Prioridade |
|---------|----------|------------|
| `server/context/manager.ts` | Profiler de memória + slice limit | 🔴 Alta |
| `server/security/memoryGuard.ts` | `detectInjectionAttempt()` | 🔴 Alta |
| `server/tool-registry/guard.ts` | Integrar pré-filtro de injeção | 🔴 Alta |
| `server/tools/ingest_ops.ts` | Auto-título, threshold 200, SHA-256 dry-run | 🟠 Média |
| `server/rag/legal-ingest.ts` | Log claro + checkpoint | 🟠 Média |
| `.agent/skills/` | Copiar 3 skills jurídicas do `.opencode` | 🟠 Média |
| `server/_core/llm-router.ts` | Cache healthcheck 30s + `OLLAMA_TIMEOUT_MS` | 🟡 Baixa |
| Schema Drizzle | Índice em `memories.userId` | 🟡 Baixa |

---

## Ordem de Execução Recomendada

```
1. 🔴 C2 → guard.ts + memoryGuard.ts (pré-filtro injeção)  — segurança, 2 arquivos
2. 🔴 C1 → compactUserContext (profiler + slice limit)       — estabilidade, 1 arquivo
3. 🟠 C3 → ingest_ops + legal-ingest (resiliência)          — funcionalidade, 2 arquivos
4. 🟠 C4 → Copy-Item skills para .agent                     — 1 comando PowerShell
5. 🟡 C5 → índice memories + cache context                   — performance
6. 🟡 C6/C7 → cache healthcheck + timeout env               — otimização
```

Após C1+C2+C3: re-executar `pnpm test:stress:ava-cli` → esperado **8/8 PASS** ✅

---
*Fonte: STRESS_TEST_REPORT.md (2026-04-28) + análise direta dos arquivos do projeto*
