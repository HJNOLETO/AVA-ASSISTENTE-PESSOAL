import { ENV } from "./env";
import axios from "axios";
import { nanoid } from "nanoid";
import { TaskQueue } from "../utils/TaskQueue";
import os from "os";

export type Role = "system" | "user" | "assistant" | "tool" | "function";

export type TextContent = { type: "text"; text: string; };
export type ImageContent = { type: "image_url"; image_url: { url: string; detail?: "auto" | "low" | "high"; }; };
export type FileContent = { type: "file_url"; file_url: { url: string; mime_type?: "audio/mpeg" | "audio/wav" | "application/pdf" | "audio/mp4" | "video/mp4"; }; };

export type MessageContent = string | TextContent | ImageContent | FileContent;

export type Message = {
  role: Role;
  content: MessageContent | MessageContent[];
  name?: string;
  tool_call_id?: string;
  tool_calls?: ToolCall[];
};

export type Tool = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, unknown>;
  };
};

export type ToolChoicePrimitive = "none" | "auto" | "required";
export type ToolChoiceByName = { name: string };
export type ToolChoiceExplicit = { type: "function"; function: { name: string; }; };
export type ToolChoice = ToolChoicePrimitive | ToolChoiceByName | ToolChoiceExplicit;

export type InvokeParams = {
  messages: Message[];
  tools?: Tool[];
  toolChoice?: ToolChoice;
  tool_choice?: ToolChoice;
  maxTokens?: number;
  max_tokens?: number;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  provider?: "forge" | "ollama" | "groq" | "gemini";
  model?: string;
  ollamaBaseUrl?: string;
  ollamaAuthToken?: string;
  signal?: AbortSignal; // ✅ Adicionado para timeout/cancelamento
  timeoutMs?: number;
};

type LlmProvider = "forge" | "ollama" | "groq" | "gemini";

type OllamaAdaptiveTier = "full" | "balanced" | "safe";

type OllamaAdaptiveProfile = {
  tier: OllamaAdaptiveTier;
  reason: string;
  totalMemGb: number;
  freeMemGb: number;
  cpuCount: number;
};

const clampNumber = (value: number, min: number, max: number): number => {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
};

const degradeTier = (tier: OllamaAdaptiveTier): OllamaAdaptiveTier => {
  if (tier === "full") return "balanced";
  if (tier === "balanced") return "safe";
  return "safe";
};

const detectOllamaAdaptiveProfile = (): OllamaAdaptiveProfile => {
  const mode = String(process.env.AVA_OLLAMA_PROFILE || "auto").trim().toLowerCase();
  const totalMemGb = Number((os.totalmem() / (1024 ** 3)).toFixed(1));
  const freeMemGb = Number((os.freemem() / (1024 ** 3)).toFixed(1));
  const cpuCount = os.cpus().length;
  const freeRatio = os.totalmem() > 0 ? os.freemem() / os.totalmem() : 0;

  if (mode === "full" || mode === "balanced" || mode === "safe") {
    return {
      tier: mode,
      reason: `forcado por AVA_OLLAMA_PROFILE=${mode}`,
      totalMemGb,
      freeMemGb,
      cpuCount,
    };
  }

  let tier: OllamaAdaptiveTier;
  if (totalMemGb >= 24 && cpuCount >= 10) {
    tier = "full";
  } else if (totalMemGb >= 12 && cpuCount >= 6) {
    tier = "balanced";
  } else {
    tier = "safe";
  }

  const reasons: string[] = [
    `auto totalMem=${totalMemGb}GB`,
    `freeMem=${freeMemGb}GB`,
    `cpu=${cpuCount}`,
  ];

  if (freeRatio < 0.12) {
    tier = degradeTier(tier);
    reasons.push("degradado por memoria livre < 12% do total");
  }

  return {
    tier,
    reason: reasons.join(" | "),
    totalMemGb,
    freeMemGb,
    cpuCount,
  };
};

const resolveAdaptiveModel = (selectedModel: string, profile: OllamaAdaptiveProfile, explicitModelProvided: boolean): string => {
  const allowForcedModel = String(process.env.AVA_OLLAMA_FORCE_PROFILE_MODEL || "false").toLowerCase() === "true";
  if (explicitModelProvided && !allowForcedModel) return selectedModel;

  const envModelByTier =
    profile.tier === "full"
      ? process.env.OLLAMA_MODEL_FULL
      : profile.tier === "balanced"
        ? process.env.OLLAMA_MODEL_BALANCED
        : process.env.OLLAMA_MODEL_SAFE;

  const normalized = String(envModelByTier || "").trim();
  return normalized.length > 0 ? normalized : selectedModel;
};

