import { int, sqliteTable, text, integer, index, real } from "drizzle-orm/sqlite-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = sqliteTable(
  "users",
  {
    /**
     * Surrogate primary key. Auto-incremented numeric value managed by the database.
     * Use this for relations between tables.
     */
    id: integer("id").primaryKey({ autoIncrement: true }),
    /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
    openId: text("openId").notNull().unique(),
    name: text("name"),
    email: text("email"),
    avatarUrl: text("avatarUrl"),
    phone: text("phone"),
     bio: text("bio"),
     isActive: integer("isActive").default(1),
     password: text("password"), // Hash da senha para login direto
     loginMethod: text("loginMethod"),
    role: text("role", { enum: ["user", "admin"] })
      .default("user")
      .notNull(),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    lastSignedIn: integer("lastSignedIn", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    emailIdx: index("idx_users_email").on(table.email),
    roleIdx: index("idx_users_role").on(table.role),
  })
);

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// Conversations table for chat history
export const conversations = sqliteTable(
  "conversations",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    mode: text("mode", { enum: ["ECO", "STANDARD", "PERFORMANCE"] })
      .default("ECO")
      .notNull(),
    model: text("model"), // Added model field
    isFavorite: integer("isFavorite").default(0), // Added favorite field
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_conversations_user_id").on(table.userId),
    updatedAtIdx: index("idx_conversations_updated_at").on(table.updatedAt),
  })
);

export type Conversation = typeof conversations.$inferSelect;
export type InsertConversation = typeof conversations.$inferInsert;

// Messages table for chat history
export const messages = sqliteTable(
  "messages",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    conversationId: integer("conversationId")
      .notNull()
      .references(() => conversations.id, { onDelete: "cascade" }),
    role: text("role", { enum: ["user", "assistant", "system"] }).notNull(),
    content: text("content").notNull(),
    tokensUsed: integer("tokensUsed"), // Added tokens field
    attachments: text("attachments"), // JSON array of attachments
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    conversationIdIdx: index("idx_messages_conversation_id").on(
      table.conversationId
    ),
    createdAtIdx: index("idx_messages_created_at").on(table.createdAt),
  })
);

export type Message = typeof messages.$inferSelect;
export type InsertMessage = typeof messages.$inferInsert;

// Memory entries for semantic search and keywords
export const memoryEntries = sqliteTable("memoryEntries", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  content: text("content").notNull(),
  keywords: text("keywords"),
  embedding: text("embedding"), // JSON array as string for vector similarity
  type: text("type", {
    enum: ["fact", "preference", "context", "command"],
  }).default("fact"),
  archived: integer("archived").default(0), // 0 = false, 1 = true (soft delete)
  ttl: integer("ttl"), // Time-to-live em segundos (opcional)
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .defaultNow(),
  accessedAt: integer("accessedAt", { mode: "timestamp_ms" }).defaultNow(),
});

export type MemoryEntry = typeof memoryEntries.$inferSelect;
export type InsertMemoryEntry = typeof memoryEntries.$inferInsert;

// User settings for mode preferences and configurations
export const userSettings = sqliteTable("userSettings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId")
    .notNull()
    .unique()
    .references(() => users.id, { onDelete: "cascade" }),
  preferredMode: text("preferredMode", {
    enum: ["ECO", "STANDARD", "PERFORMANCE", "AUTO"],
  })
    .default("AUTO")
    .notNull(),
  autoDetectHardware: integer("autoDetectHardware").default(1).notNull(), // 0 or 1 for boolean
  llmTemperature: integer("llmTemperature").default(70), // 0-100 scale
  llmTopP: integer("llmTopP").default(90), // 0-100 scale
  sttLanguage: text("sttLanguage").default("pt-BR"),
  theme: text("theme").default("light"),
  currentModule: text("currentModule", {
    enum: ["GENERAL", "LEGAL", "MEDICAL", "DEVELOPER"],
  }).default("GENERAL"),

  // Profile preferences for LLM personalization
  profileRole: text("profileRole").default("user"),
  profession: text("profession"),
  expertiseLevel: text("expertiseLevel", {
    enum: ["beginner", "intermediate", "expert"],
  }).default("intermediate"),
  preferredTone: text("preferredTone", {
    enum: ["formal", "informal", "concise", "detailed"],
  }).default("formal"),
  includePiiInContext: integer("includePiiInContext").default(0),
  jurisdiction: text("jurisdiction"),
  medicalConsent: integer("medicalConsent").default(0),

  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .defaultNow(),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .defaultNow(),
});

