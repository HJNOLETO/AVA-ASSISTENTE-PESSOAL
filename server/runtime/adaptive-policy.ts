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
};

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
}): RuntimePolicy {
  const detected = detectTier();
  const forcedTier = String(process.env.AVA_RUNTIME_TIER || overrides?.tier || "").trim().toLowerCase();
  const tier = forcedTier === "full" || forcedTier === "balanced" || forcedTier === "safe"
    ? (forcedTier as RuntimeTier)
    : detected.tier;

  const proactiveMode = parseProactiveMode(overrides?.proactiveMode || process.env.AVA_PROACTIVE_MODE);
  const baseTimeoutByTier = tier === "full" ? 120000 : tier === "balanced" ? 90000 : 60000;
  const timeoutRaw = overrides?.timeoutMs || Number(process.env.AVA_CLI_TIMEOUT_MS || baseTimeoutByTier);
  const llmTimeoutMs = clamp(timeoutRaw, 10000, 300000);

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
  };
}