export type ToolCall = {
  id: string;
  type: "function";
  function: { name: string; arguments: string; };
};

export type InvokeResult = {
  id: string;
  created: number;
  model: string;
  choices: Array<{
    index: number;
    message: {
      role: Role;
      content: string | Array<TextContent | ImageContent | FileContent>;
      tool_calls?: ToolCall[];
    };
    finish_reason: string | null;
  }>;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
};

export type JsonSchema = { name: string; schema: Record<string, unknown>; strict?: boolean; };
export type OutputSchema = JsonSchema;
export type ResponseFormat = { type: "text" } | { type: "json_object" } | { type: "json_schema"; json_schema: JsonSchema; };

const ensureArray = (value: MessageContent | MessageContent[]): MessageContent[] => 
  Array.isArray(value) ? value : [value];

const normalizeContentPart = (part: MessageContent): TextContent | ImageContent | FileContent => {
  if (typeof part === "string") return { type: "text", text: part };
  if (part.type === "text" || part.type === "image_url" || part.type === "file_url") return part;
  throw new Error("Unsupported message content part");
};

const normalizeMessage = (message: Message) => {
  const { role, name, tool_call_id } = message;

  if (role === "tool" || role === "function") {
    const content = ensureArray(message.content)
      .map(part => (typeof part === "string" ? part : JSON.stringify(part)))
      .join("\n");
    return { role, name, tool_call_id, content };
  }

  const contentParts = ensureArray(message.content).map(normalizeContentPart);
  
  const baseReturn = { role, name };
  if (message.tool_calls) {
    (baseReturn as any).tool_calls = message.tool_calls;
  }

  if (contentParts.length === 1 && contentParts[0].type === "text") {
    return { ...baseReturn, content: contentParts[0].text };
  }
  return { ...baseReturn, content: contentParts };
};

const normalizeToolChoice = (toolChoice: ToolChoice | undefined, tools: Tool[] | undefined): 
  "none" | "auto" | ToolChoiceExplicit | undefined => {
  if (!toolChoice) return undefined;
  if (toolChoice === "none" || toolChoice === "auto") return toolChoice;
  if (toolChoice === "required") {
    if (!tools || tools.length === 0) throw new Error("tool_choice 'required' was provided but no tools were configured");
    if (tools.length > 1) throw new Error("tool_choice 'required' needs a single tool or specify the tool name explicitly");
    return { type: "function", function: { name: tools[0].function.name } };
  }
  if ("name" in toolChoice) return { type: "function", function: { name: toolChoice.name } };
  return toolChoice;
};

const resolveApiUrl = () =>
  ENV.forgeApiUrl && ENV.forgeApiUrl.trim().length > 0
    ? `${ENV.forgeApiUrl.replace(/\/$/, "")}/v1/chat/completions`
    : "https://forge.manus.im/v1/chat/completions";

const assertApiKey = () => {
  if (!ENV.forgeApiKey) throw new Error("OPENAI_API_KEY is not configured");
};

const normalizeResponseFormat = ({ responseFormat, response_format, outputSchema, output_schema }: {
  responseFormat?: ResponseFormat;
  response_format?: ResponseFormat;
  outputSchema?: OutputSchema;
  output_schema?: OutputSchema;
}) => {
  const explicitFormat = responseFormat || response_format;
  if (explicitFormat) {
    if (explicitFormat.type === "json_schema" && !explicitFormat.json_schema?.schema) {
      throw new Error("responseFormat json_schema requires a defined schema object");
    }
    return explicitFormat;
  }
  const schema = outputSchema || output_schema;
  if (!schema) return undefined;
  if (!schema.name || !schema.schema) throw new Error("outputSchema requires both name and schema");
  return { type: "json_schema", json_schema: { name: schema.name, schema: schema.schema, ...(typeof schema.strict === "boolean" ? { strict: schema.strict } : {}) } };
};