export type UserSettings = typeof userSettings.$inferSelect;
export type InsertUserSettings = typeof userSettings.$inferInsert;

// System logs for monitoring and debugging
export const systemLogs = sqliteTable("systemLogs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").references(() => users.id, { onDelete: "cascade" }),
  level: text("level", { enum: ["INFO", "WARNING", "ERROR", "DEBUG"] }).default(
    "INFO"
  ),
  message: text("message").notNull(),
  metadata: text("metadata"), // JSON as string
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .defaultNow(),
});

export type SystemLog = typeof systemLogs.$inferSelect;
export type InsertSystemLog = typeof systemLogs.$inferInsert;

// Hardware snapshot for monitoring
export const hardwareSnapshots = sqliteTable("hardwareSnapshots", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  cpuUsage: integer("cpuUsage").notNull(), // percentage 0-100
  ramUsage: integer("ramUsage").notNull(), // percentage 0-100
  ramAvailable: integer("ramAvailable").notNull(), // in GB
  gpuUsage: integer("gpuUsage"), // percentage 0-100, nullable
  gpuVram: integer("gpuVram"), // in GB, nullable
  mode: text("mode", { enum: ["ECO", "STANDARD", "PERFORMANCE"] }).notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .defaultNow(),
});

export type HardwareSnapshot = typeof hardwareSnapshots.$inferSelect;
export type InsertHardwareSnapshot = typeof hardwareSnapshots.$inferInsert;

// Sessions table for authentication
export const sessions = sqliteTable(
  "sessions",
  {
    id: text("id").primaryKey(),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: integer("expiresAt", { mode: "timestamp_ms" }).notNull(),
    ipAddress: text("ipAddress"),
    userAgent: text("userAgent"),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_sessions_user_id").on(table.userId),
    tokenIdx: index("idx_sessions_token").on(table.token),
  })
);

export type Session = typeof sessions.$inferSelect;
export type InsertSession = typeof sessions.$inferInsert;

// Documents table for RAG and management
export const documents = sqliteTable(
  "documents",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    folderId: integer("folderId").references(() => folders.id, {
      onDelete: "set null",
    }),
    name: text("name").notNull(),
    filename: text("filename"), // Physical filename on disk
    type: text("type").notNull(), // MIME type
    size: integer("size").notNull(), // size in bytes
    url: text("url"), // relative or absolute URL/path
    filePath: text("filePath"), // absolute system path
    status: text("status", {
      enum: ["processing", "indexed", "error"],
    }).default("processing"),
    isIndexed: integer("isIndexed").default(0),
    tags: text("tags"), // JSON array as string
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_documents_user_id").on(table.userId),
    folderIdIdx: index("idx_documents_folder_id").on(table.folderId),
    statusIdx: index("idx_documents_status").on(table.status),
  })
);

export type Document = typeof documents.$inferSelect;
export type InsertDocument = typeof documents.$inferInsert;

// Document chunks for granular RAG search
export const documentChunks = sqliteTable(
  "documentChunks",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    documentId: integer("documentId")
      .notNull()
      .references(() => documents.id, { onDelete: "cascade" }),
    chunkIndex: integer("chunkIndex").notNull().default(0),
    content: text("content").notNull(),
    metadata: text("metadata"), // JSON as string
    embedding: text("embedding"), // Optional: JSON array for vector search
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    documentIdIdx: index("idx_chunks_document_id").on(table.documentId),
  })
);

