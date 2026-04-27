import fs from "node:fs/promises";
import path from "node:path";

type ToolRegistryAuditEntry = {
  timestamp: string;
  event: "tool_registry_decision";
  tool_name: string;
  risk_level: "low" | "medium" | "high";
  requires_confirmation: boolean;
  dry_run_requested: boolean;
  allowed: boolean;
  reason: string;
  source: "cli" | "api" | "unknown";
};

const auditPath = path.resolve(process.cwd(), "data", "tool-registry-audit.jsonl");

export async function writeToolRegistryAudit(entry: Omit<ToolRegistryAuditEntry, "timestamp" | "event">) {
  const payload: ToolRegistryAuditEntry = {
    timestamp: new Date().toISOString(),
    event: "tool_registry_decision",
    ...entry,
  };

  try {
    await fs.mkdir(path.dirname(auditPath), { recursive: true });
    await fs.appendFile(auditPath, `${JSON.stringify(payload)}\n`, "utf-8");
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    console.warn(`[ToolRegistry] Falha ao gravar auditoria JSONL: ${details}`);
  }
}
