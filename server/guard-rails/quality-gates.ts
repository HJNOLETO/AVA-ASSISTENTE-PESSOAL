import { getPolicyRulesCount } from "./policy-router.js";
import { getOutputContractIntents } from "./output-contracts.js";
import { getTrustedSourceDomains } from "./rag-policy.js";

export interface QualityGateResult {
  passed: boolean;
  violations: string[];
}

export function runGuardRailsQualityGate(params: {
  criticalFlowTestsPassed: boolean;
  regressionTestsPassed: boolean;
}): QualityGateResult {
  const violations: string[] = [];

  if (getPolicyRulesCount() <= 0) {
    violations.push("Nenhuma regra registrada no Policy Router");
  }

  if (getOutputContractIntents().length < 5) {
    violations.push("Contratos de saida incompletos para a taxonomia de intencoes");
  }

  if (getTrustedSourceDomains().length < 4) {
    violations.push("Politica de fonte confiavel do RAG incompleta");
  }

  if (!params.criticalFlowTestsPassed) {
    violations.push("Fluxos criticos sem testes obrigatorios");
  }

  if (!params.regressionTestsPassed) {
    violations.push("Regressoes de alto risco nao aprovadas");
  }

  return {
    passed: violations.length === 0,
    violations,
  };
}
