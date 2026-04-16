import { z } from "zod";

const MAX_REMINDER_MINUTES = 60 * 24 * 30;

const nullableTrimmedString = z.string().trim().optional().nullable();

const reminderMinutesSchema = z
  .number()
  .int("Reminder deve ser inteiro")
  .min(0, "Reminder não pode ser negativo")
  .max(MAX_REMINDER_MINUTES, `Reminder máximo é ${MAX_REMINDER_MINUTES} minutos`)
  .optional()
  .nullable();

const isParsableDateString = (value: string): boolean => {
  return !Number.isNaN(Date.parse(value));
};

const dueDateSchema = z
  .string()
  .trim()
  .refine(isParsableDateString, "dueDate inválida")
  .optional()
  .nullable();

export const appointmentCreateInputSchema = z
  .object({
    title: z.string().trim().min(1),
    description: nullableTrimmedString,
    startTime: z.coerce.date(),
    endTime: z.coerce.date(),
    location: nullableTrimmedString,
    customerId: z.number().optional().nullable(),
    type: z.enum(["meeting", "consultation", "call", "other"]).optional(),
    reminderMinutes: reminderMinutesSchema,
    recurrenceRule: nullableTrimmedString,
    participants: nullableTrimmedString,
    isCompleted: z.number().optional(),
    status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.endTime <= value.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endTime deve ser maior que startTime",
        path: ["endTime"],
      });
    }
  });

export const appointmentUpdateInputSchema = z
  .object({
    id: z.number(),
    title: z.string().trim().min(1).optional(),
    description: nullableTrimmedString,
    startTime: z.coerce.date().optional(),
    endTime: z.coerce.date().optional(),
    location: nullableTrimmedString,
    customerId: z.number().optional().nullable(),
    type: z.enum(["meeting", "consultation", "call", "other"]).optional(),
    reminderMinutes: reminderMinutesSchema,
    recurrenceRule: nullableTrimmedString,
    participants: nullableTrimmedString,
    isCompleted: z.number().optional(),
    status: z.enum(["scheduled", "completed", "cancelled"]).optional(),
  })
  .superRefine((value, ctx) => {
    if (value.startTime && value.endTime && value.endTime <= value.startTime) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "endTime deve ser maior que startTime",
        path: ["endTime"],
      });
    }
  });

export const proactiveTaskCreateInputSchema = z.object({
  title: z.string().trim().min(1),
  description: nullableTrimmedString,
  priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
  dueDate: dueDateSchema,
  type: z.enum(["cron", "one-time", "watcher", "alerta_urgente", "proactive"]).default("one-time"),
  schedule: z.string().trim().optional().nullable(),
});

export const proactiveTaskUpdateInputSchema = z
  .object({
    id: z.number(),
    title: z.string().trim().min(1).optional(),
    description: nullableTrimmedString,
    priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
    dueDate: dueDateSchema,
    status: z.enum(["active", "paused", "completed", "failed"]).optional(),
    nextRun: z.coerce.date().optional(),
    schedule: z.string().trim().optional().nullable(),
  })
  .superRefine((value, ctx) => {
    if (value.status === "completed" && value.nextRun) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "nextRun não deve ser enviado quando status for completed",
        path: ["nextRun"],
      });
    }
  });
