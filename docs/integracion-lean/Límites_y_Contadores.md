# Límites y Contadores - Integración Lean

## Configuración de Límites

### FREE Plan
- **Setales**: 3 máximo
- **Zonas**: 1 máximo (si aplica)
- **Alertas**: 1 máximo

### PRO Plan
- **Setales**: Ilimitado
- **Zonas**: Ilimitado
- **Alertas**: Ilimitado

## Inyección Visual de Contadores

### 1. Mis Sétales (`/setales`)

#### Ubicación del contador:
- **Archivo**: `src/pages/Setales.tsx`
- **Posición**: Header, junto al título (línea 36-45)
- **Formato**: "3/3 setales" o "∞ setales" (PRO)

#### Implementación:
```typescript
// En Setales.tsx
import { useLimits } from '@/hooks/useLimits';

const Setales = () => {
  const { currentUsage, limits, plan } = useLimits();
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Pin className="h-8 w-8 text-primary" />
          Mis sétales
          <span className="text-sm font-normal text-muted-foreground">
            ({currentUsage.setales}/{limits.setales === Infinity ? '∞' : limits.setales})
          </span>
        </h1>
        {/* Resto del contenido */}
      </div>
    </div>
  );
};
```

### 2. Alertas (`/alertas`)

#### Ubicación del contador:
- **Archivo**: `src/pages/Alertas.tsx`
- **Posición**: Header, junto al título (línea 64-77)
- **Formato**: "1/1 alertas" o "∞ alertas" (PRO)

#### Implementación:
```typescript
// En Alertas.tsx
import { useLimits } from '@/hooks/useLimits';

const Alertas = () => {
  const { currentUsage, limits, plan } = useLimits();
  
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Bell className="h-8 w-8 text-accent" />
          Alertas
          <span className="text-sm font-normal text-muted-foreground">
            ({currentUsage.alertas}/{limits.alertas === Infinity ? '∞' : limits.alertas})
          </span>
        </h1>
        {/* Resto del contenido */}
      </div>
    </div>
  );
};
```

### 3. Nudges Suaves

#### Ubicación:
- **Archivo**: `src/components/ui/LimitNudge.tsx` (nuevo)
- **Trigger**: Cuando quedan 1 o 2 para el límite
- **Estilo**: Badge suave con color de advertencia

#### Implementación:
```typescript
// En Setales.tsx y Alertas.tsx
import { LimitNudge } from '@/components/ui/LimitNudge';

const Setales = () => {
  const { remaining } = useLimits();
  
  return (
    <div>
      {/* Header existente */}
      {remaining.setales <= 2 && remaining.setales > 0 && (
        <LimitNudge 
          type="setales" 
          remaining={remaining.setales}
          onUpgrade={() => {/* Abrir paywall */}}
        />
      )}
    </div>
  );
};
```

## Triggers de Paywall

### 1. 4º Setal

#### Ubicación:
- **Archivo**: `src/hooks/useMapData.tsx` (función `addSpot`)
- **Trigger**: `currentUsage.setales >= 3`
- **Modal**: `PaywallModal` con `trigger="setal_limit"`

#### Implementación:
```typescript
// En useMapData.tsx
const addSpot = async (spotData) => {
  const { currentUsage, limits } = useLimits();
  
  if (currentUsage.setales >= limits.setales) {
    // Abrir paywall
    setPaywallModal({ 
      isOpen: true, 
      trigger: 'setal_limit',
      action: 'create_setal'
    });
    return;
  }
  
  // Crear setal normalmente
};
```

### 2. 2ª Alerta

#### Ubicación:
- **Archivo**: `src/hooks/useAlerts.tsx` (función `createAlert`)
- **Trigger**: `currentUsage.alertas >= 1`
- **Modal**: `PaywallModal` con `trigger="alert_limit"`

#### Implementación:
```typescript
// En useAlerts.tsx
const createAlert = async (alertData) => {
  const { currentUsage, limits } = useLimits();
  
  if (currentUsage.alertas >= limits.alertas) {
    // Abrir paywall
    setPaywallModal({ 
      isOpen: true, 
      trigger: 'alert_limit',
      action: 'create_alert'
    });
    return;
  }
  
  // Crear alerta normalmente
};
```

## Hook useLimits

```typescript
// src/hooks/useLimits.tsx
interface LimitsHook {
  currentUsage: { setales: number; alertas: number; zonas: number };
  limits: { setales: number; alertas: number; zonas: number };
  remaining: { setales: number; alertas: number; zonas: number };
  plan: 'free' | 'pro';
  isAtLimit: (type: 'setales' | 'alertas' | 'zonas') => boolean;
}

const useLimits = (): LimitsHook => {
  const { user } = useAuth();
  const [currentUsage, setCurrentUsage] = useState({ setales: 0, alertas: 0, zonas: 0 });
  
  const plan = user?.plan || 'free';
  const limits = plan === 'pro' ? PRO_LIMITS : FREE_LIMITS;
  
  const remaining = {
    setales: Math.max(0, limits.setales - currentUsage.setales),
    alertas: Math.max(0, limits.alertas - currentUsage.alertas),
    zonas: Math.max(0, limits.zonas - currentUsage.zonas),
  };
  
  const isAtLimit = (type: keyof typeof limits) => {
    return currentUsage[type] >= limits[type];
  };
  
  return { currentUsage, limits, remaining, plan, isAtLimit };
};
```

## PaywallModal con A/B Testing

```typescript
// src/components/ui/PaywallModal.tsx
const PaywallModal = ({ isOpen, onClose, trigger }) => {
  const [variant] = useState(() => 
    Math.random() < 0.5 ? 'A' : 'B'
  );
  
  const price = variant === 'A' ? '3,99€' : '7,99€';
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¡Has alcanzado el límite gratuito!</DialogTitle>
          <DialogDescription>
            Desbloquea setales ilimitados y alertas avanzadas
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{price}/mes</div>
            <p className="text-sm text-muted-foreground">Primeros 7 días gratis</p>
          </div>
          
          <Button 
            onClick={() => handleUpgrade(variant)}
            className="w-full"
          >
            Desbloquear Pro - {price}/mes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
```
