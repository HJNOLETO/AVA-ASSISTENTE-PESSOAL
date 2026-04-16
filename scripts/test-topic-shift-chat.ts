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
    title: "Teste troca de assunto",
    mode: "ECO",
  });

  const conversationId = (created as any).conversationId ?? (created as any).id;
  console.log("[test] conversationId=", conversationId);

  const firstPrompt =
    "Quero informacoes do produto chambril: preco, estoque e referencia.";
  const secondPrompt =
    "Agora mude de assunto completamente e me entregue apenas um modelo de tabela SQL para cadastro de clientes.";
  const thirdPrompt =
    "/programacao Gere um modelo de tabela SQL para cadastro de clientes com id, nome, email, telefone e created_at.";

  const first = await caller.chat.sendMessage({
    conversationId,
    content: firstPrompt,
    provider: "ollama",
    model: process.env.OLLAMA_MODEL || "qwen2.5:7b-instruct",
  });

  console.log("\n[test] first prompt:", firstPrompt);
  console.log("[test] first response:", first.assistantMessage);

  const second = await caller.chat.sendMessage({
    conversationId,
    content: secondPrompt,
    provider: "ollama",
    model: process.env.OLLAMA_MODEL || "qwen2.5:7b-instruct",
  });

  console.log("\n[test] second prompt:", secondPrompt);
  console.log("[test] second response:", second.assistantMessage);

  const third = await caller.chat.sendMessage({
    conversationId,
    content: thirdPrompt,
    provider: "ollama",
    model: process.env.OLLAMA_MODEL || "qwen2.5:7b-instruct",
  });

  console.log("\n[test] third prompt:", thirdPrompt);
  console.log("[test] third response:", third.assistantMessage);

  const secondText = String(second.assistantMessage || "").toLowerCase();
  const leakedProductContext =
    secondText.includes("chambril") ||
    secondText.includes("estoque") ||
    secondText.includes("preco") ||
    secondText.includes("preço") ||
    secondText.includes("roberto papeis") ||
    secondText.includes("produto");

  console.log("\n[test] leak_detected=", leakedProductContext);

  const thirdText = String(third.assistantMessage || "").toLowerCase();
  const hasSqlSignal =
    thirdText.includes("create table") ||
    thirdText.includes("sql") ||
    thirdText.includes("clientes");
  console.log("[test] slash_mode_sql_signal=", hasSqlSignal);
}

main().catch((error) => {
  console.error("[test] failed:", error);
  process.exit(1);
});
