import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { isFeatureEnabled } from '@/config/featureFlags';
import { FEATURE_FLAGS } from '@/config/featureFlags';

export const useDemoMode = () => {
  const { user } = useAuth();
  const [demoEnabled, setDemoEnabled] = useState(false);
  const isDemoModeEnabled = isFeatureEnabled('ENABLE_DEMO_MODE');

  useEffect(() => {
    if (!isDemoModeEnabled) {
      setDemoEnabled(false);
      return;
    }

    // Si hay usuario, verificar preferencia guardada
    if (user) {
      const stored = localStorage.getItem(FEATURE_FLAGS.DEMO_MODE_STORAGE_KEY);
      if (stored !== null) {
        setDemoEnabled(stored === 'true');
      } else {
        // Por defecto, demo desactivado para usuarios autenticados
        setDemoEnabled(false);
      }
    } else {
      // Si no hay usuario, demo activado solo si está configurado
      setDemoEnabled(FEATURE_FLAGS.DEMO_DEFAULT_ON);
    }
  }, [user, isDemoModeEnabled]);

  const toggleDemo = () => {
    if (!isDemoModeEnabled) return;
    
    const newValue = !demoEnabled;
    setDemoEnabled(newValue);
    localStorage.setItem(FEATURE_FLAGS.DEMO_MODE_STORAGE_KEY, newValue.toString());
  };

  return {
    isDemoMode: demoEnabled,
    toggleDemo,
    canToggle: isDemoModeEnabled && !!user, // Solo usuarios logueados pueden toggle
  };
};
