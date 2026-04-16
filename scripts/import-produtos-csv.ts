import * as fs from "fs";
import * as path from "path";
import { upsertProduct, getDb } from "../server/db";
import { config } from "dotenv";

async function main() {
    config(); // Carrega o .env
    if (!process.env.DATABASE_URL) process.env.DATABASE_URL = "file:./sqlite_v2.db"; 
    await getDb();
    const csvPath = process.argv[2];
    if (!csvPath || !fs.existsSync(csvPath)) {
        console.error("Uso: npx tsx scripts/import-produtos-csv.ts <caminho_para_csv>");
        process.exit(1);
    }

    console.log(`Lendo arquivo: ${csvPath}`);
    const fileContent = fs.readFileSync(csvPath, "utf-8");
    
    const linhas = fileContent.split(/\r?\n/).filter(L => L.trim().length > 0);
    
    let processados = 0;
    const batchSize = 50; // como não é transação nativa de db.insert array, faremos promisses
    let batch: any[] = [];
    
    for (let i = 1; i < linhas.length; i++) {
        const linha = linhas[i];
        
        const colunas = linha.split('";"').map(c => c.replace(/(^"|"$)/g, ''));
        
        if (colunas.length < 11) continue;
        
        const referenceId = colunas[0]?.trim();
        const name = colunas[2]?.trim();
        const unit = colunas[3]?.trim();
        const priceStr = colunas[6]?.trim().replace(/\./g, "").replace(",", ".");
        const parsedPrice = Number.parseFloat(priceStr || "0");
        const price = Number.isFinite(parsedPrice)
            ? Number(parsedPrice.toFixed(2))
            : 0;
        const status = colunas[9]?.trim();
        const stock = parseInt(colunas[10]?.trim() || "0", 10);
        
        if (!referenceId || !name) continue;
        
        batch.push({
            referenceId,
            name,
            description: "",
            price,
            stock,
            unit,
            status
        });
        
        if (batch.length >= batchSize) {
            await insertBatch(batch);
            processados += batch.length;
            batch = [];
        }
    }
    
    if (batch.length > 0) {
        await insertBatch(batch);
        processados += batch.length;
    }
    
    console.log(`\nImportação concluída! Total processado: ${processados}`);
}

async function insertBatch(batch: any[]) {
    console.log(`Inserindo lote de ${batch.length}...`);
    try {
        await Promise.all(batch.map(item => upsertProduct(item)));
    } catch(err: any) {
        console.error("Erro inserindo batch:", err.message);
    }
}

main().catch(console.error);
