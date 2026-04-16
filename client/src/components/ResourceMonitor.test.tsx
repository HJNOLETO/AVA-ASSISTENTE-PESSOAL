import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ResourceMonitor } from "./ResourceMonitor";
import React from "react";

// Mock trpc
vi.mock("@/lib/trpc", () => ({
  trpc: {
    hardware: {
      getMetrics: {
        useQuery: () => ({
          data: { cpuUsage: 45, ramUsage: 60, ramAvailable: 8, gpuUsage: 20, gpuVram: 4 },
          isLoading: false,
        }),
      },
      detectMode: {
        useQuery: () => ({ data: { mode: "STANDARD" }, isLoading: false }),
      },
      recordSnapshot: {
        useMutation: () => ({ mutate: vi.fn() }),
      },
    },
  },
}));

// Mock recharts
vi.mock("recharts", () => ({
  ResponsiveContainer: ({ children }: any) => <div>{children}</div>,
  LineChart: ({ children }: any) => <div>{children}</div>,
  Line: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  CartesianGrid: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
}));

describe("ResourceMonitor", () => {
  it("renders CPU and RAM metrics", () => {
    render(<ResourceMonitor />);

    expect(screen.getByText("CPU")).toBeInTheDocument();
    expect(screen.getByText("45%")).toBeInTheDocument();
    
    expect(screen.getByText("RAM")).toBeInTheDocument();
    expect(screen.getByText("60%")).toBeInTheDocument();
  });

  it("renders GPU metrics if available", () => {
    render(<ResourceMonitor />);

    expect(screen.getByText("GPU")).toBeInTheDocument();
    expect(screen.getByText("20%")).toBeInTheDocument();
  });
});
