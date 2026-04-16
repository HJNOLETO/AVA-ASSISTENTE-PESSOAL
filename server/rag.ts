import { generateEmbedding } from "./_core/llm";
import { invokeLLM } from "./_core/llm";
import { cosineSimilarity } from "./utils/vector";
import {
  createDocumentRAG,
  getDocumentsRAG,
  createDocumentChunkBatch,
  updateDocumentProgress,
  updateDocumentStatusById,
  updateDocumentLastAccessed,
  searchDocumentChunksByVector,
  searchDocumentChunksByKeyword,
  getStorageStats,
  getDocumentChunks,
  purgeDocumentChunks,
} from "./db";
import type { InsertDocument, InsertDocumentChunk } from "../drizzle/schema";

const CHUNK_SIZE_CHARS = 2000;
const CHUNK_OVERLAP_CHARS = 200;
const MIN_CHUNK_CHARS = 500;
const INDEX_PROGRESS_INTERVAL = 10;
const DB_RETRY_ATTEMPTS = 3;
const DB_RETRY_BASE_DELAY_MS = 200;

export interface Chunk {
  content: string;
  chunkIndex: number;
  metadata: {
    section?: string;
    article?: string;
    pageHint?: number;
    sourceType?: string;
  };
}

export interface ChunkOptions {
  maxChars?: number;
  overlap?: number;
  detectLegalStructure?: boolean;
}

export interface SearchFilters {
  documentIds?: number[];
  minScore?: number;
  legalStatus?: string;
}

export interface SearchResult {
  content: string;
  score: number;
  documentId: number;
  documentName: string;
  chunkIndex: number;
  metadata: Record<string, unknown>;
}

async function withRetry<T>(
  operationName: string,
  operation: () => Promise<T>,
  attempts: number = DB_RETRY_ATTEMPTS,
  baseDelayMs: number = DB_RETRY_BASE_DELAY_MS
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const isLastAttempt = attempt === attempts;

      console.error(
        `[RAG][Retry] ${operationName} failed (attempt ${attempt}/${attempts}):`,
        error
      );

      if (isLastAttempt) {
        break;
      }

      const delayMs = baseDelayMs * Math.pow(2, attempt - 1);
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error(`${operationName} failed after ${attempts} attempts`);
}

const LEGAL_STRUCTURE_PATTERNS = [
  { pattern: /Art\.\s*(\d+[A-Z]?)/gi, type: "article" },
  { pattern: /Artº\s*(\d+[A-Z]?)/gi, type: "article" },
  { pattern: /§\s*(\d+º?)/gi, type: "paragraph" },
  { pattern: /Parágrafo\s*(\d+º?)/gi, type: "paragraph" },
  { pattern: /Inciso\s+([IVXLCDM]+)/gi, type: "inciso" },
  { pattern: /Alínea\s+([a-z]\))/gi, type: "alinea" },
  { pattern: /CAPÍTULO\s+([IVXLCDM]+|ÚNICO)/gi, type: "chapter" },
  { pattern: /SEÇÃO\s+([IVXLCDM]+|ÚNICA)/gi, type: "section" },
  { pattern: /TÍTULO\s+([IVXLCDM]+|ÚNICO)/gi, type: "title" },
];

function isLikelyPdfBuffer(buffer: Buffer): boolean {
  if (!buffer || buffer.length < 5) return false;
  const signature = buffer.subarray(0, 5).toString("utf-8");
  return signature === "%PDF-";
}

function normalizeExtractedText(text: string): string {
  return text.replace(/\u0000/g, " ").replace(/\s+/g, " ").trim();
}

let pdfParseCached: ((buffer: Buffer, options?: any) => Promise<any>) | null = null;
let mammothCached: { extractRawText: (args: { buffer: Buffer }) => Promise<{ value: string }> } | null = null;
let xlsxCached: {
  read: (buffer: Buffer, options: { type: string }) => any;
  utils: { sheet_to_json: (sheet: any, options: { header: number }) => unknown[][] };
} | null = null;

