# Activación de Lean Conversion

## Configuración de Feature Flags

### Archivo de Configuración
- **Ubicación**: `src/config/featureFlags.ts`
- **Variables de entorno**: `.env.local`

### Variables Principales

#### Flag Principal
```bash
VITE_ENABLE_LEAN=1  # Activa/desactiva toda la funcionalidad lean
```

#### Flags Individuales
```bash
VITE_ENABLE_DEMO_MODE=1    # Modo demo en mapa
VITE_ENABLE_GATING=1       # Gating de acciones
VITE_ENABLE_PAYWALL=1      # Paywall y límites
VITE_ENABLE_ANALYTICS=1    # Analytics y eventos
VITE_ENABLE_TOUR=1         # Tour de 3 pasos
```

#### Configuración de Demo
```bash
VITE_DEMO_DEFAULT_ON=1     # Demo activado por defecto
VITE_TOUR_STORAGE_KEY=demo_tour_completed
VITE_DEMO_MODE_STORAGE_KEY=demo_mode_enabled
```

#### A/B Testing
```bash
VITE_PAYWALL_VARIANT_A_PRICE=3.99
VITE_PAYWALL_VARIANT_B_PRICE=7.99
```

#### Analytics
```bash
VITE_ANALYTICS_ENABLED=1   # Analytics habilitado
VITE_ANALYTICS_DEBUG=1     # Debug en consola
```

## Cómo Activar/Desactivar

### Activar Lean Conversion
```bash
# En .env.local
VITE_ENABLE_LEAN=1
```

### Desactivar Lean Conversion
```bash
# En .env.local
VITE_ENABLE_LEAN=0
```

### Activar/Desactivar Funcionalidades Individuales
```bash
# Solo demo mode
VITE_ENABLE_LEAN=1
VITE_ENABLE_DEMO_MODE=1
VITE_ENABLE_GATING=0
VITE_ENABLE_PAYWALL=0

# Solo gating sin paywall
VITE_ENABLE_LEAN=1
VITE_ENABLE_GATING=1
VITE_ENABLE_PAYWALL=0
```

## Uso en Código

### Verificar Feature Flag
```typescript
import { isFeatureEnabled } from '@/config/featureFlags';

// Verificar si lean está habilitado
if (isFeatureEnabled('ENABLE_LEAN')) {
  // Código lean
}

// Verificar funcionalidad específica
if (isFeatureEnabled('ENABLE_DEMO_MODE')) {
  // Mostrar demo
}
```

### Verificar Múltiples Features
```typescript
import { areFeaturesEnabled } from '@/config/featureFlags';

if (areFeaturesEnabled(['ENABLE_LEAN', 'ENABLE_DEMO_MODE'])) {
  // Demo mode habilitado
}
```

### Acceso Directo a Flags
```typescript
import { FEATURE_FLAGS } from '@/config/featureFlags';

if (FEATURE_FLAGS.ENABLE_LEAN) {
  // Código lean
}
```

## Estados de Activación

### ENABLE_LEAN=0 (Desactivado)
- ❌ No se muestra marca de agua DEMO
- ❌ No hay gating de acciones
- ❌ No aparece paywall
- ❌ No se ejecuta tour
- ❌ No se registran eventos de analytics
- ✅ App funciona exactamente igual que antes

### ENABLE_LEAN=1 (Activado)
- ✅ Marca de agua DEMO en mapa
- ✅ Gating de acciones (crear setal, alertas)
- ✅ Paywall en límites (4º setal, 2ª alerta)
- ✅ Tour de 3 pasos en primera visita
- ✅ Analytics y eventos
- ✅ Contadores de límites
- ✅ A/B testing de precios

## Verificación

### Verificar que ENABLE_LEAN=0 no cambia nada
1. **Cambiar flag**: `VITE_ENABLE_LEAN=0`
2. **Reiniciar servidor**: `npm run dev`
3. **Verificar**:
   - Navegación funciona igual
   - No aparece marca de agua DEMO
   - No hay gating en botones
   - No aparece paywall
   - No se ejecuta tour
   - Console no muestra eventos de analytics

### Verificar que ENABLE_LEAN=1 activa funcionalidades
1. **Cambiar flag**: `VITE_ENABLE_LEAN=1`
2. **Reiniciar servidor**: `npm run dev`
3. **Verificar**:
   - Marca de agua DEMO visible en mapa
   - Gating funciona en botones
   - Paywall aparece en límites
   - Tour se ejecuta en primera visita
   - Console muestra eventos de analytics

## Troubleshooting

### Flag no se aplica
- Verificar que el archivo es `.env.local` (no `.env`)
- Reiniciar servidor de desarrollo
- Verificar que la variable empieza con `VITE_`

### Funcionalidad no aparece
- Verificar que `ENABLE_LEAN=1`
- Verificar que la funcionalidad específica está en `1`
- Revisar console para errores
- Verificar que el código usa `isFeatureEnabled()`

### Performance
- Los flags se evalúan en build time
- No hay overhead en runtime
- Flags desactivados no se incluyen en el bundle final
