import { describe, it, expect, vi } from "vitest";

vi.mock("./db", () => {
  return {
    getUserSettings: vi.fn(async () => ({
      userId: 1,
      preferredMode: "PERFORMANCE",
      autoDetectHardware: 0,
    })),
  };
});

import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

function createCtx(): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "u",
      email: "e",
      name: "n",
      loginMethod: "manus",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: {} } as any,
    res: { clearCookie: () => {} } as any,
  };
}

describe("hardware.detectMode", () => {
  it("respects preferred mode when auto-detect disabled", async () => {
    const caller = appRouter.createCaller(createCtx());
    const result = await caller.hardware.detectMode();
    expect(result.mode).toBe("PERFORMANCE");
  });
});
