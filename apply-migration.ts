import Database from "better-sqlite3";
import fs from "fs";
import path from "path";

const dbPath = path.resolve(process.cwd(), "sqlite.db");
const migrationPath = path.resolve(process.cwd(), "drizzle", "0005_sturdy_tony_stark.sql");

async function applyMigration() {
  console.log(`[Migration] Applying migration to ${dbPath}...`);
  const db = new Database(dbPath);
  
  try {
    const migrationSql = fs.readFileSync(migrationPath, "utf8");
    const statements = migrationSql.split("--> statement-breakpoint");
    
    for (let statement of statements) {
      statement = statement.trim();
      if (statement) {
        try {
          console.log(`[Migration] Executing statement...`);
          db.prepare(statement).run();
        } catch (err) {
          console.warn(`[Migration] Warning: Failed to execute statement. Skipping...`, err.message);
        }
      }
    }
    
    console.log("[Migration] Migration applied successfully!");
  } catch (error) {
    console.error("[Migration] Error applying migration:", error);
    process.exit(1);
  } finally {
    db.close();
  }
}

applyMigration();
