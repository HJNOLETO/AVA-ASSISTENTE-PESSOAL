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
  LayoutDashboard,
  LogOut,
  PanelLeft,
  Plus,
  MessageSquare,
  FolderOpen,
  Sparkles,
  Settings,
  User,
  HelpCircle,
  Code,
  MoreHorizontal,
} from "lucide-react";
import { CSSProperties, useEffect, useRef, useState } from "react";
import { useLocation } from "wouter";
import { DashboardLayoutSkeleton } from "./DashboardLayoutSkeleton";
import { Button } from "./ui/button";
import { trpc } from "@/lib/trpc";

const SIDEBAR_WIDTH_KEY = "sidebar-width";
const DEFAULT_WIDTH = 260;
const MIN_WIDTH = 200;
const MAX_WIDTH = 400;

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarWidth, setSidebarWidth] = useState(() => {
    const saved = localStorage.getItem(SIDEBAR_WIDTH_KEY);
    return saved ? parseInt(saved, 10) : DEFAULT_WIDTH;
  });
  const { loading, user } = useAuth();

  useEffect(() => {
    localStorage.setItem(SIDEBAR_WIDTH_KEY, sidebarWidth.toString());
  }, [sidebarWidth]);

  if (loading) {
    return <DashboardLayoutSkeleton />;
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-8 p-8 max-w-md w-full">
          <div className="flex flex-col items-center gap-4">
            <div className="h-12 w-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
              <span className="text-primary-foreground font-bold text-xl">
                A
              </span>
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-center">
              AVA Assistant
            </h1>
            <p className="text-sm text-muted-foreground text-center max-w-sm">
              Faça login para acessar seu assistente virtual adaptativo e
              gerenciar suas conversas.
            </p>
          </div>
          <Button
            type="button"
            onClick={() => {
              window.location.href = getLoginUrl();
            }}
            size="lg"
            className="w-full shadow-md hover:shadow-lg transition-all"
          >
            Entrar com Manus
          </Button>
        </div>
      </div>
    );
  }

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": `${sidebarWidth}px`,
        } as CSSProperties
      }
    >
      <DashboardLayoutContent setSidebarWidth={setSidebarWidth}>
        {children}
      </DashboardLayoutContent>
    </SidebarProvider>
  );
}

type DashboardLayoutContentProps = {
  children: React.ReactNode;
  setSidebarWidth: (width: number) => void;
};

