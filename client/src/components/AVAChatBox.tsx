import { useState, useRef, useEffect, useCallback, useMemo, memo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Loader2, Send, Mic, MicOff, Volume2, Settings, X, AlertCircle, 
  FileText, FileCode, Table, Image as ImageIcon, Paperclip, File,
  Brain, Trash2, History, Wifi, WifiOff, Sparkles, User, Bot,
  ChevronDown, Plus, Info, Search, BookOpen
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
} from "@/components/ui/dropdown-menu";
import { Streamdown } from "streamdown";
import { trpc } from "@/lib/trpc";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { toast } from "sonner";
import { useLocation } from "wouter";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

// Types
type Provider = "forge" | "ollama";
type Role = "user" | "assistant" | "system";
type FileCategory = "image" | "code" | "document" | "data" | "unknown";

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
}

interface AVAChatBoxProps {
  conversationId: number;
  mode: "ECO" | "STANDARD" | "PERFORMANCE";
}

function getFileCategory(fileName: string, mimeType: string): FileCategory {
  if (mimeType.startsWith("image/")) return "image";
  const ext = fileName.toLowerCase().split(".").pop() || "";
  if (["js", "ts", "jsx", "tsx", "py", "java", "cpp", "c", "cs", "go", "rs", "php", "rb", "html", "css", "sql", "json", "xml", "yaml", "yml"].includes(ext)) {
    return "code";
  }
  if (["csv", "xls", "xlsx"].includes(ext)) return "data";
  if (["pdf", "doc", "docx", "txt", "md", "rtf"].includes(ext)) return "document";
  return "unknown";
}

