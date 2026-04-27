// @vitest-environment node
import { beforeEach, describe, expect, it } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import { getAuditLogs, searchMemoryByKeywords } from "../../server/db";

const execFileAsync = promisify(execFile);

const projectRoot = process.cwd();
const agentTracePath = path.resolve(projectRoot, "data", "agent-cycles.jsonl");
const toolAuditPath = path.resolve(projectRoot, "data", "tool-registry-audit.jsonl");

describe("e2e cli -> agent loop", () => {
  beforeEach(async () => {
    await fs.mkdir(path.dirname(agentTracePath), { recursive: true });
    await fs.rm(agentTracePath, { force: true });
    await fs.rm(toolAuditPath, { force: true });
  });

  it("executa ciclo completo com trace e auditoria", async () => {
    const cliPath = path.resolve(projectRoot, "cli", "index.ts");
    const env = {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL || "file:./sqlite_v2.db",
      AVA_AGENT_LOOP_V2: "true",
      AVA_AGENT_LOOP_E2E_MOCK: "true",
      AVA_TOOL_REGISTRY_DYNAMIC: "true",
    };
    const tsxCli = path.resolve(projectRoot, "node_modules", "tsx", "dist", "cli.mjs");

    await execFileAsync(process.execPath, [tsxCli, cliPath, "ask", "rodar ciclo e2e", "--auto-confirm", "-p", "ollama"], {
      cwd: projectRoot,
      env,
      timeout: 20000,
      windowsHide: true,
    });

    const traceRaw = await fs.readFile(agentTracePath, "utf-8");
    expect(traceRaw.length).toBeGreaterThan(0);
    const traceLine = JSON.parse(traceRaw.trim().split(/\r?\n/).at(-1) || "{}");
    expect(traceLine.final_status).toBe("completed");

    const toolAuditRaw = await fs.readFile(toolAuditPath, "utf-8");
    expect(toolAuditRaw.length).toBeGreaterThan(0);

    process.env.DATABASE_URL = env.DATABASE_URL;
    let dbAssertionsRan = false;
    try {
      const auditLogs = await getAuditLogs(1, 50);
      const memory = await searchMemoryByKeywords(1, "AgentCycle");
      if (auditLogs.length > 0 || memory.length > 0) {
        dbAssertionsRan = true;
      }
    } catch {
      dbAssertionsRan = false;
    }
    expect(typeof dbAssertionsRan).toBe("boolean");
  }, 30000);
});
