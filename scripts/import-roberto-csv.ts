import fs from 'fs';
import path from 'path';


// Pastas
const INPUT_DIR = 'C:\\Users\\hijon\\Downloads\\ava-assistant-30-03-26\\ava-assistant-v3-main-dados\\exemplos\\roberto-papeis\\produtos';
const OUTPUT_DIR = 'C:\\Users\\hijon\\Downloads\\ava-assistant-30-03-26\\ava-assistant-v3-main-dados\\Drive_Sync\\Roberto_Papeis\\Catalogo';

// Cria pasta de destino se não existir
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// Configurações
const PRODUCTS_PER_FILE = 100;

interface ProductRecord {
  ID: string;
  'Código': string;
  'Descrição': string;
  'Unidade': string;
  'NCM': string;
  'Origem': string;
  'Preço': string;
  'Valor IPI fixo': string;
  'Observações': string;
  'Situação': string;
  'Estoque': string;
  'Preço de custo': string;
  'Fornecedor': string;
  'Categoria do produto': string;
  [key: string]: string; // Para outras chaves caso precisemos
}

async function processFile(filePath: string, fileIndex: number) {
  console.log(`\\n⏳ Lendo arquivo: ${path.basename(filePath)}...`);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Trata quebras de linha irregulares e separa por linhas principais
  const lines = content.replace(/\\r\\n/g, '\\n').split('\\n').filter(l => l.trim() !== '');
  
  if (lines.length < 2) return;
  
  // Puxa cabeçalhos da linha 1 (removendo aspas duplas)
  const headers = lines[0].split(';').map(h => h.replace(/^"|"$/g, '').trim());
  const products: ProductRecord[] = [];

  for (let i = 1; i < lines.length; i++) {
    // Regex para dividir por ; ignorando os ; dentro de aspas duplas
    const values = lines[i].split(/;(?=(?:(?:[^"]*"){2})*[^"]*$)/).map(v => v.replace(/^"|"$/g, '').trim());
    
    if (values.length < Math.min(headers.length, 5)) continue; // Evita linhas zumbis
    
    const record: any = {};
    for (let j = 0; j < headers.length; j++) {
      record[headers[j]] = values[j] || '';
    }
    products.push(record as ProductRecord);
  }

  console.log(`✅ ${products.length} produtos lidos em ${path.basename(filePath)}.`);
  
  let fileCounter = 1;
  let currentFileContent = `# Catálogo Base - Parte ${fileCounter} (Arquivo ${fileIndex})\\n\\n`;
  let currentProductCount = 0;

  for (const prod of products) {
    const semanticBlock = `
## Produto: ${prod['Descrição'] || 'Sem Nome'}
**Referência Interna (ID):** ${prod['ID'] || 'Sem ID'}
**Código de Barras/Fornecedor:** ${prod['Código'] || prod['Cód. no fornecedor'] || 'N/A'}
**Unidade Comercial:** ${prod['Unidade'] || 'N/A'}
**Preço de Venda Atual:** R$ ${prod['Preço'] || '0,00'}
**Status de Comercialização:** ${prod['Situação'] || 'N/A'}
**Estoque Atual:** ${prod['Estoque'] || '0'} (unidade)
**Fornecedor Primário:** ${prod['Fornecedor'] || 'Fabricação Própria ou Sem Identificação'}
**Categoria/NCM:** ${prod['Categoria do produto'] || 'Geral'} / ${prod['NCM'] || 'Geral'}
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
  console.log("🚀 Iniciando Otimização Semântica do Catálogo (Roberto Papéis) para RAG...");
  
  if (!fs.existsSync(INPUT_DIR)) {
    console.error(`❌ Pasta de entrada não encontrada: ${INPUT_DIR}`);
    return;
  }

  const files = fs.readdirSync(INPUT_DIR).filter(f => f.toLowerCase().endsWith('.csv'));
  
  if (files.length === 0) {
    console.log("⚠️ Nenhum arquivo .csv encontrado na pasta de origem!");
    return;
  }

  for (let i = 0; i < files.length; i++) {
    const fullPath = path.join(INPUT_DIR, files[i]);
    await processFile(fullPath, i + 1);
  }

  console.log(`\n🎉 SUCESSO! A planilha foi explodida e os artefatos de hiper-contexto foram salvos em: ${OUTPUT_DIR}\nBasta rodar a integração RAG na pasta Drive_Sync.`);
}

run().catch(console.error);
