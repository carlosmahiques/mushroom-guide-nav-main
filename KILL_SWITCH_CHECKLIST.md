# 🔴 Kill Switch Checklist - ENABLE_LEAN=0

## 🎯 Objetivo
Verificar que con `ENABLE_LEAN=0` la aplicación funciona exactamente igual que antes de la implementación lean conversion, sin banners, modales, overlays o funcionalidades adicionales.

## ⚙️ Configuración del Test

### 1. Desactivar Lean Conversion
```bash
# Cambiar flag a 0
sed -i '' 's/VITE_ENABLE_LEAN=1/VITE_ENABLE_LEAN=0/' .env.local

# Reiniciar servidor
npm run dev
```

### 2. Verificar Estado de Flags
```bash
# Ejecutar script de verificación
node scripts/verify-flags.js

# Debe mostrar:
# VITE_ENABLE_LEAN=0
# Lean Conversion: ❌ DESACTIVADO
```

## ✅ Checklist de Verificación

### 🏠 **Navegación y Layout**
- [ ] **Sidebar funciona**: Navegación entre páginas sin problemas
- [ ] **Rutas funcionan**: Todas las rutas existentes accesibles
- [ ] **Layout intacto**: Estructura visual igual que antes
- [ ] **Responsive**: Funciona en mobile, tablet, desktop
- [ ] **Performance**: Tiempo de carga igual que antes

### 🗺️ **Página Mapa (/mapa)**
- [ ] **Mapa carga normalmente**: Sin marca de agua DEMO
- [ ] **Botón "Nuevo sétal"**: Funciona sin gating (modo original)
- [ ] **Sin modal de registro**: No aparece al hacer click
- [ ] **Sin tour**: No aparece tour de 3 pasos
- [ ] **Sin pins demo**: Solo marcadores de usuario
- [ ] **Sin debug info**: No aparece caja de debug
- [ ] **Sin botón TEST**: No aparece botón de test

### 📍 **Página Setales (/setales)**
- [ ] **Lista de setales**: Se muestra normalmente
- [ ] **Sin contadores**: No muestra "X/Y setales"
- [ ] **Botón "Añadir localización"**: Funciona sin gating
- [ ] **Sin modal de registro**: No aparece al hacer click
- [ ] **Sin limit nudge**: No aparece nudge de límites
- [ ] **Sin analytics**: No se registran eventos

### 🔔 **Página Alertas (/alertas)**
- [ ] **Lista de alertas**: Se muestra normalmente
- [ ] **Sin contadores**: No muestra "X/Y alertas"
- [ ] **Botón "Nueva alerta"**: Funciona sin gating
- [ ] **Sin modal de registro**: No aparece al hacer click
- [ ] **Sin limit nudge**: No aparece nudge de límites
- [ ] **Sin analytics**: No se registran eventos

### 📊 **Página Datos (/datos)**
- [ ] **Pronóstico funciona**: Datos meteorológicos se cargan
- [ ] **Sin analytics**: No se registran eventos de error
- [ ] **Sin tracking**: No se registra page_view
- [ ] **Funcionalidad intacta**: Todo funciona igual que antes

### 🎨 **UI/UX General**
- [ ] **Sin banners**: No aparecen banners DEMO
- [ ] **Sin modales**: No aparecen modales de registro/paywall
- [ ] **Sin overlays**: No aparecen overlays de tour
- [ ] **Sin watermarks**: No aparecen marcas de agua
- [ ] **Sin nudges**: No aparecen nudges de límites
- [ ] **Sin tooltips**: No aparecen tooltips de bloqueo

### 🔧 **Funcionalidad Técnica**
- [ ] **Hooks no se ejecutan**: useGatedAction, useLimits, etc. no se llaman
- [ ] **Componentes no se renderizan**: RegisterModal, DemoTour, etc. no aparecen
- [ ] **Analytics deshabilitado**: No se registran eventos
- [ ] **Gating deshabilitado**: Acciones funcionan sin restricciones
- [ ] **Demo mode deshabilitado**: No hay modo demo activo

### 📱 **Responsive y Accesibilidad**
- [ ] **Mobile**: Funciona correctamente en móviles
- [ ] **Tablet**: Funciona correctamente en tablets
- [ ] **Desktop**: Funciona correctamente en desktop
- [ ] **Keyboard navigation**: Navegación con teclado funciona
- [ ] **Screen reader**: Compatible con lectores de pantalla

## 🧪 Testing Manual

### Paso 1: Verificar Navegación
1. Abrir http://localhost:8081
2. Navegar entre todas las páginas del sidebar
3. Verificar que no hay errores en consola
4. Verificar que no aparecen elementos lean conversion

### Paso 2: Verificar Funcionalidad del Mapa
1. Ir a /mapa
2. Verificar que no hay marca de agua DEMO
3. Hacer click en "Nuevo sétal"
4. Verificar que funciona sin modal (modo original)
5. Verificar que no aparece tour

### Paso 3: Verificar Otras Páginas
1. Ir a /setales
2. Verificar que no hay contadores ni nudges
3. Hacer click en "Añadir localización"
4. Verificar que funciona sin modal
5. Repetir para /alertas

### Paso 4: Verificar Consola
1. Abrir DevTools > Console
2. Verificar que no hay logs de lean conversion
3. Verificar que no hay errores
4. Verificar que no se registran eventos de analytics

## 🚨 Criterios de Fallo

### ❌ **FALLA si:**
- Aparece cualquier modal de registro/paywall
- Aparece tour de 3 pasos
- Aparece marca de agua DEMO
- Aparecen contadores de límites
- Aparecen nudges de límites
- Se registran eventos de analytics
- Hay errores en consola
- La funcionalidad básica no funciona
- El rendimiento es peor que antes

### ✅ **PASA si:**
- La app funciona exactamente igual que antes
- No hay elementos visuales de lean conversion
- No hay funcionalidades adicionales
- No hay errores en consola
- El rendimiento es igual o mejor

## 🔄 Restaurar Lean Conversion

### Para volver a activar:
```bash
# Cambiar flag a 1
sed -i '' 's/VITE_ENABLE_LEAN=0/VITE_ENABLE_LEAN=1/' .env.local

# Reiniciar servidor
npm run dev
```

## 📊 Reporte de Resultados

### Estado del Test:
- [ ] ✅ **PASA**: App funciona igual que antes
- [ ] ❌ **FALLA**: Hay elementos lean conversion visibles
- [ ] ❌ **FALLA**: Hay errores en consola
- [ ] ❌ **FALLA**: Funcionalidad básica rota

### Elementos Encontrados (si falla):
- [ ] Modales de registro
- [ ] Tour de demo
- [ ] Marca de agua DEMO
- [ ] Contadores de límites
- [ ] Nudges de límites
- [ ] Eventos de analytics
- [ ] Debug info
- [ ] Otros: _______________

### Notas Adicionales:
```
[Escribir cualquier observación adicional]
```

---

**🎯 Objetivo**: Verificar que `ENABLE_LEAN=0` deja la app exactamente como estaba antes de la implementación lean conversion.

**✅ Criterio de Éxito**: La app funciona igual que antes, sin elementos lean conversion visibles o funcionalidades adicionales.