function DashboardLayoutContent({
  children,
  setSidebarWidth,
}: DashboardLayoutContentProps) {
  const { user, logout } = useAuth();
  const [location, setLocation] = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const [isResizing, setIsResizing] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const isMobile = useIsMobile();

  // Dialog states
  const [profileOpen, setProfileOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);

  const trpcUtils = trpc.useContext();
  const createConversationMutation = trpc.chat.createConversation.useMutation({
    onSuccess: () => trpcUtils.chat.listConversations.invalidate(),
  });
  const { data: conversations } = trpc.chat.listConversations.useQuery();

  // Mutations for conversation actions
  const renameMutation = trpc.chat.renameConversation.useMutation({
    onSuccess: () => trpcUtils.chat.listConversations.invalidate(),
  });
  const toggleFavoriteMutation = trpc.chat.toggleFavorite.useMutation({
    onSuccess: () => trpcUtils.chat.listConversations.invalidate(),
  });
  const exportMutation = trpc.chat.exportConversation.useMutation();

  const handleNewChat = async () => {
    try {
      const res = await createConversationMutation.mutateAsync({
        title: `Nova conversa`,
      });
      const id = (res as any)?.conversationId ?? (res as any)?.id;
      if (id) {
        setLocation(`/chat/${id}`);
      }
    } catch (error) {
      console.error("Erro ao criar conversa:", error);
    }
  };

  useEffect(() => {
    if (isCollapsed) {
      setIsResizing(false);
    }
  }, [isCollapsed]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const sidebarLeft = sidebarRef.current?.getBoundingClientRect().left ?? 0;
      const newWidth = e.clientX - sidebarLeft;
      if (newWidth >= MIN_WIDTH && newWidth <= MAX_WIDTH) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
    };
  }, [isResizing, setSidebarWidth]);

  return (
    <div className="h-screen flex">
      <div className="relative" ref={sidebarRef}>
        <Sidebar
          collapsible="icon"
          className="border-r border-border/50 bg-sidebar"
          disableTransition={isResizing}
        >
          <SidebarHeader className="h-24 px-4 flex flex-row items-center justify-between">
            {!isCollapsed && (
              <div className="flex items-center gap-2 overflow-hidden">
                <div className="h-7 w-7 rounded-lg bg-primary flex items-center justify-center shrink-0">
                  <span className="text-primary-foreground font-bold text-xs">
                    A
                  </span>
                </div>
                <span className="font-bold tracking-tight text-foreground truncate">
                  AVA Assistant
                </span>
              </div>
            )}
            <button
              onClick={toggleSidebar}
              className="h-8 w-8 flex items-center justify-center hover:bg-accent rounded-lg transition-colors focus:outline-none shrink-0"
              aria-label="Toggle navigation"
            >
              <PanelLeft className="h-4 w-4 text-muted-foreground" />
            </button>
          </SidebarHeader>

          <SidebarContent className="px-3 py-2 gap-4">
            {/* Action Buttons */}
            <div className="space-y-1">
              <Button
                type="button"
                onClick={handleNewChat}
                variant="outline"
                className="w-full justify-start gap-2 h-10 border-dashed hover:border-primary/50 hover:bg-primary/5 transition-all group"
                size="sm"
              >
                <Plus className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                {!isCollapsed && <span>Novo bate-papo</span>}
              </Button>
            </div>

            {/* Main Navigation */}
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location === "/"}
                  onClick={() => setLocation("/")}
                  tooltip="Conversas"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Conversas</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Projetos">
                  <FolderOpen className="h-4 w-4" />
                  <span>Projetos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Artefatos">
                  <Sparkles className="h-4 w-4" />
                  <span>Artefatos</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton tooltip="Código">
                  <Code className="h-4 w-4" />
                  <span>Código</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            {/* Recent Chats */}
            {!isCollapsed && (
              <div className="mt-4">
                <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-2">
                  Recentes
                </p>
                <div className="space-y-1">
                  {conversations?.slice(0, 8).map(conv => (
                    <div
                      key={conv.id}
                      className={`w-full flex items-center justify-between text-sm truncate rounded-md px-1 ${
                        location === `/chat/${conv.id}` ? "bg-accent" : ""
                      }`}
                    >
                      <button
                        onClick={() => setLocation(`/chat/${conv.id}`)}
                        className={`flex-1 text-left py-1.5 px-2 truncate ${
                          location === `/chat/${conv.id}`
                            ? "text-accent-foreground font-medium"
                            : "text-muted-foreground"
                        }`}
                      >
                        {conv.title}
                      </button>

                      <div className="flex items-center pr-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              title="Mais opções"
                              aria-label="Mais opções"
                              className="h-8 w-8 flex items-center justify-center rounded hover:bg-accent/30 focus:outline-none"
                            >
                              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-44 p-1">
                            <DropdownMenuItem
                              onClick={async () => {
                                const newTitle = window.prompt(
                                  "Novo título",
                                  conv.title
                                );
                                if (!newTitle) return;
                                try {
                                  renameMutation.mutate({
                                    conversationId: conv.id,
                                    title: newTitle,
                                  });
                                } catch (e) {
                                  console.error(e);
                                }
                              }}
                            >
                              Renomear
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                try {
                                  toggleFavoriteMutation.mutate({
                                    conversationId: conv.id,
                                  });
                                } catch (e) {
                                  console.error(e);
                                }
                              }}
                            >
                              {(conv as any).favorite
                                ? "Desfavoritar"
                                : "Favoritar"}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={async () => {
                                try {
                                  exportMutation.mutate(
                                    { conversationId: conv.id, format: "json" },
                                    {
                                      onSuccess: res => {
                                        const href = `data:${res.file.mimeType};base64,${res.file.contentBase64}`;
                                        const a = document.createElement("a");
                                        a.href = href;
                                        a.download = res.file.filename;
                                        document.body.appendChild(a);
                                        a.click();
                                        a.remove();
                                      },
                                    }
                                  );
                                } catch (e) {
                                  console.error(e);
                                }
                              }}
                            >
                              Baixar (JSON)
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  ))}
                  {(!conversations || conversations.length === 0) && (
                    <p className="px-2 text-xs text-muted-foreground/60 italic">
                      Nenhuma conversa recente
                    </p>
                  )}
                </div>
              </div>
            )}
          </SidebarContent>

          <SidebarFooter className="p-3 border-t border-border/50">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 rounded-lg px-2 py-2 hover:bg-accent/50 transition-colors w-full text-left group-data-[collapsible=icon]:justify-center focus:outline-none">
                  <Avatar className="h-8 w-8 border-2 border-background shadow-sm shrink-0">
                    <AvatarFallback className="text-[10px] font-bold bg-primary/10 text-primary">
                      {user?.name?.substring(0, 2).toUpperCase() || "US"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0 group-data-[collapsible=icon]:hidden">
                    <p className="text-xs font-semibold truncate leading-none">
                      {user?.name || "Usuário"}
                    </p>
                    <p className="text-[10px] text-muted-foreground truncate mt-1">
                      {user?.email || "configurar perfil"}
                    </p>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                side="right"
                className="w-56 p-1"
              >
                <DropdownMenuLabel className="text-xs font-normal text-muted-foreground px-2 py-1.5">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setProfileOpen(true)}
                  className="gap-2 cursor-pointer"
                >
                  <User className="h-4 w-4" />
                  <span>Meu Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setSettingsOpen(true)}
                  className="gap-2 cursor-pointer"
                >
                  <Settings className="h-4 w-4" />
                  <span>Configurações</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setHelpOpen(true)}
                  className="gap-2 cursor-pointer"
                >
                  <HelpCircle className="h-4 w-4" />
                  <span>Ajuda</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={logout}
                  className="gap-2 cursor-pointer text-destructive focus:text-destructive focus:bg-destructive/10"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Sair</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>
        <div
          className={`absolute top-0 right-0 w-1 h-full cursor-col-resize hover:bg-primary/20 transition-colors ${isCollapsed ? "hidden" : ""} z-50`}
          onMouseDown={() => {
            if (isCollapsed) return;
            setIsResizing(true);
          }}
        />
      </div>

      <SidebarInset className="bg-background">
        {isMobile && (
          <div className="flex border-b h-14 items-center justify-between bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:backdrop-blur sticky top-0 z-40">
            <div className="flex items-center gap-3">
              <SidebarTrigger className="h-9 w-9 rounded-lg" />
              <span className="font-bold text-sm">AVA</span>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleNewChat}
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>
        )}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden">
          {children}
        </main>
      </SidebarInset>

      {/* User Menu Dialogs */}
      <UserProfileDialog open={profileOpen} onOpenChange={setProfileOpen} />
      <SettingsDialog open={settingsOpen} onOpenChange={setSettingsOpen} />
      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
