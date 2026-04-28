// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("../../server/_core/llm", () => ({
  generateEmbedding: vi.fn(async () => [0.2, 0.4, 0.6]),
}));

vi.mock("../../server/db", async (importOriginal) => {
  const actual = await importOriginal<any>();
  return {
    ...actual,
    getUserSettings: vi.fn(async () => ({ rag_min_score: 0.35 })),
  };
});

import { retrieveLegalChunksPatched } from "../../server/rag/retriever-legal-patch";
import { truncateSmart } from "../../server/rag/retriever-patch";

describe("integration rag legal real", () => {
  it("aplica topK=3 e minScore dinamico", async () => {
    const out = await retrieveLegalChunksPatched({ userId: 1, query: "artigo 5", mode: "citacao_exata" });
    expect(out.minScoreUsed).toBe(0.55);
    expect(out.chunks.length).toBeLessThanOrEqual(3);
  });

  it("truncateSmart preserva contexto legal", () => {
    const long = `${"Art. 5 inciso x ".repeat(500)} fim.`;
    const cut = truncateSmart(long, 800);
    expect(cut).toContain("Art.");
  });
});
