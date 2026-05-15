import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });
import fs from "fs/promises";
import { getDocumentsRAG } from "./db";
import { searchRelevantChunks } from "./rag";
import { invokeLLM } from "./_core/llm";
import { processAvaRequest } from "./unified-engine";
import { runAutonomousHostCleanup } from "./hostMaintenance";
import { ensurePersonalRoutine } from "./personalRoutine";

type TelegramUpdate = {
  update_id: number;
  message?: {
    chat: { id: number };
    text?: string;
    caption?: string;
    from?: { first_name?: string };
    photo?: Array<{ file_id: string; width: number; height: number }>;
  };
};

type BotState = {
  lastUpdateId: number;
  lastNotifiedUpdatedAt: number;
};

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || "";
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";
const TELEGRAM_STUDY_USER_ID = Number(process.env.TELEGRAM_STUDY_USER_ID || "0");
const TELEGRAM_NOTIFY_INTERVAL_MS = Number(process.env.TELEGRAM_NOTIFY_INTERVAL_MS || "300000");
const TELEGRAM_LOOKBACK_MINUTES = Number(process.env.TELEGRAM_LOOKBACK_MINUTES || "1440");
const LLM_PROVIDER = process.env.LLM_PROVIDER === "ollama" ? "ollama" : "forge";
const LLM_MODEL = process.env.TELEGRAM_STUDY_MODEL || process.env.OLLAMA_MODEL || undefined;
const TELEGRAM_TEXT_PROVIDER = (process.env.TELEGRAM_TEXT_PROVIDER || process.env.LLM_PROVIDER || "ollama").toLowerCase();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || "";
const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash";
const TELEGRAM_IMAGE_PROVIDER = (process.env.TELEGRAM_IMAGE_PROVIDER || "pollinations").toLowerCase();
const TELEGRAM_CAROUSEL_SLIDES = Number(process.env.TELEGRAM_CAROUSEL_SLIDES || "5");
const TELEGRAM_REQUEST_TIMEOUT_MS = Number(process.env.TELEGRAM_REQUEST_TIMEOUT_MS || "120000");

const statePath = path.join(process.cwd(), "data", "telegram-study-bot-state.json");
const lockPath = path.join(process.cwd(), "data", "telegram-study-bot.lock");

