/**
 * GUARD RAILS — Barrel Export
 *
 * Ponto único de acesso a todos os módulos de guard rails.
 * Importe daqui ao invés de importar arquivos individuais.
 */

// P0.1 — Contrato Canônico de Entrada
export {
  CanonicalRequestSchema,
  CanalEnum,
  PayloadSchema,
  TextPayloadSchema,
  VoicePayloadSchema,
  ContextPayloadSchema,
  normalizeRequest,
  buildChatRequest,
} from "./canonical-schema.js";
export type {
  CanonicalRequest,
  Canal,
  Payload,
} from "./canonical-schema.js";

// P0.2 — Classificador de Intenção
export {
  classifyIntent,
  classifyText,
} from "./intent-classifier.js";
export type {
  IntentType,
  RiskLevel,
  IntentClassification,
} from "./intent-classifier.js";

// P0.3 — Policy Router Central
export {
  applyPolicy,
  isCapabilityAllowed,
  buildBlockedResponse,
  getPolicyRulesCount,
} from "./policy-router.js";
export type {
  PolicyDecision,
  PolicyResult,
} from "./policy-router.js";

// P0.4 — Segurança Mínima
export {
  hasPermission,
  sanitizeString,
  sanitizeParams,
  redactSensitiveFields,
  redactPII,
  isCriticalOperation,
  requireConfirmation,
} from "./security.js";

// Observabilidade — Audit Logger
export {
  auditLog,
  securityLog,
  logPipelineEntry,
  logPipelineExit,
  getRecentLogs,
} from "./audit-logger.js";
export type { AuditEntry } from "./audit-logger.js";

// P1.5 — Observabilidade
export {
  logGuardRailStage,
  recordRouteMetric,
  getGuardRailMetrics,
  diagnoseByRequestId,
} from "./observability.js";

// P1.6 — Fallback e degradação
export {
  runWithTimeout,
  executeWithFallback,
  buildUnavailableResponse,
} from "./fallback-manager.js";
export type { Capability } from "./fallback-manager.js";

// P1.7 — Contratos de saída
export {
  validateOutputContract,
  getOutputContractIntents,
} from "./output-contracts.js";

// P2.8 — Governança de skills
export {
  registerSkillContract,
  getSkillContract,
  listSkillContracts,
  executeGovernedSkill,
} from "./skills-governance.js";
export type { SkillContract, SkillRisk } from "./skills-governance.js";

// P2.9 — Estratégia RAG confiável
export {
  filterTrustedEvidence,
  validateRagOutput,
  getTrustedSourceDomains,
} from "./rag-policy.js";
export type { RagDomain, RagEvidence } from "./rag-policy.js";

// P2.10 — Qualidade contínua
export { runGuardRailsQualityGate } from "./quality-gates.js";
export type { QualityGateResult } from "./quality-gates.js";

// ─── Pipeline Orquestrado ─────────────────────────────────────────────────────

import { normalizeRequest } from "./canonical-schema.js";
import { classifyIntent } from "./intent-classifier.js";
import { applyPolicy, buildBlockedResponse } from "./policy-router.js";
import { logPipelineEntry, logPipelineExit } from "./audit-logger.js";

export interface PipelineResult {
  allowed: boolean;
  request_id: string;
  classification?: ReturnType<typeof classifyIntent>;
  policy?: ReturnType<typeof applyPolicy>;
  blocked_message?: string;
  error?: string;
}

/**
 * Executa o pipeline completo de guard rails em uma entrada bruta.
 * Retorna { allowed: true } se a requisição pode prosseguir,
 * ou { allowed: false, blocked_message } se deve ser bloqueada.
 *
 * Uso típico no router:
 * ```ts
 * const guard = await runGuardRails(rawInput);
 * if (!guard.allowed) {
 *   return { error: guard.blocked_message };
 * }
 * ```
 */
export function runGuardRails(raw: unknown): PipelineResult {
  const startTime = Date.now();

  // 1. Normaliza entrada para formato canônico
  const normalized = normalizeRequest(raw);

  if (!normalized.success) {
    return {
      allowed: false,
      request_id: "unknown",
      error: normalized.error,
      blocked_message: "Requisição em formato inválido.",
    };
  }

  const request = normalized.data;

  // 2. Log de entrada no pipeline
  logPipelineEntry({
    request_id: request.request_id,
    canal: request.canal,
    user_id: request.usuario.id,
    payload_type: request.payload.type,
  });

  // 3. Classifica intenção
  const classification = classifyIntent(request);

  // 4. Aplica política central
  const policy = applyPolicy(request, classification);

  const latency_ms = Date.now() - startTime;

  if (policy.decision === "allow") {
    logPipelineExit({ request_id: request.request_id, status: "success", latency_ms });
    return { allowed: true, request_id: request.request_id, classification, policy };
  }

  if (policy.decision === "confirm") {
    logPipelineExit({ request_id: request.request_id, status: "success", latency_ms });
    // Retorna como allowed mas sinaliza necessidade de confirmação
    return { allowed: true, request_id: request.request_id, classification, policy };
  }

  // deny ou fallback
  const blocked_message = buildBlockedResponse(policy);
  logPipelineExit({
    request_id: request.request_id,
    status: policy.decision === "fallback" ? "fallback" : "blocked",
    latency_ms,
    error: policy.reason,
  });

  return {
    allowed: false,
    request_id: request.request_id,
    classification,
    policy,
    blocked_message,
  };
}
