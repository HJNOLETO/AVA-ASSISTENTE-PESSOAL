// @vitest-environment node
import { describe, expect, it, vi, beforeEach } from "vitest";

vi.mock("../../server/db", () => ({
  getDocumentsRAG: vi.fn(async () => [{ id: 1, name: "Lei Nº 1234", externalId: "Lei Nº 1234", sourceType: "legal" }]),
  addAuditLog: vi.fn(async () => undefined),
}));

vi.mock("../../server/rag/retriever-legal", () => ({
  retrieveLegalChunks: vi.fn(),
}));

import { validateLegalCitations } from "../../server/rag/citation-validator";
import { retrieveLegalChunks } from "../../server/rag/retriever-legal";

describe("integration citation validator real", () => {
  beforeEach(() => {
    // Padrao: retrieval retorna score 0.75 (confidence >= 0.6) → citacoes passam
    vi.mocked(retrieveLegalChunks).mockResolvedValue({
      chunks: [{ score: 0.75, documentChunks: { content: "Art. 1 Lei 1234", id: 0, documentId: 1, chunkIndex: 0, metadata: null, embedding: null } }],
      minScore: 0.55,
      topK: 3,
      exploratory: false,
    });
  });

  it("pass para citação válida no formato canônico", async () => {
    // "Lei Nº 1234" → corpus hit (confidence 0.7) + "Art. 1" → retrieval hit (0.75) → todos >= 0.6
    // Formato canônico satisfaz o malformedCitation regex → status "pass"
    const out = await validateLegalCitations(
      1,
      "[Lei Nº 1234, Art. 1, Inciso I, Vigência: 01/01/2024]",
    );
    expect(out.status).toBe("pass");
  });

  it("blocked para citação inexistente no corpus", async () => {
    // Sobrescreve: retrieval vazio → confidence 0.45 para todas citações → blocked
    vi.mocked(retrieveLegalChunks).mockResolvedValue({
      chunks: [],
      minScore: 0.55,
      topK: 3,
      exploratory: false,
    });
    const out = await validateLegalCitations(1, "Citação: Art. 999 da Lei 0000");
    expect(out.status).toBe("blocked");
  });

  it("blocked ou fail para citação sem formato canônico", async () => {
    // Citações sem corpus hit (Lei 1234 ≠ "Lei Nº 1234") + retrieval vazio → blocked
    vi.mocked(retrieveLegalChunks).mockResolvedValue({
      chunks: [],
      minScore: 0.55,
      topK: 3,
      exploratory: false,
    });
    const out = await validateLegalCitations(1, "Lei 1234 art 1 sem formato correto");
    expect(["fail", "blocked"]).toContain(out.status);
  });
});
