import { Settings, User, Bell, MapPin, Palette, Shield } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const Ajustes = () => {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Settings className="h-8 w-8 text-primary" />
          Ajustes
        </h1>
        <p className="text-muted-foreground mt-1">
          Personaliza la app según tus preferencias
        </p>
      </div>

      {/* Settings sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Perfil de usuario
            </CardTitle>
            <CardDescription>
              Gestiona tu información personal y preferencias de cuenta
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Nombre completo</label>
              <p className="text-muted-foreground">María González</p>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <p className="text-muted-foreground">maria@example.com</p>
            </div>
            <Button variant="outline" size="sm">
              Editar perfil
            </Button>
          </CardContent>
        </Card>

        {/* Notification settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-accent" />
              Notificaciones
            </CardTitle>
            <CardDescription>
              Controla qué tipo de alertas quieres recibir
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Alertas de lluvia</p>
                <p className="text-sm text-muted-foreground">Notificaciones meteorológicas</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Condiciones óptimas</p>
                <p className="text-sm text-muted-foreground">Cuando las condiciones sean ideales</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Recordatorios semanales</p>
                <p className="text-sm text-muted-foreground">Resumen de actividad</p>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>

        {/* Map preferences */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Preferencias de mapa
            </CardTitle>
            <CardDescription>
              Configura cómo se muestran los sétales en el mapa
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Mostrar coordenadas</p>
                <p className="text-sm text-muted-foreground">Visualizar coordenadas GPS</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Agrupación automática</p>
                <p className="text-sm text-muted-foreground">Agrupar sétales cercanos</p>
              </div>
              <Switch defaultChecked />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Unidades de distancia</label>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Kilómetros (km)
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appearance */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5 text-accent" />
              Apariencia
            </CardTitle>
            <CardDescription>
              Personaliza el aspecto visual de la aplicación
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tema</label>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Tema claro
              </Button>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Idioma</label>
              <Button variant="outline" size="sm" className="w-full justify-start">
                Español
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Animaciones</p>
                <p className="text-sm text-muted-foreground">Efectos visuales suaves</p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privacy section */}
      <Card className="shadow-medium">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Privacidad y datos
          </CardTitle>
          <CardDescription>
            Controla cómo se manejan tus datos personales
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Compartir datos de ubicación</p>
              <p className="text-sm text-muted-foreground">Para mejorar las predicciones</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Análisis de uso</p>
              <p className="text-sm text-muted-foreground">Ayuda a mejorar la app</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <Separator />
          
          <div className="space-y-2">
            <Button variant="outline" size="sm" className="w-full">
              Exportar mis datos
            </Button>
            <Button variant="destructive" size="sm" className="w-full">
              Eliminar cuenta
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Ajustes;