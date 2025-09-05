import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { UiMarker } from './useMapData';

export type WeatherData = {
  temperature: number | null;
  humidity: number | null;
  wind_speed: number | null;
  precipitation: number | null;
  pressure: number | null;
  station_name: string;
  observation_time: string;
  distance_km: number;
};

export type ForecastData = {
  municipality: string;
  province: string;
  forecast: any;
};

export type DailyForecast = {
  date: string;
  tempMin: number;
  tempMax: number;
  humidity: number;
  precipitationProb: number;
  mushroomCondition: 'excellent' | 'good' | 'fair' | 'poor';
  mushroomScore: number;
};

export type MushroomConditions = {
  temperature: 'optimal' | 'good' | 'poor';
  humidity: 'optimal' | 'good' | 'poor';
  overall: 'excellent' | 'good' | 'fair' | 'poor';
  score: number;
};

export function useWeatherData(selectedSpot: UiMarker | null) {
  const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Calculate mushroom conditions based on weather data
  const calculateMushroomConditions = (weather: WeatherData): MushroomConditions => {
    const temp = weather.temperature;
    const humidity = weather.humidity;

    let tempScore: 'optimal' | 'good' | 'poor' = 'poor';
    let humidityScore: 'optimal' | 'good' | 'poor' = 'poor';

    // Temperature scoring (optimal: 15-25°C)
    if (temp !== null) {
      if (temp >= 15 && temp <= 25) {
        tempScore = 'optimal';
      } else if (temp >= 10 && temp <= 30) {
        tempScore = 'good';
      }
    }

    // Humidity scoring (optimal: 80-95%)
    if (humidity !== null) {
      if (humidity >= 80 && humidity <= 95) {
        humidityScore = 'optimal';
      } else if (humidity >= 70 && humidity <= 98) {
        humidityScore = 'good';
      }
    }

    // Calculate overall score
    const tempPoints = tempScore === 'optimal' ? 3 : tempScore === 'good' ? 2 : 1;
    const humidityPoints = humidityScore === 'optimal' ? 3 : humidityScore === 'good' ? 2 : 1;
    const totalScore = (tempPoints + humidityPoints) / 6;

    let overall: MushroomConditions['overall'];
    if (totalScore >= 0.8) overall = 'excellent';
    else if (totalScore >= 0.6) overall = 'good';
    else if (totalScore >= 0.4) overall = 'fair';
    else overall = 'poor';

    return {
      temperature: tempScore,
      humidity: humidityScore,
      overall,
      score: Math.round(totalScore * 100)
    };
  };

  const mushroomConditions = currentWeather ? calculateMushroomConditions(currentWeather) : null;

  // Process forecast data for chart with improved error handling
  const processForecastData = (forecastData: ForecastData): DailyForecast[] => {
    console.log('🔄 Processing forecast data:', forecastData);
    
    try {
      // Handle different possible forecast structures
      let dailyData = null;
      
      if (forecastData?.forecast) {
        if (Array.isArray(forecastData.forecast)) {
          // If forecast is already an array
          dailyData = forecastData.forecast[0]?.prediccion?.dia;
        } else if (forecastData.forecast.prediccion?.dia) {
          // If forecast has prediccion.dia structure
          dailyData = forecastData.forecast.prediccion.dia;
        } else if (forecastData.forecast.dia) {
          // If forecast has direct dia structure
          dailyData = forecastData.forecast.dia;
        }
      }

      if (!dailyData || !Array.isArray(dailyData)) {
        console.warn('⚠️ No valid daily forecast data found');
        return [];
      }

      console.log(`📅 Processing ${dailyData.length} forecast days`);

      return dailyData.slice(0, 7).map((day: any, index: number) => {
        try {
          // Extract temperature data with fallbacks
          let tempMin = 10, tempMax = 20; // Defaults
          
          if (day.temperatura?.minima !== undefined) {
            tempMin = parseFloat(day.temperatura.minima) || tempMin;
          }
          if (day.temperatura?.maxima !== undefined) {
            tempMax = parseFloat(day.temperatura.maxima) || tempMax;
          }
          
          // Extract precipitation probability with fallbacks
          let precipProb = 0;
          if (day.probPrecipitacion) {
            if (Array.isArray(day.probPrecipitacion)) {
              // Try to find afternoon/evening value, or use first available
              const afternoonProb = day.probPrecipitacion.find((p: any) => 
                p.periodo === '12-18' || p.periodo === '18-24'
              );
              precipProb = parseFloat(afternoonProb?.value || day.probPrecipitacion[0]?.value || '0') || 0;
            } else if (typeof day.probPrecipitacion === 'string' || typeof day.probPrecipitacion === 'number') {
              precipProb = parseFloat(day.probPrecipitacion.toString()) || 0;
            }
          }
          
          // Extract humidity with fallbacks
          let humidity = 60; // Default
          if (day.humedadRelativa) {
            if (Array.isArray(day.humedadRelativa)) {
              const afternoonHumidity = day.humedadRelativa.find((h: any) => 
                h.periodo === '12-18' || h.periodo === '18-24'
              );
              humidity = parseFloat(afternoonHumidity?.value || day.humedadRelativa[0]?.value || '60') || 60;
            } else if (typeof day.humedadRelativa === 'string' || typeof day.humedadRelativa === 'number') {
              humidity = parseFloat(day.humedadRelativa.toString()) || 60;
            }
          }

          // Calculate mushroom conditions for this day
          const avgTemp = (tempMin + tempMax) / 2;
          const mockWeather = {
            temperature: avgTemp,
            humidity,
            wind_speed: 0,
            precipitation: 0,
            pressure: null,
            station_name: '',
            observation_time: '',
            distance_km: 0
          };
          const conditions = calculateMushroomConditions(mockWeather);

          // Handle date formatting
          let date = day.fecha || new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

          return {
            date,
            tempMin: Math.round(tempMin),
            tempMax: Math.round(tempMax),
            humidity: Math.round(humidity),
            precipitationProb: Math.round(precipProb),
            mushroomCondition: conditions.overall,
            mushroomScore: conditions.score
          };
        } catch (dayError) {
          console.error('❌ Error processing day:', dayError, day);
          // Return a fallback day
          return {
            date: new Date(Date.now() + index * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            tempMin: 10,
            tempMax: 20,
            humidity: 60,
            precipitationProb: 0,
            mushroomCondition: 'fair' as const,
            mushroomScore: 50
          };
        }
      });
    } catch (error) {
      console.error('❌ Error processing forecast data:', error);
      return [];
    }
  };

  const fetchWeatherData = async (lat: number, lng: number, spotId?: string) => {
    setLoading(true);
    setError(null);

    try {
      console.log('🌦️ Fetching weather data for coordinates:', { lat, lng, spotId });

      // Fetch current weather and forecast in parallel
      const [currentResult, forecastResult] = await Promise.allSettled([
        supabase.functions.invoke('aemet-weather', {
          body: {
            lat,
            lng,
            spotId,
            operation: 'current'
          }
        }),
        supabase.functions.invoke('aemet-weather', {
          body: {
            lat,
            lng,
            operation: 'forecast'
          }
        })
      ]);

      // Handle current weather result
      if (currentResult.status === 'fulfilled') {
        const { data: currentData, error: currentError } = currentResult.value;
        if (currentError) {
          console.error('❌ Current weather error:', currentError);
          throw new Error(`Error fetching current weather: ${currentError.message}`);
        }
        if (currentData?.error) {
          console.error('❌ AEMET current weather error:', currentData);
          throw new Error(currentData.error);
        }
        console.log('✅ Current weather data received:', currentData);
        setCurrentWeather(currentData);
      } else {
        console.error('❌ Current weather request failed:', currentResult.reason);
        throw new Error(`Current weather request failed: ${currentResult.reason?.message || 'Unknown error'}`);
      }

      // Handle forecast result
      if (forecastResult.status === 'fulfilled') {
        const { data: forecastData, error: forecastError } = forecastResult.value;
        if (forecastError) {
          console.warn('⚠️ Forecast error (non-critical):', forecastError);
          // Don't throw for forecast errors - we can still show current weather
        } else if (forecastData?.error) {
          console.warn('⚠️ AEMET forecast error (non-critical):', forecastData);
          // Don't throw for forecast errors
        } else {
          console.log('✅ Forecast data received:', {
            municipality: forecastData?.municipality,
            province: forecastData?.province,
            hasForecast: !!forecastData?.forecast
          });
          setForecast(forecastData);
          setDailyForecast(processForecastData(forecastData));
        }
      } else {
        console.warn('⚠️ Forecast request failed (non-critical):', forecastResult.reason);
        // Don't throw for forecast errors - we can still show current weather
      }

    } catch (err) {
      console.error('❌ Error fetching weather data:', err);
      const errorMessage = err instanceof Error ? err.message : 'Error fetching weather data';
      setError(errorMessage);
      
      // Clear previous data on error
      setCurrentWeather(null);
      setForecast(null);
      setDailyForecast([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedSpot) {
      console.log('🎯 Selected spot changed:', selectedSpot);
      fetchWeatherData(selectedSpot.lat, selectedSpot.lng, selectedSpot.id);
    } else {
      console.log('🎯 No spot selected, clearing weather data');
      setCurrentWeather(null);
      setForecast(null);
      setDailyForecast([]);
      setError(null);
    }
  }, [selectedSpot]);

  return {
    currentWeather,
    forecast,
    dailyForecast,
    mushroomConditions,
    loading,
    error,
    refetch: selectedSpot ? () => fetchWeatherData(selectedSpot.lat, selectedSpot.lng, selectedSpot.id) : undefined
  };
}