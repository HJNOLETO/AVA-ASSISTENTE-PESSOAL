import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import MemoryViewer from "@/pages/MemoryViewer";
import Auth from "@/pages/Auth";
import ResetPassword from "@/pages/ResetPassword";
import Admin from "@/pages/Admin";
import ControlPanel from "@/pages/ControlPanel";
import Legal from "@/pages/Legal";
import DocumentsPage from "@/pages/DocumentsPage";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";

function Router() {
  return (
    <Switch>
      {/* Página Inicial / Dashboard */}
      <Route path="/" component={Home} />
      
      {/* Rota dinâmica para chats específicos */}
      <Route path="/chat/:id" component={Home} />
      
      {/* AVA Memory System V3.1: Memory viewer route */}
      <Route path="/memory" component={MemoryViewer} />

      {/* Módulo Jurídico */}
      <Route path="/juridico" component={Legal} />

      {/* Biblioteca de Documentos */}
      <Route path="/documents" component={DocumentsPage} />

      {/* Painel de Controle */}
      <Route path="/configuracoes" component={ControlPanel} />
      
      {/* Auth and Admin routes */}
      <Route path="/auth" component={Auth} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/admin" component={Admin} />
      
      {/* Página 404 */}
      <Route path="/404" component={NotFound} />
      
      {/* Fallback para 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

import ReminderWatcher from "./components/ReminderWatcher";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light" switchable>
        <TooltipProvider>
          <Toaster position="top-right" />
          <ReminderWatcher />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
