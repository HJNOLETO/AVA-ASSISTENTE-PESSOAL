import "dotenv/config";
import { Command } from "commander";
import { Message, ToolCall } from "../server/_core/llm";
import { orchestrateAgentResponse, getAvailableTools } from "../server/agents";
import fs from "fs/promises";
import path from "path";
import os from "os";
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import {
  searchDocumentChunks,
  searchProducts,
  getDb,
  addMemoryEntry,
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getProactiveTasks,
  createProactiveTask,
} from "../server/db";
import { redactSensitiveText, routeMemoryPersistence } from "../server/security/memoryGuard";
import { getVaultSecret, listVaultSecrets, removeVaultSecret, saveVaultSecret } from "../server/security/vaultStore";

const program = new Command();
const execFileAsync = promisify(execFile);

program
  .name("ava")
  .description("AVA Assistant - Interface Direta de Linha de Comando Autônoma")
  .version("1.0.0");

// Lista Negra Absoluta de Proteção do Host
const BLACKLIST_PATTERNS = [
  /\.env.*/i,
  /\.git[\/\\]/i,
  /node_modules/i,
  /sqlite.*\.db/i
];

const CLI_USER_ID = Number(process.env.AVA_CLI_USER_ID || process.env.TELEGRAM_STUDY_USER_ID || "1");

if (!Number.isFinite(CLI_USER_ID) || CLI_USER_ID <= 0) {
  throw new Error("AVA_CLI_USER_ID (ou TELEGRAM_STUDY_USER_ID) deve ser um numero positivo.");
}

function parseEnvDirList(rawValue: string | undefined, fallback: string[]): string[] {
  const tokens = (rawValue || "")
    .split(/[;,\n]/g)
    .map((item) => item.trim())
    .filter(Boolean);

  const source = tokens.length > 0 ? tokens : fallback;
  const normalized = source
    .map((item) => {
      const expanded = item.startsWith("~/") || item === "~"
        ? path.join(os.homedir(), item.replace(/^~[\\/]?/, ""))
        : item;
      return path.resolve(expanded);
    })
    .filter(Boolean);

  return Array.from(new Set(normalized));
}

const AVA_WORKSPACE_DIRS = parseEnvDirList(process.env.AVA_WORKSPACE_DIRS, [process.cwd()]);
const AVA_READONLY_DIRS = parseEnvDirList(process.env.AVA_READONLY_DIRS, []);

const CLI_SUPPORTED_TOOL_NAMES = new Set([
  "autodiagnostico_ava",
  "obter_data_hora",
  "listar_arquivos",
  "ler_arquivo",
  "ler_codigo_fonte",
  "explorar_diretorio_projeto",
  "buscar_documentos_rag",
  "buscar_web",
  "busrar_web",
  "navegar_pagina",
  "extrair_conteudo_estruturado",
  "gerenciar_produtos",
  "gerenciar_agenda",
  "criar_lembrete",
  "listar_lembretes",
  "criar_arquivo",
  "mover_arquivo",
  "copiar_arquivo",
  "renomear_arquivo",
  "apagar_arquivo",
  "criar_pasta",
  "sistema_de_arquivos",
  "criar_skill_customizada",
  "registrar_historico_estudo",
  "salvar_no_cofre",
  "listar_cofre",
  "remover_do_cofre",
  "obter_do_cofre",
  "git_status",
  "git_add",
  "git_commit",
  "git_push",
]);

type SelfStatusReport = {
  generatedAt: string;
  evolutionStage: string;
  autonomyLevel: string;
  canSelfRecreate: string;
  capabilities: {
    totalTools: number;
    toolNames: string[];
    categories: Record<string, number>;
  };
  security: {
    antiSimulation: boolean;
    memoryGuard: boolean;
    vaultEnabled: boolean;
    memoryBlockSensitive: boolean;
    workspaceRoots: string[];
  };
  recentChanges: Array<{ action: string; details: string; at: string }>;
};

function getCliAvailableTools() {
  return getAvailableTools().filter((tool) => {
    const name = tool?.function?.name;
    return typeof name === "string" && CLI_SUPPORTED_TOOL_NAMES.has(name);
  });
}

function coerceDate(value: unknown, field: string): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    const fromMs = new Date(value);
    if (!Number.isNaN(fromMs.getTime())) return fromMs;
  }
  if (typeof value === "string" && value.trim()) {
    const fromText = new Date(value.trim());
    if (!Number.isNaN(fromText.getTime())) return fromText;
  }
  throw new Error(`Campo '${field}' com data/hora invalida.`);
}

function coerceOptionalDate(value: unknown): Date | undefined {
  if (value === undefined || value === null || value === "") return undefined;
  return coerceDate(value, "data");
}

function coerceId(value: unknown, field: string): number {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    throw new Error(`Campo '${field}' deve ser um numero positivo.`);
  }
  return Math.round(parsed);
}

async function logAudit(action: string, details: string) {
  const logPath = path.resolve(process.cwd(), "data", "ava-cli-audit.log");
  const timestamp = new Date().toISOString();
  const safeDetails = redactSensitiveText(details);
  const entry = `[${timestamp}] ${action} | ${safeDetails}\n`;
  try {
    await fs.appendFile(logPath, entry, "utf-8");
  } catch (err) {
    // Falha silenciosa de log para não derrubar execução
  }
}

async function readRecentAuditEntries(limit = 12): Promise<Array<{ action: string; details: string; at: string }>> {
  const logPath = path.resolve(process.cwd(), "data", "ava-cli-audit.log");
  try {
    const raw = await fs.readFile(logPath, "utf-8");
    const lines = raw.split(/\r?\n/).filter(Boolean);
    const out: Array<{ action: string; details: string; at: string }> = [];
    for (let i = lines.length - 1; i >= 0 && out.length < limit; i--) {
      const line = lines[i];
      const match = line.match(/^\[([^\]]+)\]\s+([A-Z_]+)\s*\|\s*(.*)$/);
      if (!match) continue;
      const action = match[2];
      if (!/(FILE_OP|TOOL_CALL|VAULT_|MEMORY_|EXECUTION_GUARD)/.test(action)) continue;
      out.push({ at: match[1], action, details: match[3] });
    }
    return out;
  } catch {
    return [];
  }
}

function classifyToolCategory(name: string): string {
  if (/^git_/.test(name)) return "git";
  if (/cofre|vault/.test(name)) return "vault";
  if (/arquivo|pasta|diretorio|sistema_de_arquivos/.test(name)) return "filesystem";
  if (/agenda|lembrete/.test(name)) return "scheduling";
  if (/web|pagina|conteudo/.test(name)) return "web";
  if (/memoria|historico/.test(name)) return "memory";
  if (/produto/.test(name)) return "business";
  if (/diagnostico/.test(name)) return "self-awareness";
  return "general";
}