async function getPdfParse() {
  if (pdfParseCached) return pdfParseCached;
  const mod: any = await import("pdf-parse");
  const fn = mod?.default ?? mod;
  if (typeof fn !== "function") {
    throw new Error("pdf-parse export invalido");
  }
  pdfParseCached = fn;
  return fn;
}

async function getMammoth() {
  if (mammothCached) return mammothCached;
  const mod: any = await import("mammoth");
  const instance = mod?.default ?? mod;
  if (typeof instance?.extractRawText !== "function") {
    throw new Error("mammoth export invalido");
  }
  mammothCached = instance;
  return instance;
}

async function getXlsx() {
  if (xlsxCached) return xlsxCached;
  const mod: any = await import("xlsx");
  const instance = mod?.default ?? mod;
  if (typeof instance?.read !== "function" || typeof instance?.utils?.sheet_to_json !== "function") {
    throw new Error("xlsx export invalido");
  }
  xlsxCached = instance;
  return instance;
}

async function extractTextFromPDF(buffer: Buffer): Promise<string> {
  try {
    const pdfParse = await getPdfParse();
    const data = await pdfParse(buffer);
    let text = data.text || "";
    let normalized = normalizeExtractedText(text);

    console.log(
      `[RAG][PDF] Parse primario: paginas=${data.numpages ?? "?"}, chars=${normalized.length}`
    );

    if (normalized.length >= 80) {
      return text;
    }

    const fallback = await pdfParse(buffer, {
      pagerender: async (pageData: any) => {
        const content = await pageData.getTextContent({
          normalizeWhitespace: false,
          disableCombineTextItems: false,
        });
        return content.items
          .map((item: any) => (typeof item?.str === "string" ? item.str : ""))
          .join(" ");
      },
    });

    text = fallback.text || "";
    normalized = normalizeExtractedText(text);

    console.log(
      `[RAG][PDF] Fallback pagerender: paginas=${fallback.numpages ?? "?"}, chars=${normalized.length}`
    );

    if (normalized.length === 0) {
      try {
        const llmExtract = await extractTextFromPdfViaLLM(buffer);
        const llmNormalized = normalizeExtractedText(llmExtract);
        if (llmNormalized.length > 0) {
          console.log(`[RAG][PDF] Fallback LLM OCR/extraction: chars=${llmNormalized.length}`);
          return llmExtract;
        }
      } catch (llmError) {
        console.warn("[RAG][PDF] LLM fallback failed:", llmError);
      }

      throw new Error(
        "PDF sem texto extraivel por parser nativo. Tente modo de revisao/OCR para este arquivo."
      );
    }

    return text;
  } catch (error) {
    console.error("[RAG] PDF extraction error:", error);
    throw new Error(`PDF extraction failed: ${error}`);
  }
}

async function extractTextFromPdfViaLLM(buffer: Buffer): Promise<string> {
  const base64 = buffer.toString("base64");
  const prompt =
    "Extraia o texto do PDF em portugues mantendo estrutura basica (titulos e paragrafos). " +
    "Nao resuma e nao invente conteudo. Se o PDF for muito grande, extraia o maximo que conseguir.";

  const providers: Array<"ollama" | "forge"> = ["ollama", "forge"];
  const errors: string[] = [];

  for (const provider of providers) {
    try {
      const result = await invokeLLM({
        provider,
        model:
          provider === "ollama"
            ? process.env.OCR_VISION_MODEL || process.env.OLLAMA_MODEL || "qwen2.5vl:7b"
            : process.env.OCR_VISION_MODEL || process.env.FORGE_VISION_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: prompt },
              {
                type: "file_url",
                file_url: {
                  url: `data:application/pdf;base64,${base64}`,
                  mime_type: "application/pdf",
                },
              },
            ],
          },
        ],
        maxTokens: 4000,
        timeoutMs: 120000,
      });

      const content = result.choices?.[0]?.message?.content;
      const text =
        typeof content === "string"
          ? content
          : Array.isArray(content)
            ? content.map((part: any) => part?.text || "").join("\n")
            : "";

      if (normalizeExtractedText(text).length > 0) {
        return text;
      }
    } catch (error: any) {
      errors.push(`${provider}: ${error?.message || String(error)}`);
    }
  }

  throw new Error(`PDF LLM extraction failed. Details: ${errors.join(" | ")}`);
}

