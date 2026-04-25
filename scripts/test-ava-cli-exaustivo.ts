import "dotenv/config";
import { spawnSync } from "node:child_process";
import fs from "node:fs/promises";
import path from "node:path";

type CommandResult = {
  code: number | null;
  timedOut: boolean;
  stdout: string;
  stderr: string;
  durationMs: number;
};

type ScenarioResult = {
  name: string;
  status: "passed" | "failed" | "skipped";
  attempts: number;
  modelUsed?: string;
  durationMs: number;
  notes: string[];
};

type AskOptions = {
  provider: "ollama";
  models: string[];
  timeoutMs: number;
  retriesPerModel: number;
  waitBetweenRetriesMs: number;
  extraEnv?: Record<string, string>;
};

const nowStamp = new Date().toISOString().replace(/[:.]/g, "-");
const runId = `exaustivo-${nowStamp}`;
const rootDir = process.cwd();
const reportDir = path.resolve(rootDir, "docs");
const dataDir = path.resolve(rootDir, "data");
const runWorkDir = path.resolve(rootDir, "data", "testes-exaustivos", runId);
const runFilePath = path.resolve(runWorkDir, "nota.txt");
const runFileCopyPath = path.resolve(runWorkDir, "nota-copia.txt");
const runFileRenamedPath = path.resolve(runWorkDir, "nota-renomeada.txt");
const auditLogPath = path.resolve(rootDir, "data", "ava-cli-audit.log");
const operationalMemoryPath = path.resolve(rootDir, ".agent", "memory", "operacao-feedback.md");
const telegramToken = String(process.env.TELEGRAM_BOT_TOKEN || "").trim();
const telegramChatId = String(process.env.TELEGRAM_CHAT_ID || "").trim();
const defaultVaultKey = "c9b7f7a2d6b84f57b3e4a121a4d8e5f1c9b7f7a2d6b84f57b3e4a121a4d8e5f1";
const effectiveVaultMasterKey = String(process.env.AVA_VAULT_MASTER_KEY || defaultVaultKey).trim();

const toPromptPath = (absolutePath: string): string => path.relative(rootDir, absolutePath).split(path.sep).join("/");
const runWorkDirPrompt = toPromptPath(runWorkDir);
const runFilePathPrompt = toPromptPath(runFilePath);
const runFileCopyPathPrompt = toPromptPath(runFileCopyPath);
const runFileRenamedPathPrompt = toPromptPath(runFileRenamedPath);

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function sendTelegramStatus(message: string): Promise<void> {
  if (!telegramToken || !telegramChatId) return;

  try {
    const response = await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        chat_id: telegramChatId,
        text: message,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.warn(`[AVA-TEST][Telegram] Falha ao enviar status (${response.status}): ${body}`);
    }
  } catch (error: any) {
    console.warn(`[AVA-TEST][Telegram] Erro ao enviar status: ${error?.message || error}`);
  }
}

function getNpxCommand(): string {
  return process.platform === "win32" ? "npx.cmd" : "npx";
}

function quoteArg(value: string): string {
  if (/^[A-Za-z0-9_./:-]+$/.test(value)) return value;
  return `"${value.replace(/"/g, '\\"')}"`;
}

async function runCommand(command: string, args: string[], timeoutMs: number, extraEnv?: Record<string, string>): Promise<CommandResult> {
  const startedAt = Date.now();
  const commandLine = [command, ...args.map(quoteArg)].join(" ");

  const result = spawnSync(commandLine, {
    cwd: rootDir,
    env: {
      ...process.env,
      ...extraEnv,
    },
    shell: true,
    encoding: "utf-8",
    timeout: timeoutMs,
    maxBuffer: 1024 * 1024 * 8,
  });

  const timedOut = Boolean((result.error as NodeJS.ErrnoException | undefined)?.code === "ETIMEDOUT");
  return {
    code: result.status,
    timedOut,
    stdout: String(result.stdout || ""),
    stderr: String(result.stderr || ""),
    durationMs: Date.now() - startedAt,
  };
}

function compactText(text: string, max = 1200): string {
  const normalized = text.replace(/\r\n/g, "\n").trim();
  if (normalized.length <= max) return normalized;
  return `${normalized.slice(0, max)}\n... [truncado]`;
}

