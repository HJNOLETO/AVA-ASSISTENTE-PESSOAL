import { eq, and, or, like, gte, lte, isNotNull, isNull, sql, inArray } from "drizzle-orm";
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import { generateEmbedding } from "./_core/llm";
import { cosineSimilarity } from "./utils/vector";
import {
  InsertUser,
  users,
  conversations,
  messages,
  memoryEntries,
  userSettings,
  hardwareSnapshots,
  systemLogs,
  documents,
  documentChunks,
  InsertDocument,
  InsertDocumentChunk,
  passwordResetTokens,
  InsertPasswordResetToken,
  securityCards,
  InsertSecurityCard,
  securityCardAttempts,
  InsertSecurityCardAttempt,
  customers,
  InsertCustomer,
  appointments,
  InsertAppointment,
  notes,
  InsertNote,
  folders,
  InsertFolder,
  auditLogs,
  InsertAuditLog,
  systemSettings,
  InsertSystemSetting,
  sessions,
  InsertSession,
  legalDeadlines,
  InsertLegalDeadline,
  legalClients,
  InsertLegalClient,
  actionTypes,
  InsertActionType,
  legalProcesses,
  InsertLegalProcess,
  processMovements,
  InsertProcessMovement,
  legalHearings,
  InsertLegalHearing,
  attorneyFees,
  InsertAttorneyFee,
  legalReferences,
  InsertLegalReference,
  legalProcessDocuments,
  InsertLegalProcessDocument,
  petitionTemplates,
  InsertPetitionTemplate,
  events,
  InsertEvent,
  postits,
  InsertPostit,
  proactiveTasks,
  InsertProactiveTask,
  agents,
  InsertAgent,
  userPreferences,
  InsertUserPreference,
  products,
  InsertProduct,
} from "../drizzle/schema";
import { ENV } from "./_core/env";
import { extractKeywords } from "./utils/memoryUtils";
import { redactSensitiveText, routeMemoryPersistence } from "./security/memoryGuard";

let _db: ReturnType<typeof drizzle> | null = null;
let _initialized = false;

export type MemoryGuardResult = {
  blocked?: boolean;
  skipped?: boolean;
  policyMessage?: string;
  classification?: string;
  destination?: string;
};

export function isMemoryGuardResult(value: unknown): value is MemoryGuardResult {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.blocked === "boolean" ||
    typeof v.skipped === "boolean" ||
    typeof v.policyMessage === "string"
  );
}

async function initializeDatabase(db: ReturnType<typeof drizzle>) {
  if (_initialized) return;
  
  try {
    // Triggers para updated_at (usando milissegundos para compatibilidade com Drizzle timestamp_ms)
    const triggers = [
      `CREATE TRIGGER IF NOT EXISTS update_users_timestamp 
       AFTER UPDATE ON users
       FOR EACH ROW
       BEGIN
         UPDATE users SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
       END;`,
      `CREATE TRIGGER IF NOT EXISTS update_conversations_timestamp 
       AFTER UPDATE ON conversations
       FOR EACH ROW
       BEGIN
         UPDATE conversations SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
       END;`,
      `CREATE TRIGGER IF NOT EXISTS update_customers_timestamp 
       AFTER UPDATE ON customers
       FOR EACH ROW
       BEGIN
         UPDATE customers SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
       END;`,
      `CREATE TRIGGER IF NOT EXISTS update_events_timestamp 
       AFTER UPDATE ON events
       FOR EACH ROW
       BEGIN
         UPDATE events SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
       END;`,
      `CREATE TRIGGER IF NOT EXISTS update_postits_timestamp 
       AFTER UPDATE ON postits
       FOR EACH ROW
       BEGIN
         UPDATE postits SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
       END;`,
      `CREATE TRIGGER IF NOT EXISTS update_legal_deadlines_timestamp 
       AFTER UPDATE ON legal_deadlines
       FOR EACH ROW
       BEGIN
         UPDATE legal_deadlines SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
       END;`,
      `CREATE TRIGGER IF NOT EXISTS update_legal_clients_timestamp 
       AFTER UPDATE ON legal_clients
       FOR EACH ROW
       BEGIN
         UPDATE legal_clients SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
       END;`,
      `CREATE TRIGGER IF NOT EXISTS update_legal_processes_timestamp 
       AFTER UPDATE ON legal_processes
       FOR EACH ROW
       BEGIN
         UPDATE legal_processes SET updatedAt = (strftime('%s', 'now') * 1000) WHERE id = NEW.id;
       END;`
    ];

    for (const trigger of triggers) {
      await db.run(trigger as any);
    }

    // Views úteis
    const views = [
      `CREATE VIEW IF NOT EXISTS events_with_customers AS
       SELECT 
         e.*,
         c.name as customerName,
         c.email as customerEmail,
         c.phone as customerPhone
       FROM events e
       LEFT JOIN customers c ON e.customerId = c.id;`,
      `CREATE VIEW IF NOT EXISTS legal_processes_summary AS
       SELECT 
         p.*,
         c.name as clientName,
         c.cpf as clientCpf,
         at.name as actionTypeName
       FROM legal_processes p
       LEFT JOIN legal_clients c ON p.clientId = c.id
       LEFT JOIN action_types at ON p.actionTypeId = at.id;`,
      `CREATE VIEW IF NOT EXISTS user_stats AS
       SELECT 
         u.id,
         u.name,
         COUNT(DISTINCT co.id) as totalConversations,
         COUNT(DISTINCT d.id) as totalDocuments,
         COUNT(DISTINCT lc.id) as totalLegalClients,
         COUNT(DISTINCT lp.id) as totalLegalProcesses,
         COUNT(DISTINCT e.id) as totalEvents,
         COUNT(DISTINCT p.id) as totalPostits
       FROM users u
       LEFT JOIN conversations co ON u.id = co.userId
       LEFT JOIN documents d ON u.id = d.userId
       LEFT JOIN legal_clients lc ON u.id = lc.userId
       LEFT JOIN legal_processes lp ON u.id = lp.userId
       LEFT JOIN events e ON u.id = e.userId
       LEFT JOIN postits p ON u.id = p.userId
       GROUP BY u.id;`
    ];

    for (const view of views) {
      await db.run(view as any);
    }

    _initialized = true;
    console.log("[Database] Triggers and views initialized");
  } catch (error) {
    console.error("[Database] Error initializing triggers/views:", error);
  }
}

let memConversationId = 0;
let memMessageId = 0;
let memUserSettingsId = 0;
let memMemoryEntryId = 0;
let memHardwareSnapshotId = 0;
let memSystemLogId = 0;
const memConversations: Array<typeof conversations.$inferSelect> = [];
const memMessages: Array<typeof messages.$inferSelect> = [];
const memUserSettings: Array<typeof userSettings.$inferSelect> = [];
const memMemoryEntries: Array<typeof memoryEntries.$inferSelect> = [];
const memHardwareSnapshots: Array<typeof hardwareSnapshots.$inferSelect> = [];
const memSystemLogs: Array<typeof systemLogs.$inferSelect> = [];

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      // Extract file path from DATABASE_URL (e.g., "file:./sqlite.db" -> "./sqlite.db")
      const dbPath = process.env.DATABASE_URL.replace(/^file:/, "");
      const sqlite = new Database(dbPath);
      sqlite.pragma("journal_mode = WAL");
      _db = drizzle(sqlite);
      
      // Initialize triggers and views
      await initializeDatabase(_db);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    // SQLite upsert using INSERT OR REPLACE
    const existingUser = await getUserByOpenId(user.openId);
    if (existingUser) {
      await db
        .update(users)
        .set(updateSet)
        .where(eq(users.openId, user.openId));
    } else {
      await db.insert(users).values(values);
    }
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.openId, openId))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return result.length > 0 ? result[0] : undefined;
}

export async function createUser(user: InsertUser) {
  const db = await getDb();
  if (!db) {
    throw new Error("[Database] Cannot create user: database not available");
  }

  const res = await db.insert(users).values(user);
  const insertId = (res as any)?.lastInsertRowid;
  return { id: Number(insertId) };
}

