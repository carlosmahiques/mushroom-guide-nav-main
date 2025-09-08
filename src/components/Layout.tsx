import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Menu, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NavLink } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header simplificado */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {/* Botón Home - siempre visible */}
              <NavLink 
                to="/" 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-primary/10 transition-colors"
                onClick={() => console.log('🏠 Home button clicked, navigating to /')}
              >
                <Home className="h-5 w-5 text-primary" />
                <span className="hidden sm:inline text-sm font-medium text-primary">Inicio</span>
              </NavLink>
            </div>
            
            {/* Botón hamburguesa - único para todos los tamaños */}
            <SidebarTrigger>
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SidebarTrigger>
          </header>

          {/* Contenido principal */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}