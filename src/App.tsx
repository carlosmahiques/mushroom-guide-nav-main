import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import { ProtectedRoute } from "./components/ProtectedRoute";
import { AppShell } from "./components/AppShell";
import Index from "./pages/Index";
import Mapa from "./pages/Mapa";
import MapaInteligente from "./pages/MapaInteligente";
import Setales from "./pages/Setales";
import Datos from "./pages/Datos";
import Alertas from "./pages/Alertas";
import Ajustes from "./pages/Ajustes";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";
import SeedAdmin from "./pages/SeedAdmin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<Auth />} />
            {import.meta.env.DEV && (
              <Route path="/seed-admin" element={<SeedAdmin />} />
            )}
            <Route path="/" element={
              <ProtectedRoute>
                <AppShell>
                  <Index />
                </AppShell>
              </ProtectedRoute>
            } />
            <Route path="/mapa" element={
              <ProtectedRoute>
                <AppShell>
                  <Mapa />
                </AppShell>
              </ProtectedRoute>
            } />
            <Route path="/mapa-inteligente" element={
              <ProtectedRoute>
                <AppShell>
                  <MapaInteligente />
                </AppShell>
              </ProtectedRoute>
            } />
            <Route path="/setales" element={
              <ProtectedRoute>
                <AppShell>
                  <Setales />
                </AppShell>
              </ProtectedRoute>
            } />
            <Route path="/datos" element={
              <ProtectedRoute>
                <AppShell>
                  <Datos />
                </AppShell>
              </ProtectedRoute>
            } />
            <Route path="/alertas" element={
              <ProtectedRoute>
                <AppShell>
                  <Alertas />
                </AppShell>
              </ProtectedRoute>
            } />
            <Route path="/ajustes" element={
              <ProtectedRoute>
                <AppShell>
                  <Ajustes />
                </AppShell>
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