export async function updateUser(
  userId: number | string,
  updates: {
    name?: string;
    email?: string;
    password?: string;
    role?: "user" | "admin" | "maintainer";
  }
) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot update user: database not available");
    return;
  }

  const userId_num = typeof userId === "string" ? parseInt(userId, 10) : userId;

  // Filter out undefined values to avoid setting them
  const validUpdates: any = {};
  if (updates.name !== undefined) validUpdates.name = updates.name;
  if (updates.email !== undefined) validUpdates.email = updates.email;
  if (updates.password !== undefined) validUpdates.password = updates.password;
  if (updates.role !== undefined) validUpdates.role = updates.role;

  return db.update(users).set(validUpdates).where(eq(users.id, userId_num));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(users).orderBy(users.createdAt);
}

export async function deleteUser(userId: number) {
  const db = await getDb();
  if (!db) return;
  return db.delete(users).where(eq(users.id, userId));
}

// Session queries
export async function createSession(session: InsertSession) {
  const db = await getDb();
  if (!db) return;
  return db.insert(sessions).values(session);
}

export async function getSessionById(sessionId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sessions).where(eq(sessions.id, sessionId)).limit(1);
  return result[0];
}

export async function getSessionByToken(token: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(sessions).where(eq(sessions.token, token)).limit(1);
  return result[0];
}

export async function deleteSession(sessionId: string) {
  const db = await getDb();
  if (!db) return;
  return db.delete(sessions).where(eq(sessions.id, sessionId));
}

export async function deleteUserSessions(userId: number) {
  const db = await getDb();
  if (!db) return;
  return db.delete(sessions).where(eq(sessions.userId, userId));
}

export async function getSystemLogs(limit: number = 100) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(systemLogs).orderBy(systemLogs.createdAt).limit(limit);
}

// Conversation queries
export async function createConversation(
  userId: number,
  title: string,
  mode: "ECO" | "STANDARD" | "PERFORMANCE" = "ECO"
) {
  const db = await getDb();
  if (!db) {
    const now = new Date();
    const row = {
      id: ++memConversationId,
      userId,
      title,
      mode,
      createdAt: now,
      updatedAt: now,
    } as typeof conversations.$inferSelect;
    memConversations.push(row);
    return { id: row.id };
  }

  const res = await db.insert(conversations).values({
    userId,
    title,
    mode,
  });
  const insertId = (res as any)?.lastInsertRowid;
  return { id: Number(insertId) };
}

export async function getConversations(userId: number) {
  const db = await getDb();
  if (!db) {
    return memConversations
      .filter(c => c.userId === userId)
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  return db
    .select()
    .from(conversations)
    .where(eq(conversations.userId, userId))
    .orderBy(conversations.updatedAt);
}

export async function getConversationById(
  conversationId: number,
  userId: number
) {
  const db = await getDb();
  if (!db) {
    return memConversations.find(
      c => c.id === conversationId && c.userId === userId
    );
  }

  const result = await db
    .select()
    .from(conversations)
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(conversations.userId, userId)
      )
    )
    .limit(1);

  return result[0];
}

// Rename a conversation, updating its title and updatedAt
export async function renameConversation(
  conversationId: number,
  userId: number,
  title: string
) {
  const db = await getDb();
  if (!db) {
    const conv = memConversations.find(
      c => c.id === conversationId && c.userId === userId
    );
    if (conv) {
      conv.title = title;
      conv.updatedAt = new Date();
      return conv;
    }
    return undefined;
  }

  await db
    .update(conversations)
    .set({ title, updatedAt: new Date() })
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(conversations.userId, userId)
      )
    );

  return getConversationById(conversationId, userId);
}

// Toggle favorite flag for a conversation
export async function toggleFavorite(conversationId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    const conv = memConversations.find(
      c => c.id === conversationId && c.userId === userId
    );
    if (!conv) return undefined;
    conv.isFavorite = conv.isFavorite ? 0 : 1;
    conv.updatedAt = new Date();
    return conv;
  }

  // Read current value, toggle, and update
  const current = await getConversationById(conversationId, userId);
  if (!current) return undefined;
  const newVal = (current as any).isFavorite ? 0 : 1;
  await db
    .update(conversations)
    .set({ isFavorite: newVal, updatedAt: new Date() })
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(conversations.userId, userId)
      )
    );

  return getConversationById(conversationId, userId);
}

// Delete a conversation and its messages
export async function deleteConversation(conversationId: number, userId: number) {
  const db = await getDb();
  if (!db) {
    const index = memConversations.findIndex(
      c => c.id === conversationId && c.userId === userId
    );
    if (index === -1) return false;
    
    // Remove messages first in memory
    const messageIndices = memMessages
      .map((m, i) => m.conversationId === conversationId ? i : -1)
      .filter(i => i !== -1)
      .reverse();
    messageIndices.forEach(i => memMessages.splice(i, 1));
    
    // Remove conversation
    memConversations.splice(index, 1);
    return true;
  }

  // Delete messages first (Drizzle/SQLite will handle constraints if defined, but being explicit is safer)
  await db.delete(messages).where(eq(messages.conversationId, conversationId));
  
  // Delete conversation
  const result = await db
    .delete(conversations)
    .where(
      and(
        eq(conversations.id, conversationId),
        eq(conversations.userId, userId)
      )
    );

  return (result as any).changes > 0;
}

// Message queries
export async function addMessage(
  conversationId: number,
  role: "user" | "assistant" | "system",
  content: string,
  tokens: number = 0
) {
  const db = await getDb();
  if (!db) {
    const now = new Date();
    const row = {
      id: ++memMessageId,
      conversationId,
      role,
      content,
      tokensUsed: tokens,
      createdAt: now,
    } as typeof messages.$inferSelect;
    memMessages.push(row);

    // Update conversation's updatedAt in in-memory store
    const conv = memConversations.find(c => c.id === conversationId);
    if (conv) conv.updatedAt = now;

    return row;
  }

  const res = await db.insert(messages).values({
    conversationId,
    role,
    content,
    tokensUsed: tokens,
  });

  // Update conversation's updatedAt in the DB
  try {
    await db
      .update(conversations)
      .set({ updatedAt: new Date() })
      .where(eq(conversations.id, conversationId));
  } catch (e) {
    console.warn("Failed to update conversation updatedAt:", e);
  }

  const insertId = (res as any)?.lastInsertRowid;
  return {
    id: Number(insertId),
    conversationId,
    role,
    content,
    tokens,
    createdAt: new Date(), // Approximation
  };
}

export async function getMessages(conversationId: number) {
  const db = await getDb();
  if (!db) {
    return memMessages
      .filter(m => m.conversationId === conversationId)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  return db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, conversationId))
    .orderBy(messages.createdAt);
}

// User settings queries
export async function getUserSettings(userId: number) {
  const db = await getDb();
  if (!db) {
    return memUserSettings.find(s => s.userId === userId);
  }

  const result = await db
    .select()
    .from(userSettings)
    .where(eq(userSettings.userId, userId))
    .limit(1);

  return result[0];
}

export async function createOrUpdateUserSettings(
  userId: number,
  settings: Partial<typeof userSettings.$inferInsert>
) {
  const db = await getDb();
  if (!db) {
    const existing = memUserSettings.find(s => s.userId === userId);
    if (existing) {
      Object.assign(existing, settings, { updatedAt: new Date() });
      return existing;
    }
    const now = new Date();
    const row = {
      id: ++memUserSettingsId,
      userId,
      preferredMode: "AUTO",
      autoDetectHardware: 1,
      llmTemperature: 70,
      llmTopP: 90,
      sttLanguage: "pt-BR",
      theme: "light",
      // profile defaults
      profileRole: "user",
      profession: null,
      expertiseLevel: "intermediate",
      preferredTone: "formal",
      includePiiInContext: 0,
      jurisdiction: null,
      medicalConsent: 0,
      createdAt: now,
      updatedAt: now,
      ...settings,
    } as typeof userSettings.$inferSelect;
    memUserSettings.push(row);
    return row;
  }

  const existing = await getUserSettings(userId);

  if (existing) {
    return db
      .update(userSettings)
      .set(settings)
      .where(eq(userSettings.userId, userId));
  } else {
    return db.insert(userSettings).values({
      userId,
      ...settings,
    });
  }
}

