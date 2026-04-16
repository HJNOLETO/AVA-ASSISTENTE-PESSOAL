import "dotenv/config";
import path from "node:path";
import { createHash } from "node:crypto";
import { createReadStream, promises as fs } from "node:fs";
import { asc, eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { invokeLLM } from "../server/_core/llm";
import { addMemoryEntry, getDb } from "../server/db";

type RawEmbeddingItem = {
  identifier?: string;
  source_path?: string;
  location?: string;
  details?: string;
  tags?: string[];
  type?: string;
};

type Group = {
  key: string;
  sourcePath: string;
  fileName: string;
  itemCount: number;
  tags: Set<string>;
  snippets: string[];
};

type Manifest = Record<string, { signature: string; updatedAt: string }>;

const PROJECT_ROOT = process.cwd();
const DEFAULT_DATA_DIR = path.resolve(PROJECT_ROOT, "..", `${path.basename(PROJECT_ROOT)}-dados`);
const DEFAULT_INPUT_DIR = path.join(DEFAULT_DATA_DIR, "google-drive-embeddings", "json");
const DEFAULT_MANIFEST = path.join(DEFAULT_DATA_DIR, ".rag", "memory-import-manifest.json");

function parseArgs() {
  const raw = process.argv.slice(2);
  const values: Record<string, string | boolean> = {};

  for (let i = 0; i < raw.length; i += 1) {
    const token = raw[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = raw[i + 1];
    if (!next || next.startsWith("--")) {
      values[key] = true;
    } else {
      values[key] = next;
      i += 1;
    }
  }

  return {
    userId: typeof values["user-id"] === "string" ? Number(values["user-id"]) : undefined,
    inputDir: typeof values["input-dir"] === "string" ? path.resolve(values["input-dir"]) : DEFAULT_INPUT_DIR,
    manifestPath:
      typeof values["manifest"] === "string" ? path.resolve(values["manifest"]) : DEFAULT_MANIFEST,
    model:
      typeof values["model"] === "string"
        ? values["model"]
        : process.env.OLLAMA_MODEL || "qwen3:8b",
    maxSnippetsPerSource:
      typeof values["max-snippets"] === "string" ? Math.max(1, Number(values["max-snippets"])) : 8,
    maxGroupsPerFile:
      typeof values["max-groups"] === "string" ? Math.max(1, Number(values["max-groups"])) : 300,
    dryRun: values["dry-run"] === true,
  };
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

async function loadManifest(filePath: string): Promise<Manifest> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(raw) as Manifest;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

async function saveManifest(filePath: string, data: Manifest): Promise<void> {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");
}

async function listJsonFiles(dir: string): Promise<string[]> {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && e.name.toLowerCase().endsWith(".json"))
    .map((e) => path.join(dir, e.name))
    .sort((a, b) => a.localeCompare(b));
}

function normalizeText(value: string | undefined): string {
  if (!value) return "";
  return value.replace(/\s+/g, " ").trim();
}

function isInterestingItem(item: RawEmbeddingItem): boolean {
  const details = normalizeText(item.details);
  if (!details) return false;
  if (details.length < 15) return false;
  return true;
}

function buildSourcePath(item: RawEmbeddingItem, fallback: string): string {
  const source = normalizeText(item.source_path) || normalizeText(item.location);
  if (source) return source;
  const id = normalizeText(item.identifier);
  return id || fallback;
}

function extractSimpleKeywords(text: string): string[] {
  const words = text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s_-]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length >= 4);
  const counts = new Map<string, number>();
  for (const w of words) counts.set(w, (counts.get(w) || 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([w]) => w);
}

function fileSignature(group: Group): string {
  const payload = JSON.stringify({
    sourcePath: group.sourcePath,
    itemCount: group.itemCount,
    snippets: group.snippets,
    tags: [...group.tags].sort(),
  });
  return createHash("sha256").update(payload).digest("hex");
}

async function summarizeWithLocalLlm(group: Group, model: string): Promise<{ summary: string; keywords: string[] }> {
  const snippets = group.snippets
    .map((s, idx) => `Trecho ${idx + 1}: ${s}`)
    .join("\n");

  const prompt = [
    "Você organiza memória de projeto para recuperação futura.",
    "Retorne JSON com os campos: summary (max 450 chars) e keywords (array de 5 a 12 termos curtos).",
    `Fonte: ${group.sourcePath}`,
    `Itens agrupados: ${group.itemCount}`,
    `Tags: ${[...group.tags].slice(0, 20).join(", ") || "sem tags"}`,
    "Conteúdo:",
    snippets,
  ].join("\n");

  try {
    const result = await invokeLLM({
      provider: "ollama",
      model,
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      timeoutMs: 120000,
    });

    const content = result.choices?.[0]?.message?.content;
    const text = typeof content === "string" ? content : JSON.stringify(content || {});
    const parsed = JSON.parse(text || "{}");
    const summary = normalizeText(String(parsed.summary || ""));
    const keywords = Array.isArray(parsed.keywords)
      ? parsed.keywords.map((k: unknown) => normalizeText(String(k))).filter(Boolean)
      : [];

    if (summary) {
      return { summary, keywords: keywords.slice(0, 12) };
    }
  } catch {
    // fallback below
  }

  const fallbackSummary = normalizeText(group.snippets.join(" ")).slice(0, 450);
  const fallbackKeywords = [...group.tags, ...extractSimpleKeywords(fallbackSummary)].slice(0, 12);
  return { summary: fallbackSummary, keywords: fallbackKeywords };
}

async function* streamItemsFromJson(filePath: string): AsyncGenerator<RawEmbeddingItem> {
  const stream = createReadStream(filePath, { encoding: "utf-8" });

  let mode: "seekItems" | "seekArray" | "seekObject" | "inObject" | "done" = "seekItems";
  let recent = "";
  let objectBuffer = "";
  let braceDepth = 0;
  let inString = false;
  let escaped = false;

  for await (const chunk of stream) {
    for (let i = 0; i < chunk.length; i += 1) {
      const ch = chunk[i];

      if (mode === "seekItems") {
        recent = (recent + ch).slice(-32);
        if (recent.includes('"items"')) {
          mode = "seekArray";
        }
        continue;
      }

      if (mode === "seekArray") {
        if (ch === "[") mode = "seekObject";
        continue;
      }

      if (mode === "seekObject") {
        if (ch === "{") {
          mode = "inObject";
          objectBuffer = "{";
          braceDepth = 1;
          inString = false;
          escaped = false;
          continue;
        }
        if (ch === "]") {
          mode = "done";
          break;
        }
        continue;
      }

      if (mode === "inObject") {
        objectBuffer += ch;

        if (inString) {
          if (escaped) {
            escaped = false;
          } else if (ch === "\\") {
            escaped = true;
          } else if (ch === '"') {
            inString = false;
          }
          continue;
        }

        if (ch === '"') {
          inString = true;
          continue;
        }

        if (ch === "{") {
          braceDepth += 1;
          continue;
        }

        if (ch === "}") {
          braceDepth -= 1;
          if (braceDepth === 0) {
            try {
              const item = JSON.parse(objectBuffer) as RawEmbeddingItem;
              yield item;
            } catch {
              // ignore invalid object and keep stream moving
            }
            objectBuffer = "";
            mode = "seekObject";
          }
        }
      }
    }

    if (mode === "done") break;
  }
}

async function processFile(
  filePath: string,
  userId: number,
  model: string,
  maxSnippetsPerSource: number,
  maxGroupsPerFile: number,
  manifest: Manifest,
  dryRun: boolean
) {
  const groups = new Map<string, Group>();
  const fileName = path.basename(filePath);
  let scannedItems = 0;

  for await (const item of streamItemsFromJson(filePath)) {
    scannedItems += 1;
    if (!isInterestingItem(item)) continue;

    const sourcePath = buildSourcePath(item, fileName);
    const key = `${fileName}::${sourcePath}`;
    const details = normalizeText(item.details);

    if (!groups.has(key)) {
      if (groups.size >= maxGroupsPerFile) continue;
      groups.set(key, {
        key,
        sourcePath,
        fileName,
        itemCount: 0,
        tags: new Set<string>(),
        snippets: [],
      });
    }

    const group = groups.get(key)!;
    group.itemCount += 1;

    if (details && group.snippets.length < maxSnippetsPerSource) {
      group.snippets.push(details.slice(0, 1200));
    }

    if (Array.isArray(item.tags)) {
      for (const tag of item.tags) {
        const normalized = normalizeText(String(tag)).toLowerCase();
        if (normalized && group.tags.size < 30) group.tags.add(normalized);
      }
    }
    if (item.type) group.tags.add(normalizeText(item.type).toLowerCase());
  }

  let imported = 0;
  let skipped = 0;

  for (const group of groups.values()) {
    if (group.snippets.length === 0) {
      skipped += 1;
      continue;
    }

    const signature = fileSignature(group);
    const previous = manifest[group.key];
    if (previous?.signature === signature) {
      skipped += 1;
      continue;
    }

    const organized = await summarizeWithLocalLlm(group, model);
    const keywords = [...new Set([...group.tags, ...organized.keywords])].slice(0, 16).join(", ");
    const memoryText = [
      `[IMPORTADO] Fonte: ${group.sourcePath}`,
      `Arquivo-base: ${group.fileName}`,
      `Entradas agregadas: ${group.itemCount}`,
      `Resumo: ${organized.summary}`,
    ].join("\n");

    if (!dryRun) {
      await addMemoryEntry(userId, memoryText, keywords, "context");
    }

    manifest[group.key] = {
      signature,
      updatedAt: new Date().toISOString(),
    };
    imported += 1;
  }

  return { scannedItems, groups: groups.size, imported, skipped };
}

async function run() {
  const args = parseArgs();
  const userId = await resolveUserId(args.userId);

  process.env.LLM_PROVIDER = process.env.LLM_PROVIDER || "ollama";
  process.env.EMBEDDING_MODEL = process.env.EMBEDDING_MODEL || "nomic-embed-text:latest";

  const inputDirStat = await fs.stat(args.inputDir).catch(() => null);
  if (!inputDirStat || !inputDirStat.isDirectory()) {
    throw new Error(`Pasta de entrada nao encontrada: ${args.inputDir}`);
  }

  const files = await listJsonFiles(args.inputDir);
  if (files.length === 0) {
    console.log(`[MemoryImport] Nenhum JSON encontrado em ${args.inputDir}`);
    return;
  }

  const manifest = await loadManifest(args.manifestPath);

  let totalScanned = 0;
  let totalGroups = 0;
  let totalImported = 0;
  let totalSkipped = 0;

  console.log(`[MemoryImport] Usuario: ${userId}`);
  console.log(`[MemoryImport] Pasta: ${args.inputDir}`);
  console.log(`[MemoryImport] Arquivos: ${files.length}`);
  console.log(`[MemoryImport] Modelo local: ${args.model}`);
  if (args.dryRun) console.log("[MemoryImport] DRY RUN ativo (sem gravar no banco)");

  for (const filePath of files) {
    const result = await processFile(
      filePath,
      userId,
      args.model,
      args.maxSnippetsPerSource,
      args.maxGroupsPerFile,
      manifest,
      args.dryRun
    );
    totalScanned += result.scannedItems;
    totalGroups += result.groups;
    totalImported += result.imported;
    totalSkipped += result.skipped;

    console.log(
      `[MemoryImport] ${path.basename(filePath)} -> itens: ${result.scannedItems}, grupos: ${result.groups}, importados: ${result.imported}, pulados: ${result.skipped}`
    );
  }

  if (!args.dryRun) {
    await saveManifest(args.manifestPath, manifest);
  }

  console.log("\n[MemoryImport] Concluido");
  console.log(`[MemoryImport] Itens lidos: ${totalScanned}`);
  console.log(`[MemoryImport] Grupos: ${totalGroups}`);
  console.log(`[MemoryImport] Memorias importadas: ${totalImported}`);
  console.log(`[MemoryImport] Puladas: ${totalSkipped}`);
  console.log(`[MemoryImport] Manifesto: ${args.manifestPath}`);
}

run().catch((error) => {
  console.error("[MemoryImport] Falha:", error);
  process.exitCode = 1;
});
