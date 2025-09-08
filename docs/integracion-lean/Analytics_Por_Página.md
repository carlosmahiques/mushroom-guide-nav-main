# Analytics por Página - Integración Lean

## Hook useAnalytics

### Contrato
```typescript
interface AnalyticsHook {
  logEvent: (eventName: string, props?: Record<string, any>) => void;
  logPageView: (page: string, userType: 'anonymous' | 'free' | 'pro') => void;
}

const useAnalytics = (): AnalyticsHook
```

## Eventos por Página

### 1. Mapa Interactivo (`/mapa`)

#### Eventos:
- **page_view**: Al cargar la página
- **demo_view**: Al cargar mapa en modo demo
- **demo_interact**: Al interactuar con el mapa
- **register_click**: Al hacer click en CTA de registro

#### Implementación:
```typescript
// En Mapa.tsx
import { useAnalytics } from '@/hooks/useAnalytics';

const Mapa = () => {
  const { logEvent, logPageView } = useAnalytics();
  
  useEffect(() => {
    logPageView('/mapa', 'free'); // o 'pro' según plan
  }, []);
  
  const handleMapClick = () => {
    logEvent('demo_interact', {
      action: 'click_map',
      coordinates: { lat: 40.4168, lng: -3.7038 }
    });
  };
  
  const handleRegisterClick = () => {
    logEvent('register_click', {
      source: 'demo',
      context: 'floating_cta'
    });
  };
};
```

### 2. Mis Sétales (`/setales`)

#### Eventos:
- **page_view**: Al cargar la página
- **setal_create**: Al crear un setal
- **paywall_view**: Al alcanzar límite de setales

#### Implementación:
```typescript
// En Setales.tsx
import { useAnalytics } from '@/hooks/useAnalytics';

const Setales = () => {
  const { logEvent, logPageView } = useAnalytics();
  
  useEffect(() => {
    logPageView('/setales', 'free');
  }, []);
  
  const handleAddLocation = () => {
    logEvent('setal_create', {
      source: 'setales_page',
      coordinates: { lat: 40.4168, lng: -3.7038 }
    });
  };
  
  const handlePaywallView = () => {
    logEvent('paywall_view', {
      trigger: 'setal_limit',
      current_usage: { setales: 3, alertas: 1, zonas: 1 },
      variant: 'A' // o 'B' según A/B test
    });
  };
};
```

### 3. Pronóstico y Datos (`/datos`)

#### Eventos:
- **page_view**: Al cargar la página
- **weather_error**: Al fallar la Edge Function

#### Implementación:
```typescript
// En Datos.tsx
import { useAnalytics } from '@/hooks/useAnalytics';

const Datos = () => {
  const { logEvent, logPageView } = useAnalytics();
  
  useEffect(() => {
    logPageView('/datos', 'free');
  }, []);
  
  const handleWeatherError = (error: any) => {
    logEvent('weather_error', {
      status: error.status,
      source: 'edgeFn',
      error_message: error.message,
      timestamp: Date.now()
    });
  };
};
```

### 4. Alertas (`/alertas`)

#### Eventos:
- **page_view**: Al cargar la página
- **alert_create**: Al crear una alerta
- **paywall_view**: Al alcanzar límite de alertas

#### Implementación:
```typescript
// En Alertas.tsx
import { useAnalytics } from '@/hooks/useAnalytics';

const Alertas = () => {
  const { logEvent, logPageView } = useAnalytics();
  
  useEffect(() => {
    logPageView('/alertas', 'free');
  }, []);
  
  const handleNewAlert = () => {
    logEvent('alert_create', {
      alert_type: 'lluvia',
      location: 'Robledal de Soria',
      conditions: { rain: '>10mm' }
    });
  };
  
  const handlePaywallView = () => {
    logEvent('paywall_view', {
      trigger: 'alert_limit',
      current_usage: { setales: 2, alertas: 1, zonas: 1 },
      variant: 'A' // o 'B' según A/B test
    });
  };
};
```

### 5. Ajustes (`/ajustes`)

#### Eventos:
- **page_view**: Al cargar la página
- **upgrade_click**: Al hacer click en upgrade

#### Implementación:
```typescript
// En Ajustes.tsx
import { useAnalytics } from '@/hooks/useAnalytics';

const Ajustes = () => {
  const { logEvent, logPageView } = useAnalytics();
  
  useEffect(() => {
    logPageView('/ajustes', 'free');
  }, []);
  
  const handleUpgradeClick = () => {
    logEvent('upgrade_click', {
      source: 'settings',
      current_plan: 'free',
      variant: 'A' // o 'B' según A/B test
    });
  };
};
```

## A/B Testing de Paywall

### Variante A (Precio Bajo)
- **Precio**: 3,99€/mes
- **Copy**: "Desbloquea setales ilimitados y alertas avanzadas"

### Variante B (Precio Alto)
- **Precio**: 7,99€/mes
- **Copy**: "Desbloquea setales ilimitados y alertas avanzadas"

### Implementación:
```typescript
// En PaywallModal.tsx
const PaywallModal = ({ isOpen, onClose, trigger }) => {
  const [variant] = useState(() => {
    // Asignación persistente por usuario
    const stored = localStorage.getItem('paywall_variant');
    if (stored) return stored;
    
    const newVariant = Math.random() < 0.5 ? 'A' : 'B';
    localStorage.setItem('paywall_variant', newVariant);
    return newVariant;
  });
  
  const price = variant === 'A' ? '3,99€' : '7,99€';
  
  const handleUpgradeClick = () => {
    logEvent('upgrade_click', {
      variant,
      trigger,
      price: variant === 'A' ? 3.99 : 7.99
    });
  };
};
```

## Eventos Globales

### page_view
- **Props**: `page`, `user_type`, `timestamp`
- **Ubicación**: Todas las páginas en `useEffect`

### paywall_copy_variant
- **Props**: `variant`, `trigger`, `price`
- **Ubicación**: En cada `paywall_view`

### trial_start, trial_convert, trial_expire
- **Props**: `variant`, `trigger`, `days_used`
- **Ubicación**: En flujo de trial (futuro)
