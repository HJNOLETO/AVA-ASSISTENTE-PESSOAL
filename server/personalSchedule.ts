import { addDays, addHours, setHours, setMinutes } from "date-fns";

type WindowRule = {
  startHour: number;
  endHour: number;
};

function getRuleForDay(day: number): WindowRule | null {
  if (day >= 1 && day <= 5) return { startHour: 8, endHour: 18 };
  if (day === 6) return { startHour: 8, endHour: 12 };
  return null;
}

export function isWithinPersonalWindow(date: Date): boolean {
  const rule = getRuleForDay(date.getDay());
  if (!rule) return false;
  const hour = date.getHours() + date.getMinutes() / 60;
  return hour >= rule.startHour && hour < rule.endHour;
}

export function nextPersonalWindowStart(from: Date): Date {
  let candidate = new Date(from);
  for (let i = 0; i < 8; i += 1) {
    const rule = getRuleForDay(candidate.getDay());
    if (rule) {
      const start = setHours(setMinutes(new Date(candidate), 0), rule.startHour);
      const end = setHours(setMinutes(new Date(candidate), 0), rule.endHour);
      if (candidate < start) return start;
      if (candidate >= start && candidate < end) return candidate;
    }
    candidate = addDays(setHours(setMinutes(new Date(candidate), 0), 0), 1);
  }
  return from;
}

export function alignToPersonalWindow(date: Date): Date {
  if (isWithinPersonalWindow(date)) return date;
  return nextPersonalWindowStart(date);
}

export function computeNextRunBySchedule(scheduleRaw: string, reference: Date): Date {
  const schedule = String(scheduleRaw || "").trim().toLowerCase();
  let candidate = new Date(reference);

  const minuteIntervalMatch = schedule.match(/^personal-(\d+)m$/);
  if (minuteIntervalMatch) {
    const minutes = Math.max(1, Number(minuteIntervalMatch[1]));
    candidate = new Date(candidate.getTime() + minutes * 60 * 1000);
    return alignToPersonalWindow(candidate);
  }

  if (schedule.startsWith("personal-fixed:")) {
    const clockList = schedule
      .replace("personal-fixed:", "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const sameDayCandidates: Date[] = [];
    for (const clock of clockList) {
      const [hRaw, mRaw] = clock.split(":");
      const h = Number(hRaw);
      const m = Number(mRaw);
      if (!Number.isFinite(h) || !Number.isFinite(m) || h < 0 || h > 23 || m < 0 || m > 59) continue;
      const c = new Date(candidate);
      c.setHours(h, m, 0, 0);
      if (c > candidate) sameDayCandidates.push(c);
    }

    if (sameDayCandidates.length > 0) {
      sameDayCandidates.sort((a, b) => a.getTime() - b.getTime());
      return alignToPersonalWindow(sameDayCandidates[0]);
    }

    const tomorrow = addDays(new Date(candidate), 1);
    return computeNextRunBySchedule(schedule, setHours(setMinutes(tomorrow, 0), 0));
  }

  if (schedule === "1h" || schedule === "60m" || schedule === "personal-hourly") {
    candidate = addHours(candidate, 1);
  } else if (schedule === "2h" || schedule === "120m" || schedule === "personal-2h") {
    candidate = addHours(candidate, 2);
  } else if (schedule === "3h" || schedule === "180m" || schedule === "personal-3h") {
    candidate = addHours(candidate, 3);
  } else if (schedule === "diario" || schedule === "daily" || schedule === "personal-daily") {
    candidate = addDays(candidate, 1);
  } else if (schedule === "8-18h") {
    candidate = addHours(candidate, 1);
  }

  return alignToPersonalWindow(candidate);
}
