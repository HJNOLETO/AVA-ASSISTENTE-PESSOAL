import { getDb } from "./server/db";
import { users } from "./drizzle/schema";
import dotenv from "dotenv";

dotenv.config();

async function checkUsers() {
  const db = await getDb();
  if (!db) return;
  const allUsers = await db.select().from(users);
  console.log("Usuários:", JSON.stringify(allUsers, null, 2));
}

checkUsers();
