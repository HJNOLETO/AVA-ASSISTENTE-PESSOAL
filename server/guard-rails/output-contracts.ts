import { z } from "zod";
import type { IntentType } from "./intent-classifier.js";
import { auditLog } from "./audit-logger.js";

const BaseOutputSchema = z.object({
  status: z.enum(["success", "fallback", "blocked", "error"]),
  message: z.string().min(1),
});

const InformationalOutputSchema = BaseOutputSchema.extend({
  citations: z.array(z.string()).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

const TransactionalOutputSchema = BaseOutputSchema.extend({
  action: z.string().optional(),
  data: z.record(z.string(), z.unknown()).optional(),
});

const AutomationOutputSchema = BaseOutputSchema.extend({
  task_id: z.string().optional(),
  scheduled_for: z.string().optional(),
});

const SensitiveOutputSchema = BaseOutputSchema.extend({
  confirmation_required: z.boolean().optional(),
  redactions_applied: z.boolean().optional(),
});

const HighRiskOutputSchema = BaseOutputSchema.extend({
  confirmation_required: z.literal(true),
  audit_reference: z.string().optional(),
});

const OUTPUT_CONTRACTS: Record<IntentType, z.ZodTypeAny> = {
  informacional: InformationalOutputSchema,
  transacional: TransactionalOutputSchema,
  automacao: AutomationOutputSchema,
  sensivel: SensitiveOutputSchema,
  alto_risco: HighRiskOutputSchema,
};

export function getOutputContractIntents(): IntentType[] {
  return Object.keys(OUTPUT_CONTRACTS) as IntentType[];
}

export function validateOutputContract(params: {
  request_id: string;
  intent: IntentType;
  output: unknown;
}):
  | { success: true; output: Record<string, unknown> }
  | { success: false; reason: string; fallback_output: Record<string, unknown> } {
  const schema = OUTPUT_CONTRACTS[params.intent];
  const result = schema.safeParse(params.output);

  if (result.success) {
    return {
      success: true,
      output: result.data as Record<string, unknown>,
    };
  }

  const fallback_output = {
    status: "fallback",
    message: "Nao consegui responder no formato esperado. Pode reformular sua solicitacao?",
  };

  auditLog({
    request_id: params.request_id,
    event: "output_contract_rejected",
    timestamp: new Date().toISOString(),
    details: {
      intent: params.intent,
      issues: result.error.flatten(),
    },
  });

  return {
    success: false,
    reason: "output_outside_contract",
    fallback_output,
  };
}
