#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Iniciando pruebas E2E manuales...\n');

// Verificar que la app está corriendo
try {
  const response = execSync('curl -s -o /dev/null -w "%{http_code}" http://localhost:8081', { encoding: 'utf8' });
  if (response.trim() !== '200') {
    console.error('❌ La aplicación no está corriendo en http://localhost:8081');
    console.log('💡 Ejecuta: export PATH="/opt/homebrew/opt/node@20/bin:$PATH" && npm run dev');
    process.exit(1);
  }
  console.log('✅ Aplicación corriendo en http://localhost:8081');
} catch (error) {
  console.error('❌ Error verificando la aplicación:', error.message);
  process.exit(1);
}

console.log('\n📋 INSTRUCCIONES PARA PRUEBAS E2E MANUALES:\n');

console.log('🔧 PREPARACIÓN:');
console.log('1. Abrir http://localhost:8081 en el navegador');
console.log('2. Abrir DevTools (F12)');
console.log('3. Ir a Application > Storage > Clear storage > Clear site data');
console.log('4. Presionar Ctrl+Shift+L para mostrar overlay de analytics');
console.log('5. Verificar que aparecen controles de prueba en la esquina inferior derecha\n');

console.log('🔄 FLUJO 1: Mapa Demo (Anónimo)');
console.log('1. Hacer click en "Mapa interactivo" en el sidebar');
console.log('2. Verificar que aparece tour de 3 pasos automáticamente');
console.log('3. En overlay de analytics, verificar evento: demo_view');
console.log('4. Hacer click en "Nuevo sétal"');
console.log('5. Hacer click en cualquier parte del mapa');
console.log('6. Verificar que aparece RegisterModal');
console.log('7. Hacer click en "Crear cuenta"');
console.log('8. En overlay de analytics, verificar evento: register_click');
console.log('9. Verificar props: { source: "demo", context: "modal", action_attempted: "create_setal" }\n');

console.log('🔄 FLUJO 2: Mis Sétales (Free - Límite Alcanzado)');
console.log('1. En controles de prueba, hacer click en "Flujo 2: Setales Límite (3/3)"');
console.log('2. Hacer click en "Mis sétales" en el sidebar');
console.log('3. Verificar que se muestra contador "3/3 setales"');
console.log('4. En overlay de analytics, verificar evento: page_view');
console.log('5. Hacer click en "Añadir localización"');
console.log('6. Verificar que aparece PaywallModal');
console.log('7. En overlay de analytics, verificar evento: paywall_view');
console.log('8. Verificar props: { variant: "A"|"B", trigger: "setal_limit", plan: "free" }');
console.log('9. Hacer click en "Desbloquear Pro - €X,XX/mes"');
console.log('10. En overlay de analytics, verificar eventos: upgrade_click, trial_start');
console.log('11. Verificar props de trial_start: { variant: "A"|"B", trigger: "setal_limit", trial_duration: 7 }\n');

console.log('🔄 FLUJO 3: Alertas (Free - Límite Alcanzado)');
console.log('1. En controles de prueba, hacer click en "Flujo 3: Alertas Límite (1/1)"');
console.log('2. Hacer click en "Alertas" en el sidebar');
console.log('3. Verificar que se muestra contador "1/1 alertas"');
console.log('4. En overlay de analytics, verificar evento: page_view');
console.log('5. Hacer click en "Nueva alerta"');
console.log('6. Verificar que aparece PaywallModal');
console.log('7. En overlay de analytics, verificar evento: paywall_view');
console.log('8. Verificar props: { variant: "A"|"B", trigger: "alert_limit", plan: "free" }\n');

console.log('🔍 VERIFICACIONES GENERALES:');
console.log('1. Todos los modales se cierran con Esc');
console.log('2. Todos los modales se cierran haciendo click fuera');
console.log('3. Todos los modales tienen foco atrapado (Tab navega solo dentro)');
console.log('4. Modales aparecen por encima del mapa (z-index correcto)');
console.log('5. Overlay de analytics funciona correctamente');
console.log('6. Controles de prueba funcionan correctamente');
console.log('7. No hay errores en consola del navegador\n');

console.log('📊 CRITERIOS DE ÉXITO:');
console.log('✅ Todos los modales abren/cierran correctamente');
console.log('✅ Todos los eventos se registran con props correctas');
console.log('✅ Overlay de analytics funciona perfectamente');
console.log('✅ A/B testing es estable (misma variante entre sesiones)');
console.log('✅ No hay errores en consola');
console.log('✅ Flujos completos funcionan end-to-end\n');

console.log('🚨 CRITERIOS DE FALLO:');
console.log('❌ Modales no se abren');
console.log('❌ Modales no se cierran con Esc o click fuera');
console.log('❌ Foco no está atrapado en modales');
console.log('❌ Eventos no se registran en overlay de analytics');
console.log('❌ Props de eventos están incorrectas o faltantes');
console.log('❌ A/B testing oscila entre sesiones');
console.log('❌ Overlay de analytics no funciona');
console.log('❌ Errores en consola del navegador\n');

console.log('💡 TIPS:');
console.log('- Usar controles de prueba para simular diferentes estados');
console.log('- Verificar overlay de analytics en cada paso');
console.log('- Probar en diferentes tamaños de pantalla');
console.log('- Verificar que no hay errores en consola');
console.log('- Documentar cualquier problema encontrado\n');

console.log('🎯 ¡Comienza las pruebas manuales siguiendo las instrucciones anteriores!');
console.log('📝 Documenta los resultados en E2E_TESTING_MANUAL.md');
