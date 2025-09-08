import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';
import { useDemoMode } from '@/hooks/useDemoMode';
import { isFeatureEnabled } from '@/config/featureFlags';
import { FEATURE_FLAGS } from '@/config/featureFlags';

const TOUR_STORAGE_KEY = FEATURE_FLAGS.TOUR_STORAGE_KEY;

export function DemoTour() {
  const { logEvent } = useAnalytics();
  const { isDemoMode } = useDemoMode();
  const [currentStep, setCurrentStep] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const isTourEnabled = isFeatureEnabled('ENABLE_TOUR');

  const steps = [
    { 
      title: "Explora el mapa", 
      description: "Aquí puedes ver dónde crecen las setas en tiempo real. Los pins naranjas son ejemplos de setales.",
      target: "map" 
    },
    { 
      title: "Haz click en un pin", 
      description: "Haz click en cualquier pin para ver detalles del setal y su ubicación exacta.",
      target: "marker" 
    },
    { 
      title: "Crea tu cuenta", 
      description: "Regístrate para guardar tus propios setales y configurar alertas personalizadas.",
      target: "cta" 
    }
  ];

  useEffect(() => {
    // Solo mostrar tour si está habilitado y en demo mode
    if (!isTourEnabled || !isDemoMode) {
      return;
    }

    // Verificar si el tour ya se completó
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    if (tourCompleted) {
      return;
    }

    // Mostrar tour después de 2 segundos
    const timer = setTimeout(() => {
      setIsVisible(true);
      logEvent('tour_start', { 
        trigger: 'auto', 
        step: 1,
        demo_mode: isDemoMode 
      });
    }, 2000);

    return () => clearTimeout(timer);
  }, [logEvent, isTourEnabled, isDemoMode]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      logEvent('tour_step_complete', { 
        step: nextStep, 
        action: 'click',
        demo_mode: isDemoMode 
      });
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    logEvent('tour_skip', { 
      step: currentStep + 1, 
      reason: 'button',
      demo_mode: isDemoMode 
    });
    handleComplete();
  };

  const handleComplete = () => {
    setIsVisible(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
    logEvent('tour_complete', { 
      total_duration: Date.now(), 
      steps_completed: currentStep + 1,
      demo_mode: isDemoMode 
    });
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      logEvent('tour_skip', { 
        step: currentStep + 1, 
        reason: 'escape',
        demo_mode: isDemoMode 
      });
      handleComplete();
    }
  };

  useEffect(() => {
    if (isVisible) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isVisible, currentStep, isDemoMode]);

  // No mostrar si no está habilitado o no es demo mode
  if (!isTourEnabled || !isDemoMode || !isVisible) {
    return null;
  }

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center"
      role="dialog"
      aria-labelledby="tour-title"
      aria-describedby="tour-description"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
        <div className="text-center">
          <h3 
            id="tour-title"
            className="text-lg font-semibold mb-2"
          >
            {steps[currentStep].title}
          </h3>
          <p 
            id="tour-description"
            className="text-gray-600 mb-4"
          >
            {steps[currentStep].description}
          </p>
          
          {/* Indicadores de progreso */}
          <div 
            className="flex justify-center gap-2 mb-4"
            role="progressbar"
            aria-valuenow={currentStep + 1}
            aria-valuemin={1}
            aria-valuemax={steps.length}
            aria-label={`Paso ${currentStep + 1} de ${steps.length}`}
          >
            {steps.map((_, index) => (
              <div 
                key={index} 
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentStep ? 'bg-blue-500' : 'bg-gray-300'
                }`}
                aria-hidden="true"
              />
            ))}
          </div>
          
          {/* Botones */}
          <div className="flex gap-2 justify-center">
            <Button 
              variant="outline" 
              onClick={handleSkip}
              className="min-h-[44px] min-w-[44px]"
            >
              Saltar tour
            </Button>
            <Button 
              onClick={handleNext}
              className="min-h-[44px] min-w-[44px]"
            >
              {currentStep === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
            </Button>
          </div>
          
          {/* Instrucción de teclado */}
          <p className="text-xs text-gray-400 mt-3">
            Presiona <kbd className="px-1 py-0.5 bg-gray-100 rounded text-xs">Esc</kbd> para saltar
          </p>
        </div>
      </div>
    </div>
  );
}
