import "dotenv/config";
import { invokeLLM } from "../server/_core/llm";
import { ensureOllamaReady } from "./ensure-ollama-ready";

type StressResult = {
  index: number;
  ok: boolean;
  durationMs: number;
  error?: string;
};

const TOTAL_REQUESTS = Number(process.env.STRESS_TOTAL_REQUESTS || 4);
const MAX_CONCURRENCY = Number(process.env.STRESS_MAX_CONCURRENCY || 2);
const REQUEST_TIMEOUT_MS = Number(process.env.STRESS_REQUEST_TIMEOUT_MS || 30000);
const MODEL = process.env.STRESS_OLLAMA_MODEL || "llama3.2:latest";

async function runSingle(index: number): Promise<StressResult> {
  const startedAt = Date.now();

  try {
    const response = await invokeLLM({
      provider: "ollama",
      model: MODEL,
      timeoutMs: REQUEST_TIMEOUT_MS,
      messages: [
        {
          role: "user",
          content: `Teste de estresse controlado #${index}. Responda somente com OK.`,
        },
      ],
    });

    const content = String(response.choices?.[0]?.message?.content || "").trim();

    return {
      index,
      ok: content.length > 0,
      durationMs: Date.now() - startedAt,
      error: content.length > 0 ? undefined : "Resposta vazia",
    };
  } catch (error) {
    return {
      index,
      ok: false,
      durationMs: Date.now() - startedAt,
      error: (error as Error).message,
    };
  }
}

async function runStress(): Promise<StressResult[]> {
  const results: StressResult[] = [];

  for (let i = 0; i < TOTAL_REQUESTS; i += MAX_CONCURRENCY) {
    const batchSize = Math.min(MAX_CONCURRENCY, TOTAL_REQUESTS - i);
    const tasks: Array<Promise<StressResult>> = [];

    for (let batchIndex = 0; batchIndex < batchSize; batchIndex++) {
      tasks.push(runSingle(i + batchIndex + 1));
    }

    const batchResults = await Promise.all(tasks);
    results.push(...batchResults);
  }

  return results;
}

function printSummary(results: StressResult[]) {
  const success = results.filter((item) => item.ok);
  const failed = results.filter((item) => !item.ok);
  const durationValues = results.map((item) => item.durationMs).sort((a, b) => a - b);
  const p50 = durationValues[Math.floor(durationValues.length * 0.5)] ?? 0;
  const p90 = durationValues[Math.floor(durationValues.length * 0.9)] ?? 0;

  console.log("\n[StressTest] Resumo");
  console.log(`[StressTest] total=${results.length} success=${success.length} failed=${failed.length}`);
  console.log(`[StressTest] p50=${p50}ms p90=${p90}ms timeout=${REQUEST_TIMEOUT_MS}ms`);

  if (failed.length > 0) {
    for (const item of failed) {
      console.log(`[StressTest] falha req#${item.index}: ${item.error}`);
    }
  }
}

async function main() {
  if (MAX_CONCURRENCY > 3) {
    console.warn(
      `[StressTest] MAX_CONCURRENCY=${MAX_CONCURRENCY}. Recomendado <=3 para proteger host local.`,
    );
  }

  await ensureOllamaReady();

  console.log(
    `[StressTest] Iniciando teste controlado total=${TOTAL_REQUESTS} concorrencia=${MAX_CONCURRENCY} model=${MODEL}`,
  );

  const startedAt = Date.now();
  const results = await runStress();
  printSummary(results);
  console.log(`[StressTest] duracao_total=${Date.now() - startedAt}ms`);

  if (results.every((item) => !item.ok)) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error("[StressTest] erro fatal:", error);
  process.exit(1);
});
