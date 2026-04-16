import { runGuardRailsQualityGate } from "../server/guard-rails/quality-gates.js";

const criticalFlowTestsPassed = process.env.GUARD_RAILS_CRITICAL_TESTS === "1";
const regressionTestsPassed = process.env.GUARD_RAILS_REGRESSION_TESTS === "1";

const result = runGuardRailsQualityGate({
  criticalFlowTestsPassed,
  regressionTestsPassed,
});

if (!result.passed) {
  console.error("[guard-rails:ci] BLOQUEADO");
  for (const violation of result.violations) {
    console.error(`- ${violation}`);
  }
  process.exit(1);
}

console.log("[guard-rails:ci] OK");
