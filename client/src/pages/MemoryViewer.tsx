import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Download, Trash2, Search, BrainCircuit, Cpu, Database } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

export default function MemoryViewer() {
  const [searchQuery, setSearchQuery] = useState("");

  const memoriesQuery = trpc.memory.searchAdvanced.useQuery(
    { query: searchQuery.trim() || " " },
    { enabled: true }
  );

  const cleanMutation = trpc.memory.cleanExpired.useMutation({
    onSuccess: (data) => {
      toast.success(`${data.archived} memórias arquivadas`);
      memoriesQuery.refetch();
    },
    onError: () => {
      toast.error("Erro ao limpar memórias");
    },
  });

  const exportQuery = trpc.memory.export.useQuery(
    { format: "json" },
    { enabled: false }
  );

  const handleClean = () => {
    cleanMutation.mutate();
  };

  const handleExport = async () => {
    const data = await exportQuery.refetch();
    if (data.data?.contentBase64) {
      const blob = new Blob([atob(data.data.contentBase64)], {
        type: "application/json",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = data.data.filename;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Memórias exportadas!");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground p-6 md:p-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        
        {/* Sidebar / Control Panel */}
        <div className="space-y-8 animate-in fade-in slide-in-from-left duration-500">
          <div>
            <h2 className="text-xl font-medium text-foreground flex items-center gap-2.5 tracking-tight">
              <BrainCircuit className="text-muted-foreground/60 w-5 h-5" />
              Memória
            </h2>
            <p className="text-[10px] text-muted-foreground/50 mt-1 uppercase tracking-wider font-medium">
              Sistema de Retenção
            </p>
          </div>

          <div className="space-y-4">
            <div className="group relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground/40 transition-colors group-focus-within:text-muted-foreground/60" />
              <Input
                placeholder="Buscar memórias..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 bg-muted/20 border-border/40 text-foreground placeholder:text-muted-foreground/40 focus:border-border/60 focus:ring-0 transition-all rounded-lg h-9 text-xs"
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
               <Button
                onClick={handleExport}
                variant="ghost"
                className="justify-start text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all text-[10px] uppercase tracking-wider font-medium h-8 px-3"
              >
                <Download className="h-3 w-3 mr-2 opacity-50" />
                Exportar Dados
              </Button>
              <Button
                onClick={handleClean}
                variant="ghost"
                className="justify-start text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5 transition-all text-[10px] uppercase tracking-wider font-medium h-8 px-3"
                disabled={cleanMutation.isPending}
              >
                <Trash2 className="h-3 w-3 mr-2 opacity-40" />
                Limpar Expirados
              </Button>
            </div>
          </div>

          {/* Metrics Visualization */}
          <div className="p-4 rounded-xl bg-muted/10 border border-border/20 space-y-4">
             <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] text-muted-foreground/60 uppercase font-medium">Capacidade</span>
                   <span className="text-[10px] text-muted-foreground/80 font-mono">84%</span>
                </div>
                <div className="h-1 w-full bg-muted/20 rounded-full overflow-hidden">
                   <div className="h-full bg-muted-foreground/30 w-[84%]" />
                </div>
             </div>
             
             <div className="space-y-2">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] text-muted-foreground/60 uppercase font-medium">Integridade</span>
                   <span className="text-[10px] text-muted-foreground/80 font-mono">99.9%</span>
                </div>
                <div className="h-1 w-full bg-muted/20 rounded-full overflow-hidden">
                   <div className="h-full bg-muted-foreground/30 w-[99.9%]" />
                </div>
             </div>
          </div>
        </div>

        {/* Memory Stream */}
        <div className="h-[calc(100vh-80px)] bg-card/30 rounded-xl border border-border/30 overflow-hidden animate-in fade-in duration-700">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-3 pb-20">
               {memoriesQuery.data?.map((memory: any, idx: number) => (
                  <div
                    key={memory.id}
                    className="group relative p-4 rounded-lg bg-muted/5 hover:bg-muted/10 border border-border/20 hover:border-border/40 transition-all duration-200 animate-in fade-in slide-in-from-bottom-1"
                    style={{ animationDelay: `${idx * 30}ms` }}
                  >
                     <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-2">
                           <div className={`w-1.5 h-1.5 rounded-full ${
                             memory.type === 'fact' ? 'bg-blue-400/40' : 
                             memory.type === 'preference' ? 'bg-purple-400/40' : 
                             'bg-muted-foreground/30'
                           }`} />
                           <span className="text-[10px] uppercase tracking-wider text-muted-foreground/50 font-medium">
                              {memory.type}
                           </span>
                        </div>
                        <span className="text-[10px] text-muted-foreground/40 font-mono">
                           {format(new Date(memory.createdAt), "dd.MM.yyyy", { locale: ptBR })}
                        </span>
                     </div>
                     
                     <p className="text-sm font-normal leading-relaxed text-foreground/80">
                        {memory.content}
                     </p>

                     <div className="mt-4 flex items-center justify-between border-t border-border/10 pt-3">
                        <div className="flex gap-1.5">
                          {memory.keywords && memory.keywords.split(',').slice(0, 3).map((kw: string, i: number) => (
                             <span key={i} className="text-[10px] text-muted-foreground/60 bg-muted/30 px-2 py-0.5 rounded-md border border-border/10">
                                {kw.trim()}
                             </span>
                          ))}
                        </div>
                        {memory.score !== undefined && (
                           <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground/40 font-mono">
                              <Cpu className="w-3 h-3 opacity-50" />
                              {(memory.score * 100).toFixed(0)}%
                           </div>
                        )}
                     </div>
                  </div>
               ))}

               {memoriesQuery.isLoading && (
                  <div className="flex flex-col items-center justify-center h-40 gap-3 text-muted-foreground/30 animate-pulse">
                     <Database className="w-6 h-6 opacity-20" />
                     <p className="text-[10px] uppercase tracking-widest font-medium">Acessando Banco Neural...</p>
                  </div>
               )}
               
               {!memoriesQuery.isLoading && memoriesQuery.data?.length === 0 && (
                  <div className="flex flex-col items-center justify-center h-60 gap-4 text-muted-foreground/20">
                     <div className="w-12 h-12 rounded-full border border-current flex items-center justify-center opacity-50">
                        <span className="text-lg">?</span>
                     </div>
                     <p className="text-xs font-medium">Nenhum dado encontrado.</p>
                  </div>
               )}
            </div>
          </ScrollArea>
        </div>
        
      </div>
    </div>
  );
}