// Memory queries
export async function addMemoryEntry(
  userId: number,
  content: string,
  keywords?: string,
  type: "fact" | "preference" | "context" | "command" = "fact"
): Promise<unknown> {
  const route = routeMemoryPersistence(content);
  const blockSensitiveByDefault = String(process.env.AVA_MEMORY_BLOCK_SENSITIVE ?? "true").toLowerCase() !== "false";

  if (route.blocked && blockSensitiveByDefault) {
    console.warn(
      `[MemoryGuard] Persistencia bloqueada para user=${userId} class=${route.classification.classification} destination=${route.classification.destination} motivo=${route.policyMessage}`
    );
    return {
      blocked: true,
      policyMessage: route.policyMessage,
      classification: route.classification.classification,
      destination: route.classification.destination,
    };
  }

  if (!route.persist && !route.blocked) {
    return {
      blocked: false,
      skipped: true,
      policyMessage: route.policyMessage,
      classification: route.classification.classification,
      destination: route.classification.destination,
    };
  }

  const safeContent = redactSensitiveText(route.sanitizedContent || content);

  // ✅ Autogerar keywords se não fornecidas
  const finalKeywords = keywords || extractKeywords(safeContent).join(", ");
  let embeddingJson: string | undefined;

  try {
    const vector = await generateEmbedding(safeContent);
    embeddingJson = JSON.stringify(vector);
  } catch (error) {
    console.warn("[Memory] Embedding generation failed, continuing with keyword-only memory:", error);
  }

  const db = await getDb();
  if (!db) {
    const now = new Date();
    const row = {
      id: ++memMemoryEntryId,
      userId,
      content: safeContent,
      keywords: finalKeywords,
      embedding: embeddingJson,
      type,
      createdAt: now,
      accessedAt: now,
    } as typeof memoryEntries.$inferSelect;
    memMemoryEntries.push(row);
    return row;
  }

  return db.insert(memoryEntries).values({
    userId,
    content: safeContent,
    keywords: finalKeywords,
    embedding: embeddingJson,
    type,
  });
}

export async function searchMemoryByKeywords(userId: number, query: string) {
  const db = await getDb();
  if (!db) {
    const q = query.toLowerCase();
    const keywordMatches = memMemoryEntries
      .filter(
        m =>
          m.userId === userId &&
          ((m.keywords ?? "").toLowerCase().includes(q) ||
            m.content.toLowerCase().includes(q))
      )
      .sort(
        (a, b) =>
          (a.accessedAt?.getTime() ?? 0) - (b.accessedAt?.getTime() ?? 0)
      );

    if (keywordMatches.length > 0) {
      return keywordMatches;
    }

    try {
      const queryEmbedding = await generateEmbedding(query);
      const scored = memMemoryEntries
        .filter(m => m.userId === userId && typeof m.embedding === "string" && m.embedding.length > 0)
        .map((m) => {
          try {
            const emb = JSON.parse(m.embedding as unknown as string);
            if (!Array.isArray(emb)) return null;
            return {
              ...m,
              _score: cosineSimilarity(queryEmbedding, emb),
            };
          } catch {
            return null;
          }
        })
        .filter((m): m is (typeof memMemoryEntries[number] & { _score: number }) => !!m)
        .sort((a, b) => b._score - a._score)
        .slice(0, 5)
        .map(({ _score, ...m }) => m);

      return scored;
    } catch {
      return [];
    }
  }

  const keywordMatches = await db
    .select()
    .from(memoryEntries)
    .where(
      and(
        eq(memoryEntries.userId, userId),
        or(
          like(memoryEntries.keywords, `%${query}%`),
          like(memoryEntries.content, `%${query}%`)
        )
      )
    )
    .orderBy(memoryEntries.accessedAt);

  if (keywordMatches.length > 0) {
    return keywordMatches;
  }

  try {
    const queryEmbedding = await generateEmbedding(query);
    const allMemories = await db
      .select()
      .from(memoryEntries)
      .where(eq(memoryEntries.userId, userId));

    const scored = allMemories
      .map((m) => {
        try {
          if (!m.embedding) return null;
          const embedding = JSON.parse(m.embedding);
          if (!Array.isArray(embedding)) return null;
          return {
            ...m,
            _score: cosineSimilarity(queryEmbedding, embedding),
          };
        } catch {
          return null;
        }
      })
      .filter((m): m is (typeof allMemories[number] & { _score: number }) => !!m)
      .sort((a, b) => b._score - a._score)
      .slice(0, 5)
      .map(({ _score, ...m }) => m);

    return scored;
  } catch {
    return [];
  }
}

// Hardware snapshot queries
export async function addHardwareSnapshot(
  userId: number,
  metrics: {
    cpuUsage: number;
    ramUsage: number;
    ramAvailable: number;
    gpuUsage?: number;
    gpuVram?: number;
    mode: "ECO" | "STANDARD" | "PERFORMANCE";
  }
) {
  const db = await getDb();
  if (!db) {
    const row = {
      id: ++memHardwareSnapshotId,
      userId,
      cpuUsage: metrics.cpuUsage,
      ramUsage: metrics.ramUsage,
      ramAvailable: metrics.ramAvailable,
      gpuUsage: metrics.gpuUsage as any,
      gpuVram: metrics.gpuVram as any,
      mode: metrics.mode,
      createdAt: new Date(),
    } as typeof hardwareSnapshots.$inferSelect;
    memHardwareSnapshots.push(row);
    return row;
  }

  return db.insert(hardwareSnapshots).values({
    userId,
    ...metrics,
  });
}

export async function getRecentHardwareSnapshots(
  userId: number,
  limitMinutes: number = 60
) {
  const db = await getDb();
  if (!db) {
    const cutoffTime = new Date(Date.now() - limitMinutes * 60 * 1000);
    return memHardwareSnapshots
      .filter(h => h.userId === userId && h.createdAt >= cutoffTime)
      .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  }

  const cutoffTime = new Date(Date.now() - limitMinutes * 60 * 1000);

  return db
    .select()
    .from(hardwareSnapshots)
    .where(
      and(
        eq(hardwareSnapshots.userId, userId),
        gte(hardwareSnapshots.createdAt, cutoffTime)
      )
    )
    .orderBy(hardwareSnapshots.createdAt);
}

// System log queries
export async function addSystemLog(
  message: string,
  level: "INFO" | "WARNING" | "ERROR" | "DEBUG" = "INFO",
  userId?: number,
  metadata?: Record<string, unknown>
) {
  const db = await getDb();
  if (!db) {
    const row = {
      id: ++memSystemLogId,
      userId,
      level,
      message,
      metadata: metadata ? JSON.stringify(metadata) : undefined,
      createdAt: new Date(),
    } as typeof systemLogs.$inferSelect;
    memSystemLogs.push(row);
    return row;
  }

  return db.insert(systemLogs).values({
    userId,
    level,
    message,
    metadata: metadata ? JSON.stringify(metadata) : undefined,
  });
}

// Memory management functions for AVA Memory System V3.1

// Soft delete expired memories based on TTL
export async function deleteExpiredMemory(userId: number) {
  const db = await getDb();
  const now = new Date();

  if (!db) {
    // In-memory implementation
    const expired = memMemoryEntries.filter(
      (m) =>
        m.userId === userId &&
        m.ttl &&
        new Date(m.createdAt.getTime() + m.ttl * 1000) < now &&
        !(m as any).archived
    );
    expired.forEach((m) => ((m as any).archived = 1));
    return { count: expired.length };
  }

  // Database implementation - find and archive expired memories
  const allMemories = await db
    .select()
    .from(memoryEntries)
    .where(
      and(
        eq(memoryEntries.userId, userId),
        eq(memoryEntries.archived, 0)
      )
    );

  // Filter memories with expired TTL in JavaScript (SQLite doesn't support dynamic date arithmetic easily)
  const expired = allMemories.filter(
    (m) => m.ttl && new Date(m.createdAt.getTime() + m.ttl * 1000) < now
  );

  // Archive each expired memory
  for (const memory of expired) {
    await db
      .update(memoryEntries)
      .set({ archived: 1 })
      .where(eq(memoryEntries.id, memory.id));
  }

  return { count: expired.length };
}

