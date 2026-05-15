import "dotenv/config";
import { getAvailableTools } from "../server/agents";
import { invokeLLM } from "../server/_core/llm";

async function run() {
  console.log("Iniciando invokeLLM...");
  const result = await invokeLLM({
    messages: [
      { role: "system", content: "Você é um agente. Execute a ferramenta iniciar_sessao_estudo para o assunto 'Docker'." },
      { role: "user", content: "Inicie a sessão de estudo de Docker" }
    ],
    tools: getAvailableTools(),
    provider: "gemini"
  });
  
  console.log("Resultado bruto:", JSON.stringify(result, null, 2));
}

run().catch(console.error);
