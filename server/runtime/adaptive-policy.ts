import os from "os";

export type ProactiveMode = "safe" | "balanced" | "proactive-max";
export type RuntimeTier = "full" | "balanced" | "safe";

export type RuntimePolicy = {
  proactiveMode: ProactiveMode;
  tier: RuntimeTier;
  reason: string;
  totalMemGb: number;
  freeMemGb: number;
  cpuCount: number;
  llmTimeoutMs: number;
  maxCycles: number;
  maxToolCalls: number;
  autoContinuationLimit: number;
  timeoutReason: string;
};

export type LlmProvider = "forge" | "ollama" | "groq" | "gemini";

const clamp = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value)) return min;
  return Math.max(min, Math.min(max, value));
};

export function parseProactiveMode(value: string | undefined): ProactiveMode {
  const mode = String(value || "balanced").trim().toLowerCase();
  if (mode === "safe" || mode === "balanced" || mode === "proactive-max") {
    return mode;
  }
  return "balanced";
}

function degradeTier(tier: RuntimeTier): RuntimeTier {
  if (tier === "full") return "balanced";
  if (tier === "balanced") return "safe";
  return "safe";
}

function detectTier(): { tier: RuntimeTier; reason: string; totalMemGb: number; freeMemGb: number; cpuCount: number } {
  const totalMemGb = Number((os.totalmem() / (1024 ** 3)).toFixed(1));
  const freeMemGb = Number((os.freemem() / (1024 ** 3)).toFixed(1));
  const cpuCount = os.cpus().length;
  const freeRatio = os.totalmem() > 0 ? os.freemem() / os.totalmem() : 0;

  let tier: RuntimeTier;
  if (totalMemGb >= 24 && cpuCount >= 10) {
    tier = "full";
  } else if (totalMemGb >= 12 && cpuCount >= 6) {
    tier = "balanced";
  } else {
    tier = "safe";
  }

  const reasons = [`auto totalMem=${totalMemGb}GB`, `freeMem=${freeMemGb}GB`, `cpu=${cpuCount}`];
  if (freeRatio < 0.12) {
    tier = degradeTier(tier);
    reasons.push("degradado por memoria livre < 12% do total");
  }

  return {
    tier,
    reason: reasons.join(" | "),
    totalMemGb,
    freeMemGb,
    cpuCount,
  };
}

export function buildProactiveFollowUp(mode: ProactiveMode): string {
  if (mode === "proactive-max") {
    return [
      "Continue autonomamente sem pedir permissao.",
      "Aprofunde verificacoes complementares, correlacione causa provavel e elimine lacunas.",
      "Entregue: hipotese principal, evidencias objetivas, acao corretiva segura, validacao e plano priorizado.",
    ].join(" ");
  }
  if (mode === "safe") {
    return [
      "Continue autonomamente apenas com passos de baixo risco.",
      "Entregue: hipotese principal, evidencia objetiva e validacao curta.",
    ].join(" ");
  }
  return [
    "Continue autonomamente sem pedir permissao.",
    "Entregue: hipotese principal, evidencias objetivas, acao corretiva segura e validacao final.",
    "Finalize com proximos passos priorizados.",
  ].join(" ");
}

export function shouldForceProactiveContinuation(query: string, responseText: string, mode: ProactiveMode): boolean {
  const q = query.toLowerCase();
  const r = responseText.toLowerCase();
  const isOperationalOrDiagnostic =
    /analise|analisar|diagnost|investig|corrig|mitiga|host|servidor|lento|lentidao|processo|erro|falha|plano|implemente|otimize/.test(q);
  if (!isOperationalOrDiagnostic) return false;

  const hasActionableMarkers =
    /proxim|passo|valida|evidenc|hipotese|mitiga|acao corretiva|comando|checklist|prioriz/.test(r);

  const minLength = mode === "proactive-max" ? 420 : mode === "balanced" ? 240 : 220;
  const looksTooShort = responseText.trim().length < minLength;
  return looksTooShort || !hasActionableMarkers;
}

