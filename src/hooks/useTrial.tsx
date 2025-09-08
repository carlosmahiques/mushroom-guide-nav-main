import { useState, useEffect, useCallback } from 'react';
import { useAnalytics } from './useAnalytics';
import { isFeatureEnabled } from '@/config/featureFlags';

interface TrialState {
  isActive: boolean;
  startDate: Date | null;
  endDate: Date | null;
  daysRemaining: number;
  variant: 'A' | 'B';
}

interface UseTrialReturn {
  trialState: TrialState;
  startTrial: (trigger: string) => void;
  convertTrial: (paymentMethod: string) => void;
  expireTrial: () => void;
  isTrialActive: boolean;
  daysRemaining: number;
}

const TRIAL_DURATION_DAYS = 7;
const TRIAL_STORAGE_KEY = 'trial_state';

export const useTrial = (): UseTrialReturn => {
  const [trialState, setTrialState] = useState<TrialState>({
    isActive: false,
    startDate: null,
    endDate: null,
    daysRemaining: 0,
    variant: 'A'
  });
  
  const { logEvent, getVariant } = useAnalytics();
  const isAnalyticsEnabled = isFeatureEnabled('ENABLE_ANALYTICS');

  // Cargar estado del trial desde localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(TRIAL_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const startDate = new Date(parsed.startDate);
        const endDate = new Date(parsed.endDate);
        const now = new Date();
        
        if (now < endDate) {
          // Trial aún activo
          setTrialState({
            isActive: true,
            startDate,
            endDate,
            daysRemaining: Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)),
            variant: parsed.variant
          });
        } else {
          // Trial expirado
          setTrialState({
            isActive: false,
            startDate,
            endDate,
            daysRemaining: 0,
            variant: parsed.variant
          });
          
          // Log trial_expire si no se ha loggeado antes
          if (isAnalyticsEnabled && !parsed.expiredLogged) {
            logEvent('trial_expire', {
              variant: parsed.variant,
              days_used: TRIAL_DURATION_DAYS,
              last_activity: 'trial_expired'
            });
            
            // Marcar como loggeado
            localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify({
              ...parsed,
              expiredLogged: true
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error loading trial state:', error);
    }
  }, [isAnalyticsEnabled, logEvent]);

  const startTrial = useCallback((trigger: string) => {
    const variant = getVariant();
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + TRIAL_DURATION_DAYS);
    
    const newTrialState: TrialState = {
      isActive: true,
      startDate,
      endDate,
      daysRemaining: TRIAL_DURATION_DAYS,
      variant
    };
    
    setTrialState(newTrialState);
    
    // Guardar en localStorage
    localStorage.setItem(TRIAL_STORAGE_KEY, JSON.stringify({
      ...newTrialState,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString()
    }));
    
    // Log trial_start
    if (isAnalyticsEnabled) {
      logEvent('trial_start', {
        variant,
        trigger,
        trial_duration: TRIAL_DURATION_DAYS
      });
    }
  }, [getVariant, isAnalyticsEnabled, logEvent]);

  const convertTrial = useCallback((paymentMethod: string) => {
    if (!trialState.isActive) return;
    
    const daysUsed = trialState.startDate 
      ? Math.ceil((new Date().getTime() - trialState.startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    // Log trial_convert
    if (isAnalyticsEnabled) {
      logEvent('trial_convert', {
        variant: trialState.variant,
        days_used: daysUsed,
        payment_method: paymentMethod
      });
    }
    
    // Limpiar trial state
    setTrialState({
      isActive: false,
      startDate: null,
      endDate: null,
      daysRemaining: 0,
      variant: 'A'
    });
    
    localStorage.removeItem(TRIAL_STORAGE_KEY);
  }, [trialState, isAnalyticsEnabled, logEvent]);

  const expireTrial = useCallback(() => {
    if (!trialState.isActive) return;
    
    const daysUsed = trialState.startDate 
      ? Math.ceil((new Date().getTime() - trialState.startDate.getTime()) / (1000 * 60 * 60 * 24))
      : 0;
    
    // Log trial_expire
    if (isAnalyticsEnabled) {
      logEvent('trial_expire', {
        variant: trialState.variant,
        days_used: daysUsed,
        last_activity: 'manual_expire'
      });
    }
    
    // Limpiar trial state
    setTrialState({
      isActive: false,
      startDate: null,
      endDate: null,
      daysRemaining: 0,
      variant: 'A'
    });
    
    localStorage.removeItem(TRIAL_STORAGE_KEY);
  }, [trialState, isAnalyticsEnabled, logEvent]);

  return {
    trialState,
    startTrial,
    convertTrial,
    expireTrial,
    isTrialActive: trialState.isActive,
    daysRemaining: trialState.daysRemaining
  };
};
