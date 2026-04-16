import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { TRPCError } from "@trpc/server";
import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";
import { exec } from "child_process";
import { promisify } from "util";
import { addSystemLog } from "./db";

const execAsync = promisify(exec);

function firstHeaderValue(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0]?.trim() || null;
  }
  if (typeof value === "string") {
    const normalized = value.trim();
    return normalized.length > 0 ? normalized : null;
  }
  return null;
}

function resolveTimezoneFromHeader(value: string | string[] | undefined): string {
  const fallback = Intl.DateTimeFormat("pt-BR").resolvedOptions().timeZone || "UTC";
  const requestedTimezone = firstHeaderValue(value);

  if (!requestedTimezone) {
    return fallback;
  }

  try {
    Intl.DateTimeFormat("pt-BR", { timeZone: requestedTimezone }).format(new Date());
    return requestedTimezone;
  } catch (error) {
    console.warn(`[assistant.getCurrentDateTime] Invalid timezone header '${requestedTimezone}', using fallback '${fallback}'`, error);
    return fallback;
  }
}

function resolveLocaleFromHeader(value: string | string[] | undefined): string {
  const fallback = "pt-BR";
  const requestedLocale = firstHeaderValue(value);

  if (!requestedLocale) {
    return fallback;
  }

  const supported = Intl.DateTimeFormat.supportedLocalesOf([requestedLocale]);
  return supported.length > 0 ? supported[0] : fallback;
}

function getTimezoneOffsetMinutes(timeZone: string, date: Date): number {
  try {
    const offsetParts = new Intl.DateTimeFormat("en-US", {
      timeZone,
      timeZoneName: "shortOffset",
      hour: "2-digit",
    }).formatToParts(date);
    const timeZoneName = offsetParts.find(part => part.type === "timeZoneName")?.value;

    if (!timeZoneName || timeZoneName === "GMT") {
      return 0;
    }

    const match = timeZoneName.match(/^GMT([+-])(\d{1,2})(?::(\d{2}))?$/);
    if (!match) {
      return -date.getTimezoneOffset();
    }

    const sign = match[1] === "-" ? -1 : 1;
    const hours = Number(match[2] || 0);
    const minutes = Number(match[3] || 0);
    return sign * (hours * 60 + minutes);
  } catch (error) {
    console.warn(`[assistant.getCurrentDateTime] Failed to compute timezone offset for '${timeZone}', using local offset`, error);
    return -date.getTimezoneOffset();
  }
}

// Whitelist of allowed commands
const ALLOWED_COMMANDS = [
  "pnpm test",
  "pnpm build",
  "node --version",
  "pnpm --version",
  "git status",
  "git log",
];

// Allowed directories (whitelist)
const ALLOWED_DIRS = ["client", "server", "docs", "scripts", "."];

// Forbidden paths for safety (blacklist)
const FORBIDDEN_PATHS = [
  "C:\\Windows",
  "C:\\Program Files",
  "~\\.ssh",
  ".env",
  "node_modules",
  ".git",
];

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// Token store for dry-run confirmations
const confirmationTokens = new Map<
  string,
  {
    path: string;
    content: string;
    action: "create" | "modify";
    expires: number;
  }
>();

// RBAC - Role Based Access Control
function hasPermission(
  role: string,
  action: "read" | "write" | "exec" | "admin"
): boolean {
  const permissions = {
    user: ["read"],
    maintainer: ["read", "write"],
    admin: ["read", "write", "exec", "admin"],
  };
  return (
    permissions[role as keyof typeof permissions]?.includes(action) || false
  );
}

