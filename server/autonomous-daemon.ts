import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { getProactiveTasks, updateProactiveTask } from "./db";
import { processAvaRequest } from "./unified-engine";
import { telegramSendMessage } from "./telegramStudyBot";

const TELEGRAM_STUDY_USER_ID = Number(process.env.TELEGRAM_STUDY_USER_ID || "1");
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";
const POLL_INTERVAL_MS = 60000; // 1 minute
const WORLD_RADAR_ENABLED = String(process.env.WORLD_RADAR_ENABLED || "1") === "1";
const WORLD_RADAR_MIN_INTERVAL_MINUTES = Math.max(
  15,
  Number(process.env.WORLD_RADAR_MIN_INTERVAL_MINUTES || "45")
);
const WORLD_RADAR_MAX_INTERVAL_MINUTES = Math.max(
  WORLD_RADAR_MIN_INTERVAL_MINUTES,
  Number(process.env.WORLD_RADAR_MAX_INTERVAL_MINUTES || "120")
);
const WORLD_RADAR_MAX_HEADLINES_PER_TOPIC = Math.max(
  2,
  Math.min(5, Number(process.env.WORLD_RADAR_MAX_HEADLINES_PER_TOPIC || "3"))
);

type RadarTopic = {
  key: string;
  label: string;
  query: string;
};

type RadarHeadline = {
  topic: string;
  title: string;
  link: string;
  publishedAt?: string;
};

type RadarState = {
  nextRunAt: number;
  seenLinks: string[];
};

const worldRadarStatePath = path.resolve(__dirname, "../data/world-radar-state.json");
const worldRadarTopics: RadarTopic[] = [
  { key: "judicial", label: "Judiciario", query: "judiciário Brasil STF STJ CNJ" },
  { key: "bolsa", label: "Bolsa", query: "bolsa de valores ibovespa ações" },
  { key: "economia", label: "Economia", query: "economia Brasil juros inflação" },
  { key: "cyber", label: "Cybersegurança", query: "cybersecurity data breach ransomware" },
  { key: "ia", label: "Inteligencia Artificial", query: "inteligência artificial LLM modelos" },
  { key: "geopolitica", label: "Geopolitica", query: "geopolítica tensões internacionais" },
  { key: "guerras", label: "Guerras atuais", query: "guerra Ucrânia Rússia Oriente Médio conflito" },
];

console.log("[autonomous-daemon] Iniciando vigia de background...");

let isDaemonRunning = false;
let isRadarRunning = false;

function randomBetween(min: number, max: number) {
  if (max <= min) return min;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildRadarUrl(query: string) {
  const encoded = encodeURIComponent(query);
  return `https://news.google.com/rss/search?q=${encoded}&hl=pt-BR&gl=BR&ceid=BR:pt-419`;
}

function decodeXmlText(input: string) {
  return input
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
}

function parseRssItems(xml: string) {
  const items = [...xml.matchAll(/<item>([\s\S]*?)<\/item>/gi)].map((m) => m[1]);
  return items.map((itemXml) => {
    const title = itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/i)?.[1]
      || itemXml.match(/<title>([\s\S]*?)<\/title>/i)?.[1]
      || "";
    const link = itemXml.match(/<link>([\s\S]*?)<\/link>/i)?.[1] || "";
    const pubDate = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/i)?.[1] || "";
    return {
      title: decodeXmlText(title),
      link: decodeXmlText(link),
      publishedAt: decodeXmlText(pubDate),
    };
  });
}

async function readRadarState(): Promise<RadarState> {
  try {
    const raw = await fs.readFile(worldRadarStatePath, "utf-8");
    const parsed = JSON.parse(raw) as Partial<RadarState>;
    return {
      nextRunAt: Number(parsed.nextRunAt || 0),
      seenLinks: Array.isArray(parsed.seenLinks) ? parsed.seenLinks.map((v) => String(v)) : [],
    };
  } catch {
    return { nextRunAt: 0, seenLinks: [] };
  }
}