function buildCliAskCommand(rawQuery: string) {
  const safeQuery = rawQuery.replace(/"/g, '\\"');
  const provider = TELEGRAM_TEXT_PROVIDER === "gemini"
    ? "gemini"
    : TELEGRAM_TEXT_PROVIDER === "groq"
      ? "groq"
      : TELEGRAM_TEXT_PROVIDER === "ollama"
        ? "ollama"
        : "";

  const modelArg = provider === "gemini" && GEMINI_MODEL
    ? ` --model "${GEMINI_MODEL.replace(/"/g, '\\"')}"`
    : "";

  const providerArg = provider ? ` --provider ${provider}` : "";
  return `npx tsx cli/index.ts ask "${safeQuery}"${providerArg}${modelArg}`;
}

function formatExecError(err: unknown): string {
  const anyErr = err as { message?: string; stderr?: string; stdout?: string };
  const base = String(anyErr?.message || err || "Erro desconhecido");
  const stderr = String(anyErr?.stderr || "").trim();
  const stdout = String(anyErr?.stdout || "").trim();

  const details: string[] = [base];
  if (stderr) details.push(`stderr: ${stderr.slice(0, 800)}`);
  if (stdout) details.push(`stdout: ${stdout.slice(0, 800)}`);
  return details.join("\n");
}

function parseAllowedChatIds(raw: string): Set<string> {
  return new Set(
    String(raw || "")
      .split(/[;,\s]+/g)
      .map((v) => v.trim())
      .filter(Boolean)
  );
}

const ALLOWED_CHAT_IDS = parseAllowedChatIds(TELEGRAM_CHAT_ID);

function assertConfig() {
  if (!TELEGRAM_BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN nao configurado");
  }
  if (!Number.isFinite(TELEGRAM_STUDY_USER_ID) || TELEGRAM_STUDY_USER_ID <= 0) {
    throw new Error("TELEGRAM_STUDY_USER_ID deve ser um numero positivo");
  }
  // Etapa 2: Alertar se userId divergir entre canais (causa de memória fragmentada)
  const cliUserId = Number(process.env.AVA_CLI_USER_ID || "0");
  if (cliUserId > 0 && cliUserId !== TELEGRAM_STUDY_USER_ID) {
    console.warn(
      `[telegram-study-bot] ⚠️  AVISO: AVA_CLI_USER_ID (${cliUserId}) diferente de TELEGRAM_STUDY_USER_ID (${TELEGRAM_STUDY_USER_ID}). Isso causa memória fragmentada entre canais! Alinhe ambos no .env.`
    );
  }
}

function apiUrl(method: string) {
  return `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/${method}`;
}

async function readState(): Promise<BotState> {
  try {
    const content = await fs.readFile(statePath, "utf-8");
    const parsed = JSON.parse(content) as Partial<BotState>;
    return {
      lastUpdateId: Number(parsed.lastUpdateId || 0),
      lastNotifiedUpdatedAt: Number(parsed.lastNotifiedUpdatedAt || 0),
    };
  } catch {
    return { lastUpdateId: 0, lastNotifiedUpdatedAt: 0 };
  }
}

async function writeState(state: BotState) {
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await fs.writeFile(statePath, JSON.stringify(state, null, 2), "utf-8");
}

function isPidRunning(pid: number): boolean {
  try {
    process.kill(pid, 0);
    return true;
  } catch {
    return false;
  }
}

async function acquireSingleInstanceLock() {
  await fs.mkdir(path.dirname(lockPath), { recursive: true });

  let existingPid = 0;
  try {
    const existingRaw = await fs.readFile(lockPath, "utf-8");
    existingPid = Number(existingRaw.trim());
  } catch {
    // lock ausente ou invalido
  }

  if (Number.isFinite(existingPid) && existingPid > 0 && isPidRunning(existingPid)) {
    throw new Error(
      `Ja existe outra instancia ativa do telegramStudyBot (pid=${existingPid}). Finalize a instancia anterior antes de iniciar outra.`
    );
  }

  await fs.writeFile(lockPath, String(process.pid), "utf-8");
}

async function releaseSingleInstanceLock() {
  try {
    const current = await fs.readFile(lockPath, "utf-8");
    if (String(process.pid) === current.trim()) {
      await fs.unlink(lockPath);
    }
  } catch {
    // lock ja removido
  }
}

async function telegramGetUpdates(offset: number): Promise<TelegramUpdate[]> {
  const url = apiUrl("getUpdates");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ offset, timeout: 30, allowed_updates: ["message"] }),
  });
  if (!res.ok) {
    let errDesc = "";
    try {
      const errBody = await res.json();
      errDesc = errBody.description || errBody.error_code || "Unknown Error";
    } catch {
      errDesc = await res.text().catch(() => "");
    }
    throw new Error(`Telegram getUpdates falhou (HTTP ${res.status}) - ${errDesc}`);
  }

  const payload = (await res.json()) as { ok: boolean; result?: TelegramUpdate[] };
  if (!payload.ok) return [];
  return payload.result || [];
}

async function telegramDeleteWebhook(): Promise<void> {
  const url = apiUrl("deleteWebhook");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ drop_pending_updates: true })
  });
  if (res.ok) {
    console.log("[telegram-study-bot] Webhook do Telegram removido (prevenindo conflito 409).");
  } else {
    console.warn(`[telegram-study-bot] Falha ao remover webhook: HTTP ${res.status}`);
  }
}

function chunkMessage(text: string, size = 3900) {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += size) {
    chunks.push(text.slice(i, i + size));
  }
  return chunks;
}

export async function telegramSendMessage(chatId: string | number, text: string) {
  for (const part of chunkMessage(text)) {
    const res = await fetch(apiUrl("sendMessage"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: String(chatId),
        text: part,
      }),
    });
    if (!res.ok) {
      throw new Error(`Telegram sendMessage falhou (HTTP ${res.status})`);
    }
  }
}

async function telegramSendPhoto(chatId: string | number, photoUrl: string, caption?: string) {
  const res = await fetch(apiUrl("sendPhoto"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: String(chatId),
      photo: photoUrl,
      caption: caption ? caption.slice(0, 900) : undefined,
    }),
  });
  if (!res.ok) {
    throw new Error(`Telegram sendPhoto falhou (HTTP ${res.status})`);
  }
}

async function telegramSendMediaGroup(
  chatId: string | number,
  items: Array<{ photoUrl: string; caption?: string }>
) {
  const media = items.slice(0, 10).map((item, idx) => ({
    type: "photo",
    media: item.photoUrl,
    caption: idx === 0 && item.caption ? item.caption.slice(0, 900) : undefined,
  }));
  const res = await fetch(apiUrl("sendMediaGroup"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: String(chatId), media }),
  });
  if (!res.ok) {
    throw new Error(`Telegram sendMediaGroup falhou (HTTP ${res.status})`);
  }
}

