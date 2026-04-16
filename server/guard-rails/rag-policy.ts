import { auditLog } from "./audit-logger.js";

export type RagDomain = "geral" | "juridico" | "saude" | "financeiro";

export interface RagEvidence {
  source_name: string;
  source_domain: string;
  score: number;
  citation?: string;
}

const TRUSTED_SOURCES: Record<RagDomain, string[]> = {
  geral: ["docs", "manual", "knowledge-base"],
  juridico: ["planalto", "stf", "stj", "cnj", "lexml", "jusbrasil"],
  saude: ["anvisa", "ms.gov", "who", "pubmed"],
  financeiro: ["bcb", "receita", "cvm", "planalto"],
};

const MIN_CONFIDENCE_SCORE = 0.65;

const CONCLUSIVE_PATTERNS = [
  /com certeza/i,
  /definitivamente/i,
  /e fato que/i,
  /nao ha duvida/i,
];

export function getTrustedSourceDomains(): RagDomain[] {
  return Object.keys(TRUSTED_SOURCES) as RagDomain[];
}

export function filterTrustedEvidence(domain: RagDomain, evidence: RagEvidence[]): RagEvidence[] {
  const allowed = TRUSTED_SOURCES[domain];
  return evidence.filter((item) =>
    allowed.some((source) => item.source_domain.toLowerCase().includes(source))
  );
}

export function validateRagOutput(params: {
  request_id: string;
  domain: RagDomain;
  answer: string;
  evidence: RagEvidence[];
}):
  | { allowed: true; evidence: RagEvidence[] }
  | { allowed: false; reason: string } {
  const trustedEvidence = filterTrustedEvidence(params.domain, params.evidence);
  const evidenceWithScore = trustedEvidence.filter((item) => item.score >= MIN_CONFIDENCE_SCORE);
  const hasCitation = evidenceWithScore.some((item) => !!item.citation && item.citation.trim().length > 0);
  const isConclusive = CONCLUSIVE_PATTERNS.some((pattern) => pattern.test(params.answer));

  if (isConclusive && (!hasCitation || evidenceWithScore.length === 0)) {
    auditLog({
      request_id: params.request_id,
      event: "rag_blocked",
      timestamp: new Date().toISOString(),
      details: {
        reason: "conclusive_without_evidence",
        domain: params.domain,
      },
    });
    return { allowed: false, reason: "Resposta conclusiva sem evidencia minima" };
  }

  if (evidenceWithScore.length === 0) {
    return { allowed: false, reason: "Sem evidencia com score minimo" };
  }

  return { allowed: true, evidence: evidenceWithScore };
}
