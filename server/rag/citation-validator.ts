import { addAuditLog, getDocumentsRAG } from "../db";
import { retrieveLegalChunks } from "./retriever-legal";

export type CitationValidationItem = {
  citation: string;
  confidenceScore: number;
  status: "pass" | "fail";
};

export type CitationValidationResult = {
  status: "pass" | "fail" | "blocked";
  message?: string;
  items: CitationValidationItem[];
};

function extractCitations(text: string): string[] {
  const lei = Array.from(text.matchAll(/\b(?:Lei|Decreto)\s*(?:n[.o\u00BA\u00B0]?\s*)?[\d.\/]+/gi)).map((m) => m[0]);
  const artigos = Array.from(text.matchAll(/\bArt\.?\s*\d+[A-Za-z0-9\-º°]*/gi)).map((m) => m[0]);
  return Array.from(new Set([...lei, ...artigos]));
}

export async function validateLegalCitations(userId: number, llmAnswer: string): Promise<CitationValidationResult> {
  const citations = extractCitations(llmAnswer);
  if (citations.length === 0) {
    return { status: "pass", items: [] };
  }

  const docs = await getDocumentsRAG(userId, { sourceType: "legal" });
  const indexedCorpus = docs.map((d) => `${d.name} ${d.externalId || ""}`).join("\n").toLowerCase();

  const items: CitationValidationItem[] = [];
  const citationFormatRegex = /\[(Lei|Decreto)\s*[^\]]+Art\.\s*[^\]]+Vig[eê]ncia:\s*[^\]]+\]/i;
  const malformedCitation = citations.length > 0 && !citationFormatRegex.test(llmAnswer);
  for (const citation of citations) {
    const citationNorm = citation.toLowerCase();
    const corpusHit = indexedCorpus.includes(citationNorm);
    let confidence = corpusHit ? 0.7 : 0.45;

    if (!corpusHit) {
      const retrieval = await retrieveLegalChunks({ userId, query: citation, mode: "citacao_exata", topK: 3 });
      confidence = retrieval.chunks.length > 0 ? Math.max(0.6, retrieval.chunks[0].score) : 0.45;
    }

    items.push({
      citation,
      confidenceScore: Number(confidence.toFixed(3)),
      status: confidence >= 0.6 ? "pass" : "fail",
    });
  }

  const hasLowConfidence = items.some((item) => item.confidenceScore < 0.6);
  const status: CitationValidationResult["status"] = hasLowConfidence ? "blocked" : malformedCitation ? "fail" : "pass";
  await addAuditLog({
    userId,
    action: "LEGAL_CITATION_VALIDATION",
    entity: "rag",
    details: JSON.stringify({ citation_validation: hasLowConfidence ? "blocked" : malformedCitation ? "fail" : "pass", items }),
  });

  if (hasLowConfidence) {
    return {
      status,
      message: "Não consta na base indexada com precisão suficiente.",
      items,
    };
  }

  return { status, items };
}
