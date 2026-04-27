import type { Message, ToolCall } from "../_core/llm";
import { orchestrateAgentResponse } from "../agents";
import { addAuditLog, addMemoryEntry, getUserSettings, searchMemoryByKeywords } from "../db";
import { evaluateToolExecution } from "../tool-registry";
import { createCycleTracer } from "../observability/agent-tracer";
import { compactUserContext, inject, prioritize } from "../context/manager";

export type AgentState =
  | "INTENT_PARSE"
  | "PLAN"
  | "GUARD_VALIDATE"
  | "DRY_RUN"
  | "CONFIRM"
  | "EXECUTE"
  | "UPDATE_DB_RAG"
  | "FEEDBACK";

export type AgentContext = {
  userId: number;
  provider: "forge" | "ollama" | "groq" | "gemini";
  model?: string;
  maxToolCalls?: number;
  maxCycles?: number;
  requireConfirmation?: (toolName: string, args: Record<string, unknown>) => Promise<boolean>;
  executeTool: (toolCall: ToolCall, args: Record<string, unknown>) => Promise<{ output: string; ok: boolean; rollback?: () => Promise<void> }>;
};

export type AgentResult = {
  cycleId: string;
  status: "completed" | "aborted";
  finalResponse: string;
  states: AgentState[];
  toolCalls: number;
  repeatedIntentCount: number;
  abortedReason?: string;
};

export async function requireConfirmation(toolName: string, args: Record<string, unknown>): Promise<boolean> {
  const decision = await evaluateToolExecution(toolName, args, "cli");
  if (decision.riskLevel === "medium" || decision.riskLevel === "high") {
    return Boolean(args.confirmed === true || args.confirmation === true || args.confirmado === true);
  }
  return true;
}

function buildPlanningPrompt(query: string, memory: string, prefs: string): string {
  return [
    query,
    memory ? `\n[context.memory]\n${memory}` : "",
    prefs ? `\n[context.preferences]\n${prefs}` : "",
  ]
    .filter(Boolean)
    .join("\n");
}