// Export memories as JSON
export async function exportMemory(userId: number, format: "json" = "json") {
  const db = await getDb();
  const memories = !db
    ? memMemoryEntries.filter((m) => m.userId === userId && !(m as any).archived)
    : await db
      .select()
      .from(memoryEntries)
      .where(
        and(eq(memoryEntries.userId, userId), eq(memoryEntries.archived, 0))
      );

  return {
    format,
    exportDate: new Date().toISOString(),
    userId,
    count: memories.length,
    memories: memories.map((m) => ({
      id: m.id,
      content: m.content,
      keywords: m.keywords,
      type: m.type,
      createdAt: m.createdAt,
      accessedAt: m.accessedAt,
    })),
  };
}

// Search with relevance scoring
export async function searchMemoryWithRelevance(
  userId: number,
  query: string
) {
  const db = await getDb();
  const queryLower = query.toLowerCase();

  const memories = !db
    ? memMemoryEntries.filter((m) => m.userId === userId && !(m as any).archived)
    : await db
      .select()
      .from(memoryEntries)
      .where(
        and(eq(memoryEntries.userId, userId), eq(memoryEntries.archived, 0))
      );

  // Calculate relevance score for each memory
  const scored = memories.map((m) => {
    let score = 0;

    // Keyword exact match (+3 points)
    if (m.keywords?.toLowerCase().includes(queryLower)) score += 3;

    // Content partial match (+1 point)
    if (m.content.toLowerCase().includes(queryLower)) score += 1;

    // Recent access (+2 points if accessed within last 7 days)
    if (m.accessedAt) {
      const daysSince =
        (Date.now() - new Date(m.accessedAt).getTime()) /
        (1000 * 60 * 60 * 24);
      if (daysSince < 7) score += 2;
    }

    return { ...m, score };
  });

  // Filter only matches (score > 0) and sort by relevance descending
  return scored.filter((m) => m.score > 0).sort((a, b) => b.score - a.score);
}

// Agent queries
export async function getAgents(userId: number) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(agents)
    .where(eq(agents.userId, userId))
    .orderBy(agents.createdAt);
}

export async function createAgent(userId: number, agent: InsertAgent) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db.insert(agents).values({
    ...agent,
    userId,
  });
}

export async function updateAgent(
  userId: number,
  agentId: number,
  updates: Partial<InsertAgent>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(agents)
    .set({ ...updates, updatedAt: new Date() })
    .where(and(eq(agents.id, agentId), eq(agents.userId, userId)));
}

export async function deleteAgent(userId: number, agentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .delete(agents)
    .where(and(eq(agents.id, agentId), eq(agents.userId, userId)));
}

export async function getAgentById(userId: number, agentId: number) {
  const db = await getDb();
  if (!db) return undefined;

  const result = await db
    .select()
    .from(agents)
    .where(and(eq(agents.id, agentId), eq(agents.userId, userId)))
    .limit(1);

  return result[0];
}

// Events functions
export async function getEvents(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(events).where(eq(events.userId, userId));
}

export async function createEvent(userId: number, event: Omit<InsertEvent, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(events).values({ ...event, userId });
}

export async function updateEvent(userId: number, eventId: number, updates: Partial<InsertEvent>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(events)
    .set({ ...updates, updatedAt: new Date() })
    .where(and(eq(events.id, eventId), eq(events.userId, userId)));
}

export async function deleteEvent(userId: number, eventId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .delete(events)
    .where(and(eq(events.id, eventId), eq(events.userId, userId)));
}

// Postits functions
export async function getPostits(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(postits).where(eq(postits.userId, userId));
}

export async function createPostit(userId: number, postit: Omit<InsertPostit, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(postits).values({ ...postit, userId });
}

export async function updatePostit(userId: number, postitId: number, updates: Partial<InsertPostit>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(postits)
    .set({ ...updates, updatedAt: new Date() })
    .where(and(eq(postits.id, postitId), eq(postits.userId, userId)));
}

export async function deletePostit(userId: number, postitId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .delete(postits)
    .where(and(eq(postits.id, postitId), eq(postits.userId, userId)));
}

// Proactive Tasks functions
export async function getProactiveTasks(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(proactiveTasks).where(eq(proactiveTasks.userId, userId));
}

export async function createProactiveTask(userId: number, task: Omit<InsertProactiveTask, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(proactiveTasks).values({ ...task, userId });
}

export async function updateProactiveTask(userId: number, taskId: number, updates: Partial<InsertProactiveTask>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(proactiveTasks)
    .set({ ...updates }) // proactiveTasks might not have updatedAt trigger or column? Schema says it does but let's check.
    .where(and(eq(proactiveTasks.id, taskId), eq(proactiveTasks.userId, userId)));
}

// Legal Module Functions

// Clients
export async function getLegalClients(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(legalClients).where(eq(legalClients.userId, userId));
}

export async function createLegalClient(userId: number, data: Omit<InsertLegalClient, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(legalClients).values({ ...data, userId });
}

export async function updateLegalClient(userId: number, id: number, data: Partial<InsertLegalClient>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(legalClients)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(legalClients.id, id), eq(legalClients.userId, userId)));
}

// Processes
export async function getLegalProcesses(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select({
      id: legalProcesses.id,
      processNumber: legalProcesses.processNumber,
      status: legalProcesses.status,
      category: legalProcesses.category,
      entryDate: legalProcesses.entryDate,
      clientName: legalClients.name,
      actionTypeName: actionTypes.name,
    })
    .from(legalProcesses)
    .leftJoin(legalClients, eq(legalProcesses.clientId, legalClients.id))
    .leftJoin(actionTypes, eq(legalProcesses.actionTypeId, actionTypes.id))
    .where(eq(legalProcesses.userId, userId));
}

export async function createLegalProcess(userId: number, data: Omit<InsertLegalProcess, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(legalProcesses).values({ ...data, userId });
}

// Deadlines
export async function getLegalDeadlines(userId: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(legalDeadlines.userId, userId)];
  if (startDate) conditions.push(gte(legalDeadlines.dueDate, startDate.toISOString().split('T')[0]));
  if (endDate) conditions.push(lte(legalDeadlines.dueDate, endDate.toISOString().split('T')[0]));

  return db.select().from(legalDeadlines).where(and(...conditions)).orderBy(legalDeadlines.dueDate);
}

export async function createLegalDeadline(userId: number, data: Omit<InsertLegalDeadline, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(legalDeadlines).values({ ...data, userId });
}

export async function updateLegalDeadline(userId: number, id: number, data: Partial<InsertLegalDeadline>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(legalDeadlines)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(legalDeadlines.id, id), eq(legalDeadlines.userId, userId)));
}

export async function deleteLegalDeadline(userId: number, id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(legalDeadlines).where(and(eq(legalDeadlines.id, id), eq(legalDeadlines.userId, userId)));
}

// Action Types
export async function getActionTypes(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(actionTypes);
}

// Movements
export async function getProcessMovements(processId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(processMovements).where(eq(processMovements.processId, processId));
}

export async function createProcessMovement(data: InsertProcessMovement) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(processMovements).values(data);
}

// Hearings
export async function getLegalHearings(userId: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(legalProcesses.userId, userId)];
  if (startDate) conditions.push(gte(legalHearings.hearingDate, startDate.toISOString().split('T')[0]));
  if (endDate) conditions.push(lte(legalHearings.hearingDate, endDate.toISOString().split('T')[0]));

  // We join with processes to filter by userId
  return db
    .select({ hearing: legalHearings })
    .from(legalHearings)
    .innerJoin(legalProcesses, eq(legalHearings.processId, legalProcesses.id))
    .where(and(...conditions))
    .orderBy(legalHearings.hearingDate);
}

