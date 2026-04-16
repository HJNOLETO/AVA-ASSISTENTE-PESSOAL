import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Volume2, ChevronsDown, User, Bot } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Streamdown } from "streamdown";
import { TypingIndicator } from "./TypingIndicator";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSidebar } from "@/components/ui/sidebar";

import { motion } from "framer-motion";

export interface Message {
  id: number;
  role: "user" | "assistant" | "system";
  content: string;
  createdAt: Date;
}

export interface ChatMessagesAreaProps {
  messages: Message[];
  conversationId: number;
  isLoading?: boolean;
  onSpeak?: (messageId: number, content: string) => void;
  className?: string;
}

export interface ChatMessagesAreaHandle {
  scrollToBottom: () => void;
}

const ChatMessagesArea = forwardRef<
  ChatMessagesAreaHandle,
  ChatMessagesAreaProps
>(({ messages, conversationId, isLoading = false, onSpeak, className }, ref) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const { state, isMobile } = useSidebar();
  const isCollapsed = state === "collapsed";

  useImperativeHandle(
    ref,
    () => ({
      scrollToBottom: () => {
        anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
        setIsAtBottom(true);
      },
    }),
    []
  );

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = () => {
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 100;
      setIsAtBottom(atBottom);
    };
    el.addEventListener("scroll", handler);
    handler();
    return () => el.removeEventListener("scroll", handler);
  }, []);

  // Auto-scroll logic
  useEffect(() => {
    if (!isAtBottom) return;
    anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isAtBottom]);

  if (!messages || messages.length === 0) {
    return (
      <ScrollArea
        ref={containerRef as any}
        id={`chat-messages-${conversationId}`}
        tabIndex={0}
        role="log"
        aria-live="polite"
        className={cn("flex-1 w-full overflow-hidden", className)}
    >
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground p-6 max-w-2xl mx-auto w-full text-center space-y-4">
        <div className="h-16 w-16 rounded-2xl bg-primary/5 flex items-center justify-center">
            <Bot className="h-8 w-8 text-primary/60" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Como posso ajudar?</h3>
            <p className="text-sm mt-1">Envie sua primeira pergunta para iniciar o bate-papo.</p>
          </div>
        </div>
      </ScrollArea>
    );
  }

  return (
    <ScrollArea
      ref={containerRef as any}
      id={`chat-messages-${conversationId}`}
      tabIndex={0}
      role="log"
      aria-live="polite"
      className={cn("flex-1 w-full relative overflow-hidden", className)}
    >
      <div className="w-full max-w-2xl mx-auto px-4 py-12 md:py-16 space-y-8">
          {messages.map((message, index) => {
            const isUser = message.role === "user";
            const isSystem = message.role === "system";
            const isAssistant = message.role === "assistant";
            const isError = message.role === "assistant" && message.content.startsWith("❌");
            
            // Check if previous message was from same role to group visual
            const isSequence = index > 0 && messages[index - 1].role === message.role;

            return (
              <div
                key={message.id || index}
                className={cn(
                  "flex gap-4 md:gap-5 w-full group",
                  isUser ? "flex-row-reverse" : "flex-row",
                  isSequence ? "mt-1" : "mt-6"
                )}
              >
                {/* Avatar */}
                <div className={cn("flex-shrink-0 pt-1", isSequence && "invisible h-0")}>
                  <Avatar className={cn(
                    "h-7 w-7 md:h-8 md:w-8 border-none ring-1 ring-border/10",
                    isUser ? "bg-muted" : "bg-foreground"
                  )}>
                    {isUser ? (
                      <AvatarFallback className="bg-transparent text-muted-foreground">
                        <User className="h-3.5 w-3.5 md:h-4 md:w-4" />
                      </AvatarFallback>
                    ) : (
                      <AvatarFallback className="bg-transparent text-background">
                        <span className="font-bold text-[9px] md:text-[10px]">AVA</span>
                      </AvatarFallback>
                    )}
                  </Avatar>
                </div>

                {/* Content Area */}
                <div className={cn(
                  "flex flex-col min-w-0 flex-1",
                  isUser ? "items-end text-right" : "items-start text-left"
                )}>
                  {!isSequence && (
                     <div className="flex items-center gap-2 mb-1 px-1">
                        <span className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-tight">
                          {isUser ? "Você" : isAssistant ? "AVA" : "Sistema"}
                        </span>
                        <span className="text-[10px] text-muted-foreground/40">
                          {formatDistanceToNow(message.createdAt, { locale: ptBR, addSuffix: true })}
                        </span>
                     </div>
                  )}

                  <div
                    className={cn(
                      "text-base leading-relaxed max-w-none w-full",
                      isUser 
                        ? "text-foreground bg-muted/20 px-4 py-2.5 rounded-2xl" 
                        : isSystem
                          ? "bg-destructive/5 text-destructive/80 rounded-lg text-xs font-mono p-3 border border-destructive/10"
                          : "text-foreground px-1"
                    )}
                  >
                    {isAssistant ? (
                      <div className="prose-content markdown-body max-w-none prose-sm md:prose-base">
                         <Streamdown>{message.content}</Streamdown>
                      </div>
                    ) : (
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    )}
                  </div>

                  {/* Message Actions */}
                  {isAssistant && !isError && (
                    <div className="flex items-center gap-2 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 text-xs px-2.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors"
                        onClick={() => onSpeak?.(message.id, message.content)}
                        title="Ouvir resposta"
                      >
                        <Volume2 className="h-3.5 w-3.5 mr-1.5" />
                        Ouvir
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isLoading && (
            <div className="flex gap-4 md:gap-5 w-full mt-6">
               <div className="flex-shrink-0 pt-1">
                 <Avatar className="h-7 w-7 md:h-8 md:w-8 border-none ring-1 ring-border/10 bg-foreground">
                    <AvatarFallback className="bg-transparent text-background">
                      <span className="font-bold text-[9px] md:text-[10px]">AVA</span>
                    </AvatarFallback>
                 </Avatar>
               </div>
               <div className="flex flex-col gap-1">
                 <div className="flex items-center gap-2 px-1">
                    <span className="text-[11px] font-bold text-muted-foreground/80 uppercase tracking-tight">AVA</span>
                    <span className="text-[10px] text-muted-foreground/40 animate-pulse">digitando...</span>
                 </div>
                 <div className="py-2 px-1">
                   <TypingIndicator />
                 </div>
               </div>
            </div>
          )}

          <div ref={anchorRef} className="h-4" />
      </div>

      {!isAtBottom && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-background/80 backdrop-blur-sm border border-border/50 shadow-sm h-8 w-8 hover:bg-background transition-all animate-in fade-in slide-in-from-bottom-2 duration-300"
            onClick={() => {
              anchorRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
              setIsAtBottom(true);
            }}
          >
            <ChevronsDown className="h-4 w-4 text-muted-foreground" />
          </Button>
        </div>
      )}
    </ScrollArea>
  );
});

export default ChatMessagesArea;
export { ChatMessagesArea };