function sanitizeUserText(input: string) {
  return input.trim().replace(/\s+/g, " ");
}

async function telegramGetFileUrl(fileId: string): Promise<string | null> {
  const url = apiUrl("getFile");
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ file_id: fileId }),
  });
  if (!res.ok) return null;
  const payload = await res.json() as any;
  if (!payload.ok || !payload.result?.file_path) return null;
  return `https://api.telegram.org/file/bot${TELEGRAM_BOT_TOKEN}/${payload.result.file_path}`;
}

async function invokeVisionModel(imageUrl: string, prompt: string): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY nao configurada para Visao.");
  const imgRes = await fetch(imageUrl);
  if (!imgRes.ok) throw new Error("Falha ao baixar imagem do Telegram");
  const buffer = await imgRes.arrayBuffer();
  const base64Image = Buffer.from(buffer).toString("base64");
  
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{
        parts: [
          { text: prompt },
          { inline_data: { mime_type: "image/jpeg", data: base64Image } }
        ]
      }]
    }),
  });
  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`Falha Gemini Vision HTTP ${res.status}: ${errText}`);
  }
  const payload = await res.json() as any;
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("Resposta de visão vazia");
  return text.trim();
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  let timer: NodeJS.Timeout | null = null;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timeout após ${timeoutMs}ms`)), timeoutMs);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    if (timer) clearTimeout(timer);
  }
}

function buildCloudModelHint(provider: string): string {
  const isCloudOllama = provider === "ollama" && String(LLM_MODEL || "").toLowerCase().includes("cloud");
  if (!isCloudOllama) return "";
  return "\n\nDica: o modelo cloud Ollama pode ter atingido limite/sessao. Se continuar sem responder, troque de conta cloud e tente novamente.";
}

async function buildContext(query: string, topK = 6) {
  const chunks = await searchRelevantChunks(query, TELEGRAM_STUDY_USER_ID, topK, {
    legalStatus: "vigente",
    minScore: 0.45,
  });
  return chunks;
}

async function answerWithRag(query: string) {
  const chunks = await buildContext(query, 8);
  if (chunks.length === 0) {
    const fallbackPrompt = [
      "Responda em portugues brasileiro, de forma didatica e objetiva.",
      "No fim, inclua: 'Base AVA: sem fontes indexadas para esta resposta'.",
      "Se houver incerteza, diga explicitamente.",
      "Pergunta do usuario:",
      query,
    ].join("\n");

    try {
      const generic = await invokeTextModel(fallbackPrompt, false);
      if (generic?.trim()) return generic.trim();
    } catch {
      // keep hard fallback below
    }

    return "Ainda nao ha fontes indexadas no AVA para este tema, mas posso ajudar com uma explicacao geral. Tente novamente em instantes.";
  }

  const context = chunks
    .map((c, i) => {
      const snippet = c.content.length > 700 ? `${c.content.slice(0, 700)}...` : c.content;
      return `Fonte ${i + 1} | Doc: ${c.documentName} | Score: ${c.score.toFixed(2)}\n${snippet}`;
    })
    .join("\n\n");

  const prompt = [
    "Responda ao usuario em portugues brasileiro.",
    "Use SOMENTE o contexto fornecido. Se faltar base, diga explicitamente que nao ha base suficiente.",
    "No final, inclua uma linha iniciando com 'Fontes:' e liste os nomes dos documentos usados.",
    "Pergunta do usuario:",
    query,
    "\nContexto:\n",
    context,
  ].join("\n");

  try {
    const content = await invokeTextModel(prompt, false);
    if (typeof content === "string" && content.trim()) {
      return content.trim();
    }
  } catch {
    // fallback text below
  }

  return "Nao foi possivel gerar resposta agora. Tente novamente em instantes.";
}

async function invokeGemini(prompt: string, expectJson = false): Promise<string> {
  if (!GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY nao configurada");
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(GEMINI_MODEL)}:generateContent`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": GEMINI_API_KEY,
    },
    body: JSON.stringify({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.2,
        responseMimeType: expectJson ? "application/json" : "text/plain",
      },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Gemini falhou (HTTP ${res.status}): ${text}`);
  }

  const payload = (await res.json()) as any;
  const text = payload?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || typeof text !== "string") {
    throw new Error("Gemini retornou resposta vazia");
  }

  return text.trim();
}

async function invokeTextModel(prompt: string, expectJson = false): Promise<string> {
  if (TELEGRAM_TEXT_PROVIDER === "gemini") {
    try {
      return await invokeGemini(prompt, expectJson);
    } catch (err: any) {
      const msg = String(err?.message || err || "");
      console.warn(`[telegram-study-bot] Gemini direto falhou, ativando fallback de providers: ${msg}`);
    }
  }

  const selectedProvider =
    TELEGRAM_TEXT_PROVIDER === "gemini" ||
    TELEGRAM_TEXT_PROVIDER === "groq" ||
    TELEGRAM_TEXT_PROVIDER === "ollama" ||
    TELEGRAM_TEXT_PROVIDER === "forge"
      ? TELEGRAM_TEXT_PROVIDER
      : LLM_PROVIDER;

  const result = await invokeLLM({
    provider: selectedProvider,
    model: selectedProvider === "gemini" ? GEMINI_MODEL : LLM_MODEL,
    messages: [{ role: "user", content: prompt }],
    timeoutMs: 90000,
    responseFormat: expectJson ? { type: "json_object" } : undefined,
  });

  const content = result.choices?.[0]?.message?.content;
  if (typeof content === "string" && content.trim()) {
    return content.trim();
  }
  throw new Error("Modelo retornou resposta vazia");
}

function extractJsonObject(text: string) {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) return null;
  const raw = text.slice(start, end + 1);
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function buildImageUrl(prompt: string, seed = Date.now()) {
  if (TELEGRAM_IMAGE_PROVIDER !== "pollinations") {
    return null;
  }
  const encoded = encodeURIComponent(prompt.trim());
  return `https://image.pollinations.ai/prompt/${encoded}?width=1024&height=1024&seed=${seed}&nologo=true`;
}

