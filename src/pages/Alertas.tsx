import { Bell, CloudRain, MapPin, Settings as SettingsIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

const Alertas = () => {
  const mockAlertas = [
    {
      id: 1,
      type: "lluvia",
      location: "Robledal de Soria",
      condition: "Lluvia prevista >10mm",
      active: true,
      lastTriggered: "Hace 2 días"
    },
    {
      id: 2,
      type: "condiciones",
      location: "Todas las localizaciones",
      condition: "Condiciones óptimas para setas",
      active: true,
      lastTriggered: "Nunca"
    },
    {
      id: 3,
      type: "temporada",
      location: "Pinar de Guadalajara",
      condition: "Temporada de níscalos",
      active: false,
      lastTriggered: "Hace 1 semana"
    }
  ];

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "lluvia":
        return <CloudRain className="h-4 w-4" />;
      case "condiciones":
        return <SettingsIcon className="h-4 w-4" />;
      case "temporada":
        return <MapPin className="h-4 w-4" />;
      default:
        return <Bell className="h-4 w-4" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case "lluvia":
        return "bg-accent-light text-accent";
      case "condiciones":
        return "bg-primary-light text-primary";
      case "temporada":
        return "bg-secondary text-secondary-foreground";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Bell className="h-8 w-8 text-accent" />
            Alertas
          </h1>
          <p className="text-muted-foreground mt-1">
            Configura notificaciones personalizadas para tus sétales
          </p>
        </div>
        <Button className="bg-gradient-primary hover:bg-primary-hover shadow-medium">
          <Bell className="w-4 h-4 mr-2" />
          Nueva alerta
        </Button>
      </div>

      {/* Active alerts summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent-light rounded-lg">
                <Bell className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {mockAlertas.filter(a => a.active).length}
                </p>
                <p className="text-sm text-muted-foreground">Alertas activas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-light rounded-lg">
                <CloudRain className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">2</p>
                <p className="text-sm text-muted-foreground">Disparadas hoy</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary rounded-lg">
                <MapPin className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">3</p>
                <p className="text-sm text-muted-foreground">Localizaciones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts list */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-foreground">Mis alertas configuradas</h2>
        
        {mockAlertas.map((alerta) => (
          <Card key={alerta.id} className="shadow-soft">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge className={getAlertColor(alerta.type)}>
                    {getAlertIcon(alerta.type)}
                    <span className="ml-1 capitalize">{alerta.type}</span>
                  </Badge>
                  <div>
                    <CardTitle className="text-lg">{alerta.condition}</CardTitle>
                    <CardDescription>
                      <MapPin className="h-3 w-3 inline mr-1" />
                      {alerta.location}
                    </CardDescription>
                  </div>
                </div>
                <Switch checked={alerta.active} />
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="flex justify-between items-center text-sm text-muted-foreground">
                <span>Última activación: {alerta.lastTriggered}</span>
                <Button variant="ghost" size="sm">
                  Editar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Help card */}
      <Card className="shadow-soft bg-gradient-nature">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Bell className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-medium text-foreground mb-2">¿Cómo funcionan las alertas?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Configura alertas personalizadas para recibir notificaciones cuando se den las condiciones 
                ideales para la búsqueda de setas en tus localizaciones favoritas. Puedes activar 
                alertas por lluvia, temperatura, humedad o temporadas específicas de especies.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Alertas;