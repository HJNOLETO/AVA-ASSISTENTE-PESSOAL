import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Send, Mic, MicOff, Volume2, Settings, X, AlertCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuCheckboxItem,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
} from "@/components/ui/dropdown-menu";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";

// ============================================================================
// TYPE DECLARATIONS FOR WEB APIs
// ============================================================================

declare global {
  interface Window {
    SpeechRecognition?: new () => SpeechRecognition;
    webkitSpeechRecognition?: new () => SpeechRecognition;
    webkitAudioContext?: new () => AudioContext;
  }

  interface SpeechRecognition extends EventTarget {
    lang: string;
    interimResults: boolean;
    continuous: boolean;
    maxAlternatives?: number;
    start(): void;
    stop(): void;
    abort(): void;
    onresult: ((event: SpeechRecognitionEvent) => void) | null;
    onend: (() => void) | null;
    onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
    onstart: (() => void) | null;
  }

  interface SpeechRecognitionEvent extends Event {
    readonly resultIndex: number;
    readonly results: SpeechRecognitionResultList;
  }

  interface SpeechRecognitionResultList {
    readonly length: number;
    item(index: number): SpeechRecognitionResult;
    [index: number]: SpeechRecognitionResult;
  }

  interface SpeechRecognitionResult {
    readonly isFinal: boolean;
    readonly length: number;
    item(index: number): SpeechRecognitionAlternative;
    [index: number]: SpeechRecognitionAlternative;
  }

  interface SpeechRecognitionAlternative {
    readonly transcript: string;
    readonly confidence: number;
  }

  interface SpeechRecognitionErrorEvent extends Event {
    readonly error: string;
    readonly message?: string;
  }
}

// ============================================================================
// TYPES
// ============================================================================

type Provider = "forge" | "ollama";
type Role = "user" | "assistant" | "system";
type MimeType = "image/png" | "image/jpeg" | "image/webp" | "image/gif";
type AudioMime = "audio/webm" | "audio/mp3" | "audio/mpeg" | "audio/wav" | "audio/ogg" | "audio/m4a";

interface Message {
  id: number;
  role: Role;
  content: string;
  createdAt: Date;
}

interface AttachedImage {
  base64: string;
  mime: MimeType;
}

interface ModelCapabilities {
  supportsVision: boolean;
  supportsTools: boolean;
  supportsThinking: boolean;
  supportsJsonSchema: boolean;
}

interface TranscriptionResult {
  text?: string;
  error?: string;
}

interface AVAChatBoxProps {
  conversationId: number;
  mode: "ECO" | "STANDARD" | "PERFORMANCE";
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  return [storedValue, setValue];
}

function useTextToSpeech() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIndex, setVoiceIndex] = useLocalStorage<number>("ava-tts-voice-index", -1);
  const [enabled, setEnabled] = useLocalStorage<boolean>("ava-tts-enabled", false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const updateVoices = () => setVoices(window.speechSynthesis.getVoices());
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window) || !enabled) return;

    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "pt-BR";

    if (voiceIndex >= 0 && voices[voiceIndex]) {
      utter.voice = voices[voiceIndex];
    }

    window.speechSynthesis.speak(utter);
  }, [enabled, voiceIndex, voices]);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  return {
    voices,
    voiceIndex,
    setVoiceIndex,
    enabled,
    setEnabled,
    speak,
    stop,
  };
}

function useSpeechRecognition(options: {
  onResult: (text: string, isFinal: boolean) => void;
  onEnd?: () => void;
  onError?: (error: Error) => void;
  language?: string;
}) {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const [isListening, setIsListening] = useState(false);

  const start = useCallback((continuous = false) => {
    if (typeof window === "undefined") return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      options.onError?.(new Error("Speech Recognition not supported"));
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = options.language || "pt-BR";
    recognition.interimResults = true;
    recognition.continuous = continuous;

    let finalTranscript = "";

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interim += transcript;
        }
      }
      options.onResult(finalTranscript || interim, !interim);
    };

    recognition.onend = () => {
      setIsListening(false);
      recognitionRef.current = null;
      options.onEnd?.();
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setIsListening(false);
      recognitionRef.current = null;
      options.onError?.(new Error(`Speech recognition error: ${event.error}`));
    };

    recognitionRef.current = recognition;
    recognition.start();
    setIsListening(true);
  }, [options]);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  return { isListening, start, stop };
}

