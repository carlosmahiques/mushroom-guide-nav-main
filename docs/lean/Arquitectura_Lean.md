# Arquitectura Lean - Setas.AI

## Rutas Mínimas

### Públicas
- `/` - Landing (CTA → /explore o /auth/register)
- `/explore` - Demo público (solo lectura)
- `/auth/login` - Login
- `/auth/register` - Registro

### Protegidas (/app/*)
- `/app/home` - Dashboard principal
- `/app/setales` - Lista de setales del usuario
- `/app/alertas` - Gestión de alertas
- `/app/perfil` - Configuración de usuario

## Pestañas en /app

### Layout Principal
```
/app
├── Home (Dashboard)
├── Setales (Lista + CRUD)
├── Alertas (Lista + CRUD)
└── Perfil (Configuración)
```

### Navegación
- Sidebar fijo con 4 pestañas principales
- Toggle "Mostrar demo" en sidebar (persistente entre sesiones)
- Contador de límites dinámico en header (ej: "FREE 3/3 setales", "PRO ∞ setales")

## Modales

### Onboarding
- Modal de 2 pasos (no 3)
- Botón "Saltar por ahora" en cada paso
- Valores por defecto si se salta

### Paywall
- Modal suave al alcanzar límites
- 2 variantes de precio (A/B test)
- Opción "Continuar gratis"

### CRUD
- Modal para crear/editar setal
- Modal para crear/editar alerta
- Confirmación de eliminación

## Providers Globales

### AuthProvider
- Estado de autenticación
- Datos del usuario
- Métodos de login/logout

### LimitsProvider
- Contadores de uso (setales, zonas, alertas)
- Lógica de paywall
- Validación de límites
- Configuración central de límites por plan
- Cálculo de "quedan X para el límite" para nudges suaves

### DemoProvider
- Estado del toggle demo
- Datos demo vs reales
- Marca de agua y coordenadas difusas

### AnalyticsProvider
- Tracking de eventos
- A/B testing
- Métricas de conversión

## Estructura de Datos

### Usuario
```typescript
interface User {
  id: string;
  email: string;
  onboarding_completed: boolean;
  plan: 'free' | 'pro';
  created_at: string;
}
```

### Setal
```typescript
interface Setal {
  id: string;
  name: string;
  description?: string;
  lat: number;
  lng: number;
  user_id: string;
  created_at: string;
  is_demo?: boolean;
}
```

### Alerta
```typescript
interface Alerta {
  id: string;
  name: string;
  zona: string;
  especie: string;
  condiciones: object;
  user_id: string;
  is_active: boolean;
  created_at: string;
}
```

## Flujo de Navegación

### Usuario Anónimo
1. Landing → CTA "Probar demo" → /explore
2. En /explore: acciones bloqueadas → modal registro
3. Registro → onboarding → /app/home

### Usuario Registrado
1. Login → /app/home
2. Navegación libre entre pestañas
3. Límites visibles en header
4. Paywall al alcanzar límites

### Usuario Pro
1. Acceso ilimitado a todas las funciones
2. Sin paywall
3. Funciones avanzadas desbloqueadas