async function askAva(query: string, options: AskOptions): Promise<{ ok: boolean; model?: string; attempts: number; result?: CommandResult; notes: string[] }> {
  const notes: string[] = [];
  let attempts = 0;
  const npxCmd = getNpxCommand();

  for (const model of options.models) {
    for (let attempt = 1; attempt <= options.retriesPerModel; attempt++) {
      attempts++;
      notes.push(`Tentativa ${attempt}/${options.retriesPerModel} com modelo ${model}`);
      console.log(`[AVA-TEST] ask tentativa ${attempt}/${options.retriesPerModel} modelo=${model}`);

      const result = await runCommand(
        npxCmd,
        ["tsx", "cli/index.ts", "ask", query, "--provider", options.provider, "--model", model],
        options.timeoutMs,
        {
          AVA_OLLAMA_PROFILE: process.env.AVA_OLLAMA_PROFILE || "safe",
          OLLAMA_NUM_PREDICT: process.env.OLLAMA_NUM_PREDICT || "256",
          OLLAMA_NUM_CTX: process.env.OLLAMA_NUM_CTX || "1024",
          OLLAMA_TEMPERATURE: process.env.OLLAMA_TEMPERATURE || "0.2",
          AVA_VAULT_MASTER_KEY: effectiveVaultMasterKey,
          ...options.extraEnv,
        }
      );

      const output = `${result.stdout}\n${result.stderr}`;
      console.log(`[AVA-TEST] ask concluido modelo=${model} duracao=${result.durationMs}ms timeout=${result.timedOut}`);
      const failedByTimeout = result.timedOut || /Tempo esgotado|timeout|terminated command after exceeding timeout/i.test(output);
      const hasFatalError = /\[Erro Fatal do Sistema\]|Falha sist[eê]mica na execu[cç][aã]o da tool/i.test(output);
      const hasExecution = /\[SYS\] Executando Ferramenta Nativa:/.test(output);
      const blockedNoTool = /\[AVA Execução\]: nenhuma ação concreta foi executada/i.test(output);

      if (failedByTimeout) {
        notes.push(`Timeout com modelo ${model} (duracao ${result.durationMs}ms)`);
      }

      if (hasFatalError) {
        notes.push(`Erro fatal detectado com modelo ${model}`);
      }

      if (!failedByTimeout && !hasFatalError && (hasExecution || !blockedNoTool)) {
        return { ok: true, model, attempts, result, notes };
      }

      if (attempt < options.retriesPerModel) {
        await sleep(options.waitBetweenRetriesMs);
      }
    }
  }

  return { ok: false, attempts, notes };
}

async function ensureFolders() {
  await fs.mkdir(runWorkDir, { recursive: true });
  await fs.mkdir(dataDir, { recursive: true });
}

async function tryReadAuditLog(): Promise<string> {
  try {
    return await fs.readFile(auditLogPath, "utf-8");
  } catch {
    return "";
  }
}

async function updateOperationalMemory(summary: ScenarioResult[], runIdentifier: string): Promise<void> {
  const passed = summary.filter((s) => s.status === "passed").map((s) => s.name);
  const failed = summary.filter((s) => s.status === "failed").map((s) => s.name);
  const skipped = summary.filter((s) => s.status === "skipped").map((s) => s.name);

  const section = [
    `## Rodada ${new Date().toISOString()} (${runIdentifier})`,
    `- Aprovados: ${passed.length}`,
    `- Falhos: ${failed.length}`,
    `- Ignorados: ${skipped.length}`,
    passed.length > 0 ? `- Cenarios aprovados: ${passed.join("; ")}` : "- Cenarios aprovados: nenhum",
    failed.length > 0 ? `- Cenarios falhos: ${failed.join("; ")}` : "- Cenarios falhos: nenhum",
    skipped.length > 0 ? `- Cenarios ignorados: ${skipped.join("; ")}` : "- Cenarios ignorados: nenhum",
    "",
  ].join("\n");

  await fs.mkdir(path.dirname(operationalMemoryPath), { recursive: true });

  let existing = "";
  try {
    existing = await fs.readFile(operationalMemoryPath, "utf-8");
  } catch {
    existing = "# Memoria Operacional AVA\n\n";
  }

  const updated = `${existing.trim()}\n\n${section}`;
  await fs.writeFile(operationalMemoryPath, `${updated.trim()}\n`, "utf-8");
}

function hasAuditToken(auditContent: string, token: string): boolean {
  return auditContent.includes(token);
}

