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
    title: "Repro timeout Ollama",
    mode: "ECO",
  });

  const conversationId = (created as any).conversationId ?? (created as any).id;
  console.log("[repro] conversationId=", conversationId);

  const startedAt = Date.now();
  const result = await caller.chat.sendMessage({
    conversationId,
    content: "Responda apenas: OK",
    provider: "ollama",
    model: process.env.OLLAMA_MODEL || "qwen2.5:7b-instruct",
  });

  console.log("[repro] durationMs=", Date.now() - startedAt);
  console.log("[repro] success=", result.success);
  console.log("[repro] assistantMessage=", result.assistantMessage);
}

main().catch((error) => {
  console.error("[repro] failed:", error);
  process.exit(1);
});