export type DocumentChunk = typeof documentChunks.$inferSelect;
export type InsertDocumentChunk = typeof documentChunks.$inferInsert;

// Clientes (Customers)
export const customers = sqliteTable(
  "customers",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    name: text("name").notNull(),
    email: text("email"),
    phone: text("phone"),
    cpf: text("cpf"), // CPF/CNPJ
    birthDate: text("birthDate"), // ISO 8601: YYYY-MM-DD
    company: text("company"),
    position: text("position"),
    address: text("address"), // Legacy address field
    addressStreet: text("addressStreet"),
    addressNumber: text("addressNumber"),
    addressCity: text("addressCity"),
    addressState: text("addressState"),
    addressZipcode: text("addressZipcode"),
    notes: text("notes"),
    tags: text("tags"), // JSON array as string
    status: text("status", { enum: ["active", "inactive", "prospect"] }).default(
      "active"
    ),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_customers_user_id").on(table.userId),
    statusIdx: index("idx_customers_status").on(table.status),
    emailIdx: index("idx_customers_email").on(table.email),
  })
);

export type Customer = typeof customers.$inferSelect;
export type InsertCustomer = typeof customers.$inferInsert;

// Agenda (Appointments / Events)
export const appointments = sqliteTable(
  "appointments",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    customerId: integer("customerId").references(() => customers.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    startTime: integer("startTime", { mode: "timestamp_ms" }).notNull(),
    endTime: integer("endTime", { mode: "timestamp_ms" }).notNull(),
    startDate: text("startDate"), // ISO string for easier filtering
    endDate: text("endDate"), // ISO string
    location: text("location"),
    type: text("type", {
      enum: ["meeting", "consultation", "call", "other"],
    }).default("other"),
    reminderMinutes: integer("reminderMinutes"),
    recurrenceRule: text("recurrenceRule"), // JSON string
    participants: text("participants"), // JSON array
    isCompleted: integer("isCompleted").default(0),
    status: text("status", {
      enum: ["scheduled", "completed", "cancelled"],
    }).default("scheduled"),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_events_user_id").on(table.userId),
    customerIdIdx: index("idx_events_customer_id").on(table.customerId),
    startDateIdx: index("idx_events_start_date").on(table.startTime),
  })
);

export type Appointment = typeof appointments.$inferSelect;
export type InsertAppointment = typeof appointments.$inferInsert;

// Post-its (Notes)
export const notes = sqliteTable(
  "notes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title"),
    content: text("content").notNull(),
    color: text("color").default("#ffff88"), // Cor padrão de post-it
    priority: text("priority", {
      enum: ["low", "medium", "high", "urgent"],
    }).default("medium"),
    alarmDate: text("alarmDate"), // ISO string
    alarmTime: text("alarmTime"), // HH:MM
    notify: integer("notify").default(0),
    positionX: integer("positionX").default(0),
    positionY: integer("positionY").default(0),
    tags: text("tags"), // JSON array as string
    isCompleted: integer("isCompleted").default(0),
    archived: integer("archived").default(0),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_notes_user_id").on(table.userId),
  })
);

export type Note = typeof notes.$inferSelect;
export type InsertNote = typeof notes.$inferInsert;

