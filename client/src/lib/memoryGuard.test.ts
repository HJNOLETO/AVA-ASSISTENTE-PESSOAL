import { describe, expect, it } from "vitest";
import {
  classifyMemoryInput,
  redactSensitiveText,
  routeMemoryPersistence,
} from "../../../server/security/memoryGuard";

describe("memoryGuard", () => {
  it("classifies secrets and routes to vault", () => {
    const result = classifyMemoryInput("Minha api key = sk-1234567890abcdefghijklmnop");
    expect(result.classification).toBe("secret");
    expect(result.destination).toBe("vault");
    expect(result.consentRequired).toBe(true);
  });

  it("redacts sensitive tokens from logs", () => {
    const redacted = redactSensitiveText("token=abc123 senha=minhaSenha123 api key: AIzaSyABCDEF0123456789XYZ");
    expect(redacted).toContain("token=[REDACTED]");
    expect(redacted).toContain("senha=[REDACTED]");
    expect(redacted).toContain("api key=[REDACTED]");
    expect(redacted).not.toContain("minhaSenha123");
  });

  it("blocks persistence for sensitive personal data", () => {
    const decision = routeMemoryPersistence("Meu aniversario e 10/10/1990 e meu CPF e 123.456.789-10");
    expect(decision.persist).toBe(false);
    expect(decision.blocked).toBe(true);
    expect(decision.classification.classification).toBe("sensitive");
  });

  it("allows useful content to semantic memory", () => {
    const decision = routeMemoryPersistence("Preferencia do usuario: respostas curtas e objetivas para tarefas de backend");
    expect(decision.persist).toBe(true);
    expect(decision.classification.classification).toBe("useful");
    expect(decision.classification.destination).toBe("semantic");
  });
});
