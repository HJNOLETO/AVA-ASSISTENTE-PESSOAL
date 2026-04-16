import React, { useState, useEffect } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { ModeSelector } from "@/components/ModeSelector";
import { useTheme } from "@/contexts/ThemeContext";
import { 
  Settings, 
  Cpu, 
  Shield, 
  Bell, 
  Database, 
  Cloud,
  Activity,
  Zap,
  Sun,
  Moon,
  Wind,
  Volume2,
  Check
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { cn } from "@/lib/utils";

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

  const setValue = (value: T | ((prev: T) => T)) => {
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
  };

  return [storedValue, setValue];
}

export default function ControlPanel() {
  const { theme, setTheme } = useTheme();
  
  // TTS State
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useLocalStorage<string>("ava-tts-voice-uri", "");
  const [voiceName, setVoiceName] = useLocalStorage<string>("ava-tts-voice-name", "");
  const [isTestPlaying, setIsTestPlaying] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    let isMounted = true;
    let timeoutA: number | null = null;
    let timeoutB: number | null = null;

    const updateVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      // Priorizar vozes em português
      const ptVoices = availableVoices.filter(v => v.lang.includes('pt') || v.lang.includes('PT'));
      const otherVoices = availableVoices.filter(v => !v.lang.includes('pt') && !v.lang.includes('PT'));

      if (isMounted) {
        setVoices([...ptVoices, ...otherVoices]);

        // Se não houver voz selecionada, seleciona a primeira em português
        setVoiceURI((prev: string) => {
          if (!prev) {
            if (ptVoices.length > 0) {
              setVoiceName(ptVoices[0].name);
              return ptVoices[0].voiceURI;
            }
            if (availableVoices.length > 0) {
              setVoiceName(availableVoices[0].name);
              return availableVoices[0].voiceURI;
            }
          }
          return prev;
        });
      }
    };

    // Tenta carregar imediatamente e também após pequenos atrasos
    updateVoices();
    timeoutA = window.setTimeout(updateVoices, 250);
    timeoutB = window.setTimeout(updateVoices, 1000);

    const synth = window.speechSynthesis;
    const supportsEventTarget = typeof synth.addEventListener === "function";
    const previousOnVoicesChanged = synth.onvoiceschanged;

    if (supportsEventTarget) {
      synth.addEventListener("voiceschanged", updateVoices);
    } else {
      synth.onvoiceschanged = updateVoices;
    }

    return () => {
      isMounted = false;
      if (timeoutA) window.clearTimeout(timeoutA);
      if (timeoutB) window.clearTimeout(timeoutB);

      if (supportsEventTarget) {
        synth.removeEventListener("voiceschanged", updateVoices);
      } else if (synth.onvoiceschanged === updateVoices) {
        synth.onvoiceschanged = previousOnVoicesChanged;
      }
    };
  }, []); // Removido dependências para evitar loop infinito

  const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
  const favoriteVoiceUnavailable = Boolean(voiceURI && !selectedVoice);
  const favoriteUnavailableLabel = voiceName || voiceURI;

  const testVoice = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance("Olá! Esta é a minha voz de teste. Como posso ajudar você hoje?");
    
    if (voiceURI) {
      const selectedVoice = voices.find(v => v.voiceURI === voiceURI);
      if (selectedVoice) {
        utter.voice = selectedVoice;
      }
    }

    utter.onstart = () => setIsTestPlaying(true);
    utter.onend = () => setIsTestPlaying(false);
    utter.onerror = () => setIsTestPlaying(false);

    window.speechSynthesis.speak(utter);
  };

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 lg:p-10 space-y-8 max-w-6xl mx-auto w-full overflow-y-auto">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Painel de Controle</h1>
          <p className="text-muted-foreground">Gerencie as configurações globais, performance e segurança da AVA.</p>
        </div>

        <Tabs defaultValue="performance" className="w-full space-y-6">
          <TabsList className="bg-muted/30 p-1 rounded-xl border border-border/10 w-full justify-start overflow-x-auto h-auto">
            <TabsTrigger value="performance" className="gap-2 py-2 px-4 rounded-lg data-[state=active]:bg-background">
              <Zap className="h-4 w-4" />
              Performance
            </TabsTrigger>
            <TabsTrigger value="general" className="gap-2 py-2 px-4 rounded-lg data-[state=active]:bg-background">
              <Settings className="h-4 w-4" />
              Geral
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2 py-2 px-4 rounded-lg data-[state=active]:bg-background">
              <Shield className="h-4 w-4" />
              Segurança
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2 py-2 px-4 rounded-lg data-[state=active]:bg-background">
              <Bell className="h-4 w-4" />
              Notificações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6 outline-none">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="border-border/40 shadow-sm bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Cpu className="h-5 w-5 text-primary" />
                    Modo de Operação
                  </CardTitle>
                  <CardDescription>
                    Ajuste como a AVA utiliza os recursos do seu hardware.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ModeSelector />
                </CardContent>
              </Card>

              <Card className="border-border/40 shadow-sm bg-card/50">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Activity className="h-5 w-5 text-emerald-500" />
                    Status do Sistema
                  </CardTitle>
                  <CardDescription>
                    Monitoramento em tempo real dos recursos.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Uso de CPU</span>
                      <span className="font-medium">12%</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[12%]" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Uso de RAM</span>
                      <span className="font-medium">2.4GB / 16GB</span>
                    </div>
                    <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                      <div className="h-full bg-emerald-500 w-[15%]" />
                    </div>
                  </div>
                  <div className="pt-2">
                    <p className="text-[10px] text-muted-foreground bg-muted/30 p-2 rounded-lg italic">
                      Dica: O modo PERFORMANCE utiliza mais recursos para respostas mais rápidas e complexas.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="general" className="space-y-6 outline-none">
            <Card className="border-border/40 shadow-sm bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Settings className="h-5 w-5 text-muted-foreground" />
                  Preferências da Interface
                </CardTitle>
                <CardDescription>Personalize o visual e comportamento básico da AVA.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4 p-4 rounded-xl bg-muted/5 border border-border/10">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Tema do Sistema</p>
                    <p className="text-[11px] text-muted-foreground mb-3">Escolha o visual que melhor se adapta ao seu ambiente.</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setTheme("light")}
                      className={cn(
                        "flex flex-col gap-2 h-auto py-3 rounded-xl border-border/20",
                        theme === "light" && "border-primary bg-primary/5 ring-1 ring-primary"
                      )}
                    >
                      <Sun className={cn("h-4 w-4", theme === "light" ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Claro</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setTheme("dark")}
                      className={cn(
                        "flex flex-col gap-2 h-auto py-3 rounded-xl border-border/20",
                        theme === "dark" && "border-primary bg-primary/5 ring-1 ring-primary"
                      )}
                    >
                      <Moon className={cn("h-4 w-4", theme === "dark" ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Escuro</span>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => setTheme("serene")}
                      className={cn(
                        "flex flex-col gap-2 h-auto py-3 rounded-xl border-border/20",
                        theme === "serene" && "border-primary bg-primary/5 ring-1 ring-primary"
                      )}
                    >
                      <Wind className={cn("h-4 w-4", theme === "serene" ? "text-primary" : "text-muted-foreground")} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Sereno</span>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/5 border border-border/10">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Idioma de Resposta</p>
                    <p className="text-[11px] text-muted-foreground">Idioma preferencial para interações.</p>
                  </div>
                  <Button variant="outline" size="sm" className="h-8 text-xs rounded-lg">Português (BR)</Button>
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-muted/5 border border-border/10 opacity-50">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium">Auto-save de Conversas</p>
                    <p className="text-[11px] text-muted-foreground">Salvar automaticamente o histórico.</p>
                  </div>
                  <div className="h-5 w-9 bg-primary/20 rounded-full relative">
                    <div className="absolute right-1 top-1 h-3 w-3 bg-primary rounded-full" />
                  </div>
                </div>

                <div className="space-y-4 p-4 rounded-xl bg-muted/5 border border-border/10">
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium flex items-center gap-2">
                      <Volume2 className="h-4 w-4" />
                      Voz da Assistente (TTS)
                    </p>
                    <p className="text-[11px] text-muted-foreground mb-3">
                      Escolha a voz que o sistema usará para ler as respostas. As vozes disponíveis dependem do seu sistema operacional.
                    </p>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1">
                      <Select 
                        value={voiceURI || ""} 
                        onValueChange={(val) => {
                          setVoiceURI(val);
                          const selected = voices.find((v) => v.voiceURI === val);
                          setVoiceName(selected?.name || val);
                        }}
                      >
                        <SelectTrigger className="w-full text-xs">
                          <SelectValue placeholder="Selecione uma voz" />
                        </SelectTrigger>
                        <SelectContent>
                          {favoriteVoiceUnavailable && (
                            <SelectItem value={voiceURI} className="text-xs">
                              Favorita salva (indisponível): {favoriteUnavailableLabel}
                            </SelectItem>
                          )}
                          {voices.map((voice) => (
                            <SelectItem key={voice.voiceURI} value={voice.voiceURI} className="text-xs">
                              {voice.name} {voice.lang.includes('pt') ? '🇧🇷' : ''}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <Button 
                      variant="secondary" 
                      size="sm" 
                      onClick={testVoice}
                      disabled={isTestPlaying}
                      className={cn("shrink-0 text-xs", isTestPlaying && "animate-pulse")}
                    >
                      {isTestPlaying ? "Ouvindo..." : "Testar Voz"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6 outline-none">
            <Card className="border-border/40 shadow-sm bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Shield className="h-5 w-5 text-amber-500" />
                  Privacidade e Dados
                </CardTitle>
                <CardDescription>Gerencie como suas informações são tratadas.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 rounded-xl bg-amber-500/5 border border-amber-500/10">
                  <p className="text-xs font-medium text-amber-700/80 mb-1">Criptografia de Memória</p>
                  <p className="text-[10px] text-amber-600/60 leading-relaxed">
                    Seus dados de memória local são criptografados com AES-256. Nenhuma informação pessoal é enviada para APIs externas sem permissão explícita.
                  </p>
                </div>
                <div className="flex flex-col gap-2">
                  <Button variant="ghost" className="justify-start h-9 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg">
                    Limpar Toda a Memória Local
                  </Button>
                  <Button variant="ghost" className="justify-start h-9 text-xs rounded-lg">
                    Exportar Relatório de Privacidade
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="space-y-6 outline-none">
            <Card className="border-border/40 shadow-sm bg-card/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-500" />
                  Alertas e Notificações
                </CardTitle>
                <CardDescription>Gerencie como a AVA se comunica com você.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">Opções em breve...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </DashboardLayout>
  );
}