export async function createLegalHearing(userId: number, data: Omit<InsertLegalHearing, "id" | "createdAt" | "updatedAt" | "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  // Ensure process belongs to user
  const [process] = await db
    .select()
    .from(legalProcesses)
    .where(and(eq(legalProcesses.id, data.processId), eq(legalProcesses.userId, userId)))
    .limit(1);

  if (!process) throw new Error("Process not found or access denied");
  
  return db.insert(legalHearings).values({ ...data, userId });
}

// Fees
export async function getAttorneyFees(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(attorneyFees).where(eq(attorneyFees.userId, userId));
}

export async function createAttorneyFee(userId: number, data: Omit<InsertAttorneyFee, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(attorneyFees).values({ ...data, userId });
}

// Documents
export async function getLegalProcessDocuments(processId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(legalProcessDocuments).where(eq(legalProcessDocuments.processId, processId));
}

export async function createLegalProcessDocument(data: InsertLegalProcessDocument) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(legalProcessDocuments).values(data);
}

// Templates
export async function getPetitionTemplates() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(petitionTemplates).where(eq(petitionTemplates.isActive, 1));
}

// Folder functions
export async function getFolders(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(folders).where(eq(folders.userId, userId));
}

export async function createFolder(userId: number, name: string, parentId?: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(folders).values({ userId, name, parentId });
}

export async function deleteFolder(userId: number, folderId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(folders).where(and(eq(folders.id, folderId), eq(folders.userId, userId)));
}

// Audit Log functions
export async function addAuditLog(log: InsertAuditLog) {
  const db = await getDb();
  if (!db) return;
  return db.insert(auditLogs).values(log);
}

export async function getAuditLogs(userId: number, limit = 100) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(auditLogs)
    .where(eq(auditLogs.userId, userId))
    .orderBy(auditLogs.createdAt)
    .limit(limit);
}

// System Settings
export async function getSystemSetting(key: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db
    .select()
    .from(systemSettings)
    .where(eq(systemSettings.key, key))
    .limit(1);
  return result[0] || null;
}

export async function setSystemSetting(key: string, value: string, description?: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existing = await getSystemSetting(key);
  if (existing) {
    return db
      .update(systemSettings)
      .set({ value, updatedAt: new Date() })
      .where(eq(systemSettings.key, key));
  } else {
    return db.insert(systemSettings).values({
      key,
      value,
    });
  }
}

// User Preference functions
export async function getUserPreferences(userId: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db
    .select()
    .from(userPreferences)
    .where(eq(userPreferences.userId, userId))
    .limit(1);
  return result[0];
}

export async function updateUserPreferences(userId: number, prefs: Partial<typeof userPreferences.$inferInsert>) {
  const db = await getDb();
  if (!db) return;
  const existing = await getUserPreferences(userId);
  if (existing) {
    return db
      .update(userPreferences)
      .set({ ...prefs, updatedAt: new Date() })
      .where(eq(userPreferences.userId, userId));
  } else {
    return db.insert(userPreferences).values({ userId, ...prefs });
  }
}

// Password Reset Tokens
export async function createPasswordResetToken(
  data: InsertPasswordResetToken
): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(passwordResetTokens).values(data);
}

export async function getPasswordResetToken(token: string) {
  const db = await getDb();
  if (!db) return null;
  const results = await db
    .select()
    .from(passwordResetTokens)
    .where(eq(passwordResetTokens.token, token))
    .limit(1);
  return results[0] || null;
}

export async function markPasswordResetTokenAsUsed(id: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(passwordResetTokens)
    .set({ used: 1 })
    .where(eq(passwordResetTokens.id, id));
}

export async function invalidateAllUserTokens(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db
    .update(passwordResetTokens)
    .set({ used: 1 })
    .where(eq(passwordResetTokens.userId, userId));
}

// Security Cards
export async function createSecurityCard(data: InsertSecurityCard): Promise<void> {
  const db = await getDb();
  if (!db) return;
  
  // Deactivate old active cards
  await db
    .update(securityCards)
    .set({ status: "replaced" })
    .where(and(eq(securityCards.userId, data.userId), eq(securityCards.status, "active")));

  await db.insert(securityCards).values(data);
}

export async function getActiveSecurityCard(userId: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db
    .select()
    .from(securityCards)
    .where(and(eq(securityCards.userId, userId), eq(securityCards.status, "active")))
    .limit(1);
  return results[0] || null;
}

export async function createSecurityCardAttempt(data: InsertSecurityCardAttempt): Promise<void> {
  const db = await getDb();
  if (!db) return;
  await db.insert(securityCardAttempts).values(data);
}

export async function getRecentSecurityCardAttempts(userId: number, minutes: number = 30) {
  const db = await getDb();
  if (!db) return [];
  const timeLimit = new Date(Date.now() - minutes * 60 * 1000);
  return await db
    .select()
    .from(securityCardAttempts)
    .where(and(
      eq(securityCardAttempts.userId, userId),
      gte(securityCardAttempts.attemptedAt, timeLimit)
    ));
}

// CRM - Customers
export async function getCustomers(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(customers).where(eq(customers.userId, userId));
}

export async function getCustomerById(userId: number, id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db
    .select()
    .from(customers)
    .where(and(eq(customers.id, id), eq(customers.userId, userId)))
    .limit(1);
  return results[0] || null;
}

export async function createCustomer(userId: number, data: Omit<InsertCustomer, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(customers).values({ ...data, userId });
}

export async function updateCustomerCRM(userId: number, id: number, data: Partial<InsertCustomer>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(customers)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(customers.id, id), eq(customers.userId, userId)));
}

export async function deleteCustomer(userId: number, id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(customers).where(and(eq(customers.id, id), eq(customers.userId, userId)));
}

// Agenda - Appointments
export async function getAppointments(userId: number, startDate?: Date, endDate?: Date) {
  const db = await getDb();
  if (!db) return [];
  
  const conditions = [eq(appointments.userId, userId)];
  if (startDate) conditions.push(gte(appointments.startTime, startDate));
  if (endDate) conditions.push(lte(appointments.startTime, endDate));

  return db.select().from(appointments).where(and(...conditions)).orderBy(appointments.startTime);
}

export async function getAppointmentById(userId: number, id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db
    .select()
    .from(appointments)
    .where(and(eq(appointments.id, id), eq(appointments.userId, userId)))
    .limit(1);
  return results[0] || null;
}

export async function createAppointment(userId: number, data: Omit<InsertAppointment, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(appointments).values({ ...data, userId });
}

export async function updateAppointment(userId: number, id: number, data: Partial<InsertAppointment>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(appointments)
    .set(data)
    .where(and(eq(appointments.id, id), eq(appointments.userId, userId)));
}

export async function deleteAppointment(userId: number, id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(appointments).where(and(eq(appointments.id, id), eq(appointments.userId, userId)));
}

// RAG - Documents
export async function getDocuments(userId: number, folderId?: number) {
  const db = await getDb();
  if (!db) return [];
  if (folderId !== undefined) {
    return db
      .select()
      .from(documents)
      .where(and(eq(documents.userId, userId), eq(documents.folderId, folderId)));
  }
  return db.select().from(documents).where(eq(documents.userId, userId));
}

export async function getDocumentById(userId: number, id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db
    .select()
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.userId, userId)))
    .limit(1);
  return results[0] || null;
}

export async function createDocument(userId: number, data: Omit<InsertDocument, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(documents).values({ ...data, userId });
}

export async function updateDocument(userId: number, id: number, updates: Partial<InsertDocument>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(documents)
    .set({ ...updates, updatedAt: new Date() })
    .where(and(eq(documents.id, id), eq(documents.userId, userId)));
}

