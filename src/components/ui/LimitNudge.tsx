import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/useAnalytics';
import { isFeatureEnabled } from '@/config/featureFlags';

interface LimitNudgeProps {
  type: 'setales' | 'alertas' | 'zonas';
  remaining: number;
  onUpgrade?: () => void;
}

export function LimitNudge({ type, remaining, onUpgrade }: LimitNudgeProps) {
  const { logEvent } = useAnalytics();
  const isAnalyticsEnabled = isFeatureEnabled('ENABLE_ANALYTICS');

  const getTypeInfo = () => {
    switch (type) {
      case 'setales':
        return {
          singular: 'setal',
          plural: 'setales',
          icon: '🍄',
          color: 'bg-orange-50 border-orange-200 text-orange-800',
        };
      case 'alertas':
        return {
          singular: 'alerta',
          plural: 'alertas',
          icon: '🔔',
          color: 'bg-blue-50 border-blue-200 text-blue-800',
        };
      case 'zonas':
        return {
          singular: 'zona',
          plural: 'zonas',
          icon: '📍',
          color: 'bg-green-50 border-green-200 text-green-800',
        };
    }
  };

  const typeInfo = getTypeInfo();
  const isLastOne = remaining === 1;
  const isAtLimit = remaining === 0;

  const handleUpgradeClick = () => {
    if (isAnalyticsEnabled) {
      logEvent('limit_nudge_upgrade_click', {
        type,
        remaining,
        trigger: 'nudge',
      });
    }
    onUpgrade?.();
  };

  if (isAtLimit) {
    return (
      <Alert className={`${typeInfo.color} border-l-4`}>
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{typeInfo.icon}</span>
            <span className="font-medium">
              Has alcanzado el límite de {typeInfo.plural}
            </span>
          </div>
          {onUpgrade && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleUpgradeClick}
              className="ml-4"
            >
              Desbloquear Pro
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLastOne) {
    return (
      <Alert className={`${typeInfo.color} border-l-4`}>
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{typeInfo.icon}</span>
            <span>
              Te queda <Badge variant="secondary" className="mx-1">1</Badge> {typeInfo.singular} más
            </span>
          </div>
          {onUpgrade && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleUpgradeClick}
              className="ml-4"
            >
              Desbloquear Pro
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  if (remaining <= 2) {
    return (
      <Alert className={`${typeInfo.color} border-l-4`}>
        <AlertDescription className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-lg">{typeInfo.icon}</span>
            <span>
              Te quedan <Badge variant="secondary" className="mx-1">{remaining}</Badge> {typeInfo.plural} más
            </span>
          </div>
          {onUpgrade && (
            <Button 
              size="sm" 
              variant="outline"
              onClick={handleUpgradeClick}
              className="ml-4"
            >
              Desbloquear Pro
            </Button>
          )}
        </AlertDescription>
      </Alert>
    );
  }

  return null;
}
