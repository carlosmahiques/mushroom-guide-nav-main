# Demo Experiencia - Setas.AI

## Marca de Agua DEMO

### Ubicación
- Esquina superior derecha del mapa
- Opacidad: 0.7
- Color: #666666
- Tamaño: 24px
- Fuente: Arial, bold

### Comportamiento
- Siempre visible en modo demo
- No interfiere con la interacción del mapa
- Se oculta en modo real (usuario logueado)

## Pins Difusos

### Coordenadas Demo
- **Desplazamiento**: ±0.01 grados (≈1km)
- **Algoritmo**: Coordenada original + random(-0.01, +0.01)
- **Aplicación**: Solo a setales demo, no a los reales del usuario

### Visualización
- **Color**: Naranja (#FF6B35)
- **Tamaño**: 20px
- **Icono**: Pin genérico (no personalizado)
- **Tooltip**: "Setal de ejemplo"

### Datos Demo
```typescript
interface DemoSetal {
  id: string;
  name: string;
  description: string;
  lat: number; // Coordenada difusa
  lng: number; // Coordenada difusa
  is_demo: true;
  created_at: string;
}
```

## Tour de 3 Pasos

### Paso 1: "Explora el mapa"
- **Target**: Mapa principal
- **Mensaje**: "Aquí puedes ver dónde crecen las setas en tiempo real"
- **Acción**: Usuario puede hacer zoom/pan
- **Duración**: 3 segundos

### Paso 2: "Haz click en un pin"
- **Target**: Pin naranja más cercano
- **Mensaje**: "Haz click para ver detalles del setal"
- **Acción**: Usuario hace click en pin
- **Duración**: Hasta que usuario haga click

### Paso 3: "Crea tu cuenta"
- **Target**: Botón "Crear cuenta"
- **Mensaje**: "Regístrate para guardar tus propios setales"
- **Acción**: Usuario hace click en registro
- **Duración**: Hasta que usuario haga click

## Comportamiento de Acciones Bloqueadas

### Botones Deshabilitados
- **Estado visual**: Opacidad 0.5, cursor not-allowed
- **Tooltip**: "Regístrate para crear setales"
- **Hover**: Mensaje de registro

### Acciones Bloqueadas
- Crear setal
- Editar setal existente
- Eliminar setal
- Configurar alertas
- Guardar zonas favoritas

### Modal de Registro
- **Trigger**: Click en acción bloqueada
- **Contenido**: Beneficios de registrarse
- **CTA**: "Crear cuenta gratis"
- **Alternativa**: "Cerrar" (vuelve al demo)

## Toggle Demo/Real

### Ubicación
- Sidebar izquierdo
- Debajo del menú principal
- Checkbox con label "Mostrar datos demo"
- **Persistencia**: Se recuerda entre sesiones (localStorage)

### Comportamiento
- **Activado**: Muestra setales demo + reales
- **Desactivado**: Solo setales reales del usuario
- **Por defecto**: Activado para usuarios nuevos

### Indicadores Visuales
- **Demo activado**: Marca de agua visible, pins naranjas
- **Demo desactivado**: Sin marca de agua, solo pins azules

## Datos Demo

### Setales de Ejemplo
```typescript
const DEMO_SETALES = [
  {
    name: "Boletus en Sierra de Guadarrama",
    description: "Zona rica en boletus edulis",
    lat: 40.7168, // Coordenada difusa
    lng: -3.9038, // Coordenada difusa
    especie: "Boletus edulis"
  },
  {
    name: "Lactarius en Picos de Europa",
    description: "Encontrado cerca del refugio",
    lat: 43.2168, // Coordenada difusa
    lng: -4.9038, // Coordenada difusa
    especie: "Lactarius deliciosus"
  }
  // ... más ejemplos
];
```

### Heatmap Demo
- Datos sintéticos basados en patrones reales
- Actualización cada 6 horas
- Colores: Verde (bajo) → Amarillo (medio) → Rojo (alto)

## Transición Demo → Real

### Al Registrarse
- Tour de 3 pasos se ejecuta
- Toggle demo se activa por defecto
- Usuario ve sus datos + demo

### Al Desactivar Demo
- Mensaje: "Ahora solo ves tus setales personales"
- Opción: "¿Quieres activar el demo de nuevo?"

### Al Activar Demo
- Mensaje: "Ahora ves tus setales + datos de ejemplo"
- Marca de agua aparece
- Pins demo se muestran

## Accesibilidad

### Screen Readers
- Marca de agua tiene aria-label: "Modo demo activado"
- Pins demo tienen aria-label: "Setal de ejemplo"
- Toggle tiene label descriptivo

### Navegación por Teclado
- **Tour se puede saltar con Escape** (accesibilidad)
- Toggle es accesible por teclado
- Modal de registro es navegable

### Contraste
- Marca de agua cumple WCAG AA
- Pins demo tienen contraste suficiente
- Tooltips son legibles
