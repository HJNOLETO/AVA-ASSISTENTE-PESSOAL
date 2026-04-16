import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ErrorBoundary from "./ErrorBoundary";
import React from "react";

const ProblematicComponent = () => {
  throw new Error("Test Error");
};

describe("ErrorBoundary", () => {
  it("renders children when no error occurs", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child-content">Safe Content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId("child-content")).toBeInTheDocument();
  });

  it("renders error message when a child component throws", () => {
    // Suppress console.error for this test as throwing is expected
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ProblematicComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText(/Ops! Algo deu errado/i)).toBeInTheDocument();
    expect(screen.getByText(/Test Error/i)).toBeInTheDocument();
    expect(screen.getByText(/Recarregar Página/i)).toBeInTheDocument();

    consoleSpy.mockRestore();
  });
});
