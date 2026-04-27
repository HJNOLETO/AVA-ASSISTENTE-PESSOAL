// @vitest-environment node
import { describe, it, expect } from "vitest";
import path from "node:path";
import { loadToolRegistry } from "../server/tool-registry/loader";
import { evaluateToolExecution } from "../server/tool-registry/guard";

describe("tool-registry", () => {
  it("carrega tools.json com validacao Zod", () => {
    const configPath = path.resolve(process.cwd(), "config", "tools.json");
    const tools = loadToolRegistry(configPath);
    expect(tools.length).toBeGreaterThanOrEqual(3);
    expect(tools.some((t) => t.name === "file_ops")).toBe(true);
  });

  it("bloqueia risco medio sem dry_run", async () => {
    const decision = await evaluateToolExecution("file_ops", { action: "read", path: "README.md" }, "cli");
    expect(decision.allowed).toBe(false);
    expect(decision.requiresDryRun).toBe(true);
  });

  it("permite risco medio com dry_run e confirmacao", async () => {
    const decision = await evaluateToolExecution(
      "file_ops",
      { action: "read", path: "README.md", dry_run: true, confirmed: true },
      "cli"
    );
    expect(decision.allowed).toBe(true);
  });

  it("faz fallback legado para tools fora do registro dinamico", async () => {
    const decision = await evaluateToolExecution("obter_data_hora", {}, "cli");
    expect(decision.allowed).toBe(true);
    expect(decision.reason).toContain("fallback legacy");
  });
});
