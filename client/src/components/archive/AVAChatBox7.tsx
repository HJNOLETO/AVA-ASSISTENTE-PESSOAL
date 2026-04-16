import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, Send, Mic, MicOff, Volume2, Settings, X, AlertCircle, 
  FileText, FileCode, Table, Image as ImageIcon, Paperclip, File,
  Brain, Trash2, History, Wifi, WifiOff
} from "lucide-react";
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

type Provider = "forge" | "ollama";
type Role = "user" | "assistant" | "system";
type MimeType = "image/png" | "image/jpeg" | "image/webp" | "image/gif";
type AudioMime = "audio/webm" | "audio/mp3" | "audio/mpeg" | "audio/wav" | "audio/ogg" | "audio/m4a";
type FileCategory = "image" | "code" | "document" | "data" | "unknown";

interface Message {
  id: number;
  role: Role;
  content: string;
  createdAt: Date;
}

interface FileAttachment {
  id: string;
  name: string;
  type: string;
  category: FileCategory;
  content?: string;
  textContent?: string;
  size: number;
  isProcessing?: boolean;
}

interface ModelCapabilities {
  supportsVision: boolean;
  supportsTools: boolean;
  supportsThinking: boolean;
  supportsJsonSchema: boolean;
}

interface ConversationMemory {
  conversationId: number;
  summary?: string;
  keyPoints: string[];
  lastUpdated: Date;
  messageCount: number;
}

interface AVAChatBoxProps {
  conversationId: number;
  mode: "ECO" | "STANDARD" | "PERFORMANCE";
}

const getFileCategory = (filename: string, mimeType: string): FileCategory => {
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'bmp', 'svg', 'ico'].includes(ext)) return 'image';
  if (mimeType.startsWith('image/')) return 'image';
  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'odt', 'odf'].includes(ext)) return 'document';
  if (['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(mimeType)) return 'document';
  if (['xls', 'xlsx', 'csv', 'tsv', 'ods'].includes(ext)) return 'data';
  if (['application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/csv'].includes(mimeType)) return 'data';
  const codeExts = ['py', 'js', 'ts', 'tsx', 'jsx', 'html', 'htm', 'css', 'scss', 'sass', 'less', 'json', 'md', 'markdown', 'yaml', 'yml', 'xml', 'sql', 'java', 'cpp', 'c', 'h', 'hpp', 'cs', 'go', 'rs', 'php', 'rb', 'swift', 'kt', 'scala', 'r', 'm', 'mat', 'sh', 'bash', 'zsh', 'fish', 'bat', 'ps1', 'lua', 'perl', 'pl', 'pm'];
  if (codeExts.includes(ext)) return 'code';
  if (['text/plain', 'text/html', 'text/css', 'text/javascript', 'application/json', 'application/xml'].includes(mimeType) && ext !== 'txt') return 'code';
  return 'unknown';
};

const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

const readFileAsBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(',')[1] || '';
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const readFileAsText = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsText(file);
  });
};

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

