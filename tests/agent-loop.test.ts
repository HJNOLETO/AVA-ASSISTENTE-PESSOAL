// @vitest-environment node
import { describe, expect, it, vi } from "vitest";

const { orchestrateMock } = vi.hoisted(() => ({
  orchestrateMock: vi.fn(),
}));

vi.mock("../server/agents", () => ({
  orchestrateAgentResponse: orchestrateMock,
}));

vi.mock("../server/db", () => ({
  getUserSettings: vi.fn(async () => ({ preferredMode: "AUTO", preferredTone: "formal", theme: "light" })),
  searchMemoryByKeywords: vi.fn(async () => [{ content: "memoria previa" }]),
  addAuditLog: vi.fn(async () => undefined),
  addMemoryEntry: vi.fn(async () => undefined),
  addSystemLog: vi.fn(async () => undefined),
  addAgentCycle: vi.fn(async () => undefined),
  getUserContext: vi.fn(async () => null),
  upsertUserContext: vi.fn(async () => undefined),
}));

vi.mock("../server/tool-registry", () => ({
  evaluateToolExecution: vi.fn(async () => ({
    allowed: true,
    reason: "ok",
    riskLevel: "low",
    requiresConfirmation: false,
    requiresDryRun: false,
    dryRunRequested: false,
  })),
}));

import { runAgentCycle } from "../server/agents/agent-loop";

describe("agent-loop", () => {
  it("executa ciclo completo simulado", async () => {
    orchestrateMock
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              role: "assistant",
              content: "",
              tool_calls: [
                {
                  id: "t1",
                  function: { name: "obter_data_hora", arguments: "{}" },
                },
              ],
            },
          },
        ],
      })
      .mockResolvedValueOnce({
        choices: [
          {
            message: {
              role: "assistant",
              content: "Resposta final",
            },
          },
        ],
      });

    const result = await runAgentCycle("que horas sao", {
      userId: 1,
      provider: "ollama",
      executeTool: async () => ({ output: "2026-01-01T00:00:00.000Z", ok: true }),
    });

    expect(result.status).toBe("completed");
    expect(result.toolCalls).toBe(1);
    expect(result.finalResponse).toContain("Resposta final");
  });

  it("aborta por anti-loop de repeticao", async () => {
    orchestrateMock.mockResolvedValue({
      choices: [
        {
          message: {
            role: "assistant",
            content: "",
            tool_calls: [
              {
                id: "t1",
                function: { name: "obter_data_hora", arguments: "{}" },
              },
            ],
          },
        },
      ],
    });

    const result = await runAgentCycle("repita", {
      userId: 1,
      provider: "ollama",
      executeTool: async () => ({ output: "ok", ok: true }),
      maxCycles: 6,
    });

    expect(result.status).toBe("aborted");
    expect(result.abortedReason).toBe("anti_loop_repetition");
  });
});
