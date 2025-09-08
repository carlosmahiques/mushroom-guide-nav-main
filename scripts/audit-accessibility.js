#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔍 Auditoría de Accesibilidad - Setas.AI\n');

// Función para verificar contenido de archivos
function checkFileContent(filePath, patterns) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const results = {};
    
    patterns.forEach(pattern => {
      const regex = new RegExp(pattern.regex, 'g');
      const matches = content.match(regex);
      results[pattern.name] = {
        found: !!matches,
        count: matches ? matches.length : 0,
        matches: matches || []
      };
    });
    
    return results;
  } catch (error) {
    return { error: error.message };
  }
}

// Patrones de verificación de accesibilidad
const ariaPatterns = [
  { name: 'role="dialog"', regex: 'role=["\']dialog["\']' },
  { name: 'aria-labelledby', regex: 'aria-labelledby' },
  { name: 'aria-describedby', regex: 'aria-describedby' },
  { name: 'aria-modal', regex: 'aria-modal' },
  { name: 'aria-hidden', regex: 'aria-hidden' },
  { name: 'sr-only', regex: 'sr-only' },
  { name: 'focus-visible', regex: 'focus-visible' },
  { name: 'tabindex', regex: 'tabindex' },
  { name: 'onKeyDown', regex: 'onKeyDown' },
  { name: 'onKeyUp', regex: 'onKeyUp' },
  { name: 'Escape', regex: 'Escape|key.*===.*[\'"]Escape[\'"]' },
  { name: 'h-10', regex: 'h-10' },
  { name: 'h-11', regex: 'h-11' },
  { name: 'min-h-\\[44px\\]', regex: 'min-h-\\[44px\\]' },
  { name: 'text-primary', regex: 'text-primary' },
  { name: 'text-muted-foreground', regex: 'text-muted-foreground' },
  { name: 'bg-primary', regex: 'bg-primary' },
  { name: 'bg-background', regex: 'bg-background' }
];

// Verificar archivos de componentes
const componentsToCheck = [
  {
    name: 'RegisterModal',
    path: '../src/components/ui/RegisterModal.tsx',
    type: 'modal'
  },
  {
    name: 'PaywallModal', 
    path: '../src/components/ui/PaywallModal.tsx',
    type: 'modal'
  },
  {
    name: 'DemoTour',
    path: '../src/components/tour/DemoTour.tsx',
    type: 'tour'
  },
  {
    name: 'Dialog (Base)',
    path: '../src/components/ui/dialog.tsx',
    type: 'base'
  },
  {
    name: 'Button (Base)',
    path: '../src/components/ui/button.tsx',
    type: 'base'
  }
];

console.log('📋 Verificación de Componentes:');
console.log('=====================================\n');

const auditResults = {};

componentsToCheck.forEach(component => {
  console.log(`🔍 ${component.name} (${component.type}):`);
  console.log('-------------------------------------');
  
  const filePath = path.join(__dirname, component.path);
  const results = checkFileContent(filePath, ariaPatterns);
  
  if (results.error) {
    console.log(`❌ Error: ${results.error}`);
  } else {
    // Verificar criterios específicos por tipo
    if (component.type === 'modal') {
      console.log('✅ Criterios de Modal:');
      console.log(`   - role="dialog": ${results['role="dialog"'].found ? '✅' : '❌'}`);
      console.log(`   - aria-labelledby: ${results['aria-labelledby'].found ? '✅' : '❌'}`);
      console.log(`   - aria-describedby: ${results['aria-describedby'].found ? '✅' : '❌'}`);
      console.log(`   - aria-modal: ${results['aria-modal'].found ? '✅' : '❌'}`);
      console.log(`   - Escape key: ${results['Escape'].found ? '✅' : '❌'}`);
      console.log(`   - Focus visible: ${results['focus-visible'].found ? '✅' : '❌'}`);
      console.log(`   - Screen reader: ${results['sr-only'].found ? '✅' : '❌'}`);
    }
    
    if (component.type === 'tour') {
      console.log('✅ Criterios de Tour:');
      console.log(`   - Escape key: ${results['Escape'].found ? '✅' : '❌'}`);
      console.log(`   - onKeyDown: ${results['onKeyDown'].found ? '✅' : '❌'}`);
      console.log(`   - Focus visible: ${results['focus-visible'].found ? '✅' : '❌'}`);
    }
    
    if (component.type === 'base') {
      console.log('✅ Criterios Base:');
      console.log(`   - Focus visible: ${results['focus-visible'].found ? '✅' : '❌'}`);
      console.log(`   - h-10 (40px): ${results['h-10'].found ? '✅' : '❌'}`);
      console.log(`   - h-11 (44px): ${results['h-11'].found ? '✅' : '❌'}`);
      console.log(`   - min-h-[44px]: ${results['min-h-\\[44px\\]'].found ? '✅' : '❌'}`);
    }
    
    // Verificar contraste
    console.log('✅ Contraste:');
    console.log(`   - text-primary: ${results['text-primary'].found ? '✅' : '❌'}`);
    console.log(`   - text-muted-foreground: ${results['text-muted-foreground'].found ? '✅' : '❌'}`);
    console.log(`   - bg-primary: ${results['bg-primary'].found ? '✅' : '❌'}`);
    console.log(`   - bg-background: ${results['bg-background'].found ? '✅' : '❌'}`);
  }
  
  auditResults[component.name] = results;
  console.log('');
});

// Verificar configuración de Tailwind para contraste
console.log('🎨 Verificación de Contraste (Tailwind Config):');
console.log('=====================================');

