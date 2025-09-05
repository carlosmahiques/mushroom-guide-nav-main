import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AppSidebar } from "./AppSidebar";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle body scroll lock when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Handle escape key to close mobile menu
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Fixed Header */}
      <header className="fixed inset-x-0 top-0 h-16 bg-white/80 backdrop-blur-sm border-b border-border z-40">
        <div className="h-full flex items-center justify-between px-4 md:px-6">
          {/* Mobile hamburger button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleMobileMenu}
            className="md:hidden p-2"
            aria-controls="mobile-sidebar"
            aria-expanded={isMobileMenuOpen}
            aria-label={isMobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
          >
            {isMobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>

          {/* Logo and title */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">S</span>
            </div>
            <div className="hidden sm:block">
              <h1 className="font-bold text-foreground">Sétales & Lluvia</h1>
              <p className="text-xs text-muted-foreground">Predice, planifica y disfruta</p>
            </div>
          </div>

          {/* Spacer for mobile */}
          <div className="w-10 md:hidden"></div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="pt-16 flex w-full min-h-[calc(100dvh-4rem)]">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-col md:w-[280px] lg:w-[300px] md:shrink-0 md:sticky md:top-16 md:h-[calc(100dvh-4rem)] border-r border-border bg-white z-30">
          <AppSidebar />
        </aside>

        {/* Mobile Drawer Overlay */}
        {isMobileMenuOpen && (
          <div 
            className="fixed inset-0 z-50 md:hidden"
            onClick={toggleMobileMenu}
            aria-hidden="true"
          >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50" />
            
            {/* Drawer Panel */}
            <div 
              className="absolute left-0 top-0 h-full w-[85vw] max-w-[320px] bg-white shadow-strong"
              onClick={(e) => e.stopPropagation()}
              id="mobile-sidebar"
              role="dialog"
              aria-modal="true"
              aria-label="Menú de navegación"
            >
              <AppSidebar onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Content Area */}
        <main className="flex-1 min-w-0 overflow-auto bg-slate-50">
          <div className="max-w-[1400px] mx-auto px-4 md:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}