async function extractTextFromDOCX(buffer: Buffer): Promise<string> {
  try {
    const mammoth = await getMammoth();
    const result = await mammoth.extractRawText({ buffer });
    return result.value || "";
  } catch (error) {
    console.error("[RAG] DOCX extraction error:", error);
    throw new Error(`DOCX extraction failed: ${error}`);
  }
}

async function extractTextFromExcel(buffer: Buffer): Promise<string> {
  try {
    const XLSX = await getXlsx();
    const workbook = XLSX.read(buffer, { type: "buffer" });
    let text = "";
    
    for (const sheetName of workbook.SheetNames) {
      const sheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
      text += `\n=== Sheet: ${sheetName} ===\n`;
      text += data.map((row: unknown[]) => row.join(" | ")).join("\n");
    }
    
    return text;
  } catch (error) {
    console.error("[RAG] Excel extraction error:", error);
    throw new Error(`Excel extraction failed: ${error}`);
  }
}

function extractTextFromCSV(buffer: Buffer): string {
  const text = buffer.toString("utf-8");
  const lines = text.split(/\r?\n/);
  return lines.join("\n");
}

function extractTextFromJSON(buffer: Buffer): string {
  try {
    const data = JSON.parse(buffer.toString("utf-8"));
    return JSON.stringify(data, null, 2);
  } catch (error) {
    console.error("[RAG] JSON parsing error:", error);
    throw new Error(`JSON parsing failed: ${error}`);
  }
}

function extractTextFromHTML(buffer: Buffer): string {
  const html = buffer.toString("utf-8");
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTextFromCode(buffer: Buffer, fileName: string): string {
  const ext = fileName.split(".").pop()?.toLowerCase();
  const content = buffer.toString("utf-8");
  
  return `// File: ${fileName}\n// Language: ${ext}\n${content}`;
}

async function extractTextFromImage(fileName: string, mimeType: string, buffer: Buffer): Promise<string> {
  const ext = fileName.split(".").pop()?.toLowerCase() || "png";
  const detectedMime = mimeType.startsWith("image/") ? mimeType : `image/${ext === "jpg" ? "jpeg" : ext}`;
  const base64 = buffer.toString("base64");

  const ocrPrompt =
    "Extraia TODO o texto visivel da imagem em portugues brasileiro. " +
    "Mantenha a ordem visual e quebras de linha quando fizer sentido. " +
    "Nao resuma, nao interprete, nao traduza.";

  const providers: Array<"ollama" | "forge"> = ["ollama", "forge"];
  const errors: string[] = [];

  for (const provider of providers) {
    try {
      const result = await invokeLLM({
        provider,
        model:
          provider === "ollama"
            ? process.env.OCR_VISION_MODEL || process.env.OLLAMA_MODEL || "qwen2.5vl:7b"
            : process.env.OCR_VISION_MODEL || process.env.FORGE_VISION_MODEL || "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: ocrPrompt },
              { type: "image_url", image_url: { url: `data:${detectedMime};base64,${base64}` } },
            ],
          },
        ],
        maxTokens: 3000,
        timeoutMs: 120000,
      });

      const content = result.choices?.[0]?.message?.content;
      const text =
        typeof content === "string"
          ? content
          : Array.isArray(content)
            ? content.map((part: any) => part?.text || "").join("\n")
            : "";

      const normalized = normalizeExtractedText(text);
      if (normalized.length > 0) {
        return text;
      }
    } catch (error: any) {
      errors.push(`${provider}: ${error?.message || String(error)}`);
    }
  }

  throw new Error(`Image OCR failed. Details: ${errors.join(" | ")}`);
}

