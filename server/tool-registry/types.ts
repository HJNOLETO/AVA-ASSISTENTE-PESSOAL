import { z } from "zod";
import type { Tool } from "../_core/llm";

export const riskLevelSchema = z.enum(["low", "medium", "high"]);
export type RiskLevel = z.infer<typeof riskLevelSchema>;

const jsonSchemaShape = z.object({
  type: z.literal("object"),
  properties: z.record(z.string(), z.unknown()).default({}),
  required: z.array(z.string()).optional(),
  additionalProperties: z.boolean().optional(),
});

export const toolRegistryItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  risk_level: riskLevelSchema,
  requires_confirmation: z.boolean().default(false),
  schema_json: jsonSchemaShape.optional(),
  schema_zod: z.string().min(1),
  dry_run_cmd: z.string().optional(),
  exec_fn: z.string().optional(),
});

export const toolRegistrySchema = z.array(toolRegistryItemSchema).min(1);

export type ToolRegistryItem = z.infer<typeof toolRegistryItemSchema>;

export type ToolRegistryExecutionDecision = {
  allowed: boolean;
  reason: string;
  riskLevel: RiskLevel;
  requiresConfirmation: boolean;
  requiresDryRun: boolean;
  dryRunRequested: boolean;
};

export function toLlmTool(item: ToolRegistryItem): Tool {
  const fallbackSchema = {
    type: "object",
    properties: {},
    additionalProperties: true,
  } as Record<string, unknown>;

  return {
    type: "function",
    function: {
      name: item.name,
      description: item.description,
      parameters: (item.schema_json as Record<string, unknown>) || fallbackSchema,
    },
  };
}
