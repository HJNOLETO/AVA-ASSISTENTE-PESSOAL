import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  Upload,
  MoreHorizontal,
  FileText,
  Calendar,
  HardDrive,
  Layers,
  AlertTriangle,
  BookOpen,
  Clock,
  FileCode,
  Table,
  FileJson,
  File as FileIcon,
} from "lucide-react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import DashboardLayout from "@/components/DashboardLayout";
import { DocumentUploader } from "@/components/DocumentUploader";
import { StorageDashboard } from "@/components/StorageDashboard";

type StatusFilter = "all" | "vigente" | "ab-rogada" | "derrogada" | "extinta";
type TypeFilter = "all" | "lei_federal" | "decreto" | "jurisprudencia" | "doutrina" | "manual" | "livro" | "artigo";

function getStatusBadge(status: string | null) {
  switch (status) {
    case "vigente":
      return <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Vigente</Badge>;
    case "ab-rogada":
      return <Badge className="bg-red-500/10 text-red-600 border-red-500/20 gap-1"><span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Ab-rogada</Badge>;
    case "derrogada":
      return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20 gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500"></span> Derrogada</Badge>;
    case "extinta":
      return <Badge className="bg-gray-500/10 text-gray-600 border-gray-500/20 gap-1"><span className="w-1.5 h-1.5 rounded-full bg-gray-500"></span> Extinta</Badge>;
    default:
      return <Badge variant="secondary">{status || "Desconhecido"}</Badge>;
  }
}

function getPipelineBadge(status: string | null) {
  switch (status) {
    case "review":
      return <Badge className="bg-amber-500/10 text-amber-600 border-amber-500/20">Em revisao</Badge>;
    case "processing":
      return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Indexando</Badge>;
    case "indexed":
      return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Indexado</Badge>;
    case "rejected":
      return <Badge className="bg-rose-500/10 text-rose-600 border-rose-500/20">Rejeitado</Badge>;
    case "error":
      return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Erro</Badge>;
    default:
      return null;
  }
}

function getFileIcon(type: string | null) {
  if (!type) return <FileText className="h-5 w-5 text-muted-foreground" />;
  const ext = type.toLowerCase();
  if (ext.includes("pdf")) return <FileIcon className="h-5 w-5 text-red-500" />;
  if (ext.includes("doc")) return <FileText className="h-5 w-5 text-blue-500" />;
  if (ext.includes("xls") || ext.includes("csv")) return <Table className="h-5 w-5 text-green-500" />;
  if (ext.includes("json")) return <FileJson className="h-5 w-5 text-yellow-500" />;
  if (ext.includes("js") || ext.includes("ts") || ext.includes("html")) return <FileCode className="h-5 w-5 text-purple-500" />;
  return <FileText className="h-5 w-5 text-muted-foreground" />;
}

