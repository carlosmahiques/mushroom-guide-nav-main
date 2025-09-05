import { useState } from "react";
import { CloudRain, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useMapData } from "@/hooks/useMapData";
import { useWeatherData } from "@/hooks/useWeatherData";
import { SpotSelector } from "@/components/weather/SpotSelector";
import { WeatherMetrics } from "@/components/weather/WeatherMetrics";
import { MushroomConditionsCard } from "@/components/weather/MushroomConditionsCard";
import { WeatherInfo } from "@/components/weather/WeatherInfo";
import { WeatherForecastChart } from "@/components/weather/WeatherForecastChart";

const Datos = () => {
  const { markers: spots } = useMapData();
  const [selectedSpot, setSelectedSpot] = useState<typeof spots[0] | null>(null);
  const { currentWeather, dailyForecast, mushroomConditions, loading, error, refetch } = useWeatherData(selectedSpot);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <CloudRain className="h-8 w-8 text-accent" />
            Datos Meteorológicos
          </h1>
          <p className="text-muted-foreground mt-1">
            Condiciones meteorológicas en tiempo real desde AEMET
          </p>
        </div>
        {selectedSpot && (
          <Button 
            onClick={refetch} 
            disabled={loading}
            variant="outline"
            size="sm"
            className="gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </Button>
        )}
      </div>

      {/* Spot Selector */}
      <Card className="shadow-soft">
        <CardContent className="pt-6">
          <SpotSelector
            spots={spots}
            selectedSpot={selectedSpot}
            onSpotSelect={setSelectedSpot}
            loading={loading}
          />
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* No spot selected */}
      {!selectedSpot && spots.length > 0 && (
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <CloudRain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Selecciona una localización</p>
              <p className="text-sm">Elige un sitio para ver las condiciones meteorológicas</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* No spots available */}
      {spots.length === 0 && (
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <CloudRain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No hay sitios guardados</p>
              <p className="text-sm">Ve al mapa y añade algunos sitios para ver los datos meteorológicos</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Weather Data Display */}
      {selectedSpot && currentWeather && !loading && (
        <>
          {/* Weather Info */}
          <Card className="shadow-soft">
            <CardContent className="pt-4">
              <WeatherInfo weather={currentWeather} />
            </CardContent>
          </Card>

          {/* Weather Metrics */}
          <WeatherMetrics weather={currentWeather} />

          {/* Mushroom Conditions */}
          {mushroomConditions && (
            <MushroomConditionsCard conditions={mushroomConditions} />
          )}

          {/* Weather Forecast Chart */}
          <WeatherForecastChart forecastData={dailyForecast} />
        </>
      )}

      {/* Loading State */}
      {loading && selectedSpot && (
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <RefreshCw className="h-12 w-12 mx-auto mb-3 animate-spin" />
              <p className="text-lg font-medium">Obteniendo datos meteorológicos...</p>
              <p className="text-sm">Consultando estación AEMET más cercana</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Datos;