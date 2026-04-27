// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { evaluateToolExecution } from "../server/tool-registry/guard";

const auditFile = path.resolve(process.cwd(), "data", "tool-registry-audit.jsonl");

describe("guard + audit", () => {
  beforeEach(async () => {
    try {
      await fs.rm(auditFile, { force: true });
    } catch {
      // ignore
    }
  });

  it("nega risco medio sem confirmacao e sem dry-run", async () => {
    const decision = await evaluateToolExecution("http_ops", { method: "GET", url: "https://example.com" }, "cli");
    expect(decision.allowed).toBe(false);
    expect(decision.reason).toContain("dry_run");
  });

  it("grava auditoria JSONL e permite quando politicas atendidas", async () => {
    const decision = await evaluateToolExecution(
      "http_ops",
      { method: "GET", url: "https://example.com", dry_run: true, confirmed: true },
      "cli"
    );
    expect(decision.allowed).toBe(true);

    const raw = await fs.readFile(auditFile, "utf-8");
    const lines = raw.trim().split(/\r?\n/);
    expect(lines.length).toBeGreaterThan(0);
    const parsed = JSON.parse(lines[lines.length - 1]);
    expect(parsed.event).toBe("tool_registry_decision");
    expect(parsed.dry_run_requested).toBe(true);
  });
});
