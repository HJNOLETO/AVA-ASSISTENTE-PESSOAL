import { routeMemoryPersistence } from "../security/memoryGuard";

export type LlmTaskType = "reasoning/legal" | "embedding" | "security/guardrails";

export type LlmRoute = {
  primaryModel: string;
  fallbackModel?: string;
  timeoutMs: number;
  localOnly: boolean;
};

// C6: Cache de healthcheck por modelo (TTL configuravel via env)
const _healthCache = new Map<string, { ok: boolean; expiresAt: number }>();
const HEALTH_CACHE_TTL_MS = parseInt(process.env.AVA_HEALTHCHECK_CACHE_TTL_MS ?? "30000");
// C7: Timeout de healthcheck separado do timeout de inferência
const DEFAULT_HEALTH_TIMEOUT_MS = parseInt(
  process.env.OLLAMA_HEALTH_TIMEOUT_MS ?? process.env.OLLAMA_TIMEOUT_MS ?? "5000"
);

export async function checkModelHealth(model: string, timeoutMs = DEFAULT_HEALTH_TIMEOUT_MS): Promise<boolean> {
  // Modelos cloud acessados via Ollama Cloud: assume disponivel.
  if (model.includes(":cloud")) return true;

  // C6: Checar cache antes de fazer fetch
  const cached = _healthCache.get(model);
  if (cached && Date.now() < cached.expiresAt) return cached.ok;

  // Modelos locais: verifica disponibilidade real via /api/tags do Ollama.
  const base = (process.env.OLLAMA_BASE_URL || "http://localhost:11434").replace(/\/$/, "");
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    const res = await fetch(`${base}/api/tags`, { signal: controller.signal });
    clearTimeout(timer);
    if (!res.ok) { _healthCache.set(model, { ok: false, expiresAt: Date.now() + HEALTH_CACHE_TTL_MS }); return false; }
    const data = await res.json() as { models?: Array<{ name: string }> };
    if (!Array.isArray(data.models)) { _healthCache.set(model, { ok: false, expiresAt: Date.now() + HEALTH_CACHE_TTL_MS }); return false; }
    const modelBase = model.split(":")[0];
    const ok = data.models.some((m) => m.name === model || m.name.startsWith(modelBase));
    // C6: Salvar no cache (TTL menor para falhas, maior para sucesso)
    _healthCache.set(model, { ok, expiresAt: Date.now() + (ok ? HEALTH_CACHE_TTL_MS : Math.min(HEALTH_CACHE_TTL_MS, 10000)) });
    return ok;
  } catch {
    _healthCache.set(model, { ok: false, expiresAt: Date.now() + 10000 }); // falhas: cache 10s
    return false;
  }
}

export function routeTaskModel(task: LlmTaskType): LlmRoute {
  if (task === "embedding") {
    return { primaryModel: process.env.OLLAMA_EMBED_MODEL || "nomic-embed-text:latest", timeoutMs: 30000, localOnly: true };
  }
  if (task === "security/guardrails") {
    return { primaryModel: "llama3.2:3b", timeoutMs: 45000, localOnly: true };
  }
  return {
    primaryModel: process.env.LLM_CLOUD_MODEL || "qwen3-coder-next:cloud",
    fallbackModel: process.env.LLM_LOCAL_MODEL || "qwen3:4b",
    timeoutMs: Number(process.env.OLLAMA_TIMEOUT_MS || 60000),
    localOnly: false,
  };
}

export async function resolveTaskModel(task: LlmTaskType, content: string): Promise<string> {
  const route = routeTaskModel(task);
  if (!route.localOnly && String(process.env.AVA_MEMORY_BLOCK_SENSITIVE || "true").toLowerCase() !== "false") {
    const check = routeMemoryPersistence(content);
    if (check.classification.classification === "secret" || check.classification.classification === "sensitive") {
      return route.fallbackModel || route.primaryModel;
    }
  }

  const healthyPrimary = await checkModelHealth(route.primaryModel, 5000);
  if (healthyPrimary) return route.primaryModel;
  return route.fallbackModel || route.primaryModel;
}
