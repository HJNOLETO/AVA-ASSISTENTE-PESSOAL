import fs from "node:fs";
import path from "node:path";
import type { Tool } from "../_core/llm";
import { toolRegistrySchema, type ToolRegistryItem } from "./types";
import { compileToolForLLM } from "./zod-compiler";

const DEFAULT_CONFIG_PATH = path.resolve(process.cwd(), "config", "tools.json");

let cachedRegistry: ToolRegistryItem[] | null = null;
let cachedMtimeMs: number | null = null;

function readRegistryFile(configPath: string): { content: string; mtimeMs: number } {
  const stat = fs.statSync(configPath);
  const content = fs.readFileSync(configPath, "utf-8");
  return { content, mtimeMs: stat.mtimeMs };
}

export function loadToolRegistry(configPath = DEFAULT_CONFIG_PATH): ToolRegistryItem[] {
  try {
    const { content, mtimeMs } = readRegistryFile(configPath);
    if (cachedRegistry && cachedMtimeMs === mtimeMs) {
      return cachedRegistry;
    }

    const parsed = JSON.parse(content);
    const validated = toolRegistrySchema.parse(parsed);
    cachedRegistry = validated;
    cachedMtimeMs = mtimeMs;
    return validated;
  } catch (error) {
    const details = error instanceof Error ? error.message : String(error);
    console.warn(`[ToolRegistry] Falha ao carregar ${configPath}: ${details}`);
    return [];
  }
}

export function getRegistryAsTools(configPath = DEFAULT_CONFIG_PATH): Tool[] {
  return loadToolRegistry(configPath).map(compileToolForLLM);
}

export function findRegistryTool(name: string, configPath = DEFAULT_CONFIG_PATH): ToolRegistryItem | null {
  const all = loadToolRegistry(configPath);
  return all.find((item) => item.name === name) || null;
}
