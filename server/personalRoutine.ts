import { createProactiveTask, getProactiveTasks, updateProactiveTask } from "./db";
import { alignToPersonalWindow } from "./personalSchedule";

type BaselineTask = {
  title: string;
  description: string;
  schedule: string;
};

const BASELINE_TASKS: BaselineTask[] = [
  {
    title: "[ROTINA] Hidratação",
    description: "Hora de beber água e fazer uma pausa rápida de 1 minuto.",
    schedule: "personal-50m",
  },
  {
    title: "[ROTINA] Alongamento",
    description: "Faça 3 a 5 minutos de alongamento para postura e circulação.",
    schedule: "personal-2h",
  },
  {
    title: "[ROTINA] Motivacional",
    description: "Respire fundo, revise seu foco do dia e avance no próximo passo.",
    schedule: "personal-fixed:10:30,15:30",
  },
];

export async function ensurePersonalRoutine(userId: number): Promise<void> {
  const existing = await getProactiveTasks(userId);
  const existingByTitle = new Map(existing.map((t) => [t.title, t]));

  for (const task of BASELINE_TASKS) {
    const already = existingByTitle.get(task.title);
    if (already) {
      await updateProactiveTask(userId, already.id, {
        description: task.description,
        schedule: task.schedule,
        status: already.status === "completed" ? "active" : already.status,
        nextRun: alignToPersonalWindow(already.nextRun || new Date()),
      });
      continue;
    }

    await createProactiveTask(userId, {
      title: task.title,
      description: task.description,
      type: "proactive",
      status: "active",
      schedule: task.schedule,
      nextRun: alignToPersonalWindow(new Date()),
    });
  }
}
