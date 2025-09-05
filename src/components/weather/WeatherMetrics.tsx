import { CloudRain, Droplets, Wind, Thermometer, Gauge } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { WeatherData } from "@/hooks/useWeatherData";

interface WeatherMetricsProps {
  weather: WeatherData;
}

export function WeatherMetrics({ weather }: WeatherMetricsProps) {
  const formatValue = (value: number | null, unit: string, decimals = 1) => {
    if (value === null) return '--';
    return `${value.toFixed(decimals)}${unit}`;
  };

  const metrics = [
    {
      icon: Thermometer,
      label: 'Temperatura',
      value: formatValue(weather.temperature, '°C'),
      bgColor: 'bg-gradient-to-br from-orange-50 to-red-50',
      iconColor: 'text-orange-600'
    },
    {
      icon: Droplets,
      label: 'Humedad',
      value: formatValue(weather.humidity, '%', 0),
      bgColor: 'bg-gradient-to-br from-blue-50 to-cyan-50',
      iconColor: 'text-blue-600'
    },
    {
      icon: Wind,
      label: 'Viento',
      value: formatValue(weather.wind_speed, ' m/s'),
      bgColor: 'bg-gradient-to-br from-gray-50 to-slate-50',
      iconColor: 'text-gray-600'
    },
    {
      icon: CloudRain,
      label: 'Precipitación',
      value: formatValue(weather.precipitation, ' mm'),
      bgColor: 'bg-gradient-rain',
      iconColor: 'text-white'
    },
    {
      icon: Gauge,
      label: 'Presión',
      value: formatValue(weather.pressure, ' hPa', 0),
      bgColor: 'bg-gradient-to-br from-purple-50 to-violet-50',
      iconColor: 'text-purple-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
      {metrics.map((metric, index) => (
        <Card key={index} className="shadow-soft border-0">
          <CardContent className="p-4">
            <div className={`rounded-lg p-3 ${metric.bgColor}`}>
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <metric.icon className={`h-6 w-6 ${metric.iconColor}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={`text-lg font-bold ${metric.iconColor === 'text-white' ? 'text-white' : 'text-foreground'}`}>
                    {metric.value}
                  </p>
                  <p className={`text-xs ${metric.iconColor === 'text-white' ? 'text-white/90' : 'text-muted-foreground'}`}>
                    {metric.label}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}