function formatSize(kb: number) {
  if (!kb || kb < 1024) return `${kb || 0} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}

function formatDate(dateStr: Date | string) {
  return new Date(dateStr).toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function isInactive90Days(lastAccessedAt: Date | null, createdAt: Date | string): boolean {
  const date = lastAccessedAt || new Date(createdAt);
  const now = new Date();
  const diffDays = (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays > 90;
}

export default function DocumentsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [showUploader, setShowUploader] = useState(false);

  const trpcUtils = trpc.useContext();

  const approveReviewMutation = trpc.documents.approveReview.useMutation({
    onSuccess: () => {
      toast.success("Documento aprovado. Indexacao iniciada em segundo plano.");
      trpcUtils.documents.list.invalidate();
    },
    onError: (err) => toast.error(`Falha ao aprovar: ${err.message}`),
  });

  const rejectReviewMutation = trpc.documents.rejectReview.useMutation({
    onSuccess: () => {
      toast.success("Documento marcado como rejeitado.");
      trpcUtils.documents.list.invalidate();
    },
    onError: (err) => toast.error(`Falha ao rejeitar: ${err.message}`),
  });

  const { data: documents, refetch: refetchDocs } = trpc.documents.list.useQuery({
    legalStatus: statusFilter === "all" ? undefined : statusFilter,
    sourceType: typeFilter === "all" ? undefined : typeFilter,
  });

  useEffect(() => {
    const interval = setInterval(() => {
      refetchDocs();
    }, 5000);
    return () => clearInterval(interval);
  }, [refetchDocs]);

  const filteredDocs = (documents || []).filter(doc => {
    if (searchQuery && !doc.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  });

  const inactiveDocs = filteredDocs.filter(doc => {
    const lastAccessed = doc.lastAccessedAt as Date | null;
    return isInactive90Days(lastAccessed, doc.createdAt);
  });

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="border-b border-border px-6 py-4 bg-background/50 backdrop-blur-md">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h1 className="text-lg font-semibold">Biblioteca de Documentos</h1>
                <p className="text-sm text-muted-foreground">Gerencie seus documentos para busca RAG</p>
              </div>
            </div>
            <Button onClick={() => setShowUploader(true)} className="gap-2">
              <Upload className="h-4 w-4" />
              Upload
            </Button>
          </div>

          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar documentos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Todos os status</option>
              <option value="vigente">Vigente</option>
              <option value="ab-rogada">Ab-rogada</option>
              <option value="derrogada">Derrogada</option>
              <option value="extinta">Extinta</option>
            </select>

            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as TypeFilter)}
              className="h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="all">Todos os tipos</option>
              <option value="lei_federal">Lei Federal</option>
              <option value="decreto">Decreto</option>
              <option value="jurisprudencia">Jurisprudência</option>
              <option value="doutrina">Doutrina</option>
              <option value="manual">Manual</option>
              <option value="livro">Livro</option>
              <option value="artigo">Artigo</option>
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {inactiveDocs.length > 0 && (
            <div className="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
              <div className="flex items-center gap-2 text-yellow-700 mb-2">
                <AlertTriangle className="h-4 w-4" />
                <span className="font-medium text-sm">{inactiveDocs.length} documento(s) sem acesso há mais de 90 dias</span>
              </div>
              <p className="text-xs text-yellow-600/80">Considere revisar ou remover documentos que não estão sendo utilizados.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDocs.map((doc) => {
              const indexedChunks = doc.indexedChunks || 0;
              const totalChunks = doc.totalChunks || 0;
              const isIndexing = indexedChunks < totalChunks && totalChunks > 0;
              const isInactive = isInactive90Days(doc.lastAccessedAt as Date | null, doc.createdAt);
              
              return (
                <Card key={doc.id} className={`relative ${isInactive ? "border-yellow-500/30 bg-yellow-500/5" : ""}`}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        {getFileIcon(doc.sourceType as any)}
                        <CardTitle className="text-sm font-semibold line-clamp-1" title={doc.name}>
                          {doc.name}
                        </CardTitle>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          {doc.status === "review" && (
                            <>
                              <DropdownMenuItem
                                className="gap-2 text-emerald-600"
                                onClick={() => approveReviewMutation.mutate({ id: doc.id })}
                              >
                                <Upload className="h-3.5 w-3.5" /> Aprovar e indexar
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="gap-2 text-rose-600"
                                onClick={() => rejectReviewMutation.mutate({ id: doc.id })}
                              >
                                <AlertTriangle className="h-3.5 w-3.5" /> Rejeitar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                            </>
                          )}
                          <DropdownMenuItem className="gap-2">
                            <Search className="h-3.5 w-3.5" /> Testar busca
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2">
                            <Upload className="h-3.5 w-3.5" /> Substituir
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="gap-2 text-yellow-600">
                            <AlertTriangle className="h-3.5 w-3.5" /> Revogar
                          </DropdownMenuItem>
                          <DropdownMenuItem className="gap-2 text-destructive">
                            <Upload className="h-3.5 w-3.5" /> Excluir
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    {getStatusBadge(doc.legalStatus as any)}
                    {getPipelineBadge(doc.status as string)}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {isIndexing && (
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Indexando...</span>
                          <span>{indexedChunks}/{totalChunks}</span>
                        </div>
                        <Progress value={(indexedChunks / totalChunks) * 100} className="h-1.5" />
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Layers className="h-3.5 w-3.5" />
                        <span>{totalChunks} chunks</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <HardDrive className="h-3.5 w-3.5" />
                        <span>{formatSize(doc.estimatedSizeKB || 0)}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{formatDate(doc.createdAt)}</span>
                      </div>
                      {doc.pageCount && (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <FileText className="h-3.5 w-3.5" />
                          <span>{doc.pageCount} páginas</span>
                        </div>
                      )}
                    </div>

                    {isInactive && (
                      <div className="flex items-center gap-1 text-xs text-yellow-600">
                        <Clock className="h-3 w-3" />
                        <span>Inativo há 90+ dias</span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })}

            {filteredDocs.length === 0 && (
              <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
                <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                </div>
                <h3 className="font-medium text-muted-foreground mb-1">Nenhum documento encontrado</h3>
                <p className="text-sm text-muted-foreground/60 mb-4">Faça upload de documentos para começar</p>
                <Button onClick={() => setShowUploader(true)} variant="outline" className="gap-2">
                  <Upload className="h-4 w-4" /> Upload
                </Button>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border p-4 bg-background/50">
          <StorageDashboard />
        </div>

        {showUploader && (
          <Dialog open={showUploader} onOpenChange={setShowUploader}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Upload de Documento</DialogTitle>
              </DialogHeader>
              <DocumentUploader onClose={() => setShowUploader(false)} />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </DashboardLayout>
  );
}
