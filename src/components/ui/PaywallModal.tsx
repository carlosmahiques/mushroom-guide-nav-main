import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/useAnalytics';
import { isFeatureEnabled } from '@/config/featureFlags';
import { FEATURE_FLAGS } from '@/config/featureFlags';

interface PaywallModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger: 'setal_limit' | 'alert_limit' | 'zone_limit';
  currentUsage?: { setales: number; alertas: number; zonas: number };
}

export function PaywallModal({ isOpen, onClose, trigger, currentUsage }: PaywallModalProps) {
  const { logEvent, getVariant } = useAnalytics();
  const isAnalyticsEnabled = isFeatureEnabled('ENABLE_ANALYTICS');

  // Usar variante estable del sistema de analytics
  const variant = getVariant();

  const price = variant === 'A' ? FEATURE_FLAGS.PAYWALL_VARIANT_A_PRICE : FEATURE_FLAGS.PAYWALL_VARIANT_B_PRICE;
  const priceFormatted = `€${price.toFixed(2).replace('.', ',')}`;

  const handleUpgradeClick = () => {
    if (isAnalyticsEnabled) {
      logEvent('upgrade_click', {
        variant,
        trigger,
        price,
        current_usage: currentUsage,
      });
    }
    
    // TODO: Implementar flujo de upgrade real
    // Simular upgrade_complete después de un delay
    setTimeout(() => {
      if (isAnalyticsEnabled) {
        logEvent('upgrade_complete', {
          variant,
          payment_method: 'stripe', // TODO: Obtener método real
          time_to_upgrade: 0 // TODO: Calcular días desde registro
        });
      }
    }, 1000);
    
    onClose();
  };

  const handleContinueFree = () => {
    if (isAnalyticsEnabled) {
      logEvent('paywall_continue_free', {
        variant,
        trigger,
        current_usage: currentUsage,
      });
    }
    onClose();
  };

  const handleClose = () => {
    if (isAnalyticsEnabled) {
      logEvent('paywall_modal_close', {
        variant,
        trigger,
        action: 'close_button',
      });
    }
    onClose();
  };

  // Log del evento paywall_view cuando se abre
  useEffect(() => {
    if (isOpen && isAnalyticsEnabled) {
      logEvent('paywall_view', {
        variant,
        trigger,
        plan: 'free', // Usuario actual está en plan free
        current_usage: currentUsage,
        price,
      });
    }
  }, [isOpen, variant, trigger, currentUsage, price, logEvent, isAnalyticsEnabled]);

  const getTriggerMessage = () => {
    switch (trigger) {
      case 'setal_limit':
        return 'Has alcanzado el límite de 3 setales';
      case 'alert_limit':
        return 'Has alcanzado el límite de 1 alerta';
      case 'zone_limit':
        return 'Has alcanzado el límite de 1 zona';
      default:
        return 'Has alcanzado el límite gratuito';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¡Desbloquea setales ilimitados!</DialogTitle>
          <DialogDescription>
            {getTriggerMessage()}. Desbloquea setales ilimitados y alertas avanzadas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="text-center">
            <div className="text-3xl font-bold text-primary">{priceFormatted}/mes</div>
            <p className="text-sm text-muted-foreground">Primeros 7 días gratis</p>
            <Badge variant="secondary" className="mt-2">
              Variante {variant}
            </Badge>
          </div>
          
          <div className="space-y-2">
            <h4 className="font-medium">Beneficios Pro:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Setales ilimitados</li>
              <li>✅ Alertas avanzadas</li>
              <li>✅ Zonas ilimitadas</li>
              <li>✅ Exportar datos</li>
              <li>✅ Soporte prioritario</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleContinueFree} className="flex-1">
              Continuar con límites
            </Button>
            <Button onClick={handleUpgradeClick} className="flex-1">
              Desbloquear Pro - {priceFormatted}/mes
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
