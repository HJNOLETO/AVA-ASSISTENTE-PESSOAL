import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Loader2, Send, Mic, MicOff, Volume2, VolumeX, Settings, X, AlertCircle, 
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
import {
  parseAppointmentIntent,
  parseReminderIntent,
} from "@shared/intent/schedulingIntent";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { cn } from "@/lib/utils";

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
type VoiceCommandType = "standby" | "continuous" | "tts-stop" | "workflow";
type AudioMime = "audio/webm" | "audio/mp3" | "audio/mpeg" | "audio/wav" | "audio/ogg" | "audio/m4a" | "audio/mp4";
type FileCategory = "image" | "code" | "document" | "data" | "unknown";

interface VoiceTask {
  id: string;
  text: string;
  done: boolean;
  priority: "normal" | "high";
  createdAt: string;
}

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

interface SkillProfile {
  id: string;
  title: string;
  description: string;
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
      setStoredValue(prev => {
        const valueToStore = value instanceof Function ? value(prev) : value;
        if (typeof window !== "undefined") {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
        return valueToStore;
      });
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  }, [key]);

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
  const [voiceURI, setVoiceURI] = useLocalStorage<string>("ava-tts-voice-uri", "");
  const [enabled, setEnabled] = useLocalStorage<boolean>("ava-tts-enabled", true);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const isPrimedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    let timeoutA: number | null = null;
    let timeoutB: number | null = null;
    const synth = window.speechSynthesis;

    const updateVoices = () => {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);

      if (!voiceURI && availableVoices.length > 0) {
        const preferred =
          availableVoices.find((v) => /^pt(-|$)/i.test(v.lang)) || availableVoices[0];
        if (preferred) {
          setVoiceURI(preferred.voiceURI);
        }
      }
    };

    updateVoices();
    timeoutA = window.setTimeout(updateVoices, 250);
    timeoutB = window.setTimeout(updateVoices, 1000);

    const supportsEventTarget = typeof synth.addEventListener === "function";
    const previousOnVoicesChanged = synth.onvoiceschanged;

    if (supportsEventTarget) {
      synth.addEventListener("voiceschanged", updateVoices);
    } else {
      synth.onvoiceschanged = updateVoices;
    }

    return () => {
      if (timeoutA) window.clearTimeout(timeoutA);
      if (timeoutB) window.clearTimeout(timeoutB);

      if (supportsEventTarget) {
        synth.removeEventListener("voiceschanged", updateVoices);
      } else if (synth.onvoiceschanged === updateVoices) {
        synth.onvoiceschanged = previousOnVoicesChanged;
      }
    };
  }, [voiceURI]);

  const summarizeCodeBlockForSpeech = (code: string, languageHint: string): string => {
    const compact = code.replace(/\r\n/g, "\n").trim();
    const firstLine = compact.split("\n").find((line) => line.trim().length > 0) ?? "";
    const lang = languageHint ? ` em ${languageHint}` : "";

    const classMatch = compact.match(/\bclass\s+([A-Za-z_$][\w$]*)/);
    if (classMatch?.[1]) {
      return `Trecho de codigo${lang} definindo a classe ${classMatch[1]} e seu comportamento principal.`;
    }

    const interfaceMatch = compact.match(/\binterface\s+([A-Za-z_$][\w$]*)/);
    if (interfaceMatch?.[1]) {
      return `Trecho de codigo${lang} definindo a interface ${interfaceMatch[1]} e seu contrato de dados.`;
    }

    const typeMatch = compact.match(/\btype\s+([A-Za-z_$][\w$]*)\s*=/);
    if (typeMatch?.[1]) {
      return `Trecho de codigo${lang} definindo o tipo ${typeMatch[1]}.`;
    }

    const functionMatch = compact.match(/\bfunction\s+([A-Za-z_$][\w$]*)\s*\(/);
    if (functionMatch?.[1]) {
      return `Trecho de codigo${lang} com a funcao ${functionMatch[1]} e sua logica principal.`;
    }

    const arrowMatch = compact.match(/\b(?:const|let|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(?:async\s*)?\([^)]*\)\s*=>/);
    if (arrowMatch?.[1]) {
      return `Trecho de codigo${lang} com a funcao ${arrowMatch[1]} e sua implementacao.`;
    }

    if (/^\s*import\s+/m.test(compact) || /^\s*export\s+/m.test(compact)) {
      return `Trecho de codigo${lang} com importacoes e exportacoes do modulo.`;
    }

    if (/^\s*[{\[]/.test(compact) && /[:]/.test(compact)) {
      return `Trecho de dados${lang} em formato estruturado, provavelmente configuracao ou objeto.`;
    }

    if (/\bselect\b|\binsert\b|\bupdate\b|\bdelete\b/i.test(compact)) {
      return "Trecho de consulta de banco de dados com comandos SQL.";
    }

    if (/^\s*<[^>]+>/.test(compact)) {
      return `Trecho de markup${lang} descrevendo estrutura de interface ou documento.`;
    }

    if (firstLine) {
      return `Trecho de codigo${lang} omitido na leitura em voz alta. Primeira linha: ${firstLine.slice(0, 120)}.`;
    }

    return `Trecho de codigo${lang} omitido na leitura em voz alta.`;
  };

  const cleanTextForSpeech = (text: string) => {
    const decodeHtmlEntities = (value: string): string => {
      const named = value
        .replace(/&nbsp;/gi, " ")
        .replace(/&amp;/gi, " e ")
        .replace(/&lt;/gi, " ")
        .replace(/&gt;/gi, " ")
        .replace(/&quot;/gi, " ")
        .replace(/&#39;|&apos;/gi, "'");

      return named
        .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => {
          const cp = Number.parseInt(hex, 16);
          return Number.isFinite(cp) ? String.fromCodePoint(cp) : " ";
        })
        .replace(/&#(\d+);/g, (_, dec: string) => {
          const cp = Number.parseInt(dec, 10);
          return Number.isFinite(cp) ? String.fromCodePoint(cp) : " ";
        });
    };

    const withoutAsciiArtLines = (value: string): string => {
      return value
        .split("\n")
        .filter((line) => {
          const trimmed = line.trim();
          if (!trimmed || trimmed.length < 3) return true;
          const symbolicOnly = /^[\s\-_=|+`~.*:;,#\\/()\[\]{}<>█▄▀▌▐░▒▓─│┌┐└┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬]+$/.test(
            trimmed
          );
          return !symbolicOnly;
        })
        .join("\n");
    };

    return withoutAsciiArtLines(
      decodeHtmlEntities(
        text
          .replace(/```([a-zA-Z0-9_+-]*)\n([\s\S]*?)```/g, (_, lang: string, code: string) => {
            return ` ${summarizeCodeBlockForSpeech(code, (lang || "").toLowerCase())} `;
          })
          .replace(/`([^`]+)`/g, "$1")
          .replace(/(\*\*|__)(.*?)\1/g, "$2")
          .replace(/(\*|_)(.*?)\1/g, "$2")
          .replace(/^#{1,6}\s+/gm, "")
          .replace(/^\s*>\s*/gm, "")
          .replace(/^\s*[-*+]\s+/gm, "")
          .replace(/^\s*\d+\.\s+/gm, "")
          .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
          .replace(/<br\s*\/?>/gi, ". ")
          .replace(/<[^>]+>/g, " ")
          .replace(/¯\\_\(ツ\)_\/¯/g, " ")
          .replace(/\(o_0\)|\(O_O\)|>_<|:\)|:\(|;\)|:\/|:-\)|:-\(/g, " ")
          .replace(/[✅📌🧠📋👉🎯]/g, " ")
          .replace(/([*=>\-~:.#|+])\1{2,}/g, " ")
      )
    )
      .replace(/\n{2,}/g, ". ")
      .replace(/\n/g, " ")
      .replace(/\s{2,}/g, " ")
      .trim();
  };

  const prime = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    if (isPrimedRef.current) return;

    try {
      const warmup = new SpeechSynthesisUtterance(" ");
      warmup.lang = "pt-BR";
      warmup.volume = 0;
      window.speechSynthesis.speak(warmup);
      window.speechSynthesis.cancel();
    } catch {
      // noop
    } finally {
      isPrimedRef.current = true;
    }
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    prime();
    window.speechSynthesis.cancel();
    
    const cleanedText = cleanTextForSpeech(text);
    const speechText = cleanedText || text.trim();
    if (!speechText) return;
    const utter = new SpeechSynthesisUtterance(speechText);
    utter.lang = "pt-BR";
    let started = false;
    setIsSpeaking(true);
    utter.onstart = () => {
      started = true;
      setIsSpeaking(true);
    };
    utter.onend = () => setIsSpeaking(false);
    utter.onerror = () => setIsSpeaking(false);
    
    if (voiceURI) {
      const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
      if (selectedVoice) {
        utter.voice = selectedVoice;
      }
    }
    
    window.speechSynthesis.speak(utter);
    window.setTimeout(() => {
      if (!started) {
        window.speechSynthesis.resume();
      }
    }, 180);
  }, [prime, voiceURI, voices]);

  const stop = useCallback(() => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    setIsSpeaking(false);
  }, []);

  return {
    voices,
    voiceURI,
    setVoiceURI,
    enabled,
    isSpeaking,
    setEnabled,
    prime,
    speak,
    stop,
  };
}

function normalizeAssistantMarkdownForDisplay(content: string): string {
  const segments = content.split(/(```[\s\S]*?```)/g);
  const normalized = segments
    .map((segment) => (segment.startsWith("```") ? segment : segment.replace(/\n{3,}/g, "\n\n")))
    .join("");
  return normalized.replace(/^\n+/, "");
}

function isStopSpeechCommand(text: string, isSpeaking: boolean): boolean {
  if (!isSpeaking) return false;

  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  const commands = [
    "parar leitura",
    "pare leitura",
    "parar voz",
    "pare de falar",
    "silencio",
    "ficar em silencio",
    "stop",
  ];

  return commands.includes(normalized);
}

function isEnableStandbyCommand(text: string): boolean {
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[!?.,;:]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const commands = [
    "modo stand by",
    "modo standby",
    "voltar ao stand by",
    "voltar para stand by",
    "ativar stand by",
    "dormir assistente",
    "durma assistente",
  ];

  return commands.includes(normalized);
}

function isDisableStandbyCommand(text: string): boolean {
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[!?.,;:]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const commands = [
    "sair do stand by",
    "desativar stand by",
    "desativar standby",
    "modo conversa livre",
    "entrar no modo conversa livre",
    "modo conversa continua",
    "entrar no modo conversa continua",
    "escuta continua",
  ];

  return commands.includes(normalized);
}

function normalizeVoiceCommand(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[!?.,;:]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractCommandPayload(text: string, command: string): string {
  const normalized = normalizeVoiceCommand(text);
  if (normalized.startsWith(`${command} `)) {
    return normalized.slice(command.length).trim();
  }
  return "";
}

function parseVoiceReminderCommand(text: string): { message: string; minutes: number } | null {
  return parseReminderIntent(text);
}

function buildDidacticPromptFromCommand(text: string): string | null {
  const normalized = normalizeVoiceCommand(text);

  if (normalized.startsWith("me explique") && normalized.includes("do zero")) {
    const subject = normalized.replace(/^me explique\s*/g, "").replace(/\s*do zero\s*$/g, "").trim();
    if (subject) {
      return `Explique ${subject} do zero, com didatica pedagogica, em passos simples e com exemplos praticos.`;
    }
  }

  if (normalized.startsWith("explique com exemplo") || normalized.startsWith("explique com exemplos")) {
    return "Explique novamente com exemplos praticos, analogias simples e linguagem clara para aprendizado progressivo.";
  }

  if (normalized.startsWith("explique como se eu tivesse")) {
    return "Explique este assunto de forma simples, didatica e progressiva, como para iniciante, com exemplos do dia a dia.";
  }

  if (normalized.startsWith("resuma em 3 pontos")) {
    return "Resuma a explicacao em 3 pontos-chave, com linguagem clara e foco no que preciso memorizar.";
  }

  if (normalized.startsWith("quiz rapido de ")) {
    const subject = extractCommandPayload(normalized, "quiz rapido de");
    if (subject) {
      return `Crie um quiz rapido de ${subject} com 5 perguntas objetivas, nivel progressivo e gabarito comentado ao final.`;
    }
  }

  if (normalized.startsWith("simulado de ")) {
    const subject = extractCommandPayload(normalized, "simulado de");
    if (subject) {
      return `Crie um simulado de ${subject} com 5 questoes e depois forneca gabarito comentado com explicacao didatica.`;
    }
  }

  if (normalized.startsWith("me faca perguntas sobre ")) {
    const subject = extractCommandPayload(normalized, "me faca perguntas sobre");
    if (subject) {
      return `Me faca perguntas socraticas sobre ${subject}, uma por vez, e espere minha resposta para dar feedback.`;
    }
  }

  if (normalized === "corrija minha resposta") {
    return "Corrija minha ultima resposta com feedback didatico: acertos, erros e como melhorar.";
  }

  if (normalized === "crie um plano de estudo" || normalized.startsWith("crie um plano de estudo para ")) {
    const subject = extractCommandPayload(normalized, "crie um plano de estudo para");
    if (subject) {
      return `Crie um plano de estudo para ${subject} com metas semanais, exercicios e revisao espaçada.`;
    }
    return "Crie um plano de estudo estruturado com objetivos, cronograma semanal e metodo de revisao espaçada.";
  }

  if (normalized === "resumir conversa atual" || normalized === "resuma conversa atual") {
    return "Resuma a conversa atual em topicos, decisoes e proximos passos.";
  }

  return null;
}

type SpecialistPreset = {
  key: string;
  title: string;
  instruction: string;
};

const SPECIALIST_PRESETS: Record<string, SpecialistPreset> = {
  professor: {
    key: "professor",
    title: "Professor",
    instruction:
      "Explique de forma didatica, progressiva e sem pular fundamentos. Estruture em: conceito, como funciona, exemplo pratico, erros comuns e mini exercicio.",
  },
  "professor-codigo": {
    key: "professor-codigo",
    title: "Professor de codigo",
    instruction:
      "Explique o codigo em linguagem clara: utilidade do arquivo, estrutura, fluxo e pontos de extensao. Diga como estudar este trecho sem simplificar demais.",
  },
  arquiteto: {
    key: "arquiteto",
    title: "Arquiteto",
    instruction:
      "Responda com foco arquitetural: trade-offs, limites, riscos, escalabilidade e recomendacao final com justificativa.",
  },
  dev: {
    key: "dev",
    title: "Dev",
    instruction:
      "Responda de forma tecnica e objetiva, com passos executaveis, exemplos de implementacao e validacoes praticas.",
  },
  auditor: {
    key: "auditor",
    title: "Auditor",
    instruction:
      "Responda como auditor: identifique riscos, lacunas, impacto, severidade e recomendacoes priorizadas.",
  },
  resumo: {
    key: "resumo",
    title: "Resumo",
    instruction:
      "Responda de forma curta e estruturada em bullets, destacando apenas o essencial para decisao rapida.",
  },
  orcamento: {
    key: "orcamento",
    title: "Orcamento Comercial",
    instruction:
      "Responda como especialista comercial da Roberto Papeis. Monte orcamentos objetivos com: cliente, itens (descricao, referencia, qtd, valor unitario), subtotal e total. Quando houver ambiguidade, peça referencia exata e quantidade antes de fechar.",
  },
};

function extractSpecialistFromText(text: string): {
  specialist: SpecialistPreset | null;
  cleanText: string;
} {
  const match = text.match(/(^|\s)@([a-z0-9-]+)/i);
  if (!match?.[2]) {
    return { specialist: null, cleanText: text.trim() };
  }
  const rawKey = match[2].toLowerCase();
  const specialist = SPECIALIST_PRESETS[rawKey] ?? null;
  const cleanText = text.replace(match[0], " ").replace(/\s+/g, " ").trim();
  return { specialist, cleanText };
}

function applySpecialistPreset(text: string, specialist: SpecialistPreset): string {
  return `Aplique o modo ${specialist.title}. ${specialist.instruction}\n\nSolicitacao do usuario:\n${text}`;
}

function isLikelyNoiseTranscription(text: string): boolean {
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (!normalized) return true;
  if (normalized.length <= 2) return true;

  const knownNoise = [
    "thank you",
    "thanks",
    "thanks for watching",
    "obrigado",
    "obrigada",
    "tchau",
    "chau",
    "bye",
    "ouvir",
    "ok",
    "okay",
  ];

  if (knownNoise.includes(normalized)) return true;
  if (normalized.includes("<span") || normalized.includes("data-loc=")) return true;

  return false;
}

function shouldIgnoreContinuousTranscript(text: string, language?: string): boolean {
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();

  if (extractWakeWordCommand(text) !== null) return false;

  if (isLikelyNoiseTranscription(text)) return true;

  const knownHallucinations = new Set([
    "we remove the sim card slot.",
    "we remove the sim card slot",
    "i'm sorry.",
    "i'm sorry",
    "im sorry",
    "hei!",
    "hei",
  ]);

  if (knownHallucinations.has(normalized)) return true;

  const words = normalized.split(/\s+/).filter(Boolean);
  const lang = (language || "").toLowerCase();
  if (lang && !lang.startsWith("pt") && words.length <= 4) {
    const looksMeaningful = words.some(
      (word) => word.length >= 4 && /^[a-z0-9'\-]+$/i.test(word),
    );
    if (!looksMeaningful) return true;
  }

  return false;
}

function extractWakeWordCommand(text: string): string | null {
  const normalized = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[!?.,;:]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  const wakeWords = [
    "assistente",
    "ava",
    "ei assistente",
    "ok assistente",
    "ei ava",
    "hey ava",
    "ok ava",
  ];

  for (const wake of wakeWords) {
    if (normalized === wake) return "";
  }

  for (const wake of wakeWords) {
    const atStart = new RegExp(`^${wake}\\s+(.+)$`);
    const startMatch = normalized.match(atStart);
    if (startMatch?.[1]) {
      return startMatch[1].trim();
    }

    const inside = new RegExp(`\\b${wake}\\b\\s+(.+)$`);
    const insideMatch = normalized.match(inside);
    if (insideMatch?.[1]) {
      return insideMatch[1].trim();
    }
  }

  return null;
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

function useVoiceActivityDetection(
  onSegment: (blob: Blob) => void,
  threshold = 0.03,
  silenceMs = 1000,
  minSpeechMs = 500
) {
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const intervalRef = useRef<number | null>(null);
  const currentSegmentChunksRef = useRef<BlobPart[]>([]);
  const segmentMimeTypeRef = useRef<string>("audio/webm");
  const speakingRef = useRef(false);
  const lastSpeechRef = useRef<number>(0);
  const currentSpeechStartRef = useRef<number | null>(null);

  const computeRms = useCallback((buffer: Uint8Array) => {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      const v = (buffer[i] - 128) / 128;
      sum += v * v;
    }
    return Math.sqrt(sum / buffer.length);
  }, []);

  const emitSegment = useCallback((duration: number) => {
    if (duration < minSpeechMs || currentSegmentChunksRef.current.length === 0) {
      currentSegmentChunksRef.current = [];
      return;
    }

    const blob = new Blob(currentSegmentChunksRef.current, {
      type: segmentMimeTypeRef.current,
    });
    currentSegmentChunksRef.current = [];
    if (blob.size > 1000) {
      void Promise.resolve(onSegment(blob));
    }
  }, [minSpeechMs, onSegment]);

  const stopSegmentRecorder = useCallback((duration: number) => {
    const recorder = recorderRef.current;
    if (!recorder) {
      emitSegment(duration);
      return;
    }

    if (recorder.state === "inactive") {
      recorderRef.current = null;
      emitSegment(duration);
      return;
    }

    recorder.onstop = () => {
      recorderRef.current = null;
      emitSegment(duration);
    };
    recorder.stop();
  }, [emitSegment]);

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
          : MediaRecorder.isTypeSupported('audio/mp4')
            ? 'audio/mp4'
            : 'audio/webm';

      segmentMimeTypeRef.current = mimeType;

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
            if (!recorderRef.current || recorderRef.current.state === "inactive") {
              currentSegmentChunksRef.current = [];
              const segmentRecorder = new MediaRecorder(stream, { mimeType });
              segmentRecorder.ondataavailable = (e) => {
                if (e.data?.size > 0) {
                  currentSegmentChunksRef.current.push(e.data);
                }
              };
              segmentRecorder.start(100);
              recorderRef.current = segmentRecorder;
            }
          }
          lastSpeechRef.current = now;
        } else if (speakingRef.current && (now - lastSpeechRef.current > silenceMs)) {
          const duration = currentSpeechStartRef.current ? now - currentSpeechStartRef.current : 0;
          speakingRef.current = false;
          currentSpeechStartRef.current = null;
          stopSegmentRecorder(duration);
        }
      }, 50);
    } catch (error) {
      console.error("VAD start error:", error);
      throw error;
    }
  }, [computeRms, silenceMs, stopSegmentRecorder, threshold, onSegment]);

  const stop = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    const duration = currentSpeechStartRef.current
      ? Date.now() - currentSpeechStartRef.current
      : 0;
    stopSegmentRecorder(duration);
    streamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    audioContextRef.current?.close();
    audioContextRef.current = null;
    analyserRef.current = null;
    currentSegmentChunksRef.current = [];
    speakingRef.current = false;
    currentSpeechStartRef.current = null;
  }, [stopSegmentRecorder]);

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
  if (type.startsWith("audio/webm")) return "audio/webm";
  if (type.startsWith("audio/mp4")) return "audio/mp4";
  const supported: AudioMime[] = ["audio/webm", "audio/mp3", "audio/mpeg", "audio/wav", "audio/ogg", "audio/m4a", "audio/mp4"];
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

