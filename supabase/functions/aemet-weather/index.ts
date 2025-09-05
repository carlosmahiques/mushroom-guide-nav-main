import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AEMET_API_KEY = Deno.env.get('AEMET_API_KEY');
const SUPABASE_URL = Deno.env.get('SUPABASE_URL');
const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');

// Helper function for robust HTTP requests with timeout and retries
async function fetchWithRetry(url: string, options: RequestInit = {}, maxRetries = 3, timeout = 30000) {
  console.log(`🌐 Fetching: ${url}`);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'User-Agent': 'Setas-Weather-App/1.0',
          ...options.headers,
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      console.log(`✅ Request successful (attempt ${attempt})`);
      return response;
    } catch (error) {
      console.error(`❌ Request failed (attempt ${attempt}/${maxRetries}):`, error.message);
      
      if (attempt === maxRetries) {
        throw new Error(`Failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retry (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000);
      console.log(`⏳ Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { lat, lng, spotId, operation = 'current' } = await req.json();
    
    console.log(`📍 Request: operation=${operation}, lat=${lat}, lng=${lng}, spotId=${spotId}`);
    
    if (!AEMET_API_KEY) {
      console.error('❌ AEMET API key not configured');
      throw new Error('AEMET API key not configured');
    }

    if (!lat || !lng) {
      console.error('❌ Invalid coordinates:', { lat, lng });
      throw new Error('Valid latitude and longitude are required');
    }

    const supabase = createClient(SUPABASE_URL!, SUPABASE_ANON_KEY!);

    if (operation === 'current') {
      console.log('🌡️ Fetching current weather data from AEMET...');
      
      // Get current weather data from AEMET
      const stationsResponse = await fetchWithRetry(
        `https://opendata.aemet.es/opendata/api/observacion/convencional/todas?api_key=${AEMET_API_KEY}`
      );
      
      const stationsData = await stationsResponse.json();
      console.log('📊 Stations response:', { estado: stationsData.estado, mensaje: stationsData.descripcion });
      
      if (stationsData.estado !== 200) {
        console.error('❌ AEMET API error:', stationsData);
        throw new Error(`AEMET API error: ${stationsData.descripcion || 'Unknown error'}`);
      }

      if (!stationsData.datos) {
        console.error('❌ No data URL provided by AEMET');
        throw new Error('No weather data URL provided by AEMET');
      }

      // Get actual data from the provided URL
      const weatherResponse = await fetchWithRetry(stationsData.datos);
      const weatherData = await weatherResponse.json();
      
      console.log(`📍 Found ${weatherData.length} weather stations`);
      
      // Find nearest station to the provided coordinates
      let nearestStation = null;
      let minDistance = Infinity;
      
      for (const station of weatherData) {
        if (station.lat && station.lon) {
          const distance = Math.sqrt(
            Math.pow(parseFloat(station.lat) - lat, 2) + 
            Math.pow(parseFloat(station.lon) - lng, 2)
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestStation = station;
          }
        }
      }

      if (!nearestStation) {
        console.error('❌ No weather station found near coordinates');
        throw new Error('No weather station found near coordinates');
      }

      console.log(`🏢 Nearest station: ${nearestStation.ubi} (${Math.round(minDistance * 111)}km)`);

      // Parse and validate weather data
      const weatherResult = {
        temperature: nearestStation.ta ? parseFloat(nearestStation.ta) : null,
        humidity: nearestStation.hr ? parseFloat(nearestStation.hr) : null,
        wind_speed: nearestStation.vv ? parseFloat(nearestStation.vv) : null,
        precipitation: nearestStation.prec ? parseFloat(nearestStation.prec) : null,
        pressure: nearestStation.pres ? parseFloat(nearestStation.pres) : null,
        station_name: nearestStation.ubi || 'Unknown Station',
        observation_time: nearestStation.fhora || new Date().toISOString(),
        distance_km: Math.round(minDistance * 111), // Convert degrees to approximate km
      };

      console.log('🌟 Weather data parsed:', weatherResult);

      // Store weather observation in database
      if (spotId) {
        try {
          console.log('💾 Storing weather observation in database...');
          const { error: dbError } = await supabase.from('weather_observations').insert({
            spot_id: spotId,
            provider: 'aemet',
            timestamp_utc: new Date().toISOString(),
            horizon_hours: 0,
            temp_c: weatherResult.temperature,
            humidity: weatherResult.humidity,
            wind_ms: weatherResult.wind_speed,
            precip_mm: weatherResult.precipitation,
            raw_json: nearestStation
          });
          
          if (dbError) {
            console.error('❌ Database error:', dbError);
          } else {
            console.log('✅ Weather data stored successfully');
          }
        } catch (dbError) {
          console.error('❌ Failed to store weather data:', dbError);
          // Don't throw here - we still want to return the weather data
        }
      }

      return new Response(JSON.stringify(weatherResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (operation === 'forecast') {
      console.log('📈 Fetching forecast data from AEMET...');
      
      // Get weather forecast from AEMET
      // First get list of available municipalities
      const municipiosResponse = await fetchWithRetry(
        `https://opendata.aemet.es/opendata/api/maestro/municipios?api_key=${AEMET_API_KEY}`
      );
      
      const municipiosData = await municipiosResponse.json();
      console.log('🏘️ Municipalities response:', { estado: municipiosData.estado, mensaje: municipiosData.descripcion });
      
      if (municipiosData.estado !== 200) {
        console.error('❌ AEMET municipalities API error:', municipiosData);
        throw new Error(`AEMET municipalities API error: ${municipiosData.descripcion || 'Unknown error'}`);
      }

      if (!municipiosData.datos) {
        console.error('❌ No municipalities data URL provided by AEMET');
        throw new Error('No municipalities data URL provided by AEMET');
      }

      // Get municipalities data
      const municipiosListResponse = await fetchWithRetry(municipiosData.datos);
      const municipiosList = await municipiosListResponse.json();
      
      console.log(`🏘️ Found ${municipiosList.length} municipalities`);
      
      // Find nearest municipality
      let nearestMunicipio = null;
      let minDistance = Infinity;
      
      for (const municipio of municipiosList) {
        if (municipio.latitud_dec && municipio.longitud_dec) {
          const distance = Math.sqrt(
            Math.pow(parseFloat(municipio.latitud_dec) - lat, 2) + 
            Math.pow(parseFloat(municipio.longitud_dec) - lng, 2)
          );
          
          if (distance < minDistance) {
            minDistance = distance;
            nearestMunicipio = municipio;
          }
        }
      }

      if (!nearestMunicipio) {
        console.error('❌ No municipality found near coordinates');
        throw new Error('No municipality found near coordinates');
      }

      console.log(`🏘️ Nearest municipality: ${nearestMunicipio.nombre}, ${nearestMunicipio.provincia} (${Math.round(minDistance * 111)}km)`);

      // Get forecast for the municipality
      const forecastResponse = await fetchWithRetry(
        `https://opendata.aemet.es/opendata/api/prediccion/especifica/municipio/diaria/${nearestMunicipio.id}?api_key=${AEMET_API_KEY}`
      );
      
      const forecastData = await forecastResponse.json();
      console.log('📊 Forecast response:', { estado: forecastData.estado, mensaje: forecastData.descripcion });
      
      if (forecastData.estado !== 200) {
        console.error('❌ AEMET forecast API error:', forecastData);
        throw new Error(`AEMET forecast API error: ${forecastData.descripcion || 'Unknown error'}`);
      }

      if (!forecastData.datos) {
        console.error('❌ No forecast data URL provided by AEMET');
        throw new Error('No forecast data URL provided by AEMET');
      }

      const forecastDetailsResponse = await fetchWithRetry(forecastData.datos);
      const forecastDetails = await forecastDetailsResponse.json();

      // Validate and structure forecast data
      const forecastResult = {
        municipality: nearestMunicipio.nombre || 'Unknown Municipality',
        province: nearestMunicipio.provincia || 'Unknown Province',
        forecast: Array.isArray(forecastDetails) && forecastDetails.length > 0 ? forecastDetails : null,
      };

      console.log('🌟 Forecast data parsed:', {
        municipality: forecastResult.municipality,
        province: forecastResult.province,
        hasForecast: !!forecastResult.forecast
      });

      return new Response(JSON.stringify(forecastResult), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });

    } else if (operation === 'historical') {
      console.log('📊 Historical data operation requested');
      
      // Get historical precipitation data
      const endDate = new Date();
      const startDate = new Date();
      startDate.setDate(endDate.getDate() - 30); // Last 30 days
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];

      console.log(`📅 Historical data period: ${startDateStr} to ${endDateStr}`);
      
      // This is a simplified version - AEMET's historical data requires station codes
      // For a full implementation, you'd need to:
      // 1. Find the nearest climatological station
      // 2. Request historical data for that station
      
      return new Response(JSON.stringify({
        message: 'Historical data requires specific station configuration',
        period: `${startDateStr} to ${endDateStr}`,
        note: 'This feature is currently under development',
        // Return mock data structure for now
        precipitation: []
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    
    } else {
      console.error('❌ Invalid operation requested:', operation);
      throw new Error(`Invalid operation: ${operation}. Supported operations: current, forecast, historical`);
    }

  } catch (error) {
    console.error('💥 Critical error in AEMET weather function:', {
      error: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });
    
    // Provide user-friendly error messages
    let userMessage = 'Error fetching weather data';
    if (error.message.includes('API key')) {
      userMessage = 'Weather service configuration error';
    } else if (error.message.includes('coordinates')) {
      userMessage = 'Invalid location coordinates';
    } else if (error.message.includes('No weather station')) {
      userMessage = 'No weather stations found near this location';
    } else if (error.message.includes('No municipality')) {
      userMessage = 'No forecast data available for this location';
    } else if (error.message.includes('after')) {
      userMessage = 'Weather service temporarily unavailable. Please try again.';
    }
    
    return new Response(JSON.stringify({ 
      error: userMessage,
      details: error.message,
      timestamp: new Date().toISOString(),
      retryable: error.message.includes('after') || error.message.includes('timeout')
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});