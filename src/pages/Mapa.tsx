import { Map, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MapViewLeaflet from "@/components/MapViewLeaflet";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { DemoTour } from "@/components/tour/DemoTour";
import { RegisterModal } from "@/components/ui/RegisterModal";
import { DebugInfo } from "@/components/DebugInfo";
import { AnalyticsDebugOverlay } from "@/components/debug/AnalyticsDebugOverlay";
import { TestControls } from "@/components/debug/TestControls";
import { useState, useEffect } from "react";
import { useMapData } from "@/hooks/useMapData";
import { useGatedAction } from "@/hooks/useGatedAction";
import { useAnalytics } from "@/hooks/useAnalytics";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useAnalyticsDebug } from "@/hooks/useAnalyticsDebug";
import { isFeatureEnabled } from "@/config/featureFlags";


const Mapa = () => {
  const [placing, setPlacing] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const { 
    markers,
    sessionUserId,
    addSpot,
    deleteSpot,
    totalSpots,
    exploredZones,
    createdThisMonth
  } = useMapData();
  
  // Debug: Log metrics in component
  console.log('🗺️ Mapa component metrics:', { totalSpots, exploredZones, createdThisMonth });
  
  // Feature flags
  const isLeanEnabled = isFeatureEnabled('ENABLE_LEAN');
  const isAnalyticsEnabled = isFeatureEnabled('ENABLE_ANALYTICS');
  const isGatingEnabled = isFeatureEnabled('ENABLE_GATING');
  const isDemoModeEnabled = isFeatureEnabled('ENABLE_DEMO_MODE');
  const isTourEnabled = isFeatureEnabled('ENABLE_TOUR');
  
  // Hooks condicionales
  const { gatedAction } = isGatingEnabled ? useGatedAction() : { gatedAction: () => true };
  const { logPageView, logEvent } = isAnalyticsEnabled ? useAnalytics() : { logPageView: () => {}, logEvent: () => {} };
  const { isDemoMode } = useDemoMode();
  
  // Debug overlay (solo en desarrollo)
  const { isVisible: isDebugVisible, hideOverlay: hideDebugOverlay } = useAnalyticsDebug();

  // Asegurar que el modal esté cerrado al inicio
  useEffect(() => {
    setShowRegisterModal(false);
  }, []);

  // Analytics: page_view y demo_view (solo si está habilitado)
  useEffect(() => {
    if (isAnalyticsEnabled) {
      logPageView('/mapa', 'free');
      
      if (isDemoMode && isDemoModeEnabled) {
        logEvent('demo_view', {
          load_time: Date.now(),
          setales_count: totalSpots,
          heatmap_loaded: true,
          tour_available: isTourEnabled,
        });
      }
    }
  }, [isAnalyticsEnabled, logPageView, logEvent, isDemoMode, isDemoModeEnabled, isTourEnabled, totalSpots]);
  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Map className="h-8 w-8 text-primary" />
            Mapa interactivo
          </h1>
          <p className="text-muted-foreground mt-1">
            Explora y añade tus sétales favoritos en el mapa
          </p>
        </div>
        <div className="flex gap-2">
          <Button 
            className="bg-gradient-primary hover:bg-primary-hover shadow-medium" 
                      onClick={() => {
            if (isLeanEnabled && isGatingEnabled) {
              console.log('🔍 Click en Nuevo sétal - CON GATING');
              if (gatedAction('create_setal')) {
                setPlacing(p => !p);
              } else {
                setShowRegisterModal(true);
              }
            } else {
              console.log('🔍 Click en Nuevo sétal - SIN GATING');
              setPlacing(p => !p);
            }
          }} 
            aria-pressed={placing} 
            aria-label="Nuevo sétal"
          >
            <Plus className="w-4 h-4 mr-2" />
            {placing ? 'Haz clic en el mapa' : 'Nuevo sétal'}
          </Button>
          
          {/* Botón de test eliminado */}
        </div>
      </div>

{/* Mapa interactivo con Leaflet */}
<Card className="shadow-medium">
  <CardHeader>
    <CardTitle className="flex items-center gap-2">
      <MapPin className="h-5 w-5 text-accent" />
      Mapa interactivo
    </CardTitle>
    <CardDescription>
      Haz click en el mapa para añadir nuevos sétales. Los marcadores se actualizan en tiempo real.
    </CardDescription>
  </CardHeader>
  <CardContent>
    <ErrorBoundary fallback={
      <div className="flex items-center justify-center h-96 bg-muted rounded-lg">
        <div className="text-center space-y-2">
          <Map className="h-12 w-12 text-muted-foreground mx-auto" />
          <p className="text-muted-foreground">Error cargando el mapa</p>
          <Button onClick={() => window.location.reload()} variant="outline" size="sm">
            Reintentar
          </Button>
        </div>
      </div>
    }>
      <MapViewLeaflet
        center={{ lat: 39.045, lng: -0.493 }}
        zoom={13}
        height="calc(100dvh - 24rem)"
        className="md:h-[calc(100dvh-20rem)]"
        placingMode={placing}
        markers={markers}
        sessionUserId={sessionUserId}
        addSpot={addSpot}
        deleteSpot={deleteSpot}
      />
    </ErrorBoundary>
  </CardContent>
</Card>


      {/* Stats cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary-light rounded-lg">
                <MapPin className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalSpots}</p>
                <p className="text-sm text-muted-foreground">Sétales guardados</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-accent-light rounded-lg">
                <Map className="h-6 w-6 text-accent" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{exploredZones}</p>
                <p className="text-sm text-muted-foreground">Zonas exploradas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-soft">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-secondary rounded-lg">
                <Plus className="h-6 w-6 text-secondary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{createdThisMonth}</p>
                <p className="text-sm text-muted-foreground">Este mes</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Tour de demo - solo si está habilitado */}
      {isLeanEnabled && isTourEnabled && <DemoTour />}
      
      {/* Register Modal - solo si está habilitado */}
      {isLeanEnabled && (
        <RegisterModal 
          isOpen={showRegisterModal}
          onClose={() => {
            console.log('🔍 Cerrando modal');
            setShowRegisterModal(false);
          }}
          trigger="create_setal"
        />
      )}
      
      {/* Debug Info oculto */}
      
      {/* Analytics Debug Overlay - solo en desarrollo */}
      {/* {import.meta.env.DEV && (
        <AnalyticsDebugOverlay 
          isVisible={isDebugVisible}
          onClose={hideDebugOverlay}
        />
      )} */}
      
      {/* Test Controls - solo en desarrollo */}
      {/* {import.meta.env.DEV && <TestControls />} */}
    </div>
  );
};

export default Mapa;