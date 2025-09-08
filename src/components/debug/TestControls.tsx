import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useLimitsTest } from '@/hooks/useLimitsTest';

export function TestControls() {
  const { currentUsage, limits, remaining, setTestUsage, resetTestUsage } = useLimitsTest();

  if (!import.meta.env.DEV) return null;

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-[10001] bg-white shadow-2xl border-2 border-blue-500">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2">
          🧪 Test Controls
          <Badge variant="secondary" className="text-xs">
            DEV ONLY
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado actual */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Estado Actual:</h4>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="font-bold">{currentUsage.setales}/{limits.setales}</div>
              <div className="text-gray-500">Setales</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{currentUsage.alertas}/{limits.alertas}</div>
              <div className="text-gray-500">Alertas</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{currentUsage.zonas}/{limits.zonas}</div>
              <div className="text-gray-500">Zonas</div>
            </div>
          </div>
        </div>

        {/* Controles de prueba */}
        <div className="space-y-2">
          <h4 className="font-medium text-sm">Simular Estados:</h4>
          
          {/* Flujo 1: Demo anónimo */}
          <div className="space-y-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                resetTestUsage();
                console.log('🧪 Test: Flujo 1 - Demo anónimo configurado');
              }}
              className="w-full text-xs"
            >
              Flujo 1: Demo Anónimo
            </Button>
          </div>

          {/* Flujo 2: Setales límite */}
          <div className="space-y-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTestUsage({ setales: 3, alertas: 0, zonas: 0 });
                console.log('🧪 Test: Flujo 2 - Setales límite configurado (3/3)');
              }}
              className="w-full text-xs"
            >
              Flujo 2: Setales Límite (3/3)
            </Button>
          </div>

          {/* Flujo 3: Alertas límite */}
          <div className="space-y-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setTestUsage({ setales: 0, alertas: 1, zonas: 0 });
                console.log('🧪 Test: Flujo 3 - Alertas límite configurado (1/1)');
              }}
              className="w-full text-xs"
            >
              Flujo 3: Alertas Límite (1/1)
            </Button>
          </div>

          {/* Reset */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              resetTestUsage();
              console.log('🧪 Test: Estado resetado');
            }}
            className="w-full text-xs"
          >
            Reset Estado
          </Button>
        </div>

        {/* Instrucciones */}
        <div className="pt-2 border-t text-xs text-gray-500">
          <p>💡 Usar estos controles para simular diferentes estados de límites durante las pruebas E2E.</p>
        </div>
      </CardContent>
    </Card>
  );
}
