import "dotenv/config";
import path from "node:path";
import { promises as fs } from "node:fs";
import { createHash } from "node:crypto";
import { asc, eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import {
  createDocumentChunkBatch,
  createDocumentRAG,
  getDb,
  getDocumentByExternalId,
  hardDeleteDocument,
  updateDocumentProgress,
  updateDocumentStatusById,
} from "../server/db";
import { chunkText, extractText } from "../server/rag";
import { generateEmbedding } from "../server/_core/llm";

type ManifestEntry = {
  sha256: string;
  documentId: number;
  updatedAt: string;
};

type Manifest = Record<string, ManifestEntry>;

const PROJECT_ROOT = process.cwd();
const DEFAULT_DATA_DIR = path.resolve(
  PROJECT_ROOT,
  "..",
  `${path.basename(PROJECT_ROOT)}-dados`
);
const DATA_DIR = process.env.AVA_DATA_DIR
  ? path.resolve(process.env.AVA_DATA_DIR)
  : DEFAULT_DATA_DIR;
const DEFAULT_DRIVE_SYNC_DIR = process.env.AVA_DRIVE_SYNC_DIR
  ? path.resolve(process.env.AVA_DRIVE_SYNC_DIR)
  : path.join(DATA_DIR, "Drive_Sync");
const DEFAULT_MANIFEST_PATH = process.env.AVA_MANIFEST_PATH
  ? path.resolve(process.env.AVA_MANIFEST_PATH)
  : path.join(DATA_DIR, ".rag", "drive-sync-manifest.json");
const DEFAULT_BATCH_SIZE = 10;

const SUPPORTED_EXTENSIONS = new Set([
  ".txt",
  ".md",
  ".pdf",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".csv",
  ".json",
  ".html",
  ".htm",
  ".js",
  ".ts",
  ".jsx",
  ".tsx",
  ".png",
  ".jpg",
  ".jpeg",
  ".webp",
  ".gif",
  ".bmp",
  ".tiff",
  ".tif",
]);

function parseArgs() {
  const args = process.argv.slice(2);
  const values: Record<string, string | boolean> = {};
  for (let i = 0; i < args.length; i += 1) {
    const raw = args[i];
    if (!raw.startsWith("--")) continue;
    const key = raw.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith("--")) {
      values[key] = true;
    } else {
      values[key] = next;
      i += 1;
    }
  }

  return {
    userId: values["user-id"] ? Number(values["user-id"]) : undefined,
    driveDir: typeof values["drive-dir"] === "string" ? values["drive-dir"] : DEFAULT_DRIVE_SYNC_DIR,
    manifestPath:
      typeof values["manifest"] === "string" ? values["manifest"] : DEFAULT_MANIFEST_PATH,
    batchSize:
      typeof values["batch-size"] === "string"
        ? Math.max(1, Number(values["batch-size"]))
        : DEFAULT_BATCH_SIZE,
    purgeMissing: values["purge-missing"] === true,
  };
}

function ensureNomicModelDefault() {
  if (!process.env.EMBEDDING_MODEL) {
    process.env.EMBEDDING_MODEL = "nomic-embed-text:latest";
  }
}

async function checkOllamaAvailable(baseUrl: string) {
  const url = `${baseUrl.replace(/\/$/, "")}/api/tags`;
  const response = await fetch(url, { method: "GET" });
  if (!response.ok) {
    throw new Error(`Falha ao consultar Ollama em ${url}: ${response.status} ${response.statusText}`);
  }
  const data = (await response.json()) as { models?: Array<{ name?: string }> };
  const modelName = process.env.EMBEDDING_MODEL || "nomic-embed-text:latest";
  const expected = modelName.split(":")[0];
  const models = (data.models || []).map((m) => m.name || "");
  const found = models.some((name) => name.includes(expected));
  if (!found) {
    throw new Error(
      `Modelo de embedding nao encontrado no Ollama. Esperado: ${modelName}. Disponiveis: ${models.join(", ") || "nenhum"}`
    );
  }
}

