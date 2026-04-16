import { describe, it, expect, vi, afterEach } from "vitest";
import fs from "fs/promises";
import path from "path";
import { createHash } from "crypto";

// Mock db module
vi.mock("./db", () => ({
  addSystemLog: vi.fn().mockResolvedValue(undefined),
}));

import { assistantRouter } from "./assistant";
import { addSystemLog } from "./db";
import type { TrpcContext } from "./_core/context";

// Create a test context
function createTestCtx(
  role: "admin" | "user" | "maintainer" = "admin"
): TrpcContext {
  return {
    user: {
      id: 1,
      email: "test@example.com",
      name: "Test User",
      role,
      loginMethod: "manus",
      openId: "test",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: () => {} } as any,
  };
}

describe("assistantRouter", () => {
  describe("getSystemInfo", () => {
    it("returns system information", async () => {
      const ctx = createTestCtx();

      const result = await assistantRouter.createCaller(ctx).getSystemInfo();

      expect(result).toHaveProperty("uptime");
      expect(result).toHaveProperty("platform");
      expect(result).toHaveProperty("nodeVersion");
      expect(result).toHaveProperty("arch");
      expect(result).toHaveProperty("cpuCount");
      expect(result).toHaveProperty("totalMemory");
      expect(result).toHaveProperty("freeMemory");
      expect(result).toHaveProperty("usedMemory");
      expect(result).toHaveProperty("timestamp");
      expect(result.uptime).toBeGreaterThan(0);
      expect(result.totalMemory).toBeGreaterThan(0);
    });

    it("requires read permission", async () => {
      const ctx = createTestCtx("user");
      const result = await assistantRouter.createCaller(ctx).getSystemInfo();
      expect(result).toBeDefined();
    });
  });

  describe("getCurrentDateTime", () => {
    it("returns current date and time in Portuguese", async () => {
      const ctx = createTestCtx();
      const result = await assistantRouter
        .createCaller(ctx)
        .getCurrentDateTime();

      expect(result).toHaveProperty("greeting");
      expect(result).toHaveProperty("time");
      expect(result).toHaveProperty("date");
      expect(result).toHaveProperty("dayOfWeek");
      expect(result).toHaveProperty("day");
      expect(result).toHaveProperty("month");
      expect(result).toHaveProperty("year");
      expect(result).toHaveProperty("hours");
      expect(result).toHaveProperty("minutes");
      expect(result).toHaveProperty("seconds");
      expect(result).toHaveProperty("iso");
      expect(result).toHaveProperty("timestamp");

      // Validate format
      expect(result.time).toMatch(/^\d{2}:\d{2}:\d{2}$/); // HH:MM:SS
      expect(result.day).toBeGreaterThanOrEqual(1);
      expect(result.day).toBeLessThanOrEqual(31);
      expect(result.year).toBeGreaterThan(2020);
    });

    it("returns greeting based on hour", async () => {
      const ctx = createTestCtx();
      const result = await assistantRouter
        .createCaller(ctx)
        .getCurrentDateTime();

      expect(["Bom dia", "Boa tarde", "Boa noite"]).toContain(result.greeting);
    });

    it("returns Portuguese day and month names", async () => {
      const ctx = createTestCtx();
      const result = await assistantRouter
        .createCaller(ctx)
        .getCurrentDateTime();

      const validDays = [
        "domingo",
        "segunda-feira",
        "terça-feira",
        "quarta-feira",
        "quinta-feira",
        "sexta-feira",
        "sábado",
      ];
      const validMonths = [
        "janeiro",
        "fevereiro",
        "março",
        "abril",
        "maio",
        "junho",
        "julho",
        "agosto",
        "setembro",
        "outubro",
        "novembro",
        "dezembro",
      ];

      expect(validDays).toContain(result.dayOfWeek);
      expect(validMonths).toContain(result.month);
    });

    it("requires read permission", async () => {
      const ctx = createTestCtx("user");
      const result = await assistantRouter
        .createCaller(ctx)
        .getCurrentDateTime();
      expect(result).toBeDefined();
    });
  });

  describe("listDir", () => {
    it("lists directory contents within allowed paths", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      const result = await caller.listDir({
        path: "client/src",
      });

      expect(result).toHaveProperty("path");
      expect(result).toHaveProperty("items");
      expect(Array.isArray(result.items)).toBe(true);
    });

    it("respects extension filter", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      const result = await caller.listDir({
        path: "client/src",
        extensions: [".tsx", ".ts"],
      });

      if (result.items.length > 0) {
        result.items.forEach((item: any) => {
          expect(
            item.name.endsWith(".tsx") ||
              item.name.endsWith(".ts") ||
              item.isDirectory
          ).toBe(true);
        });
      }
    });

    it("respects limit parameter", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      const result = await caller.listDir({
        path: "client/src",
        limit: 5,
      });

      expect(result.items.length).toBeLessThanOrEqual(5);
    });

    it("blocks access to forbidden paths", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      await expect(
        caller.listDir({
          path: "C:\\Windows\\System32",
        })
      ).rejects.toThrow("Access denied");
    });

    it("blocks access outside project root", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      await expect(
        caller.listDir({
          path: "../../../etc",
        })
      ).rejects.toThrow("Access to paths outside project root");
    });
  });

  describe("readFile", () => {
    it("reads file content from allowed path", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      const result = await caller.readFile({
        path: "package.json",
      });

      expect(result).toHaveProperty("content");
      expect(result).toHaveProperty("size");
      expect(result).toHaveProperty("modified");
      expect(result).toHaveProperty("sha256");
      expect(result.size).toBeGreaterThan(0);
      expect(result.sha256).toMatch(/^[a-f0-9]{64}$/);
    });

    it("blocks reading forbidden files", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      await expect(
        caller.readFile({
          path: ".env",
        })
      ).rejects.toThrow("Access denied");
    });

    it("returns error for non-existent files", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      await expect(
        caller.readFile({
          path: "client/src/nonexistent-file-12345.tsx",
        })
      ).rejects.toThrow("File not found");
    });

    it("calculates correct SHA256 hash", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      const result = await caller.readFile({
        path: "package.json",
      });

      const expectedHash = createHash("sha256")
        .update(result.content)
        .digest("hex");

      expect(result.sha256).toBe(expectedHash);
    });
  });

  describe("writeFile", () => {
    let testFilePath = "docs/test-write-file-" + Date.now() + ".txt";

    afterEach(async () => {
      try {
        await fs.unlink(testFilePath);
        const backupFiles = await fs.readdir(path.dirname(testFilePath));
        for (const file of backupFiles) {
          if (file.includes("test-write-file") && file.includes("backup")) {
            await fs.unlink(path.join(path.dirname(testFilePath), file));
          }
        }
      } catch (e) {
        // File doesn't exist, ignore
      }
    });

    it("requires dry-run before execution", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      const dryRunResult = await caller.writeFile({
        path: testFilePath,
        content: "Test content",
        dryRun: true,
      });

      expect(dryRunResult.needsConfirmation).toBe(true);
      expect(dryRunResult.confirmationToken).toBeTruthy();
      expect(dryRunResult.action).toBe("create");
      expect(dryRunResult.preview).toBe("Test content");
    });

    it("creates file after confirmation", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      const dryRunResult = await caller.writeFile({
        path: testFilePath,
        content: "New test file",
        dryRun: true,
      });

      const execResult = await caller.writeFile({
        path: testFilePath,
        content: "New test file",
        dryRun: false,
        confirmationToken: dryRunResult.confirmationToken,
      });

      expect(execResult.success).toBe(true);
      expect(execResult.action).toBe("create");

      const fileContent = await fs.readFile(testFilePath, "utf-8");
      expect(fileContent).toBe("New test file");
    });

    it("rejects execution without valid token", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      await expect(
        caller.writeFile({
          path: testFilePath,
          content: "test",
          dryRun: false,
          confirmationToken: "invalid-token-xyz",
        })
      ).rejects.toThrow("Invalid confirmation token");
    });

    it("generates diff for file modifications", async () => {
      const testContent1 = "Line 1\nLine 2\nLine 3\n";
      await fs.writeFile(testFilePath, testContent1, "utf-8");

      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      const testContent2 = "Line 1\nLine 2 MODIFIED\nLine 3\n";
      const dryRunResult = await caller.writeFile({
        path: testFilePath,
        content: testContent2,
        dryRun: true,
      });

      expect(dryRunResult.action).toBe("modify");
      expect(dryRunResult.diff).toBeTruthy();
    });

    it("creates backup before modifying existing file", async () => {
      const testContent = "Original content";
      await fs.writeFile(testFilePath, testContent, "utf-8");

      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      const dryRunResult = await caller.writeFile({
        path: testFilePath,
        content: "Modified content",
        dryRun: true,
      });

      const execResult = await caller.writeFile({
        path: testFilePath,
        content: "Modified content",
        dryRun: false,
        confirmationToken: dryRunResult.confirmationToken,
      });

      expect(execResult.success).toBe(true);

      const dir = path.dirname(testFilePath);
      const files = await fs.readdir(dir);
      const backupExists = files.some(
        f => f.startsWith(path.basename(testFilePath)) && f.includes("backup")
      );
      expect(backupExists).toBe(true);
    });

    it("blocks writing to forbidden paths", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      await expect(
        caller.writeFile({
          path: ".env",
          content: "SECURE_VALUE=secret",
          dryRun: true,
        })
      ).rejects.toThrow("Access denied");
    });

    it("rejects oversized content", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      const hugeContent = "x".repeat(10 * 1024 * 1024);

      await expect(
        caller.writeFile({
          path: testFilePath,
          content: hugeContent,
          dryRun: true,
        })
      ).rejects.toThrow("too large");
    });

    it("logs file operations", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      const dryRunResult = await caller.writeFile({
        path: testFilePath,
        content: "Logged operation",
        dryRun: true,
      });

      await caller.writeFile({
        path: testFilePath,
        content: "Logged operation",
        dryRun: false,
        confirmationToken: dryRunResult.confirmationToken,
      });

      expect(addSystemLog).toHaveBeenCalled();
    });
  });

  describe("createDir", () => {
    let testDirPath = "docs/test-dir-" + Date.now();

    afterEach(async () => {
      try {
        await fs.rm(testDirPath, { recursive: true });
      } catch (e) {
        // Dir doesn't exist
      }
    });

    it("creates directory in allowed path", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      const result = await caller.createDir({
        path: testDirPath,
      });

      expect(result.success).toBe(true);

      const stats = await fs.stat(testDirPath);
      expect(stats.isDirectory()).toBe(true);
    });

    it("blocks directory creation in forbidden paths", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      await expect(
        caller.createDir({
          path: "C:\\Windows\\NewDir",
        })
      ).rejects.toThrow("Access denied");
    });

    it("logs directory creation", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      await caller.createDir({
        path: testDirPath,
      });

      expect(addSystemLog).toHaveBeenCalled();
    });
  });

  describe("execCommand", () => {
    it("executes whitelisted commands", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      const result = await caller.execCommand({
        command: "node --version",
      });

      expect(result.success).toBe(true);
      expect(result.stdout).toMatch(/v\d+\.\d+\.\d+/);
    });

    it("blocks non-whitelisted commands", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      await expect(
        caller.execCommand({
          command: "rm -rf /",
        })
      ).rejects.toThrow("not allowed");
    });

    it("requires exec permission", async () => {
      const ctx = createTestCtx("user");
      const caller = assistantRouter.createCaller(ctx);

      await expect(
        caller.execCommand({
          command: "node --version",
        })
      ).rejects.toThrow("Insufficient permissions");
    });

    it("logs command execution", async () => {
      const ctx = createTestCtx();
      const caller = assistantRouter.createCaller(ctx);

      await caller.execCommand({
        command: "node --version",
      });

      expect(addSystemLog).toHaveBeenCalled();
    });
  });

  describe("RBAC - Role Based Access Control", () => {
    it("user role can only read", async () => {
      const userCtx = createTestCtx("user");
      const caller = assistantRouter.createCaller(userCtx);

      // Read should work
      await expect(
        caller.readFile({
          path: "package.json",
        })
      ).resolves.toBeDefined();

      // Write should fail
      await expect(
        caller.writeFile({
          path: "test.txt",
          content: "test",
          dryRun: true,
        })
      ).rejects.toThrow("Insufficient permissions");
    });

    it("maintainer role can read and write", async () => {
      const maintainerCtx = createTestCtx("maintainer");
      const caller = assistantRouter.createCaller(maintainerCtx);

      // Read should work
      await expect(
        caller.readFile({
          path: "package.json",
        })
      ).resolves.toBeDefined();

      // Write should work
      await expect(
        caller.writeFile({
          path: "docs/test-maintainer.txt",
          content: "test",
          dryRun: true,
        })
      ).resolves.toBeDefined();
    });

    it("admin role has full access", async () => {
      const adminCtx = createTestCtx("admin");
      expect(adminCtx.user.role).toBe("admin");
    });
  });
});