function useConversationMemory(conversationId: number) {
  const storageKey = `ava-memory-${conversationId}`;
  const [memory, setMemory] = useLocalStorage<ConversationMemory | null>(storageKey, null);
  const [contextMessages, setContextMessages] = useState<Message[]>([]);

  const updateMemory = useCallback((messages: Message[]) => {
    if (messages.length === 0) return;
    const last10Messages = messages.slice(-10);
    setContextMessages(last10Messages);
    setMemory(prev => ({
      conversationId,
      summary: prev?.summary || undefined,
      keyPoints: prev?.keyPoints || [],
      lastUpdated: new Date(),
      messageCount: messages.length
    }));
  }, [conversationId, setMemory]);

  const generateSummary = useCallback(async (messages: Message[]) => {
    const userMessages = messages.filter(m => m.role === 'user').slice(-5);
    const keyPoints = userMessages.map(m => 
      m.content.length > 50 ? m.content.substring(0, 50) + '...' : m.content
    );
    setMemory(prev => ({
      conversationId,
      summary: `Conversa sobre: ${keyPoints[0] || 'vários tópicos'}`,
      keyPoints: keyPoints.slice(0, 3),
      lastUpdated: new Date(),
      messageCount: messages.length
    }));
  }, [conversationId, setMemory]);

  const clearMemory = useCallback(() => {
    setMemory(null);
    setContextMessages([]);
    localStorage.removeItem(storageKey);
  }, [setMemory, storageKey]);

  return {
    memory,
    contextMessages,
    updateMemory,
    generateSummary,
    clearMemory,
    hasContext: contextMessages.length > 0 || !!memory?.summary
  };
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
  const currentSegmentChunksRef = useRef<BlobPart[]>([]);
  const speakingRef = useRef(false);
  const lastSpeechRef = useRef<number>(0);
  const currentSpeechStartRef = useRef<number | null>(null);

  const { threshold = 0.03, silenceMs = 1000, minSpeechMs = 500 } = options;

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
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
          channelCount: 1
        } 
      });
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

      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : MediaRecorder.isTypeSupported('audio/webm') 
          ? 'audio/webm' 
          : 'audio/mp4';

      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data?.size > 0) {
          currentSegmentChunksRef.current.push(e.data);
        }
      };

      recorder.start(100);

      intervalRef.current = window.setInterval(() => {
        if (!analyserRef.current) return;
        const buffer = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteTimeDomainData(buffer);
        const rms = computeRms(buffer);
        const now = Date.now();

        if (rms > threshold) {
          if (!speakingRef.current) {
            speakingRef.current = true;
            currentSpeechStartRef.current = now;
            if (currentSegmentChunksRef.current.length > 50) {
              currentSegmentChunksRef.current = [];
            }
          }
          lastSpeechRef.current = now;
        } else if (speakingRef.current && (now - lastSpeechRef.current > silenceMs)) {
          const duration = currentSpeechStartRef.current ? now - currentSpeechStartRef.current : 0;
          speakingRef.current = false;
          currentSpeechStartRef.current = null;

          if (duration >= minSpeechMs && currentSegmentChunksRef.current.length > 0) {
            const blob = new Blob(currentSegmentChunksRef.current, { type: mimeType });
            const blobSize = blob.size;
            if (blobSize > 1000) {
              options.onSegment(blob);
            }
            currentSegmentChunksRef.current = [];
          }
        }
      }, 50);
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
    if (speakingRef.current && currentSegmentChunksRef.current.length > 0) {
      const mimeType = recorderRef.current?.mimeType || 'audio/webm';
      const blob = new Blob(currentSegmentChunksRef.current, { type: mimeType });
      if (blob.size > 1000) {
        options.onSegment(blob);
      }
    }
    recorderRef.current?.stop();
    recorderRef.current = null;
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    currentSegmentChunksRef.current = [];
    speakingRef.current = false;
    currentSpeechStartRef.current = null;
  }, [options]);

  return { start, stop };
}

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

const FileIconComponent = ({ category, className }: { category: FileCategory; className?: string }) => {
  switch (category) {
    case 'image':
      return <ImageIcon className={className} />;
    case 'code':
      return <FileCode className={className} />;
    case 'document':
      return <FileText className={className} />;
    case 'data':
      return <Table className={className} />;
    default:
      return <File className={className} />;
  }
};

