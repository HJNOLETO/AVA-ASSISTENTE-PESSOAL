/**
 * GUARD RAILS — Audit Logger (dependência do Policy Router)
 *
 * Logs estruturados JSON com rastreabilidade por request_id.
 * Cada decisão de política e evento de segurança é registrado aqui.
 */

export interface AuditEntry {
  request_id: string;
  event: string;
  timestamp: string;
  user_id?: number | null;
  user_role?: string;
  canal?: string;
  intent?: string;
  risk_level?: string;
  confidence?: number;
  policy_rule?: string;
  decision?: string;
  audit_required?: boolean;
  details?: Record<string, unknown>;
}

// Buffer em memória para diagnóstico recente (sliding window de 500 entradas)
const LOG_BUFFER_MAX = 500;
const logBuffer: AuditEntry[] = [];

/**
 * Registra um evento de auditoria estruturado.
 * Persiste em console (JSON) e buffer em memória.
 */
export function auditLog(entry: AuditEntry): void {
  const structured: AuditEntry = {
    ...entry,
    timestamp: entry.timestamp ?? new Date().toISOString(),
  };

  // Persiste em console como JSON estruturado (capturável por log aggregators)
  console.log(JSON.stringify({ level: "audit", ...structured }));

  // Buffer em memória para diagnóstico rápido
  logBuffer.push(structured);
  if (logBuffer.length > LOG_BUFFER_MAX) {
    logBuffer.shift();
  }
}

/**
 * Registra um evento de segurança crítico.
 */
export function securityLog(params: {
  request_id: string;
  event: "blocked_operation" | "sanitization_applied" | "redaction_applied" | "rbac_denied" | "confirmation_required";
  user_id: number | null;
  details?: Record<string, unknown>;
}): void {
  auditLog({
    request_id: params.request_id,
    event: params.event,
    user_id: params.user_id,
    timestamp: new Date().toISOString(),
    details: params.details,
  });
}

/**
 * Registra a entrada de uma nova requisição no pipeline.
 */
export function logPipelineEntry(params: {
  request_id: string;
  canal: string;
  user_id: number | null;
  payload_type: string;
}): void {
  auditLog({
    request_id: params.request_id,
    event: "pipeline_entry",
    canal: params.canal,
    user_id: params.user_id,
    timestamp: new Date().toISOString(),
    details: { payload_type: params.payload_type },
  });
}

/**
 * Registra a saída do pipeline com status final.
 */
export function logPipelineExit(params: {
  request_id: string;
  status: "success" | "error" | "fallback" | "blocked";
  latency_ms: number;
  error?: string;
}): void {
  auditLog({
    request_id: params.request_id,
    event: "pipeline_exit",
    timestamp: new Date().toISOString(),
    details: {
      status: params.status,
      latency_ms: params.latency_ms,
      error: params.error,
    },
  });
}

/**
 * Retorna logs recentes para diagnóstico de incidente.
 * Permite filtrar por request_id para rastrear um fluxo específico.
 */
export function getRecentLogs(params?: {
  request_id?: string;
  event?: string;
  limit?: number;
}): AuditEntry[] {
  let filtered = [...logBuffer];

  if (params?.request_id) {
    filtered = filtered.filter(e => e.request_id === params.request_id);
  }

  if (params?.event) {
    filtered = filtered.filter(e => e.event === params.event);
  }

  const limit = params?.limit ?? 50;
  return filtered.slice(-limit);
}