// Events table (Portuguese naming as per db_sugestao.md)
export const events = sqliteTable(
  "events",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    customerId: integer("customerId").references(() => customers.id, {
      onDelete: "set null",
    }),
    title: text("title").notNull(),
    description: text("description"),
    startDate: text("startDate").notNull(), // ISO 8601: YYYY-MM-DD
    startTime: text("startTime").notNull(), // HH:MM
    endDate: text("endDate").notNull(),
    endTime: text("endTime").notNull(),
    type: text("type", {
      enum: ["reuniao", "consulta", "ligacao", "outro"],
    }).default("outro"),
    location: text("location"),
    reminderMinutes: integer("reminderMinutes"),
    isCompleted: integer("isCompleted").default(0),
    recurrenceRule: text("recurrenceRule"), // JSON string
    participants: text("participants"), // JSON array
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_events_user_id").on(table.userId),
    customerIdIdx: index("idx_events_customer_id").on(table.customerId),
    startDateIdx: index("idx_events_start_date").on(table.startDate),
    isCompletedIdx: index("idx_events_is_completed").on(table.isCompleted),
  })
);

export type Event = typeof events.$inferSelect;
export type InsertEvent = typeof events.$inferInsert;

// Post-its table (Portuguese naming as per db_sugestao.md)
export const postits = sqliteTable(
  "postits",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    description: text("description"),
    color: text("color").default("#fef3c7"),
    category: text("category"),
    priority: text("priority", {
      enum: ["baixa", "media", "alta", "urgente"],
    }).default("media"),
    alarmDate: text("alarmDate"), // ISO 8601: YYYY-MM-DD
    alarmTime: text("alarmTime"), // HH:MM
    notify: integer("notify").default(0),
    positionX: integer("positionX").default(0),
    positionY: integer("positionY").default(0),
    tags: text("tags"), // JSON array as string
    isCompleted: integer("isCompleted").default(0),
    isArchived: integer("isArchived").default(0),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_postits_user_id").on(table.userId),
    alarmIdx: index("idx_postits_alarm").on(table.alarmDate, table.alarmTime),
    priorityIdx: index("idx_postits_priority").on(table.priority),
  })
);

export type Postit = typeof postits.$inferSelect;
export type InsertPostit = typeof postits.$inferInsert;

// Folders for better organization
export const folders = sqliteTable("folders", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  parentId: integer("parentId").references((): any => folders.id, {
    onDelete: "cascade",
  }),
  name: text("name").notNull(),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .defaultNow(),
});

export type Folder = typeof folders.$inferSelect;
export type InsertFolder = typeof folders.$inferInsert;

// Audit logs for security and tracking
export const auditLogs = sqliteTable("audit_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId").references(() => users.id, { onDelete: "set null" }),
  action: text("action").notNull(),
  entity: text("entity"),
  entityId: integer("entityId"),
  details: text("details"),
  ipAddress: text("ipAddress"),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .defaultNow(),
});

export type AuditLog = typeof auditLogs.$inferSelect;
export type InsertAuditLog = typeof auditLogs.$inferInsert;

// System settings table
export const systemSettings = sqliteTable("system_settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
  type: text("type", {
    enum: ["string", "number", "boolean", "json"],
  }).default("string"),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .defaultNow(),
});

export type SystemSetting = typeof systemSettings.$inferSelect;
export type InsertSystemSetting = typeof systemSettings.$inferInsert;

// User preferences table
export const userPreferences = sqliteTable("user_preferences", {
  userId: integer("userId")
    .primaryKey()
    .references(() => users.id, { onDelete: "cascade" }),
  theme: text("theme").default("auto"),
  language: text("language").default("pt-BR"),
  compactMode: integer("compactMode").default(0),
  notificationsPush: integer("notificationsPush").default(1),
  notificationsEmail: integer("notificationsEmail").default(1),
  notificationsSound: integer("notificationsSound").default(1),
  chatModelDefault: text("chatModelDefault").default("gpt-4"),
  chatTemperature: real("chatTemperature").default(0.7),
  chatAutoScroll: integer("chatAutoScroll").default(1),
  chatTts: integer("chatTts").default(0),
  updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
    .notNull()
    .defaultNow(),
});

export type UserPreference = typeof userPreferences.$inferSelect;
export type InsertUserPreference = typeof userPreferences.$inferInsert;

