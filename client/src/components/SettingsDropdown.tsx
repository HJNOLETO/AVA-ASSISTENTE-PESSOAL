import React from "react";
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
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Loader2, 
  Cpu, 
  Wifi, 
  Mic, 
  MessageSquare, 
  Zap,
  Server,
  Activity,
  Briefcase,
  Shield,
  Code,
  Layout
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface SettingsDropdownProps {
  // Configurações
  provider: "forge" | "ollama";
  model: string;
  ollamaBaseUrl: string;
  ollamaAuthToken: string;
  autoSendOnSilence: boolean;
  autoSendTyping: boolean;
  autoSendTypingDelay: number;
  continuousListening: boolean;
  useWebSpeech: boolean;
  ttsEnabled: boolean;
  voiceIndex: number;
  voices: SpeechSynthesisVoice[];
  currentModule: "GENERAL" | "LEGAL" | "MEDICAL" | "DEVELOPER";
  
  // Queries
  modelsQuery: any;
  capabilitiesQuery: any;
  
  // Estado de conexão
  connectionStatus: "idle" | "unknown" | "connected" | "error";
  connectionMessage: string;
  
  // Funções de atualização
  onProviderChange: (value: "forge" | "ollama") => void;
  onModelChange: (value: string) => void;
  onOllamaBaseUrlChange: (value: string) => void;
  onOllamaAuthTokenChange: (value: string) => void;
  onAutoSendOnSilenceChange: (value: boolean) => void;
  onAutoSendTypingChange: (value: boolean) => void;
  onAutoSendTypingDelayChange: (value: number) => void;
  onContinuousListeningChange: (value: boolean) => void;
  onUseWebSpeechChange: (value: boolean) => void;
  onTtsEnabledChange: (value: boolean) => void;
  onVoiceIndexChange: (value: number) => void;
  onModuleChange: (value: "GENERAL" | "LEGAL" | "MEDICAL" | "DEVELOPER") => void;
  onTestConnection: () => void;
}

