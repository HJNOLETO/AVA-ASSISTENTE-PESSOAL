/**
 * GUARD RAILS — Contrato Canônico de Entrada (P0.1)
 *
 * Define o schema único para toda requisição que entra no pipeline AVA.
 * Campos mínimos obrigatórios + validação automática na borda.
 */

import { z } from "zod";
import { nanoid } from "nanoid";

// ─── Taxonomia de Canais ─────────────────────────────────────────────────────

export const CanalEnum = z.enum([
  "chat",       // Interface chat web
  "voice",      // Entrada por voz (STT)
  "api",        // Chamada direta de API
  "telegram",   // Bot Telegram
  "cron",       // Automação/agendamento
  "internal",   // Chamadas internas do sistema
]);
export type Canal = z.infer<typeof CanalEnum>;

// ─── Payload Types ───────────────────────────────────────────────────────────

export const TextPayloadSchema = z.object({
  type: z.literal("text"),
  content: z.string().min(1).max(50_000),
});

export const VoicePayloadSchema = z.object({
  type: z.literal("voice"),
  audioBase64: z.string().optional(),
  transcription: z.string().optional(),
  durationSeconds: z.number().optional(),
});

export const ContextPayloadSchema = z.object({
  type: z.literal("context"),
  documents: z.array(z.string()).optional(),
  conversationId: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const PayloadSchema = z.discriminatedUnion("type", [
  TextPayloadSchema,
  VoicePayloadSchema,
  ContextPayloadSchema,
]);

export type Payload = z.infer<typeof PayloadSchema>;

// ─── Schema Canônico Principal ───────────────────────────────────────────────

export const CanonicalRequestSchema = z.object({
  /** ID único da requisição para rastreabilidade — gerado automaticamente se não fornecido */
  request_id: z.string().default(() => nanoid()),

  /** Canal de entrada da requisição */
  canal: CanalEnum.default("chat"),

  /** ID do usuário autenticado (null para público/anônimo) */
  usuario: z.object({
    id: z.number().nullable(),
    role: z.enum(["anonymous", "user", "admin"]).default("anonymous"),
    name: z.string().optional(),
  }),

  /** Timestamp ISO da criação da requisição */
  timestamp: z.string().datetime().default(() => new Date().toISOString()),

  /** Payload principal — variável por canal */
  payload: PayloadSchema,

  /** Contexto extra opcional */
  context: z
    .object({
      conversationId: z.string().optional(),
      sessionId: z.string().optional(),
      skillId: z.string().optional(),
      ragEnabled: z.boolean().default(true),
      maxTokens: z.number().optional(),
      language: z.string().default("pt-BR"),
    })
    .optional(),
});

export type CanonicalRequest = z.infer<typeof CanonicalRequestSchema>;

// ─── Normalizador de Entrada ──────────────────────────────────────────────────

/**
 * Normaliza uma entrada bruta para o formato canônico.
 * Retorna { success: true, data } ou { success: false, error }.
 */
export function normalizeRequest(
  raw: unknown
): { success: true; data: CanonicalRequest } | { success: false; error: string; details: unknown } {
  const result = CanonicalRequestSchema.safeParse(raw);

  if (!result.success) {
    return {
      success: false,
      error: "Entrada fora do contrato canônico",
      details: result.error.flatten(),
    };
  }

  return { success: true, data: result.data };
}

/**
 * Constrói uma requisição canônica a partir de uma mensagem de chat simples.
 * Helper para a integração com o router de chat existente.
 */
export function buildChatRequest(params: {
  userId: number | null;
  userRole?: "anonymous" | "user" | "admin";
  userName?: string;
  message: string;
  conversationId?: string;
}): CanonicalRequest {
  return CanonicalRequestSchema.parse({
    canal: "chat",
    usuario: {
      id: params.userId,
      role: params.userRole ?? (params.userId ? "user" : "anonymous"),
      name: params.userName,
    },
    payload: {
      type: "text",
      content: params.message,
    },
    context: {
      conversationId: params.conversationId,
      ragEnabled: true,
    },
  });
}