async function createStudyReading(topic: string) {
  const chunks = await buildContext(topic, 8);
  if (chunks.length === 0) {
    return "Nao encontrei base suficiente para montar roteiro de leitura desse tema no AVA.";
  }
  const corpus = chunks.map(c => c.content).join("\n\n").slice(0, 10000);
  const prompt = [
    `Tema: ${topic}`,
    "Crie um roteiro de estudo de leitura com:",
    "1) visao geral em 6-10 linhas",
    "2) 5 pontos-chave",
    "3) 3 perguntas de reflexao",
    "4) mini plano de revisao para hoje e amanha",
    "Use somente o conteudo fornecido.",
    corpus,
  ].join("\n");

  try {
    return await invokeTextModel(prompt, false);
  } catch {
    return "Nao foi possivel gerar roteiro de leitura agora.";
  }
}

async function createPublicationPost(topic: string) {
  const chunks = await buildContext(topic, 10);
  if (chunks.length === 0) {
    return null;
  }
  const corpus = chunks
    .map((c, idx) => `Fonte ${idx + 1}: ${c.documentName}\n${c.content.slice(0, 900)}`)
    .join("\n\n")
    .slice(0, 14000);

  const prompt = [
    `Tema do post: ${topic}`,
    "Responda APENAS em JSON valido com as chaves:",
    "title, caption, hashtags, imagePrompt, fontes",
    "Regras:",
    "- caption entre 600 e 1000 caracteres",
    "- linguagem didatica e objetiva",
    "- hashtags em array de 5 a 8 itens",
    "- fontes em array com nomes de documentos do contexto",
    "- imagePrompt em ingles para gerar imagem editorial informativa",
    "Contexto:",
    corpus,
  ].join("\n");

  let raw = "";
  try {
    raw = await invokeTextModel(prompt, true);
  } catch {
    return null;
  }
  const parsed = extractJsonObject(raw);
  if (!parsed) return null;

  const title = String(parsed.title || "Post de estudo").trim();
  const caption = String(parsed.caption || "").trim();
  const hashtags = Array.isArray(parsed.hashtags)
    ? parsed.hashtags.map(v => String(v).trim()).filter(Boolean)
    : [];
  const imagePrompt = String(parsed.imagePrompt || `Editorial educational image about ${topic}`).trim();
  const fontes = Array.isArray(parsed.fontes)
    ? parsed.fontes.map(v => String(v).trim()).filter(Boolean)
    : [];

  return {
    title,
    caption,
    hashtags,
    imagePrompt,
    fontes,
  };
}

