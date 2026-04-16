import "dotenv/config";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { indexDocumentFromJSON } from "./rag";

type CollectorState = {
  seenExternalIds: string[];
  lastRunAt?: string;
};

type SourceItem = {
  externalId: string;
  title: string;
  url: string;
  publishedAt?: string;
  sourceType: "youtube" | "rss_web";
  body: string;
  metadata?: Record<string, unknown>;
};

const USER_ID = Number(process.env.COLLECTOR_USER_ID || "1");
const INTERVAL_MS = Number(process.env.COLLECTOR_INTERVAL_MS || "900000");
const MAX_ITEMS_PER_SOURCE = Number(process.env.COLLECTOR_MAX_ITEMS_PER_SOURCE || "5");
const MAX_ARTICLE_CHARS = Number(process.env.COLLECTOR_MAX_ARTICLE_CHARS || "50000");
const MAX_TRANSCRIPT_CHARS = Number(process.env.COLLECTOR_MAX_TRANSCRIPT_CHARS || "50000");
const YOUTUBE_CHANNEL_IDS = splitList(process.env.COLLECTOR_YOUTUBE_CHANNEL_IDS || "");
const SITE_FEEDS = splitList(process.env.COLLECTOR_SITE_FEEDS || "");
const KEYWORDS = splitList(process.env.COLLECTOR_KEYWORDS || "").map(v => v.toLowerCase());

const statePath = path.join(process.cwd(), "data", "study-collector-state.json");
const blockedExt = new Set([
  ".exe",
  ".dll",
  ".bat",
  ".cmd",
  ".com",
  ".vbs",
  ".vbe",
  ".ps1",
  ".scr",
  ".msi",
  ".jar",
  ".js",
]);

function splitList(value: string) {
  return value
    .split(",")
    .map(v => v.trim())
    .filter(Boolean);
}

function sha1(input: string) {
  return crypto.createHash("sha1").update(input).digest("hex");
}

function decodeEntities(input: string) {
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

function stripHtml(html: string) {
  return decodeEntities(
    html
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<!--([\s\S]*?)-->/g, " ")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
  ).trim();
}

function sanitizeText(input: string, limit: number) {
  return input
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, limit);
}

function isAllowedUrl(rawUrl: string) {
  try {
    const u = new URL(rawUrl);
    if (!["http:", "https:"].includes(u.protocol)) return false;
    const pathname = u.pathname.toLowerCase();
    for (const ext of Array.from(blockedExt)) {
      if (pathname.endsWith(ext)) return false;
    }
    return true;
  } catch {
    return false;
  }
}

function containsKeyword(text: string) {
  if (KEYWORDS.length === 0) return true;
  const normalized = text.toLowerCase();
  return KEYWORDS.some(k => normalized.includes(k));
}

function getTagValue(xml: string, tag: string) {
  const m = xml.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i"));
  return m ? decodeEntities(m[1].trim()) : "";
}

function getAllBlocks(xml: string, tag: string) {
  const matches = xml.match(new RegExp(`<${tag}[^>]*>[\\s\\S]*?<\\/${tag}>`, "gi"));
  return matches || [];
}

async function fetchText(url: string, timeoutMs = 30000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent": "AVA-StudyCollector/1.0 (+https://localhost)",
        Accept: "text/html,application/xhtml+xml,application/xml,text/xml;q=0.9,*/*;q=0.8",
      },
    });
    if (!res.ok) return { ok: false as const, status: res.status, body: "", contentType: "" };
    const contentType = (res.headers.get("content-type") || "").toLowerCase();
    const body = await res.text();
    return { ok: true as const, status: res.status, body, contentType };
  } finally {
    clearTimeout(timer);
  }
}

async function readState(): Promise<CollectorState> {
  try {
    const content = await fs.readFile(statePath, "utf-8");
    const parsed = JSON.parse(content) as Partial<CollectorState>;
    return {
      seenExternalIds: Array.isArray(parsed.seenExternalIds) ? parsed.seenExternalIds : [],
      lastRunAt: parsed.lastRunAt,
    };
  } catch {
    return { seenExternalIds: [] };
  }
}

async function writeState(state: CollectorState) {
  await fs.mkdir(path.dirname(statePath), { recursive: true });
  await fs.writeFile(statePath, JSON.stringify(state, null, 2), "utf-8");
}

async function fetchYoutubeTranscript(videoId: string) {
  const langs = ["pt-BR", "pt", "en"];
  for (const lang of langs) {
    const timedTextUrl = `https://www.youtube.com/api/timedtext?lang=${encodeURIComponent(lang)}&v=${encodeURIComponent(videoId)}`;
    const r = await fetchText(timedTextUrl, 20000);
    if (!r.ok || !r.body) continue;
    if (!r.body.includes("<text")) continue;
    const parts = Array.from(r.body.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/gi)).map(m => decodeEntities(m[1] || ""));
    const transcript = sanitizeText(parts.join(" "), MAX_TRANSCRIPT_CHARS);
    if (transcript.length > 40) {
      return { transcript, lang };
    }
  }
  return null;
}

