import React, { useCallback, useEffect, useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

function isWithinPersonalWindow(date: Date): boolean {
  const day = date.getDay();
  const hour = date.getHours() + date.getMinutes() / 60;
  if (day >= 1 && day <= 5) return hour >= 8 && hour < 18;
  if (day === 6) return hour >= 8 && hour < 12;
  return false;
}

function nextPersonalWindowStart(from: Date): Date {
  const candidate = new Date(from);
  for (let i = 0; i < 8; i += 1) {
    const day = candidate.getDay();
    const start = new Date(candidate);
    start.setMinutes(0, 0, 0);
    const end = new Date(candidate);
    end.setMinutes(0, 0, 0);

    if (day >= 1 && day <= 5) {
      start.setHours(8);
      end.setHours(18);
    } else if (day === 6) {
      start.setHours(8);
      end.setHours(12);
    } else {
      candidate.setDate(candidate.getDate() + 1);
      candidate.setHours(0, 0, 0, 0);
      continue;
    }

    if (candidate < start) return start;
    if (candidate >= start && candidate < end) return candidate;

    candidate.setDate(candidate.getDate() + 1);
    candidate.setHours(0, 0, 0, 0);
  }
  return from;
}

export default function ReminderWatcher() {
  const [activeReminders, setActiveReminders] = useState<Set<number>>(new Set());
  const { data: tasks, refetch } = trpc.proactiveTasks.list.useQuery(undefined, {
    refetchInterval: 10000, // Polling a cada 10s
    refetchOnWindowFocus: true,
  });

  const updateTask = trpc.proactiveTasks.update.useMutation();

  const handleSnooze = useCallback(async (id: number, minutes: number) => {
    setActiveReminders(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    try {
      await updateTask.mutateAsync({
        id,
        nextRun: new Date(Date.now() + minutes * 60 * 1000),
        status: "active",
      });
      toast.info(`Lembrete adiado por ${minutes} minutos.`);
      await refetch();
    } catch (error) {
      console.error(`[ReminderWatcher] Falha ao adiar lembrete ${id}:`, error);
      toast.error("Falha ao adiar lembrete.");
    }
  }, [refetch, updateTask]);

  const handleComplete = useCallback(async (id: number) => {
    setActiveReminders(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });

    try {
      await updateTask.mutateAsync({
        id,
        status: "completed",
      });
      await refetch();
    } catch (error) {
      console.error(`[ReminderWatcher] Falha ao concluir lembrete ${id}:`, error);
      toast.error("Falha ao concluir lembrete.");
    }
  }, [refetch, updateTask]);

  const rescheduleTask = trpc.proactiveTasks.reschedule.useMutation();

  const handleNextOccurrence = useCallback(async (id: number) => {
    setActiveReminders(prev => {
        const next = new Set(prev);
        next.delete(id);
        return next;
    });

    try {
        await rescheduleTask.mutateAsync({ id });
        toast.success("Agendado para o próximo horário.");
        await refetch();
    } catch (error) {
        console.error(`[ReminderWatcher] Falha ao reagendar lembrete ${id}:`, error);
        toast.error("Falha ao reagendar.");
    }
  }, [refetch, rescheduleTask]);

  const playVoice = useCallback((text: string) => {
    if (!window.speechSynthesis) return;
    const ut = new SpeechSynthesisUtterance(text);
    ut.lang = "pt-BR";
    ut.rate = 1.1;
    window.speechSynthesis.speak(ut);
  }, []);

  useEffect(() => {
    if (!tasks) return;

    const now = Date.now();
    tasks.forEach(task => {
      // Ignora finalizadas ou já notificadas no state local
      if (task.status !== "active" || activeReminders.has(task.id)) return;
      
      const dueTime = task.nextRun ? new Date(task.nextRun).getTime() : 0;
      
      // Se venceu e é um tipo de lembrete/alerta
      const isReminderType = task.type === "watcher" || task.type === "alerta_urgente" || task.type === "proactive";
      
      if (isReminderType && dueTime > 0 && now >= dueTime) {
        const nowDate = new Date(now);
        if (!isWithinPersonalWindow(nowDate)) {
          const nextAllowed = nextPersonalWindowStart(nowDate);
          void updateTask.mutateAsync({
            id: task.id,
            nextRun: nextAllowed,
            status: "active",
          }).then(() => refetch()).catch(() => undefined);
          return;
        }

        console.log(`[ReminderWatcher] Disparando lembrete: ${task.title} (ID: ${task.id})`);
        
        // Mapeia como visualizado localmente no front
        setActiveReminders(prev => new Set(prev).add(task.id));
        
        // Dispara Voz
        playVoice("Atenção para o lembrete: " + (task.description || task.title));

        // Dispara Popup brutal
        const isRecurring = !!task.schedule;

        toast(`⏰ LEMBRETE: ${task.title}`, {
            duration: Number.POSITIVE_INFINITY, // Fica na tela até clicar
            description: task.description || "O tempo que você marcou acabou de se esgotar.",
            action: isRecurring ? {
                label: "Ciente (Próximo)",
                onClick: () => handleNextOccurrence(task.id)
            } : {
                label: "Concluir",
                onClick: () => handleComplete(task.id)
            },
            cancel: isRecurring ? {
                label: "Finalizar Ciclo",
                onClick: () => handleComplete(task.id)
            } : {
                label: "Soneca +5m",
                onClick: () => handleSnooze(task.id, 5)
            }
        });
      }
    });

  }, [activeReminders, handleComplete, handleSnooze, handleNextOccurrence, playVoice, tasks]);

  return null; // Apenas um listener background
}
