import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Loader2 } from "lucide-react";
import { AVAChatBox } from "@/components";
import DashboardLayout from "@/components/DashboardLayout";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

export default function Home() {
  const { loading } = useAuth({ redirectOnUnauthenticated: true });
  const [location] = useLocation();
  const [mode, setMode] = useState<"ECO" | "STANDARD" | "PERFORMANCE">("ECO");
  const [showSplash, setShowSplash] = useState(true);
  const detectModeQuery = trpc.hardware.detectMode.useQuery();

  // Extrair ID da conversa da URL se existir (ex: /chat/123)
  const chatMatch = location.match(/\/chat\/(\d+)/);
  const conversationId = chatMatch ? parseInt(chatMatch[1]) : null;

  useEffect(() => {
    if (detectModeQuery.data?.mode) {
      setMode(detectModeQuery.data.mode);
    }
  }, [detectModeQuery.data?.mode]);

  useEffect(() => {
    const splashTimeout = window.setTimeout(() => setShowSplash(false), 500);
    return () => window.clearTimeout(splashTimeout);
  }, []);

  useEffect(() => {
    if (!loading) {
      setShowSplash(false);
    }
  }, [loading]);

  return (
    <DashboardLayout>
      <div className="flex-1 flex flex-col h-full w-full min-w-0 overflow-hidden relative">
        <div
          className={`absolute inset-0 z-40 flex items-center justify-center bg-background transition-opacity duration-300 ${
            showSplash ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <div className="text-center space-y-4 animate-in fade-in duration-300">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground/40" />
            <p className="text-muted-foreground/60 text-sm font-medium">Iniciando AVA...</p>
          </div>
        </div>

        <AVAChatBox
          conversationId={conversationId || 0}
          mode={mode}
        />
      </div>
    </DashboardLayout>
  );
}