async function buildSelfStatusReport(): Promise<SelfStatusReport> {
  const toolNames = Array.from(CLI_SUPPORTED_TOOL_NAMES.values()).sort((a, b) => a.localeCompare(b));
  const categories: Record<string, number> = {};
  for (const name of toolNames) {
    const category = classifyToolCategory(name);
    categories[category] = (categories[category] || 0) + 1;
  }

  const recentChanges = await readRecentAuditEntries(12);

  return {
    generatedAt: new Date().toISOString(),
    evolutionStage: "Fase 2 - Governanca de memoria segura e autoconsciencia operacional",
    autonomyLevel: "assistida-com-guardrails",
    canSelfRecreate: "parcialmente: cria/edita skills e fluxos com supervisao; sem autonomia irrestrita",
    capabilities: {
      totalTools: toolNames.length,
      toolNames,
      categories,
    },
    security: {
      antiSimulation: true,
      memoryGuard: true,
      vaultEnabled: Boolean(String(process.env.AVA_VAULT_MASTER_KEY || "").trim()),
      memoryBlockSensitive: String(process.env.AVA_MEMORY_BLOCK_SENSITIVE ?? "true").toLowerCase() !== "false",
      workspaceRoots: AVA_WORKSPACE_DIRS,
    },
    recentChanges,
  };
}

function formatSelfStatusReport(report: SelfStatusReport): string {
  const categoryText = Object.entries(report.capabilities.categories)
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

  const changesText = report.recentChanges.length > 0
    ? report.recentChanges
      .map((item, idx) => `${idx + 1}. [${item.action}] ${item.details} (${new Date(item.at).toLocaleString("pt-BR")})`)
      .join("\n")
    : "Sem eventos recentes no audit log.";

  return [
    `Autodiagnostico AVA CLI (${new Date(report.generatedAt).toLocaleString("pt-BR")})`,
    `- Estagio de evolucao: ${report.evolutionStage}`,
    `- Nivel de autonomia: ${report.autonomyLevel}`,
    `- Capaz de se recriar: ${report.canSelfRecreate}`,
    `- Ferramentas ativas: ${report.capabilities.totalTools} (${categoryText})`,
    `- Seguranca: anti-simulacao=${report.security.antiSimulation} | memory-guard=${report.security.memoryGuard} | cofre=${report.security.vaultEnabled} | bloqueio-sensivel=${report.security.memoryBlockSensitive}`,
    `- Workspace permitido: ${report.security.workspaceRoots.join(" ; ")}`,
    "- Mudancas recentes (audit):",
    changesText,
  ].join("\n");
}

function isPathInside(targetPath: string, parentPath: string): boolean {
  const parent = path.resolve(parentPath);
  const target = path.resolve(targetPath);
  return target === parent || target.startsWith(parent + path.sep);
}

function resolveUserPath(rawPath: string): string {
  const trimmed = String(rawPath || "").trim();
  if (!trimmed) {
    throw new Error("Caminho obrigatorio.");
  }

  const expanded = trimmed.startsWith("~/") || trimmed === "~"
    ? path.join(os.homedir(), trimmed.replace(/^~[\\/]?/, ""))
    : trimmed;

  return path.isAbsolute(expanded)
    ? path.resolve(expanded)
    : path.resolve(process.cwd(), expanded);
}

function assertNotBlacklisted(resolvedPath: string) {
  for (const pattern of BLACKLIST_PATTERNS) {
    if (pattern.test(resolvedPath)) {
      throw new Error(`Acesso negado: O caminho protegido corresponde a lista negra (${pattern}).`);
    }
  }
}

function ensureReadPath(rawPath: string): string {
  const resolved = resolveUserPath(rawPath);
  assertNotBlacklisted(resolved);

  const allowedRoots = [process.cwd(), ...AVA_WORKSPACE_DIRS, ...AVA_READONLY_DIRS].map((item) => path.resolve(item));
  if (!allowedRoots.some((root) => isPathInside(resolved, root))) {
    throw new Error("Leitura bloqueada: caminho fora das areas permitidas (projeto/workspace/readonly).");
  }

  return resolved;
}

function ensureWritePath(rawPath: string): string {
  const resolved = resolveUserPath(rawPath);
  assertNotBlacklisted(resolved);

  const allowedRoots = AVA_WORKSPACE_DIRS.map((item) => path.resolve(item));
  if (!allowedRoots.some((root) => isPathInside(resolved, root))) {
    throw new Error("Escrita bloqueada: caminho fora de AVA_WORKSPACE_DIRS.");
  }

  return resolved;
}

