import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { isFeatureEnabled } from '@/config/featureFlags';

// Límites por plan
const FREE_LIMITS = {
  setales: 3,
  zonas: 1,
  alertas: 1,
} as const;

const PRO_LIMITS = {
  setales: Infinity,
  zonas: Infinity,
  alertas: Infinity,
} as const;

export interface Usage {
  setales: number;
  zonas: number;
  alertas: number;
}

interface LimitsHook {
  currentUsage: Usage;
  limits: typeof FREE_LIMITS | typeof PRO_LIMITS;
  remaining: Usage;
  plan: 'free' | 'pro';
  isAtLimit: (type: 'setales' | 'alertas' | 'zonas') => boolean;
  isLoading: boolean;
}

export const useLimits = (): LimitsHook => {
  const { user } = useAuth();
  const [currentUsage, setCurrentUsage] = useState<Usage>({ setales: 0, alertas: 0, zonas: 0 });
  const [isLoading, setIsLoading] = useState(true);

  // Verificar si paywall está habilitado
  const isPaywallEnabled = isFeatureEnabled('ENABLE_PAYWALL');

  // Determinar plan del usuario
  const plan = user?.plan || 'free';
  const limits = plan === 'pro' ? PRO_LIMITS : FREE_LIMITS;

  // Calcular uso restante
  const remaining = {
    setales: Math.max(0, limits.setales - currentUsage.setales),
    alertas: Math.max(0, limits.alertas - currentUsage.alertas),
    zonas: Math.max(0, limits.zonas - currentUsage.zonas),
  };

  // Verificar si está en el límite
  const isAtLimit = (type: keyof Usage): boolean => {
    if (!isPaywallEnabled) return false;
    return currentUsage[type] >= limits[type];
  };

  // Cargar uso actual del usuario
  useEffect(() => {
    const loadUsage = async () => {
      if (!user || !isPaywallEnabled) {
        setCurrentUsage({ setales: 0, alertas: 0, zonas: 0 });
        setIsLoading(false);
        return;
      }

      try {
        // TODO: Implementar llamada a Supabase para obtener uso real
        // Por ahora usar datos mock
        setCurrentUsage({ setales: 0, alertas: 0, zonas: 0 });
      } catch (error) {
        console.error('Error loading usage:', error);
        setCurrentUsage({ setales: 0, alertas: 0, zonas: 0 });
      } finally {
        setIsLoading(false);
      }
    };

    loadUsage();
  }, [user, isPaywallEnabled]);

  return {
    currentUsage,
    limits,
    remaining,
    plan,
    isAtLimit,
    isLoading,
  };
};
