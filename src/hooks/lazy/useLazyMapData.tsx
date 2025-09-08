import { useState, useEffect } from 'react';

// Lazy load del hook useMapData
let mapDataModule: any = null;
let mapDataPromise: Promise<any> | null = null;

const loadMapData = async () => {
  if (mapDataModule) {
    return mapDataModule;
  }
  
  if (mapDataPromise) {
    return mapDataPromise;
  }
  
  mapDataPromise = import('@/hooks/useMapData').then(module => {
    mapDataModule = module;
    return module;
  });
  
  return mapDataPromise;
};

// Hook que carga useMapData de forma lazy
export const useLazyMapData = () => {
  const [mapDataHook, setMapDataHook] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    loadMapData()
      .then(module => {
        setMapDataHook(() => module.useMapData);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err);
        setIsLoading(false);
      });
  }, []);

  // Si está cargando o hay error, devolver valores por defecto
  if (isLoading || error || !mapDataHook) {
    return {
      markers: [],
      sessionUserId: null,
      loading: isLoading,
      error,
      addSpot: () => Promise.resolve(),
      deleteSpot: () => Promise.resolve(),
      totalSpots: 0,
      exploredZones: 0,
      createdThisMonth: 0,
    };
  }

  // Usar el hook real una vez cargado
  return mapDataHook();
};
