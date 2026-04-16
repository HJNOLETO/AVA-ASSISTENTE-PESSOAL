/**
 * GUARD RAILS — Segurança Mínima Obrigatória (P0.4)
 *
 * - RBAC simplificado (anonymous, user, admin)
 * - Sanitização de parâmetros antes de consultas/execuções
 * - Redação de dados sensíveis em logs e respostas
 * - Bloqueio de operações críticas sem confirmação
 */

import { securityLog } from "./audit-logger.js";

// ─── RBAC — Permissões por Role ───────────────────────────────────────────────

type UserRole = "anonymous" | "user" | "admin";

const ROLE_PERMISSIONS: Record<UserRole, Set<string>> = {
  anonymous: new Set([
    "chat.send",
    "auth.login",
    "auth.register",
  ]),
  user: new Set([
    "chat.send",
    "chat.history",
    "rag.query",
    "memory.read",
    "memory.write",
    "tasks.create",
    "tasks.update",
    "tasks.list",
    "tasks.delete",
    "crm.read",
    "crm.write",
    "legal.read",
    "legal.write",
    "documents.upload",
    "documents.read",
    "profile.update",
  ]),
  admin: new Set([
    // Herda todas as permissões de user
    "chat.send", "chat.history", "rag.query",
    "memory.read", "memory.write",
    "tasks.create", "tasks.update", "tasks.list", "tasks.delete",
    "crm.read", "crm.write", "legal.read", "legal.write",
    "documents.upload", "documents.read", "profile.update",
    // Permissões exclusivas de admin
    "admin.users.list",
    "admin.users.update",
    "admin.users.delete",
    "admin.system.logs",
    "admin.system.settings",
    "admin.operations.critical",
  ]),
};

/**
 * Verifica se um role tem permissão para uma ação específica.
 */
export function hasPermission(
  role: UserRole,
  action: string,
  context?: { request_id: string; user_id: number | null }
): boolean {
  const allowed = ROLE_PERMISSIONS[role]?.has(action) ?? false;

  if (!allowed && context) {
    securityLog({
      request_id: context.request_id,
      event: "rbac_denied",
      user_id: context.user_id,
      details: { role, action },
    });
  }

  return allowed;
}

// ─── Sanitização de Parâmetros ────────────────────────────────────────────────

/** Padrões que indicam tentativa de injeção */
const INJECTION_PATTERNS = [
  /--/g,                        // SQL comment
  /;\s*(drop|delete|truncate|update|insert|alter|create)/gi,
  /<script\b[^>]*>[\s\S]*?<\/script>/gi,   // XSS
  /javascript:/gi,
  /on\w+\s*=/gi,                // Event handlers
  /\.\.[/\\]/g,                 // Path traversal
];

/**
 * Sanitiza uma string contra injeções SQL, XSS e path traversal.
 */
export function sanitizeString(
  input: string,
  context?: { request_id: string; user_id: number | null }
): string {
  let sanitized = input;
  let wasSanitized = false;

  for (const pattern of INJECTION_PATTERNS) {
    const before = sanitized;
    sanitized = sanitized.replace(pattern, "");
    if (sanitized !== before) wasSanitized = true;
  }

  if (wasSanitized && context) {
    securityLog({
      request_id: context.request_id,
      event: "sanitization_applied",
      user_id: context.user_id,
      details: { original_length: input.length, sanitized_length: sanitized.length },
    });
  }

  return sanitized.trim();
}

/**
 * Sanitiza um objeto de parâmetros recursivamente.
 */
export function sanitizeParams(
  params: Record<string, unknown>,
  context?: { request_id: string; user_id: number | null }
): Record<string, unknown> {
  const result: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(params)) {
    if (typeof value === "string") {
      result[key] = sanitizeString(value, context);
    } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      result[key] = sanitizeParams(value as Record<string, unknown>, context);
    } else {
      result[key] = value;
    }
  }

  return result;
}

// ─── Redação de Dados Sensíveis ───────────────────────────────────────────────

/** Campos que devem ser redigidos em logs/respostas */
const SENSITIVE_FIELDS = new Set([
  "password", "senha", "token", "secret", "apikey", "api_key",
  "cpf", "rg", "cnpj", "card_number", "cvv", "credit_card",
  "bank_account", "conta_bancaria", "pix_key",
]);

const REDACT_PLACEHOLDER = "[REDACTED]";

/**
 * Redige campos sensíveis de um objeto para log seguro.
 */
export function redactSensitiveFields(
  obj: Record<string, unknown>,
  context?: { request_id: string; user_id: number | null }
): Record<string, unknown> {
  const result: Record<string, unknown> = {};
  let anyRedacted = false;

  for (const [key, value] of Object.entries(obj)) {
    const keyLower = key.toLowerCase();
    if (SENSITIVE_FIELDS.has(keyLower) || SENSITIVE_FIELDS.has(keyLower.replace(/_/g, ""))) {
      result[key] = REDACT_PLACEHOLDER;
      anyRedacted = true;
    } else if (value !== null && typeof value === "object" && !Array.isArray(value)) {
      result[key] = redactSensitiveFields(value as Record<string, unknown>, context);
    } else {
      result[key] = value;
    }
  }

  if (anyRedacted && context) {
    securityLog({
      request_id: context.request_id,
      event: "redaction_applied",
      user_id: context.user_id,
    });
  }

  return result;
}

/**
 * Redige padrões de PII em texto livre (CPF, e-mail, telefone, etc.).
 */
export function redactPII(text: string): string {
  return text
    // CPF: 000.000.000-00
    .replace(/\b\d{3}\.\d{3}\.\d{3}-\d{2}\b/g, "[CPF_REDACTED]")
    // CNPJ: 00.000.000/0000-00
    .replace(/\b\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}\b/g, "[CNPJ_REDACTED]")
    // Telefone BR: (00) 00000-0000
    .replace(/\(\d{2}\)\s*\d{4,5}-\d{4}/g, "[TELEFONE_REDACTED]")
    // Cartão de crédito (16 dígitos)
    .replace(/\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g, "[CARTAO_REDACTED]");
}

// ─── Operações Críticas ───────────────────────────────────────────────────────

/** Lista de operações que exigem confirmação explícita */
const CRITICAL_OPERATIONS = new Set([
  "delete.all",
  "truncate.table",
  "reset.user_data",
  "admin.mass_delete",
  "system.factory_reset",
]);

/**
 * Verifica se uma operação é crítica e exige confirmação.
 */
export function isCriticalOperation(operation: string): boolean {
  return CRITICAL_OPERATIONS.has(operation);
}

/**
 * Valida se uma operação crítica tem confirmação explícita.
 * Lança erro se não confirmada.
 */
export function requireConfirmation(
  operation: string,
  confirmed: boolean,
  context: { request_id: string; user_id: number | null }
): void {
  if (isCriticalOperation(operation) && !confirmed) {
    securityLog({
      request_id: context.request_id,
      event: "blocked_operation",
      user_id: context.user_id,
      details: { operation, reason: "confirmation_required" },
    });
    throw new Error(
      `Operação crítica '${operation}' requer confirmação explícita do usuário.`
    );
  }
}