async function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve((reader.result as string).split(",")[1] || "");
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function AVAChatBox({ conversationId, mode }: AVAChatBoxProps) {
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState<Provider>("forge");
  const [model, setModel] = useState("gemini-2.5-flash");
  const [attachments, setAttachments] = useState<FileAttachment[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isSearchingRag, setIsSearchingRag] = useState(false);
  const [selectedDocs, setSelectedDocs] = useState<number[]>([]);
  const [showDocSelector, setShowDocSelector] = useState(false);
  const [ragSources, setRagSources] = useState<{name: string; chunk: string}[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // tRPC Hooks
  const { data: messages, refetch: refetchMessages, error: queryError } = trpc.chat.getMessages.useQuery(
    { conversationId },
    {
      enabled: conversationId > 0,
      retry: false,
    }
  );

  const { data: documents } = trpc.documents.list.useQuery({
    legalStatus: "vigente",
  });

  // Redirecionar se conversa não for encontrada
  const [, setLocation] = useLocation();
  useEffect(() => {
    if (queryError?.message?.includes("Conversation not found")) {
      toast.error("Conversa não encontrada", {
        description: "Redirecionamento imediato para o início.",
      });
      setLocation("/");
    }
  }, [queryError, setLocation]);

  const sendMessageMutation = trpc.chat.sendMessage.useMutation();
  const processFilesMutation = trpc.files.processFiles.useMutation();

  // Scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isThinking]);

  const handleSend = async () => {
    if (!input.trim() && attachments.length === 0) return;
    
    const userMessage = input;
    setInput("");
    setIsThinking(true);
    setRagSources([]);

    try {
      if (selectedDocs.length > 0) {
        setIsSearchingRag(true);
        const sources = selectedDocs
          .map(docId => documents?.find(d => d.id === docId))
          .filter((doc): doc is NonNullable<typeof documents>[number] => !!doc)
          .map(doc => ({ name: doc.name, chunk: "" }));
        setRagSources(sources);
      }
      
      await sendMessageMutation.mutateAsync({
        conversationId,
        content: userMessage,
        provider,
        model: provider === "ollama" ? "llama3.2:latest" : model,
        attachments: attachments.map(a => ({
          name: a.name,
          type: a.type,
          category: a.category,
          textContent: a.textContent
        })),
        documentIds: selectedDocs.length > 0 ? selectedDocs : undefined,
      });
      
      setAttachments([]);
      refetchMessages();
    } catch (error) {
      toast.error("Falha ao enviar mensagem");
      console.error(error);
    } finally {
      setIsThinking(false);
      setIsSearchingRag(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    try {
      const fileList = Array.from(files);
      const payload = await Promise.all(
        fileList.map(async file => ({
          name: file.name,
          type: file.type || "application/octet-stream",
          content: await readFileAsBase64(file),
        }))
      );

      const processed = await processFilesMutation.mutateAsync(payload);
      const newAttachments: FileAttachment[] = processed.map((item, idx) => ({
        id: Math.random().toString(36).substring(2, 11),
        name: item.name,
        type: item.type,
        category: getFileCategory(item.name, item.type),
        textContent: item.text,
        size: item.size,
      }));

      setAttachments(prev => [...prev, ...newAttachments]);
    } catch (error) {
      console.error(error);
      toast.error("Falha ao processar anexos");
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0 bg-background relative overflow-hidden">
      {/* Chat Header */}
      <header className="h-14 border-b border-border/50 px-6 flex items-center justify-between bg-background/80 backdrop-blur-md sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center">
            <Bot className="h-4 w-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-semibold">Assistente AVA</h2>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-green-500"></span>
              <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                {mode} Mode • {provider === "forge" ? "Cloud" : "Local"}
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <Info className="h-4 w-4 text-muted-foreground" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Informações da Conversa</TooltipContent>
          </Tooltip>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      </header>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto px-2 md:px-5 lg:px-6 py-8 space-y-8 scrollbar-thin pb-28 md:pb-32">
        {messages?.map((msg: Message) => (
          <div 
            key={msg.id} 
            className={`flex gap-4 w-full animate-in fade-in duration-300 ${msg.role === "user" ? "flex-row-reverse" : ""}`}
          >
            <Avatar className={`h-8 w-8 border shrink-0 ${msg.role === "assistant" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
              <AvatarFallback className="text-[10px] font-bold">
                {msg.role === "assistant" ? <Sparkles className="h-4 w-4" /> : <User className="h-4 w-4" />}
              </AvatarFallback>
            </Avatar>
            
            <div className={`flex flex-col gap-2 ${msg.role === "user" ? "items-end" : "items-start"}`}>
              <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed shadow-sm ${
                msg.role === "user" 
                  ? "bg-primary text-primary-foreground rounded-tr-none" 
                  : "bg-card border border-border/50 text-foreground rounded-tl-none"
              } break-words whitespace-pre-wrap`}>
                <Streamdown>{msg.content}</Streamdown>
              </div>
              <span className="text-[10px] text-muted-foreground px-1">
                {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true, locale: ptBR })}
              </span>
            </div>
          </div>
        ))}
        
        {isThinking && (
          <div className="flex gap-4 w-full animate-pulse">
            <Avatar className="h-8 w-8 border shrink-0 bg-primary/20">
              <AvatarFallback><Sparkles className="h-4 w-4 text-primary" /></AvatarFallback>
            </Avatar>
            <div className="bg-muted/30 px-4 py-3 rounded-2xl rounded-tl-none border border-border/50">
              <div className="flex gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce delay-150"></span>
                <span className="h-1.5 w-1.5 rounded-full bg-primary/40 animate-bounce delay-300"></span>
              </div>
            </div>
          </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input Area */}
      <div className="sticky bottom-0 z-10 p-3 md:p-4 bg-gradient-to-t from-background via-background/95 to-transparent border-t border-border/40 supports-[backdrop-filter]:backdrop-blur-md">
        <div className="max-w-5xl mx-auto space-y-4">
          {/* Document Selector Chips */}
          {documents && documents.length > 0 && (
            <div className="flex flex-wrap gap-2 px-2">
              <DropdownMenu open={showDocSelector} onOpenChange={setShowDocSelector}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="gap-1.5 h-7 text-xs"
                  >
                    <BookOpen className="h-3 w-3" />
                    Documentos
                    {selectedDocs.length > 0 && (
                      <Badge variant="secondary" className="h-5 px-1.5">
                        {selectedDocs.length}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-72 max-h-72 overflow-y-auto">
                  <DropdownMenuLabel>Selecionar documentos para RAG</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {(documents || []).map(doc => (
                    <DropdownMenuCheckboxItem
                      key={doc.id}
                      checked={selectedDocs.includes(doc.id)}
                      onCheckedChange={(checked) => {
                        setSelectedDocs(prev => {
                          if (checked) {
                            return prev.includes(doc.id) ? prev : [...prev, doc.id];
                          }
                          return prev.filter(id => id !== doc.id);
                        });
                      }}
                    >
                      {doc.name}
                    </DropdownMenuCheckboxItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              {selectedDocs.map(docId => {
                const doc = documents.find(d => d.id === docId);
                if (!doc) return null;
                return (
                  <Badge key={docId} variant="secondary" className="gap-1 h-7 px-2 bg-primary/10 border-primary/20">
                    <BookOpen className="h-3 w-3 text-primary" />
                    <span className="max-w-[120px] truncate">{doc.name}</span>
                    <button onClick={() => setSelectedDocs(prev => prev.filter(id => id !== docId))}>
                      <X className="h-3 w-3 hover:text-destructive" />
                    </button>
                  </Badge>
                );
              })}
            </div>
          )}

          {/* RAG Searching Indicator */}
          {isSearchingRag && (
            <div className="flex items-center gap-2 px-2 py-2 bg-primary/5 rounded-lg border border-primary/10">
              <Search className="h-4 w-4 text-primary animate-pulse" />
              <span className="text-sm text-primary">Consultando documentos...</span>
            </div>
          )}

          {/* RAG Sources Display */}
          {ragSources.length > 0 && (
            <div className="flex flex-wrap gap-2 px-2">
              <span className="text-xs text-muted-foreground">Fontes:</span>
              {ragSources.map((source, idx) => (
                <Badge key={idx} variant="outline" className="gap-1 text-xs">
                  <FileText className="h-3 w-3" />
                  {source.name}
                </Badge>
              ))}
            </div>
          )}

          {/* File Previews */}
          {attachments.length > 0 && (
            <div className="flex flex-wrap gap-2 px-2">
              {attachments.map(file => (
                <Badge key={file.id} variant="secondary" className="gap-2 px-3 py-1 h-8 rounded-lg bg-accent/50 border-accent">
                  <FileText className="h-3 w-3" />
                  <span className="max-w-[150px] truncate">{file.name}</span>
                  <button onClick={() => setAttachments(prev => prev.filter(f => f.id !== file.id))}>
                    <X className="h-3 w-3 hover:text-destructive" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Input Box */}
          <div className="relative group">
            <div className="absolute inset-0 bg-primary/5 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-opacity"></div>
            <Card className="relative border-border/50 shadow-lg rounded-2xl overflow-hidden focus-within:border-primary/30 transition-all">
              <div className="flex flex-col">
                <textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey) {
                      e.preventDefault();
                      handleSend();
                    }
                  }}
                  placeholder="Como posso ajudar você hoje?"
                  className="w-full bg-transparent border-none focus:ring-0 p-4 min-h-[150px] resize-none text-sm leading-relaxed placeholder:text-muted-foreground/60"
                />
                
                <div className="flex items-center justify-between p-3 bg-muted/20 border-t border-border/30">
                  <div className="flex items-center gap-1">
                    <input 
                      type="file" 
                      ref={fileInputRef} 
                      className="hidden" 
                      multiple 
                      accept=".pdf,.doc,.docx,.csv,.xls,.xlsx,.json,.html,.js,.ts,.txt,.md"
                      onChange={handleFileChange}
                    />
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-8 w-8 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Anexar arquivos</TooltipContent>
                    </Tooltip>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 gap-2 px-3 rounded-lg hover:bg-primary/10 hover:text-primary text-xs font-medium transition-colors">
                          <Sparkles className="h-3 w-3" />
                          {provider === "forge" ? "Forge (Cloud)" : "Ollama (Local)"}
                          <ChevronDown className="h-3 w-3 opacity-50" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start" className="w-48">
                        <DropdownMenuLabel className="text-[10px] uppercase tracking-wider text-muted-foreground">Provedor de IA</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuRadioGroup value={provider} onValueChange={(v) => setProvider(v as Provider)}>
                          <DropdownMenuRadioItem value="forge" className="text-xs gap-2">
                            <Sparkles className="h-3 w-3" /> Forge Cloud
                          </DropdownMenuRadioItem>
                          <DropdownMenuRadioItem value="ollama" className="text-xs gap-2">
                            <Brain className="h-3 w-3" /> Ollama Local
                          </DropdownMenuRadioItem>
                        </DropdownMenuRadioGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <Button 
                    onClick={handleSend}
                    disabled={(!input.trim() && attachments.length === 0) || isThinking}
                    size="sm"
                    className="h-8 w-8 rounded-lg shadow-sm"
                  >
                    {isThinking ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  </Button>
                </div>
              </div>
            </Card>
          </div>
          <p className="text-[10px] text-center text-muted-foreground/60">
            AVA pode cometer erros. Considere verificar informações importantes.
          </p>
        </div>
      </div>
    </div>
  );
}
