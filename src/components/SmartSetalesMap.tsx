import { useEffect, useState, useRef } from "react";
import { useSmartSetales, type SmartSetal } from "@/hooks/useSmartSetales";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useDemoMarkers } from "@/hooks/useDemoMarkers";
import { useGatedAction } from "@/hooks/useGatedAction";
import { useAnalytics } from "@/hooks/useAnalytics";
import { toast } from "sonner";
import L from "leaflet";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RefreshCw, MapPin, TrendingUp, Clock, AlertCircle } from "lucide-react";

// CSS se carga dinámicamente cuando se necesita el mapa
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type SmartSetalesMapProps = {
  center: { lat: number; lng: number };
  zoom: number;
  sessionUserId?: string;
};

const speciesStyle: Record<string, { color: string; letter: string; name: string }> = {
  boletus_edulis: { color: '#8B4513', letter: 'B', name: 'Boleto' },
  amanita_caesarea: { color: '#FF6B6B', letter: 'A', name: 'Oronja' },
  lactarius_deliciosus: { color: '#FF8C00', letter: 'L', name: 'Níscalo' },
  cantharellus_cibarius: { color: '#FFD700', letter: 'C', name: 'Rebozuelo' },
  macrolepiota_procera: { color: '#8B4513', letter: 'P', name: 'Parasol' },
  pleurotus_eryngii: { color: '#9370DB', letter: 'E', name: 'Seta de cardo' },
  marasmius_oreades: { color: '#4A90E2', letter: 'S', name: 'Senderuela' },
  agaricus_campestris: { color: '#808080', letter: 'G', name: 'Champiñón silvestre' },
  hydnum_repandum: { color: '#DEB887', letter: 'H', name: 'Lengua de gato' },
  morchella_esculenta: { color: '#654321', letter: 'M', name: 'Colmenilla' },
  otro: { color: '#22c55e', letter: '?', name: 'Otro' },
};

const speciesOptions: { key: string; label: string }[] = [
  { key: 'boletus_edulis', label: 'Boletus edulis (Boleto)' },
  { key: 'amanita_caesarea', label: 'Amanita caesarea (Oronja)' },
  { key: 'lactarius_deliciosus', label: 'Lactarius deliciosus (Níscalo)' },
  { key: 'cantharellus_cibarius', label: 'Cantharellus cibarius (Rebozuelo)' },
  { key: 'macrolepiota_procera', label: 'Macrolepiota procera (Parasol)' },
  { key: 'pleurotus_eryngii', label: 'Pleurotus eryngii (Seta de cardo)' },
  { key: 'marasmius_oreades', label: 'Marasmius oreades (Senderuela)' },
  { key: 'agaricus_campestris', label: 'Agaricus campestris (Champiñón silvestre)' },
  { key: 'hydnum_repandum', label: 'Hydnum repandum (Lengua de gato)' },
  { key: 'morchella_esculenta', label: 'Morchella esculenta (Colmenilla)' },
  { key: 'otro', label: 'Otro' },
];