async function runExhaustiveSuite(): Promise<void> {
  await ensureFolders();

  const explicitModels = String(process.env.AVA_TEST_MODELS || "")
    .split(/[;,]/g)
    .map((item) => item.trim())
    .filter(Boolean);

  const models = Array.from(
    new Set(
      (explicitModels.length > 0
        ? explicitModels
        : [
            process.env.OLLAMA_MODEL_SAFE || "llama3.2:3b",
            process.env.OLLAMA_MODEL || "qwen2.5:7b-instruct",
            "llama3.2:latest",
          ])
        .map((m) => String(m || "").trim())
        .filter(Boolean)
    )
  );

  const askOptions: AskOptions = {
    provider: "ollama",
    models,
    timeoutMs: Number(process.env.AVA_TEST_TIMEOUT_MS || "600000"),
    retriesPerModel: Number(process.env.AVA_TEST_RETRIES_PER_MODEL || "2"),
    waitBetweenRetriesMs: Number(process.env.AVA_TEST_RETRY_WAIT_MS || "10000"),
  };

  const summary: ScenarioResult[] = [];
  const maxScenarios = Number(process.env.AVA_TEST_MAX_SCENARIOS || "0");
  let executedScenarios = 0;

  const runScenario = async (
    name: string,
    query: string,
    validator: (result: CommandResult, context: { audit: string }) => Promise<{ ok: boolean; notes: string[] }>
  ) => {
    if (Number.isFinite(maxScenarios) && maxScenarios > 0 && executedScenarios >= maxScenarios) {
      summary.push({
        name,
        status: "skipped",
        attempts: 0,
        durationMs: 0,
        notes: [`Ignorado por AVA_TEST_MAX_SCENARIOS=${maxScenarios}`],
      });
      return;
    }

    executedScenarios++;
    const startedAt = Date.now();
    console.log(`\n[AVA-TEST] Iniciando cenario: ${name}`);
    await sendTelegramStatus(`🧪 [AVA Teste] Iniciando: ${name}`);
    const execution = await askAva(query, askOptions);

    if (!execution.ok || !execution.result || !execution.model) {
      summary.push({
        name,
        status: "failed",
        attempts: execution.attempts,
        durationMs: Date.now() - startedAt,
        notes: execution.notes,
      });
      await sendTelegramStatus(`❌ [AVA Teste] Falhou: ${name} (sem resposta valida do AVA)`);
      return;
    }

    const audit = await tryReadAuditLog();
    const validation = await validator(execution.result, { audit });
    summary.push({
      name,
      status: validation.ok ? "passed" : "failed",
      attempts: execution.attempts,
      modelUsed: execution.model,
      durationMs: Date.now() - startedAt,
      notes: [...execution.notes, ...validation.notes],
    });

    if (validation.ok) {
      await sendTelegramStatus(`✅ [AVA Teste] Concluido: ${name}`);
    } else {
      await sendTelegramStatus(`⚠️ [AVA Teste] Falhou validacao: ${name}`);
    }
  };

  const suiteStartedAt = Date.now();
  const projectedMaxMs = (Number.isFinite(maxScenarios) && maxScenarios > 0 ? maxScenarios : 11)
    * askOptions.models.length
    * askOptions.retriesPerModel
    * askOptions.timeoutMs;
  await sendTelegramStatus(
    `🚀 [AVA Teste] Iniciando suite exaustiva (${runId}). Modelos: ${models.join(", ")}. Timeout/tentativa: ${askOptions.timeoutMs}ms. ETA maxima aproximada: ${Math.ceil(projectedMaxMs / 60000)} min.`
  );

  await runScenario(
    "T01 - Autodiagnostico operacional",
    "Execute o autodiagnostico_ava completo e mostre o resultado.",
    async (result) => {
      const text = `${result.stdout}\n${result.stderr}`;
      const ok = /autodiagnostico_ava/i.test(text) || /Autodiagnostico AVA CLI/i.test(text);
      return {
        ok,
        notes: ok ? ["Autodiagnostico executado."] : [compactText(text)],
      };
    }
  );

  const reminderToken = `lembrete-${runId}`;
  await runScenario(
    "T02 - Criacao de lembrete",
    `Crie um lembrete para daqui a 3 minutos com a mensagem ${reminderToken}.`,
    async (result, context) => {
      const output = `${result.stdout}\n${result.stderr}`;
      const ok = /criar_lembrete/.test(output) && (output.includes(reminderToken) || hasAuditToken(context.audit, reminderToken));
      return { ok, notes: ok ? ["Lembrete criado e rastreado."] : [compactText(output)] };
    }
  );

  await runScenario(
    "T03 - Listagem de lembretes",
    `Liste os lembretes ativos e procure por ${reminderToken}.`,
    async (result) => {
      const output = `${result.stdout}\n${result.stderr}`;
      const ok = /listar_lembretes/.test(output) && output.includes(reminderToken);
      return { ok, notes: ok ? ["Listagem confirmou lembrete criado."] : [compactText(output)] };
    }
  );

  await runScenario(
    "T04 - Criacao de pasta/arquivo",
    `Use as ferramentas criar_pasta e criar_arquivo. Primeiro crie a pasta ${runWorkDirPrompt}. Depois crie o arquivo ${runFilePathPrompt} com conteudo: teste exaustivo ${runId}. Finalize com status objetivo.`,
    async (result, context) => {
      let fileContent = "";
      try {
        fileContent = await fs.readFile(runFilePath, "utf-8");
      } catch {
        fileContent = "";
      }
      const output = `${result.stdout}\n${result.stderr}`;
      const ok = fileContent.includes(runId) && hasAuditToken(context.audit, "FILE_OP");
      return { ok, notes: ok ? ["Arquivo criado na whitelist."] : [compactText(output)] };
    }
  );

  await runScenario(
    "T05 - Copia de arquivo",
    `Use a ferramenta copiar_arquivo para copiar ${runFilePathPrompt} em ${runFileCopyPathPrompt}. Finalize com status objetivo.`,
    async (result, context) => {
      const output = `${result.stdout}\n${result.stderr}`;
      let ok = false;
      let copied = "";
      try {
        copied = await fs.readFile(runFileCopyPath, "utf-8");
        ok = copied.includes(runId);
      } catch {
        ok = false;
      }
      if (!ok) {
        ok = copied.length > 0 && hasAuditToken(context.audit, "sistema_de_arquivos.copiar_arquivo");
      }
      return { ok, notes: ok ? ["Arquivo copiado com sucesso."] : [compactText(output)] };
    }
  );

  await runScenario(
    "T06 - Renomeacao de arquivo",
    `Use a ferramenta renomear_arquivo no caminho ${runFileCopyPathPrompt} com novo_nome "nota-renomeada.txt". Finalize com status objetivo.`,
    async (result, context) => {
      const output = `${result.stdout}\n${result.stderr}`;
      let ok = false;
      try {
        await fs.access(runFileRenamedPath);
        ok = true;
      } catch {
        ok = false;
      }
      if (!ok) {
        ok = hasAuditToken(context.audit, "sistema_de_arquivos.renomear_arquivo");
      }
      return { ok, notes: ok ? ["Arquivo renomeado com sucesso."] : [compactText(output)] };
    }
  );

  await runScenario(
    "T07 - Exclusao com confirmacao explicita",
    `Confirmo apagar. Use a ferramenta apagar_arquivo para remover ${runFileRenamedPathPrompt} com confirmado true. Finalize com status objetivo.`,
    async (result) => {
      const output = `${result.stdout}\n${result.stderr}`;
      let exists = false;
      try {
        await fs.access(runFileRenamedPath);
        exists = true;
      } catch {
        exists = false;
      }
      const ok = !exists;
      return { ok, notes: ok ? ["Exclusao confirmada e concluida."] : [compactText(output)] };
    }
  );

  await runScenario(
    "T08 - Busca web",
    "Busque na web: site oficial do STJ Brasil e mostre 3 resultados.",
    async (result, context) => {
      const output = `${result.stdout}\n${result.stderr}`;
      const ok = hasAuditToken(context.audit, "TOOL_CALL | Instanciando: buscar_web") && !/\[Erro Fatal do Sistema\]/.test(output);
      return { ok, notes: ok ? ["Busca web retornou resultados."] : [compactText(output)] };
    }
  );

  await runScenario(
    "T09 - Extracao estruturada de pagina",
    "Extraia conteudo estruturado de https://www.gov.br e retorne os campos url, titulo e links.",
    async (result, context) => {
      const output = `${result.stdout}\n${result.stderr}`;
      const ok = hasAuditToken(context.audit, "TOOL_CALL | Instanciando: extrair_conteudo_estruturado") && !/\[Erro Fatal do Sistema\]/.test(output);
      return { ok, notes: ok ? ["Extracao estruturada executada."] : [compactText(output)] };
    }
  );

  const vaultKey = `chave-${runId}`;
  const vaultSecretValue = `senha=${runId.replace(/[^a-zA-Z0-9]/g, "").slice(-12)}@123`;
  if (effectiveVaultMasterKey) {
    await runScenario(
      "T10 - Cofre seguro",
      `Salve no cofre a chave ${vaultKey} com valor ${vaultSecretValue}, finalidade teste_exaustivo e confirmado true. Isso e dado sensivel.`,
      async (result, context) => {
        const output = `${result.stdout}\n${result.stderr}`;
        const ok = /salvar_no_cofre/i.test(output) || hasAuditToken(context.audit, "VAULT_WRITE");
        return { ok, notes: ok ? ["Cofre gravou entrada sensivel."] : [compactText(output)] };
      }
    );

    await runScenario(
      "T11 - Listagem de cofre",
      `Liste o cofre e procure pela chave ${vaultKey}.`,
      async (result) => {
        const output = `${result.stdout}\n${result.stderr}`;
        const ok = /listar_cofre/i.test(output) && output.includes(vaultKey);
        return { ok, notes: ok ? ["Listagem do cofre confirmou metadados."] : [compactText(output)] };
      }
    );
  } else {
    summary.push({
      name: "T10/T11 - Cofre seguro",
      status: "skipped",
      attempts: 0,
      durationMs: 0,
      notes: ["Ignorado: AVA_VAULT_MASTER_KEY nao configurada."],
    });
  }

  const totals = {
    passed: summary.filter((s) => s.status === "passed").length,
    failed: summary.filter((s) => s.status === "failed").length,
    skipped: summary.filter((s) => s.status === "skipped").length,
    total: summary.length,
  };

  const lines: string[] = [];
  lines.push(`# Relatorio de Testes Exaustivos AVA CLI - ${new Date().toISOString()}`);
  lines.push("");
  lines.push(`Run ID: \`${runId}\``);
  lines.push(`Modelos testados: ${models.map((m) => `\`${m}\``).join(", ")}`);
  lines.push(`Timeout por tentativa: ${askOptions.timeoutMs}ms`);
  lines.push(`Retries por modelo: ${askOptions.retriesPerModel}`);
  lines.push("");
  lines.push("## Resultado geral");
  lines.push("");
  lines.push(`- Aprovados: ${totals.passed}`);
  lines.push(`- Falhos: ${totals.failed}`);
  lines.push(`- Ignorados: ${totals.skipped}`);
  lines.push(`- Total: ${totals.total}`);
  lines.push("");
  lines.push("## Detalhes por cenario");
  lines.push("");

  for (const scenario of summary) {
    lines.push(`### ${scenario.name}`);
    lines.push(`- Status: ${scenario.status}`);
    lines.push(`- Tentativas: ${scenario.attempts}`);
    if (scenario.modelUsed) lines.push(`- Modelo: ${scenario.modelUsed}`);
    lines.push(`- Duracao: ${scenario.durationMs}ms`);
    for (const note of scenario.notes.slice(0, 8)) {
      lines.push(`- Nota: ${note}`);
    }
    lines.push("");
  }

  const reportPath = path.resolve(reportDir, `RELATORIO_TESTES_EXAUSTIVOS_${new Date().toISOString().slice(0, 10)}_${runId}.md`);
  await fs.writeFile(reportPath, `${lines.join("\n")}\n`, "utf-8");
  await updateOperationalMemory(summary, runId);

  console.log(`\n[AVA-TEST] Relatorio salvo em: ${reportPath}`);
  console.log(`[AVA-TEST] Resultado: ${totals.passed}/${totals.total} aprovados, ${totals.failed} falhos, ${totals.skipped} ignorados.`);
  await sendTelegramStatus(
    `🏁 [AVA Teste] Finalizado (${runId}) em ${Math.ceil((Date.now() - suiteStartedAt) / 60000)} min. Resultado: ${totals.passed}/${totals.total} aprovados, ${totals.failed} falhos, ${totals.skipped} ignorados. Relatorio: ${path.basename(reportPath)}`
  );

  if (totals.failed > 0) {
    process.exitCode = 2;
  }
}

runExhaustiveSuite().catch((error) => {
  console.error(`[AVA-TEST] Falha fatal: ${(error as Error).message}`);
  process.exit(1);
});
