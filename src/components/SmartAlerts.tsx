import { useState, useEffect } from 'react';
import { useSmartSetales } from '@/hooks/useSmartSetales';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { 
  Bell, 
  TrendingUp, 
  Clock, 
  MapPin, 
  Thermometer, 
  Droplets, 
  Wind,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  XCircle
} from 'lucide-react';
import { toast } from 'sonner';

export default function SmartAlerts() {
  const { smartSetales, stats, recommendedSetales, refreshAnalysis, analyzing } = useSmartSetales();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  // Generar alertas inteligentes
  const generateAlerts = () => {
    const newAlerts: any[] = [];

    // Alerta de setales con alta probabilidad
    if (stats.highProbability > 0) {
      newAlerts.push({
        id: 'high-probability',
        type: 'success',
        priority: 'high',
        title: '¡Setales con Alta Probabilidad!',
        message: `${stats.highProbability} setal${stats.highProbability > 1 ? 'es' : ''} con probabilidad >80%`,
        icon: <TrendingUp className="h-4 w-4" />,
        action: 'Ver recomendaciones',
        setales: recommendedSetales.slice(0, 3)
      });
    }

    // Alerta de condiciones favorables
    const favorableConditions = smartSetales.filter(s => 
      s.analysis?.conditions.temperature >= 8 && 
      s.analysis?.conditions.temperature <= 20 &&
      s.analysis?.conditions.humidity >= 65 &&
      s.analysis?.conditions.rain3d >= 10
    );

    if (favorableConditions.length > 0 && stats.highProbability === 0) {
      newAlerts.push({
        id: 'favorable-conditions',
        type: 'info',
        priority: 'medium',
        title: 'Condiciones Favorables',
        message: `${favorableConditions.length} setal${favorableConditions.length > 1 ? 'es' : ''} con condiciones meteorológicas favorables`,
        icon: <Thermometer className="h-4 w-4" />,
        action: 'Monitorear próximos días'
      });
    }

    // Alerta de temporada
    const currentMonth = new Date().getMonth() + 1;
    const seasonalSetales = smartSetales.filter(s => {
      const species = s.species;
      // Verificar si estamos en temporada para esta especie
      return true; // Simplificado por ahora
    });

    if (seasonalSetales.length > 0) {
      newAlerts.push({
        id: 'seasonal',
        type: 'info',
        priority: 'low',
        title: 'Temporada Activa',
        message: `Estamos en temporada para ${seasonalSetales.length} setal${seasonalSetales.length > 1 ? 'es' : ''}`,
        icon: <Calendar className="h-4 w-4" />,
        action: 'Revisar análisis'
      });
    }

    // Alerta de setales sin análisis reciente
    const staleSetales = smartSetales.filter(s => {
      if (!s.analysis?.lastUpdated) return true;
      const lastUpdate = new Date(s.analysis.lastUpdated);
      const hoursSinceUpdate = (Date.now() - lastUpdate.getTime()) / (1000 * 60 * 60);
      return hoursSinceUpdate > 24;
    });

    if (staleSetales.length > 0) {
      newAlerts.push({
        id: 'stale-analysis',
        type: 'warning',
        priority: 'medium',
        title: 'Análisis Desactualizado',
        message: `${staleSetales.length} setal${staleSetales.length > 1 ? 'es' : ''} necesitan análisis actualizado`,
        icon: <Clock className="h-4 w-4" />,
        action: 'Actualizar análisis'
      });
    }

    setAlerts(newAlerts);
    setLastCheck(new Date());
  };

  // Generar alertas cuando cambien los datos
  useEffect(() => {
    if (smartSetales.length > 0) {
      generateAlerts();
    }
  }, [smartSetales, stats]);

  // Mostrar notificación toast para alertas de alta prioridad
  useEffect(() => {
    const highPriorityAlerts = alerts.filter(a => a.priority === 'high');
    if (highPriorityAlerts.length > 0) {
      highPriorityAlerts.forEach(alert => {
        toast.success(alert.title, {
          description: alert.message,
          duration: 5000,
        });
      });
    }
  }, [alerts]);

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'warning': return <AlertCircle className="h-4 w-4 text-yellow-600" />;
      case 'error': return <XCircle className="h-4 w-4 text-red-600" />;
      default: return <Bell className="h-4 w-4 text-blue-600" />;
    }
  };

  const getAlertColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-blue-200 bg-blue-50';
    }
  };

  const handleAlertAction = (alert: any) => {
    switch (alert.id) {
      case 'high-probability':
        // Scroll to recommendations or highlight on map
        toast.info('Revisa los setales recomendados en el mapa');
        break;
      case 'favorable-conditions':
        toast.info('Monitorea estos setales en los próximos días');
        break;
      case 'seasonal':
        toast.info('Revisa el análisis detallado de cada setal');
        break;
      case 'stale-analysis':
        refreshAnalysis();
        toast.success('Actualizando análisis de setales...');
        break;
    }
  };

  if (smartSetales.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas Inteligentes
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Sin setales registrados</AlertTitle>
            <AlertDescription>
              Crea tu primer setal para recibir alertas inteligentes sobre las mejores condiciones para buscar setas.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Alertas Inteligentes
          </CardTitle>
          <div className="flex items-center gap-2">
            {lastCheck && (
              <span className="text-xs text-gray-500">
                Última verificación: {lastCheck.toLocaleTimeString()}
              </span>
            )}
            <Button
              size="sm"
              variant="outline"
              onClick={refreshAnalysis}
              disabled={analyzing}
            >
              {analyzing ? 'Analizando...' : 'Actualizar'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertTitle>Todo en orden</AlertTitle>
            <AlertDescription>
              No hay alertas activas. Tus setales están siendo monitoreados continuamente.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-3">
            {alerts.map((alert) => (
              <Alert key={alert.id} className={getAlertColor(alert.type)}>
                <div className="flex items-start gap-3">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <AlertTitle className="flex items-center gap-2">
                      {alert.title}
                      <Badge variant="outline" className="text-xs">
                        {alert.priority === 'high' ? 'Alta' : 
                         alert.priority === 'medium' ? 'Media' : 'Baja'}
                      </Badge>
                    </AlertTitle>
                    <AlertDescription className="mt-1">
                      {alert.message}
                    </AlertDescription>
                    
                    {/* Mostrar setales específicos si los hay */}
                    {alert.setales && alert.setales.length > 0 && (
                      <div className="mt-3 space-y-2">
                        {alert.setales.map((setal: any) => (
                          <div key={setal.id} className="flex items-center gap-2 p-2 bg-white/50 rounded border">
                            <MapPin className="h-3 w-3" />
                            <span className="text-sm font-medium">{setal.title}</span>
                            <Badge variant="secondary" className="text-xs">
                              {setal.analysis?.probability}%
                            </Badge>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Thermometer className="h-3 w-3" />
                              {setal.analysis?.conditions.temperature}°C
                            </div>
                            <div className="flex items-center gap-1 text-xs text-gray-600">
                              <Droplets className="h-3 w-3" />
                              {setal.analysis?.conditions.humidity}%
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <Button
                      size="sm"
                      variant="outline"
                      className="mt-2"
                      onClick={() => handleAlertAction(alert)}
                    >
                      {alert.action}
                    </Button>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
        
        {/* Resumen de estadísticas */}
        <div className="mt-6 pt-4 border-t">
          <h4 className="font-medium mb-3">Resumen de Setales</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Target className="h-4 w-4 text-blue-600" />
              <span>Total: {stats.total}</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-green-600" />
              <span>Alta prob: {stats.highProbability}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span>Media prob: {stats.mediumProbability}</span>
            </div>
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <span>Esperar: {stats.wait}</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
