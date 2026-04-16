import React, {
  CSSProperties,
  RefObject,
  useEffect,
  useRef,
  useState,
} from "react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  UserProfileDialog,
  SettingsDialog,
  HelpDialog,
} from "@/components/UserMenuDialogs";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { getLoginUrl } from "@/const";
import { useIsMobile } from "@/hooks/useMobile";
import {
  LogOut,
  PanelLeft,
  Plus,
  MessageSquare,
  FolderOpen,
  Sparkles,
  Settings,
  HelpCircle,
  Code,
  User,
  MoreHorizontal,
  Search,
  Trash2,
  Save,
  Gavel,
  BookOpen,
} from "lucide-react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { ModeSelector } from "./ModeSelector";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { trpc } from "@/lib/trpc";
import { cn } from "@/lib/utils";

// ============================================================================
// TYPES & CONSTANTS
// ============================================================================

const SIDEBAR_CONFIG = {
  WIDTH_KEY: "sidebar-width",
  DEFAULT_WIDTH: 280,
  MIN_WIDTH: 240,
  MAX_WIDTH: 400,
} as const;

type SidebarWidth = number;

interface DashboardLayoutProps {
  children: React.ReactNode;
}

interface DashboardLayoutContentProps extends DashboardLayoutProps {
  setSidebarWidth: (width: SidebarWidth) => void;
}

// ============================================================================
// CUSTOM HOOKS
// ============================================================================

function useSidebarWidth() {
  const [sidebarWidth, setSidebarWidth] = useState<SidebarWidth>(() => {
    const saved = localStorage.getItem(SIDEBAR_CONFIG.WIDTH_KEY);
    return saved ? parseInt(saved, 10) : SIDEBAR_CONFIG.DEFAULT_WIDTH;
  });

  useEffect(() => {
    localStorage.setItem(SIDEBAR_CONFIG.WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  return [sidebarWidth, setSidebarWidth] as const;
}

function useSidebarResize(
  sidebarRef: RefObject<HTMLDivElement | null>,
  setSidebarWidth: (width: SidebarWidth) => void,
  isCollapsed: boolean
) {
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;

      if (
        newWidth >= SIDEBAR_CONFIG.MIN_WIDTH &&
        newWidth <= SIDEBAR_CONFIG.MAX_WIDTH
      ) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => setIsResizing(false);

    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth, sidebarRef]);

  return [isResizing, setIsResizing] as const;
}

function useUserMenuDialogs() {
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  return {
    profile: { open: profileOpen, setOpen: setProfileOpen },
    settings: { open: settingsOpen, setOpen: setSettingsOpen },
    help: { open: helpOpen, setOpen: setHelpOpen },
  };
}

// ============================================================================
// COMPONENTS
// ============================================================================

function LoginScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background px-6">
      <div className="flex flex-col items-center gap-8 p-10 max-w-md w-full rounded-3xl border border-border bg-card/50 shadow-[var(--shadow-xl)] backdrop-blur-md">
        <div className="flex flex-col items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary flex items-center justify-center shadow-[var(--shadow-lg)] ring-4 ring-background">
            <span className="text-primary-foreground font-semibold text-2xl font-serif">A</span>
          </div>
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              AVA Assistant
            </h1>
            <p className="text-base text-muted-foreground/80 font-medium">
              Faça login para acessar sua experiência personalizada.
            </p>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => (window.location.href = getLoginUrl())}
          size="lg"
          className="w-full text-base font-semibold h-12 rounded-xl shadow-[var(--shadow-md)] transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          Entrar com Manus
        </Button>
      </div>
    </div>
  );
}

function SidebarHeaderContent({
  isCollapsed,
  onToggle,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <SidebarHeader className="h-14 px-3 flex flex-row items-center justify-between border-b border-sidebar-border/10 bg-sidebar/30 backdrop-blur-xl">
      {!isCollapsed && (
        <div className="flex items-center gap-2.5 ml-1">
          <div className="h-6 w-6 rounded-md bg-foreground flex items-center justify-center text-background font-bold text-[10px]">
            A
          </div>
          <span className="font-bold tracking-tight text-foreground text-[13px] uppercase">
            AVA Assistant
          </span>
        </div>
      )}
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "h-8 w-8 flex items-center justify-center hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground rounded-lg transition-all focus:outline-none shrink-0 text-muted-foreground/60",
          isCollapsed ? "mx-auto" : "ml-auto"
        )}
        aria-label="Toggle navigation"
      >
        <PanelLeft className="h-4 w-4" />
      </button>
    </SidebarHeader>
  );
}

