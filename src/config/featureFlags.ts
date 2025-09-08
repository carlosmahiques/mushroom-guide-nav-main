// Feature Flags Configuration
// Controla la activación/desactivación de funcionalidades lean

export const FEATURE_FLAGS = {
  // Flag principal que controla toda la funcionalidad lean
  ENABLE_LEAN: import.meta.env.VITE_ENABLE_LEAN === '1' || import.meta.env.VITE_ENABLE_LEAN === 'true',
  
  // Flags individuales para cada funcionalidad
  ENABLE_DEMO_MODE: import.meta.env.VITE_ENABLE_DEMO_MODE === '1' || import.meta.env.VITE_ENABLE_DEMO_MODE === 'true',
  ENABLE_GATING: import.meta.env.VITE_ENABLE_GATING === '1' || import.meta.env.VITE_ENABLE_GATING === 'true',
  ENABLE_PAYWALL: import.meta.env.VITE_ENABLE_PAYWALL === '1' || import.meta.env.VITE_ENABLE_PAYWALL === 'true',
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === '1' || import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_TOUR: import.meta.env.VITE_ENABLE_TOUR === '1' || import.meta.env.VITE_ENABLE_TOUR === 'true',
  
  // Configuración de demo
  DEMO_DEFAULT_ON: import.meta.env.VITE_DEMO_DEFAULT_ON === '1' || import.meta.env.VITE_DEMO_DEFAULT_ON === 'true',
  
  // A/B Testing
  PAYWALL_VARIANT_A_PRICE: parseFloat(import.meta.env.VITE_PAYWALL_VARIANT_A_PRICE || '3.99'),
  PAYWALL_VARIANT_B_PRICE: parseFloat(import.meta.env.VITE_PAYWALL_VARIANT_B_PRICE || '7.99'),
  
  // Storage keys
  TOUR_STORAGE_KEY: import.meta.env.VITE_TOUR_STORAGE_KEY || 'demo_tour_completed',
  DEMO_MODE_STORAGE_KEY: import.meta.env.VITE_DEMO_MODE_STORAGE_KEY || 'demo_mode_enabled',
  
  // Analytics
  ANALYTICS_ENABLED: import.meta.env.VITE_ANALYTICS_ENABLED === '1' || import.meta.env.VITE_ANALYTICS_ENABLED === 'true',
  ANALYTICS_DEBUG: import.meta.env.VITE_ANALYTICS_DEBUG === '1' || import.meta.env.VITE_ANALYTICS_DEBUG === 'true',
} as const;

// Helper para verificar si una funcionalidad está habilitada
export const isFeatureEnabled = (feature: keyof typeof FEATURE_FLAGS): boolean => {
  // Si ENABLE_LEAN está desactivado, todas las funcionalidades lean están desactivadas
  if (!FEATURE_FLAGS.ENABLE_LEAN) {
    return false;
  }
  
  return FEATURE_FLAGS[feature];
};

// Helper para verificar múltiples features
export const areFeaturesEnabled = (features: (keyof typeof FEATURE_FLAGS)[]): boolean => {
  return features.every(feature => isFeatureEnabled(feature));
};

// Log de configuración en desarrollo
if (import.meta.env.DEV) {
  console.log('🚩 Feature Flags:', FEATURE_FLAGS);
  console.log('🚩 Lean Conversion Enabled:', FEATURE_FLAGS.ENABLE_LEAN);
}