// ✅ NOVO: Função utilitária para fetch com timeout
const fetchWithTimeout = async (url: string, options: RequestInit & { timeout?: number }) => {
  const { timeout = 60000, signal, ...rest } = options;
  
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  // Combinar signals se um externo foi fornecido
  if (signal) {
    signal.addEventListener('abort', () => controller.abort());
  }
  
  try {
    const response = await fetch(url, { ...rest, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(timeoutId);
  }
};

const ollamaTaskQueue = new TaskQueue({
  maxConcurrent: ENV.maxConcurrentOllamaCalls,
});

const cloudTaskQueue = new TaskQueue({
  maxConcurrent: ENV.maxConcurrentCloudLlmCalls,
});

export async function generateEmbedding(text: string, provider?: "forge" | "ollama"): Promise<number[]> {
  const selectedProvider = provider || (process.env.LLM_PROVIDER as "forge" | "ollama" | undefined) || "ollama";
  const model = process.env.EMBEDDING_MODEL || (selectedProvider === "ollama" ? "nomic-embed-text" : "text-embedding-3-small");

  try {
    if (selectedProvider === "ollama") {
      const base = process.env.OLLAMA_BASE_URL || "http://localhost:11434";
      const url = `${base.replace(/\/$/, "")}/api/embeddings`;
      
      const response = await fetchWithTimeout(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model, prompt: text }),
      });

      if (!response.ok) {
        throw new Error(`Ollama embedding failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.embedding;
    } else {
      // Forge / OpenAI Compatible
      const apiUrl = process.env.FORGE_API_URL 
        ? `${process.env.FORGE_API_URL.replace(/\/$/, "")}/v1/embeddings`
        : "https://forge.manus.im/v1/embeddings";
        
      const apiKey = process.env.FORGE_API_KEY;
      if (!apiKey) throw new Error("FORGE_API_KEY is not configured");

      const response = await fetchWithTimeout(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ model, input: text }),
      });

      if (!response.ok) {
        throw new Error(`Forge embedding failed: ${response.statusText}`);
      }

      const data = await response.json();
      return data.data[0].embedding;
    }
  } catch (error) {
    console.error("Embedding generation error:", error);
    // Return empty array or throw? Throwing is better to handle upstream.
    throw error;
  }
}

export async function invokeLLM(params: InvokeParams): Promise<InvokeResult> {
  const provider = (params.provider || (process.env.LLM_PROVIDER as LlmProvider | undefined) || "ollama") as LlmProvider;
  const providersToTry = buildProviderAttempts(provider);
  const failoverEnabled = String(process.env.LLM_AUTO_FAILOVER ?? "true").toLowerCase() !== "false";
  const errors: string[] = [];

  for (let i = 0; i < providersToTry.length; i++) {
    const selectedProvider = providersToTry[i];
    const queue = selectedProvider === "ollama" ? ollamaTaskQueue : cloudTaskQueue;

    try {
      const fallbackSafeModel = selectedProvider === provider ? params.model : undefined;
      return await queue.enqueue(
        () => invokeLLMInternal({ ...params, provider: selectedProvider, model: fallbackSafeModel }),
        { taskType: "invokeLLM", provider: selectedProvider },
      );
    } catch (error: any) {
      const message = String(error?.message || error || "Erro desconhecido");
      errors.push(`${selectedProvider}: ${message}`);
      const hasNext = i < providersToTry.length - 1;
      const canFallback = failoverEnabled && hasNext && shouldFallbackToNextProvider(message);

      if (!canFallback) {
        throw error;
      }

      const nextProvider = providersToTry[i + 1];
      console.warn(`[LLM] Failover ativado: ${selectedProvider} -> ${nextProvider} | motivo: ${message}`);
    }
  }

  throw new Error(`Falha em todos os provedores LLM testados: ${errors.join(" | ")}`);
}

function shouldFallbackToNextProvider(message: string): boolean {
  const m = message.toLowerCase();
  return (
    m.includes("429") ||
    m.includes("quota") ||
    m.includes("resource_exhausted") ||
    m.includes("rate limit") ||
    m.includes("timeout") ||
    m.includes("tempo esgotado") ||
    m.includes("econrefused") ||
    m.includes("não foi possível conectar") ||
    m.includes("nao foi possivel conectar") ||
    m.includes("503") ||
    m.includes("sobrecarregado") ||
    m.includes("not configured")
  );
}

function isProviderConfigured(provider: LlmProvider): boolean {
  if (provider === "ollama") return true;
  if (provider === "gemini") return Boolean((process.env.GEMINI_API_KEY || "").trim());
  if (provider === "groq") return Boolean((process.env.GROQ_API_KEY || "").trim());
  if (provider === "forge") return Boolean((ENV.forgeApiKey || "").trim());
  return false;
}

function buildProviderAttempts(primary: LlmProvider): LlmProvider[] {
  const rawChain = String(process.env.LLM_FALLBACK_CHAIN || "ollama,gemini,groq,forge");
  const parsed = rawChain
    .split(/[;,\s]+/g)
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .filter((item): item is LlmProvider => ["ollama", "gemini", "groq", "forge"].includes(item));

  const ordered = [primary, ...parsed.filter((p) => p !== primary)];
  const deduped = Array.from(new Set(ordered));
  return deduped.filter((p) => isProviderConfigured(p));
}

async function invokeLLMInternal(params: InvokeParams & { provider: "forge" | "ollama" | "groq" | "gemini" }): Promise<InvokeResult> {
  const provider = params.provider;
  const { messages, tools, toolChoice, tool_choice, outputSchema, output_schema, responseFormat, response_format, model, signal, timeoutMs } = params;

  // ===== OLLAMA (Local ou Remoto) =====
  if (provider === "ollama") {
    const base = params.ollamaBaseUrl || process.env.OLLAMA_BASE_URL || "http://localhost:11434";
    const url = `${base.replace(/\/$/, "")}/api/chat`;
    
    console.log(`[LLM] Conectando ao Ollama: ${url}`);
    console.log(`[LLM] Modelo: ${model || process.env.OLLAMA_MODEL || "llama3.2:latest"}`);

    try {
      const chatMessages = messages.map((m) => {
        const parts = ensureArray(m.content);
        const text = parts
          .map((p) => (typeof p === "string" ? p : (p as any)?.text ?? ""))
          .filter((t) => t && t.length > 0)
          .join("\n");
        const images: string[] = parts
          .filter((p) => (p as any)?.type === "image_url")
          .map((p: any) => {
            const url: string = p.image_url?.url || "";
            if (url.startsWith("data:")) {
              const base64 = url.split(",")[1] || "";
              return base64;
            }
            return "";
          })
          .filter((b64) => b64.length > 0);
        const msg: Record<string, any> = { role: m.role, content: text || "" };
        if (images.length > 0) msg.images = images;
        return msg;
      });

      const parsedTemperature = Number(process.env.OLLAMA_TEMPERATURE ?? "0.3");
      const parsedTopP = Number(process.env.OLLAMA_TOP_P ?? "0.9");
      const parsedNumCtx = Number(process.env.OLLAMA_NUM_CTX ?? "4096");
      const parsedNumPredict = Number(process.env.OLLAMA_NUM_PREDICT ?? "0");
      const parsedRepeatPenalty = Number(process.env.OLLAMA_REPEAT_PENALTY ?? "0");
      const thinkEnv = (process.env.OLLAMA_THINK ?? "").trim().toLowerCase();
      const thinkValue = thinkEnv === "true" ? true : thinkEnv === "false" ? false : undefined;
      const baseModel = model || process.env.OLLAMA_MODEL || "llama3.2:latest";
      const adaptiveProfile = detectOllamaAdaptiveProfile();
      const selectedModel = resolveAdaptiveModel(baseModel, adaptiveProfile, Boolean(model));
      const isQwen25 = selectedModel.toLowerCase().includes("qwen2.5");
      const maxNumCtx = isQwen25 ? 4096 : 8192;
      let safeNumCtx =
        Number.isFinite(parsedNumCtx) && parsedNumCtx > 0
          ? Math.min(parsedNumCtx, maxNumCtx)
          : 4096;

      if (adaptiveProfile.tier === "balanced") {
        safeNumCtx = clampNumber(safeNumCtx, 1024, Math.min(4096, maxNumCtx));
      }

      if (adaptiveProfile.tier === "safe") {
        safeNumCtx = clampNumber(safeNumCtx, 768, Math.min(2048, maxNumCtx));
      }

      let safeNumPredict = Number.isFinite(parsedNumPredict) && parsedNumPredict > 0
        ? Math.floor(parsedNumPredict)
        : 0;

      if (adaptiveProfile.tier === "balanced") {
        safeNumPredict = safeNumPredict > 0 ? Math.min(safeNumPredict, 768) : 768;
      }

      if (adaptiveProfile.tier === "safe") {
        safeNumPredict = safeNumPredict > 0 ? Math.min(safeNumPredict, 384) : 384;
      }

      const safeTemperature = adaptiveProfile.tier === "safe"
        ? Math.min(Number.isFinite(parsedTemperature) ? parsedTemperature : 0.3, 0.2)
        : adaptiveProfile.tier === "balanced"
          ? Math.min(Number.isFinite(parsedTemperature) ? parsedTemperature : 0.3, 0.25)
          : (Number.isFinite(parsedTemperature) ? parsedTemperature : 0.3);

      const ollamaOptions: Record<string, number> = {
        temperature: safeTemperature,
        num_ctx: safeNumCtx,
      };

      if (Number.isFinite(parsedTopP) && parsedTopP > 0 && parsedTopP <= 1) {
        ollamaOptions.top_p = parsedTopP;
      }
      if (safeNumPredict > 0) {
        ollamaOptions.num_predict = safeNumPredict;
      }
      if (Number.isFinite(parsedRepeatPenalty) && parsedRepeatPenalty > 0) {
        ollamaOptions.repeat_penalty = parsedRepeatPenalty;
      }

      const ollamaKeepAliveRaw = (process.env.OLLAMA_KEEP_ALIVE || "").trim();
      const ollamaKeepAlive =
        ollamaKeepAliveRaw.length === 0
          ? undefined
          : /^-?\d+$/.test(ollamaKeepAliveRaw)
            ? Number(ollamaKeepAliveRaw)
            : ollamaKeepAliveRaw;

      const ollamaTimeout =
        timeoutMs ||
        Number(
          process.env.OLLAMA_CHAT_TIMEOUT_MS ||
            process.env.OLLAMA_TIMEOUT_MS ||
            300000
        );

      console.log(
        `[LLM][Adaptive] perfil=${adaptiveProfile.tier} | modelo=${selectedModel} | num_ctx=${safeNumCtx} | num_predict=${safeNumPredict > 0 ? safeNumPredict : "padrao"} | motivo=${adaptiveProfile.reason}`
      );

      const sendOllamaChat = async (modelName: string) => {
        const response = await axios.post(
          url,
          {
            model: modelName,
            messages: chatMessages,
            stream: false,
            ...(tools && tools.length > 0 ? { tools } : {}),
            ...(ollamaKeepAlive !== undefined ? { keep_alive: ollamaKeepAlive } : {}),
            ...(typeof thinkValue === "boolean" ? { think: thinkValue } : {}),
            options: ollamaOptions,
          },
          {
            headers: {
              "content-type": "application/json",
              ...(params.ollamaAuthToken ? { authorization: `Bearer ${params.ollamaAuthToken}` } : {}),
            },
            signal,
            timeout: ollamaTimeout,
            validateStatus: () => true,
          }
        );

        if (response.status < 200 || response.status >= 300) {
          const errorText =
            typeof response.data === "string"
              ? response.data
              : JSON.stringify(response.data ?? {});
          console.error(`[LLM] Erro Ollama ${response.status} (modelo ${modelName}): ${errorText}`);

          if (response.status === 401) {
            throw new Error("Ollama retornou 401 (Nao autorizado). Verifique se o token de autenticacao esta correto.");
          }
          if (response.status === 404) {
            throw new Error(`Modelo nao encontrado no Ollama. Execute: ollama pull ${modelName}`);
          }
          if (response.status === 503) {
            throw new Error("Ollama esta carregando o modelo ou sobrecarregado. Aguarde um momento e tente novamente.");
          }

          throw new Error(`Erro Ollama (${response.status}): ${errorText || response.statusText}`);
        }

        return response.data;
      };

      const retryOnTimeout = String(process.env.AVA_OLLAMA_RETRY_ON_TIMEOUT || "true").toLowerCase() !== "false";
      const fallbackModel = String(process.env.OLLAMA_MODEL_SAFE || "").trim();
      let activeModel = selectedModel;
      let data: any;

      try {
        data = await sendOllamaChat(activeModel);
      } catch (firstError: any) {
        const message = String(firstError?.message || firstError || "");
        const isTimeoutLike =
          /timeout|tempo esgotado|ETIMEDOUT|ECONNABORTED/i.test(message) ||
          firstError?.code === "ECONNABORTED";

        if (retryOnTimeout && isTimeoutLike && fallbackModel && fallbackModel !== activeModel) {
          console.warn(`[LLM][Adaptive] Timeout detectado. Tentando fallback de modelo: ${activeModel} -> ${fallbackModel}`);
          activeModel = fallbackModel;
          data = await sendOllamaChat(activeModel);
        } else {
          throw firstError;
        }
      }

      const content = data?.message?.content ?? (Array.isArray(data?.messages) ? data.messages.at(-1)?.content : "");
      const text = typeof content === "string" ? content : String(content ?? "");
      
      console.log(`[LLM] Resposta Ollama recebida (${text.length} caracteres)`);

      return {
        id: String(Date.now()),
        created: Date.now(),
        model: activeModel,
        choices: [{
          index: 0,
          message: {
            role: "assistant",
            content: text,
            tool_calls: data?.message?.tool_calls?.map((tc: any) => ({
              id: tc.id || `call_${nanoid(10)}`,
              type: "function",
              function: {
                name: tc.function.name,
                arguments: typeof tc.function.arguments === "string"
                  ? tc.function.arguments
                  : JSON.stringify(tc.function.arguments),
              },
            }))
          },
          finish_reason: data?.done_reason || "stop",
        }],
      };
    } catch (error: any) {
      if (error?.name === "AbortError" || error?.code === "ERR_CANCELED") {
        throw new Error("Tempo esgotado (timeout). O modelo demorou muito para responder.");
      }
      if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
        throw new Error("Tempo esgotado (timeout). O modelo demorou muito para responder.");
      }
      if (
        error?.code === "ECONNREFUSED" ||
        error?.message?.includes("fetch failed") ||
        error?.message?.includes("ECONNREFUSED") ||
        (axios.isAxiosError(error) && !error.response)
      ) {
        throw new Error(`Não foi possível conectar ao Ollama em ${url}. Verifique se o servidor está rodando (execute: ollama serve)`);
      }
      throw error;
    }
  }

  // ===== CLOUD LLM (Forge / Groq / Gemini) =====
  let apiKey = ENV.forgeApiKey;
  let apiUrl = resolveApiUrl();

  if (provider === "groq") {
    apiKey = process.env.GROQ_API_KEY ?? "";
    if (!apiKey) throw new Error("GROQ_API_KEY is not configured");
    apiUrl = "https://api.groq.com/openai/v1/chat/completions";
    console.log(`[LLM] Conectando ao Groq: ${apiUrl}`);
  } else if (provider === "gemini") {
    apiKey = process.env.GEMINI_API_KEY ?? "";
    if (!apiKey) throw new Error("GEMINI_API_KEY is not configured");
    apiUrl = "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";
    console.log(`[LLM] Conectando ao Gemini Proxy: ${apiUrl}`);
  } else {
    assertApiKey();
    console.log(`[LLM] Conectando ao Forge: ${apiUrl}`);
  }

  const payload: Record<string, unknown> = {
    model: model || (provider === "groq" ? "llama-3.3-70b-versatile" : provider === "gemini" ? (process.env.GEMINI_MODEL || "gemini-2.5-flash") : "gemini-2.5-flash"),
    messages: messages.map(normalizeMessage),
  };

  if (tools && tools.length > 0) payload.tools = tools;

  const normalizedToolChoice = normalizeToolChoice(toolChoice || tool_choice, tools);
  if (normalizedToolChoice) payload.tool_choice = normalizedToolChoice;

  payload.max_tokens = 8000;
  if (provider === "forge") {
    payload.thinking = { "budget_tokens": 128 };
  }

  const normalizedResponseFormat = normalizeResponseFormat({ responseFormat, response_format, outputSchema, output_schema });
  if (normalizedResponseFormat) payload.response_format = normalizedResponseFormat;

  try {
    const forgeTimeout = timeoutMs || Number(process.env.FORGE_CHAT_TIMEOUT_MS || 60000);

    const response = await fetchWithTimeout(apiUrl, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(payload),
      signal,
      timeout: forgeTimeout,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`[LLM] Erro Forge ${response.status}: ${errorText}`);
      throw new Error(`Erro Forge (${response.status}): ${errorText || response.statusText}`);
    }

    const result = await response.json() as InvokeResult;
    console.log(`[LLM] Resposta Forge recebida`);
    return result;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error("Tempo esgotado ao conectar com Forge.");
    }
    throw error;
  }
}