export async function runAgentCycle(query: string, context: AgentContext): Promise<AgentResult> {
  const tracer = createCycleTracer(context.userId);
  const states: AgentState[] = [];
  const maxToolCalls = context.maxToolCalls ?? 12;
  const maxCycles = context.maxCycles ?? 12;
  const needsConfirmation = context.requireConfirmation || requireConfirmation;

  states.push("INTENT_PARSE");
  tracer.pushState("INTENT_PARSE");
  const userSettings = await getUserSettings(context.userId);
  const memHits = await searchMemoryByKeywords(context.userId, query);
  const compactMemory = memHits
    .slice(0, 3)
    .map((m: any) => String(m.content || ""))
    .join("\n");
  const compactPrefs = userSettings
    ? JSON.stringify({
        preferredMode: (userSettings as any).preferredMode,
        preferredTone: (userSettings as any).preferredTone,
        theme: (userSettings as any).theme,
      })
    : "";

  states.push("PLAN");
  tracer.pushState("PLAN");
  let compacted = { summary: "", tokenCount: 0 };
  try {
    compacted = await compactUserContext(context.userId, query);
  } catch (error) {
    console.warn("[AgentLoop] Falha ao compactar contexto, seguindo sem resumo:", error);
  }
  const prioritized = prioritize(
    memHits.slice(0, 8).map((m: any) => ({ content: String(m.content || ""), createdAt: m.createdAt })),
    query
  );
  const plannedPrompt = inject({
    baseSystemPrompt: buildPlanningPrompt(query, compactMemory, compactPrefs),
    contextSummary: compacted.summary,
    prioritizedMemories: prioritized,
  });
  const messages: Message[] = [{ role: "user", content: plannedPrompt }];

  let toolCalls = 0;
  let repeatedIntentCount = 0;
  let previousBatchSignature: string | null = null;
  let finalResponse = "";
  const e2eMock = String(process.env.AVA_AGENT_LOOP_E2E_MOCK || "false").toLowerCase() === "true";

  for (let cycle = 0; cycle < maxCycles; cycle++) {
    states.push("GUARD_VALIDATE");
    tracer.pushState("GUARD_VALIDATE");
    const llm: any = e2eMock
      ? {
          choices: [
            cycle === 0
              ? {
                  message: {
                    role: "assistant",
                    content: "",
                    tool_calls: [
                      {
                        id: `e2e_call_${cycle}`,
                        type: "function",
                        function: {
                          name: "file_ops",
                          arguments: JSON.stringify({ action: "list", path: ".", dry_run: true }),
                        },
                      },
                    ],
                  },
                }
              : {
                  message: {
                    role: "assistant",
                    content: "Resposta final simulada do ciclo E2E.",
                  },
                },
          ],
        }
      : await orchestrateAgentResponse(messages, context.provider, context.model);
    const choice = llm.choices?.[0];
    if (!choice) break;

    const message = choice.message;
    const textContent = typeof message.content === "string"
      ? message.content
      : Array.isArray(message.content)
        ? message.content.map((p: any) => p?.text || "").join("\n")
        : "";

    messages.push({ role: message.role, content: message.content || "", tool_calls: message.tool_calls });

    const calls = (message.tool_calls || []) as ToolCall[];
    if (calls.length === 0) {
      states.push("FEEDBACK");
      tracer.pushState("FEEDBACK");
      finalResponse = textContent || "Execucao concluida sem resposta textual adicional.";
      break;
    }

    const batchSignature = calls.map((c) => `${c.function.name}:${c.function.arguments}`).join("||");
    if (batchSignature === previousBatchSignature) {
      repeatedIntentCount += 1;
    } else {
      repeatedIntentCount = 0;
    }
    previousBatchSignature = batchSignature;

    if (repeatedIntentCount >= 2) {
      await tracer.finish("aborted", { reason: "anti_loop_repetition" });
      return {
        cycleId: tracer.trace.cycle_id,
        status: "aborted",
        finalResponse: "Abortado por repeticao de intencao/tool calls sem convergencia.",
        states: [...states, "FEEDBACK"],
        toolCalls,
        repeatedIntentCount,
        abortedReason: "anti_loop_repetition",
      };
    }

    for (const call of calls) {
      const toolExecStart = Date.now();
      toolCalls += 1;
      if (toolCalls > maxToolCalls) {
        await tracer.finish("aborted", { reason: "tool_call_limit" });
        return {
          cycleId: tracer.trace.cycle_id,
          status: "aborted",
          finalResponse: "Abortado por limite de tool calls por ciclo.",
          states: [...states, "FEEDBACK"],
          toolCalls,
          repeatedIntentCount,
          abortedReason: "tool_call_limit",
        };
      }

      const args = JSON.parse(call.function.arguments || "{}");

      states.push("DRY_RUN");
      tracer.pushState("DRY_RUN");
      const guardDecision = await evaluateToolExecution(call.function.name, args, "cli");
      if (!guardDecision.allowed) {
        messages.push({
          role: "tool",
          name: call.function.name,
          tool_call_id: call.id,
          content: `[GUARD] ${guardDecision.reason}`,
        });
        continue;
      }

      if (guardDecision.requiresConfirmation) {
        states.push("CONFIRM");
        tracer.pushState("CONFIRM");
        tracer.markConfirmationRequired();
        const confirmed = await needsConfirmation(call.function.name, args);
        if (!confirmed) {
          messages.push({
            role: "tool",
            name: call.function.name,
            tool_call_id: call.id,
            content: "[CONFIRM] Execucao negada por ausencia de confirmacao humana.",
          });
          continue;
        }
      }

      states.push("EXECUTE");
      tracer.pushState("EXECUTE");
      let execution: { output: string; ok: boolean; rollback?: () => Promise<void> } | null = null;
      try {
        execution = await context.executeTool(call, args);
      } catch (error) {
        if (execution?.rollback) {
          await execution.rollback();
        }
        const messageError = error instanceof Error ? error.message : String(error);
        messages.push({
          role: "tool",
          name: call.function.name,
          tool_call_id: call.id,
          content: `Falha na execucao: ${messageError}`,
        });
        continue;
      }

      messages.push({
        role: "tool",
        name: call.function.name,
        tool_call_id: call.id,
        content: execution.output,
      });
      tracer.addToolExecMs(Date.now() - toolExecStart);
    }
  }

  states.push("UPDATE_DB_RAG");
  tracer.pushState("UPDATE_DB_RAG");
  await addAuditLog({
    userId: context.userId,
    action: "agent_cycle",
    entity: "agent_loop_v2",
    details: JSON.stringify({ query: query.slice(0, 180), states, toolCalls, repeatedIntentCount }),
  });
  await addMemoryEntry(context.userId, `AgentCycle: ${query}`, "agent,loop,cycle", "context");

  states.push("FEEDBACK");
  tracer.pushState("FEEDBACK");
  if (!finalResponse) {
    finalResponse = "Ciclo concluido. Nao houve resposta textual final do modelo.";
  }

  await tracer.finish("completed", { toolCalls, repeatedIntentCount });

  return {
    cycleId: tracer.trace.cycle_id,
    status: "completed",
    finalResponse,
    states,
    toolCalls,
    repeatedIntentCount,
  };
}
