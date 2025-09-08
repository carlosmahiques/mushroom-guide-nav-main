# Gating Global - Integración Lean

## Hook useGatedAction

### Contrato
```typescript
interface GatedActionHook {
  gatedAction: (actionName: string, context?: any) => boolean;
  isBlocked: (actionName: string) => boolean;
  getBlockReason: (actionName: string) => 'no_session' | 'demo_mode' | 'limit_reached' | null;
}

const useGatedAction = (): GatedActionHook
```

### Comportamientos
- **Sin sesión**: Abre `RegisterModal` con copy de registro
- **Demo mode**: Abre `RegisterModal` con copy de demo
- **Límite alcanzado**: Abre `PaywallModal` con A/B testing de precio
- **Permitido**: Retorna `true` y permite la acción

## Integración por Página

### 1. Mapa Interactivo (`/mapa`)

#### Ubicaciones de gating:
- **Botón "Nuevo sétal"** (línea 26): `gatedAction('create_setal')`
- **Click en mapa** (MapViewLeaflet): `gatedAction('create_setal')`
- **Editar setal** (popup): `gatedAction('edit_setal')`
- **Eliminar setal** (popup): `gatedAction('delete_setal')`

#### Implementación:
```typescript
// En Mapa.tsx
const { gatedAction } = useGatedAction();

const handleNewSetal = () => {
  if (gatedAction('create_setal')) {
    setPlacing(true);
  }
};

// En MapViewLeaflet.tsx
const handleMapClick = (lat: number, lng: number) => {
  if (gatedAction('create_setal', { coordinates: { lat, lng } })) {
    // Crear setal
  }
};
```

### 2. Mis Sétales (`/setales`)

#### Ubicaciones de gating:
- **Botón "Añadir localización"** (línea 47): `gatedAction('create_setal')`
- **4º setal**: Trigger automático de paywall

#### Implementación:
```typescript
// En Setales.tsx
const { gatedAction } = useGatedAction();

const handleAddLocation = () => {
  if (gatedAction('create_setal')) {
    // Navegar a mapa o abrir modal
  }
};
```

### 3. Alertas (`/alertas`)

#### Ubicaciones de gating:
- **Botón "Nueva alerta"** (línea 74): `gatedAction('create_alert')`
- **2ª alerta**: Trigger automático de paywall

#### Implementación:
```typescript
// En Alertas.tsx
const { gatedAction } = useGatedAction();

const handleNewAlert = () => {
  if (gatedAction('create_alert')) {
    // Abrir modal de nueva alerta
  }
};
```

### 4. Pronóstico y Datos (`/datos`)

#### Sin gating específico
- Página de solo lectura, no requiere gating

### 5. Ajustes (`/ajustes`)

#### Ubicaciones de gating:
- **Botón "Exportar datos"** (línea 185): `gatedAction('export_data')`
- **Funciones Pro**: Gating para funciones avanzadas

## Modales de Gating

### RegisterModal
- **Trigger**: Sin sesión o demo mode
- **Copy**: "¡Crea tu cuenta gratis!" + beneficios
- **CTA**: "Crear cuenta" → navegar a `/auth`

### PaywallModal
- **Trigger**: Límite alcanzado
- **Copy**: "¡Has alcanzado el límite gratuito!"
- **A/B Testing**: 2 variantes de precio
- **CTA**: "Desbloquear Pro" + "Continuar con límites"

## Estados de Gating

### Sin Sesión
- Todas las acciones → RegisterModal
- Copy: "Regístrate para guardar tus setales"

### Demo Mode
- Todas las acciones → RegisterModal
- Copy: "Crea tu cuenta para guardar tus propios setales"

### Límite Alcanzado
- Acciones específicas → PaywallModal
- Copy: "Has alcanzado el límite de X setales/alertas"

### Usuario Pro
- Todas las acciones permitidas
- Sin gating
