const Database = require("better-sqlite3");
const db = new Database("./sqlite_v2.db");

// Verificar tabelas do Mentor Socrático
const tables = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' AND name IN ('learning_modules','user_learning_progress')
`).all();
console.log("Tabelas encontradas:", JSON.stringify(tables));

// Criar as tabelas se não existirem (migration manual para SQLite direto)
db.prepare(`
  CREATE TABLE IF NOT EXISTS learning_modules (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    subject TEXT NOT NULL,
    sourceReference TEXT,
    sourceType TEXT DEFAULT 'manual',
    description TEXT,
    status TEXT DEFAULT 'active',
    totalTopics INTEGER DEFAULT 0,
    masteredTopics INTEGER DEFAULT 0,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
  )
`).run();

db.prepare(`
  CREATE TABLE IF NOT EXISTS user_learning_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    moduleId INTEGER REFERENCES learning_modules(id) ON DELETE CASCADE,
    topic TEXT NOT NULL,
    masteryLevel INTEGER DEFAULT 0,
    strengths TEXT,
    weaknesses TEXT,
    correctAnswers INTEGER DEFAULT 0,
    incorrectAnswers INTEGER DEFAULT 0,
    lastReviewed INTEGER,
    nextReviewDate INTEGER,
    status TEXT DEFAULT 'learning',
    feynmanUnlocked INTEGER DEFAULT 0,
    createdAt INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (unixepoch('now') * 1000)
  )
`).run();

const tablesAfter = db.prepare(`
  SELECT name FROM sqlite_master 
  WHERE type='table' AND name IN ('learning_modules','user_learning_progress')
`).all();
console.log("Tabelas após migration:", JSON.stringify(tablesAfter));

// Criar a pasta teacher_sources se não existir
const fs = require("fs");
const path = require("path");
const teacherDir = path.join(__dirname, "data", "teacher_sources");
if (!fs.existsSync(teacherDir)) {
  fs.mkdirSync(teacherDir, { recursive: true });
  console.log("Pasta criada:", teacherDir);
} else {
  console.log("Pasta já existe:", teacherDir);
}

db.close();
console.log("Migration concluída com sucesso!");
