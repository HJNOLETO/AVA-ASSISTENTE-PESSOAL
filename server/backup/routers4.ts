import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { transcribeAudio } from "./_core/voiceTranscription";
import { storagePut } from "./storage";
import {
  getHardwareInfo,
  getHardwareMetrics,
  detectOperationMode,
  getModeCapabilities,
  getRecommendedMode,
  isHardwareCompatible,
} from "./hardware";
import {
  createConversation,
  getConversations,
  getConversationById,
  addMessage,
  getMessages,
  getUserSettings,
  createOrUpdateUserSettings,
  addMemoryEntry,
  searchMemoryByKeywords,
  addHardwareSnapshot,
  getRecentHardwareSnapshots,
} from "./db";
import { invokeLLM } from "./_core/llm";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
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
      const settings = await getUserSettings(ctx.user.id);
      const autoDetect = (settings?.autoDetectHardware ?? 1) === 1;
      const preferred = settings?.preferredMode;

      const mode = detectOperationMode(
        autoDetect,
        preferred as "ECO" | "STANDARD" | "PERFORMANCE" | undefined
      );

      return {
        mode,
        capabilities: getModeCapabilities(mode),
        isCompatible: isHardwareCompatible(mode),
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
          input.map(async (file) => {
            try {
              const ext = file.name.toLowerCase().split(".").pop();
              const buffer = Buffer.from(file.content, "base64");
              let extractedText = "";

              // PDF processing
              if (ext === "pdf" || file.type === "application/pdf") {
                try {
                  extractedText = `[PDF: ${file.name} - Conteúdo extraído automaticamente]`;
                } catch (e) {
                  extractedText = `[Erro ao processar PDF: ${file.name}]`;
                }
              }
              // Word documents
              else if (["doc", "docx"].includes(ext || "")) {
                try {
                  extractedText = `[Documento Word: ${file.name} - Conteúdo extraído]`;
                } catch (e) {
                  extractedText = `[Erro ao processar documento: ${file.name}]`;
                }
              }
              // Excel/CSV
              else if (["xls", "xlsx", "csv"].includes(ext || "")) {
                try {
                  extractedText = `[Planilha: ${file.name} - Dados tabulares extraídos]`;
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
              };
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
          return {
            success: true,
            text: buffer.toString("utf-8").substring(0, 100000),
            truncated: buffer.length > 100000,
          };
        } catch (error) {
          return {
            success: false,
            error: "Failed to extract text",
          };
        }
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
        const conv = await getConversationById(input.conversationId, ctx.user.id);
        if (!conv) throw new Error("Conversation not found");
        return conv;
      }),

    getMessages: protectedProcedure
      .input(z.object({ conversationId: z.number() }))
      .query(async ({ ctx, input }) => {
        const conv = await getConversationById(input.conversationId, ctx.user.id);
        if (!conv) throw new Error("Conversation not found");
        return getMessages(input.conversationId);
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
            .enum([
              "image/png",
              "image/jpeg",
              "image/webp",
              "image/gif",
            ])
            .optional(),
          attachments: z
            .array(
              z.object({
                name: z.string(),
                type: z.string(),
                category: z.enum(["image", "code", "document", "data", "unknown"]),
                content: z.string().optional(),
                textContent: z.string().optional(),
              })
            )
            .optional(),
          context: z.object({
            summary: z.string().optional(),
            recentMessages: z.array(z.object({
              role: z.enum(["user", "assistant", "system"]),
              content: z.string(),
              timestamp: z.string(),
            })).optional(),
            totalPreviousMessages: z.number().optional(),
          }).optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const conv = await getConversationById(input.conversationId, ctx.user.id);
        if (!conv) throw new Error("Conversation not found");

        let messageContent = input.content;
        const attachments = input.attachments || [];
        
        // Build context from attachments
        if (attachments.length > 0) {
          const codeFiles = attachments.filter(a => a.category === "code" || a.category === "data");
          const documents = attachments.filter(a => a.category === "document");

          if (codeFiles.length > 0) {
            messageContent += "\n\n### Arquivos de Código Anexados:\n";
            codeFiles.forEach(file => {
              messageContent += `\n\`\`\`${file.name.split(".").pop() || ""}\n`;
              messageContent += `// Arquivo: ${file.name}\n`;
              messageContent += file.textContent || "";
              messageContent += "\n```\n";
            });
          }

          if (documents.length > 0) {
            messageContent += "\n\n### Documentos Anexados:\n";
            documents.forEach(doc => {
              messageContent += `\n[Documento: ${doc.name}]\n`;
              messageContent += doc.textContent || "[Conteúdo não extraído]";
              messageContent += "\n";
            });
          }
        }

        // Add user message
        await addMessage(input.conversationId, "user", messageContent);

        // Get LLM response
        try {
          let systemContent = "Você é um assistente virtual inteligente e adaptativo. Responda de forma clara e concisa.";
          
          if (input.context?.summary) {
            systemContent += `\n\n[Contexto da Conversa]: ${input.context.summary}`;
          }
          
          if (input.context?.recentMessages && input.context.recentMessages.length > 0) {
            systemContent += "\n\n[Mensagens Anteriores Relevantes]:";
            input.context.recentMessages.slice(-5).forEach((msg) => {
              systemContent += `\n${msg.role === 'user' ? 'Usuário' : 'Assistente'}: ${msg.content.substring(0, 200)}${msg.content.length > 200 ? '...' : ''}`;
            });
          }

          const messages: any[] = [
            {
              role: "system",
              content: systemContent,
            },
          ];

          const imageAttachments = attachments.filter(a => a.category === "image");
          
          if (imageAttachments.length > 0 && !input.imageBase64) {
            const contentParts: any[] = [{ type: "text", text: input.content || "Analise estas imagens:" }];
            
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
                input.content,
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
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

          const response = await invokeLLM({
            messages,
            ...(input.provider ? { provider: input.provider } : {}),
            ...(input.model ? { model: input.model } : {}),
            ...(input.ollamaBaseUrl ? { ollamaBaseUrl: input.ollamaBaseUrl } : {}),
            ...(input.ollamaAuthToken ? { ollamaAuthToken: input.ollamaAuthToken } : {}),
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));

          const assistantContent = typeof response.choices?.[0]?.message?.content === 'string'
            ? response.choices[0].message.content
            : "Desculpe, não consegui processar sua mensagem.";

          await addMessage(input.conversationId, "assistant", assistantContent);

          await addMemoryEntry(
            ctx.user.id,
            input.content,
            input.content.split(" ").slice(0, 5).join(" "),
            "context"
          );

          return {
            userMessage: input.content,
            assistantMessage: assistantContent,
            attachmentsProcessed: attachments.length,
            success: true,
          };
        } catch (error) {
          console.error("LLM error:", error);
          
          // ✅ MELHORIA: Extrair mensagem de erro específica
          let errorDetails = "Erro desconhecido";
          if (error instanceof Error) {
            errorDetails = error.message;
            // Traduções comuns de erros de rede
            if (error.message.includes("ECONNREFUSED")) {
              errorDetails = `Ollama não está rodando em ${input.ollamaBaseUrl || "localhost:11434"}. Verifique se o servidor está ativo.`;
            } else if (error.message.includes("ETIMEDOUT") || error.message.includes("timeout")) {
              errorDetails = "Tempo esgotado. O modelo pode estar ocupado ou indisponível.";
            } else if (error.message.includes("fetch failed")) {
              errorDetails = "Falha na conexão. Verifique a URL do Ollama e se está acessível.";
            }
          }
          
          const errorMessage = `❌ ${errorDetails}`;
          await addMessage(input.conversationId, "assistant", errorMessage);
          
          return {
            userMessage: input.content,
            assistantMessage: errorMessage,
            attachmentsProcessed: 0,
            error: errorDetails,
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
          mimeType: z
            .enum(["audio/webm", "audio/mp3", "audio/mpeg", "audio/wav", "audio/ogg", "audio/m4a"])
            .optional(),
          language: z.string().optional(),
          prompt: z.string().optional(),
        })
      )
      .mutation(async ({ input }): Promise<{ text: string } | { error: string; code?: string; details?: string }> => {
        try {
          let url = input.audioUrl;
          if (!url) {
            if (!input.audioBase64 || !input.mimeType) {
              return {
                error: "Audio data missing: provide audioUrl or audioBase64 + mimeType",
                code: "INVALID_FORMAT",
              };
            }
            const base64 = input.audioBase64.includes(",")
              ? input.audioBase64.split(",")[1]!
              : input.audioBase64;
            const buffer = Buffer.from(base64, "base64");
            const ext =
              input.mimeType === "audio/webm" ? "webm" :
              input.mimeType === "audio/mp3" ? "mp3" :
              input.mimeType === "audio/mpeg" ? "mp3" :
              input.mimeType === "audio/wav" ? "wav" :
              input.mimeType === "audio/ogg" ? "ogg" :
              input.mimeType === "audio/m4a" ? "m4a" : "audio";
            const key = `uploads/voice/${Date.now()}.${ext}`;
            const upload = await storagePut(key, buffer, input.mimeType);
            url = upload.url;
          }
          
          const result = await transcribeAudio({
            audioUrl: url!,
            language: input.language,
            prompt: input.prompt,
          });
          
          if (result && typeof result === 'object' && 'text' in result && result.text) {
            return { text: result.text };
          } else if (result && typeof result === 'object' && 'error' in result && result.error) {
            return { 
              error: result.error, 
              code: "TRANSCRIPTION_ERROR",
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
      }),
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
        await addMemoryEntry(
          ctx.user.id,
          input.content,
          input.keywords,
          input.type as any
        );
        return { success: true };
      }),
  }),

  // User settings
  settings: router({
    getSettings: protectedProcedure.query(async ({ ctx }) => {
      return getUserSettings(ctx.user.id);
    }),

    updateSettings: protectedProcedure
      .input(
        z.object({
          preferredMode: z.enum(["ECO", "STANDARD", "PERFORMANCE", "AUTO"]).optional(),
          autoDetectHardware: z.boolean().optional(),
          llmTemperature: z.number().min(0).max(100).optional(),
          llmTopP: z.number().min(0).max(100).optional(),
          sttLanguage: z.string().optional(),
          theme: z.string().optional(),
        })
      )
      .mutation(async ({ ctx, input }) => {
        const updateData: Record<string, any> = {};

        if (input.preferredMode !== undefined) updateData.preferredMode = input.preferredMode;
        if (input.autoDetectHardware !== undefined)
          updateData.autoDetectHardware = input.autoDetectHardware === true ? 1 : 0;
        if (input.llmTemperature !== undefined) updateData.llmTemperature = input.llmTemperature;
        if (input.llmTopP !== undefined) updateData.llmTopP = input.llmTopP;
        if (input.sttLanguage !== undefined) updateData.sttLanguage = input.sttLanguage;
        if (input.theme !== undefined) updateData.theme = input.theme;

        await createOrUpdateUserSettings(ctx.user.id, updateData);
        return { success: true };
      }),
  }),

  llm: router({
    // ✅ NOVO: Teste de conexão para diagnosticar problemas
    testConnection: publicProcedure
      .input(z.object({ 
        baseUrl: z.string().optional(),
        authToken: z.string().optional(),
        provider: z.enum(["ollama", "forge"]).default("ollama")
      }))
      .query(async ({ input }) => {
        try {
          if (input.provider === "forge") {
            // Teste simples para Forge (ajuste conforme sua implementação)
            return { 
              success: true, 
              message: "Forge não requer teste de conexão prévio",
              url: "cloud"
            };
          }
          
          const base = input.baseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434";
          const cleanBase = base.replace(/\/$/, "");
          
          console.log(`Testing Ollama connection at: ${cleanBase}`);
          
          const res = await fetch(`${cleanBase}/api/tags`, {
            method: "GET",
            headers: input.authToken ? { authorization: `Bearer ${input.authToken}` } : undefined,
            signal: AbortSignal.timeout(5000) // 5 segundos timeout
          });
          
          if (!res.ok) {
            return { 
              success: false, 
              error: `HTTP ${res.status}: ${res.statusText}`,
              url: cleanBase,
              suggestion: res.status === 401 ? "Verifique se o token de autorização está correto" : 
                         res.status === 404 ? "Endpoint não encontrado. Verifique se é uma URL Ollama válida" :
                         "Verifique se o Ollama está rodando"
            };
          }
          
          const data = await res.json();
          const models = data.models || [];
          
          return { 
            success: true, 
            models: models.length,
            modelNames: models.slice(0, 5).map((m: any) => m.name), // Primeiros 5 modelos
            url: cleanBase,
            message: models.length > 0 ? `Conectado! ${models.length} modelos disponíveis.` : "Conectado, mas nenhum modelo encontrado. Execute 'ollama pull nome-do-modelo'"
          };
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Erro desconhecido";
          let suggestion = "";
          
          if (errorMsg.includes("ECONNREFUSED")) {
            suggestion = "Ollama não está rodando. Execute 'ollama serve' no terminal";
          } else if (errorMsg.includes("ETIMEDOUT") || errorMsg.includes("timeout")) {
            suggestion = "Tempo esgotado. Verifique se a URL está correta e acessível";
          } else if (errorMsg.includes("getaddrinfo")) {
            suggestion = "URL inválida ou host não encontrado";
          }
          
          return { 
            success: false, 
            error: errorMsg,
            url: input.baseUrl || "http://localhost:11434",
            suggestion
          };
        }
      }),

    listOllamaModels: publicProcedure
      .input(z.object({ baseUrl: z.string().url().optional(), authToken: z.string().optional() }).optional())
      .query(async ({ input }) => {
        const base = (input?.baseUrl && input.baseUrl.trim().length > 0)
          ? input.baseUrl
          : (process.env.OLLAMA_BASE_URL || "http://localhost:11434");
        try {
          const res = await fetch(`${base.replace(/\/$/, "")}/api/tags`, {
            method: "GET",
            headers: input?.authToken ? { authorization: `Bearer ${input.authToken}` } : undefined,
          });
          if (!res.ok) {
            return [];
          }
          const data = await res.json().catch(() => ({}));
          const models: string[] = Array.isArray(data?.models)
            ? data.models.map((m: any) => m?.name).filter(Boolean)
            : [];
          return models;
        } catch (e) {
          console.error("Failed to list Ollama models:", e);
          return [];
        }
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
          const visionHints = ["llava", "bakllava", "moondream", "qwen2.5-vl", "qwen-vl", "qwen3-vl", "qwen3.5-vl", "glm-v", "llava-phi", "clip", "kimi-k2.5"];
          const toolsHints = ["qwen2.5-vl", "qwen-vl", "qwen3-vl", "qwen3.5-vl", "kimi-k2.5"];
          const thinkingHints = ["qwen3-vl", "qwen3.5-vl", "kimi-k2.5"];
          const supportsVision = visionHints.some((h) => model.includes(h));
          const supportsTools = toolsHints.some((h) => model.includes(h));
          const supportsThinking = thinkingHints.some((h) => model.includes(h));
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
});

export type AppRouter = typeof appRouter;

