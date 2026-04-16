import "dotenv/config";
import path from "node:path";
import { createHash } from "node:crypto";
import { promises as fs } from "node:fs";
import * as xlsx from "xlsx";

const PROJECT_ROOT = process.cwd();
const DEFAULT_DATA_DIR = path.resolve(PROJECT_ROOT, "..", `${path.basename(PROJECT_ROOT)}-dados`);
const DRIVE_SYNC_DIR = path.join(DEFAULT_DATA_DIR, "Drive_Sync");
const MANIFEST_PATH = path.join(DEFAULT_DATA_DIR, ".rag", "memory-pipeline", "manifest.json");
const REPORT_OUTPUT_PATH = path.join(DEFAULT_DATA_DIR, "Relatorio_Memoria_AVA.xlsx");

const SUPPORTED_EXTENSIONS = new Set([".md", ".txt", ".pdf"]);

type PipelineFileState = {
  sourcePath: string;
  fileHash: string;
  outputFile: string;
  totalChunks: number;
  embeddedChunks: number;
  importedChunks: number;
  status: "pending" | "partial" | "embedded" | "imported" | "failed";
  updatedAt: string;
};

type Manifest = { version: string; files: Record<string, PipelineFileState> };

function sha256(buffer: Buffer): string {
  return createHash("sha256").update(buffer).digest("hex");
}

function toPosix(p: string): string {
  return p.replace(/\\/g, "/");
}

async function listFilesRecursive(rootDir: string): Promise<string[]> {
  const out: string[] = [];
  try {
    const stack = [rootDir];
    while (stack.length > 0) {
      const current = stack.pop()!;
      const entries = await fs.readdir(current, { withFileTypes: true }).catch(() => []);
      for (const entry of entries) {
        const fullPath = path.join(current, entry.name);
        if (entry.isDirectory()) {
          stack.push(fullPath);
        } else {
          const ext = path.extname(entry.name).toLowerCase();
          if (SUPPORTED_EXTENSIONS.has(ext)) {
            out.push(fullPath);
          }
        }
      }
    }
  } catch (e) {
    console.warn("Pasta raiz não encontrada ou sem permissão:", rootDir);
  }
  return out;
}

async function loadManifest(filePath: string): Promise<Manifest> {
  try {
    const raw = await fs.readFile(filePath, "utf-8");
    return JSON.parse(raw) as Manifest;
  } catch {
    return { version: "1.0", files: {} };
  }
}

async function runAudit() {
  console.log("==========================================");
  console.log("Iniciando auditoria da base de conhecimento...");
  console.log("Pasta de Origem (Drive_Sync):", DRIVE_SYNC_DIR);
  
  const manifest = await loadManifest(MANIFEST_PATH);
  const files = await listFilesRecursive(DRIVE_SYNC_DIR);
  
  const reportData: any[] = [];
  const hashTracker = new Map<string, string[]>(); // hash -> paths array
  
  console.log(`Analisando fisicamente ${files.length} arquivos suportados...`);
  
  for (const filePath of files) {
    const relativePath = toPosix(path.relative(DRIVE_SYNC_DIR, filePath));
    // Dividir as pastas para detectar a taxonomia
    const parts = relativePath.split("/");
    let nivel1 = "N/A";
    let nivel2 = "N/A";
    let fileName = relativePath;
    
    if (parts.length > 1) {
      nivel1 = parts[0];
      if (parts.length > 2) {
        nivel2 = parts[1];
        fileName = parts.slice(2).join("/"); // se tiver mais níveis, junta tudo aqui
      } else {
        fileName = parts[1];
      }
    }
    
    // Ler dados do arquivo real
    const stat = await fs.stat(filePath).catch(() => ({ size: 0 }));
    const sizeKB = (stat.size / 1024).toFixed(2);
    
    // Opcional: Gerar hash para identificar exatas duplicações de conteúdo (ignora metadata/nome)
    let hash = "";
    try {
      const buffer = await fs.readFile(filePath);
      hash = sha256(buffer);
      if (!hashTracker.has(hash)) {
        hashTracker.set(hash, [relativePath]);
      } else {
        hashTracker.get(hash)!.push(relativePath);
      }
    } catch {
      hash = "ERRO_LEITURA";
    }
    
    // Buscar no manifest do DB (pipeline local)
    // O pipeline atual roda padrão em "conhecimentos-sobre-AVA", o que faz o relativePath no manifest não ter o root folder
    let pipelineState = manifest.files[relativePath];
    if (!pipelineState) {
        // Fallback: ver se o arquivo foi indexado partindo de 'conhecimentos-sobre-AVA' 
        const altRelative = toPosix(path.relative(path.join(DRIVE_SYNC_DIR, "conhecimentos-sobre-AVA"), filePath));
        pipelineState = manifest.files[altRelative];
    }
    
    const dbStatus = pipelineState ? pipelineState.status : "NÃO PROCESSADO";
    const chunks = pipelineState ? pipelineState.totalChunks : 0;
    const imported = pipelineState ? pipelineState.importedChunks : 0;
    
    reportData.push({
      "Status (Memória)": dbStatus,
      "Nível 1 (Categoria)": nivel1,
      "Nível 2 (Sub-tema)": nivel2,
      "Arquivo/Dado": fileName,
      "Tamanho (KB)": parseFloat(sizeKB),
      "Fragmentos Lidos": chunks,
      "Fragmentos no DB": imported,
      "Caminho Relativo (Manifest)": pipelineState?.sourcePath || relativePath,
      "Hash ID": hash.substring(0, 10),
      "Risco de Duplicidade": "Calculando...", // calculado depois
      "Última Atualização no Banco": pipelineState ? new Date(pipelineState.updatedAt).toLocaleString("pt-BR") : "Nunca",
    });
  }
  
  // Segundo loop para setar marcações de duplicata definitiva
  for (const row of reportData) {
    const h = reportData.find(r => r["Arquivo/Dado"] === row["Arquivo/Dado"])?.["Hash ID"] || row["Hash ID"];
    const copies = hashTracker.get(h) || [];
    row["Risco de Duplicidade"] = copies.length > 1 ? `⚠️ SIM (${copies.length} arquivos c/ info exata)` : "Livre";
  }
  
  if (reportData.length === 0) {
    console.warn("Nenhum arquivo ou dado encontrado no Drive_Sync para auditar.");
  } else {
    // Gerar a estrutura XLSX
    console.log("Gerando arquivo Excel com formatação estruturada...");
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(reportData);
    
    const colWidths = [
      { wch: 18 }, // Status
      { wch: 25 }, // Categoria
      { wch: 25 }, // Subtema
      { wch: 45 }, // Nome
      { wch: 15 }, // Tamanho
      { wch: 18 }, // Chunks
      { wch: 18 }, // DB
      { wch: 40 }, // Manifest Path
      { wch: 12 }, // Hash
      { wch: 30 }, // Duplicidade
      { wch: 22 }, // Date
    ];
    ws["!cols"] = colWidths;
    
    xlsx.utils.book_append_sheet(wb, ws, "Auditoria Memória");
    xlsx.writeFile(wb, REPORT_OUTPUT_PATH);
    
    console.log(`\n✅ Relatório Excel salvo com sucesso em: \n   --> ${REPORT_OUTPUT_PATH}`);
    console.log("\nProcesso Finalizado!");
  }
}

runAudit().catch(e => {
  console.error("Erro fatal durante a auditoria:", e);
});
