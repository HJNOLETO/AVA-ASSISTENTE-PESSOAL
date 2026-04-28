// @vitest-environment node
import { describe, expect, it, vi, afterEach } from "vitest";
import { resolveTaskModel, routeTaskModel, checkModelHealth } from "../../server/_core/llm-router";

describe("llm-router", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("roteia embedding para modelo local", () => {
    const route = routeTaskModel("embedding");
    expect(route.localOnly).toBe(true);
    expect(route.primaryModel).toContain("nomic");
  });

  it("checkModelHealth retorna true imediatamente para modelos cloud (sem fetch)", async () => {
    const fetchSpy = vi.spyOn(global, "fetch");
    const ok = await checkModelHealth("qwen3-coder-next:cloud");
    expect(ok).toBe(true);
    expect(fetchSpy).not.toHaveBeenCalled(); // cloud nao faz fetch
  });

  it("checkModelHealth retorna false se Ollama local indisponivel", async () => {
    vi.spyOn(global, "fetch").mockRejectedValue(new Error("ECONNREFUSED"));
    const ok = await checkModelHealth("qwen2.5:7b-instruct", 1000);
    expect(ok).toBe(false);
  });

  it("resolve fallback local para conteudo sensivel e valida modelo retornado", async () => {
    process.env.AVA_MEMORY_BLOCK_SENSITIVE = "true";
    process.env.LLM_LOCAL_MODEL = "qwen3:4b";
    const expectedFallback = process.env.LLM_LOCAL_MODEL;
    const model = await resolveTaskModel("reasoning/legal", "senha do cliente: 123");
    // Para conteudo sensivel, deve retornar o modelo local (fallback), nao o cloud
    expect(model).toBe(expectedFallback);
  });
});

