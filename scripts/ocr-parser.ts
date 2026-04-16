import fs from 'fs';
import path from 'path';
import pdfParse from 'pdf-parse';

export async function processFileForRAG(filePath: string) {
  const ext = path.extname(filePath).toLowerCase();

  try {
    if (ext === '.pdf') {
      return await parsePdfNative(filePath);
    } else if (['.jpg', '.jpeg', '.png'].includes(ext)) {
      return await processImageGeneric(filePath);
    } else if (['.txt', '.md'].includes(ext)) {
      return fs.readFileSync(filePath, 'utf-8');
    } else {
      throw new Error(`Formato de arquivo não suportado: ${ext}`);
    }
  } catch (error) {
    console.error(`Erro ao processar ${filePath}:`, error);
    return null;
  }
}

async function parsePdfNative(filePath: string) {
  console.log(`⏳ Iniciando leitura profunda do PDF: ${path.basename(filePath)}...`);
  const dataBuffer = fs.readFileSync(filePath);
  
  const options = {
    // Opções de parse
    pagerender: function(pageData: any) {
      return pageData.getTextContent().then(function(textContent: any) {
        let lastY, text = '';
        for (let item of textContent.items) {
          if (lastY == item.transform[5] || !lastY) {
            text += item.str;
          } else {
            text += '\\n' + item.str;
          }
          lastY = item.transform[5];
        }
        return text;
      });
    }
  };

  const data = await pdfParse(dataBuffer, options);
  console.log(`✅ PDF Lido com sucesso. Páginas: ${data.numpages}`);
  return data.text;
}

async function processImageGeneric(filePath: string) {
  console.log(`⚠️ Tentativa de processar ${path.basename(filePath)} como imagem.`);
  // Implementação Tesseract ou LlamaVision virão aqui caso ativados no package.json.
  // Por enquanto, retorna string vazia ou envia requisição Vision pro LLM/Localhost:11434.
  return `[CONTEÚDO DE IMAGEM NÃO PROCESSADO AINDA. REQUER MOTOR DE VISÃO (TESSERACT/LLAMA).]`;
}

// Quando rodado diretamente da CLI
if (process.argv[1] === new URL(import.meta.url).pathname || process.argv[1] === __filename) {
  const fileToTest = process.argv[2];
  if (fileToTest) {
    processFileForRAG(fileToTest).then(text => {
      console.log('\\n================\\nESBOÇO DO TEXTO:\\n================\\n');
      console.log(text?.slice(0, 500) + '...');
    });
  } else {
    console.log("Uso: pnpm tsx scripts/ocr-parser.ts <caminho_do_arquivo>");
  }
}
