export type ReminderIntent = {
  message: string;
  minutes: number;
};

export type AppointmentIntent = {
  title: string;
  startTime: Date;
  endTime: Date;
  reminderMinutes: number | null;
};

function normalizeText(input: string): string {
  return (input || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[!?.,;:]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function stripQuotes(input: string): string {
  return input.replace(/^['"`]+|['"`]+$/g, "").trim();
}

function parsePortugueseNumber(raw: string): number | null {
  const text = normalizeText(raw);
  if (!text) return null;

  const direct = Number.parseInt(text, 10);
  if (Number.isFinite(direct)) return direct;

  const units: Record<string, number> = {
    zero: 0,
    um: 1,
    uma: 1,
    dois: 2,
    duas: 2,
    tres: 3,
    quatro: 4,
    cinco: 5,
    seis: 6,
    sete: 7,
    oito: 8,
    nove: 9,
  };

  const teens: Record<string, number> = {
    dez: 10,
    onze: 11,
    doze: 12,
    treze: 13,
    quatorze: 14,
    catorze: 14,
    quinze: 15,
    dezesseis: 16,
    dezasseis: 16,
    dezessete: 17,
    dezassete: 17,
    dezoito: 18,
    dezenove: 19,
    dezanove: 19,
  };

  const tens: Record<string, number> = {
    vinte: 20,
    trinta: 30,
    quarenta: 40,
    cinquenta: 50,
    sessenta: 60,
    setenta: 70,
    oitenta: 80,
    noventa: 90,
  };

  const hundreds: Record<string, number> = {
    cem: 100,
    cento: 100,
  };

  const tokens = text.split(" ").filter(Boolean);
  let total = 0;
  let hasAny = false;

  for (const token of tokens) {
    if (token === "e") continue;
    if (units[token] !== undefined) {
      total += units[token];
      hasAny = true;
      continue;
    }
    if (teens[token] !== undefined) {
      total += teens[token];
      hasAny = true;
      continue;
    }
    if (tens[token] !== undefined) {
      total += tens[token];
      hasAny = true;
      continue;
    }
    if (hundreds[token] !== undefined) {
      total += hundreds[token];
      hasAny = true;
      continue;
    }
    return null;
  }

  return hasAny ? total : null;
}

function parseAmountAndUnit(rawAmount: string, rawUnit: string): number | null {
  const amount = parsePortugueseNumber(rawAmount);
  if (!amount || amount <= 0) return null;

  const unit = normalizeText(rawUnit);
  if (unit.startsWith("hora")) return amount * 60;
  if (unit.startsWith("dia")) return amount * 60 * 24;
  return amount;
}

function parseReminderMinutesClause(text: string): number | null {
  const normalized = normalizeText(text);
  const match = normalized.match(
    /lembrete\s*(?:de)?\s+([a-z0-9\s]+?)\s*(minuto|minutos|hora|horas)\s*(?:antes)?$/i
  );
  if (!match) return null;
  return parseAmountAndUnit(match[1] || "", match[2] || "minutos");
}

function buildDateFromDayAndTime(dayToken: string, hourRaw: string, minuteRaw?: string): Date | null {
  const now = new Date();
  const day = normalizeText(dayToken);
  const hour = Number.parseInt(hourRaw, 10);
  const minute = Number.parseInt(minuteRaw || "0", 10);

  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return null;
  if (!Number.isFinite(minute) || minute < 0 || minute > 59) return null;

  const target = new Date(now);
  target.setSeconds(0, 0);
  target.setHours(hour, minute, 0, 0);

  if (day === "amanha") {
    target.setDate(target.getDate() + 1);
  }

  if (day !== "hoje" && day !== "amanha") return null;

  return target;
}

function buildDateFromCalendarDate(dateRaw: string, hourRaw: string, minuteRaw?: string): Date | null {
  const dateMatch = dateRaw.match(/^(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?$/);
  if (!dateMatch) return null;

  const day = Number.parseInt(dateMatch[1] || "0", 10);
  const month = Number.parseInt(dateMatch[2] || "0", 10);
  const yearToken = dateMatch[3];
  const now = new Date();
  const year = yearToken
    ? Number.parseInt(yearToken.length === 2 ? `20${yearToken}` : yearToken, 10)
    : now.getFullYear();
  const hour = Number.parseInt(hourRaw, 10);
  const minute = Number.parseInt(minuteRaw || "0", 10);

  if (!Number.isFinite(day) || day < 1 || day > 31) return null;
  if (!Number.isFinite(month) || month < 1 || month > 12) return null;
  if (!Number.isFinite(year) || year < 2000 || year > 2100) return null;
  if (!Number.isFinite(hour) || hour < 0 || hour > 23) return null;
  if (!Number.isFinite(minute) || minute < 0 || minute > 59) return null;

  const date = new Date(year, month - 1, day, hour, minute, 0, 0);
  if (date.getMonth() !== month - 1 || date.getDate() !== day) return null;
  return date;
}

export function parseReminderIntent(rawText: string): ReminderIntent | null {
  const normalized = normalizeText(rawText);
  if (!normalized) return null;

  const patterns = [
    /^(?:criar lembrete|crie lembrete|me lembre|me lembre de|lembrete(?: para)?)\s+(.+?)\s+(?:em|daqui a)\s+([a-z0-9\s]+?)\s*(minuto|minutos|hora|horas|dia|dias)$/,
    /^(?:em|daqui a)\s+([a-z0-9\s]+?)\s*(minuto|minutos|hora|horas|dia|dias)\s+(?:me lembre|me lembre de|criar lembrete|crie lembrete|lembrete(?: para)?)\s+(.+)$/,
    /^(?:lembre(?:te)?\s*(?:para)?\s*)(.+?)\s+(?:daqui a)\s+([a-z0-9\s]+?)\s*(minuto|minutos|hora|horas|dia|dias)$/,
    /^(?:me lembre|me lembre de)\s+(?:em|daqui a)\s+([a-z0-9\s]+?)\s*(minuto|minutos|hora|horas|dia|dias)\s+(?:para\s+)?(.+)$/,
  ];

  for (const pattern of patterns) {
    const match = normalized.match(pattern);
    if (!match) continue;

    let message = "";
    let amountRaw = "";
    let unitRaw = "minutos";

    if (pattern === patterns[0] || pattern === patterns[2]) {
      message = stripQuotes(String(match[1] || ""));
      amountRaw = String(match[2] || "");
      unitRaw = String(match[3] || "minutos");
    } else if (pattern === patterns[3]) {
      amountRaw = String(match[1] || "");
      unitRaw = String(match[2] || "minutos");
      message = stripQuotes(String(match[3] || ""));
    } else {
      amountRaw = String(match[1] || "");
      unitRaw = String(match[2] || "minutos");
      message = stripQuotes(String(match[3] || ""));
    }

    const minutes = parseAmountAndUnit(amountRaw, unitRaw);
    if (!message || !minutes || minutes <= 0) continue;
    return { message, minutes };
  }

  return null;
}

export function parseAppointmentIntent(rawText: string): AppointmentIntent | null {
  const normalized = normalizeText(rawText);
  if (!normalized) return null;

  const commandPrefix = /^(?:agende|agendar|marque|marcar|agenda|crie um compromisso|criar compromisso|agende um compromisso|marque um compromisso)\s+(.+)$/;
  const commandMatch = normalized.match(commandPrefix);
  if (!commandMatch) return null;

  const body = commandMatch[1] || "";

  const byRelativeDay = body.match(
    /^(.+?)\s+(?:para|pra|no dia)?\s*(hoje|amanha)\s*(?:as)?\s*(\d{1,2})(?:[:h\s](\d{2}))?\s*h?(?:\s+com\s+lembrete\s+de\s+([a-z0-9\s]+?)\s*(minuto|minutos|hora|horas)\s*antes)?$/
  );

  if (byRelativeDay) {
    const title = stripQuotes(byRelativeDay[1] || "");
    const startTime = buildDateFromDayAndTime(
      byRelativeDay[2] || "",
      byRelativeDay[3] || "",
      byRelativeDay[4]
    );
    if (!title || !startTime) return null;

    const reminderMinutes =
      byRelativeDay[5] && byRelativeDay[6]
        ? parseAmountAndUnit(byRelativeDay[5], byRelativeDay[6])
        : parseReminderMinutesClause(body);

    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    return {
      title,
      startTime,
      endTime,
      reminderMinutes,
    };
  }

  const byCalendarDate = body.match(
    /^(.+?)\s+(?:para|pra|no dia)?\s*(\d{1,2}\/\d{1,2}(?:\/\d{2,4})?)\s*(?:as)?\s*(\d{1,2})(?:[:h\s](\d{2}))?\s*h?(?:\s+com\s+lembrete\s+de\s+([a-z0-9\s]+?)\s*(minuto|minutos|hora|horas)\s*antes)?$/
  );

  if (byCalendarDate) {
    const title = stripQuotes(byCalendarDate[1] || "");
    const startTime = buildDateFromCalendarDate(
      byCalendarDate[2] || "",
      byCalendarDate[3] || "",
      byCalendarDate[4]
    );
    if (!title || !startTime) return null;

    const reminderMinutes =
      byCalendarDate[5] && byCalendarDate[6]
        ? parseAmountAndUnit(byCalendarDate[5], byCalendarDate[6])
        : parseReminderMinutesClause(body);

    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    return {
      title,
      startTime,
      endTime,
      reminderMinutes,
    };
  }

  return null;
}
