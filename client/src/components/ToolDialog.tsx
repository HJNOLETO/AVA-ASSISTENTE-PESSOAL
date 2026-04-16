import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Loader2, Terminal, Play, History, X } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface ToolDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTool: any | null;
  toolArgsText: string;
  toolRunResult: string | null;
  toolHistory: Array<{ name: string; args: any; result: string; timestamp: number }>;
  isRunning: boolean;
  onArgsChange: (text: string) => void;
  onExecute: () => void;
}

export const ToolDialog: React.FC<ToolDialogProps> = ({
  open,
  onOpenChange,
  selectedTool,
  toolArgsText,
  toolRunResult,
  toolHistory,
  isRunning,
  onArgsChange,
  onExecute,
}) => {
  if (!selectedTool) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[85vh] p-0 gap-0 overflow-hidden bg-background border-border/40 shadow-none rounded-2xl flex flex-col">
        <DialogHeader className="px-6 py-4 border-b border-border/20 bg-muted/10">
          <div className="flex items-center gap-3">
             <div className="h-8 w-8 rounded-lg bg-muted-foreground/5 flex items-center justify-center text-muted-foreground/60">
                <Terminal className="h-4 w-4" />
             </div>
             <div>
                <DialogTitle className="text-base font-medium tracking-tight text-foreground/90">
                  {selectedTool.function.name}
                </DialogTitle>
                <DialogDescription className="text-xs mt-0.5 line-clamp-1 text-muted-foreground/60">
                  {selectedTool.function.description}
                </DialogDescription>
             </div>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-auto p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6 h-full">
            {/* Left Column: Input */}
            <div className="flex flex-col gap-4">
               <div>
                  <div className="flex items-center justify-between mb-2">
                     <label className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">Argumentos (JSON)</label>
                     <span className="text-[9px] bg-muted/40 px-1.5 py-0.5 rounded text-muted-foreground/40 font-mono">INPUT</span>
                  </div>
                  <div className="relative">
                    <Textarea
                      value={toolArgsText}
                      onChange={(e) => onArgsChange(e.target.value)}
                      className="font-mono text-[11px] leading-relaxed bg-muted/5 min-h-[180px] resize-none border-border/30 focus-visible:ring-0 focus-visible:border-border/60 transition-colors rounded-xl"
                      placeholder='{\n  "param": "value"\n}'
                    />
                  </div>
               </div>
               
               {toolRunResult && (
                <div className="flex-1 flex flex-col min-h-0">
                  <div className="flex items-center justify-between mb-2">
                     <label className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">Resultado</label>
                     <span className="text-[9px] bg-muted/40 text-muted-foreground/40 px-1.5 py-0.5 rounded font-mono border border-border/10">SUCCESS</span>
                  </div>
                  <div className="flex-1 overflow-auto rounded-xl border border-border/20 bg-muted/5 p-4">
                    <pre className="text-[11px] font-mono whitespace-pre-wrap text-muted-foreground/80 break-all leading-relaxed">
                      {toolRunResult}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column: History */}
            <div className="flex flex-col h-full border-l border-border/20 pl-6 -my-2 py-2">
               <div className="flex items-center gap-2 mb-4">
                  <History className="h-3.5 w-3.5 text-muted-foreground/40" />
                  <h4 className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground/60">Histórico</h4>
               </div>
               
               <ScrollArea className="flex-1 -mr-2 pr-4">
                  <div className="space-y-3">
                    {toolHistory.length > 0 ? (
                      toolHistory.map((item, idx) => (
                        <div key={idx} className="p-3 rounded-lg border border-border/10 bg-muted/5 space-y-2 hover:bg-muted/10 transition-colors">
                           <div className="flex items-center justify-between">
                              <span className="text-[10px] font-mono text-muted-foreground/60">
                                {formatDistanceToNow(item.timestamp, { addSuffix: true, locale: ptBR })}
                              </span>
                              <span className="text-[9px] uppercase tracking-tighter text-muted-foreground/30 font-bold">#{toolHistory.length - idx}</span>
                           </div>
                           <div className="text-[11px] text-muted-foreground/80 line-clamp-2 font-mono leading-relaxed bg-background/30 p-1.5 rounded border border-border/5">
                              {JSON.stringify(item.args)}
                           </div>
                        </div>
                      ))
                    ) : (
                      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground/30 space-y-2">
                        <Terminal className="h-6 w-6 opacity-20" />
                        <span className="text-[10px] uppercase tracking-widest font-medium">Sem execuções</span>
                      </div>
                    )}
                  </div>
               </ScrollArea>
            </div>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t border-border/20 bg-muted/5 flex items-center justify-between sm:justify-between">
           <div className="text-[10px] text-muted-foreground/40 font-mono">
              Ready to execute
           </div>
           <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => onOpenChange(false)}
                className="text-xs h-8 px-4 text-muted-foreground hover:bg-muted/20 rounded-lg"
              >
                Fechar
              </Button>
              <Button 
                onClick={onExecute} 
                disabled={isRunning}
                size="sm"
                className="text-xs h-8 px-5 bg-muted-foreground/10 hover:bg-muted-foreground/20 text-foreground border border-border/20 rounded-lg shadow-none"
              >
                {isRunning ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin mr-2" />
                ) : (
                  <Play className="h-3.5 w-3.5 mr-2" />
                )}
                Executar
              </Button>
           </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};