import "dotenv/config";
import path from "node:path";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import { asc, eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { addMemoryEntry, getDb } from "../server/db";
import { generateEmbedding } from "../server/_core/llm";
import { chunkText, extractText } from "../server/rag";

type Phase = "embed" | "import" | "all";

type PipelineFileState = {
  sourcePath: string;
  fileHash: string;
  outputFile: string;
  totalChunks: number;
  embeddedChunks: number;
  importedChunks: number;
  nextChunkIndex: number;
  nextImportIndex: number;
  status: "pending" | "partial" | "embedded" | "imported" | "failed";
  updatedAt: string;
  error?: string;
};

type EmbeddingItem = {
  id: string;
  sourcePath: string;
  chunkIndex: number;
  chunkHash: string;
  content: string;
  embedding: number[];
};

type EmbeddingFile = {
  sourcePath: string;
  fileHash: string;
  model: string;
  provider: "ollama" | "forge";
  totalChunks: number;
  items: EmbeddingItem[];
};

type Manifest = {
  version: string;
  files: Record<string, PipelineFileState>;
};

const PROJECT_ROOT = process.cwd();
const DEFAULT_DATA_DIR = path.resolve(PROJECT_ROOT, "..", `${path.basename(PROJECT_ROOT)}-dados`);
const DEFAULT_INPUT_DIR = path.join(DEFAULT_DATA_DIR, "Drive_Sync", "conhecimentos-sobre-AVA");
const DEFAULT_PIPELINE_DIR = path.join(DEFAULT_DATA_DIR, ".rag", "memory-pipeline");
const DEFAULT_EMBEDDINGS_DIR = path.join(DEFAULT_PIPELINE_DIR, "embeddings");
const DEFAULT_MANIFEST_PATH = path.join(DEFAULT_PIPELINE_DIR, "manifest.json");

const SUPPORTED_EXTENSIONS = new Set([".md", ".txt", ".pdf"]);

function parseArgs() {
  const args = process.argv.slice(2);
  const values: Record<string, string | boolean> = {};

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith("--")) {
      values[key] = true;
    } else {
      values[key] = next;
      i += 1;
    }
  }

  const phaseRaw = String(values["phase"] || "all").toLowerCase();
  const phase: Phase = phaseRaw === "embed" || phaseRaw === "import" || phaseRaw === "all" ? phaseRaw : "all";

  return {
    phase,
    userId: typeof values["user-id"] === "string" ? Number(values["user-id"]) : undefined,
    inputDir: typeof values["input-dir"] === "string" ? path.resolve(values["input-dir"]) : DEFAULT_INPUT_DIR,
    pipelineDir: typeof values["pipeline-dir"] === "string" ? path.resolve(values["pipeline-dir"]) : DEFAULT_PIPELINE_DIR,
    batchSize: typeof values["batch-size"] === "string" ? Math.max(1, Number(values["batch-size"])) : 8,
    maxChunksPerRun:
      typeof values["max-chunks-per-run"] === "string" ? Math.max(1, Number(values["max-chunks-per-run"])) : 0,
    maxImportsPerRun:
      typeof values["max-imports-per-run"] === "string" ? Math.max(1, Number(values["max-imports-per-run"])) : 0,
    embeddingProvider: (String(values["embedding-provider"] || "ollama").toLowerCase() === "forge"
      ? "forge"
      : "ollama") as "ollama" | "forge",
    embeddingModel:
      typeof values["embedding-model"] === "string"
        ? values["embedding-model"]
        : process.env.EMBEDDING_MODEL || "nomic-embed-text:latest",
    dryRun: values["dry-run"] === true,
  };
}

function sha256(buffer: Buffer | string): string {
  return createHash("sha256").update(buffer).digest("hex");
}

function toPosix(p: string): string {
  return p.replace(/\\/g, "/");
}

function mimeTypeFromExt(fileName: string): string {
  const ext = path.extname(fileName).toLowerCase();
  if (ext === ".md") return "text/markdown";
  if (ext === ".txt") return "text/plain";
  if (ext === ".pdf") return "application/pdf";
  return "application/octet-stream";
}

function buildOutputFileName(sourcePath: string): string {
  const sourceHash = sha256(sourcePath).slice(0, 16);
  const safeName = path.basename(sourcePath).replace(/[^a-zA-Z0-9._-]+/g, "_");
  return `${safeName}.${sourceHash}.embeddings.json`;
}

async function resolveUserId(cliUserId?: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponivel.");

  if (cliUserId) {
    const found = await db.select().from(users).where(eq(users.id, cliUserId)).limit(1);
    if (!found[0]) throw new Error(`Usuario ${cliUserId} nao encontrado.`);
    return cliUserId;
  }

  const first = await db.select().from(users).orderBy(asc(users.id)).limit(1);
  if (!first[0]) throw new Error("Nenhum usuario encontrado no banco.");
  return first[0].id;
}

