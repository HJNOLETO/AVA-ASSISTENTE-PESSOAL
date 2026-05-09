import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const agentRoot = path.resolve(root, ".agent");
const opencodeRoot = path.resolve(root, ".opencode");

const mirrorRoots = ["agents", "skills", "workflows", "rules", "scripts", ".shared"];
const ignoredSegments = new Set(["__pycache__", "memory"]);

function shouldIgnore(relPath: string): boolean {
  const normalized = relPath.replace(/\\/g, "/");
  const parts = normalized.split("/").filter(Boolean);
  if (parts.some((p) => ignoredSegments.has(p))) return true;
  if (normalized.endsWith(".pyc")) return true;
  return false;
}

async function ensureDir(dirPath: string): Promise<void> {
  await fs.mkdir(dirPath, { recursive: true });
}

async function listFilesRecursive(base: string, rel = ""): Promise<string[]> {
  const dir = path.resolve(base, rel);
  let entries: Array<{ name: string; isDirectory: () => boolean }> = [];
  try {
    entries = await fs.readdir(dir, { withFileTypes: true }) as any;
  } catch {
    return [];
  }

  const out: string[] = [];
  for (const e of entries) {
    const childRel = rel ? path.posix.join(rel.replace(/\\/g, "/"), e.name) : e.name;
    if (shouldIgnore(childRel)) continue;
    if (e.isDirectory()) {
      const children = await listFilesRecursive(base, childRel);
      out.push(...children);
    } else {
      out.push(childRel.replace(/\\/g, "/"));
    }
  }
  return out;
}

async function exists(p: string): Promise<boolean> {
  try {
    await fs.access(p);
    return true;
  } catch {
    return false;
  }
}

async function copyMissingFile(srcBase: string, dstBase: string, relPath: string): Promise<boolean> {
  const src = path.resolve(srcBase, relPath);
  const dst = path.resolve(dstBase, relPath);
  if (await exists(dst)) return false;
  await ensureDir(path.dirname(dst));
  await fs.copyFile(src, dst);
  return true;
}

async function syncOneRoot(rootName: string): Promise<{ copiedToAgent: number; copiedToOpencode: number }> {
  const agentBase = path.resolve(agentRoot, rootName);
  const opencodeBase = path.resolve(opencodeRoot, rootName);

  await ensureDir(agentBase);
  await ensureDir(opencodeBase);

  const agentFiles = await listFilesRecursive(agentBase);
  const opencodeFiles = await listFilesRecursive(opencodeBase);

  let copiedToAgent = 0;
  let copiedToOpencode = 0;

  for (const rel of agentFiles) {
    if (await copyMissingFile(agentBase, opencodeBase, rel)) copiedToOpencode++;
  }
  for (const rel of opencodeFiles) {
    if (await copyMissingFile(opencodeBase, agentBase, rel)) copiedToAgent++;
  }

  return { copiedToAgent, copiedToOpencode };
}

async function main(): Promise<void> {
  let totalToAgent = 0;
  let totalToOpencode = 0;

  for (const rootName of mirrorRoots) {
    const result = await syncOneRoot(rootName);
    totalToAgent += result.copiedToAgent;
    totalToOpencode += result.copiedToOpencode;
    console.log(
      `[sync-agent-opencode] ${rootName}: +${result.copiedToAgent} para .agent | +${result.copiedToOpencode} para .opencode`
    );
  }

  console.log(
    `[sync-agent-opencode] concluido. Copias novas => .agent: ${totalToAgent}, .opencode: ${totalToOpencode}`
  );
}

main().catch((err) => {
  console.error(`[sync-agent-opencode] falha: ${err instanceof Error ? err.message : String(err)}`);
  process.exit(1);
});
