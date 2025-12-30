import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Agendamentos from "./pages/Agendamentos";
import Pacientes from "./pages/Pacientes";
import Calendario from "./pages/Calendario";
import Configuracoes from "./pages/Configuracoes";
import NotFound from "./pages/NotFound";
import Doutores from "./pages/Doutores";
import Suporte from "./pages/Suporte";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/agendamentos" element={<Agendamentos />} />
            <Route path="/pacientes" element={<Pacientes />} />
            <Route path="/doutores" element={<Doutores />} />
            <Route path="/calendario" element={<Calendario />} />
            <Route path="/suporte" element={<Suporte />} />
            <Route path="/configuracoes" element={<Configuracoes />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