async function loadManifest(filePath: string): Promise<Manifest> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Manifest;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function saveManifest(filePath: string, manifest: Manifest): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(manifest, null, 2), "utf-8");
}

async function getAllFiles(rootDir: string): Promise<string[]> {
  const results: string[] = [];

  async function walk(current: string) {
    const entries = await fs.readdir(current, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        await walk(fullPath);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        results.push(fullPath);
      }
    }
  }

  await walk(rootDir);
  return results.sort((a, b) => a.localeCompare(b));
}

function mimeTypeFromFileName(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  const map: Record<string, string> = {
    ".txt": "text/plain",
    ".md": "text/markdown",
    ".pdf": "application/pdf",
    ".doc": "application/msword",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".xls": "application/vnd.ms-excel",
    ".xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ".csv": "text/csv",
    ".json": "application/json",
    ".html": "text/html",
    ".htm": "text/html",
    ".js": "text/javascript",
    ".ts": "text/plain",
    ".jsx": "text/plain",
    ".tsx": "text/plain",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webp": "image/webp",
    ".gif": "image/gif",
    ".bmp": "image/bmp",
    ".tiff": "image/tiff",
    ".tif": "image/tiff",
  };
  return map[ext] || "application/octet-stream";
}

function externalIdFromRelativePath(relativePath: string): string {
  const normalized = relativePath.replace(/\\/g, "/").toLowerCase();
  return `drive_sync:${normalized}`;
}

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

async function resolveUserId(cliUserId?: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponivel.");

  if (cliUserId) {
    const found = await db.select().from(users).where(eq(users.id, cliUserId)).limit(1);
    if (!found[0]) {
      throw new Error(`Usuario ${cliUserId} nao encontrado.`);
    }
    return cliUserId;
  }

  const first = await db.select().from(users).orderBy(asc(users.id)).limit(1);
  if (!first[0]) {
    throw new Error("Nenhum usuario encontrado no banco. Crie um usuario antes de indexar.");
  }
  return first[0].id;
}

