import { describe, expect, it } from "vitest";
import {
  parseAppointmentIntent,
  parseReminderIntent,
} from "@shared/intent/schedulingIntent";

describe("scheduling intent parser", () => {
  it("interpreta lembrete com número por extenso", () => {
    const parsed = parseReminderIntent(
      "me lembre daqui a cinco minutos para ligar para um cliente"
    );

    expect(parsed).not.toBeNull();
    expect(parsed?.minutes).toBe(5);
    expect(parsed?.message).toContain("ligar para um cliente");
  });

  it("interpreta lembrete em horas", () => {
    const parsed = parseReminderIntent("me lembre de revisar proposta em 2 horas");

    expect(parsed).not.toBeNull();
    expect(parsed?.minutes).toBe(120);
  });

  it("interpreta agendamento para amanhã às 15h", () => {
    const parsed = parseAppointmentIntent(
      "agende reuniao com cliente amanha as 15h"
    );

    expect(parsed).not.toBeNull();
    expect(parsed?.title).toContain("reuniao com cliente");
    expect(parsed?.startTime).toBeInstanceOf(Date);
    expect(parsed?.endTime).toBeInstanceOf(Date);
    expect(parsed?.startTime.getHours()).toBe(15);
  });

  it("interpreta agendamento em data específica com lembrete", () => {
    const parsed = parseAppointmentIntent(
      "marque visita tecnica para 25/12/2026 as 09:30 com lembrete de 45 minutos antes"
    );

    expect(parsed).not.toBeNull();
    expect(parsed?.reminderMinutes).toBe(45);
    expect(parsed?.startTime.getMinutes()).toBe(30);
  });

  it("retorna null quando não é comando de agenda/lembrete", () => {
    expect(parseReminderIntent("qual a previsão do tempo hoje?")).toBeNull();
    expect(parseAppointmentIntent("explique o artigo 5 da constituicao")).toBeNull();
  });
});
