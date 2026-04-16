import "dotenv/config";
import path from "node:path";
import * as xlsx from "xlsx";
import { getDb } from "../server/db";
import { memoryEntries } from "../drizzle/schema";
import { desc } from "drizzle-orm";

const PROJECT_ROOT = process.cwd();
const REPORT_OUTPUT_PATH = path.resolve(PROJECT_ROOT, "..", `${path.basename(PROJECT_ROOT)}-dados`, "Conteudo_Real_Banco_AVA.xlsx");

async function exportMemoryToExcel() {
  console.log("Conectando ao banco de dados SQLite local...");
  const db = await getDb();
  if (!db) throw new Error("Banco de dados indisponível.");

  console.log("Lendo todas as memórias do banco...");
  const memories = await db.select().from(memoryEntries).orderBy(desc(memoryEntries.createdAt));
  
  if (memories.length === 0) {
    console.log("Nenhuma memória encontrada no banco de dados.");
    return;
  }

  const reportData = memories.map(mem => ({
    "ID (Banco)": mem.id,
    "Data Adição": mem.createdAt.toLocaleString("pt-BR"),
    "Tags / Assuntos": mem.keywords || "",
    "Conteúdo Texto Mapeado": mem.content.length > 500 ? mem.content.substring(0, 500) + "..." : mem.content, 
    "Tamanho Real Caracteres": mem.content.length,
    "Gerou Vetor Matematico?": mem.embedding ? "SIM" : "NÃO",
    "Tipo Ingestão": mem.type
  }));

  console.log(`Empacotando ${reportData.length} blocos guardados na memória do assistente...`);
  
  const wb = xlsx.utils.book_new();
  const ws = xlsx.utils.json_to_sheet(reportData);
  
  const colWidths = [
    { wch: 10 }, // ID
    { wch: 22 }, // Data
    { wch: 40 }, // Keywords/Assuntos
    { wch: 120 }, // Conteudo limite 500chars
    { wch: 25 }, // Tamanho Real
    { wch: 25 }, // Gerou Vetor
    { wch: 18 }, // Tipo 
  ];
  ws["!cols"] = colWidths;
  
  xlsx.utils.book_append_sheet(wb, ws, "Base Ativa - RAG");
  xlsx.writeFile(wb, REPORT_OUTPUT_PATH);
  
  console.log(`✅ O Banco de dados cru foi extraído em 100% como Planilha Microsoft/LibreOffice.`);
  console.log(`👉 Acesse a planilha em: ${REPORT_OUTPUT_PATH}`);
}

exportMemoryToExcel().catch(console.error);
