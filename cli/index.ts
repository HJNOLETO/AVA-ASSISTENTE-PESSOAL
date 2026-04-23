import "dotenv/config";
import { Command } from "commander";
import { Message, ToolCall } from "../server/_core/llm";
import { orchestrateAgentResponse, getAvailableTools } from "../server/agents";
import fs from "fs/promises";
import path from "path";
import { searchDocumentChunks, searchProducts, getDb } from "../server/db";

const program = new Command();

program
  .name("ava")
  .description("AVA Assistant - Interface Direta de Linha de Comando Autônoma")
  .version("1.0.0");

// Lista Negra Absoluta de Proteção do Host
const BLACKLIST_PATTERNS = [
  /\.env.*/i,
  /\.git[\/\\]/i,
  /node_modules/i,
  /sqlite.*\.db/i
];

async function logAudit(action: string, details: string) {
  const logPath = path.resolve(process.cwd(), "data", "ava-cli-audit.log");
  const timestamp = new Date().toISOString();
  const entry = `[${timestamp}] ${action} | ${details}\n`;
  try {
    await fs.appendFile(logPath, entry, "utf-8");
  } catch (err) {
    // Falha silenciosa de log para não derrubar execução
  }
}

// Sanitizador rigoroso de caminho para prevenir evasão (Path Traversal) e acesso a arquivos críticos
function ensureSafePath(rawPath: string) {
  const resolved = path.resolve(process.cwd(), rawPath);
  if (!resolved.startsWith(process.cwd())) {
    throw new Error("Acesso a caminhos fora do projeto bloqueado no modo CLI.");
  }
  
  for (const pattern of BLACKLIST_PATTERNS) {
    if (pattern.test(resolved)) {
      throw new Error(`Acesso negado: O caminho protegido corresponde a lista negra (${pattern}).`);
    }
  }

  return resolved;
}

