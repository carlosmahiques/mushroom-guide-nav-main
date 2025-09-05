import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/useAuth";
import { NavLink } from "react-router-dom";
import {
  Map,
  Pin,
  CloudRain,
  Bell,
  Settings,
  Mail,
  Shield,
  LogOut,
} from "lucide-react";

interface AppSidebarProps {
  onNavigate?: () => void;
}

// Navigation items definitions
const mainNavItems = [
  {
    title: "Mapa interactivo",
    url: "/mapa",
    icon: Map,
    description: "Explora y añade tus sétales"
  },
  {
    title: "Mis sétales", 
    url: "/setales",
    icon: Pin,
    description: "Gestiona tus localizaciones"
  },
  {
    title: "Pronóstico y datos",
    url: "/datos", 
    icon: CloudRain,
    description: "Consulta previsiones y lluvia acumulada"
  },
  {
    title: "Alertas",
    url: "/alertas",
    icon: Bell,
    description: "Configura notificaciones personalizadas"
  },
  {
    title: "Ajustes", 
    url: "/ajustes",
    icon: Settings,
    description: "Personaliza la app a tu gusto"
  }
];

const secondaryNavItems = [
  {
    title: "Soporte",
    url: "/soporte",
    icon: Mail,
    description: "¿Necesitas ayuda? Estamos aquí."
  },
  {
    title: "Política de privacidad",
    url: "/privacidad", 
    icon: Shield,
    description: "Tus datos, siempre seguros."
  }
];

export function AppSidebar({ onNavigate }: AppSidebarProps) {
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleNavigation = () => {
    onNavigate?.();
  };

  const displayName = user?.email?.split('@')[0] || 'Usuario';

  return (
    <div className="flex flex-col h-full">
      {/* Header with logo and user info */}
      <div className="border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold">S</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold text-foreground truncate">Sétales & Lluvia</h2>
            <p className="text-xs text-muted-foreground truncate">Predice, planifica y disfruta</p>
          </div>
        </div>
        
        {user && (
          <div className="px-4 pb-3">
            <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                  {user.email?.charAt(0)?.toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  Hola, {displayName} 👋
                </p>
                <p className="text-xs text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Content */}
      <div className="flex-1 overflow-y-auto py-4">
        <div>
          <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Navegación principal
          </p>
          <nav className="px-2 space-y-1">
            {mainNavItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                onClick={handleNavigation}
                className={({ isActive }) => (
                  isActive
                    ? "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 bg-primary/10 text-primary font-medium border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    : "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 text-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                )}
                end
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="truncate">{item.title}</span>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="px-4 my-4">
          <Separator className="bg-border" />
        </div>

        <div>
          <p className="px-4 py-2 text-xs font-medium text-muted-foreground uppercase tracking-wide">
            Soporte
          </p>
          <nav className="px-2 space-y-1">
            {secondaryNavItems.map((item) => (
              <NavLink
                key={item.title}
                to={item.url}
                onClick={handleNavigation}
                className={({ isActive }) => (
                  isActive
                    ? "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 bg-primary/10 text-primary font-medium border border-primary/20 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                    : "flex items-center gap-3 px-3 py-2 text-sm rounded-lg transition-all duration-200 text-foreground hover:bg-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-1"
                )}
                end
              >
                <item.icon className="h-5 w-5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <span className="truncate">{item.title}</span>
                  <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                </div>
              </NavLink>
            ))}
          </nav>
        </div>
      </div>

      {/* Footer with logout */}
      <div className="border-t border-border p-4">
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="w-full justify-start gap-3 text-foreground hover:bg-muted hover:text-foreground"
        >
          <LogOut className="h-5 w-5" />
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
}