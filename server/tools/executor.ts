import { runDbOps } from "./db_ops";
import { runFileOps } from "./file_ops";
import { runHttpOps } from "./http_ops";
import { runIngestOps } from "./ingest_ops";
import { runSandboxed } from "./sandbox";

export async function executeRegisteredTool(name: string, args: Record<string, unknown>): Promise<string> {
  if (name === "file_ops") {
    return runFileOps(args as any);
  }
  if (name === "http_ops") {
    return runHttpOps(args as any);
  }
  if (name === "db_ops") {
    return runDbOps(args as any);
  }
  if (name === "sandbox_exec") {
    const command = String(args.command || "").trim();
    if (!command) throw new Error("command obrigatorio para sandbox_exec");
    const out = await runSandboxed(command);
    return JSON.stringify(out);
  }
  if (name === "memory_ops") {
    const action = String(args.action || "").trim();
    const namespace = String(args.namespace || "default").trim();
    const key = String(args.key || "").trim();
    return `[SIMULADO] memory_ops ${action} ${namespace}:${key}`;
  }
  if (name === "ingest_ops") {
    return runIngestOps(args as any);
  }
  if (name === "legal_rag_ops") {
    return `[DRY-RUN] legal_rag_ops action=${String(args.action || "ask")}`;
  }
  throw new Error(`Ferramenta nao suportada no executor: ${name}`);
}
