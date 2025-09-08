# 🧪 Pruebas E2E Manuales - Setas.AI

## 🎯 Objetivo
Verificar que los 3 flujos principales funcionan correctamente: demo anónimo, límites de setales, y límites de alertas.

## ⚙️ Configuración Inicial

### 1. Preparar el entorno
```bash
# Asegurar que la app está corriendo
export PATH="/opt/homebrew/opt/node@20/bin:$PATH" && npm run dev

# Verificar que está en http://localhost:8081
curl -s -o /dev/null -w "%{http_code}" http://localhost:8081
# Debe devolver: 200
```

### 2. Limpiar datos de prueba
```bash
# Limpiar localStorage para pruebas limpias
# En DevTools > Application > Storage > Clear storage
```

### 3. Activar overlay de debug
- Presionar `Ctrl+Shift+L` para mostrar el overlay de analytics
- Verificar que aparece en la esquina superior derecha

---

## 🔄 Flujo 1: Mapa Demo (Anónimo)

### **Objetivo**: Verificar flujo completo de usuario anónimo en el mapa

### **Pasos**:

#### 1.1 Acceder al mapa
- [ ] Abrir http://localhost:8081
- [ ] Hacer click en "Mapa interactivo" en el sidebar
- [ ] **Verificar**: Página carga correctamente
- [ ] **Verificar**: No hay errores en consola

#### 1.2 Verificar tour automático
- [ ] **Verificar**: Tour de 3 pasos aparece automáticamente
- [ ] **Verificar**: Overlay de debug muestra evento `demo_view`
- [ ] **Verificar**: Tour tiene botón "Saltar" y se puede cerrar con `Esc`

#### 1.3 Intentar crear setal (modo demo)
- [ ] Hacer click en "Nuevo sétal"
- [ ] **Verificar**: Botón cambia a "Haz clic en el mapa"
- [ ] Hacer click en cualquier parte del mapa
- [ ] **Verificar**: Aparece `RegisterModal`
- [ ] **Verificar**: Modal tiene título "¡Crea tu cuenta gratis!"

#### 1.4 Verificar modal de registro
- [ ] **Verificar**: Modal se puede cerrar con `Esc`
- [ ] **Verificar**: Modal se puede cerrar haciendo click fuera
- [ ] **Verificar**: Modal tiene foco atrapado (Tab navega dentro)
- [ ] Hacer click en "Crear cuenta"
- [ ] **Verificar**: Overlay de debug muestra evento `register_click`
- [ ] **Verificar**: Props del evento incluyen `source: 'demo'`

### **Eventos Esperados**:
```
1. page_view { page: '/mapa', user_type: 'anonymous' }
2. demo_view { source: 'landing', user_agent: '...', timestamp: ... }
3. demo_interact { action: 'click_map', coordinates: {...}, duration: 0 }
4. register_click { source: 'demo', context: 'modal', action_attempted: 'create_setal' }
```

---

## 🔄 Flujo 2: Mis Sétales (Free - Límite Alcanzado)

### **Objetivo**: Verificar paywall cuando se alcanza el límite de setales

### **Preparación**:
- [ ] Simular usuario con 3 setales (límite alcanzado)
- [ ] Asegurar que `useLimits` devuelve `currentUsage.setales = 3`

### **Pasos**:

#### 2.1 Acceder a Mis Sétales
- [ ] Hacer click en "Mis sétales" en el sidebar
- [ ] **Verificar**: Página carga correctamente
- [ ] **Verificar**: Se muestra contador "3/3 setales"
- [ ] **Verificar**: Overlay de debug muestra evento `page_view`

#### 2.2 Intentar añadir setal (límite alcanzado)
- [ ] Hacer click en "Añadir localización"
- [ ] **Verificar**: Aparece `PaywallModal`
- [ ] **Verificar**: Modal tiene título "¡Desbloquea setales ilimitados!"
- [ ] **Verificar**: Modal muestra precio (variante A o B)

#### 2.3 Verificar evento paywall_view
- [ ] **Verificar**: Overlay de debug muestra evento `paywall_view`
- [ ] **Verificar**: Props incluyen:
  - `variant: 'A' | 'B'`
  - `trigger: 'setal_limit'`
  - `plan: 'free'`
  - `current_usage: { setales: 3, alertas: 0, zonas: 0 }`

#### 2.4 Probar botón "Probar 7 días"
- [ ] Hacer click en "Desbloquear Pro - €X,XX/mes"
- [ ] **Verificar**: Overlay de debug muestra evento `upgrade_click`
- [ ] **Verificar**: Después de 1 segundo aparece evento `trial_start`
- [ ] **Verificar**: Props de `trial_start` incluyen:
  - `variant: 'A' | 'B'`
  - `trigger: 'setal_limit'`
  - `trial_duration: 7`

#### 2.5 Verificar comportamiento del modal
- [ ] **Verificar**: Modal se puede cerrar con `Esc`
- [ ] **Verificar**: Modal se puede cerrar haciendo click fuera
- [ ] **Verificar**: Modal tiene foco atrapado
- [ ] **Verificar**: Botón "Continuar con límites" funciona