const AttachmentPreview = memo(({ 
  attachment, 
  onRemove 
}: { 
  attachment: FileAttachment; 
  onRemove: (id: string) => void;
}) => {
  const isImage = attachment.category === 'image';
  
  return (
    <div className="flex items-center gap-3 p-2 bg-muted rounded-lg border border-border group">
      {isImage && attachment.content ? (
        <img
          src={`data:${attachment.type};base64,${attachment.content}`}
          alt={attachment.name}
          className="h-12 w-12 rounded object-cover border border-border"
        />
      ) : (
        <div className="h-12 w-12 rounded bg-background border border-border flex items-center justify-center">
          {attachment.isProcessing ? (
            <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
          ) : (
            <FileIconComponent category={attachment.category} className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      )}
      
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium truncate" title={attachment.name}>
          {attachment.name}
        </p>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <span>{formatFileSize(attachment.size)}</span>
          {attachment.isProcessing && <span className="text-blue-500">• Processando...</span>}
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="icon"
        onClick={() => onRemove(attachment.id)}
        className="shrink-0 h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
        aria-label={`Remover ${attachment.name}`}
        disabled={attachment.isProcessing}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
});
AttachmentPreview.displayName = "AttachmentPreview";

const MessageBubble = memo(({ message, onSpeak }: { message: Message; onSpeak?: (text: string) => void }) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isError = message.role === "assistant" && message.content.startsWith("❌");

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <Card
        className={`max-w-[75%] px-4 py-3 rounded-2xl shadow-sm whitespace-pre-wrap ${
          isUser
            ? "bg-primary text-primary-foreground"
            : isSystem || isError
            ? "bg-destructive/10 text-destructive border border-destructive/20"
            : "bg-muted text-card-foreground border border-border"
        }`}
      >
        <div className="text-sm leading-relaxed">
          {message.role === "assistant" && !isError ? (
            <Streamdown>{message.content}</Streamdown>
          ) : (
            message.content
          )}
        </div>

        <div className={`text-xs mt-2 ${isUser ? "text-primary-foreground/70" : "text-muted-foreground"}`}>
          {formatDistanceToNow(message.createdAt, { addSuffix: true, locale: ptBR })}
        </div>

        {!isUser && !isSystem && onSpeak && !isError && (
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

export function AVAChatBox({ conversationId, mode }: AVAChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  // ✅ NOVO: Estado para teste de conexão
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "connected" | "error">("unknown");
  const [connectionMessage, setConnectionMessage] = useState<string>("");

  const {
    memory,
    contextMessages,
    updateMemory,
    generateSummary,
    clearMemory,
    hasContext
  } = useConversationMemory(conversationId);

  const [provider, setProvider] = useLocalStorage<Provider>("ava-llm-provider", "ollama");
  const [model, setModel] = useLocalStorage<string>("ava-llm-model", "llama3.1:8b");
  const [ollamaBaseUrl, setOllamaBaseUrl] = useLocalStorage<string>("ava-ollama-base-url", "");
  const [ollamaAuthToken, setOllamaAuthToken] = useLocalStorage<string>("ava-ollama-auth-token", "");
  const [useWebSpeech, setUseWebSpeech] = useLocalStorage<boolean>("ava-use-webspeech", false);
  const [autoSendOnSilence, setAutoSendOnSilence] = useLocalStorage<boolean>("ava-autosend-silence", true);
  const [autoSendTyping, setAutoSendTyping] = useLocalStorage<boolean>("ava-autosend-typing", false);
  const [autoSendTypingDelay, setAutoSendTypingDelay] = useLocalStorage<number>("ava-autosend-typing-delay", 1500);
  const [continuousListening, setContinuousListening] = useLocalStorage<boolean>("ava-continuous-listen", false);
  const [contextWindowSize, setContextWindowSize] = useLocalStorage<number>("ava-context-window", 10);

  const tts = useTextToSpeech();

  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<number | null>(null);
  const voiceSendTimerRef = useRef<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);

  const modelsQuery = trpc.llm.listOllamaModels.useQuery(
    { baseUrl: ollamaBaseUrl || undefined, authToken: ollamaAuthToken || undefined },
    { refetchOnWindowFocus: false, enabled: provider === "ollama" }
  );

  const capabilitiesQuery = trpc.llm.getCapabilities.useQuery(
    { provider, model },
    { refetchOnWindowFocus: false }
  );

  // ✅ NOVO: Query para testar conexão
  const testConnectionQuery = trpc.llm.testConnection.useQuery(
    { 
      baseUrl: ollamaBaseUrl || undefined, 
      authToken: ollamaAuthToken || undefined,
      provider 
    },
    { 
      enabled: false, // Só executa quando chamado manualmente
      retry: false
    }
  );

  const processFilesMutation = trpc.files.processFiles.useMutation();
  const { data: initialMessages } = trpc.chat.getMessages.useQuery({ conversationId });
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const transcribeMutation = trpc.voice.transcribe.useMutation();

  const capabilities = useMemo<ModelCapabilities | null>(() => {
    if (!capabilitiesQuery.data) return null;
    return {
      supportsVision: !!capabilitiesQuery.data.supportsVision,
      supportsTools: !!capabilitiesQuery.data.supportsTools,
      supportsThinking: !!capabilitiesQuery.data.supportsThinking,
      supportsJsonSchema: !!capabilitiesQuery.data.supportsJsonSchema,
    };
  }, [capabilitiesQuery.data]);

  const hasImages = attachments.some(a => a.category === 'image');
  const hasUnsupportedImages = hasImages && capabilities && !capabilities.supportsVision;

  // ✅ NOVO: Função para testar conexão
  const handleTestConnection = async () => {
    try {
      setConnectionStatus("unknown");
      const result = await testConnectionQuery.refetch();
      if (result.data?.success) {
        setConnectionStatus("connected");
        setConnectionMessage(result.data.message || "Conectado com sucesso!");
        toast.success(result.data.message || "Conexão estabelecida!");
      } else {
        setConnectionStatus("error");
        setConnectionMessage(result.data?.error || result.data?.suggestion || "Falha na conexão");
        toast.error(result.data?.error || "Não foi possível conectar ao Ollama");
      }
    } catch (error) {
      setConnectionStatus("error");
      setConnectionMessage("Erro ao testar conexão");
      toast.error("Erro ao testar conexão");
    }
  };

  useEffect(() => {
    if (initialMessages) {
      const formattedMessages = initialMessages.map(msg => ({
        ...msg,
        createdAt: new Date(msg.createdAt),
      }));
      setMessages(formattedMessages);
      updateMemory(formattedMessages);
    }
  }, [initialMessages, updateMemory]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (voiceSendTimerRef.current) clearTimeout(voiceSendTimerRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      tts.stop();
      stopRecording();
    };
  }, [tts]);

  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    if (files.length > 10) {
      toast.error("Limite de 10 arquivos por vez");
      return;
    }
    const totalSize = files.reduce((acc, f) => acc + f.size, 0);
    if (totalSize > 50 * 1024 * 1024) {
      toast.error("Tamanho total excede 50MB");
      return;
    }
    setIsProcessingFiles(true);
    try {
      const newAttachments: FileAttachment[] = [];
      for (const file of files) {
        const category = getFileCategory(file.name, file.type);
        const id = Math.random().toString(36).substring(7);
        if (category === 'image') {
          if (file.size > 5 * 1024 * 1024) {
            toast.error(`${file.name} é muito grande (máx 5MB para imagens)`);
            continue;
          }
          const base64 = await readFileAsBase64(file);
          newAttachments.push({
            id,
            name: file.name,
            type: file.type,
            category,
            content: base64,
            size: file.size,
          });
        }
        else if (category === 'code' || (category === 'data' && file.name.endsWith('.csv')) || file.size < 1024 * 1024) {
          try {
            const text = await readFileAsText(file);
            const limitedText = text.length > 50000 ? text.substring(0, 50000) + '\n... (truncado)' : text;
            newAttachments.push({
              id,
              name: file.name,
              type: file.type,
              category,
              textContent: limitedText,
              size: file.size,
            });
          } catch (e) {
            toast.error(`Erro ao ler ${file.name}`);
          }
        }
        else {
          const base64 = await readFileAsBase64(file);
          const processingAttachment: FileAttachment = {
            id,
            name: file.name,
            type: file.type,
            category,
            isProcessing: true,
            size: file.size,
          };
          newAttachments.push(processingAttachment);
          setAttachments(prev => [...prev, processingAttachment]);
          try {
            const result = await processFilesMutation.mutateAsync([{
              name: file.name,
              type: file.type,
              content: base64,
            }]);
            if (result[0] && !result[0].error) {
              setAttachments(prev => prev.map(att => 
                att.id === id 
                  ? { ...att, isProcessing: false, textContent: result[0].text }
                  : att
              ));
            } else {
              throw new Error(result[0]?.text || 'Erro ao processar');
            }
          } catch (error) {
            toast.error(`Erro ao processar ${file.name}`);
            setAttachments(prev => prev.filter(att => att.id !== id));
          }
        }
      }
      const immediateAttachments = newAttachments.filter(a => !a.isProcessing);
      if (immediateAttachments.length > 0) {
        setAttachments(prev => [...prev, ...immediateAttachments]);
      }
    } catch (error) {
      console.error("File processing error:", error);
      toast.error("Erro ao processar arquivos");
    } finally {
      setIsProcessingFiles(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  }, [processFilesMutation]);

  const removeAttachment = useCallback((id: string) => {
    setAttachments(prev => prev.filter(a => a.id !== id));
  }, []);

  const handleSendMessage = useCallback(async (overrideText?: string) => {
    const textToSend = overrideText || input.trim();
    if ((!textToSend && attachments.length === 0) || isLoading) return;

    setInput("");
    setIsLoading(true);
    
    const recentContext = messages.slice(-contextWindowSize).map(m => ({
      role: m.role,
      content: m.content,
      timestamp: m.createdAt.toISOString()
    }));

    const contextPayload = memory?.summary ? {
      summary: memory.summary,
      recentMessages: recentContext,
      totalPreviousMessages: memory.messageCount
    } : {
      recentMessages: recentContext,
      totalPreviousMessages: messages.length
    };

    const attachmentsToSend = attachments.map(({ id, isProcessing, ...rest }) => ({
      ...rest,
      content: rest.content,
      textContent: rest.textContent,
    }));

    try {
      const response = await sendMessageMutation.mutateAsync({
        conversationId,
        content: textToSend,
        provider,
        model,
        ...(provider === "ollama" && ollamaBaseUrl.trim() ? { ollamaBaseUrl } : {}),
        ...(provider === "ollama" && ollamaAuthToken.trim() ? { ollamaAuthToken } : {}),
        attachments: attachmentsToSend,
        context: contextPayload,
      });

      const now = new Date();
      const newUserMessage: Message = { 
        id: Date.now(), 
        role: "user", 
        content: textToSend || `[${attachments.length} arquivo(s) anexo(s)]`, 
        createdAt: now 
      };
      const newAssistantMessage: Message = { 
        id: Date.now() + 1, 
        role: "assistant", 
        content: response.assistantMessage, 
        createdAt: now 
      };

      const updatedMessages = [...messages, newUserMessage, newAssistantMessage];
      setMessages(updatedMessages);
      updateMemory(updatedMessages);
      
      if (updatedMessages.length % 10 === 0) {
        generateSummary(updatedMessages);
      }

      setAttachments([]);
      setIsProcessingFiles(false);

      if (tts.enabled && !response.assistantMessage.startsWith("❌")) {
        tts.speak(response.assistantMessage);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // ✅ MELHORIA: Mostrar erro específico no chat
      const errorMsg = error instanceof Error ? error.message : "Erro desconhecido";
      setMessages(prev => [
        ...prev,
        {
          id: Date.now(),
          role: "assistant",
          content: `❌ Erro ao enviar mensagem: ${errorMsg}`,
          createdAt: new Date()
        },
      ]);
      toast.error(`Erro: ${errorMsg}`);
    } finally {
      setIsLoading(false);
    }
  }, [input, isLoading, sendMessageMutation, conversationId, provider, model, ollamaBaseUrl, ollamaAuthToken, attachments, tts, messages, contextWindowSize, memory, updateMemory, generateSummary]);

  const processTranscription = useCallback(async (audioBlob: Blob) => {
    try {
      setIsLoading(true);
      const base64 = await blobToBase64(audioBlob);
      const mime = validateAudioMime(audioBlob.type);

      const result = await transcribeMutation.mutateAsync({
        audioBase64: base64,
        mimeType: mime,
      });

      if (!result) {
        toast.error("Resposta vazia do servidor de transcrição");
        return;
      }

      if ('error' in result && result.error) {
        toast.error(`Falha na transcrição: ${result.error}`);
        return;
      }

      if ('text' in result && typeof result.text === 'string' && result.text.trim()) {
        const transcribedText = result.text.trim();
        setInput(transcribedText);

        if (autoSendOnSilence) {
          if (voiceSendTimerRef.current) {
            clearTimeout(voiceSendTimerRef.current);
          }
          voiceSendTimerRef.current = window.setTimeout(() => {
            handleSendMessage(transcribedText);
          }, Math.max(500, autoSendTypingDelay));
        }
      } else {
        toast.error("Não foi possível transcrever o áudio");
      }
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Erro ao processar áudio");
    } finally {
      setIsLoading(false);
    }
  }, [autoSendOnSilence, autoSendTypingDelay, handleSendMessage, transcribeMutation]);

  const webSpeech = useSpeechRecognition({
    onResult: (text, isFinal) => {
      setInput(text);
      if (isFinal && autoSendOnSilence && text.trim()) {
        if (voiceSendTimerRef.current) clearTimeout(voiceSendTimerRef.current);
        voiceSendTimerRef.current = window.setTimeout(() => {
          handleSendMessage(text.trim());
        }, autoSendTypingDelay);
      }
    },
    onError: (error) => {
      toast.error(error.message);
      setIsRecording(false);
    },
    onEnd: () => {
      setIsRecording(false);
    },
    language: "pt-BR"
  });

  const handleStartRecording = useCallback(async () => {
    if (useWebSpeech) {
      setIsRecording(true);
      webSpeech.start(false);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 16000,
          channelCount: 1
        }
      });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm;codecs=opus') 
        ? 'audio/webm;codecs=opus' 
        : 'audio/webm';
      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;
      const chunks: BlobPart[] = [];
      const startTime = Date.now();
      setIsRecording(true);
      setRecordingDuration(0);
      recordingTimerRef.current = window.setInterval(() => {
        setRecordingDuration(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      recorder.ondataavailable = (e) => {
        if (e.data?.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        stream.getTracks().forEach(t => t.stop());
        if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
        const duration = Date.now() - startTime;
        setIsRecording(false);
        setRecordingDuration(0);
        mediaRecorderRef.current = null;
        if (duration < 500 || !chunks.length) {
          if (duration > 300) toast.info("Gravação muito curta");
          return;
        }
        const blob = new Blob(chunks, { type: mimeType });
        await processTranscription(blob);
      };

      recorder.onerror = () => {
        setIsRecording(false);
        toast.error("Erro na gravação");
      };

      recorder.start(100);
      setTimeout(() => {
        if (recorder.state === 'recording') {
          recorder.stop();
        }
      }, 60000);
    } catch (error) {
      console.error("Recording error:", error);
      toast.error("Erro ao acessar microfone. Verifique as permissões.");
      setIsRecording(false);
    }
  }, [useWebSpeech, webSpeech, processTranscription]);

  const stopRecording = useCallback(() => {
    if (useWebSpeech) {
      webSpeech.stop();
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, [useWebSpeech, webSpeech]);

  const vad = useVoiceActivityDetection({
    onSegment: async (blob) => {
      if (isLoading) return;
      await processTranscription(blob);
    },
    threshold: 0.02,
    silenceMs: 1200,
    minSpeechMs: 400
  });

  useEffect(() => {
    if (continuousListening) {
      vad.start().catch((err) => {
        console.error("VAD error:", err);
        toast.error("Erro ao iniciar escuta contínua");
        setContinuousListening(false);
      });
    } else {
      vad.stop();
    }
    return () => vad.stop();
  }, [continuousListening, vad, setContinuousListening]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  }, [handleSendMessage]);

  const acceptedFileTypes = [
    "image/*",
    ".pdf,.doc,.docx,.txt,.rtf,.odt",
    ".xls,.xlsx,.csv,.ods",
    ".py,.js,.ts,.tsx,.jsx,.html,.css,.scss,.json,.md,.yaml,.yml,.xml,.sql,.java,.cpp,.c,.h,.cs,.go,.rs,.php,.rb"
  ].join(",");

  return (
    <div className="flex flex-col h-full bg-background">
      {/* Header */}
      <div className="border-b border-border p-4 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
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
                {connectionStatus === "connected" && (
                  <span className="ml-2 text-green-600 flex items-center gap-1 inline-flex">
                    <Wifi className="h-3 w-3" /> Conectado
                  </span>
                )}
                {connectionStatus === "error" && (
                  <span className="ml-2 text-red-600 flex items-center gap-1 inline-flex">
                    <WifiOff className="h-3 w-3" /> Desconectado
                  </span>
                )}
              </p>
            </div>
            
            {hasContext && (
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-full text-xs text-blue-700 dark:text-blue-300">
                <Brain className="h-3 w-3" />
                <span>Memória ativa</span>
                <button 
                  onClick={clearMemory}
                  className="hover:text-red-500 ml-1"
                  title="Limpar memória"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" aria-label="Configurações">
                  <Settings className="h-4 w-4 mr-2" />
                  Opções
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" sideOffset={8}>
                <DropdownMenuLabel>Provedor LLM</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={provider}
                  onValueChange={(v) => {
                    setProvider(v as Provider);
                    setConnectionStatus("unknown"); // Reset status ao trocar provider
                  }}
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
                        onChange={(e) => {
                          setOllamaBaseUrl(e.target.value);
                          setConnectionStatus("unknown");
                        }}
                        className="h-8 text-xs"
                      />
                      <Input
                        type="password"
                        placeholder="Token (opcional)"
                        value={ollamaAuthToken}
                        onChange={(e) => {
                          setOllamaAuthToken(e.target.value);
                          setConnectionStatus("unknown");
                        }}
                        className="h-8 text-xs"
                      />
                      {/* ✅ NOVO: Botão de teste de conexão */}
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs"
                        onClick={(e) => {
                          e.stopPropagation(); // Evitar fechar o dropdown
                          handleTestConnection();
                        }}
                        disabled={testConnectionQuery.isFetching}
                      >
                        {testConnectionQuery.isFetching ? (
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                        ) : connectionStatus === "connected" ? (
                          <Wifi className="h-3 w-3 mr-2 text-green-500" />
                        ) : (
                          <WifiOff className="h-3 w-3 mr-2" />
                        )}
                        Testar Conexão
                      </Button>
                      {connectionMessage && (
                        <p className={`text-xs ${connectionStatus === "error" ? "text-red-500" : "text-green-600"}`}>
                          {connectionMessage}
                        </p>
                      )}
                      {connectionStatus === "error" && (
                        <p className="text-xs text-muted-foreground">
                          Dica: Execute <code className="bg-muted px-1 rounded">ollama serve</code> no terminal
                        </p>
                      )}
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
                <DropdownMenuLabel>Memória & Contexto</DropdownMenuLabel>
                
                <div className="px-2 py-1.5 space-y-2">
                  <div className="flex justify-between items-center text-xs text-muted-foreground">
                    <span>Janela de contexto:</span>
                    <span>{contextWindowSize} msgs</span>
                  </div>
                  <Input
                    type="range"
                    min="2"
                    max="50"
                    value={contextWindowSize}
                    onChange={(e) => setContextWindowSize(parseInt(e.target.value))}
                    className="h-2"
                  />
                  <p className="text-xs text-muted-foreground">
                    Quantas mensagens anteriores enviar para o modelo
                  </p>
                </div>

                {memory && (
                  <div className="px-2 py-1.5 bg-muted rounded text-xs space-y-1">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      <History className="h-3 w-3" />
                      <span>Resumo salvo</span>
                    </div>
                    <p className="line-clamp-2">{memory.summary || `${memory.messageCount} mensagens na memória`}</p>
                  </div>
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
                  Enviar após silêncio (voz)
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
              {provider === "ollama" && connectionStatus !== "connected" && (
                <p className="text-xs text-center max-w-sm text-orange-600">
                  ⚠️ Ollama não detectado. Clique em "Opções" &gt; "Testar Conexão" para diagnosticar.
                </p>
              )}
            </div>
          ) : (
            messages.map((message) => (
              <MessageBubble
                key={message.id}
                message={message}
                onSpeak={tts.enabled ? undefined : tts.speak}
              />
            ))
          )}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t border-border p-4 bg-card/50 backdrop-blur-sm space-y-3">
        {/* Attachments Preview */}
        {attachments.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-muted-foreground">
                {attachments.length} arquivo(s) anexo(s)
              </p>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setAttachments([])}
                className="h-6 text-xs"
              >
                Limpar todos
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {attachments.map((att) => (
                <AttachmentPreview 
                  key={att.id} 
                  attachment={att} 
                  onRemove={removeAttachment}
                />
              ))}
            </div>
          </div>
        )}

        {/* Warning for images without vision support */}
        {hasUnsupportedImages && (
          <div className="flex items-center gap-2 text-xs text-destructive bg-destructive/10 p-2 rounded">
            <AlertCircle className="h-4 w-4" />
            <span>O modelo atual não suporta visão. As imagens podem ser ignoradas.</span>
          </div>
        )}

        <div className="flex gap-2 items-end">
          <input
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes}
            onChange={handleFileChange}
            className="hidden"
            aria-label="Anexar arquivos"
            multiple
            disabled={isProcessingFiles || attachments.length >= 10}
          />

          <Button
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="shrink-0"
            aria-label="Anexar arquivos"
            disabled={isLoading || transcribeMutation.isPending || isProcessingFiles || attachments.length >= 10}
            title="Anexar arquivos (máx 10)"
          >
            {isProcessingFiles ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Paperclip className="h-4 w-4" />
            )}
          </Button>

          <div className="flex-1 relative">
            <Input
              placeholder={isRecording ? `Gravando... ${recordingDuration}s` : "Digite sua mensagem ou anexe arquivos..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyPress}
              disabled={isLoading || transcribeMutation.isPending || continuousListening || isProcessingFiles || isRecording}
              className="pr-12"
              aria-label="Mensagem"
            />
            {input.length > 0 && !isRecording && (
              <button
                onClick={() => setInput("")}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Limpar texto"
              >
                <X className="h-4 w-4" />
              </button>
            )}
            {isRecording && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
              </div>
            )}
          </div>

          <Button
            variant={isRecording || continuousListening ? "destructive" : "outline"}
            size="icon"
            onClick={isRecording ? stopRecording : (continuousListening ? () => setContinuousListening(false) : handleStartRecording)}
            disabled={isLoading || transcribeMutation.isPending || isProcessingFiles || (continuousListening && !isRecording)}
            className="shrink-0 relative"
            aria-label={isRecording ? "Parar gravação" : continuousListening ? "Parar escuta" : "Gravar áudio"}
            title={isRecording ? "Parar gravação" : continuousListening ? "Escuta ativa (clique para parar)" : "Gravar mensagem de voz"}
          >
            {isRecording ? (
              <MicOff className="h-4 w-4" />
            ) : continuousListening ? (
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
            disabled={isLoading || (!input.trim() && attachments.length === 0) || transcribeMutation.isPending || isProcessingFiles || isRecording}
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
            {isRecording 
              ? `Gravando... ${recordingDuration}s (clique para parar)`
              : transcribeMutation.isPending
              ? "Transcrevendo áudio..."
              : isProcessingFiles
              ? "Processando arquivos..."
              : continuousListening
              ? "Escuta contínua ativa... fale naturalmente"
              : "Enter para enviar • Máx 10 arquivos"}
          </span>
          <div className="flex items-center gap-3">
            {hasContext && (
              <span className="text-blue-600 flex items-center gap-1">
                <Brain className="h-3 w-3" />
                Contexto: {contextMessages.length} msgs
              </span>
            )}
            {capabilities?.supportsVision && hasImages && (
              <span className="text-green-600 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-600" />
                Visão ativa
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
