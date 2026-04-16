import { auditLog } from "./audit-logger.js";

export type Capability = "rag" | "skill" | "db" | "tts" | "llm";

type FallbackResult<T> = {
  ok: boolean;
  value?: T;
  fallback_used: boolean;
  reason?: string;
};

type CircuitState = {
  failures: number;
  open_until: number;
};

const circuitState = new Map<Capability, CircuitState>();

// ANTES:
/*
const CAPABILITY_TIMEOUT_MS: Record<Capability, number> = {
  rag: 12_000,
  skill: 10_000,
  db: 6_000,
  tts: 8_000,
  llm: 90_000,
};
*/

// DEPOIS:
const CAPABILITY_TIMEOUT_MS: Record<Capability, number> = {
  rag: 12_000,
  skill: 10_000,
  db: 6_000,
  tts: 8_000,
  llm: 300_000,     // ← 5 minutos, aguenta o cold start de ~4min39s com folga
};


const CIRCUIT_BREAKER_LIMIT = 3;
const CIRCUIT_OPEN_MS = 60_000;

function isCircuitOpen(capability: Capability): boolean {
  const state = circuitState.get(capability);
  if (!state) return false;
  return state.open_until > Date.now();
}

function markFailure(capability: Capability): void {
  const state = circuitState.get(capability) ?? { failures: 0, open_until: 0 };
  state.failures += 1;
  if (state.failures >= CIRCUIT_BREAKER_LIMIT) {
    state.open_until = Date.now() + CIRCUIT_OPEN_MS;
  }
  circuitState.set(capability, state);
}

function markSuccess(capability: Capability): void {
  circuitState.set(capability, { failures: 0, open_until: 0 });
}

export async function runWithTimeout<T>(
  capability: Capability,
  run: () => Promise<T>,
  overrideTimeoutMs?: number
): Promise<T> {
  const timeoutMs = overrideTimeoutMs ?? CAPABILITY_TIMEOUT_MS[capability];

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(`Timeout de ${capability} (${timeoutMs}ms)`)), timeoutMs);
  });

  return Promise.race([run(), timeoutPromise]);
}

export async function executeWithFallback<T>(params: {
  capability: Capability;
  request_id: string;
  primary: () => Promise<T>;
  fallback: () => Promise<T>;
  /** Timeout customizado em ms. Quando fornecido, sobrescreve o valor hardcoded de CAPABILITY_TIMEOUT_MS. */
  timeoutMs?: number;
}): Promise<FallbackResult<T>> {
  if (isCircuitOpen(params.capability)) {
    try {
      const value = await params.fallback();
      return {
        ok: true,
        value,
        fallback_used: true,
        reason: "circuit_open",
      };
    } catch (error) {
      return {
        ok: false,
        fallback_used: true,
        reason: error instanceof Error ? error.message : "fallback_failed",
      };
    }
  }

  try {
    const value = await runWithTimeout(params.capability, params.primary, params.timeoutMs);
    markSuccess(params.capability);
    return { ok: true, value, fallback_used: false };
  } catch (primaryError) {
    markFailure(params.capability);
    auditLog({
      request_id: params.request_id,
      event: "capability_fallback",
      timestamp: new Date().toISOString(),
      details: {
        capability: params.capability,
        reason: primaryError instanceof Error ? primaryError.message : "primary_failed",
      },
    });

    try {
      const value = await runWithTimeout(params.capability, params.fallback, params.timeoutMs);
      return {
        ok: true,
        value,
        fallback_used: true,
        reason: primaryError instanceof Error ? primaryError.message : "primary_failed",
      };
    } catch (fallbackError) {
      return {
        ok: false,
        fallback_used: true,
        reason: fallbackError instanceof Error ? fallbackError.message : "fallback_failed",
      };
    }
  }
}

export function buildUnavailableResponse(capability: Capability): string {
  if (capability === "rag") {
    return "Nao consegui acessar a base de conhecimento agora. Tente novamente em instantes.";
  }
  if (capability === "skill") {
    return "Nao consegui executar a automacao solicitada agora. Tente novamente em instantes.";
  }
  if (capability === "db") {
    return "Nao consegui acessar o banco de dados agora. Tente novamente em instantes.";
  }
  if (capability === "tts") {
    return "Nao consegui gerar audio agora. Posso responder em texto normalmente.";
  }
  return "Nao consegui processar sua solicitacao agora. Tente novamente em instantes.";
}
