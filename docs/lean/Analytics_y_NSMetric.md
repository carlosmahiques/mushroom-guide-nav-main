# Analytics y North Star Metric - Setas.AI

## 10 Eventos Esenciales

### 1. page_view
**Momento**: Usuario accede a cualquier página
**Props**:
- `page`: string (ruta)
- `user_type`: 'anonymous' | 'free' | 'pro'
- `timestamp`: number

### 2. demo_view
**Momento**: Usuario accede a /explore
**Props**: 
- `source`: 'landing' | 'direct' | 'social'
- `user_agent`: string
- `timestamp`: number

### 2. demo_interact
**Momento**: Usuario interactúa con el mapa en demo
**Props**:
- `action`: 'zoom' | 'pan' | 'click_pin' | 'click_map'
- `coordinates`: {lat: number, lng: number}
- `duration`: number (segundos en demo)

### 3. register_click
**Momento**: Usuario hace click en "Crear cuenta"
**Props**:
- `source`: 'demo' | 'landing' | 'paywall'
- `variant`: 'A' | 'B' (si viene de A/B test)

### 4. onboarding_skip
**Momento**: Usuario salta un paso del onboarding
**Props**:
- `step`: 'zona' | 'especie'
- `reason`: 'user_choice' | 'timeout'
- `timestamp`: number

### 5. onboarding_complete
**Momento**: Usuario completa onboarding (2 pasos)
**Props**:
- `steps_completed`: number
- `skipped_steps`: string[]
- `zona_selected`: string
- `especie_selected`: string
- `alerta_created`: boolean

### 6. setal_create
**Momento**: Usuario crea su primer setal
**Props**:
- `setal_id`: string
- `coordinates`: {lat: number, lng: number}
- `especie`: string
- `time_to_first_setal`: number (minutos desde registro)

### 7. alert_create
**Momento**: Usuario crea su primera alerta
**Props**:
- `alerta_id`: string
- `zona`: string
- `especie`: string
- `condiciones`: object
- `time_to_first_alert`: number (minutos desde registro)

### 8. paywall_view
**Momento**: Usuario ve el paywall
**Props**:
- `trigger`: 'setal' | 'zona' | 'alerta'
- `current_usage`: {setales: number, zonas: number, alertas: number}
- `variant`: 'A' | 'B' (precio)

### 9. upgrade_click
**Momento**: Usuario hace click en "Desbloquear Pro"
**Props**:
- `variant`: 'A' | 'B' (precio)
- `trigger`: 'setal' | 'zona' | 'alerta'
- `time_on_paywall`: number (segundos)

### 10. upgrade_complete
**Momento**: Usuario completa la compra
**Props**:
- `variant`: 'A' | 'B' (precio)
- `payment_method`: string
- `time_to_upgrade`: number (días desde registro)

### 11. alert_triggered
**Momento**: Alerta se dispara y notifica al usuario
**Props**:
- `alerta_id`: string
- `especie`: string
- `zona`: string
- `condiciones_met`: object
- `user_response`: 'clicked' | 'ignored'

## Eventos de Trial

### trial_start
**Momento**: Usuario inicia free trial
**Props**:
- `variant`: 'A' | 'B' (precio)
- `trigger`: 'setal' | 'zona' | 'alerta'
- `trial_duration`: 7 (días)

### trial_convert
**Momento**: Usuario convierte de trial a pago
**Props**:
- `variant`: 'A' | 'B' (precio)
- `days_used`: number
- `payment_method`: string

### trial_expire
**Momento**: Trial expira sin conversión
**Props**:
- `variant`: 'A' | 'B' (precio)
- `days_used`: number
- `last_activity`: string

## Embudo de Conversión

### Funnel 1: Demo → Registro
```
demo_view → demo_interact → register_click → onboarding_complete
```

**Métricas**:
- Tasa de interacción: demo_interact / demo_view
- Tasa de registro: register_click / demo_interact
- Tasa de onboarding: onboarding_complete / register_click

**Objetivos**:
- Interacción: >60%
- Registro: >15%
- Onboarding: >80%

### Funnel 2: Registro → Activación
```
onboarding_complete → setal_create → alert_create
```

**Métricas**:
- Tasa de primer setal: setal_create / onboarding_complete
- Tasa de primera alerta: alert_create / setal_create
- Tiempo hasta activación: promedio de time_to_first_setal

**Objetivos**:
- Primer setal: >70%
- Primera alerta: >50%
- Tiempo hasta setal: <24 horas

### Funnel 3: Activación → Conversión
```
alert_create → paywall_view → upgrade_click → upgrade_complete
```

**Métricas**:
- Tasa de paywall: paywall_view / alert_create
- Tasa de click: upgrade_click / paywall_view
- Tasa de conversión: upgrade_complete / upgrade_click

**Objetivos**:
- Paywall: >30%
- Click: >20%
- Conversión: >15%

## North Star Metric

### Definición
**Usuarios con ≥1 setal + ≥1 alerta activa**

### Cálculo
```typescript
const northStarMetric = users.filter(user => 
  user.setales_count >= 1 && 
  user.alertas_count >= 1 && 
  user.alertas_active_count >= 1
).length;
```

### Frecuencia de Medición
- Diaria: Conteo total
- Semanal: Tasa de crecimiento
- Mensual: Retención a 30 días

### Objetivo
- **Mes 1**: 100 usuarios activados
- **Mes 3**: 500 usuarios activados
- **Mes 6**: 1000 usuarios activados

## Métricas Secundarias

### Engagement
- **DAU/MAU**: Usuarios activos diarios/mensuales
- **Sesiones por usuario**: Frecuencia de uso
- **Tiempo en app**: Duración promedio de sesión

### Retención
- **Día 1**: % usuarios que vuelven al día siguiente
- **Día 7**: % usuarios que vuelven en la semana
- **Día 30**: % usuarios que vuelven en el mes

### Monetización
- **ARPU**: Ingresos promedio por usuario
- **LTV**: Valor de vida del usuario
- **CAC**: Costo de adquisición de cliente

## A/B Testing

### Test 1: Precios
- **Variante A**: 3,99€/mes
- **Variante B**: 7,99€/mes
- **Métrica**: upgrade_click → upgrade_complete
- **Duración**: 30 días
- **Tamaño**: 1000 usuarios

### Test 2: Onboarding
- **Variante A**: 2 pasos obligatorios
- **Variante B**: 2 pasos con "Saltar"
- **Métrica**: onboarding_complete
- **Duración**: 14 días
- **Tamaño**: 500 usuarios

## Dashboard de Métricas

### KPIs Principales
- North Star Metric (diario)
- Tasa de conversión demo → registro
- Tasa de activación (setal + alerta)
- Tasa de conversión a Pro

### Gráficos
- Embudo de conversión
- Retención por cohortes
- A/B testing results
- Revenue por mes

### Alertas
- North Star Metric < objetivo
- Tasa de conversión < 10%
- Retención día 7 < 30%
- Error rate > 5%
