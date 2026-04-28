import fs from "node:fs/promises";
import path from "node:path";
import pdfParse from "pdf-parse";
import { generateEmbedding } from "../_core/llm";
import { createDocumentChunkBatch, createDocumentRAG, updateDocumentProgress, updateDocumentStatusById } from "../db";

export type LegalStatus = "vigente" | "revogado" | "historico";

export type LegalMetadata = {
  numero: string;
  esfera: string;
  ementa: string;
  dataVigencia?: string;
  legalStatus: LegalStatus;
};

export type LegalChunk = {
  chunkIndex: number;
  content: string;
  metadata: Record<string, unknown>;
};

export type LegalIngestResult = {
  documentId: number;
  chunks: number;
  metadata: LegalMetadata;
};

function normalizeText(text: string): string {
  return text
    .replace(/\r/g, "\n")
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/-\n(?=\w)/g, "")
    .replace(/\n(?=[a-z])/g, " ")
    .replace(/^\s*\d+\s*$/gm, "")
    .trim();
}

async function extractRawText(filePath: string): Promise<string> {
  const ext = path.extname(filePath).toLowerCase();
  const raw = await fs.readFile(filePath);
  if (ext === ".pdf") {
    const out = await pdfParse(raw);
    return out.text || "";
  }
  return raw.toString("utf-8");
}

export function parseLegalMetadata(rawText: string, filename: string): LegalMetadata {
  const text = normalizeText(rawText);
  const numeroMatch = text.match(/\b(lei|decreto)\s*(?:n[.o\u00BA\u00B0]?\s*)?([\d.]+(?:\/\d{2,4})?)/i);
  const dataMatch = text.match(/\b(?:vig[êe]ncia|publica[çc][ãa]o|de\s+\d{1,2}\/\d{1,2}\/\d{2,4})\b[^\n]*/i);
  const ementaLine = text.split(/\n+/).find((line) => line.length > 25) || "Norma sem ementa explicita";

  const esfera = /federal/i.test(text)
    ? "federal"
    : /estadual/i.test(text)
      ? "estadual"
      : /municipal/i.test(text)
        ? "municipal"
        : "nao-informada";

  const lower = text.toLowerCase();
  const legalStatus: LegalStatus = /revogad/.test(lower)
    ? "revogado"
    : /(hist[oó]ric|anterior|reda[çc][ãa]o antiga)/.test(lower)
      ? "historico"
      : "vigente";

  return {
    numero: numeroMatch ? `${numeroMatch[1].toUpperCase()} ${numeroMatch[2]}` : `NORMA ${path.basename(filename)}`,
    ementa: ementaLine.slice(0, 280),
    esfera,
    dataVigencia: dataMatch?.[0]?.slice(0, 80),
    legalStatus,
  };
}

export function chunkLegalText(rawText: string): LegalChunk[] {
  const text = normalizeText(rawText);
  const articleRegex = /(Art\.?\s*\d+[A-Za-z0-9\-º°]*[\s\S]*?)(?=(?:\nArt\.?\s*\d+|$))/gi;
  const matches = Array.from(text.matchAll(articleRegex));

  const chunks: LegalChunk[] = [];
  if (matches.length === 0) {
    return [{
      chunkIndex: 0,
      content: text,
      metadata: { scope: "texto_integral" },
    }];
  }

  let index = 0;
  for (const match of matches) {
    const articleText = String(match[1] || "").trim();
    if (!articleText) continue;

    const articleId = articleText.match(/Art\.?\s*(\d+[A-Za-z0-9\-º°]*)/i)?.[1] || `${index + 1}`;
    const paragraphRegex = /((?:§\s*\d+[º°]?|Par[aá]grafo\s+[úu]nico|[IVXLCDM]+\s*-)[\s\S]*?)(?=(?:§\s*\d+[º°]?|Par[aá]grafo\s+[úu]nico|[IVXLCDM]+\s*-|$))/gi;
    const pieces = Array.from(articleText.matchAll(paragraphRegex)).map((x) => String(x[1] || "").trim()).filter(Boolean);

    if (pieces.length === 0) {
      chunks.push({
        chunkIndex: index++,
        content: articleText,
        metadata: { artigo: articleId, scope: "artigo" },
      });
      continue;
    }

    for (const piece of pieces) {
      chunks.push({
        chunkIndex: index++,
        content: `Art. ${articleId} - ${piece}`,
        metadata: {
          artigo: articleId,
          scope: /[IVXLCDM]+\s*-/.test(piece) ? "inciso" : "paragrafo",
        },
      });
    }
  }
  return chunks;
}

export async function ingestLegalDocument(filePath: string, userId: number): Promise<LegalIngestResult> {
  const rawText = await extractRawText(filePath);
  const metadata = parseLegalMetadata(rawText, filePath);
  const chunks = chunkLegalText(rawText);
  const stat = await fs.stat(filePath);

  const insertResult = await createDocumentRAG(userId, {
    name: path.basename(filePath),
    filename: path.basename(filePath),
    type: "legal",
    sourceType: "legal",
    size: stat.size,
    status: "processing",
    legalStatus: metadata.legalStatus,
    effectiveDate: metadata.dataVigencia || null,
    externalId: `${path.basename(filePath)}:${Date.now()}`,
    tags: JSON.stringify(["legal", metadata.esfera]),
    totalChunks: chunks.length,
    indexedChunks: 0,
  });

  const documentId = Number((insertResult as any)?.lastInsertRowid || 0);
  if (!documentId) throw new Error("Falha ao criar documento legal");

  const payload = [] as Array<{
    documentId: number;
    chunkIndex: number;
    content: string;
    metadata: string;
    embedding: string;
  }>;

  for (const chunk of chunks) {
    const embedding = await generateEmbedding(chunk.content, "ollama");
    payload.push({
      documentId,
      chunkIndex: chunk.chunkIndex,
      content: chunk.content,
      metadata: JSON.stringify({ ...metadata, ...chunk.metadata }),
      embedding: JSON.stringify(embedding),
    });
  }

  await createDocumentChunkBatch(payload as any);
  await updateDocumentProgress(documentId, chunks.length, chunks.length);
  await updateDocumentStatusById(documentId, "indexed");

  return { documentId, chunks: chunks.length, metadata };
}