async function listFilesRecursive(rootDir: string): Promise<string[]> {
  const out: string[] = [];
  const stack = [rootDir];

  while (stack.length > 0) {
    const current = stack.pop()!;
    const entries = await fs.readdir(current, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(fullPath);
        continue;
      }
      const ext = path.extname(entry.name).toLowerCase();
      if (SUPPORTED_EXTENSIONS.has(ext)) {
        out.push(fullPath);
      }
    }
  }

  return out.sort((a, b) => a.localeCompare(b));
}

async function loadManifest(filePath: string): Promise<Manifest> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Manifest;
    if (parsed && parsed.files) return parsed;
  } catch {
    // ignore
  }
  return { version: "1.0", files: {} };
}

async function saveManifest(filePath: string, manifest: Manifest): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(manifest, null, 2), "utf-8");
}

async function loadEmbeddingFile(filePath: string, fallback: EmbeddingFile): Promise<EmbeddingFile> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as EmbeddingFile;
    if (Array.isArray(parsed.items)) return parsed;
  } catch {
    // ignore
  }
  return fallback;
}

async function saveEmbeddingFile(filePath: string, content: EmbeddingFile): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(content, null, 2), "utf-8");
}

function buildMemoryKeywords(sourcePath: string, chunkTextValue: string): string {
  const base = path.basename(sourcePath, path.extname(sourcePath)).toLowerCase();
  const tokens = (base + " " + chunkTextValue.slice(0, 180))
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s_-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4);
  const counts = new Map<string, number>();
  for (const token of tokens) counts.set(token, (counts.get(token) || 0) + 1);
  const top = [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([w]) => w);
  return [...new Set(["pipeline", "rag", ...top])].join(", ");
}

function decodeTextBuffer(buffer: Buffer): string {
  const utf8 = buffer.toString("utf-8");
  const utf8Clean = utf8.replace(/\u0000/g, "").trim();
  if (utf8Clean.length > 0) return utf8;

  const latin1 = buffer.toString("latin1");
  const latin1Clean = latin1.replace(/\u0000/g, "").trim();
  if (latin1Clean.length > 0) return latin1;

  return "";
}

async function extractTextForPipeline(filePath: string, fileBuffer: Buffer): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".txt" || ext === ".md") {
    return decodeTextBuffer(fileBuffer);
  }

  const mimeType = mimeTypeFromExt(filePath);
  return extractText(path.basename(filePath), mimeType, fileBuffer);
}

async function generateEmbeddingWithRetry(
  text: string,
  provider: "ollama" | "forge",
  maxAttempts = 3
): Promise<number[]> {
  let lastError: unknown;
  let currentText = text;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      return await generateEmbedding(currentText, provider);
    } catch (error: any) {
      lastError = error;
      const message = String(error?.message || error || "").toLowerCase();
      const isAbort = message.includes("aborted") || message.includes("aborterror");

      if (isAbort && currentText.length > 4000) {
        currentText = currentText.slice(0, Math.floor(currentText.length * 0.7));
      }

      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, 1200 * attempt));
      }
    }
  }

  throw lastError;
}

