import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

export type HostMaintenanceResult = {
  ok: boolean;
  summary: string;
  details: string;
};

function parseFreeGb(text: string): number | null {
  const m = text.match(/FREE_GB=([0-9]+(?:\.[0-9]+)?)/i);
  if (!m) return null;
  const n = Number(m[1]);
  return Number.isFinite(n) ? n : null;
}

async function getFreeSpaceGb(): Promise<number | null> {
  const cmd = "$d=Get-CimInstance Win32_LogicalDisk -Filter \"DeviceID='C:'\"; if($d){ $free=[math]::Round(($d.FreeSpace/1GB),2); Write-Output \"FREE_GB=$free\" }";
  try {
    const { stdout } = await execFileAsync("powershell", ["-NoProfile", "-Command", cmd], {
      windowsHide: true,
      timeout: 25000,
    });
    return parseFreeGb(String(stdout || ""));
  } catch {
    return null;
  }
}

export async function runAutonomousHostCleanup(): Promise<HostMaintenanceResult> {
  const enabled = String(process.env.AVA_HOST_MAINTENANCE_ENABLED || "false").toLowerCase() === "true";
  if (!enabled) {
    return {
      ok: false,
      summary: "Manutenção de host desativada por política.",
      details: "Defina AVA_HOST_MAINTENANCE_ENABLED=true para permitir limpeza autônoma do host.",
    };
  }

  const before = await getFreeSpaceGb();
  const cleanupScript = [
    "$ErrorActionPreference='SilentlyContinue'",
    "$paths=@('C:\\Users\\hijon\\AppData\\Local\\Temp\\*','C:\\Windows\\Temp\\*','C:\\Windows\\SoftwareDistribution\\Download\\*','C:\\ProgramData\\Microsoft\\Windows\\DeliveryOptimization\\Cache\\*','C:\\Users\\hijon\\AppData\\Local\\D3DSCache\\*','C:\\Users\\hijon\\AppData\\Local\\NVIDIA\\DXCache\\*','C:\\Users\\hijon\\AppData\\Local\\NVIDIA\\GLCache\\*','C:\\Windows\\Minidump\\*','C:\\Windows\\LiveKernelReports\\*')",
    "Stop-Service wuauserv -Force",
    "Stop-Service bits -Force",
    "foreach($p in $paths){ Remove-Item -Path $p -Recurse -Force -ErrorAction SilentlyContinue }",
    "$patterns=@('*.exe','*.dll','*.bat','*.cmd','*.ps1','*.vbs','*.js','*.hta')",
    "foreach($pat in $patterns){ Remove-Item -Path (Join-Path 'C:\\Users\\hijon\\AppData\\Local\\Temp' $pat) -Force -ErrorAction SilentlyContinue; Remove-Item -Path (Join-Path 'C:\\Windows\\Temp' $pat) -Force -ErrorAction SilentlyContinue }",
    "Clear-RecycleBin -Force -ErrorAction SilentlyContinue",
    "Start-Service bits",
    "Start-Service wuauserv",
    "Write-Output 'HOST_CLEANUP_DONE'",
  ].join("; ");

  try {
    const { stdout, stderr } = await execFileAsync("powershell", ["-NoProfile", "-Command", cleanupScript], {
      windowsHide: true,
      timeout: 240000,
      maxBuffer: 2 * 1024 * 1024,
    });

    const after = await getFreeSpaceGb();
    const delta = before != null && after != null ? Math.round((after - before) * 100) / 100 : null;
    const summary = delta != null
      ? `Limpeza concluída. Espaço livre no C: ${before} GB -> ${after} GB (delta +${delta} GB).`
      : "Limpeza concluída. Não foi possível calcular delta de espaço com precisão.";

    return {
      ok: true,
      summary,
      details: [String(stdout || "").trim(), String(stderr || "").trim()].filter(Boolean).join("\n"),
    };
  } catch (err: any) {
    return {
      ok: false,
      summary: "Falha na limpeza autônoma do host.",
      details: String(err?.message || err),
    };
  }
}
