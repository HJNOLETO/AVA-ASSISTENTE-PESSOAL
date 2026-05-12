import "dotenv/config";
import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { pathToFileURL } from "node:url";

type CommandResult = {
  code: number | null;
  signal: NodeJS.Signals | null;
  stdout: string;
  stderr: string;
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const runCommand = (command: string, args: string[], timeoutMs = 15000): Promise<CommandResult> =>
  new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      shell: true,
      windowsHide: true,
      stdio: ["ignore", "pipe", "pipe"],
    });

    let stdout = "";
    let stderr = "";
    child.stdout.on("data", (chunk) => {
      stdout += String(chunk || "");
    });
    child.stderr.on("data", (chunk) => {
      stderr += String(chunk || "");
    });

    const timer = setTimeout(() => {
      child.kill("SIGTERM");
    }, timeoutMs);

    child.on("error", (error) => {
      clearTimeout(timer);
      reject(error);
    });

    child.on("close", (code, signal) => {
      clearTimeout(timer);
      resolve({ code, signal, stdout, stderr });
    });
  });

async function waitUntil(command: string, args: string[], attempts: number, waitMs: number, label: string): Promise<boolean> {
  for (let i = 1; i <= attempts; i++) {
    try {
      console.log(`[HostBootstrap] Verificacao ${label} tentativa ${i}/${attempts}: ${command} ${args.join(" ")}`);
      const result = await runCommand(command, args);
      if (result.code === 0) return true;
      if (result.stderr.trim()) console.warn(`[HostBootstrap] ${label} stderr: ${result.stderr.trim()}`);
    } catch {
      // no-op
    }
    if (i < attempts) await sleep(waitMs);
  }
  return false;
}

async function ensureOllama(): Promise<void> {
  const provider = String(process.env.LLM_PROVIDER || "ollama").toLowerCase();
  if (provider !== "ollama") {
    console.log(`[HostBootstrap] LLM_PROVIDER=${provider}; bootstrap de Ollama ignorado.`);
    return;
  }

  const ready = await waitUntil("ollama", ["list"], 2, 1500, "ollama");
  if (ready) {
    console.log("[HostBootstrap] Ollama ja esta disponivel.");
    return;
  }

  console.log("[HostBootstrap] Ollama indisponivel. Tentando iniciar 'ollama serve'...");
  const serve = spawn("ollama", ["serve"], {
    detached: true,
    shell: true,
    windowsHide: true,
    stdio: "ignore",
  });
  serve.unref();

  const attempts = Number(process.env.OLLAMA_BOOTSTRAP_ATTEMPTS || 12);
  const waitMs = Number(process.env.OLLAMA_BOOTSTRAP_RETRY_MS || 2500);
  const becameReady = await waitUntil("ollama", ["list"], attempts, waitMs, "ollama");
  if (!becameReady) {
    throw new Error("Nao foi possivel iniciar/verificar Ollama automaticamente. Inicie o Ollama manualmente.");
  }

  console.log("[HostBootstrap] Ollama iniciado com sucesso.");
}

function getDockerDesktopCandidates(): string[] {
  return [
    "C:/Program Files/Docker/Docker/Docker Desktop.exe",
    "C:/Program Files (x86)/Docker/Docker/Docker Desktop.exe",
    path.join(process.env.LOCALAPPDATA || "", "Programs/Docker/Docker/Docker Desktop.exe"),
  ].filter(Boolean);
}

async function ensureDockerAndShutdownProjects(): Promise<void> {
  const dockerRequired = String(process.env.AVA_DOCKER_BOOTSTRAP_ENABLED || "true").toLowerCase() !== "false";
  if (!dockerRequired) {
    console.log("[HostBootstrap] Bootstrap de Docker desativado por AVA_DOCKER_BOOTSTRAP_ENABLED=false.");
    return;
  }

  let dockerReady = await waitUntil("docker", ["info", "--format", "{{.ServerVersion}}"], 1, 1000, "docker");
  if (!dockerReady && process.platform === "win32") {
    const desktopExe = getDockerDesktopCandidates().find((candidate) => fs.existsSync(candidate));
    if (desktopExe) {
      console.log(`[HostBootstrap] Docker indisponivel. Iniciando Docker Desktop: ${desktopExe}`);
      const p = spawn("powershell", [
        "-NoProfile",
        "-Command",
        `Start-Process -FilePath '${desktopExe.replace(/'/g, "''")}'`,
      ], {
        shell: false,
        detached: true,
        windowsHide: true,
        stdio: "ignore",
      });
      p.unref();
    } else {
      console.warn("[HostBootstrap] Docker Desktop nao encontrado em caminhos padrao. Pulando auto start.");
    }
  }

  if (!dockerReady) {
    dockerReady = await waitUntil(
      "docker",
      ["info", "--format", "{{.ServerVersion}}"],
      Number(process.env.AVA_DOCKER_BOOTSTRAP_ATTEMPTS || 20),
      3000,
      "docker",
    );
  }

  if (!dockerReady) {
    console.warn("[HostBootstrap] Docker nao ficou disponivel. Seguirei sem encerrar projetos compose.");
    return;
  }

  console.log("[HostBootstrap] Docker disponivel. Encerrando projetos compose configurados...");
  const raw = String(process.env.AVA_DOCKER_STOP_COMPOSE_FILES || "docker-compose.study.yml;docker-compose.cli.yml");
  const files = raw
    .split(/[;,]/g)
    .map((item) => item.trim())
    .filter(Boolean)
    .map((item) => path.resolve(process.cwd(), item));

  for (const composeFile of files) {
    if (!fs.existsSync(composeFile)) {
      console.log(`[HostBootstrap] Compose nao encontrado, ignorando: ${composeFile}`);
      continue;
    }
    const result = await runCommand("docker", ["compose", "-f", composeFile, "down", "--remove-orphans"], 90000);
    if (result.code === 0) {
      console.log(`[HostBootstrap] Compose encerrado: ${composeFile}`);
    } else {
      console.warn(`[HostBootstrap] Falha ao encerrar compose (${composeFile}) code=${String(result.code)}.`);
      if (result.stderr.trim()) console.warn(result.stderr.trim());
    }
  }
}

export async function ensureHostServicesReady(): Promise<void> {
  await ensureOllama();
  await ensureDockerAndShutdownProjects();
}

async function main() {
  await ensureHostServicesReady();
}

const directRunUrl = process.argv[1] ? pathToFileURL(process.argv[1]).href : "";

if (import.meta.url === directRunUrl) {
  main().catch((error) => {
    console.error(`[HostBootstrap] Erro fatal: ${(error as Error).message}`);
    process.exit(1);
  });
}