async function runEmbedPhase(args: ReturnType<typeof parseArgs>, manifest: Manifest) {
  const files = await listFilesRecursive(args.inputDir);
  console.log(`[Pipeline][Embed] Arquivos encontrados: ${files.length}`);

  let processedFiles = 0;
  let skippedFiles = 0;
  let failedFiles = 0;
  let embeddedChunksThisRun = 0;

  for (const filePath of files) {
    const relativePath = toPosix(path.relative(args.inputDir, filePath));
    const sourceKey = relativePath;

    try {
      const fileBuffer = await fs.readFile(filePath);
      const fileHash = sha256(fileBuffer);
      const outputFileName = buildOutputFileName(relativePath);
      const outputFile = path.join(args.pipelineDir, "embeddings", outputFileName);
      const previous = manifest.files[sourceKey];

      const changed = !previous || previous.fileHash !== fileHash;
      let state: PipelineFileState = changed
        ? {
            sourcePath: relativePath,
            fileHash,
            outputFile,
            totalChunks: 0,
            embeddedChunks: 0,
            importedChunks: 0,
            nextChunkIndex: 0,
            nextImportIndex: 0,
            status: "pending",
            updatedAt: new Date().toISOString(),
          }
        : previous;

      const extracted = await extractTextForPipeline(filePath, fileBuffer);
      const cleaned = extracted.replace(/\s+/g, " ").trim();
      if (!cleaned) {
        state.status = "failed";
        state.error = "Sem texto extraido";
        state.updatedAt = new Date().toISOString();
        manifest.files[sourceKey] = state;
        failedFiles += 1;
        console.warn(`[Pipeline][Embed] Sem texto: ${relativePath}`);
        continue;
      }

      const chunks = chunkText(cleaned);
      state.totalChunks = chunks.length;

      if (state.embeddedChunks >= state.totalChunks && !changed) {
        skippedFiles += 1;
        console.log(`[Pipeline][Embed] Sem mudanca: ${relativePath}`);
        continue;
      }

      const defaultEmbeddingFile: EmbeddingFile = {
        sourcePath: relativePath,
        fileHash,
        model: args.embeddingModel,
        provider: args.embeddingProvider,
        totalChunks: chunks.length,
        items: [],
      };

      let embeddingFile = changed
        ? defaultEmbeddingFile
        : await loadEmbeddingFile(outputFile, defaultEmbeddingFile);

      if (changed) {
        embeddingFile.items = [];
        state.embeddedChunks = 0;
        state.nextChunkIndex = 0;
        state.importedChunks = 0;
        state.nextImportIndex = 0;
      }

      for (let i = state.nextChunkIndex; i < chunks.length; i += 1) {
        const chunk = chunks[i];
        try {
          const vector = await generateEmbeddingWithRetry(chunk.content, args.embeddingProvider, 3);
          const content = chunk.content.trim();
          const chunkHash = sha256(content);
          const id = `${sha256(relativePath).slice(0, 12)}:${chunk.chunkIndex}:${chunkHash.slice(0, 12)}`;

          embeddingFile.items[chunk.chunkIndex] = {
            id,
            sourcePath: relativePath,
            chunkIndex: chunk.chunkIndex,
            chunkHash,
            content,
            embedding: vector,
          };

          state.embeddedChunks = Math.max(state.embeddedChunks, chunk.chunkIndex + 1);
          state.nextChunkIndex = chunk.chunkIndex + 1;
          embeddedChunksThisRun += 1;

          const percent = ((state.embeddedChunks / state.totalChunks) * 100).toFixed(1);
          console.log(
            `[Pipeline][Embed] ${relativePath} -> ${state.embeddedChunks}/${state.totalChunks} chunks (${percent}%)`
          );

          if (args.maxChunksPerRun > 0 && embeddedChunksThisRun >= args.maxChunksPerRun) {
            state.status = "partial";
            state.updatedAt = new Date().toISOString();
            manifest.files[sourceKey] = state;
            await saveEmbeddingFile(outputFile, embeddingFile);
            await saveManifest(path.join(args.pipelineDir, "manifest.json"), manifest);
            console.log("[Pipeline][Embed] Limite por execucao atingido, estado salvo para retomar.");
            return;
          }
        } catch (embedError: any) {
          state.status = "partial";
          state.error = embedError?.message || "Falha ao gerar embedding";
          state.updatedAt = new Date().toISOString();
          manifest.files[sourceKey] = state;
          await saveEmbeddingFile(outputFile, embeddingFile);
          await saveManifest(path.join(args.pipelineDir, "manifest.json"), manifest);
          console.warn(
            `[Pipeline][Embed] Pausado para retomar depois em ${relativePath} (chunk ${chunk.chunkIndex}): ${state.error}`
          );
          return;
        }

        if ((i + 1) % Math.max(1, args.batchSize) === 0) {
          await saveEmbeddingFile(outputFile, embeddingFile);
        }
      }

      await saveEmbeddingFile(outputFile, embeddingFile);

      state.status = "embedded";
      state.updatedAt = new Date().toISOString();
      delete state.error;
      manifest.files[sourceKey] = state;
      processedFiles += 1;
      console.log(`[Pipeline][Embed] Concluido: ${relativePath}`);
    } catch (error: any) {
      failedFiles += 1;
      const previous = manifest.files[sourceKey];
      manifest.files[sourceKey] = {
        ...(previous || {
          sourcePath: relativePath,
          fileHash: "",
          outputFile: path.join(args.pipelineDir, "embeddings", buildOutputFileName(relativePath)),
          totalChunks: 0,
          embeddedChunks: 0,
          importedChunks: 0,
          nextChunkIndex: 0,
          nextImportIndex: 0,
        }),
        status: "failed",
        error: error?.message || "Erro desconhecido",
        updatedAt: new Date().toISOString(),
      };
      console.error(`[Pipeline][Embed] Falha em ${relativePath}:`, error?.message || error);
    }
  }

  console.log("\n[Pipeline][Embed] Resumo");
  console.log(`[Pipeline][Embed] Processados: ${processedFiles}`);
  console.log(`[Pipeline][Embed] Ignorados: ${skippedFiles}`);
  console.log(`[Pipeline][Embed] Falhas: ${failedFiles}`);
}

