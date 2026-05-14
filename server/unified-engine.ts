/**
 * unified-engine.ts
 * Motor unificado de processamento do AVA Assistant.
 *
 * Fornece a função `processAvaRequest` que é compartilhada entre:
 *   - CLI  (cli/index.ts)
 *   - Telegram Bot (server/telegramStudyBot.ts)
 *   - Chat Web  (server/routers.ts)
 *
 * Isso garante: comportamento idêntico, memória compartilhada e
 * trilha de auditoria única independente do canal de entrada.
 */

import "dotenv/config";
import path from "path";
import os from "os";
import fs from "fs/promises";
import {
  getDb,
  addMemoryEntry,
  getProactiveTasks,
  createProactiveTask,
  createAppointment,
  getDueReviews,
  createLearningModule,
  createLearningTopic,
  getLearningModules,
  getLearningModuleById,
  getLearningProgress,
  updateLearningProgress,
  pauseLearningModule,
  resumeLearningModule,
  deleteLearningModule,
} from "./db";
import { getAvailableTools, getAvailableTools as _getTools } from "./agents";
import { runAgentCycle } from "./agents/agent-loop";
import { executeRegisteredTool } from "./tools/executor";
import type { ToolCall } from "./_core/llm";
import { resolveRuntimePolicy } from "./runtime/adaptive-policy";

// Conjunto de nomes de ferramentas disponíveis (usado no autodiagnóstico)
const _CLI_TOOL_NAMES: Set<string> = new Set(
  (_getTools() || [])
    .map((t: any) => t?.function?.name)
    .filter((n: any): n is string => typeof n === "string")
);


// ──────────────────────────────────────────────
// Tipos públicos
// ──────────────────────────────────────────────

export type AvaChannel = "cli" | "telegram" | "web";

export interface AvaRequestOptions {
  /** ID numérico do usuário — deve ser o mesmo entre todos os canais */
  userId: number;
  /** Provedor LLM a ser usado */
  provider: "gemini" | "ollama" | "groq" | "forge";
  /** Modelo específico (opcional) */
  model?: string;
  /** Canal de origem — usado para rastreabilidade */
  channel: AvaChannel;
  /** Se true, pula confirmação humana em tools de risco médio */
  autoConfirm?: boolean;
}

export interface AvaRequestResult {
  response: string;
  toolCalls: number;
  status: "completed" | "aborted" | "error";
  channel: AvaChannel;
  durationMs: number;
}

// ──────────────────────────────────────────────
// Helpers internos (espelhos dos usados no CLI)
// ──────────────────────────────────────────────

function coerceDate(value: unknown, field: string): Date {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value;
  if (typeof value === "number" && Number.isFinite(value)) {
    const d = new Date(value);
    if (!Number.isNaN(d.getTime())) return d;
  }
  if (typeof value === "string" && value.trim()) {
    const d = new Date(value.trim());
    if (!Number.isNaN(d.getTime())) return d;
  }
  throw new Error(`Campo '${field}' com data/hora invalida.`);
}

function decodeHtmlEntities(input: string): string {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#(\d+);/g, (_, d) => {
      const code = Number(d);
      return Number.isFinite(code) ? String.fromCharCode(code) : "";
    });
}

function stripHtmlToText(html: string): string {
  return decodeHtmlEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--([\s\S]*?)-->/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
  ).trim();
}

function extractLinks(html: string, baseUrl: string, max = 20): string[] {
  const links: string[] = [];
  const regex = /<a[^>]*href=["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = regex.exec(html)) !== null && links.length < max) {
    const raw = String(m[1] || "").trim();
    if (!raw || raw.startsWith("#") || raw.startsWith("javascript:")) continue;
    try {
      const absolute = new URL(raw, baseUrl).toString();
      if (!links.includes(absolute)) links.push(absolute);
    } catch {
      // ignora links invalidos
    }
  }
  return links;
}

function truncateToolOutput(text: string, max = 12000): string {
  const clean = String(text || "").trim();
  if (clean.length <= max) return clean;
  return `${clean.slice(0, max)}\n\n...[saida truncada para evitar estouro de contexto]`;
}