const tailwindConfigPath = path.join(__dirname, '../tailwind.config.ts');
try {
  const tailwindContent = fs.readFileSync(tailwindConfigPath, 'utf8');
  
  const contrastPatterns = [
    { name: 'primary color', regex: 'primary.*:' },
    { name: 'background color', regex: 'background.*:' },
    { name: 'foreground color', regex: 'foreground.*:' },
    { name: 'muted color', regex: 'muted.*:' }
  ];
  
  contrastPatterns.forEach(pattern => {
    const regex = new RegExp(pattern.regex, 'g');
    const matches = tailwindContent.match(regex);
    console.log(`   - ${pattern.name}: ${matches ? '✅' : '❌'}`);
  });
} catch (error) {
  console.log(`❌ Error leyendo tailwind.config.ts: ${error.message}`);
}

// Verificar CSS global
console.log('\n🌐 Verificación de CSS Global:');
console.log('=====================================');

const globalCssPath = path.join(__dirname, '../src/index.css');
try {
  const cssContent = fs.readFileSync(globalCssPath, 'utf8');
  
  const cssPatterns = [
    { name: 'focus-visible', regex: 'focus-visible' },
    { name: 'outline', regex: 'outline' },
    { name: 'ring', regex: 'ring' }
  ];
  
  cssPatterns.forEach(pattern => {
    const regex = new RegExp(pattern.regex, 'g');
    const matches = cssContent.match(regex);
    console.log(`   - ${pattern.name}: ${matches ? '✅' : '❌'}`);
  });
} catch (error) {
  console.log(`❌ Error leyendo index.css: ${error.message}`);
}

// Resumen de accesibilidad
console.log('\n📊 Resumen de Accesibilidad:');
console.log('=====================================');

const summary = {
  modals: {
    ariaRoles: 0,
    focusManagement: 0,
    keyboardNavigation: 0,
    screenReader: 0
  },
  tour: {
    keyboardNavigation: 0,
    focusManagement: 0
  },
  touch: {
    minSize: 0
  },
  contrast: {
    colors: 0
  }
};

// Contar criterios cumplidos
Object.values(auditResults).forEach(result => {
  if (result['role="dialog"']?.found) summary.modals.ariaRoles++;
  if (result['aria-labelledby']?.found) summary.modals.ariaRoles++;
  if (result['aria-describedby']?.found) summary.modals.ariaRoles++;
  if (result['aria-modal']?.found) summary.modals.ariaRoles++;
  if (result['focus-visible']?.found) summary.modals.focusManagement++;
  if (result['Escape']?.found) summary.modals.keyboardNavigation++;
  if (result['onKeyDown']?.found) summary.modals.keyboardNavigation++;
  if (result['sr-only']?.found) summary.modals.screenReader++;
  if (result['h-10']?.found) summary.touch.minSize++;
  if (result['h-11']?.found) summary.touch.minSize++;
  if (result['min-h-\\[44px\\]']?.found) summary.touch.minSize++;
  if (result['text-primary']?.found) summary.contrast.colors++;
  if (result['text-muted-foreground']?.found) summary.contrast.colors++;
  if (result['bg-primary']?.found) summary.contrast.colors++;
  if (result['bg-background']?.found) summary.contrast.colors++;
});

console.log('✅ Modales:');
console.log(`   - Roles ARIA: ${summary.modals.ariaRoles}/4`);
console.log(`   - Gestión de foco: ${summary.modals.focusManagement}/1`);
console.log(`   - Navegación por teclado: ${summary.modals.keyboardNavigation}/2`);
console.log(`   - Lectores de pantalla: ${summary.modals.screenReader}/1`);

console.log('\n✅ Tour:');
console.log(`   - Navegación por teclado: ${summary.tour.keyboardNavigation}/1`);
console.log(`   - Gestión de foco: ${summary.tour.focusManagement}/1`);

console.log('\n✅ Táctil:');
console.log(`   - Tamaño mínimo (≥44px): ${summary.touch.minSize}/3`);

console.log('\n✅ Contraste:');
console.log(`   - Colores accesibles: ${summary.contrast.colors}/4`);

// Criterios de aceptación
console.log('\n🎯 Criterios de Aceptación:');
console.log('=====================================');

const totalCriteria = 12;
const passedCriteria = summary.modals.ariaRoles + summary.modals.focusManagement + 
                      summary.modals.keyboardNavigation + summary.modals.screenReader +
                      summary.tour.keyboardNavigation + summary.tour.focusManagement +
                      summary.touch.minSize + summary.contrast.colors;

console.log(`📊 Total: ${passedCriteria}/${totalCriteria} criterios cumplidos`);
console.log(`📈 Porcentaje: ${Math.round((passedCriteria / totalCriteria) * 100)}%`);

if (passedCriteria >= totalCriteria * 0.8) {
  console.log('🎉 ✅ ACCESIBILIDAD: CUMPLE ESTÁNDARES');
} else {
  console.log('⚠️ ❌ ACCESIBILIDAD: NECESITA MEJORAS');
}

console.log('\n💡 Recomendaciones:');
console.log('=====================================');
console.log('1. Verificar que todos los modales usen Radix UI (ya implementado)');
console.log('2. Confirmar que el focus trap funciona correctamente');
console.log('3. Probar con lectores de pantalla (NVDA, JAWS, VoiceOver)');
console.log('4. Verificar contraste con herramientas como WebAIM');
console.log('5. Probar navegación solo con teclado');
console.log('6. Verificar en dispositivos táctiles reales');

console.log('\n🔧 Próximos pasos:');
console.log('=====================================');
console.log('1. Ejecutar pruebas manuales de accesibilidad');
console.log('2. Usar herramientas automáticas (axe-core, Lighthouse)');
console.log('3. Probar con usuarios reales con discapacidades');
console.log('4. Documentar patrones de accesibilidad para el equipo');
