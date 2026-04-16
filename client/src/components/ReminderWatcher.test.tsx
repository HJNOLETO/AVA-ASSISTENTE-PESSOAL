import { act, render, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReminderWatcher from "./ReminderWatcher";

const { toastFn, refetchMock, mutateAsyncMock, speakMock, state } = vi.hoisted(() => {
  const toast = vi.fn() as unknown as ((...args: any[]) => any) & {
    info: ReturnType<typeof vi.fn>;
    error: ReturnType<typeof vi.fn>;
  };
  toast.info = vi.fn();
  toast.error = vi.fn();

  return {
    toastFn: toast,
    refetchMock: vi.fn().mockResolvedValue(undefined),
    mutateAsyncMock: vi.fn().mockResolvedValue(undefined),
    speakMock: vi.fn(),
    state: {
      tasksMock: undefined as any[] | undefined,
    },
  };
});

vi.mock("sonner", () => ({
  toast: toastFn,
}));

vi.mock("@/lib/trpc", () => ({
  trpc: {
    proactiveTasks: {
      list: {
        useQuery: () => ({
          data: state.tasksMock,
          refetch: refetchMock,
        }),
      },
      update: {
        useMutation: () => ({
          mutateAsync: mutateAsyncMock,
        }),
      },
    },
  },
}));

describe("ReminderWatcher", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    state.tasksMock = undefined;

    (globalThis as any).SpeechSynthesisUtterance = function (this: any, text: string) {
      this.text = text;
      this.lang = "pt-BR";
      this.rate = 1;
    };

    Object.defineProperty(window, "speechSynthesis", {
      value: {
        speak: speakMock,
      },
      writable: true,
      configurable: true,
    });
  });

  it("dispara lembrete com voz e toast quando tarefa watcher vence", async () => {
    state.tasksMock = [
      {
        id: 10,
        title: "Tomar água",
        description: "Hora da hidratação",
        type: "watcher",
        status: "active",
        nextRun: new Date(Date.now() - 5_000).toISOString(),
      },
    ];

    render(<ReminderWatcher />);

    await waitFor(() => {
      expect(toastFn).toHaveBeenCalledTimes(1);
    });

    expect(speakMock).toHaveBeenCalledTimes(1);
    const [title, options] = (toastFn as any).mock.calls[0] as [string, any];
    expect(title).toContain("LEMBRETE");
    expect(options.description).toContain("hidratação");
    expect(options.action).toBeDefined();
    expect(options.cancel).toBeDefined();
  });

  it("conclui lembrete via ação do toast", async () => {
    state.tasksMock = [
      {
        id: 11,
        title: "Revisar relatório",
        description: "Encerrar pendência",
        type: "watcher",
        status: "active",
        nextRun: new Date(Date.now() - 5_000).toISOString(),
      },
    ];

    render(<ReminderWatcher />);

    await waitFor(() => {
      expect(toastFn).toHaveBeenCalledTimes(1);
    });

    const [, options] = (toastFn as any).mock.calls[0] as [string, any];
    await act(async () => {
      await options.action.onClick();
    });

    expect(mutateAsyncMock).toHaveBeenCalledWith({
      id: 11,
      status: "completed",
    });
    expect(refetchMock).toHaveBeenCalled();
  });

  it("adia lembrete via botão de soneca", async () => {
    state.tasksMock = [
      {
        id: 12,
        title: "Alongar",
        description: "Pausa rápida",
        type: "watcher",
        status: "active",
        nextRun: new Date(Date.now() - 5_000).toISOString(),
      },
    ];

    render(<ReminderWatcher />);

    await waitFor(() => {
      expect(toastFn).toHaveBeenCalledTimes(1);
    });

    const [, options] = (toastFn as any).mock.calls[0] as [string, any];
    await act(async () => {
      await options.cancel.onClick();
    });

    expect(mutateAsyncMock).toHaveBeenCalledWith(
      expect.objectContaining({
        id: 12,
        status: "active",
        nextRun: expect.any(Date),
      })
    );
    expect(toastFn.info).toHaveBeenCalled();
    expect(refetchMock).toHaveBeenCalled();
  });
});