async function createCarousel(topic: string, slideCount: number) {
  const chunks = await buildContext(topic, 12);
  if (chunks.length === 0) {
    return null;
  }
  const corpus = chunks
    .map((c, idx) => `Fonte ${idx + 1}: ${c.documentName}\n${c.content.slice(0, 800)}`)
    .join("\n\n")
    .slice(0, 14000);

  const safeSlideCount = Math.max(3, Math.min(10, slideCount));
  const prompt = [
    `Tema do carrossel: ${topic}`,
    `Crie exatamente ${safeSlideCount} slides para estudo/publicacao.`,
    "Responda APENAS em JSON valido com as chaves:",
    "headline, intro, slides, fontes",
    "Onde slides e array de objetos com: title, body, imagePrompt",
    "body de cada slide com 220-350 caracteres",
    "imagePrompt de cada slide em ingles para arte editorial informativa",
    "Contexto:",
    corpus,
  ].join("\n");

  let raw = "";
  try {
    raw = await invokeTextModel(prompt, true);
  } catch {
    return null;
  }
  const parsed = extractJsonObject(raw);
  if (!parsed) return null;

  const slidesRaw = Array.isArray(parsed.slides) ? parsed.slides : [];
  const slides = slidesRaw
    .map((s: any, idx) => ({
      title: String(s?.title || `Slide ${idx + 1}`).trim(),
      body: String(s?.body || "").trim(),
      imagePrompt: String(s?.imagePrompt || `Editorial educational infographic about ${topic}`).trim(),
    }))
    .filter(s => s.body.length > 40)
    .slice(0, safeSlideCount);

  if (slides.length < 3) return null;

  const fontes = Array.isArray(parsed.fontes)
    ? parsed.fontes.map(v => String(v).trim()).filter(Boolean)
    : [];

  return {
    headline: String(parsed.headline || `Carrossel: ${topic}`).trim(),
    intro: String(parsed.intro || "").trim(),
    slides,
    fontes,
  };
}

async function createQuiz(topic: string) {
  const chunks = await buildContext(topic, 10);
  if (chunks.length === 0) {
    return "Nao encontrei conteudo suficiente para montar quiz desse tema nas fontes do AVA.";
  }
  const corpus = chunks.map(c => c.content).join("\n\n").slice(0, 12000);
  const prompt = [
    `Monte um quiz de 5 questoes sobre: ${topic}`,
    "Formato: questao, alternativas A-D, gabarito e explicacao curta.",
    "Use apenas o conteudo abaixo:",
    corpus,
  ].join("\n");

  try {
    return await invokeTextModel(prompt, false);
  } catch {
    return "Nao foi possivel gerar quiz agora.";
  }
}

async function latestTopicsSummary(lookbackMinutes: number) {
  const docs = await getDocumentsRAG(TELEGRAM_STUDY_USER_ID, { status: "indexed" });
  const cutoff = Date.now() - lookbackMinutes * 60 * 1000;
  const fresh = docs
    .filter(d => {
      const updatedMs = d.updatedAt ? new Date(d.updatedAt).getTime() : 0;
      const createdMs = d.createdAt ? new Date(d.createdAt).getTime() : 0;
      return Math.max(updatedMs, createdMs) >= cutoff;
    })
    .sort((a, b) => {
      const aMs = Math.max(
        a.updatedAt ? new Date(a.updatedAt).getTime() : 0,
        a.createdAt ? new Date(a.createdAt).getTime() : 0
      );
      const bMs = Math.max(
        b.updatedAt ? new Date(b.updatedAt).getTime() : 0,
        b.createdAt ? new Date(b.createdAt).getTime() : 0
      );
      return bMs - aMs;
    })
    .slice(0, 12);

  if (fresh.length === 0) {
    return "Nao houve novos assuntos indexados no periodo selecionado.";
  }

  const lines = fresh.map((d, idx) => {
    const source = d.sourceType || "fonte-nao-informada";
    return `${idx + 1}. ${d.name} (${source})`;
  });
  return `Novos assuntos para estudar:\n${lines.join("\n")}`;
}

function parseCommand(text: string) {
  const normalized = sanitizeUserText(text);
  const [rawCmd, ...rest] = normalized.split(" ");
  const cmd = rawCmd.toLowerCase();
  const arg = rest.join(" ").trim();
  return { cmd, arg, normalized };
}

