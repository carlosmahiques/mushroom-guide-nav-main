# Onboarding 2 Pasos - Setas.AI

## Flujo Exacto

### Paso 1: Zona de Interés
**Pregunta**: "¿En qué zona buscas setas?"
**Opciones**:
- Lista desplegable con provincias/regiones de España
- Búsqueda por texto
- Mapa interactivo (opcional)

**Valores por defecto si "Saltar"**:
- Zona: Geolocalización del navegador (si falla: "Madrid")
- Coordenadas: GPS del usuario (si falla: 40.4168, -3.7038)

### Paso 2: Especie y Alerta
**Pregunta**: "¿Cuál es tu especie favorita?"
**Opciones**:
- Lista de especies comunes (Boletus, Lactarius, Cantharellus, etc.)
- Búsqueda por texto
- "No estoy seguro" (opción por defecto)

**Configuración de alerta básica**:
- Frecuencia: "Semanal" (por defecto)
- Condiciones: "Lluvia + Temperatura > 15°C"
- Notificación: Email (activado por defecto)

**Valores por defecto si "Saltar"**:
- Especie: "Boletus edulis"
- Alerta: Configurada automáticamente con valores por defecto

## Comportamiento del "Saltar"

### Si salta Paso 1
- Se asigna zona por defecto (Madrid)
- Se muestra mensaje: "Puedes cambiar tu zona en Perfil"
- Continúa al Paso 2

### Si salta Paso 2
- Se asigna especie por defecto (Boletus edulis)
- Se crea alerta básica automáticamente
- Se muestra mensaje: "Alerta básica creada. Puedes personalizarla en Alertas"
- Completa el onboarding

### Si salta ambos pasos
- Se aplican todos los valores por defecto
- Se crea alerta básica automáticamente
- Se marca onboarding como completado
- Redirige a /app/home

## Estados del Onboarding

### Completado
- Usuario puede acceder a todas las funciones
- No se muestra más el modal de onboarding
- Se puede acceder a configuración desde Perfil

### Incompleto
- Modal de onboarding aparece en cada visita
- Botón "Saltar por ahora" siempre visible
- Se puede completar desde Perfil

### Parcialmente completado
- Se recuerda el progreso
- Se continúa desde el paso siguiente
- Se pueden modificar pasos anteriores

## Validaciones

### Paso 1
- Zona es obligatoria (no se puede continuar sin seleccionar)
- Si se salta, se asigna valor por defecto

### Paso 2
- Especie es obligatoria (no se puede continuar sin seleccionar)
- Si se salta, se asigna valor por defecto
- Alerta se crea automáticamente

## Mensajes de Confirmación

### Al completar paso
- "¡Perfecto! Zona guardada"
- "¡Excelente! Especie y alerta configuradas"

### Al saltar paso
- "No hay problema, puedes configurarlo más tarde"
- "Valores por defecto aplicados"
- **Evento**: `onboarding_skip` con prop `step`: 'zona' | 'especie'

### Al completar onboarding
- "¡Bienvenido a Setas.AI! Ya puedes empezar a guardar tus setales"
- CTA: "Crear mi primer setal"
