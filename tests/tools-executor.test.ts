// @vitest-environment node
import { beforeEach, describe, expect, it, vi } from "vitest";
import fs from "node:fs/promises";
import path from "node:path";

vi.mock("../server/db", () => ({
  getDb: vi.fn(async () => ({
    run: vi.fn(async () => ({ ok: true })),
    transaction: (fn: (query: string) => unknown) => (q: string) => fn(q),
  })),
}));

import { runFileOps } from "../server/tools/file_ops";
import { runHttpOps } from "../server/tools/http_ops";
import { runDbOps } from "../server/tools/db_ops";
import { executeRegisteredTool } from "../server/tools/executor";

describe("tools executor", () => {
  const tempDir = path.resolve(process.cwd(), "tmp_tools_test");

  beforeEach(async () => {
    process.env.AVA_WORKSPACE_DIRS = tempDir;
    await fs.rm(tempDir, { recursive: true, force: true });
    await fs.mkdir(tempDir, { recursive: true });
  });

  it("runFileOps create/read/list em caminho permitido", async () => {
    const target = path.join(tempDir, "a.txt");
    await runFileOps({ action: "create", path: target, content: "abc" });
    const read = await runFileOps({ action: "read", path: target });
    expect(read).toContain("abc");
    const list = await runFileOps({ action: "list", path: tempDir });
    expect(list).toContain("a.txt");
  });

  it("runFileOps bloqueia path traversal", async () => {
    await expect(runFileOps({ action: "read", path: "../secret.txt" })).rejects.toThrow();
  });

  it("runHttpOps suporta dry-run e request mockado", async () => {
    const dry = await runHttpOps({ method: "GET", url: "https://example.com", dry_run: true });
    expect(dry).toContain("DRY-RUN");

    const fetchMock = vi.fn(async () => ({
      ok: true,
      status: 200,
      statusText: "OK",
      text: async () => "pong",
    }));
    vi.stubGlobal("fetch", fetchMock as any);

    const live = await runHttpOps({ method: "GET", url: "https://example.com", headers: { authorization: "x" } });
    expect(live).toContain("\"status\":200");
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it("runDbOps read/write dry-run e executor", async () => {
    const dry = await runDbOps({ query: "SELECT 1", mode: "read", dry_run: true });
    expect(dry).toContain("DRY-RUN");

    await expect(runDbOps({ query: "DELETE FROM x", mode: "write" })).rejects.toThrow(/confirmed=true/);

    const out = await executeRegisteredTool("memory_ops", { action: "get", namespace: "n", key: "k" });
    expect(out).toContain("memory_ops");
  });
});
