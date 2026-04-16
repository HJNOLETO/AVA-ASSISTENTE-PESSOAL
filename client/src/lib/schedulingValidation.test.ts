import { describe, expect, it } from "vitest";
import {
  appointmentCreateInputSchema,
  appointmentUpdateInputSchema,
  proactiveTaskCreateInputSchema,
  proactiveTaskUpdateInputSchema,
} from "@shared/validation/scheduling";

describe("scheduling validation", () => {
  it("aceita createAppointment válido", () => {
    const parsed = appointmentCreateInputSchema.parse({
      title: "Consulta inicial",
      startTime: "2026-04-20T10:00:00.000Z",
      endTime: "2026-04-20T11:00:00.000Z",
      reminderMinutes: 30,
    });

    expect(parsed.title).toBe("Consulta inicial");
    expect(parsed.startTime).toBeInstanceOf(Date);
    expect(parsed.endTime).toBeInstanceOf(Date);
  });

  it("rejeita createAppointment quando endTime <= startTime", () => {
    const result = appointmentCreateInputSchema.safeParse({
      title: "Compromisso inválido",
      startTime: "2026-04-20T11:00:00.000Z",
      endTime: "2026-04-20T10:00:00.000Z",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita reminderMinutes negativo no updateAppointment", () => {
    const result = appointmentUpdateInputSchema.safeParse({
      id: 1,
      reminderMinutes: -5,
    });

    expect(result.success).toBe(false);
  });

  it("aceita dueDate parseável na criação de proactive task", () => {
    const result = proactiveTaskCreateInputSchema.safeParse({
      title: "Acompanhar processo",
      dueDate: "2026-05-01",
      type: "watcher",
    });

    expect(result.success).toBe(true);
  });

  it("rejeita dueDate inválida na criação de proactive task", () => {
    const result = proactiveTaskCreateInputSchema.safeParse({
      title: "Acompanhar processo",
      dueDate: "data-invalida",
      type: "watcher",
    });

    expect(result.success).toBe(false);
  });

  it("rejeita nextRun com status completed no update de proactive task", () => {
    const result = proactiveTaskUpdateInputSchema.safeParse({
      id: 12,
      status: "completed",
      nextRun: new Date(),
    });

    expect(result.success).toBe(false);
  });
});
