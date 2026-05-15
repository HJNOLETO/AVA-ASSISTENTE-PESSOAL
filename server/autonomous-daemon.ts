import dotenv from "dotenv";
import { fileURLToPath } from "url";
import path from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, "../.env") });

import { getProactiveTasks, updateProactiveTask } from "./db";
import { processAvaRequest } from "./unified-engine";
import { telegramSendMessage } from "./telegramStudyBot";

const TELEGRAM_STUDY_USER_ID = Number(process.env.TELEGRAM_STUDY_USER_ID || "1");
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || "";
const POLL_INTERVAL_MS = 60000; // 1 minute

console.log("[autonomous-daemon] Iniciando vigia de background...");

let isDaemonRunning = false;

async function checkProactiveTasks() {
  if (isDaemonRunning) {
    console.log("[autonomous-daemon] Ciclo anterior ainda em execução. Pulando este turno para evitar avalanche.");
    return;
  }

  isDaemonRunning = true;
  try {
    const tasks = await getProactiveTasks(TELEGRAM_STUDY_USER_ID);
    const now = Date.now();
    
    // Agrupar tarefas ativas por descrição para evitar enviar 10 lembretes de "Tomar água" ao mesmo tempo
    const activeTasks = tasks.filter((t) => t.status === "active" && t.nextRun && new Date(t.nextRun).getTime() <= now);
    const seenDescriptions = new Set<string>();
    const tasksToProcess = [];

    for (const task of activeTasks) {
      const descLower = task.description.toLowerCase().trim();
      if (seenDescriptions.has(descLower)) {
        // Tarefa duplicada de mesmo nome vencida ao mesmo tempo. Apenas adiamos silenciosamente.
        const tempNextRun = new Date(now + 5 * 60000);
        await updateProactiveTask(TELEGRAM_STUDY_USER_ID, task.id, { nextRun: tempNextRun });
        continue;
      }
      seenDescriptions.add(descLower);
      tasksToProcess.push(task);
    }

    for (const task of tasksToProcess) {
      try {
        console.log(`[autonomous-daemon] Tarefa acionada: #${task.id} ${task.description}`);
        const prompt = `[SISTEMA AUTÔNOMO] O momento atual é ${new Date().toLocaleString("pt-BR")}. O lembrete "${task.title}" com a descrição "${task.description}" acabou de vencer. Você deve notificar o usuário imediatamente. Inicie uma interação natural informando sobre este lembrete vencido e pergunte se o usuário deseja que você faça algo a respeito ou marque como concluído.`;
        
        const result = await processAvaRequest(prompt, {
          userId: TELEGRAM_STUDY_USER_ID,
          provider: (process.env.LLM_PROVIDER as any) || "gemini",
          channel: "cli",
          autoConfirm: true
        });

        console.log(`[autonomous-daemon] Resultado LLM para tarefa #${task.id}: ${result.status}`);
        if (result.status === "success" || result.status === "aborted") {
          const tempNextRun = new Date(Date.now() + 5 * 60000);
          await updateProactiveTask(TELEGRAM_STUDY_USER_ID, task.id, { nextRun: tempNextRun });
          if (result.response && TELEGRAM_CHAT_ID) {
            await telegramSendMessage(TELEGRAM_CHAT_ID, result.response);
          }
        }
      } catch (err) {
        console.error(`[autonomous-daemon] Falha ao processar tarefa #${task.id}:`, err);
      }
    }
  } catch (error) {
    console.error("[autonomous-daemon] Erro na checagem:", error);
  } finally {
    isDaemonRunning = false;
  }
}

setInterval(checkProactiveTasks, POLL_INTERVAL_MS);
checkProactiveTasks();