async function handleIncomingMessage(chatId: string, text: string, firstName?: string) {
  if (ALLOWED_CHAT_IDS.size > 0 && !ALLOWED_CHAT_IDS.has(chatId)) {
    console.warn(
      `[telegram-study-bot] chat nao autorizado ignorado: recebido=${chatId} permitido=${Array.from(ALLOWED_CHAT_IDS).join(",")}`
    );
    await telegramSendMessage(
      chatId,
      "Este chat nao esta autorizado para este bot. Configure TELEGRAM_CHAT_ID com este chat_id no .env e reinicie o bot."
    );
    return;
  }

  const { cmd, arg, normalized } = parseCommand(text);
  if (cmd === "/start" || cmd === "/help" || cmd === "/ajuda") {
    await telegramSendMessage(
      chatId,
      [
        `Ola${firstName ? `, ${firstName}` : ""}!`,
        "Eu acompanho novos assuntos estudaveis no AVA e tambem converso com base no que foi indexado.",
        "Comandos:",
        "/novidades - lista temas recentes",
        "/resumo <tema> - explica um tema com base nas fontes do AVA",
        "/quiz <tema> - gera quiz de revisao",
        "/leitura <tema> - cria roteiro de leitura",
        "/post <tema> - gera post (texto + imagem)",
        "/carrossel <tema> - gera carrossel (texto + imagens)",
        "/cli <comando> - Executa um comando autônomo remoto na máquina host",
        "/limpeza_host - executa limpeza autonoma de temporarios/caches do Windows",
      ].join("\n")
    );
    return;
  }

  if (cmd === "/novidades") {
    const summary = await latestTopicsSummary(TELEGRAM_LOOKBACK_MINUTES);
    await telegramSendMessage(chatId, summary);
    return;
  }

  if (cmd === "/cli") {
    if (!arg) {
      await telegramSendMessage(chatId, "Use: /cli <tarefa para executar autonomamente na maquina>");
      return;
    }
    await telegramSendMessage(chatId, `⏳ Motor AVA acionado (canal unificado). Processando: "${arg}"...`);
    try {
      // Etapa 3: Motor unificado elimina exec() por mensagem
      const result = await withTimeout(processAvaRequest(arg, {
        userId: TELEGRAM_STUDY_USER_ID,
        provider: (TELEGRAM_TEXT_PROVIDER as any) || "gemini",
        channel: "telegram",
        autoConfirm: true,
      }), TELEGRAM_REQUEST_TIMEOUT_MS, "processAvaRequest(/cli)");
      const responseMsg = `[AVA-CLI via Motor Unificado]\n\n${result.response.slice(0, 3900)}`;
      await telegramSendMessage(chatId, responseMsg);
    } catch (err) {
      const errorMsg = formatExecError(err);
      const hint = buildCloudModelHint((TELEGRAM_TEXT_PROVIDER as any) || "gemini");
      await telegramSendMessage(chatId, `❌ Erro no motor unificado: ${errorMsg}${hint}`);
    }
    return;
  }

  if (cmd === "/limpeza_host") {
    await telegramSendMessage(chatId, "🧹 Iniciando limpeza autônoma do host (modo seguro com trilha de auditoria)...");
    const result = await runAutonomousHostCleanup();
    const status = result.ok ? "✅" : "❌";
    const msg = [
      `${status} ${result.summary}`,
      result.details ? `\nDetalhes:\n${result.details.slice(0, 2500)}` : "",
      result.ok ? "\nDica: para limpeza profunda adicional, rode DISM em terminal elevado." : "",
    ]
      .filter(Boolean)
      .join("\n");
    await telegramSendMessage(chatId, msg);
    return;
  }

  if (cmd === "/quiz") {
    if (!arg) {
      await telegramSendMessage(chatId, "Use: /quiz <tema>");
      return;
    }
    const quiz = await createQuiz(arg);
    await telegramSendMessage(chatId, quiz);
    return;
  }

  if (cmd === "/resumo") {
    if (!arg) {
      await telegramSendMessage(chatId, "Use: /resumo <tema>");
      return;
    }
    const answer = await answerWithRag(`Explique de forma didatica: ${arg}`);
    await telegramSendMessage(chatId, answer);
    return;
  }

  if (cmd === "/leitura") {
    if (!arg) {
      await telegramSendMessage(chatId, "Use: /leitura <tema>");
      return;
    }
    const reading = await createStudyReading(arg);
    await telegramSendMessage(chatId, reading);
    return;
  }

  if (cmd === "/post") {
    if (!arg) {
      await telegramSendMessage(chatId, "Use: /post <tema>");
      return;
    }
    const pack = await createPublicationPost(arg);
    if (!pack) {
      await telegramSendMessage(chatId, "Nao consegui gerar post com base suficiente nas fontes do AVA para esse tema.");
      return;
    }

    const hashtags = pack.hashtags.join(" ");
    const fontes = pack.fontes.length ? `\n\nFontes: ${pack.fontes.join(", ")}` : "";
    const caption = `📝 ${pack.title}\n\n${pack.caption}${hashtags ? `\n\n${hashtags}` : ""}${fontes}`;
    const imageUrl = buildImageUrl(pack.imagePrompt);

    if (!imageUrl) {
      await telegramSendMessage(chatId, `${caption}\n\n(Imagem nao enviada: provedor de imagem desativado)`);
      return;
    }

    await telegramSendPhoto(chatId, imageUrl, caption);
    return;
  }

  if (cmd === "/carrossel") {
    if (!arg) {
      await telegramSendMessage(chatId, "Use: /carrossel <tema>");
      return;
    }
    const carousel = await createCarousel(arg, TELEGRAM_CAROUSEL_SLIDES);
    if (!carousel) {
      await telegramSendMessage(chatId, "Nao consegui gerar carrossel com base suficiente nas fontes do AVA para esse tema.");
      return;
    }

    const header = [
      `📚 ${carousel.headline}`,
      carousel.intro,
      carousel.fontes.length ? `Fontes: ${carousel.fontes.join(", ")}` : "",
    ]
      .filter(Boolean)
      .join("\n\n");

    const media = carousel.slides.map((slide, idx) => {
      const prompt = `${slide.imagePrompt}. clean editorial style, high readability, no text artifacts`;
      const imageUrl = buildImageUrl(prompt, Date.now() + idx);
      return {
        photoUrl: imageUrl || "",
        caption: `Slide ${idx + 1}/${carousel.slides.length}: ${slide.title}\n${slide.body}`,
      };
    }).filter(i => i.photoUrl);

    await telegramSendMessage(chatId, header);
    if (media.length > 0) {
      await telegramSendMediaGroup(chatId, media);
    }

    const fullText = carousel.slides
      .map((slide, idx) => `${idx + 1}) ${slide.title}\n${slide.body}`)
      .join("\n\n");
    await telegramSendMessage(chatId, `Roteiro textual do carrossel:\n\n${fullText}`);
    return;
  }

  await telegramSendMessage(chatId, `⏳ Analisando sua solicitação...`);
  try {
    // Etapa 3 + 4: Motor unificado com persistência automática de memória
    const result = await withTimeout(processAvaRequest(normalized, {
      userId: TELEGRAM_STUDY_USER_ID,
      provider: (TELEGRAM_TEXT_PROVIDER as any) || "gemini",
      channel: "telegram",
      autoConfirm: false,
    }), TELEGRAM_REQUEST_TIMEOUT_MS, "processAvaRequest(mensagem)");

    let responseMsg = result.response.replace(/\[AVA Responde\]:/gi, "").trim();
    if (!responseMsg) {
      responseMsg = "Não foi possível gerar uma resposta. Tente reformular a solicitação.";
    }
    await telegramSendMessage(chatId, responseMsg.slice(0, 3900));
  } catch (err) {
    const errorMsg = formatExecError(err);
    const hint = buildCloudModelHint((TELEGRAM_TEXT_PROVIDER as any) || "gemini");
    await telegramSendMessage(chatId, `❌ Erro de processamento: ${errorMsg}${hint}`);
  }
}

