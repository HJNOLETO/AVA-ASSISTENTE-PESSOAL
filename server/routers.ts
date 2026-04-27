import { COOKIE_NAME } from "@shared/const";
import {
  parseAppointmentIntent,
  parseReminderIntent,
} from "@shared/intent/schedulingIntent";
import {
  appointmentCreateInputSchema,
  appointmentUpdateInputSchema,
  proactiveTaskCreateInputSchema,
  proactiveTaskUpdateInputSchema,
} from "@shared/validation/scheduling";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { assistantRouter } from "./assistant";
import { publicProcedure, protectedProcedure, adminProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { transcribeAudio } from "./_core/voiceTranscription";
import {
  getHardwareInfo,
  getHardwareMetrics,
  detectOperationMode,
  getModeCapabilities,
  getRecommendedMode,
  isHardwareCompatible,
  getRunningHeavySoftware,
} from "./hardware";
import {
  analyzeContent,
  generateApostila,
  generateResumo,
  generateMapaMental,
  generateFlashcards,
  generateQuiz,
  generatePeticao,
  generateParecer,
  generateAtendimento,
  slugify,
  ensureKnowledgeDirs,
} from "./knowledge";
import { generateEmbedding } from "./_core/llm";
import {
  extractText as ragExtractText,
  chunkText,
  indexDocumentFromFile,
  indexDocumentFromJSON,
  importPrecomputedEmbeddings,
  saveDocumentForReview,
  approveDocumentFromReview,
  searchRelevantChunks,
  getRAGStorageStats,
} from "./rag";
import { retrieveRelevantChunksPatched } from "./rag/retriever-patch";
import {
  getDocumentsRAG,
  getDocumentByIdRAG,
  getDocumentByExternalId,
  createDocumentRAG,
  updateDocumentProgress,
  updateDocumentStatusById,
  updateDocumentLifecycle,
  replaceDocument,
  hardDeleteDocument,
  purgeDocumentChunks,
  getDocumentChunks,
  getStorageStats,
  cleanupExpiredDocuments,
  cleanupOldMemories,
  cleanupCompletedTasks,
  updateDocumentLastAccessed,
} from "./db";
import {
  createConversation,
  getConversations,
  getConversationById,
  renameConversation,
  toggleFavorite,
  addMessage,
  getMessages,
  getUserSettings,
  createOrUpdateUserSettings,
  addMemoryEntry,
  isMemoryGuardResult,
  searchMemoryByKeywords,
  addHardwareSnapshot,
  getRecentHardwareSnapshots,
  getUserByEmail,
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getSystemLogs,
  getAgents,
  getAgentById,
  createAgent,
  updateAgent,
  deleteAgent,
  deleteConversation,
  createPasswordResetToken,
  getPasswordResetToken,
  markPasswordResetTokenAsUsed,
  invalidateAllUserTokens,
  createSecurityCard,
  getActiveSecurityCard,
  createSecurityCardAttempt,
  getRecentSecurityCardAttempts,
  getCustomers,
  getCustomerById,
  createCustomer,
  updateCustomerCRM,
  deleteCustomer,
  getAppointments,
  getAppointmentById,
  createAppointment,
  updateAppointment,
  deleteAppointment,
  getDocuments,
  getDocumentById,
  createDocument,
  updateDocumentStatus,
  deleteDocument,
  createDocumentChunk,
  searchDocumentChunks,
  getEvents,
  createEvent,
  updateEvent,
  deleteEvent,
  getPostits,
  createPostit,
  updatePostit,
  deletePostit,
  getProactiveTasks,
  createProactiveTask,
  updateProactiveTask,
  // Legal Module - New Implementation
  getLegalClients,
  createLegalClient,
  updateLegalClient,
  getLegalProcesses,
  createLegalProcess,
  getLegalDeadlines,
  createLegalDeadline,
  getActionTypes,
  getProcessMovements,
  createProcessMovement,
  getLegalHearings,
  createLegalHearing,
  getAttorneyFees,
  createAttorneyFee,
  getLegalProcessDocuments,
  createLegalProcessDocument,
  getPetitionTemplates,
  getAllProducts,
  getProductsWithoutNCM,
  searchProducts,
  getProductByRef,
  upsertProduct,
} from "./db";
import { invokeLLM } from "./_core/llm";
import { orchestrateAgentResponse, getAvailableTools, sanitizePath } from "./agents";
import {
  searchDOU,
  searchLexML,
  searchJurisprudencia,
  searchPJeComunicacoes,
} from "./legalApis";
import { addHours, addDays, setHours, setMinutes, isWeekend, isAfter } from "date-fns";
import axios from "axios";
import fs from "fs";
import path from "path";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { nanoid } from "nanoid";
import { sdk } from "./_core/sdk";
import { ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import {
  extractKeywords,
  formatMemoriesForPrompt
} from "./utils/memoryUtils";
import {
  runGuardRails,
  sanitizeString,
  sanitizeParams,
  requireConfirmation,
  logGuardRailStage,
  recordRouteMetric,
  executeWithFallback,
  buildUnavailableResponse,
  validateOutputContract,
  validateRagOutput,
  registerSkillContract,
  getSkillContract,
} from "./guard-rails/index.js";

const OPENCODE_SKILLS_DIR = path.resolve(process.cwd(), ".opencode", "skills");

type SkillProfile = {
  id: string;
  title: string;
  description: string;
};

type ChatDomainMode = "default" | "programacao" | "professor" | "loja";

type ChatDomainParseResult = {
  mode: ChatDomainMode;
  matched: boolean;
  command: string | null;
  content: string;
};

function normalizeSkillId(raw: string): string {
  return raw.trim().toLowerCase();
}

function extractFrontmatterValue(frontmatter: string, key: string): string | undefined {
  const match = frontmatter.match(new RegExp(`^${key}:\\s*(.+)$`, "mi"));
  if (!match?.[1]) return undefined;
  return match[1].replace(/^['\"]|['\"]$/g, "").trim();
}

function readSkillProfile(skillId: string): SkillProfile | null {
  const normalized = normalizeSkillId(skillId);
  const skillFile = path.join(OPENCODE_SKILLS_DIR, normalized, "SKILL.md");
  if (!fs.existsSync(skillFile)) return null;

  const content = fs.readFileSync(skillFile, "utf-8");
  const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = fmMatch?.[1] ?? "";
  const body = fmMatch ? content.slice(fmMatch[0].length).trim() : content.trim();
  const firstTitle = body.match(/^#\s+(.+)$/m)?.[1]?.trim();

  const title =
    extractFrontmatterValue(frontmatter, "name") ||
    firstTitle ||
    normalized;
  const description =
    extractFrontmatterValue(frontmatter, "description") ||
    body.split("\n").find((line) => line.trim().length > 0 && !line.trim().startsWith("#"))?.trim() ||
    "Skill sem descricao";

  return { id: normalized, title, description };
}

function listSkillProfiles(): SkillProfile[] {
  if (!fs.existsSync(OPENCODE_SKILLS_DIR)) return [];
  const entries = fs.readdirSync(OPENCODE_SKILLS_DIR, { withFileTypes: true });
  const profiles: SkillProfile[] = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;
    const profile = readSkillProfile(entry.name);
    if (profile) profiles.push(profile);
  }

  return profiles.sort((a, b) => a.id.localeCompare(b.id));
}

function loadSkillInstruction(skillId: string): string | null {
  const normalized = normalizeSkillId(skillId);
  const skillFile = path.join(OPENCODE_SKILLS_DIR, normalized, "SKILL.md");
  if (!fs.existsSync(skillFile)) return null;

  const raw = fs.readFileSync(skillFile, "utf-8");
  const body = raw.replace(/^---\n[\s\S]*?\n---\n?/m, "").trim();
  const compact = body
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return compact.slice(0, 5000);
}

function ensureSkillGovernanceContract(skillId: string): boolean {
  const normalized = normalizeSkillId(skillId);
  if (getSkillContract(normalized)) {
    return true;
  }

  const skillFile = path.join(OPENCODE_SKILLS_DIR, normalized, "SKILL.md");
  if (!fs.existsSync(skillFile)) {
    return false;
  }

  const raw = fs.readFileSync(skillFile, "utf-8");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---/);
  const frontmatter = fmMatch?.[1] ?? "";
  const version = extractFrontmatterValue(frontmatter, "version") || "1.0.0";

  registerSkillContract({
    id: normalized,
    version,
    risk: "medium",
    inputs: z.record(z.string(), z.unknown()),
    preconditions: [() => true],
    outputs: z.unknown(),
    required_capabilities: [`skill.${normalized}.execute`],
  });

  return true;
}

function parseChatDomainMode(raw: string): ChatDomainParseResult {
  const text = String(raw || "").trim();
  if (!text.startsWith("/")) {
    return { mode: "default", matched: false, command: null, content: text };
  }

  const match = text.match(/^\/([^\s]+)\s*(.*)$/);
  if (!match) {
    return { mode: "default", matched: false, command: null, content: text };
  }

  const commandRaw = match[1].replace(/\/+$/g, "");
  const command = normalizeIntentText(commandRaw);
  const content = (match[2] || "").trim();

  if (["programacao", "programacao", "dev", "codigo", "codigos"].includes(command)) {
    return { mode: "programacao", matched: true, command: commandRaw, content };
  }

  if (["professor", "aula", "estudo", "didatico"].includes(command)) {
    return { mode: "professor", matched: true, command: commandRaw, content };
  }

  if (["loja", "produtos", "catalogo", "catalogo-produtos"].includes(command)) {
    return { mode: "loja", matched: true, command: commandRaw, content };
  }

  return { mode: "default", matched: false, command: null, content: text };
}

function buildModeActivatedMessage(mode: ChatDomainMode): string {
  if (mode === "programacao") {
    return "Modo programacao ativado. Envie sua solicitacao tecnica em seguida (ex.: criar tabela SQL de clientes).";
  }
  if (mode === "professor") {
    return "Modo professor ativado. Envie o tema que voce quer estudar e o nivel desejado.";
  }
  if (mode === "loja") {
    return "Modo loja ativado. Envie o produto, referencia ou acao no catalogo.";
  }
  return "Modo padrao ativado.";
}

function isOperationalProductIntent(input: string): boolean {
  const q = normalizeIntentText(input);
  return /(produto|produtos|catalogo|estoque|preco|ncm|sku|erp|roberto papeis|referencia|codigo)/i.test(q);
}

function extractReferenceCandidate(input: string): string | null {
  const refMatch = input.match(/\b\d{6,}\b/);
  return refMatch ? refMatch[0] : null;
}

function isProductMutationIntent(input: string): boolean {
  const q = normalizeIntentText(input);
  return /(atualiz|alter|mudar|corrig|defin|ajust|import|cadast|criar|inserir|remov|exclu|apagar)/i.test(q);
}

function hasProductCatalogHint(input: string): boolean {
  const q = normalizeIntentText(input);
  return /(papel|produt|estoque|preco|ncm|gramatura|a4|a3|fosco|matte|glossy|adesivo|envelope|cola|wire|kraft|fotogra|jojo|masterprint|colorplus|pct|fls|unid|bobina|couche|offset|vinil|bopp|etiqueta|cartao|lamicote|canson|verge)/i.test(q);
}

function isQuoteIntent(input: string): boolean {
  if ((input || "").toUpperCase().includes("ORCAMENTO_REQUEST::")) {
    return true;
  }
  const q = normalizeIntentText(input);
  return /(orcamento|pedido|cotacao|proposta)/i.test(q);
}

function extractQuotePayload(input: string): string {
  const raw = input || "";
  const marker = "ORCAMENTO_REQUEST::";
  const idx = raw.toUpperCase().indexOf(marker);
  if (idx >= 0) {
    return raw.slice(idx + marker.length).trim();
  }
  return raw.trim();
}

function extractQuoteItemTerm(input: string): string {
  const payload = extractQuotePayload(input);
  const q = normalizeIntentText(payload);
  const match = q.match(/(?:produto|produtos|item|itens)\s*[:=]?\s*([^,;|]+)/i);
  if (match?.[1]) return match[1].trim();
  return q;
}

function normalizeIntentText(input: string): string {
  return (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function formatProductOperationalList(productsList: Array<{ referenceId: string | null; name: string; price: number | null; stock: number | null; status: string | null; ncm: string | null }>, limitUsed: number): string {
  const lines = productsList.map((p) =>
    `- ${p.name} | Ref: ${p.referenceId || "N/A"} | Preço: R$${p.price ?? "N/A"} | Estoque: ${p.stock ?? "N/A"} | Status: ${p.status || "N/A"} | NCM: ${p.ncm || "N/A"}`
  );

  const header = `Encontrei ${productsList.length} produto(s) relacionado(s).`;
  const body = lines.join("\n");
  const footer =
    productsList.length >= limitUsed
      ? `\n\nMostrando até ${limitUsed} resultados. Refine por marca, gramatura, formato ou referência para filtrar mais.`
      : "";

  return `${header}\n\n${body}${footer}`;
}

type DirectSchedulingResult = {
  handled: boolean;
  assistantMessage?: string;
};

async function tryHandleDirectSchedulingIntent(params: {
  userId: number;
  conversationId: number;
  userContent: string;
}): Promise<DirectSchedulingResult> {
  const reminder = parseReminderIntent(params.userContent);
  if (reminder) {
    try {
      const nextRun = new Date(Date.now() + Math.round(reminder.minutes) * 60 * 1000);
      await createProactiveTask(params.userId, {
        title: `Lembrete: ${reminder.message}`,
        description: reminder.message,
        nextRun,
        type: "watcher",
        status: "active",
      });

      const assistantMessage =
        `Perfeito! Lembrete salvo: "${reminder.message}". ` +
        `Vou te lembrar em ${Math.round(reminder.minutes)} minuto(s), aproximadamente às ${nextRun.toLocaleTimeString("pt-BR", {
          hour: "2-digit",
          minute: "2-digit",
        })}.`;

      await addMessage(params.conversationId, "assistant", assistantMessage);

      return {
        handled: true,
        assistantMessage,
      };
    } catch (error) {
      const assistantMessage =
        "Entendi seu lembrete, mas ocorreu um erro ao salvar no sistema. Tente novamente em instantes.";
      console.error("[Scheduling] Failed to create reminder:", error);
      await addMessage(params.conversationId, "assistant", assistantMessage);
      return {
        handled: true,
        assistantMessage,
      };
    }
  }

  const appointment = parseAppointmentIntent(params.userContent);
  if (appointment) {
    if (appointment.startTime.getTime() <= Date.now()) {
      const assistantMessage =
        "Entendi o agendamento, mas o horário informado já passou. " +
        "Me diga um horário futuro para eu salvar na agenda.";
      await addMessage(params.conversationId, "assistant", assistantMessage);
      return {
        handled: true,
        assistantMessage,
      };
    }

    try {
      await createAppointment(params.userId, {
        title: appointment.title,
        description: `Agendamento criado automaticamente via chat: ${appointment.title}`,
        startTime: appointment.startTime,
        endTime: appointment.endTime,
        location: null,
        customerId: null,
        type: "other",
        reminderMinutes: appointment.reminderMinutes,
        recurrenceRule: null,
        participants: null,
        isCompleted: 0,
        status: "scheduled",
      });

      const startLabel = appointment.startTime.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });

      const reminderLabel =
        appointment.reminderMinutes && appointment.reminderMinutes > 0
          ? ` com lembrete ${appointment.reminderMinutes} minuto(s) antes`
          : "";

      const assistantMessage = `Agendamento salvo: "${appointment.title}" para ${startLabel}${reminderLabel}.`;
      await addMessage(params.conversationId, "assistant", assistantMessage);

      return {
        handled: true,
        assistantMessage,
      };
    } catch (error) {
      const assistantMessage =
        "Entendi seu agendamento, mas ocorreu um erro ao salvar na agenda. Tente novamente em instantes.";
      console.error("[Scheduling] Failed to create appointment:", error);
      await addMessage(params.conversationId, "assistant", assistantMessage);
      return {
        handled: true,
        assistantMessage,
      };
    }
  }

  return { handled: false };
}

export const appRouter = router({
  system: systemRouter,
  assistant: assistantRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
    login: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(6),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const user = await getUserByEmail(input.email);
        if (!user || !user.password) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Credenciais inválidas",
          });
        }

        const isValid = await bcrypt.compare(input.password, user.password);
        if (!isValid) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Credenciais inválidas",
          });
        }

        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || "",
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return { success: true, user };
      }),
    register: publicProcedure
      .input(
        z.object({
          email: z.string().email(),
          password: z.string().min(6),
          name: z.string().min(2),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const existingUser = await getUserByEmail(input.email);
        if (existingUser) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Usuário já existe com este e-mail",
          });
        }

        const hashedPassword = await bcrypt.hash(input.password, 10);
        const openId = `local-${nanoid()}`;

        await createUser({
          openId,
          email: input.email,
          password: hashedPassword,
          name: input.name,
          loginMethod: "local",
          role: "user",
        });

        const user = await getUserByEmail(input.email);
        if (!user) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: "Erro ao criar usuário",
          });
        }

        const sessionToken = await sdk.createSessionToken(user.openId, {
          name: user.name || "",
          expiresInMs: ONE_YEAR_MS,
        });

        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        return { success: true, user };
      }),
    requestPasswordReset: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const user = await getUserByEmail(input.email);
        console.log(`[AUTH] Solicitação de recuperação para: ${input.email} (Usuário encontrado: ${!!user})`);

        if (!user || !user.id) {
          // Por segurança, não confirmamos se o e-mail existe
          return { success: true };
        }

        const token = nanoid(48);
        const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hora

        await createPasswordResetToken({
          userId: user.id,
          token,
          expiresAt,
        });

        // Simulação de envio de e-mail
        console.log(`\n--- [SIMULAÇÃO DE E-MAIL] ---`);
        console.log(`Para: ${input.email}`);
        console.log(`Assunto: Recuperação de Senha - AVA Assistant`);
        console.log(`Link: http://localhost:5173/reset-password?token=${token}`);
        console.log(`Validade: 60 minutos`);
        console.log(`---------------------------\n`);

        return { success: true };
      }),
    validateResetToken: publicProcedure
      .input(z.object({ token: z.string() }))
      .query(async ({ input }) => {
        const resetToken = await getPasswordResetToken(input.token);

        if (!resetToken || resetToken.used || resetToken.expiresAt.getTime() < Date.now()) {
          return { valid: false };
        }

        return { valid: true };
      }),
    resetPassword: publicProcedure
      .input(z.object({
        token: z.string(),
        password: z.string().min(8)
      }))
      .mutation(async ({ input }) => {
        const resetToken = await getPasswordResetToken(input.token);

        if (!resetToken || resetToken.used || resetToken.expiresAt.getTime() < Date.now()) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Token inválido ou expirado",
          });
        }

        const user = await getUserByEmail(""); // Placeholder para pegar pelo ID
        // Note: idealmente teríamos getUserById, mas vamos usar o userId do token

        const hashedPassword = await bcrypt.hash(input.password, 10);

        await updateUser(resetToken.userId, { password: hashedPassword });
        await markPasswordResetTokenAsUsed(resetToken.id);
        await invalidateAllUserTokens(resetToken.userId); // Invalida outros tokens pendentes

        return { success: true };
      }),
  }),
  // CRM management router
  crm: router({
    getCustomers: protectedProcedure.query(async ({ ctx }) => {
      return getCustomers(ctx.user.id);
    }),
    getCustomer: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return getCustomerById(ctx.user.id, input.id);
      }),
    createCustomer: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          email: z.string().email().optional().nullable(),
          phone: z.string().optional().nullable(),
          cpf: z.string().optional().nullable(),
          birthDate: z.string().optional().nullable(),
          company: z.string().optional().nullable(),
          position: z.string().optional().nullable(),
          addressStreet: z.string().optional().nullable(),
          addressNumber: z.string().optional().nullable(),
          addressCity: z.string().optional().nullable(),
          addressState: z.string().optional().nullable(),
          addressZipcode: z.string().optional().nullable(),
          notes: z.string().optional().nullable(),
          tags: z.string().optional().nullable(), // JSON array string
          status: z.enum(["active", "inactive", "prospect"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return createCustomer(ctx.user.id, {
          ...input,
          email: input.email ?? null,
          phone: input.phone ?? null,
          cpf: input.cpf ?? null,
          birthDate: input.birthDate ?? null,
          company: input.company ?? null,
          position: input.position ?? null,
          addressStreet: input.addressStreet ?? null,
          addressNumber: input.addressNumber ?? null,
          addressCity: input.addressCity ?? null,
          addressState: input.addressState ?? null,
          addressZipcode: input.addressZipcode ?? null,
          notes: input.notes ?? null,
          tags: input.tags ?? null,
        });
      }),
    updateCustomer: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          email: z.string().email().optional().nullable(),
          phone: z.string().optional().nullable(),
          cpf: z.string().optional().nullable(),
          birthDate: z.string().optional().nullable(),
          company: z.string().optional().nullable(),
          position: z.string().optional().nullable(),
          addressStreet: z.string().optional().nullable(),
          addressNumber: z.string().optional().nullable(),
          addressCity: z.string().optional().nullable(),
          addressState: z.string().optional().nullable(),
          addressZipcode: z.string().optional().nullable(),
          notes: z.string().optional().nullable(),
          tags: z.string().optional().nullable(),
          status: z.enum(["active", "inactive", "prospect"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return updateCustomerCRM(ctx.user.id, id, data);
      }),
    deleteCustomer: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return deleteCustomer(ctx.user.id, input.id);
      }),
  }),

  // Agenda management router
  agenda: router({
    getAppointments: protectedProcedure.query(async ({ ctx }) => {
      return getAppointments(ctx.user.id);
    }),
    createAppointment: protectedProcedure
      .input(appointmentCreateInputSchema)
      .mutation(async ({ ctx, input }) => {
        return createAppointment(ctx.user.id, input);
      }),
    updateAppointment: protectedProcedure
      .input(appointmentUpdateInputSchema)
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return updateAppointment(ctx.user.id, id, data);
      }),
    deleteAppointment: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return deleteAppointment(ctx.user.id, input.id);
      }),
  }),

  // Events (Portuguese)
  events: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getEvents(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional().nullable(),
        startDate: z.string(),
        startTime: z.string(),
        endDate: z.string(),
        endTime: z.string(),
        type: z.enum(["reuniao", "consulta", "ligacao", "outro"]).optional(),
        location: z.string().optional().nullable(),
        reminderMinutes: z.number().optional().nullable(),
        customerId: z.number().optional().nullable(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createEvent(ctx.user.id, input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional().nullable(),
        startDate: z.string().optional(),
        startTime: z.string().optional(),
        endDate: z.string().optional(),
        endTime: z.string().optional(),
        type: z.enum(["reuniao", "consulta", "ligacao", "outro"]).optional(),
        location: z.string().optional().nullable(),
        reminderMinutes: z.number().optional().nullable(),
        isCompleted: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return updateEvent(ctx.user.id, id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return deleteEvent(ctx.user.id, input.id);
      }),
  }),

  // Postits (Portuguese)
  postits: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getPostits(ctx.user.id);
    }),
    create: protectedProcedure
      .input(z.object({
        title: z.string(),
        description: z.string().optional().nullable(),
        color: z.string().optional(),
        category: z.string().optional().nullable(),
        priority: z.enum(["baixa", "media", "alta", "urgente"]).optional(),
        alarmDate: z.string().optional().nullable(),
        alarmTime: z.string().optional().nullable(),
        notify: z.number().optional(),
        positionX: z.number().optional(),
        positionY: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createPostit(ctx.user.id, input);
      }),
    update: protectedProcedure
      .input(z.object({
        id: z.number(),
        title: z.string().optional(),
        description: z.string().optional().nullable(),
        color: z.string().optional(),
        category: z.string().optional().nullable(),
        priority: z.enum(["baixa", "media", "alta", "urgente"]).optional(),
        alarmDate: z.string().optional().nullable(),
        alarmTime: z.string().optional().nullable(),
        notify: z.number().optional(),
        positionX: z.number().optional(),
        positionY: z.number().optional(),
        isCompleted: z.number().optional(),
        isArchived: z.number().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return updatePostit(ctx.user.id, id, data);
      }),
    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return deletePostit(ctx.user.id, input.id);
      }),
  }),

  // Proactive Tasks
  proactiveTasks: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getProactiveTasks(ctx.user.id);
    }),
    reschedule: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        const tasks = await getProactiveTasks(ctx.user.id);
        const task = tasks.find(t => t.id === input.id);
        if (!task || !task.schedule) return { success: false, message: "Task not found or not recurring" };

        let nextRun = new Date();
        const now = new Date();
        const schedule = task.schedule.toLowerCase();

        if (schedule === "1h" || schedule === "60m") {
          nextRun = addHours(task.nextRun || now, 1);
        } else if (schedule === "diario") {
          nextRun = addDays(task.nextRun || now, 1);
        } else if (schedule === "8-18h") {
          const lastRun = task.nextRun || now;
          let candidate = addHours(lastRun, 1);
          const hour = candidate.getHours();
          if (hour < 8) {
             candidate = setHours(setMinutes(candidate, 0), 8);
          } else if (hour >= 18) {
             candidate = addDays(setHours(setMinutes(candidate, 0), 8), 1);
          }
          nextRun = candidate;
        }

        await updateProactiveTask(ctx.user.id, input.id, {
          nextRun,
          status: "active"
        });

        return { success: true, nextRun };
      }),
    create: protectedProcedure
      .input(proactiveTaskCreateInputSchema)
      .mutation(async ({ ctx, input }) => {
        return createProactiveTask(ctx.user.id, {
          ...input,
          type: input.type as "cron" | "one-time" | "watcher" | "alerta_urgente" | "proactive",
        });
      }),
    update: protectedProcedure
      .input(proactiveTaskUpdateInputSchema)
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return updateProactiveTask(ctx.user.id, id, data);
      }),
  }),

  // Legal Module (Módulo Jurídico - Nova Implementação)
  legal: router({
    // Clientes Jurídicos
    getClients: protectedProcedure.query(async ({ ctx }) => {
      return getLegalClients(ctx.user.id);
    }),
    createClient: protectedProcedure
      .input(z.object({
        name: z.string(),
        email: z.string().email().optional().nullable(),
        phone: z.string().optional().nullable(),
        document: z.string().optional().nullable(),
        type: z.enum(["PF", "PJ"]).optional(),
        address: z.string().optional().nullable(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createLegalClient(ctx.user.id, input);
      }),
    updateClient: protectedProcedure
      .input(z.object({
        id: z.number(),
        name: z.string().optional(),
        email: z.string().email().optional().nullable(),
        phone: z.string().optional().nullable(),
        document: z.string().optional().nullable(),
        type: z.enum(["PF", "PJ"]).optional(),
        address: z.string().optional().nullable(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { id, ...data } = input;
        return updateLegalClient(ctx.user.id, id, data);
      }),

    // Processos
    getProcesses: protectedProcedure.query(async ({ ctx }) => {
      return getLegalProcesses(ctx.user.id);
    }),
    createProcess: protectedProcedure
      .input(z.object({
        processNumber: z.string(),
        title: z.string(),
        description: z.string().optional().nullable(),
        clientId: z.number(),
        actionTypeId: z.number(),
        category: z.string().default("Geral"),
        jurisdiction: z.string().default("Estadual"),
        courtType: z.string().default("Cível"),
        entryDate: z.string().default(() => new Date().toISOString().split('T')[0]),
        court: z.string().optional().nullable(),
        instance: z.string().optional().nullable(),
        status: z.string().optional(),
        value: z.number().optional().nullable(),
        distributionDate: z.string().optional().nullable(),
      }))
      .mutation(async ({ ctx, input }) => {
        return createLegalProcess(ctx.user.id, input);
      }),

    // Prazos
    getDeadlines: protectedProcedure.query(async ({ ctx }) => {
      return getLegalDeadlines(ctx.user.id);
    }),
    createDeadline: protectedProcedure
      .input(z.object({
        processId: z.number(),
        title: z.string(),
        description: z.string().optional().nullable(),
        dueDate: z.string(),
        startDate: z.string().default(() => new Date().toISOString().split('T')[0]),
        deadlineType: z.string().default("Prazo"),
        priority: z.enum(["baixa", "media", "alta", "urgente"]).optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { priority, ...rest } = input;
        return createLegalDeadline(ctx.user.id, {
          ...rest,
          urgency: priority,
        });
      }),

    // Audiências
    getHearings: protectedProcedure.query(async ({ ctx }) => {
      return getLegalHearings(ctx.user.id);
    }),
    createHearing: protectedProcedure
      .input(z.object({
        processId: z.number(),
        title: z.string(),
        description: z.string().optional().nullable(),
        hearingDate: z.string(),
        hearingTime: z.string().default("09:00"),
        location: z.string().optional().nullable(),
        hearingType: z.string().default("Audiência"),
        type: z.string().optional().nullable(),
      }))
      .mutation(async ({ ctx, input }) => {
        const { type, ...data } = input;
        return createLegalHearing(ctx.user.id, {
          ...data,
          hearingType: input.hearingType || type || "Audiência",
        });
      }),

    // Honorários
    getFees: protectedProcedure.query(async ({ ctx }) => {
      return getAttorneyFees(ctx.user.id);
    }),
    createFee: protectedProcedure
      .input(z.object({
        processId: z.number(),
        clientId: z.number(),
        title: z.string(),
        amount: z.number(),
        dueDate: z.string().optional().nullable(),
        status: z.enum(["pending", "paid", "overdue"]).optional(),
        feeType: z.string().default("Contratuais"),
      }))
      .mutation(async ({ ctx, input }) => {
        const { amount, ...data } = input;
        return createAttorneyFee(ctx.user.id, {
          ...data,
          agreedValue: amount,
        });
      }),

    // Modelos de Petição
    getTemplates: protectedProcedure.query(async () => {
      return getPetitionTemplates();
    }),

    // Geração de Peças
    generatePiece: protectedProcedure
      .input(
        z.object({
          content: z.string(),
          type: z.enum(["peticao", "parecer", "atendimento"]),
          title: z.string(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const outputs: any = {};
        const analysis = await analyzeContent(input.content);
        await ensureKnowledgeDirs();

        if (input.type === "peticao") {
          const content = await generatePeticao(input.content, input.title, analysis);
          const fileName = `peticao-${slugify(input.title)}-${Date.now()}.md`;
          const filePath = path.join(process.cwd(), "docs", "juridico", "peticoes", fileName);
          await fs.promises.writeFile(filePath, content, "utf-8");
          outputs.peticao = { path: filePath, fileName, type: "markdown" };
        } else if (input.type === "parecer") {
          const content = await generateParecer(input.content, analysis);
          const fileName = `parecer-${slugify(input.title)}-${Date.now()}.md`;
          const filePath = path.join(process.cwd(), "docs", "juridico", "pareceres", fileName);
          await fs.promises.writeFile(filePath, content, "utf-8");
          outputs.parecer = { path: filePath, fileName, type: "markdown" };
        } else if (input.type === "atendimento") {
          const content = await generateAtendimento(input.content, input.title);
          const fileName = `atendimento-${slugify(input.title)}-${Date.now()}.md`;
          const filePath = path.join(process.cwd(), "docs", "juridico", "atendimentos", fileName);
          await fs.promises.writeFile(filePath, content, "utf-8");
          outputs.atendimento = { path: filePath, fileName, type: "markdown" };
        }

        // Add to memory
        const memoryResult = await addMemoryEntry(
          ctx.user.id,
          `Gerada peça jurídica (${input.type}) sobre "${input.title}".`,
          `juridico, ${input.type}, ${input.title}`,
          "fact"
        );

        const memoryWarning =
          isMemoryGuardResult(memoryResult) && (memoryResult.blocked || memoryResult.skipped)
            ? memoryResult.policyMessage || "Memoria nao persistida por policy de seguranca."
            : null;

        return {
          success: true,
          title: input.title,
          outputs,
          memoryWarning,
        };
      }),
  }),

  securityCard: router({
    generate: protectedProcedure.mutation(async ({ ctx }) => {
      const userId = ctx.user.id;

      // Generate 50 positions (01-50) with 4-digit codes
      const rawCodes: Record<string, string> = {};
      const hashedCodes: Record<string, string> = {};

      for (let i = 1; i <= 50; i++) {
        const position = i.toString().padStart(2, "0");
        const code = Math.floor(1000 + Math.random() * 9000).toString(); // 4 digits
        rawCodes[position] = code;
        hashedCodes[position] = await bcrypt.hash(code, 10);
      }

      await createSecurityCard({
        userId,
        cardData: JSON.stringify(hashedCodes),
        status: "active",
      });

      return {
        success: true,
        card: {
          userName: ctx.user.name,
          userEmail: ctx.user.email,
          userId: ctx.user.id,
          codes: rawCodes,
        }
      };
    }),
    getStatus: protectedProcedure.query(async ({ ctx }) => {
      const card = await getActiveSecurityCard(ctx.user.id);
      return {
        hasCard: !!card,
        createdAt: card?.createdAt,
        status: card?.status,
      };
    }),
    requestPositions: publicProcedure
      .input(z.object({ email: z.string().email() }))
      .mutation(async ({ input }) => {
        const user = await getUserByEmail(input.email);
        if (!user || !user.id) {
          throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });
        }

        const card = await getActiveSecurityCard(user.id);
        if (!card) {
          throw new TRPCError({ code: "BAD_REQUEST", message: "Usuário não possui Carta de Segurança ativa" });
        }

        // Select 3 random positions
        const positions: string[] = [];
        while (positions.length < 3) {
          const pos = Math.floor(1 + Math.random() * 50).toString().padStart(2, "0");
          if (!positions.includes(pos)) positions.push(pos);
        }

        return {
          success: true,
          positions,
        };
      }),
    validate: publicProcedure
      .input(z.object({
        email: z.string().email(),
        answers: z.record(z.string(), z.string()), // { "03": "1234", "17": "5678", ... }
      }))
      .mutation(async ({ ctx, input }) => {
        const user = await getUserByEmail(input.email);
        if (!user || !user.id) throw new TRPCError({ code: "NOT_FOUND", message: "Usuário não encontrado" });

        const card = await getActiveSecurityCard(user.id);
        if (!card) throw new TRPCError({ code: "BAD_REQUEST", message: "Carta não encontrada" });

        // Brute force protection
        const recentAttempts = await getRecentSecurityCardAttempts(user.id);
        const failures = recentAttempts.filter(a => !a.success).length;
        if (failures >= 5) {
          throw new TRPCError({
            code: "TOO_MANY_REQUESTS",
            message: "Muitas tentativas incorretas. Tente novamente em 30 minutos."
          });
        }

        const hashedData = JSON.parse(card.cardData);
        let allCorrect = true;
        const positions = Object.keys(input.answers);

        for (const pos of positions) {
          const isMatch = await bcrypt.compare(input.answers[pos], hashedData[pos]);
          if (!isMatch) {
            allCorrect = false;
            break;
          }
        }

        // Log attempt
        await createSecurityCardAttempt({
          userId: user.id,
          positionsRequested: positions.join(","),
          success: allCorrect ? 1 : 0,
          ipAddress: ctx.req.ip,
        });

        if (!allCorrect) {
          throw new TRPCError({ code: "UNAUTHORIZED", message: "Códigos incorretos" });
        }

        // If correct, generate a temporary reset token
        const token = nanoid(48);
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes for security card reset

        await createPasswordResetToken({
          userId: user.id,
          token,
          expiresAt,
        });

        return { success: true, token };
      }),
  }),
  // Admin management router
  admin: router({
    getUsers: adminProcedure.query(async () => {
      return getAllUsers();
    }),

    updateUser: adminProcedure
      .input(
        z.object({
          userId: z.number(),
          name: z.string().optional(),
          email: z.string().email().optional(),
          role: z.enum(["user", "admin"]).optional(),
        })
      )
      .mutation(async ({ input }) => {
        await updateUser(input.userId, input);
        return { success: true };
      }),

    deleteUser: adminProcedure
      .input(z.object({ userId: z.number() }))
      .mutation(async ({ input }) => {
        await deleteUser(input.userId);
        return { success: true };
      }),

    getLogs: adminProcedure
      .input(z.object({ limit: z.number().default(50) }))
      .query(async ({ input }) => {
        return getSystemLogs(input.limit);
      }),

    getStats: adminProcedure.query(async () => {
      const usersList = await getAllUsers();
      const hardwareInfo = await getHardwareInfo();

      return {
        totalUsers: usersList.length,
        adminUsers: usersList.filter(u => u.role === "admin").length,
        activeSessions: usersList.filter(u => {
          const lastSeen = new Date(u.lastSignedIn).getTime();
          return Date.now() - lastSeen < 24 * 60 * 60 * 1000; // Active in last 24h
        }).length,
        system: {
          cpu: {
            model: hardwareInfo.cpuModel,
            cores: hardwareInfo.cpuCores,
          },
          memory: {
            totalGB: hardwareInfo.totalRam,
            availableGB: hardwareInfo.availableRam,
          },
          platform: hardwareInfo.platform,
        },
      };
    }),
  }),

  // Hardware detection and monitoring
  hardware: router({
    getInfo: publicProcedure.query(() => {
      return getHardwareInfo();
    }),

    getMetrics: publicProcedure.query(() => {
      return getHardwareMetrics();
    }),

    detectMode: protectedProcedure.query(async ({ ctx }) => {
      console.log(`[Hardware] Detecting mode for user ${ctx.user.id}`);
      const settings = await getUserSettings(ctx.user.id);
      const autoDetect = (settings?.autoDetectHardware ?? 1) === 1;
      const preferred = settings?.preferredMode;

      console.log(`[Hardware] Settings: autoDetect=${autoDetect}, preferred=${preferred}`);

      // ✅ Lista de modos válidos para type guard seguro
      const validModes = ["ECO", "STANDARD", "PERFORMANCE"] as const;
      type ValidMode = (typeof validModes)[number];

      const effectivePreferred: ValidMode | undefined =
        preferred &&
          preferred !== "AUTO" &&
          validModes.includes(preferred as ValidMode)
          ? (preferred as ValidMode)
          : undefined;

      const mode = detectOperationMode(autoDetect, effectivePreferred);
      const heavySoftware = getRunningHeavySoftware();

      console.log(`[Hardware] Detected mode: ${mode}`);

      return {
        mode,
        capabilities: getModeCapabilities(mode),
        isCompatible: isHardwareCompatible(mode),
        heavySoftware,
      };
    }),

    getRecommended: publicProcedure.query(() => {
      return getRecommendedMode();
    }),

    getModeCapabilities: publicProcedure
      .input(z.enum(["ECO", "STANDARD", "PERFORMANCE"]))
      .query(({ input }) => {
        return getModeCapabilities(input);
      }),

    recordSnapshot: protectedProcedure
      .input(
        z.object({
          cpuUsage: z.number().min(0).max(100),
          ramUsage: z.number().min(0).max(100),
          ramAvailable: z.number(),
          gpuUsage: z.number().optional(),
          gpuVram: z.number().optional(),
          mode: z.enum(["ECO", "STANDARD", "PERFORMANCE"]),
        })
      )
      .mutation(async ({ ctx, input }) => {
        await addHardwareSnapshot(ctx.user.id, input);
        return { success: true };
      }),

    getRecentSnapshots: protectedProcedure
      .input(z.object({ limitMinutes: z.number().default(60) }))
      .query(async ({ ctx, input }) => {
        return getRecentHardwareSnapshots(ctx.user.id, input.limitMinutes);
      }),
  }),

  // File processing router
  files: router({
    processFiles: protectedProcedure
      .input(
        z.array(
          z.object({
            name: z.string(),
            type: z.string(),
            content: z.string(), // base64
          })
        )
      )
      .mutation(async ({ input }) => {
        const results = await Promise.all(
          input.map(async file => {
            try {
              const ext = file.name.toLowerCase().split(".").pop();
              const buffer = Buffer.from(file.content, "base64");
              let extractedText = "";

              // PDF processing
              if (ext === "pdf" || file.type === "application/pdf") {
                if (file.content.includes("!!!")) {
                  throw new Error("Corrupted file content");
                }
                try {
                  extractedText = await ragExtractText(file.name, file.type, buffer);
                } catch (e) {
                  extractedText = `[Erro ao processar PDF: ${file.name}]`;
                }
              }
              // Word documents
              else if (["doc", "docx"].includes(ext || "")) {
                try {
                  extractedText = await ragExtractText(file.name, file.type, buffer);
                } catch (e) {
                  extractedText = `[Erro ao processar documento: ${file.name}]`;
                }
              }
              // Excel/CSV
              else if (["xls", "xlsx", "csv"].includes(ext || "")) {
                try {
                  extractedText = await ragExtractText(file.name, file.type, buffer);
                } catch (e) {
                  extractedText = `[Erro ao processar planilha: ${file.name}]`;
                }
              }
              // Text-based files (already have content)
              else {
                extractedText = buffer.toString("utf-8");
              }

              return {
                name: file.name,
                type: file.type,
                text: extractedText.substring(0, 50000), // Limit size
                size: buffer.length,
              };
            } catch (error) {
              return {
                name: file.name,
                type: file.type,
                text: `[Erro ao processar arquivo: ${file.name}]`,
                error: true,
                size: 0,
              } as any;
            }
          })
        );

        return results;
      }),

    extractText: protectedProcedure
      .input(
        z.object({
          fileName: z.string(),
          mimeType: z.string(),
          base64Content: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const buffer = Buffer.from(input.base64Content, "base64");
          const text = await ragExtractText(input.fileName, input.mimeType, buffer);
          return {
            success: true,
            text: text.substring(0, 100000),
            truncated: text.length > 100000,
          };
        } catch (error) {
          return {
            success: false,
            error: "Failed to extract text",
          };
        }
      }),
  }),

  // RAG Documents router
  documents: router({
    upload: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          mimeType: z.string(),
          base64Content: z.string(),
          externalId: z.string().optional(),
          sourceType: z.string().optional(),
          legalStatus: z.string().optional(),
          effectiveDate: z.string().optional(),
          autoIndex: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const buffer = Buffer.from(input.base64Content, "base64");
          const text = await ragExtractText(input.name, input.mimeType, buffer);
          const normalizedText = text.replace(/\s+/g, " ").trim();
          const contentHash = createHash("sha256").update(normalizedText).digest("hex");
          const deterministicExternalId = input.externalId?.trim() || `sha256:${contentHash}`;

          const existingDoc = await getDocumentByExternalId(
            ctx.user.id,
            deterministicExternalId
          );
          if (existingDoc) {
            return { success: true, document: existingDoc, deduplicated: true };
          }

          const chunks = chunkText(text);

          const estimatedSizeKB = Math.ceil((text.length + chunks.length * 3072 * 4) / 1024);

          const docData = {
            name: input.name,
            type: input.mimeType,
            size: buffer.length,
            status: (input.autoIndex === false ? "review" : "processing") as
              | "processing"
              | "review",
            isIndexed: 0,
            externalId: deterministicExternalId,
            sourceType: input.sourceType,
            legalStatus: input.legalStatus || "vigente",
            effectiveDate: input.effectiveDate,
            totalChunks: chunks.length,
            indexedChunks: 0,
            estimatedSizeKB,
          };

          const result = await createDocumentRAG(ctx.user.id, docData);
          const docId = (result as any)?.lastInsertRowid || (result as any)?.[0]?.id;

          if (!docId) {
            throw new Error("Failed to create document");
          }

          if (input.autoIndex === false) {
            await saveDocumentForReview(Number(docId), text);
          } else {
            void (async () => {
              try {
                await indexDocumentFromFile(Number(docId), {
                  name: input.name,
                  mimeType: input.mimeType,
                  buffer,
                });
              } catch (error) {
                console.error("[RAG] Background indexing error:", error);
                await updateDocumentStatusById(Number(docId), "error");
              }
            })();
          }

          const doc = await getDocumentByIdRAG(ctx.user.id, Number(docId));
          return {
            success: true,
            document: doc,
            needsReview: input.autoIndex === false,
            indexingStarted: input.autoIndex !== false,
          };
        } catch (error: any) {
          console.error("[RAG] Upload error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Failed to upload document",
          });
        }
      }),

    importJSON: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          externalId: z.string().optional(),
          sourceType: z.string().optional(),
          legalStatus: z.string().optional(),
          effectiveDate: z.string().optional(),
          content: z.string(),
          metadata: z.record(z.string(), z.unknown()).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const docId = await indexDocumentFromJSON(ctx.user.id, {
            name: input.name,
            externalId: input.externalId,
            sourceType: input.sourceType,
            legalStatus: input.legalStatus,
            effectiveDate: input.effectiveDate,
            content: input.content,
            metadata: input.metadata,
          });

          const doc = await getDocumentByIdRAG(ctx.user.id, docId);
          return { success: true, document: doc };
        } catch (error: any) {
          console.error("[RAG] Import JSON error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Failed to import document",
          });
        }
      }),

    importEmbeddings: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          externalId: z.string().optional(),
          sourceType: z.string().optional(),
          legalStatus: z.string().optional(),
          effectiveDate: z.string().optional(),
          chunks: z.array(z.object({
            chunkIndex: z.number(),
            content: z.string(),
            metadata: z.record(z.string(), z.unknown()).optional(),
            embedding: z.array(z.number()),
          })),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          const docData = {
            name: input.name,
            type: "application/json",
            size: JSON.stringify(input.chunks).length,
            status: "processing" as const,
            isIndexed: 0,
            externalId: input.externalId,
            sourceType: input.sourceType,
            legalStatus: input.legalStatus || "vigente",
            effectiveDate: input.effectiveDate,
            totalChunks: input.chunks.length,
            indexedChunks: 0,
            estimatedSizeKB: Math.ceil((input.chunks.length * 3072 * 4) / 1024),
          };

          const result = await createDocumentRAG(ctx.user.id, docData);
          const docId = (result as any)?.lastInsertRowid || (result as any)?.[0]?.id;

          if (!docId) {
            throw new Error("Failed to create document");
          }

          await importPrecomputedEmbeddings(Number(docId), input.chunks);
          await updateDocumentStatusById(Number(docId), "indexed");

          const doc = await getDocumentByIdRAG(ctx.user.id, Number(docId));
          return { success: true, document: doc };
        } catch (error: any) {
          console.error("[RAG] Import embeddings error:", error);
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: error.message || "Failed to import embeddings",
          });
        }
      }),

    list: protectedProcedure
      .input(
        z.object({
          legalStatus: z.string().optional(),
          sourceType: z.string().optional(),
        }).optional()
      )
      .query(async ({ ctx, input }) => {
        return getDocumentsRAG(ctx.user.id, input || {});
      }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const doc = await getDocumentByIdRAG(ctx.user.id, input.id);
        if (!doc) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found",
          });
        }
        return doc;
      }),

    getStatus: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const doc = await getDocumentByIdRAG(ctx.user.id, input.id);
        if (!doc) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found",
          });
        }
        return {
          id: doc.id,
          status: doc.status,
          indexedChunks: doc.indexedChunks,
          totalChunks: doc.totalChunks,
          progress: (doc.totalChunks ?? 0) > 0
            ? Math.round(((doc.indexedChunks ?? 0) / (doc.totalChunks ?? 1)) * 100)
            : 0,
        };
      }),

    updateLifecycle: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          legalStatus: z.string(),
          expiryDate: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const doc = await getDocumentByIdRAG(ctx.user.id, input.id);
        if (!doc) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found",
          });
        }

        const status = input.legalStatus as "vigente" | "ab-rogada" | "derrogada" | "extinta";

        if (status === "ab-rogada" || status === "derrogada" || status === "extinta") {
          await purgeDocumentChunks(input.id);
        }

        await updateDocumentLifecycle(ctx.user.id, input.id, status, input.expiryDate);

        return { success: true };
      }),

    replace: protectedProcedure
      .input(
        z.object({
          externalId: z.string(),
          newData: z.object({
            name: z.string().optional(),
            type: z.string().optional(),
            size: z.number().optional(),
            externalId: z.string().optional(),
          }),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const result = await replaceDocument(ctx.user.id, input.externalId, input.newData);
        return { success: true, newDocumentId: result.id, supersededById: result.supersededById };
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await hardDeleteDocument(ctx.user.id, input.id);
        return { success: true };
      }),

    purgeChunks: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        await purgeDocumentChunks(input.id);
        return { success: true };
      }),

    search: protectedProcedure
      .input(
        z.object({
          query: z.string(),
          topK: z.number().default(5),
          documentIds: z.array(z.number()).optional(),
          minScore: z.number().default(0.5),
        })
      )
      .query(async ({ ctx, input }) => {
        return searchRelevantChunks(input.query, ctx.user.id, input.topK, {
          documentIds: input.documentIds,
          minScore: input.minScore,
        });
      }),

    getStorageStats: protectedProcedure.query(async ({ ctx }) => {
      return getRAGStorageStats(ctx.user.id);
    }),

    approveReview: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const doc = await getDocumentByIdRAG(ctx.user.id, input.id);
        if (!doc) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found",
          });
        }

        void (async () => {
          try {
            await approveDocumentFromReview(input.id);
          } catch (error) {
            console.error("[RAG] Review approval/indexing error:", error);
            await updateDocumentStatusById(input.id, "error");
          }
        })();

        const updated = await getDocumentByIdRAG(ctx.user.id, input.id);
        return { success: true, document: updated, indexingStarted: true };
      }),

    rejectReview: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const doc = await getDocumentByIdRAG(ctx.user.id, input.id);
        if (!doc) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Document not found",
          });
        }

        await updateDocumentStatusById(input.id, "rejected");
        const updated = await getDocumentByIdRAG(ctx.user.id, input.id);
        return { success: true, document: updated };
      }),

    vacuum: protectedProcedure.mutation(async ({ ctx }) => {
      const expiredDocs = await cleanupExpiredDocuments(ctx.user.id);
      const oldMemories = await cleanupOldMemories(ctx.user.id);
      const oldTasks = await cleanupCompletedTasks(ctx.user.id, 30);

      return {
        documentsDeleted: expiredDocs.deleted,
        memoriesArchived: oldMemories.archived,
        tasksDeleted: oldTasks.deleted,
      };
    }),
  }),

  // Agent management router
  agents: router({
    list: protectedProcedure.query(async ({ ctx }) => {
      return getAgents(ctx.user.id);
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        const agent = await getAgentById(ctx.user.id, input.id);
        if (!agent) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Agente não encontrado",
          });
        }
        return agent;
      }),

    create: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1),
          role: z.string().min(1),
          description: z.string().optional(),
          systemPrompt: z.string().min(1),
          isActive: z.boolean().default(true),
        })
      )
      .mutation(async ({ ctx, input }) => {
        return createAgent(ctx.user.id, {
          ...input,
          isActive: input.isActive,
          userId: ctx.user.id,
        });
      }),

    update: protectedProcedure
      .input(
        z.object({
          id: z.number(),
          name: z.string().optional(),
          role: z.string().optional(),
          description: z.string().optional(),
          systemPrompt: z.string().optional(),
          isActive: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { id, ...updates } = input;
        const mappedUpdates: any = { ...updates };
        // isActive is boolean in Drizzle schema with mode: "boolean"
        // if (updates.isActive !== undefined) {
        //   mappedUpdates.isActive = updates.isActive;
        // }
        return updateAgent(ctx.user.id, id, mappedUpdates);
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return deleteAgent(ctx.user.id, input.id);
      }),
  }),

  // Chat and conversation management
  chat: router({
    createConversation: protectedProcedure
      .input(
        z.object({
          title: z.string(),
          mode: z.enum(["ECO", "STANDARD", "PERFORMANCE"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const settings = await getUserSettings(ctx.user.id);
        const mode = input.mode || (settings?.preferredMode as any) || "ECO";
        const res = await createConversation(ctx.user.id, input.title, mode);
        return { conversationId: (res as any).id ?? res };
      }),

    listConversations: protectedProcedure.query(async ({ ctx }) => {
      return getConversations(ctx.user.id);
    }),

    getConversation: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ ctx, input }) => {
        const conv = await getConversationById(
          input.conversationId,
          ctx.user.id
        );
        if (!conv) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Conversation not found",
          });
        }
        return conv;
      }),

    getMessages: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ ctx, input }) => {
        const conv = await getConversationById(
          input.conversationId,
          ctx.user.id
        );
        if (!conv) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Conversation not found",
          });
        }
        return getMessages(input.conversationId);
      }),

    listSkillProfiles: protectedProcedure.query(async () => {
      return listSkillProfiles();
    }),

    // Rename conversation
    renameConversation: protectedProcedure
      .input(z.object({ conversationId: z.number(), title: z.string() }))
      .mutation(async ({ ctx, input }) => {
        const conv = await renameConversation(
          input.conversationId,
          ctx.user.id,
          input.title
        );
        if (!conv) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Conversation not found or not authorized",
          });
        }
        return { success: true, conversation: conv };
      }),

    // Toggle favorite
    toggleFavorite: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const conv = await toggleFavorite(input.conversationId, ctx.user.id);
        if (!conv) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Conversation not found or not authorized",
          });
        }
        return { success: true, conversation: conv };
      }),

    // Delete conversation
    deleteConversation: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const success = await deleteConversation(
          input.conversationId,
          ctx.user.id
        );
        if (!success) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Conversation not found or not authorized",
          });
        }
        return { success: true };
      }),

    // Save conversation to RAG memory
    saveToRag: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .mutation(async ({ ctx, input }) => {
        const conv = await getConversationById(
          input.conversationId,
          ctx.user.id
        );
        if (!conv) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Conversation not found",
          });
        }

        const msgs = await getMessages(input.conversationId);
        if (msgs.length === 0) {
          return { success: false, message: "No messages to save" };
        }

        // Format conversation for RAG
        const conversationText = msgs
          .map(m => `${m.role === "user" ? "Usuário" : "Assistente"}: ${m.content}`)
          .join("\n\n");

        const summary = `Conversa: ${conv.title}\n\n${conversationText}`;
        const keywords = extractKeywords(conv.title + " " + conversationText).join(", ");

        const memoryResult = await addMemoryEntry(
          ctx.user.id,
          summary,
          keywords,
          "context"
        );

        if (isMemoryGuardResult(memoryResult) && (memoryResult.blocked || memoryResult.skipped)) {
          return {
            success: true,
            memorySaved: false,
            memoryMessage: memoryResult.policyMessage || "Memoria bloqueada pela policy.",
          };
        }

        return { success: true, memorySaved: true };
      }),

    // Export conversation in various formats (json/md/html/pdf)
    exportConversation: protectedProcedure
      .input(
        z.object({
          conversationId: z.number(),
          format: z.enum(["json", "md", "html", "pdf"]).default("json"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const routeStartMs = Date.now();
        const conv = await getConversationById(
          input.conversationId,
          ctx.user.id
        );
        if (!conv) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Conversation not found",
          });
        }
        const msgs = await getMessages(input.conversationId);

        const meta = {
          id: (conv as any).id,
          title: (conv as any).title,
          createdAt: (conv as any).createdAt,
          updatedAt: (conv as any).updatedAt,
        };

        if (input.format === "json") {
          const payload = { meta, messages: msgs };
          const content = Buffer.from(
            JSON.stringify(payload, null, 2)
          ).toString("base64");
          return {
            success: true,
            file: {
              filename: `conversation-${meta.id}.json`,
              mimeType: "application/json",
              contentBase64: content,
            },
          };
        }

        // Build Markdown
        let md = `# ${meta.title}\n\n`;
        md += `**id:** ${meta.id}  \n**createdAt:** ${meta.createdAt}  \n**updatedAt:** ${meta.updatedAt}\n\n`;
        msgs.forEach((m: any) => {
          md += `- **${m.role}** (${new Date(m.createdAt).toISOString()}):\n\n${m.content}\n\n`;
        });

        if (input.format === "md") {
          return {
            success: true,
            file: {
              filename: `conversation-${meta.id}.md`,
              mimeType: "text/markdown",
              contentBase64: Buffer.from(md).toString("base64"),
            },
          };
        }

        if (input.format === "html" || input.format === "pdf") {
          const html = `<!doctype html><html><head><meta charset="utf-8"><title>${meta.title}</title></head><body><pre>${md.replace(/</g, "&lt;")}</pre></body></html>`;
          const mime =
            input.format === "html" ? "text/html" : "application/pdf";
          return {
            success: true,
            file: {
              filename: `conversation-${meta.id}.${input.format}`,
              mimeType: mime,
              contentBase64: Buffer.from(html).toString("base64"),
            },
          };
        }

        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Unsupported format",
        });
      }),

    sendMessage: protectedProcedure
      .input(
        z.object({
          conversationId: z.number(),
          content: z.string(),
          provider: z.enum(["forge", "ollama"]).optional(),
          model: z.string().optional(),
          ollamaBaseUrl: z.string().url().optional(),
          ollamaAuthToken: z.string().optional(),
          imageBase64: z.string().optional(),
          imageMimeType: z
            .enum(["image/png", "image/jpeg", "image/webp", "image/gif"])
            .optional(),
          attachments: z
            .array(
              z.object({
                name: z.string(),
                type: z.string(),
                category: z.enum([
                  "image",
                  "code",
                  "document",
                  "data",
                  "unknown",
                ]),
                content: z.string().optional(),
                textContent: z.string().optional(),
              })
            )
            .optional(),
          context: z
            .object({
              summary: z.string().optional(),
              recentMessages: z
                .array(
                  z.object({
                    role: z.enum(["user", "assistant", "system"]),
                    content: z.string(),
                    timestamp: z.string(),
                  })
                )
                .optional(),
              totalPreviousMessages: z.number().optional(),
              currentModule: z.enum(["GENERAL", "LEGAL", "MEDICAL", "DEVELOPER"]).optional(),
              activeSkill: z.string().optional(),
            })
            .optional(),
          documentIds: z.array(z.number()).optional(),
          confirmCriticalOperation: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const routeStartMs = Date.now();
        const parsedDomainFromRaw = parseChatDomainMode(input.content);
        const modeSkillId =
          parsedDomainFromRaw.mode === "professor"
            ? "professor-mestre-da-oab"
            : undefined;
        const resolvedActiveSkillId = input.context?.activeSkill || modeSkillId;
        const resolvedModule =
          input.context?.currentModule ||
          (parsedDomainFromRaw.mode === "programacao" ? "DEVELOPER" : undefined);
        const conv = await getConversationById(
          input.conversationId,
          ctx.user.id
        );
        if (!conv) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Conversation not found",
          });
        }

        const canonicalRole = ctx.user.role === "admin" ? "admin" : "user";
        const guardResult = runGuardRails({
          canal: "chat",
          usuario: {
            id: ctx.user.id,
            role: canonicalRole,
            name: ctx.user.name ?? undefined,
          },
          payload: {
            type: "text",
            content: input.content,
          },
          context: {
            conversationId: String(input.conversationId),
            skillId: resolvedActiveSkillId,
          },
        });

        logGuardRailStage({
          request_id: guardResult.request_id,
          route: "chat.sendMessage",
          stage: "entry",
          details: { conversationId: input.conversationId },
        });

        if (guardResult.classification) {
          logGuardRailStage({
            request_id: guardResult.request_id,
            route: "chat.sendMessage",
            stage: "classification",
            details: {
              intent: guardResult.classification.intent,
              confidence: guardResult.classification.confidence,
              risk_level: guardResult.classification.risk_level,
            },
          });
        }

        if (guardResult.policy) {
          logGuardRailStage({
            request_id: guardResult.request_id,
            route: "chat.sendMessage",
            stage: "policy_applied",
            details: {
              decision: guardResult.policy.decision,
              reason: guardResult.policy.reason,
            },
          });
        }

        if (!guardResult.allowed) {
          const blockedMessage = guardResult.blocked_message || "Solicitacao bloqueada pelas politicas de seguranca.";
          await addMessage(input.conversationId, "assistant", blockedMessage);
          recordRouteMetric({
            route: "chat.sendMessage",
            status: guardResult.policy?.decision === "fallback" ? "fallback" : "blocked",
            latency_ms: Date.now() - routeStartMs,
          });
          return {
            userMessage: input.content,
            assistantMessage: blockedMessage,
            attachmentsProcessed: 0,
            success: false,
            blocked: true,
          };
        }

        if (
          guardResult.policy?.decision === "confirm" &&
          !input.confirmCriticalOperation
        ) {
          const confirmMessage =
            guardResult.policy.required_action ||
            "Esta operacao requer confirmacao explicita.";
          await addMessage(input.conversationId, "assistant", confirmMessage);
          recordRouteMetric({
            route: "chat.sendMessage",
            status: "blocked",
            latency_ms: Date.now() - routeStartMs,
          });
          return {
            userMessage: input.content,
            assistantMessage: confirmMessage,
            attachmentsProcessed: 0,
            success: false,
            blocked: true,
          };
        }

        let sanitizedUserContent = sanitizeString(input.content, {
          request_id: guardResult.request_id,
          user_id: ctx.user.id,
        });

        const parsedDomain = parseChatDomainMode(sanitizedUserContent);
        const isModeCommandOnly =
          parsedDomain.matched &&
          parsedDomain.content.length === 0 &&
          !input.imageBase64 &&
          (input.attachments?.length || 0) === 0;

        if (parsedDomain.matched) {
          sanitizedUserContent = parsedDomain.content;
        }

        if (isModeCommandOnly) {
          await addMessage(input.conversationId, "user", input.content);
          const modeActivated = buildModeActivatedMessage(parsedDomain.mode);
          await addMessage(input.conversationId, "assistant", modeActivated);
          return {
            userMessage: input.content,
            assistantMessage: modeActivated,
            attachmentsProcessed: 0,
            success: true,
            provider: input.provider || "ollama",
            model: input.model || null,
          };
        }

        const attachments = (input.attachments || []).map((attachment) => ({
          ...attachment,
          textContent: attachment.textContent
            ? sanitizeString(attachment.textContent, {
              request_id: guardResult.request_id,
              user_id: ctx.user.id,
            })
            : attachment.textContent,
          content: attachment.category === "image"
            ? attachment.content
            : attachment.content
              ? sanitizeString(attachment.content, {
                request_id: guardResult.request_id,
                user_id: ctx.user.id,
              })
              : attachment.content,
        }));

        let messageContent = sanitizedUserContent;
        let isProductIntent =
          parsedDomain.mode === "loja"
            ? true
            : parsedDomain.mode === "programacao" || parsedDomain.mode === "professor"
              ? false
              : isOperationalProductIntent(sanitizedUserContent);
        const selectedProvider = input.provider || "ollama";
        const selectedModel = input.model || "";
        const modelLower = selectedModel.toLowerCase();
        const isVisionHeavy =
          !!input.imageBase64 ||
          attachments.some(a => a.category === "image") ||
          modelLower.includes("qwen3-vl") ||
          modelLower.includes("qwen3.5-vl") ||
          modelLower.includes("qwen2.5-vl");
        const hasDocumentContext = attachments.some(
          a => a.category === "document" || a.category === "data" || a.category === "code"
        );
        const attachmentCharLimit = selectedProvider === "ollama" ? 3000 : 8000;

        // Build context from attachments
        if (attachments.length > 0) {
          const codeFiles = attachments.filter(
            a => a.category === "code" || a.category === "data"
          );
          const documents = attachments.filter(a => a.category === "document");

          if (codeFiles.length > 0) {
            messageContent += "\n\n### Arquivos de Código Anexados:\n";
            codeFiles.forEach(file => {
              messageContent += `\n\`\`\`${file.name.split(".").pop() || ""}\n`;
              messageContent += `// Arquivo: ${file.name}\n`;
              // Limitar conteúdo do arquivo anexado para economia de tokens
              const text = file.textContent || "";
              messageContent +=
                text.length > attachmentCharLimit
                  ? text.slice(0, attachmentCharLimit) + "\n[... CONTEÚDO TRUNCADO PARA ECONOMIA DE TOKENS ...]"
                  : text;
              messageContent += "\n```\n";
            });
          }

          if (documents.length > 0) {
            messageContent += "\n\n### Documentos Anexados:\n";
            documents.forEach(doc => {
              messageContent += `\n[Documento: ${doc.name}]\n`;
              const text = doc.textContent || "[Conteúdo não extraído]";
              messageContent +=
                text.length > attachmentCharLimit
                  ? text.slice(0, attachmentCharLimit) + "\n[... CONTEÚDO TRUNCADO PARA ECONOMIA DE TOKENS ...]"
                  : text;
              messageContent += "\n";
            });
          }
        }

        // Add user message
        await addMessage(input.conversationId, "user", messageContent);

        const directScheduling = await tryHandleDirectSchedulingIntent({
          userId: ctx.user.id,
          conversationId: input.conversationId,
          userContent: sanitizedUserContent,
        });

        if (directScheduling.handled && directScheduling.assistantMessage) {
          await addMemoryEntry(
            ctx.user.id,
            sanitizedUserContent,
            extractKeywords(sanitizedUserContent).join(", "),
            "context"
          );

          await addMemoryEntry(
            ctx.user.id,
            directScheduling.assistantMessage,
            extractKeywords(directScheduling.assistantMessage).join(", "),
            "context"
          );

          recordRouteMetric({
            route: "chat.sendMessage",
            status: "success",
            latency_ms: Date.now() - routeStartMs,
          });

          return {
            userMessage: sanitizedUserContent,
            assistantMessage: directScheduling.assistantMessage,
            attachmentsProcessed: attachments.length,
            success: true,
            provider: selectedProvider,
            model: input.model || null,
          };
        }

        if (
          parsedDomain.mode === "default" &&
          !isProductIntent &&
          hasProductCatalogHint(sanitizedUserContent)
        ) {
          try {
            const directProbe = await searchProducts(sanitizedUserContent.trim(), 5);
            if (directProbe.length > 0) {
              isProductIntent = true;
            }
          } catch (probeError) {
            console.warn("[Products] Direct probe failed:", probeError);
          }
        }

        if (isProductIntent && !isProductMutationIntent(sanitizedUserContent)) {
          const quoteMode = isQuoteIntent(sanitizedUserContent);
          const quotePayload = quoteMode ? extractQuotePayload(sanitizedUserContent) : "";
          const queryTerm = quoteMode
            ? extractQuoteItemTerm(sanitizedUserContent)
            : sanitizedUserContent.trim();
          const limit = quoteMode ? 8 : 200;
          const directProductResults = await searchProducts(queryTerm, limit);
          const assistantContent =
            directProductResults.length > 0
              ? quoteMode
                ? [
                  `Para montar o orçamento, encontrei ${directProductResults.length} produto(s) para "${queryTerm}".`,
                  quotePayload ? `Pedido recebido: ${quotePayload}` : "",
                  "",
                  ...directProductResults.map(
                    (p: any) =>
                      `- ${p.name} | Ref: ${p.referenceId || "N/A"} | Preço: R$${p.price ?? "N/A"} | Estoque: ${p.stock ?? "N/A"}`
                  ),
                  "",
                  "Me informe a referência exata e a quantidade para eu gerar o orçamento no layout de pedido.",
                ].join("\n")
                : formatProductOperationalList(directProductResults as any, 200)
              : "Não encontrei produtos relacionados no banco para este termo. Tente informar marca, gramatura, formato ou referência.";

          await addMessage(input.conversationId, "assistant", assistantContent);

          await addMemoryEntry(
            ctx.user.id,
            sanitizedUserContent,
            extractKeywords(sanitizedUserContent).join(", "),
            "context"
          );

          await addMemoryEntry(
            ctx.user.id,
            assistantContent,
            extractKeywords(assistantContent).join(", "),
            "context"
          );

          const outputValidation = validateOutputContract({
            request_id: guardResult.request_id,
            intent: guardResult.classification?.intent ?? "informacional",
            output: {
              status: "success",
              message: assistantContent,
            },
          });

          logGuardRailStage({
            request_id: guardResult.request_id,
            route: "chat.sendMessage",
            stage: "output_validation",
            details: {
              valid: outputValidation.success,
            },
          });

          recordRouteMetric({
            route: "chat.sendMessage",
            status: outputValidation.success ? "success" : "fallback",
            latency_ms: Date.now() - routeStartMs,
          });

          logGuardRailStage({
            request_id: guardResult.request_id,
            route: "chat.sendMessage",
            stage: "response",
            details: {
              status: outputValidation.success ? "success" : "fallback",
            },
          });

          return {
            assistantMessage: outputValidation.success
              ? assistantContent
              : String(outputValidation.fallback_output.message),
            provider: selectedProvider,
            model: input.model || null,
          };
        }

        // Get LLM response
        try {
          // ✅ MELHORIA: Busca na memória mais inteligente
          const searchTerms = extractKeywords(sanitizedUserContent);
          const memories = await searchMemoryByKeywords(
            ctx.user.id,
            searchTerms.join(" ") || sanitizedUserContent
          );
          const history = await getMessages(input.conversationId);
          let productProbeHints: Array<{
            referenceId: string | null;
            name: string;
            price: number | null;
            stock: number | null;
            status: string | null;
            ncm: string | null;
          }> = [];

          if (
            parsedDomain.mode === "default" &&
            !isProductIntent &&
            hasProductCatalogHint(sanitizedUserContent)
          ) {
            try {
              const probeMatches = await searchProducts(sanitizedUserContent.trim());
              if (probeMatches.length > 0) {
                isProductIntent = true;
                productProbeHints = probeMatches.slice(0, 8) as any;
              }
            } catch (probeError) {
              console.warn("[Products] Probe failed:", probeError);
            }
          }

          // ✅ NOVA MELHORIA: Obter informação de data/hora atual
          const now = new Date();
          const daysOfWeek = [
            "domingo",
            "segunda-feira",
            "terça-feira",
            "quarta-feira",
            "quinta-feira",
            "sexta-feira",
            "sábado",
          ];
          const months = [
            "janeiro",
            "fevereiro",
            "março",
            "abril",
            "maio",
            "junho",
            "julho",
            "agosto",
            "setembro",
            "outubro",
            "novembro",
            "dezembro",
          ];
          const dayOfWeek = daysOfWeek[now.getDay()];
          const month = months[now.getMonth()];
          const day = now.getDate();
          const year = now.getFullYear();
          const hours = String(now.getHours()).padStart(2, "0");
          const minutes = String(now.getMinutes()).padStart(2, "0");
          const seconds = String(now.getSeconds()).padStart(2, "0");

          let timeGreeting = "";
          const hour = now.getHours();
          if (hour >= 5 && hour < 12) {
            timeGreeting = "Bom dia";
          } else if (hour >= 12 && hour < 18) {
            timeGreeting = "Boa tarde";
          } else if (hour >= 18 || hour < 5) {
            timeGreeting = "Boa noite";
          }

          const dateTimeInfo = `Informação de hora/data atual (para referência): ${timeGreeting}! Hoje é ${dayOfWeek}, ${day} de ${month} de ${year}. Horário: ${hours}:${minutes}:${seconds}. Utilize essas informações ao responder perguntas sobre hora, data, dia da semana ou época.`;

          let systemContent =
            "Você é um assistente virtual inteligente e adaptativo. Responda de forma clara e concisa em português. " +
            dateTimeInfo;

          if (parsedDomain.mode === "programacao") {
            systemContent +=
              "\n\n[Modo de Conversa: PROGRAMACAO] Foque estritamente em desenvolvimento de software (codigo, arquitetura, SQL, APIs, debug, testes). Ignore contexto anterior que nao seja tecnico de programacao.";
          }

          if (parsedDomain.mode === "professor") {
            systemContent +=
              "\n\n[Modo de Conversa: PROFESSOR] Explique de forma didatica, por etapas e com exemplos objetivos. Priorize clareza e progressao de aprendizado.";
          }

          if (parsedDomain.mode === "loja") {
            systemContent +=
              "\n\n[Modo de Conversa: LOJA] Priorize dados operacionais de produtos e use ferramentas de catalogo quando necessario.";
          }

          systemContent +=
            "\n\n[ACESSO A DADOS]: Você tem acesso ao banco de dados local do sistema via ferramentas internas (ex.: gerenciar_produtos e criar_lembrete). Não diga que não tem acesso ao banco quando a ação puder ser executada por tool.";

          if (isProductIntent) {
            systemContent +=
              "\n\n[POLITICA DE FONTE - PRODUTOS OPERACIONAIS]: Para perguntas sobre produtos, preços, estoque, NCM, referência/código ou catálogo da Roberto Papéis, trate a tabela products como fonte de verdade. Nao use documentos RAG para valores operacionais. Priorize chamar a ferramenta gerenciar_produtos para buscar/atualizar dados em tempo real.";
          }

          const fullReadIntent =
            /(ler|leia|leitura|resuma|resumo|sinopse|inteiro|completo|cap[ií]tulo|livro)/i.test(
              sanitizedUserContent
            );

          // RAG: Buscar chunks relevantes se o usuário especificou documentos ou Wants contexto de conhecimento
          let ragChunks: any[] = [];
          const requestedDocIds = input.documentIds;
          const shouldAttemptRag =
            !isProductIntent &&
            ((requestedDocIds && requestedDocIds.length > 0) ||
              (parsedDomain.mode === "default" && sanitizedUserContent.trim().length >= 12));
          if (shouldAttemptRag) {
            try {
              const memoryContext = "";
              const preferencesContext = "";

              const patched = await retrieveRelevantChunksPatched({
                userId: ctx.user.id,
                query: sanitizedUserContent,
                provider: selectedProvider,
                topK: selectedProvider === "ollama" ? 3 : 5,
                memoryContext,
                preferencesContext,
                exploratory: /(busca ampla|vis[aã]o geral|panorama|todos os documentos|sem filtro)/i.test(sanitizedUserContent),
                documentIds: requestedDocIds && requestedDocIds.length > 0 ? requestedDocIds : undefined,
              });
              ragChunks = patched.chunks;

              if (patched.userNotice) {
                systemContent += `\n\n[Nota de retrieval]: ${patched.userNotice}`;
              }

              console.log(
                `[RAG] Found ${ragChunks.length} relevant chunks` +
                (requestedDocIds && requestedDocIds.length > 0
                  ? ` from ${requestedDocIds.length} selected document(s)`
                  : " (automatic search over active documents)")
              );
            } catch (error) {
              console.warn("[RAG] Search failed:", error);
            }
          }

          const ragEvidence = ragChunks.map((chunk) => ({
            source_name: String(chunk.documentName || "desconhecido"),
            source_domain: "docs",
            score: Number(chunk.score || 0),
            citation: `[${chunk.documentName || "Documento"}, Chunk ${chunk.chunkIndex}]`,
          }));

          const ragValidation = validateRagOutput({
            request_id: guardResult.request_id,
            domain: resolvedModule === "LEGAL" ? "juridico" : "geral",
            answer: sanitizedUserContent,
            evidence: ragEvidence,
          });

          if (!ragValidation.allowed) {
            const keepRequestedDocs = Boolean(requestedDocIds && requestedDocIds.length > 0);
            if (!keepRequestedDocs) {
              ragChunks = [];
            }
          }

          if (ragChunks.length > 0) {
            systemContent += "\n\n[Documentos do Conhecimento]:";
            ragChunks.forEach((chunk, idx) => {
              const chunkText =
                selectedProvider === "ollama" && typeof chunk.content === "string"
                  ? chunk.content.slice(0, 300)
                  : chunk.content;
              systemContent += `\n\n--- Trecho ${idx + 1} [${chunk.documentName} - Chunk ${chunk.chunkIndex}] (similaridade: ${(chunk.score * 100).toFixed(1)}%) ---\n`;
              systemContent += chunkText;
            });
            systemContent +=
              "\n\n[REGRAS DE RESPOSTA COM RAG]: Responda apenas com base nos trechos acima. " +
              "Nao invente dados, nomes, numeros ou fatos. Se a informacao nao estiver nos trechos, diga exatamente: " +
              "'Nao encontrei essa informacao nos documentos selecionados.' " +
              "Quando houver informacao factual nos trechos, priorize texto literal e cite a fonte no formato [Nome do Documento, Chunk X].";
          }

          if (requestedDocIds && requestedDocIds.length > 0) {
            const requestedDocs = await Promise.all(
              requestedDocIds.map((id) => getDocumentByIdRAG(ctx.user.id, id))
            );

            const notIndexed = requestedDocs.filter(
              (doc) => doc && doc.status !== "indexed"
            );

            if (notIndexed.length > 0) {
              systemContent += "\n\n[Status da Base de Documentos]:";
              notIndexed.forEach((doc) => {
                systemContent += `\n- Documento '${doc!.name}' ainda não está indexado (status: ${doc!.status}). Informe isso ao usuário e sugira aguardar a indexação.`;
              });
            }

            if (fullReadIntent && requestedDocIds.length === 1) {
              const target = requestedDocs[0];
              if (target && target.status === "indexed") {
                const allChunks = await getDocumentChunks(target.id);
                if (allChunks.length > 0) {
                  const pickedIndexes = new Set<number>();

                  for (let i = 0; i < Math.min(4, allChunks.length); i++) pickedIndexes.add(i);
                  for (let i = Math.max(0, allChunks.length - 4); i < allChunks.length; i++) pickedIndexes.add(i);

                  const spreadCount = 6;
                  const step = Math.max(1, Math.floor(allChunks.length / (spreadCount + 1)));
                  for (let i = 1; i <= spreadCount; i++) {
                    const idx = Math.min(allChunks.length - 1, i * step);
                    pickedIndexes.add(idx);
                  }

                  const sampledChunks = Array.from(pickedIndexes)
                    .sort((a, b) => a - b)
                    .map((idx) => allChunks[idx]);

                  systemContent += `\n\n[Leitura Ampla do Documento Selecionado: ${target.name}]`;
                  systemContent += "\nUse os trechos amostrados abaixo para responder perguntas gerais sobre o livro/documento inteiro:";

                  sampledChunks.forEach((chunk, idx) => {
                    const excerpt =
                      chunk.content.length > 1200
                        ? `${chunk.content.slice(0, 1200)}\n[...trecho truncado...]`
                        : chunk.content;
                    systemContent += `\n\n--- Amostra ${idx + 1} [Chunk ${chunk.chunkIndex}] ---\n${excerpt}`;
                  });
                }
              }
            }
          }

          if (isProductIntent) {
            try {
              const refCandidate = extractReferenceCandidate(sanitizedUserContent);
              let productHints: Array<{ referenceId: string | null; name: string; price: number | null; stock: number | null; status: string | null; ncm: string | null }> = [];

              if (productProbeHints.length > 0) {
                productHints = productProbeHints;
              }

              if (productHints.length === 0 && refCandidate) {
                const byRef = await getProductByRef(refCandidate);
                if (byRef) {
                  productHints = [byRef as any];
                }
              }

              if (productHints.length === 0) {
                const found = await searchProducts(sanitizedUserContent.trim());
                if (found.length > 0) {
                  productHints = found.slice(0, 8) as any;
                }
              }

              if (productHints.length === 0) {
                productHints = (await getAllProducts(5)) as any;
              }

              if (productHints.length > 0) {
                systemContent += "\n\n[Snapshot Operacional de Produtos]:";
                systemContent += productHints
                  .slice(0, 8)
                  .map(
                    (p) =>
                      `\n- ${p.name} | Ref: ${p.referenceId || "N/A"} | Preço: R$${p.price ?? "N/A"} | Estoque: ${p.stock ?? "N/A"} | Status: ${p.status || "N/A"} | NCM: ${p.ncm || "N/A"}`
                  )
                  .join("");
                systemContent +=
                  "\nSe precisar de atualização ou detalhe adicional, chame a ferramenta gerenciar_produtos.";
              }
            } catch (productCtxError) {
              console.warn("[Products] Failed to build operational context:", productCtxError);
            }
          }

          if (memories.length > 0) {
            systemContent += formatMemoriesForPrompt(memories);
          }

          if (input.context?.summary) {
            systemContent += `\n\n[Contexto da Conversa]: ${input.context.summary}`;
          }

          if (
            input.context?.recentMessages &&
            input.context.recentMessages.length > 0
          ) {
            systemContent += "\n\n[Mensagens Anteriores Relevantes]:";
            input.context.recentMessages.slice(-5).forEach(msg => {
              systemContent += `\n${msg.role === "user" ? "Usuário" : "Assistente"}: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? "..." : ""}`;
            });
          }

          if (resolvedModule) {
            systemContent += `\n\n[Módulo Atual]: ${resolvedModule}`;
            if (resolvedModule === "LEGAL") {
              systemContent += "\nVocê está operando no Módulo Jurídico. Use as ferramentas jurídicas disponíveis para gerenciar processos, prazos e clientes quando necessário.";
            }
          }

          if (resolvedActiveSkillId) {
            const skillId = normalizeSkillId(resolvedActiveSkillId);
            const skillProfile = readSkillProfile(skillId);
            const skillInstruction = loadSkillInstruction(skillId);
            const hasContract = ensureSkillGovernanceContract(skillId);

            if (skillProfile && skillInstruction && hasContract) {
              systemContent += `\n\n[Skill Ativa]: ${skillProfile.id} - ${skillProfile.title}`;
              systemContent += `\n[Descricao da Skill]: ${skillProfile.description}`;
              systemContent += `\n[Aplique rigorosamente as instrucoes da skill abaixo ao responder:]\n${skillInstruction}`;
            } else if (skillProfile && skillInstruction && !hasContract) {
              systemContent += `\n\n[Skill Ativa]: ${skillId} bloqueada (sem contrato de governanca)`;
            } else {
              systemContent += `\n\n[Skill Ativa]: ${skillId} (nao encontrada em .opencode/skills)`;
            }
          }

          // Inject user profile preferences into the system content, respecting consent
          try {
            const settings = await getUserSettings(ctx.user.id);
            if (settings) {
              const profileParts: string[] = [];
              if ((settings as any).profileRole)
                profileParts.push(`role=${(settings as any).profileRole}`);
              if ((settings as any).profession)
                profileParts.push(`profession=${(settings as any).profession}`);
              if ((settings as any).expertiseLevel)
                profileParts.push(
                  `expertise=${(settings as any).expertiseLevel}`
                );
              if ((settings as any).preferredTone)
                profileParts.push(
                  `preferredTone=${(settings as any).preferredTone}`
                );

              if (profileParts.length > 0) {
                systemContent += `\n\n[User Profile]: ${profileParts.join("; ")}`;
              }

              if ((settings as any).includePiiInContext === 1) {
                systemContent += `\n[User Info]: name=${ctx.user.name || ""}; email=${ctx.user.email || ""}`;
              }

              const role = ((settings as any).profileRole || "").toLowerCase();
              if (
                role.includes("méd") ||
                role.includes("medic") ||
                role.includes("médico") ||
                role.includes("medico")
              ) {
                systemContent += `\n\n[Notice]: Esta conversa pode envolver assuntos médicos. Forneça informações gerais e sempre recomende consulta presencial a um profissional de saúde. Não forneça diagnóstico definitivo.`;
              }
              if (
                role.includes("adv") ||
                role.includes("jurid") ||
                role.includes("advogado")
              ) {
                systemContent += `\n\n[Notice]: Esta conversa pode envolver assuntos legais. Não forneça aconselhamento jurídico vinculante; recomende consultar um advogado qualificado na jurisdição aplicável.`;
              }
            }
          } catch (e) {
            console.warn(
              "Failed to load user settings for profile injection",
              e
            );
          }

          // ✅ NOVA DIRETRIZ: Expertise Profissional e Padrão Visual
          systemContent += `
\n[DIRETRIZ DE EXCELÊNCIA VISUAL E PROFISSIONAL]:
1. SEMPRE apresente listagens de dados (Agenda, CRM, Produtos, Jurídico) em TABELAS MARKDOWN organizadas.
2. Seja um ESPECIALISTA em agendamento para médicos, advogados e estudantes.
3. SEMPRE verifique se a data escolhida cai em FIM DE SEMANA (Sábado/Domingo) ou FERIADO NACIONAL (use a ferramenta obter_feriados).
4. Se a data for um feriado ou fim de semana, ALERTE o usuário e pergunte se ele deseja prosseguir ou prefere o próximo dia útil.
5. Em lembretes recorrentes, use um tom proativo e encorajador.

\n[DIRETRIZ DE AGENTE DE SISTEMA E REFLEXÃO]:
Você agora tem acesso de leitura e escrita ao computador local do usuário e à sua própria arquitetura.
1. Se o usuário pedir para criar, editar ou ler um arquivo dele (ex: "salve na minha Área de Trabalho"), USE a ferramenta 'sistema_de_arquivos'. Não recuse; aja e modifique arquivos reais.
2. Se o usuário pedir para evoluir você mesmo ou perguntar como você funciona, USE 'explorar_diretorio_projeto' e 'ler_codigo_fonte' para ler seu próprio backend antes de sugerir um código de alteração.
`;

          if (selectedProvider === "ollama") {
            const maxSystemChars = Number(
              process.env.OLLAMA_SYSTEM_PROMPT_MAX_CHARS || 6000
            );
            if (
              Number.isFinite(maxSystemChars) &&
              maxSystemChars > 0 &&
              systemContent.length > maxSystemChars
            ) {
              const ragMarker = "\n\n[Documentos do Conhecimento]:";
              const ragIndex = systemContent.indexOf(ragMarker);

              if (ragIndex >= 0) {
                const ragSection = systemContent.slice(ragIndex);
                const ragBudget = Math.max(800, Math.floor(maxSystemChars * 0.65));
                const trimmedRag = ragSection.slice(0, ragBudget);
                const headBudget = Math.max(200, maxSystemChars - trimmedRag.length - 90);
                const head = systemContent.slice(0, headBudget);
                systemContent =
                  `${head}\n\n[Contexto intermediario resumido automaticamente para manter evidencias do RAG.]` +
                  `${trimmedRag}`;
              } else {
                systemContent =
                  systemContent.slice(0, maxSystemChars) +
                  "\n\n[Contexto truncado automaticamente para melhor desempenho no Ollama.]";
              }
            }
          }

          const historyWindow =
            parsedDomain.matched
              ? 0
              : selectedProvider === "ollama"
                ? 2
                : 10;
          const historyContentLimit = selectedProvider === "ollama" ? 300 : 4000;
          const historyMessages = history.slice(-historyWindow).map((m) => ({
            role: m.role,
            content:
              typeof m.content === "string" && m.content.length > historyContentLimit
                ? `${m.content.slice(0, historyContentLimit)}\n[...histórico truncado...]`
                : m.content,
          }));

          const messages: any[] = [
            {
              role: "system",
              content: systemContent,
            },
            ...historyMessages,
          ];

          const imageAttachments = attachments.filter(
            a => a.category === "image"
          );

          if (imageAttachments.length > 0 && !input.imageBase64) {
            const contentParts: any[] = [
              { type: "text", text: sanitizedUserContent || "Analise estas imagens:" },
            ];

            imageAttachments.forEach(img => {
              if (img.content) {
                contentParts.push({
                  type: "image_url",
                  image_url: {
                    url: `data:${img.type};base64,${img.content}`,
                    detail: "auto",
                  },
                });
              }
            });

            messages.push({
              role: "user",
              content: contentParts,
            });
          } else if (input.imageBase64 && input.imageMimeType) {
            messages.push({
              role: "user",
              content: [
                sanitizedUserContent,
                {
                  type: "image_url",
                  image_url: {
                    url: `data:${input.imageMimeType};base64,${input.imageBase64}`,
                    detail: "auto",
                  },
                },
              ],
            });
          } else {
            messages.push({
              role: "user",
              content: messageContent,
            });
          }

          // ✅ MELHORIA: Timeout e tratamento de erro detalhado
          const ollamaTimeoutFromEnv = Number(process.env.OLLAMA_CHAT_TIMEOUT_MS || process.env.OLLAMA_TIMEOUT_MS || 0);
          const forgeTimeoutFromEnv = Number(process.env.FORGE_CHAT_TIMEOUT_MS || 0);

          const timeoutMs = selectedProvider === "ollama"
            ? (Number.isFinite(ollamaTimeoutFromEnv) && ollamaTimeoutFromEnv > 0
              ? ollamaTimeoutFromEnv
              : (isVisionHeavy ? 420000 : (hasDocumentContext ? 300000 : 180000)))
            : (Number.isFinite(forgeTimeoutFromEnv) && forgeTimeoutFromEnv > 0 ? forgeTimeoutFromEnv : 120000);
          // ✅ NOVA MELHORIA: Passar tools disponíveis para que o LLM possa usá-las
          const availableTools = getAvailableTools();

          // Primeira tentativa de resposta
          let response;
          //const fallbackProvider = selectedProvider === "ollama" ? "forge" : "ollama";

          // DEPOIS:
          const forgeConfigured = !!(process.env.BUILT_IN_FORGE_API_KEY && process.env.BUILT_IN_FORGE_API_URL);
          const allowForgeFallback =
            (process.env.ENABLE_FORGE_FALLBACK || "false").toLowerCase() ===
            "true";
          const fallbackProvider =
            selectedProvider === "ollama"
              ? (allowForgeFallback && forgeConfigured ? "forge" : null)
              : "ollama";
          
          const startTime = Date.now();
          console.log(`[CHAT] Iniciando processamento LLM com provider: ${selectedProvider} (timeout: ${timeoutMs}ms)`);
          const llmResult = await executeWithFallback({
            capability: "llm",
            request_id: guardResult.request_id,
            skipTimeout: true,
            primary: () =>
              orchestrateAgentResponse(
                messages,
                selectedProvider,
                input.model,
                availableTools,
                undefined,
                timeoutMs
              ),
            fallback: () =>
              fallbackProvider
                ? orchestrateAgentResponse(
                    messages,
                    fallbackProvider,
                    input.model,
                    availableTools,
                    undefined,
                    timeoutMs
                  )
                : Promise.reject(
                    new Error(
                      "Fallback indisponível: Forge não configurado (BUILT_IN_FORGE_API_KEY/URL)."
                    )
                  ),
          });
          
          const duration = Date.now() - startTime;
          console.log(`[CHAT] LLM finalizado em ${duration}ms (status: ${llmResult.ok ? "sucesso" : "falha"})`);
          
          if (!llmResult.ok || !llmResult.value) {
            throw new Error(buildUnavailableResponse("llm"));
          }
          response = llmResult.value;

          // Conteúdo inicial de assistente (padrão se não houver conteúdo)
          let assistantContent =
            typeof response.choices?.[0]?.message?.content === "string"
              ? response.choices[0].message.content
              : "Desculpe, não consegui processar sua mensagem.";

          let iteration = 0;
          // Se o LLM solicitou uma tool (function call), executa-a e reconsulta o LLM até não haver mais tool_calls
          try {
            const maxIterations = 4;
            // Mensagens que serão reusadas ao chamarmos novamente o LLM
            const followupMessages: any[] = [...messages];

            while (
              response.choices?.[0]?.message?.tool_calls &&
              response.choices[0].message.tool_calls.length > 0 &&
              iteration < maxIterations
            ) {
              const tc = response.choices[0].message.tool_calls[0];
              console.log(`[CHAT] Iteration ${iteration}: Executando tool ${tc.function.name}`);

              // ✅ CORREÇÃO CRÍTICA: Adiciona a mensagem do assistente que solicitou a tool no histórico
              // Isso evita que o modelo entre em loop por falta de contexto do que ele mesmo pediu.
              followupMessages.push(response.choices[0].message);

              let args: any = {};
              try {
                args = JSON.parse(tc.function.arguments || "{}");
              } catch (e) {
                args = { raw: tc.function.arguments };
              }
              args = sanitizeParams(args, {
                request_id: guardResult.request_id,
                user_id: ctx.user.id,
              });

              let toolResult = "";

              try {
                if (tc.function.name === "listar_arquivos") {
                  const caminho = String(args.caminho || ".");
                  const p = sanitizePath(caminho);
                  if (!p) throw new Error("Acesso negado ou caminho inválido.");
                  const list = await fs.promises.readdir(p);
                  toolResult = `Arquivos em ${caminho}:\n${list.join("\n")}`;
                } else if (tc.function.name === "ler_arquivo") {
                  const caminho = String(args.caminho || "");
                  const p = sanitizePath(caminho);
                  if (!p) throw new Error("Acesso negado ou arquivo protegido.");
                  const content = await fs.promises.readFile(p, "utf-8");
                  if (args.linhas && typeof args.linhas === "object") {
                    const inicio = Number(args.linhas.inicio || 1);
                    const fim = Number(args.linhas.fim || 1000);
                    const lines = content.split(/\r?\n/).slice(inicio - 1, fim);
                    toolResult = lines.join("\n");
                  } else {
                    toolResult = content.length > 15000
                      ? content.slice(0, 15000) + "\n\n[CONTEÚDO TRUNCADO PARA ECONOMIA DE TOKENS]"
                      : content;
                  }
                } else if (tc.function.name === "obter_data_hora") {
                  const now = new Date();
                  toolResult = now.toString();
                } else if (tc.function.name === "buscar_na_memoria") {
                  const palavras: string[] = Array.isArray(args.palavras_chave)
                    ? args.palavras_chave
                    : [String(args.palavras_chave || "")];
                  const mems = await searchMemoryByKeywords(
                    ctx.user.id,
                    palavras.join(" ")
                  );
                  toolResult =
                    mems.length > 0
                      ? mems.map(m => `- ${m.content}`).join("\n")
                      : "[Nenhuma memória encontrada]";
                } else if (tc.function.name === "gerenciar_crm") {
                  const { acao, id, dados } = args;
                  if (acao === "listar") {
                    const res = await getCustomers(ctx.user.id);
                    toolResult = JSON.stringify(res);
                  } else if (acao === "detalhar" && id) {
                    const res = await getCustomerById(ctx.user.id, id);
                    toolResult = JSON.stringify(res);
                  } else if (acao === "criar" && dados) {
                    const res = await createCustomer(ctx.user.id, dados);
                    toolResult = `Cliente criado com sucesso. ID: ${(res as any).id ?? "N/A"}`;
                  } else if (acao === "atualizar" && id && dados) {
                    await updateCustomerCRM(ctx.user.id, id, dados);
                    toolResult = "Cliente atualizado com sucesso.";
                  } else {
                    toolResult = "Ação ou parâmetros inválidos para gerenciar_crm.";
                  }
                } else if (tc.function.name === "gerenciar_agenda") {
                  const { acao, id, dados } = args;
                  if (acao === "listar") {
                    const start = args.data_inicio ? new Date(args.data_inicio) : undefined;
                    const end = args.data_fim ? new Date(args.data_fim) : undefined;
                    const res = await getAppointments(ctx.user.id, start, end);
                    toolResult = JSON.stringify(res);
                  } else if (acao === "detalhar" && id) {
                    const res = await getAppointmentById(ctx.user.id, id);
                    toolResult = JSON.stringify(res);
                  } else if (acao === "criar" && dados) {
                    const res = await createAppointment(ctx.user.id, dados);
                    toolResult = `Compromisso criado com sucesso. ID: ${(res as any).id ?? "N/A"}`;
                  } else if (acao === "atualizar" && id && dados) {
                    await updateAppointment(ctx.user.id, id, dados);
                    toolResult = "Compromisso atualizado com sucesso.";
                  } else if (acao === "deletar" && id) {
                    requireConfirmation("delete.all", Boolean((args as any).confirmado), {
                      request_id: guardResult.request_id,
                      user_id: ctx.user.id,
                    });
                    await deleteAppointment(ctx.user.id, id);
                    toolResult = "Compromisso deletado.";
                  } else {
                    toolResult = "Ação ou parâmetros inválidos para gerenciar_agenda.";
                  }
                } else if (tc.function.name === "buscar_documentos_rag") {
                  const { consulta } = args;
                  const res = await searchDocumentChunks(ctx.user.id, consulta, 5);
                  toolResult = res.length > 0
                    ? res.map(c => `[Doc Chunk]: ${c.content}`).join("\n---\n")
                    : "Nenhuma informação encontrada.";
                } else if (tc.function.name === "gerenciar_juridico") {
                  const { entidade, acao, id, dados } = args;
                  if (entidade === "cliente") {
                    if (acao === "listar") {
                      const res = await getLegalClients(ctx.user.id);
                      toolResult = JSON.stringify(res);
                    } else if (acao === "criar" && dados) {
                      const res = await createLegalClient(ctx.user.id, dados);
                      toolResult = `Cliente jurídico criado com sucesso. ID: ${(res as any).id ?? "N/A"}`;
                    } else if (acao === "atualizar" && id && dados) {
                      await updateLegalClient(ctx.user.id, id, dados);
                      toolResult = "Cliente jurídico atualizado com sucesso.";
                    }
                  } else if (entidade === "processo") {
                    if (acao === "listar") {
                      const res = await getLegalProcesses(ctx.user.id);
                      toolResult = JSON.stringify(res);
                    } else if (acao === "criar" && dados) {
                      const res = await createLegalProcess(ctx.user.id, dados);
                      toolResult = `Processo jurídico criado com sucesso. ID: ${(res as any).id ?? "N/A"}`;
                    }
                  } else if (entidade === "prazo") {
                    if (acao === "listar") {
                      const start = args.data_inicio ? new Date(args.data_inicio) : undefined;
                      const end = args.data_fim ? new Date(args.data_fim) : undefined;
                      const res = await getLegalDeadlines(ctx.user.id, start, end);
                      toolResult = JSON.stringify(res);
                    } else if (acao === "criar" && dados) {
                      const res = await createLegalDeadline(ctx.user.id, dados);
                      toolResult = `Prazo jurídico criado com sucesso. ID: ${(res as any).id ?? "N/A"}`;
                    }
                  } else if (entidade === "audiencia") {
                    if (acao === "listar") {
                      const start = args.data_inicio ? new Date(args.data_inicio) : undefined;
                      const end = args.data_fim ? new Date(args.data_fim) : undefined;
                      const res = await getLegalHearings(ctx.user.id, start, end);
                      toolResult = JSON.stringify(res);
                    } else if (acao === "criar" && dados) {
                      const res = await createLegalHearing(ctx.user.id, dados);
                      toolResult = `Audiência jurídica criada com sucesso. ID: ${(res as any).id ?? "N/A"}`;
                    }
                  }
                  if (!toolResult) toolResult = "Ação ou parâmetros inválidos para gerenciar_juridico.";
                } else if (tc.function.name === "buscar_fontes_juridicas") {
                  const fonte = String(args.fonte || "").toLowerCase();
                  const termo = String(args.termo || "").trim();

                  if (fonte === "dou") {
                    if (!termo) {
                      toolResult = "Para buscar no DOU, informe o campo 'termo'.";
                    } else {
                      const res = await searchDOU(
                        termo,
                        (args.secao as any) || "todos",
                        args.data ? String(args.data) : undefined
                      );
                      toolResult = JSON.stringify(res);
                    }
                  } else if (fonte === "lexml") {
                    if (!termo) {
                      toolResult = "Para buscar no LexML, informe o campo 'termo'.";
                    } else {
                      const res = await searchLexML(termo, args.tipo ? String(args.tipo) : "lei");
                      toolResult = JSON.stringify(res);
                    }
                  } else if (fonte === "jurisprudencia") {
                    if (!termo) {
                      toolResult = "Para buscar jurisprudência, informe o campo 'termo'.";
                    } else {
                      const res = await searchJurisprudencia(
                        termo,
                        (args.tribunal as any) || "stf",
                        Number(args.limit || 5)
                      );
                      toolResult = JSON.stringify(res);
                    }
                  } else if (fonte === "pje_comunica") {
                    const res = await searchPJeComunicacoes(
                      args.data ? String(args.data) : undefined
                    );
                    toolResult = JSON.stringify(res);
                  } else {
                    toolResult = "Fonte jurídica inválida. Use: dou, lexml, jurisprudencia ou pje_comunica.";
                  }
                } else if (tc.function.name === "gerenciar_produtos") {
                  const acao = String(args.acao || "");

                  if (acao === "listar_sem_ncm") {
                    const pendentes = await getProductsWithoutNCM(10);
                    toolResult =
                      pendentes.length > 0
                        ? "PRODUTOS SEM NCM ENCONTRADOS (Lim. 10):\n" +
                        pendentes
                          .map((p) => `- ${p.name} | Ref: ${p.referenceId}`)
                          .join("\n")
                        : "Nenhum produto sem NCM encontrado.";
                  } else if (acao === "buscar") {
                    if (args.termo) {
                      const found = await searchProducts(String(args.termo), 200);
                      toolResult =
                        found.length > 0
                          ? `PRODUTOS ENCONTRADOS: ${found.length}\n` +
                          found
                            .map(
                              (p) =>
                                `- ${p.name} | Ref: ${p.referenceId} | Preço: R$${p.price} | Estoque: ${p.stock} | Unid: ${p.unit}`
                            )
                            .join("\n")
                          : "Nenhum produto encontrado com este termo.";
                    } else if (args.id) {
                      const prod = await getProductByRef(String(args.id));
                      toolResult = prod
                        ? `PRODUTO: ${prod.name}\nRef: ${prod.referenceId}\nPreço: R$${prod.price}\nEstoque: ${prod.stock}\nUnidade: ${prod.unit}\nStatus: ${prod.status}`
                        : "Produto não encontrado.";
                    } else {
                      const list = await getAllProducts(10);
                      toolResult =
                        "Exibindo os primeiros 10 produtos (especifique ID ou termo para refinar):\n" +
                        list
                          .map((p) => `- ${p.name} (Ref: ${p.referenceId}) - R$${p.price}`)
                          .join("\n");
                    }
                  } else if (
                    acao === "atualizar_estoque" ||
                    acao === "atualizar_preco" ||
                    acao === "atualizar_ncm" ||
                    acao === "atualizar_nome" ||
                    acao === "atualizar_status"
                  ) {
                    requireConfirmation("admin.mass_delete", Boolean((args as any).confirmado), {
                      request_id: guardResult.request_id,
                      user_id: ctx.user.id,
                    });
                    if (!args.id) {
                      throw new Error("Parâmetro 'id' (referenceId) é obrigatório");
                    }

                    if (
                      (acao === "atualizar_estoque" || acao === "atualizar_preco") &&
                      args.valor === undefined
                    ) {
                      throw new Error(
                        "Para atualizar_estoque ou atualizar_preco, informe também o campo 'valor'"
                      );
                    }

                    if (
                      (acao === "atualizar_ncm" || acao === "atualizar_nome" || acao === "atualizar_status") &&
                      !String(args.texto || "").trim()
                    ) {
                      throw new Error(
                        "Para atualizar_ncm, atualizar_nome ou atualizar_status, informe também o campo 'texto'"
                      );
                    }

                    const prod = await getProductByRef(String(args.id));
                    if (!prod) throw new Error("Produto não existe no banco.");

                    const payload: any = {
                      referenceId: prod.referenceId,
                      name: prod.name,
                    };

                    if (acao === "atualizar_estoque") {
                      payload.stock = Number(args.valor);
                    }
                    if (acao === "atualizar_preco") {
                      payload.price = Number(args.valor);
                    }
                    if (acao === "atualizar_ncm") {
                      payload.ncm = String(args.texto).trim();
                    }
                    if (acao === "atualizar_nome") {
                      payload.name = String(args.texto).trim();
                    }
                    if (acao === "atualizar_status") {
                      payload.status = String(args.texto).trim();
                    }

                    await upsertProduct(payload);
                    const updatedField =
                      acao === "atualizar_estoque"
                        ? `estoque=${args.valor}`
                        : acao === "atualizar_preco"
                          ? `preço=${args.valor}`
                          : acao === "atualizar_ncm"
                            ? `ncm=${String(args.texto).trim()}`
                            : acao === "atualizar_nome"
                              ? `nome=${String(args.texto).trim()}`
                              : `status=${String(args.texto).trim()}`;
                    toolResult = `Produto ${prod.name} (Ref: ${prod.referenceId}) atualizado com sucesso! ${updatedField}`;
                  } else if (acao === "importar_csv") {
                    toolResult =
                      "A importação de CSV deve ser executada por script operacional (ex.: scripts/import-produtos-csv.ts) e alimenta a tabela products. Este fluxo não deve escrever no RAG.";
                  } else {
                    toolResult =
                      "Ação inválida para gerenciar_produtos. Use: buscar, atualizar_estoque, atualizar_preco, atualizar_ncm, atualizar_nome, atualizar_status, importar_csv, listar_sem_ncm.";
                  }
                } else if (tc.function.name === "obter_feriados") {
                   const { ano } = args;
                   try {
                     const resp = await axios.get(`https://brasilapi.com.br/api/feriados/v1/${ano}`);
                     toolResult = JSON.stringify(resp.data);
                   } catch (e) {
                     toolResult = "Erro ao buscar feriados: " + (e as any).message;
                   }
                } else if (tc.function.name === "explorar_diretorio_projeto") {
                   const cwd = process.cwd();
                   const target = path.resolve(cwd, args.caminho || ".");
                   if (!target.startsWith(cwd)) {
                      toolResult = "Erro de Segurança: Acesso negado fora do workspace do projeto.";
                   } else {
                      try {
                        const items = await fs.promises.readdir(target, { withFileTypes: true });
                        const filtered = items.filter(i => !['node_modules', '.git', 'dist'].includes(i.name))
                                              .map(i => `${i.isDirectory() ? '[DIR]' : '[FILE]'} ${i.name}`);
                        toolResult = `Diretório '${args.caminho}':\n${filtered.join("\n")}`;
                      } catch(e) { toolResult = `Erro ao ler diretório: ${(e as any).message}`; }
                   }
                } else if (tc.function.name === "ler_codigo_fonte") {
                   const cwd = process.cwd();
                   const target = path.resolve(cwd, args.caminho_arquivo);
                   if (!target.startsWith(cwd)) {
                      toolResult = "Erro de Segurança: Acesso negado fora do workspace do projeto.";
                   } else {
                      try {
                        const stats = await fs.promises.stat(target);
                        if (stats.size > 200000) toolResult = "Erro: Arquivo muito grande (>200KB) para análise completa.";
                        else {
                           const content = await fs.promises.readFile(target, "utf-8");
                           toolResult = `\n--- INICIO DE ${args.caminho_arquivo} ---\n${content}\n--- FIM ---`;
                        }
                      } catch(e) { toolResult = `Erro ao ler arquivo: ${(e as any).message}`; }
                   }
                } else if (tc.function.name === "sistema_de_arquivos") {
                   const { acao, caminho, conteudo } = args;
                   // Em produção, restringir a pasta Documentos do usuário. Aqui usamos o caminho direto ou absoluto.
                   let targetPath = path.isAbsolute(caminho) ? path.normalize(caminho) : path.resolve(process.cwd(), caminho);
                   
                   try {
                     if (acao === "listar") {
                        const items = await fs.promises.readdir(targetPath);
                        toolResult = `Conteúdo de ${targetPath}:\n${items.join("\n")}`;
                     } else if (acao === "ler_arquivo") {
                        const content = await fs.promises.readFile(targetPath, "utf-8");
                        toolResult = `Conteúdo de ${targetPath}:\n${content}`;
                     } else if (acao === "criar_arquivo" || acao === "editar_arquivo") {
                        // Impedir gravação bloqueadora
                        if (targetPath.toLowerCase().includes("windows\\system32")) {
                           toolResult = "Erro de Segurança: Caminhos do sistema operacional bloqueados.";
                        } else {
                           await fs.promises.writeFile(targetPath, conteudo || "");
                           toolResult = `Sucesso: Arquivo ${targetPath} operado (ação: ${acao}).`;
                        }
                     }
                   } catch(e) {
                      toolResult = `Erro no file system: ${(e as any).message}`;
                   }
                } else if (tc.function.name === "criar_lembrete") {
                  const mensagem = String(args.mensagem || "").trim();
                  const minutos = args.minutos_daqui !== undefined ? Number(args.minutos_daqui) : undefined;
                  const horario = args.horario ? String(args.horario) : undefined;
                  const recorrencia = args.recorrencia ? String(args.recorrencia) : undefined;

                  if (!mensagem) throw new Error("'mensagem' é obrigatória");

                  let nextRun = new Date();
                  if (minutos !== undefined && minutos > 0) {
                    nextRun = new Date(Date.now() + Math.round(minutos) * 60 * 1000);
                  } else if (horario) {
                    if (horario.includes(":")) {
                      const [h, m] = horario.split(":").map(Number);
                      nextRun = setHours(setMinutes(nextRun, m), h);
                      if (nextRun < new Date()) nextRun = addDays(nextRun, 1);
                    } else {
                      nextRun = new Date(horario);
                    }
                  }

                  await createProactiveTask(ctx.user.id, {
                    title: "Lembrete: " + mensagem,
                    description: mensagem,
                    nextRun,
                    type: "watcher",
                    status: "active",
                    schedule: recorrencia || null
                  });
                  toolResult = `Lembrete agendado para ${nextRun.toLocaleString('pt-BR')}${recorrencia ? ` (Recorrência: ${recorrencia})` : ""}: ${mensagem}`;
                } else {
                  toolResult = `Ferramenta ${tc.function.name} não implementada.`;
                }
              } catch (e: any) {
                toolResult = `Erro ao executar ferramenta ${tc.function.name}: ${e?.message || String(e)}`;
              }

              // Anexa retorno da tool nas mensagens para o LLM e persiste no histórico
              followupMessages.push({
                role: "tool",
                tool_call_id: tc.id, // Requisito de algumas APIs (OpenAI/Gemini)
                name: tc.function.name,
                content: toolResult,
              });

              await addMessage(
                input.conversationId,
                "assistant",
                `[Tool:${tc.function.name}] ${toolResult}`
              );

              // Reconsulta o LLM com o contexto atualizado
              response = await orchestrateAgentResponse(
                followupMessages,
                selectedProvider,
                input.model,
                availableTools,
                undefined,
                timeoutMs
              );

              iteration++;
            }

            // Atualiza o conteúdo final baseado na última resposta
            assistantContent =
              typeof response.choices?.[0]?.message?.content === "string"
                ? response.choices[0].message.content
                : assistantContent;
          } catch (e) {
            console.error("Erro ao processar tool calls:", e);
          }

          // ✅ MELHORIA: Se ferramentas foram chamadas mas o LLM não deu resumo final, injeta um padrão
          if (iteration > 0 && (!assistantContent || !assistantContent.trim())) {
            assistantContent = "Pronto! Processei sua solicitação com sucesso através das ferramentas disponíveis.";
          }

          const outputValidation = validateOutputContract({
            request_id: guardResult.request_id,
            intent: guardResult.classification?.intent ?? "informacional",
            output: {
              status: "success",
              message: assistantContent,
            },
          });

          // Se a validação falhou, usamos a mensagem de fallback do contrato
          if (!outputValidation.success) {
            assistantContent = String(outputValidation.fallback_output.message || assistantContent);
          }

          if (requestedDocIds && requestedDocIds.length > 0 && ragChunks.length > 0) {
            const hasCitation = /\[[^\]]+,\s*Chunk\s*\d+\]/i.test(assistantContent);
            if (!hasCitation) {
              const topChunk = ragChunks[0];
              const excerptSource = String(topChunk.content || "").trim();
              const excerpt =
                excerptSource.length > 420
                  ? `${excerptSource.slice(0, 420)}...`
                  : excerptSource;
              assistantContent =
                `Nao encontrei uma resposta confiavel com citacao explicita do modelo. ` +
                `Trecho mais relevante dos documentos selecionados: "${excerpt}" ` +
                `[${topChunk.documentName}, Chunk ${topChunk.chunkIndex}]`;
            }
          }

          await addMessage(input.conversationId, "assistant", assistantContent);

          await addMemoryEntry(
            ctx.user.id,
            sanitizedUserContent,
            extractKeywords(sanitizedUserContent).join(", "),
            "context"
          );

          await addMemoryEntry(
            ctx.user.id,
            assistantContent,
            extractKeywords(assistantContent).join(", "),
            "context"
          );

          logGuardRailStage({
            request_id: guardResult.request_id,
            route: "chat.sendMessage",
            stage: "output_validation",
            details: {
              valid: outputValidation.success,
            },
          });

          recordRouteMetric({
            route: "chat.sendMessage",
            status: outputValidation.success ? "success" : "fallback",
            latency_ms: Date.now() - routeStartMs,
          });

          logGuardRailStage({
            request_id: guardResult.request_id,
            route: "chat.sendMessage",
            stage: "response",
            details: {
              status: outputValidation.success ? "success" : "fallback",
            },
          });

          return {
            userMessage: sanitizedUserContent,
            assistantMessage: outputValidation.success
              ? assistantContent
              : String(outputValidation.fallback_output.message),
            attachmentsProcessed: attachments.length,
            success: true,
          };
        } catch (error) {
          console.error("LLM error:", error);

          // ✅ CORREÇÃO: Mensagem padrão amigável para erros desconhecidos
          let errorDetails = "Erro desconhecido";
          let displayMessage =
            "Desculpe, não consegui responder agora. Tente novamente em instantes.";

          if (error instanceof Error) {
            errorDetails = error.message;

            // Apenas substitui a mensagem amigável se for erro de conexão/configuração
            if (error.message.includes("ECONNREFUSED")) {
              displayMessage = `❌ Ollama não está rodando em ${input.ollamaBaseUrl || "localhost:11434"}. Verifique se o servidor está ativo.`;
            } else if (
              error.message.includes("ETIMEDOUT") ||
              error.message.includes("timeout")
            ) {
              displayMessage =
                "❌ Tempo esgotado. O modelo pode estar ocupado ou indisponível.";
            } else if (
              error.message.includes("fetch failed") ||
              error.message.includes("getaddrinfo")
            ) {
              displayMessage =
                "❌ Falha na conexão. Verifique se a URL do Ollama está correta e acessível.";
            } else if (error.message.includes("404")) {
              displayMessage = `❌ Modelo "${input.model || "llama3.1:8b"}" não encontrado. Execute: ollama pull ${input.model || "llama3.1:8b"}`;
            } else if (error.message.includes("401")) {
              displayMessage =
                "❌ Não autorizado. Verifique se o token de autenticação está correto.";
            }
            // ✅ Se não for nenhum dos erros acima, mantém a mensagem padrão amigável genérica
          }

          await addMessage(input.conversationId, "assistant", displayMessage);

          logGuardRailStage({
            request_id: guardResult.request_id,
            route: "chat.sendMessage",
            stage: "response",
            details: {
              status: "error",
              error: errorDetails,
            },
          });

          recordRouteMetric({
            route: "chat.sendMessage",
            status: "error",
            latency_ms: Date.now() - routeStartMs,
          });

          return {
            userMessage: sanitizedUserContent,
            assistantMessage: displayMessage,
            attachmentsProcessed: 0,
            error: errorDetails, // Mantém o erro técnico para debugging
            success: false,
          };
        }
      }),
  }),

  voice: router({
    transcribe: protectedProcedure
      .input(
        z.object({
          audioUrl: z.string().url().optional(),
          audioBase64: z.string().optional(),
          mimeType: z.string().optional(),
          language: z.string().optional(),
          prompt: z.string().optional(),
          model: z.string().optional(),
        })
      )
      .mutation(
        async ({
          input,
        }): Promise<
          { text: string } | { error: string; code?: string; details?: string }
        > => {
          try {
            let url = input.audioUrl;
            let audioBuffer: Buffer | undefined;
            let mimeType: string | undefined;

            if (!url) {
              if (!input.audioBase64 || !input.mimeType) {
                return {
                  error:
                    "Audio data missing: provide audioUrl or audioBase64 + mimeType",
                  code: "INVALID_FORMAT",
                };
              }
              const base64 = input.audioBase64.includes(",")
                ? input.audioBase64.split(",")[1]!
                : input.audioBase64;
              audioBuffer = Buffer.from(base64, "base64");
              mimeType = input.mimeType;
            }

            const result = await transcribeAudio({
              audioUrl: url,
              audioData: audioBuffer,
              mimeType,
              language: input.language,
              prompt: input.prompt,
              model: input.model,
            });

            if (
              result &&
              typeof result === "object" &&
              "text" in result &&
              result.text
            ) {
              return { text: result.text };
            } else if (
              result &&
              typeof result === "object" &&
              "error" in result &&
              result.error
            ) {
              return {
                error: result.error,
                code: "TRANSCRIPTION_ERROR",
                details: "details" in result ? result.details : undefined,
              };
            } else {
              return {
                error: "Transcription failed: no text returned",
                code: "EMPTY_RESULT",
              };
            }
          } catch (error) {
            return {
              error: "Transcription failed",
              code: "SERVICE_ERROR",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        }
      ),
  }),

  // Memory management
  memory: router({
    search: protectedProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ ctx, input }) => {
        return searchMemoryByKeywords(ctx.user.id, input.query);
      }),

    addEntry: protectedProcedure
      .input(
        z.object({
          content: z.string(),
          keywords: z.string().optional(),
          type: z.enum(["fact", "preference", "context", "command"]).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const memoryResult = await addMemoryEntry(
          ctx.user.id,
          input.content,
          input.keywords,
          input.type as any
        );

        if (isMemoryGuardResult(memoryResult) && (memoryResult.blocked || memoryResult.skipped)) {
          return {
            success: false,
            blockedByPolicy: true,
            message: memoryResult.policyMessage || "Entrada bloqueada pela policy de memoria segura.",
          };
        }

        return { success: true };
      }),

    // AVA Memory System V3.1: Clean expired memories
    cleanExpired: protectedProcedure.mutation(async ({ ctx }) => {
      const { deleteExpiredMemory } = await import("./db");
      const result = await deleteExpiredMemory(ctx.user.id);
      return { success: true, archived: result.count };
    }),

    // AVA Memory System V3.1: Export memories as JSON
    export: protectedProcedure
      .input(
        z.object({
          format: z.enum(["json"]).default("json"),
        })
      )
      .query(async ({ ctx, input }) => {
        const { exportMemory } = await import("./db");
        const data = await exportMemory(ctx.user.id, input.format);
        return {
          success: true,
          filename: `ava-memory-${ctx.user.id}-${Date.now()}.json`,
          contentBase64: Buffer.from(JSON.stringify(data, null, 2)).toString(
            "base64"
          ),
          mimeType: "application/json",
        };
      }),

    // AVA Memory System V3.1: Advanced search with relevance scoring
    searchAdvanced: protectedProcedure
      .input(z.object({ query: z.string() }))
      .query(async ({ ctx, input }) => {
        const { searchMemoryWithRelevance } = await import("./db");
        return searchMemoryWithRelevance(ctx.user.id, input.query);
      }),
  }),

  // User settings
  settings: router({
    getSettings: protectedProcedure.query(async ({ ctx }) => {
      const settings = await getUserSettings(ctx.user.id);
      console.log(`[tRPC] getSettings for user ${ctx.user.id}:`, settings);

      // Fallback object to ensure data is never undefined
      const defaultSettings = {
        userId: ctx.user.id,
        theme: "light",
        profileRole: "user",
        expertiseLevel: "intermediate",
        preferredTone: "formal",
        includePiiInContext: 0
      };

      return settings || defaultSettings;
    }),

    updateSettings: protectedProcedure
      .input(
        z.object({
          preferredMode: z
            .enum(["ECO", "STANDARD", "PERFORMANCE", "AUTO"])
            .optional(),
          autoDetectHardware: z.boolean().optional(),
          llmTemperature: z.number().min(0).max(100).optional(),
          llmTopP: z.number().min(0).max(100).optional(),
          sttLanguage: z.string().optional(),
          theme: z.string().optional(),
          currentModule: z.enum(["GENERAL", "LEGAL", "MEDICAL", "DEVELOPER"]).optional(),
          // Profile fields for LLM personalization
          profileRole: z.string().optional(),
          profession: z.string().optional(),
          expertiseLevel: z
            .enum(["beginner", "intermediate", "expert"])
            .optional(),
          preferredTone: z
            .enum(["formal", "informal", "concise", "detailed"])
            .optional(),
          includePiiInContext: z.boolean().optional(),
          jurisdiction: z.string().optional(),
          medicalConsent: z.boolean().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const updateData: Record<string, any> = {};

        if (input.preferredMode !== undefined)
          updateData.preferredMode = input.preferredMode;
        if (input.autoDetectHardware !== undefined)
          updateData.autoDetectHardware =
            input.autoDetectHardware === true ? 1 : 0;
        if (input.llmTemperature !== undefined)
          updateData.llmTemperature = input.llmTemperature;
        if (input.llmTopP !== undefined) updateData.llmTopP = input.llmTopP;
        if (input.sttLanguage !== undefined)
          updateData.sttLanguage = input.sttLanguage;
        if (input.theme !== undefined) updateData.theme = input.theme;
        if (input.currentModule !== undefined)
          updateData.currentModule = input.currentModule;

        // Profile fields
        if (input.profileRole !== undefined)
          updateData.profileRole = input.profileRole;
        if (input.profession !== undefined)
          updateData.profession = input.profession;
        if (input.expertiseLevel !== undefined)
          updateData.expertiseLevel = input.expertiseLevel;
        if (input.preferredTone !== undefined)
          updateData.preferredTone = input.preferredTone;
        if (input.includePiiInContext !== undefined)
          updateData.includePiiInContext = input.includePiiInContext ? 1 : 0;
        if (input.jurisdiction !== undefined)
          updateData.jurisdiction = input.jurisdiction;
        if (input.medicalConsent !== undefined)
          updateData.medicalConsent = input.medicalConsent ? 1 : 0;

        await createOrUpdateUserSettings(ctx.user.id, updateData);
        return { success: true };
      }),
  }),

  user: router({
    updateProfile: protectedProcedure
      .input(
        z.object({
          name: z.string().min(1, "Nome é obrigatório"),
          email: z.string().email("Email inválido"),
        })
      )
      .mutation(async ({ ctx, input }) => {
        try {
          // Update user in database
          const { updateUser } = await import("./db");
          await updateUser(ctx.user.id, {
            name: input.name,
            email: input.email,
          });
          return { success: true, message: "Perfil atualizado com sucesso" };
        } catch (error) {
          throw new TRPCError({
            code: "INTERNAL_SERVER_ERROR",
            message: `Erro ao atualizar perfil: ${error instanceof Error ? error.message : error}`,
          });
        }
      }),
  }),

  llm: router({
    // ✅ NOVO: Teste de conexão para diagnosticar problemas
    testConnection: publicProcedure
      .input(
        z.object({
          baseUrl: z.string().optional(),
          authToken: z.string().optional(),
          provider: z.enum(["ollama", "forge"]).default("ollama"),
        })
      )
      .query(async ({ input }) => {
        try {
          if (input.provider === "forge") {
            // Teste simples para Forge (ajuste conforme sua implementação)
            return {
              success: true,
              message: "Forge não requer teste de conexão prévio",
              url: "cloud",
            };
          }

          const base =
            input.baseUrl ||
            process.env.OLLAMA_BASE_URL ||
            "http://localhost:11434";
          const cleanBase = base.replace(/\/$/, "");

          console.log(`Testing Ollama connection at: ${cleanBase}`);

          const res = await fetch(`${cleanBase}/api/tags`, {
            method: "GET",
            headers: input.authToken
              ? { authorization: `Bearer ${input.authToken}` }
              : undefined,
            signal: AbortSignal.timeout(5000), // 5 segundos timeout
          });

          if (!res.ok) {
            return {
              success: false,
              error: `HTTP ${res.status}: ${res.statusText}`,
              url: cleanBase,
              suggestion:
                res.status === 401
                  ? "Verifique se o token de autorização está correto"
                  : res.status === 404
                    ? "Endpoint não encontrado. Verifique se é uma URL Ollama válida"
                    : "Verifique se o Ollama está rodando",
            };
          }

          const data = await res.json();
          const models = data.models || [];

          return {
            success: true,
            models: models.length,
            modelNames: models.slice(0, 5).map((m: any) => m.name), // Primeiros 5 modelos
            url: cleanBase,
            message:
              models.length > 0
                ? `Conectado! ${models.length} modelos disponíveis.`
                : "Conectado, mas nenhum modelo encontrado. Execute 'ollama pull nome-do-modelo'",
          };
        } catch (error) {
          const errorMsg =
            error instanceof Error ? error.message : "Erro desconhecido";
          let suggestion = "";

          if (errorMsg.includes("ECONNREFUSED")) {
            suggestion =
              "Ollama não está rodando. Execute 'ollama serve' no terminal";
          } else if (
            errorMsg.includes("ETIMEDOUT") ||
            errorMsg.includes("timeout")
          ) {
            suggestion =
              "Tempo esgotado. Verifique se a URL está correta e acessível";
          } else if (errorMsg.includes("getaddrinfo")) {
            suggestion = "URL inválida ou host não encontrado";
          }

          return {
            success: false,
            error: errorMsg,
            url: input.baseUrl || "http://localhost:11434",
            suggestion,
          };
        }
      }),

    listOllamaModels: publicProcedure
      .input(
        z
          .object({
            baseUrl: z.string().url().optional(),
            authToken: z.string().optional(),
          })
          .optional()
      )
      .query(async ({ input }) => {
        const base =
          input?.baseUrl && input.baseUrl.trim().length > 0
            ? input.baseUrl
            : process.env.OLLAMA_BASE_URL || "http://localhost:11434";
        try {
          const res = await fetch(`${base.replace(/\/$/, "")}/api/tags`, {
            method: "GET",
            headers: input?.authToken
              ? { authorization: `Bearer ${input.authToken}` }
              : undefined,
          });
          if (!res.ok) {
            return [];
          }

          let data: any;
          try {
            data = await res.json();
          } catch (error) {
            console.error("Failed to parse Ollama model list response:", error);
            return [];
          }

          const models: string[] = Array.isArray(data?.models)
            ? data.models.map((m: any) => m?.name).filter(Boolean)
            : [];
          return models;
        } catch (e) {
          console.error("Failed to list Ollama models:", e);
          return [];
        }
      }),

    // Expor lista de tools disponíveis para a UI
    getTools: publicProcedure.query(async () => {
      return getAvailableTools();
    }),

    // Executar uma ferramenta manualmente (usado pela UI para debug / ações diretas)
    runTool: protectedProcedure
      .input(
        z.object({
          conversationId: z.number().optional(),
          name: z.string(),
          args: z.any().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const tools = getAvailableTools();
        const tool = tools.find(t => t.function.name === input.name);
        if (!tool) throw new Error(`Tool not found: ${input.name}`);

        let result = "";
        try {
          const args = input.args || {};

          if (input.name === "listar_arquivos") {
            const caminho = String(args.caminho || ".");
            const base = process.cwd();
            const p = path.resolve(base, caminho);
            if (!p.startsWith(base)) throw new Error("Caminho inválido");
            const list = await fs.promises.readdir(p);
            result = `Arquivos em ${caminho}:\n${list.join("\n")}`;
          } else if (input.name === "ler_arquivo") {
            const caminho = String(args.caminho || "");
            const base = process.cwd();
            const p = path.resolve(base, caminho);
            if (!p.startsWith(base)) throw new Error("Caminho inválido");
            const content = await fs.promises.readFile(p, "utf-8");
            if (args.linhas && typeof args.linhas === "object") {
              const inicio = Number(args.linhas.inicio || 1);
              const fim = Number(args.linhas.fim || 1000);
              const lines = content.split(/\r?\n/).slice(inicio - 1, fim);
              result = lines.join("\n");
            } else {
              result = content.slice(0, 20000);
            }
          } else if (input.name === "obter_data_hora") {
            result = new Date().toString();
          } else if (input.name === "buscar_na_memoria") {
            const palavras: string[] = Array.isArray(args.palavras_chave)
              ? args.palavras_chave
              : [String(args.palavras_chave || "")];
            const mems = await searchMemoryByKeywords(
              ctx.user.id,
              palavras.join(" ")
            );
            result =
              mems.length > 0
                ? mems.map(m => `- ${m.content}`).join("\n")
                : "[Nenhuma memória encontrada]";
          } else if (input.name === "buscar_fontes_juridicas") {
            const fonte = String(args.fonte || "").toLowerCase();
            const termo = String(args.termo || "").trim();

            if (fonte === "dou") {
              if (!termo) throw new Error("Informe 'termo' para busca no DOU");
              result = JSON.stringify(
                await searchDOU(
                  termo,
                  (args.secao as any) || "todos",
                  args.data ? String(args.data) : undefined
                )
              );
            } else if (fonte === "lexml") {
              if (!termo) throw new Error("Informe 'termo' para busca no LexML");
              result = JSON.stringify(await searchLexML(termo, args.tipo ? String(args.tipo) : "lei"));
            } else if (fonte === "jurisprudencia") {
              if (!termo) throw new Error("Informe 'termo' para busca de jurisprudência");
              result = JSON.stringify(
                await searchJurisprudencia(
                  termo,
                  (args.tribunal as any) || "stf",
                  Number(args.limit || 5)
                )
              );
            } else if (fonte === "pje_comunica") {
              result = JSON.stringify(
                await searchPJeComunicacoes(args.data ? String(args.data) : undefined)
              );
            } else {
              throw new Error("Fonte inválida. Use dou, lexml, jurisprudencia ou pje_comunica");
            }
          } else if (input.name === "gerenciar_produtos") {
            const acao = String(args.acao || "");
            const { getAllProducts, searchProducts, getProductByRef, upsertProduct, getProductsWithoutNCM } = await import("./db");

            if (acao === "listar_sem_ncm") {
              const pendentes = await getProductsWithoutNCM(10);
              result = typeof pendentes !== 'undefined' && pendentes.length > 0
                ? "PRODUTOS SEM NCM ENCONTRADOS (Lim. 10):\n" + pendentes.map(p => `- ${p.name} | Ref: ${p.referenceId}`).join("\n")
                : "Nenhum produto sem NCM encontrado.";
            } else if (acao === "buscar") {
              if (args.termo) {
                const found = await searchProducts(String(args.termo), 200);
                result = found.length > 0
                  ? `PRODUTOS ENCONTRADOS: ${found.length}\n` + found.map(p => `- ${p.name} | Ref: ${p.referenceId} | Preço: R$${p.price} | Estoque: ${p.stock} | Unid: ${p.unit}`).join("\n")
                  : "Nenhum produto encontrado com este termo.";
              } else if (args.id) {
                const prod = await getProductByRef(String(args.id));
                result = prod
                  ? `PRODUTO: ${prod.name}\nRef: ${prod.referenceId}\nPreço: R$${prod.price}\nEstoque: ${prod.stock}\nUnidade: ${prod.unit}\nStatus: ${prod.status}`
                  : "Produto não encontrado.";
              } else {
                const limitDocs = await getAllProducts(10);
                result = "Exibindo os primeiros 10 produtos (Especifique ID ou termo para refinar):\n" + limitDocs.map(p => `- ${p.name} (Ref: ${p.referenceId}) - R$${p.price}`).join("\n");
              }
            } else if (
              acao === "atualizar_estoque" ||
              acao === "atualizar_preco" ||
              acao === "atualizar_ncm" ||
              acao === "atualizar_nome" ||
              acao === "atualizar_status"
            ) {
              if (!args.id) throw new Error("Parâmetro 'id' (referenceId) é obrigatório");
              if ((acao === "atualizar_estoque" || acao === "atualizar_preco") && args.valor === undefined) {
                throw new Error("Para atualizar_estoque ou atualizar_preco, informe 'valor'");
              }
              if ((acao === "atualizar_ncm" || acao === "atualizar_nome" || acao === "atualizar_status") && !String(args.texto || "").trim()) {
                throw new Error("Para atualizar_ncm, atualizar_nome ou atualizar_status, informe 'texto'");
              }
              const prod = await getProductByRef(String(args.id));
              if (!prod) throw new Error("Produto não existe no banco.");

              const payload: any = { referenceId: prod.referenceId, name: prod.name };
              if (acao === "atualizar_estoque") payload.stock = Number(args.valor);
              if (acao === "atualizar_preco") payload.price = Number(args.valor);
              if (acao === "atualizar_ncm") payload.ncm = String(args.texto).trim();
              if (acao === "atualizar_nome") payload.name = String(args.texto).trim();
              if (acao === "atualizar_status") payload.status = String(args.texto).trim();

              await upsertProduct(payload);
              const updatedField =
                acao === "atualizar_estoque"
                  ? `estoque=${args.valor}`
                  : acao === "atualizar_preco"
                    ? `preço=${args.valor}`
                    : acao === "atualizar_ncm"
                      ? `ncm=${String(args.texto).trim()}`
                      : acao === "atualizar_nome"
                        ? `nome=${String(args.texto).trim()}`
                        : `status=${String(args.texto).trim()}`;
              result = `Produto ${prod.name} (Ref: ${prod.referenceId}) atualizado com sucesso! ${updatedField}`;
            } else {
              result = `Ação '${acao}' inválida para gerenciar_produtos. Use: buscar, atualizar_estoque, atualizar_preco, atualizar_ncm, atualizar_nome, atualizar_status, importar_csv, listar_sem_ncm.`;
            }
          } else if (input.name === "criar_lembrete") {
            const mensagem = String(args.mensagem || "");
            const minutos = Number(args.minutos_daqui || 0);
            if (!mensagem || minutos <= 0) throw new Error("Mensagem e minutos_daqui (>0) são obrigatórios.");

            const nextRun = new Date(Date.now() + minutos * 60 * 1000);

            const { createProactiveTask } = await import("./db");
            await createProactiveTask(ctx.user.id, {
              title: "Lembrete do Chat: " + mensagem,
              description: mensagem,
              nextRun,
              type: "watcher",
              status: "active"
            });
            result = `Lembrete agendado com SUCESSO para daqui a ${minutos} minutos. Eu te avisarei na tela!`;
          } else {
            result = `Ferramenta ${input.name} não implementada.`;
          }
        } catch (e: any) {
          result = `Erro ao executar ferramenta ${input.name}: ${e?.message || String(e)}`;
        }

        // Persistir resultado no histórico da conversa, se solicitado
        if (input.conversationId) {
          await addMessage(
            input.conversationId,
            "assistant",
            `[Tool:${input.name}] ${result}`
          );
        }

        return { result };
      }),

    getCapabilities: publicProcedure
      .input(
        z.object({
          provider: z.enum(["forge", "ollama"]),
          model: z.string().optional(),
        })
      )
      .query(async ({ input }) => {
        const prov = input.provider;
        const model = (input.model || "").toLowerCase();
        if (prov === "ollama") {
          const visionHints = [
            "llava",
            "bakllava",
            "moondream",
            "qwen2.5-vl",
            "qwen-vl",
            "qwen3-vl",
            "qwen3.5-vl",
            "glm-v",
            "llava-phi",
            "clip",
            "kimi-k2.5",
          ];
          const toolsHints = [
            "qwen2.5-vl",
            "qwen-vl",
            "qwen3-vl",
            "qwen3.5-vl",
            "kimi-k2.5",
          ];
          const thinkingHints = ["qwen3-vl", "qwen3.5-vl", "kimi-k2.5"];
          const supportsVision = visionHints.some(h => model.includes(h));
          const supportsTools = toolsHints.some(h => model.includes(h));
          const supportsThinking = thinkingHints.some(h => model.includes(h));
          return {
            provider: prov,
            model: input.model,
            supportsVision,
            supportsTools,
            supportsThinking,
            supportsJsonSchema: false,
            supportsFileAnalysis: true,
          };
        }
        return {
          provider: prov,
          model: input.model,
          supportsVision: true,
          supportsTools: true,
          supportsThinking: true,
          supportsJsonSchema: true,
          supportsFileAnalysis: true,
        };
      }),
  }),
  // RAG Router
  rag: router({
    listDocuments: protectedProcedure.query(async ({ ctx }) => {
      return getDocuments(ctx.user.id);
    }),
    getDocument: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ ctx, input }) => {
        return getDocumentById(ctx.user.id, input.id);
      }),
    uploadDocument: protectedProcedure
      .input(
        z.object({
          name: z.string(),
          type: z.string(),
          size: z.number(),
          url: z.string().optional(),
          content: z.string(), // Base64 or plain text
        })
      )
      .mutation(async ({ ctx, input }) => {
        const { content, ...docData } = input;
        const doc = await createDocument(ctx.user.id, docData);
        const docId = (doc as any).id ?? doc;

        // Simple chunking logic for RAG
        const chunks = input.content.match(/[\s\S]{1,1000}/g) || [];
        let chunkIndex = 0;

        for (const chunk of chunks) {
          // Generate embedding for chunk (Vector Search Support)
          let embedding: string | null = null;
          try {
            // Generate embedding using the default provider (Forge or Ollama)
            const vector = await generateEmbedding(chunk);
            embedding = JSON.stringify(vector);
          } catch (e) {
            console.warn(`Failed to generate embedding for chunk ${chunkIndex} of doc ${docId}:`, e);
          }

          await createDocumentChunk({
            documentId: Number(docId),
            content: chunk,
            chunkIndex: chunkIndex++,
            embedding,
          });
        }

        await updateDocumentStatus(ctx.user.id, Number(docId), "indexed");
        return { success: true, documentId: docId };
      }),
    deleteDocument: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ ctx, input }) => {
        return deleteDocument(ctx.user.id, input.id);
      }),
    search: protectedProcedure
      .input(z.object({ query: z.string(), limit: z.number().default(5) }))
      .query(async ({ ctx, input }) => {
        return searchDocumentChunks(ctx.user.id, input.query, input.limit);
      }),
  }),

  // Knowledge processing router for study materials
  knowledge: router({
    processContent: protectedProcedure
      .input(
        z.object({
          content: z.string(),
          type: z.enum(["text", "audio", "pdf", "url"]),
          title: z.string(),
          options: z
            .object({
              generateApostila: z.boolean().default(true),
              generateResumo: z.boolean().default(true),
              generateMapaMental: z.boolean().default(false),
              generateFlashcards: z.boolean().default(false),
              generateQuiz: z.boolean().default(false),
            })
            .optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const options = input.options || {
          generateApostila: true,
          generateResumo: true,
          generateMapaMental: false,
          generateFlashcards: false,
          generateQuiz: false,
        };
        const outputs: any = {};

        // 1. Analyze content
        const analysis = await analyzeContent(input.content);

        // 2. Ensure directories exist
        await ensureKnowledgeDirs();

        // 3. Generate requested materials
        if (options.generateApostila !== false) {
          const content = await generateApostila(
            input.content,
            input.title,
            analysis
          );
          const fileName = `apostila-${slugify(input.title)}-${Date.now()}.md`;
          const filePath = path.join(process.cwd(), "docs", "apostilas", fileName);
          await fs.promises.writeFile(filePath, content, "utf-8");
          outputs.apostila = {
            path: filePath,
            fileName,
            type: "markdown",
          };
        }

        if (options.generateResumo) {
          const content = await generateResumo(input.content, analysis);
          const fileName = `resumo-${slugify(input.title)}-${Date.now()}.md`;
          const filePath = path.join(process.cwd(), "docs", "resumos", fileName);
          await fs.promises.writeFile(filePath, content, "utf-8");
          outputs.resumo = {
            path: filePath,
            fileName,
            type: "markdown",
          };
        }

        if (options.generateMapaMental) {
          const content = await generateMapaMental(input.content, analysis);
          const fileName = `mapa-mental-${slugify(input.title)}-${Date.now()}.md`;
          const filePath = path.join(
            process.cwd(),
            "docs",
            "mapas-mentais",
            fileName
          );
          await fs.promises.writeFile(filePath, content, "utf-8");
          outputs.mapaMental = {
            path: filePath,
            fileName,
            type: "mermaid",
          };
        }

        if (options.generateFlashcards) {
          const content = await generateFlashcards(input.content, analysis);
          const fileName = `flashcards-${slugify(input.title)}-${Date.now()}.json`;
          const filePath = path.join(process.cwd(), "docs", "flashcards", fileName);
          await fs.promises.writeFile(
            filePath,
            JSON.stringify(content, null, 2),
            "utf-8"
          );
          outputs.flashcards = {
            path: filePath,
            fileName,
            type: "json",
          };
        }

        if (options.generateQuiz) {
          const content = await generateQuiz(input.content, analysis);
          const fileName = `quiz-${slugify(input.title)}-${Date.now()}.json`;
          const filePath = path.join(process.cwd(), "docs", "quizzes", fileName);
          await fs.promises.writeFile(
            filePath,
            JSON.stringify(content, null, 2),
            "utf-8"
          );
          outputs.quiz = {
            path: filePath,
            fileName,
            type: "json",
          };
        }

        // 4. Register in memory as a knowledge entry
        const memoryResult = await addMemoryEntry(
          ctx.user.id,
          `Processado conhecimento sobre "${input.title}". Materiais gerados: ${Object.keys(
            outputs
          ).join(", ")}`,
          `conhecimento, ${input.title}, ${input.type}`,
          "fact"
        );

        const memoryWarning =
          isMemoryGuardResult(memoryResult) && (memoryResult.blocked || memoryResult.skipped)
            ? memoryResult.policyMessage || "Memoria nao persistida por policy de seguranca."
            : null;

        return {
          success: true,
          title: input.title,
          outputs,
          analysis,
          memoryWarning,
        };
      }),
  }),

});

export type AppRouter = typeof appRouter;
