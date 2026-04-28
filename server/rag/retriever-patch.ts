import { generateEmbedding } from "../_core/llm";
import {
  getDocumentsRAG,
  getUserSettings,
  searchDocumentChunksByKeyword,
  searchDocumentChunksByVector,
} from "../db";
import { recordRagMetrics } from "./metrics";

const DEFAULT_MIN_SCORE = 0.35;

export type PatchedRagOptions = {
  userId: number;
  query: string;
  provider?: "forge" | "ollama" | "groq" | "gemini";
  topK?: number;
  memoryContext?: string;
  preferencesContext?: string;
  exploratory?: boolean;
  documentIds?: number[];
  minScoreOverride?: number;
};

export type PatchedRagResult = {
  chunks: Array<{
    content: string;
    score: number;
    documentId: number;
    documentName: string;
    chunkIndex: number;
  }>;
  minScoreUsed: number;
  fallbackUsed: boolean;
  fallbackReason?: string;
  userNotice?: string;
};

export function truncateSmart(text: string, maxTokens = 800): string {
  const normalized = String(text || "").trim();
  if (!normalized) return "";

  const approxMaxChars = Math.max(400, Math.floor(maxTokens * 4));
  if (normalized.length <= approxMaxChars) return normalized;

  const headTarget = Math.floor(approxMaxChars * 0.7);
  const tailTarget = Math.floor(approxMaxChars * 0.25);

  const findCut = (s: string, idx: number): number => {
    const windowStart = Math.max(0, idx - 140);
    const windowEnd = Math.min(s.length, idx + 140);
    const window = s.slice(windowStart, windowEnd);
    const m = window.match(/([\.\!\?\n;:])\s+/g);
    if (!m || m.length === 0) return idx;
    const punctIndex = window.lastIndexOf(m[m.length - 1]);
    if (punctIndex < 0) return idx;
    return windowStart + punctIndex + m[m.length - 1].length;
  };

  const headCut = findCut(normalized, headTarget);
  const tailStartRaw = normalized.length - tailTarget;
  const tailStart = Math.max(headCut + 1, findCut(normalized, tailStartRaw));
  const head = normalized.slice(0, headCut).trim();
  const tail = normalized.slice(tailStart).trim();

  const compact = `${head}\n[...conteudo comprimido para contexto seguro...]\n${tail}`.trim();
  return compact.length <= approxMaxChars + 80 ? compact : compact.slice(0, approxMaxChars + 80);
}

function detectExploratoryIntent(query: string): boolean {
  return /(busca ampla|geral|panorama|vis[aã]o geral|explor|todos os documentos|sem filtro)/i.test(query);
}

function parseUserMinScore(settings: unknown): number {
  if (!settings || typeof settings !== "object") return DEFAULT_MIN_SCORE;
  const bag = settings as Record<string, unknown>;
  const candidate = bag.rag_min_score ?? bag.ragMinScore;
  const parsed = Number(candidate);
  if (!Number.isFinite(parsed)) return DEFAULT_MIN_SCORE;
  return Math.max(0.1, Math.min(0.95, parsed));
}

export async function retrieveRelevantChunksPatched(options: PatchedRagOptions): Promise<PatchedRagResult> {
  const startedAt = Date.now();
  const topK = options.topK ?? (options.provider === "ollama" ? 3 : 5);

  const userSettings = await getUserSettings(options.userId);
  const minScore = typeof options.minScoreOverride === "number"
    ? Math.max(0.1, Math.min(0.95, options.minScoreOverride))
    : parseUserMinScore(userSettings);

  const exploratoryMode = options.exploratory ?? detectExploratoryIntent(options.query);
  const legalStatusMode = exploratoryMode ? "any" : "vigente";

  const docs = await getDocumentsRAG(options.userId, exploratoryMode ? undefined : { legalStatus: "vigente" });
  const defaultDocIds = docs
    .filter((d) => exploratoryMode || d.status === "indexed")
    .map((d) => d.id);

  const allowedDocIds = options.documentIds && options.documentIds.length > 0 ? options.documentIds : defaultDocIds;

  const contextParts = [
    options.query,
    options.memoryContext ? `memoria: ${options.memoryContext}` : "",
    options.preferencesContext ? `preferencias: ${options.preferencesContext}` : "",
  ].filter(Boolean);
  const enrichedQuery = contextParts.join("\n");

  let fallbackUsed = false;
  let fallbackReason = "";

  let vectorResults: Awaited<ReturnType<typeof searchDocumentChunksByVector>> = [];
  try {
    const embedding = await generateEmbedding(enrichedQuery);
    vectorResults = await searchDocumentChunksByVector(options.userId, embedding, topK, {
      documentIds: allowedDocIds,
      minScore,
      legalStatus: legalStatusMode,
    });
  } catch (error) {
    fallbackUsed = true;
    fallbackReason = `embedding_failed: ${error instanceof Error ? error.message : String(error)}`;
  }

  let selected = vectorResults;
  if (selected.length === 0) {
    fallbackUsed = true;
    if (!fallbackReason) fallbackReason = "below_min_score_or_empty";
    selected = await searchDocumentChunksByKeyword(options.userId, enrichedQuery, topK, {
      documentIds: allowedDocIds,
      legalStatus: legalStatusMode,
    });
  }

  const docMap = new Map<number, string>();
  for (const doc of docs) docMap.set(doc.id, doc.name);

  const chunks = selected.map((row) => ({
    content: truncateSmart(row.documentChunks.content, 800),
    score: row.score,
    documentId: row.documentChunks.documentId,
    documentName: docMap.get(row.documentChunks.documentId) || "Documento",
    chunkIndex: row.documentChunks.chunkIndex,
  }));

  await recordRagMetrics({
    userId: options.userId,
    query: options.query,
    latencyMs: Date.now() - startedAt,
    hitCount: chunks.length,
    topK,
    fallbackUsed,
    fallbackReason: fallbackReason || undefined,
    minScore,
    provider: options.provider,
  });

  return {
    chunks,
    minScoreUsed: minScore,
    fallbackUsed,
    fallbackReason: fallbackReason || undefined,
    userNotice: fallbackUsed
      ? "A busca vetorial nao trouxe evidencia suficiente; usei fallback por palavras-chave para ampliar cobertura."
      : undefined,
  };
}