async function writeRadarState(state: RadarState) {
  await fs.mkdir(path.dirname(worldRadarStatePath), { recursive: true });
  await fs.writeFile(worldRadarStatePath, JSON.stringify(state, null, 2), "utf-8");
}

function scheduleNextRadarRun(state: RadarState) {
  const intervalMinutes = randomBetween(
    WORLD_RADAR_MIN_INTERVAL_MINUTES,
    WORLD_RADAR_MAX_INTERVAL_MINUTES
  );
  state.nextRunAt = Date.now() + intervalMinutes * 60_000;
}

async function fetchTopicHeadlines(topic: RadarTopic, seenLinks: Set<string>): Promise<RadarHeadline[]> {
  const url = buildRadarUrl(topic.query);
  const res = await fetch(url, {
    headers: {
      "User-Agent": "AVA-World-Radar/1.0",
      Accept: "application/rss+xml, application/xml;q=0.9, text/xml;q=0.8",
    },
  });

  if (!res.ok) {
    throw new Error(`[world-radar] Falha ao buscar RSS (${topic.key}) HTTP ${res.status}`);
  }

  const xml = await res.text();
  const items = parseRssItems(xml);
  const news = items
    .filter((it) => it.title && it.link)
    .filter((it) => !seenLinks.has(it.link))
    .slice(0, WORLD_RADAR_MAX_HEADLINES_PER_TOPIC)
    .map((it) => ({ topic: topic.label, title: it.title, link: it.link, publishedAt: it.publishedAt }));

  return news;
}

function buildRadarBriefingPrompt(headlines: RadarHeadline[]) {
  const grouped = new Map<string, RadarHeadline[]>();
  for (const h of headlines) {
    const bucket = grouped.get(h.topic) || [];
    bucket.push(h);
    grouped.set(h.topic, bucket);
  }

  const blocks = Array.from(grouped.entries())
    .map(([topic, entries]) => {
      const lines = entries.map((e, i) => `${i + 1}. ${e.title}\nlink: ${e.link}`).join("\n");
      return `Tema: ${topic}\n${lines}`;
    })
    .join("\n\n");

  return [
    "Voce e um analista pessoal de noticias em portugues do Brasil.",
    "Gere um briefing enxuto com foco em utilidade pratica para o usuario.",
    "Formato obrigatorio:",
    "1) Titulo curto",
    "2) 4 a 7 bullets com o que importa agora",
    "3) Secao 'Impacto pratico hoje' com 2 a 4 bullets acionaveis",
    "4) Secao 'Monitorar' com 2 bullets",
    "Nao invente fatos e nao cite fonte ausente.",
    "Noticias coletadas:",
    blocks,
  ].join("\n");
}

async function checkWorldRadar() {
  if (!WORLD_RADAR_ENABLED || !TELEGRAM_CHAT_ID) return;
  if (isRadarRunning) return;

  isRadarRunning = true;
  try {
    const state = await readRadarState();
    const now = Date.now();
    if (state.nextRunAt > now) return;

    const seenLinks = new Set(state.seenLinks);
    const allHeadlines: RadarHeadline[] = [];

    for (const topic of worldRadarTopics) {
      try {
        const headlines = await fetchTopicHeadlines(topic, seenLinks);
        allHeadlines.push(...headlines);
      } catch (err) {
        console.warn(`[world-radar] Falha no tema ${topic.key}:`, err);
      }
    }

    if (allHeadlines.length === 0) {
      scheduleNextRadarRun(state);
      await writeRadarState(state);
      return;
    }

    const prompt = buildRadarBriefingPrompt(allHeadlines);
    const result = await processAvaRequest(prompt, {
      userId: TELEGRAM_STUDY_USER_ID,
      provider: (process.env.TELEGRAM_TEXT_PROVIDER as any) || (process.env.LLM_PROVIDER as any) || "gemini",
      channel: "telegram",
      autoConfirm: true,
    });

    const briefing = result?.response?.trim();
    if (briefing) {
      await telegramSendMessage(TELEGRAM_CHAT_ID, `🌍 Radar de informacoes relevantes\n\n${briefing}`);
      for (const h of allHeadlines) seenLinks.add(h.link);
      state.seenLinks = Array.from(seenLinks).slice(-500);
    }

    scheduleNextRadarRun(state);
    await writeRadarState(state);
  } catch (err) {
    console.error("[world-radar] Erro geral:", err);
  } finally {
    isRadarRunning = false;
  }
}

