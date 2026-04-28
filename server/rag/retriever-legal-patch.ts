import { retrieveRelevantChunksPatched } from "./retriever-patch";
import { addRagMetric } from "../observability/rag-metrics";

export type RetrieverLegalPatchOptions = {
  userId: number;
  query: string;
  mode?: "exploratorio" | "citacao_exata";
  provider?: "forge" | "ollama" | "groq" | "gemini";
};

function detectExploratory(query: string): boolean {
  return /(historic|hist[oó]ric|compara[cç][aã]o|reda[cç][aã]o antiga|evolu[cç][aã]o)/i.test(query);
}

export async function retrieveLegalChunksPatched(options: RetrieverLegalPatchOptions) {
  const started = Date.now();
  const exploratory = options.mode === "exploratorio" || detectExploratory(options.query);
  const minScore = options.mode === "citacao_exata" ? 0.55 : 0.35;

  const out = await retrieveRelevantChunksPatched({
    userId: options.userId,
    query: options.query,
    provider: options.provider || "ollama",
    topK: 3,
    exploratory,
    minScoreOverride: minScore,
  });

  await addRagMetric({
    userId: options.userId,
    query: options.query,
    latencyMs: Date.now() - started,
    hitCount: out.chunks.length,
    minScoreApplied: minScore,
    fallbackUsed: out.fallbackUsed,
  });

  return out;
}
