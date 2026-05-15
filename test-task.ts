import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

import { getDb, createProactiveTask } from "./server/db.js";

async function run() {
  await getDb();
  const res = await createProactiveTask(1, {
    title: 'Teste Daemon Proativo',
    description: 'Por favor envie uma mensagem proativa parabenizando por testar o nível 4 de autonomia!',
    type: 'watcher',
    status: 'active',
    nextRun: new Date(Date.now() - 60000)
  });
  console.log("Criado task id:", res.id);
  process.exit(0);
}
run().catch(console.error);
