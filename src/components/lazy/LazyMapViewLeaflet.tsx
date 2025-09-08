import { lazy, Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

// Lazy load del componente del mapa
const MapViewLeaflet = lazy(() => import('@/components/MapViewLeaflet'));

interface LazyMapViewLeafletProps {
  center: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  className?: string;
  placingMode?: boolean;
  onSpotCreated?: (spot: any) => void;
  isDemoMode?: boolean;
  demoMarkers?: any[];
  gatedAction?: (action: string, context?: any) => boolean;
}

// Componente de loading para el mapa
const MapLoadingSkeleton = () => (
  <Card className="shadow-medium">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <div className="h-5 w-5 bg-gray-200 rounded animate-pulse" />
        <Skeleton className="h-6 w-32" />
      </CardTitle>
      <CardDescription>
        <Skeleton className="h-4 w-48" />
      </CardDescription>
    </CardHeader>
    <CardContent className="p-0 h-[72vh] relative">
      <div className="absolute inset-0 flex items-center justify-center bg-gray-50">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto bg-gray-200 rounded-full animate-pulse" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32 mx-auto" />
            <Skeleton className="h-3 w-24 mx-auto" />
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Error boundary para el mapa
const MapErrorFallback = ({ error, retry }: { error: Error; retry: () => void }) => (
  <Card className="shadow-medium">
    <CardHeader>
      <CardTitle className="flex items-center gap-2">
        <div className="h-5 w-5 text-red-500" />
        Error cargando mapa
      </CardTitle>
      <CardDescription>
        No se pudo cargar el mapa interactivo
      </CardDescription>
    </CardHeader>
    <CardContent className="p-6 h-[72vh] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-red-500 text-4xl">🗺️</div>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Error: {error.message}</p>
          <button 
            onClick={retry}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default function LazyMapViewLeaflet(props: LazyMapViewLeafletProps) {
  return (
    <Suspense fallback={<MapLoadingSkeleton />}>
      <MapViewLeaflet {...props} />
    </Suspense>
  );
}

// Exportar también el error boundary para uso externo
export { MapErrorFallback };
