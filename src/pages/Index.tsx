import { Map, Pin, CloudRain, Bell, TrendingUp, Users } from "lucide-react";
import { NavLink } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const quickActions = [
    { 
      title: "Ver mapa", 
      description: "Explora tus sétales", 
      icon: Map, 
      href: "/mapa",
      gradient: "bg-gradient-primary"
    },
    { 
      title: "Mis localizaciones", 
      description: "Gestiona sétales guardados", 
      icon: Pin, 
      href: "/setales",
      gradient: "bg-gradient-nature"
    },
    { 
      title: "Pronóstico", 
      description: "Consulta el tiempo", 
      icon: CloudRain, 
      href: "/datos",
      gradient: "bg-gradient-rain"
    },
    { 
      title: "Alertas", 
      description: "Configura notificaciones", 
      icon: Bell, 
      href: "/alertas",
      gradient: "bg-accent"
    }
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Hero Section */}
      <div className="text-center space-y-6 py-12">
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-primary rounded-2xl shadow-medium flex items-center justify-center">
            <Map className="w-12 h-12 text-white" />
          </div>
        </div>
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Bienvenido a Sétales & Lluvia
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Tu compañero perfecto para la búsqueda de setas. Predice, planifica y disfruta 
            de tus salidas al campo con datos meteorológicos precisos.
          </p>
        </div>
        
        <div className="flex flex-wrap gap-4 justify-center">
          <Button asChild size="lg" className="bg-gradient-primary hover:bg-primary-hover shadow-medium">
            <NavLink to="/mapa">
              <Map className="w-5 h-5 mr-2" />
              Explorar mapa
            </NavLink>
          </Button>
          <Button asChild variant="outline" size="lg" className="shadow-soft">
            <NavLink to="/datos">
              <CloudRain className="w-5 h-5 mr-2" />
              Ver pronóstico
            </NavLink>
          </Button>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Accesos rápidos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action) => (
            <Card key={action.href} className="shadow-soft hover:shadow-medium transition-smooth cursor-pointer group">
              <NavLink to={action.href} className="block">
                <CardContent className="p-6">
                  <div className={`w-12 h-12 rounded-lg ${action.gradient} flex items-center justify-center mb-4 group-hover:scale-110 transition-smooth`}>
                    <action.icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{action.title}</h3>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </CardContent>
              </NavLink>
            </Card>
          ))}
        </div>
      </div>

      {/* Stats Overview */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-6">Resumen de actividad</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Pin className="h-5 w-5 text-primary" />
                Sétales guardados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-primary">12</span>
                <span className="text-sm text-muted-foreground mb-1">localizaciones</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-accent" />
                Este mes
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-accent">3</span>
                <span className="text-sm text-muted-foreground mb-1">nuevos sétales</span>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-soft">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <CloudRain className="h-5 w-5 text-accent" />
                Condiciones
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-2">
                <span className="text-3xl font-bold text-accent">75%</span>
                <span className="text-sm text-muted-foreground mb-1">prob. lluvia</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;
