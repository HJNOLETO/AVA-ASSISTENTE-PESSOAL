import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useTheme } from "@/contexts/ThemeContext";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Mail, 
  User, 
  CalendarIcon, 
  Shield, 
  Clock, 
  AlertCircle, 
  HelpCircle, 
  MessageCircle, 
  Github, 
  FileText, 
  Settings, 
  LogOut,
  Zap,
  Activity
} from "lucide-react";
import { ModeSelector } from "./ModeSelector";

interface UserProfileProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function UserProfileDialog({
  trigger,
  open,
  onOpenChange,
}: UserProfileProps) {
  const { user } = useAuth();
  const { data: settings } = trpc.settings.getSettings.useQuery();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.name || "");
  const [editEmail, setEditEmail] = useState(user?.email || "");
  const [profileRole, setProfileRole] = useState<string>(
    settings?.profileRole || "user"
  );
  const [profession, setProfession] = useState<string>(
    (settings as any)?.profession || ""
  );
  const [expertiseLevel, setExpertiseLevel] = useState<string>(
    settings?.expertiseLevel || "intermediate"
  );
  const [preferredTone, setPreferredTone] = useState<string>(
    settings?.preferredTone || "formal"
  );
  const [includePii, setIncludePii] = useState<boolean>(
    (settings?.includePiiInContext ?? 0) === 1
  );
  const [isSaving, setIsSaving] = useState(false);

  const updateMutation = trpc.user.updateProfile.useMutation();
  const settingsMutation = trpc.settings.updateSettings.useMutation();

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Update user profile (name/email)
      await updateMutation.mutateAsync({ name: editName, email: editEmail });

      // Update settings (profile preferences)
      await settingsMutation.mutateAsync({
        profileRole,
        profession,
        expertiseLevel: expertiseLevel as any,
        preferredTone: preferredTone as any,
        includePiiInContext: includePii,
      });

      setIsEditing(false);
      toast.success("Perfil atualizado com sucesso!");
    } catch (error: any) {
      console.error("❌ Erro ao atualizar perfil:", error);
      toast.error(error.message || "Erro ao atualizar perfil");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-md p-0 gap-0 overflow-hidden bg-background border-border/40 shadow-none rounded-2xl">
        <DialogHeader className="px-6 py-4 border-b border-border/20 bg-muted/10">
          <DialogTitle className="text-base font-medium text-foreground/90">Meu Perfil</DialogTitle>
          <DialogDescription className="text-xs mt-0.5 text-muted-foreground/60">
            Informações e estatísticas da sua conta
          </DialogDescription>
        </DialogHeader>
        <div className="p-6 space-y-6">
          {/* User Info Card */}
          <div className="p-4 bg-muted/5 rounded-xl border border-border/20">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-muted-foreground/5 flex items-center justify-center border border-border/10">
                <User className="h-5 w-5 text-muted-foreground/40" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm text-foreground/80">
                  {user?.name || "Usuário"}
                </p>
                <p className="text-[11px] text-muted-foreground/50 flex items-center gap-1.5 mt-0.5">
                  <Mail className="h-3 w-3" />
                  {user?.email || "email@example.com"}
                </p>
              </div>
            </div>
          </div>

          {/* Account Details */}
          <div className="space-y-3">
            <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/40">Detalhes da Conta</h3>
            <div className="space-y-1.5">
              <div className="flex items-center justify-between p-2.5 bg-muted/5 rounded-lg border border-border/10">
                <span className="text-[11px] text-muted-foreground/60 flex items-center gap-2">
                  <User className="h-3.5 w-3.5 opacity-40" />
                  Tipo de Usuário
                </span>
                <span className="text-[11px] font-medium text-foreground/70 capitalize">
                  {user?.role || "convidado"}
                </span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-muted/5 rounded-lg border border-border/10">
                <span className="text-[11px] text-muted-foreground/60 flex items-center gap-2">
                  <Shield className="h-3.5 w-3.5 opacity-40" />
                  Status
                </span>
                <span className="text-[11px] font-medium text-emerald-600/70">Ativo</span>
              </div>
              <div className="flex items-center justify-between p-2.5 bg-muted/5 rounded-lg border border-border/10">
                <span className="text-[11px] text-muted-foreground/60 flex items-center gap-2">
                  <CalendarIcon className="h-3.5 w-3.5 opacity-40" />
                  Membro desde
                </span>
                <span className="text-[11px] font-medium text-foreground/70">Hoje</span>
              </div>
            </div>
          </div>

          {!isEditing ? (
            <Button
              variant="ghost"
              className="w-full h-9 text-xs rounded-xl bg-muted/5 hover:bg-muted/10 border border-border/20 text-muted-foreground/70"
              onClick={() => setIsEditing(true)}
            >
              Editar Perfil
            </Button>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="user-name" className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider px-1">
                  Nome
                </label>
                <input
                  id="user-name"
                  type="text"
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                  className="w-full h-9 px-3 bg-muted/5 border border-border/20 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-border/40 transition-all"
                  placeholder="Digite seu nome"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="user-email" className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider px-1">
                  Email
                </label>
                <input
                  id="user-email"
                  type="email"
                  value={editEmail}
                  onChange={e => setEditEmail(e.target.value)}
                  className="w-full h-9 px-3 bg-muted/5 border border-border/20 rounded-xl text-xs focus:outline-none focus:ring-1 focus:ring-border/40 transition-all"
                  placeholder="Digite seu email"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <Button
                  variant="ghost"
                  className="flex-1 h-9 text-xs rounded-xl hover:bg-muted/10 text-muted-foreground/60"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button
                  className="flex-1 h-9 text-xs rounded-xl bg-foreground/90 hover:bg-foreground text-background font-medium"
                  onClick={handleSaveProfile}
                  disabled={isSaving}
                >
                  {isSaving ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface SettingsDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function SettingsDialog({
  trigger,
  open,
  onOpenChange,
}: SettingsDialogProps) {
  const { theme, setTheme } = useTheme();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {trigger && <SheetTrigger asChild>{trigger}</SheetTrigger>}
      <SheetContent side="right" className="w-[400px] sm:w-[500px] p-0 gap-0 bg-background border-l border-border/20 shadow-none">
        <SheetHeader className="px-6 py-4 border-b border-border/20 bg-muted/10">
          <SheetTitle className="text-base font-medium text-foreground/90">Configurações</SheetTitle>
          <SheetDescription className="text-xs mt-0.5 text-muted-foreground/60">
            Personalize sua experiência com AVA
          </SheetDescription>
        </SheetHeader>

        <div className="p-6">
          <Tabs defaultValue="appearance" className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-muted/5 p-1 rounded-xl border border-border/10">
              <TabsTrigger value="appearance" className="text-[10px] uppercase tracking-wider font-medium data-[state=active]:bg-background data-[state=active]:shadow-none rounded-lg transition-all">
                Aparência
              </TabsTrigger>
              <TabsTrigger value="performance" className="text-[10px] uppercase tracking-wider font-medium data-[state=active]:bg-background data-[state=active]:shadow-none rounded-lg transition-all">
                Hardware
              </TabsTrigger>
              <TabsTrigger value="privacy" className="text-[10px] uppercase tracking-wider font-medium data-[state=active]:bg-background data-[state=active]:shadow-none rounded-lg transition-all">
                Privacidade
              </TabsTrigger>
              <TabsTrigger value="help" className="text-[10px] uppercase tracking-wider font-medium data-[state=active]:bg-background data-[state=active]:shadow-none rounded-lg transition-all">
                Sobre
              </TabsTrigger>
            </TabsList>

            {/* Appearance Settings */}
            <TabsContent value="appearance" className="space-y-6 mt-8 animate-in fade-in slide-in-from-right-2 duration-300">
              <div>
                <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/40 mb-4 px-1">Tema</h3>
                <div className="space-y-2">
                  <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${theme === 'light' ? 'bg-muted/10 border-border/30' : 'bg-muted/5 border-border/10 hover:bg-muted/10'}`}>
                    <input
                      type="radio"
                      name="theme"
                      value="light"
                      checked={theme === 'light'}
                      onChange={() => setTheme("light")}
                      className="h-3.5 w-3.5 accent-foreground"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground/80">Claro (Standard)</p>
                      <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                        Profissional e limpo
                      </p>
                    </div>
                  </label>
                  
                  <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${theme === 'dark' ? 'bg-muted/10 border-border/30' : 'bg-muted/5 border-border/10 hover:bg-muted/10'}`}>
                    <input
                      type="radio"
                      name="theme"
                      value="dark"
                      checked={theme === 'dark'}
                      onChange={() => setTheme("dark")}
                      className="h-3.5 w-3.5 accent-foreground"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground/80">Escuro (Focus)</p>
                      <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                        Para pouca luz, contraste confortável
                      </p>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-4 rounded-xl cursor-pointer transition-all border ${theme === 'serene' ? 'bg-muted/10 border-border/30' : 'bg-muted/5 border-border/10 hover:bg-muted/10'}`}>
                    <input
                      type="radio"
                      name="theme"
                      value="serene"
                      checked={theme === 'serene'}
                      onChange={() => setTheme("serene")}
                      className="h-3.5 w-3.5 accent-foreground"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-medium text-foreground/80">Serene (Leitura)</p>
                      <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                        Tons de papel e café para descanso visual
                      </p>
                    </div>
                  </label>
                </div>
              </div>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="performance" className="space-y-6 mt-8 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="space-y-4">
                <div className="flex items-center gap-3 px-1">
                  <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold">Hardware e Performance</h4>
                    <p className="text-[10px] text-muted-foreground">Configure como a AVA utiliza seu computador</p>
                  </div>
                </div>
                <div className="p-4 bg-muted/5 rounded-xl border border-border/10">
                  <ModeSelector />
                </div>
                <div className="px-1">
                   <p className="text-[10px] text-muted-foreground bg-amber-500/5 p-3 rounded-lg border border-amber-500/10 italic">
                    <b>Dica:</b> O modo PERFORMANCE é ideal para tarefas complexas de codificação, enquanto o ECO economiza bateria em notebooks.
                  </p>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6 mt-8 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="space-y-2">
                <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/40 mb-4 px-1">Dados</h3>
                <label className="flex items-center gap-3 p-4 bg-muted/5 border border-border/10 rounded-xl cursor-pointer hover:bg-muted/10 transition-all">
                  <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-foreground" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground/80">Histórico de Conversas</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                      Manter registro local das suas interações
                    </p>
                  </div>
                </label>
              </div>
            </TabsContent>

            {/* Advanced Settings */}
            <TabsContent value="advanced" className="space-y-6 mt-8 animate-in fade-in slide-in-from-right-2 duration-300">
              <div className="space-y-2">
                <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/40 mb-4 px-1">Modo Avançado</h3>
                <label className="flex items-center gap-3 p-4 bg-muted/5 border border-border/10 rounded-xl cursor-pointer hover:bg-muted/10 transition-all">
                  <input type="checkbox" className="h-3.5 w-3.5 accent-foreground" />
                  <div className="flex-1">
                    <p className="text-xs font-medium text-foreground/80">Modo Desenvolvedor</p>
                    <p className="text-[10px] text-muted-foreground/50 mt-0.5">
                      Ver logs e ferramentas de depuração
                    </p>
                  </div>
                </label>
              </div>
              
              <div className="pt-6 border-t border-border/10 space-y-2">
                <h3 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground/40 px-1">Versão</h3>
                <div className="p-4 bg-muted/5 rounded-xl border border-border/10">
                  <p className="text-xs font-medium text-foreground/70">AVA v3.1 Professional</p>
                  <p className="text-[10px] text-muted-foreground/40 mt-0.5">Última atualização: Fevereiro 2026</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </SheetContent>
    </Sheet>
  );
}

interface HelpDialogProps {
  trigger?: React.ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function HelpDialog({ trigger, open, onOpenChange }: HelpDialogProps) {
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);

  const faqs = [
    {
      id: "1",
      q: "Como posso começar uma nova conversa?",
      a: "Clique no botão 'Novo bate-papo' na barra lateral esquerda ou use o atalho Ctrl+N.",
    },
    {
      id: "2",
      q: "Como funciona o modo adaptativo?",
      a: "AVA ajusta sua resposta conforme o modo selecionado: ECO (rápido), STANDARD (equilibrado) ou PERFORMANCE (detalhado).",
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {trigger && <DialogTrigger asChild>{trigger}</DialogTrigger>}
      <DialogContent className="max-w-lg p-0 gap-0 overflow-hidden bg-background border-border/40 shadow-none rounded-2xl flex flex-col max-h-[85vh]">
        <DialogHeader className="px-6 py-4 border-b border-border/20 bg-muted/10">
          <DialogTitle className="text-base font-medium text-foreground/90 flex items-center gap-2">
            <HelpCircle className="h-4 w-4 text-muted-foreground/60" />
            Ajuda e Suporte
          </DialogTitle>
          <DialogDescription className="text-xs mt-0.5 text-muted-foreground/60">
            Encontre respostas para suas dúvidas
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 overflow-y-auto">
          <Tabs defaultValue="faq" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-muted/5 p-1 rounded-xl border border-border/10">
              <TabsTrigger value="faq" className="text-[10px] uppercase tracking-wider font-medium data-[state=active]:bg-background data-[state=active]:shadow-none rounded-lg transition-all">
                FAQ
              </TabsTrigger>
              <TabsTrigger value="docs" className="text-[10px] uppercase tracking-wider font-medium data-[state=active]:bg-background data-[state=active]:shadow-none rounded-lg transition-all">
                Documentos
              </TabsTrigger>
              <TabsTrigger value="support" className="text-[10px] uppercase tracking-wider font-medium data-[state=active]:bg-background data-[state=active]:shadow-none rounded-lg transition-all">
                Suporte
              </TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-3 mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              {faqs.map(faq => (
                <div
                  key={faq.id}
                  className="bg-muted/5 border border-border/10 rounded-xl overflow-hidden transition-all hover:bg-muted/10"
                  onClick={() =>
                    setExpandedFaq(expandedFaq === faq.id ? null : faq.id)
                  }
                >
                  <button className="w-full p-4 text-left flex items-center justify-between group">
                    <span className="text-xs font-medium text-foreground/70 group-hover:text-foreground transition-colors">{faq.q}</span>
                    <span
                      className={`text-[10px] text-muted-foreground/40 transition-transform duration-300 ${expandedFaq === faq.id ? "rotate-180" : ""}`}
                    >
                      ▼
                    </span>
                  </button>
                  {expandedFaq === faq.id && (
                    <div className="px-4 pb-4 pt-0 text-xs leading-relaxed text-muted-foreground/60 border-t border-border/5 bg-muted/5 animate-in slide-in-from-top-1 duration-200">
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </TabsContent>
            
            <TabsContent value="docs" className="space-y-4 mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 bg-muted/5 border border-border/10 rounded-xl">
                <p className="text-xs text-muted-foreground/60 leading-relaxed">Consulte a documentação completa e guias de integração no GitHub do projeto.</p>
                <Button variant="ghost" className="mt-4 w-full h-8 text-[11px] bg-muted-foreground/5 hover:bg-muted-foreground/10 text-muted-foreground/70 rounded-lg border border-border/10">
                  <Github className="h-3.5 w-3.5 mr-2 opacity-60" />
                  Ver Repositório
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="support" className="space-y-4 mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
              <div className="p-4 bg-muted/5 border border-border/10 rounded-xl">
                <p className="text-xs text-muted-foreground/60 leading-relaxed mb-4">Precisa de ajuda personalizada? Nossa equipe está disponível para suporte direto.</p>
                <Button className="w-full h-9 text-xs bg-foreground/90 hover:bg-foreground text-background rounded-xl font-medium">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Chat ao Vivo
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}
