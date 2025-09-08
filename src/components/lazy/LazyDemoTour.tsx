import { lazy, Suspense } from 'react';
import { isFeatureEnabled } from '@/config/featureFlags';

// Lazy load del componente del tour
const DemoTour = lazy(() => import('@/components/tour/DemoTour'));

// Componente de loading para el tour (muy ligero)
const TourLoadingSkeleton = () => {
  // El tour no necesita skeleton visible ya que se carga muy rápido
  return null;
};

export default function LazyDemoTour() {
  // Solo cargar si el tour está habilitado
  const isTourEnabled = isFeatureEnabled('ENABLE_TOUR');
  
  if (!isTourEnabled) {
    return null;
  }

  return (
    <Suspense fallback={<TourLoadingSkeleton />}>
      <DemoTour />
    </Suspense>
  );
}
