// Taxonomía de eventos de analytics - Setas.AI
// Basado en docs/lean/Analytics_y_NSMetric.md

export const REQUIRED_EVENTS = [
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
] as const;

export type RequiredEventName = typeof REQUIRED_EVENTS[number];

// Props requeridas para cada evento
export const EVENT_PROPS: Record<RequiredEventName, string[]> = {
  page_view: ['page', 'user_type', 'timestamp'],
  demo_view: ['source', 'user_agent', 'timestamp'],
  demo_interact: ['action', 'coordinates', 'duration'],
  register_click: ['source', 'variant'],
  onboarding_complete: ['steps_completed', 'skipped_steps', 'zona_selected', 'especie_selected', 'alerta_created'],
  onboarding_skip: ['step', 'reason', 'timestamp'],
  setal_create: ['setal_id', 'coordinates', 'especie', 'time_to_first_setal'],
  alert_create: ['alerta_id', 'zona', 'especie', 'condiciones', 'time_to_first_alert'],
  paywall_view: ['variant', 'trigger', 'plan', 'current_usage'],
  upgrade_click: ['variant', 'trigger', 'time_on_paywall'],
  upgrade_complete: ['variant', 'payment_method', 'time_to_upgrade'],
  trial_start: ['variant', 'trigger', 'trial_duration'],
  trial_convert: ['variant', 'days_used', 'payment_method'],
  trial_expire: ['variant', 'days_used', 'last_activity'],
  weather_error: ['status', 'source', 'error_message', 'timestamp']
};

// Validar que un evento tenga las props correctas
export const validateEvent = (eventName: string, props: Record<string, any>): boolean => {
  if (!REQUIRED_EVENTS.includes(eventName as RequiredEventName)) {
    console.warn(`⚠️ Evento no reconocido: ${eventName}`);
    return false;
  }

  const requiredProps = EVENT_PROPS[eventName as RequiredEventName];
  const missingProps = requiredProps.filter(prop => !(prop in props));
  
  if (missingProps.length > 0) {
    console.warn(`⚠️ Evento ${eventName} le faltan props:`, missingProps);
    return false;
  }

  return true;
};

// Obtener eventos faltantes
export const getMissingEvents = (loggedEvents: string[]): string[] => {
  return REQUIRED_EVENTS.filter(event => !loggedEvents.includes(event));
};

// Obtener eventos implementados
export const getImplementedEvents = (loggedEvents: string[]): string[] => {
  return REQUIRED_EVENTS.filter(event => loggedEvents.includes(event));
};
