import "dotenv/config";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type CommandResult = {
  code: number | null;
  signal: NodeJS.Signals | null;
};

const runCommand = (command: string, args: string[]): Promise<CommandResult> =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: "inherit",
      shell: true,
    });

    child.on("error", reject);
    child.on("close", (code, signal) => resolve({ code, signal }));
  });

export async function ensureOllamaReady(): Promise<void> {
  const provider = (process.env.LLM_PROVIDER || "ollama").toLowerCase();

  if (provider !== "ollama") {
    console.log(`[OllamaBootstrap] LLM_PROVIDER=${provider}. Ignorando bootstrap do Ollama.`);
    return;
  }

  const attempts = Number(process.env.OLLAMA_BOOTSTRAP_ATTEMPTS || 5);
  const retryDelayMs = Number(process.env.OLLAMA_BOOTSTRAP_RETRY_MS || 2000);

  for (let attempt = 1; attempt <= attempts; attempt++) {
    console.log(`[OllamaBootstrap] Tentativa ${attempt}/${attempts}: executando 'ollama list'...`);

    try {
      const result = await runCommand("ollama", ["list"]);
      if (result.code === 0) {
        console.log("[OllamaBootstrap] Ollama pronto para uso.");
        return;
      }

      console.warn(
        `[OllamaBootstrap] 'ollama list' finalizou com code=${String(result.code)} signal=${String(result.signal)}.`,
      );
    } catch (error) {
      console.warn(`[OllamaBootstrap] Falha ao executar 'ollama list': ${(error as Error).message}`);
    }

    if (attempt < attempts) {
      console.log(`[OllamaBootstrap] Aguardando ${retryDelayMs}ms para nova tentativa...`);
      await sleep(retryDelayMs);
    }
  }

  throw new Error(
    "Nao foi possivel ativar/verificar o Ollama automaticamente. Verifique instalacao e servico local.",
  );
}

async function main() {
  await ensureOllamaReady();
}

const directRunUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === directRunUrl) {
  main().catch((error) => {
    console.error(`[OllamaBootstrap] Erro fatal: ${(error as Error).message}`);
    process.exit(1);
  });
}
