-- Schema SQL para AVA Assistant v3.1 (SQLite)
-- Este documento descreve a estrutura completa do banco de dados para suportar todas as funcionalidades obrigatórias.

-- 1. Tabela de Usuários (Autenticação e Autorização)
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    openId TEXT UNIQUE,
    name TEXT,
    email TEXT UNIQUE,
    password TEXT, -- Hash argon2/bcrypt
    role TEXT CHECK(role IN ('user', 'admin')) NOT NULL DEFAULT 'user',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastSignedIn TIMESTAMP
);

-- 2. Tabela de Clientes (Módulo de Cadastro de Clientes)
CREATE TABLE clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    document TEXT, -- CPF/CNPJ
    address TEXT,
    notes TEXT,
    status TEXT DEFAULT 'active',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Tabela de Agenda (Sistema de Compromissos)
CREATE TABLE appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    clientId INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    startTime TIMESTAMP NOT NULL,
    endTime TIMESTAMP NOT NULL,
    status TEXT CHECK(status IN ('scheduled', 'completed', 'cancelled')) DEFAULT 'scheduled',
    location TEXT,
    reminderSent INTEGER DEFAULT 0, -- Boolean (0/1)
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (clientId) REFERENCES clients(id) ON DELETE SET NULL
);

-- 4. Tabela de Post-its (Sistema de Notas Drag and Drop)
CREATE TABLE post_its (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    content TEXT,
    color TEXT DEFAULT '#ffff00', -- Hex code
    posX INTEGER DEFAULT 0,
    posY INTEGER DEFAULT 0,
    priority TEXT CHECK(priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
    category TEXT,
    alarmTime TIMESTAMP,
    isArchived INTEGER DEFAULT 0, -- Boolean
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Tabelas para RAG e Documentos
CREATE TABLE documents (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    size INTEGER NOT NULL,
    url TEXT,
    status TEXT CHECK(status IN ('processing', 'indexed', 'error')) DEFAULT 'processing',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE document_chunks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    documentId INTEGER NOT NULL,
    content TEXT NOT NULL,
    metadata TEXT, -- JSON
    embedding TEXT, -- Representação vetorial (JSON array)
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (documentId) REFERENCES documents(id) ON DELETE CASCADE
);

-- 6. Tabelas de Conversa (Chat)
CREATE TABLE conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    mode TEXT DEFAULT 'STANDARD',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversationId INTEGER NOT NULL,
    role TEXT CHECK(role IN ('user', 'assistant', 'system')) NOT NULL,
    content TEXT NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversationId) REFERENCES conversations(id) ON DELETE CASCADE
);

-- 7. Sistema de Auditoria e Logs (Painel Administrativo)
CREATE TABLE audit_logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    action TEXT NOT NULL, -- ex: 'FILE_EDIT', 'USER_LOGIN', 'CLIENT_DELETE'
    entityType TEXT, -- ex: 'document', 'user', 'client'
    entityId INTEGER,
    details TEXT, -- JSON com o diff ou informações extras
    ipAddress TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE SET NULL
);

-- 8. Gestão de Backups Automáticos
CREATE TABLE backups (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fileName TEXT NOT NULL,
    fileSize INTEGER NOT NULL,
    status TEXT CHECK(status IN ('success', 'failed')) NOT NULL,
    errorMessage TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices Otimizados
CREATE INDEX idx_appointments_userId_startTime ON appointments(userId, startTime);
CREATE INDEX idx_clients_userId ON clients(userId);
CREATE INDEX idx_post_its_userId ON post_its(userId);
CREATE INDEX idx_audit_logs_createdAt ON audit_logs(createdAt);
CREATE INDEX idx_document_chunks_documentId ON document_chunks(documentId);
