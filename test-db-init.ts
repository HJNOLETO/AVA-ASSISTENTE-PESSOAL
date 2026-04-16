
import "dotenv/config";
import { getDb } from "./server/db";

async function main() {
  console.log("Testing DB initialization...");
  try {
    const db = await getDb();
    if (db) {
      console.log("DB initialized successfully.");
    } else {
      console.log("DB returned null.");
    }
  } catch (error) {
    console.error("Error during DB initialization:", error);
  }
}

main();
