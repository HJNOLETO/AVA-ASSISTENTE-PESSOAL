import fs from "node:fs/promises";
import crypto from "node:crypto";
import path from "node:path";
import { addAuditLog, createDocumentChunkBatch, createDocumentRAG, getDocumentByExternalId, updateDocumentProgress, updateDocumentStatusById } from "../db";
import { generateEmbedding } from "../_core/llm";
import { chunkLegalText } from "../rag/legal-ingest";
import { chunkText } from "../rag";

type IngestAction = "run" | "status";

export type IngestOpsInput = {
  action: IngestAction;
  path?: string;
  dry_run?: boolean;
  userId?: number;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function sha256(input: string): string {
  return crypto.createHash("sha256").update(input, "utf-8").digest("hex");
}

function isLegalText(text: string): boolean {
  return /\bArt\.?\s*\d+/i.test(text) || /\bPar[aá]grafo\b/i.test(text);
}

// C3: Auto-título baseado no nome do arquivo se não houver '# Título'
function prepareContent(raw: string, filePath: string): string {
  const trimmed = raw.trim();
  if (/^#{1,3}\s+\S/.test(trimmed)) return trimmed;
  const basename = path.basename(filePath, path.extname(filePath));
  const titleized = basename.replace(/[-_]/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
  return `# ${titleized}\n\n${trimmed}`;
}

// C3: Threshold adaptativo via variável de ambiente
const MIN_CHARS = parseInt(process.env.AVA_INGEST_MIN_CHARS ?? "200");

async function appendJsonl(logPath: string, payload: Record<string, unknown>) {
  await fs.mkdir(path.dirname(logPath), { recursive: true });
  await fs.appendFile(logPath, `${JSON.stringify(payload)}\n`, "utf-8");
}

export async function runIngestOps(input: IngestOpsInput): Promise<string> {
  const userId = input.userId || 1;
  const resolvedInput = path.resolve(input.path || "ava_inbox");
  const isMdFileInput = resolvedInput.toLowerCase().endsWith(".md");
  const root = isMdFileInput ? path.dirname(resolvedInput) : resolvedInput;
  const processed = path.join(root, "processed");
  const failed = path.join(root, "failed");
  const auditPath = path.resolve("data", "ingest-audit.jsonl");

  await fs.mkdir(root, { recursive: true });
  await fs.mkdir(processed, { recursive: true });
  await fs.mkdir(failed, { recursive: true });

  if (input.action === "status") {
    const files = await fs.readdir(root);
    const md = files.filter((f) => f.endsWith(".md"));
    return JSON.stringify({ inbox: root, pendentes: md.length, arquivos: md.slice(0, 20) }, null, 2);
  }

  const files = isMdFileInput
    ? [path.basename(resolvedInput)]
    : (await fs.readdir(root)).filter((f) => f.endsWith(".md"));
  const results: Array<Record<string, unknown>> = [];

  for (const file of files) {
    const fullPath = path.join(root, file);
    try {
      const raw = await fs.readFile(fullPath, "utf-8");
      // C3: Auto-título e validação com threshold adaptativo
      const trimmed = prepareContent(raw, fullPath);
      if (trimmed.replace(/^#{1,3}[^\n]*\n+/, "").trim().length < MIN_CHARS) {
        throw new Error(`Formato invalido: minimo de ${MIN_CHARS} caracteres de conteudo (atual: ${trimmed.length})`);
      }

      const hash = sha256(trimmed);
      const externalId = `ingest:${hash}`;
      const duplicate = await getDocumentByExternalId(userId, externalId);
      if (duplicate) {
        results.push({ arquivo: file, status: "duplicado", hash });
        await fs.rename(fullPath, path.join(processed, file));
        continue;
      }

      if (input.dry_run) {
        // C3: SHA-256 verificado mesmo em dry-run para detectar duplicatas
        results.push({ arquivo: file, status: "dry_run_ok", hash, minChars: MIN_CHARS });
        continue;
      }

      const legal = isLegalText(trimmed);
      const chunks = legal
        ? chunkLegalText(trimmed).map((c) => ({ chunkIndex: c.chunkIndex, content: c.content, metadata: c.metadata }))
        : chunkText(trimmed).map((c) => ({ chunkIndex: c.chunkIndex, content: c.content, metadata: c.metadata }));

      const created = await createDocumentRAG(userId, {
        name: file,
        filename: file,
        type: "text/markdown",
        sourceType: legal ? "legal" : "knowledge",
        size: Buffer.byteLength(trimmed, "utf-8"),
        status: "processing",
        legalStatus: legal ? "vigente" : null,
        externalId,
        totalChunks: chunks.length,
        indexedChunks: 0,
      });

      const documentId = Number((created as any)?.lastInsertRowid || 0);
      if (!documentId) throw new Error("Falha ao criar documento");

      const batch: Array<Record<string, unknown>> = [];
      for (const chunk of chunks) {
        const embedding = await generateEmbedding(chunk.content, "ollama");
        batch.push({
          documentId,
          chunkIndex: chunk.chunkIndex,
          content: chunk.content,
          metadata: JSON.stringify(chunk.metadata || {}),
          embedding: JSON.stringify(embedding),
        });
        await sleep(120);
      }

      await createDocumentChunkBatch(batch as any);
      await updateDocumentProgress(documentId, chunks.length, chunks.length);
      await updateDocumentStatusById(documentId, "indexed");
      await fs.rename(fullPath, path.join(processed, file));

      const event = { at: new Date().toISOString(), arquivo: file, status: "indexed", documentId, chunks: chunks.length, legal };
      await appendJsonl(auditPath, event);
      await addAuditLog({ userId, action: "INGEST_OPS_INDEXED", entity: "document", entityId: documentId, details: JSON.stringify(event) });
      results.push(event);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      // C3: Log de falha enriquecido com motivo estruturado
      const failDetail: Record<string, unknown> = { at: new Date().toISOString(), arquivo: file, status: "failed", erro: message };
      if (message.includes("minimo de")) {
        failDetail.reason = "conteudo_abaixo_minimo";
        failDetail.minChars = MIN_CHARS;
      } else if (message.includes("Titulo") || message.includes("título")) {
        failDetail.reason = "sem_titulo";
      } else if (message.includes("duplicado")) {
        failDetail.reason = "duplicado";
      }
      await appendJsonl(auditPath, failDetail);
      await fs.rename(fullPath, path.join(failed, file)).catch(() => undefined);
      results.push(failDetail);
    }
  }

  return JSON.stringify({ inbox: root, processados: results.length, resultados: results }, null, 2);
}
