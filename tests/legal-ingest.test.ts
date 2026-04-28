// @vitest-environment node
import { describe, expect, it } from "vitest";
import { chunkLegalText, parseLegalMetadata } from "../server/rag/legal-ingest";

describe("legal-ingest", () => {
  it("faz chunking por artigo/paragrafo", () => {
    const text = "Art. 1 O teste. § 1 Primeiro. § 2 Segundo.\nArt. 2 Outro artigo.";
    const chunks = chunkLegalText(text);
    expect(chunks.length).toBeGreaterThanOrEqual(2);
    expect(chunks[0].content).toContain("Art.");
  });

  it("extrai metadados basicos", () => {
    const text = "Lei n 1234/2020. Federal. Esta lei dispoe sobre tema X.";
    const md = parseLegalMetadata(text, "lei.md");
    expect(md.numero).toContain("LEI");
    expect(md.esfera).toBe("federal");
  });
});
