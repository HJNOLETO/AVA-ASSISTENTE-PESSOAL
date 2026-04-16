import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen p-6 bg-background">
          <div className="flex flex-col items-center w-full max-w-md text-center">
            <div className="w-16 h-16 bg-destructive/5 rounded-2xl flex items-center justify-center mb-6 border border-destructive/10">
              <AlertTriangle
                size={24}
                className="text-destructive/70"
              />
            </div>

            <h2 className="text-base font-semibold text-foreground mb-2">Ops! Algo deu errado</h2>
            <p className="text-[13px] text-muted-foreground/60 mb-6">
              Ocorreu um erro inesperado. Tente recarregar a página para continuar.
            </p>

            <div className="p-4 w-full rounded-2xl bg-muted/5 border border-border/10 overflow-hidden mb-8 text-left">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-destructive/30" />
                <span className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground/40">Detalhes do Erro</span>
              </div>
              <pre className="text-[11px] text-muted-foreground/50 whitespace-pre-wrap break-all max-h-[150px] overflow-y-auto custom-scrollbar">
                {this.state.error?.message || "Erro desconhecido"}
              </pre>
            </div>

            <button
              onClick={() => window.location.reload()}
              className={cn(
                "flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all",
                "bg-foreground text-background font-medium text-[13px]",
                "hover:bg-foreground/90 active:scale-95"
              )}
            >
              <RotateCcw size={14} />
              Recarregar Página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
