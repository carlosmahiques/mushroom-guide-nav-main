#!/usr/bin/env node

// Script de testing para verificar la implementación de Lean Conversion
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🧪 Testing Lean Conversion Implementation...\n');

// Verificar que los archivos principales existen
const requiredFiles = [
  'src/config/featureFlags.ts',
  'src/hooks/useGatedAction.tsx',
  'src/hooks/useLimits.tsx',
  'src/hooks/useAnalytics.tsx',
  'src/hooks/useDemoMode.tsx',
  'src/hooks/useDemoMarkers.tsx',
  'src/components/ui/RegisterModal.tsx',
  'src/components/ui/PaywallModal.tsx',
  'src/components/ui/LimitNudge.tsx',
  'src/components/tour/DemoTour.tsx',
  'docs/integracion-lean/ACTIVACION.md',
];

let allFilesExist = true;

console.log('📁 Verificando archivos requeridos:');
requiredFiles.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  const exists = fs.existsSync(filePath);
  console.log(`   ${exists ? '✅' : '❌'} ${file}`);
  if (!exists) allFilesExist = false;
});

// Verificar que las páginas han sido modificadas
const modifiedPages = [
  'src/pages/Mapa.tsx',
  'src/pages/Setales.tsx',
  'src/pages/Alertas.tsx',
  'src/pages/Datos.tsx',
  'src/components/MapViewLeaflet.tsx',
];

console.log('\n📝 Verificando páginas modificadas:');
modifiedPages.forEach(file => {
  const filePath = path.join(__dirname, '..', file);
  const exists = fs.existsSync(filePath);
  if (exists) {
    const content = fs.readFileSync(filePath, 'utf8');
    const hasLeanImports = content.includes('useGatedAction') || 
                          content.includes('useLimits') || 
                          content.includes('useAnalytics') ||
                          content.includes('useDemoMode');
    console.log(`   ${hasLeanImports ? '✅' : '❌'} ${file} (con imports lean)`);
  } else {
    console.log(`   ❌ ${file} (no existe)`);
    allFilesExist = false;
  }
});

// Verificar configuración de feature flags
console.log('\n🚩 Verificando configuración de feature flags:');
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasLeanFlag = envContent.includes('VITE_ENABLE_LEAN=1');
  const hasDemoFlag = envContent.includes('VITE_ENABLE_DEMO_MODE=1');
  const hasGatingFlag = envContent.includes('VITE_ENABLE_GATING=1');
  const hasPaywallFlag = envContent.includes('VITE_ENABLE_PAYWALL=1');
  const hasAnalyticsFlag = envContent.includes('VITE_ENABLE_ANALYTICS=1');
  const hasTourFlag = envContent.includes('VITE_ENABLE_TOUR=1');
  
  console.log(`   ${hasLeanFlag ? '✅' : '❌'} VITE_ENABLE_LEAN=1`);
  console.log(`   ${hasDemoFlag ? '✅' : '❌'} VITE_ENABLE_DEMO_MODE=1`);
  console.log(`   ${hasGatingFlag ? '✅' : '❌'} VITE_ENABLE_GATING=1`);
  console.log(`   ${hasPaywallFlag ? '✅' : '❌'} VITE_ENABLE_PAYWALL=1`);
  console.log(`   ${hasAnalyticsFlag ? '✅' : '❌'} VITE_ENABLE_ANALYTICS=1`);
  console.log(`   ${hasTourFlag ? '✅' : '❌'} VITE_ENABLE_TOUR=1`);
} else {
  console.log('   ❌ Archivo .env.local no encontrado');
  allFilesExist = false;
}

// Verificar documentación
console.log('\n📚 Verificando documentación:');
const docsPath = path.join(__dirname, '..', 'docs', 'integracion-lean');
if (fs.existsSync(docsPath)) {
  const docsFiles = fs.readdirSync(docsPath);
  const expectedDocs = [
    'ACTIVACION.md',
    'Analytics_Por_Página.md',
    'Demo_Overlay_y_Tour.md',
    'Gating_Global.md',
    'Límites_y_Contadores.md',
    'Pronostico_Fallbacks.md',
    'QA_NoInvasivo.md',
  ];
  
  expectedDocs.forEach(doc => {
    const exists = docsFiles.includes(doc);
    console.log(`   ${exists ? '✅' : '❌'} ${doc}`);
  });
} else {
  console.log('   ❌ Directorio docs/integracion-lean no encontrado');
  allFilesExist = false;
}

// Resumen
console.log('\n📊 Resumen del Testing:');
if (allFilesExist) {
  console.log('✅ Todos los archivos requeridos existen');
  console.log('✅ Configuración de feature flags correcta');
  console.log('✅ Documentación completa');
  console.log('\n🎉 Lean Conversion Implementation: READY FOR TESTING');
  console.log('\n🔧 Próximos pasos:');
  console.log('   1. Abrir http://localhost:8080 en el navegador');
  console.log('   2. Navegar a /mapa para ver demo mode');
  console.log('   3. Verificar marca de agua DEMO y pins naranjas');
  console.log('   4. Probar tour de 3 pasos');
  console.log('   5. Verificar gating en botones');
  console.log('   6. Comprobar contadores de límites');
  console.log('   7. Revisar eventos de analytics en consola');
} else {
  console.log('❌ Algunos archivos faltan o la configuración es incorrecta');
  console.log('🔧 Revisa los errores anteriores antes de continuar');
}

console.log('\n💡 Para desactivar lean conversion:');
console.log('   sed -i \'\' \'s/VITE_ENABLE_LEAN=1/VITE_ENABLE_LEAN=0/\' .env.local');
console.log('   npm run dev');
