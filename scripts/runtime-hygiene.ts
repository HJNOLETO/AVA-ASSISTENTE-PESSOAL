import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import {
  cleanupCompletedTasks,
  cleanupExpiredDocuments,
  cleanupOldMemories,
  getAllUsers,
} from "../server/db";

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

async function trimFileIfLarge(filePath: string) {
  try {
    const stat = await fs.stat(filePath);
    if (!stat.isFile() || stat.size <= MAX_LOG_BYTES) {
      return { filePath, trimmed: false, before: stat.size, after: stat.size };
    }

    const data = await fs.readFile(filePath, "utf-8");
    const tail = data.slice(Math.max(0, data.length - KEEP_TAIL_BYTES));
    const banner = `[runtime-hygiene] trimmed at ${new Date().toISOString()} | originalBytes=${stat.size}\n`;
    const next = `${banner}${tail}`;
    await fs.writeFile(filePath, next, "utf-8");
    return { filePath, trimmed: true, before: stat.size, after: Buffer.byteLength(next, "utf-8") };
  } catch {
    return null;
  }
}

async function runDbCleanup() {
  const users = await getAllUsers();
  let docsDeleted = 0;
  let memoriesArchived = 0;
  let tasksDeleted = 0;

  for (const user of users) {
    const docs = await cleanupExpiredDocuments(user.id);
    const memories = await cleanupOldMemories(user.id);
    const tasks = await cleanupCompletedTasks(user.id, 30);
    docsDeleted += docs.deleted;
    memoriesArchived += memories.archived;
    tasksDeleted += tasks.deleted;
  }

  return { users: users.length, docsDeleted, memoriesArchived, tasksDeleted };
}

async function runFileCleanup() {
  const absolutePaths = RUNTIME_FILES.map((rel) => path.resolve(process.cwd(), rel));
  const results = await Promise.all(absolutePaths.map(trimFileIfLarge));
  const valid = results.filter(Boolean) as Array<{
    filePath: string;
    trimmed: boolean;
    before: number;
    after: number;
  }>;

  const trimmed = valid.filter((r) => r.trimmed);
  const reclaimedBytes = trimmed.reduce((acc, r) => acc + (r.before - r.after), 0);

  return {
    checked: valid.length,
    trimmed: trimmed.length,
    reclaimedBytes,
    details: trimmed.map((r) => ({
      file: path.relative(process.cwd(), r.filePath),
      before: r.before,
      after: r.after,
    })),
  };
}

async function main() {
  const [dbResult, fileResult] = await Promise.all([runDbCleanup(), runFileCleanup()]);
  const report = {
    generatedAt: new Date().toISOString(),
    dbCleanup: dbResult,
    fileCleanup: fileResult,
  };
  console.log(JSON.stringify(report, null, 2));
}

main().catch((err) => {
  console.error("[runtime-hygiene] failed:", err);
  process.exit(1);
});