async function run() {
  ensureNomicModelDefault();
  const args = parseArgs();
  const driveDir = path.resolve(args.driveDir);
  const manifestPath = path.resolve(args.manifestPath);
  const userId = await resolveUserId(args.userId);
  const ollamaBaseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434";

  await checkOllamaAvailable(ollamaBaseUrl);

  const stat = await fs.stat(driveDir).catch(() => null);
  if (!stat) {
    await fs.mkdir(driveDir, { recursive: true });
    console.warn(`[RAG][DriveSync] Pasta criada automaticamente: ${driveDir}`);
  } else if (!stat.isDirectory()) {
    throw new Error(`Caminho nao e pasta: ${driveDir}`);
  }

  const files = await getAllFiles(driveDir);
  const manifest = await loadManifest(manifestPath);
  const nextManifest: Manifest = { ...manifest };
  const seenKeys = new Set<string>();

  let processed = 0;
  let skipped = 0;
  let failed = 0;

  console.log(`[RAG][DriveSync] Usuario: ${userId}`);
  console.log(`[RAG][DriveSync] Data dir: ${DATA_DIR}`);
  console.log(`[RAG][DriveSync] Pasta: ${driveDir}`);
  console.log(`[RAG][DriveSync] Arquivos elegiveis: ${files.length}`);

  for (const fullPath of files) {
    const relativePath = path.relative(driveDir, fullPath);
    const key = relativePath.replace(/\\/g, "/");
    seenKeys.add(key);

    try {
      const fileBuffer = await fs.readFile(fullPath);
      const hash = sha256(fileBuffer);
      const previous = manifest[key];
      if (previous?.sha256 === hash) {
        skipped += 1;
        continue;
      }

      const fileName = path.basename(fullPath);
      const mimeType = mimeTypeFromFileName(fileName);
      const externalId = externalIdFromRelativePath(key);

      const existing = await getDocumentByExternalId(userId, externalId);
      if (existing) {
        await hardDeleteDocument(userId, existing.id);
      }

      const extracted = await extractText(fileName, mimeType, fileBuffer);
      const text = extracted.replace(/\s+/g, " ").trim();
      if (!text) {
        console.warn(`[RAG][DriveSync] Sem texto util: ${key}`);
        skipped += 1;
        continue;
      }

      const chunks = chunkText(text);
      const estimatedSizeKB = Math.ceil((text.length + chunks.length * 768 * 4) / 1024);

      const createResult = await createDocumentRAG(userId, {
        name: fileName,
        filename: key,
        type: mimeType,
        size: fileBuffer.length,
        status: "processing",
        isIndexed: 0,
        externalId,
        sourceType: "drive_sync",
        legalStatus: "vigente",
        totalChunks: chunks.length,
        indexedChunks: 0,
        estimatedSizeKB,
        embeddingProvider: "ollama",
        embeddingModel: process.env.EMBEDDING_MODEL,
      });

      const documentId = Number((createResult as any)?.lastInsertRowid || (createResult as any)?.[0]?.id);
      if (!Number.isFinite(documentId) || documentId <= 0) {
        throw new Error(`Falha ao criar documento para ${key}`);
      }

      let indexed = 0;
      for (let i = 0; i < chunks.length; i += args.batchSize) {
        const batch = chunks.slice(i, i + args.batchSize);
        const vectors = await Promise.all(batch.map((chunk) => generateEmbedding(chunk.content, "ollama")));

        const rows = batch.map((chunk, offset) => ({
          documentId,
          chunkIndex: chunk.chunkIndex,
          content: chunk.content,
          metadata: JSON.stringify(chunk.metadata || {}),
          embedding: JSON.stringify(vectors[offset]),
          embeddingProvider: "ollama",
          embeddingModel: process.env.EMBEDDING_MODEL || "nomic-embed-text:latest",
          embeddingDimensions: vectors[offset].length,
        }));

        await createDocumentChunkBatch(rows);
        indexed += batch.length;
        await updateDocumentProgress(documentId, indexed, chunks.length);
      }

      await updateDocumentStatusById(documentId, "indexed");

      nextManifest[key] = {
        sha256: hash,
        documentId,
        updatedAt: new Date().toISOString(),
      };

      processed += 1;
      console.log(`[RAG][DriveSync] Indexado: ${key} (${chunks.length} chunks)`);
    } catch (error) {
      failed += 1;
      console.error(`[RAG][DriveSync] Erro em ${key}:`, error);
    }
  }

  if (args.purgeMissing) {
    const missingKeys = Object.keys(nextManifest).filter((k) => !seenKeys.has(k));
    for (const missingKey of missingKeys) {
      const externalId = externalIdFromRelativePath(missingKey);
      const existing = await getDocumentByExternalId(userId, externalId);
      if (existing) {
        await hardDeleteDocument(userId, existing.id);
      }
      delete nextManifest[missingKey];
      console.log(`[RAG][DriveSync] Removido (nao existe mais no Drive_Sync): ${missingKey}`);
    }
  }

  await saveManifest(manifestPath, nextManifest);
  console.log("\n[RAG][DriveSync] Concluido");
  console.log(`[RAG][DriveSync] Processados: ${processed}`);
  console.log(`[RAG][DriveSync] Ignorados (sem alteracao/sem texto): ${skipped}`);
  console.log(`[RAG][DriveSync] Falhas: ${failed}`);
  console.log(`[RAG][DriveSync] Manifesto: ${manifestPath}`);
}

run().catch((error) => {
  console.error("[RAG][DriveSync] Falha fatal:", error);
  process.exitCode = 1;
});