function useVoiceActivityDetection(options: {
  onSegment: (blob: Blob) => void;
  threshold?: number;
  silenceMs?: number;
  minSpeechMs?: number;
}) {
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const speakingRef = useRef(false);
  const lastSpeechRef = useRef<number>(0);
  const currentSpeechStartRef = useRef<number | null>(null);

  const { threshold = 0.03, silenceMs = 800, minSpeechMs = 400 } = options;

  const computeRms = useCallback((buffer: Uint8Array) => {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      const v = (buffer[i] - 128) / 128;
      sum += v * v;
    }
    return Math.sqrt(sum / buffer.length);
  }, []);

  const start = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) {
        throw new Error("AudioContext not supported");
      }
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (speakingRef.current && e.data?.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.start(500);

      intervalRef.current = window.setInterval(() => {
        if (!analyserRef.current) return;
        const buffer = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteTimeDomainData(buffer);
        const rms = computeRms(buffer);
        const now = Date.now();

        if (rms > threshold) {
          speakingRef.current = true;
          lastSpeechRef.current = now;
          if (currentSpeechStartRef.current === null) {
            currentSpeechStartRef.current = now;
          }
        } else if (speakingRef.current && now - lastSpeechRef.current > silenceMs) {
          const duration = currentSpeechStartRef.current ? now - currentSpeechStartRef.current : 0;
          speakingRef.current = false;
          currentSpeechStartRef.current = null;

          if (duration >= minSpeechMs && chunksRef.current.length > 0) {
            const blob = new Blob(chunksRef.current, { type: "audio/webm" });
            chunksRef.current = [];
            options.onSegment(blob);
          } else {
            chunksRef.current = [];
          }
        }
      }, 200);
    } catch (error) {
      console.error("VAD start error:", error);
      throw error;
    }
  }, [computeRms, minSpeechMs, options, silenceMs, threshold]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    recorderRef.current?.stop();
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    chunksRef.current = [];
    speakingRef.current = false;
  }, []);

  return { start, stop };
}

// ============================================================================
// UTILS
// ============================================================================

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1] || "";
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

const validateAudioMime = (type: string): AudioMime => {
  const supported: AudioMime[] = ["audio/webm", "audio/mp3", "audio/mpeg", "audio/wav", "audio/ogg", "audio/m4a"];
  return supported.includes(type as AudioMime) ? (type as AudioMime) : "audio/webm";
};

// ============================================================================
// SUB-COMPONENTS
// ============================================================================

