# Especificación - Página /explore

## User Stories

### Como visitante anónimo
- **Quiero** explorar un mapa interactivo con datos de setas
- **Para** entender el valor de la aplicación antes de registrarme
- **Criterio de éxito**: Puedo ver heatmap y setales de ejemplo sin registro

### Como visitante anónimo
- **Quiero** hacer click en setales para ver información
- **Para** aprender sobre diferentes especies y ubicaciones
- **Criterio de éxito**: Popup muestra detalles del setal

### Como visitante anónimo
- **Quiero** intentar crear un setal
- **Para** experimentar la funcionalidad principal
- **Criterio de éxito**: Modal de registro aparece con beneficios claros

### Como visitante anónimo
- **Quiero** ver un tour guiado
- **Para** entender cómo usar la aplicación
- **Criterio de éxito**: Tour de 3 pasos se ejecuta automáticamente

## Gating Demo

### Acceso Libre
- Visualización del mapa
- Heatmap de datos micológicos
- Setales de ejemplo (coordenadas difusas)
- Información de especies
- Tour guiado

### Acciones Bloqueadas
- Crear setal → Modal de registro
- Editar setal → Modal de registro
- Eliminar setal → Modal de registro
- Configurar alertas → Modal de registro
- Guardar zonas favoritas → Modal de registro

### Indicadores Visuales
- Marca de agua "DEMO" en mapa
- Pins naranjas para setales demo
- Tooltips en botones bloqueados
- Banner superior "Modo demo"

## Flujos

### Flujo Principal: Exploración
1. Usuario accede a /explore
2. Se carga mapa con heatmap y setales demo
3. Tour de 3 pasos se inicia automáticamente
4. Usuario puede explorar libremente
5. Acciones bloqueadas muestran modal de registro

### Flujo de Registro
1. Usuario hace click en acción bloqueada
2. Modal de registro aparece
3. Usuario puede registrarse o cerrar modal
4. Si se registra → onboarding → /app/home
5. Si cierra → vuelve al demo

### Flujo de Tour
1. Tour se inicia automáticamente
2. Paso 1: "Explora el mapa" (3 segundos)
3. Paso 2: "Haz click en un pin" (hasta click)
4. Paso 3: "Crea tu cuenta" (hasta click)
5. Usuario puede saltar con Escape

## Estados de la Página

### Loading
- Skeleton del mapa
- Spinner de carga
- "Cargando datos micológicos..."

### Error
- Mensaje de error
- Botón "Reintentar"
- Fallback a datos estáticos

### Demo Activo
- Mapa con heatmap
- Setales demo visibles
- Marca de agua "DEMO"
- Tour disponible

### Tour en Progreso
- Overlay con pasos
- Botón "Saltar tour"
- Navegación por teclado (Escape)

## Datos Demo

### Setales de Ejemplo
- 10-15 setales distribuidos por España
- Coordenadas difusas (±0.01 grados)
- Información realista de especies
- Fechas de creación variadas

### Heatmap
- Datos sintéticos basados en patrones reales
- Colores: Verde (bajo) → Amarillo (medio) → Rojo (alto)
- Actualización cada 6 horas
- Cobertura de toda España

### Especies
- Boletus edulis
- Lactarius deliciosus
- Cantharellus cibarius
- Amanita caesarea
- Tricholoma matsutake

## Interacciones

### Mapa
- Zoom/pan libre
- Click en setales → popup
- Click en mapa → acción bloqueada
- Hover en setales → tooltip

### Popup de Setal
- Título y descripción
- Especie y fecha
- Coordenadas (difusas)
- Botón "Crear cuenta" (si no registrado)

### Tour
- Navegación automática
- Click para avanzar
- Escape para saltar
- Indicadores de progreso

## Responsive

### Desktop (1024px+)
- Mapa a pantalla completa
- Sidebar con información
- Tour en overlay

### Tablet (768px-1023px)
- Mapa principal
- Sidebar colapsable
- Tour adaptado

### Móvil (320px-767px)
- Mapa a pantalla completa
- Sidebar como drawer
- Tour simplificado
- Touch targets 44px+
