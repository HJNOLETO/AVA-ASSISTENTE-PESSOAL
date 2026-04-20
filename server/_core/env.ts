const parsePositiveInt = (value: string | undefined, fallback: number): number => {
  if (!value) return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) return fallback;
  return Math.floor(parsed);
};

const parseOllamaConcurrency = (value: string | undefined): number => {
  const parsed = parsePositiveInt(value, 1);
  return Math.min(parsed, 1);
};

export const ENV = {
  appId: process.env.VITE_APP_ID ?? "",
  cookieSecret: process.env.JWT_SECRET ?? "",
  databaseUrl: process.env.DATABASE_URL ?? "",
  oAuthServerUrl: process.env.OAUTH_SERVER_URL ?? "",
  ownerOpenId: process.env.OWNER_OPEN_ID ?? "",
  isProduction: process.env.NODE_ENV === "production",
  forgeApiUrl: process.env.BUILT_IN_FORGE_API_URL ?? "",
  forgeApiKey: process.env.BUILT_IN_FORGE_API_KEY ?? "",
  ollamaBaseUrl: process.env.OLLAMA_BASE_URL ?? "",
  llmProvider: (process.env.LLM_PROVIDER as "forge" | "ollama" | "openai" | undefined) ?? "ollama",
  ollamaModel: process.env.OLLAMA_MODEL ?? "",
  openaiApiKey: process.env.OPENAI_API_KEY ?? "",
  groqApiKey: process.env.GROQ_API_KEY ?? "",
  localWhisperUrl: process.env.WHISPER_LOCAL_URL ?? "",
  maxConcurrentOllamaCalls: parseOllamaConcurrency(process.env.MAX_CONCURRENT_OLLAMA_CALLS),
  maxConcurrentCloudLlmCalls: parsePositiveInt(process.env.MAX_CONCURRENT_CLOUD_LLM_CALLS, 5),
};
