# Plan Límites y Paywall - Setas.AI

## Plan Gratuito (FREE)

### Límites
- **Setales**: 3 máximo
- **Zonas**: 1 máximo
- **Alertas**: 1 máximo

### Funcionalidades
- CRUD completo de setales
- 1 zona de seguimiento
- 1 alerta básica
- Acceso a datos demo
- Soporte por email

## Plan Pro

### Límites
- **Setales**: Ilimitados
- **Zonas**: Ilimitadas
- **Alertas**: Ilimitadas

### Funcionalidades
- Todas las del plan gratuito
- Alertas avanzadas (múltiples especies, condiciones complejas)
- Exportar datos
- Soporte prioritario
- Funciones futuras (API, etc.)

## Triggers del Paywall

### 4º Setal
- Usuario intenta crear el 4º setal
- Modal de paywall aparece
- Mensaje: "Has alcanzado el límite de 3 setales"

### 2ª Zona
- Usuario intenta añadir una 2ª zona
- Modal de paywall aparece
- Mensaje: "Has alcanzado el límite de 1 zona"

### 2ª Alerta
- Usuario intenta crear una 2ª alerta
- Modal de paywall aparece
- Mensaje: "Has alcanzado el límite de 1 alerta"

## A/B Testing de Precios

### Variante A (Precio Bajo)
- **Precio**: 3,99€/mes
- **Copy**: "Desbloquea setales ilimitados y alertas avanzadas"
- **CTA**: "Probar Pro - 3,99€/mes"

### Variante B (Precio Alto)
- **Precio**: 7,99€/mes
- **Copy**: "Desbloquea setales ilimitados y alertas avanzadas"
- **CTA**: "Probar Pro - 7,99€/mes"

### Asignación
- 50% usuarios → Variante A
- 50% usuarios → Variante B
- Asignación aleatoria al primer trigger

## Dónde se Dispara el Paywall

### En la UI
- Botón "Crear setal" (cuando ya hay 3)
- Botón "Añadir zona" (cuando ya hay 1)
- Botón "Nueva alerta" (cuando ya hay 1)
- Modal de confirmación antes de la acción

### Comportamiento
- Modal aparece sobre la acción bloqueada
- Usuario puede cerrar modal y continuar con límites
- Usuario puede hacer upgrade
- No se pierde el contexto de la acción

## Contenido del Paywall

### Título
"¡Has alcanzado el límite gratuito!"

### Subtítulo
"Desbloquea setales ilimitados y alertas avanzadas"

### Beneficios Pro
- ✅ Setales ilimitados
- ✅ Múltiples zonas de seguimiento
- ✅ Alertas avanzadas con IA
- ✅ Exportar tus datos
- ✅ Soporte prioritario

### CTAs
- **Primario**: "Desbloquear Pro - [PRICE]/mes"
- **Secundario**: "Continuar con límites"

### Términos
- "Cancelación en cualquier momento"
- "Primeros 7 días gratis"
- **Free trial**: 7 días sin cargo, luego facturación automática

## Métricas de Conversión

### Eventos a Trackear
- `paywall_view` - Usuario ve el paywall
- `paywall_dismiss` - Usuario cierra el paywall
- `upgrade_click` - Usuario hace click en upgrade
- `upgrade_complete` - Usuario completa la compra
- `paywall_copy_variant` - Variante mostrada (A o B)
- `trial_start` - Usuario inicia free trial
- `trial_convert` - Usuario convierte de trial a pago
- `trial_expire` - Trial expira sin conversión

### Métrica de Éxito
- **Tasa de conversión**: upgrade_click → upgrade_complete
- **Objetivo**: >15% conversión
- **Período de test**: 30 días

## Implementación

### Lógica de Límites
```typescript
interface Limits {
  setales: number;
  zonas: number;
  alertas: number;
}

const FREE_LIMITS: Limits = {
  setales: 3,
  zonas: 1,
  alertas: 1
};
```

### Validación
- Check límites antes de cada acción
- Mostrar paywall si se alcanza límite
- Permitir continuar con límites si se rechaza upgrade

### Persistencia
- Límites se guardan en base de datos
- Contadores se actualizan en tiempo real
- Estado del paywall se mantiene por sesión
