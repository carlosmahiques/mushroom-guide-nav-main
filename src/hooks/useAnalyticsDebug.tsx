import { useState, useEffect, useCallback } from 'react';
import { isFeatureEnabled } from '@/config/featureFlags';

interface UseAnalyticsDebugReturn {
  isVisible: boolean;
  toggleVisibility: () => void;
  showOverlay: () => void;
  hideOverlay: () => void;
}

export const useAnalyticsDebug = (): UseAnalyticsDebugReturn => {
  const [isVisible, setIsVisible] = useState(false);
  const isDebugEnabled = isFeatureEnabled('ANALYTICS_DEBUG');

  const toggleVisibility = useCallback(() => {
    setIsVisible(prev => !prev);
  }, []);

  const showOverlay = useCallback(() => {
    setIsVisible(true);
  }, []);

  const hideOverlay = useCallback(() => {
    setIsVisible(false);
  }, []);

  // Manejar atajo de teclado Ctrl+Shift+L
  useEffect(() => {
    if (!isDebugEnabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'L') {
        event.preventDefault();
        toggleVisibility();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDebugEnabled, toggleVisibility]);

  return {
    isVisible,
    toggleVisibility,
    showOverlay,
    hideOverlay,
  };
};
