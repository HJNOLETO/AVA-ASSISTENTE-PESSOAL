import "dotenv/config";
import path from "node:path";
import { promises as fs } from "node:fs";
import { asc, eq } from "drizzle-orm";
import { users } from "../drizzle/schema";
import { invokeLLM } from "../server/_core/llm";
import { addMemoryEntry, getDb } from "../server/db";

type AnalysisResult = {
  title: string;
  summary: string;
  topics: string[];
  keyPoints: string[];
  deepDiveQuestions: string[];
  claimsToVerify: Array<{ claim: string; missingData: string; suggestedSource: string }>;
  lawsMentioned: Array<{ law: string; context: string; action: string }>;
  pendingItems: string[];
  confidence: "low" | "medium" | "high";
  notes?: string;
};

function parseArgs() {
  const args = process.argv.slice(2);
  const values: Record<string, string | boolean> = {};

  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (!token.startsWith("--")) continue;
    const key = token.slice(2);
    const next = args[i + 1];
    if (!next || next.startsWith("--")) {
      values[key] = true;
    } else {
      values[key] = next;
      i += 1;
    }
  }

  const filePath = typeof values.file === "string" ? path.resolve(values.file) : "";
  if (!filePath) throw new Error("Use --file <caminho-do-arquivo>");

  return {
    filePath,
    model: typeof values.model === "string" ? values.model : "qwen2.5:7b-instruct",
    provider: (typeof values.provider === "string" && values.provider === "forge" ? "forge" : "ollama") as
      | "ollama"
      | "forge",
    importMemory: values["import-memory"] === true,
    userId: typeof values["user-id"] === "string" ? Number(values["user-id"]) : undefined,
  };
}

async function resolveUserId(cliUserId?: number): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponivel.");

  if (cliUserId) {
    const found = await db.select().from(users).where(eq(users.id, cliUserId)).limit(1);
    if (!found[0]) throw new Error(`Usuario ${cliUserId} nao encontrado.`);
    return cliUserId;
  }

  const first = await db.select().from(users).orderBy(asc(users.id)).limit(1);
  if (!first[0]) throw new Error("Nenhum usuario encontrado no banco.");
  return first[0].id;
}

function parseTitle(content: string, fallback: string): string {
  const line = content
    .split(/\r?\n/)
    .find((l) => l.toLowerCase().includes("titulo") || l.toLowerCase().includes("title"));
  if (!line) return fallback;
  return line.replace(/^.*?:\s*/, "").trim() || fallback;
}

function detectTranscriptError(content: string): { hasError: boolean; reason?: string; videoId?: string } {
  const normalized = content.toLowerCase();
  const hasError =
    normalized.includes("erro ao extrair transcri") ||
    normalized.includes("could not retrieve a transcript") ||
    normalized.includes("invalid video id");

  let videoId = "";
  const liveMatch = content.match(/youtube\.com\/live\/([a-zA-Z0-9_-]{6,})/i);
  const watchMatch = content.match(/[?&]v=([a-zA-Z0-9_-]{6,})/i);
  if (liveMatch?.[1]) videoId = liveMatch[1];
  if (!videoId && watchMatch?.[1]) videoId = watchMatch[1];

  return {
    hasError,
    reason: hasError ? "Transcricao nao foi extraida. O arquivo contem mensagem de erro da API." : undefined,
    videoId: videoId || undefined,
  };
}

