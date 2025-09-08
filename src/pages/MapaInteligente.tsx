import { Map, MapPin, Plus, Brain, TrendingUp, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import SmartSetalesMap from "@/components/SmartSetalesMap";
import SmartAlerts from "@/components/SmartAlerts";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DemoTour } from "@/components/tour/DemoTour";
import { RegisterModal } from "@/components/ui/RegisterModal";
import { useState, useEffect } from "react";
import { useSmartSetales } from "@/hooks/useSmartSetales";
import { useGatedAction } from "@/hooks/useGatedAction";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useAuth } from "@/hooks/useAuth";

const MapaInteligente = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { user } = useAuth();
  const { 
    smartSetales,
    loading,
    analyzing,
    stats,
    recommendedSetales,
    refreshAnalysis
  } = useSmartSetales();
  
  const { executeGatedAction } = useGatedAction();
  const { logEvent } = useAnalytics();
  const { isDemoModeEnabled } = useDemoMode();

  // Coordenadas centradas en España
  const center = { lat: 40.4168, lng: -3.7038 };
  const zoom = 6;

  const handleNewSetal = () => {
    executeGatedAction(() => {
      setShowRegisterModal(true);
      logEvent('new_setal_clicked');
    });
  };

  const handleRegisterSuccess = () => {
    setShowRegisterModal(false);
    toast.success("¡Cuenta creada! Ahora puedes crear setales inteligentes.");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Brain className="h-8 w-8 text-green-600" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Setales Inteligentes</h1>
                <p className="text-sm text-gray-500">Análisis predictivo por setal</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {!isDemoModeEnabled && (
                <Button onClick={handleNewSetal} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Nuevo Setal
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Panel principal del mapa */}
          <div className="lg:col-span-3">
            <Card className="h-[600px]">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Map className="h-5 w-5" />
                      Mapa de Setales Inteligentes
                    </CardTitle>
                    <CardDescription>
                      Cada marcador muestra la probabilidad actual de fructificación
                    </CardDescription>
                  </div>
                  <div className="flex items-center gap-2">
                    {analyzing && (
                      <Badge variant="outline" className="animate-pulse">
                        Analizando...
                      </Badge>
                    )}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={refreshAnalysis}
                      disabled={analyzing}
                    >
                      Actualizar
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-0 h-[calc(100%-80px)]">
                <ErrorBoundary>
                  <SmartSetalesMap
                    center={center}
                    zoom={zoom}
                    sessionUserId={user?.id}
                  />
                </ErrorBoundary>
              </CardContent>
            </Card>
          </div>

          {/* Panel lateral con alertas y estadísticas */}
          <div className="space-y-6">
            {/* Estadísticas rápidas */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <TrendingUp className="h-5 w-5" />
                  Estadísticas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Total setales</span>
                  <Badge variant="secondary">{stats.total}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-green-600">🚀 Alta probabilidad</span>
                  <Badge variant="outline" className="text-green-600 border-green-200">
                    {stats.highProbability}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-yellow-600">👀 Media probabilidad</span>
                  <Badge variant="outline" className="text-yellow-600 border-yellow-200">
                    {stats.mediumProbability}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-orange-600">⏳ Esperar</span>
                  <Badge variant="outline" className="text-orange-600 border-orange-200">
                    {stats.wait}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-red-600">❌ No recomendado</span>
                  <Badge variant="outline" className="text-red-600 border-red-200">
                    {stats.notRecommended}
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Recomendaciones */}
            {recommendedSetales.length > 0 && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <Target className="h-5 w-5 text-green-600" />
                    Recomendados Ahora
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {recommendedSetales.slice(0, 3).map((setal) => (
                      <div key={setal.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{setal.title}</h4>
                          <Badge className="bg-green-600 text-white">
                            {setal.analysis?.probability}%
                          </Badge>
                        </div>
                        <p className="text-xs text-green-700 mb-2">
                          {setal.analysis?.recommendation.reason}
                        </p>
                        <div className="flex items-center gap-3 text-xs text-gray-600">
                          <span>🌡️ {setal.analysis?.conditions.temperature}°C</span>
                          <span>💧 {setal.analysis?.conditions.humidity}%</span>
                          <span>🌧️ {setal.analysis?.conditions.rain3d}mm</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alertas inteligentes */}
            <SmartAlerts />
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="h-5 w-5" />
                ¿Cómo funciona el análisis inteligente?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <MapPin className="h-6 w-6 text-blue-600" />
                  </div>
                  <h3 className="font-medium mb-2">Datos Meteorológicos</h3>
                  <p className="text-sm text-gray-600">
                    Obtenemos datos en tiempo real de AEMET para cada ubicación de setal
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Brain className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="font-medium mb-2">Algoritmos Específicos</h3>
                  <p className="text-sm text-gray-600">
                    Cada especie tiene su propio algoritmo basado en temperatura, humedad y lluvia
                  </p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-purple-600" />
                  </div>
                  <h3 className="font-medium mb-2">Recomendaciones</h3>
                  <p className="text-sm text-gray-600">
                    Te avisamos cuándo es el mejor momento para visitar cada setal
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Modales */}
      <RegisterModal
        open={showRegisterModal}
        onOpenChange={setShowRegisterModal}
        onSuccess={handleRegisterSuccess}
      />

      {/* Tour demo */}
      {isDemoModeEnabled && <DemoTour />}
    </div>
  );
};

export default MapaInteligente;
