import "dotenv/config";
import { appRouter } from "../server/routers";

async function main() {
  const caller = appRouter.createCaller({
    user: {
      id: 1,
      openId: "local-guest",
      email: null,
      name: "Local Guest",
      loginMethod: "guest",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } as any,
    req: { protocol: "http", headers: {} } as any,
    res: { clearCookie: () => {} } as any,
  } as any);

  const created = await caller.chat.createConversation({
    title: "Teste slash programacao",
    mode: "ECO",
  });

  const conversationId = (created as any).conversationId ?? (created as any).id;
  const prompt =
    "/programacao Gere apenas um SQL CREATE TABLE clientes com id, nome e email.";

  const result = await caller.chat.sendMessage({
    conversationId,
    content: prompt,
    provider: "ollama",
    model: process.env.OLLAMA_MODEL || "qwen2.5:7b-instruct",
  });

  console.log("[slash] success=", result.success);
  console.log("[slash] response=", result.assistantMessage);
}

main().catch((error) => {
  console.error("[slash] failed:", error);
  process.exit(1);
});
