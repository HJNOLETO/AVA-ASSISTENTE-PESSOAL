import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";

interface UseConnectionReturn {
  connectionStatus: "idle" | "unknown" | "connected" | "error";
  connectionMessage: string;
  testConnectionQuery: any;
  handleTestConnection: (provider: string, baseUrl: string, authToken: string) => Promise<void>;
}

export function useConnection(): UseConnectionReturn {
  const [connectionStatus, setConnectionStatus] = useState<
    "idle" | "unknown" | "connected" | "error"
  >("idle");
  const [connectionMessage, setConnectionMessage] = useState<string>("");

  const testConnectionQuery = trpc.llm.testConnection.useQuery(
    {
      baseUrl: "",
      authToken: "",
      provider: "ollama",
    },
    { enabled: false, retry: false }
  );

  const handleTestConnection = async (
    provider: string,
    baseUrl: string,
    authToken: string
  ) => {
    try {
      setConnectionStatus("unknown");
      const result = await testConnectionQuery.refetch();
      if (result.data?.success) {
        setConnectionStatus("connected");
        setConnectionMessage(result.data.message || "Conectado com sucesso");
        toast.success(result.data.message || "Conexão estabelecida!");
      } else {
        setConnectionStatus("error");
        const msg =
          result.data?.error || result.data?.suggestion || "Falha na conexão";
        setConnectionMessage(msg);
        toast.error(msg);
      }
    } catch (error) {
      setConnectionStatus("error");
      setConnectionMessage("Erro ao testar conexão");
      toast.error("Erro ao testar conexão");
    }
  };

  return {
    connectionStatus,
    connectionMessage,
    testConnectionQuery,
    handleTestConnection,
  };
}