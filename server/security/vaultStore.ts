import crypto from "crypto";
import fs from "fs/promises";
import path from "path";

type VaultRecord = {
  key: string;
  value: string;
  note?: string;
  consentGiven: boolean;
  consentScope?: string;
  consentGivenAt: string;
  createdAt: string;
  updatedAt: string;
};

type EncryptedPayload = {
  iv: string;
  tag: string;
  data: string;
};

function getVaultFilePath(userId: number): string {
  return path.resolve(process.cwd(), "data", `vault-user-${userId}.json`);
}

function getMasterKey(): Buffer {
  const raw = String(process.env.AVA_VAULT_MASTER_KEY || "").trim();
  if (!raw) {
    throw new Error("AVA_VAULT_MASTER_KEY nao configurada. Configure uma chave forte para habilitar o cofre.");
  }

  if (/^[0-9a-fA-F]{64}$/.test(raw)) {
    return Buffer.from(raw, "hex");
  }

  try {
    const b64 = Buffer.from(raw, "base64");
    if (b64.length === 32) return b64;
  } catch {
    // keep fallback below
  }

  const hash = crypto.createHash("sha256").update(raw).digest();
  return hash;
}

function encryptJson(payload: unknown): EncryptedPayload {
  const key = getMasterKey();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(payload), "utf-8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();
  return {
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
    data: encrypted.toString("base64"),
  };
}

function decryptJson(payload: EncryptedPayload): VaultRecord[] {
  const key = getMasterKey();
  const iv = Buffer.from(payload.iv, "base64");
  const tag = Buffer.from(payload.tag, "base64");
  const encrypted = Buffer.from(payload.data, "base64");
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
  decipher.setAuthTag(tag);
  const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
  const parsed = JSON.parse(decrypted.toString("utf-8"));
  return Array.isArray(parsed) ? (parsed as VaultRecord[]) : [];
}

async function readVault(userId: number): Promise<VaultRecord[]> {
  const vaultPath = getVaultFilePath(userId);
  try {
    const content = await fs.readFile(vaultPath, "utf-8");
    const parsed = JSON.parse(content) as EncryptedPayload;
    if (!parsed || typeof parsed !== "object" || !parsed.iv || !parsed.tag || !parsed.data) {
      return [];
    }
    return decryptJson(parsed);
  } catch {
    return [];
  }
}

async function writeVault(userId: number, records: VaultRecord[]): Promise<void> {
  const vaultPath = getVaultFilePath(userId);
  await fs.mkdir(path.dirname(vaultPath), { recursive: true });
  const encrypted = encryptJson(records);
  await fs.writeFile(vaultPath, JSON.stringify(encrypted, null, 2), "utf-8");
}

export async function saveVaultSecret(
  userId: number,
  key: string,
  value: string,
  note?: string,
  consent?: { given: boolean; scope?: string; givenAt?: string }
): Promise<void> {
  const normalizedKey = String(key || "").trim().toLowerCase();
  if (!normalizedKey) throw new Error("Chave do cofre obrigatoria.");
  if (!String(value || "").trim()) throw new Error("Valor do cofre obrigatorio.");

  if (!consent?.given) {
    throw new Error("Consentimento explicito obrigatorio para salvar segredo no cofre.");
  }

  const current = await readVault(userId);
  const now = new Date().toISOString();
  const consentGivenAt = consent.givenAt || now;
  const existing = current.find((item) => item.key === normalizedKey);
  if (existing) {
    existing.value = value;
    existing.note = note;
    existing.consentGiven = true;
    existing.consentScope = consent.scope;
    existing.consentGivenAt = consentGivenAt;
    existing.updatedAt = now;
  } else {
    current.push({
      key: normalizedKey,
      value,
      note,
      consentGiven: true,
      consentScope: consent.scope,
      consentGivenAt,
      createdAt: now,
      updatedAt: now,
    });
  }
  await writeVault(userId, current);
}

export async function listVaultSecrets(userId: number): Promise<Array<{ key: string; note?: string; createdAt: string; updatedAt: string; consentGivenAt: string; consentScope?: string }>> {
  const current = await readVault(userId);
  return current.map((item) => ({
    key: item.key,
    note: item.note,
    createdAt: item.createdAt,
    updatedAt: item.updatedAt,
    consentGivenAt: item.consentGivenAt,
    consentScope: item.consentScope,
  }));
}

export async function getVaultSecret(userId: number, key: string): Promise<{ key: string; value: string; note?: string; updatedAt: string } | null> {
  const normalizedKey = String(key || "").trim().toLowerCase();
  if (!normalizedKey) throw new Error("Chave do cofre obrigatoria.");

  const current = await readVault(userId);
  const found = current.find((item) => item.key === normalizedKey);
  if (!found) return null;
  return {
    key: found.key,
    value: found.value,
    note: found.note,
    updatedAt: found.updatedAt,
  };
}

export async function removeVaultSecret(userId: number, key: string): Promise<boolean> {
  const normalizedKey = String(key || "").trim().toLowerCase();
  if (!normalizedKey) throw new Error("Chave do cofre obrigatoria.");

  const current = await readVault(userId);
  const next = current.filter((item) => item.key !== normalizedKey);
  if (next.length === current.length) return false;
  await writeVault(userId, next);
  return true;
}
