/**
 * Voice transcription helper using internal Speech-to-Text service
 *
 * Frontend implementation guide:
 * 1. Capture audio using MediaRecorder API
 * 2. Upload audio to storage (e.g., S3) to get URL
 * 3. Call transcription with the URL
 * 
 * Example usage:
 * ```tsx
 * // Frontend component
 * const transcribeMutation = trpc.voice.transcribe.useMutation({
 *   onSuccess: (data) => {
 *     console.log(data.text); // Full transcription
 *     console.log(data.language); // Detected language
 *     console.log(data.segments); // Timestamped segments
 *   }
 * });
 * 
 * // After uploading audio to storage
 * transcribeMutation.mutate({
 *   audioUrl: uploadedAudioUrl,
 *   language: 'en', // optional
 *   prompt: 'Transcribe the meeting' // optional
 * });
 * ```
 */
import { ENV } from "./env";

export type TranscribeOptions = {
  audioUrl?: string; // URL to the audio file (e.g., S3 URL)
  audioData?: Buffer | Uint8Array; // Raw audio bytes (used when audio is sent directly)
  mimeType?: string; // MIME type when audioData is provided
  language?: string; // Optional: specify language code (e.g., "en", "es", "zh")
  prompt?: string; // Optional: custom prompt for the transcription
  model?: string; // Optional: specific model name (e.g., "whisper-large-v3")
};

// Native Whisper API segment format
export type WhisperSegment = {
  id: number;
  seek: number;
  start: number;
  end: number;
  text: string;
  tokens: number[];
  temperature: number;
  avg_logprob: number;
  compression_ratio: number;
  no_speech_prob: number;
};

// Native Whisper API response format
export type WhisperResponse = {
  task: "transcribe";
  language: string;
  duration: number;
  text: string;
  segments: WhisperSegment[];
};

export type TranscriptionResponse = WhisperResponse; // Return native Whisper API response directly

export type TranscriptionError = {
  error: string;
  code: "FILE_TOO_LARGE" | "INVALID_FORMAT" | "TRANSCRIPTION_FAILED" | "UPLOAD_FAILED" | "SERVICE_ERROR";
  details?: string;
};

/**
 * Transcribe audio to text using the internal Speech-to-Text service
 * 
 * @param options - Audio data and metadata
 * @returns Transcription result or error
 */