export async function updateDocumentStatus(
  userId: number,
  id: number,
  status: "processing" | "review" | "indexed" | "error" | "rejected"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(documents)
    .set({ status, updatedAt: new Date() })
    .where(and(eq(documents.id, id), eq(documents.userId, userId)));
}

export async function deleteDocument(userId: number, id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(documents).where(and(eq(documents.id, id), eq(documents.userId, userId)));
}

// RAG - Document Chunks
export async function createDocumentChunk(data: InsertDocumentChunk) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(documentChunks).values(data);
}

export async function getDocumentChunks(documentId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(documentChunks)
    .where(eq(documentChunks.documentId, documentId))
    .orderBy(documentChunks.chunkIndex);
}

export async function searchDocumentChunks(userId: number, query: string, limit: number = 5) {
  const db = await getDb();
  if (!db) return [];

  try {
    // 1. Generate query embedding
    const queryEmbedding = await generateEmbedding(query);

    // 2. Fetch all chunks with embeddings (JS-side vector search for MVP/Offline)
    // Note: In a production SQLite-vec setup, we would use:
    // sql`vec_distance_cosine(embedding, ${JSON.stringify(queryEmbedding)})`
    const allChunks = await db
      .select({
        id: documentChunks.id,
        documentId: documentChunks.documentId,
        chunkIndex: documentChunks.chunkIndex,
        content: documentChunks.content,
        metadata: documentChunks.metadata,
        embedding: documentChunks.embedding,
      })
      .from(documentChunks)
      .innerJoin(documents, eq(documentChunks.documentId, documents.id))
      .where(
        and(
          eq(documents.userId, userId),
          eq(documents.status, "indexed"),
          isNotNull(documentChunks.embedding),
        )
      );

    // 3. Compute Similarity & Sort
    const scored = allChunks
      .map((chunk) => {
        try {
          const embedding = typeof chunk.embedding === "string" ? JSON.parse(chunk.embedding) : chunk.embedding;
          if (!Array.isArray(embedding)) return null;
          return {
            ...chunk,
            score: cosineSimilarity(queryEmbedding, embedding),
          };
        } catch (e) {
          return null;
        }
      })
      .filter((c): c is typeof allChunks[0] & { score: number } => c !== null)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    if (scored.length > 0) {
      return scored;
    }
  } catch (error) {
    console.warn("Vector search failed, falling back to keyword search:", error);
  }

  const keywordRows = await db
    .select()
    .from(documentChunks)
    .innerJoin(documents, eq(documentChunks.documentId, documents.id))
      .where(
        and(
          eq(documents.userId, userId),
          eq(documents.status, "indexed"),
          like(documentChunks.content, `%${query}%`),
        )
      )
      .limit(limit);

  return keywordRows.map((row) => row.documentChunks);
}

// CRM - Notes (Post-its)
export async function getNotes(userId: number) {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(notes).where(eq(notes.userId, userId));
}

export async function createNote(userId: number, data: Omit<InsertNote, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.insert(notes).values({ ...data, userId });
}

export async function updateNote(userId: number, id: number, data: Partial<InsertNote>) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db
    .update(notes)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(notes.id, id), eq(notes.userId, userId)));
}

export async function deleteNote(userId: number, id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return db.delete(notes).where(and(eq(notes.id, id), eq(notes.userId, userId)));
}

// ========== RAG - Document Functions (Extended) ==========

export type DocumentFilters = {
  legalStatus?: string;
  sourceType?: string;
  status?: string;
};

export async function createDocumentRAG(userId: number, data: Omit<InsertDocument, "userId">) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  if (data.externalId) {
    const existing = await db
      .select()
      .from(documents)
      .where(and(eq(documents.userId, userId), eq(documents.externalId, data.externalId)))
      .limit(1);
    
    if (existing.length > 0) {
      throw new Error("CONFLICT: externalId already exists for this user");
    }
  }
  
  const insertData = { ...data };
  if (!insertData.name) {
    throw new Error("Document name is required");
  }
  
  return db.insert(documents).values({ ...insertData, userId });
}

export async function getDocumentsRAG(userId: number, filters?: DocumentFilters) {
  const db = await getDb();
  if (!db) return [];
  
  let query = db.select().from(documents).where(eq(documents.userId, userId));
  
  if (filters) {
    const conditions = [eq(documents.userId, userId)];
    if (filters.legalStatus) {
      if (filters.legalStatus === "vigente") {
        const activeCondition =
          or(eq(documents.legalStatus, "vigente"), isNull(documents.legalStatus)) ||
          eq(documents.legalStatus, "vigente");
        conditions.push(activeCondition);
      } else {
        conditions.push(eq(documents.legalStatus, filters.legalStatus));
      }
    }
    if (filters.sourceType) conditions.push(eq(documents.sourceType, filters.sourceType));
    if (filters.status) {
      const statusVal = filters.status as "processing" | "review" | "indexed" | "error" | "rejected";
      conditions.push(eq(documents.status, statusVal));
    }
    query = db.select().from(documents).where(and(...conditions));
  }
  
  return query;
}

export async function getDocumentByIdRAG(userId: number, id: number) {
  const db = await getDb();
  if (!db) return null;
  const results = await db
    .select()
    .from(documents)
    .where(and(eq(documents.id, id), eq(documents.userId, userId)))
    .limit(1);
  return results[0] || null;
}

export async function getDocumentByExternalId(userId: number, externalId: string) {
  const db = await getDb();
  if (!db) return null;
  const results = await db
    .select()
    .from(documents)
    .where(and(eq(documents.userId, userId), eq(documents.externalId, externalId)))
    .limit(1);
  return results[0] || null;
}

export async function updateDocumentStatusRAG(
  userId: number, 
  externalId: string, 
  status: "processing" | "review" | "indexed" | "error" | "rejected",
  expiryDate?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const doc = await getDocumentByExternalId(userId, externalId);
  if (!doc) throw new Error("Document not found");
  
  const updates: Record<string, unknown> = { status, updatedAt: new Date() };
  if (expiryDate) updates.expiryDate = expiryDate;
  if (status === "error") {
    updates.legalStatus = "extinta";
  }
  
  return db
    .update(documents)
    .set(updates)
    .where(and(eq(documents.id, doc.id), eq(documents.userId, userId)));
}

export async function updateDocumentStatusById(
  documentId: number,
  status: "processing" | "review" | "indexed" | "error" | "rejected"
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  return db
    .update(documents)
    .set({ status, updatedAt: new Date() })
    .where(eq(documents.id, documentId));
}

export async function updateDocumentLifecycle(
  userId: number,
  documentId: number,
  legalStatus: "vigente" | "ab-rogada" | "derrogada" | "extinta",
  expiryDate?: string
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const doc = await getDocumentByIdRAG(userId, documentId);
  if (!doc) throw new Error("Document not found");

  return db
    .update(documents)
    .set({
      legalStatus,
      expiryDate: expiryDate || doc.expiryDate,
      updatedAt: new Date(),
    })
    .where(and(eq(documents.id, documentId), eq(documents.userId, userId)));
}

export async function updateDocumentProgress(
  documentId: number,
  indexedChunks: number,
  totalChunks: number
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db
    .update(documents)
    .set({ indexedChunks, totalChunks, updatedAt: new Date() })
    .where(eq(documents.id, documentId));
}

export async function replaceDocument(
  userId: number,
  externalId: string,
  newData: Partial<InsertDocument>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const existingDoc = await getDocumentByExternalId(userId, externalId);
  if (!existingDoc) throw new Error("Document not found");
  
  const newExternalId = newData.externalId || `${externalId}_${Date.now()}`;
  
  if (!newData.name && !existingDoc.name) {
    throw new Error("Document name is required");
  }
  
  const newDocData = {
    name: newData.name || existingDoc.name,
    type: newData.type || existingDoc.type || "text/plain",
    size: newData.size || existingDoc.size || 0,
    externalId: newExternalId,
    legalStatus: "vigente" as const,
    status: "processing" as const,
    indexedChunks: 0,
  };
  
  const result = await db.insert(documents).values({ ...newDocData, userId });
  const newDocId = (result as any)?.lastInsertRowid;

  await db
    .update(documents)
    .set({
      supersededById: Number(newDocId),
      legalStatus: existingDoc.legalStatus || "derrogada",
      updatedAt: new Date(),
    })
    .where(eq(documents.id, existingDoc.id));

  await db.delete(documentChunks).where(eq(documentChunks.documentId, existingDoc.id));

  return { id: Number(newDocId), supersededById: existingDoc.id };
}