export const SettingsDropdown: React.FC<SettingsDropdownProps> = ({
  provider,
  model,
  ollamaBaseUrl,
  ollamaAuthToken,
  autoSendOnSilence,
  autoSendTyping,
  autoSendTypingDelay,
  continuousListening,
  useWebSpeech,
  ttsEnabled,
  voiceIndex,
  voices,
  currentModule,
  modelsQuery,
  capabilitiesQuery,
  connectionStatus,
  connectionMessage,
  onProviderChange,
  onModelChange,
  onOllamaBaseUrlChange,
  onOllamaAuthTokenChange,
  onAutoSendOnSilenceChange,
  onAutoSendTypingChange,
  onAutoSendTypingDelayChange,
  onContinuousListeningChange,
  onUseWebSpeechChange,
  onTtsEnabledChange,
  onVoiceIndexChange,
  onModuleChange,
  onTestConnection,
}) => {
  const getConnectionStatusColor = () => {
    switch (connectionStatus) {
      case "connected": return "text-emerald-500";
      case "error": return "text-destructive";
      case "unknown": return "text-amber-500";
      default: return "text-muted-foreground";
    }
  };

  const getConnectionStatusText = () => {
    switch (connectionStatus) {
      case "connected": return "Conectado";
      case "error": return "Erro";
      case "unknown": return "Testando...";
      default: return "Não testado";
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors"
        >
          <Settings className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      
      <DropdownMenuContent 
        className="w-80 max-h-[400px] overflow-y-auto p-1.5 rounded-xl bg-background/95 backdrop-blur-xl border-border/50 shadow-2xl" 
        align="start" 
        side="top"
        sideOffset={10}
      >
        <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium text-muted-foreground uppercase tracking-widest">
          Configurações do Sistema
        </DropdownMenuLabel>
        
        <DropdownMenuSeparator className="bg-border/50 mb-1" />
        
        {/* Module Selection */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-lg px-2 py-2 cursor-pointer gap-2 hover:bg-muted/50 transition-colors">
            <Layout className="h-4 w-4 text-muted-foreground/70" />
            <span className="text-sm">Módulo de Trabalho</span>
            <div className="ml-auto text-[10px] font-medium text-muted-foreground/60 bg-muted/50 px-1.5 py-0.5 rounded uppercase">
               {currentModule === "GENERAL" ? "Geral" : 
                currentModule === "LEGAL" ? "Jurídico" : 
                currentModule === "MEDICAL" ? "Médico" : "Dev"}
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-1 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl shadow-xl">
            <DropdownMenuRadioGroup value={currentModule} onValueChange={(value) => onModuleChange(value as any)}>
              <DropdownMenuRadioItem value="GENERAL" className="rounded-lg cursor-pointer text-sm gap-2">
                <Activity className="h-3.5 w-3.5" />
                Geral
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="LEGAL" className="rounded-lg cursor-pointer text-sm gap-2">
                <Shield className="h-3.5 w-3.5" />
                Jurídico
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="MEDICAL" className="rounded-lg cursor-pointer text-sm gap-2">
                <Briefcase className="h-3.5 w-3.5" />
                Médico
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="DEVELOPER" className="rounded-lg cursor-pointer text-sm gap-2">
                <Code className="h-3.5 w-3.5" />
                Desenvolvedor
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Provider Settings */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-lg px-2 py-2 cursor-pointer gap-2 hover:bg-muted/50 transition-colors">
            <Server className="h-4 w-4 text-muted-foreground/70" />
            <span className="text-sm">Provedor</span>
            <div className="ml-auto text-[10px] font-medium text-muted-foreground/60 bg-muted/50 px-1.5 py-0.5 rounded uppercase">
               {provider}
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-1 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl shadow-xl">
            <DropdownMenuRadioGroup value={provider} onValueChange={(value) => onProviderChange(value as "forge" | "ollama")}>
              <DropdownMenuRadioItem value="ollama" className="rounded-lg cursor-pointer text-sm">Local (Ollama)</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="forge" className="rounded-lg cursor-pointer text-sm">Cloud (Forge)</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Model Settings */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-lg px-2 py-2 cursor-pointer gap-2 hover:bg-muted/50 transition-colors">
            <Cpu className="h-4 w-4 text-muted-foreground/70" />
            <span className="text-sm">Modelo</span>
            <div className="ml-auto text-[10px] font-medium text-muted-foreground/60 bg-muted/50 px-1.5 py-0.5 rounded max-w-[100px] truncate uppercase">
              {model}
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="p-1 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl shadow-xl min-w-[200px]">
            {modelsQuery.isLoading ? (
              <div className="flex items-center justify-center p-4">
                <Loader2 className="h-4 w-4 animate-spin text-muted-foreground/40" />
              </div>
            ) : (
              <DropdownMenuRadioGroup value={model} onValueChange={onModelChange}>
                {modelsQuery.data?.models?.map((m: string) => (
                  <DropdownMenuRadioItem key={m} value={m} className="rounded-lg cursor-pointer text-xs py-2">
                    {m}
                  </DropdownMenuRadioItem>
                ))}
              </DropdownMenuRadioGroup>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Connection Settings */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-lg px-2 py-2 cursor-pointer gap-2 hover:bg-muted/50 transition-colors">
            <Wifi className="h-4 w-4 text-muted-foreground/70" />
            <span className="text-sm">Conexão</span>
            <div className={cn("ml-auto text-[10px] flex items-center gap-1.5 font-medium", getConnectionStatusColor())}>
              <div className={cn("h-1.5 w-1.5 rounded-full", connectionStatus === 'connected' ? "bg-emerald-500 shadow-[0_0_5px_rgba(16,185,129,0.5)]" : connectionStatus === 'error' ? "bg-destructive" : "bg-amber-500")} />
              {getConnectionStatusText()}
            </div>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-80 p-3 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl shadow-xl space-y-3">
             <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider ml-1">Base URL</label>
                <Input
                  placeholder="Ex: http://localhost:11434"
                  value={ollamaBaseUrl}
                  onChange={(e) => onOllamaBaseUrlChange(e.target.value)}
                  className="h-9 text-xs bg-muted/20 border-none focus-visible:ring-1 focus-visible:ring-primary/10"
                />
             </div>
             <div className="space-y-1.5">
                <label className="text-[10px] font-semibold text-muted-foreground/70 uppercase tracking-wider ml-1">Auth Token</label>
                <Input
                  placeholder="Opcional"
                  type="password"
                  value={ollamaAuthToken}
                  onChange={(e) => onOllamaAuthTokenChange(e.target.value)}
                  className="h-9 text-xs bg-muted/20 border-none focus-visible:ring-1 focus-visible:ring-primary/10"
                />
             </div>
              <Button
                onClick={onTestConnection}
                size="sm"
                className="w-full h-9 text-xs font-semibold rounded-lg shadow-none"
                disabled={connectionStatus === "unknown"}
              >
                {connectionStatus === "unknown" && <Loader2 className="h-3 w-3 animate-spin mr-1.5" />}
                Testar Conexão
              </Button>
              {connectionMessage && (
                <div className={cn("text-[10px] px-2.5 py-2 rounded-lg bg-muted/30 border border-border/10", getConnectionStatusColor())}>
                   {connectionMessage}
                </div>
              )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        <DropdownMenuSeparator className="bg-border/30 my-1" />

        {/* Voice Settings */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-lg px-2 py-2 cursor-pointer gap-2 hover:bg-muted/50 transition-colors">
            <Mic className="h-4 w-4 text-muted-foreground/70" />
            <span className="text-sm">Voz & Fala</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64 p-1 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl shadow-xl">
            <DropdownMenuCheckboxItem
              checked={useWebSpeech}
              onCheckedChange={onUseWebSpeechChange}
              className="rounded-lg text-sm"
            >
              Web Speech API
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={ttsEnabled}
              onCheckedChange={onTtsEnabledChange}
              className="rounded-lg text-sm"
            >
              Text-to-Speech
            </DropdownMenuCheckboxItem>
            <DropdownMenuSeparator className="bg-border/30" />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="rounded-lg text-sm">Voz Sintética</DropdownMenuSubTrigger>
              <DropdownMenuSubContent className="p-1 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl shadow-xl max-h-[300px] overflow-y-auto">
                <DropdownMenuRadioGroup
                  value={String(voiceIndex)}
                  onValueChange={(v) => onVoiceIndexChange(parseInt(v))}
                >
                  <DropdownMenuRadioItem value="-1" className="rounded-lg cursor-pointer text-sm">Padrão do Sistema</DropdownMenuRadioItem>
                  {voices.map((voice, i) => (
                    <DropdownMenuRadioItem key={i} value={String(i)} className="rounded-lg cursor-pointer text-xs">
                      {voice.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Auto-send Settings */}
        <DropdownMenuSub>
          <DropdownMenuSubTrigger className="rounded-lg px-2 py-2 cursor-pointer gap-2 hover:bg-muted/50 transition-colors">
            <Zap className="h-4 w-4 text-muted-foreground/70" />
            <span className="text-sm">Automação</span>
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent className="w-64 p-1 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl shadow-xl">
            <DropdownMenuCheckboxItem
              checked={autoSendOnSilence}
              onCheckedChange={onAutoSendOnSilenceChange}
              className="rounded-lg text-sm"
            >
              Enviar após silêncio
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={autoSendTyping}
              onCheckedChange={onAutoSendTypingChange}
              className="rounded-lg text-sm"
            >
              Enviar ao digitar
            </DropdownMenuCheckboxItem>
            {autoSendTyping && (
               <DropdownMenuSub>
                <DropdownMenuSubTrigger className="rounded-lg text-sm">Delay de Digitação</DropdownMenuSubTrigger>
                <DropdownMenuSubContent className="p-1 rounded-xl border-border/50 bg-background/95 backdrop-blur-xl shadow-xl">
                  <DropdownMenuRadioGroup
                    value={String(autoSendTypingDelay)}
                    onValueChange={(v) => onAutoSendTypingDelayChange(parseInt(v))}
                  >
                    <DropdownMenuRadioItem value="500" className="rounded-lg cursor-pointer text-sm">0.5s (Rápido)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="1000" className="rounded-lg cursor-pointer text-sm">1.0s (Normal)</DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="2000" className="rounded-lg cursor-pointer text-sm">2.0s (Lento)</DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            )}
          </DropdownMenuSubContent>
        </DropdownMenuSub>

        {/* Capabilities - Footer */}
        {capabilitiesQuery.data && (
          <>
            <DropdownMenuSeparator className="bg-border/50 my-1" />
            <div className="px-2 py-1.5">
               <div className="flex items-center gap-2 mb-2 text-xs font-medium text-muted-foreground uppercase tracking-widest">
                  <Activity className="h-3 w-3" /> Capacidades
               </div>
               <div className="grid grid-cols-2 gap-1">
                  <div className={cn("text-[10px] px-2 py-1 rounded bg-muted/40 flex items-center gap-1.5", capabilitiesQuery.data.supportsVision ? "text-foreground" : "text-muted-foreground line-through opacity-50")}>
                    {capabilitiesQuery.data.supportsVision ? "✅" : "❌"} Visão
                  </div>
                  <div className={cn("text-[10px] px-2 py-1 rounded bg-muted/40 flex items-center gap-1.5", capabilitiesQuery.data.supportsTools ? "text-foreground" : "text-muted-foreground line-through opacity-50")}>
                    {capabilitiesQuery.data.supportsTools ? "✅" : "❌"} Tools
                  </div>
                  <div className={cn("text-[10px] px-2 py-1 rounded bg-muted/40 flex items-center gap-1.5", capabilitiesQuery.data.supportsThinking ? "text-foreground" : "text-muted-foreground line-through opacity-50")}>
                    {capabilitiesQuery.data.supportsThinking ? "✅" : "❌"} Thinking
                  </div>
                  <div className={cn("text-[10px] px-2 py-1 rounded bg-muted/40 flex items-center gap-1.5", capabilitiesQuery.data.supportsJsonSchema ? "text-foreground" : "text-muted-foreground line-through opacity-50")}>
                    {capabilitiesQuery.data.supportsJsonSchema ? "✅" : "❌"} JSON
                  </div>
               </div>
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
