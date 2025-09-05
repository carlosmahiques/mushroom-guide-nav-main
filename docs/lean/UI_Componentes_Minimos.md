# UI Componentes Mínimos - Setas.AI

## AuthGuard

### Responsabilidades
- Proteger rutas que requieren autenticación
- Redirigir a /auth/login si no hay sesión
- Verificar estado de onboarding
- Manejar tokens expirados

### Props
```typescript
interface AuthGuardProps {
  children: React.ReactNode;
  requireOnboarding?: boolean;
  redirectTo?: string;
}
```

### Comportamiento
- Check de autenticación en cada render
- Loading state mientras verifica
- Redirección automática si no autenticado

## PaywallModal

### Responsabilidades
- Mostrar límites alcanzados
- Presentar beneficios del plan Pro
- Manejar A/B testing de precios
- Procesar upgrade a Pro

### Props
```typescript
interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: 'setal' | 'zona' | 'alerta';
  onUpgrade: () => void;
}
```

### Estados
- Loading durante upgrade
- Success/error después de upgrade
- Variante de precio (A o B)

## DemoGate

### Responsabilidades
- Controlar acceso a funciones demo
- Mostrar modal de registro para acciones bloqueadas
- Manejar toggle demo/real
- Aplicar coordenadas difusas

### Props
```typescript
interface DemoGateProps {
  children: React.ReactNode;
  action: 'create' | 'edit' | 'delete';
  onBlocked: () => void;
}
```

### Comportamiento
- Bloquea acciones en modo demo
- Muestra modal de registro
- Permite continuar en modo real

## Map

### Responsabilidades
- Renderizar mapa interactivo
- Mostrar setales (demo + reales)
- Aplicar marca de agua en demo
- Manejar coordenadas difusas

### Props
```typescript
interface MapProps {
  setales: Setal[];
  isDemo: boolean;
  onSetalClick: (setal: Setal) => void;
  onMapClick: (lat: number, lng: number) => void;
  height?: string;
}
```

### Funcionalidades
- Zoom/pan
- Click para crear setal
- Popup de setales
- Marca de agua demo

## SetalList

### Responsabilidades
- Listar setales del usuario
- Mostrar contador de límites
- Manejar CRUD de setales
- Aplicar filtros y búsqueda

### Props
```typescript
interface SetalListProps {
  setales: Setal[];
  onEdit: (setal: Setal) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  limits: Limits;
}
```

### Estados
- Empty state (0 setales)
- Loading state
- Error state
- Lista con setales

## SetalModal

### Responsabilidades
- Crear/editar setales
- Validar formulario
- Manejar coordenadas
- Aplicar límites

### Props
```typescript
interface SetalModalProps {
  isOpen: boolean;
  onClose: () => void;
  setal?: Setal; // undefined para crear
  onSave: (setal: Partial<Setal>) => void;
  limits: Limits;
}
```

### Validaciones
- Nombre: 3-40 caracteres
- Descripción: 0-140 caracteres
- Coordenadas: válidas
- Límites: no exceder máximo

## AlertList

### Responsabilidades
- Listar alertas del usuario
- Mostrar estado activo/inactivo
- Manejar CRUD de alertas
- Mostrar próximas notificaciones

### Props
```typescript
interface AlertListProps {
  alertas: Alerta[];
  onEdit: (alerta: Alerta) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
  limits: Limits;
}
```

### Estados
- Empty state (0 alertas)
- Lista con alertas
- Estado de cada alerta

## AlertModal

### Responsabilidades
- Crear/editar alertas
- Configurar condiciones
- Validar formulario
- Aplicar límites

### Props
```typescript
interface AlertModalProps {
  isOpen: boolean;
  onClose: () => void;
  alerta?: Alerta; // undefined para crear
  onSave: (alerta: Partial<Alerta>) => void;
  limits: Limits;
}
```

### Configuraciones
- Zona de seguimiento
- Especie objetivo
- Condiciones meteorológicas
- Frecuencia de notificación

## Toasts

### Responsabilidades
- Mostrar mensajes de éxito/error
- Confirmar acciones
- Notificar límites
- Feedback de usuario

### Tipos
```typescript
type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

### Mensajes Comunes
- "Setal guardado correctamente"
- "Alerta configurada"
- "Has alcanzado el límite de setales"
- "Error al guardar"

## Analytics/Experiment

### Responsabilidades
- Trackear eventos de usuario
- Manejar A/B testing
- Medir conversión
- Enviar métricas

### Eventos
```typescript
interface AnalyticsEvent {
  name: string;
  properties: Record<string, any>;
  timestamp: number;
  userId?: string;
}
```

### A/B Testing
- Asignación de variantes
- Persistencia de asignación
- Medición de conversión
- Reportes de resultados

## Estructura de Componentes

```
src/components/
├── auth/
│   └── AuthGuard.tsx
├── paywall/
│   └── PaywallModal.tsx
├── demo/
│   └── DemoGate.tsx
├── map/
│   └── Map.tsx
├── setales/
│   ├── SetalList.tsx
│   └── SetalModal.tsx
├── alertas/
│   ├── AlertList.tsx
│   └── AlertModal.tsx
├── ui/
│   └── Toasts.tsx
└── analytics/
    └── Experiment.tsx
```

## Dependencias Mínimas

### UI
- React 18+
- TypeScript
- Tailwind CSS
- Headless UI (modales)

### Mapas
- Leaflet
- React Leaflet

### Estado
- React Context
- Local Storage

### Analytics
- PostHog o similar
- A/B testing nativo

## Inicializar repositorio Git

```bash
# Inicializar repositorio Git
git init

# Añadir todos los archivos
git add .

# Hacer el primer commit
git commit -m "feat: Inicializar proyecto Setas.AI con blueprint completo

- Configuración inicial del proyecto
- Blueprint de producto en docs/lean/
- Especificación de página /explore
- Documentación de componentes y analytics
- Arquitectura y flujos de usuario definidos"
```

## Configurar Git (si no está configurado)

```bash
# Configurar usuario (si no está configurado)
git config user.name "Tu Nombre"
git config user.email "tu@email.com"

# Ver configuración
git config --list
```

## Opcional: Conectar con repositorio remoto

Si quieres subirlo a GitHub/GitLab:

```bash
# Añadir repositorio remoto
git remote add origin https://github.com/tu-usuario/mushroom-guide-nav.git

# Subir al repositorio remoto
git push -u origin main
```

## Verificar el estado después de inicializar

```bash
# Ver estado
git status

# Ver historial
git log --oneline

# Ver archivos trackeados
git ls-files
```

## Crear .gitignore (recomendado)

Crea un archivo `.gitignore` en la raíz del proyecto:

```bash
# Crear .gitignore
touch .gitignore
```

Y añade este contenido al `.gitignore`:

```
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Build outputs
dist/
build/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
```

¿Quieres que te ayude a crear el `.gitignore` o prefieres inicializar Git primero?
