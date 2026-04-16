/**
 * GUARD RAILS — Classificador de Intenção v1 (P0.2)
 *
 * Classifica toda requisição antes de qualquer execução de skill/RAG/DB.
 * Taxonomia fixa com saída estruturada e fallback para baixa confiança.
 */

import type { CanonicalRequest } from "./canonical-schema.js";

// ─── Taxonomia de Intenções ──────────────────────────────────────────────────

export type IntentType =
  | "informacional"   // Perguntas, buscas, consultas de dados
  | "transacional"    // Criar, editar, deletar registros
  | "automacao"       // Tarefas cron, watchers, agendamentos
  | "sensivel"        // Dados pessoais, financeiros, jurídicos
  | "alto_risco";     // Operações irreversíveis, admin, deleção em massa

export type RiskLevel = "low" | "medium" | "high" | "critical";

export interface IntentClassification {
  intent: IntentType;
  risk_level: RiskLevel;
  confidence: number;       // 0.0 – 1.0
  requires_confirmation: boolean;
  requires_fallback: boolean;
  reasoning: string;
  detected_entities: string[];
}

// ─── Padrões por Intenção ────────────────────────────────────────────────────

const INTENT_PATTERNS: Array<{
  intent: IntentType;
  risk_level: RiskLevel;
  keywords: RegExp[];
  weight: number;
}> = [
  // ALTO RISCO — operações críticas irreversíveis
  {
    intent: "alto_risco",
    risk_level: "critical",
    keywords: [
      /\bdelete\b.*\btodos?\b/i,
      /\bapag[ae]r?\b.*\btodos?\b/i,
      /\bremov[ae]r?\b.*\btodos?\b/i,
      /\bdrop\b.*\btabl[ae]?\b/i,
      /\bformat[ae]r?\b.*\bdisco\b/i,
      /\bredefin[iae]r?\b.*\btodc\b/i,
      /\badmin\b.*\bpermiss[aã]o\b/i,
    ],
    weight: 10,
  },
  // SENSÍVEL — dados pessoais, financeiros, jurídicos
  {
    intent: "sensivel",
    risk_level: "high",
    keywords: [
      /\bcpf\b/i, /\bsenha\b/i, /\bpassword\b/i,
      /\bcart[aã]o\b.*\bcr[eé]dito\b/i,
      /\bdados? banc[aá]rios?\b/i,
      /\bhonor[aá]rios?\b/i,
      /\bprocess[oa]\b.*\bjur[ií]dic[oa]\b/i,
      /\bcliente\b.*\bconfidencial\b/i,
      /\bpront[uú]ario\b/i,
    ],
    weight: 8,
  },
  // AUTOMAÇÃO — agendamentos, watchers, cron
  {
    intent: "automacao",
    risk_level: "medium",
    keywords: [
      /\bagendar?\b/i, /\blembrete\b/i, /\bautomati[zs][ae]r?\b/i,
      /\bcron\b/i, /\bwatcher\b/i, /\bmonitor[ae]r?\b/i,
      /\brepetiç[aã]o\b/i, /\bperi[oó]dico\b/i,
      /\bnotific[ae]r?\b.*\bautom[aá]tic[ao]\b/i,
    ],
    weight: 6,
  },
  // TRANSACIONAL — CRUD de dados
  {
    intent: "transacional",
    risk_level: "medium",
    keywords: [
      /\bcriar?\b/i, /\bcadastr[ae]r?\b/i, /\bregistr[ae]r?\b/i,
      /\bsalvar?\b/i, /\bupdate\b/i, /\batualiz[ae]r?\b/i,
      /\bedit[ae]r?\b/i, /\bapag[ae]r?\b/i, /\bdelete\b/i,
      /\bremov[ae]r?\b/i, /\binserir?\b/i, /\badicionar?\b/i,
    ],
    weight: 4,
  },
  // INFORMACIONAL — consultas e buscas (default)
  {
    intent: "informacional",
    risk_level: "low",
    keywords: [
      /\bquando\b/i, /\bonde\b/i, /\bquem\b/i, /\bque\b/i,
      /\bcomo\b/i, /\bpor que\b/i, /\bquais?\b/i,
      /\blist[ae]r?\b/i, /\bmost[re]ar?\b/i, /\bbuscar?\b/i,
      /\bpesquisar?\b/i, /\bconsultar?\b/i, /\bver\b/i,
      /\bexibir?\b/i, /\beverific[ae]r?\b/i,
    ],
    weight: 2,
  },
];

