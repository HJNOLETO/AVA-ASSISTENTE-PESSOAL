// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";

vi.mock("../server/db", () => ({
  addSystemLog: vi.fn(async () => undefined),
  addAgentCycle: vi.fn(async () => undefined),
}));

import { createCycleTracer } from "../server/observability/agent-tracer";

describe("agent tracer", () => {
  const traceFile = path.resolve(process.cwd(), "data", "agent-cycles.jsonl");

  beforeEach(async () => {
    await fs.rm(traceFile, { force: true });
  });

  it("gera ciclo e persiste JSONL", async () => {
    const tracer = createCycleTracer(1);
    tracer.pushState("INTENT_PARSE");
    tracer.pushState("PLAN");
    tracer.addToolExecMs(35);
    tracer.setRag(0.35, 2);
    tracer.setTokenUsage(120, 60);
    tracer.markConfirmationRequired();
    await tracer.finish("completed", { note: "ok" });

    const raw = await fs.readFile(traceFile, "utf-8");
    const lines = raw.trim().split(/\r?\n/);
    const last = JSON.parse(lines[lines.length - 1]);
    expect(last.cycle_id).toContain("cycle_");
    expect(last.final_status).toBe("completed");
    expect(last.rag_hit_count).toBe(2);
    expect(last.confirmation_required).toBe(true);
  });
});