### **Eventos Esperados**:
```
1. page_view { page: '/setales', user_type: 'free' }
2. paywall_view { variant: 'A'|'B', trigger: 'setal_limit', plan: 'free', current_usage: {...} }
3. upgrade_click { variant: 'A'|'B', trigger: 'setal_limit', price: 3.99|7.99, current_usage: {...} }
4. trial_start { variant: 'A'|'B', trigger: 'setal_limit', trial_duration: 7 }
```

---

## 🔄 Flujo 3: Alertas (Free - Límite Alcanzado)

### **Objetivo**: Verificar paywall cuando se alcanza el límite de alertas

### **Preparación**:
- [ ] Simular usuario con 1 alerta (límite alcanzado)
- [ ] Asegurar que `useLimits` devuelve `currentUsage.alertas = 1`

### **Pasos**:

#### 3.1 Acceder a Alertas
- [ ] Hacer click en "Alertas" en el sidebar
- [ ] **Verificar**: Página carga correctamente
- [ ] **Verificar**: Se muestra contador "1/1 alertas"
- [ ] **Verificar**: Overlay de debug muestra evento `page_view`

#### 3.2 Intentar crear alerta (límite alcanzado)
- [ ] Hacer click en "Nueva alerta"
- [ ] **Verificar**: Aparece `PaywallModal`
- [ ] **Verificar**: Modal tiene título "¡Desbloquea setales ilimitados!"
- [ ] **Verificar**: Modal muestra mensaje "Has alcanzado el límite de 1 alerta"

#### 3.3 Verificar evento paywall_view
- [ ] **Verificar**: Overlay de debug muestra evento `paywall_view`
- [ ] **Verificar**: Props incluyen:
  - `variant: 'A' | 'B'`
  - `trigger: 'alert_limit'`
  - `plan: 'free'`
  - `current_usage: { setales: 0, alertas: 1, zonas: 0 }`

#### 3.4 Verificar comportamiento del modal
- [ ] **Verificar**: Modal se puede cerrar con `Esc`
- [ ] **Verificar**: Modal se puede cerrar haciendo click fuera
- [ ] **Verificar**: Modal tiene foco atrapado
- [ ] **Verificar**: Botón "Continuar con límites" funciona

### **Eventos Esperados**:
```
1. page_view { page: '/alertas', user_type: 'free' }
2. paywall_view { variant: 'A'|'B', trigger: 'alert_limit', plan: 'free', current_usage: {...} }
```

---

## 🔍 Verificaciones Generales

### **Comportamiento de Modales**
- [ ] **Esc**: Todos los modales se cierran con `Esc`
- [ ] **Click fuera**: Todos los modales se cierran haciendo click fuera
- [ ] **Foco atrapado**: Tab navega solo dentro del modal
- [ ] **Z-index**: Modales aparecen por encima del mapa
- [ ] **Responsive**: Modales funcionan en mobile, tablet, desktop

### **Overlay de Debug**
- [ ] **Atajo**: `Ctrl+Shift+L` muestra/oculta overlay
- [ ] **Eventos**: Se muestran todos los eventos en tiempo real
- [ ] **Props**: Todas las propiedades se muestran correctamente
- [ ] **Controles**: Limpiar, copiar, exportar funcionan
- [ ] **Persistencia**: Eventos se mantienen entre recargas

### **A/B Testing**
- [ ] **Estabilidad**: Misma variante entre sesiones
- [ ] **Distribución**: ~50/50 entre variantes A y B
- [ ] **Persistencia**: Variante se mantiene en localStorage

---

## 🚨 Criterios de Fallo

### ❌ **FALLA si:**
- Modales no se abren
- Modales no se cierran con Esc o click fuera
- Foco no está atrapado en modales
- Eventos no se registran en overlay de debug
- Props de eventos están incorrectas o faltantes
- A/B testing oscila entre sesiones
- Overlay de debug no funciona
- Errores en consola del navegador

### ✅ **PASA si:**
- Todos los modales abren/cierran correctamente
- Todos los eventos se registran con props correctas
- Overlay de debug funciona perfectamente
- A/B testing es estable
- No hay errores en consola
- Flujos completos funcionan end-to-end

---

## 📊 Reporte de Resultados

### **Flujo 1: Mapa Demo**
- [ ] ✅ **PASA** - Todos los pasos funcionan
- [ ] ❌ **FALLA** - Problemas encontrados:
  ```
  [Describir problemas específicos]
  ```

### **Flujo 2: Mis Sétales**
- [ ] ✅ **PASA** - Todos los pasos funcionan
- [ ] ❌ **FALLA** - Problemas encontrados:
  ```
  [Describir problemas específicos]
  ```

### **Flujo 3: Alertas**
- [ ] ✅ **PASA** - Todos los pasos funcionan
- [ ] ❌ **FALLA** - Problemas encontrados:
  ```
  [Describir problemas específicos]
  ```

### **Verificaciones Generales**
- [ ] ✅ **PASA** - Todas las verificaciones pasan
- [ ] ❌ **FALLA** - Problemas encontrados:
  ```
  [Describir problemas específicos]
  ```

### **Notas Adicionales**
```
[Escribir cualquier observación adicional]
```

---

**🎯 Objetivo**: Verificar que los 3 flujos principales funcionan correctamente con todos los modales, eventos y comportamientos esperados.
