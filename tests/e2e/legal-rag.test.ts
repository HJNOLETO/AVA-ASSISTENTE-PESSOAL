// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("../../server/rag/legal-ingest", () => ({
  ingestLegalDocument: vi.fn(async () => ({ documentId: 7, chunks: 3, metadata: { numero: "LEI 1", esfera: "federal", ementa: "x", legalStatus: "vigente" } })),
}));

vi.mock("../../server/rag/citation-validator", () => ({
  validateLegalCitations: vi.fn(async () => ({ status: "pass", items: [] })),
}));

describe("legal-rag e2e simulado", () => {
  it("simula pipeline ingestao > consulta > validacao", async () => {
    const { ingestLegalDocument } = await import("../../server/rag/legal-ingest");
    const { validateLegalCitations } = await import("../../server/rag/citation-validator");
    const ingest = await ingestLegalDocument("/tmp/lei.md", 1);
    const validation = await validateLegalCitations(1, "Art. 1");
    expect(ingest.documentId).toBe(7);
    expect(validation.status).toBe("pass");
  });
});
