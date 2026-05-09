import { z } from "zod";
import type { Tool } from "../_core/llm";
import type { ToolRegistryItem } from "./types";

// Cache do módulo para evitar múltiplos import() dinâmicos
let _zodToJsonSchema: ((schema: unknown, opts?: unknown) => unknown) | null | undefined = undefined;

async function loadZodToJsonSchema(): Promise<((schema: unknown, opts?: unknown) => unknown) | null> {
  if (_zodToJsonSchema !== undefined) return _zodToJsonSchema;
  try {
    const moduleName = "zod-to-json-schema";
    const mod = await import(moduleName);
    const fn = (mod as any)?.zodToJsonSchema || (mod as any)?.default?.zodToJsonSchema || (mod as any)?.default;
    _zodToJsonSchema = typeof fn === "function" ? fn : null;
  } catch {
    _zodToJsonSchema = null;
  }
  return _zodToJsonSchema ?? null;
}

function evalZodSchema(schemaText: string): unknown {
  return Function("z", `return (${schemaText});`)(z);
}

async function compileSchemaAsync(schemaText: string): Promise<Record<string, unknown>> {
  const fallback = { type: "object", properties: {}, additionalProperties: true };
  try {
    const zodToJsonSchema = await loadZodToJsonSchema();
    if (typeof zodToJsonSchema !== "function") return fallback;
    const zodSchema = evalZodSchema(schemaText);
    const compiled = zodToJsonSchema(zodSchema, { target: "openApi3" }) as Record<string, unknown>;
    const out = (compiled?.definitions
      ? Object.values(compiled.definitions as Record<string, unknown>)[0]
      : compiled) as Record<string, unknown>;
    return out || fallback;
  } catch (error) {
    console.warn(`[ToolRegistry] Falha compilando schema_zod: ${error instanceof Error ? error.message : String(error)}`);
    return fallback;
  }
}

export async function compileToolForLLMAsync(tool: ToolRegistryItem): Promise<Tool> {
  const fallback = (tool.schema_json as Record<string, unknown>) || { type: "object", properties: {}, additionalProperties: true };
  const params = tool.schema_zod ? await compileSchemaAsync(tool.schema_zod) : fallback;
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: params,
    },
  };
}

/** Compatibilidade síncrona — retorna schema fallback e agenda compilação assíncrona em background */
export function compileToolForLLM(tool: ToolRegistryItem): Tool {
  const fallback = (tool.schema_json as Record<string, unknown>) || { type: "object", properties: {}, additionalProperties: true };
  // Disparar compilação async em background para aquecer o cache sem bloquear
  if (tool.schema_zod) {
    compileSchemaAsync(tool.schema_zod).catch(() => {/* silencioso */});
  }
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: fallback,
    },
  };
}