export async function extractText(fileName: string, mimeType: string, buffer: Buffer): Promise<string> {
  const ext = fileName.toLowerCase().split(".").pop() || "";
  
  if (mimeType === "application/pdf" || ext === "pdf" || isLikelyPdfBuffer(buffer)) {
    return await extractTextFromPDF(buffer);
  }
  
  if (mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" || ext === "docx") {
    return await extractTextFromDOCX(buffer);
  }
  
  if (mimeType === "application/msword" || ext === "doc") {
    return await extractTextFromDOCX(buffer);
  }
  
  if (["xls", "xlsx"].includes(ext) || mimeType === "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet") {
    return await extractTextFromExcel(buffer);
  }
  
  if (ext === "csv" || mimeType === "text/csv") {
    return extractTextFromCSV(buffer);
  }
  
  if (ext === "json" || mimeType === "application/json") {
    return extractTextFromJSON(buffer);
  }
  
  if (ext === "html" || ext === "htm" || mimeType === "text/html") {
    return extractTextFromHTML(buffer);
  }
  
  if (["js", "ts", "jsx", "tsx"].includes(ext)) {
    return extractTextFromCode(buffer, fileName);
  }

  if (
    mimeType.startsWith("image/") ||
    ["png", "jpg", "jpeg", "webp", "gif", "bmp", "tiff", "tif"].includes(ext)
  ) {
    return await extractTextFromImage(fileName, mimeType, buffer);
  }
  
  return buffer.toString("utf-8");
}

function detectLegalStructure(text: string): { sections: string[]; articles: Map<string, string> } {
  const sections: string[] = [];
  const articles = new Map<string, string>();
  
  for (const { pattern, type } of LEGAL_STRUCTURE_PATTERNS) {
    const matches = Array.from(text.matchAll(pattern));
    for (const match of matches) {
      const fullMatch = match[0];
      if (type === "chapter" || type === "section" || type === "title") {
        if (!sections.includes(fullMatch)) {
          sections.push(fullMatch);
        }
      } else if (type === "article") {
        const articleNum = match[1];
        articles.set(articleNum, fullMatch);
      }
    }
  }
  
  return { sections, articles };
}

function splitAtLegalBoundaries(text: string): string[] {
  const boundaries = [
    /(?:^|\n)\s*(?=Art\.\s*\d)/,
    /(?:^|\n)\s*(?=Artº\s*\d)/,
    /(?:^|\n)\s*(?=\§\s*\d)/,
    /(?:^|\n)\s*(?=Parágrafo\s*\d)/,
    /(?:^|\n)\s*(?=CAPÍTULO\s+)/i,
    /(?:^|\n)\s*(?=SEÇÃO\s+)/i,
    /(?:^|\n)\s*(?=TÍTULO\s+)/i,
    /(?:^|\n)\s*(?=Inciso\s+)/i,
    /(?:^|\n)\s*(?=Alínea\s+)/i,
  ];
  
  let segments = [text];
  
  for (const boundary of boundaries) {
    const newSegments: string[] = [];
    for (const segment of segments) {
      const parts = segment.split(boundary);
      newSegments.push(...parts.filter(p => p.trim()));
    }
    segments = newSegments;
  }
  
  return segments.filter(s => s.trim().length > 0);
}