// Password reset tokens for auth flow
export const passwordResetTokens = sqliteTable(
  "password_reset_tokens",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    token: text("token").notNull().unique(),
    expiresAt: integer("expiresAt", { mode: "timestamp_ms" }).notNull(),
    used: integer("used").default(0),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    tokenIdx: index("idx_password_tokens_token").on(table.token),
  })
);

export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;
export type InsertPasswordResetToken = typeof passwordResetTokens.$inferInsert;

// Security cards for 2FA/Enhanced security
export const securityCards = sqliteTable(
  "security_cards",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    cardData: text("cardData").notNull(), // JSON data of the card
    status: text("status").notNull().default("active"),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_security_cards_user_id").on(table.userId),
  })
);

export type SecurityCard = typeof securityCards.$inferSelect;
export type InsertSecurityCard = typeof securityCards.$inferInsert;

// Security card attempts for monitoring
export const securityCardAttempts = sqliteTable(
  "security_card_attempts",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    positionsRequested: text("positionsRequested").notNull(),
    success: integer("success").notNull(),
    ipAddress: text("ipAddress"),
    attemptedAt: integer("attemptedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_security_card_attempts_user_id").on(table.userId),
  })
);

export type SecurityCardAttempt = typeof securityCardAttempts.$inferSelect;
export type InsertSecurityCardAttempt = typeof securityCardAttempts.$inferInsert;

// Automação Proativa (Proactive Tasks / Cron)
export const proactiveTasks = sqliteTable("proactiveTasks", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  userId: integer("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type", { enum: ["cron", "one-time", "watcher"] }).notNull(),
  schedule: text("schedule"), // Expressão cron ou data ISO
  status: text("status", { enum: ["active", "paused", "completed", "failed"] })
    .default("active")
    .notNull(),
  lastRun: integer("lastRun", { mode: "timestamp_ms" }),
  nextRun: integer("nextRun", { mode: "timestamp_ms" }),
  createdAt: integer("createdAt", { mode: "timestamp_ms" })
    .notNull()
    .defaultNow(),
});

export type ProactiveTask = typeof proactiveTasks.$inferSelect;
export type InsertProactiveTask = typeof proactiveTasks.$inferInsert;

// --- MÓDULO JURÍDICO ---

// 1. Clientes Jurídicos (Melhorado para Advocacia)
export const legalClients = sqliteTable(
  "legal_clients",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    
    // Dados Pessoais
    name: text("name").notNull(),
    cpf: text("cpf").notNull().unique(),
    rg: text("rg"),
    birthDate: text("birthDate"), // ISO 8601: YYYY-MM-DD
    maritalStatus: text("maritalStatus"),
    
    // Contato
    email: text("email"),
    phone: text("phone").notNull(),
    phoneSecondary: text("phoneSecondary"),
    
    // Endereço
    addressStreet: text("addressStreet"),
    addressNumber: text("addressNumber"),
    addressComplement: text("addressComplement"),
    addressNeighborhood: text("addressNeighborhood"),
    addressCity: text("addressCity").notNull(),
    addressState: text("addressState"),
    addressZipcode: text("addressZipcode"),
    
    // Dados Profissionais
    occupation: text("occupation"),
    company: text("company"),
    monthlyIncome: real("monthlyIncome"),
    dependents: integer("dependents"),
    
    // Controle
    status: text("status", { enum: ["ativo", "inativo", "prospect"] }).default("ativo"),
    notes: text("notes"),
    tags: text("tags"), // JSON array
    
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_legal_clients_user_id").on(table.userId),
    cpfIdx: index("idx_legal_clients_cpf").on(table.cpf),
    cityIdx: index("idx_legal_clients_city").on(table.addressCity),
    statusIdx: index("idx_legal_clients_status").on(table.status),
  })
);

export type LegalClient = typeof legalClients.$inferSelect;
export type InsertLegalClient = typeof legalClients.$inferInsert;

