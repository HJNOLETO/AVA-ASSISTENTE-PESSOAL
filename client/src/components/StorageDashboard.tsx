import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  HardDrive,
  FileText,
  Brain,
  MessageSquare,
  CheckSquare,
  Trash2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface InactiveDoc {
  id: number;
  name: string;
  lastAccessedAt: Date | null;
  createdAt: string;
}

export function StorageDashboard() {
  const [showInactiveDialog, setShowInactiveDialog] = useState(false);
  const [isCleaning, setIsCleaning] = useState(false);

  const { data: stats, refetch: refetchStats } = trpc.documents.getStorageStats.useQuery();
  const { data: documents, refetch: refetchDocs } = trpc.documents.list.useQuery();

  const vacuumMutation = trpc.documents.vacuum.useMutation({
    onSuccess: () => {
      toast.success("Dados expirados limpos com sucesso");
      refetchStats();
    },
    onError: (err) => toast.error(`Erro ao limpar: ${err.message}`),
  });

  const handleCleanExpired = async () => {
    if (!window.confirm("Isso excluirá permanentemente dados expirados e inativos. Continuar?")) {
      return;
    }
    setIsCleaning(true);
    vacuumMutation.mutate();
  };

  const formatSize = (bytes: number) => {
    const kb = bytes / 1024;
    if (kb < 1024) return `${Math.round(kb)} KB`;
    return `${(kb / 1024).toFixed(1)} MB`;
  };

  const formatDaysInactive = (lastAccessedAt: Date | null, createdAt: Date | string) => {
    const date = lastAccessedAt || new Date(createdAt);
    const now = new Date();
    return Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  };

  const filteredInactiveDocs = (documents || []).filter(doc => {
    const lastAccessed = doc.lastAccessedAt as Date | null;
    const days = formatDaysInactive(lastAccessed, doc.createdAt);
    return days > 90;
  });

  return (
    <div className="flex items-center justify-between gap-6">
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <HardDrive className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="text-sm font-medium">Armazenamento</p>
            <p className="text-xs text-muted-foreground">
              Total: {stats ? formatSize(stats.totalBytes) : "0 KB"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-6 text-xs">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <FileText className="h-3.5 w-3.5" />
            <span>Docs:</span>
            <span className="font-medium">{stats?.documents.count || 0}</span>
            <span className="text-muted-foreground/60">({stats ? formatSize(stats.documents.sizeBytes) : "0 KB"})</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Brain className="h-3.5 w-3.5" />
            <span>Memórias:</span>
            <span className="font-medium">{stats?.memories.count || 0}</span>
            <span className="text-muted-foreground/60">({stats ? formatSize(stats.memories.sizeBytes) : "0 KB"})</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <MessageSquare className="h-3.5 w-3.5" />
            <span>Conversas:</span>
            <span className="font-medium">{stats?.conversations.count || 0}</span>
            <span className="text-muted-foreground/60">({stats ? formatSize(stats.conversations.sizeBytes) : "0 KB"})</span>
          </div>
          
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CheckSquare className="h-3.5 w-3.5" />
            <span>Tarefas:</span>
            <span className="font-medium">{stats?.tasks.count || 0}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {filteredInactiveDocs.length > 0 && (
          <Button variant="outline" size="sm" onClick={() => setShowInactiveDialog(true)} className="gap-1.5 text-yellow-600 border-yellow-500/30 hover:bg-yellow-500/10">
            <AlertTriangle className="h-3.5 w-3.5" />
            {filteredInactiveDocs.length} inativos
          </Button>
        )}
        
        <Button variant="outline" size="sm" onClick={handleCleanExpired} disabled={isCleaning} className="gap-1.5">
          <Trash2 className="h-3.5 w-3.5" />
          {isCleaning ? "Limpando..." : "Limpar expirados"}
        </Button>
      </div>

      <Dialog open={showInactiveDialog} onOpenChange={setShowInactiveDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Documentos Inativos (90+ dias)</DialogTitle>
          </DialogHeader>
          
          {filteredInactiveDocs.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4">Nenhum documento inativo encontrado.</p>
          ) : (
            <div className="h-[300px] overflow-y-auto rounded-lg border p-4 space-y-3">
              {filteredInactiveDocs.map((doc) => {
                const lastAccessed = doc.lastAccessedAt as Date | null;
                const days = formatDaysInactive(lastAccessed, doc.createdAt);
                return (
                  <div key={doc.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <p className="text-sm font-medium line-clamp-1">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {days} dias sem acesso
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowInactiveDialog(false)}>
              Fechar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}