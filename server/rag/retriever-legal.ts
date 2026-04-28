import { truncateSmart } from "./retriever-patch";
import { retrieveLegalChunksPatched } from "./retriever-legal-patch";

export type LegalRetrieverOptions = {
  userId: number;
  query: string;
  mode?: "exploracao" | "citacao_exata";
  topK?: number;
  provider?: "forge" | "ollama" | "groq" | "gemini";
};

export function detectLegalExploratoryIntent(query: string): boolean {
  return /(hist[oó]ric|compara[cç][aã]o|reda[cç][aã]o anterior|evolu[cç][aã]o normativa)/i.test(query);
}

export async function retrieveLegalChunks(options: LegalRetrieverOptions) {
  const mode = options.mode || "exploracao";
  const exploratoryIntent = detectLegalExploratoryIntent(options.query);
  const minScoreOverride = mode === "citacao_exata" ? 0.55 : 0.35;

  const patched = await retrieveLegalChunksPatched({
    userId: options.userId,
    query: options.query,
    provider: options.provider || "ollama",
    mode: mode === "citacao_exata" ? "citacao_exata" : "exploratorio",
  });

  return {
    minScore: minScoreOverride,
    topK: 3,
    exploratory: exploratoryIntent || mode === "exploracao",
    chunks: patched.chunks.map((c) => ({
      score: c.score,
      documentChunks: {
        id: 0,
        documentId: c.documentId,
        chunkIndex: c.chunkIndex,
        content: truncateSmart(c.content, 800),
        metadata: null,
        embedding: null,
      },
    })),
  };
}
