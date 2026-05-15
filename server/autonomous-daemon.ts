import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { getProactiveTasks, updateProactiveTask } from "./db";
import { processAvaRequest } from "./unified-engine";

const TELEGRAM_STUDY_USER_ID = Number(process.env.TELEGRAM_STUDY_USER_ID || "1");
const POLL_INTERVAL_MS = 60000; // 1 minute

console.log("[autonomous-daemon] Iniciando vigia de background...");

async function checkProactiveTasks() {
  try {
    const tasks = await getProactiveTasks(TELEGRAM_STUDY_USER_ID);
    const now = new Date().getTime();

    for (const task of tasks) {
      if (task.status === "active" && task.nextRun) {
        const runTime = new Date(task.nextRun).getTime();
        
        if (runTime <= now) {
          console.log(`[autonomous-daemon] Tarefa acionada: #${task.id} ${task.title}`);
          
          // Marcar como em andamento temporariamente para evitar double trigger
          // Wait, actually let's just trigger the LLM to handle it, but we need to prevent spam.
          // The LLM should decide to snooze or complete it. But just in case, we advance nextRun slightly or let LLM do it.
          // For now, let's advance it by 5 minutes to prevent loop if LLM fails.
          const tempNextRun = new Date(now + 5 * 60000);
          await updateProactiveTask(TELEGRAM_STUDY_USER_ID, task.id, { nextRun: tempNextRun });

          const prompt = `[SISTEMA AUTÔNOMO] O momento atual é ${new Date().toLocaleString("pt-BR")}. O lembrete/tarefa #${task.id} com título "${task.title}" e descrição "${task.description}" acabou de vencer. Analise o contexto e utilize a ferramenta enviar_mensagem_telegram para notificar o usuário de forma proativa e engajadora. Se for uma rotina de hidratação/alongamento, envie algo motivacional. Responda chamando a ferramenta.`;

          const result = await processAvaRequest(prompt, {
            userId: TELEGRAM_STUDY_USER_ID,
            provider: (process.env.LLM_PROVIDER as any) || "gemini", // use the configured provider
            channel: "cli", // using CLI or 'autonomous' (requires channel type update)
            autoConfirm: true
          });

          console.log(`[autonomous-daemon] Resultado LLM para tarefa #${task.id}: ${result.status} (Tool calls: ${result.toolCalls})`);
        }
      }
    }
  } catch (error) {
    console.error("[autonomous-daemon] Erro na checagem:", error);
  }
}

setInterval(checkProactiveTasks, POLL_INTERVAL_MS);

// Executa a primeira vez logo na inicialização
checkProactiveTasks();
