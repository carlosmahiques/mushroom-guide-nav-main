import { useCallback, useEffect } from 'react';
import { useAuth } from './useAuth';
import { isFeatureEnabled } from '@/config/featureFlags';

interface AnalyticsEvent {
  id: string;
  name: string;
  props: Record<string, any>;
  timestamp: number;
  userType: 'anonymous' | 'free' | 'pro';
  sessionId: string;
  deviceId?: string;
  userId?: string;
  variant?: 'A' | 'B';
}

interface AnalyticsHook {
  logEvent: (eventName: string, props?: Record<string, any>) => void;
  logPageView: (page: string, userType?: 'anonymous' | 'free' | 'pro') => void;
  getVariant: () => 'A' | 'B';
  getDeviceId: () => string;
  getSessionId: () => string;
}

// Generar ID único
const generateId = () => Math.random().toString(36).substr(2, 9);

// Hash simple para A/B testing
const hashString = (str: string): number => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return Math.abs(hash);
};

// Obtener o crear deviceId
const getOrCreateDeviceId = (): string => {
  const storageKey = 'analytics_device_id';
  let deviceId = localStorage.getItem(storageKey);
  
  if (!deviceId) {
    deviceId = generateId();
    localStorage.setItem(storageKey, deviceId);
  }
  
  return deviceId;
};

// Obtener o crear sessionId
const getOrCreateSessionId = (): string => {
  const storageKey = 'analytics_session_id';
  let sessionId = localStorage.getItem(storageKey);
  
  if (!sessionId) {
    sessionId = generateId();
    localStorage.setItem(storageKey, sessionId);
  }
  
  return sessionId;
};

// Obtener variante A/B estable
const getStableVariant = (userId?: string): 'A' | 'B' => {
  const storageKey = 'analytics_ab_variant';
  let variant = localStorage.getItem(storageKey) as 'A' | 'B';
  
  if (!variant) {
    // Usar userId si está disponible, sino deviceId
    const identifier = userId || getOrCreateDeviceId();
    const hash = hashString(identifier);
    variant = hash % 2 === 0 ? 'A' : 'B';
    localStorage.setItem(storageKey, variant);
  }
  
  return variant;
};

// Guardar evento en localStorage para debug
const saveEventToDebug = (event: AnalyticsEvent) => {
  try {
    const storageKey = 'analytics_debug_events';
    const existing = localStorage.getItem(storageKey);
    const events: AnalyticsEvent[] = existing ? JSON.parse(existing) : [];
    
    events.push(event);
    
    // Mantener solo los últimos 50 eventos
    if (events.length > 50) {
      events.splice(0, events.length - 50);
    }
    
    localStorage.setItem(storageKey, JSON.stringify(events));
    
    // Disparar evento de storage para que el overlay se actualice
    window.dispatchEvent(new StorageEvent('storage', {
      key: storageKey,
      newValue: JSON.stringify(events)
    }));
  } catch (error) {
    console.error('Error saving analytics event to debug:', error);
  }
};

export const useAnalytics = (): AnalyticsHook => {
  const { user } = useAuth();
  const isAnalyticsEnabled = isFeatureEnabled('ENABLE_ANALYTICS');
  const isDebugEnabled = isFeatureEnabled('ANALYTICS_DEBUG');

  // Obtener identificadores
  const deviceId = getOrCreateDeviceId();
  const sessionId = getOrCreateSessionId();
  const variant = getStableVariant(user?.id);

  const logEvent = useCallback((eventName: string, props?: Record<string, any>) => {
    if (!isAnalyticsEnabled) return;

    const event: AnalyticsEvent = {
      id: generateId(),
      name: eventName,
      props: {
        ...props,
        timestamp: Date.now(),
      },
      timestamp: Date.now(),
      userType: user ? 'free' : 'anonymous', // TODO: Detectar si es pro
      sessionId,
      deviceId,
      userId: user?.id,
      variant,
    };

    // Guardar para debug
    saveEventToDebug(event);

    // Debug en consola si está habilitado
    if (isDebugEnabled) {
      console.log('📊 Analytics Event:', event);
    }

    // TODO: Enviar a servicio de analytics real (PostHog, Mixpanel, etc.)
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // });
  }, [user, isAnalyticsEnabled, isDebugEnabled, sessionId, deviceId, variant]);

  const logPageView = useCallback((page: string, userType?: 'anonymous' | 'free' | 'pro') => {
    const actualUserType = userType || (user ? 'free' : 'anonymous');
    
    logEvent('page_view', {
      page,
      user_type: actualUserType,
    });
  }, [logEvent, user]);

  const getVariant = useCallback(() => variant, [variant]);
  const getDeviceId = useCallback(() => deviceId, [deviceId]);
  const getSessionId = useCallback(() => sessionId, [sessionId]);

  return {
    logEvent,
    logPageView,
    getVariant,
    getDeviceId,
    getSessionId,
  };
};