// 2. Tipos de Ação Jurídica (Taxonomia)
export const actionTypes = sqliteTable(
  "action_types",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    code: text("code").notNull().unique(), // Ex: "PREV_APOSENTADORIA"
    name: text("name").notNull(),
    category: text("category").notNull(), // previdenciario, trabalhista, civil, etc
    jurisdiction: text("jurisdiction").notNull(), // comum ou especializada
    courtType: text("courtType").notNull(), // federal, estadual, trabalho, etc
    initialPetitionTemplate: text("initialPetitionTemplate"),
    description: text("description"),
    isActive: integer("isActive").default(1),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    categoryIdx: index("idx_action_types_category").on(table.category),
    courtTypeIdx: index("idx_action_types_court_type").on(table.courtType),
  })
);

export type ActionType = typeof actionTypes.$inferSelect;
export type InsertActionType = typeof actionTypes.$inferInsert;

// 3. Processos Jurídicos
export const legalProcesses = sqliteTable(
  "legal_processes",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    clientId: integer("clientId")
      .notNull()
      .references(() => legalClients.id, { onDelete: "cascade" }),
    
    // Identificação
    processNumber: text("processNumber").notNull().unique(),
    actionTypeId: integer("actionTypeId")
      .notNull()
      .references(() => actionTypes.id),
    
    // Classificação
    category: text("category").notNull(),
    jurisdiction: text("jurisdiction").notNull(),
    courtType: text("courtType").notNull(),
    comarca: text("comarca"),
    varaNumber: text("varaNumber"),
    
    // Instância Atual
    currentInstance: text("currentInstance").notNull().default("1ª instancia"),
    courtName: text("courtName"),
    judgeName: text("judgeName"),
    opposingParty: text("opposingParty"),
    opposingLawyer: text("opposingLawyer"),
    
    // Datas
    entryDate: text("entryDate").notNull(), // ISO 8601: YYYY-MM-DD
    conclusionDate: text("conclusionDate"),
    lastMovementDate: text("lastMovementDate"),
    
    // Status
    status: text("status").notNull().default("em andamento"),
    isArchived: integer("isArchived").default(0),
    priority: text("priority").default("normal"), // baixa, normal, alta, urgente
    tags: text("tags"), // JSON array
    
    // Valores
    caseValue: real("caseValue"),
    awardedValue: real("awardedValue"),
    attorneyFeesValue: real("attorneyFeesValue"),
    rpvValue: real("rpvValue"),
    rpvReceived: integer("rpvReceived").default(0),
    rpvReceivedDate: text("rpvReceivedDate"),
    
    observations: text("observations"),
    
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    userIdIdx: index("idx_processes_user_id").on(table.userId),
    clientIdIdx: index("idx_processes_client_id").on(table.clientId),
    numberIdx: index("idx_processes_number").on(table.processNumber),
    statusIdx: index("idx_processes_status").on(table.status),
    categoryIdx: index("idx_processes_category").on(table.category),
  })
);

export type LegalProcess = typeof legalProcesses.$inferSelect;
export type InsertLegalProcess = typeof legalProcesses.$inferInsert;

// 4. Movimentações Processuais
export const processMovements = sqliteTable(
  "process_movements",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    processId: integer("processId")
      .notNull()
      .references(() => legalProcesses.id, { onDelete: "cascade" }),
    
    movementType: text("movementType").notNull(), // audiencia, sentenca, decisao, etc
    title: text("title").notNull(),
    description: text("description").notNull(),
    movementDate: text("movementDate").notNull(),
    registeredDate: integer("registeredDate", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    
    result: text("result"), // procedente, improcedente, etc
    value: real("value"),
    
    requiresAction: integer("requiresAction").default(0),
    actionDeadline: text("actionDeadline"),
    
    createdByUserId: integer("createdByUserId").references(() => users.id, { onDelete: "set null" }),
    notes: text("notes"),
    courtDecisionFile: text("courtDecisionFile"), // Path to PDF
    
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    processIdIdx: index("idx_movements_process_id").on(table.processId),
    dateIdx: index("idx_movements_date").on(table.movementDate),
  })
);

