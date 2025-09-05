import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CloudRain, Thermometer, Droplets, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { 
  ComposedChart, 
  Bar, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Legend,
  ReferenceLine,
  Tooltip
} from "recharts";
import { DailyForecast } from "@/hooks/useWeatherData";
import { useMemo } from "react";

interface WeatherForecastChartProps {
  forecastData: DailyForecast[];
}

const getMushroomColor = (condition: string) => {
  switch (condition) {
    case 'excellent': return 'hsl(142 76% 36%)'; // Green
    case 'good': return 'hsl(47 96% 53%)';      // Yellow  
    case 'fair': return 'hsl(25 95% 53%)';      // Orange
    case 'poor': return 'hsl(0 84% 60%)';       // Red
    default: return 'hsl(240 4% 46%)';          // Gray
  }
};

const getMushroomEmoji = (condition: string) => {
  switch (condition) {
    case 'excellent': return '🍄✨';
    case 'good': return '🍄👍';
    case 'fair': return '🍄😐';
    case 'poor': return '🍄👎';
    default: return '🍄';
  }
};

const formatDate = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric',
      month: 'short'
    });
  } catch {
    return dateStr;
  }
};

const formatDateMobile = (dateStr: string) => {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString('es-ES', { 
      weekday: 'short', 
      day: 'numeric'
    });
  } catch {
    return dateStr;
  }
};

// Custom Tooltip Component
const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;
  
  const data = payload[0].payload;
  
  return (
    <div className="bg-card border border-border shadow-lg rounded-lg p-3 max-w-xs">
      <div className="font-medium text-sm mb-2">
        {formatDate(label)}
      </div>
      
      <div className="space-y-1 text-xs">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-3 w-3 text-red-500" />
            <span className="text-red-500">{data.tempMax}°C</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingDown className="h-3 w-3 text-blue-500" />
            <span className="text-blue-500">{data.tempMin}°C</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <CloudRain className="h-3 w-3 text-blue-400" />
          <span>Precipitación: {data.precipitationProb}%</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Droplets className="h-3 w-3 text-cyan-500" />
          <span>Humedad: {data.humidity}%</span>
        </div>
        
        <div 
          className="text-xs font-medium p-2 rounded mt-2 flex items-center gap-1"
          style={{
            backgroundColor: getMushroomColor(data.mushroomCondition) + '20',
            color: getMushroomColor(data.mushroomCondition)
          }}
        >
          <span>{getMushroomEmoji(data.mushroomCondition)}</span>
          <span>
            {data.mushroomCondition === 'excellent' ? 'Excelente' :
             data.mushroomCondition === 'good' ? 'Bueno' :
             data.mushroomCondition === 'fair' ? 'Regular' : 'Pobre'} ({data.mushroomScore}%)
          </span>
        </div>
      </div>
    </div>
  );
};