// Validate path for security
function validatePath(inputPath: string): string {
  const targetPath = path.resolve(process.cwd(), inputPath);

  // Check blacklist first
  for (const forbidden of FORBIDDEN_PATHS) {
    if (targetPath.toLowerCase().includes(forbidden.toLowerCase())) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Access denied: Path contains forbidden directory (${forbidden})`,
      });
    }
  }

  // Ensure path is within project root
  if (!targetPath.startsWith(process.cwd())) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Access to paths outside project root is not allowed.",
    });
  }

  // Check whitelist (path must be in allowed dir or in root with safe extensions)
  const pathRelative = path.relative(process.cwd(), targetPath);
  const isInRootDir =
    !pathRelative.includes(path.sep) && !pathRelative.includes("/");

  const isAllowedDir = ALLOWED_DIRS.some(allowed => {
    if (allowed === ".") return isInRootDir; // Root directory allowed
    return targetPath
      .toLowerCase()
      .includes(path.resolve(process.cwd(), allowed).toLowerCase());
  });

  if (!isAllowedDir) {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: `Access denied: Path must be within allowed directories (${ALLOWED_DIRS.join(", ")})`,
    });
  }

  return targetPath;
}

// Generate diff between old and new content
function generateDiff(oldContent: string, newContent: string): string {
  const oldLines = oldContent.split("\n");
  const newLines = newContent.split("\n");

  let diff = "";
  const maxLinesToShow = 20;
  let diffLineCount = 0;

  for (
    let i = 0;
    i < Math.max(oldLines.length, newLines.length) &&
    diffLineCount < maxLinesToShow;
    i++
  ) {
    const oldLine = oldLines[i] || "";
    const newLine = newLines[i] || "";

    if (oldLine !== newLine) {
      if (oldLine) {
        diff += `- ${oldLine}\n`;
        diffLineCount++;
      }
      if (newLine) {
        diff += `+ ${newLine}\n`;
        diffLineCount++;
      }
    }
  }

  return diff || "(no changes in diff view)";
}

// Helper to check permissions
function checkPermission(
  role: string,
  required: "read" | "write" | "exec" | "admin"
) {
  if (!hasPermission(role, required)) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: `Insufficient permissions. ${required} role required.`,
    });
  }
}

export const assistantRouter = router({
  getSystemInfo: protectedProcedure.query(async ({ ctx }) => {
    checkPermission(ctx.user.role, "read");
    const os = await import("os");

    return {
      uptime: os.uptime(),
      platform: process.platform,
      nodeVersion: process.version,
      arch: os.arch(),
      cpuCount: os.cpus().length,
      totalMemory: os.totalmem(),
      freeMemory: os.freemem(),
      usedMemory: os.totalmem() - os.freemem(),
      timestamp: new Date().toISOString(),
    };
  }),

  getCurrentDateTime: protectedProcedure.query(async ({ ctx }) => {
    checkPermission(ctx.user.role, "read");
    const now = new Date();
    const timezone = resolveTimezoneFromHeader(ctx.req.headers["x-user-timezone"]);
    const locale = resolveLocaleFromHeader(ctx.req.headers["x-user-locale"]);

    const formatter = new Intl.DateTimeFormat("pt-BR", {
      timeZone: timezone,
      weekday: "long",
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    });

    const parts = formatter.formatToParts(now);
    const getPart = (type: Intl.DateTimeFormatPartTypes): string =>
      parts.find(part => part.type === type)?.value ?? "";

    const dayOfWeek = getPart("weekday").toLowerCase();
    const dayText = getPart("day");
    const month = getPart("month").toLowerCase();
    const yearText = getPart("year");
    const hours = getPart("hour").padStart(2, "0");
    const minutes = getPart("minute").padStart(2, "0");
    const seconds = getPart("second").padStart(2, "0");

    const day = Number.parseInt(dayText, 10);
    const year = Number.parseInt(yearText, 10);
    const hoursNumber = Number.parseInt(hours, 10);
    const minutesNumber = Number.parseInt(minutes, 10);
    const secondsNumber = Number.parseInt(seconds, 10);

    // Cumprimento baseado na hora
    let greeting = "Boa noite";
    if (hoursNumber >= 5 && hoursNumber < 12) {
      greeting = "Bom dia";
    } else if (hoursNumber >= 12 && hoursNumber < 18) {
      greeting = "Boa tarde";
    }

    return {
      greeting,
      time: `${hours}:${minutes}:${seconds}`,
      date: `${day} de ${month} de ${year}`,
      dayOfWeek,
      day,
      month,
      year,
      hours: hoursNumber,
      minutes: minutesNumber,
      seconds: secondsNumber,
      iso: now.toISOString(),
      timestamp: now.getTime(),
      timezone,
      locale,
      utcOffsetMinutes: getTimezoneOffsetMinutes(timezone, now),
    };
  }),

  listDir: protectedProcedure
    .input(
      z.object({
        path: z.string().default("."),
        limit: z.number().optional().default(100),
        extensions: z.array(z.string()).optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      checkPermission(ctx.user.role, "read");

      const targetPath = validatePath(input.path);

      try {
        const entries = await fs.readdir(targetPath, { withFileTypes: true });

        let items = entries.map(e => ({
          name: e.name,
          isDirectory: e.isDirectory(),
        }));

        // Filter by extensions if provided
        if (input.extensions && input.extensions.length > 0) {
          items = items.filter(
            item =>
              item.isDirectory ||
              input.extensions!.some(ext => item.name.endsWith(ext))
          );
        }

        // Limit results
        items = items.slice(0, input.limit);

        return {
          path: targetPath,
          items,
          totalCount: entries.length,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to list directory: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    }),

  readFile: protectedProcedure
    .input(z.object({ path: z.string() }))
    .query(async ({ ctx, input }) => {
      checkPermission(ctx.user.role, "read");

      const targetPath = validatePath(input.path);

      try {
        const stats = await fs.stat(targetPath);

        // Check file size
        if (stats.size > MAX_FILE_SIZE) {
          throw new TRPCError({
            code: "PAYLOAD_TOO_LARGE",
            message: `File too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
          });
        }

        const content = await fs.readFile(targetPath, "utf-8");

        // Calculate SHA256 hash
        const sha256 = createHash("sha256").update(content).digest("hex");

        return {
          path: input.path,
          content,
          size: stats.size,
          modified: stats.mtime.toISOString(),
          sha256,
        };
      } catch (error) {
        if (error instanceof TRPCError) throw error;
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `File not found or cannot be read: ${input.path}`,
        });
      }
    }),

  writeFile: protectedProcedure
    .input(
      z.object({
        path: z.string(),
        content: z.string(),
        dryRun: z.boolean().default(true),
        confirmationToken: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      checkPermission(ctx.user.role, "write");

      const targetPath = validatePath(input.path);

      // Check content size
      if (input.content.length > MAX_FILE_SIZE) {
        throw new TRPCError({
          code: "PAYLOAD_TOO_LARGE",
          message: `Content too large. Maximum size: ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        });
      }

      if (input.dryRun) {
        let action: "create" | "modify" = "create";
        let currentContent = "";

        // Check if file exists
        try {
          currentContent = await fs.readFile(targetPath, "utf-8");
          action = "modify";
        } catch (error) {
          if ((error as NodeJS.ErrnoException).code !== "ENOENT") {
            console.warn(
              `[assistant.writeFile] Unexpected error checking existing file ${input.path}:`,
              error
            );
          }
        }

        // Generate confirmation token
        const token = createHash("sha256")
          .update(`${targetPath}-${Date.now()}-${Math.random()}`)
          .digest("hex");

        // Store pending operation
        confirmationTokens.set(token, {
          path: targetPath,
          content: input.content,
          action,
          expires: Date.now() + 5 * 60 * 1000, // 5 minutes
        });

        // Generate diff for modify operations
        const diff =
          action === "modify"
            ? generateDiff(currentContent, input.content)
            : null;

        return {
          needsConfirmation: true,
          confirmationToken: token,
          action,
          diff,
          preview: input.content.substring(0, 500),
          existingFileSize: action === "modify" ? currentContent.length : 0,
          newFileSize: input.content.length,
        };
      }

      // Execution: Validate token and execute
      if (!input.confirmationToken) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Confirmation token required for file write operations.",
        });
      }

      const pending = confirmationTokens.get(input.confirmationToken);

      if (!pending) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Invalid confirmation token.",
        });
      }

      if (Date.now() > pending.expires) {
        confirmationTokens.delete(input.confirmationToken);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Confirmation token expired. Please try again.",
        });
      }

      if (pending.path !== targetPath) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Token does not match the requested path.",
        });
      }

      try {
        // Create backup if file exists
        if (pending.action === "modify") {
          const backupPath = `${targetPath}.backup-${Date.now()}`;
          try {
            await fs.copyFile(targetPath, backupPath);
          } catch (error) {
            // Backup creation failed but continue with write
            console.warn(`Failed to create backup at ${backupPath}:`, error);
          }
        }

        // Write file
        await fs.writeFile(targetPath, input.content, "utf-8");

        // Remove used token
        confirmationTokens.delete(input.confirmationToken);

        // Calculate hash of new content
        const sha256 = createHash("sha256").update(input.content).digest("hex");

        // Log operation
        await addSystemLog(
          `File ${pending.action === "create" ? "created" : "modified"}: ${input.path}`,
          "INFO",
          typeof ctx.user.id === "string"
            ? parseInt(ctx.user.id, 10)
            : ctx.user.id,
          {
            path: input.path,
            action: pending.action,
            size: input.content.length,
            sha256,
          }
        );

        return {
          success: true,
          path: input.path,
          action: pending.action,
          sha256,
        };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to write file: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    }),

  createDir: protectedProcedure
    .input(z.object({ path: z.string() }))
    .mutation(async ({ ctx, input }) => {
      checkPermission(ctx.user.role, "write");
      const targetPath = validatePath(input.path);

      try {
        await fs.mkdir(targetPath, { recursive: true });

        await addSystemLog(
          `Directory created: ${input.path}`,
          "INFO",
          typeof ctx.user.id === "string"
            ? parseInt(ctx.user.id, 10)
            : ctx.user.id,
          { path: input.path }
        );

        return { success: true, path: input.path };
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: `Failed to create directory: ${error instanceof Error ? error.message : "Unknown error"}`,
        });
      }
    }),

  execCommand: protectedProcedure
    .input(z.object({ command: z.string() }))
    .mutation(async ({ ctx, input }) => {
      checkPermission(ctx.user.role, "exec");

      const isAllowed = ALLOWED_COMMANDS.some(cmd =>
        input.command.trim().startsWith(cmd)
      );

      if (!isAllowed) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: `Command not allowed. Only whitelisted commands can be executed: ${ALLOWED_COMMANDS.join(", ")}`,
        });
      }

      try {
        const { stdout, stderr } = await execAsync(input.command, {
          timeout: 30000,
          shell: process.platform === "win32" ? "cmd.exe" : "/bin/sh",
        });

        await addSystemLog(
          `Command executed: ${input.command}`,
          "INFO",
          typeof ctx.user.id === "string"
            ? parseInt(ctx.user.id, 10)
            : ctx.user.id,
          { command: input.command }
        );

        return {
          stdout: stdout.trim(),
          stderr: stderr.trim(),
          success: true,
        };
      } catch (error) {
        const errorMsg =
          error instanceof Error ? error.message : "Unknown error";
        return {
          stdout: "",
          stderr: errorMsg,
          success: false,
        };
      }
    }),
});