function NewChatButton({
  onClick,
  isCollapsed,
}: {
  onClick: () => void;
  isCollapsed: boolean;
}) {
  return (
    <Button
      type="button"
      onClick={onClick}
      variant="ghost"
      className={cn(
        "w-full justify-start gap-3 h-10 bg-sidebar-accent/20 hover:bg-sidebar-accent/50 text-foreground transition-all font-semibold rounded-xl shadow-none border border-sidebar-border/10",
        isCollapsed && "justify-center px-0"
      )}
      size="sm"
    >
      <Plus className="h-4 w-4" />
      {!isCollapsed && <span className="text-xs uppercase tracking-wide">Nova conversa</span>}
    </Button>
  );
}

function MainNavigation({ currentLocation }: { currentLocation: string }) {
  const [, setLocation] = useLocation();

  const navItems = [
    { icon: MessageSquare, label: "Conversas", path: "/" },
    { icon: BookOpen, label: "Documentos", path: "/documents" },
    { icon: Gavel, label: "Jurídico", path: "/juridico" },
    { icon: FolderOpen, label: "Projetos", path: "/projetos" },
    { icon: Sparkles, label: "Artefatos", path: "/artefatos" },
    { icon: Code, label: "Código", path: "/codigo" },
    { icon: Settings, label: "Painel de Controle", path: "/configuracoes" },
  ];

  return (
    <SidebarMenu className="gap-1 px-2">
      {navItems.map(({ icon: Icon, label, path }) => (
        <SidebarMenuItem key={path}>
          <SidebarMenuButton
            isActive={currentLocation === path}
            onClick={() => setLocation(path)}
            tooltip={label}
            className="text-muted-foreground/70 hover:text-foreground hover:bg-sidebar-accent/40 data-[active=true]:bg-sidebar-accent/60 data-[active=true]:text-foreground data-[active=true]:font-bold rounded-lg h-9 transition-all text-[13px]"
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

function ConversationActions({
  conversation,
  onRename,
  onToggleFavorite,
  onExport,
  onDelete,
  onSaveToRag,
}: {
  conversation: any;
  onRename: (conversation: any) => void;
  onToggleFavorite: (id: number) => void;
  onExport: (id: number) => void;
  onDelete: (id: number) => void;
  onSaveToRag: (id: number) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          title="Mais opções"
          aria-label="Mais opções"
          className="h-6 w-6 flex items-center justify-center rounded-md hover:bg-background/80 transition-colors focus:outline-none opacity-0 group-hover:opacity-100"
        >
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-48 p-1">
        <DropdownMenuItem onClick={() => onRename(conversation)} className="rounded-md cursor-pointer">
          Renomear
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onToggleFavorite(conversation.id)} className="rounded-md cursor-pointer">
          {conversation.favorite ? "Desfavoritar" : "Favoritar"}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onExport(conversation.id)} className="rounded-md cursor-pointer">
          Baixar (JSON)
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onSaveToRag(conversation.id)} className="rounded-md cursor-pointer gap-2">
          <Save className="h-3.5 w-3.5 text-muted-foreground" />
          <span>Salvar no RAG</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuItem 
          onClick={() => onDelete(conversation.id)} 
          className="rounded-md cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10 gap-2"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>Excluir</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function ConversationItem({
  conversation,
  isActive,
  onSelect,
  onRename,
  onToggleFavorite,
  onExport,
  onDelete,
  onSaveToRag,
}: {
  conversation: any;
  isActive: boolean;
  onSelect: () => void;
  onRename: (conversation: any) => void;
  onToggleFavorite: (id: number) => void;
  onExport: (id: number) => void;
  onDelete: (id: number) => void;
  onSaveToRag: (id: number) => void;
}) {
  return (
    <div
      className={`group flex items-center justify-between text-sm truncate rounded-lg px-2.5 py-2 transition-all cursor-pointer mx-2 ${
        isActive
          ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-[var(--shadow-sm)]"
          : "hover:bg-sidebar-accent/50 text-muted-foreground hover:text-foreground"
      }`}
    >
      <button
        type="button"
        onClick={onSelect}
        className="flex-1 text-left truncate text-[13px] focus:outline-none leading-tight"
      >
        {conversation.title}
      </button>
      <ConversationActions
        conversation={conversation}
        onRename={onRename}
        onToggleFavorite={onToggleFavorite}
        onExport={onExport}
        onDelete={onDelete}
        onSaveToRag={onSaveToRag}
      />
    </div>
  );
}

function RecentConversations({
  conversations,
  currentLocation,
  onSelect,
  onRename,
  onToggleFavorite,
  onExport,
  onDelete,
  onSaveToRag,
}: {
  conversations: any[] | undefined;
  currentLocation: string;
  onSelect: (id: number) => void;
  onRename: (conversation: any) => void;
  onToggleFavorite: (id: number) => void;
  onExport: (id: number) => void;
  onDelete: (id: number) => void;
  onSaveToRag: (id: number) => void;
}) {
  if (!conversations || conversations.length === 0) {
    return (
      <p className="px-4 text-[10px] text-muted-foreground/40 uppercase tracking-widest mt-8 text-center font-medium">
        Vazio
      </p>
    );
  }

  return (
    <div className="space-y-0.5 mt-6">
      <div className="px-4 py-2 flex items-center justify-between group">
        <h4 className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-[0.15em]">Recentes</h4>
      </div>
      <div className="space-y-1 px-2">
        {conversations.slice(0, 15).map(conv => (
          <ConversationItem
            key={conv.id}
            conversation={conv}
            isActive={currentLocation === `/chat/${conv.id}`}
            onSelect={() => onSelect(conv.id)}
            onRename={onRename}
            onToggleFavorite={onToggleFavorite}
            onExport={onExport}
            onDelete={onDelete}
            onSaveToRag={onSaveToRag}
          />
        ))}
      </div>
    </div>
  );
}

function SidebarContentArea({
  isCollapsed,
  conversations,
  currentLocation,
  onNewChat,
  onSelectConversation,
  onRenameConversation,
  onToggleFavorite,
  onExportConversation,
  onDeleteConversation,
  onSaveToRag,
}: {
  isCollapsed: boolean;
  conversations: any[] | undefined;
  currentLocation: string;
  onNewChat: () => void;
  onSelectConversation: (id: number) => void;
  onRenameConversation: (conversation: any) => void;
  onToggleFavorite: (id: number) => void;
  onExportConversation: (id: number) => void;
  onDeleteConversation: (id: number) => void;
  onSaveToRag: (id: number) => void;
}) {
  return (
    <SidebarContent className="gap-0 scrollbar-none">
      <div className="px-3 py-3">
        <NewChatButton onClick={onNewChat} isCollapsed={isCollapsed} />
      </div>

      <MainNavigation currentLocation={currentLocation} />
      
      {!isCollapsed && (
        <div className="relative px-3 mt-4 mb-1">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/60" />
          <Input
            className="w-full bg-transparent hover:bg-sidebar-accent transition-colors rounded-lg pl-9 pr-2 text-xs h-9 border-none focus-visible:ring-0"
            placeholder="Buscar..."
          />
        </div>
      )}

      {!isCollapsed && (
        <div className="flex-1 overflow-y-auto pb-4">
          < RecentConversations
            conversations={conversations}
            currentLocation={currentLocation}
            onSelect={onSelectConversation}
            onRename={onRenameConversation}
            onToggleFavorite={onToggleFavorite}
            onExport={onExportConversation}
            onDelete={onDeleteConversation}
            onSaveToRag={onSaveToRag}
          />
        </div>
      )}
    </SidebarContent>
  );
}

function SidebarFooterContent({
  user,
  onProfileClick,
  onSettingsClick,
  onHelpClick,
  onLogout,
}: {
  user: any;
  onProfileClick: () => void;
  onSettingsClick: () => void;
  onHelpClick: () => void;
  onLogout: () => void;
}) {
  return (
    <SidebarFooter className="p-3 border-t border-sidebar-border/10 bg-sidebar/40 backdrop-blur-xl">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all w-full text-left focus:outline-none group"
          >
            <Avatar className="h-8 w-8 rounded-lg border-none ring-1 ring-sidebar-border/20 shrink-0">
              <AvatarFallback className="text-[10px] bg-foreground text-background font-bold uppercase">
                {user?.name?.substring(0, 2).toUpperCase() || "US"}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="text-[13px] font-bold truncate leading-none text-foreground/90">
                {user?.name || "Usuário"}
              </p>
            </div>
            <MoreHorizontal className="h-4 w-4 text-muted-foreground group-data-[collapsible=icon]:hidden opacity-30 group-hover:opacity-100 transition-opacity" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" side="right" className="w-56 p-1.5 rounded-xl shadow-2xl border-border/10 backdrop-blur-xl bg-background/95">
          <DropdownMenuLabel className="text-[10px] font-bold text-muted-foreground/50 uppercase tracking-widest px-2 py-2">
            Conta
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="my-1 bg-border/10" />
          <DropdownMenuItem onClick={onProfileClick} className="gap-2.5 rounded-lg py-2 cursor-pointer text-sm">
            <User className="h-4 w-4 text-muted-foreground/60" />
            <span>Perfil</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onSettingsClick} className="gap-2.5 rounded-lg py-2 cursor-pointer text-sm">
            <Settings className="h-4 w-4 text-muted-foreground/60" />
            <span>Configurações</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onHelpClick} className="gap-2.5 rounded-lg py-2 cursor-pointer text-sm">
            <HelpCircle className="h-4 w-4 text-muted-foreground/60" />
            <span>Ajuda</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator className="my-1 bg-border/10" />
          <DropdownMenuItem onClick={onLogout} className="gap-2.5 text-destructive focus:text-destructive focus:bg-destructive/10 rounded-lg py-2 cursor-pointer text-sm font-medium">
            <LogOut className="h-4 w-4" />
            <span>Sair</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </SidebarFooter>
  );
}

function MobileTopBar({ onNewChat }: { onNewChat: () => void }) {
  return (
    <div className="flex border-b border-border h-14 items-center justify-between bg-background/80 backdrop-blur-md px-4 sticky top-0 z-40 transition-all duration-200">
      <div className="flex items-center gap-3">
        <SidebarTrigger className="h-9 w-9 text-muted-foreground hover:text-foreground" />
        <span className="font-semibold text-sm tracking-tight">AVA Assistant</span>
      </div>
      <Button type="button" variant="ghost" size="icon" onClick={onNewChat} className="rounded-full hover:bg-primary/10 hover:text-primary">
        <Plus className="h-5 w-5" />
      </Button>
    </div>
  );
}

function SidebarResizeHandle({
  isCollapsed,
  onResizeStart,
}: {
  isCollapsed: boolean;
  onResizeStart: () => void;
}) {
  if (isCollapsed) return null;

  return (
    <div
      className="absolute top-0 right-0 w-[3px] h-full cursor-col-resize hover:bg-primary/50 transition-colors z-50 opacity-0 hover:opacity-100 active:opacity-100 active:bg-primary"
      onMouseDown={onResizeStart}
    />
  );
}

// ============================================================================
// MAIN LAYOUT CONTENT
// ============================================================================

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();
  const dialogs = useUserMenuDialogs();

  // Rename Dialog State
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [conversationToRename, setConversationToRename] = useState<any>(null);
  const [newTitle, setNewTitle] = useState("");

  const [isResizing, setIsResizing] = useSidebarResize(
    sidebarRef,
    setSidebarWidth,
    isCollapsed
  );

  const trpcUtils = trpc.useContext();
  const { data: conversations } = trpc.chat.listConversations.useQuery();
  const { data: hardwareMode } = trpc.hardware.detectMode.useQuery();

  const createConversationMutation = trpc.chat.createConversation.useMutation({
    onSuccess: () => trpcUtils.chat.listConversations.invalidate(),
  });

  const renameMutation = trpc.chat.renameConversation.useMutation({
    onSuccess: () => {
      trpcUtils.chat.listConversations.invalidate();
      setRenameDialogOpen(false);
    },
  });

  const toggleFavoriteMutation = trpc.chat.toggleFavorite.useMutation({
    onSuccess: () => trpcUtils.chat.listConversations.invalidate(),
  });

  const deleteMutation = trpc.chat.deleteConversation.useMutation({
    onSuccess: () => {
      trpcUtils.chat.listConversations.invalidate();
      // If we are currently in the deleted conversation, go back home
      if (location.startsWith("/chat/")) {
        const currentId = location.split("/").pop();
        // This is a bit simplified, but should work for now
        setLocation("/");
      }
    },
  });

  const saveToRagMutation = trpc.chat.saveToRag.useMutation({
    onSuccess: () => {
      alert("Conversa salva na memória (RAG) com sucesso!");
    },
    onError: (err) => {
      alert(`Erro ao salvar no RAG: ${err.message}`);
    }
  });

  const exportMutation = trpc.chat.exportConversation.useMutation();

  const handleNewChat = async () => {
    try {
      const res = await createConversationMutation.mutateAsync({
        title: "Nova conversa",
      });
      const id = (res as any)?.conversationId ?? (res as any)?.id;
      if (id) {
        setLocation(`/chat/${id}`);
      }
    } catch (error) {
      console.error("Erro ao criar conversa:", error);
    }
  };

  const handleSelectConversation = (id: number) => {
    setLocation(`/chat/${id}`);
  };

  const handleOpenRenameDialog = (conversation: any) => {
    setConversationToRename(conversation);
    setNewTitle(conversation.title);
    setRenameDialogOpen(true);
  };

  const handleConfirmRename = () => {
    if (conversationToRename && newTitle.trim()) {
      renameMutation.mutate({
        conversationId: conversationToRename.id,
        title: newTitle.trim(),
      });
    }
  };

  const handleToggleFavorite = (id: number) => {
    toggleFavoriteMutation.mutate({ conversationId: id });
  };

  const handleDeleteConversation = (id: number) => {
    if (window.confirm("Tem certeza que deseja excluir esta conversa? Esta ação não pode ser desfeita.")) {
      deleteMutation.mutate({ conversationId: id });
    }
  };

  const handleSaveToRag = (id: number) => {
    saveToRagMutation.mutate({ conversationId: id });
  };

  const handleExportConversation = (id: number) => {
    exportMutation.mutate(
      { conversationId: id, format: "json" },
      {
        onSuccess: (res: any) => {
          const href = `data:${res.mimeType};base64,${res.contentBase64}`;
          const a = document.createElement("a");
          a.href = href;
          a.download = res.filename;
          document.body.appendChild(a);
          a.click();
          a.remove();
        },
      }
    );
  };

  return (
    <div className="h-screen flex overflow-hidden text-foreground bg-background transition-colors duration-300">
      <div
        className="relative z-20 flex-shrink-0"
        ref={sidebarRef}
      >
        <Sidebar
          collapsible="icon"
          className="border-r border-sidebar-border bg-sidebar"
          disableTransition={isResizing}
        >
          <SidebarHeaderContent
            isCollapsed={isCollapsed}
            onToggle={toggleSidebar}
          />

          <SidebarContentArea
            isCollapsed={isCollapsed}
            conversations={conversations}
            currentLocation={location}
            onNewChat={handleNewChat}
            onSelectConversation={handleSelectConversation}
            onRenameConversation={handleOpenRenameDialog}
            onToggleFavorite={handleToggleFavorite}
            onExportConversation={handleExportConversation}
            onDeleteConversation={handleDeleteConversation}
            onSaveToRag={handleSaveToRag}
          />

          <SidebarFooterContent
            user={user}
            onProfileClick={() => dialogs.profile.setOpen(true)}
            onSettingsClick={() => setLocation("/configuracoes")}
            onHelpClick={() => dialogs.help.setOpen(true)}
            onLogout={logout}
          />
        </Sidebar>
        
        <SidebarResizeHandle
          isCollapsed={isCollapsed}
          onResizeStart={() => setIsResizing(true)}
        />
      </div>

      <SidebarInset className="bg-background flex flex-col h-full flex-1 min-w-0">
        {isMobile && <MobileTopBar onNewChat={handleNewChat} />}
        
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden relative">
          {children}
        </main>
      </SidebarInset>

      <UserProfileDialog
        open={dialogs.profile.open}
        onOpenChange={dialogs.profile.setOpen}
      />
      <SettingsDialog
        open={dialogs.settings.open}
        onOpenChange={dialogs.settings.setOpen}
      />
      <HelpDialog
        open={dialogs.help.open}
        onOpenChange={dialogs.help.setOpen}
      />

      <Dialog open={renameDialogOpen} onOpenChange={setRenameDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Renomear conversa</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Título
              </Label>
              <Input
                id="name"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="col-span-3"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    handleConfirmRename();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRenameDialogOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleConfirmRename} disabled={renameMutation.isPending}>
              {renameMutation.isPending ? "Salvando..." : "Salvar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarWidth, setSidebarWidth] = useSidebarWidth();
  const { loading, user } = useAuth();

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent
        setSidebarWidth={setSidebarWidth}
      >
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}