export function WeatherForecastChart({ forecastData }: WeatherForecastChartProps) {
  const chartData = useMemo(() => {
    if (!forecastData || forecastData.length === 0) return [];
    return forecastData.map(day => ({
      ...day,
      shortDate: formatDateMobile(day.date),
      fullDate: formatDate(day.date)
    }));
  }, [forecastData]);

  if (!forecastData || forecastData.length === 0) {
    return (
      <Card className="shadow-md">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <CloudRain className="h-5 w-5 text-primary" />
            Previsión semanal
          </CardTitle>
          <CardDescription>No hay datos de previsión disponibles</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-48 md:h-64 bg-gradient-to-br from-blue-50 to-sky-50 dark:from-blue-950/20 dark:to-sky-950/20 rounded-lg flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <CloudRain className="h-8 w-8 md:h-12 md:w-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Sin datos de previsión</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <CloudRain className="h-5 w-5 text-primary" />
          Previsión semanal
        </CardTitle>
        <CardDescription>
          Condiciones meteorológicas para los próximos días
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-4 md:p-6">
        {/* Desktop/Tablet Chart */}
        <div className="hidden md:block">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
              
              <XAxis 
                dataKey="fullDate" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tick={{ fontSize: 12 }}
              />
              
              <YAxis 
                yAxisId="temp"
                orientation="left"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                domain={['dataMin - 2', 'dataMax + 2']}
                label={{ value: '°C', angle: -90, position: 'insideLeft' }}
              />
              
              <YAxis 
                yAxisId="percent"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={11}
                domain={[0, 100]}
                label={{ value: '%', angle: 90, position: 'insideRight' }}
              />

              {/* Precipitation bars */}
              <Bar 
                yAxisId="percent"
                dataKey="precipitationProb" 
                fill="hsl(219 95% 70%)"
                fillOpacity={0.4}
                radius={[2, 2, 0, 0]}
              />

              {/* Temperature lines */}
              <Line 
                yAxisId="temp"
                type="monotone" 
                dataKey="tempMax" 
                stroke="hsl(0 84% 60%)" 
                strokeWidth={3}
                dot={{ fill: "hsl(0 84% 60%)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(0 84% 60%)", strokeWidth: 2 }}
              />
              <Line 
                yAxisId="temp"
                type="monotone" 
                dataKey="tempMin" 
                stroke="hsl(217 91% 60%)" 
                strokeWidth={3}
                dot={{ fill: "hsl(217 91% 60%)", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "hsl(217 91% 60%)", strokeWidth: 2 }}
              />

              {/* Mushroom condition indicators */}
              {chartData.map((day, index) => (
                <ReferenceLine
                  key={`mushroom-${index}`}
                  x={day.fullDate}
                  stroke={getMushroomColor(day.mushroomCondition)}
                  strokeWidth={4}
                  strokeOpacity={0.6}
                />
              ))}

              <Tooltip content={<CustomTooltip />} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Mobile Chart */}
        <div className="block md:hidden">
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 5 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="hsl(var(--border))" opacity={0.3} />
              
              <XAxis 
                dataKey="shortDate" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={10}
                tick={{ fontSize: 10 }}
              />
              
              <YAxis 
                yAxisId="temp"
                orientation="left"
                stroke="hsl(var(--muted-foreground))"
                fontSize={9}
                width={30}
                domain={['dataMin - 2', 'dataMax + 2']}
              />
              
              <YAxis 
                yAxisId="percent"
                orientation="right"
                stroke="hsl(var(--muted-foreground))"
                fontSize={9}
                width={30}
                domain={[0, 100]}
              />

              <Bar 
                yAxisId="percent"
                dataKey="precipitationProb" 
                fill="hsl(219 95% 70%)"
                fillOpacity={0.4}
                radius={[1, 1, 0, 0]}
              />

              <Line 
                yAxisId="temp"
                type="monotone" 
                dataKey="tempMax" 
                stroke="hsl(0 84% 60%)" 
                strokeWidth={2}
                dot={{ fill: "hsl(0 84% 60%)", strokeWidth: 1, r: 3 }}
              />
              <Line 
                yAxisId="temp"
                type="monotone" 
                dataKey="tempMin" 
                stroke="hsl(217 91% 60%)" 
                strokeWidth={2}
                dot={{ fill: "hsl(217 91% 60%)", strokeWidth: 1, r: 3 }}
              />

              <Tooltip content={<CustomTooltip />} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Mushroom conditions summary */}
        <div className="mt-4 p-3 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950/20 dark:to-blue-950/20 rounded-lg">
          <h4 className="text-sm font-medium mb-3 text-foreground flex items-center gap-2">
            🍄 Condiciones para setas:
          </h4>
          
          {/* Desktop Legend */}
          <div className="hidden md:flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getMushroomColor('excellent') }}></div>
              <span>Excelentes (80-100%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getMushroomColor('good') }}></div>
              <span>Buenas (60-79%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getMushroomColor('fair') }}></div>
              <span>Regulares (40-59%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: getMushroomColor('poor') }}></div>
              <span>Pobres (0-39%)</span>
            </div>
          </div>

          {/* Mobile Legend */}
          <div className="grid grid-cols-2 gap-2 md:hidden text-xs">
            <div className="flex items-center gap-1">
              <span className="text-lg">{getMushroomEmoji('excellent')}</span>
              <span>Excelentes</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">{getMushroomEmoji('good')}</span>
              <span>Buenas</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">{getMushroomEmoji('fair')}</span>
              <span>Regulares</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-lg">{getMushroomEmoji('poor')}</span>
              <span>Pobres</span>
            </div>
          </div>

          {/* Best days summary */}
          <div className="mt-3 pt-2 border-t border-border/50">
            <div className="text-xs text-muted-foreground">
              <strong>Mejores días:</strong> {
                chartData
                  .filter(day => day.mushroomCondition === 'excellent' || day.mushroomCondition === 'good')
                  .map(day => formatDateMobile(day.date))
                  .join(', ') || 'Ninguno destacado'
              }
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}