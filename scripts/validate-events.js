#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const REQUIRED_EVENTS = [
  'page_view',
  'demo_view', 
  'demo_interact',
  'register_click',
  'onboarding_complete',
  'onboarding_skip',
  'setal_create',
  'alert_create',
  'paywall_view',
  'upgrade_click',
  'upgrade_complete',
  'trial_start',
  'trial_convert',
  'trial_expire',
  'weather_error'
];

function findEventUsage(eventName) {
  const srcDir = path.join(__dirname, '../src');
  const files = [];
  
  function walkDir(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        walkDir(fullPath);
      } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
        files.push(fullPath);
      }
    }
  }
  
  walkDir(srcDir);
  
  const usage = [];
  
  for (const file of files) {
    try {
      const content = fs.readFileSync(file, 'utf8');
      const lines = content.split('\n');
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.includes(`logEvent('${eventName}'`) || line.includes(`logEvent("${eventName}"`)) {
          usage.push({
            file: path.relative(process.cwd(), file),
            line: i + 1,
            content: line.trim()
          });
        }
      }
    } catch (error) {
      console.error(`Error reading ${file}:`, error.message);
    }
  }
  
  return usage;
}

console.log('🔍 Validando eventos de analytics...\n');

const results = {
  implemented: [],
  missing: [],
  total: REQUIRED_EVENTS.length
};

for (const event of REQUIRED_EVENTS) {
  const usage = findEventUsage(event);
  
  if (usage.length > 0) {
    results.implemented.push({
      event,
      usage
    });
  } else {
    results.missing.push(event);
  }
}

console.log(`📊 Resumen:`);
console.log(`✅ Implementados: ${results.implemented.length}/${results.total}`);
console.log(`❌ Faltantes: ${results.missing.length}/${results.total}\n`);

if (results.implemented.length > 0) {
  console.log('✅ Eventos implementados:');
  for (const { event, usage } of results.implemented) {
    console.log(`  - ${event} (${usage.length} usos)`);
    for (const use of usage) {
      console.log(`    📁 ${use.file}:${use.line}`);
    }
  }
  console.log('');
}

if (results.missing.length > 0) {
  console.log('❌ Eventos faltantes:');
  for (const event of results.missing) {
    console.log(`  - ${event}`);
  }
  console.log('');
}

// Verificar eventos específicos importantes
console.log('🎯 Verificaciones específicas:');

// paywall_view debe incluir variant, trigger, plan
const paywallUsage = findEventUsage('paywall_view');
if (paywallUsage.length > 0) {
  console.log('✅ paywall_view implementado');
  for (const use of paywallUsage) {
    const content = use.content;
    const hasVariant = content.includes('variant');
    const hasTrigger = content.includes('trigger');
    const hasPlan = content.includes('plan');
    
    console.log(`  📁 ${use.file}:${use.line}`);
    console.log(`    - variant: ${hasVariant ? '✅' : '❌'}`);
    console.log(`    - trigger: ${hasTrigger ? '✅' : '❌'}`);
    console.log(`    - plan: ${hasPlan ? '✅' : '❌'}`);
  }
} else {
  console.log('❌ paywall_view no implementado');
}

console.log('\n🎉 Validación completada!');
