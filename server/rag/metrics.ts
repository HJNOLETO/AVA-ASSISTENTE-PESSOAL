import { addSystemLog } from "../db";

export type RagMetricPayload = {
  userId: number;
  query: string;
  latencyMs: number;
  hitCount: number;
  topK: number;
  fallbackUsed: boolean;
  fallbackReason?: string;
  minScore: number;
  provider?: string;
};

export async function recordRagMetrics(payload: RagMetricPayload): Promise<void> {
  const hitRate = payload.topK > 0 ? payload.hitCount / payload.topK : 0;
  await addSystemLog("RAG_RETRIEVAL_METRICS", "INFO", payload.userId, {
    query: payload.query.slice(0, 240),
    latency_ms: payload.latencyMs,
    hit_count: payload.hitCount,
    top_k: payload.topK,
    hit_rate: Number(hitRate.toFixed(4)),
    fallback_used: payload.fallbackUsed,
    fallback_reason: payload.fallbackReason || null,
    min_score: payload.minScore,
    provider: payload.provider || null,
  });
}
