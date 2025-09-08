# Demo Overlay y Tour - Integración Lean

## Alcance: Solo Mapa Interactivo

### 1. Marca de Agua DEMO

#### Ubicación:
- **Archivo**: `src/components/MapViewLeaflet.tsx`
- **Posición**: Esquina superior derecha del mapa
- **Estilo**: `absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded text-sm font-semibold opacity-70`

#### Implementación:
```typescript
// En MapViewLeaflet.tsx
const isDemoMode = useDemoMode(); // Hook a crear

{isDemoMode && (
  <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded text-sm font-semibold opacity-70 z-50">
    DEMO
  </div>
)}
```

### 2. Pins Demo Difusos

#### Ubicación:
- **Archivo**: `src/components/MapViewLeaflet.tsx`
- **Coordenadas**: Desplazamiento ±0.01 grados
- **Color**: Naranja (#FF6B35)
- **Tooltip**: "Setal de ejemplo"

#### Implementación:
```typescript
// En MapViewLeaflet.tsx
const demoMarkers = useDemoMarkers(); // Hook a crear

{demoMarkers.map((marker, index) => (
  <Marker
    key={`demo-${index}`}
    position={[marker.lat, marker.lng]}
    icon={demoIcon}
  >
    <Popup>
      <div>
        <h3>{marker.name}</h3>
        <p>{marker.description}</p>
        <p className="text-xs text-gray-500">Setal de ejemplo</p>
      </div>
    </Popup>
  </Marker>
))}
```

### 3. Tour de 3 Pasos

#### Ubicación:
- **Archivo**: `src/components/tour/DemoTour.tsx` (nuevo)
- **Trigger**: Automático en primera visita
- **Persistencia**: `localStorage.getItem('demo_tour_completed')`

#### Pasos:
1. **"Explora el mapa"** - Señala el mapa
2. **"Haz click en un pin"** - Señala un pin demo
3. **"Crea tu cuenta"** - Señala CTA de registro

#### Implementación:
```typescript
// En Mapa.tsx
import { DemoTour } from '@/components/tour/DemoTour';

const Mapa = () => {
  return (
    <div>
      {/* Contenido existente */}
      <DemoTour />
    </div>
  );
};
```

### 4. CTA Fijo "Crear cuenta gratis"

#### Ubicación:
- **Archivo**: `src/components/ui/CtaRegister.tsx` (nuevo)
- **Posición**: `absolute bottom-6 right-6 z-40`
- **Estilo**: Botón flotante con gradiente

#### Implementación:
```typescript
// En Mapa.tsx
import { CtaRegister } from '@/components/ui/CtaRegister';

const Mapa = () => {
  return (
    <div className="relative">
      {/* Contenido existente */}
      <CtaRegister />
    </div>
  );
};
```

### 5. Tooltips en Botones Bloqueados

#### Ubicación:
- **Archivo**: `src/components/ui/Tooltip.tsx` (existente)
- **Trigger**: Hover en botones bloqueados
- **Copy**: "Regístrate para crear setales"

#### Implementación:
```typescript
// En Mapa.tsx
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const Mapa = () => {
  const { isBlocked } = useGatedAction();
  
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button 
            disabled={isBlocked('create_setal')}
            onClick={handleNewSetal}
          >
            Nuevo sétal
          </Button>
        </TooltipTrigger>
        {isBlocked('create_setal') && (
          <TooltipContent>
            <p>Regístrate para crear setales</p>
          </TooltipContent>
        )}
      </Tooltip>
    </TooltipProvider>
  );
};
```

## Hooks Necesarios

### useDemoMode
```typescript
const useDemoMode = () => {
  const { user } = useAuth();
  const [demoEnabled, setDemoEnabled] = useState(true);
  
  return !user || demoEnabled;
};
```

### useDemoMarkers
```typescript
const useDemoMarkers = () => {
  return [
    {
      name: "Boletus en Sierra de Guadarrama",
      description: "Zona rica en boletus edulis",
      lat: 40.7168, // Coordenada difusa
      lng: -3.9038, // Coordenada difusa
    },
    // ... más marcadores demo
  ];
};
```

## Persistencia

### Tour Completado
- **Clave**: `demo_tour_completed`
- **Valor**: `'true'`
- **Ubicación**: `localStorage`

### Demo Mode
- **Clave**: `demo_mode_enabled`
- **Valor**: `'true'` | `'false'`
- **Ubicación**: `localStorage`
- **Por defecto**: `true` para usuarios nuevos
