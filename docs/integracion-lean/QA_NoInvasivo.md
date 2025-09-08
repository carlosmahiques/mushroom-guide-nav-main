# QA No Invasivo - Integración Lean

## Pruebas de No Regresión

### 1. Navegación Existente Intacta

#### Casos de prueba:
- ✅ Navegación entre páginas funciona igual
- ✅ Sidebar mantiene funcionalidad
- ✅ Rutas protegidas siguen funcionando
- ✅ Autenticación no se ve afectada

#### Verificación:
```bash
# Navegar a cada página
/mapa → Carga correctamente
/setales → Carga correctamente
/datos → Carga correctamente
/alertas → Carga correctamente
/ajustes → Carga correctamente
```

### 2. Imports No Rotos

#### Verificación:
- ✅ Todos los imports existentes funcionan
- ✅ Nuevos imports no rompen builds
- ✅ TypeScript no muestra errores
- ✅ Vite compila sin warnings

#### Comandos:
```bash
npm run build
npm run type-check
npm run lint
```

### 3. Performance de Páginas Igual

#### Métricas a verificar:
- ✅ First Contentful Paint (FCP)
- ✅ Largest Contentful Paint (LCP)
- ✅ Time to Interactive (TTI)
- ✅ Bundle size no aumenta significativamente

#### Herramientas:
- Chrome DevTools Lighthouse
- Bundle analyzer
- Performance profiler

## Casos de Prueba Específicos

### 1. Usuario Anónimo (Demo/Gating)

#### Flujo:
1. **Acceder a /mapa sin sesión**
   - ✅ Se muestra marca de agua DEMO
   - ✅ Pins demo son visibles
   - ✅ Tour se inicia automáticamente
   - ✅ Click en mapa abre RegisterModal

2. **Intentar crear setal**
   - ✅ Botón "Nuevo sétal" está deshabilitado
   - ✅ Tooltip muestra "Regístrate para crear setales"
   - ✅ Click abre RegisterModal

3. **Navegar a /setales**
   - ✅ Contador muestra "0/3 setales"
   - ✅ Botón "Añadir localización" abre RegisterModal
   - ✅ Lista vacía se muestra correctamente

4. **Navegar a /alertas**
   - ✅ Contador muestra "0/1 alertas"
   - ✅ Botón "Nueva alerta" abre RegisterModal
   - ✅ Lista vacía se muestra correctamente

### 2. Usuario FREE en Límite

#### Flujo:
1. **Crear 3 setales**
   - ✅ Contador muestra "3/3 setales"
   - ✅ Nudge suave aparece "Te queda 0 setales"
   - ✅ 4º setal abre PaywallModal

2. **Crear 1 alerta**
   - ✅ Contador muestra "1/1 alertas"
   - ✅ 2ª alerta abre PaywallModal

3. **Ver PaywallModal**
   - ✅ A/B testing funciona (variante A o B)
   - ✅ Precio correcto según variante
   - ✅ Botón "Continuar con límites" funciona

### 3. Usuario PRO

#### Flujo:
1. **Acceso ilimitado**
   - ✅ Contador muestra "∞ setales"
   - ✅ Contador muestra "∞ alertas"
   - ✅ No aparece paywall
   - ✅ Todas las acciones permitidas

2. **Funciones avanzadas**
   - ✅ Exportar datos funciona
   - ✅ Sin restricciones de límites

### 4. Error de Pronóstico

#### Flujo:
1. **Error de Edge Function**
   - ✅ Alerta suavizada aparece
   - ✅ Botón "Reintentar" funciona
   - ✅ Log de error se genera (sin PII)

2. **Datos antiguos**
   - ✅ Badge "hace X h" aparece
   - ✅ Datos se muestran con advertencia
   - ✅ Botón "Actualizar" funciona

3. **Sin datos**
   - ✅ Mensaje de error claro
   - ✅ Botón "Reintentar" funciona
   - ✅ No se rompe la página

## Criterios de Aceptación

### Funcionalidad
- ✅ Navegación existente intacta
- ✅ Imports no rotos
- ✅ Performance igual o mejor
- ✅ Gating funciona correctamente
- ✅ Contadores se muestran
- ✅ Paywall se dispara en límites
- ✅ Demo mode funciona solo en mapa
- ✅ Tour funciona y se puede saltar
- ✅ Fallbacks de pronóstico funcionan

### UX
- ✅ Mensajes claros y útiles
- ✅ CTAs prominentes
- ✅ Flujo lógico
- ✅ Feedback inmediato
- ✅ Recuperación de errores

### Performance
- ✅ Carga < 5 segundos
- ✅ Interacciones < 300ms
- ✅ Sin lag en navegación
- ✅ Memoria estable
- ✅ Sin memory leaks

### Accesibilidad
- ✅ Navegación por teclado
- ✅ Screen reader compatible
- ✅ Contraste WCAG AA
- ✅ Touch targets 44px+
- ✅ Labels descriptivos

## Checklist de Verificación

### Antes de Implementar
- [ ] Backup del código actual
- [ ] Tests existentes pasan
- [ ] Performance baseline establecido
- [ ] Plan de rollback definido

### Durante Implementación
- [ ] Cada componente se prueba individualmente
- [ ] Integración se prueba paso a paso
- [ ] Performance se monitorea
- [ ] Errores se logean correctamente

### Después de Implementar
- [ ] Todos los casos de prueba pasan
- [ ] Performance no se degrada
- [ ] Usuarios existentes no se ven afectados
- [ ] Nuevas funcionalidades funcionan
- [ ] Rollback plan listo si es necesario

## Plan de Rollback

### Si algo falla:
1. **Revertir commits** de la integración
2. **Restaurar backup** del código
3. **Verificar** que todo funciona
4. **Comunicar** a usuarios si es necesario
5. **Analizar** qué falló y por qué
6. **Planificar** nueva implementación
