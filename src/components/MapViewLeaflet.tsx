import { useEffect, useState, useRef } from "react";
import type { UiMarker } from "@/hooks/useMapData";
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
// CSS se carga dinámicamente cuando se necesita el mapa
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { buildGrid, colorForScore, type GridCell } from "@/lib/prediction";

type MapViewLeafletProps = {
  center: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  className?: string;
  placingMode?: boolean;
  markers: UiMarker[];
  sessionUserId: string | null;
  addSpot: (lat: number, lng: number, title: string, description?: string, species?: string) => Promise<boolean>;
  deleteSpot: (spotId: string) => Promise<boolean>;
};

// Tipos para el mapa
// Fix default icon paths when bundling with Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Iconos por especie (divIcon con color + letra)
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

const speciesLabel = (key?: string | null) => speciesOptions.find(o => o.key === key)?.label || 'Otro';

const createSpeciesIcon = (species?: string | null) => {
  const s = speciesStyle[species || 'otro'] || speciesStyle.otro;
  return L.divIcon({
    className: 'species-marker',
    html: `<div style="
      width: 28px; height: 28px; background: ${s.color}; border: 3px solid white; border-radius: 50%;
      box-shadow: 0 3px 8px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center;
      font-size: 14px; color: white; font-weight: bold; font-family: system-ui, -apple-system, sans-serif;">${s.letter}</div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    popupAnchor: [0, -14]
  });
};

export default function MapViewLeaflet({
  center,
  zoom = 13,
  height = "70vh",
  className = "",
  placingMode = false,
  markers,
  sessionUserId,
  addSpot,
  deleteSpot,
}: MapViewLeafletProps) {
  function debounce<T extends (...args: any[]) => void>(fn: T, wait = 400) {
    let t: number | undefined;
    return (...args: Parameters<T>) => {
      window.clearTimeout(t);
      t = window.setTimeout(() => (fn as any)(...args), wait);
    };
  }
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [cssLoaded, setCssLoaded] = useState(false);
  const { isDemoMode } = useDemoMode();
  const demoMarkers = useDemoMarkers();
  const { gatedAction } = useGatedAction();
  const { logEvent } = useAnalytics();
  const placingRef = useRef<boolean>(placingMode);
  const [createOpen, setCreateOpen] = useState(false);
  const [formTitle, setFormTitle] = useState("");
  const [formDesc, setFormDesc] = useState("");
  const [formSpecies, setFormSpecies] = useState<string>('boletus_edulis');
  const [pendingLatLng, setPendingLatLng] = useState<{lat: number; lng: number} | null>(null);

  // Prediction overlay (feature-flagged)
  const enablePred = (import.meta as any).env?.VITE_ENABLE_PRED_LAYER === '1';
  const [predOn, setPredOn] = useState(false);
  const [predOpacity, setPredOpacity] = useState(0.35);
  const [predLoading, setPredLoading] = useState(false);
  const predLayerRef = useRef<L.LayerGroup | null>(null);
  const predCellsRef = useRef<GridCell[] | null>(null);

  // Cargar CSS de Leaflet dinámicamente
  useEffect(() => {
    if (!cssLoaded) {
      import('leaflet/dist/leaflet.css').then(() => {
        setCssLoaded(true);
      });
    }
  }, [cssLoaded]);

  // keep latest placing flag in a ref so event handlers see updates
  useEffect(() => {
    placingRef.current = placingMode;
    if (leafletMapRef.current && mapRef.current) {
      (mapRef.current as HTMLDivElement).style.cursor = placingMode ? 'crosshair' : 'grab';
    }
  }, [placingMode]);

  // Ensure client-side rendering
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Initialize Leaflet map using local dependency (no CDN)
  useEffect(() => {
    if (!isClient || !mapRef.current || leafletMapRef.current) return;

    try {
      // Spain bounding box and center
      const spainBounds = L.latLngBounds(
        [36.0, -9.5],  // SW
        [43.8, 3.3]    // NE
      );
      const spainCenter: [number, number] = [40.0, -3.7];

      leafletMapRef.current = L.map(mapRef.current, {
        center: spainCenter,
        zoom,
        maxBounds: spainBounds,
        maxBoundsViscosity: 0.8,
        zoomSnap: 0.5,
        zoomDelta: 0.5,
        wheelDebounceTime: 150,
        preferCanvas: true,
        zoomAnimation: true,
        fadeAnimation: true,
        markerZoomAnimation: true,
      });

      const TILE_URL = import.meta.env.VITE_TILE_URL ||
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
      const SUBDOMAINS = (import.meta.env.VITE_TILE_SUBDOMAINS || "a,b,c").split(",");

      const tileLayer = L.tileLayer(TILE_URL, {
        attribution:
          "© OpenStreetMap contributors",
        subdomains: SUBDOMAINS as any,
        updateWhenIdle: true,
        keepBuffer: 4,
        detectRetina: true,
        minZoom: 5,
        maxZoom: 18,
      }).addTo(leafletMapRef.current);

      // Mark loaded when tiles finish loading (prevents stuck spinner)
      tileLayer.once("load", () => setIsLoaded(true));
      // Fallback to ensure UI unblocks even si CDN tarda
      setTimeout(() => setIsLoaded((v) => v || true), 1200);

      // Report tile errors once to ayudar a diagnóstico
      let reported = false;
      tileLayer.on("tileerror", () => {
        if (!reported) {
          reported = true;
          toast.error("Error cargando tiles. Revisando proveedor...");
        }
      });

      // Preconnect to tile host for faster DNS/TLS
      try {
        const hostMatch = TILE_URL.match(/^https?:\/\/([^\/]+)/);
        if (hostMatch) {
          const link = document.createElement("link");
          link.rel = "preconnect";
          link.href = `${hostMatch[0]}`;
          link.crossOrigin = "";
          document.head.appendChild(link);
        }
      } catch {}

      // Fit to Spain to ensure tiles around Iberian Peninsula are requested first
      leafletMapRef.current.fitBounds(spainBounds, { padding: [16, 16] });

      // Prefetch tiles for current viewport to warm up cache
      const prefetchVisibleTiles = () => {
        const map = leafletMapRef.current;
        if (!map) return;
        const zoomLevel = Math.floor(map.getZoom());
        const tileSize = 256;
        const pixelBounds = map.getPixelBounds();
        const tileBounds = L.bounds(
          pixelBounds.min.divideBy(tileSize).floor(),
          pixelBounds.max.divideBy(tileSize).floor()
        );
        const subdomains = SUBDOMAINS;
        let sdIdx = 0;
        for (let j = tileBounds.min.y; j <= tileBounds.max.y; j++) {
          for (let i = tileBounds.min.x; i <= tileBounds.max.x; i++) {
            const s = subdomains[sdIdx++ % subdomains.length];
            const url = TILE_URL.replace("{s}", s)
              .replace("{z}", String(zoomLevel))
              .replace("{x}", String(i))
              .replace("{y}", String(j));
            const img = new Image();
            img.crossOrigin = "anonymous";
            img.src = url; // Browser will cache it
          }
        }
      };
      // Prefetch shortly after first layout
      setTimeout(prefetchVisibleTiles, 50);

      // Resize handling to prevent the infamous "Map container not found/invalid size"
      const invalidate = () => {
        if (leafletMapRef.current) {
          leafletMapRef.current.invalidateSize();
        }
      };
      // Initial invalidate after first paint
      setTimeout(invalidate, 100);
      setTimeout(invalidate, 300);
      setTimeout(invalidate, 800);
      window.addEventListener("resize", invalidate);
      document.addEventListener("visibilitychange", invalidate);

      // Observe container size changes precisely
      let ro: ResizeObserver | null = null;
      if (window.ResizeObserver) {
        ro = new ResizeObserver(() => invalidate());
        ro.observe(mapRef.current as Element);
      }

      // Click to add spots (guarded by auth and gating)
      leafletMapRef.current.on("click", async (e: any) => {
        // Log demo_interact si está en modo demo y no está colocando
        if (isDemoMode && !placingRef.current) {
          logEvent('demo_interact', {
            action: 'click_map',
            coordinates: { lat: e.latlng.lat, lng: e.latlng.lng },
            duration: 0 // TODO: Calcular duración en demo
          });
          return;
        }
        
        if (!placingRef.current) return;
        
        // Verificar gating antes de proceder
        if (!gatedAction('create_setal', { coordinates: e.latlng })) {
          return;
        }
        const { lat, lng } = e.latlng;
        setPendingLatLng({ lat, lng });
        setFormTitle("");
        setFormDesc("");
        setFormSpecies('boletus_edulis');
        setCreateOpen(true);
      });

      setIsLoaded(true);
      // Prediction overlay: refresh on moveend with debounce
      const doRefresh = debounce(() => {
        if (predOn) refreshPrediction();
      }, 450);
      leafletMapRef.current.on("moveend", () => {
        if (predOn) doRefresh();
      });
      renderMarkers();

      return () => {
        window.removeEventListener("resize", invalidate);
        document.removeEventListener("visibilitychange", invalidate);
        if (ro) {
          ro.disconnect();
          ro = null;
        }
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
          leafletMapRef.current = null;
        }
      };
    } catch (error) {
      console.error("Error initializing map:", error);
      toast.error("Error inicializando el mapa");
    }
  }, [isClient, center.lat, center.lng, zoom, sessionUserId]);

  // Build or rebuild prediction overlay
  const refreshPrediction = () => {
    if (!leafletMapRef.current || !predOn) return;
    const map = leafletMapRef.current as L.Map;
    setPredLoading(true);
    const cells = buildGrid(map.getBounds(), Math.floor(map.getZoom()));
    predCellsRef.current = cells;

    if (predLayerRef.current) {
      predLayerRef.current.remove();
      predLayerRef.current = null;
    }
    const group = L.layerGroup();
    cells.forEach((cell) => {
      const rect = L.rectangle(cell.bounds as any, {
        color: 'transparent',
        weight: 0,
        fillColor: colorForScore(cell.score),
        fillOpacity: predOpacity,
      });
      rect.bindTooltip(
        `Prob. fructificación: ${(cell.score * 100).toFixed(0)}%`+
        `\nLluvia 7d: ${cell.rain7d} mm`+
        `\nHumedad: ${cell.rh}%`+
        `\nTemp: ${cell.temp}ºC`,
        { sticky: true }
      );
      group.addLayer(rect);
    });
    group.addTo(map);
    predLayerRef.current = group;
    setPredLoading(false);
  };

  // Turn overlay on/off
  useEffect(() => {
    if (!leafletMapRef.current) return;
    if (!enablePred) return;
    if (predOn) refreshPrediction();
    else if (predLayerRef.current) {
      predLayerRef.current.remove();
      predLayerRef.current = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predOn]);

  // Rebuild overlay when opacity changes
  useEffect(() => {
    if (!predLayerRef.current || !predOn) return;
    refreshPrediction();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [predOpacity]);

  // Cleanup overlay on unmount
  useEffect(() => {
    return () => {
      if (predLayerRef.current) {
        predLayerRef.current.remove();
        predLayerRef.current = null;
      }
    };
  }, []);

  // Render markers when markers change
  const renderMarkers = () => {
    if (!leafletMapRef.current || !isLoaded) return;

    // Clear existing markers
    leafletMapRef.current.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        leafletMapRef.current.removeLayer(layer);
      }
    });

    // Add user markers
    markers.forEach(async (marker) => {
      const icon = createSpeciesIcon(marker.species);
      const leafletMarker = L.marker([marker.lat, marker.lng], { icon })
        .addTo(leafletMapRef.current);

      const popupContent = `
        <div style="font-family: system-ui; min-width: 200px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${marker.title}</div>
          ${marker.species ? `<div style="font-size: 12px; color: #3b82f6; font-weight: 600; margin-bottom: 4px;">Especie: ${marker.species}</div>` : ''}
          ${marker.description ? `<div style="font-size: 14px; color: #666; margin-bottom: 4px;">${marker.description}</div>` : ''}
          <div style="font-size: 12px; color: #999; margin-bottom: 8px;">
            (${marker.lat.toFixed(5)}, ${marker.lng.toFixed(5)})
          </div>
          <button 
            onclick="deleteSpot('${marker.id}')"
            style="
              padding: 4px 8px; 
              font-size: 12px; 
              border: none; 
              border-radius: 4px; 
              background: #ef4444; 
              color: white; 
              cursor: pointer;
            "
          >
            Eliminar
          </button>
        </div>
      `;

      leafletMarker.bindPopup(popupContent);
    });

    // Add demo markers if in demo mode
    if (isDemoMode) {
      demoMarkers.forEach((demoMarker) => {
        // Crear icono naranja para marcadores demo
        const demoIcon = L.divIcon({
          className: 'demo-marker',
          html: `<div style="
            width: 20px; 
            height: 20px; 
            background: #FF6B35; 
            border: 2px solid white; 
            border-radius: 50%; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.3);
          "></div>`,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        });

        const leafletMarker = L.marker([demoMarker.lat, demoMarker.lng], { icon: demoIcon })
          .addTo(leafletMapRef.current);

        const popupContent = `
          <div style="font-family: system-ui; min-width: 200px;">
            <div style="font-weight: 600; margin-bottom: 4px;">${demoMarker.name}</div>
            <div style="font-size: 14px; color: #666; margin-bottom: 4px;">${demoMarker.description}</div>
            <div style="font-size: 12px; color: #FF6B35; margin-bottom: 8px; font-weight: 500;">
              🍄 Setal de ejemplo
            </div>
            <div style="font-size: 12px; color: #999;">
              (${demoMarker.lat.toFixed(5)}, ${demoMarker.lng.toFixed(5)})
            </div>
          </div>
        `;

        leafletMarker.bindPopup(popupContent);
      });
    }
  };

  // Make deleteSpot available globally for popup buttons
  useEffect(() => {
    (window as any).deleteSpot = async (spotId: string) => {
      if (!confirm("¿Eliminar sétal?")) return;
      
      toast.promise(
        deleteSpot(spotId),
        {
          loading: 'Eliminando sétal...',
          success: '¡Sétal eliminado!',
          error: 'Error al eliminar el sétal'
        }
      );
    };
    (window as any).editSpot = async (spotId: string) => {
      const marker = markers.find(m => m.id === spotId);
      if (!marker) return;
      const newTitle = prompt('Editar título (3–40):', marker.title) || marker.title;
      if (newTitle.length < 3 || newTitle.length > 40) return alert('Título fuera de rango');
      const newDesc = prompt('Editar descripción (0–140):', marker.description || '') || '';
      if (newDesc.length > 140) return alert('Descripción demasiado larga');
      try {
        const { supabase } = await import('@/integrations/supabase/client');
        const { error } = await supabase
          .from('spots')
          .update({ name: newTitle, notes: newDesc })
          .eq('id', spotId);
        if (error) throw error;
        toast.success('Sétal actualizado');
      } catch (e) {
        toast.error('No se pudo actualizar');
      }
    };

    return () => {
      delete (window as any).deleteSpot;
      delete (window as any).editSpot;
    };
  }, [deleteSpot, markers]);

  useEffect(() => {
    if (isLoaded) {
      renderMarkers();
    }
  }, [markers, isLoaded, isDemoMode, demoMarkers]);

  // Show loading state only until client-side mounts (markers pueden cargar luego)
  if (!isClient) {
    return (
      <div 
        className={`w-full rounded-2xl overflow-hidden shadow flex items-center justify-center bg-muted ${className}`} 
        style={{ height }}
      >
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Cargando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full rounded-2xl overflow-hidden shadow relative ${className}`} style={{ height }}>
      <div 
        ref={mapRef} 
        style={{ 
          height: "100%", 
          width: "100%",
          minHeight: "400px"
        }} 
      />
      {/* Dialog Crear Sétal */}
      <Dialog open={createOpen} onOpenChange={setCreateOpen} modal={false}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Nuevo sétal</DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <Input placeholder="Título (3–40)" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} />
            <Textarea placeholder="Descripción (opcional, hasta 140)" value={formDesc} onChange={(e) => setFormDesc(e.target.value)} />
            <div>
              <label className="block text-sm mb-1">Especie</label>
              <select 
                value={formSpecies} 
                onChange={(e) => setFormSpecies(e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                {speciesOptions.map(opt => (
                  <option key={opt.key} value={opt.key}>{opt.label}</option>
                ))}
              </select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>Cancelar</Button>
            <Button
              onClick={async () => {
                if (!pendingLatLng) return;
                const title = formTitle.trim();
                if (title.length < 3 || title.length > 40) {
                  toast.error('El título debe tener entre 3 y 40 caracteres');
                  return;
                }
                if (formDesc.length > 140) {
                  toast.error('La descripción no puede superar 140 caracteres');
                  return;
                }
                const { lat, lng } = pendingLatLng;
                const setalId = Date.now().toString();
                logEvent('setal_create', { setal_id: setalId, coordinates: { lat, lng }, especie: formSpecies });
                const ok = await addSpot(lat, lng, title, formDesc, formSpecies);
                if (ok) {
                  toast.success('¡Sétal guardado correctamente!');
                  setCreateOpen(false);
                } else {
                  toast.error('Error al guardar el sétal');
                }
              }}
            >Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Inicializando mapa...</p>
          </div>
        </div>
      )}
      {/* Prediction controls and legend (feature-flagged) */}
      {enablePred && (
        <div className="absolute top-16 right-4 flex flex-col gap-2 items-end z-40">
          <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-md shadow">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={predOn}
                onChange={(e) => setPredOn(e.target.checked)}
              />
              Predicción
            </label>
            <div className="mt-2">
              <label className="text-xs text-muted-foreground">Opacidad</label>
              <input
                type="range"
                min={0.1}
                max={0.9}
                step={0.05}
                value={predOpacity}
                onChange={(e) => setPredOpacity(parseFloat(e.target.value))}
              />
            </div>
          </div>
          {predOn && (
            <div className="bg-white/90 backdrop-blur px-3 py-2 rounded-md shadow text-xs w-48">
              <div className="font-medium mb-1">Prob. fructificación</div>
              <div
                style={{
                  height: 8,
                  background:
                    'linear-gradient(90deg, hsl(0 80% 45%), hsl(60 80% 45%), hsl(120 80% 45%))',
                  borderRadius: 4,
                }}
              />
              <div className="flex justify-between mt-1">
                <span>0%</span><span>50%</span><span>100%</span>
              </div>
              {predLoading && <div className="mt-2 text-[11px] text-muted-foreground">Calculando…</div>}
            </div>
          )}
        </div>
      )}
      {placingMode && (
        <div className="absolute left-3 top-3 bg-background/90 backdrop-blur px-3 py-2 rounded-md shadow text-sm">
          Haz clic en el mapa para colocar tu sétal
        </div>
      )}
      {isDemoMode && (
        <div className="absolute top-4 right-4 bg-orange-500 text-white px-3 py-1 rounded text-sm font-semibold opacity-70 z-50">
          DEMO
        </div>
      )}
    </div>
  );
}