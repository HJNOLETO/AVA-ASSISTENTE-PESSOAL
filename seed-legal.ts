import { getDb } from "./server/db";
import { 
  legalClients, 
  legalProcesses, 
  legalDeadlines, 
  actionTypes,
  users 
} from "./drizzle/schema";
import dotenv from "dotenv";

dotenv.config();

async function seedLegal() {
  const db = await getDb();
  if (!db) return;

  const userId = 1; // Local Guest

  console.log("Semeando dados jurídicos para o usuário 1...");

  try {
    // 1. Tipos de Ação
    const [actionType] = await db.insert(actionTypes).values({
      code: "PREV_APOSENTADORIA",
      name: "Aposentadoria por Tempo de Contribuição",
      category: "previdenciario",
      jurisdiction: "federal",
      courtType: "federal",
      description: "Ação para concessão de aposentadoria previdenciária"
    }).onConflictDoNothing().returning();

    const actionTypeId = actionType?.id || 1;

    // 2. Cliente
    const [client] = await db.insert(legalClients).values({
      userId,
      name: "João da Silva",
      cpf: "123.456.789-00",
      phone: "(11) 99999-9999",
      addressCity: "São Paulo",
      status: "ativo"
    }).onConflictDoNothing().returning();

    const clientId = client?.id || 1;

    // 3. Processo
    const [process] = await db.insert(legalProcesses).values({
      userId,
      clientId,
      processNumber: "5000123-45.2024.4.03.6100",
      actionTypeId,
      category: "previdenciario",
      jurisdiction: "federal",
      courtType: "federal",
      status: "em andamento",
      entryDate: "2024-01-15",
      courtName: "1ª Vara Federal de São Paulo",
      priority: "normal"
    }).onConflictDoNothing().returning();

    const processId = process?.id || 1;

    // 4. Prazos
    await db.insert(legalDeadlines).values([
      {
        processId,
        title: "Réplica à Contestação",
        deadlineType: "judicial",
        startDate: "2024-02-01",
        dueDate: "2024-02-15",
        status: "pendente",
        assignedToUserId: userId
      },
      {
        processId,
        title: "Juntada de Documentos",
        deadlineType: "administrativo",
        startDate: "2024-02-05",
        dueDate: "2024-02-20",
        status: "pendente",
        assignedToUserId: userId
      }
    ]).onConflictDoNothing();

    console.log("✅ Dados jurídicos semeados com sucesso!");
  } catch (error) {
    console.error("Erro ao semear dados:", error);
  }
}

seedLegal();
