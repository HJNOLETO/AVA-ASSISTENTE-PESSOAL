// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

vi.mock("../server/db", () => ({
  getDocumentsRAG: vi.fn(async () => [{ id: 1, name: "Lei 1234", externalId: "Lei 1234", sourceType: "legal" }]),
  addAuditLog: vi.fn(async () => undefined),
}));

vi.mock("../server/rag/retriever-legal", () => ({
  retrieveLegalChunks: vi.fn(async () => ({ chunks: [{ score: 0.8 }] })),
}));

import { validateLegalCitations } from "../server/rag/citation-validator";
import { retrieveLegalChunks } from "../server/rag/retriever-legal";

describe("citation-validator", () => {
  it("bloqueia quando confidence < 0.6", async () => {
    (retrieveLegalChunks as any).mockResolvedValueOnce({ chunks: [] });
    const res = await validateLegalCitations(1, "Nos termos do Art. 999 da Lei 0000/1900");
    expect(res.status).toBe("blocked");
    expect(res.message).toContain("precisão suficiente");
  });

  it("aprova citacao formatada com confianca >= 0.75", async () => {
    const res = await validateLegalCitations(
      1,
      "Conforme [Lei Nº 1234, Art. 1, Inciso I, Vigência: 01/01/2020], aplica-se a regra."
    );
    expect(res.status).toBe("pass");
  });
});
