# Wireframe - Página /explore

## Layout Principal

### Header
```
[Logo Setas.AI]                    [Crear cuenta] [Iniciar sesión]
```

### Contenido Principal
```
┌─────────────────────────────────────────────────────────────────┐
│ [Banner: "Modo demo - Explora setales de ejemplo"]             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │                    MAPA INTERACTIVO                     │   │
│  │                                                         │   │
│  │  [DEMO]                                                 │   │
│  │                                                         │   │
│  │  🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴   │   │
│  │  🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴   │   │
│  │  🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴   │   │
│  │  🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Tour: Paso 1/3 - "Explora el mapa"]                          │
│  [Saltar tour] [Siguiente]                                     │
└─────────────────────────────────────────────────────────────────┘
```

## Estados

### Loading
```
┌─────────────────────────────────────────────────────────────────┐
│ [Banner: "Cargando datos micológicos..."]                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │                    [SKELETON MAPA]                      │   │
│  │                                                         │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │   │
│  │  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  [Spinner] Cargando...                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Error
```
┌─────────────────────────────────────────────────────────────────┐
│ [Banner: "Error al cargar datos"]                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │                    [MAPA VACÍO]                         │   │
│  │                                                         │   │
│  │  ⚠️  No se pudieron cargar los datos                    │   │
│  │                                                         │   │
│  │  [Reintentar]                                           │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Tour en Progreso
```
┌─────────────────────────────────────────────────────────────────┐
│ [Banner: "Modo demo - Explora setales de ejemplo"]             │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                                                         │   │
│  │                    MAPA INTERACTIVO                     │   │
│  │                                                         │   │
│  │  [DEMO]                                                 │   │
│  │                                                         │   │
│  │  🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴   │   │
│  │  🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴   │   │
│  │  🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴   │   │
│  │  🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴 🔴   │   │
│  │                                                         │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ [Tour Overlay]                                          │   │
│  │                                                         │   │
│  │  Paso 1/3: "Explora el mapa"                            │   │
│  │  Aquí puedes ver dónde crecen las setas en tiempo real  │   │
│  │                                                         │   │
│  │  [Saltar tour] [Siguiente]                              │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

## CTAs

### Botones Principales
- **"Crear cuenta"** (header) - Verde, 44px altura
- **"Iniciar sesión"** (header) - Transparente, 44px altura
- **"Crear cuenta"** (popup setal) - Verde, 40px altura
- **"Reintentar"** (error) - Azul, 40px altura

### Botones Secundarios
- **"Saltar tour"** - Gris, 32px altura
- **"Siguiente"** (tour) - Azul, 32px altura
- **"Cerrar"** (modal) - Gris, 32px altura

## Accesibilidad

### Navegación por Teclado
- Tab order: Header → Mapa → Tour → CTAs
- Escape: Cierra tour/modal
- Enter/Space: Activa botones
- Flechas: Navega en mapa

### Screen Readers
- Marca de agua: aria-label="Modo demo activado"
- Pins demo: aria-label="Setal de ejemplo"
- Tour: aria-live="polite" para anuncios
- Botones: labels descriptivos

### Contraste
- Texto: WCAG AA (4.5:1)
- Botones: WCAG AA (3:1)
- Marca de agua: WCAG AA (3:1)
- Pins: Contraste suficiente

### Touch Targets
- Móvil: 44px mínimo
- Tablet: 40px mínimo
- Desktop: 32px mínimo

## Responsive Breakpoints

### Desktop (1024px+)
- Mapa: 100% width, 70vh height
- Sidebar: 300px width
- Tour: Overlay completo

### Tablet (768px-1023px)
- Mapa: 100% width, 60vh height
- Sidebar: Colapsable
- Tour: Overlay adaptado

### Móvil (320px-767px)
- Mapa: 100% width, 50vh height
- Sidebar: Drawer
- Tour: Overlay simplificado
- Botones: 44px altura
