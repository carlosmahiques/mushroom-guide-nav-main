import { Map, MapPin, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import MapViewLeaflet from "@/components/MapViewLeaflet";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { useState } from "react";
import { useMapData } from "@/hooks/useMapData";


const Mapa = () => {
  const [placing, setPlacing] = useState(false);
  const { totalSpots, exploredZones, createdThisMonth } = useMapData();
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
        <Button className="bg-gradient-primary hover:bg-primary-hover shadow-medium" onClick={() => setPlacing(p => !p)} aria-pressed={placing} aria-label="Nuevo sétal">
          <Plus className="w-4 h-4 mr-2" />
          {placing ? 'Haz clic en el mapa' : 'Nuevo sétal'}
        </Button>
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
    </div>
  );
};

export default Mapa;