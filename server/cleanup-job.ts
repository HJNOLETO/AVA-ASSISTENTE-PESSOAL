import { cleanupExpiredDocuments, cleanupOldMemories, cleanupCompletedTasks, getAllUsers } from "./db";
import fs from "fs/promises";
import path from "path";

const CLEANUP_INTERVAL_HOURS = 24;
const MAX_LOG_BYTES = Number(process.env.AVA_HYGIENE_MAX_LOG_BYTES || 2 * 1024 * 1024);
const KEEP_TAIL_BYTES = Number(process.env.AVA_HYGIENE_KEEP_TAIL_BYTES || 512 * 1024);

const RUNTIME_FILES = [
  "dev-runtime.log",
  "test-output.txt",
  "tsc-errors.txt",
  path.join("data", "ava-unified-audit.log"),
  path.join("data", "ava-cli-audit.log"),
  path.join("data", "ava-demanding-2h.log"),
  path.join("data", "study-collector.log"),
  path.join("data", "study-collector-2h.log"),
  path.join("data", "telegram-study-bot.log"),
  path.join("data", "tool-registry-audit.jsonl"),
  path.join("data", "ingest-audit.jsonl"),
  path.join("data", "agent-cycles.jsonl"),
  path.join("data", "host-action-memory.jsonl"),
];

async function trimFileIfLarge(filePath: string): Promise<number> {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile() || stat.size <= MAX_LOG_BYTES) return 0;
    const data = await fs.readFile(filePath, "utf-8");
    const tail = data.slice(Math.max(0, data.length - KEEP_TAIL_BYTES));
    const banner = `[cleanup-job] trimmed at ${new Date().toISOString()} | originalBytes=${stat.size}\n`;
    const next = `${banner}${tail}`;
    await fs.writeFile(filePath, next, "utf-8");
    const after = Buffer.byteLength(next, "utf-8");
    return Math.max(0, stat.size - after);
  } catch {
    return 0;
  }
}

async function cleanupRuntimeFiles() {
  const files = RUNTIME_FILES.map((rel) => path.resolve(process.cwd(), rel));
  const reclaimed = await Promise.all(files.map(trimFileIfLarge));
  const total = reclaimed.reduce((acc, n) => acc + n, 0);
  if (total > 0) {
    console.log(`[CleanupJob] Runtime artifacts trimmed: ${(total / 1024).toFixed(1)} KB reclaimed`);
  }
}

export function startCleanupJob() {
  console.log(`[CleanupJob] Starting cleanup job (interval: ${CLEANUP_INTERVAL_HOURS}h)`);
  
  const runCleanup = async () => {
    try {
      console.log("[CleanupJob] Running cleanup...");
      
      const users = await getAllUsers();
      
      for (const user of users) {
        try {
          const expiredDocs = await cleanupExpiredDocuments(user.id);
          const oldMemories = await cleanupOldMemories(user.id);
          const oldTasks = await cleanupCompletedTasks(user.id, 30);
          
          const total = expiredDocs.deleted + oldMemories.archived + oldTasks.deleted;
          if (total > 0) {
            console.log(`[CleanupJob] User ${user.id}: ${expiredDocs.deleted} docs, ${oldMemories.archived} memories, ${oldTasks.deleted} tasks cleaned`);
          }
        } catch (userError) {
          console.warn(`[CleanupJob] Error cleaning user ${user.id}:`, userError);
        }
      }

      await cleanupRuntimeFiles();
      
      console.log("[CleanupJob] Cleanup completed");
    } catch (error) {
      console.error("[CleanupJob] Cleanup failed:", error);
    }
  };
  
  runCleanup();
  
  setInterval(runCleanup, CLEANUP_INTERVAL_HOURS * 60 * 60 * 1000);
}
