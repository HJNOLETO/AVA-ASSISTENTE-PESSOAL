import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2, Zap, Cpu, Monitor, Loader2 } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type OperationMode = "ECO" | "STANDARD" | "PERFORMANCE";

interface ModeCapabilities {
  mode: OperationMode;
  stt: string;
  llm: string;
  tts: string;
  memory: string;
  vision: string;
  agents: boolean;
  maxConcurrentTasks: number;
}

export function ModeSelector() {
  const [selectedMode, setSelectedMode] = useState<OperationMode>("ECO");
  
  const utils = trpc.useUtils();
  const detectModeQuery = trpc.hardware.detectMode.useQuery();
  const getCapabilitiesQuery = trpc.hardware.getModeCapabilities.useQuery(selectedMode);
  
  const updateSettingsMutation = trpc.settings.updateSettings.useMutation({
    onSuccess: () => {
      utils.hardware.detectMode.invalidate();
      toast.success("Configuração Atualizada", {
        description: "As alterações foram salvas com sucesso.",
      });
    },
    onError: (error) => {
      toast.error("Erro ao Atualizar", {
        description: error.message,
      });
    }
  });

  // Sincronizar modo selecionado com o modo atual detectado/salvo
  useEffect(() => {
    if (detectModeQuery.data?.mode) {
      setSelectedMode(detectModeQuery.data.mode);
    }
  }, [detectModeQuery.data?.mode]);

  const handleModeChange = (mode: OperationMode) => {
    setSelectedMode(mode);
  };

  const handleApplyMode = () => {
    updateSettingsMutation.mutate({
      preferredMode: selectedMode,
      autoDetectHardware: false,
    });
  };

  const handleAutoDetect = () => {
    updateSettingsMutation.mutate({
      autoDetectHardware: true,
    });
  };

  const getModeIcon = (mode: OperationMode) => {
    switch (mode) {
      case "ECO":
        return "🔋";
      case "STANDARD":
        return "⚙️";
      case "PERFORMANCE":
        return "⚡";
    }
  };

  const getModeDescription = (mode: OperationMode) => {
    switch (mode) {
      case "ECO":
        return "Modo econômico para hardware limitado. APIs remotas, modelos Tiny.";
      case "STANDARD":
        return "Modo balanceado com modelos locais 3-7B. Bom para hardware mid-range.";
      case "PERFORMANCE":
        return "Modo premium com modelos 8B+, reranking e multimodal. Hardware high-end.";
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Mode Status */}
      <Card className="bg-muted/5 border-border/20 shadow-none rounded-2xl overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-border/10 bg-muted/5">
          <CardTitle className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70">Modo Atual</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-base font-medium text-foreground/90 flex items-center gap-2">
                <span className="text-xl">{getModeIcon(detectModeQuery.data?.mode || "ECO")}</span>
                {detectModeQuery.data?.mode || "ECO"}
              </p>
              <p className="text-xs text-muted-foreground/80 leading-relaxed">
                {getModeDescription(detectModeQuery.data?.mode || "ECO")}
              </p>
            </div>
            <div className="flex items-center justify-center relative">
              <div className="h-12 w-12 rounded-full bg-muted/5 border border-border/10 flex items-center justify-center relative">
                {detectModeQuery.data?.isCompatible ? (
                  <>
                    <CheckCircle2 className="h-6 w-6 text-emerald-500/70" />
                    {/* Luz de Positivo - Active Status Indicator */}
                    <div className="absolute -top-1 -right-1 flex h-4 w-4">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                    </div>
                  </>
                ) : (
                  <AlertCircle className="h-6 w-6 text-amber-500/70" />
                )}
              </div>
            </div>
          </div>

          {/* Software Detection Alert */}
          {detectModeQuery.data?.heavySoftware && detectModeQuery.data.heavySoftware.length > 0 && (
            <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 space-y-2">
              <div className="flex items-center gap-2 text-amber-600/80">
                <Monitor className="h-3.5 w-3.5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">Software Pesado Detectado</span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {detectModeQuery.data.heavySoftware.map((sw: string) => (
                  <Badge key={sw} variant="outline" className="text-[9px] bg-amber-500/5 border-amber-500/10 text-amber-700/70 px-1.5 py-0">
                    {sw}
                  </Badge>
                ))}
              </div>
              <p className="text-[10px] text-amber-600/60 leading-tight">
                O sistema mudou automaticamente para um modo mais leve para não interferir na performance do seu trabalho.
              </p>
            </div>
          )}

          <Button
            onClick={handleAutoDetect}
            variant="ghost"
            disabled={updateSettingsMutation.isPending}
            className="w-full h-9 text-xs rounded-xl bg-muted/5 hover:bg-muted/10 border border-border/10 text-muted-foreground/70 transition-all"
          >
            {updateSettingsMutation.isPending ? (
              <Loader2 className="h-3 w-3 animate-spin" />
            ) : (
              "Auto-detectar Hardware"
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Mode Selection */}
      <Card className="bg-muted/5 border-border/20 shadow-none rounded-2xl overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-border/10 bg-muted/5">
          <CardTitle className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70">Configuração Manual</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-5">
          <Select value={selectedMode} onValueChange={(value) => handleModeChange(value as OperationMode)}>
            <SelectTrigger className="h-10 bg-muted/5 border-border/10 rounded-xl text-xs focus:ring-1 focus:ring-border/30">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="rounded-xl border-border/20 bg-background shadow-xl">
              <SelectItem value="ECO" className="text-xs py-2.5">
                🔋 ECO - Econômico
              </SelectItem>
              <SelectItem value="STANDARD" className="text-xs py-2.5">
                ⚙️ STANDARD - Balanceado
              </SelectItem>
              <SelectItem value="PERFORMANCE" className="text-xs py-2.5">
                ⚡ PERFORMANCE - Premium
              </SelectItem>
            </SelectContent>
          </Select>

          <p className="text-xs text-muted-foreground/70 px-1 leading-relaxed">
            {getModeDescription(selectedMode)}
          </p>

          <Button
            onClick={handleApplyMode}
            disabled={updateSettingsMutation.isPending}
            className="w-full h-10 text-xs rounded-xl bg-foreground/90 hover:bg-foreground text-background font-medium shadow-none transition-all"
          >
            {updateSettingsMutation.isPending ? "Aplicando..." : "Confirmar Alteração"}
          </Button>
        </CardContent>
      </Card>

      {/* Capabilities */}
      {getCapabilitiesQuery.data && (
        <Card className="bg-muted/5 border-border/20 shadow-none rounded-2xl overflow-hidden">
          <CardHeader className="px-6 py-4 border-b border-border/10 bg-muted/5">
            <CardTitle className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/70">
              Capacidades • {selectedMode}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6 space-y-3">
            {[
              { label: "STT (Entrada de Voz)", value: getCapabilitiesQuery.data.stt },
              { label: "LLM (Processamento)", value: getCapabilitiesQuery.data.llm },
              { label: "TTS (Saída de Voz)", value: getCapabilitiesQuery.data.tts },
              { label: "Memória", value: getCapabilitiesQuery.data.memory },
              { label: "Visão Computacional", value: getCapabilitiesQuery.data.vision },
              { label: "Agentes Autônomos", value: getCapabilitiesQuery.data.agents ? "Ativado" : "Desativado", highlight: true, isActive: getCapabilitiesQuery.data.agents },
              { label: "Tarefas Simultâneas", value: getCapabilitiesQuery.data.maxConcurrentTasks },
            ].map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-1">
                <span className="text-[11px] text-muted-foreground/80">{item.label}</span>
                <Badge 
                  variant="outline" 
                  className={cn(
                    "text-[10px] font-medium px-2 py-0.5 rounded-lg border border-border/10 bg-muted/5",
                    item.highlight && (item.isActive ? "text-emerald-700/80 border-emerald-500/20 bg-emerald-500/5" : "text-muted-foreground/60")
                  )}
                >
                  {item.value}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Hardware Requirements */}
      <Card className="bg-muted/5 border-border/20 shadow-none rounded-2xl overflow-hidden">
        <CardHeader className="px-6 py-4 border-b border-border/10 bg-muted/5">
          <CardTitle className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/60">Requisitos Estimados</CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-3">
          {[
            { mode: "ECO", specs: "2GB RAM, 2 cores (Mínimo recomendado)" },
            { mode: "STANDARD", specs: "6GB RAM, 4 cores (Hardware intermediário)" },
            { mode: "PERFORMANCE", specs: "16GB RAM, 8 cores (Hardware de alto desempenho)" },
          ].map((req, idx) => (
            <div key={idx} className="space-y-1">
              <p className="text-[11px] font-semibold text-foreground/80 uppercase tracking-tight">{req.mode}</p>
              <p className="text-[11px] text-muted-foreground/70">{req.specs}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