export function resolveRuntimePolicy(overrides?: {
  proactiveMode?: string;
  timeoutMs?: number;
  tier?: RuntimeTier;
  provider?: LlmProvider | string;
  model?: string;
}): RuntimePolicy {
  const detected = detectTier();
  const forcedTier = String(process.env.AVA_RUNTIME_TIER || overrides?.tier || "").trim().toLowerCase();
  const tier = forcedTier === "full" || forcedTier === "balanced" || forcedTier === "safe"
    ? (forcedTier as RuntimeTier)
    : detected.tier;

  const proactiveMode = parseProactiveMode(overrides?.proactiveMode || process.env.AVA_PROACTIVE_MODE);
  const provider = String(overrides?.provider || process.env.LLM_PROVIDER || "ollama").toLowerCase();
  const model = String(overrides?.model || "").toLowerCase();

  const modelSizeMatch = model.match(/(\d+(?:\.\d+)?)\s*b\b/i);
  const modelSizeB = modelSizeMatch ? Number(modelSizeMatch[1]) : null;

  const isCloudProvider = provider === "forge" || provider === "groq" || provider === "gemini";
  const isOllamaCloudModel = /cloud/.test(model);
  const isLocalModel = provider === "ollama" && !isOllamaCloudModel;

  const localBaseTimeoutByTier = tier === "full" ? 180000 : tier === "balanced" ? 240000 : 300000;
  const cloudBaseTimeoutByTier = tier === "full" ? 60000 : tier === "balanced" ? 75000 : 90000;

  let baseTimeout = isLocalModel ? localBaseTimeoutByTier : cloudBaseTimeoutByTier;
  const reasons: string[] = [];

  if (isCloudProvider || isOllamaCloudModel) {
    reasons.push("perfil cloud");
  } else {
    reasons.push("perfil local");
  }

  if (isLocalModel && modelSizeB !== null) {
    if (modelSizeB <= 4) {
      baseTimeout = Math.max(baseTimeout, 150000);
      reasons.push(`modelo local ${modelSizeB}B`);
    } else if (modelSizeB <= 7) {
      baseTimeout = Math.max(baseTimeout, 360000);
      reasons.push(`modelo local ${modelSizeB}B (pesado)`);
    } else {
      baseTimeout = Math.max(baseTimeout, 480000);
      reasons.push(`modelo local ${modelSizeB}B (muito pesado)`);
    }
  }

  const envTimeoutName = isLocalModel ? "AVA_TIMEOUT_LOCAL_MS" : "AVA_TIMEOUT_CLOUD_MS";
  const envTimeoutRaw = Number(process.env[envTimeoutName] || "");
  const timeoutRaw =
    overrides?.timeoutMs ||
    (Number.isFinite(envTimeoutRaw) && envTimeoutRaw > 0 ? envTimeoutRaw : Number(process.env.AVA_CLI_TIMEOUT_MS || baseTimeout));
  const llmTimeoutMs = clamp(timeoutRaw, 10000, 900000);

  const baseCyclesByTier = tier === "full" ? 14 : tier === "balanced" ? 12 : 9;
  const baseToolCallsByTier = tier === "full" ? 18 : tier === "balanced" ? 14 : 10;

  const modeCycleBoost = proactiveMode === "proactive-max" ? 2 : proactiveMode === "safe" ? -1 : 0;
  const modeToolBoost = proactiveMode === "proactive-max" ? 2 : proactiveMode === "safe" ? -1 : 0;

  return {
    proactiveMode,
    tier,
    reason: forcedTier ? `forcado por AVA_RUNTIME_TIER=${forcedTier}` : detected.reason,
    totalMemGb: detected.totalMemGb,
    freeMemGb: detected.freeMemGb,
    cpuCount: detected.cpuCount,
    llmTimeoutMs,
    maxCycles: clamp(baseCyclesByTier + modeCycleBoost, 6, 18),
    maxToolCalls: clamp(baseToolCallsByTier + modeToolBoost, 8, 24),
    autoContinuationLimit: proactiveMode === "proactive-max" ? 2 : proactiveMode === "balanced" ? 1 : 0,
    timeoutReason: `${reasons.join(" | ")} | tier=${tier}`,
  };
}
