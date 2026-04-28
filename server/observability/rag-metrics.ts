import crypto from "node:crypto";
import { addSystemLog } from "../db";

export type RagMetricEvent = {
  userId: number;
  query: string;
  latencyMs: number;
  hitCount: number;
  minScoreApplied: number;
  fallbackUsed: boolean;
  citationConfidence?: number;
};

export function hashQuery(query: string): string {
  return crypto.createHash("sha256").update(String(query || "")).digest("hex").slice(0, 16);
}

export async function addRagMetric(event: RagMetricEvent): Promise<void> {
  await addSystemLog("RAG_METRIC", "INFO", event.userId, {
    query_hash: hashQuery(event.query),
    latency_ms: event.latencyMs,
    hit_count: event.hitCount,
    min_score_applied: event.minScoreApplied,
    fallback_used: event.fallbackUsed,
    citation_confidence: event.citationConfidence ?? null,
  });
}
