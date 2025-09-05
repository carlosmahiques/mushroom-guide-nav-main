import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Header con botón hamburguesa para móviles */}
          <header className="h-16 flex items-center justify-between px-6 border-b border-border bg-card/50 backdrop-blur-sm md:justify-start">
            <SidebarTrigger className="md:hidden">
              <Button variant="ghost" size="sm" className="p-2">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle sidebar</span>
              </Button>
            </SidebarTrigger>
            
            <div className="hidden md:block">
              <SidebarTrigger>
                <Button variant="ghost" size="sm" className="p-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle sidebar</span>
                </Button>
              </SidebarTrigger>
            </div>
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