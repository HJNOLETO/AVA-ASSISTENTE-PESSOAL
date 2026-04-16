import { useState, useEffect } from "react";

interface UseSettingsReturn {
  // Configurações de voz
  autoSendOnSilence: boolean;
  autoSendTyping: boolean;
  autoSendTypingDelay: number;
  continuousListening: boolean;
  useWebSpeech: boolean;
  ttsEnabled: boolean;
  voiceIndex: number;
  
  // Configurações de LLM
  provider: "forge" | "ollama";
  model: string;
  ollamaBaseUrl: string;
  ollamaAuthToken: string;
  
  // Módulo Atual
  currentModule: "GENERAL" | "LEGAL" | "MEDICAL" | "DEVELOPER";
  
  // Funções de atualização
  setAutoSendOnSilence: (value: boolean) => void;
  setAutoSendTyping: (value: boolean) => void;
  setAutoSendTypingDelay: (value: number) => void;
  setContinuousListening: (value: boolean) => void;
  setUseWebSpeech: (value: boolean) => void;
  setTtsEnabled: (value: boolean) => void;
  setVoiceIndex: (value: number) => void;
  setProvider: (value: "forge" | "ollama") => void;
  setModel: (value: string) => void;
  setOllamaBaseUrl: (value: string) => void;
  setOllamaAuthToken: (value: string) => void;
  setCurrentModule: (value: "GENERAL" | "LEGAL" | "MEDICAL" | "DEVELOPER") => void;
}

export function useSettings(): UseSettingsReturn {
  // Configurações de voz
  const [autoSendOnSilence, setAutoSendOnSilence] = useState<boolean>(
    localStorage.getItem("ava-autosend-silence") !== "false"
  );
  const [autoSendTyping, setAutoSendTyping] = useState<boolean>(
    localStorage.getItem("ava-autosend-typing") === "true"
  );
  const [autoSendTypingDelay, setAutoSendTypingDelay] = useState<number>(() => {
    const v = localStorage.getItem("ava-autosend-typing-delay");
    return v ? parseInt(v) : 1500;
  });
  const [continuousListening, setContinuousListening] = useState<boolean>(
    localStorage.getItem("ava-continuous-listen") === "true"
  );
  const [useWebSpeech, setUseWebSpeech] = useState<boolean>(
    localStorage.getItem("ava-use-webspeech") === "true"
  );
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(
    localStorage.getItem("ava-tts-enabled") === "true"
  );
  const [voiceIndex, setVoiceIndex] = useState<number>(() => {
    const v = localStorage.getItem("ava-tts-voice-index");
    return v ? parseInt(v) : -1;
  });

  // Configurações de LLM
  const [provider, setProvider] = useState<"forge" | "ollama">(
    (localStorage.getItem("ava-llm-provider") as "forge" | "ollama") || "ollama"
  );
  const [model, setModel] = useState<string>(
    localStorage.getItem("ava-llm-model") || "llama3.1:8b"
  );
  const [ollamaBaseUrl, setOllamaBaseUrl] = useState<string>(
    localStorage.getItem("ava-ollama-base-url") || ""
  );
  const [ollamaAuthToken, setOllamaAuthToken] = useState<string>(
    localStorage.getItem("ava-ollama-auth-token") || ""
  );

  // Módulo Atual
  const [currentModule, setCurrentModule] = useState<"GENERAL" | "LEGAL" | "MEDICAL" | "DEVELOPER">(
    (localStorage.getItem("ava-current-module") as any) || "GENERAL"
  );

  // Salvar configurações no localStorage
  useEffect(() => {
    localStorage.setItem("ava-autosend-silence", String(autoSendOnSilence));
  }, [autoSendOnSilence]);

  useEffect(() => {
    localStorage.setItem("ava-autosend-typing", String(autoSendTyping));
  }, [autoSendTyping]);

  useEffect(() => {
    localStorage.setItem("ava-autosend-typing-delay", String(autoSendTypingDelay));
  }, [autoSendTypingDelay]);

  useEffect(() => {
    localStorage.setItem("ava-continuous-listen", String(continuousListening));
  }, [continuousListening]);

  useEffect(() => {
    localStorage.setItem("ava-use-webspeech", String(useWebSpeech));
  }, [useWebSpeech]);

  useEffect(() => {
    localStorage.setItem("ava-tts-enabled", String(ttsEnabled));
  }, [ttsEnabled]);

  useEffect(() => {
    localStorage.setItem("ava-tts-voice-index", String(voiceIndex));
  }, [voiceIndex]);

  useEffect(() => {
    localStorage.setItem("ava-llm-provider", provider);
  }, [provider]);

  useEffect(() => {
    localStorage.setItem("ava-llm-model", model);
  }, [model]);

  useEffect(() => {
    localStorage.setItem("ava-ollama-base-url", ollamaBaseUrl);
  }, [ollamaBaseUrl]);

  useEffect(() => {
    localStorage.setItem("ava-ollama-auth-token", ollamaAuthToken);
  }, [ollamaAuthToken]);

  useEffect(() => {
    localStorage.setItem("ava-current-module", currentModule);
  }, [currentModule]);

  return {
    // Configurações de voz
    autoSendOnSilence,
    autoSendTyping,
    autoSendTypingDelay,
    continuousListening,
    useWebSpeech,
    ttsEnabled,
    voiceIndex,
    
    // Configurações de LLM
    provider,
    model,
    ollamaBaseUrl,
    ollamaAuthToken,
    
    // Módulo Atual
    currentModule,
    
    // Funções de atualização
    setAutoSendOnSilence,
    setAutoSendTyping,
    setAutoSendTypingDelay,
    setContinuousListening,
    setUseWebSpeech,
    setTtsEnabled,
    setVoiceIndex,
    setProvider,
    setModel,
    setOllamaBaseUrl,
    setOllamaAuthToken,
    setCurrentModule,
  };
}