export async function hardDeleteDocument(userId: number, id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  const doc = await getDocumentByIdRAG(userId, id);
  if (!doc) throw new Error("Document not found");
  
  await db.delete(documentChunks).where(eq(documentChunks.documentId, id));
  
  return db.delete(documents).where(and(eq(documents.id, id), eq(documents.userId, userId)));
}

export async function purgeDocumentChunks(documentId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  await db.delete(documentChunks).where(eq(documentChunks.documentId, documentId));
  
  return db
    .update(documents)
    .set({ indexedChunks: 0, updatedAt: new Date() })
    .where(eq(documents.id, documentId));
}

export async function createDocumentChunkBatch(chunks: InsertDocumentChunk[]) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  
  return db.insert(documentChunks).values(chunks);
}

export interface SearchChunkResult {
  documentChunks: {
    id: number;
    documentId: number;
    chunkIndex: number;
    content: string;
    metadata: string | null;
    embedding: string | null;
  };
  score: number;
}

export async function searchDocumentChunksByVector(
  userId: number,
  queryVec: number[],
  topK: number = 5,
  filters?: {
    documentIds?: number[];
    minScore?: number;
    legalStatus?: string;
  }
) {
  const db = await getDb();
  if (!db) return [];

  const legalStatusFilter = filters?.legalStatus || "vigente";
  
  const whereConditions = [
    eq(documents.userId, userId),
    eq(documents.status, "indexed"),
    legalStatusFilter === "vigente"
      ? or(eq(documents.legalStatus, "vigente"), isNull(documents.legalStatus)) ||
        eq(documents.legalStatus, "vigente")
      : eq(documents.legalStatus, legalStatusFilter),
    isNotNull(documentChunks.embedding),
  ];

  if (filters?.documentIds && filters.documentIds.length > 0) {
    whereConditions.push(inArray(documentChunks.documentId, filters.documentIds));
  }

  const allChunks = await db
    .select()
    .from(documentChunks)
    .innerJoin(documents, eq(documentChunks.documentId, documents.id))
    .where(and(...whereConditions));
  
  const scored = allChunks
    .map((row: { documentChunks: { id: number; documentId: number; chunkIndex: number; content: string; metadata: string | null; embedding: string | null } }) => {
      try {
        const embedding = row.documentChunks.embedding 
          ? JSON.parse(row.documentChunks.embedding) 
          : null;
        if (!embedding || !Array.isArray(embedding)) return null;
        return {
          ...row,
          score: cosineSimilarity(queryVec, embedding),
        };
      } catch (error) {
        console.warn(
          `[DB][RAG] Invalid embedding payload for chunk ${row.documentChunks.id} (documentId=${row.documentChunks.documentId}, chunkIndex=${row.documentChunks.chunkIndex})`,
          error
        );
        return null;
      }
    })
    .filter((c): c is SearchChunkResult => c !== null)
    .sort((a, b) => b.score - a.score);
  
  const minScore = filters?.minScore ?? 0.5;
  return scored.filter(c => c.score >= minScore).slice(0, topK);
}

export async function searchDocumentChunksByKeyword(
  userId: number,
  query: string,
  topK: number = 5,
  filters?: {
    documentIds?: number[];
    legalStatus?: string;
  }
) {
  const db = await getDb();
  if (!db) return [] as SearchChunkResult[];

  const legalStatusFilter = filters?.legalStatus || "vigente";

  const terms = query
    .toLowerCase()
    .split(/\s+/)
    .map(t => t.trim())
    .filter(t => t.length >= 3)
    .slice(0, 12);

  if (terms.length === 0) return [] as SearchChunkResult[];

  let allChunks = await db
    .select()
    .from(documentChunks)
    .innerJoin(documents, eq(documentChunks.documentId, documents.id))
    .where(and(
      eq(documents.userId, userId),
      eq(documents.status, "indexed"),
      legalStatusFilter === "vigente"
        ? or(eq(documents.legalStatus, "vigente"), isNull(documents.legalStatus)) ||
          eq(documents.legalStatus, "vigente")
        : eq(documents.legalStatus, legalStatusFilter)
    ));

  if (filters?.documentIds && filters.documentIds.length > 0) {
    allChunks = allChunks.filter(c => filters.documentIds!.includes(c.documentChunks.documentId));
  }

  const scored = allChunks
    .map(row => {
      const text = (row.documentChunks.content || "").toLowerCase();
      if (!text) return null;

      let hits = 0;
      for (const term of terms) {
        const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g");
        const matches = text.match(regex);
        hits += matches ? matches.length : 0;
      }

      const phraseBoost = text.includes(query.toLowerCase()) ? 2 : 0;
      const rawScore = hits + phraseBoost;
      if (rawScore <= 0) return null;

      const normalizedScore = Math.min(1, rawScore / Math.max(terms.length * 2, 1));

      return {
        documentChunks: {
          id: row.documentChunks.id,
          documentId: row.documentChunks.documentId,
          chunkIndex: row.documentChunks.chunkIndex,
          content: row.documentChunks.content,
          metadata: row.documentChunks.metadata,
          embedding: row.documentChunks.embedding,
        },
        score: normalizedScore,
      } as SearchChunkResult;
    })
    .filter((c): c is SearchChunkResult => c !== null)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);

  return scored;
}

export async function getStorageStats(userId: number) {
  const db = await getDb();
  if (!db) {
    return { documents: { count: 0, sizeBytes: 0, estimatedKB: 0 }, memories: { count: 0, sizeBytes: 0 }, conversations: { count: 0, sizeBytes: 0 }, tasks: { count: 0 }, totalBytes: 0 };
  }
  
  const docs = await db.select().from(documents).where(eq(documents.userId, userId));
  const memories = await db.select().from(memoryEntries).where(eq(memoryEntries.userId, userId));
  const userConversations = await db.select().from(conversations).where(eq(conversations.userId, userId));
  const tasks = await db.select().from(proactiveTasks).where(eq(proactiveTasks.userId, userId));
  
  const docsSize = docs.reduce((sum, d) => sum + (d.size || 0), 0);
  const docsEstKB = docs.reduce((sum, d) => sum + (d.estimatedSizeKB || 0), 0);
  const memoriesSize = memories.reduce((sum, m) => sum + (m.content?.length || 0), 0);
  const conversationsSize = await db
    .select()
    .from(messages)
    .innerJoin(conversations, eq(messages.conversationId, conversations.id))
    .where(eq(conversations.userId, userId));
  const convSize = conversationsSize.reduce((sum, m) => sum + (m.messages.content?.length || 0), 0);
  
  return {
    documents: { count: docs.length, sizeBytes: docsSize, estimatedKB: docsEstKB },
    memories: { count: memories.length, sizeBytes: memoriesSize },
    conversations: { count: userConversations.length, sizeBytes: convSize },
    tasks: { count: tasks.length },
    totalBytes: docsSize + memoriesSize + convSize,
  };
}

export async function cleanupExpiredDocuments(userId?: number) {
  const db = await getDb();
  if (!db) return { deleted: 0 };
  
  const now = new Date();
  let query = db.select().from(documents);
  
  let docs = userId 
    ? await db.select().from(documents).where(eq(documents.userId, userId))
    : await db.select().from(documents);
  
  const expired = docs.filter(d => {
    if (!d.retentionDays || !d.createdAt) return false;
    const expiryDate = new Date(d.createdAt.getTime() + d.retentionDays * 24 * 60 * 60 * 1000);
    return expiryDate < now;
  });
  
  let deleted = 0;
  for (const doc of expired) {
    await db.delete(documentChunks).where(eq(documentChunks.documentId, doc.id));
    await db.delete(documents).where(eq(documents.id, doc.id));
    deleted++;
  }
  
  return { deleted };
}

