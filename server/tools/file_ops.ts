import fs from "node:fs/promises";
import path from "node:path";

export type FileOpsArgs = {
  action: "read" | "list" | "create";
  path: string;
  content?: string;
  dry_run?: boolean;
};

function getWorkspaceWhitelist(): string[] {
  const raw = String(process.env.AVA_WORKSPACE_DIRS || process.cwd());
  return raw
    .split(/[;,\n]/g)
    .map((d) => d.trim())
    .filter(Boolean)
    .map((d) => path.resolve(d));
}

function assertSafePath(inputPath: string): string {
  if (!inputPath || inputPath.includes("..")) {
    throw new Error("Caminho invalido: uso de '..' nao permitido");
  }

  const resolved = path.resolve(process.cwd(), inputPath);
  const whitelist = getWorkspaceWhitelist();
  const allowed = whitelist.some((base) => resolved.startsWith(base));
  if (!allowed) {
    throw new Error("Caminho fora da whitelist de workspace");
  }

  return resolved;
}

export async function runFileOps(args: FileOpsArgs): Promise<string> {
  const target = assertSafePath(args.path);
  if (args.dry_run) {
    return `[DRY-RUN] file_ops ${args.action} ${target}`;
  }

  if (args.action === "list") {
    const entries = await fs.readdir(target);
    return entries.slice(0, 100).join("\n");
  }

  if (args.action === "read") {
    return fs.readFile(target, "utf-8");
  }

  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, String(args.content || ""), { encoding: "utf-8", mode: 0o600 });
  return `Arquivo criado: ${target}`;
}
