import React, { useState, useEffect, useCallback } from 'react';
import { X, Trash2, Copy, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';

interface AnalyticsEvent {
  id: string;
  name: string;
  props: Record<string, any>;
  timestamp: number;
  userType: 'anonymous' | 'free' | 'pro';
  sessionId: string;
}

interface AnalyticsDebugOverlayProps {
  isVisible: boolean;
  onClose: () => void;
}

export function AnalyticsDebugOverlay({ isVisible, onClose }: AnalyticsDebugOverlayProps) {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [isMinimized, setIsMinimized] = useState(false);

  // Cargar eventos desde localStorage
  useEffect(() => {
    const loadEvents = () => {
      try {
        const stored = localStorage.getItem('analytics_debug_events');
        if (stored) {
          const parsedEvents = JSON.parse(stored);
          setEvents(parsedEvents.slice(-50)); // Solo últimos 50
        }
      } catch (error) {
        console.error('Error loading analytics events:', error);
      }
    };

    loadEvents();

    // Escuchar nuevos eventos
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'analytics_debug_events') {
        loadEvents();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Limpiar eventos
  const clearEvents = useCallback(() => {
    localStorage.removeItem('analytics_debug_events');
    setEvents([]);
  }, []);

  // Copiar eventos al clipboard
  const copyEvents = useCallback(() => {
    const eventsText = events.map(event => 
      `${event.timestamp} | ${event.name} | ${JSON.stringify(event.props)}`
    ).join('\n');
    
    navigator.clipboard.writeText(eventsText).then(() => {
      console.log('Events copied to clipboard');
    });
  }, [events]);

  // Exportar eventos como JSON
  const exportEvents = useCallback(() => {
    const dataStr = JSON.stringify(events, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `analytics-events-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [events]);

  // Formatear timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString();
  };

  // Formatear props
  const formatProps = (props: Record<string, any>) => {
    return Object.entries(props)
      .map(([key, value]) => `${key}: ${typeof value === 'object' ? JSON.stringify(value) : value}`)
      .join(', ');
  };

  // Obtener color del badge según el tipo de evento
  const getEventBadgeColor = (eventName: string) => {
    if (eventName.includes('page_view')) return 'bg-blue-100 text-blue-800';
    if (eventName.includes('demo_')) return 'bg-green-100 text-green-800';
    if (eventName.includes('register_')) return 'bg-purple-100 text-purple-800';
    if (eventName.includes('onboarding_')) return 'bg-orange-100 text-orange-800';
    if (eventName.includes('setal_') || eventName.includes('alert_')) return 'bg-yellow-100 text-yellow-800';
    if (eventName.includes('paywall_') || eventName.includes('upgrade_')) return 'bg-red-100 text-red-800';
    if (eventName.includes('trial_')) return 'bg-indigo-100 text-indigo-800';
    if (eventName.includes('weather_')) return 'bg-gray-100 text-gray-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-[10000] pointer-events-none">
      <div className="absolute top-4 right-4 w-96 max-h-[80vh] pointer-events-auto">
        <Card className="shadow-2xl border-2 border-blue-500">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                🔍 Analytics Debug
                <Badge variant="secondary" className="text-xs">
                  {events.length}/50
                </Badge>
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="h-6 w-6 p-0"
                >
                  {isMinimized ? '▼' : '▲'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="h-6 w-6 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          
          {!isMinimized && (
            <CardContent className="pt-0">
              {/* Controles */}
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearEvents}
                  className="flex items-center gap-1"
                >
                  <Trash2 className="h-3 w-3" />
                  Limpiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyEvents}
                  className="flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" />
                  Copiar
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportEvents}
                  className="flex items-center gap-1"
                >
                  <Download className="h-3 w-3" />
                  Exportar
                </Button>
              </div>

              {/* Lista de eventos */}
              <ScrollArea className="h-96">
                <div className="space-y-2">
                  {events.length === 0 ? (
                    <div className="text-center text-gray-500 py-8">
                      <p>No hay eventos registrados</p>
                      <p className="text-xs mt-1">Los eventos aparecerán aquí automáticamente</p>
                    </div>
                  ) : (
                    events.slice().reverse().map((event) => (
                      <div
                        key={event.id}
                        className="border rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Badge className={`text-xs ${getEventBadgeColor(event.name)}`}>
                                {event.name}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {formatTimestamp(event.timestamp)}
                              </span>
                            </div>
                            <div className="text-xs text-gray-600 font-mono">
                              {formatProps(event.props)}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t text-xs text-gray-500">
                <p>💡 Atajo: Ctrl+Shift+L</p>
                <p>📊 Eventos se guardan automáticamente en localStorage</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  );
}
