// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("../server/db", () => ({
  getDocumentsRAG: vi.fn(async () => [{ id: 1, name: "Doc A", status: "indexed" }]),
  getUserSettings: vi.fn(async () => ({ rag_min_score: 0.42 })),
  searchDocumentChunksByVector: vi.fn(async () => []),
  searchDocumentChunksByKeyword: vi.fn(async () => [
    {
      documentChunks: {
        documentId: 1,
        chunkIndex: 0,
        content: "Conteudo fallback keyword",
      },
      score: 0.8,
    },
  ]),
}));

vi.mock("../server/_core/llm", () => ({
  generateEmbedding: vi.fn(async () => {
    throw new Error("embedding down");
  }),
}));

vi.mock("../server/rag/metrics", () => ({
  recordRagMetrics: vi.fn(async () => undefined),
}));

import { retrieveRelevantChunksPatched, truncateSmart } from "../server/rag/retriever-patch";
import { searchDocumentChunksByKeyword } from "../server/db";

describe("rag-retriever patch", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("usa minScore dinamico de userSettings e aciona fallback keyword", async () => {
    const res = await retrieveRelevantChunksPatched({
      userId: 1,
      query: "buscar jurisprudencia",
      provider: "ollama",
    });

    expect(res.minScoreUsed).toBe(0.42);
    expect(res.fallbackUsed).toBe(true);
    expect(res.chunks.length).toBe(1);
    expect((searchDocumentChunksByKeyword as any).mock.calls[0][2]).toBe(3);
  });

  it("truncateSmart comprime sem cortar totalmente a conclusao", () => {
    const longText = `${"inicio ".repeat(600)} fim conclusivo importante.`;
    const truncated = truncateSmart(longText, 120);
    expect(truncated.length).toBeLessThan(longText.length);
    expect(truncated.toLowerCase()).toContain("conclusivo");
  });
});
