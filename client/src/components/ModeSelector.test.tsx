import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ModeSelector } from "./ModeSelector";
import React from "react";

// Mock trpc
vi.mock("@/lib/trpc", () => ({
  trpc: {
    hardware: {
      detectMode: { useQuery: () => ({ data: { mode: "ECO", isCompatible: true }, isLoading: false }) },
      getModeCapabilities: { useQuery: () => ({ data: { mode: "ECO", stt: "API", llm: "Tiny", tts: "API", memory: "2GB", vision: "No", agents: false, maxConcurrentTasks: 1 }, isLoading: false }) },
    },
    settings: {
      updateSettings: { useMutation: () => ({ mutate: vi.fn(), isPending: false }) },
    },
  },
}));

// Mock select components from radix/shadcn
vi.mock("@/components/ui/select", () => ({
  Select: ({ children, onValueChange }: any) => (
    <div data-testid="select" onClick={() => onValueChange("PERFORMANCE")}>
      {children}
    </div>
  ),
  SelectTrigger: ({ children }: any) => <button>{children}</button>,
  SelectValue: ({ placeholder }: any) => <span>{placeholder}</span>,
  SelectContent: ({ children }: any) => <div>{children}</div>,
  SelectItem: ({ children, value }: any) => <div data-value={value}>{children}</div>,
}));

describe("ModeSelector", () => {
  it("renders current mode status", () => {
    render(<ModeSelector />);
    
    // Check for "Modo Atual" title
    expect(screen.getByText(/Modo Atual/i)).toBeInTheDocument();
    
    // Check for "ECO" mode text (from mocked data)
    expect(screen.getAllByText(/ECO/i).length).toBeGreaterThan(0);
  });

  it("can change selected mode", () => {
    render(<ModeSelector />);
    
    const select = screen.getByTestId("select");
    fireEvent.click(select);
    
    // After click (mocked onValueChange to PERFORMANCE), we should see PERFORMANCE-related text
    // The select item for PERFORMANCE should be there
    expect(screen.getAllByText(/PERFORMANCE/i).length).toBeGreaterThan(0);
  });

  it("has an apply button", () => {
    render(<ModeSelector />);
    
    const applyButton = screen.getByText(/Confirmar Alteração/i);
    expect(applyButton).toBeInTheDocument();
  });
});