async function checkProactiveTasks() {
  if (isDaemonRunning) {
    console.log("[autonomous-daemon] Ciclo anterior ainda em execução. Pulando este turno para evitar avalanche.");
    return;
  }

  isDaemonRunning = true;
  try {
    const tasks = await getProactiveTasks(TELEGRAM_STUDY_USER_ID);
    const now = Date.now();
    
    // Agrupar tarefas ativas por descrição para evitar enviar 10 lembretes de "Tomar água" ao mesmo tempo
    const activeTasks = tasks.filter((t) => t.status === "active" && t.nextRun && new Date(t.nextRun).getTime() <= now);
    const seenDescriptions = new Set<string>();
    const tasksToProcess = [];

    for (const task of activeTasks) {
      const normalizedDescription = (task.description ?? task.title ?? "").toLowerCase().trim();
      const dedupeKey = normalizedDescription || `task-${task.id}`;
      if (seenDescriptions.has(dedupeKey)) {
        // Tarefa duplicada de mesmo nome vencida ao mesmo tempo. Apenas adiamos silenciosamente.
        const tempNextRun = new Date(now + 5 * 60000);
        await updateProactiveTask(TELEGRAM_STUDY_USER_ID, task.id, { nextRun: tempNextRun });
        continue;
      }
      seenDescriptions.add(dedupeKey);
      tasksToProcess.push(task);
    }

    for (const task of tasksToProcess) {
      try {
        console.log(`[autonomous-daemon] Tarefa acionada: #${task.id} ${task.description}`);
        const prompt = `[SISTEMA AUTÔNOMO] O momento atual é ${new Date().toLocaleString("pt-BR")}. O lembrete "${task.title}" com a descrição "${task.description}" acabou de vencer. Você deve notificar o usuário imediatamente. Inicie uma interação natural informando sobre este lembrete vencido e pergunte se o usuário deseja que você faça algo a respeito ou marque como concluído.`;
        
        const result = await processAvaRequest(prompt, {
          userId: TELEGRAM_STUDY_USER_ID,
          provider: (process.env.LLM_PROVIDER as any) || "gemini",
          channel: "cli",
          autoConfirm: true
        });

        console.log(`[autonomous-daemon] Resultado LLM para tarefa #${task.id}: ${result.status}`);
        if (result.status === "completed" || result.status === "aborted") {
          const tempNextRun = new Date(Date.now() + 5 * 60000);
          await updateProactiveTask(TELEGRAM_STUDY_USER_ID, task.id, { nextRun: tempNextRun });
          if (result.response && TELEGRAM_CHAT_ID) {
            await telegramSendMessage(TELEGRAM_CHAT_ID, result.response);
          }
        }
      } catch (err) {
        console.error(`[autonomous-daemon] Falha ao processar tarefa #${task.id}:`, err);
      }
    }
  } catch (error) {
    console.error("[autonomous-daemon] Erro na checagem:", error);
  } finally {
    isDaemonRunning = false;
  }
}

setInterval(checkProactiveTasks, POLL_INTERVAL_MS);
checkProactiveTasks();
setInterval(checkWorldRadar, POLL_INTERVAL_MS);
checkWorldRadar();
