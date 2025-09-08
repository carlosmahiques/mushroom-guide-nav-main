import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { analyzeSetal, getMarkerColor, getRecommendationEmoji, type SetalAnalysis } from '@/lib/smartSetales';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export type SmartSetal = {
  id: string;
  title: string;
  description?: string;
  lat: number;
  lng: number;
  species: string;
  createdAt: string;
  analysis?: SetalAnalysis;
  markerColor: string;
  recommendationEmoji: string;
};

export function useSmartSetales() {
  const { user } = useAuth();
  const [smartSetales, setSmartSetales] = useState<SmartSetal[]>([]);
  const [loading, setLoading] = useState(true);
  const [analyzing, setAnalyzing] = useState(false);
  const [lastAnalysis, setLastAnalysis] = useState<string | null>(null);

  // Obtener datos meteorológicos para un setal específico
  const fetchWeatherForSetal = useCallback(async (lat: number, lng: number) => {
    try {
      const response = await supabase.functions.invoke('aemet-weather', {
        body: {
          operation: 'current',
          lat,
          lng
        }
      });

      if (response.error) {
        console.warn('Error fetching weather data, using fallback:', response.error);
        // Fallback a datos sintéticos basados en coordenadas
        return generateFallbackWeather(lat, lng);
      }

      const weatherData = response.data;
      return {
        temperature: weatherData.temperature || 15,
        humidity: weatherData.humidity || 70,
        rain3d: weatherData.precipitation || 10,
        rain7d: (weatherData.precipitation || 10) * 2.5, // Estimación
        wind: weatherData.wind_speed || 10
      };
    } catch (error) {
      console.warn('Error fetching weather data, using fallback:', error);
      return generateFallbackWeather(lat, lng);
    }
  }, []);

  // Generar datos meteorológicos sintéticos como fallback
  const generateFallbackWeather = (lat: number, lng: number) => {
    // Usar coordenadas como seed para datos consistentes
    const seed = Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453;
    const random = seed - Math.floor(seed);
    
    return {
      temperature: Math.round(8 + random * 15), // 8-23°C
      humidity: Math.round(60 + random * 30), // 60-90%
      rain3d: Math.round(5 + random * 25), // 5-30mm
      rain7d: Math.round(15 + random * 50), // 15-65mm
      wind: Math.round(5 + random * 20) // 5-25 km/h
    };
  };

  // Analizar un setal individual
  const analyzeSetalData = useCallback(async (setal: any): Promise<SmartSetal> => {
    const weatherData = await fetchWeatherForSetal(setal.lat, setal.lng);
    
    const analysis = analyzeSetal(
      setal.id,
      setal.species || 'otro',
      { lat: setal.lat, lng: setal.lng },
      weatherData
    );

    return {
      id: setal.id,
      title: setal.title,
      description: setal.description,
      lat: setal.lat,
      lng: setal.lng,
      species: setal.species || 'otro',
      createdAt: setal.createdAt,
      analysis,
      markerColor: getMarkerColor(analysis.probability),
      recommendationEmoji: getRecommendationEmoji(analysis.recommendation.action)
    };
  }, [fetchWeatherForSetal]);

  // Cargar y analizar todos los setales del usuario
  const loadAndAnalyzeSetales = useCallback(async () => {
    if (!user) {
      setSmartSetales([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setAnalyzing(true);

    try {
      // Obtener setales del usuario
      const { data: spots, error } = await supabase
        .from('spots')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error loading spots:', error);
        toast.error('Error cargando setales');
        return;
      }

      if (!spots || spots.length === 0) {
        setSmartSetales([]);
        setLoading(false);
        setAnalyzing(false);
        return;
      }

      // Procesar cada setal
      const processedSetales: SmartSetal[] = [];
      
      for (const spot of spots) {
        if (!spot.lat || !spot.lng) continue;

        // Parsear especie de las notas
        const speciesMatch = spot.notes?.match(/\[species:([a-zA-Z0-9_\-]+)\]/);
        const species = speciesMatch ? speciesMatch[1] : 'otro';

        // Limpiar descripción
        const cleanDescription = spot.notes?.replace(/\[species:[^\]]+\]/, '').trim() || undefined;

        const setalData = {
          id: spot.id,
          title: spot.name,
          description: cleanDescription,
          lat: spot.lat,
          lng: spot.lng,
          species,
          createdAt: spot.created_at
        };

        const smartSetal = await analyzeSetalData(setalData);
        processedSetales.push(smartSetal);
      }

      setSmartSetales(processedSetales);
      setLastAnalysis(new Date().toISOString());
      
      // Mostrar resumen de análisis
      const highProb = processedSetales.filter(s => s.analysis?.probability >= 80).length;
      const mediumProb = processedSetales.filter(s => s.analysis?.probability >= 60 && s.analysis?.probability < 80).length;
      
      if (highProb > 0) {
        toast.success(`¡${highProb} setales con alta probabilidad! 🚀`);
      } else if (mediumProb > 0) {
        toast.info(`${mediumProb} setales con probabilidad media 👀`);
      }

    } catch (error) {
      console.error('Error analyzing setales:', error);
      toast.error('Error analizando setales');
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  }, [user, analyzeSetalData]);

  // Recargar análisis
  const refreshAnalysis = useCallback(() => {
    loadAndAnalyzeSetales();
  }, [loadAndAnalyzeSetales]);

  // Cargar datos iniciales
  useEffect(() => {
    loadAndAnalyzeSetales();
  }, [loadAndAnalyzeSetales]);

  // Estadísticas de setales
  const stats = {
    total: smartSetales.length,
    highProbability: smartSetales.filter(s => s.analysis?.probability >= 80).length,
    mediumProbability: smartSetales.filter(s => s.analysis?.probability >= 60 && s.analysis?.probability < 80).length,
    lowProbability: smartSetales.filter(s => s.analysis?.probability < 60).length,
    goNow: smartSetales.filter(s => s.analysis?.recommendation.action === 'go_now').length,
    checkLater: smartSetales.filter(s => s.analysis?.recommendation.action === 'check_later').length,
    wait: smartSetales.filter(s => s.analysis?.recommendation.action === 'wait').length,
    notRecommended: smartSetales.filter(s => s.analysis?.recommendation.action === 'not_recommended').length
  };

  // Setales recomendados para ir ahora
  const recommendedSetales = smartSetales
    .filter(s => s.analysis?.recommendation.action === 'go_now')
    .sort((a, b) => (b.analysis?.probability || 0) - (a.analysis?.probability || 0));

  // Setales por especie
  const setalesBySpecies = smartSetales.reduce((acc, setal) => {
    const species = setal.species;
    if (!acc[species]) acc[species] = [];
    acc[species].push(setal);
    return acc;
  }, {} as Record<string, SmartSetal[]>);

  return {
    smartSetales,
    loading,
    analyzing,
    lastAnalysis,
    stats,
    recommendedSetales,
    setalesBySpecies,
    refreshAnalysis,
    analyzeSetalData
  };
}