export function chunkText(text: string, options: ChunkOptions = {}): Chunk[] {
  const { maxChars = CHUNK_SIZE_CHARS, overlap = CHUNK_OVERLAP_CHARS, detectLegalStructure: detectStructure = true } = options;
  
  if (!text || text.trim().length === 0) {
    return [];
  }
  
  const chunks: Chunk[] = [];
  
  const { sections, articles } = detectStructure ? detectLegalStructure(text) : { sections: [], articles: new Map() };
  
  let segments = splitAtLegalBoundaries(text);
  
  if (segments.length === 1 || segments.every(s => s.length <= maxChars)) {
    segments = segments.map(s => s.trim()).filter(s => s.length > 0);
  }
  
  let chunkIndex = 0;
  
  for (const segment of segments) {
    if (segment.length <= maxChars) {
      chunks.push({
        content: segment.trim(),
        chunkIndex: chunkIndex++,
        metadata: {
          section: sections.find(s => segment.includes(s)),
          article: Array.from(articles.entries()).find(([_, v]) => segment.includes(v))?.[0],
        },
      });
      continue;
    }
    
    const words = segment.split(/(\s+)/);
    let currentChunk = "";
    let currentStart = 0;
    
    while (currentStart < segment.length) {
      const remaining = segment.substring(currentStart);
      
      if (remaining.length <= maxChars) {
        chunks.push({
          content: remaining.trim(),
          chunkIndex: chunkIndex++,
          metadata: {
            section: sections.find(s => remaining.includes(s)),
            article: Array.from(articles.entries()).find(([_, v]) => remaining.includes(v))?.[0],
          },
        });
        break;
      }
      
      const chunkEnd = currentStart + maxChars;
      let cutPoint = segment.lastIndexOf(" ", chunkEnd);
      
      if (cutPoint - currentStart < MIN_CHUNK_CHARS) {
        cutPoint = chunkEnd;
      }
      
      const chunkContent = segment.substring(currentStart, cutPoint).trim();
      
      if (chunkContent.length > 0) {
        chunks.push({
          content: chunkContent,
          chunkIndex: chunkIndex++,
          metadata: {
            section: sections.find(s => chunkContent.includes(s)),
            article: Array.from(articles.entries()).find(([_, v]) => chunkContent.includes(v))?.[0],
          },
        });
      }
      
      currentStart = Math.max(cutPoint - overlap, currentStart + MIN_CHUNK_CHARS);
    }
  }
  
  return chunks;
}

export function estimateChunksSizeKB(chunks: Chunk[]): number {
  const totalChars = chunks.reduce((sum, chunk) => sum + chunk.content.length, 0);
  const avgEmbeddingSize = 3072;
  const bytesPerChunk = totalChars / chunks.length || 0;
  const embeddingBytes = avgEmbeddingSize * 4;
  const totalBytes = bytesPerChunk + embeddingBytes;
  
  return Math.ceil(totalBytes / 1024);
}

async function generateChunksWithEmbeddings(
  chunks: Chunk[],
  provider?: string
): Promise<InsertDocumentChunk[]> {
  const results: InsertDocumentChunk[] = [];
  type EmbeddingProvider = "forge" | "ollama";

  const generateWithFallback = async (content: string) => {
    const preferredProvider: EmbeddingProvider = provider === "ollama" ? "ollama" : "forge";
    const orderedProviders: EmbeddingProvider[] = provider
      ? [preferredProvider, preferredProvider === "ollama" ? "forge" : "ollama"]
      : ["ollama", "forge"];

    let lastError: unknown;
    for (const p of orderedProviders) {
      try {
        const embedding = await generateEmbedding(content, p);
        return {
          embedding,
          providerUsed: p,
          modelUsed: p === "ollama" ? "nomic-embed-text" : "text-embedding-3-small",
        };
      } catch (error) {
        lastError = error;
      }
    }

    throw lastError || new Error("Nenhum provedor de embedding disponível");
  };
  
  for (const chunk of chunks) {
    try {
      const { embedding, providerUsed, modelUsed } = await generateWithFallback(chunk.content);
      
      results.push({
        documentId: 0,
        chunkIndex: chunk.chunkIndex,
        content: chunk.content,
        metadata: JSON.stringify(chunk.metadata),
        embedding: JSON.stringify(embedding),
        embeddingProvider: providerUsed,
        embeddingModel: modelUsed,
        embeddingDimensions: embedding.length,
      });
    } catch (error) {
      console.error(`[RAG] Failed to generate embedding for chunk ${chunk.chunkIndex}:`, error);
      results.push({
        documentId: 0,
        chunkIndex: chunk.chunkIndex,
        content: chunk.content,
        metadata: JSON.stringify(chunk.metadata),
        embedding: null,
        embeddingProvider: provider || "ollama",
        embeddingModel: provider === "ollama" ? "nomic-embed-text" : "text-embedding-3-small",
        embeddingDimensions: null,
      });
    }
  }
  
  return results;
}

