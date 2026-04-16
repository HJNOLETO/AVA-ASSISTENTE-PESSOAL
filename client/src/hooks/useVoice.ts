import { useState, useRef, useEffect } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface UseVoiceProps {
  autoSendOnSilence: boolean;
  autoSendTypingDelay: number;
  onTranscriptionComplete: (text: string) => void;
  onSendMessage: () => Promise<void>;
}

interface UseVoiceReturn {
  isRecording: boolean;
  isTranscribing: boolean;
  continuousListening: boolean;
  useWebSpeech: boolean;
  voices: SpeechSynthesisVoice[];
  voiceIndex: number;
  ttsEnabled: boolean;
  setIsRecording: (value: boolean) => void;
  setContinuousListening: (value: boolean) => void;
  setUseWebSpeech: (value: boolean) => void;
  setVoiceIndex: (value: number) => void;
  setTtsEnabled: (value: boolean) => void;
  startRecording: () => Promise<void>;
  stopRecording: () => void;
  speakText: (text: string) => void;
}

export function useVoice({
  autoSendOnSilence,
  autoSendTypingDelay,
  onTranscriptionComplete,
  onSendMessage,
}: UseVoiceProps): UseVoiceReturn {
  const [isRecording, setIsRecording] = useState(false);
  const [continuousListening, setContinuousListening] = useState<boolean>(
    localStorage.getItem("ava-continuous-listen") === "true"
  );
  const [useWebSpeech, setUseWebSpeech] = useState<boolean>(
    localStorage.getItem("ava-use-webspeech") === "true"
  );
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceIndex, setVoiceIndex] = useState<number>(() => {
    const v = localStorage.getItem("ava-tts-voice-index");
    return v ? parseInt(v) : -1;
  });
  const [ttsEnabled, setTtsEnabled] = useState<boolean>(
    localStorage.getItem("ava-tts-enabled") === "true"
  );

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recognitionRef = useRef<any>(null);
  const continuousStreamRef = useRef<MediaStream | null>(null);
  const continuousRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const currentSegmentChunksRef = useRef<BlobPart[]>([]);
  const lastSpeechMsRef = useRef<number>(0);
  const speakingRef = useRef<boolean>(false);
  const voiceSendTimerRef = useRef<number | null>(null);
  const recordStartRef = useRef<number | null>(null);
  const vadIntervalRef = useRef<number | null>(null);

  const transcribeMutation = trpc.voice.transcribe.useMutation();

  // Configurar vozes disponíveis
  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const updateVoices = () => setVoices(window.speechSynthesis.getVoices());
    updateVoices();
    window.speechSynthesis.onvoiceschanged = updateVoices;
  }, []);

  // Salvar preferências no localStorage
  useEffect(() => {
    localStorage.setItem("ava-continuous-listen", String(continuousListening));
  }, [continuousListening]);

  useEffect(() => {
    localStorage.setItem("ava-use-webspeech", String(useWebSpeech));
  }, [useWebSpeech]);

  useEffect(() => {
    localStorage.setItem("ava-tts-voice-index", String(voiceIndex));
  }, [voiceIndex]);

  useEffect(() => {
    localStorage.setItem("ava-tts-enabled", String(ttsEnabled));
  }, [ttsEnabled]);

  const speakText = (text: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    const utter = new SpeechSynthesisUtterance(text);
    if (voiceIndex >= 0 && voices[voiceIndex]) {
      utter.voice = voices[voiceIndex];
    }
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utter);
  };

  const computeRms = (buffer: Uint8Array) => {
    let sum = 0;
    for (let i = 0; i < buffer.length; i++) {
      const v = (buffer[i] - 128) / 128;
      sum += v * v;
    }
    return Math.sqrt(sum / buffer.length);
  };

  const stopContinuousListening = () => {
    if (vadIntervalRef.current) {
      window.clearInterval(vadIntervalRef.current);
      vadIntervalRef.current = null;
    }
    if (continuousRecorderRef.current) {
      try {
        continuousRecorderRef.current.stop();
      } catch {}
      continuousRecorderRef.current = null;
    }
    if (continuousStreamRef.current) {
      continuousStreamRef.current.getTracks().forEach(t => t.stop());
      continuousStreamRef.current = null;
    }
    if (audioContextRef.current) {
      try {
        audioContextRef.current.close();
      } catch {}
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    currentSegmentChunksRef.current = [];
    speakingRef.current = false;
  };

  const finalizeSegmentAndTranscribe = async () => {
    if (!currentSegmentChunksRef.current.length) return;
    const audioBlob = new Blob(currentSegmentChunksRef.current, {
      type: "audio/webm",
    });
    currentSegmentChunksRef.current = [];
    try {
      const reader = new FileReader();
      await new Promise<void>((resolve, reject) => {
        reader.onloadend = () => resolve();
        reader.onerror = () => reject(new Error("reader"));
        reader.readAsDataURL(audioBlob);
      });
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1] || "";
      const supportedMimes = [
        "audio/webm",
        "audio/mp3",
        "audio/mpeg",
        "audio/wav",
        "audio/ogg",
        "audio/m4a",
      ];
      const mime = supportedMimes.includes(audioBlob.type)
        ? (audioBlob.type as any)
        : ("audio/webm" as any);
      const result = await transcribeMutation.mutateAsync({
        audioBase64: base64,
        mimeType: mime,
      });
      if (typeof (result as any).text === "string") {
        const text = (result as any).text as string;
        onTranscriptionComplete(text);
        if (autoSendOnSilence && text.trim().length > 0) {
          const prev = text;
          await Promise.resolve();
          if (voiceSendTimerRef.current) {
            window.clearTimeout(voiceSendTimerRef.current);
            voiceSendTimerRef.current = null;
          }
          voiceSendTimerRef.current = window.setTimeout(
            async () => {
              await onSendMessage();
            },
            Math.max(0, autoSendTypingDelay)
          );
        }
      }
    } catch (error) {
      console.error("Transcription error:", error);
      toast.error("Erro na transcrição");
    }
  };

  const startContinuousListeningMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      continuousStreamRef.current = stream;
      const ctx = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      audioContextRef.current = ctx;
      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);
      analyserRef.current = analyser;

      const recorder = new MediaRecorder(stream);
      continuousRecorderRef.current = recorder;
      recorder.ondataavailable = e => {
        if (speakingRef.current && e.data && e.data.size > 0) {
          currentSegmentChunksRef.current.push(e.data);
        }
      };
      recorder.start(500);

      const threshold = 0.03;
      const silenceMs = 800;
      const minSpeechMs = 400;
      let currentSpeechStart: number | null = null;
      vadIntervalRef.current = window.setInterval(async () => {
        if (!analyserRef.current) return;
        const buf = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteTimeDomainData(buf);
        const rms = computeRms(buf);
        const now = Date.now();
        if (rms > threshold) {
          speakingRef.current = true;
          lastSpeechMsRef.current = now;
          if (currentSpeechStart === null) currentSpeechStart = now;
        } else {
          if (
            speakingRef.current &&
            now - lastSpeechMsRef.current > silenceMs
          ) {
            const duration = currentSpeechStart ? now - currentSpeechStart : 0;
            speakingRef.current = false;
            currentSpeechStart = null;
            if (duration >= minSpeechMs) {
              await finalizeSegmentAndTranscribe();
            } else {
              currentSegmentChunksRef.current = [];
            }
          }
        }
      }, 200);
    } catch (error) {
      console.error("Error starting continuous listening:", error);
      toast.error("Erro ao iniciar escuta contínua");
    }
  };

  const startContinuousListeningWebSpeech = () => {
    const SR: any =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const recognition = new SR();
    recognition.lang = "pt-BR";
    recognition.interimResults = true;
    recognition.continuous = true;
    let finalTranscript = "";
    recognition.onresult = (event: any) => {
      let interim = "";
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += transcript;
        else interim += transcript;
      }
      onTranscriptionComplete(finalTranscript || interim);
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      if (continuousListening) {
        startContinuousListeningWebSpeech();
        if (autoSendOnSilence && (finalTranscript?.trim()?.length ?? 0) > 0) {
          const toSend = finalTranscript.trim();
          if (voiceSendTimerRef.current) {
            window.clearTimeout(voiceSendTimerRef.current);
            voiceSendTimerRef.current = null;
          }
          voiceSendTimerRef.current = window.setTimeout(
            () => {
              onSendMessage();
            },
            Math.max(0, autoSendTypingDelay)
          );
        }
      } else {
        setIsRecording(false);
      }
    };
    recognition.onerror = () => {
      recognitionRef.current = null;
      setIsRecording(false);
    };
    recognitionRef.current = recognition;
    recognition.start();
    setIsRecording(true);
  };

  useEffect(() => {
    if (!continuousListening) {
      stopContinuousListening();
      return;
    }
    if (useWebSpeech && typeof window !== "undefined") {
      startContinuousListeningWebSpeech();
    } else {
      startContinuousListeningMedia();
    }
    return () => {
      stopContinuousListening();
    };
  }, [continuousListening, useWebSpeech]);

  useEffect(() => {
    return () => {
      if (voiceSendTimerRef.current) {
        window.clearTimeout(voiceSendTimerRef.current);
        voiceSendTimerRef.current = null;
      }
    };
  }, []);

  const startRecording = async () => {
    if (useWebSpeech && typeof window !== "undefined") {
      const SR: any =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SR) {
        toast.error("Reconhecimento de voz não suportado");
        return;
      }
      const recognition = new SR();
      recognition.lang = "pt-BR";
      recognition.interimResults = true;
      recognition.continuous = false;
      let finalTranscript = "";
      recognition.onresult = (event: any) => {
        let interim = "";
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) finalTranscript += transcript;
          else interim += transcript;
        }
        onTranscriptionComplete(finalTranscript || interim);
      };
      recognition.onend = () => {
        recognitionRef.current = null;
        setIsRecording(false);
        if (finalTranscript.trim()) {
          onTranscriptionComplete(finalTranscript);
        }
      };
      recognition.onerror = () => {
        recognitionRef.current = null;
        setIsRecording(false);
        toast.error("Erro no reconhecimento de voz");
      };
      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } else {
      // Gravação média tradicional
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        const chunks: BlobPart[] = [];
        
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) chunks.push(e.data);
        };
        
        recorder.onstop = async () => {
          const audioBlob = new Blob(chunks, { type: "audio/webm" });
          stream.getTracks().forEach(t => t.stop());
          
          try {
            const reader = new FileReader();
            await new Promise<void>((resolve, reject) => {
              reader.onloadend = () => resolve();
              reader.onerror = () => reject(new Error("reader"));
              reader.readAsDataURL(audioBlob);
            });
            
            const dataUrl = reader.result as string;
            const base64 = dataUrl.split(",")[1] || "";
            const result = await transcribeMutation.mutateAsync({
              audioBase64: base64,
              mimeType: "audio/webm",
            });
            
            if (typeof (result as any).text === "string") {
              onTranscriptionComplete((result as any).text);
            }
          } catch (error) {
            console.error("Transcription error:", error);
            toast.error("Erro na transcrição");
          }
        };
        
        recorder.start();
        recordStartRef.current = Date.now();
        setIsRecording(true);
      } catch (error) {
        console.error("Error starting recording:", error);
        toast.error("Erro ao iniciar gravação");
      }
    }
  };

  const stopRecording = () => {
    if (useWebSpeech && recognitionRef.current) {
      recognitionRef.current.stop();
    } else if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return {
    isRecording,
    isTranscribing: transcribeMutation.isPending,
    continuousListening,
    useWebSpeech,
    voices,
    voiceIndex,
    ttsEnabled,
    setIsRecording,
    setContinuousListening,
    setUseWebSpeech,
    setVoiceIndex,
    setTtsEnabled,
    startRecording,
    stopRecording,
    speakText,
  };
}