
import { getDb } from "./server/db";
import { 
  legalClients, 
  legalProcesses, 
  legalDeadlines, 
  actionTypes, 
  legalHearings 
} from "./drizzle/schema";
import dotenv from "dotenv";

dotenv.config();

async function verifyLegalData() {
  console.log("--- Verificando Dados do Módulo Jurídico ---");
  const db = await getDb();
  if (!db) {
    console.error("Erro: Banco de dados não disponível");
    return;
  }

  try {
    const clients = await db.select().from(legalClients);
    console.log(`Clientes Jurídicos: ${clients.length}`);
    clients.forEach(c => console.log(`  - ${c.name} (${c.status})`));

    const processes = await db.select().from(legalProcesses);
    console.log(`Processos: ${processes.length}`);
    processes.forEach(p => console.log(`  - ${p.processNumber}: ${p.category}`));

    const deadlines = await db.select().from(legalDeadlines);
    console.log(`Prazos: ${deadlines.length}`);
    deadlines.forEach(d => console.log(`  - ${d.title} (Vencimento: ${d.dueDate})`));

    const actions = await db.select().from(actionTypes);
    console.log(`Tipos de Ação: ${actions.length}`);
    actions.forEach(a => console.log(`  - ${a.name}`));

    const hearings = await db.select().from(legalHearings);
    console.log(`Audiências: ${hearings.length}`);
    
  } catch (error) {
    console.error("Erro ao consultar tabelas:", error);
  }
}

verifyLegalData();
