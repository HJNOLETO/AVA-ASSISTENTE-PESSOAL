import "dotenv/config";
import { getDb } from "../db";
import { users } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  console.log("🚀 Iniciando seed de administrador...");

  const adminEmail = "admin@ava.assistant";
  const database = await getDb();

  if (!database) {
    console.error("❌ Erro: Banco de dados não disponível");
    process.exit(1);
  }

  try {
    // Verificar se o admin já existe
    const existingAdmin = await database
      .select()
      .from(users)
      .where(eq(users.email, adminEmail))
      .limit(1);

    if (existingAdmin && existingAdmin.length > 0) {
      console.log("ℹ️ Administrador já existe no banco de dados.");

      // Atualizar para garantir que tenha a role admin
      await database
        .update(users)
        .set({ role: "admin" })
        .where(eq(users.id, existingAdmin[0].id));

      console.log("✅ Role de administrador confirmada.");
    } else {
      // Criar novo administrador
      await database.insert(users).values({
        email: adminEmail,
        name: "AVA Admin",
        openId: "admin-openid-001",
        loginMethod: "manus",
        role: "admin",
      });

      console.log("✅ Administrador criado com sucesso!");
    }
  } catch (error) {
    console.error("❌ Erro ao realizar seed:", error);
    process.exit(1);
  }

  console.log("✨ Seed finalizado.");
  process.exit(0);
}

seedAdmin();
