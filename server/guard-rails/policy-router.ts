/**
 * GUARD RAILS — Policy Router Central (P0.3)
 *
 * Tabela de decisão central para todas as rotas do pipeline AVA.
 * 100% das rotas passam por aqui com motivo registrado.
 * Proíbe roteamento ad hoc dentro de skills.
 */

import type { IntentClassification, IntentType, RiskLevel } from "./intent-classifier.js";
import type { CanonicalRequest } from "./canonical-schema.js";
import { auditLog } from "./audit-logger.js";

// ─── Tipos de Decisão ────────────────────────────────────────────────────────

export type PolicyDecision = "allow" | "deny" | "confirm" | "fallback";

export interface PolicyResult {
  decision: PolicyDecision;
  reason: string;
  allowed_capabilities: string[];
  required_action?: string;         // Mensagem para o usuário quando confirm/fallback
  audit_required: boolean;
  request_id: string;
}

// ─── Tabela de Políticas ──────────────────────────────────────────────────────

interface PolicyRule {
  name: string;
  match: (params: {
    intent: IntentType;
    risk_level: RiskLevel;
    user_role: string;
    requires_confirmation: boolean;
    requires_fallback: boolean;
  }) => boolean;
  decision: PolicyDecision;
  reason: string;
  allowed_capabilities: string[];
  required_action?: string;
  audit_required: boolean;
}

const POLICY_TABLE: PolicyRule[] = [
  // ── Usuário anônimo só pode fazer informacional ──────────────────────────
  {
    name: "anonymous_non_informational",
    match: ({ user_role, intent }) =>
      user_role === "anonymous" && intent !== "informacional",
    decision: "deny",
    reason: "Usuário não autenticado não pode executar esta operação",
    allowed_capabilities: [],
    required_action: "Por favor, faça login para continuar.",
    audit_required: true,
  },

  // ── Operações de alto risco — sempre bloqueadas sem admin ─────────────────
  {
    name: "high_risk_non_admin",
    match: ({ intent, user_role }) =>
      intent === "alto_risco" && user_role !== "admin",
    decision: "deny",
    reason: "Operação de alto risco requer permissão de administrador",
    allowed_capabilities: [],
    required_action: "Esta operação requer aprovação de um administrador.",
    audit_required: true,
  },

  // ── Operações de alto risco com admin — exige confirmação explícita ───────
  {
    name: "high_risk_admin_confirm",
    match: ({ intent, user_role }) =>
      intent === "alto_risco" && user_role === "admin",
    decision: "confirm",
    reason: "Operação de alto risco requer confirmação explícita do administrador",
    allowed_capabilities: ["admin.all"],
    required_action: "Confirme que deseja executar esta operação irreversível.",
    audit_required: true,
  },

  // ── Dados sensíveis — exige confirmação + log de auditoria ───────────────
  {
    name: "sensitive_data_confirm",
    match: ({ intent }) => intent === "sensivel",
    decision: "confirm",
    reason: "Operação com dados sensíveis requer confirmação",
    allowed_capabilities: ["data.read", "data.write.sensitive"],
    required_action: "Confirme o acesso a dados sensíveis.",
    audit_required: true,
  },

  // ── Baixa confiança — solicitar mais contexto ────────────────────────────
  {
    name: "low_confidence_fallback",
    match: ({ requires_fallback }) => requires_fallback,
    decision: "fallback",
    reason: "Confiança insuficiente para determinar intenção",
    allowed_capabilities: [],
    required_action: "Poderia ser mais específico? Não entendi completamente o que você precisava.",
    audit_required: false,
  },

  // ── Automação — usuário autenticado pode, anônimo não ────────────────────
  {
    name: "automation_authenticated",
    match: ({ intent, user_role }) =>
      intent === "automacao" && user_role !== "anonymous",
    decision: "allow",
    reason: "Automação permitida para usuário autenticado",
    allowed_capabilities: ["tasks.create", "tasks.update", "tasks.list", "cron.schedule"],
    audit_required: false,
  },

  // ── Transacional — usuário autenticado ───────────────────────────────────
  {
    name: "transactional_authenticated",
    match: ({ intent, user_role }) =>
      intent === "transacional" && user_role !== "anonymous",
    decision: "allow",
    reason: "Operação transacional permitida para usuário autenticado",
    allowed_capabilities: ["data.read", "data.write", "data.delete"],
    audit_required: false,
  },

  // ── Informacional — qualquer usuário ────────────────────────────────────
  {
    name: "informational_allow",
    match: ({ intent }) => intent === "informacional",
    decision: "allow",
    reason: "Consultas informacionais são sempre permitidas",
    allowed_capabilities: ["rag.query", "data.read", "memory.read"],
    audit_required: false,
  },

  // ── Fallback global — qualquer coisa não coberta ─────────────────────────
  {
    name: "global_fallback",
    match: () => true,
    decision: "fallback",
    reason: "Operação não coberta pelas políticas existentes",
    allowed_capabilities: [],
    required_action: "Não consegui processar esta solicitação. Pode reformular?",
    audit_required: true,
  },
];

export function getPolicyRulesCount(): number {
  return POLICY_TABLE.length;
}

// ─── Policy Router ────────────────────────────────────────────────────────────

export function applyPolicy(
  request: CanonicalRequest,
  classification: IntentClassification
): PolicyResult {
  const user_role = request.usuario.role;

  const matchParams = {
    intent: classification.intent,
    risk_level: classification.risk_level,
    user_role,
    requires_confirmation: classification.requires_confirmation,
    requires_fallback: classification.requires_fallback,
  };

  // Avalia regras em ordem (primeira que bate vence)
  const matchedRule = POLICY_TABLE.find(rule => rule.match(matchParams));

  // Sempre haverá match (global_fallback garante)
  const rule = matchedRule!;

  const result: PolicyResult = {
    decision: rule.decision,
    reason: rule.reason,
    allowed_capabilities: rule.allowed_capabilities,
    required_action: rule.required_action,
    audit_required: rule.audit_required,
    request_id: request.request_id,
  };

  // Registra decisão de política no log de auditoria
  auditLog({
    request_id: request.request_id,
    event: "policy_decision",
    user_id: request.usuario.id,
    user_role,
    canal: request.canal,
    intent: classification.intent,
    risk_level: classification.risk_level,
    confidence: classification.confidence,
    policy_rule: rule.name,
    decision: rule.decision,
    audit_required: rule.audit_required,
    timestamp: request.timestamp,
  });

  return result;
}

/**
 * Verifica se uma capability específica está autorizada no resultado da política.
 */
export function isCapabilityAllowed(
  policyResult: PolicyResult,
  capability: string
): boolean {
  if (policyResult.decision === "deny") return false;
  if (policyResult.decision === "fallback") return false;
  return (
    policyResult.allowed_capabilities.includes(capability) ||
    policyResult.allowed_capabilities.includes("admin.all")
  );
}

/**
 * Gera resposta padrão de bloqueio para o usuário (sem alucinação operacional).
 */
export function buildBlockedResponse(result: PolicyResult): string {
  switch (result.decision) {
    case "deny":
      return result.required_action ?? "Operação não permitida com sua permissão atual.";
    case "confirm":
      return result.required_action ?? "Esta operação requer sua confirmação explícita.";
    case "fallback":
      return result.required_action ?? "Não entendi completamente. Pode reformular sua solicitação?";
    default:
      return "Operação bloqueada pelo sistema de segurança.";
  }
}
