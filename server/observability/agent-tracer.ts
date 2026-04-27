import fs from "node:fs/promises";
import path from "node:path";
import { nanoid } from "nanoid";
import { addAgentCycle, addSystemLog } from "../db";

export type AgentTracerState =
  | "INTENT_PARSE"
  | "PLAN"
  | "GUARD_VALIDATE"
  | "DRY_RUN"
  | "CONFIRM"
  | "EXECUTE"
  | "UPDATE_DB_RAG"
  | "FEEDBACK";

export type AgentCycleTrace = {
  cycle_id: string;
  user_id?: number;
  started_at: string;
  finished_at?: string;
  state_transitions: AgentTracerState[];
  tool_exec_ms: number;
  rag_min_score_applied?: number;
  rag_hit_count: number;
  llm_tokens_in: number;
  llm_tokens_out: number;
  confirmation_required: boolean;
  final_status: "completed" | "aborted" | "error";
  metadata?: Record<string, unknown>;
};

const tracePath = path.resolve(process.cwd(), "data", "agent-cycles.jsonl");

export function createCycleTracer(userId?: number) {
  const startedAt = Date.now();
  const trace: AgentCycleTrace = {
    cycle_id: `cycle_${nanoid(12)}`,
    user_id: userId,
    started_at: new Date(startedAt).toISOString(),
    state_transitions: [],
    tool_exec_ms: 0,
    rag_hit_count: 0,
    llm_tokens_in: 0,
    llm_tokens_out: 0,
    confirmation_required: false,
    final_status: "completed",
  };

  return {
    trace,
    pushState(state: AgentTracerState) {
      trace.state_transitions.push(state);
    },
    addToolExecMs(ms: number) {
      trace.tool_exec_ms += Math.max(0, Math.round(ms));
    },
    setRag(minScore: number | undefined, hitCount: number | undefined) {
      if (typeof minScore === "number") trace.rag_min_score_applied = minScore;
      if (typeof hitCount === "number") trace.rag_hit_count = Math.max(0, hitCount);
    },
    setTokenUsage(inputTokens = 0, outputTokens = 0) {
      trace.llm_tokens_in = Math.max(0, Math.round(inputTokens));
      trace.llm_tokens_out = Math.max(0, Math.round(outputTokens));
    },
    markConfirmationRequired() {
      trace.confirmation_required = true;
    },
    async finish(finalStatus: "completed" | "aborted" | "error", metadata?: Record<string, unknown>) {
      trace.final_status = finalStatus;
      trace.finished_at = new Date().toISOString();
      trace.metadata = metadata;

      await persistCycleTrace(trace);
      await addSystemLog("AGENT_CYCLE_TRACE", "INFO", trace.user_id, trace);
      await addAgentCycle({
        userId: trace.user_id,
        cycleId: trace.cycle_id,
        finalStatus: finalStatus,
        stateTransitions: JSON.stringify(trace.state_transitions),
        toolExecMs: trace.tool_exec_ms,
        ragMinScoreApplied: trace.rag_min_score_applied,
        ragHitCount: trace.rag_hit_count,
        llmTokensIn: trace.llm_tokens_in,
        llmTokensOut: trace.llm_tokens_out,
        confirmationRequired: trace.confirmation_required ? 1 : 0,
        metadata: metadata ? JSON.stringify(metadata) : null,
      });
    },
  };
}

async function persistCycleTrace(trace: AgentCycleTrace): Promise<void> {
  try {
    await fs.mkdir(path.dirname(tracePath), { recursive: true });
    await fs.appendFile(tracePath, `${JSON.stringify(trace)}\n`, "utf-8");
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    console.warn(`[AgentTracer] Falha ao persistir JSONL: ${details}`);
  }
}