async function collectYoutubeItems(): Promise<SourceItem[]> {
  const items: SourceItem[] = [];
  for (const channelId of YOUTUBE_CHANNEL_IDS) {
    const feedUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${encodeURIComponent(channelId)}`;
    const r = await fetchText(feedUrl, 30000);
    if (!r.ok || !r.body) continue;

    const entries = getAllBlocks(r.body, "entry").slice(0, MAX_ITEMS_PER_SOURCE);
    for (const entry of entries) {
      const videoId = getTagValue(entry, "yt:videoId") || getTagValue(entry, "videoId");
      const title = getTagValue(entry, "title") || `video-${videoId}`;
      const publishedAt = getTagValue(entry, "published");
      const link = (() => {
        const m = entry.match(/<link[^>]*href=["']([^"']+)["']/i);
        return m?.[1] || `https://www.youtube.com/watch?v=${videoId}`;
      })();

      if (!videoId || !isAllowedUrl(link)) continue;
      if (!containsKeyword(`${title} ${link}`)) continue;

      const transcript = await fetchYoutubeTranscript(videoId);
      if (!transcript) continue;

      items.push({
        externalId: `yt:${videoId}`,
        title,
        url: link,
        publishedAt,
        sourceType: "youtube",
        body: transcript.transcript,
        metadata: {
          channelId,
          lang: transcript.lang,
          collectedAt: new Date().toISOString(),
        },
      });
    }
  }
  return items;
}

async function collectRssItems(): Promise<SourceItem[]> {
  const items: SourceItem[] = [];
  for (const feedUrl of SITE_FEEDS) {
    if (!isAllowedUrl(feedUrl)) continue;
    const r = await fetchText(feedUrl, 30000);
    if (!r.ok || !r.body) continue;

    const entries = [
      ...getAllBlocks(r.body, "item"),
      ...getAllBlocks(r.body, "entry"),
    ].slice(0, MAX_ITEMS_PER_SOURCE);

    for (const entry of entries) {
      const title = getTagValue(entry, "title") || "artigo";
      const pubDate = getTagValue(entry, "pubDate") || getTagValue(entry, "updated") || getTagValue(entry, "published");
      const link = (() => {
        const textLink = getTagValue(entry, "link");
        if (textLink.startsWith("http")) return textLink;
        const m = entry.match(/<link[^>]*href=["']([^"']+)["']/i);
        return m?.[1] || "";
      })();

      if (!link || !isAllowedUrl(link)) continue;

      const teaser = `${title} ${getTagValue(entry, "description")}`;
      if (!containsKeyword(teaser)) continue;

      const article = await fetchText(link, 35000);
      if (!article.ok || !article.body) continue;
      if (!article.contentType.includes("text/html") && !article.contentType.includes("application/xhtml+xml")) {
        continue;
      }

      const text = sanitizeText(stripHtml(article.body), MAX_ARTICLE_CHARS);
      if (text.length < 300) continue;

      const externalId = `rss:${sha1(link)}`;
      items.push({
        externalId,
        title,
        url: link,
        publishedAt: pubDate,
        sourceType: "rss_web",
        body: text,
        metadata: {
          feedUrl,
          collectedAt: new Date().toISOString(),
        },
      });
    }
  }
  return items;
}

async function ingestItems(items: SourceItem[], state: CollectorState) {
  for (const item of items) {
    if (state.seenExternalIds.includes(item.externalId)) continue;

    const content = [
      `Titulo: ${item.title}`,
      `URL: ${item.url}`,
      item.publishedAt ? `Publicado em: ${item.publishedAt}` : "",
      "",
      item.body,
    ]
      .filter(Boolean)
      .join("\n");

    try {
      await indexDocumentFromJSON(USER_ID, {
        name: item.title,
        externalId: item.externalId,
        sourceType: item.sourceType,
        legalStatus: "vigente",
        effectiveDate: item.publishedAt,
        content,
        metadata: item.metadata,
      });
      state.seenExternalIds.push(item.externalId);
      console.log(`[collector] indexed ${item.externalId} (${item.sourceType})`);
    } catch (error: any) {
      const message = String(error?.message || error);
      if (message.includes("CONFLICT")) {
        state.seenExternalIds.push(item.externalId);
        continue;
      }
      console.error(`[collector] failed ${item.externalId}: ${message}`);
    }
  }
}

async function runOnce() {
  if (!Number.isFinite(USER_ID) || USER_ID <= 0) {
    throw new Error("COLLECTOR_USER_ID invalido");
  }

  const state = await readState();
  const youtubeItems = await collectYoutubeItems();
  const rssItems = await collectRssItems();
  const allItems = [...youtubeItems, ...rssItems];

  console.log(`[collector] found ${allItems.length} candidate item(s)`);
  await ingestItems(allItems, state);
  state.lastRunAt = new Date().toISOString();
  await writeState(state);
}

async function start() {
  console.log("[collector] started");
  console.log(`[collector] userId=${USER_ID}`);

  while (true) {
    try {
      await runOnce();
    } catch (error) {
      console.error("[collector] run error:", error);
    }
    await new Promise(resolve => setTimeout(resolve, INTERVAL_MS));
  }
}

start().catch(error => {
  console.error("[collector] fatal error:", error);
  process.exit(1);
});
