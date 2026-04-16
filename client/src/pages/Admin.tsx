import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { trpc } from "@/lib/trpc";
import { useAuth } from "@/hooks/useAuth";
import { 
  Users, 
  Activity, 
  Shield, 
  LogOut, 
  Trash2, 
  UserCog, 
  Database, 
  Cpu, 
  Server,
  ArrowLeft,
  Search,
  CheckCircle2,
  AlertCircle,
  XCircle,
  Clock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { 
  Badge 
} from "@/components/ui/badge";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { user, loading: authLoading } = useAuth({ redirectOnUnauthenticated: true });
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  
  const utils = trpc.useUtils();
  
  // Queries
  const { data: stats, isLoading: statsLoading } = trpc.admin.getStats.useQuery(undefined, {
    enabled: !!user && user.role === "admin",
    refetchInterval: 30000, // Refresh every 30s
  });
  
  const { data: usersList, isLoading: usersLoading } = trpc.admin.getUsers.useQuery(undefined, {
    enabled: !!user && user.role === "admin" && activeTab === "users",
  });
  
  const { data: logs, isLoading: logsLoading } = trpc.admin.getLogs.useQuery({ limit: 50 }, {
    enabled: !!user && user.role === "admin" && activeTab === "logs",
    refetchInterval: 10000, // Refresh every 10s
  });

  // Mutations
  const updateRoleMutation = trpc.admin.updateUser.useMutation({
    onSuccess: () => {
      toast.success("Role do usuário atualizado");
      utils.admin.getUsers.invalidate();
    },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  const deleteUserMutation = trpc.admin.deleteUser.useMutation({
    onSuccess: () => {
      toast.success("Usuário removido com sucesso");
      utils.admin.getUsers.invalidate();
    },
    onError: (err) => toast.error(`Erro: ${err.message}`),
  });

  // Check if user is admin
  useEffect(() => {
    if (!authLoading && user && user.role !== "admin") {
      toast.error("Acesso negado: Requer privilégios de administrador");
      setLocation("/");
    }
  }, [user, authLoading, setLocation]);

  if (authLoading || !user || user.role !== "admin") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-zinc-900 dark:border-zinc-100"></div>
      </div>
    );
  }

  const filteredUsers = usersList?.filter(u => 
    u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => setLocation("/")}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-zinc-900 dark:text-zinc-50">
                Painel Administrativo
              </h1>
              <p className="text-zinc-500 dark:text-zinc-400">
                Gerencie usuários, monitore o sistema e visualize logs
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="px-3 py-1 border-zinc-200 dark:border-zinc-800">
              <Shield className="w-3 h-3 mr-2 text-blue-500" />
              Admin: {user.name}
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="dashboard" onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-1">
            <TabsTrigger value="dashboard" className="gap-2">
              <Activity className="w-4 h-4" /> Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="gap-2">
              <Users className="w-4 h-4" /> Usuários
            </TabsTrigger>
            <TabsTrigger value="logs" className="gap-2">
              <Database className="w-4 h-4" /> Logs de Sistema
            </TabsTrigger>
          </TabsList>

          {/* Dashboard Tab */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Total de Usuários</CardTitle>
                  <Users className="w-4 h-4 text-zinc-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.totalUsers || 0}</div>
                  <p className="text-xs text-zinc-500">Cadastrados no sistema</p>
                </CardContent>
              </Card>
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Administradores</CardTitle>
                  <Shield className="w-4 h-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.adminUsers || 0}</div>
                  <p className="text-xs text-zinc-500">Acesso privilegiado</p>
                </CardContent>
              </Card>
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Ativos (24h)</CardTitle>
                  <Activity className="w-4 h-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats?.activeSessions || 0}</div>
                  <p className="text-xs text-zinc-500">Usuários únicos ativos</p>
                </CardContent>
              </Card>
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">Status do Servidor</CardTitle>
                  <Server className="w-4 h-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-500">Online</div>
                  <p className="text-xs text-zinc-500">Ambiente: {import.meta.env.MODE}</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Cpu className="w-5 h-5" /> Informações de Hardware
                  </CardTitle>
                  <CardDescription>Especificações do host servidor</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {statsLoading ? (
                    <div className="space-y-2">
                      <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded"></div>
                      <div className="h-4 w-3/4 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded"></div>
                      <div className="h-4 w-1/2 bg-zinc-200 dark:bg-zinc-800 animate-pulse rounded"></div>
                    </div>
                  ) : (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">CPU</span>
                        <span className="font-medium">{stats?.system?.cpu?.model || "N/A"}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Cores</span>
                        <span className="font-medium">{stats?.system?.cpu?.cores || 0}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Memória RAM</span>
                        <span className="font-medium">{stats?.system?.memory?.totalGB?.toFixed(1) || 0} GB</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-zinc-500">Plataforma</span>
                        <span className="font-medium uppercase">{stats?.system?.platform || "N/A"}</span>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              <Card className="border-zinc-200 dark:border-zinc-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clock className="w-5 h-5" /> Últimas Atividades
                  </CardTitle>
                  <CardDescription>Ações recentes detectadas no sistema</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {logs?.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex items-start gap-3 text-sm">
                        <div className={`mt-0.5 p-1 rounded-full ${
                          log.level === "ERROR" ? "bg-red-100 text-red-600" :
                          log.level === "WARNING" ? "bg-amber-100 text-amber-600" :
                          "bg-blue-100 text-blue-600"
                        }`}>
                          {log.level === "ERROR" ? <XCircle className="w-3 h-3" /> :
                           log.level === "WARNING" ? <AlertCircle className="w-3 h-3" /> :
                           <CheckCircle2 className="w-3 h-3" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-zinc-900 dark:text-zinc-200">{log.message}</p>
                          <p className="text-xs text-zinc-500">{new Date(log.createdAt).toLocaleString()}</p>
                        </div>
                      </div>
                    ))}
                    {!logs?.length && !logsLoading && (
                      <p className="text-sm text-zinc-500 text-center py-4">Nenhum log recente</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <Input 
                  placeholder="Buscar por nome ou e-mail..." 
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button onClick={() => utils.admin.getUsers.invalidate()} variant="outline">
                Atualizar Lista
              </Button>
            </div>

            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Usuário</TableHead>
                      <TableHead>E-mail</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Último Login</TableHead>
                      <TableHead className="text-right">Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersLoading ? (
                      Array.from({ length: 5 }).map((_, i) => (
                        <TableRow key={i}>
                          <TableCell><div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded"></div></TableCell>
                          <TableCell><div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded"></div></TableCell>
                          <TableCell><div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded"></div></TableCell>
                          <TableCell><div className="h-4 w-24 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded"></div></TableCell>
                          <TableCell className="text-right"><div className="h-8 w-20 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded ml-auto"></div></TableCell>
                        </TableRow>
                      ))
                    ) : filteredUsers?.map((u) => (
                      <TableRow key={u.id}>
                        <TableCell className="font-medium">{u.name}</TableCell>
                        <TableCell className="text-zinc-500">{u.email}</TableCell>
                        <TableCell>
                          <Badge 
                            variant={u.role === "admin" ? "default" : "secondary"}
                            className={u.role === "admin" ? "bg-blue-100 text-blue-700 hover:bg-blue-100" : ""}
                          >
                            {u.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-zinc-500 text-xs">
                          {new Date(u.lastSignedIn).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              title="Alterar Permissão"
                              onClick={() => updateRoleMutation.mutate({ 
                                userId: u.id, 
                                role: u.role === "admin" ? "user" : "admin" 
                              })}
                            >
                              <UserCog className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
                              title="Excluir Usuário"
                              disabled={u.id === user.id}
                              onClick={() => {
                                if (confirm(`Tem certeza que deseja excluir o usuário ${u.name}?`)) {
                                  deleteUserMutation.mutate({ userId: u.id });
                                }
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {filteredUsers?.length === 0 && (
                  <div className="text-center py-12 text-zinc-500">
                    Nenhum usuário encontrado para "{searchQuery}"
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs Tab */}
          <TabsContent value="logs" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Histórico de Eventos</h3>
              <Button onClick={() => utils.admin.getLogs.invalidate()} variant="outline" size="sm">
                Atualizar Logs
              </Button>
            </div>
            <Card className="border-zinc-200 dark:border-zinc-800">
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">Nível</TableHead>
                        <TableHead>Mensagem</TableHead>
                        <TableHead>Usuário</TableHead>
                        <TableHead className="text-right">Data/Hora</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {logsLoading ? (
                        Array.from({ length: 10 }).map((_, i) => (
                          <TableRow key={i}>
                            <TableCell><div className="h-4 w-12 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded"></div></TableCell>
                            <TableCell><div className="h-4 w-64 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded"></div></TableCell>
                            <TableCell><div className="h-4 w-16 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded"></div></TableCell>
                            <TableCell className="text-right"><div className="h-4 w-32 bg-zinc-100 dark:bg-zinc-800 animate-pulse rounded ml-auto"></div></TableCell>
                          </TableRow>
                        ))
                      ) : logs?.map((log) => (
                        <TableRow key={log.id}>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={`${
                                log.level === "ERROR" ? "border-red-200 text-red-600 bg-red-50" :
                                log.level === "WARNING" ? "border-amber-200 text-amber-600 bg-amber-50" :
                                "border-blue-200 text-blue-600 bg-blue-50"
                              }`}
                            >
                              {log.level}
                            </Badge>
                          </TableCell>
                          <TableCell className="max-w-md truncate" title={log.message}>
                            {log.message}
                          </TableCell>
                          <TableCell className="text-zinc-500 text-xs">
                            ID: {log.userId || "Sistema"}
                          </TableCell>
                          <TableCell className="text-right text-zinc-500 text-xs">
                            {new Date(log.createdAt).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
