import { MapPin, Clock, Wifi } from "lucide-react";
import { WeatherData } from "@/hooks/useWeatherData";

interface WeatherInfoProps {
  weather: WeatherData;
}

export function WeatherInfo({ weather }: WeatherInfoProps) {
  const formatTime = (timeString: string) => {
    try {
      const date = new Date(timeString);
      return date.toLocaleString('es-ES', {
        hour: '2-digit',
        minute: '2-digit',
        day: '2-digit',
        month: '2-digit'
      });
    } catch {
      return timeString;
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
      <div className="flex items-center gap-2">
        <MapPin className="h-4 w-4" />
        <span>{weather.station_name}</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Wifi className="h-4 w-4" />
        <span>{weather.distance_km} km de distancia</span>
      </div>
      
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4" />
        <span>Actualizado: {formatTime(weather.observation_time)}</span>
      </div>
    </div>
  );
}