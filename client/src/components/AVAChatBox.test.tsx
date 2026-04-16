import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AVAChatBox } from "./AVAChatBoxRefactored";
import React from "react";

// Mock framer-motion to avoid animation issues in tests
vi.mock("framer-motion", () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
    h1: ({ children, ...props }: any) => <h1 {...props}>{children}</h1>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}));

// Mock useAuth
vi.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { name: "Test User", email: "test@example.com" },
    loading: false,
    isAuthenticated: true,
  }),
}));

// Mock hooks
vi.mock("@/hooks/useSettings", () => ({
  useSettings: () => ({
    ollamaBaseUrl: "",
    ollamaAuthToken: "",
    provider: "ollama",
    model: "llama3",
    autoSendOnSilence: false,
    autoSendTyping: false,
    autoSendTypingDelay: 1000,
    continuousListening: false,
    useWebSpeech: true,
    ttsEnabled: false,
    voiceIndex: 0,
    setContinuousListening: vi.fn(),
    setUseWebSpeech: vi.fn(),
    setTtsEnabled: vi.fn(),
    setVoiceIndex: vi.fn(),
    setProvider: vi.fn(),
    setModel: vi.fn(),
    setOllamaBaseUrl: vi.fn(),
    setOllamaAuthToken: vi.fn(),
    setAutoSendOnSilence: vi.fn(),
    setAutoSendTyping: vi.fn(),
    setAutoSendTypingDelay: vi.fn(),
  }),
}));

vi.mock("@/hooks/useVoice", () => ({
  useVoice: () => ({
    isRecording: false,
    isTranscribing: false,
    continuousListening: false,
    voices: [],
    voiceIndex: 0,
    speakText: vi.fn(),
    startRecording: vi.fn(),
    stopRecording: vi.fn(),
  }),
}));

vi.mock("@/hooks/useTools", () => ({
  useTools: () => ({}),
}));

vi.mock("@/hooks/useConnection", () => ({
  useConnection: () => ({
    connectionStatus: "connected",
    connectionMessage: "Connected",
    handleTestConnection: vi.fn(),
  }),
}));

vi.mock("@/components/ui/sidebar", () => ({
  useSidebar: () => ({
    state: "expanded",
    isMobile: false,
  }),
}));

// Mock trpc
vi.mock("@/lib/trpc", () => ({
  trpc: {
    useContext: () => ({
      chat: {
        listConversations: { invalidate: vi.fn() },
        getMessages: { invalidate: vi.fn() },
      },
    }),
    chat: {
      createConversation: { useMutation: () => ({ mutateAsync: vi.fn().mockResolvedValue({ id: 1 }), isPending: false }) },
      sendMessage: { useMutation: () => ({ mutateAsync: vi.fn().mockResolvedValue({ assistantMessage: "Hello" }), isPending: false }) },
      getMessages: { useQuery: () => ({ data: [], isLoading: false }) },
      listConversations: { useQuery: () => ({ data: [], isLoading: false }) },
    },
    files: {
      processFiles: { useMutation: () => ({ mutateAsync: vi.fn(), isPending: false }) },
    },
    llm: {
      listOllamaModels: { useQuery: () => ({ data: [], isLoading: false }) },
      testConnection: { useQuery: () => ({ data: { status: "ok" }, isLoading: false }) },
      getCapabilities: { useQuery: () => ({ data: {}, isLoading: false }) },
    },
    hardware: {
      detectMode: { useQuery: () => ({ data: { mode: "ECO" }, isLoading: false }) },
    },
  },
}));

// Mock wouter
vi.mock("wouter", () => ({
  useLocation: () => ["/", vi.fn()],
}));

// Mock sub-components
vi.mock("./ChatMessagesArea", () => ({
  __esModule: true,
  default: React.forwardRef((props: any, ref: any) => <div data-testid="chat-messages-area" />),
  ChatMessagesArea: React.forwardRef((props: any, ref: any) => <div data-testid="chat-messages-area" />),
}));

vi.mock("./SettingsDropdown", () => ({
  SettingsDropdown: () => <div data-testid="settings-dropdown" />,
}));

vi.mock("./VoiceControls", () => ({
  VoiceControls: () => <div data-testid="voice-controls" />,
}));

vi.mock("./AttachmentControls", () => ({
  AttachmentControls: () => <div data-testid="attachment-controls" />,
}));

describe("AVAChatBoxRefactored", () => {
  it("renders initial state correctly (centralized input)", () => {
    render(<AVAChatBox conversationId={0} mode="ECO" />);
    
    // Check for greeting
    expect(screen.getByText(/como posso ajudar\?/i)).toBeInTheDocument();
    
    // Check for input
    const textarea = screen.getByPlaceholderText(/Pergunte qualquer coisa ao AVA\.\.\./i);
    expect(textarea).toBeInTheDocument();
    
    // Check for suggestion buttons
    expect(screen.getByText(/Escrever/i)).toBeInTheDocument();
    expect(screen.getByText(/Aprender/i)).toBeInTheDocument();
    expect(screen.getByText(/Código/i)).toBeInTheDocument();
  });

  it("can type into the input", () => {
    render(<AVAChatBox conversationId={0} mode="ECO" />);
    
    const textarea = screen.getByPlaceholderText(/Pergunte qualquer coisa ao AVA\.\.\./i);
    fireEvent.change(textarea, { target: { value: "Olá AVA" } });
    expect(textarea).toHaveValue("Olá AVA");
  });

  it("shows chat messages area when conversationId is provided", () => {
    render(<AVAChatBox conversationId={1} mode="ECO" />);
    
    // In active chat mode, the greeting should be gone (or at least the messages area should be present)
    expect(screen.getByTestId("chat-messages-area")).toBeInTheDocument();
  });
});
