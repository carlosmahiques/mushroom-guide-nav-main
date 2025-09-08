# Pronóstico Fallbacks - Integración Lean

## Estados de Degradación

### 1. Error de Edge Function

#### Ubicación:
- **Archivo**: `src/hooks/useWeatherData.tsx`
- **Trigger**: Error en llamada a Edge Function
- **Estado**: `error` en el hook

#### Implementación:
```typescript
// En useWeatherData.tsx
const useWeatherData = (selectedSpot) => {
  const [error, setError] = useState(null);
  const [lastValidData, setLastValidData] = useState(null);
  
  const fetchWeatherData = async () => {
    try {
      const response = await fetch('/api/weather');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = await response.json();
      setLastValidData(data);
      setError(null);
    } catch (err) {
      setError({
        message: err.message,
        status: err.status || 500,
        timestamp: Date.now()
      });
    }
  };
  
  return { error, lastValidData, refetch: fetchWeatherData };
};
```

### 2. Alerta Suavizada

#### Ubicación:
- **Archivo**: `src/pages/Datos.tsx`
- **Posición**: Después del header (línea 44)
- **Estilo**: Alert con variant="destructive" pero suavizado

#### Implementación:
```typescript
// En Datos.tsx
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const Datos = () => {
  const { error, refetch, lastValidData } = useWeatherData(selectedSpot);
  
  return (
    <div>
      {/* Header existente */}
      
      {/* Error Display */}
      {error && (
        <Alert variant="destructive" className="border-orange-200 bg-orange-50">
          <AlertDescription className="flex items-center justify-between">
            <div>
              <p className="font-medium">Error al obtener datos meteorológicos</p>
              <p className="text-sm text-muted-foreground">
                No se pudieron cargar los datos más recientes
              </p>
            </div>
            <Button 
              onClick={refetch} 
              variant="outline" 
              size="sm"
              className="ml-4"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Reintentar
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {/* Resto del contenido */}
    </div>
  );
};
```

### 3. Último Dato Válido

#### Ubicación:
- **Archivo**: `src/components/weather/WeatherInfo.tsx`
- **Posición**: Header del componente
- **Estilo**: Badge con "hace X h"

#### Implementación:
```typescript
// En WeatherInfo.tsx
import { Badge } from '@/components/ui/badge';
import { Clock } from 'lucide-react';

const WeatherInfo = ({ weather, lastUpdated }) => {
  const getTimeAgo = (timestamp) => {
    const hours = Math.floor((Date.now() - timestamp) / (1000 * 60 * 60));
    return hours > 0 ? `hace ${hours}h` : 'ahora';
  };
  
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Condiciones actuales</h3>
        {lastUpdated && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {getTimeAgo(lastUpdated)}
          </Badge>
        )}
      </div>
      
      {/* Resto del contenido */}
    </div>
  );
};
```

### 4. Log Detallado para Soporte

#### Ubicación:
- **Archivo**: `src/lib/errorLogger.ts` (nuevo)
- **Función**: Log de errores sin PII
- **Destino**: Console en desarrollo, servicio externo en producción

#### Implementación:
```typescript
// En errorLogger.ts
interface ErrorLog {
  timestamp: number;
  error_type: 'weather_api' | 'edge_function' | 'network';
  status_code?: number;
  error_message: string;
  user_agent: string;
  url: string;
  // Sin PII (no email, no coordenadas exactas)
}

export const logError = (error: Error, context: any) => {
  const errorLog: ErrorLog = {
    timestamp: Date.now(),
    error_type: 'weather_api',
    status_code: context.status,
    error_message: error.message,
    user_agent: navigator.userAgent,
    url: window.location.href,
  };
  
  if (import.meta.env.DEV) {
    console.error('Weather Error:', errorLog);
  } else {
    // Enviar a servicio de logging
    fetch('/api/log-error', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(errorLog)
    });
  }
};
```

### 5. Estados de Carga

#### Ubicación:
- **Archivo**: `src/pages/Datos.tsx`
- **Posición**: Reemplaza contenido cuando loading (línea 115-125)

#### Implementación:
```typescript
// En Datos.tsx
const Datos = () => {
  const { loading, error, lastValidData } = useWeatherData(selectedSpot);
  
  return (
    <div>
      {/* Header existente */}
      
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
      
      {/* Error State */}
      {error && !lastValidData && (
        <Card className="shadow-soft">
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">
              <CloudRain className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">Error al cargar datos</p>
              <p className="text-sm mb-4">No se pudieron obtener los datos meteorológicos</p>
              <Button onClick={refetch} variant="outline">
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Success State */}
      {!loading && !error && currentWeather && (
        <>
          {/* Contenido existente */}
        </>
      )}
    </div>
  );
};
```

## Copys de Degradación

### Error de Red
- **Título**: "Error de conexión"
- **Descripción**: "No se pudieron cargar los datos meteorológicos. Verifica tu conexión a internet."
- **Acción**: "Reintentar"

### Error de API
- **Título**: "Error del servicio meteorológico"
- **Descripción**: "El servicio meteorológico no está disponible temporalmente."
- **Acción**: "Reintentar"

### Datos Antiguos
- **Badge**: "hace X h"
- **Tooltip**: "Últimos datos disponibles"
- **Acción**: "Actualizar"

### Sin Datos
- **Título**: "No hay datos disponibles"
- **Descripción**: "No se pudieron obtener datos para esta ubicación."
- **Acción**: "Seleccionar otra ubicación"
