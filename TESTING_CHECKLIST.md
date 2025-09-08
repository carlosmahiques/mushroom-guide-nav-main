# Testing Checklist - Lean Conversion

## 🎯 Objetivo
Verificar que todas las funcionalidades lean conversion están funcionando correctamente.

## 📋 Checklist de Testing

### ✅ 1. Feature Flags
- [ ] **ENABLE_LEAN=1**: Verificar que lean conversion está activado
- [ ] **ENABLE_LEAN=0**: Verificar que app funciona igual que antes (sin cambios)
- [ ] **Flags individuales**: Probar activar/desactivar funcionalidades específicas

### ✅ 2. Demo Mode en Mapa (/mapa)
- [ ] **Marca de agua DEMO**: Visible en esquina superior derecha del mapa
- [ ] **Pins naranjas**: Marcadores demo con coordenadas difusas
- [ ] **Tooltips demo**: "Setal de ejemplo" en popups de pins naranjas
- [ ] **Gating de clicks**: Click en mapa abre RegisterModal si no hay sesión

### ✅ 3. Tour de 3 Pasos
- [ ] **Auto-inicio**: Se muestra automáticamente en primera visita
- [ ] **Navegación**: Botones "Siguiente" y "Finalizar" funcionan
- [ ] **Skip**: Botón "Saltar tour" funciona
- [ ] **Esc key**: Presionar Esc cierra el tour
- [ ] **Persistencia**: No se muestra en visitas posteriores
- [ ] **Indicadores**: Puntos de progreso se actualizan correctamente

### ✅ 4. Gating de Acciones
- [ ] **Botón "Nuevo sétal"**: Abre RegisterModal si no hay sesión
- [ ] **Botón "Añadir localización"**: Gating en página Setales
- [ ] **Botón "Nueva alerta"**: Gating en página Alertas
- [ ] **Click en mapa**: Gating para crear setales

### ✅ 5. Contadores de Límites
- [ ] **Header Setales**: Muestra "(0/3 setales)" o "(∞ setales)" para PRO
- [ ] **Header Alertas**: Muestra "(0/1 alertas)" o "(∞ alertas)" para PRO
- [ ] **Nudges suaves**: Aparecen cuando quedan 1-2 elementos
- [ ] **Colores**: Nudges con colores apropiados (naranja, azul, verde)

### ✅ 6. Modales
- [ ] **RegisterModal**: Se abre correctamente con copy de registro
- [ ] **PaywallModal**: A/B testing de precios (3,99€ vs 7,99€)
- [ ] **Cerrar modales**: Botones "Cerrar" y X funcionan
- [ ] **CTAs**: Botones "Crear cuenta" y "Desbloquear Pro" funcionan

### ✅ 7. Analytics y Eventos
- [ ] **Console logs**: Eventos se muestran en consola del navegador
- [ ] **page_view**: Se dispara en cada página
- [ ] **demo_view**: Se dispara al cargar mapa en demo mode
- [ ] **register_click**: Se dispara en CTAs de registro
- [ ] **tour_***: Eventos del tour se registran
- [ ] **paywall_***: Eventos del paywall se registran

### ✅ 8. Responsive Design
- [ ] **Mobile**: Funciona correctamente en dispositivos móviles
- [ ] **Tablet**: Funciona correctamente en tablets
- [ ] **Desktop**: Funciona correctamente en desktop
- [ ] **Touch**: Botones y modales funcionan con touch

### ✅ 9. Accesibilidad
- [ ] **Keyboard navigation**: Navegación con teclado funciona
- [ ] **Screen reader**: Labels y aria-* apropiados
- [ ] **Contrast**: Contraste de colores adecuado
- [ ] **Focus**: Indicadores de foco visibles

### ✅ 10. Performance
- [ ] **Carga rápida**: Páginas cargan en < 3 segundos
- [ ] **Sin lag**: Interacciones responden en < 300ms
- [ ] **Memory**: Sin memory leaks aparentes
- [ ] **Bundle size**: No aumenta significativamente

## 🧪 Testing Manual

### Paso 1: Verificar Demo Mode
1. Abrir http://localhost:8080/mapa
2. Verificar marca de agua "DEMO" en esquina superior derecha
3. Verificar pins naranjas en el mapa
4. Hacer click en un pin naranja y verificar popup "Setal de ejemplo"

### Paso 2: Probar Tour
1. Limpiar localStorage: `localStorage.clear()`
2. Recargar página
3. Verificar que tour aparece automáticamente
4. Navegar por los 3 pasos
5. Probar botón "Saltar tour"
6. Probar presionar Esc para cerrar

### Paso 3: Probar Gating
1. Hacer click en "Nuevo sétal" (sin sesión)
2. Verificar que abre RegisterModal
3. Cerrar modal y probar otros botones
4. Verificar que todos abren RegisterModal

### Paso 4: Verificar Contadores
1. Navegar a /setales
2. Verificar contador "(0/3 setales)" en header
3. Navegar a /alertas
4. Verificar contador "(0/1 alertas)" en header

### Paso 5: Verificar Analytics
1. Abrir DevTools > Console
2. Navegar entre páginas
3. Verificar eventos en consola
4. Probar acciones (clicks, tour, etc.)
5. Verificar que todos los eventos se registran

## 🐛 Troubleshooting

### Si algo no funciona:
1. **Verificar feature flags**: `node scripts/verify-flags.js`
2. **Revisar console**: Buscar errores en DevTools
3. **Verificar imports**: Asegurar que todos los imports son correctos
4. **Reiniciar servidor**: `npm run dev`
5. **Limpiar cache**: Hard refresh (Cmd+Shift+R)

### Comandos útiles:
```bash
# Verificar estado de flags
node scripts/verify-flags.js

# Testing automático
node scripts/test-lean-conversion.js

# Desactivar lean conversion
sed -i '' 's/VITE_ENABLE_LEAN=1/VITE_ENABLE_LEAN=0/' .env.local

# Activar lean conversion
sed -i '' 's/VITE_ENABLE_LEAN=0/VITE_ENABLE_LEAN=1/' .env.local
```

## ✅ Criterios de Éxito

- [ ] Todas las funcionalidades lean conversion funcionan
- [ ] No hay errores en consola
- [ ] Performance no se degrada
- [ ] UX es fluida y intuitiva
- [ ] Analytics se registran correctamente
- [ ] Feature flags funcionan como esperado
- [ ] App funciona igual con ENABLE_LEAN=0
