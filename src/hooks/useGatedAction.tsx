import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { isFeatureEnabled } from '@/config/featureFlags';

interface GatedActionHook {
  gatedAction: (actionName: string, context?: any) => boolean;
  isBlocked: (actionName: string) => boolean;
  getBlockReason: (actionName: string) => 'no_session' | 'demo_mode' | 'limit_reached' | null;
}

export const useGatedAction = (): GatedActionHook => {
  const { user } = useAuth();

  // Verificar si gating está habilitado
  const isGatingEnabled = isFeatureEnabled('ENABLE_GATING');

  const gatedAction = useCallback((actionName: string, context?: any): boolean => {
    console.log('🔍 useGatedAction called:', { actionName, context, user, isGatingEnabled });
    
    // Si gating no está habilitado, permitir todas las acciones
    if (!isGatingEnabled) {
      console.log('✅ Gating disabled, allowing action');
      return true;
    }

    // Sin sesión: retornar false para que el componente maneje el modal
    if (!user) {
      console.log('❌ No user session, blocking action');
      return false;
    }

    // TODO: Verificar límites cuando se implemente useLimits
    // if (isAtLimit(actionName)) {
    //   return false;
    // }

    console.log('✅ User session exists, allowing action');
    return true;
  }, [user, isGatingEnabled]);

  const isBlocked = useCallback((actionName: string): boolean => {
    if (!isGatingEnabled) return false;
    return !user; // Por ahora solo verificar sesión
  }, [user, isGatingEnabled]);

  const getBlockReason = useCallback((actionName: string): 'no_session' | 'demo_mode' | 'limit_reached' | null => {
    if (!isGatingEnabled) return null;
    if (!user) return 'no_session';
    // TODO: Verificar límites
    return null;
  }, [user, isGatingEnabled]);

  return {
    gatedAction,
    isBlocked,
    getBlockReason,
  };
};
