import { describe, it, expect } from "vitest";
import { appRouter } from "./routers";
import { addMemoryEntry } from "./db";

function createTestCtx() {
  return {
    user: {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      role: "admin",
      loginMethod: "manus",
      openId: "test",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: () => {} } as any,
  } as any;
}

describe("llm router - tools", () => {
  it("getTools returns known tools", async () => {
    const ctx = createTestCtx();
    const caller = appRouter.createCaller(ctx as any);
    const tools = await caller.llm.getTools();
    const names = tools.map((t: any) => t.function.name);
    expect(names).toEqual(
      expect.arrayContaining([
        "listar_arquivos",
        "ler_arquivo",
        "obter_data_hora",
        "buscar_na_memoria",
      ])
    );
  });

  it("runTool listar_arquivos lists files for project root", async () => {
    const ctx = createTestCtx();
    const caller = appRouter.createCaller(ctx as any);
    const res = await caller.llm.runTool({
      name: "listar_arquivos",
      args: { caminho: "." },
    });
    expect(res.result).toContain("Arquivos em");
    expect(res.result.length).toBeGreaterThan(10);
  });

  it("runTool ler_arquivo reads package.json", async () => {
    const ctx = createTestCtx();
    const caller = appRouter.createCaller(ctx as any);
    const res = await caller.llm.runTool({
      name: "ler_arquivo",
      args: { caminho: "package.json" },
    });
    expect(res.result).toContain("name");
    expect(res.result.length).toBeGreaterThan(20);
  });

  it("runTool obter_data_hora returns a date string", async () => {
    const ctx = createTestCtx();
    const caller = appRouter.createCaller(ctx as any);
    const res = await caller.llm.runTool({ name: "obter_data_hora" });
    const date = new Date(res.result);
    expect(date.getTime()).toBeGreaterThan(0);
  });

  it("runTool buscar_na_memoria finds added memory", async () => {
    const ctx = createTestCtx();
    const caller = appRouter.createCaller(ctx as any);
    await addMemoryEntry(1, "Meu nome é João", "João", "fact");
    const res = await caller.llm.runTool({
      name: "buscar_na_memoria",
      args: { palavras_chave: ["João"] },
    });
    expect(res.result).toContain("Meu nome é João");
  });
});
