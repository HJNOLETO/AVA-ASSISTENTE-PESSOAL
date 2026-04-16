import "dotenv/config";
import { getDb } from "./server/db";
import { users, conversations } from "./drizzle/schema";

async function main() {
  const db = await getDb();
  if (!db) {
    console.error("Failed to connect to DB");
    return;
  }

  const allUsers = await db.select().from(users);
  console.log("Users:", allUsers);

  const allConversations = await db.select().from(conversations);
  console.log("Conversations:", allConversations);
}

main();
