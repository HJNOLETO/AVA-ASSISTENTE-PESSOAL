import os from "os";
import { execSync } from "child_process";

export type OperationMode = "ECO" | "STANDARD" | "PERFORMANCE";

export interface HardwareInfo {
  cpuCores: number;
  cpuModel: string;
  totalRam: number; // in GB
  availableRam: number; // in GB
  gpuVram?: number; // in GB, optional
  storageSize: number; // in GB
  platform: string;
}

export interface HardwareMetrics {
  cpuUsage: number; // percentage 0-100
  ramUsage: number; // percentage 0-100
  ramAvailable: number; // in GB
  gpuUsage?: number; // percentage 0-100
  gpuVram?: number; // in GB
}

export interface ModeCapabilities {
  mode: OperationMode;
  stt: string;
  llm: string;
  tts: string;
  memory: string;
  vision: string;
  agents: boolean;
  maxConcurrentTasks: number;
}

/**
 * Get system hardware information
 */
export function getHardwareInfo(): HardwareInfo {
  const cpus = os.cpus();
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();

  return {
    cpuCores: cpus.length,
    cpuModel: cpus[0]?.model || "Unknown CPU",
    totalRam: Math.round(totalMemory / (1024 ** 3) * 100) / 100,
    availableRam: Math.round(freeMemory / (1024 ** 3) * 100) / 100,
    gpuVram: undefined, // GPU detection would require system-specific tools
    storageSize: 0, // Would require filesystem API
    platform: os.platform(),
  };
}

/**
 * Get current hardware metrics
 */
export function getHardwareMetrics(): HardwareMetrics {
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const usedMemory = totalMemory - freeMemory;
  const ramUsage = Math.round((usedMemory / totalMemory) * 100);

  // CPU usage calculation (simplified - average of all cores)
  const cpus = os.cpus();
  let totalIdle = 0;
  let totalTick = 0;

  cpus.forEach((cpu) => {
    for (const type in cpu.times) {
      totalTick += cpu.times[type as keyof typeof cpu.times];
    }
    totalIdle += cpu.times.idle;
  });

  const cpuUsage = Math.round(100 - ~~(100 * totalIdle / totalTick));

  return {
    cpuUsage: Math.max(0, Math.min(100, cpuUsage)),
    ramUsage,
    ramAvailable: Math.round(freeMemory / (1024 ** 3) * 100) / 100,
    gpuUsage: undefined,
    gpuVram: undefined,
  };
}

/**
 * Check if specific heavy software is running (Unreal Engine, Blender, etc.)
 */
export function getRunningHeavySoftware(): string[] {
  try {
    const heavyProcesses = ["UnrealEditor.exe", "Blender.exe", "Unity.exe", "Premiere.exe"];
    const output = execSync('tasklist /FI "STATUS eq running" /FO CSV', { encoding: 'utf8' });
    
    return heavyProcesses.filter(proc => output.includes(proc));
  } catch (error) {
    // If tasklist fails (e.g. non-windows), return empty
    return [];
  }
}

/**
 * Detect optimal operation mode based on available hardware and running software
 */
export function detectOperationMode(
  autoDetect: boolean = true,
  preferredMode?: OperationMode
): OperationMode {
  if (!autoDetect && preferredMode) {
    return preferredMode;
  }

  const metrics = getHardwareMetrics();
  const info = getHardwareInfo();
  const heavySoftware = getRunningHeavySoftware();

  // If heavy software is running, force ECO or STANDARD regardless of hardware
  if (heavySoftware.length > 0) {
    // Even on good hardware, if Unreal/Blender is running, we should downgrade to save resources
    if (info.availableRam >= 16 && info.cpuCores >= 8) {
      return "STANDARD"; // Downgrade from PERFORMANCE to STANDARD
    }
    return "ECO"; // Downgrade to ECO for mid-range or lower
  }

  // PERFORMANCE: High-end hardware
  if (info.totalRam >= 16 && info.cpuCores >= 8) {
    return "PERFORMANCE";
  }

  // STANDARD: Mid-range hardware with decent resources
  if (info.totalRam >= 6 && info.cpuCores >= 4 && metrics.ramUsage < 90) {
    return "STANDARD";
  }

  // ECO: Limited resources or high load
  return "ECO";
}

/**
 * Get capabilities for each operation mode
 */
export function getModeCapabilities(mode: OperationMode): ModeCapabilities {
  const capabilities: Record<OperationMode, ModeCapabilities> = {
    ECO: {
      mode: "ECO",
      stt: "Whisper Tiny (40MB RAM)",
      llm: "Claude 3.5 Haiku (API)",
      tts: "Piper TTS (Local)",
      memory: "SQLite (Keyword Search)",
      vision: "Gemini Flash (API)",
      agents: false,
      maxConcurrentTasks: 1,
    },
    STANDARD: {
      mode: "STANDARD",
      stt: "Whisper Base (74MB)",
      llm: "Phi-3 Mini 3.8B (Local)",
      tts: "Piper TTS (Enhanced)",
      memory: "SQLite-vec (Local Vector)",
      vision: "Qwen2-VL 2B (Local)",
      agents: true,
      maxConcurrentTasks: 2,
    },
    PERFORMANCE: {
      mode: "PERFORMANCE",
      stt: "Whisper Small (466MB)",
      llm: "Llama 3.1 8B (Local)",
      tts: "Coqui TTS (Voice Cloning)",
      memory: "SQLite-vec + Reranking",
      vision: "Llava-Phi-3 (Multimodal)",
      agents: true,
      maxConcurrentTasks: 4,
    },
  };

  return capabilities[mode];
}

/**
 * Get hardware recommendations for each mode
 */
export function getHardwareRequirements() {
  return {
    ECO: {
      minRam: 2,
      minCores: 2,
      description: "Works on older hardware (i7-2600, 16GB DDR3)",
    },
    STANDARD: {
      minRam: 6,
      minCores: 4,
      description: "Mid-range hardware (Ryzen 3000, 32GB DDR4)",
    },
    PERFORMANCE: {
      minRam: 16,
      minCores: 8,
      description: "High-end hardware (Ryzen 5000+, 64GB DDR5)",
    },
  };
}

/**
 * Check if hardware meets minimum requirements for a mode
 */
export function isHardwareCompatible(mode: OperationMode): boolean {
  const info = getHardwareInfo();
  const requirements = getHardwareRequirements();
  const req = requirements[mode];

  return info.totalRam >= req.minRam && info.cpuCores >= req.minCores;
}

/**
 * Get recommended mode based on current hardware
 */
export function getRecommendedMode(): OperationMode {
  const info = getHardwareInfo();

  if (info.totalRam >= 16 && info.cpuCores >= 8) {
    return "PERFORMANCE";
  }
  if (info.totalRam >= 6 && info.cpuCores >= 4) {
    return "STANDARD";
  }
  return "ECO";
}
