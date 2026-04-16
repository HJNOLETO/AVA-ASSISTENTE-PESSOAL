import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ManusDialog } from "./ManusDialog";
import React from "react";

// Mock Radix Dialog components
vi.mock("@/components/ui/dialog", () => ({
  Dialog: ({ children, open }: any) => open ? <div data-testid="dialog-root">{children}</div> : null,
  DialogContent: ({ children, className }: any) => <div data-testid="dialog-content" className={className}>{children}</div>,
  DialogTitle: ({ children, className }: any) => <h2 data-testid="dialog-title" className={className}>{children}</h2>,
  DialogDescription: ({ children, className }: any) => <p data-testid="dialog-description" className={className}>{children}</p>,
  DialogFooter: ({ children, className }: any) => <div data-testid="dialog-footer" className={className}>{children}</div>,
  DialogHeader: ({ children, className }: any) => <div data-testid="dialog-header" className={className}>{children}</div>,
}));

describe("ManusDialog", () => {
  it("renders when open is true", () => {
    const onLogin = vi.fn();
    render(
      <ManusDialog 
        open={true} 
        onLogin={onLogin} 
        title="Test Title" 
      />
    );

    expect(screen.getByTestId("dialog-root")).toBeInTheDocument();
    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText(/Por favor, faça login com Manus/i)).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    const onLogin = vi.fn();
    render(
      <ManusDialog 
        open={false} 
        onLogin={onLogin} 
        title="Test Title" 
      />
    );

    expect(screen.queryByTestId("dialog-root")).not.toBeInTheDocument();
  });

  it("calls onLogin when the button is clicked", () => {
    const onLogin = vi.fn();
    render(
      <ManusDialog 
        open={true} 
        onLogin={onLogin} 
        title="Test Title" 
      />
    );

    const loginButton = screen.getByRole("button", { name: /Login com Manus/i });
    fireEvent.click(loginButton);
    expect(onLogin).toHaveBeenCalledTimes(1);
  });
});