export type ProcessMovement = typeof processMovements.$inferSelect;
export type InsertProcessMovement = typeof processMovements.$inferInsert;

// 5. Prazos Processuais
export const legalDeadlines = sqliteTable(
  "legal_deadlines",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    processId: integer("processId")
      .notNull()
      .references(() => legalProcesses.id, { onDelete: "cascade" }),
    
    title: text("title").notNull(),
    description: text("description"),
    deadlineType: text("deadlineType").notNull(),
    
    startDate: text("startDate").notNull(),
    dueDate: text("dueDate").notNull(),
    businessDays: integer("businessDays"),
    
    status: text("status").notNull().default("pendente"), // pendente, cumprido, vencido, etc
    completionDate: text("completionDate"),
    urgency: text("urgency"), // critica, alta, media, baixa
    
    notifyAt: text("notifyAt"), // JSON array of dates
    lastNotificationSent: text("lastNotificationSent"),
    
    assignedToUserId: integer("assignedToUserId").references(() => users.id, { onDelete: "set null" }),
    notes: text("notes"),
    
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    processIdIdx: index("idx_deadlines_process_id").on(table.processId),
    dueDateIdx: index("idx_deadlines_due_date").on(table.dueDate),
    statusIdx: index("idx_deadlines_status").on(table.status),
  })
);

export type LegalDeadline = typeof legalDeadlines.$inferSelect;
export type InsertLegalDeadline = typeof legalDeadlines.$inferInsert;

// 6. Audiências e Eventos Jurídicos
export const legalHearings = sqliteTable(
  "legal_hearings",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    processId: integer("processId")
      .notNull()
      .references(() => legalProcesses.id, { onDelete: "cascade" }),
    
    hearingType: text("hearingType").notNull(),
    title: text("title").notNull(),
    description: text("description"),
    
    hearingDate: text("hearingDate").notNull(),
    hearingTime: text("hearingTime").notNull(),
    durationMinutes: integer("durationMinutes").default(60),
    
    location: text("location"),
    locationType: text("locationType").default("presencial"), // presencial, virtual, hibrido
    virtualLink: text("virtualLink"),
    
    judgeName: text("judgeName"),
    plaintiffLawyer: text("plaintiffLawyer"),
    defendantLawyer: text("defendantLawyer"),
    witnesses: text("witnesses"), // JSON array
    
    status: text("status").default("agendada"),
    result: text("result"),
    outcomeDescription: text("outcomeDescription"),
    minutesFilePath: text("minutesFilePath"),
    
    reminderSent: integer("reminderSent").default(0),
    
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    processIdIdx: index("idx_hearings_process_id").on(table.processId),
    dateIdx: index("idx_hearings_date").on(table.hearingDate),
  })
);

export type LegalHearing = typeof legalHearings.$inferSelect;
export type InsertLegalHearing = typeof legalHearings.$inferInsert;

// 7. Honorários Advocatícios
export const attorneyFees = sqliteTable(
  "attorney_fees",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    processId: integer("processId")
      .notNull()
      .references(() => legalProcesses.id, { onDelete: "cascade" }),
    clientId: integer("clientId")
      .notNull()
      .references(() => legalClients.id, { onDelete: "cascade" }),
    userId: integer("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    
    feeType: text("feeType").notNull(), // contratuais, sucumbenciais, etc
    agreedValue: real("agreedValue"),
    awardedValue: real("awardedValue"),
    receivedValue: real("receivedValue"),
    percentage: real("percentage"),
    
    agreementDate: text("agreementDate"),
    dueDate: text("dueDate"),
    paymentDate: text("paymentDate"),
    
    status: text("status").default("pendente"),
    notes: text("notes"),
    
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    processIdIdx: index("idx_fees_process_id").on(table.processId),
    clientIdIdx: index("idx_fees_client_id").on(table.clientId),
    statusIdx: index("idx_fees_status").on(table.status),
  })
);

