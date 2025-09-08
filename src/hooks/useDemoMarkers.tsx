import { useMemo } from 'react';
import { isFeatureEnabled } from '@/config/featureFlags';

interface DemoMarker {
  id: string;
  name: string;
  description: string;
  lat: number;
  lng: number;
  type: 'boletus' | 'amanita' | 'lactarius' | 'russula';
}

export const useDemoMarkers = (): DemoMarker[] => {
  const isDemoModeEnabled = isFeatureEnabled('ENABLE_DEMO_MODE');

  const demoMarkers = useMemo(() => {
    if (!isDemoModeEnabled) return [];

    // Marcadores demo con coordenadas difusas (±0.01 grados)
    return [
      {
        id: 'demo-1',
        name: 'Boletus en Sierra de Guadarrama',
        description: 'Zona rica en boletus edulis. Condiciones ideales: humedad alta, temperatura suave.',
        lat: 40.7168, // Coordenada difusa
        lng: -3.9038, // Coordenada difusa
        type: 'boletus',
      },
      {
        id: 'demo-2',
        name: 'Amanitas en Robledal de Soria',
        description: 'Amanita muscaria en bosque de robles. Cuidado con la toxicidad.',
        lat: 41.7654, // Coordenada difusa
        lng: -2.4567, // Coordenada difusa
        type: 'amanita',
      },
      {
        id: 'demo-3',
        name: 'Lactarius en Pinares de Segovia',
        description: 'Lactarius deliciosus en pinares. Excelente para cocinar.',
        lat: 40.9456, // Coordenada difusa
        lng: -4.1234, // Coordenada difusa
        type: 'lactarius',
      },
      {
        id: 'demo-4',
        name: 'Russulas en Hayedo de Montejo',
        description: 'Diversas especies de russula. Identificar bien antes de consumir.',
        lat: 41.1234, // Coordenada difusa
        lng: -3.5678, // Coordenada difusa
        type: 'russula',
      },
      {
        id: 'demo-5',
        name: 'Boletus en Montes de Toledo',
        description: 'Boletus aereus en encinares. Temporada de otoño.',
        lat: 39.8765, // Coordenada difusa
        lng: -4.2345, // Coordenada difusa
        type: 'boletus',
      },
    ];
  }, [isDemoModeEnabled]);

  return demoMarkers;
};