export async function indexDocumentFromFile(
  documentId: number,
  file: { name: string; mimeType: string; buffer: Buffer },
  provider?: string
): Promise<void> {
  try {
    const text = await extractText(file.name, file.mimeType, file.buffer);
    const chunks = chunkText(text);
    const totalChunks = chunks.length;

    await withRetry(`updateDocumentProgress(documentId=${documentId}, start)`, () =>
      updateDocumentProgress(documentId, 0, totalChunks)
    );

    let indexedCount = 0;
    const BATCH_SIZE = 10;

    for (let i = 0; i < chunks.length; i += BATCH_SIZE) {
      const batch = chunks.slice(i, i + BATCH_SIZE);
      const chunksWithEmbeddings = await generateChunksWithEmbeddings(batch, provider);

      const chunksWithDocId = chunksWithEmbeddings.map(c => ({
        ...c,
        documentId,
      }));

      await withRetry(
        `createDocumentChunkBatch(documentId=${documentId}, batchStart=${i})`,
        () => createDocumentChunkBatch(chunksWithDocId)
      );

      indexedCount += batch.length;
      await withRetry(`updateDocumentProgress(documentId=${documentId}, indexed=${indexedCount})`, () =>
        updateDocumentProgress(documentId, indexedCount, totalChunks)
      );
    }

    await withRetry(`updateDocumentStatusById(documentId=${documentId}, indexed)`, () =>
      updateDocumentStatusById(documentId, "indexed")
    );
  } catch (error) {
    console.error(`[RAG] indexDocumentFromFile failed for document ${documentId}:`, error);
    await withRetry(`updateDocumentStatusById(documentId=${documentId}, error)`, () =>
      updateDocumentStatusById(documentId, "error")
    );
    throw error;
  }
}

export async function saveDocumentForReview(
  documentId: number,
  text: string
): Promise<void> {
  const chunks = chunkText(text);
  const totalChunks = chunks.length;

  const chunksWithoutEmbeddings: InsertDocumentChunk[] = chunks.map((chunk) => ({
    documentId,
    chunkIndex: chunk.chunkIndex,
    content: chunk.content,
    metadata: JSON.stringify(chunk.metadata),
    embedding: null,
    embeddingProvider: null,
    embeddingModel: null,
    embeddingDimensions: null,
  }));

  if (chunksWithoutEmbeddings.length > 0) {
    await createDocumentChunkBatch(chunksWithoutEmbeddings);
  }

  await updateDocumentProgress(documentId, 0, totalChunks);
  await updateDocumentStatusById(documentId, "review");
}