async function logAuditUnified(
  channel: AvaChannel,
  action: string,
  details: string
): Promise<void> {
  const logPath = path.resolve(process.cwd(), "data", "ava-unified-audit.log");
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] [${channel.toUpperCase()}] ${action} | ${details}\n`;
  try {
    await fs.mkdir(path.dirname(logPath), { recursive: true });
    await fs.appendFile(logPath, entry, "utf-8");
  } catch {
    // Falha silenciosa para não derrubar a execução
  }
}

// ──────────────────────────────────────────────
// Executor de tools — reutilizado em todos os canais
// ──────────────────────────────────────────────

export async function buildUnifiedExecuteTool(userId: number) {
  return async (
    toolCall: ToolCall,
    args: Record<string, unknown>
  ): Promise<{ output: string; ok: boolean }> => {
    const name = toolCall.function.name;

    // ─── Tools de sistema registradas ───
    if (
      name === "file_ops" ||
      name === "http_ops" ||
      name === "memory_ops" ||
      name === "db_ops" ||
      name === "ingest_ops"
    ) {
      return { output: truncateToolOutput(await executeRegisteredTool(name, args)), ok: true };
    }

    // ─── Compatibilidade legado: buscar_na_memoria -> memory_ops.search ───
    if (name === "buscar_na_memoria") {
      const palavras = Array.isArray(args.palavras_chave)
        ? args.palavras_chave.map((item) => String(item || "").trim()).filter(Boolean)
        : [String(args.palavras_chave || "").trim()].filter(Boolean);
      const query = palavras.join(" ").trim();
      if (!query) {
        return { output: "Nenhuma palavra-chave informada para buscar_na_memoria.", ok: false };
      }

      const output = await executeRegisteredTool("memory_ops", {
        action: "search",
        userId,
        query,
      });
      return { output: truncateToolOutput(output), ok: true };
    }

    // ─── Compatibilidade legado: salvar_na_memoria -> memory_ops.save ───
    if (name === "salvar_na_memoria") {
      const content = String(args.conteudo || args.content || "").trim();
      if (!content) {
        return { output: "Conteudo obrigatorio para salvar_na_memoria.", ok: false };
      }

      const output = await executeRegisteredTool("memory_ops", {
        action: "save",
        userId,
        content,
        keywords: typeof args.keywords === "string" ? args.keywords : undefined,
        type: typeof args.type === "string" ? args.type : "fact",
        ttlSeconds: Number(args.ttlSeconds || 0) || undefined,
      });
      return { output: truncateToolOutput(output), ok: true };
    }

    if (name === "listar_memoria") {
      const output = await executeRegisteredTool("memory_ops", {
        action: "list",
        userId,
        limit: Number(args.limit || 20),
      });
      return { output: truncateToolOutput(output), ok: true };
    }

    if (name === "explicar_memoria") {
      const query = String(args.query || args.consulta || "").trim();
      if (!query) {
        return { output: "Consulta obrigatoria para explicar_memoria.", ok: false };
      }
      const output = await executeRegisteredTool("memory_ops", {
        action: "explain",
        userId,
        query,
        limit: Number(args.limit || 5),
      });
      return { output: truncateToolOutput(output), ok: true };
    }

    if (name === "limpar_memorias_expiradas") {
      const output = await executeRegisteredTool("memory_ops", {
        action: "prune",
        userId,
      });
      return { output: truncateToolOutput(output), ok: true };
    }

    // ─── Data/hora ───
    if (name === "obter_data_hora") {
      return { output: new Date().toISOString(), ok: true };
    }

    // ─── Auto-diagnóstico ───
    if (name === "autodiagnostico_ava") {
      const toolNames = Array.from(_CLI_TOOL_NAMES.values()).sort();
      const categories: Record<string, number> = {};
      for (const n of toolNames) {
        const cat = n.includes("arquivo") || n.includes("pasta") || n.includes("sistema_de_arquivo")
          ? "filesystem" : n.includes("git_") ? "git"
          : n.includes("cofre") || n.includes("vault") ? "vault"
          : n.includes("web") || n.includes("pagina") ? "web"
          : n.includes("lembrete") || n.includes("agenda") ? "scheduling"
          : n.includes("diagnostico") ? "self-awareness" : "general";
        categories[cat] = (categories[cat] || 0) + 1;
      }
      const catText = Object.entries(categories).map(([k, v]) => `${k}:${v}`).join(", ");
      const report = [
        `Autodiagnostico AVA (${new Date().toLocaleString("pt-BR")})`,
        `- Canal: unified-engine`,
        `- Ferramentas ativas: ${toolNames.length} (${catText})`,
        `- AgentLoopV2: ${process.env.AVA_AGENT_LOOP_V2 || "false"}`,
        `- Provedor configurado: ${process.env.LLM_PROVIDER || "ollama"}`,
        `- userId: ${userId}`,
        `- Workspace: ${process.cwd()}`,
      ].join("\n");
      return { output: report, ok: true };
    }

    // ─── Git status ───
    if (name === "git_status") {
      const { execFile } = await import("node:child_process");
      const { promisify } = await import("node:util");
      const execFileAsync = promisify(execFile);
      try {
        const { stdout, stderr } = await execFileAsync("git", ["status", "--porcelain", "-b"], {
          cwd: process.cwd(), timeout: 15000, windowsHide: true,
        });
        return { output: (stdout || stderr || "git status executado.").trim(), ok: true };
      } catch (err: any) {
        return { output: `git status falhou: ${err?.message || err}`, ok: false };
      }
    }

    // ─── Busca web via DuckDuckGo ───
    if (name === "buscar_web" || name === "busrar_web") {
      const query = String(args.query || args.consulta || "").trim();
      const limit = Math.max(1, Math.min(10, Number(args.limit || args.limite || 5)));
      if (!query) return { output: "Consulta obrigatoria para buscar_web.", ok: false };
      const endpoint = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
      const res = await fetch(endpoint, {
        headers: { "User-Agent": "AVA-UnifiedEngine/1.0" },
        signal: AbortSignal.timeout(20000),
      });
      if (!res.ok) return { output: `DuckDuckGo indisponivel (HTTP ${res.status}).`, ok: false };
      const html = await res.text();
      const linkRegex = /href="\/\/duckduckgo\.com\/l\/\?[^"]*uddg=([^"&]+)[^"]*"[^>]*>([^<]+)/g;
      const items: string[] = [];
      let m: RegExpExecArray | null;
      while ((m = linkRegex.exec(html)) !== null && items.length < limit) {
        try {
          items.push(`${items.length + 1}. ${decodeURIComponent(m[1])}`);
        } catch { /* skip */ }
      }
      return { output: items.length > 0 ? items.join("\n") : "Sem resultados encontrados.", ok: true };
    }

    // ─── Navegação web simples (sem browser headless) ───
    if (name === "navegar_pagina") {
      const url = String(args.url || "").trim();
      const maxChars = Math.max(500, Math.min(12000, Number(args.max_chars || 8000)));
      if (!/^https?:\/\//i.test(url)) {
        return { output: "URL invalida para navegar_pagina.", ok: false };
      }

      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "AVA-UnifiedEngine/1.0",
            Accept: "text/html,application/xhtml+xml",
          },
          signal: AbortSignal.timeout(25000),
        });
        if (!res.ok) return { output: `Falha ao navegar pagina (HTTP ${res.status}).`, ok: false };
        const html = await res.text();
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = decodeHtmlEntities((titleMatch?.[1] || "").replace(/\s+/g, " ").trim()) || "(sem titulo)";
        const text = stripHtmlToText(html).slice(0, maxChars);
        return {
          output: `Titulo: ${title}\nURL: ${url}\n\n${text || "Sem conteudo textual extraivel."}`,
          ok: true,
        };
      } catch (err: any) {
        return { output: `Erro em navegar_pagina: ${err?.message || err}`, ok: false };
      }
    }

    // ─── Extração estruturada de página ───
    if (name === "extrair_conteudo_estruturado") {
      const url = String(args.url || "").trim();
      const maxChars = Math.max(500, Math.min(12000, Number(args.max_chars || 6000)));
      if (!/^https?:\/\//i.test(url)) {
        return { output: "URL invalida para extrair_conteudo_estruturado.", ok: false };
      }

      try {
        const res = await fetch(url, {
          headers: {
            "User-Agent": "AVA-UnifiedEngine/1.0",
            Accept: "text/html,application/xhtml+xml",
          },
          signal: AbortSignal.timeout(25000),
        });
        if (!res.ok) {
          return { output: `Falha na extracao estruturada (HTTP ${res.status}).`, ok: false };
        }
        const html = await res.text();
        const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
        const title = decodeHtmlEntities((titleMatch?.[1] || "").replace(/\s+/g, " ").trim()) || "(sem titulo)";
        const body = stripHtmlToText(html).slice(0, maxChars);
        const links = extractLinks(html, url, 20);

        return {
          output: JSON.stringify(
            {
              url,
              title,
              content: body,
              links,
            },
            null,
            2
          ),
          ok: true,
        };
      } catch (err: any) {
        return { output: `Erro em extrair_conteudo_estruturado: ${err?.message || err}`, ok: false };
      }
    }

    // ─── Leitura de arquivo ───
    if (name === "ler_arquivo" || name === "ler_codigo_fonte") {
      const filePath = String(args.caminho || args.path || "").trim();
      if (!filePath) return { output: "Caminho obrigatorio para ler_arquivo.", ok: false };
      try {
        const resolved = path.isAbsolute(filePath) ? filePath : path.resolve(process.cwd(), filePath);
        const content = await fs.readFile(resolved, "utf-8");
        return { output: content.slice(0, 8000), ok: true };
      } catch (err: any) {
        return { output: `Erro ao ler arquivo: ${err?.message || err}`, ok: false };
      }
    }

    // ─── Busca RAG documentos ───
    if (name === "buscar_documentos_rag") {
      const { searchDocumentChunks } = await import("./db");
      const query = String(args.query || args.consulta || "").trim();
      const limit = Math.max(1, Math.min(20, Number(args.limite || args.limit || 5)));
      if (!query) return { output: "Consulta obrigatoria para buscar_documentos_rag.", ok: false };
      const results = await searchDocumentChunks(userId, query, limit);
      if (!results || results.length === 0)
        return { output: "Nenhum documento encontrado para esta consulta.", ok: true };
      const formatted = results
        .map((r: any, i: number) =>
          `${i + 1}. [${r.documentName || "doc"}] (score: ${(r.score || 0).toFixed(2)})\n${String(r.content || "").slice(0, 400)}`
        )
        .join("\n\n");
      return { output: `Resultados RAG (${results.length}):\n\n${formatted}`, ok: true };
    }


    // ─── Lembretes ───
    if (name === "criar_lembrete") {
      const mensagem = String(args.mensagem || "").trim();
      if (!mensagem) throw new Error("'mensagem' e obrigatoria para criar lembrete.");
      const minutos =
        args.minutos_daqui !== undefined ? Number(args.minutos_daqui) : undefined;
      const horario = args.horario ? String(args.horario).trim() : "";
      const recorrencia = args.recorrencia ? String(args.recorrencia).trim() : null;
      let nextRun = new Date();
      if (minutos !== undefined) {
        if (!Number.isFinite(minutos) || minutos <= 0)
          throw new Error("'minutos_daqui' deve ser um numero positivo.");
        nextRun = new Date(Date.now() + Math.round(minutos) * 60 * 1000);
      } else if (horario) {
        if (horario.includes(":")) {
          const [hRaw, mRaw] = horario.split(":");
          const h = Number(hRaw),
            m = Number(mRaw);
          nextRun = new Date();
          nextRun.setHours(h, m, 0, 0);
          if (nextRun.getTime() <= Date.now())
            nextRun = new Date(nextRun.getTime() + 24 * 60 * 60 * 1000);
        } else {
          nextRun = coerceDate(horario, "horario");
        }
      }
      await createProactiveTask(userId, {
        title: `Lembrete: ${mensagem}`,
        description: mensagem,
        type: "watcher",
        status: "active",
        schedule: recorrencia,
        nextRun,
      });
      return {
        output: `Lembrete criado para ${nextRun.toLocaleString("pt-BR")}${recorrencia ? ` (recorrencia: ${recorrencia})` : ""}.`,
        ok: true,
      };
    }

    if (name === "listar_lembretes") {
      const statusFilter = args.status ? String(args.status).trim() : "";
      const limit =
        args.limite !== undefined ? Math.max(1, Math.min(50, Number(args.limite))) : 20;
      const reminders = await getProactiveTasks(userId);
      const filtered = reminders
        .filter((t: any) => !statusFilter || t.status === statusFilter)
        .sort(
          (a: any, b: any) =>
            (a.nextRun ? new Date(a.nextRun).getTime() : 0) -
            (b.nextRun ? new Date(b.nextRun).getTime() : 0)
        )
        .slice(0, limit);
      if (filtered.length === 0) return { output: "Nenhum lembrete encontrado.", ok: true };
      return {
        output: filtered
          .map(
            (t: any, i: number) =>
              `${i + 1}. [${t.status}] ${t.title} | proximo: ${t.nextRun ? new Date(t.nextRun).toLocaleString("pt-BR") : "sem agendamento"}`
          )
          .join("\n"),
        ok: true,
      };
    }

    // ─── Agenda ───
    if (name === "gerenciar_agenda") {
      const action = String(args.acao || "").trim().toLowerCase();
      if (action === "criar") {
        const data = (args.dados || {}) as any;
        const title = String(data.title || "").trim();
        if (!title) throw new Error("'dados.title' e obrigatorio.");
        const startDate = coerceDate(data.startTime ?? data.start_time, "dados.startTime");
        const endDate = coerceDate(data.endTime ?? data.end_time, "dados.endTime");
        await createAppointment(userId, {
          title,
          description: data.description ? String(data.description) : null,
          startTime: startDate,
          endTime: endDate,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          location: data.location ? String(data.location) : null,
          type: data.type || "other",
          reminderMinutes:
            data.reminderMinutes !== undefined ? Number(data.reminderMinutes) : null,
          recurrenceRule: data.recurrenceRule ? String(data.recurrenceRule) : null,
          participants: data.participants ? JSON.stringify(data.participants) : null,
          customerId: data.customerId !== undefined ? Number(data.customerId) : null,
          isCompleted: Number(data.isCompleted || 0),
          status: data.status || "scheduled",
          updatedAt: new Date(),
        });
        return {
          output: `Compromisso criado para ${startDate.toLocaleString("pt-BR")}.`,
          ok: true,
        };
      }
      return { output: "Ação não implementada. Use acao='criar'.", ok: false };
    }

    // ─── Mentor Socrático ───
    if (name === "iniciar_sessao_estudo") {
      const assunto = String(args.assunto || "").trim();
      const due = await getDueReviews(userId);
      if (due.length > 0) {
        const topicos = due
          .slice(0, 3)
          .map(
            (t: any) =>
              `- [${t.status}] ${t.topic} (domínio: ${t.masteryLevel}%)`
          )
          .join("\n");
        return {
          output: `Olá! Você tem ${due.length} tópico(s) com revisão pendente. Onde o foco vai, a energia flui!\n${topicos}\n\nResponda com o ID do tópico para iniciar a revisão ou informe um novo assunto.`,
          ok: true,
        };
      }
      if (!assunto)
        return {
          output:
            "Qual assunto você deseja estudar hoje? (Ex: 'Arquitetura MVC em PHP', 'Kant', 'Direito Constitucional')",
          ok: true,
        };
      const modulo = await createLearningModule(userId, {
        subject: assunto,
        sourceReference: args.fonte ? String(args.fonte) : null,
        sourceType: args.tipo_fonte ? (String(args.tipo_fonte) as any) : "manual",
        description: args.descricao ? String(args.descricao) : null,
      });
      const topico = await createLearningTopic(userId, {
        moduleId: modulo.id,
        topic: `Introdução a ${assunto}`,
        status: "learning",
      });
      return {
        output: `✨ Sessão de estudo iniciada! Módulo criado: "${assunto}" (ID ${modulo.id}). Primeiro tópico: Introdução (ID ${topico.id}).\n\nAntes de começar: o que já sabe sobre "${assunto}"?`,
        ok: true,
      };
    }

    if (name === "atualizar_progresso_estudo") {
      const progressId = Number(args.progresso_id);
      const resultado = String(args.resultado || "").trim() as "correct" | "incorrect";
      if (!progressId || !Number.isFinite(progressId))
        throw new Error("'progresso_id' inválido.");
      if (resultado !== "correct" && resultado !== "incorrect")
        throw new Error("'resultado' deve ser 'correct' ou 'incorrect'.");
      const forcas = args.forcas
        ? Array.isArray(args.forcas)
          ? args.forcas
          : [String(args.forcas)]
        : undefined;
      const fraquezas = args.fraquezas
        ? Array.isArray(args.fraquezas)
          ? args.fraquezas
          : [String(args.fraquezas)]
        : undefined;
      const progresso = await updateLearningProgress(progressId, resultado, forcas, fraquezas);
      const mensagem =
        resultado === "correct"
          ? progresso.feynmanUnlocked
            ? `🏆 Domínio MASTER (${progresso.masteryLevel}%)! Modo Feynman desbloqueado.`
            : `✅ Domínio atualizado: ${progresso.masteryLevel}%. Próxima revisão em ${progresso.intervalDays} dia(s).`
          : `💪 Domínio atual: ${progresso.masteryLevel}%. Continue praticando!`;
      return { output: mensagem, ok: true };
    }

    if (name === "criar_desafio_pratico") {
      const linguagem = String(args.linguagem || "typescript").trim();
      const descricao = String(args.descricao || "exercicio de programacao").trim();
      const nomeArq = `desafio_${Date.now()}.${linguagem === "javascript" ? "js" : linguagem === "php" ? "php" : "ts"}`;
      const desktopPath = path.join(os.homedir(), "Desktop", nomeArq);
      const conteudo =
        String(args.codigo_base || "").trim() ||
        `// Desafio: ${descricao}\n// Linguagem: ${linguagem}\n`;
      await fs.writeFile(desktopPath, conteudo, "utf-8");
      return {
        output: `📡 Desafio criado na Área de Trabalho: "${nomeArq}"\nMissão: ${descricao}`,
        ok: true,
      };
    }

    if (name === "gerenciar_modulo") {
      const acao = String(args.acao || "").trim().toLowerCase();
      const moduleId = args.modulo_id !== undefined ? Number(args.modulo_id) : 0;
      if (acao === "listar") {
        const modulos = await getLearningModules(userId);
        if (modulos.length === 0)
          return { output: "Nenhum módulo encontrado. Use 'iniciar_sessao_estudo'.", ok: true };
        const lista = modulos
          .map((m: any, i: number) => {
            const bar =
              "█".repeat(
                Math.floor((m.masteredTopics / Math.max(m.totalTopics, 1)) * 10)
              ) +
              "░".repeat(
                10 - Math.floor((m.masteredTopics / Math.max(m.totalTopics, 1)) * 10)
              );
            return `${i + 1}. [${m.status.toUpperCase()}] #${m.id} "${m.subject}" | ${bar} ${m.masteredTopics}/${m.totalTopics}`;
          })
          .join("\n");
        return { output: `📚 Módulos de Estudo:\n\n${lista}`, ok: true };
      }
      if (acao === "pausar") {
        if (!moduleId) throw new Error("'modulo_id' é obrigatório.");
        const res = await pauseLearningModule(userId, moduleId);
        return { output: `⏸️ ${res.message}`, ok: true };
      }
      if (acao === "retomar") {
        if (!moduleId) throw new Error("'modulo_id' é obrigatório.");
        const res = await resumeLearningModule(userId, moduleId);
        return { output: `▶️ ${res.message}`, ok: true };
      }
      if (acao === "abandonar") {
        if (!moduleId) throw new Error("'modulo_id' é obrigatório.");
        const modulo = await getLearningModuleById(userId, moduleId);
        if (!modulo) return { output: `Módulo #${moduleId} não encontrado.`, ok: false };
        const res = await deleteLearningModule(userId, moduleId);
        return { output: `🗑️ Módulo "${modulo.subject}" removido. ${res.message}`, ok: true };
      }
      if (acao === "progresso") {
        if (!moduleId) throw new Error("'modulo_id' é obrigatório.");
        const topicos = await getLearningProgress(userId, moduleId);
        if (topicos.length === 0)
          return { output: "Nenhum tópico neste módulo.", ok: true };
        const lista = topicos
          .map((t: any, i: number) => {
            const prox = t.nextReviewDate
              ? new Date(t.nextReviewDate).toLocaleDateString("pt-BR")
              : "sem revisão";
            const feynman = t.feynmanUnlocked ? " 🏆 FEYNMAN" : "";
            return `${i + 1}. #${t.id} [${t.status}] ${t.topic} | domínio: ${t.masteryLevel}% | próx: ${prox}${feynman}`;
          })
          .join("\n");
        return { output: `📊 Progresso:\n\n${lista}`, ok: true };
      }
      return { output: "Acao inválida. Use: listar | pausar | retomar | abandonar | progresso", ok: false };
    }

    // ─── Fallback para tools não mapeadas ───
    return {
      output:
        "Ferramenta não mapeada no motor unificado. Verifique a configuração do canal.",
      ok: false,
    };
  };
}

