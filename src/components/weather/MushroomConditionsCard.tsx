import { Leaf, TrendingUp, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MushroomConditions } from "@/hooks/useWeatherData";

interface MushroomConditionsCardProps {
  conditions: MushroomConditions;
}

export function MushroomConditionsCard({ conditions }: MushroomConditionsCardProps) {
  const getConditionColor = (condition: string) => {
    switch (condition) {
      case 'optimal':
      case 'excellent':
        return 'bg-primary text-primary-foreground';
      case 'good':
        return 'bg-accent text-accent-foreground';
      case 'fair':
        return 'bg-secondary text-secondary-foreground';
      default:
        return 'bg-destructive text-destructive-foreground';
    }
  };

  const getOverallIcon = () => {
    switch (conditions.overall) {
      case 'excellent':
        return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'good':
        return <TrendingUp className="h-5 w-5 text-accent" />;
      case 'fair':
        return <AlertTriangle className="h-5 w-5 text-secondary-foreground" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-destructive" />;
    }
  };

  const getOverallMessage = () => {
    switch (conditions.overall) {
      case 'excellent':
        return 'Condiciones excelentes para la recolección de setas';
      case 'good':
        return 'Buenas condiciones para buscar setas';
      case 'fair':
        return 'Condiciones regulares, algunas especies pueden aparecer';
      default:
        return 'Condiciones no favorables para setas';
    }
  };

  return (
    <Card className="shadow-medium border-0 bg-gradient-nature">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-3">
          <Leaf className="h-6 w-6 text-primary" />
          <span>Condiciones para Setas</span>
          <div className="ml-auto flex items-center gap-2">
            {getOverallIcon()}
            <Badge className={getConditionColor(conditions.overall)}>
              {conditions.score}% favorable
            </Badge>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          {getOverallMessage()}
        </p>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Temperatura</span>
              <Badge variant="outline" className={getConditionColor(conditions.temperature)}>
                {conditions.temperature === 'optimal' ? 'Óptima' : 
                 conditions.temperature === 'good' ? 'Buena' : 'Mejorable'}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Ideal: 15-25°C
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Humedad</span>
              <Badge variant="outline" className={getConditionColor(conditions.humidity)}>
                {conditions.humidity === 'optimal' ? 'Óptima' : 
                 conditions.humidity === 'good' ? 'Buena' : 'Mejorable'}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">
              Ideal: 80-95%
            </div>
          </div>
        </div>

        <div className="mt-4 p-3 bg-card rounded-lg border">
          <h4 className="font-medium text-sm mb-2">Consejos actuales:</h4>
          <ul className="text-xs text-muted-foreground space-y-1">
            {conditions.overall === 'excellent' && (
              <>
                <li>• Excelente momento para salir al campo</li>
                <li>• Busca en zonas húmedas bajo robles y castaños</li>
                <li>• Las condiciones son ideales para la mayoría de especies</li>
              </>
            )}
            {conditions.overall === 'good' && (
              <>
                <li>• Buenas posibilidades de encontrar setas</li>
                <li>• Concentra la búsqueda en zonas más protegidas</li>
                <li>• Revisa bajo hojarasca húmeda</li>
              </>
            )}
            {conditions.overall === 'fair' && (
              <>
                <li>• Pueden aparecer algunas especies resistentes</li>
                <li>• Busca en microclimas más favorables</li>
                <li>• Enfócate en zonas con más sombra y humedad</li>
              </>
            )}
            {conditions.overall === 'poor' && (
              <>
                <li>• Espera a mejores condiciones meteorológicas</li>
                <li>• Es mejor planificar la salida para otro día</li>
                <li>• Revisa la previsión para los próximos días</li>
              </>
            )}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}