function fallbackFromError(title: string, reason: string, videoId?: string): AnalysisResult {
  const pending = [
    "Refazer extracao da transcricao com o video id correto (nao usar URL completa).",
    "Salvar transcricao completa e revisar se ha marcacao de tempo por bloco.",
    "Rodar analise novamente para gerar pontos de aprofundamento.",
  ];
  if (videoId) {
    pending.unshift(`Video id detectado para teste: ${videoId}`);
  }

  return {
    title,
    summary: "Nao foi possivel analisar o jornal porque a transcricao nao foi carregada corretamente.",
    topics: ["pendencia de coleta", "transcricao ausente"],
    keyPoints: [reason],
    deepDiveQuestions: [
      "Quais temas economicos foram abordados no episodio?",
      "Quais leis, indicadores e comparacoes historicas foram citados?",
    ],
    claimsToVerify: [
      {
        claim: "Nao ha claims verificaveis porque o texto e erro tecnico.",
        missingData: "Transcricao completa do episodio.",
        suggestedSource: "YouTube transcript/manual + fonte oficial dos temas citados.",
      },
    ],
    lawsMentioned: [],
    pendingItems: pending,
    confidence: "low",
    notes: "Assim que a transcricao real existir, rode novamente o script.",
  };
}

async function llmAnalyze(title: string, content: string, provider: "ollama" | "forge", model: string): Promise<AnalysisResult> {
  const prompt = [
    "Voce e um analista de conhecimento para memoria de estudo.",
    "Analise a transcricao e retorne APENAS JSON valido.",
    "Objetivo: destacar assuntos, pontos para aprofundamento e pendencias de dados/leis faltantes.",
    "Campos obrigatorios do JSON:",
    "title (string), summary (string), topics (array string), keyPoints (array string), deepDiveQuestions (array string),",
    "claimsToVerify (array de objetos com claim, missingData, suggestedSource),",
    "lawsMentioned (array de objetos com law, context, action), pendingItems (array string), confidence (low|medium|high), notes (string opcional).",
    "Regras:",
    "- Se citar indicador sem comparativo (ex.: PIB sem periodo completo), gerar pendencia explicita.",
    "- Se citar lei sem detalhes, gerar pendencia para buscar texto legal e status (vigente/revogada).",
    "- Priorizar perguntas praticas de aprofundamento.",
    `Titulo: ${title}`,
    "Transcricao (trecho):",
    content.slice(0, 30000),
  ].join("\n");

  const result = await invokeLLM({
    provider,
    model,
    messages: [{ role: "user", content: prompt }],
    response_format: { type: "json_object" },
    timeoutMs: 180000,
  });

  const llmContent = result.choices?.[0]?.message?.content;
  const text = typeof llmContent === "string" ? llmContent : JSON.stringify(llmContent || {});
  const parsed = JSON.parse(text || "{}");

  const out: AnalysisResult = {
    title: String(parsed.title || title),
    summary: String(parsed.summary || ""),
    topics: Array.isArray(parsed.topics) ? parsed.topics.map((x: unknown) => String(x)) : [],
    keyPoints: Array.isArray(parsed.keyPoints) ? parsed.keyPoints.map((x: unknown) => String(x)) : [],
    deepDiveQuestions: Array.isArray(parsed.deepDiveQuestions)
      ? parsed.deepDiveQuestions.map((x: unknown) => String(x))
      : [],
    claimsToVerify: Array.isArray(parsed.claimsToVerify)
      ? parsed.claimsToVerify.map((x: any) => ({
          claim: String(x?.claim || ""),
          missingData: String(x?.missingData || ""),
          suggestedSource: String(x?.suggestedSource || ""),
        }))
      : [],
    lawsMentioned: Array.isArray(parsed.lawsMentioned)
      ? parsed.lawsMentioned.map((x: any) => ({
          law: String(x?.law || ""),
          context: String(x?.context || ""),
          action: String(x?.action || ""),
        }))
      : [],
    pendingItems: Array.isArray(parsed.pendingItems) ? parsed.pendingItems.map((x: unknown) => String(x)) : [],
    confidence:
      parsed.confidence === "high" || parsed.confidence === "medium" || parsed.confidence === "low"
        ? parsed.confidence
        : "medium",
    notes: parsed.notes ? String(parsed.notes) : undefined,
  };

  return out;
}

