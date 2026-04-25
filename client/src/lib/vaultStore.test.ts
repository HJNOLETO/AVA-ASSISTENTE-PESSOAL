import { beforeEach, describe, expect, it } from "vitest";
import fs from "fs/promises";
import path from "path";
import { getVaultSecret, listVaultSecrets, removeVaultSecret, saveVaultSecret } from "../../../server/security/vaultStore";

const TEST_USER_ID = 99991;

function getTestVaultPath(): string {
  return path.resolve(process.cwd(), "data", `vault-user-${TEST_USER_ID}.json`);
}

describe("vaultStore", () => {
  beforeEach(async () => {
    process.env.AVA_VAULT_MASTER_KEY = "0123456789abcdef0123456789abcdef0123456789abcdef0123456789abcdef";
    try {
      await fs.rm(getTestVaultPath(), { force: true });
    } catch {
      // ignore
    }
  });

  it("saves and lists vault keys without exposing values", async () => {
    await saveVaultSecret(
      TEST_USER_ID,
      "api_github",
      "ghp_abcdefghijklmnopqrstuvwxyz123456",
      "token principal",
      { given: true, scope: "integracao github" }
    );
    const items = await listVaultSecrets(TEST_USER_ID);
    expect(items.length).toBe(1);
    expect(items[0].key).toBe("api_github");
    expect(items[0].note).toBe("token principal");
    expect(items[0].consentScope).toBe("integracao github");
  });

  it("removes existing key", async () => {
    await saveVaultSecret(TEST_USER_ID, "senha_email", "senha-super-secreta", undefined, { given: true, scope: "email" });
    const removed = await removeVaultSecret(TEST_USER_ID, "senha_email");
    expect(removed).toBe(true);

    const items = await listVaultSecrets(TEST_USER_ID);
    expect(items.length).toBe(0);
  });

  it("reads secret only by exact key", async () => {
    await saveVaultSecret(TEST_USER_ID, "api_openai", "sk-xyzsecret", undefined, { given: true, scope: "chat llm" });
    const secret = await getVaultSecret(TEST_USER_ID, "api_openai");
    expect(secret?.value).toBe("sk-xyzsecret");
    const missing = await getVaultSecret(TEST_USER_ID, "nao_existe");
    expect(missing).toBeNull();
  });

  it("fails when master key is missing", async () => {
    delete process.env.AVA_VAULT_MASTER_KEY;
    await expect(saveVaultSecret(TEST_USER_ID, "x", "y", undefined, { given: true, scope: "teste" })).rejects.toThrow("AVA_VAULT_MASTER_KEY nao configurada");
  });

  it("requires explicit consent", async () => {
    await expect(saveVaultSecret(TEST_USER_ID, "x", "y")).rejects.toThrow("Consentimento explicito obrigatorio");
  });
});
