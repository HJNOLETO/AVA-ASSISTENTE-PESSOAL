import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface ToolHistoryItem {
  name: string;
  args: any;
  result: string;
  timestamp: number;
}

interface UseToolsReturn {
  // Estado do modal de ferramentas
  toolDialogOpen: boolean;
  selectedTool: any | null;
  toolArgsText: string;
  toolRunResult: string | null;
  toolHistory: ToolHistoryItem[];
  
  // Queries e mutations
  toolsQuery: any;
  runToolMutation: any;
  isRunningTool: boolean;
  
  // Funções
  openToolDialog: (tool: any) => void;
  closeToolDialog: () => void;
  setToolArgsText: (text: string) => void;
  executeToolFromDialog: () => Promise<void>;
}

export function useTools(conversationId: number): UseToolsReturn {
  // Estado do modal de ferramentas
  const [toolDialogOpen, setToolDialogOpen] = useState(false);
  const [selectedTool, setSelectedTool] = useState<any | null>(null);
  const [toolArgsText, setToolArgsText] = useState<string>("{}");
  const [toolRunResult, setToolRunResult] = useState<string | null>(null);
  const [toolHistory, setToolHistory] = useState<ToolHistoryItem[]>([]);

  // Queries e mutations
  const toolsQuery = trpc.llm.getTools.useQuery(undefined, {
    refetchOnWindowFocus: false,
  });
  
  const runToolMutation = trpc.llm.runTool.useMutation();
  const trpcUtils = trpc.useContext();

  const isRunningTool = Boolean(
    runToolMutation.isPending ||
    (runToolMutation as any).isMutating
  );

  const openToolDialog = (tool: any) => {
    setSelectedTool(tool);
    setToolArgsText(JSON.stringify({}, null, 2));
    setToolRunResult(null);
    setToolDialogOpen(true);
  };

  const closeToolDialog = () => {
    setToolDialogOpen(false);
    setSelectedTool(null);
    setToolArgsText("{}");
    setToolRunResult(null);
  };

  const executeToolFromDialog = async () => {
    if (!selectedTool) return;
    
    let args: any = {};
    try {
      const trimmed = (toolArgsText || "").trim();
      if (trimmed.length > 0) args = JSON.parse(trimmed);
    } catch (e) {
      toast.error("JSON inválido nos argumentos");
      return;
    }

    try {
      const res = await runToolMutation.mutateAsync({
        conversationId,
        name: selectedTool.function.name,
        args,
      });

      const resultText = res.result || "";
      setToolRunResult(resultText);
      setToolHistory(prev => [
        {
          name: selectedTool.function.name,
          args,
          result: resultText,
          timestamp: Date.now(),
        },
        ...prev,
      ]);

      // Invalidar queries relacionadas
      trpcUtils.chat.getMessages.invalidate({ conversationId });
      toast.success("Tool executada com sucesso");
    } catch (error: any) {
      const msg = error?.message || String(error);
      setToolRunResult(`Erro: ${msg}`);
      toast.error(`Erro ao executar ferramenta: ${msg}`);
    }
  };

  return {
    // Estado
    toolDialogOpen,
    selectedTool,
    toolArgsText,
    toolRunResult,
    toolHistory,
    
    // Queries
    toolsQuery,
    runToolMutation,
    isRunningTool,
    
    // Funções
    openToolDialog,
    closeToolDialog,
    setToolArgsText,
    executeToolFromDialog,
  };
}