// ──────────────────────────────────────────────
// Função principal — processAvaRequest
// ──────────────────────────────────────────────

/**
 * Processa uma requisição AVA de qualquer canal (CLI, Telegram, Web).
 * Usa o AgentLoopV2 quando `AVA_AGENT_LOOP_V2=true` (recomendado).
 */
export async function processAvaRequest(
  query: string,
  options: AvaRequestOptions
): Promise<AvaRequestResult> {
  const startedAt = Date.now();
  const { userId, provider, model, channel, autoConfirm } = options;

  // Garantir DB inicializado
  await getDb();

  await logAuditUnified(channel, "REQUEST_START", `query=${query.slice(0, 120)}`);

  try {
    const runtimePolicy = resolveRuntimePolicy({ provider, model });
    process.env.AVA_PROACTIVE_MODE_EFFECTIVE = runtimePolicy.proactiveMode;
    await logAuditUnified(
      channel,
      "RUNTIME_POLICY",
      `timeout=${runtimePolicy.llmTimeoutMs} mode=${runtimePolicy.proactiveMode} ${runtimePolicy.timeoutReason}`
    );

    const executeTool = await buildUnifiedExecuteTool(userId);
    const useV2 =
      String(process.env.AVA_AGENT_LOOP_V2 || "false").toLowerCase() === "true";

    if (useV2) {
      const cycle = await runAgentCycle(query, {
        userId,
        provider,
        model,
        timeoutMs: runtimePolicy.llmTimeoutMs,
        maxCycles: runtimePolicy.maxCycles,
        maxToolCalls: runtimePolicy.maxToolCalls,
        tools: getAvailableTools(),
        executeTool,
        requireConfirmation: async () => Boolean(autoConfirm),
      });

      // Persistir interação na memória unificada com metadado de canal
      await addMemoryEntry(
        userId,
        `[canal:${channel}] ${query.slice(0, 200)}`,
        `canal,${channel},agentloop`,
        "context"
      );

      await logAuditUnified(
        channel,
        "REQUEST_DONE",
        `status=${cycle.status} toolCalls=${cycle.toolCalls} durationMs=${Date.now() - startedAt} mode=${runtimePolicy.proactiveMode} tier=${runtimePolicy.tier}`
      );

      return {
        response: cycle.finalResponse,
        toolCalls: cycle.toolCalls,
        status: cycle.status,
        channel,
        durationMs: Date.now() - startedAt,
      };
    }

    // Fallback: resposta simples sem AgentLoopV2
    return {
      response:
        "AVA_AGENT_LOOP_V2 desabilitado. Defina AVA_AGENT_LOOP_V2=true no .env para usar o motor unificado.",
      toolCalls: 0,
      status: "aborted",
      channel,
      durationMs: Date.now() - startedAt,
    };
  } catch (err: any) {
    const msg = String(err?.message || err || "Erro desconhecido");
    await logAuditUnified(channel, "REQUEST_ERROR", msg.slice(0, 300));
    return {
      response: `Erro interno no processamento: ${msg}`,
      toolCalls: 0,
      status: "error",
      channel,
      durationMs: Date.now() - startedAt,
    };
  }
}
