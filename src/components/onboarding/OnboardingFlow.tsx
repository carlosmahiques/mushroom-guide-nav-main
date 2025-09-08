import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAnalytics } from '@/hooks/useAnalytics';
import { isFeatureEnabled } from '@/config/featureFlags';

interface OnboardingFlowProps {
  isOpen: boolean;
  onComplete: () => void;
  onSkip: () => void;
}

type OnboardingStep = 'zona' | 'especie' | 'alerta';

export function OnboardingFlow({ isOpen, onComplete, onSkip }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('zona');
  const [completedSteps, setCompletedSteps] = useState<OnboardingStep[]>([]);
  const [skippedSteps, setSkippedSteps] = useState<OnboardingStep[]>([]);
  const [zonaSelected, setZonaSelected] = useState<string>('');
  const [especieSelected, setEspecieSelected] = useState<string>('');
  const [alertaCreated, setAlertaCreated] = useState<boolean>(false);
  
  const { logEvent } = useAnalytics();
  const isAnalyticsEnabled = isFeatureEnabled('ENABLE_ANALYTICS');

  const steps = [
    { key: 'zona' as const, title: 'Selecciona tu zona', description: 'Elige la zona donde sueles buscar setales' },
    { key: 'especie' as const, title: 'Especie favorita', description: '¿Qué tipo de setales te interesan más?' },
    { key: 'alerta' as const, title: 'Configura una alerta', description: 'Te avisaremos cuando las condiciones sean perfectas' }
  ];

  const handleStepComplete = (step: OnboardingStep) => {
    setCompletedSteps(prev => [...prev, step]);
    
    if (isAnalyticsEnabled) {
      logEvent('onboarding_step_complete', {
        step,
        total_steps: steps.length,
        completed_steps: completedSteps.length + 1
      });
    }
    
    // Avanzar al siguiente paso
    const currentIndex = steps.findIndex(s => s.key === step);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key);
    } else {
      // Completar onboarding
      handleOnboardingComplete();
    }
  };

  const handleStepSkip = (step: OnboardingStep) => {
    setSkippedSteps(prev => [...prev, step]);
    
    if (isAnalyticsEnabled) {
      logEvent('onboarding_skip', {
        step,
        reason: 'user_choice',
        timestamp: Date.now()
      });
    }
    
    // Avanzar al siguiente paso
    const currentIndex = steps.findIndex(s => s.key === step);
    if (currentIndex < steps.length - 1) {
      setCurrentStep(steps[currentIndex + 1].key);
    } else {
      // Completar onboarding
      handleOnboardingComplete();
    }
  };

  const handleOnboardingComplete = () => {
    if (isAnalyticsEnabled) {
      logEvent('onboarding_complete', {
        steps_completed: completedSteps.length,
        skipped_steps: skippedSteps,
        zona_selected: zonaSelected,
        especie_selected: especieSelected,
        alerta_created: alertaCreated
      });
    }
    
    onComplete();
  };

  const handleSkipAll = () => {
    if (isAnalyticsEnabled) {
      logEvent('onboarding_skip', {
        step: 'all',
        reason: 'skip_all',
        timestamp: Date.now()
      });
    }
    
    onSkip();
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'zona':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Selecciona la zona donde sueles buscar setales:</p>
            <div className="grid grid-cols-2 gap-2">
              {['Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'Bilbao', 'Otra'].map((zona) => (
                <Button
                  key={zona}
                  variant={zonaSelected === zona ? 'default' : 'outline'}
                  onClick={() => {
                    setZonaSelected(zona);
                    handleStepComplete('zona');
                  }}
                  className="text-sm"
                >
                  {zona}
                </Button>
              ))}
            </div>
            <Button variant="ghost" onClick={() => handleStepSkip('zona')} className="w-full">
              Saltar este paso
            </Button>
          </div>
        );
        
      case 'especie':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">¿Qué tipo de setales te interesan más?</p>
            <div className="grid grid-cols-1 gap-2">
              {['Boletus edulis', 'Lactarius deliciosus', 'Cantharellus cibarius', 'Amanita caesarea', 'Todas las especies'].map((especie) => (
                <Button
                  key={especie}
                  variant={especieSelected === especie ? 'default' : 'outline'}
                  onClick={() => {
                    setEspecieSelected(especie);
                    handleStepComplete('especie');
                  }}
                  className="text-sm justify-start"
                >
                  {especie}
                </Button>
              ))}
            </div>
            <Button variant="ghost" onClick={() => handleStepSkip('especie')} className="w-full">
              Saltar este paso
            </Button>
          </div>
        );
        
      case 'alerta':
        return (
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Configura una alerta para recibir notificaciones cuando las condiciones sean perfectas:</p>
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Alerta de {especieSelected || 'setales'}</CardTitle>
                <CardDescription className="text-xs">
                  Te avisaremos cuando la temperatura y humedad sean ideales
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span>Temperatura:</span>
                    <Badge variant="secondary">15-20°C</Badge>
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <span>Humedad:</span>
                    <Badge variant="secondary">80%+</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => handleStepSkip('alerta')}
                className="flex-1"
              >
                Saltar
              </Button>
              <Button
                onClick={() => {
                  setAlertaCreated(true);
                  handleStepComplete('alerta');
                }}
                className="flex-1"
              >
                Crear alerta
              </Button>
            </div>
          </div>
        );
        
      default:
        return null;
    }
  };

  const currentStepIndex = steps.findIndex(s => s.key === currentStep);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>¡Bienvenido a Setas.AI!</DialogTitle>
          <DialogDescription>
            Te ayudamos a configurar tu experiencia personalizada
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-gray-500">
              <span>Paso {currentStepIndex + 1} de {steps.length}</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
          
          {/* Step title */}
          <div>
            <h3 className="font-medium">{steps[currentStepIndex]?.title}</h3>
            <p className="text-sm text-gray-600">{steps[currentStepIndex]?.description}</p>
          </div>
          
          {/* Step content */}
          {renderStepContent()}
          
          {/* Skip all button */}
          <div className="pt-4 border-t">
            <Button variant="ghost" onClick={handleSkipAll} className="w-full text-xs">
              Saltar todo el onboarding
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