function isHttpUrl(rawUrl: string): boolean {
  try {
    const parsed = new URL(rawUrl);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

function ensureHttpUrl(rawUrl: string): string {
  const value = String(rawUrl || "").trim();
  if (!value) throw new Error("URL obrigatoria.");
  const candidate = /^https?:\/\//i.test(value) ? value : `https://${value}`;
  if (!isHttpUrl(candidate)) {
    throw new Error("URL invalida. Use apenas http/https.");
  }
  return candidate;
}

function stripHtmlToText(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, " ")
    .replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, " ")
    .replace(/<noscript\b[^<]*(?:(?!<\/noscript>)<[^<]*)*<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

async function fetchWithTimeout(url: string, timeoutMs = 30000): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "AVA-CLI/1.0 (+web-search)"
      }
    });
  } finally {
    clearTimeout(timer);
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function decodeHtmlEntities(text: string): string {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function slugifySkillName(input: string): string {
  const normalized = String(input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return normalized || "skill-custom";
}

function requiresConcreteToolExecution(query: string): boolean {
  const text = String(query || "").trim().toLowerCase();
  if (!text) return false;

  const isInformationalQuestion =
    /\?$/.test(text) &&
    /^(como|o que|oque|qual|quais|quem|quando|onde|por que|porque|voce|você)\b/.test(text);

  const imperativePatterns = [
    /\bcrie\b/, /\bfaca\b/, /\bfaça\b/, /\bagende\b/, /\blembre\b/, /\batualize\b/,
    /\bedite\b/, /\bapague\b/, /\bdelete\b/, /\bmova\b/, /\bcopie\b/, /\brenomeie\b/,
    /\bliste\b/, /\bbusque\b/, /\bnavegue\b/, /\bextraia\b/, /\bregistre\b/, /\bexecute\b/,
    /\bcommit\b/, /\bpush\b/
  ];

  if (isInformationalQuestion && !imperativePatterns.some((pattern) => pattern.test(text))) {
    return false;
  }

  const actionPatterns = [
    /\bcriar\b/, /\bcrie\b/, /\bgera\b/, /\bgerar\b/, /\bagendar\b/, /\bagende\b/,
    /\blembrete\b/, /\blembre\b/, /\batualizar\b/, /\batualize\b/, /\beditar\b/, /\bedite\b/,
    /\bdeletar\b/, /\bdelete\b/, /\bapagar\b/, /\bapague\b/, /\bmover\b/, /\bmove\b/,
    /\bcopiar\b/, /\bcopie\b/, /\brenomear\b/, /\brenomeie\b/, /\bsalvar\b/, /\bsalve\b/,
    /\blistar\b/, /\bliste\b/, /\bbuscar\b/, /\bbusque\b/, /\bnavegar\b/, /\bnavegue\b/,
    /\bextrair\b/, /\bextraia\b/, /\bregistrar\b/, /\bregistre\b/, /\bcommit\b/, /\bpush\b/, /\bversionar\b/
  ];

  return actionPatterns.some((pattern) => pattern.test(text));
}

function ensureGitPathSafe(rawPath: string): string {
  const value = String(rawPath || "").trim();
  if (!value) throw new Error("Caminho Git invalido.");

  const normalized = value.replace(/\\/g, "/");
  if (/\.env/i.test(normalized) || /credentials\.json/i.test(normalized) || /secret/i.test(normalized)) {
    throw new Error("Path sensivel bloqueado para git add (.env/secret/credentials).");
  }

  const absolute = ensureReadPath(value);
  return path.relative(process.cwd(), absolute).split(path.sep).join("/");
}

async function runGitCommand(args: string[], timeoutMs = 120000): Promise<{ stdout: string; stderr: string }> {
  try {
    const { stdout, stderr } = await execFileAsync("git", args, {
      cwd: process.cwd(),
      timeout: timeoutMs,
      windowsHide: true,
      maxBuffer: 1024 * 1024 * 4,
    });
    return {
      stdout: String(stdout || "").trim(),
      stderr: String(stderr || "").trim(),
    };
  } catch (err: any) {
    const stdout = String(err?.stdout || "").trim();
    const stderr = String(err?.stderr || "").trim();
    const msg = String(err?.message || err || "Falha ao executar Git");
    const details = [msg, stdout, stderr].filter(Boolean).join("\n");
    throw new Error(details || "Falha ao executar Git.");
  }
}

async function buscarWebDuckDuckGo(query: string, limit = 5): Promise<Array<{ titulo: string; url: string; snippet: string }>> {
  const q = String(query || "").trim();
  if (!q) throw new Error("Consulta obrigatoria para buscar_web.");

  const endpoint = `https://duckduckgo.com/html/?q=${encodeURIComponent(q)}`;
  const res = await fetchWithTimeout(endpoint, 30000);
  if (!res.ok) {
    throw new Error(`DuckDuckGo indisponivel (HTTP ${res.status}).`);
  }

  const html = await res.text();
  const blockRegex = /<div class="result__body"[\s\S]*?<\/div>\s*<\/div>/g;
  const linkRegex = /<a[^>]*class="result__a"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/i;
  const snippetRegex = /<a[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/a>|<div[^>]*class="result__snippet"[^>]*>([\s\S]*?)<\/div>/i;
  const candidates = html.match(blockRegex) || [];

  const items: Array<{ titulo: string; url: string; snippet: string }> = [];
  for (const block of candidates) {
    const linkMatch = block.match(linkRegex);
    if (!linkMatch) continue;

    const rawHref = decodeHtmlEntities(linkMatch[1] || "");
    const title = decodeHtmlEntities(stripHtmlToText(linkMatch[2] || ""));
    const snippetMatch = block.match(snippetRegex);
    const snippetRaw = snippetMatch ? (snippetMatch[1] || snippetMatch[2] || "") : "";
    const snippet = decodeHtmlEntities(stripHtmlToText(snippetRaw));

    let resolvedUrl = rawHref;
    try {
      const parsed = new URL(rawHref, "https://duckduckgo.com");
      const uddg = parsed.searchParams.get("uddg");
      resolvedUrl = uddg ? decodeURIComponent(uddg) : parsed.toString();
    } catch {
      // keep raw href
    }

    if (!isHttpUrl(resolvedUrl)) continue;
    if (!title) continue;

    items.push({
      titulo: title,
      url: resolvedUrl,
      snippet: snippet.slice(0, 280),
    });

    if (items.length >= Math.max(1, Math.min(10, limit))) break;
  }

  return items;
}

async function navegarPagina(url: string, maxChars = 12000): Promise<{ titulo: string; texto: string; urlFinal: string }> {
  const target = ensureHttpUrl(url);
  const res = await fetchWithTimeout(target, 30000);
  if (!res.ok) {
    throw new Error(`Falha ao navegar na pagina (HTTP ${res.status}).`);
  }

  const html = await res.text();
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titulo = decodeHtmlEntities(stripHtmlToText(titleMatch?.[1] || "Sem titulo"));
  const texto = stripHtmlToText(html).slice(0, Math.max(1000, Math.min(30000, maxChars)));

  return {
    titulo,
    texto,
    urlFinal: res.url || target,
  };
}

async function extrairConteudoEstruturado(url: string, maxChars = 12000): Promise<{
  url: string;
  titulo: string;
  conteudo: string;
  links: string[];
}> {
  const target = ensureHttpUrl(url);
  const res = await fetchWithTimeout(target, 30000);
  if (!res.ok) {
    throw new Error(`Falha ao extrair conteudo (HTTP ${res.status}).`);
  }

  const html = await res.text();
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const titulo = decodeHtmlEntities(stripHtmlToText(titleMatch?.[1] || "Sem titulo"));
  const conteudo = stripHtmlToText(html).slice(0, Math.max(1000, Math.min(30000, maxChars)));

  const linksSet = new Set<string>();
  const linkRegex = /<a[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let match: RegExpExecArray | null = null;
  while ((match = linkRegex.exec(html)) !== null) {
    const href = decodeHtmlEntities(match[1] || "");
    try {
      const absolute = new URL(href, res.url || target).toString();
      if (isHttpUrl(absolute)) linksSet.add(absolute);
    } catch {
      // ignore invalid link
    }
    if (linksSet.size >= 30) break;
  }

  return {
    url: res.url || target,
    titulo,
    conteudo,
    links: Array.from(linksSet),
  };
}

program
  .command("ask")
  .description("Envia uma solicitação para o AVA no terminal, ativando autonomia de ferramentas.")
  .argument("<query>", "A solicitação ou tarefa a ser feita")
  .option("-p, --provider <provider>", "Define o provedor LLM (ex: forge, ollama)", process.env.LLM_PROVIDER || "ollama")
  .option("-m, --model <model>", "Define um modelo específico a ser usado (apenas para o provedor selecionado)")
  .action(async (query: string, options) => {
    console.log(`\n[AVA Agent]: Iniciando loop autônomo. Provedor: ${options.provider.toUpperCase()}...`);
    console.log(`[AVA Agent]: Tarefa Recebida: "${query}"\n`);
    
    // Assegurar inicialização do Database (suporta as the ferramentas que o LLM usa e.g. gerenciar_produtos)
    await getDb();

    const messages: Message[] = [{ role: "user", content: query }];
    let finishReason: string | null = null;
    let fallbackCounter = 0; // Previne loops infinitos agressivos
    const requireToolExecution = requiresConcreteToolExecution(query);
    let executedToolCalls = 0;
    let successfulToolCalls = 0;

    try {
      while (finishReason !== "stop" && fallbackCounter < 15) {
        fallbackCounter++;
        
        // Chamada principal para o orquestrador que sabe como injetar "System Prompt" e Contexto de Identidade
        let response;
        for (let attempt = 0; ; attempt++) {
          try {
            response = await orchestrateAgentResponse(
              messages,
              options.provider as "forge" | "ollama" | "groq" | "gemini",
              options.model,
              getCliAvailableTools()
            );
            break;
          } catch (err: any) {
            const msg = String(err?.message || err || "");
            const isGemini429 = String(options.provider).toLowerCase() === "gemini" && /(429|RESOURCE_EXHAUSTED|rate limit)/i.test(msg);
            if (isGemini429 && attempt < 2) {
              const retryMatch = msg.match(/retry in\s+([\d.]+)s/i);
              const suggestedMs = retryMatch ? Math.ceil(Number(retryMatch[1]) * 1000) : 0;
              const waitMs = Math.max(4000 * (attempt + 1), Math.min(65000, Number.isFinite(suggestedMs) ? suggestedMs : 0));
              console.warn(`[AVA Agent] Gemini em rate limit. Nova tentativa em ${waitMs}ms...`);
              await sleep(waitMs);
              continue;
            }
            throw err;
          }
        }

        const choice = response.choices?.[0];
        if (!choice) break;

        const message = choice.message;

        const textContent = Array.isArray(message.content)
          ? message.content.map(c => c.type === "text" ? c.text : "").join("\n")
          : message.content;

        // Salvar a mensagem no contexto
        messages.push({
          role: message.role,
          content: message.content || "",
          tool_calls: message.tool_calls
        });

        // Loop de ferramentas (Autonomia)
        if (message.tool_calls && message.tool_calls.length > 0) {
          finishReason = "tool_calls"; // Continuar conversando pós tool

          for (const tc of message.tool_calls as ToolCall[]) {
            executedToolCalls++;
            console.log(`[SYS] Executando Ferramenta Nativa: ==> ${tc.function.name}`);
            await logAudit("TOOL_CALL", `Instanciando: ${tc.function.name} com args: ${tc.function.arguments}`);
            let toolOutput = "";
            let toolSucceeded = false;

            try {
              const args = JSON.parse(tc.function.arguments);

              switch (tc.function.name) {
                case "obter_data_hora":
                  toolOutput = new Date().toISOString();
                  break;

                case "autodiagnostico_ava": {
                  const report = await buildSelfStatusReport();
                  toolOutput = formatSelfStatusReport(report);
                  break;
                }

                case "listar_arquivos": {
                  const dirPath = ensureReadPath(args.caminho || ".");
                  const items = await fs.readdir(dirPath);
                  // Respeitando limites do Host CLI: Devolve max 50 itens
                  toolOutput = items.slice(0, 50).join("\n");
                  if (items.length > 50) toolOutput += `\n... (e mais ${items.length - 50} itens omitidos por limite de tela)`;
                  break;
                }

                case "ler_arquivo":
                case "ler_codigo_fonte": {
                  const filePath = ensureReadPath(args.caminho || args.caminho_arquivo || "");
                  const content = await fs.readFile(filePath, "utf-8");
                  const lines = content.split("\n");
                  // Limitando leitura via CLI para não estourar memória do LLM: máx 300 linhas
                  const start = Math.max(0, (args.linhas?.inicio || 1) - 1);
                  const end = Math.min(lines.length, (args.linhas?.fim || start + 300));
                  toolOutput = lines.slice(start, end).join("\n");
                  if (end < lines.length) toolOutput += `\n\n[AVISO CLI]: Conteúdo truncado em ${end} linhas devido a limites de buffer locais.`;
                  break;
                }

                case "explorar_diretorio_projeto": {
                  const dirPath = ensureReadPath(args.caminho || ".");
                  const items = await fs.readdir(dirPath);
                  toolOutput = items.slice(0, 50).join("\n");
                  break;
                }

                case "buscar_documentos_rag": {
                  // TELEGRAM_STUDY_USER_ID is defaulted to 1 for the main RAG database
                  const res = await searchDocumentChunks(1, String(args.consulta || ""), 5);
                  toolOutput = res.length > 0
                    ? res.map(c => `[Doc Chunk]: ${c.content}`).join("\n---\n")
                    : "Nenhuma informação explícita encontrada no banco RAG.";
                  break;
                }

                case "buscar_web":
                case "busrar_web": {
                  const consulta = String(args.query || args.consulta || "").trim();
                  const limite = args.limit !== undefined ? Number(args.limit) : args.limite !== undefined ? Number(args.limite) : 5;
                  const results = await buscarWebDuckDuckGo(consulta, Number.isFinite(limite) ? limite : 5);
                  if (results.length === 0) {
                    toolOutput = "Nenhum resultado web encontrado para a consulta.";
                    break;
                  }
                  toolOutput = results
                    .map((item, idx) => `${idx + 1}. ${item.titulo}\nURL: ${item.url}\nResumo: ${item.snippet}`)
                    .join("\n\n");
                  break;
                }

                case "navegar_pagina": {
                  const url = String(args.url || "").trim();
                  const maxChars = args.max_chars !== undefined ? Number(args.max_chars) : 12000;
                  const page = await navegarPagina(url, Number.isFinite(maxChars) ? maxChars : 12000);
                  toolOutput = `Titulo: ${page.titulo}\nURL final: ${page.urlFinal}\n\nConteudo:\n${page.texto}`;
                  break;
                }

                case "extrair_conteudo_estruturado": {
                  const url = String(args.url || "").trim();
                  const maxChars = args.max_chars !== undefined ? Number(args.max_chars) : 12000;
                  const payload = await extrairConteudoEstruturado(url, Number.isFinite(maxChars) ? maxChars : 12000);
                  toolOutput = JSON.stringify(payload, null, 2);
                  break;
                }

                case "gerenciar_produtos": {
                  const term = String(args.termo || args.id || "");
                  const found = await searchProducts(term, 20);
                  toolOutput = found.length > 0
                    ? `Produtos Localizados:\n` + found.map((p: any) => `- ${p.name} | Ref: ${p.referenceId} | Preço: R$${p.price} | Estoque: ${p.stock} | NCM: ${p.ncm || 'N/A'}`).join("\n")
                    : "Nenhum produto em estoque corresponde a sua busca.";
                  break;
                }

                case "gerenciar_agenda": {
                  const action = String(args.acao || "").trim().toLowerCase();

                  if (action === "listar") {
                    const start = coerceOptionalDate(args.data_inicio);
                    const end = coerceOptionalDate(args.data_fim);
                    const appointments = await getAppointments(CLI_USER_ID, start, end);
                    toolOutput = appointments.length > 0
                      ? JSON.stringify(appointments, null, 2)
                      : "Nenhum compromisso encontrado para os filtros informados.";
                    break;
                  }

                  if (action === "detalhar") {
                    const id = coerceId(args.id, "id");
                    const appointment = await getAppointmentById(CLI_USER_ID, id);
                    toolOutput = appointment
                      ? JSON.stringify(appointment, null, 2)
                      : "Compromisso nao encontrado.";
                    break;
                  }

                  if (action === "criar") {
                    const data = (args.dados || {}) as Record<string, unknown>;
                    const title = String(data.title || "").trim();
                    if (!title) throw new Error("'dados.title' e obrigatorio para criar compromisso.");

                    const startDate = coerceDate(data.startTime ?? data.start_time, "dados.startTime");
                    const endDate = coerceDate(data.endTime ?? data.end_time, "dados.endTime");
                    if (endDate.getTime() <= startDate.getTime()) {
                      throw new Error("'dados.endTime' deve ser maior que 'dados.startTime'.");
                    }

                    await createAppointment(CLI_USER_ID, {
                      title,
                      description: data.description ? String(data.description) : null,
                      startTime: startDate,
                      endTime: endDate,
                      startDate: startDate.toISOString(),
                      endDate: endDate.toISOString(),
                      location: data.location ? String(data.location) : null,
                      type: (data.type as "meeting" | "consultation" | "call" | "other") || "other",
                      reminderMinutes: data.reminderMinutes !== undefined ? Number(data.reminderMinutes) : null,
                      recurrenceRule: data.recurrenceRule ? String(data.recurrenceRule) : null,
                      participants: data.participants ? JSON.stringify(data.participants) : null,
                      customerId: data.customerId !== undefined ? Number(data.customerId) : null,
                      isCompleted: Number(data.isCompleted || 0),
                      status: (data.status as "scheduled" | "completed" | "cancelled") || "scheduled",
                      updatedAt: new Date(),
                    });

                    toolOutput = `Compromisso criado com sucesso para ${startDate.toLocaleString("pt-BR")}.`;
                    break;
                  }

                  if (action === "atualizar") {
                    const id = coerceId(args.id, "id");
                    const data = (args.dados || {}) as Record<string, unknown>;
                    const updates: Record<string, unknown> = { updatedAt: new Date() };

                    if (data.title !== undefined) updates.title = String(data.title);
                    if (data.description !== undefined) updates.description = data.description ? String(data.description) : null;
                    if (data.location !== undefined) updates.location = data.location ? String(data.location) : null;
                    if (data.status !== undefined) updates.status = String(data.status);
                    if (data.type !== undefined) updates.type = String(data.type);
                    if (data.reminderMinutes !== undefined) updates.reminderMinutes = Number(data.reminderMinutes);
                    if (data.recurrenceRule !== undefined) updates.recurrenceRule = data.recurrenceRule ? String(data.recurrenceRule) : null;
                    if (data.participants !== undefined) updates.participants = JSON.stringify(data.participants);
                    if (data.customerId !== undefined) updates.customerId = Number(data.customerId);
                    if (data.isCompleted !== undefined) updates.isCompleted = Number(data.isCompleted);

                    if (data.startTime !== undefined || data.start_time !== undefined) {
                      const parsedStart = coerceDate(data.startTime ?? data.start_time, "dados.startTime");
                      updates.startTime = parsedStart;
                      updates.startDate = parsedStart.toISOString();
                    }
                    if (data.endTime !== undefined || data.end_time !== undefined) {
                      const parsedEnd = coerceDate(data.endTime ?? data.end_time, "dados.endTime");
                      updates.endTime = parsedEnd;
                      updates.endDate = parsedEnd.toISOString();
                    }

                    await updateAppointment(CLI_USER_ID, id, updates as any);
                    toolOutput = "Compromisso atualizado com sucesso.";
                    break;
                  }

                  if (action === "deletar") {
                    if (!(args as Record<string, unknown>).confirmado) {
                      throw new Error("Para deletar um compromisso, envie 'confirmado: true'.");
                    }
                    const id = coerceId(args.id, "id");
                    await deleteAppointment(CLI_USER_ID, id);
                    toolOutput = "Compromisso deletado.";
                    break;
                  }

                  toolOutput = "Acao ou parametros invalidos para gerenciar_agenda.";
                  break;
                }

                case "criar_lembrete": {
                  const mensagem = String(args.mensagem || "").trim();
                  if (!mensagem) throw new Error("'mensagem' e obrigatoria para criar lembrete.");

                  const minutos = args.minutos_daqui !== undefined ? Number(args.minutos_daqui) : undefined;
                  const horario = args.horario ? String(args.horario).trim() : "";
                  const recorrencia = args.recorrencia ? String(args.recorrencia).trim() : null;
                  let nextRun = new Date();

                  if (minutos !== undefined) {
                    if (!Number.isFinite(minutos) || minutos <= 0) {
                      throw new Error("'minutos_daqui' deve ser um numero positivo.");
                    }
                    nextRun = new Date(Date.now() + Math.round(minutos) * 60 * 1000);
                  } else if (horario) {
                    if (horario.includes(":")) {
                      const [hRaw, mRaw] = horario.split(":");
                      const h = Number(hRaw);
                      const m = Number(mRaw);
                      if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || h > 23 || m < 0 || m > 59) {
                        throw new Error("'horario' no formato HH:mm e invalido.");
                      }
                      nextRun = new Date();
                      nextRun.setHours(h, m, 0, 0);
                      if (nextRun.getTime() <= Date.now()) {
                        nextRun = new Date(nextRun.getTime() + 24 * 60 * 60 * 1000);
                      }
                    } else {
                      nextRun = coerceDate(horario, "horario");
                    }
                  }

                  await createProactiveTask(CLI_USER_ID, {
                    title: `Lembrete: ${mensagem}`,
                    description: mensagem,
                    type: "watcher",
                    status: "active",
                    schedule: recorrencia,
                    nextRun,
                  });

                  toolOutput = `Lembrete criado para ${nextRun.toLocaleString("pt-BR")}${recorrencia ? ` (recorrencia: ${recorrencia})` : ""}.`;
                  break;
                }

                case "listar_lembretes": {
                  const statusFilter = args.status ? String(args.status).trim() : "";
                  const limit = args.limite !== undefined ? Math.max(1, Math.min(50, Number(args.limite))) : 20;
                  const reminders = await getProactiveTasks(CLI_USER_ID);
                  const filtered = reminders
                    .filter((task: any) => !statusFilter || task.status === statusFilter)
                    .sort((a: any, b: any) => {
                      const aNext = a.nextRun ? new Date(a.nextRun).getTime() : Number.MAX_SAFE_INTEGER;
                      const bNext = b.nextRun ? new Date(b.nextRun).getTime() : Number.MAX_SAFE_INTEGER;
                      return aNext - bNext;
                    })
                    .slice(0, Number.isFinite(limit) ? limit : 20);

                  if (filtered.length === 0) {
                    toolOutput = "Nenhum lembrete encontrado para os filtros informados.";
                    break;
                  }

                  toolOutput = filtered
                    .map((task: any, idx: number) => {
                      const nextRun = task.nextRun ? new Date(task.nextRun).toLocaleString("pt-BR") : "sem agendamento";
                      return `${idx + 1}. [${task.status}] ${task.title} | proximo: ${nextRun}`;
                    })
                    .join("\n");
                  break;
                }

                case "criar_arquivo": {
                  const filePath = ensureWritePath(args.caminho || args.path || "");
                  const content = args.conteudo !== undefined ? String(args.conteudo) : "";
                  await fs.mkdir(path.dirname(filePath), { recursive: true });
                  await fs.writeFile(filePath, content, "utf-8");
                  await logAudit("FILE_OP", `criar_arquivo | ${filePath}`);
                  toolOutput = `Arquivo criado com sucesso: ${filePath}`;
                  break;
                }

                case "criar_pasta": {
                  const folderPath = ensureWritePath(args.caminho || args.path || "");
                  await fs.mkdir(folderPath, { recursive: true });
                  await logAudit("FILE_OP", `criar_pasta | ${folderPath}`);
                  toolOutput = `Pasta criada com sucesso: ${folderPath}`;
                  break;
                }

                case "mover_arquivo": {
                  const sourcePath = ensureWritePath(args.origem || args.source || "");
                  const targetPath = ensureWritePath(args.destino || args.target || "");
                  await fs.mkdir(path.dirname(targetPath), { recursive: true });
                  await fs.rename(sourcePath, targetPath);
                  await logAudit("FILE_OP", `mover_arquivo | ${sourcePath} -> ${targetPath}`);
                  toolOutput = `Arquivo movido com sucesso para: ${targetPath}`;
                  break;
                }

                case "copiar_arquivo": {
                  const sourcePath = ensureReadPath(args.origem || args.source || "");
                  const targetPath = ensureWritePath(args.destino || args.target || "");
                  await fs.mkdir(path.dirname(targetPath), { recursive: true });
                  await fs.copyFile(sourcePath, targetPath);
                  await logAudit("FILE_OP", `copiar_arquivo | ${sourcePath} -> ${targetPath}`);
                  toolOutput = `Arquivo copiado com sucesso para: ${targetPath}`;
                  break;
                }

                case "renomear_arquivo": {
                  const sourcePath = ensureWritePath(args.caminho || args.path || "");
                  const rawName = String(args.novo_nome || "").trim();
                  if (!rawName) throw new Error("'novo_nome' e obrigatorio para renomear_arquivo.");
                  if (rawName.includes("/") || rawName.includes("\\")) {
                    throw new Error("'novo_nome' nao deve conter separadores de diretorio.");
                  }

                  const targetPath = ensureWritePath(path.join(path.dirname(sourcePath), rawName));
                  await fs.rename(sourcePath, targetPath);
                  await logAudit("FILE_OP", `renomear_arquivo | ${sourcePath} -> ${targetPath}`);
                  toolOutput = `Arquivo renomeado com sucesso para: ${path.basename(targetPath)}`;
                  break;
                }

                case "apagar_arquivo": {
                  const confirmado = Boolean((args as Record<string, unknown>).confirmado);
                  const userConfirmed = /\b(confirmo|confirmada|confirmado|tenho certeza|autorizo apagar|pode apagar)\b/i.test(query);
                  if (!confirmado || !userConfirmed) {
                    throw new Error("Para apagar_arquivo, o usuario deve confirmar explicitamente na mensagem (ex.: 'confirmo apagar') e enviar 'confirmado: true'.");
                  }
                  const targetPath = ensureWritePath(args.caminho || args.path || "");
                  await fs.rm(targetPath, { recursive: true, force: false });
                  await logAudit("FILE_OP", `apagar_arquivo | ${targetPath}`);
                  toolOutput = `Arquivo/pasta removido com sucesso: ${targetPath}`;
                  break;
                }

                case "sistema_de_arquivos": {
                  const acao = String(args.acao || "").trim().toLowerCase();
                  if (acao === "listar" || acao === "listar_arquivos") {
                    const dirPath = ensureReadPath(args.caminho || ".");
                    const items = await fs.readdir(dirPath);
                    toolOutput = items.slice(0, 50).join("\n");
                    break;
                  }

                  if (acao === "ler_arquivo") {
                    const filePath = ensureReadPath(args.caminho || "");
                    const content = await fs.readFile(filePath, "utf-8");
                    const lines = content.split("\n");
                    toolOutput = lines.slice(0, 300).join("\n");
                    if (lines.length > 300) {
                      toolOutput += `\n\n[AVISO CLI]: Conteúdo truncado em 300 linhas devido a limites de buffer locais.`;
                    }
                    break;
                  }

                  if (acao === "criar_arquivo") {
                    const filePath = ensureWritePath(args.caminho || "");
                    const content = args.conteudo !== undefined ? String(args.conteudo) : "";
                    await fs.mkdir(path.dirname(filePath), { recursive: true });
                    await fs.writeFile(filePath, content, "utf-8");
                    await logAudit("FILE_OP", `sistema_de_arquivos.criar_arquivo | ${filePath}`);
                    toolOutput = `Arquivo criado com sucesso: ${filePath}`;
                    break;
                  }

                  if (acao === "editar_arquivo") {
                    const filePath = ensureWritePath(args.caminho || "");
                    const content = args.conteudo !== undefined ? String(args.conteudo) : "";
                    await fs.writeFile(filePath, content, "utf-8");
                    await logAudit("FILE_OP", `sistema_de_arquivos.editar_arquivo | ${filePath}`);
                    toolOutput = `Arquivo atualizado com sucesso: ${filePath}`;
                    break;
                  }

                  if (acao === "criar_pasta") {
                    const folderPath = ensureWritePath(args.caminho || args.path || "");
                    await fs.mkdir(folderPath, { recursive: true });
                    await logAudit("FILE_OP", `sistema_de_arquivos.criar_pasta | ${folderPath}`);
                    toolOutput = `Pasta criada com sucesso: ${folderPath}`;
                    break;
                  }

                  if (acao === "copiar_arquivo") {
                    const sourcePath = ensureReadPath(args.origem || args.source || "");
                    const targetPath = ensureWritePath(args.destino || args.target || "");
                    await fs.mkdir(path.dirname(targetPath), { recursive: true });
                    await fs.copyFile(sourcePath, targetPath);
                    await logAudit("FILE_OP", `sistema_de_arquivos.copiar_arquivo | ${sourcePath} -> ${targetPath}`);
                    toolOutput = `Arquivo copiado com sucesso para: ${targetPath}`;
                    break;
                  }

                  if (acao === "mover_arquivo") {
                    const sourcePath = ensureWritePath(args.origem || args.source || "");
                    const targetPath = ensureWritePath(args.destino || args.target || "");
                    await fs.mkdir(path.dirname(targetPath), { recursive: true });
                    await fs.rename(sourcePath, targetPath);
                    await logAudit("FILE_OP", `sistema_de_arquivos.mover_arquivo | ${sourcePath} -> ${targetPath}`);
                    toolOutput = `Arquivo movido com sucesso para: ${targetPath}`;
                    break;
                  }

                  if (acao === "renomear_arquivo") {
                    const sourcePath = ensureWritePath(args.caminho || args.path || "");
                    const rawName = String(args.novo_nome || "").trim();
                    if (!rawName) throw new Error("'novo_nome' e obrigatorio para renomear_arquivo.");
                    if (rawName.includes("/") || rawName.includes("\\")) {
                      throw new Error("'novo_nome' nao deve conter separadores de diretorio.");
                    }

                    const targetPath = ensureWritePath(path.join(path.dirname(sourcePath), rawName));
                    await fs.rename(sourcePath, targetPath);
                    await logAudit("FILE_OP", `sistema_de_arquivos.renomear_arquivo | ${sourcePath} -> ${targetPath}`);
                    toolOutput = `Arquivo renomeado com sucesso para: ${path.basename(targetPath)}`;
                    break;
                  }

                  if (acao === "apagar_arquivo") {
                    const confirmado = Boolean((args as Record<string, unknown>).confirmado);
                    const userConfirmed = /\b(confirmo|confirmada|confirmado|tenho certeza|autorizo apagar|pode apagar)\b/i.test(query);
                    if (!confirmado || !userConfirmed) {
                      throw new Error("Para apagar_arquivo, o usuario deve confirmar explicitamente na mensagem (ex.: 'confirmo apagar') e enviar 'confirmado: true'.");
                    }

                    const targetPath = ensureWritePath(args.caminho || args.path || "");
                    await fs.rm(targetPath, { recursive: true, force: false });
                    await logAudit("FILE_OP", `sistema_de_arquivos.apagar_arquivo | ${targetPath}`);
                    toolOutput = `Arquivo/pasta removido com sucesso: ${targetPath}`;
                    break;
                  }

                  toolOutput = "Acao invalida para sistema_de_arquivos.";
                  break;
                }

                case "git_status": {
                  const check = await runGitCommand(["rev-parse", "--is-inside-work-tree"], 30000);
                  if (check.stdout !== "true") {
                    throw new Error("Diretorio atual nao e um repositorio Git valido.");
                  }

                  const branchInfo = await runGitCommand(["status", "--short", "--branch"], 60000);
                  await logAudit("GIT_OP", "git_status");
                  toolOutput = branchInfo.stdout || "Repositorio sem alteracoes pendentes.";
                  break;
                }

                case "git_add": {
                  const rawPaths: string[] = Array.isArray(args.caminhos)
                    ? args.caminhos.map((p: unknown) => String(p || "").trim()).filter(Boolean)
                    : [String(args.caminho || args.path || ".").trim()].filter(Boolean);

                  const uniquePaths = Array.from(new Set(rawPaths.map(ensureGitPathSafe)));
                  if (uniquePaths.length === 0) {
                    throw new Error("Informe ao menos um caminho para git_add.");
                  }

                  await runGitCommand(["add", "--", ...uniquePaths], 120000);
                  await logAudit("GIT_OP", `git_add | paths=${uniquePaths.join(",")}`);
                  toolOutput = `Arquivos adicionados ao stage: ${uniquePaths.join(", ")}`;
                  break;
                }

                case "git_commit": {
                  const message = String(args.mensagem || args.message || "").trim();
                  if (!message) {
                    throw new Error("'mensagem' e obrigatoria para git_commit.");
                  }
                  if (/--amend/i.test(message)) {
                    throw new Error("Mensagem invalida: nao use marcacoes de comando no texto do commit.");
                  }

                  const result = await runGitCommand(["commit", "-m", message], 120000);
                  await logAudit("GIT_OP", `git_commit | message=${message}`);
                  toolOutput = result.stdout || "Commit criado com sucesso.";
                  break;
                }

                case "git_push": {
                  const confirmado = Boolean((args as Record<string, unknown>).confirmado);
                  if (!confirmado) {
                    throw new Error("Para git_push, envie 'confirmado: true'.");
                  }

                  const force = Boolean((args as Record<string, unknown>).force || (args as Record<string, unknown>).forcar);
                  if (force) {
                    throw new Error("git_push com force e bloqueado por seguranca.");
                  }

                  const remote = String(args.remoto || args.remote || "origin").trim();
                  let branch = String(args.branch || args.ramo || "").trim();
                  if (!branch) {
                    const current = await runGitCommand(["rev-parse", "--abbrev-ref", "HEAD"], 30000);
                    branch = current.stdout.trim();
                  }
                  if (!branch || branch === "HEAD") {
                    throw new Error("Nao foi possivel determinar branch atual para push.");
                  }

                  const useUpstream = Boolean((args as Record<string, unknown>).set_upstream || (args as Record<string, unknown>).upstream);
                  const pushArgs = useUpstream ? ["push", "-u", remote, branch] : ["push", remote, branch];
                  const result = await runGitCommand(pushArgs, 180000);
                  await logAudit("GIT_OP", `git_push | remote=${remote} branch=${branch} upstream=${useUpstream}`);
                  toolOutput = result.stdout || `Push concluido para ${remote}/${branch}.`;
                  break;
                }

                case "criar_skill_customizada": {
                  const nome = String(args.nome || "").trim();
                  const objetivo = String(args.objetivo || "").trim();
                  const instrucoes = String(args.instrucoes || "").trim();
                  if (!nome) throw new Error("'nome' e obrigatorio para criar_skill_customizada.");
                  if (!objetivo) throw new Error("'objetivo' e obrigatorio para criar_skill_customizada.");
                  if (!instrucoes) throw new Error("'instrucoes' e obrigatorio para criar_skill_customizada.");

                  const slug = slugifySkillName(nome);
                  const skillDir = ensureWritePath(path.join(".agent", "skills", slug));
                  const skillPath = ensureWritePath(path.join(skillDir, "SKILL.md"));

                  const content = [
                    `# ${nome}`,
                    "",
                    "## Objetivo",
                    objetivo,
                    "",
                    "## Instrucoes",
                    instrucoes,
                    "",
                    "## Metadados",
                    `- slug: ${slug}`,
                    `- criado_em: ${new Date().toISOString()}`,
                    "- origem: criar_skill_customizada",
                  ].join("\n");

                  await fs.mkdir(skillDir, { recursive: true });
                  await fs.writeFile(skillPath, content, "utf-8");
                  await logAudit("FILE_OP", `criar_skill_customizada | ${skillPath}`);
                  toolOutput = `Skill customizada criada com sucesso em: ${skillPath}`;
                  break;
                }

                case "registrar_historico_estudo": {
                  const tema = String(args.tema || "").trim();
                  const tipo = String(args.tipo || "").trim().toLowerCase();
                  if (!tema) throw new Error("'tema' e obrigatorio para registrar historico de estudo.");
                  if (!tipo) throw new Error("'tipo' e obrigatorio para registrar historico de estudo.");

                  const duracaoMinutos = args.duracao_minutos !== undefined ? Number(args.duracao_minutos) : undefined;
                  if (duracaoMinutos !== undefined && (!Number.isFinite(duracaoMinutos) || duracaoMinutos <= 0)) {
                    throw new Error("'duracao_minutos' deve ser um numero positivo quando informado.");
                  }

                  const desempenho = args.desempenho !== undefined ? Number(args.desempenho) : undefined;
                  if (desempenho !== undefined && (!Number.isFinite(desempenho) || desempenho < 0 || desempenho > 100)) {
                    throw new Error("'desempenho' deve estar entre 0 e 100 quando informado.");
                  }

                  const observacoes = args.observacoes ? String(args.observacoes).trim() : "";
                  const tags = Array.isArray(args.tags)
                    ? args.tags.map((tag: unknown) => String(tag).trim()).filter(Boolean)
                    : [];

                  const payload = {
                    origem: "ava-cli",
                    categoria: "historico_estudo",
                    tema,
                    tipo,
                    duracao_minutos: duracaoMinutos,
                    desempenho,
                    observacoes,
                    tags,
                    registrado_em: new Date().toISOString(),
                  };

                  const content = `Historico de estudo registrado: ${JSON.stringify(payload)}`;
                  const routing = routeMemoryPersistence(content);

                  await logAudit(
                    "MEMORY_CLASSIFICATION",
                    `class=${routing.classification.classification} destination=${routing.classification.destination} confidence=${routing.classification.confidence.toFixed(2)} reason=${routing.classification.reason}`
                  );

                  if (!routing.persist) {
                    if (routing.blocked) {
                      toolOutput = [
                        "Registro operacional recebido, mas a persistencia de memoria foi bloqueada por seguranca.",
                        `Motivo: ${routing.policyMessage}`,
                        "Use um comando de cofre/consentimento explicito para armazenar informacoes sensiveis.",
                      ].join(" ");
                      break;
                    }

                    toolOutput = `Historico processado sem persistencia semantica. Motivo: ${routing.policyMessage}`;
                    break;
                  }

                  const keywords = ["historico_estudo", tema, tipo, ...tags]
                    .map((k) => k.trim())
                    .filter(Boolean)
                    .join(", ");

                  await addMemoryEntry(CLI_USER_ID, routing.sanitizedContent, keywords, "context");
                  toolOutput = `Historico de estudo salvo com sucesso para o tema '${tema}' (tipo: ${tipo}).`;
                  break;
                }

                case "salvar_no_cofre": {
                  const chave = String(args.chave || args.key || "").trim();
                  const valor = String(args.valor || args.value || "").trim();
                  const observacao = args.observacao !== undefined ? String(args.observacao) : args.note !== undefined ? String(args.note) : undefined;
                  const finalidade = args.finalidade !== undefined ? String(args.finalidade) : args.scope !== undefined ? String(args.scope) : "armazenamento seguro";
                  const confirmado = Boolean((args as Record<string, unknown>).confirmado);

                  if (!confirmado) {
                    throw new Error("Para salvar_no_cofre, envie 'confirmado: true' para consentimento explicito.");
                  }

                  const routing = routeMemoryPersistence(`${chave}: ${valor}${observacao ? ` | ${observacao}` : ""}`);
                  if (routing.classification.classification !== "secret" && routing.classification.classification !== "sensitive") {
                    throw new Error("Use salvar_no_cofre apenas para segredo/dado sensivel. Para conteudo util comum, use memoria semantica.");
                  }

                  await saveVaultSecret(CLI_USER_ID, chave, valor, observacao, {
                    given: true,
                    scope: finalidade,
                    givenAt: new Date().toISOString(),
                  });
                  await logAudit("VAULT_WRITE", `key=${chave} class=${routing.classification.classification} scope=${finalidade}`);
                  toolOutput = `Cofre atualizado com sucesso para a chave '${chave}'.`;
                  break;
                }

                case "listar_cofre": {
                  const items = await listVaultSecrets(CLI_USER_ID);
                  if (items.length === 0) {
                    toolOutput = "Cofre vazio.";
                    break;
                  }
                  toolOutput = items
                    .map((item, idx) => `${idx + 1}. ${item.key} | atualizado: ${new Date(item.updatedAt).toLocaleString("pt-BR")} | consentimento: ${new Date(item.consentGivenAt).toLocaleString("pt-BR")}${item.consentScope ? ` | escopo: ${item.consentScope}` : ""}${item.note ? ` | nota: ${item.note}` : ""}`)
                    .join("\n");
                  break;
                }

                case "remover_do_cofre": {
                  const chave = String(args.chave || args.key || "").trim();
                  const confirmado = Boolean((args as Record<string, unknown>).confirmado);
                  if (!confirmado) {
                    throw new Error("Para remover_do_cofre, envie 'confirmado: true'.");
                  }
                  const removed = await removeVaultSecret(CLI_USER_ID, chave);
                  await logAudit("VAULT_DELETE", `key=${chave} removed=${removed}`);
                  toolOutput = removed
                    ? `Chave '${chave}' removida do cofre.`
                    : `Chave '${chave}' nao encontrada no cofre.`;
                  break;
                }

                case "obter_do_cofre": {
                  const chave = String(args.chave || args.key || "").trim();
                  const finalidade = String(args.finalidade || args.scope || "").trim();
                  const confirmado = Boolean((args as Record<string, unknown>).confirmado);
                  if (!confirmado) {
                    throw new Error("Para obter_do_cofre, envie 'confirmado: true'.");
                  }
                  if (!finalidade) {
                    throw new Error("Para obter_do_cofre, informe a 'finalidade' de uso do segredo.");
                  }

                  const secret = await getVaultSecret(CLI_USER_ID, chave);
                  await logAudit("VAULT_READ", `key=${chave} scope=${finalidade} found=${Boolean(secret)}`);
                  toolOutput = secret
                    ? `Cofre -> chave '${secret.key}' | valor: ${secret.value} | atualizado: ${new Date(secret.updatedAt).toLocaleString("pt-BR")}${secret.note ? ` | nota: ${secret.note}` : ""}`
                    : `Chave '${chave}' nao encontrada no cofre.`;
                  break;
                }

                default:
                  // Para ferramentas complexas (backend puro CRM/Agenda/Etc..), interceptamos controladamente
                  toolOutput = "ATENÇÃO: Ferramenta não suportada remotamente no modo CLI confinado ainda. Você deve indicar ao usuário que ele deve acessar a interface WEB para realizar essa ação.";
                  break;
              }
              toolSucceeded =
                !toolOutput.startsWith("Falha sistêmica") &&
                !toolOutput.startsWith("ATENÇÃO: Ferramenta não suportada");
            } catch (err) {
              toolOutput = `Falha sistêmica na execução da tool ${tc.function.name}: ${(err as Error).message}`;
              console.log(`[SYS ERR] ${toolOutput}`);
            }

            if (toolSucceeded) {
              successfulToolCalls++;
            }

            // Injeta resultado da ferramenta no Histórico e volta pro LLM
            messages.push({
              role: "tool",
              name: tc.function.name,
              tool_call_id: tc.id,
              content: toolOutput
            });
          }
        } else {
          if (requireToolExecution && successfulToolCalls === 0) {
            const noExecutionMsg = [
              "[AVA Execução]: nenhuma ação concreta foi executada.",
              "Motivo: o modelo não acionou ferramentas nativas para esta solicitação.",
              "Reformule com pedido operacional direto (ex.: 'crie', 'liste', 'atualize') para execução real.",
            ].join("\n");
            console.log(`\n${noExecutionMsg}\n`);
            await logAudit("EXECUTION_GUARD", `Bloqueio anti-simulacao | query=${query.slice(0, 180)} | tool_calls=${executedToolCalls}`);
            finishReason = "stop";
            break;
          }

          if (typeof textContent === "string" && textContent.trim().length > 0) {
            console.log(`\n[AVA Responde]:\n${textContent}\n`);
            await logAudit("LLM_RESPONSE", textContent.slice(0, 150).replace(/\n/g, " "));
          }
          finishReason = choice.finish_reason || "stop";
        }
      }

      if (fallbackCounter >= 15) {
        console.log(`\n[SISTEMA]: Limitador de interações autônomas atingido (15 ciclos max).\n`);
      }

    } catch (error) {
      console.error(`\n[Erro Fatal do Sistema]: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program
  .command("self-status")
  .description("Exibe o autodiagnostico operacional e de seguranca do AVA CLI.")
  .option("--json", "Retorna em JSON")
  .action(async (options: { json?: boolean }) => {
    const report = await buildSelfStatusReport();
    if (options.json) {
      console.log(JSON.stringify(report, null, 2));
      return;
    }
    console.log(`\n${formatSelfStatusReport(report)}\n`);
  });

program.parseAsync(process.argv).catch((error) => {
  console.error(`\n[Erro Crítico do CLI]: ${(error as Error).message}\n`);
  process.exit(1);
});
