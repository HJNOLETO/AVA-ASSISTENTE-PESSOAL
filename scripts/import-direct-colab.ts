import "dotenv/config";
import path from "node:path";
import { promises as fs } from "node:fs";
import { users, memoryEntries } from "../drizzle/schema";
import { getDb } from "../server/db";
import { asc } from "drizzle-orm";

const PROJECT_ROOT = process.cwd();
const DEFAULT_DATA_DIR = path.resolve(PROJECT_ROOT, "..", `${path.basename(PROJECT_ROOT)}-dados`);
const COLAB_IMPORT_DIR = path.join(DEFAULT_DATA_DIR, "Drive_Sync", "Importacao_Colab");
const IMPORTED_DIR = path.join(COLAB_IMPORT_DIR, "Concluidos");

async function runDirectImport() {
  console.log("🚀 Iniciando injeção expressa de vetores do Colab...");
  
  await fs.mkdir(COLAB_IMPORT_DIR, { recursive: true });
  await fs.mkdir(IMPORTED_DIR, { recursive: true });
  
  const files = await fs.readdir(COLAB_IMPORT_DIR);
  const jsonFiles = files.filter(f => f.endsWith(".json"));
  
  if (jsonFiles.length === 0) {
    console.log("⚠️ Nenhum arquivo .json encontrado na pasta de importação direta.");
    console.log(`Sempre arraste seus exports do Colab para:\n -> ${COLAB_IMPORT_DIR}`);
    return;
  }

  const db = await getDb();
  if (!db) throw new Error("Banco de dados SQLite indisponível.");
  
  const first = await db.select().from(users).orderBy(asc(users.id)).limit(1);
  const userId = first[0]?.id;
  if (!userId) throw new Error("Nenhum usuário no banco local.");
  
  let totalImported = 0;
  
  for (const fileName of jsonFiles) {
    const filePath = path.join(COLAB_IMPORT_DIR, fileName);
    console.log(`\nProcessando: ${fileName}...`);
    
    try {
      const raw = await fs.readFile(filePath, "utf-8");
      
      let data: any;
      try {
        data = JSON.parse(raw);
      } catch (err) {
        console.error(`❌ O arquivo ${fileName} não é um JSON válido. Excluído do processamento nesta tentativa.`);
        continue;
      }
      
      // Flexibilidade de leitura (suporta lista chata ou obj do RAG pipeline)
      let itemsToImport: any[] = Array.isArray(data) ? data : (data.items || []);
      
      if (itemsToImport.length === 0) {
        console.warn(`  -> Vazio ou fora do formato. Arquivo ignorado.`);
        continue;
      }

      console.log(`  -> Lendo ${itemsToImport.length} blocos com Embeddings Matemáticos nativos...`);
      let inserted = 0;
      
      for (const item of itemsToImport) {
        if (!item || !item.content || !Array.isArray(item.embedding) || item.embedding.length < 5) {
          continue; // Pula chunks quebrados sem matrizes puras
        }

        const sourcePath = item.sourcePath || item.filename || fileName;
        
        // Estrutura texto pro RAG saber de onde puxou
        const memoryText = [
          `[COLAB_INJECAO_DIRETA] Fonte: ${sourcePath}`,
          item.chunkIndex !== undefined ? `Chunk: ${item.chunkIndex}` : '',
          `Conteudo: ${item.content}`,
        ].filter(Boolean).join("\n");
        
        // Tentar preservar categoria baseando-se no nome do arquivo (ex: "Direito_Penal" invés de "Direito_Penal.json")
        const fallbackKeyword = sourcePath.replace(/\.[^/.]+$/, "").split("/").slice(-1)[0];
        
        // Disparo direto via comando SQL contínuo (Bypassa chamadas repetitivas locais da CLI de Embeddings)
        await db.insert(memoryEntries).values({
          userId,
          content: memoryText,
          keywords: typeof item.keywords === 'string' ? item.keywords : fallbackKeyword,
          embedding: JSON.stringify(item.embedding), // salva float array cru no json SQLite
          type: "context",
        });
        
        inserted++;
        totalImported++;
      }
      
      console.log(`  ✅ Concluído. ${inserted} vetores transferidos instantaneamente.`);
      
      // Movimenta o processado para pasta estática afim de não re-processar no segundo loop natural do pipeline
      const destPath = path.join(IMPORTED_DIR, fileName);
      await fs.rename(filePath, destPath);
      console.log(`  -> Limpando fila: Movido para subpasta 'Concluidos'.`);
      
    } catch (e: any) {
      console.error(`❌ Falha sistêmica ao ler ${fileName}:`, e.message);
    }
  }
  
  console.log(`\n🎉 Operação Suprema Finalizada! O AVA Local engoliu ${totalImported} novos nós de conhecimento intelectuais gerados e gastos diretamente na nuvem (Colab).`);
}

runDirectImport().catch(console.error);