export async function cleanupOldMemories(userId?: number) {
  const db = await getDb();
  if (!db) return { archived: 0 };
  
  const now = new Date();
  let allMemories = userId
    ? await db.select().from(memoryEntries).where(eq(memoryEntries.userId, userId))
    : await db.select().from(memoryEntries);
  
  const expired = allMemories.filter(m => {
    if (!m.ttl || !m.createdAt) return false;
    const expiryDate = new Date(m.createdAt.getTime() + m.ttl * 1000);
    return expiryDate < now;
  });
  
  let archived = 0;
  for (const memory of expired) {
    await db
      .update(memoryEntries)
      .set({ archived: 1 })
      .where(eq(memoryEntries.id, memory.id));
    archived++;
  }
  
  return { archived };
}

export async function cleanupCompletedTasks(userId: number, olderThanDays: number = 30) {
  const db = await getDb();
  if (!db) return { deleted: 0 };
  
  const cutoffDate = new Date(Date.now() - olderThanDays * 24 * 60 * 60 * 1000);
  
  const tasks = await db
    .select()
    .from(proactiveTasks)
    .where(and(
      eq(proactiveTasks.userId, userId),
      eq(proactiveTasks.status, "completed")
    ));
  
  const oldTasks = tasks.filter(t => t.lastRun && new Date(t.lastRun) < cutoffDate);
  
  let deleted = 0;
  for (const task of oldTasks) {
    await db.delete(proactiveTasks).where(eq(proactiveTasks.id, task.id));
    deleted++;
  }
  
  return { deleted };
}

export async function updateDocumentLastAccessed(documentId: number) {
  const db = await getDb();
  if (!db) return;
  
  return db
    .update(documents)
    .set({ lastAccessedAt: new Date(), updatedAt: new Date() })
    .where(eq(documents.id, documentId));
}



// Lawsuits (Processos)
// Deprecated: Use LegalProcesses instead
export async function getLawsuits(userId: number) {
  return [];
}

export async function getLawsuitById(userId: number, id: number) {
  return null;
}

export async function createLawsuit(userId: number, data: any) {
  return null;
}

export async function updateLawsuit(userId: number, id: number, data: any) {
  return null;
}

export async function deleteLawsuit(userId: number, id: number) {
  return null;
}

// Lawsuit Steps (Movimentações)
// Deprecated: Use LegalMovements instead
export async function getLawsuitSteps(lawsuitId: number) {
  return [];
}

export async function createLawsuitStep(data: any) {
  return null;
}

// Courts (Tribunais/Comarcas)
// Deprecated: Use ActionTypes or internal logic
export async function getCourts() {
  return [];
}

export async function createCourt(data: any) {
  return null;
}

// ==========================================
// COMMERCIAL / ERP (Products)
// ==========================================

export async function getAllProducts(limit = 100) {
  if (!_db) throw new Error("Database not initialized");
  return _db.select().from(products).limit(limit).all();
}

export async function getProductsWithoutNCM(limit = 10) {
  if (!_db) throw new Error("Database not initialized");
  return _db
    .select()
    .from(products)
    .where(or(isNull(products.ncm), eq(products.ncm, "")))
    .limit(limit)
    .all();
}

function normalizeProductSearchText(text: string): string {
  return (text || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function tokenizeProductQuery(query: string): string[] {
  const stopwords = new Set([
    "a", "as", "o", "os", "de", "da", "das", "do", "dos", "e",
    "em", "no", "na", "nos", "nas", "para", "por", "com", "sem",
    "que", "quais", "qual", "tem", "temos", "temos", "ha", "há",
    "um", "uma", "uns", "umas", "me", "mostrar", "mostre", "listar",
    "liste", "procure", "buscar", "busque", "favor", "porfavor", "papeis",
    "papel", "produto", "produtos", "catalogo", "catalogos", "catalogo",
  ]);

  return normalizeProductSearchText(query)
    .split(" ")
    .filter((token) => token.length >= 2 && !stopwords.has(token));
}

function expandTokenVariants(token: string): string[] {
  const t = (token || "").trim();
  if (!t) return [];

  const variants = new Set<string>([t]);

  if (t.length >= 4 && t.endsWith("s")) {
    variants.add(t.slice(0, -1));
  }

  if (t.length >= 5 && t.endsWith("es")) {
    variants.add(t.slice(0, -2));
  }

  if (t.length >= 6 && t.endsWith("is")) {
    variants.add(t.slice(0, -2));
  }

  if (t.length >= 7 && t.endsWith("oes")) {
    variants.add(`${t.slice(0, -3)}ao`);
  }

  return Array.from(variants).filter(v => v.length >= 2);
}

export async function searchProducts(searchTerm: string, limit = 20) {
  if (!_db) throw new Error("Database not initialized");

  const safeLimit = Number.isFinite(limit)
    ? Math.min(Math.max(1, Math.floor(limit)), 500)
    : 20;

  const rawQuery = (searchTerm || "").trim();
  if (!rawQuery) {
    return _db.select().from(products).limit(safeLimit).all();
  }

  const normalizedQuery = normalizeProductSearchText(rawQuery);
  const tokens = tokenizeProductQuery(rawQuery);
  const baseTokens = tokens.length > 0 ? tokens : normalizedQuery.split(" ").filter(Boolean);
  const candidateTokens = Array.from(
    new Set(baseTokens.flatMap(expandTokenVariants))
  );

  const allProducts = _db.select().from(products).all();

  const ranked = allProducts
    .map((product) => {
      const name = normalizeProductSearchText(product.name || "");
      const referenceId = normalizeProductSearchText(product.referenceId || "");
      const barcode = normalizeProductSearchText(product.barcode || "");
      const ncm = normalizeProductSearchText(product.ncm || "");
      const haystack = `${name} ${referenceId} ${barcode} ${ncm}`.trim();

      if (!haystack) return null;

      let score = 0;
      let tokenHits = 0;

      if (normalizedQuery && haystack.includes(normalizedQuery)) {
        score += 12;
      }

      for (const token of candidateTokens) {
        if (!token) continue;
        if (name.includes(token)) {
          tokenHits++;
          score += 4;
        } else if (referenceId.includes(token) || barcode.includes(token) || ncm.includes(token)) {
          tokenHits++;
          score += 3;
        }
      }

      if (referenceId && normalizedQuery && referenceId === normalizedQuery) {
        score += 20;
      }

      if (name && normalizedQuery && name.startsWith(normalizedQuery)) {
        score += 2;
      }

      if (tokenHits === 0 && score === 0) {
        return null;
      }

      return {
        product,
        score,
        tokenHits,
      };
    })
    .filter((item): item is { product: (typeof allProducts)[number]; score: number; tokenHits: number } => item !== null)
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      if (b.tokenHits !== a.tokenHits) return b.tokenHits - a.tokenHits;
      return (a.product.name || "").localeCompare(b.product.name || "");
    })
    .slice(0, safeLimit)
    .map((item) => item.product);

  return ranked;
}

export async function getProductByRef(ref: string) {
  if (!_db) throw new Error("Database not initialized");
  const result = _db.select().from(products).where(eq(products.referenceId, ref)).all();
  return result.length > 0 ? result[0] : null;
}

export async function upsertProduct(productData: Partial<InsertProduct>) {
  if (!_db) throw new Error("Database not initialized");
  if (!productData.name) throw new Error("Product name required");

  if (productData.referenceId) {
    const existing = await getProductByRef(productData.referenceId);
    if (existing) {
      const result = await _db
        .update(products)
        .set({ ...productData, updatedAt: new Date() })
        .where(eq(products.id, existing.id))
        .returning();
      return result[0];
    }
  }

  const result = await _db.insert(products).values(productData as InsertProduct).returning();
  return result[0];
}