// ✅ CORREÇÃO: Interface atualizada sem onRetry (já temos o banner externo)
const MessageBubble = memo(({ message, onSpeak }: { message: Message; onSpeak?: (text: string) => void }) => {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";
  const isError = message.role === "assistant" && message.content.startsWith("❌");
  const isAssistantResponse = message.role === "assistant" && !isError;
  const normalizedAssistantContent = isAssistantResponse
    ? normalizeAssistantMarkdownForDisplay(message.content)
    : message.content;

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-4 duration-500`}>
      <Card
        className={`max-w-[76%] px-4 py-3 rounded-2xl shadow-sm break-words overflow-hidden ${
          isUser
            ? "bg-primary text-primary-foreground"
            : isSystem || isError
            ? "bg-destructive/10 text-destructive border border-destructive/20"
            : "bg-muted text-card-foreground border border-border"
        }`}
      >
        <div className="text-sm leading-relaxed break-words [overflow-wrap:anywhere] [&_pre]:whitespace-pre-wrap [&_pre]:break-words [&_code]:break-words">
          {isAssistantResponse ? (
            <Streamdown>{normalizedAssistantContent}</Streamdown>
          ) : (
            <span className="whitespace-pre-wrap">{message.content}</span>
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
              className="h-8 px-2 transition-all hover:text-primary hover:bg-primary/10"
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

import { useSettings } from "@/hooks/useSettings";

export function AVAChatBox({ conversationId, mode }: AVAChatBoxProps) {
  const [, setLocation] = useLocation();
  const { currentModule } = useSettings();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isProcessingFiles, setIsProcessingFiles] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  
  // Estado para teste de conexão
  const [connectionStatus, setConnectionStatus] = useState<"unknown" | "connected" | "error">("unknown");
  const [connectionMessage, setConnectionMessage] = useState<string>("");

  // ✅ Estado para mensagem falhada (para retry)
  const [failedMessageContent, setFailedMessageContent] = useState<string | null>(null);

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
  const [standbyMode, setStandbyMode] = useLocalStorage<boolean>("ava-voice-standby", true);
  const [isWakeWindowOpen, setIsWakeWindowOpen] = useState(false);
  const [lastVoiceCommand, setLastVoiceCommand] = useState<string | null>(null);
  const [lastVoiceCommandType, setLastVoiceCommandType] = useState<VoiceCommandType | null>(null);
  const [voiceTasks, setVoiceTasks] = useLocalStorage<VoiceTask[]>("ava-voice-tasks", []);
  const [quickNotes, setQuickNotes] = useLocalStorage<string[]>("ava-voice-notes", []);
  const [archiveByDefault, setArchiveByDefault] = useLocalStorage<boolean>("ava-archive-by-default", true);
  const [knowledgeMode, setKnowledgeMode] = useLocalStorage<boolean>("ava-knowledge-mode", false);
  const [activeSkill, setActiveSkill] = useLocalStorage<string>("ava-active-skill", "");
  const [contextWindowSize, setContextWindowSize] = useLocalStorage<number>("ava-context-window", 10);

  const tts = useTextToSpeech();

  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimerRef = useRef<number | null>(null);
  const voiceSendTimerRef = useRef<number | null>(null);
  const pendingVoiceMessageRef = useRef<string | null>(null);
  const suppressMicUntilRef = useRef<number>(0);
  const wakeWindowUntilRef = useRef<number>(0);
  const wakeWindowTimerRef = useRef<number | null>(null);
  const lastVoiceCommandTimerRef = useRef<number | null>(null);
  const stopRecordingRef = useRef<() => void>(() => {});
  const ttsStopRef = useRef<() => void>(() => {});
  const fileInputRef = useRef<HTMLInputElement>(null);
  const recordingTimerRef = useRef<number | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const activeRequestIdRef = useRef<number | null>(null);

  const modelsQuery = trpc.llm.listOllamaModels.useQuery(
    { baseUrl: ollamaBaseUrl || undefined, authToken: ollamaAuthToken || undefined },
    { refetchOnWindowFocus: false, enabled: provider === "ollama" }
  );

  const capabilitiesQuery = trpc.llm.getCapabilities.useQuery(
    { provider, model },
    { refetchOnWindowFocus: false }
  );

  const testConnectionQuery = trpc.llm.testConnection.useQuery(
    { 
      baseUrl: ollamaBaseUrl || undefined, 
      authToken: ollamaAuthToken || undefined,
      provider 
    },
    { 
      enabled: false,
      retry: false
    }
  );

  const processFilesMutation = trpc.files.processFiles.useMutation();
  const skillProfilesQuery = trpc.chat.listSkillProfiles.useQuery(undefined, {
    refetchOnWindowFocus: false,
    staleTime: 60_000,
  });
  const { data: initialMessages } = trpc.chat.getMessages.useQuery(
    { conversationId },
    { enabled: conversationId !== 0 }
  );
  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const createConversationMutation = trpc.chat.createConversation.useMutation();
  const transcribeMutation = trpc.voice.transcribe.useMutation();
  const trpcContext = trpc.useContext();
  const skillProfiles = (skillProfilesQuery.data ?? []) as SkillProfile[];

  // Validação do conversationId - Removido redirecionamento forçado para permitir criação
  /*
  useEffect(() => {
    if (conversationId === 0) {
      console.warn("AVAChatBox: conversationId é 0, redirecionando para home...");
      setLocation("/");
    }
  }, [conversationId, setLocation]);
  */

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
      const formattedMessages = initialMessages.map((msg: Message) => ({
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
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && tts.isSpeaking) {
        tts.stop();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [tts.isSpeaking, tts.stop]);

  useEffect(() => {
    if (tts.isSpeaking) {
      suppressMicUntilRef.current = Date.now() + 2000;
      return;
    }
    suppressMicUntilRef.current = Math.max(suppressMicUntilRef.current, Date.now() + 1200);
  }, [tts.isSpeaking]);

  useEffect(() => {
    if (!continuousListening) {
      wakeWindowUntilRef.current = 0;
      setIsWakeWindowOpen(false);
      if (wakeWindowTimerRef.current) {
        clearTimeout(wakeWindowTimerRef.current);
        wakeWindowTimerRef.current = null;
      }
    }
  }, [continuousListening]);

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

  const appendAssistantLocalMessage = useCallback((content: string) => {
    const localMessage: Message = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      role: "assistant",
      content,
      createdAt: new Date(),
    };
    setMessages(prev => [...prev, localMessage]);
  }, []);

  const resolveTypedWorkflowCommand = useCallback((rawText: string): {
    handled: boolean;
    outboundText?: string;
  } => {
    const initial = rawText.trim();
    if (!initial) {
      return { handled: false };
    }

    const { specialist, cleanText } = extractSpecialistFromText(initial);
    const trimmed = cleanText.trim();

    if (!trimmed.startsWith("/") && !specialist) {
      return { handled: false };
    }

    const applySpecialistIfAny = (text: string): string => {
      if (!specialist) return text;
      return applySpecialistPreset(text, specialist);
    };

    if (!trimmed.startsWith("/") && specialist) {
      if (!trimmed) {
        appendAssistantLocalMessage(
          `Especializacao @${specialist.key} detectada, mas faltou o pedido. Exemplo: @${specialist.key} explique autenticacao do projeto.`
        );
        return { handled: true };
      }
      appendAssistantLocalMessage(`Aplicando especializacao @${specialist.key} nesta mensagem.`);
      return {
        handled: true,
        outboundText: applySpecialistIfAny(trimmed),
      };
    }

    const [rawCommand, ...restParts] = trimmed.split(/\s+/);
    const command = rawCommand.slice(1).toLowerCase();
    const args = restParts.join(" ").trim();

    if (command === "help") {
      appendAssistantLocalMessage(
        "Comandos disponiveis: /help, /status, /skill list|use|clear|status, /knowledge on|off, /archive on|off, /brainstorm <tema>, /plan <tema>, /debug <problema>, /teach <tema>, /memory summarize, /orcamento <pedido>. Atalho: /<nome-da-skill> (ex.: /professor-mestre-da-oab). Voce tambem pode usar @professor, @professor-codigo, @arquiteto, @dev, @auditor, @resumo e @orcamento."
      );
      return { handled: true };
    }

    if (command === "orcamento" || command === "orçamento") {
      if (!args) {
        appendAssistantLocalMessage(
          "Uso: /orcamento <pedido>. Ex.: /orcamento cliente teste, produto chambril 66x96 240g, qtd 3"
        );
        return { handled: true };
      }

      return {
        handled: true,
        outboundText: `ORCAMENTO_REQUEST:: ${args}`,
      };
    }

    if (command === "status") {
      appendAssistantLocalMessage(
        `Status rapido:\n- Conversa: ${conversationId || 0}\n- Mensagens: ${messages.length}\n- Provider/modelo: ${provider}/${model}\n- TTS: ${tts.enabled ? "ativo" : "desativado"}\n- Modo conhecimento: ${knowledgeMode ? "ativo" : "desativado"}\n- Arquivar conversa: ${archiveByDefault ? "sim" : "nao"}\n- Skill ativa: ${activeSkill || "nenhuma"}`
      );
      return { handled: true };
    }

    if (command === "skill") {
      const [subRaw, ...skillParts] = args.split(/\s+/).filter(Boolean);
      const sub = (subRaw || "").toLowerCase();
      const skillName = skillParts.join(" ").trim().toLowerCase();

      if (!sub || sub === "help") {
        appendAssistantLocalMessage("Uso: /skill list | /skill use <nome> | /skill clear | /skill status");
        return { handled: true };
      }

      if (sub === "list") {
        if (!skillProfiles.length) {
          appendAssistantLocalMessage("Ainda nao consegui carregar skills da pasta .opencode/skills.");
          return { handled: true };
        }
        const preview = skillProfiles.slice(0, 25).map((item) => `- ${item.id}: ${item.description}`).join("\n");
        appendAssistantLocalMessage(`Skills disponiveis (${skillProfiles.length}):\n${preview}`);
        return { handled: true };
      }

      if (sub === "status") {
        appendAssistantLocalMessage(activeSkill ? `Skill ativa: ${activeSkill}` : "Nenhuma skill ativa no momento.");
        return { handled: true };
      }

      if (sub === "clear" || sub === "off") {
        setActiveSkill("");
        appendAssistantLocalMessage("Skill ativa removida. O chat voltou ao modo padrao.");
        return { handled: true };
      }

      if (sub === "use") {
        if (!skillName) {
          appendAssistantLocalMessage("Uso: /skill use <nome-da-skill>");
          return { handled: true };
        }
        const exists = skillProfiles.some((item) => item.id === skillName);
        if (!exists) {
          appendAssistantLocalMessage(`Skill '${skillName}' nao encontrada em .opencode/skills. Use /skill list para ver opcoes.`);
          return { handled: true };
        }
        setActiveSkill(skillName);
        appendAssistantLocalMessage(`Skill '${skillName}' ativada. As proximas respostas seguirao essa especializacao real.`);
        return { handled: true };
      }

      appendAssistantLocalMessage("Subcomando invalido. Use /skill help");
      return { handled: true };
    }

    if (command === "knowledge") {
      if (args === "on") {
        setKnowledgeMode(true);
        appendAssistantLocalMessage("Modo conhecimento ativado. A proxima mensagem sera preparada para RAG.");
        return { handled: true };
      }
      if (args === "off") {
        setKnowledgeMode(false);
        appendAssistantLocalMessage("Modo conhecimento desativado.");
        return { handled: true };
      }
      appendAssistantLocalMessage("Uso: /knowledge on ou /knowledge off");
      return { handled: true };
    }

    if (command === "archive") {
      if (args === "on") {
        setArchiveByDefault(true);
        appendAssistantLocalMessage("Arquivamento de contexto ativado para novas mensagens.");
        return { handled: true };
      }
      if (args === "off") {
        setArchiveByDefault(false);
        appendAssistantLocalMessage("Arquivamento de contexto desativado.");
        return { handled: true };
      }
      appendAssistantLocalMessage("Uso: /archive on ou /archive off");
      return { handled: true };
    }

    if (command === "memory" && (args === "summarize" || args === "summary" || args === "resumo")) {
      return {
        handled: true,
        outboundText: applySpecialistIfAny("Resuma a conversa atual em topicos, decisoes, pendencias e proximos passos."),
      };
    }

    if (command === "brainstorm") {
      if (!args) {
        appendAssistantLocalMessage("Uso: /brainstorm <tema>");
        return { handled: true };
      }
      return {
        handled: true,
        outboundText: applySpecialistIfAny(
          `Faca um brainstorm estruturado sobre: ${args}. Gere pelo menos 3 opcoes com pros, contras, esforco e recomendacao final.`
        ),
      };
    }

    if (command === "plan") {
      if (!args) {
        appendAssistantLocalMessage("Uso: /plan <tema ou objetivo>");
        return { handled: true };
      }
      return {
        handled: true,
        outboundText: applySpecialistIfAny(
          `Crie um plano de execucao para: ${args}. Inclua fases, tarefas, riscos, dependencias e criterio de pronto.`
        ),
      };
    }

    if (command === "debug") {
      if (!args) {
        appendAssistantLocalMessage("Uso: /debug <problema>");
        return { handled: true };
      }
      return {
        handled: true,
        outboundText: applySpecialistIfAny(
          `Analise e debugue: ${args}. Siga: sintoma, causa raiz provavel, passos de verificacao, correcao recomendada e prevencao.`
        ),
      };
    }

    if (command === "teach") {
      if (!args) {
        appendAssistantLocalMessage("Uso: /teach <assunto>");
        return { handled: true };
      }
      const base = `Explique ${args} de forma didatica: fundamentos, como funciona, exemplo pratico, erros comuns e mini exercicio.`;
      return {
        handled: true,
        outboundText: specialist ? applySpecialistIfAny(base) : applySpecialistPreset(base, SPECIALIST_PRESETS.professor),
      };
    }

    const shortcutSkill = skillProfiles.find((item) => item.id === command);
    if (shortcutSkill) {
      setActiveSkill(shortcutSkill.id);
      appendAssistantLocalMessage(`Skill '${shortcutSkill.id}' ativada via atalho. Agora suas respostas usarao essa especializacao.`);
      if (args) {
        return { handled: true, outboundText: args };
      }
      return { handled: true };
    }

    appendAssistantLocalMessage(
      `Comando '${rawCommand}' nao reconhecido. Use /help para ver opcoes.`
    );
    return { handled: true };
  }, [activeSkill, archiveByDefault, appendAssistantLocalMessage, conversationId, knowledgeMode, messages.length, model, provider, setActiveSkill, setArchiveByDefault, setKnowledgeMode, skillProfiles, tts.enabled]);

  const handleCancelProcessing = useCallback(() => {
    if (!isLoading || activeRequestIdRef.current === null) return;

    activeRequestIdRef.current = null;
    setIsLoading(false);
    setMessages(prev => [
      ...prev,
      {
        id: Date.now(),
        role: "system",
        content: "Processamento cancelado por voce.",
        createdAt: new Date(),
      },
    ]);
    toast.info("Processamento cancelado.");
  }, [isLoading]);

  // ✅ FUNÇÃO ÚNICA E CORRETA handleSendMessage
  const handleSendMessage = useCallback(async (overrideText?: string) => {
    const rawTextToSend = overrideText || input.trim();
    const typedWorkflow = resolveTypedWorkflowCommand(rawTextToSend);
    if (typedWorkflow.handled && !typedWorkflow.outboundText) {
      setInput("");
      return;
    }

    const outboundText = typedWorkflow.outboundText ?? rawTextToSend;
    const textToSend = knowledgeMode && outboundText
      ? `Use esta mensagem como item de conhecimento para RAG. Estruture em: titulo, resumo, pontos-chave e tags. Conteudo: ${outboundText}`
      : outboundText;
    if ((!textToSend && attachments.length === 0) || isLoading) return;

    if (knowledgeMode) {
      setKnowledgeMode(false);
      toast.info("Modo conhecimento aplicado nesta mensagem.");
    }

    // Limpa falha anterior ao tentar novo envio
    setFailedMessageContent(null);

    // Limpa timers
    if (voiceSendTimerRef.current) {
      clearTimeout(voiceSendTimerRef.current);
      voiceSendTimerRef.current = null;
    }
    if (typingTimerRef.current) {
      clearTimeout(typingTimerRef.current);
      typingTimerRef.current = null;
    }

    const now = new Date();
    const userMessageId = Date.now();
    const assistantMessageId = Date.now() + 1;
    
    // Adiciona mensagem do usuário IMEDIATAMENTE (optimistic UI)
    const userMessage: Message = {
      id: userMessageId,
      role: "user",
      content: rawTextToSend || `[${attachments.length} arquivo(s) anexo(s)]`,
      createdAt: now,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);
    const requestId = Date.now() + Math.floor(Math.random() * 1000);
    activeRequestIdRef.current = requestId;
    
    const attachmentsToSend = attachments.map(({ id, isProcessing, ...rest }) => ({
      ...rest,
      content: rest.content,
      textContent: rest.textContent,
    }));
    
    setAttachments([]);
    setIsProcessingFiles(false);
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 50);

    const recentContext = messages.slice(-contextWindowSize).map(m => ({
      role: m.role,
      content: m.content,
      timestamp: m.createdAt.toISOString()
    }));

    const contextPayload = !archiveByDefault
      ? {
          recentMessages: recentContext.slice(0, 0),
          totalPreviousMessages: 0,
        }
      : memory?.summary
        ? {
            summary: memory.summary,
            recentMessages: recentContext,
            totalPreviousMessages: memory.messageCount,
          }
        : {
            recentMessages: recentContext,
            totalPreviousMessages: messages.length,
          };

    try {
      let targetConversationId = conversationId;

      // Se não houver ID de conversa (novo chat), cria uma
      if (targetConversationId === 0) {
        const title = textToSend.slice(0, 50) || "Nova Conversa";
        const newConv = await createConversationMutation.mutateAsync({
          title,
          mode
        });
        targetConversationId = newConv.conversationId;
        // Atualiza URL silenciosamente para não desmontar o componente abruptamente
        window.history.pushState(null, "", `/chat/${targetConversationId}`);
      }

      const response = await sendMessageMutation.mutateAsync({
        conversationId: targetConversationId,
        content: textToSend,
        provider,
        model,
        ...(provider === "ollama" && ollamaBaseUrl.trim() ? { ollamaBaseUrl } : {}),
        ...(provider === "ollama" && ollamaAuthToken.trim() ? { ollamaAuthToken } : {}),
        attachments: attachmentsToSend,
        context: {
          ...contextPayload,
          currentModule: currentModule || "GENERAL",
          activeSkill: activeSkill || undefined,
        },
      });

      if (activeRequestIdRef.current !== requestId) {
        return;
      }

      const assistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: response.assistantMessage,
        createdAt: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
      if (archiveByDefault) {
        updateMemory([...messages, userMessage, assistantMessage]);
      }
    
    // Forçar atualização do histórico na sidebar (invalidate cache)
    trpcContext.chat.listConversations.invalidate();
    
    const shouldSpeakResponse = continuousListening || tts.enabled;
    if (shouldSpeakResponse && !response.assistantMessage.startsWith("❌")) {
        tts.speak(response.assistantMessage);
      }
    } catch (error) {
      if (activeRequestIdRef.current !== requestId) {
        return;
      }

      console.error("Error sending message:", error);
      
      const errorMsg = error instanceof Error ? error.message : "Erro desconhecido";
      let displayMessage = "Desculpe, não consegui responder agora. Tente novamente em instantes.";

      if (error instanceof Error) {
        // ✅ CORREÇÃO: Usando ollamaBaseUrl e model (não input.xxx)
        if (error.message.includes("ECONNREFUSED")) {
          displayMessage = `❌ Ollama não está rodando em ${ollamaBaseUrl || "localhost:11434"}. Verifique se o servidor está ativo.`;
        } else if (error.message.includes("ETIMEDOUT") || error.message.includes("timeout") || error.message.includes("Tempo esgotado")) {
          displayMessage = "❌ Tempo esgotado. O modelo pode estar ocupado ou indisponível.";
        } else if (error.message.includes("fetch failed") || error.message.includes("getaddrinfo")) {
          displayMessage = "❌ Falha na conexão. Verifique se a URL do Ollama está correta e acessível.";
        } else if (error.message.includes("404")) {
          displayMessage = `❌ Modelo "${model || "llama3.1:8b"}" não encontrado. Execute: ollama pull ${model || "llama3.1:8b"}`;
        } else if (error.message.includes("401")) {
          displayMessage = "❌ Não autorizado. Verifique se o token de autenticação está correto.";
        }
      }

      const errorAssistantMessage: Message = {
        id: assistantMessageId,
        role: "assistant",
        content: displayMessage,
        createdAt: new Date(),
      };

      // Guarda o conteúdo que falhou para permitir retry
      setFailedMessageContent(rawTextToSend || `[${attachmentsToSend.length} arquivo(s) anexo(s)]`);

      setMessages(prev => [...prev, errorAssistantMessage]);
      toast.error(`Erro: ${errorMsg}`);
    } finally {
      if (activeRequestIdRef.current === requestId) {
        activeRequestIdRef.current = null;
        setIsLoading(false);
      }
    }
  }, [input, isLoading, knowledgeMode, archiveByDefault, sendMessageMutation, conversationId, provider, model, ollamaBaseUrl, ollamaAuthToken, attachments, tts.enabled, tts.speak, continuousListening, messages, contextWindowSize, memory, setKnowledgeMode, updateMemory, resolveTypedWorkflowCommand, activeSkill]);

  // Função de retry (agora separada e depois da declaração de handleSendMessage)
  const handleRetry = useCallback(() => {
    if (failedMessageContent) {
      handleSendMessage(failedMessageContent);
    }
  }, [failedMessageContent, handleSendMessage]);

  const queueVoiceMessage = useCallback((text: string, delayMs: number) => {
    if (voiceSendTimerRef.current) {
      clearTimeout(voiceSendTimerRef.current);
    }

    voiceSendTimerRef.current = window.setTimeout(() => {
      if (isLoading) {
        pendingVoiceMessageRef.current = text;
        return;
      }
      handleSendMessage(text);
    }, Math.max(100, delayMs));
  }, [handleSendMessage, isLoading]);

  const sendVoiceMessageNowOrQueue = useCallback((text: string) => {
    if (isLoading) {
      pendingVoiceMessageRef.current = text;
      return;
    }
    handleSendMessage(text);
  }, [handleSendMessage, isLoading]);

  useEffect(() => {
    if (!isLoading && pendingVoiceMessageRef.current) {
      const queuedText = pendingVoiceMessageRef.current;
      pendingVoiceMessageRef.current = null;
      handleSendMessage(queuedText);
    }
  }, [isLoading, handleSendMessage]);

  const resolveStandbyCommand = useCallback((rawText: string): string | null => {
    if (!continuousListening || !standbyMode) {
      return rawText.trim();
    }

    const wakeCommand = extractWakeWordCommand(rawText);
    if (wakeCommand !== null) {
      if (!wakeCommand) {
        wakeWindowUntilRef.current = Date.now() + 7000;
        setIsWakeWindowOpen(true);
        if (wakeWindowTimerRef.current) {
          clearTimeout(wakeWindowTimerRef.current);
        }
        wakeWindowTimerRef.current = window.setTimeout(() => {
          setIsWakeWindowOpen(false);
        }, 7000);
        toast.info("Modo ativo por 7s. Diga seu comando.");
        return null;
      }
      wakeWindowUntilRef.current = Date.now() + 3000;
      setIsWakeWindowOpen(true);
      if (wakeWindowTimerRef.current) {
        clearTimeout(wakeWindowTimerRef.current);
      }
      wakeWindowTimerRef.current = window.setTimeout(() => {
        setIsWakeWindowOpen(false);
      }, 3000);
      return wakeCommand;
    }

    if (Date.now() < wakeWindowUntilRef.current) {
      return rawText.trim();
    }

    return null;
  }, [continuousListening, standbyMode]);

  const markVoiceCommand = useCallback((label: string, type: VoiceCommandType) => {
    setLastVoiceCommand(label);
    setLastVoiceCommandType(type);
    if (lastVoiceCommandTimerRef.current) {
      clearTimeout(lastVoiceCommandTimerRef.current);
    }
    lastVoiceCommandTimerRef.current = window.setTimeout(() => {
      setLastVoiceCommand(null);
      setLastVoiceCommandType(null);
    }, 6000);
  }, []);

  const executeVoiceWorkflowCommand = useCallback((text: string): { handled: boolean; forwardText?: string } => {
    const normalized = normalizeVoiceCommand(text);

    const helpTopics: Record<string, string> = {
      standby: "Stand by: diga 'modo stand by'. Para sair: 'sair do stand by'.",
      conversa: "Conversa continua: diga 'modo conversa continua' ou 'escuta continua'.",
      leitura: "Leitura em voz alta: para interromper, diga 'parar leitura'.",
      tarefas: "Tarefas: 'criar tarefa ...', 'listar tarefas de hoje', 'marcar tarefa concluida numero 1'.",
      lembretes: "Lembretes: 'me lembre de ligar para cliente em 15 minutos' ou 'criar lembrete revisar pedido em 1 hora'.",
      didatica: "Didatica: 'me explique ... do zero', 'quiz rapido de ...', 'resuma em 3 pontos'.",
      conhecimento: "Conhecimento: 'usar isso como conhecimento' e 'nao usar isso como conhecimento'.",
    };

    if (["ajuda", "me ajuda", "preciso de ajuda", "solicito ajuda", "abrir ajuda"].includes(normalized)) {
      markVoiceCommand("ajuda", "workflow");
      appendAssistantLocalMessage(
        "Posso ajudar com: stand by, conversa continua, leitura, tarefas, lembretes, didatica e conhecimento. Diga, por exemplo: 'ajuda leitura' ou 'ajuda lembretes'."
      );
      return { handled: true };
    }

    if (normalized.startsWith("ajuda ")) {
      const topicRaw = normalized.slice(6).trim();
      let topic = topicRaw;
      if (topic.includes("stand")) topic = "standby";
      if (topic.includes("conversa") || topic.includes("continua") || topic.includes("contínua")) topic = "conversa";
      if (topic.includes("leitura") || topic.includes("voz") || topic.includes("tts")) topic = "leitura";
      if (topic.includes("tarefa") || topic.includes("secretaria") || topic.includes("secretaria")) topic = "tarefas";
      if (topic.includes("lembrete") || topic.includes("alarme")) topic = "lembretes";
      if (topic.includes("didat") || topic.includes("professor") || topic.includes("ensino")) topic = "didatica";
      if (topic.includes("conhecimento") || topic.includes("rag")) topic = "conhecimento";

      const helpText = helpTopics[topic];
      markVoiceCommand("ajuda", "workflow");
      if (helpText) {
        appendAssistantLocalMessage(helpText);
      } else {
        appendAssistantLocalMessage(
          "Nao encontrei esse topico de ajuda. Tente: ajuda stand by, ajuda conversa, ajuda leitura, ajuda tarefas, ajuda didatica ou ajuda conhecimento."
        );
      }
      return { handled: true };
    }

    if (normalized.startsWith("anote isso")) {
      const note = extractCommandPayload(text, "anote isso");
      if (!note) {
        toast.info("Diga: anote isso e depois o conteudo da nota.");
        return { handled: true };
      }
      setQuickNotes(prev => [note, ...prev].slice(0, 100));
      markVoiceCommand("anote isso", "workflow");
      appendAssistantLocalMessage(`Nota salva: ${note}`);
      return { handled: true };
    }

    const reminder = parseVoiceReminderCommand(text);
    if (reminder) {
      markVoiceCommand("criar lembrete", "workflow");
      appendAssistantLocalMessage(
        `Entendido. Vou criar o lembrete '${reminder.message}' para daqui a ${reminder.minutes} minuto(s).`
      );
      return {
        handled: true,
        forwardText: `Me lembre de ${reminder.message} daqui a ${reminder.minutes} minutos.`,
      };
    }

    const appointment = parseAppointmentIntent(text);
    if (appointment) {
      const whenLabel = appointment.startTime.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
      markVoiceCommand("agendar compromisso", "workflow");
      appendAssistantLocalMessage(
        `Perfeito. Vou agendar '${appointment.title}' para ${whenLabel}.`
      );
      return {
        handled: true,
        forwardText: `Agende ${appointment.title} para ${appointment.startTime.toLocaleString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}${appointment.reminderMinutes ? ` com lembrete de ${appointment.reminderMinutes} minutos antes` : ""}.`,
      };
    }

    if (normalized.startsWith("criar tarefa")) {
      const taskText = extractCommandPayload(text, "criar tarefa");
      if (!taskText) {
        toast.info("Diga: criar tarefa e depois a descricao.");
        return { handled: true };
      }
      const newTask: VoiceTask = {
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        text: taskText,
        done: false,
        priority: "normal",
        createdAt: new Date().toISOString(),
      };
      setVoiceTasks(prev => [newTask, ...prev]);
      markVoiceCommand("criar tarefa", "workflow");
      appendAssistantLocalMessage(`Tarefa criada: ${taskText}`);
      return { handled: true };
    }

    if (normalized === "listar tarefas de hoje") {
      markVoiceCommand("listar tarefas de hoje", "workflow");
      if (!voiceTasks.length) {
        appendAssistantLocalMessage("Voce ainda nao tem tarefas salvas hoje.");
        return { handled: true };
      }
      const lines = voiceTasks.slice(0, 10).map((task, idx) => {
        const status = task.done ? "[concluida]" : "[pendente]";
        const prio = task.priority === "high" ? "[prioridade alta] " : "";
        return `${idx + 1}. ${status} ${prio}${task.text}`;
      });
      appendAssistantLocalMessage(`Tarefas de hoje:\n${lines.join("\n")}`);
      return { handled: true };
    }

    const doneMatch = normalized.match(/^marcar tarefa concluida(?: numero)?\s+(\d+)$/);
    if (doneMatch) {
      const index = Number.parseInt(doneMatch[1] || "0", 10) - 1;
      if (index < 0 || index >= voiceTasks.length) {
        toast.error("Numero de tarefa invalido.");
        return { handled: true };
      }
      const target = voiceTasks[index];
      setVoiceTasks(prev => prev.map((t, i) => i === index ? { ...t, done: true } : t));
      markVoiceCommand("marcar tarefa concluida", "workflow");
      appendAssistantLocalMessage(`Tarefa concluida: ${target?.text || `#${index + 1}`}`);
      return { handled: true };
    }

    const priorityMatch = normalized.match(/^priorizar tarefa(?: numero)?\s+(\d+)$/);
    if (priorityMatch) {
      const index = Number.parseInt(priorityMatch[1] || "0", 10) - 1;
      if (index < 0 || index >= voiceTasks.length) {
        toast.error("Numero de tarefa invalido.");
        return { handled: true };
      }
      const target = voiceTasks[index];
      setVoiceTasks(prev => prev.map((t, i) => i === index ? { ...t, priority: "high" } : t));
      markVoiceCommand("priorizar tarefa", "workflow");
      appendAssistantLocalMessage(`Prioridade alta definida para: ${target?.text || `#${index + 1}`}`);
      return { handled: true };
    }

    if (normalized === "arquivar conversa") {
      setArchiveByDefault(true);
      markVoiceCommand("arquivar conversa", "workflow");
      appendAssistantLocalMessage("Ok. Conversas serao arquivadas por padrao.");
      return { handled: true };
    }

    if (normalized === "nao arquivar conversa" || normalized === "não arquivar conversa") {
      setArchiveByDefault(false);
      markVoiceCommand("nao arquivar conversa", "workflow");
      appendAssistantLocalMessage("Ok. Conversas nao serao arquivadas por padrao.");
      return { handled: true };
    }

    if (normalized === "usar isso como conhecimento" || normalized === "salvar isso na base de conhecimento") {
      setKnowledgeMode(true);
      markVoiceCommand("usar isso como conhecimento", "workflow");
      appendAssistantLocalMessage("Modo conhecimento ativado. Proxima mensagem sera tratada como item para RAG.");
      return { handled: true };
    }

    if (normalized === "nao usar isso como conhecimento" || normalized === "não usar isso como conhecimento") {
      setKnowledgeMode(false);
      markVoiceCommand("nao usar conhecimento", "workflow");
      appendAssistantLocalMessage("Modo conhecimento desativado.");
      return { handled: true };
    }

    const didacticPrompt = buildDidacticPromptFromCommand(text);
    if (didacticPrompt) {
      markVoiceCommand("comando didatico", "workflow");
      return { handled: true, forwardText: didacticPrompt };
    }

    return { handled: false };
  }, [appendAssistantLocalMessage, markVoiceCommand, setArchiveByDefault, setKnowledgeMode, setQuickNotes, setVoiceTasks, voiceTasks.length, voiceTasks]);

  const processTranscription = useCallback(async (audioBlob: Blob) => {
    try {
      setIsTranscribing(true);
      const base64 = await blobToBase64(audioBlob);
      const mime = validateAudioMime(audioBlob.type);

      const result = await transcribeMutation.mutateAsync({
        audioBase64: base64,
        mimeType: mime,
        language: "pt",
      });

      if (!result) {
        toast.error("Resposta vazia do servidor de transcrição");
        return;
      }

      if ('error' in result && result.error) {
        const detail = 'details' in result && result.details ? ` (${result.details})` : "";
        toast.error(`Falha na transcrição: ${result.error}${detail}`);
        return;
      }

      if ('text' in result && typeof result.text === 'string' && result.text.trim()) {
        const rawTranscribedText = result.text.trim();
        const detectedLanguage = 'language' in result && typeof result.language === 'string'
          ? result.language
          : undefined;

        if (isEnableStandbyCommand(rawTranscribedText)) {
          setStandbyMode(true);
          markVoiceCommand("modo stand by", "standby");
          wakeWindowUntilRef.current = 0;
          setIsWakeWindowOpen(false);
          if (wakeWindowTimerRef.current) {
            clearTimeout(wakeWindowTimerRef.current);
            wakeWindowTimerRef.current = null;
          }
          toast.info("Modo stand by ativado.");
          return;
        }

        if (isDisableStandbyCommand(rawTranscribedText)) {
          setContinuousListening(true);
          setStandbyMode(false);
          markVoiceCommand("modo conversa continua", "continuous");
          wakeWindowUntilRef.current = 0;
          setIsWakeWindowOpen(false);
          if (wakeWindowTimerRef.current) {
            clearTimeout(wakeWindowTimerRef.current);
            wakeWindowTimerRef.current = null;
          }
          toast.info("Modo conversa livre ativado.");
          return;
        }

        if (isStopSpeechCommand(rawTranscribedText, tts.isSpeaking)) {
          tts.stop();
          markVoiceCommand("parar leitura", "tts-stop");
          toast.info("Leitura em voz alta interrompida.");
          return;
        }

        if (tts.isSpeaking) {
          return;
        }

        if (continuousListening && shouldIgnoreContinuousTranscript(rawTranscribedText, detectedLanguage)) {
          return;
        }

        const transcribedText = resolveStandbyCommand(rawTranscribedText);
        if (!transcribedText) {
          return;
        }

        const workflow = executeVoiceWorkflowCommand(transcribedText);
        if (workflow.handled) {
          if (workflow.forwardText) {
            setInput(workflow.forwardText);
            if (continuousListening) {
              sendVoiceMessageNowOrQueue(workflow.forwardText);
            } else {
              queueVoiceMessage(workflow.forwardText, Math.max(500, autoSendTypingDelay));
            }
          }
          return;
        }

        setInput(transcribedText);

        if (continuousListening) {
          sendVoiceMessageNowOrQueue(transcribedText);
        } else {
          queueVoiceMessage(transcribedText, Math.max(500, autoSendTypingDelay));
        }
      } else {
        toast.error("Não foi possível transcrever o áudio");
      }
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Erro ao processar áudio");
    } finally {
      setIsTranscribing(false);
    }
  }, [autoSendTypingDelay, continuousListening, executeVoiceWorkflowCommand, markVoiceCommand, queueVoiceMessage, resolveStandbyCommand, sendVoiceMessageNowOrQueue, setContinuousListening, setStandbyMode, transcribeMutation, tts.isSpeaking, tts.stop]);

  const isLoadingRef = useRef(isLoading);
  const isTranscribingRef = useRef(isTranscribing);
  const isSpeakingRef = useRef(tts.isSpeaking);
  const processTranscriptionRef = useRef(processTranscription);

  useEffect(() => {
    isLoadingRef.current = isLoading;
  }, [isLoading]);

  useEffect(() => {
    isTranscribingRef.current = isTranscribing;
  }, [isTranscribing]);

  useEffect(() => {
    isSpeakingRef.current = tts.isSpeaking;
  }, [tts.isSpeaking]);

  useEffect(() => {
    processTranscriptionRef.current = processTranscription;
  }, [processTranscription]);

  const webSpeech = useSpeechRecognition({
    onResult: (text, isFinal) => {
      if (isFinal && isEnableStandbyCommand(text)) {
        setStandbyMode(true);
        markVoiceCommand("modo stand by", "standby");
        wakeWindowUntilRef.current = 0;
        setIsWakeWindowOpen(false);
        if (wakeWindowTimerRef.current) {
          clearTimeout(wakeWindowTimerRef.current);
          wakeWindowTimerRef.current = null;
        }
        toast.info("Modo stand by ativado.");
        return;
      }

      if (isFinal && isDisableStandbyCommand(text)) {
        setContinuousListening(true);
        setStandbyMode(false);
        markVoiceCommand("modo conversa continua", "continuous");
        wakeWindowUntilRef.current = 0;
        setIsWakeWindowOpen(false);
        if (wakeWindowTimerRef.current) {
          clearTimeout(wakeWindowTimerRef.current);
          wakeWindowTimerRef.current = null;
        }
        toast.info("Modo conversa livre ativado.");
        return;
      }

      if (isFinal && isStopSpeechCommand(text, tts.isSpeaking)) {
        tts.stop();
        markVoiceCommand("parar leitura", "tts-stop");
        toast.info("Leitura em voz alta interrompida.");
        return;
      }

      if (Date.now() < suppressMicUntilRef.current) {
        return;
      }

      if (tts.isSpeaking) {
        return;
      }

      if (isFinal && continuousListening && isLikelyNoiseTranscription(text)) {
        return;
      }

      if (!isFinal) {
        if (!continuousListening || !standbyMode) {
          setInput(text);
        }
        return;
      }

      const resolvedText = resolveStandbyCommand(text);
      if (!resolvedText) {
        return;
      }

      const workflow = executeVoiceWorkflowCommand(resolvedText);
      if (workflow.handled) {
        if (workflow.forwardText) {
          setInput(workflow.forwardText);
          if (continuousListening) {
            sendVoiceMessageNowOrQueue(workflow.forwardText);
          } else {
            queueVoiceMessage(workflow.forwardText, autoSendTypingDelay);
          }
        }
        return;
      }

      setInput(resolvedText);
      if (resolvedText.trim()) {
        if (continuousListening) {
          sendVoiceMessageNowOrQueue(resolvedText.trim());
        } else {
          queueVoiceMessage(resolvedText.trim(), autoSendTypingDelay);
        }
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
    tts.prime();
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
        : MediaRecorder.isTypeSupported('audio/webm')
          ? 'audio/webm'
          : MediaRecorder.isTypeSupported('audio/mp4')
            ? 'audio/mp4'
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
  }, [useWebSpeech, webSpeech, processTranscription, tts]);

  const stopRecording = useCallback(() => {
    if (useWebSpeech) {
      webSpeech.stop();
    } else if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  }, [useWebSpeech, webSpeech]);

  useEffect(() => {
    stopRecordingRef.current = stopRecording;
  }, [stopRecording]);

  useEffect(() => {
    ttsStopRef.current = tts.stop;
  }, [tts.stop]);

  useEffect(() => {
    return () => {
      if (typingTimerRef.current) clearTimeout(typingTimerRef.current);
      if (voiceSendTimerRef.current) clearTimeout(voiceSendTimerRef.current);
      if (wakeWindowTimerRef.current) clearTimeout(wakeWindowTimerRef.current);
      if (lastVoiceCommandTimerRef.current) clearTimeout(lastVoiceCommandTimerRef.current);
      if (recordingTimerRef.current) clearInterval(recordingTimerRef.current);
      ttsStopRef.current();
      stopRecordingRef.current();
    };
  }, []);

  const onVadSegment = useCallback(async (blob: Blob) => {
    if (!isSpeakingRef.current && Date.now() < suppressMicUntilRef.current) return;
    if (isLoadingRef.current || isTranscribingRef.current) return;
    await processTranscriptionRef.current(blob);
  }, []);

  const { start: startVad, stop: stopVad } = useVoiceActivityDetection(onVadSegment, 0.03, 1400, 500);

  useEffect(() => {
    if (continuousListening) {
      startVad().catch((err) => {
        console.error("VAD error:", err);
        toast.error("Erro ao iniciar escuta contínua");
        setContinuousListening(false);
      });
    } else {
      stopVad();
    }
    return () => stopVad();
  }, [continuousListening, startVad, stopVad, setContinuousListening]);

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

  const composerContent = (
    <div className="w-full max-w-[2430px] mx-auto space-y-3 md:space-y-4">
      {failedMessageContent && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-xl p-3 flex items-center justify-between gap-3 animate-in slide-in-from-bottom-2">
          <div className="flex-1 min-w-0">
            <p className="text-xs text-destructive font-bold uppercase tracking-wider mb-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> Falha no envio
            </p>
            <p className="text-sm text-muted-foreground truncate italic">"{failedMessageContent}"</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleRetry} disabled={isLoading} className="h-8 text-xs bg-background">
            Tentar novamente
          </Button>
        </div>
      )}

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-2 pb-2">
          {attachments.map((att) => (
            <AttachmentPreview
              key={att.id}
              attachment={att}
              onRemove={removeAttachment}
            />
          ))}
        </div>
      )}

      <div className="relative group w-full lg:w-[60%] max-w-[1458px] mx-auto">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/20 to-primary/5 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />

        <div className="relative flex items-end gap-2 bg-card border border-border/50 rounded-2xl p-2 shadow-2xl">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="h-10 w-10 shrink-0 rounded-xl hover:bg-primary/10 hover:text-primary"
            disabled={isLoading || isProcessingFiles || attachments.length >= 10}
          >
            {isProcessingFiles ? <Loader2 className="h-5 w-5 animate-spin" /> : <Paperclip className="h-5 w-5" />}
          </Button>

          <div className="flex-1 relative">
            <textarea
              rows={1}
              placeholder={isRecording ? `Gravando... ${recordingDuration}s` : "Envie uma mensagem..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isLoading || continuousListening || isProcessingFiles || isRecording}
              className="w-full bg-transparent border-0 focus:ring-0 resize-none py-3 px-2 text-sm max-h-40 min-h-[48px]"
            />
          </div>

          <div className="flex items-center gap-1.5 px-1">
            {tts.isSpeaking && (
              <Button
                variant="destructive"
                size="icon"
                onClick={tts.stop}
                className="h-10 w-10 rounded-xl"
                title="Parar leitura em voz alta (Esc)"
              >
                <VolumeX className="h-5 w-5" />
              </Button>
            )}

            <Button
              variant={isRecording || continuousListening ? "destructive" : "ghost"}
              size="icon"
              onClick={isRecording ? stopRecording : (continuousListening ? () => setContinuousListening(false) : handleStartRecording)}
              disabled={isLoading || isProcessingFiles || (continuousListening && !isRecording)}
              className={`h-10 w-10 rounded-xl transition-all ${isRecording ? "animate-pulse" : ""}`}
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            <Button
              onClick={isLoading ? handleCancelProcessing : () => handleSendMessage()}
              disabled={(!isLoading && (!input.trim() && attachments.length === 0)) || isProcessingFiles || isRecording}
              size="icon"
              variant={isLoading ? "destructive" : "default"}
              className="h-10 w-10 rounded-xl shadow-lg shadow-primary/20"
              title={isLoading ? "Cancelar processamento" : "Enviar mensagem"}
            >
              {isLoading ? <X className="h-5 w-5" /> : <Send className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <div className="flex justify-center pt-0.5 md:pt-1">
        <p className="text-[10px] text-muted-foreground/60 uppercase tracking-[0.2em] font-medium">
          AVA v3.1 • Powered by Gemini & Ollama
        </p>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full w-full min-w-0 bg-background relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10 dark:opacity-[0.03]">
        <div className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
        <div className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full bg-primary blur-[120px]" />
      </div>

      {/* Header */}
      <div className="border-b border-border/50 p-4 bg-background/80 backdrop-blur-md sticky top-0 z-20">
        <div className="w-full max-w-[2430px] mx-auto px-2 md:px-4 lg:px-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
              <Brain className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold flex items-center gap-2">
                AVA Assistant
                {continuousListening && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                  </span>
                )}
                {continuousListening && standbyMode && (
                  <span
                    className={cn(
                      "text-[10px] px-2 py-0.5 rounded-full border font-medium",
                      isWakeWindowOpen
                        ? "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-300"
                        : "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-300"
                    )}
                  >
                    {isWakeWindowOpen ? "Aguardando comando" : "Stand by"}
                  </span>
                )}
                {continuousListening && !standbyMode && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full border font-medium bg-sky-500/10 text-sky-700 border-sky-500/30 dark:text-sky-300">
                    Conversa livre
                  </span>
                )}
              </h2>
              {lastVoiceCommand && (
                <p className="text-[11px] text-muted-foreground mt-0.5 flex items-center gap-1.5">
                  Ultimo comando de voz:
                  <span
                    className={cn(
                      "font-medium px-1.5 py-0.5 rounded-md border",
                      lastVoiceCommandType === "standby" && "text-amber-700 border-amber-500/30 bg-amber-500/10 dark:text-amber-300",
                      lastVoiceCommandType === "continuous" && "text-sky-700 border-sky-500/30 bg-sky-500/10 dark:text-sky-300",
                      lastVoiceCommandType === "tts-stop" && "text-rose-700 border-rose-500/30 bg-rose-500/10 dark:text-rose-300",
                      lastVoiceCommandType === "workflow" && "text-violet-700 border-violet-500/30 bg-violet-500/10 dark:text-violet-300"
                    )}
                  >
                    {lastVoiceCommand}
                  </span>
                </p>
              )}
              <div 
                className="flex items-center gap-1.5 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => setLocation("/configuracoes")}
                title="Abrir Painel de Controle"
              >
                <div className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  mode === "PERFORMANCE" ? "bg-primary animate-pulse" : 
                  mode === "STANDARD" ? "bg-emerald-500" : "bg-blue-400"
                )} />
                <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-bold flex items-center gap-1.5">
                  {mode} • {provider} • {model}
                  {connectionStatus === "connected" && (
                    <span className="flex items-center gap-1 text-green-600 font-bold">
                      <Wifi className="h-3 w-3" /> ONLINE
                    </span>
                  )}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {hasContext && (
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={clearMemory}
                className="h-8 text-xs text-blue-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Limpar Contexto
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 border-border/50">
                  <Settings className="h-3.5 w-3.5 mr-1.5" />
                  Configurar
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-80" align="end" sideOffset={8}>
                <div className="p-2 border-b border-border/50">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="w-full justify-start text-xs font-semibold gap-2 h-9"
                    onClick={() => setLocation("/configuracoes")}
                  >
                    <Settings className="h-4 w-4 text-primary" />
                    Abrir Painel de Controle Completo
                  </Button>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Provedor LLM</DropdownMenuLabel>
                <DropdownMenuRadioGroup
                  value={provider}
                  onValueChange={(v) => {
                    setProvider(v as Provider);
                    setConnectionStatus("unknown");
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
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full text-xs h-8"
                        onClick={(e) => {
                          e.stopPropagation();
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

                <DropdownMenuSeparator />
                <DropdownMenuCheckboxItem
                  checked={tts.enabled}
                  onCheckedChange={(checked) => tts.setEnabled(!!checked)}
                >
                  Falar respostas automaticamente
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={continuousListening}
                  onCheckedChange={(checked) => setContinuousListening(!!checked)}
                >
                  Escuta contínua (VAD)
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={standbyMode}
                  onCheckedChange={(checked) => setStandbyMode(!!checked)}
                  disabled={!continuousListening}
                >
                  Stand by por palavra-chave
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={archiveByDefault}
                  onCheckedChange={(checked) => setArchiveByDefault(!!checked)}
                >
                  Arquivar conversa por padrão
                </DropdownMenuCheckboxItem>

                <DropdownMenuCheckboxItem
                  checked={knowledgeMode}
                  onCheckedChange={(checked) => setKnowledgeMode(!!checked)}
                >
                  Próxima mensagem vira conhecimento
                </DropdownMenuCheckboxItem>

                <DropdownMenuSeparator />
                <DropdownMenuLabel>Comandos de Voz</DropdownMenuLabel>
                <div className="px-2 pb-2 space-y-1 text-[11px] text-muted-foreground leading-relaxed">
                  <p><span className="font-medium text-foreground">Notas salvas:</span> {quickNotes.length}</p>
                  <p><span className="font-medium text-foreground">Tarefas salvas:</span> {voiceTasks.length}</p>
                  <p><span className="font-medium text-foreground">Ajuda:</span> "ajuda" ou "ajuda leitura"</p>
                  <p><span className="font-medium text-foreground">Entrar em stand by:</span> "modo stand by"</p>
                  <p><span className="font-medium text-foreground">Sair do stand by:</span> "sair do stand by"</p>
                  <p><span className="font-medium text-foreground">Conversa contínua:</span> "modo conversa continua"</p>
                  <p><span className="font-medium text-foreground">Parar leitura:</span> "parar leitura"</p>
                  <p><span className="font-medium text-foreground">Secretária:</span> "anote isso ...", "criar tarefa ...", "listar tarefas de hoje"</p>
                  <p><span className="font-medium text-foreground">Didática:</span> "me explique ... do zero", "quiz rapido de ...", "resuma em 3 pontos"</p>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-hidden relative flex flex-col">
        {messages.length === 0 ? (
          <div className="w-full h-full overflow-hidden">
            <div className="m-auto w-full max-w-[2430px] px-3 md:px-6 lg:px-8 h-full flex flex-col justify-center text-center">
              <div
                key="welcome"
                className="w-full flex flex-col items-center justify-center gap-6 md:gap-8 translate-y-1 md:translate-y-2 animate-in fade-in zoom-in duration-700 ease-out"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 blur-3xl rounded-full scale-150" />
                  <div className="relative w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl border border-white/20">
                    <Brain className="h-12 w-12 text-white" />
                  </div>
                </div>
                
                <div className="text-center space-y-3 w-full max-w-3xl">
                  <h1 className="text-3xl font-bold tracking-tight">Como posso ajudar hoje?</h1>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    Estou pronto para analisar arquivos, transcrever áudios ou apenas conversar. 
                    O que você tem em mente?
                  </p>
                </div>

                <div className="hidden md:grid grid-cols-4 gap-4 w-full max-w-6xl">
                  {[
                    { title: "Analisar Documentos", desc: "Envie PDFs ou planilhas para análise", icon: FileText },
                    { title: "Transcrição de Voz", desc: "Clique no microfone para falar", icon: Mic },
                    { title: "Ajuda com Código", desc: "Suporte para +20 linguagens", icon: FileCode },
                    { title: "Memória Inteligente", desc: "Lembro do contexto da conversa", icon: Brain }
                  ].map((item, i) => (
                    <Button 
                      key={i} 
                      variant="outline" 
                      className="h-auto p-4 flex flex-col items-start gap-2 hover:bg-primary/5 hover:border-primary/30 transition-all border-border/50 bg-card/50"
                      onClick={() => setInput(item.title)}
                    >
                      <item.icon className="h-5 w-5 text-primary" />
                      <div className="text-left">
                        <div className="font-semibold text-sm">{item.title}</div>
                        <div className="text-xs text-muted-foreground">{item.desc}</div>
                      </div>
                    </Button>
                  ))}
                </div>

                {provider === "ollama" && connectionStatus !== "connected" && (
                  <div className="mt-12 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-3 text-orange-600 dark:text-orange-400 max-w-md">
                    <WifiOff className="h-5 w-5 shrink-0" />
                    <p className="text-xs leading-relaxed">
                      Ollama não detectado. Certifique-se que o servidor está rodando para começar.
                    </p>
                  </div>
                )}

                <div className="w-full max-w-6xl pt-1 md:pt-2">
                  {composerContent}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ScrollArea className="w-full h-full">
            <div className="w-full max-w-[2430px] mx-auto px-2.5 md:px-4 lg:px-6 pt-6 pb-3 md:pt-8 md:pb-4 min-h-full flex flex-col">
              <div
                key="chat"
                className="space-y-8 pb-2 w-full animate-in fade-in slide-in-from-bottom-8 duration-700 ease-out"
              >
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    onSpeak={tts.speak}
                  />
                ))}
                <div ref={scrollRef} />
              </div>
            </div>
          </ScrollArea>
        )}

        {messages.length > 0 && (
          <div className="w-full shrink-0 pt-2 pb-2 md:pt-3 md:pb-3 bg-gradient-to-t from-background via-background/95 to-transparent">
            <div className="w-full max-w-[2430px] mx-auto px-2.5 md:px-4 lg:px-6">
              {composerContent}
            </div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        className="hidden"
        multiple
      />
    </div>
  );
}
