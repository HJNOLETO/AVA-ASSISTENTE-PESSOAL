import { findRegistryTool } from "./loader";
import { writeToolRegistryAudit } from "./audit";
import type { ToolRegistryExecutionDecision } from "./types";
import { detectInjectionAttempt } from "../security/memoryGuard";

export async function evaluateToolExecution(
  toolName: string,
  args: Record<string, unknown>,
  source: "cli" | "api" | "unknown" = "unknown"
): Promise<ToolRegistryExecutionDecision> {
  // ── C2: Pré-filtro de injeção — verificar todos os valores string dos args ──
  const allStringArgs = Object.values(args)
    .filter((v): v is string => typeof v === "string")
    .join(" ");
  if (allStringArgs) {
    const injection = detectInjectionAttempt(allStringArgs);
    if (injection.detected && (injection.severity === "critical" || injection.severity === "high")) {
      const reason = `bloqueado: injecao detectada [${injection.type}] severity=${injection.severity}`;
      await writeToolRegistryAudit({
        tool_name: toolName,
        risk_level: "high",
        requires_confirmation: false,
        dry_run_requested: false,
        allowed: false,
        reason,
        source,
        // @ts-ignore — campo extra para auditoria de segurança
        injection_type: injection.type,
        injection_severity: injection.severity,
      });
      return {
        allowed: false,
        reason,
        riskLevel: "high",
        requiresConfirmation: false,
        requiresDryRun: false,
        dryRunRequested: false,
      };
    }
  }

  const registryTool = findRegistryTool(toolName);

  if (!registryTool) {
    return {
      allowed: true,
      reason: "ferramenta fora do registro dinamico (fallback legacy)",
      riskLevel: "low",
      requiresConfirmation: false,
      requiresDryRun: false,
      dryRunRequested: false,
    };
  }

  const riskLevel = registryTool.risk_level;
  const requiresDryRun = riskLevel === "medium" || riskLevel === "high";
  const dryRunRequested = args.dry_run === true || args.mode === "dry-run";
  const sandboxEnabled =
    args.sandbox === true ||
    String(process.env.AVA_SANDBOX || "false").toLowerCase() === "true";
  const confirmationProvided =
    args.confirmed === true ||
    args.confirmation === true ||
    args.requires_confirmation_ack === true;

  const requiresConfirmation = Boolean(registryTool.requires_confirmation);

  let allowed = true;
  let reason = "execucao permitida";

  if (requiresDryRun && !dryRunRequested) {
    allowed = false;
    reason = "bloqueado: risco >= medio exige dry_run=true";
  } else if (riskLevel === "high" && !sandboxEnabled) {
    allowed = false;
    reason = "bloqueado: risco high exige sandbox ativo";
  } else if (requiresConfirmation && !confirmationProvided) {
    allowed = false;
    reason = "bloqueado: confirmacao explicita obrigatoria";
  }

  await writeToolRegistryAudit({
    tool_name: toolName,
    risk_level: riskLevel,
    requires_confirmation: requiresConfirmation,
    dry_run_requested: dryRunRequested,
    allowed,
    reason,
    source,
  });

  return {
    allowed,
    reason,
    riskLevel,
    requiresConfirmation,
    requiresDryRun,
    dryRunRequested,
  };
}
