import Database from "better-sqlite3";
import dotenv from "dotenv";

dotenv.config();

const dbPath = process.env.DATABASE_URL?.replace(/^file:/, "") || "./sqlite.db";
console.log(`Updating database at ${dbPath}...`);

const db = new Database(dbPath);

const schema = [
  `CREATE TABLE IF NOT EXISTS customers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    document TEXT,
    address TEXT,
    notes TEXT,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    updatedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS appointments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    customerId INTEGER,
    title TEXT NOT NULL,
    description TEXT,
    startTime INTEGER NOT NULL,
    endTime INTEGER NOT NULL,
    status TEXT DEFAULT 'scheduled',
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (customerId) REFERENCES customers(id) ON DELETE SET NULL
  )`,
  `CREATE TABLE IF NOT EXISTS notes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    content TEXT NOT NULL,
    color TEXT DEFAULT '#ffff88',
    positionX INTEGER DEFAULT 0,
    positionY INTEGER DEFAULT 0,
    archived INTEGER DEFAULT 0,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS proactiveTasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL,
    schedule TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    lastRun INTEGER,
    nextRun INTEGER,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS passwordResetTokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expiresAt INTEGER NOT NULL,
    used INTEGER DEFAULT 0,
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS securityCards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    cardData TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    createdAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )`,
  `CREATE TABLE IF NOT EXISTS securityCardAttempts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER NOT NULL,
    positionsRequested TEXT NOT NULL,
    success INTEGER NOT NULL,
    ipAddress TEXT,
    attemptedAt INTEGER NOT NULL DEFAULT (strftime('%s', 'now') * 1000),
    FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
  )`
];

try {
  for (const sql of schema) {
    console.log(`Executing: ${sql.substring(0, 50)}...`);
    db.prepare(sql).run();
  }
  console.log("Database updated successfully!");
} catch (error) {
  console.error("Error updating database:", error);
  process.exit(1);
} finally {
  db.close();
}
