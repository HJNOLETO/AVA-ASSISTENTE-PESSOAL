import { findRegistryTool } from "./loader";
import { writeToolRegistryAudit } from "./audit";
import type { ToolRegistryExecutionDecision } from "./types";

export async function evaluateToolExecution(
  toolName: string,
  args: Record<string, unknown>,
  source: "cli" | "api" | "unknown" = "unknown"
): Promise<ToolRegistryExecutionDecision> {
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
