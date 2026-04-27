import { exec } from "node:child_process";
import { promisify } from "node:util";

const execAsync = promisify(exec);

export async function runSandboxed(command: string): Promise<{ stdout: string; stderr: string }> {
  const result = await execAsync(command, {
    timeout: 5000,
    maxBuffer: 10 * 1024 * 1024,
    windowsHide: true,
    env: {
      ...process.env,
      PATH: process.env.PATH || "",
    },
  });

  return {
    stdout: String(result.stdout || ""),
    stderr: String(result.stderr || ""),
  };
}