// ─── Thresholds de Confiança ─────────────────────────────────────────────────

const CONFIDENCE_THRESHOLD_FALLBACK = 0.3;   // Abaixo → pedir mais contexto
const CONFIDENCE_THRESHOLD_CONFIRM = 0.5;    // Entre 0.3-0.5 → solicitar confirmação

// ─── Classificador Principal ──────────────────────────────────────────────────

export function classifyIntent(request: CanonicalRequest): IntentClassification {
  // Extrai o texto a ser analisado
  const text =
    request.payload.type === "text"
      ? request.payload.content
      : request.payload.type === "voice"
        ? (request.payload.transcription ?? "")
        : "";

  const scores: Record<IntentType, number> = {
    informacional: 0,
    transacional: 0,
    automacao: 0,
    sensivel: 0,
    alto_risco: 0,
  };

  const detectedEntities: string[] = [];

  // Calcula scores por padrão
  for (const pattern of INTENT_PATTERNS) {
    for (const kw of pattern.keywords) {
      const matches = text.match(kw);
      if (matches) {
        scores[pattern.intent] += pattern.weight;
        if (matches[0] && !detectedEntities.includes(matches[0].toLowerCase())) {
          detectedEntities.push(matches[0].toLowerCase());
        }
      }
    }
  }

  // Determina a intenção dominante
  const totalScore = Object.values(scores).reduce((a, b) => a + b, 0);

  let dominantIntent: IntentType = "informacional";
  let maxScore = 0;

  for (const [intent, score] of Object.entries(scores) as [IntentType, number][]) {
    if (score > maxScore) {
      maxScore = score;
      dominantIntent = intent;
    }
  }

  // Calcula confiança normalizada
  const confidence = totalScore > 0 ? Math.min(maxScore / totalScore, 1.0) : 0.5;

  // Determina o risk_level associado
  const patternInfo = INTENT_PATTERNS.find(p => p.intent === dominantIntent);
  const riskLevel: RiskLevel = patternInfo?.risk_level ?? "low";

  // Determina se precisa de confirmação ou fallback
  const requires_fallback = confidence < CONFIDENCE_THRESHOLD_FALLBACK;
  const requires_confirmation =
    !requires_fallback &&
    (confidence < CONFIDENCE_THRESHOLD_CONFIRM ||
      riskLevel === "critical" ||
      riskLevel === "high");

  // Gera reasoning legível
  const reasoning = requires_fallback
    ? `Confiança baixa (${(confidence * 100).toFixed(0)}%). Necessário mais contexto.`
    : `Intenção '${dominantIntent}' detectada com ${(confidence * 100).toFixed(0)}% de confiança. Risco: ${riskLevel}.`;

  return {
    intent: dominantIntent,
    risk_level: riskLevel,
    confidence,
    requires_confirmation,
    requires_fallback,
    reasoning,
    detected_entities: detectedEntities,
  };
}

/**
 * Classifica a intenção a partir de texto puro (helper para integração).
 */
export function classifyText(text: string, userId?: number | null): IntentClassification {
  const fakeRequest = {
    request_id: "classify-only",
    canal: "internal" as const,
    usuario: {
      id: userId ?? null,
      role: userId ? ("user" as const) : ("anonymous" as const),
    },
    timestamp: new Date().toISOString(),
    payload: { type: "text" as const, content: text },
  };
  return classifyIntent(fakeRequest as CanonicalRequest);
}