async function runImportPhase(
  args: ReturnType<typeof parseArgs>,
  userId: number,
  manifest: Manifest
) {
  const entries = Object.values(manifest.files).sort((a, b) => a.sourcePath.localeCompare(b.sourcePath));
  const candidates = entries.filter((f) => f.embeddedChunks > 0 && f.status !== "failed");
  console.log(`[Pipeline][Import] Fontes candidatas: ${candidates.length}`);

  let importedThisRun = 0;

  for (const state of candidates) {
    const filePath = state.outputFile || path.join(args.pipelineDir, "embeddings", buildOutputFileName(state.sourcePath));
    const raw = await fs.readFile(filePath, "utf-8").catch(() => "");
    if (!raw) {
      console.warn(`[Pipeline][Import] Arquivo de embeddings ausente: ${state.sourcePath}`);
      continue;
    }

    let data: EmbeddingFile;
    try {
      data = JSON.parse(raw) as EmbeddingFile;
    } catch {
      console.warn(`[Pipeline][Import] JSON invalido: ${state.sourcePath}`);
      continue;
    }

    for (let i = state.nextImportIndex; i < data.items.length; i += 1) {
      const item = data.items[i];
      if (!item || !item.content || !Array.isArray(item.embedding) || item.embedding.length === 0) {
        continue;
      }

      const memoryText = [
        `[PIPELINE] Fonte: ${item.sourcePath}`,
        `Chunk: ${item.chunkIndex}`,
        `ChunkId: ${item.id}`,
        `Conteudo: ${item.content}`,
      ].join("\n");
      const keywords = buildMemoryKeywords(item.sourcePath, item.content);

      if (!args.dryRun) {
        await addMemoryEntry(userId, memoryText, keywords, "context");
      }

      state.importedChunks = Math.max(state.importedChunks, item.chunkIndex + 1);
      state.nextImportIndex = item.chunkIndex + 1;
      state.updatedAt = new Date().toISOString();

      const total = Math.max(1, state.embeddedChunks);
      const percent = ((state.importedChunks / total) * 100).toFixed(1);
      console.log(
        `[Pipeline][Import] ${state.sourcePath} -> ${state.importedChunks}/${total} chunks (${percent}%)`
      );

      importedThisRun += 1;
      if (args.maxImportsPerRun > 0 && importedThisRun >= args.maxImportsPerRun) {
        state.status = state.importedChunks >= state.totalChunks ? "imported" : "partial";
        manifest.files[state.sourcePath] = state;
        await saveManifest(path.join(args.pipelineDir, "manifest.json"), manifest);
        console.log("[Pipeline][Import] Limite por execucao atingido, estado salvo para retomar.");
        return;
      }
    }

    state.status = state.importedChunks >= state.totalChunks ? "imported" : "partial";
    manifest.files[state.sourcePath] = state;
    console.log(`[Pipeline][Import] Concluido: ${state.sourcePath}`);
  }

  console.log("\n[Pipeline][Import] Resumo");
  console.log(`[Pipeline][Import] Chunks importados nesta execucao: ${importedThisRun}`);
}

async function run() {
  const args = parseArgs();
  const userId = await resolveUserId(args.userId);
  process.env.EMBEDDING_MODEL = args.embeddingModel;

  const inputStat = await fs.stat(args.inputDir).catch(() => null);
  if (!inputStat || !inputStat.isDirectory()) {
    throw new Error(`Pasta de entrada nao encontrada: ${args.inputDir}`);
  }

  await fs.mkdir(path.join(args.pipelineDir, "embeddings"), { recursive: true });
  const manifestPath = path.join(args.pipelineDir, "manifest.json");
  const manifest = await loadManifest(manifestPath);

  console.log(`[Pipeline] Usuario: ${userId}`);
  console.log(`[Pipeline] Entrada: ${args.inputDir}`);
  console.log(`[Pipeline] Pipeline dir: ${args.pipelineDir}`);
  console.log(`[Pipeline] Fase: ${args.phase}`);
  console.log(`[Pipeline] Provider embedding: ${args.embeddingProvider}`);
  console.log(`[Pipeline] Modelo embedding: ${args.embeddingModel}`);
  if (args.dryRun) {
    console.log("[Pipeline] DRY RUN ativo (na fase de importacao nao grava no banco)");
  }

  if (args.phase === "embed" || args.phase === "all") {
    await runEmbedPhase(args, manifest);
    await saveManifest(manifestPath, manifest);
  }

  if (args.phase === "import" || args.phase === "all") {
    await runImportPhase(args, userId, manifest);
    await saveManifest(manifestPath, manifest);
  }

  console.log("\n[Pipeline] Finalizado com sucesso.");
  console.log(`[Pipeline] Manifesto: ${manifestPath}`);
}

run().catch((error) => {
  console.error("[Pipeline] Falha fatal:", error);
  process.exitCode = 1;
});
