import "dotenv/config";
import path from "node:path";
import { promises as fs } from "node:fs";

const PROJECT_ROOT = process.cwd();
const DEFAULT_DATA_DIR = path.resolve(
  PROJECT_ROOT,
  "..",
  `${path.basename(PROJECT_ROOT)}-dados`
);
const DEFAULT_BACKUP_DIR = path.resolve(
  PROJECT_ROOT,
  "..",
  `${path.basename(PROJECT_ROOT)}-backup`
);

function getDataDir() {
  return process.env.AVA_DATA_DIR
    ? path.resolve(process.env.AVA_DATA_DIR)
    : DEFAULT_DATA_DIR;
}

function getBackupDir() {
  return process.env.AVA_BACKUP_DIR
    ? path.resolve(process.env.AVA_BACKUP_DIR)
    : DEFAULT_BACKUP_DIR;
}

function nowStamp() {
  const date = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}${pad(date.getMonth() + 1)}${pad(date.getDate())}-${pad(date.getHours())}${pad(date.getMinutes())}${pad(date.getSeconds())}`;
}

function resolveDatabaseFile(): string {
  const raw = process.env.DATABASE_URL || "file:./sqlite_v2.db";
  if (raw.startsWith("file:")) {
    const dbPath = raw.slice("file:".length);
    return path.resolve(PROJECT_ROOT, dbPath);
  }
  throw new Error(`DATABASE_URL nao suportada para backup local: ${raw}`);
}

async function copyIfExists(source: string, target: string): Promise<boolean> {
  const stat = await fs.stat(source).catch(() => null);
  if (!stat) return false;

  await fs.mkdir(path.dirname(target), { recursive: true });
  if (stat.isDirectory()) {
    await fs.cp(source, target, { recursive: true });
  } else {
    await fs.copyFile(source, target);
  }
  return true;
}

async function run() {
  const dataDir = getDataDir();
  const backupRoot = getBackupDir();
  const snapshotDir = path.join(backupRoot, `rag-backup-${nowStamp()}`);
  const dbFile = resolveDatabaseFile();

  await fs.mkdir(snapshotDir, { recursive: true });

  const copied: string[] = [];
  const skipped: string[] = [];

  const targets: Array<{ source: string; target: string; label: string }> = [
    {
      source: dbFile,
      target: path.join(snapshotDir, "runtime", path.basename(dbFile)),
      label: "sqlite database",
    },
    {
      source: path.join(dataDir, ".rag", "drive-sync-manifest.json"),
      target: path.join(snapshotDir, "rag", "drive-sync-manifest.json"),
      label: "rag manifest",
    },
    {
      source: path.join(dataDir, "google-drive-embeddings", "json"),
      target: path.join(snapshotDir, "data", "google-drive-embeddings", "json"),
      label: "legacy embeddings json",
    },
  ];

  for (const item of targets) {
    const ok = await copyIfExists(item.source, item.target);
    if (ok) {
      copied.push(item.label);
    } else {
      skipped.push(item.label);
    }
  }

  const metadata = {
    createdAt: new Date().toISOString(),
    projectRoot: PROJECT_ROOT,
    dataDir,
    backupRoot,
    databaseFile: dbFile,
    copied,
    skipped,
  };

  await fs.writeFile(
    path.join(snapshotDir, "backup-metadata.json"),
    JSON.stringify(metadata, null, 2),
    "utf-8"
  );

  console.log(`[RAG][Backup] Snapshot: ${snapshotDir}`);
  console.log(`[RAG][Backup] Copiados: ${copied.join(", ") || "nenhum"}`);
  console.log(`[RAG][Backup] Ignorados: ${skipped.join(", ") || "nenhum"}`);
}

run().catch((error) => {
  console.error("[RAG][Backup] Falha:", error);
  process.exitCode = 1;
});
