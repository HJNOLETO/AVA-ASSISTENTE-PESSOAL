// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("../server/db", () => ({
  getUserSettings: vi.fn(async () => ({ legal_rag_min_score_exact: 0.66 })),
  getDocumentsRAG: vi.fn(async () => [{ id: 1, name: "Lei teste", status: "indexed" }]),
  addSystemLog: vi.fn(async () => undefined),
  searchDocumentChunksByVector: vi.fn(async () => []),
  searchDocumentChunksByKeyword: vi.fn(async () => [{
    documentChunks: { id: 1, documentId: 1, chunkIndex: 0, content: "Art. 5 exemplo", metadata: null, embedding: null },
    score: 0.9,
  }]),
}));

vi.mock("../server/_core/llm", () => ({
  generateEmbedding: vi.fn(async () => [0.1, 0.2]),
}));

import { retrieveLegalChunks } from "../server/rag/retriever-legal";

describe("retriever-legal", () => {
  it("aplica minScore dinamico e topK entre 3-5", async () => {
    const res = await retrieveLegalChunks({ userId: 1, query: "Art. 5", mode: "citacao_exata", topK: 9 });
    expect(res.minScore).toBe(0.55);
    expect(res.topK).toBe(3);
    expect(res.chunks.length).toBe(1);
  });
});