export async function approveDocumentFromReview(
  documentId: number,
  provider?: string
): Promise<void> {
  try {
    const storedChunks = await getDocumentChunks(documentId);
    if (storedChunks.length === 0) {
      throw new Error("No review chunks available for this document");
    }

    await withRetry(`updateDocumentStatusById(documentId=${documentId}, processing)`, () =>
      updateDocumentStatusById(documentId, "processing")
    );
    await withRetry(`purgeDocumentChunks(documentId=${documentId})`, () =>
      purgeDocumentChunks(documentId)
    );

    const chunkPayload: Chunk[] = storedChunks.map((chunk) => {
      let metadata: Chunk["metadata"] = {};
      try {
        metadata = chunk.metadata ? JSON.parse(chunk.metadata) : {};
      } catch (error) {
        console.warn(
          `[RAG] Invalid chunk metadata during review approval (documentId=${documentId}, chunkIndex=${chunk.chunkIndex})`,
          error
        );
        metadata = {};
      }

      return {
        content: chunk.content,
        chunkIndex: chunk.chunkIndex,
        metadata,
      };
    });

    const totalChunks = chunkPayload.length;
    await withRetry(`updateDocumentProgress(documentId=${documentId}, start)`, () =>
      updateDocumentProgress(documentId, 0, totalChunks)
    );

    const BATCH_SIZE = 10;
    let indexedCount = 0;

    for (let i = 0; i < chunkPayload.length; i += BATCH_SIZE) {
      const batch = chunkPayload.slice(i, i + BATCH_SIZE);
      const withEmbeddings = await generateChunksWithEmbeddings(batch, provider);
      const withDocId = withEmbeddings.map((chunk) => ({ ...chunk, documentId }));

      await withRetry(
        `createDocumentChunkBatch(documentId=${documentId}, reviewBatchStart=${i})`,
        () => createDocumentChunkBatch(withDocId)
      );
      indexedCount += batch.length;
      await withRetry(`updateDocumentProgress(documentId=${documentId}, indexed=${indexedCount})`, () =>
        updateDocumentProgress(documentId, indexedCount, totalChunks)
      );
    }

    await withRetry(`updateDocumentStatusById(documentId=${documentId}, indexed)`, () =>
      updateDocumentStatusById(documentId, "indexed")
    );
  } catch (error) {
    console.error(`[RAG] approveDocumentFromReview failed for document ${documentId}:`, error);
    await withRetry(`updateDocumentStatusById(documentId=${documentId}, error)`, () =>
      updateDocumentStatusById(documentId, "error")
    );
    throw error;
  }
}

export async function indexDocumentFromJSON(
  userId: number,
  jsonData: {
    name: string;
    externalId?: string;
    sourceType?: string;
    legalStatus?: string;
    effectiveDate?: string;
    content: string;
    metadata?: Record<string, unknown>;
  }
): Promise<number> {
  const chunks = chunkText(jsonData.content);
  const estimatedSizeKB = estimateChunksSizeKB(chunks);

  const docData: Omit<InsertDocument, "userId"> = {
    name: jsonData.name,
    type: "text/plain",
    size: jsonData.content.length,
    status: "processing",
    isIndexed: 0,
    externalId: jsonData.externalId,
    sourceType: jsonData.sourceType,
    legalStatus: jsonData.legalStatus || "vigente",
    effectiveDate: jsonData.effectiveDate,
    totalChunks: chunks.length,
    indexedChunks: 0,
    estimatedSizeKB,
  };

  const result = await createDocumentRAG(userId, docData);
  const docId = (result as any)?.lastInsertRowid || (result as any)?.[0]?.id;

  if (!docId) {
    throw new Error("Failed to create document");
  }

  try {
    const numericDocId = Number(docId);
    const chunksWithDocId = await generateChunksWithEmbeddings(chunks);
    const finalChunks = chunksWithDocId.map(c => ({ ...c, documentId: numericDocId }));

    await withRetry(`createDocumentChunkBatch(documentId=${numericDocId}, jsonImport)`, () =>
      createDocumentChunkBatch(finalChunks)
    );
    await withRetry(`updateDocumentProgress(documentId=${numericDocId}, jsonImportDone)`, () =>
      updateDocumentProgress(numericDocId, chunks.length, chunks.length)
    );

    await withRetry(`updateDocumentStatusById(documentId=${numericDocId}, indexed)`, () =>
      updateDocumentStatusById(numericDocId, "indexed")
    );

    return numericDocId;
  } catch (error) {
    const numericDocId = Number(docId);
    console.error(`[RAG] indexDocumentFromJSON failed for document ${numericDocId}:`, error);
    await withRetry(`updateDocumentStatusById(documentId=${numericDocId}, error)`, () =>
      updateDocumentStatusById(numericDocId, "error")
    );
    throw error;
  }
}