export async function transcribeAudio(
  options: TranscribeOptions
): Promise<TranscriptionResponse | TranscriptionError> {
  try {
    // Step 1: Validate environment configuration
    const useLocalWhisper = !!ENV.localWhisperUrl;
    const useOpenAI = !!ENV.openaiApiKey;
    const useGroq = !!ENV.groqApiKey;
    const useForge = !!(ENV.forgeApiUrl && ENV.forgeApiKey);

    if (!useLocalWhisper && !useOpenAI && !useGroq && !useForge) {
      return {
        error: "Voice transcription service is not configured",
        code: "SERVICE_ERROR",
        details: "No transcription provider configured. Set WHISPER_LOCAL_URL, OPENAI_API_KEY, GROQ_API_KEY, or BUILT_IN_FORGE_API_URL/KEY"
      };
    }

    // Step 2: Load audio data (direct bytes preferred, fallback to URL download)
    let audioBuffer: Buffer;
    let mimeType: string;
    if (options.audioData) {
      audioBuffer = Buffer.from(options.audioData);
      mimeType = normalizeMimeType(options.mimeType || "audio/webm");
    } else {
      if (!options.audioUrl) {
        return {
          error: "Audio data missing",
          code: "INVALID_FORMAT",
          details: "Provide either audioData + mimeType or audioUrl"
        };
      }

      try {
        const response = await fetch(options.audioUrl);
        if (!response.ok) {
          return {
            error: "Failed to download audio file",
            code: "INVALID_FORMAT",
            details: `HTTP ${response.status}: ${response.statusText}`
          };
        }

        audioBuffer = Buffer.from(await response.arrayBuffer());
        mimeType = normalizeMimeType(response.headers.get("content-type") || "audio/mpeg");
      } catch (error) {
        return {
          error: "Failed to fetch audio file",
          code: "SERVICE_ERROR",
          details: error instanceof Error ? error.message : "Unknown error"
        };
      }
    }

    // Check file size (25MB limit for OpenAI/Groq, 16MB for Forge, 25MB for local)
    const sizeMB = audioBuffer.length / (1024 * 1024);
    let limit = 25;
    if (useForge) limit = 16;
    if (sizeMB > limit) {
      return {
        error: "Audio file exceeds maximum size limit",
        code: "FILE_TOO_LARGE",
        details: `File size is ${sizeMB.toFixed(2)}MB, maximum allowed is ${limit}MB`
      };
    }

    // Step 3: Prepare payload metadata for multipart upload to Whisper API
    const filename = `audio.${getFileExtension(mimeType)}`;
    const audioBlob = new Blob([new Uint8Array(audioBuffer)], { type: mimeType });
    
    // Determine the default model based on the chosen provider
    let defaultModel = "whisper-1"; // Standard for OpenAI/Forge
    if (useGroq) {
      defaultModel = "whisper-large-v3"; // Standard for Groq
    }

    // Whisper prompt should be optional context, not a transcription instruction.
    // Instruction-like prompts can leak into output as hallucinated text.
    const prompt = options.prompt?.trim();

    const buildFormData = (model: string): FormData => {
      const formData = new FormData();
      formData.append("file", audioBlob, filename);
      formData.append("model", model);
      formData.append("response_format", "verbose_json");
      if (options.language?.trim()) {
        formData.append("language", options.language.trim());
      }
      if (prompt) {
        formData.append("prompt", prompt);
      }
      return formData;
    };

    // Step 4: Call the transcription service
    let fullUrl: string;
    let apiKey: string;
    let headers: Record<string, string> = {
      "Accept-Encoding": "identity",
    };

    if (useLocalWhisper) {
      fullUrl = `${ENV.localWhisperUrl}/v1/audio/transcriptions`;
      apiKey = "";
    } else if (useGroq) {
      fullUrl = "https://api.groq.com/openai/v1/audio/transcriptions";
      apiKey = ENV.groqApiKey;
    } else if (useOpenAI) {
      fullUrl = "https://api.openai.com/v1/audio/transcriptions";
      apiKey = ENV.openaiApiKey;
    } else {
      const baseUrl = ENV.forgeApiUrl.endsWith("/")
        ? ENV.forgeApiUrl
        : `${ENV.forgeApiUrl}/`;
      
      fullUrl = new URL(
        "v1/audio/transcriptions",
        baseUrl
      ).toString();
      apiKey = ENV.forgeApiKey;
    }

    if (apiKey) {
      headers["authorization"] = `Bearer ${apiKey}`;
    }

    const modelsToTry = useLocalWhisper && !options.model
      ? ["whisper-small", "whisper-base"]
      : [options.model || defaultModel];

    const attemptErrors: string[] = [];

    // Step 5: Call service (with optional local fallback) and parse result
    for (const model of modelsToTry) {
      const apiResponse = await fetch(fullUrl, {
        method: "POST",
        headers,
        body: buildFormData(model),
      });

      if (!apiResponse.ok) {
        let errorText = "";
        try {
          errorText = await apiResponse.text();
        } catch (error) {
          console.warn("[VoiceTranscription] Failed to read provider error body:", error);
        }
        attemptErrors.push(
          `[model=${model}] ${apiResponse.status} ${apiResponse.statusText}${errorText ? `: ${errorText}` : ""}`
        );
        continue;
      }

      const whisperResponse = await apiResponse.json() as WhisperResponse;
      if (whisperResponse.text && typeof whisperResponse.text === "string") {
        if (isInstructionLeak(whisperResponse.text)) {
          attemptErrors.push(
            `[model=${model}] ignored instruction-like transcription output`
          );
          continue;
        }
        return whisperResponse; // Return native Whisper API response directly
      }

      attemptErrors.push(
        `[model=${model}] invalid response format from transcription service`
      );
    }

    return {
      error: "Transcription service request failed",
      code: "TRANSCRIPTION_FAILED",
      details: attemptErrors.join(" | ") || "No model attempt succeeded"
    };

  } catch (error) {
    // Handle unexpected errors
    return {
      error: "Voice transcription failed",
      code: "SERVICE_ERROR",
      details: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}

/**
 * Helper function to get file extension from MIME type
 */
function getFileExtension(mimeType: string): string {
  const normalized = normalizeMimeType(mimeType);
  const mimeToExt: Record<string, string> = {
    'audio/webm': 'webm',
    'audio/mp3': 'mp3',
    'audio/mpeg': 'mp3',
    'audio/wav': 'wav',
    'audio/wave': 'wav',
    'audio/ogg': 'ogg',
    'audio/m4a': 'm4a',
    'audio/mp4': 'm4a',
  };

  return mimeToExt[normalized] || 'audio';
}

function normalizeMimeType(value: string): string {
  const lower = value.toLowerCase().trim();
  const base = lower.split(";")[0]?.trim() || "audio/webm";

  if (base === "audio/x-wav") return "audio/wav";
  if (base === "audio/x-m4a") return "audio/m4a";
  if (base === "audio/mpga") return "audio/mpeg";

  return base;
}

function isInstructionLeak(text: string): boolean {
  const normalized = text
    .toLowerCase()
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/\s+/g, " ")
    .trim();

  const knownArtifacts = new Set([
    "the user's voice",
    "the user's voice.",
    "transcribe the user's voice to text",
    "transcribe the user's voice to text.",
    "user's voice",
    "user's voice.",
  ]);

  return knownArtifacts.has(normalized);
}

/**
 * Helper function to get full language name from ISO code
 */
function getLanguageName(langCode: string): string {
  const langMap: Record<string, string> = {
    'en': 'English',
    'es': 'Spanish',
    'fr': 'French',
    'de': 'German',
    'it': 'Italian',
    'pt': 'Portuguese',
    'ru': 'Russian',
    'ja': 'Japanese',
    'ko': 'Korean',
    'zh': 'Chinese',
    'ar': 'Arabic',
    'hi': 'Hindi',
    'nl': 'Dutch',
    'pl': 'Polish',
    'tr': 'Turkish',
    'sv': 'Swedish',
    'da': 'Danish',
    'no': 'Norwegian',
    'fi': 'Finnish',
  };
  
  return langMap[langCode] || langCode;
}

/**
 * Example tRPC procedure implementation:
 * 
 * ```ts
 * // In server/routers.ts
 * import { transcribeAudio } from "./_core/voiceTranscription";
 * 
 * export const voiceRouter = router({
 *   transcribe: protectedProcedure
 *     .input(z.object({
 *       audioUrl: z.string(),
 *       language: z.string().optional(),
 *       prompt: z.string().optional(),
 *     }))
 *     .mutation(async ({ input, ctx }) => {
 *       const result = await transcribeAudio(input);
 *       
 *       // Check if it's an error
 *       if ('error' in result) {
 *         throw new TRPCError({
 *           code: 'BAD_REQUEST',
 *           message: result.error,
 *           cause: result,
 *         });
 *       }
 *       
 *       // Optionally save transcription to database
 *       await db.insert(transcriptions).values({
 *         userId: ctx.user.id,
 *         text: result.text,
 *         duration: result.duration,
 *         language: result.language,
 *         audioUrl: input.audioUrl,
 *         createdAt: new Date(),
 *       });
 *       
 *       return result;
 *     }),
 * });
 * ```
 */
