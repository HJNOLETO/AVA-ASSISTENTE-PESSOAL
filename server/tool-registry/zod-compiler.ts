import { z } from "zod";
import type { Tool } from "../_core/llm";
import type { ToolRegistryItem } from "./types";

function evalZodSchema(schemaText: string) {
  return Function("z", `return (${schemaText});`)(z);
}

function compileSchemaSync(schemaText: string): Record<string, unknown> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const converter = require("zod-to-json-schema");
    const zodToJsonSchema = converter?.zodToJsonSchema || converter?.default;
    if (typeof zodToJsonSchema !== "function") throw new Error("zod-to-json-schema indisponivel");
    const zodSchema = evalZodSchema(schemaText);
    const compiled = zodToJsonSchema(zodSchema, { target: "openApi3" });
    const out = (compiled?.definitions ? Object.values(compiled.definitions)[0] : compiled) as Record<string, unknown>;
    return out || { type: "object", properties: {}, additionalProperties: true };
  } catch (error) {
    console.warn(`[ToolRegistry] Falha compilando schema_zod: ${error instanceof Error ? error.message : String(error)}`);
    return { type: "object", properties: {}, additionalProperties: true };
  }
}

export function compileToolForLLM(tool: ToolRegistryItem): Tool {
  const fallback = (tool.schema_json as Record<string, unknown>) || { type: "object", properties: {}, additionalProperties: true };
  const params = tool.schema_zod ? compileSchemaSync(tool.schema_zod) : fallback;
  return {
    type: "function",
    function: {
      name: tool.name,
      description: tool.description,
      parameters: params,
    },
  };
}
