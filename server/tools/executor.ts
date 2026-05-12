import { runDbOps } from "./db_ops";
import { runFileOps } from "./file_ops";
import { runHttpOps } from "./http_ops";
import { runIngestOps } from "./ingest_ops";
import { runSandboxed } from "./sandbox";
import {
  addMemoryEntry,
  archiveMemoryEntry,
  explainMemoryEntries,
  listMemoryEntries,
  pruneExpiredMemory,
  searchMemoryByKeywords,
} from "../db";

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
    const action = String(args.action || "search").trim().toLowerCase();
    const userId = Number(args.userId || 1);
    if (!Number.isFinite(userId) || userId <= 0) {
      throw new Error("userId invalido para memory_ops");
    }

    if (action === "save") {
      const content = String(args.content || "").trim();
      if (!content) throw new Error("content obrigatorio para memory_ops.save");
      const keywords = typeof args.keywords === "string" ? args.keywords : undefined;
      const typeRaw = String(args.type || "fact").trim().toLowerCase();
      const type = (typeRaw === "fact" || typeRaw === "preference" || typeRaw === "context" || typeRaw === "command")
        ? typeRaw
        : "fact";
      const ttlMap: Record<string, number> = {
        preference: 365 * 24 * 60 * 60,
        fact: 180 * 24 * 60 * 60,
        context: 30 * 24 * 60 * 60,
        command: 7 * 24 * 60 * 60,
      };
      const ttlSeconds = Number(args.ttlSeconds);
      const effectiveTtl = Number.isFinite(ttlSeconds) && ttlSeconds > 0
        ? Math.floor(ttlSeconds)
        : ttlMap[type] || ttlMap.fact;
      const out = await addMemoryEntry(userId, content, keywords, type, effectiveTtl);
      return JSON.stringify({ ok: true, action, result: out });
    }

    if (action === "search") {
      const query = String(args.query || args.keywords || "").trim();
      if (!query) throw new Error("query obrigatoria para memory_ops.search");
      const items = await searchMemoryByKeywords(userId, query);
      return JSON.stringify({ ok: true, action, count: items.length, items });
    }

    if (action === "list") {
      const limit = Number(args.limit || 20);
      const items = await listMemoryEntries(userId, limit);
      return JSON.stringify({ ok: true, action, count: items.length, items });
    }

    if (action === "delete") {
      const id = Number(args.id);
      if (!Number.isFinite(id) || id <= 0) throw new Error("id obrigatorio para memory_ops.delete");
      const out = await archiveMemoryEntry(userId, id);
      return JSON.stringify({ ok: out.updated > 0, action, result: out });
    }

    if (action === "explain") {
      const query = String(args.query || args.keywords || "").trim();
      if (!query) throw new Error("query obrigatoria para memory_ops.explain");
      const limit = Number(args.limit || 5);
      const items = await explainMemoryEntries(userId, query, limit);
      return JSON.stringify({ ok: true, action, count: items.length, items });
    }

    if (action === "prune") {
      const result = await pruneExpiredMemory(userId);
      return JSON.stringify({ ok: true, action, result });
    }

    throw new Error(`acao nao suportada em memory_ops: ${action}`);
  }
  if (name === "ingest_ops") {
    return runIngestOps(args as any);
  }
  if (name === "legal_rag_ops") {
    return `[DRY-RUN] legal_rag_ops action=${String(args.action || "ask")}`;
  }
  throw new Error(`Ferramenta nao suportada no executor: ${name}`);
}