export default function SmartSetalesMap({ center, zoom, sessionUserId }: SmartSetalesMapProps) {
  const { smartSetales, loading, analyzing, stats, recommendedSetales, refreshAnalysis } = useSmartSetales();
  const { isDemoModeEnabled } = useDemoMode();
  const { demoMarkers } = useDemoMarkers();
  const { logEvent } = useAnalytics();
  const { executeGatedAction } = useGatedAction();

  const [isClient, setIsClient] = useState(false);
  const [cssLoaded, setCssLoaded] = useState(false);
  const leafletMapRef = useRef<L.Map | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);

  // Estados para el formulario de nuevo setal
  const [showForm, setShowForm] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formSpecies, setFormSpecies] = useState<string>('boletus_edulis');
  const [pendingLatLng, setPendingLatLng] = useState<{lat: number; lng: number} | null>(null);

  // Cargar CSS de Leaflet dinámicamente
  useEffect(() => {
    if (!cssLoaded) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      link.onload = () => setCssLoaded(true);
      document.head.appendChild(link);
    }
  }, [cssLoaded]);

  // Configurar iconos de Leaflet
  useEffect(() => {
    if (typeof window !== 'undefined') {
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: markerIcon2x,
        iconUrl: markerIcon,
        shadowUrl: markerShadow,
      });
    }
  }, []);

  // Crear icono inteligente para setal
  const createSmartSetalIcon = (setal: SmartSetal) => {
    const species = speciesStyle[setal.species] || speciesStyle.otro;
    const probability = setal.analysis?.probability || 0;
    
    // Color del borde basado en probabilidad
    const borderColor = setal.markerColor;
    
    return L.divIcon({
      className: 'smart-setal-marker',
      html: `<div style="
        width: 32px; height: 32px; background: ${species.color}; 
        border: 3px solid ${borderColor}; border-radius: 50%;
        box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
        font-size: 14px; color: white; font-weight: bold; font-family: system-ui, -apple-system, sans-serif;
        position: relative;
      ">
        <span>${species.letter}</span>
        <div style="
          position: absolute; top: -8px; right: -8px; width: 16px; height: 16px; 
          background: ${borderColor}; border-radius: 50%; display: flex; align-items: center; justify-content: center;
          font-size: 10px; color: white; font-weight: bold;
        ">${Math.round(probability)}</div>
      </div>`,
      iconSize: [32, 32],
      iconAnchor: [16, 16],
      popupAnchor: [0, -16],
    });
  };

  // Renderizar marcadores inteligentes
  const renderSmartMarkers = () => {
    if (!leafletMapRef.current) return;

    // Limpiar marcadores existentes
    if (markersLayerRef.current) {
      markersLayerRef.current.remove();
    }

    const markersGroup = L.layerGroup();
    const markersToShow = isDemoModeEnabled ? demoMarkers : smartSetales;

    markersToShow.forEach((marker) => {
      if (!marker.lat || !marker.lng) return;

      let icon;
      if (isDemoModeEnabled) {
        // Marcador demo simple
        const species = speciesStyle[marker.species || 'otro'] || speciesStyle.otro;
        icon = L.divIcon({
          className: 'demo-marker',
          html: `<div style="
            width: 28px; height: 28px; background: ${species.color}; border: 3px solid white; border-radius: 50%;
            box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
            font-size: 14px; color: white; font-weight: bold; font-family: system-ui, -apple-system, sans-serif;
          ">${species.letter}</div>`,
          iconSize: [28, 28],
          iconAnchor: [14, 14],
          popupAnchor: [0, -14],
        });
      } else {
        // Marcador inteligente
        icon = createSmartSetalIcon(marker as SmartSetal);
      }

      const leafletMarker = L.marker([marker.lat, marker.lng], { icon });

      // Contenido del popup
      let popupContent = `
        <div style="min-width: 200px;">
          <h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: bold;">${marker.title}</h3>
          ${marker.description ? `<p style="margin: 0 0 8px 0; color: #666; font-size: 14px;">${marker.description}</p>` : ''}
          <div style="display: flex; align-items: center; gap: 8px; margin: 8px 0;">
            <span style="background: ${speciesStyle[marker.species || 'otro']?.color || '#22c55e'}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold;">
              ${speciesStyle[marker.species || 'otro']?.name || 'Otro'}
            </span>
      `;

      if (!isDemoModeEnabled && (marker as SmartSetal).analysis) {
        const analysis = (marker as SmartSetal).analysis!;
        popupContent += `
            <span style="background: ${marker.markerColor}; color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; font-weight: bold;">
              ${analysis.probability}% probabilidad
            </span>
          </div>
          <div style="margin: 8px 0; padding: 8px; background: #f5f5f5; border-radius: 4px;">
            <div style="display: flex; align-items: center; gap: 4px; margin-bottom: 4px;">
              <span>${marker.recommendationEmoji}</span>
              <strong>${analysis.recommendation.reason}</strong>
            </div>
            <div style="font-size: 12px; color: #666;">
              <div>🌡️ ${analysis.conditions.temperature}°C</div>
              <div>💧 ${analysis.conditions.humidity}% humedad</div>
              <div>🌧️ ${analysis.conditions.rain3d}mm (3d) / ${analysis.conditions.rain7d}mm (7d)</div>
              <div>💨 ${analysis.conditions.wind} km/h viento</div>
            </div>
          </div>
        `;
      } else {
        popupContent += `</div>`;
      }

      popupContent += `
          <div style="font-size: 12px; color: #999; margin-top: 8px;">
            Creado: ${new Date(marker.createdAt).toLocaleDateString()}
          </div>
        </div>
      `;

      leafletMarker.bindPopup(popupContent);
      markersGroup.addLayer(leafletMarker);
    });

    markersGroup.addTo(leafletMapRef.current);
    markersLayerRef.current = markersGroup;
  };

  // Inicializar mapa
  useEffect(() => {
    if (!isClient || !cssLoaded) return;

    const initMap = async () => {
      try {
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
        }

        const map = L.map('map', {
          center: [center.lat, center.lng],
          zoom: zoom,
          preferCanvas: true,
          zoomControl: true,
        });

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          keepBuffer: 2,
          updateWhenIdle: true,
          wheelDebounceTime: 100,
        }).addTo(map);

        // Manejar clics en el mapa
        map.on('click', (e) => {
          if (isDemoModeEnabled) {
            toast.info('Modo demo activo. Regístrate para crear setales.');
            return;
          }

          executeGatedAction(() => {
            setPendingLatLng({ lat: e.latlng.lat, lng: e.latlng.lng });
            setShowForm(true);
            logEvent('setal_form_open', { lat: e.latlng.lat, lng: e.latlng.lng });
          });
        });

        leafletMapRef.current = map;
        renderSmartMarkers();

        // Ajustar tamaño del mapa
        setTimeout(() => {
          map.invalidateSize();
        }, 100);

      } catch (error) {
        console.error("Error initializing map:", error);
        toast.error("Error inicializando el mapa");
      }
    };

    initMap();

    return () => {
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [isClient, cssLoaded, center.lat, center.lng, zoom, sessionUserId, isDemoModeEnabled]);

  // Re-renderizar marcadores cuando cambien los datos
  useEffect(() => {
    if (leafletMapRef.current) {
      renderSmartMarkers();
    }
  }, [smartSetales, demoMarkers, isDemoModeEnabled]);

  // Detectar si estamos en el cliente
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Manejar envío del formulario
  const handleSubmit = async () => {
    if (!pendingLatLng || !formTitle.trim()) {
      toast.error("Por favor, completa todos los campos");
      return;
    }

    try {
      const { data, error } = await supabase
        .from('spots')
        .insert({
          name: formTitle,
          notes: `${formDesc} [species:${formSpecies}]`,
          lat: pendingLatLng.lat,
          lng: pendingLatLng.lng,
          user_id: sessionUserId,
        })
        .select()
        .single();

      if (error) throw error;

      toast.success("Setal guardado correctamente");
      setShowForm(false);
      setFormTitle("");
      setFormDesc("");
      setFormSpecies('boletus_edulis');
      setPendingLatLng(null);

      // Refrescar análisis
      refreshAnalysis();

      logEvent('setal_created', {
        species: formSpecies,
        lat: pendingLatLng.lat,
        lng: pendingLatLng.lng
      });

    } catch (error) {
      console.error('Error saving setal:', error);
      toast.error("Error guardando el setal");
    }
  };

  return (
    <div className="relative w-full h-full">
      <div id="map" className="w-full h-full" />
      
      {/* Panel de estadísticas inteligentes */}
      {!isDemoModeEnabled && !loading && (
        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur p-4 rounded-lg shadow-lg max-w-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold text-lg">Setales Inteligentes</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={refreshAnalysis}
              disabled={analyzing}
              className="h-8 w-8 p-0"
            >
              <RefreshCw className={`h-4 w-4 ${analyzing ? 'animate-spin' : ''}`} />
            </Button>
          </div>
          
          {analyzing ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Total setales:</span>
                <span className="font-medium">{stats.total}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-green-600">🚀 Alta probabilidad:</span>
                <span className="font-medium text-green-600">{stats.highProbability}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-yellow-600">👀 Media probabilidad:</span>
                <span className="font-medium text-yellow-600">{stats.mediumProbability}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-orange-600">⏳ Esperar:</span>
                <span className="font-medium text-orange-600">{stats.wait}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Panel de recomendaciones */}
      {!isDemoModeEnabled && recommendedSetales.length > 0 && (
        <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur p-4 rounded-lg shadow-lg max-w-sm">
          <h4 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-green-600" />
            Recomendados ahora
          </h4>
          <div className="space-y-2 max-h-32 overflow-y-auto">
            {recommendedSetales.slice(0, 3).map((setal) => (
              <div key={setal.id} className="text-sm p-2 bg-green-50 rounded border-l-2 border-green-500">
                <div className="font-medium">{setal.title}</div>
                <div className="text-green-600">
                  {setal.analysis?.probability}% - {setal.analysis?.recommendation.reason}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formulario de nuevo setal */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo Setal Inteligente</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Nombre del setal</label>
              <Input
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="Ej: Setal de boletos en el pinar"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Descripción</label>
              <Textarea
                value={formDesc}
                onChange={(e) => setFormDesc(e.target.value)}
                placeholder="Describe el entorno, tipo de bosque, etc."
                rows={3}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Especie de seta</label>
              <select
                value={formSpecies}
                onChange={(e) => setFormSpecies(e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                {speciesOptions.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            {pendingLatLng && (
              <div className="text-sm text-gray-600">
                📍 Coordenadas: {pendingLatLng.lat.toFixed(6)}, {pendingLatLng.lng.toFixed(6)}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit} disabled={!formTitle.trim()}>
              Guardar Setal
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
