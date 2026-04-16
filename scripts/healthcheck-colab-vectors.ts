import "dotenv/config";
import path from "node:path";
import { promises as fs } from "node:fs";

const PROJECT_ROOT = process.cwd();
const DEFAULT_DATA_DIR = path.resolve(PROJECT_ROOT, "..", `${path.basename(PROJECT_ROOT)}-dados`);
const COLAB_IMPORT_DIR = path.join(DEFAULT_DATA_DIR, "Drive_Sync", "Importacao_Colab");

async function checkHealth() {
  console.log("==========================================");
  console.log("🔬 Validação de Saúde de Vetores do Colab");
  console.log("==========================================\n");
  
  await fs.mkdir(COLAB_IMPORT_DIR, { recursive: true });
  const files = await fs.readdir(COLAB_IMPORT_DIR);
  const jsonFiles = files.filter(f => f.endsWith(".json"));
  
  if (jsonFiles.length === 0) {
    console.log("Nenhum arquivo JSON pendente para avaliação na pasta de importação.");
    return;
  }
  
  let errorCount = 0;
  
  for (const fileName of jsonFiles) {
    const filePath = path.join(COLAB_IMPORT_DIR, fileName);
    let raw = "";
    try {
      raw = await fs.readFile(filePath, "utf-8");
    } catch {
       console.log(`[ERRO]: Não foi possível abrir o arquivo fisicamente ${fileName}. (Arquivo danificado)`);
       errorCount++;
       continue;
    }
    
    try {
       const data = JSON.parse(raw);
       let itemsToImport: any[] = Array.isArray(data) ? data : (data.items || []);
       
       if (itemsToImport.length === 0) {
          console.log(`[AVISO]: O arquivo '${fileName}' está em JSON válido, porém 100% vázio.`);
       } else {
          // Checar se a estrutura minima atende (se é um embedding real numerical)
          const firstEmb = itemsToImport[0].embedding;
          
          if (!Array.isArray(firstEmb) || (firstEmb.length > 0 && typeof firstEmb[0] !== 'number')) {
             console.log(`[ERRO]: Modelo de vetor ausente ou inválido em '${fileName}'. Isso destruirá o SQLite.`);
             errorCount++;
          } else {
             const dim = firstEmb.length;
             console.log(`[OK]: Arquivo '${fileName}' -> Íntegro. ${itemsToImport.length} blocos mapeados (Dimensionalidade de vetor: ${dim}).`);
          }
       }
    } catch (e: any) {
       console.log(`[CRÍTICO]: JSON corrompido em '${fileName}' -> Não conseguiu fechar chaves. O download via Drive provavelmente caiu no meio.`);
       errorCount++;
    }
  }
  
  console.log("\n==========================================");
  if (errorCount === 0) {
    console.log("✨ STATUS VERDE. TODOS OS ARQUIVOS APROVADOS PARA INJEÇÃO LOCAL.");
    console.log("👉 PRÓXIMO PASSO RÁPIDO: Rode 'pnpm rag:import-direct'");
  } else {
    console.log(`⚠️ ALERTA VERMELHO. Foram encontrados ${errorCount} erros nas amostras JSON.`);
    console.log("Delete os arquivos rotulados como [CRÍTICO] ou [ERRO] e baixe-os do Colab novamente.");
  }
}

checkHealth().catch(console.error);
