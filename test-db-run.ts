
import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";
import fs from "fs";

async function test() {
  const dbPath = "./test.db";
  if (fs.existsSync(dbPath)) fs.unlinkSync(dbPath);
  
  const sqlite = new Database(dbPath);
  const db = drizzle(sqlite);

  console.log("DB created");
  
  try {
    // Try calling run on drizzle instance
    if ((db as any).run) {
        console.log("db.run exists");
        await (db as any).run("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY)");
    } else {
        console.log("db.run does not exist on drizzle instance");
    }
  } catch (e) {
    console.error("Error calling db.run:", e);
  }

  try {
      // Try calling run on sqlite instance
      console.log("Calling sqlite.exec");
      sqlite.exec("CREATE TABLE IF NOT EXISTS test (id INTEGER PRIMARY KEY)");
      console.log("sqlite.exec success");
  } catch(e) {
      console.error("Error calling sqlite.exec:", e);
  }
}

test();
