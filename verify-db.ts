
import { getDb } from "./server/db";
import { sql } from "drizzle-orm";
import dotenv from "dotenv";

dotenv.config();

async function verifyDatabase() {
  console.log("Verificando tabelas no banco de dados...");
  try {
    const db = await getDb();
    if (!db) {
      console.error("Não foi possível conectar ao banco de dados.");
      return;
    }
    const result = await db.all(sql`SELECT name FROM sqlite_master WHERE type='table'`);
    console.log("Tabelas encontradas:");
    result.forEach((row: any) => console.log(`- ${row.name}`));

    const existingTables = new Set(result.map((row: any) => row.name));

    // Verificar tabelas do módulo jurídico com aliases de compatibilidade
    const legalTableChecks: Array<{ logicalName: string; acceptedNames: string[] }> = [
      { logicalName: "legal_clients", acceptedNames: ["legal_clients"] },
      { logicalName: "legal_processes", acceptedNames: ["legal_processes"] },
      { logicalName: "legal_deadlines", acceptedNames: ["legal_deadlines"] },
      { logicalName: "legal_hearings", acceptedNames: ["legal_hearings"] },
      {
        logicalName: "process_movements",
        acceptedNames: ["process_movements", "legal_process_movements"],
      },
      {
        logicalName: "attorney_fees",
        acceptedNames: ["attorney_fees", "legal_attorney_fees"],
      },
      {
        logicalName: "legal_process_documents",
        acceptedNames: ["legal_process_documents"],
      },
    ];

    console.log("\nVerificando tabelas do módulo jurídico:");
    const missingLogicalTables: string[] = [];

    for (const check of legalTableChecks) {
      const matched = check.acceptedNames.find(name => existingTables.has(name));
      const exists = Boolean(matched);

      if (!exists) {
        missingLogicalTables.push(check.logicalName);
      }

      console.log(
        `${check.logicalName}: ${exists ? `✅ EXISTE (${matched})` : `❌ NÃO ENCONTRADA (aceitas: ${check.acceptedNames.join(", ")})`}`
      );
    }

    if (missingLogicalTables.length > 0) {
      console.error(
        `\nFalha de consistência: tabelas obrigatórias ausentes -> ${missingLogicalTables.join(", ")}`
      );
      process.exitCode = 1;
      return;
    }

    console.log("\nValidação concluída: esquema jurídico consistente.");

  } catch (error) {
    console.error("Erro ao verificar banco de dados:", error);
    process.exitCode = 1;
  }
}

verifyDatabase();
