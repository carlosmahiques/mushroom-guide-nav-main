# QA - Página /explore

## Casos de Prueba

### Usuario Anónimo

#### Carga de Página
- **Caso**: Usuario accede a /explore
- **Esperado**: Página carga con mapa demo
- **Verificar**: 
  - Banner "Modo demo" visible
  - Mapa se renderiza correctamente
  - Setales demo aparecen
  - Marca de agua "DEMO" visible
  - Tour se inicia automáticamente

#### Interacción con Mapa
- **Caso**: Usuario hace zoom/pan en el mapa
- **Esperado**: Mapa responde correctamente
- **Verificar**:
  - Zoom funciona con rueda del ratón
  - Pan funciona arrastrando
  - Límites de zoom respetados
  - Performance fluida

#### Click en Setal Demo
- **Caso**: Usuario hace click en un pin naranja
- **Esperado**: Popup aparece con información
- **Verificar**:
  - Popup muestra título y descripción
  - Coordenadas son difusas
  - Botón "Crear cuenta" visible
  - Popup se cierra al hacer click fuera

#### Acción Bloqueada
- **Caso**: Usuario hace click en el mapa para crear setal
- **Esperado**: Modal de registro aparece
- **Verificar**:
  - Modal aparece sobre el mapa
  - Mensaje explica beneficios
  - Botón "Crear cuenta" visible
  - Botón "Cerrar" funciona

### Usuario Free

#### Acceso con Límites
- **Caso**: Usuario free accede a /explore
- **Esperado**: Ve demo + sus setales
- **Verificar**:
  - Toggle "Mostrar demo" disponible
  - Sus setales aparecen en azul
  - Setales demo aparecen en naranja
  - Puede crear setales (hasta límite)

#### Límite Alcanzado
- **Caso**: Usuario free intenta crear 4º setal
- **Esperado**: Paywall aparece
- **Verificar**:
  - Modal de paywall aparece
  - Mensaje de límite claro
  - Precio correcto según variante
  - Botón "Continuar con límites" funciona

### Usuario Pro

#### Acceso Ilimitado
- **Caso**: Usuario Pro accede a /explore
- **Esperado**: Acceso completo sin límites
- **Verificar**:
  - Puede crear setales ilimitados
  - Puede crear alertas ilimitadas
  - No aparece paywall
  - Toggle demo disponible

## Responsive

### Desktop (1024px+)
- **Caso**: Usuario en pantalla grande
- **Esperado**: Layout completo
- **Verificar**:
  - Mapa ocupa 70% de altura
  - Sidebar visible
  - Tour en overlay
  - Botones 32px+ altura

### Tablet (768px-1023px)
- **Caso**: Usuario en tablet
- **Esperado**: Layout adaptado
- **Verificar**:
  - Mapa ocupa 60% de altura
  - Sidebar colapsable
  - Tour adaptado
  - Botones 40px+ altura

### Móvil (320px-767px)
- **Caso**: Usuario en móvil
- **Esperado**: Layout móvil
- **Verificar**:
  - Mapa ocupa 50% de altura
  - Sidebar como drawer
  - Tour simplificado
  - Botones 44px+ altura
  - Touch targets accesibles

## Accesibilidad

### Navegación por Teclado
- **Caso**: Usuario navega solo con teclado
- **Esperado**: Todos los elementos accesibles
- **Verificar**:
  - Tab order lógico
  - Focus visible en todos los elementos
  - Escape cierra modales/tour
  - Enter/Space activa botones

### Screen Readers
- **Caso**: Usuario con screen reader
- **Esperado**: Información accesible
- **Verificar**:
  - Marca de agua tiene aria-label
  - Pins demo tienen aria-label
  - Tour anuncia cambios
  - Botones tienen labels descriptivos

### Contraste
- **Caso**: Usuario con problemas de visión
- **Esperado**: Contraste suficiente
- **Verificar**:
  - Texto cumple WCAG AA (4.5:1)
  - Botones cumple WCAG AA (3:1)
  - Marca de agua cumple WCAG AA (3:1)
  - Pins tienen contraste suficiente

## Performance

### Tiempo de Carga
- **Caso**: Página se carga
- **Esperado**: Carga rápida
- **Verificar**:
  - First Contentful Paint < 2s
  - Largest Contentful Paint < 4s
  - Time to Interactive < 5s
  - Mapa visible en < 3s

### Interacciones
- **Caso**: Usuario interactúa con mapa
- **Esperado**: Respuesta fluida
- **Verificar**:
  - Zoom/pan sin lag
  - Popups aparecen < 200ms
  - Modales aparecen < 300ms
  - Tour avanza sin delay

## Estados de Error

### Error de Carga
- **Caso**: Fallo al cargar datos
- **Esperado**: Mensaje de error claro
- **Verificar**:
  - Mensaje de error visible
  - Botón "Reintentar" funciona
  - Fallback a datos estáticos
  - No se rompe la página

### Error de Mapa
- **Caso**: Fallo en renderizado del mapa
- **Esperado**: Mapa se recupera
- **Verificar**:
  - Mapa se reintenta automáticamente
  - Mensaje de error temporal
  - Funcionalidad se restaura
  - No se pierde el estado

## Tour

### Inicio Automático
- **Caso**: Tour se inicia
- **Esperado**: Tour comienza automáticamente
- **Verificar**:
  - Tour aparece después de 2s
  - Paso 1 se muestra
  - Botón "Saltar tour" visible
  - Botón "Siguiente" visible

### Navegación
- **Caso**: Usuario navega el tour
- **Esperado**: Tour avanza correctamente
- **Verificar**:
  - Click en "Siguiente" avanza
  - Escape salta el tour
  - Click en "Saltar tour" cierra
  - Progreso se muestra

### Finalización
- **Caso**: Usuario completa tour
- **Esperado**: Tour se cierra
- **Verificar**:
  - Tour desaparece
  - Usuario puede interactuar libremente
  - No se reinicia automáticamente
  - Estado se guarda

## Criterios de Aceptación

### Funcionalidad
- ✅ Mapa demo carga correctamente
- ✅ Setales demo son visibles
- ✅ Interacciones funcionan
- ✅ Acciones bloqueadas muestran modal
- ✅ Tour se ejecuta correctamente

### UX
- ✅ Mensajes claros y útiles
- ✅ CTAs prominentes
- ✅ Flujo lógico
- ✅ Feedback inmediato
- ✅ Recuperación de errores

### Performance
- ✅ Carga < 5 segundos
- ✅ Interacciones < 300ms
- ✅ Sin lag en mapa
- ✅ Memoria estable
- ✅ Sin memory leaks

### Accesibilidad
- ✅ Navegación por teclado
- ✅ Screen reader compatible
- ✅ Contraste WCAG AA
- ✅ Touch targets 44px+
- ✅ Labels descriptivos