const MessageBubble = memo(({ message, onSpeak }: { message: Message; onSpeak?: (text: string) => void }) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <Card
        className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-primary-foreground"
            : isSystem
            ? "bg-destructive/10 text-destructive border border-destructive/20"
            : "bg-muted text-card-foreground border border-border"
        }`}
      >
        <div className="text-sm leading-relaxed">
          {message.role === "assistant" ? (
            <Streamdown>{message.content}</Streamdown>
          ) : (
            message.content
          )}
        </div>

        <div className={`text-xs mt-2 ${isUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {formatDistanceToNow(message.createdAt, { addSuffix: true, locale: ptBR })}
        </div>

        {!isUser && !isSystem && onSpeak && (
          <div className="mt-2 flex justify-end">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSpeak(message.content)}
              className="h-8 px-2"
              aria-label="Ouvir mensagem"
            >
              <Volume2 className="h-4 w-4 mr-1" />
              <span className="text-xs">Ouvir</span>
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
});
MessageBubble.displayName = "MessageBubble";

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function AVAChatBox({ conversationId, mode }: AVAChatBoxProps) {
  // Estado principal
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachedImage, setAttachedImage] = useState<AttachedImage | null>(null);

  // Configurações persistentes
  const [provider, setProvider] = useLocalStorage<Provider>("ava-llm-provider", "ollama");
  const [model, setModel] = useLocalStorage<string>("ava-llm-model", "llama3.1:8b");
  const [ollamaBaseUrl, setOllamaBaseUrl] = useLocalStorage<string>("ava-ollama-base-url", "");
  const [ollamaAuthToken, setOllamaAuthToken] = useLocalStorage<string>("ava-ollama-auth-token", "");
  const [useWebSpeech, setUseWebSpeech] = useLocalStorage<boolean>("ava-use-webspeech", false);
  const [autoSendOnSilence, setAutoSendOnSilence] = useLocalStorage<boolean>("ava-autosend-silence", true);
  const [autoSendTyping, setAutoSendTyping] = useLocalStorage<boolean>("ava-autosend-typing", false);
  const [autoSendTypingDelay, setAutoSendTypingDelay] = useLocalStorage<number>("ava-autosend-typing-delay", 1500);
  const [continuousListening, setContinuousListening] = useLocalStorage<boolean>("ava-continuous-listen", false);

  // TTS
  const tts = useTextToSpeech();

  // Refs
  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<number | null>(null);
  const voiceSendTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Queries TRPC
  const modelsQuery = trpc.llm.listOllamaModels.useQuery(
    { baseUrl: ollamaBaseUrl || undefined, authToken: ollamaAuthToken || undefined },
    { refetchOnWindowFocus: false, enabled: provider === "ollama" }
  );

  const capabilitiesQuery = trpc.llm.getCapabilities.useQuery(
    { provider, model },
    { refetchOnWindowFocus: false }
  );

  const capabilities = useMemo<ModelCapabilities | null>(() => {
    if (!capabilitiesQuery.data) return null;
    return {
      supportsVision: !!capabilitiesQuery.data.supportsVision,
      supportsTools: !!capabilitiesQuery.data.supportsTools,
      supportsThinking: !!capabilitiesQuery.data.supportsThinking,
      supportsJsonSchema: !!capabilitiesQuery.data.supportsJsonSchema,
    };
  }, [capabilitiesQuery.data]);

  const { data: initialMessages } = trpc.chat.getMessages.useQuery({ conversationId });
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const transcribeMutation = trpc.voice.transcribe.useMutation();

  // Efeitos de inicialização
  useEffect(() => {
    if (initialMessages) {
      setMessages(initialMessages.map(msg => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
      })));
    }
  }, [initialMessages]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-send ao digitar
  useEffect(() => {
    if (!autoSendTyping || isLoading) return;

    const text = input.trim();
    if (!text) return;

    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
    }

    typingTimerRef.current = window.setTimeout(() => {
      handleSendMessage();
    }, Math.max(500, autoSendTypingDelay));

    return () => {
      if (typingTimerRef.current) {
        clearTimeout(typingTimerRef.current);
      }
    };
  }, [input, autoSendTyping, autoSendTypingDelay, isLoading]);

  // Cleanup geral
  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (voiceSendTimerRef.current) clearTimeout(voiceSendTimerRef.current);
      tts.stop();
    };
  }, [tts]);

  // Handlers de mensagem
  const handleSendMessage = useCallback(async (overrideText?: string) => {
    const textToSend = overrideText || input.trim();
    if (!textToSend || isLoading) return;

    setInput("");
    setIsLoading(true);

    try {
      const response = await sendMessageMutation.mutateAsync({
        conversationId,
        content: textToSend,
        provider,
        model,
        ...(provider === "ollama" && ollamaBaseUrl.trim() ? { ollamaBaseUrl } : {}),
        ...(provider === "ollama" && ollamaAuthToken.trim() ? { ollamaAuthToken } : {}),
        ...(attachedImage ? {
          imageBase64: attachedImage.base64,
          imageMimeType: attachedImage.mime
        } : {}),
      });

      const now = new Date();

      setMessages(prev => [
        ...prev,
        { id: Date.now(), role: "user", content: textToSend, createdAt: now },
        { id: Date.now() + 1, role: "assistant", content: response.assistantMessage, createdAt: now },
      ]);

      setAttachedImage(null);

      if (tts.enabled) {
        tts.speak(response.assistantMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      toast.error("Erro ao enviar mensagem. Tente novamente.");
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: "system",
          content: "Erro ao enviar mensagem. Verifique sua conexão ou tente novamente.",
          createdAt: new Date()
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, sendMessageMutation, conversationId, provider, model, ollamaBaseUrl, ollamaAuthToken, attachedImage, tts]);

  // Processamento de transcrição
  const processTranscription = useCallback(async (audioBlob: Blob) => {
    try {
      const base64 = await blobToBase64(audioBlob);
      const mime = validateAudioMime(audioBlob.type);

      const result = await transcribeMutation.mutateAsync({
        audioBase64: base64,
        mimeType: mime,
      }) as TranscriptionResult;

      if (result.text) {
        setInput(result.text);

        if (autoSendOnSilence && result.text.trim().length > 0) {
          if (voiceSendTimerRef.current) {
            clearTimeout(voiceSendTimerRef.current);
          }
          voiceSendTimerRef.current = window.setTimeout(() => {
            handleSendMessage(result.text);
          }, Math.max(0, autoSendTypingDelay));
        }
      } else if (result.error) {
        toast.error("Falha na transcrição de áudio");
      }
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Erro ao processar áudio");
    }
  }, [autoSendOnSilence, autoSendTypingDelay, handleSendMessage, transcribeMutation]);

  // Gravação única (não contínua)
  const handleStartRecording = useCallback(async () => {
    if (useWebSpeech) {
      // Usar Web Speech API
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast.error("Seu navegador não suporta reconhecimento de voz");
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.lang = "pt-BR";
      recognition.interimResults = true;
      recognition.continuous = false;

      let finalTranscript = "";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interim += transcript;
          }
        }
        setInput(finalTranscript || interim);
      };

      recognition.onend = () => {
        if (autoSendOnSilence && finalTranscript.trim()) {
          setTimeout(() => handleSendMessage(finalTranscript.trim()), autoSendTypingDelay);
        }
      };

      recognition.onerror = () => {
        toast.error("Erro no reconhecimento de voz");
      };

      recognition.start();
    } else {
      // Usar MediaRecorder + Transcrição
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        const chunks: BlobPart[] = [];
        const startTime = Date.now();

        recorder.ondataavailable = (e) => chunks.push(e.data);

        recorder.onstop = async () => {
          stream.getTracks().forEach(t => t.stop());
          const duration = Date.now() - startTime;

          if (duration < 300 || !chunks.length) return; // Muito curto ou cancelado

          const blob = new Blob(chunks, { type: "audio/webm" });
          await processTranscription(blob);
        };

        recorder.start();

        // Parar automaticamente após 30s ou quando chamar stop manualmente
        setTimeout(() => recorder.stop(), 30000);
      } catch (error) {
        toast.error("Erro ao acessar microfone. Verifique as permissões.");
      }
    }
  }, [useWebSpeech, autoSendOnSilence, autoSendTypingDelay, handleSendMessage, processTranscription]);

  // Escuta contínua (VAD)
  const vad = useVoiceActivityDetection({
    onSegment: processTranscription,
  });

  useEffect(() => {
    if (continuousListening) {
      vad.start().catch(() => toast.error("Erro ao iniciar escuta contínua"));
    } else {
      vad.stop();
    }
    return () => vad.stop();
  }, [continuousListening, vad]);

  // Handler de arquivo
  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAttachedImage(null);
      return;
    }

    const allowedMimes: MimeType[] = ["image/png", "image/jpeg", "image/webp", "image/gif"];
    if (!allowedMimes.includes(file.type as MimeType)) {
      toast.error("Formato de imagem não suportado. Use PNG, JPEG, WebP ou GIF.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = String(reader.result || "");
      const base64 = dataUrl.split(",")[1] || "";
      setAttachedImage({ base64, mime: file.type as MimeType });
    };
    reader.readAsDataURL(file);
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold flex items-center gap-2">
              AVA Assistant
              {continuousListening && (
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              )}
            </h2>
            <p className="text-sm text-muted-foreground">
              Modo: {mode} • {provider} • {model}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" aria-label="Configurações">
                  <Settings className="h-4 w-4 mr-2" />
                  Opções
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-72" sideOffset={8}>
                <DropdownMenuLabel>Provedor LLM</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={provider}
                  onValueChange={(v) => setProvider(v as Provider)}
                >
                  <DropdownMenuRadioItem value="ollama">Ollama</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="forge">Forge</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>

                {provider === "ollama" && (
                  <>
                    <div className="px-2 py-1.5 space-y-2">
                      <Input
                        placeholder="Endpoint Ollama (ex: https://api.exemplo)"
                        value={ollamaBaseUrl}
                        onChange={(e) => setOllamaBaseUrl(e.target.value)}
                        className="h-8 text-xs"
                      />
                      <Input
                        type="password"
                        placeholder="Token (Authorization: Bearer)"
                        value={ollamaAuthToken}
                        onChange={(e) => setOllamaAuthToken(e.target.value)}
                        className="h-8 text-xs"
                      />
                    </div>
                  </>
                )}

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Modelo</DropdownMenuLabel>

                {provider === "ollama" && modelsQuery.data?.length ? (
                  <div className="max-h-48 overflow-y-auto">
                    <DropdownMenuRadioGroup value={model} onValueChange={setModel}>
                      {modelsQuery.data.map((m) => (
                        <DropdownMenuRadioItem key={m} value={m} className="text-xs">
                          {m}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  </div>
                ) : (
                  <div className="px-2 py-1.5">
                    <Input
                      value={model}
                      placeholder="ex: llama3.1:8b"
                      onChange={(e) => setModel(e.target.value)}
                      className="h-8 text-xs"
                    />
                  </div>
                )}

                {capabilities && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuLabel>Capacidades</DropdownMenuLabel>
                    <div className="px-2 py-1.5 text-xs space-y-1 text-muted-foreground">
                      <div className="flex justify-between">
                        <span>Visão:</span>
                        <span className={capabilities.supportsVision ? "text-green-600" : ""}>
                          {capabilities.supportsVision ? "Sim" : "Não"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Ferramentas:</span>
                        <span>{capabilities.supportsTools ? "Sim" : "Não"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Thinking:</span>
                        <span>{capabilities.supportsThinking ? "Sim" : "Não"}</span>
                      </div>
                    </div>
                  </>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuCheckboxItem
                  checked={tts.enabled}
                  onCheckedChange={(checked) => tts.setEnabled(!!checked)}
                >
                  Falar respostas automaticamente
                </DropdownMenuCheckboxItem>

                {tts.voices.length > 0 && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger inset>Voz TTS</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent className="w-64 max-h-64 overflow-y-auto">
                      <DropdownMenuRadioGroup
                        value={String(tts.voiceIndex)}
                        onValueChange={(v) => tts.setVoiceIndex(parseInt(v))}
                      >
                        <DropdownMenuRadioItem value="-1">Padrão do sistema</DropdownMenuRadioItem>
                        {tts.voices.map((v, i) => (
                          <DropdownMenuRadioItem key={`${v.name}-${i}`} value={String(i)} className="text-xs">
                            {v.name} ({v.lang})
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuCheckboxItem
                  checked={useWebSpeech}
                  onCheckedChange={(checked) => setUseWebSpeech(!!checked)}
                >
                  Usar Web Speech API (navegador)
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={continuousListening}
                  onCheckedChange={(checked) => setContinuousListening(!!checked)}
                >
                  Escuta contínua (VAD)
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={autoSendOnSilence}
                  onCheckedChange={(checked) => setAutoSendOnSilence(!!checked)}
                  disabled={!useWebSpeech && !continuousListening}
                >
                  Enviar após silêncio
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={autoSendTyping}
                  onCheckedChange={(checked) => setAutoSendTyping(!!checked)}
                >
                  Auto-enviar ao parar de digitar
                </DropdownMenuCheckboxItem>

                {autoSendTyping && (
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger inset>Delay auto-envio</DropdownMenuSubTrigger>
                    <DropdownMenuSubContent>
                      <div className="px-2 py-1.5">
                        <Input
                          type="number"
                          min={500}
                          step={100}
                          value={autoSendTypingDelay}
                          onChange={(e) => setAutoSendTypingDelay(parseInt(e.target.value) || 1500)}
                          className="h-8"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          {autoSendTypingDelay}ms ({(autoSendTypingDelay / 1000).toFixed(1)}s)
                        </p>
                      </div>
                    </DropdownMenuSubContent>
                  </DropdownMenuSub>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 min-h-full">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground space-y-2">
              <AlertCircle className="h-8 w-8 opacity-50" />
              <p>Nenhuma mensagem ainda. Comece uma conversa!</p>
              <p className="text-xs text-center max-w-sm">
                Dica: Use o microfone para entrada de voz ou anexe imagens se o modelo suportar visão.
              </p>
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onSpeak={tts.enabled ? undefined : tts.speak} // Só mostra botão se TTS auto estiver desabilitado
              />
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm space-y-3">
        {attachedImage && (
          <div className="flex items-center gap-3 p-2 bg-muted rounded-lg border border-border">
            <img
              src={`data:${attachedImage.mime};base64,${attachedImage.base64}`}
              alt="Imagem anexada"
              className="h-16 w-16 rounded object-cover border border-border"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Imagem anexada</p>
              <p className="text-xs text-muted-foreground">{attachedImage.mime}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setAttachedImage(null)}
              className="shrink-0"
              aria-label="Remover imagem"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}

        {attachedImage && capabilities && !capabilities.supportsVision && (
          <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded">
            <AlertCircle className="h-4 w-4" />
            <span>O modelo atual não suporta visão. A imagem pode ser ignorada.</span>
          </div>
        )}

        <div className="flex gap-2 items-end">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
            aria-label="Anexar imagem"
          />

          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0"
            aria-label="Anexar imagem"
            disabled={isLoading || transcribeMutation.isPending}
          >
            <span className="text-lg">+</span>
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder="Digite sua mensagem..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading || transcribeMutation.isPending || continuousListening}
              className="pr-12"
              aria-label="Mensagem"
            />
            {input.length > 0 && (
              <button
                onClick={() => setInput("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Limpar texto"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <Button
            variant={continuousListening ? "destructive" : "outline"}
            size="icon"
            onClick={continuousListening ? () => setContinuousListening(false) : handleStartRecording}
            disabled={isLoading || transcribeMutation.isPending}
            className="shrink-0"
            aria-label={continuousListening ? "Parar escuta" : "Gravar áudio"}
            title={continuousListening ? "Escuta ativa (clique para parar)" : "Gravar mensagem de voz"}
          >
            {continuousListening ? (
              <span className="relative flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-white"></span>
              </span>
            ) : transcribeMutation.isPending ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </Button>

          <Button
            onClick={() => handleSendMessage()}
            disabled={isLoading || !input.trim() || transcribeMutation.isPending}
            size="icon"
            className="shrink-0"
            aria-label="Enviar mensagem"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
          </Button>
        </div>

        <div className="flex justify-between items-center text-xs text-muted-foreground">
          <span>
            {transcribeMutation.isPending
              ? "Transcrevendo áudio..."
              : continuousListening
                ? "Escuta contínua ativa... fale naturalmente"
                : "Enter para enviar • Shift+Enter para nova linha"
            }
          </span>
          {capabilities?.supportsVision && (
            <span className="text-green-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-600" />
              Visão ativa
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
