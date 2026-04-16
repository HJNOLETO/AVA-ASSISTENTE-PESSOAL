import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

vi.mock("./_core/llm", () => {
  return {
    invokeLLM: vi.fn(async () => ({
      id: "x",
      created: Date.now(),
      model: "ollama",
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: "resposta" },
          finish_reason: "stop",
        },
      ],
    })),
  };
});

function createCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "local-guest",
      email: null as any,
      name: "Local Guest",
      loginMethod: "guest",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    } as any,
    req: { protocol: "http", headers: {} } as any,
    res: { clearCookie: () => {} } as any,
  };
}

describe("chat flow with memory fallback", () => {
  it("creates conversation, sends and retrieves messages", async () => {
    const caller = appRouter.createCaller(createCtx());
    const created = await caller.chat.createConversation({
      title: "Teste",
      mode: "ECO",
    });
    const conversationId =
      (created as any).conversationId ?? (created as any).id;
    expect(conversationId).toBeTruthy();

    const before = await caller.chat.getMessages({ conversationId });
    expect(before.length).toBe(0);

    const result = await caller.chat.sendMessage({
      conversationId,
      content: "olá",
      provider: "ollama",
      model: "llama3.1:8b",
    });
    expect(result.assistantMessage).toBe("resposta");

    const after = await caller.chat.getMessages({ conversationId });
    expect(after.length).toBe(2);
    expect(after[0].role).toBe("user");
    expect(after[1].role).toBe("assistant");

    // Conversation updatedAt should be updated after sending a message and appear as recent
    const convsBefore = await caller.chat.listConversations();
    const convBefore = convsBefore.find((c: any) => c.id === conversationId);
    expect(convBefore).toBeTruthy();
    const updatedBefore = new Date(convBefore.updatedAt).getTime();

    // Wait a bit and send another message
    await new Promise(res => setTimeout(res, 10));
    await caller.chat.sendMessage({
      conversationId,
      content: "mensagem 2",
      provider: "ollama",
      model: "llama3.1:8b",
    });

    const convsAfter = await caller.chat.listConversations();
    const convAfter = convsAfter.find((c: any) => c.id === conversationId);
    expect(convAfter).toBeTruthy();
    const updatedAfter = new Date(convAfter.updatedAt).getTime();
    expect(updatedAfter).toBeGreaterThanOrEqual(updatedBefore);
  });

  it("renames, toggles favorite and exports a conversation", async () => {
    const caller = appRouter.createCaller(createCtx());
    const created = await caller.chat.createConversation({
      title: "ExportTest",
      mode: "ECO",
    });
    const conversationId =
      (created as any).conversationId ?? (created as any).id;

    // Rename
    const renameRes = await caller.chat.renameConversation({
      conversationId,
      title: "Renamed Title",
    });
    expect(renameRes.success).toBe(true);
    const conv = await caller.chat.getConversation({ conversationId });
    expect((conv as any).title).toBe("Renamed Title");

    // Toggle favorite
    const fav1 = await caller.chat.toggleFavorite({ conversationId });
    expect(fav1.success).toBe(true);
    expect((fav1.conversation as any).favorite).toBeTruthy();
    const fav2 = await caller.chat.toggleFavorite({ conversationId });
    expect((fav2.conversation as any).favorite).toBeFalsy();

    // Export JSON
    const exp = await caller.chat.exportConversation({
      conversationId,
      format: "json",
    });
    expect(exp.success).toBe(true);
    expect(exp.file).toBeDefined();
    const decoded = JSON.parse(
      Buffer.from(exp.file.contentBase64, "base64").toString("utf-8")
    );
    expect(decoded.meta.id).toBe(conversationId);
    expect(Array.isArray(decoded.messages)).toBe(true);
  });
});
