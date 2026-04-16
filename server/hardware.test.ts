import { describe, it, expect } from "vitest";
import {
  getHardwareInfo,
  getHardwareMetrics,
  detectOperationMode,
  getModeCapabilities,
  isHardwareCompatible,
  getRecommendedMode,
} from "./hardware";

describe("Hardware Detection", () => {
  it("should get hardware info", () => {
    const info = getHardwareInfo();

    expect(info).toHaveProperty("cpuCores");
    expect(info).toHaveProperty("cpuModel");
    expect(info).toHaveProperty("totalRam");
    expect(info).toHaveProperty("availableRam");
    expect(info).toHaveProperty("storageSize");

    expect(info.cpuCores).toBeGreaterThan(0);
    expect(info.totalRam).toBeGreaterThan(0);
    expect(info.availableRam).toBeGreaterThan(0);
  });

  it("should get hardware metrics", () => {
    const metrics = getHardwareMetrics();

    expect(metrics).toHaveProperty("cpuUsage");
    expect(metrics).toHaveProperty("ramUsage");
    expect(metrics).toHaveProperty("ramAvailable");

    expect(metrics.cpuUsage).toBeGreaterThanOrEqual(0);
    expect(metrics.cpuUsage).toBeLessThanOrEqual(100);
    expect(metrics.ramUsage).toBeGreaterThanOrEqual(0);
    expect(metrics.ramUsage).toBeLessThanOrEqual(100);
    expect(metrics.ramAvailable).toBeGreaterThan(0);
  });

  it("should detect operation mode", () => {
    const mode = detectOperationMode();

    expect(["ECO", "STANDARD", "PERFORMANCE"]).toContain(mode);
  });

  it("should respect preferred mode when auto-detect is disabled", () => {
    const mode = detectOperationMode(false, "PERFORMANCE");

    expect(mode).toBe("PERFORMANCE");
  });

  it("should get mode capabilities", () => {
    const ecoCapabilities = getModeCapabilities("ECO");

    expect(ecoCapabilities.mode).toBe("ECO");
    expect(ecoCapabilities).toHaveProperty("stt");
    expect(ecoCapabilities).toHaveProperty("llm");
    expect(ecoCapabilities).toHaveProperty("tts");
    expect(ecoCapabilities).toHaveProperty("memory");
    expect(ecoCapabilities).toHaveProperty("vision");
    expect(ecoCapabilities).toHaveProperty("agents");
    expect(ecoCapabilities).toHaveProperty("maxConcurrentTasks");

    expect(ecoCapabilities.agents).toBe(false);
    expect(ecoCapabilities.maxConcurrentTasks).toBe(1);
  });

  it("should have increasing capabilities across modes", () => {
    const eco = getModeCapabilities("ECO");
    const standard = getModeCapabilities("STANDARD");
    const performance = getModeCapabilities("PERFORMANCE");

    expect(eco.maxConcurrentTasks).toBeLessThan(standard.maxConcurrentTasks);
    expect(standard.maxConcurrentTasks).toBeLessThan(performance.maxConcurrentTasks);
  });

  it("should check hardware compatibility", () => {
    const compatible = isHardwareCompatible("ECO");

    expect(typeof compatible).toBe("boolean");
  });

  it("should get recommended mode", () => {
    const mode = getRecommendedMode();

    expect(["ECO", "STANDARD", "PERFORMANCE"]).toContain(mode);
  });

  it("should have consistent mode capabilities", () => {
    const modes: ("ECO" | "STANDARD" | "PERFORMANCE")[] = ["ECO", "STANDARD", "PERFORMANCE"];

    modes.forEach((mode) => {
      const capabilities = getModeCapabilities(mode);

      expect(capabilities.mode).toBe(mode);
      expect(capabilities.stt).toBeTruthy();
      expect(capabilities.llm).toBeTruthy();
      expect(capabilities.tts).toBeTruthy();
      expect(capabilities.memory).toBeTruthy();
      expect(capabilities.vision).toBeTruthy();
      expect(capabilities.maxConcurrentTasks).toBeGreaterThan(0);
    });
  });
});