async function runNotifier(state: BotState) {
  if (!TELEGRAM_CHAT_ID) return;

  const docs = await getDocumentsRAG(TELEGRAM_STUDY_USER_ID, { status: "indexed" });
  const fresh = docs
    .filter(d => {
      const updatedMs = d.updatedAt ? new Date(d.updatedAt).getTime() : 0;
      return updatedMs > state.lastNotifiedUpdatedAt;
    })
    .sort((a, b) => {
      const aMs = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
      const bMs = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
      return bMs - aMs;
    });

  if (fresh.length === 0) return;

  const maxUpdated = fresh.reduce((max, doc) => {
    const ms = doc.updatedAt ? new Date(doc.updatedAt).getTime() : 0;
    return Math.max(max, ms);
  }, state.lastNotifiedUpdatedAt);

  const lines = fresh.slice(0, 8).map((d, i) => `${i + 1}. ${d.name}`);
  const suffix = fresh.length > 8 ? `\n... +${fresh.length - 8} itens` : "";
  const msg = [
    "📚 Novos assuntos disponiveis no AVA:",
    lines.join("\n"),
    suffix,
    "\nUse /novidades, /resumo <tema>, /post <tema> ou /carrossel <tema>.",
  ].join("\n");

  await telegramSendMessage(TELEGRAM_CHAT_ID, msg);
  state.lastNotifiedUpdatedAt = maxUpdated;
  await writeState(state);
}

