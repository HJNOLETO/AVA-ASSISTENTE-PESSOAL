// @vitest-environment node
import fs from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { runIngestOps } from "../server/tools/ingest_ops";

describe("ingest_ops", () => {
  it("falha markdown curto e move para failed", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "ava-ingest-"));
    const file = path.join(dir, "curto.md");
    await fs.writeFile(file, "# Titulo\ntexto curto", "utf-8");

    const out = await runIngestOps({ action: "run", path: dir, dry_run: false, userId: 1 });
    expect(out).toContain("failed");
    const moved = await fs.stat(path.join(dir, "failed", "curto.md"));
    expect(moved.isFile()).toBe(true);
  });

  it("executa dry-run para markdown valido", async () => {
    const dir = await fs.mkdtemp(path.join(os.tmpdir(), "ava-ingest-"));
    const file = path.join(dir, "valido.md");
    await fs.writeFile(file, `# Titulo\n\n${"conteudo ".repeat(80)}`, "utf-8");

    const out = await runIngestOps({ action: "run", path: dir, dry_run: true, userId: 1 });
    expect(out).toContain("dry_run_ok");
  });
});
