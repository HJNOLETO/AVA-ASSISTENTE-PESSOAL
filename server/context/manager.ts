import { getUserContext, searchMemoryByKeywords, upsertUserContext } from "../db";

export type PrioritizedMemory = {
  content: string;
  score: number;
  createdAt?: Date;
};

export function prioritize(memories: Array<{ content: string; createdAt?: Date }>, query: string): PrioritizedMemory[] {
  const now = Date.now();
  const q = query.toLowerCase();

  return memories
    .map((m) => {
      const recencyBoost = m.createdAt ? Math.max(0, 1 - (now - m.createdAt.getTime()) / (1000 * 60 * 60 * 24 * 30)) : 0.2;
      const relevanceBoost = m.content.toLowerCase().includes(q) ? 1 : 0.35;
      return { content: m.content, score: Number((recencyBoost * relevanceBoost).toFixed(4)), createdAt: m.createdAt };
    })
    .sort((a, b) => b.score - a.score);
}

export function compact(chunks: string[], maxChars = 1800): string {
  const joined = chunks
    .map((c) => c.replace(/\s+/g, " ").trim())
    .filter(Boolean)
    .join(" | ");
  if (joined.length <= maxChars) return joined;
  return `${joined.slice(0, maxChars)}...`;
}

export function inject(params: {
  baseSystemPrompt: string;
  contextSummary?: string;
  prioritizedMemories?: PrioritizedMemory[];
  ragChunks?: Array<{ content: string }>;
  preferences?: Record<string, unknown>;
  maxChars?: number;
}): string {
  const maxChars = params.maxChars ?? 4500;
  const memoryBlock = (params.prioritizedMemories || [])
    .slice(0, 4)
    .map((m, i) => `${i + 1}. ${m.content}`)
    .join("\n");
  const ragBlock = (params.ragChunks || [])
    .slice(0, 3)
    .map((c, i) => `RAG ${i + 1}: ${c.content}`)
    .join("\n");

  const merged = [
    params.baseSystemPrompt,
    params.contextSummary ? `\n[Resumo de contexto]\n${params.contextSummary}` : "",
    memoryBlock ? `\n[Memorias priorizadas]\n${memoryBlock}` : "",
    ragBlock ? `\n[Chunks RAG]\n${ragBlock}` : "",
    params.preferences ? `\n[Preferencias]\n${JSON.stringify(params.preferences)}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return merged.length <= maxChars ? merged : `${merged.slice(0, maxChars)}\n[...contexto reduzido por limite de tokens...]`;
}

export async function compactUserContext(userId: number, query: string): Promise<{ summary: string; tokenCount: number }> {
  const current = await getUserContext(userId);
  const mem = await searchMemoryByKeywords(userId, query);
  const prioritized = prioritize(
    mem.slice(0, 12).map((m: any) => ({ content: String(m.content || ""), createdAt: m.createdAt })),
    query
  );

  const summary = compact([
    current?.summary || "",
    ...prioritized.slice(0, 6).map((m) => m.content),
  ]);

  const tokenCount = Math.ceil(summary.length / 4);
  await upsertUserContext(userId, {
    summary,
    tokenCount,
    lastCompacted: new Date(),
  });

  return { summary, tokenCount };
}