export async function importPrecomputedEmbeddings(
  documentId: number,
  chunks: Array<{
    chunkIndex: number;
    content: string;
    metadata?: Record<string, unknown>;
    embedding: number[];
    embeddingProvider?: string;
    embeddingModel?: string;
  }>
): Promise<void> {
  try {
    const chunksToInsert = chunks.map(c => ({
      documentId,
      chunkIndex: c.chunkIndex,
      content: c.content,
      metadata: c.metadata ? JSON.stringify(c.metadata) : null,
      embedding: JSON.stringify(c.embedding),
      embeddingProvider: c.embeddingProvider || "colab",
      embeddingModel: c.embeddingModel || "nomic-embed-text",
      embeddingDimensions: c.embedding.length,
    }));

    await withRetry(`createDocumentChunkBatch(documentId=${documentId}, precomputedEmbeddings)`, () =>
      createDocumentChunkBatch(chunksToInsert)
    );
    await withRetry(`updateDocumentProgress(documentId=${documentId}, precomputedEmbeddingsDone)`, () =>
      updateDocumentProgress(documentId, chunks.length, chunks.length)
    );
    await withRetry(`updateDocumentStatusById(documentId=${documentId}, indexed)`, () =>
      updateDocumentStatusById(documentId, "indexed")
    );
  } catch (error) {
    console.error(`[RAG] importPrecomputedEmbeddings failed for document ${documentId}:`, error);
    await withRetry(`updateDocumentStatusById(documentId=${documentId}, error)`, () =>
      updateDocumentStatusById(documentId, "error")
    );
    throw error;
  }
}

export async function searchRelevantChunks(
  query: string,
  userId: number,
  topK: number = 5,
  filters?: SearchFilters
): Promise<SearchResult[]> {
  const docs = await getDocumentsRAG(userId, {
    legalStatus: filters?.legalStatus || "vigente",
  });
  
  const activeDocIds = docs.filter(d => d.status === "indexed").map(d => d.id);
  
  const searchFilters = {
    documentIds: filters?.documentIds?.length ? filters.documentIds : activeDocIds,
    minScore: filters?.minScore ?? 0.5,
    legalStatus: filters?.legalStatus || "vigente",
  };

  let chunks: Awaited<ReturnType<typeof searchDocumentChunksByVector>> = [];
  let usedKeywordFallback = false;

  try {
    const queryEmbedding = await generateEmbedding(query);
    chunks = await searchDocumentChunksByVector(
      userId,
      queryEmbedding,
      topK,
      searchFilters
    );
  } catch (error) {
    console.warn("[RAG] Embedding search failed; using keyword fallback:", error);
    usedKeywordFallback = true;
  }

  if (chunks.length === 0) {
    usedKeywordFallback = true;
    chunks = await searchDocumentChunksByKeyword(userId, query, topK, {
      documentIds: searchFilters.documentIds,
      legalStatus: filters?.legalStatus || "vigente",
    });
  }

  if (usedKeywordFallback) {
    console.log(`[RAG] Keyword fallback returned ${chunks.length} chunk(s)`);
  }
  
  const results: SearchResult[] = [];
  const docCache = new Map<number, typeof docs[0]>();
  
  for (const doc of docs) {
    docCache.set(doc.id, doc);
  }
  
  for (const chunk of chunks) {
    const doc = docCache.get(chunk.documentChunks.documentId);
    if (!doc) continue;
    
    await updateDocumentLastAccessed(chunk.documentChunks.documentId);
    
    let parsedMetadata: Record<string, unknown> = {};
    if (chunk.documentChunks.metadata) {
      try {
        parsedMetadata = JSON.parse(chunk.documentChunks.metadata);
      } catch (error) {
        console.warn(
          `[RAG] Invalid chunk metadata in search results (documentId=${chunk.documentChunks.documentId}, chunkIndex=${chunk.documentChunks.chunkIndex})`,
          error
        );
      }
    }

    results.push({
      content: chunk.documentChunks.content,
      score: chunk.score,
      documentId: chunk.documentChunks.documentId,
      documentName: doc.name,
      chunkIndex: chunk.documentChunks.chunkIndex,
      metadata: parsedMetadata,
    });
  }
  
  return results;
}

export async function getRAGStorageStats(userId: number) {
  return getStorageStats(userId);
}
