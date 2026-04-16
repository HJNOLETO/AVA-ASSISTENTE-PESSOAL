import React from "react";
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Volume2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface VoiceControlsProps {
  isRecording: boolean;
  isTranscribing: boolean;
  continuousListening: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onToggleContinuousListening: () => void;
}

export const VoiceControls: React.FC<VoiceControlsProps> = ({
  isRecording,
  isTranscribing,
  continuousListening,
  onStartRecording,
  onStopRecording,
  onToggleContinuousListening,
}) => {
  return (
    <div className="flex items-center gap-1.5">
      {/* Gravação única */}
      <Button
        variant="ghost"
        size="icon"
        onClick={isRecording ? onStopRecording : onStartRecording}
        disabled={isTranscribing}
        title={isRecording ? "Parar gravação" : "Iniciar gravação"}
        className={cn(
          "h-9 w-9 rounded-full transition-all duration-300 relative",
          isRecording 
            ? "text-red-500 hover:text-red-600 bg-red-500/10 hover:bg-red-500/20" 
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        {isRecording && (
          <span className="absolute inset-0 rounded-full bg-red-500/20 animate-ping pointer-events-none" />
        )}
        {isTranscribing ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : isRecording ? (
          <MicOff className="h-4 w-4" />
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </Button>

      {/* Escuta contínua */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onToggleContinuousListening}
        title={continuousListening ? "Desativar escuta contínua" : "Ativar escuta contínua"}
        className={cn(
          "h-9 w-9 rounded-full transition-all",
          continuousListening
            ? "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
            : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
        )}
      >
        <Volume2 className={cn("h-4 w-4", continuousListening && "animate-pulse")} />
      </Button>
    </div>
  );
};