program
  .command("ask")
  .description("Envia uma solicitação para o AVA no terminal, ativando autonomia de ferramentas.")
  .argument("<query>", "A solicitação ou tarefa a ser feita")
  .option("-p, --provider <provider>", "Define o provedor LLM (ex: forge, ollama)", process.env.LLM_PROVIDER || "ollama")
  .option("-m, --model <model>", "Define um modelo específico a ser usado (apenas para o provedor selecionado)")
  .action(async (query: string, options) => {
    console.log(`\n[AVA Agent]: Iniciando loop autônomo. Provedor: ${options.provider.toUpperCase()}...`);
    console.log(`[AVA Agent]: Tarefa Recebida: "${query}"\n`);
    
    // Assegurar inicialização do Database (suporta as the ferramentas que o LLM usa e.g. gerenciar_produtos)
    await getDb();

    const messages: Message[] = [{ role: "user", content: query }];
    let finishReason: string | null = null;
    let fallbackCounter = 0; // Previne loops infinitos agressivos

    try {
      while (finishReason !== "stop" && fallbackCounter < 15) {
        fallbackCounter++;
        
        // Chamada principal para o orquestrador que sabe como injetar "System Prompt" e Contexto de Identidade
        const response = await orchestrateAgentResponse(
          messages,
          options.provider as "forge" | "ollama",
          options.model,
          getAvailableTools()
        );

        const choice = response.choices?.[0];
        if (!choice) break;

        const message = choice.message;
        
        // Se a resposta contiver texto puro, demonstramos
        const textContent = Array.isArray(message.content) 
          ? message.content.map(c => c.type === 'text' ? c.text : '').join('\n') 
          : message.content;
          
        if (typeof textContent === "string" && textContent.trim().length > 0) {
          console.log(`\n[AVA Responde]:\n${textContent}\n`);
          await logAudit("LLM_RESPONSE", textContent.slice(0, 150).replace(/\n/g, " "));
        }

        // Salvar a mensagem no contexto
        messages.push({
          role: message.role,
          content: message.content || "",
          tool_calls: message.tool_calls
        });

        // Loop de ferramentas (Autonomia)
        if (message.tool_calls && message.tool_calls.length > 0) {
          finishReason = "tool_calls"; // Continuar conversando pós tool

          for (const tc of message.tool_calls as ToolCall[]) {
            console.log(`[SYS] Executando Ferramenta Nativa: ==> ${tc.function.name}`);
            await logAudit("TOOL_CALL", `Instanciando: ${tc.function.name} com args: ${tc.function.arguments}`);
            let toolOutput = "";

            try {
              const args = JSON.parse(tc.function.arguments);

              switch (tc.function.name) {
                case "obter_data_hora":
                  toolOutput = new Date().toISOString();
                  break;

                case "listar_arquivos": {
                  const dirPath = ensureSafePath(args.caminho || ".");
                  const items = await fs.readdir(dirPath);
                  // Respeitando limites do Host CLI: Devolve max 50 itens
                  toolOutput = items.slice(0, 50).join("\n");
                  if (items.length > 50) toolOutput += `\n... (e mais ${items.length - 50} itens omitidos por limite de tela)`;
                  break;
                }

                case "ler_arquivo":
                case "ler_codigo_fonte": {
                  const filePath = ensureSafePath(args.caminho || args.caminho_arquivo || "");
                  const content = await fs.readFile(filePath, "utf-8");
                  const lines = content.split("\n");
                  // Limitando leitura via CLI para não estourar memória do LLM: máx 300 linhas
                  const start = Math.max(0, (args.linhas?.inicio || 1) - 1);
                  const end = Math.min(lines.length, (args.linhas?.fim || start + 300));
                  toolOutput = lines.slice(start, end).join("\n");
                  if (end < lines.length) toolOutput += `\n\n[AVISO CLI]: Conteúdo truncado em ${end} linhas devido a limites de buffer locais.`;
                  break;
                }

                case "explorar_diretorio_projeto": {
                  const dirPath = ensureSafePath(args.caminho || ".");
                  const items = await fs.readdir(dirPath);
                  toolOutput = items.slice(0, 50).join("\n");
                  break;
                }

                case "buscar_documentos_rag": {
                  // TELEGRAM_STUDY_USER_ID is defaulted to 1 for the main RAG database
                  const res = await searchDocumentChunks(1, String(args.consulta || ""), 5);
                  toolOutput = res.length > 0
                    ? res.map(c => `[Doc Chunk]: ${c.content}`).join("\n---\n")
                    : "Nenhuma informação explícita encontrada no banco RAG.";
                  break;
                }

                case "gerenciar_produtos": {
                  const term = String(args.termo || args.id || "");
                  const found = await searchProducts(term, 20);
                  toolOutput = found.length > 0
                    ? `Produtos Localizados:\n` + found.map((p: any) => `- ${p.name} | Ref: ${p.referenceId} | Preço: R$${p.price} | Estoque: ${p.stock} | NCM: ${p.ncm || 'N/A'}`).join("\n")
                    : "Nenhum produto em estoque corresponde a sua busca.";
                  break;
                }

                default:
                  // Para ferramentas complexas (backend puro CRM/Agenda/Etc..), interceptamos controladamente
                  toolOutput = "ATENÇÃO: Ferramenta não suportada remotamente no modo CLI confinado ainda. Você deve indicar ao usuário que ele deve acessar a interface WEB para realizar essa ação.";
                  break;
              }
            } catch (err) {
              toolOutput = `Falha sistêmica na execução da tool ${tc.function.name}: ${(err as Error).message}`;
              console.log(`[SYS ERR] ${toolOutput}`);
            }

            // Injeta resultado da ferramenta no Histórico e volta pro LLM
            messages.push({
              role: "tool",
              name: tc.function.name,
              tool_call_id: tc.id,
              content: toolOutput
            });
          }
        } else {
          finishReason = choice.finish_reason || "stop";
        }
      }

      if (fallbackCounter >= 15) {
        console.log(`\n[SISTEMA]: Limitador de interações autônomas atingido (15 ciclos max).\n`);
      }

    } catch (error) {
      console.error(`\n[Erro Fatal do Sistema]: ${(error as Error).message}\n`);
      process.exitCode = 1;
    }
  });

program.parseAsync(process.argv).catch((error) => {
  console.error(`\n[Erro Crítico do CLI]: ${(error as Error).message}\n`);
  process.exit(1);
});
