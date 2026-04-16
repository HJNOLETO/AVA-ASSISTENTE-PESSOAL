import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const INPUT_DIR = 'C:\\\\Users\\\\hijon\\\\Downloads\\\\ava-assistant-30-03-26\\\\ava-assistant-v3-main-dados\\\\exemplos\\\\roberto-papeis\\\\produtos';
const OUTPUT_DIR = 'C:\\\\Users\\\\hijon\\\\Downloads\\\\ava-assistant-30-03-26\\\\ava-assistant-v3-main-dados\\\\Drive_Sync\\\\Roberto_Papeis_Catalogo';
const PRODUCTS_PER_FILE = 50;

if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

async function processFile(filePath, fileIndex) {
  console.log(`⏳ Lendo arquivo: ${path.basename(filePath)}...`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  const lines = content.replace(/\r\n/g, '\n').split('\n').filter(l => l.trim() !== '');
  if (lines.length < 2) return;
  
  const headers = lines[0].split(';').map(h => h.replace(/^"|"$/g, '').trim());
  const products = [];

  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
    if (values.length < Math.min(headers.length, 5)) continue; 
    
    const record = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j] || '';
    }
    products.push(record);
  }

  console.log(`✅ ${products.length} produtos em ${path.basename(filePath)}.`);
  
  let fileCounter = 1;
  let currentFileContent = `# Catálogo Base - Parte ${fileCounter} (Arquivo ${fileIndex})\n\n`;
  let currentProductCount = 0;

  for (const prod of products) {
    const semanticBlock = `
## Produto: ${prod['Descrição'] || 'Sem Nome'}
**Referência Interna (ID):** ${prod['ID'] || 'Sem ID'}
**Código de Barras:** ${prod['Código'] || prod['Cód. no fornecedor'] || 'N/A'}
**Unidade Comercial:** ${prod['Unidade'] || 'N/A'}
**Preço Atual:** R$ ${prod['Preço'] || '0,00'}
**Status:** ${prod['Situação'] || 'N/A'}
**Estoque:** ${prod['Estoque'] || '0'}
**NCM:** ${prod['NCM'] || 'Geral'}
`;
    currentFileContent += semanticBlock + '\n---\n';
    currentProductCount++;

    if (currentProductCount >= PRODUCTS_PER_FILE) {
      const outFile = path.join(OUTPUT_DIR, `catalogo_arquivo_${fileIndex}_parte_${fileCounter}.md`);
      fs.writeFileSync(outFile, currentFileContent, 'utf8');
      
      currentProductCount = 0;
      fileCounter++;
      currentFileContent = `# Catálogo Base - Parte ${fileCounter} (Arquivo ${fileIndex})\n\n`;
    }
  }

  if (currentProductCount > 0) {
    const outFile = path.join(OUTPUT_DIR, `catalogo_arquivo_${fileIndex}_parte_${fileCounter}.md`);
    fs.writeFileSync(outFile, currentFileContent, 'utf8');
  }
}

async function run() {
  console.log("🚀 Iniciando Otimização do Catálogo (Roberto Papéis)...");
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`❌ Pasta não encontrada: ${INPUT_DIR}`);
    return;
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.toLowerCase().endsWith('.csv'));
  for (let i = 0; i < files.length; i++) {
    await processFile(path.join(INPUT_DIR, files[i]), i + 1);
  }
  console.log(`🎉 CONCLUÍDO! Salvos em: ${OUTPUT_DIR}`);
}

run().catch(console.error);
