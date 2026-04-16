import type { ZodTypeAny } from "zod";
import { auditLog } from "./audit-logger.js";
import { isCapabilityAllowed, type PolicyResult } from "./policy-router.js";

export type SkillRisk = "low" | "medium" | "high" | "critical";

export interface SkillContract {
  id: string;
  version: string;
  risk: SkillRisk;
  inputs: ZodTypeAny;
  preconditions: Array<(input: unknown) => boolean>;
  outputs: ZodTypeAny;
  required_capabilities: string[];
}

const skillRegistry = new Map<string, SkillContract>();

export function registerSkillContract(contract: SkillContract): void {
  skillRegistry.set(contract.id, contract);
}

export function getSkillContract(skillId: string): SkillContract | null {
  return skillRegistry.get(skillId) ?? null;
}

export function listSkillContracts(): SkillContract[] {
  return Array.from(skillRegistry.values());
}

export async function executeGovernedSkill<T>(params: {
  request_id: string;
  skill_id: string;
  input: unknown;
  policy: PolicyResult;
  execute: (validatedInput: unknown) => Promise<T>;
}): Promise<T> {
  const contract = getSkillContract(params.skill_id);
  if (!contract) {
    throw new Error(`Skill '${params.skill_id}' sem contrato registrado`);
  }

  for (const capability of contract.required_capabilities) {
    if (!isCapabilityAllowed(params.policy, capability)) {
      throw new Error(`Capability '${capability}' nao autorizada para skill '${params.skill_id}'`);
    }
  }

  const parsedInput = contract.inputs.parse(params.input);
  for (const precondition of contract.preconditions) {
    if (!precondition(parsedInput)) {
      throw new Error(`Precondition falhou para skill '${params.skill_id}'`);
    }
  }

  auditLog({
    request_id: params.request_id,
    event: "skill_pre_check",
    timestamp: new Date().toISOString(),
    details: {
      skill_id: contract.id,
      version: contract.version,
      risk: contract.risk,
    },
  });

  const rawOutput = await params.execute(parsedInput);
  contract.outputs.parse(rawOutput);

  auditLog({
    request_id: params.request_id,
    event: "skill_post_check",
    timestamp: new Date().toISOString(),
    details: {
      skill_id: contract.id,
      version: contract.version,
      risk: contract.risk,
    },
  });

  return rawOutput;
}
