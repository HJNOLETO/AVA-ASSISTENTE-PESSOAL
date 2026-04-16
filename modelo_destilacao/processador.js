const fs = require('fs');
const path = require('path');

// CONFIGURAÇÕES
const PASTA_ENTRADA = path.join(__dirname, 'entrada');
const PASTA_SAIDA = path.join(__dirname, 'saida');
const MODELO_OLLAMA = 'llama3'; // Certifique-se de ter este modelo (ou mude para 'mistral', 'qwen', etc)
const OLLAMA_URL = 'http://localhost:11434/api/generate';

// Garante que as pastas existem
if (!fs.existsSync(PASTA_ENTRADA)) fs.mkdirSync(PASTA_ENTRADA);
if (!fs.existsSync(PASTA_SAIDA)) fs.mkdirSync(PASTA_SAIDA);

async function processarArquivo(arquivo) {
    const caminhoEntrada = path.join(PASTA_ENTRADA, arquivo);
    const conteudo = fs.readFileSync(caminhoEntrada, 'utf-8');

    console.log(`\n🔄 Processando: ${arquivo} (${conteudo.length} caracteres)...`);

    // 1. O Prompt de "Destilação"
    // Aqui é onde a mágica acontece. Você diz para a IA o que extrair.
    const prompt = `
    Você é um especialista em sintetizar informações complexas.
    Leia o texto abaixo e crie um RESUMO TÉCNICO ESTRUTURADO.
    
    Regras:
    1. Ignore introduções vazias.
    2. Liste os conceitos chave.
    3. Resuma as conclusões principais.
    
    Texto Original:
    ${conteudo.substring(0, 15000)} // Limitando para não estourar contexto se for gigante
    `;

    try {
        // 2. Chamada para a API Local (Ollama)
        console.log("⏳ Enviando para LLM local (pode demorar dependendo do seu PC)...");
        
        const response = await fetch(OLLAMA_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: MODELO_OLLAMA,
                prompt: prompt,
                stream: false // Espera a resposta completa
            })
        });

        if (!response.ok) throw new Error(`Erro no Ollama: ${response.statusText}`);

        const data = await response.json();
        const textoDestilado = data.response;

        // 3. Salvar o Resultado
        const nomeSaida = arquivo.replace('.txt', '_destilado.md');
        const caminhoSaida = path.join(PASTA_SAIDA, nomeSaida);

        const conteudoFinal = `
# Conhecimento Destilado: ${arquivo}
Data: ${new Date().toLocaleString()}
Fonte Original: ${arquivo}

---

${textoDestilado}
        `;

        fs.writeFileSync(caminhoSaida, conteudoFinal.trim());
        console.log(`✅ Sucesso! Resumo salvo em: saida/${nomeSaida}`);

    } catch (erro) {
        console.error("❌ Erro ao processar:", erro.message);
        console.log("Dica: Verifique se o Ollama está rodando e se o modelo existe (ollama pull llama3)");
    }
}

// Loop principal
async function main() {
    console.log("=== INICIANDO DESTILADOR DE CONHECIMENTO ===");
    const arquivos = fs.readdirSync(PASTA_ENTRADA).filter(f => f.endsWith('.txt'));

    if (arquivos.length === 0) {
        console.log("⚠️  Nenhum arquivo .txt encontrado na pasta 'entrada'.");
        console.log("Crie um arquivo de texto lá para testar.");
        return;
    }

    for (const arquivo of arquivos) {
        await processarArquivo(arquivo);
    }
}

main();