function toMarkdown(result: AnalysisResult, sourceFile: string): string {
  const lines: string[] = [];
  lines.push(`# Analise de Memoria - ${result.title}`);
  lines.push("");
  lines.push(`Fonte: ${sourceFile}`);
  lines.push("");
  lines.push("## Resumo");
  lines.push(result.summary || "(sem resumo)");
  lines.push("");
  lines.push("## Assuntos Abordados");
  for (const t of result.topics) lines.push(`- ${t}`);
  lines.push("");
  lines.push("## Pontos-Chave");
  for (const p of result.keyPoints) lines.push(`- ${p}`);
  lines.push("");
  lines.push("## Perguntas para Aprofundamento");
  for (const q of result.deepDiveQuestions) lines.push(`- ${q}`);
  lines.push("");
  lines.push("## Claims para Verificacao");
  for (const c of result.claimsToVerify) {
    lines.push(`- Claim: ${c.claim}`);
    lines.push(`  - Dado faltante: ${c.missingData}`);
    lines.push(`  - Fonte sugerida: ${c.suggestedSource}`);
  }
  lines.push("");
  lines.push("## Leis Citadas e Acao");
  for (const l of result.lawsMentioned) {
    lines.push(`- Lei: ${l.law}`);
    lines.push(`  - Contexto: ${l.context}`);
    lines.push(`  - Acao: ${l.action}`);
  }
  lines.push("");
  lines.push("## Pendencias");
  for (const p of result.pendingItems) lines.push(`- ${p}`);
  lines.push("");
  lines.push(`Confianca da analise: ${result.confidence}`);
  if (result.notes) {
    lines.push("");
    lines.push(`Observacao: ${result.notes}`);
  }
  return lines.join("\n");
}

async function run() {
  const args = parseArgs();
  const raw = await fs.readFile(args.filePath, "utf-8");
  const baseName = path.basename(args.filePath, path.extname(args.filePath));
  const title = parseTitle(raw, baseName);

  const check = detectTranscriptError(raw);
  const result = check.hasError
    ? fallbackFromError(title, check.reason || "Erro desconhecido de transcricao", check.videoId)
    : await llmAnalyze(title, raw, args.provider, args.model);

  const outDir = path.join(path.dirname(args.filePath), "analises-jornal");
  await fs.mkdir(outDir, { recursive: true });

  const jsonPath = path.join(outDir, `${baseName}.analysis.json`);
  const mdPath = path.join(outDir, `${baseName}.analysis.md`);

  await fs.writeFile(jsonPath, JSON.stringify(result, null, 2), "utf-8");
  await fs.writeFile(mdPath, toMarkdown(result, path.basename(args.filePath)), "utf-8");

  if (args.importMemory) {
    const userId = await resolveUserId(args.userId);
    const memoryMain = [
      `[JORNAL] ${result.title}`,
      `Resumo: ${result.summary}`,
      `Assuntos: ${result.topics.join(", ")}`,
      `Pontos-chave: ${result.keyPoints.join(" | ")}`,
    ].join("\n");

    const memoryPending = [
      `[JORNAL][PENDENCIAS] ${result.title}`,
      ...result.pendingItems.map((p) => `- ${p}`),
      ...result.claimsToVerify.map((c) => `- Verificar: ${c.claim} | faltante: ${c.missingData}`),
      ...result.lawsMentioned.map((l) => `- Lei citada: ${l.law} | acao: ${l.action}`),
    ].join("\n");

    await addMemoryEntry(userId, memoryMain, "jornal, analise, resumo", "context");
    await addMemoryEntry(userId, memoryPending, "jornal, pendencia, verificacao, lei", "context");
  }

  console.log(`[JournalPrep] Analise salva em: ${jsonPath}`);
  console.log(`[JournalPrep] Relatorio salvo em: ${mdPath}`);
  if (check.hasError) {
    console.log("[JournalPrep] Aviso: arquivo contem erro de transcricao; pendencias geradas.");
  }
}

run().catch((error) => {
  console.error("[JournalPrep] Falha:", error);
  process.exitCode = 1;
});