export type AttorneyFee = typeof attorneyFees.$inferSelect;
export type InsertAttorneyFee = typeof attorneyFees.$inferInsert;

// 8. Referências Jurídicas e Jurisprudência (RAG)
export const legalReferences = sqliteTable(
  "legal_references",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    referenceType: text("referenceType").notNull(), // jurisprudencia, lei, sumula, etc
    title: text("title").notNull(),
    court: text("court"),
    number: text("number"),
    summary: text("summary"),
    fullText: text("fullText"),
    decisionDate: text("decisionDate"),
    keywords: text("keywords"), // JSON array
    category: text("category"),
    
    embedding: text("embedding"), // JSON array for vector search
    sourceUrl: text("sourceUrl"),
    sourceFilePath: text("sourceFilePath"),
    
    relevanceScore: real("relevanceScore"),
    usageCount: integer("usageCount").default(0),
    
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    typeIdx: index("idx_references_type").on(table.referenceType),
    courtIdx: index("idx_references_court").on(table.court),
    categoryIdx: index("idx_references_category").on(table.category),
  })
);

export type LegalReference = typeof legalReferences.$inferSelect;
export type InsertLegalReference = typeof legalReferences.$inferInsert;

// 9. Peças Processuais (Documentos do Processo)
export const legalProcessDocuments = sqliteTable(
  "legal_process_documents",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    processId: integer("processId")
      .notNull()
      .references(() => legalProcesses.id, { onDelete: "cascade" }),
    
    documentType: text("documentType").notNull(), // petição inicial, contestação, etc
    title: text("title").notNull(),
    phase: text("phase").notNull(), // inicial, instrutoria, etc
    instance: text("instance").notNull(), // 1ª instancia, etc
    
    filePath: text("filePath").notNull(),
    fileName: text("fileName").notNull(),
    fileSize: integer("fileSize"),
    mimeType: text("mimeType").default("application/pdf"),
    
    version: integer("version").default(1),
    parentDocumentId: integer("parentDocumentId").references((): any => legalProcessDocuments.id, { onDelete: "set null" }),
    
    protocolNumber: text("protocolNumber"),
    protocolDate: text("protocolDate"),
    
    status: text("status").default("rascunho"),
    author: text("author"),
    notes: text("notes"),
    
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    processIdIdx: index("idx_legal_docs_process_id").on(table.processId),
    typeIdx: index("idx_legal_docs_type").on(table.documentType),
  })
);

export type LegalProcessDocument = typeof legalProcessDocuments.$inferSelect;
export type InsertLegalProcessDocument = typeof legalProcessDocuments.$inferInsert;

// 10. Templates de Peças (Mockups)
export const petitionTemplates = sqliteTable(
  "petition_templates",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    category: text("category").notNull(),
    documentType: text("documentType").notNull(),
    templateContent: text("templateContent").notNull(), // HTML/Markdown
    
    description: text("description"),
    jurisdiction: text("jurisdiction"),
    courtType: text("courtType"),
    
    isActive: integer("isActive").default(1),
    usageCount: integer("usageCount").default(0),
    
    createdByUserId: integer("createdByUserId").references(() => users.id, { onDelete: "set null" }),
    createdAt: integer("createdAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
    updatedAt: integer("updatedAt", { mode: "timestamp_ms" })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    categoryIdx: index("idx_templates_category").on(table.category),
    typeIdx: index("idx_templates_type").on(table.documentType),
  })
);

export type PetitionTemplate = typeof petitionTemplates.$inferSelect;
export type InsertPetitionTemplate = typeof petitionTemplates.$inferInsert;
