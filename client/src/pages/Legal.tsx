import React, { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Gavel, 
  Plus, 
  Search, 
  Calendar, 
  User, 
  Scale,
  ExternalLink,
  MoreVertical,
  AlertCircle
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

export default function Legal() {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { data: processes, isLoading: isLoadingProcesses } = trpc.legal.getProcesses.useQuery();
  const { data: deadlines, isLoading: isLoadingDeadlines } = trpc.legal.getDeadlines.useQuery();

  const filteredProcesses = processes?.filter(p => 
    (p.actionTypeName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) || 
    p.processNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.clientName?.toLowerCase() || "").includes(searchTerm.toLowerCase())
  );

  const getStatusBadge = (status: string | null) => {
    switch (status) {
      case "em andamento":
        return <Badge variant="default" className="bg-green-500/10 text-green-500 border-green-500/20">Em Andamento</Badge>;
      case "suspenso":
        return <Badge variant="outline" className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Suspenso</Badge>;
      case "arquivado":
        return <Badge variant="secondary">Arquivado</Badge>;
      case "sentenciado":
        return <Badge variant="default" className="bg-blue-500/10 text-blue-500 border-blue-500/20">Sentenciado</Badge>;
      default:
        return <Badge variant="outline">{status || "N/A"}</Badge>;
    }
  };

  return (
    <DashboardLayout>
      <div className="flex-1 overflow-y-auto bg-background/50">
        <div className="container mx-auto p-6 max-w-7xl space-y-8">
          
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                <Gavel className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Módulo Jurídico</h1>
                <p className="text-muted-foreground text-sm">Gerencie seus processos e prazos em um só lugar.</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                Novo Processo
              </Button>
            </div>
          </div>

          {/* Stats/Quick Access */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Total de Processos
                </CardDescription>
                <CardTitle className="text-3xl">{isLoadingProcesses ? <Skeleton className="h-9 w-12" /> : processes?.length || 0}</CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 text-yellow-500">
                  <Calendar className="h-4 w-4" />
                  Prazos Pendentes
                </CardDescription>
                <CardTitle className="text-3xl text-yellow-500">
                  {isLoadingDeadlines ? <Skeleton className="h-9 w-12" /> : deadlines?.filter(d => d.status === "pendente").length || 0}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="bg-card/50 backdrop-blur-sm border-border/50">
              <CardHeader className="pb-2">
                <CardDescription className="flex items-center gap-2 text-red-500">
                  <AlertCircle className="h-4 w-4" />
                  Urgentes
                </CardDescription>
                <CardTitle className="text-3xl text-red-500">
                  {isLoadingDeadlines ? <Skeleton className="h-9 w-12" /> : deadlines?.filter(d => (d.urgency === "urgente" || d.urgency === "alta") && d.status === "pendente").length || 0}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Search and Filters */}
          <div className="flex items-center gap-4 bg-card/30 p-4 rounded-xl border border-border/50">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Buscar por número ou título do processo..." 
                className="pl-10 bg-background/50 border-none ring-1 ring-border/50 focus-visible:ring-primary/50"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Lawsuits Table */}
          <Card className="border-border/50 overflow-hidden bg-card/30 backdrop-blur-sm">
            <CardHeader className="border-b border-border/50 bg-muted/20">
              <CardTitle className="text-lg">Processos Recentes</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent border-border/50">
                    <TableHead>Processo</TableHead>
                    <TableHead>Ação / Cliente</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoadingProcesses ? (
                    Array.from({ length: 3 }).map((_, i) => (
                      <TableRow key={i}>
                        <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                        <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                      </TableRow>
                    ))
                  ) : filteredProcesses && filteredProcesses.length > 0 ? (
                    filteredProcesses.map((process) => (
                      <TableRow key={process.id} className="hover:bg-muted/30 border-border/50 transition-colors">
                        <TableCell className="font-mono text-xs text-muted-foreground">{process.processNumber}</TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium">{process.actionTypeName}</span>
                            <span className="text-xs text-muted-foreground">{process.clientName}</span>
                          </div>
                        </TableCell>
                        <TableCell>{getStatusBadge(process.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground capitalize">{process.category}</TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2">
                                <ExternalLink className="h-4 w-4" />
                                Ver Detalhes
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2">
                                <Calendar className="h-4 w-4" />
                                Adicionar Prazo
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                        {searchTerm ? "Nenhum processo encontrado para esta busca." : "Nenhum processo cadastrado ainda."}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
