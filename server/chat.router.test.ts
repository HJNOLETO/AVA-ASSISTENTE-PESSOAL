import { describe, it, expect, vi } from "vitest";

vi.mock("./db", () => {
  return {
    createConversation: vi.fn(),
    getConversations: vi.fn(),
    getConversationById: vi.fn(async (id: number, userId: number) => ({
      id,
      userId,
      title: "t",
      mode: "ECO",
      createdAt: new Date(),
      updatedAt: new Date(),
    })),
    addMessage: vi.fn(async () => { }),
    getMessages: vi.fn(async () => []),
    getUserSettings: vi.fn(async () => ({
      userId: 1,
      preferredMode: "ECO",
      autoDetectHardware: 1,
      profileRole: "médico",
      profession: "Cardiologista",
      expertiseLevel: "expert",
      preferredTone: "formal",
      includePiiInContext: 1,
    })),
    createOrUpdateUserSettings: vi.fn(),
    addMemoryEntry: vi.fn(async () => { }),
    addHardwareSnapshot: vi.fn(),
    getRecentHardwareSnapshots: vi.fn(),
    addSystemLog: vi.fn(),
    searchMemoryByKeywords: vi.fn(async () => []),
  };
});

vi.mock("./_core/llm", () => {
  return {
    // Default mock implementation
    invokeLLM: vi.fn(async () => ({
      id: "x",
      created: Date.now(),
      model: "m",
      choices: [
        {
          index: 0,
          message: { role: "assistant", content: "ok" },
          finish_reason: "stop",
        },
      ],
    })),
  };
});

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";
import { invokeLLM } from "./_core/llm";
import * as db from "./db";

function createCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "u",
      email: "e",
      name: "n",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: () => { } } as any,
  };
}

describe("chat.sendMessage", () => {
  it("returns assistant message on success", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.chat.sendMessage({
      conversationId: 1,
      content: "hi",
    });
    expect(result.assistantMessage).toBe("ok");
  });

  it("injects profile into system prompt and respects consent", async () => {
    // Arrange: user settings include profile role and consent for PII
    (db.getUserSettings as any).mockResolvedValue({
      userId: 1,
      preferredMode: "ECO",
      autoDetectHardware: 1,
      profileRole: "médico",
      profession: "Cardiologista",
      expertiseLevel: "expert",
      preferredTone: "formal",
      includePiiInContext: 1,
    });

    const caller = appRouter.createCaller(createCtx());

    // Act
    await caller.chat.sendMessage({ conversationId: 1, content: "sintomas" });

    // Sanity: ensure our mocked getUserSettings actually returns the test profile
    const ensuredSettings = await (db.getUserSettings as any)();
    expect(ensuredSettings).toMatchObject({
      profileRole: "médico",
      profession: "Cardiologista",
    });

    // Ensure getUserSettings was called during sendMessage
    expect((db.getUserSettings as any).mock.calls.length).toBeGreaterThan(0);
    const firstResultPromise = (db.getUserSettings as any).mock.results[0]
      .value;
    expect(await firstResultPromise).toMatchObject({ profileRole: "médico" });

    // Assert that invokeLLM was called and system content contains profile and notice
    expect((invokeLLM as any).mock.calls.length).toBeGreaterThan(0);
    const calledWith = (invokeLLM as any).mock.calls[0][0];
    // Some orchestrator code adds its own system message; verify that SOME message includes our profile info
    const allContents =
      calledWith?.messages
        ?.map((m: any) =>
          typeof m.content === "string" ? m.content : JSON.stringify(m.content)
        )
        .join("\n") || "";
    expect(allContents).toContain("[User Profile]");
    expect(allContents).toContain("role=médico");
    expect(allContents).toContain("Cardiologista");
    expect(allContents).toContain("[Notice]");
    expect(allContents).toContain("médicos");

    // Now mock settings with no PII consent and a legal role
    (db.getUserSettings as any).mockResolvedValueOnce({
      userId: 1,
      profileRole: "advogado",
      includePiiInContext: 0,
    });

    await caller.chat.sendMessage({ conversationId: 1, content: "contrato" });
    const calledWith2 = (invokeLLM as any).mock.calls[
      (invokeLLM as any).mock.calls.length - 1
    ][0];
    const systemMsg2 =
      calledWith2?.messages?.find((m: any) => m.role === "system")?.content ||
      calledWith2?.messages?.[0]?.content;
    expect(systemMsg2).toContain("role=advogado");
    expect(systemMsg2).toContain(
      "Não forneça aconselhamento jurídico vinculante"
    );
    expect(systemMsg2).not.toContain("name=");
  });

  it("returns friendly error message when LLM fails", async () => {
    // Mock failure consistently so fallback also fails
    (invokeLLM as any).mockImplementation(async () => {
      throw new Error("fail");
    });
    const addMessageSpy = vi.spyOn(db, "addMessage");
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.chat.sendMessage({
      conversationId: 1,
      content: "hi",
    });
    expect(result.assistantMessage).toBe(
      "Desculpe, não consegui responder agora. Tente novamente em instantes."
    );
    expect(addMessageSpy).toHaveBeenCalled();
  });
});
