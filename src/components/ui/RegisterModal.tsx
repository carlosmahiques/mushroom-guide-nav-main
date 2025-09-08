import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { isFeatureEnabled } from '@/config/featureFlags';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';

interface RegisterModalProps {
  isOpen: boolean;
  onClose: () => void;
  trigger?: string;
}

export function RegisterModal({ isOpen, onClose, trigger }: RegisterModalProps) {
  const { logEvent } = useAnalytics();
  const isAnalyticsEnabled = isFeatureEnabled('ENABLE_ANALYTICS');
  const navigate = useNavigate();

  console.log('🔍 RegisterModal renderizado:', { isOpen, trigger });


  const handleRegisterClick = () => {
    if (isAnalyticsEnabled) {
      logEvent('register_click', {
        source: 'demo',
        context: 'modal',
        action_attempted: trigger,
      });
    }
    
    // Navegar a la página de autenticación
    onClose();
    navigate('/auth');
  };

  const handleClose = () => {
    if (isAnalyticsEnabled) {
      logEvent('register_modal_close', {
        trigger,
        action: 'close_button',
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>¡Crea tu cuenta gratis!</DialogTitle>
          <DialogDescription>
            Regístrate para guardar tus propios setales y configurar alertas personalizadas.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">Beneficios de registrarte:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>✅ Guarda tus setales favoritos</li>
              <li>✅ Configura alertas personalizadas</li>
              <li>✅ Accede a pronósticos detallados</li>
              <li>✅ Sincroniza entre dispositivos</li>
            </ul>
          </div>
          
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleClose} className="flex-1">
              Cerrar
            </Button>
            <Button onClick={handleRegisterClick} className="flex-1">
              Crear cuenta
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
