# Analítica - Página /explore

## Eventos Principales

### page_view
**Momento**: Usuario accede a /explore
**Props**:
- `page`: '/explore'
- `user_type`: 'anonymous'
- `source`: 'landing' | 'direct' | 'social' | 'search'
- `timestamp`: number
- `user_agent`: string

### demo_view
**Momento**: Mapa demo se carga completamente
**Props**:
- `load_time`: number (ms)
- `setales_count`: number
- `heatmap_loaded`: boolean
- `tour_available`: boolean

### demo_interact
**Momento**: Usuario interactúa con el mapa
**Props**:
- `action`: 'zoom' | 'pan' | 'click_pin' | 'click_map' | 'hover_pin'
- `coordinates`: {lat: number, lng: number}
- `zoom_level`: number
- `duration`: number (segundos en demo)

### tour_start
**Momento**: Tour se inicia automáticamente
**Props**:
- `trigger`: 'auto' | 'manual'
- `step`: 1
- `timestamp`: number

### tour_step_complete
**Momento**: Usuario completa un paso del tour
**Props**:
- `step`: 1 | 2 | 3
- `duration`: number (segundos en paso)
- `action`: 'click' | 'timeout' | 'skip'

### tour_skip
**Momento**: Usuario salta el tour
**Props**:
- `step`: 1 | 2 | 3
- `reason`: 'escape' | 'button' | 'timeout'
- `duration`: number (segundos totales)

### tour_complete
**Momento**: Usuario completa el tour completo
**Props**:
- `total_duration`: number (segundos)
- `steps_completed`: number
- `interactions`: number

### setal_click
**Momento**: Usuario hace click en un setal demo
**Props**:
- `setal_id`: string
- `especie`: string
- `coordinates`: {lat: number, lng: number}
- `is_demo`: true

### action_blocked
**Momento**: Usuario intenta acción bloqueada
**Props**:
- `action`: 'create_setal' | 'edit_setal' | 'delete_setal' | 'create_alert'
- `coordinates`: {lat: number, lng: number}
- `context`: 'map_click' | 'button_click' | 'menu_click'

### register_modal_view
**Momento**: Modal de registro aparece
**Props**:
- `trigger`: 'action_blocked' | 'tour_cta' | 'header_button'
- `action_attempted`: string
- `coordinates`: {lat: number, lng: number}

### register_click
**Momento**: Usuario hace click en "Crear cuenta"
**Props**:
- `source`: 'demo' | 'tour' | 'header'
- `context`: 'modal' | 'header'
- `action_attempted`: string

### login_click
**Momento**: Usuario hace click en "Iniciar sesión"
**Props**:
- `source`: 'header'
- `context`: 'header'

## Métricas de Conversión

### Embudo Principal
```
page_view → demo_view → demo_interact → action_blocked → register_modal_view → register_click
```

### Métricas Clave
- **Tasa de carga**: demo_view / page_view
- **Tasa de interacción**: demo_interact / demo_view
- **Tasa de bloqueo**: action_blocked / demo_interact
- **Tasa de modal**: register_modal_view / action_blocked
- **Tasa de registro**: register_click / register_modal_view

### Objetivos
- Carga: >95%
- Interacción: >60%
- Bloqueo: >30%
- Modal: >80%
- Registro: >15%

## Métricas de Engagement

### Tiempo en Página
- **Promedio**: Tiempo total en /explore
- **Mediana**: Tiempo mediano en /explore
- **P95**: 95% de usuarios pasan menos de X segundos

### Interacciones por Sesión
- **Clicks en mapa**: Número de clicks por usuario
- **Pins visitados**: Número de setales clickeados
- **Zoom/pan**: Número de interacciones de navegación

### Tour Engagement
- **Tasa de inicio**: tour_start / demo_view
- **Tasa de finalización**: tour_complete / tour_start
- **Tasa de abandono**: tour_skip / tour_start
- **Tiempo promedio**: Duración promedio del tour

## Segmentación

### Por Fuente de Tráfico
- **Landing**: Usuarios desde página principal
- **Direct**: Usuarios que acceden directamente
- **Social**: Usuarios desde redes sociales
- **Search**: Usuarios desde motores de búsqueda

### Por Dispositivo
- **Desktop**: Usuarios en ordenador
- **Tablet**: Usuarios en tablet
- **Móvil**: Usuarios en móvil

### Por Comportamiento
- **Exploradores**: Usuarios que interactúan mucho
- **Rápidos**: Usuarios que van directo al registro
- **Abandonadores**: Usuarios que no interactúan

## Alertas y Monitoreo

### Alertas Críticas
- **Error de carga**: demo_view < 90%
- **Baja interacción**: demo_interact < 50%
- **Baja conversión**: register_click < 10%

### Alertas de Rendimiento
- **Tiempo de carga**: >5 segundos
- **Error de mapa**: Fallos en renderizado
- **Error de tour**: Fallos en tour

### Alertas de UX
- **Alto abandono**: tour_skip > 70%
- **Baja finalización**: tour_complete < 30%
- **Errores de interacción**: Acciones fallidas

## Dashboard de Métricas

### KPIs Principales
- Tasa de conversión demo → registro
- Tiempo promedio en página
- Tasa de finalización del tour
- Tasa de interacción con mapa

### Gráficos
- Embudo de conversión
- Tiempo en página por dispositivo
- Interacciones por sesión
- Tour completion rate

### Filtros
- Por fecha (día, semana, mes)
- Por fuente de tráfico
- Por dispositivo
- Por comportamiento