async function start() {
  assertConfig();
  await acquireSingleInstanceLock();
  const state = await readState();

  console.log("[telegram-study-bot] iniciado");
  console.log(`[telegram-study-bot] userId=${TELEGRAM_STUDY_USER_ID}`);
  console.log(
    `[telegram-study-bot] chatIdsPermitidos=${ALLOWED_CHAT_IDS.size > 0 ? Array.from(ALLOWED_CHAT_IDS).join(",") : "(todos)"}`
  );

  if (TELEGRAM_STUDY_USER_ID > 0) {
    await ensurePersonalRoutine(TELEGRAM_STUDY_USER_ID);
  }
  
  // GARANTIR QUE NENHUM WEBHOOK (ex: n8n) ESTEJA ATIVO CONFLITANDO COM O POLLING
  try {
    await telegramDeleteWebhook();
  } catch (err: any) {
    console.error("[telegram-study-bot] Falha silenciosa ao tentar deletar webhook:", err?.message);
  }

  setInterval(() => {
    runNotifier(state).catch(err => {
      console.error("[telegram-study-bot] erro no notificador:", err);
    });
  }, TELEGRAM_NOTIFY_INTERVAL_MS);

  while (true) {
    try {
      const offset = state.lastUpdateId > 0 ? state.lastUpdateId + 1 : 0;
      const updates = await telegramGetUpdates(offset);
      for (const upd of updates) {
        try {
          const chatId = upd.message?.chat?.id;
          if (!chatId) {
            state.lastUpdateId = Math.max(state.lastUpdateId, upd.update_id);
            continue;
          }
          
          let text = upd.message?.text?.trim() || upd.message?.caption?.trim() || "";
          let visualContext = "";
          
          const photo = upd.message?.photo;
          if (photo && photo.length > 0) {
             const bestPhoto = photo[photo.length - 1];
             const fileUrl = await telegramGetFileUrl(bestPhoto.file_id);
             if (fileUrl) {
                try {
                  await telegramSendMessage(chatId, "👀 Analisando a imagem enviada...");
                } catch(e) {} // ignorar erro na mensagem temporária
                
                try {
                  const desc = await invokeVisionModel(fileUrl, "Descreva esta imagem em detalhes, focando em elementos visuais, textos presentes e contexto geral, em português.");
                  visualContext = `\n[Contexto Visual: O usuário enviou uma imagem. A descrição gerada pela IA de visão foi: "${desc}"]\n`;
                } catch (err: any) {
                  console.error("[telegram-study-bot] Erro na visao:", err);
                  visualContext = `\n[Contexto Visual: O usuário enviou uma imagem, mas ocorreu um erro no provedor de nuvem ao tentar processá-la e o AVA está temporariamente 'cego'. Diga ao usuário que a visão está indisponível.]\n`;
                }
             }
          }

          if (!text && !visualContext) {
            state.lastUpdateId = Math.max(state.lastUpdateId, upd.update_id);
            continue;
          }

          const finalPayload = `${visualContext}${text}`;
          await handleIncomingMessage(String(chatId), finalPayload, upd.message?.from?.first_name);
          
          state.lastUpdateId = Math.max(state.lastUpdateId, upd.update_id);
        } catch (innerErr) {
          console.error("[telegram-study-bot] Erro ao processar mensagem específica:", innerErr);
          // Atualiza para não travar na mesma mensagem infinitamente
          state.lastUpdateId = Math.max(state.lastUpdateId, upd.update_id);
        }
      }
      await writeState(state);
    } catch (err) {
      const msg = String((err as Error)?.message || err || "");
      if (msg.includes("HTTP 409") || msg.toLowerCase().includes("terminated by other getupdates request")) {
        console.error(
          "[telegram-study-bot] conflito 409: outra instancia do bot (ou outro consumidor de getUpdates) esta ativa com o mesmo token. Mantenha apenas UMA instancia em execucao."
        );
        await releaseSingleInstanceLock();
        process.exit(1);
      } else {
        console.error("[telegram-study-bot] erro no polling:", err);
      }
      await new Promise(resolve => setTimeout(resolve, 3000));
    }
  }
}

start().catch(err => {
  console.error("[telegram-study-bot] falha fatal:", err);
  process.exit(1);
});

process.on("SIGINT", () => {
  releaseSingleInstanceLock().finally(() => process.exit(0));
});

process.on("SIGTERM", () => {
  releaseSingleInstanceLock().finally(() => process.exit(0));
});
