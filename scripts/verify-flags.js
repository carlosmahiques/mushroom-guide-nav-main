#!/usr/bin/env node

// Script para verificar que los feature flags funcionan correctamente
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Verificando Feature Flags...\n');

// Leer archivo .env.local
const envPath = path.join(__dirname, '..', '.env.local');
if (!fs.existsSync(envPath)) {
  console.error('❌ Archivo .env.local no encontrado');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const enableLeanMatch = envContent.match(/VITE_ENABLE_LEAN=(\d+)/);

if (!enableLeanMatch) {
  console.error('❌ VITE_ENABLE_LEAN no encontrado en .env.local');
  process.exit(1);
}

const enableLean = enableLeanMatch[1] === '1';

console.log(`📋 Estado actual: VITE_ENABLE_LEAN=${enableLeanMatch[1]}`);
console.log(`🚩 Lean Conversion: ${enableLean ? '✅ ACTIVADO' : '❌ DESACTIVADO'}\n`);

if (enableLean) {
  console.log('✅ Con ENABLE_LEAN=1 se espera:');
  console.log('   - Marca de agua DEMO visible en mapa');
  console.log('   - Gating de acciones activo');
  console.log('   - Paywall en límites');
  console.log('   - Tour de 3 pasos');
  console.log('   - Analytics y eventos');
  console.log('   - Contadores de límites');
} else {
  console.log('✅ Con ENABLE_LEAN=0 se espera:');
  console.log('   - NO marca de agua DEMO');
  console.log('   - NO gating de acciones');
  console.log('   - NO paywall');
  console.log('   - NO tour');
  console.log('   - NO analytics lean');
  console.log('   - App funciona exactamente igual que antes');
}

console.log('\n🔧 Para cambiar el estado:');
console.log('   sed -i \'\' \'s/VITE_ENABLE_LEAN=0/VITE_ENABLE_LEAN=1/\' .env.local');
console.log('   sed -i \'\' \'s/VITE_ENABLE_LEAN=1/VITE_ENABLE_LEAN=0/\' .env.local');

console.log('\n🔄 Reinicia el servidor después de cambiar:');
console.log('   npm run dev');
