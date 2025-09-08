import { useEffect, useState, useRef } from "react";
import { useMapData } from "@/hooks/useMapData";
import { useDemoMode } from "@/hooks/useDemoMode";
import { useDemoMarkers } from "@/hooks/useDemoMarkers";
import { useGatedAction } from "@/hooks/useGatedAction";
import { useAnalytics } from "@/hooks/useAnalytics";
import { toast } from "sonner";
import L from "leaflet";
// CSS se carga dinámicamente cuando se necesita el mapa
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

type MapViewLeafletProps = {
  center: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  className?: string;
  placingMode?: boolean;
};

// Tipos para el mapa
// Fix default icon paths when bundling with Vite
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// Crear icono personalizado para setales
const createSetalIcon = () => {
  return L.divIcon({
    className: 'setal-marker',
    html: `<div style="
      width: 24px; 
      height: 24px; 
      background: #22c55e; 
      border: 3px solid white; 
      border-radius: 50%; 
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      color: white;
      font-weight: bold;
    ">🍄</div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -12]
  });
};

export default function MapViewLeaflet({
  center,
  zoom = 13,
  height = "70vh",
  className = "",
  placingMode = false,
}: MapViewLeafletProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [cssLoaded, setCssLoaded] = useState(false);
  const { markers, sessionUserId, loading, addSpot, deleteSpot } = useMapData();
  const { isDemoMode } = useDemoMode();
  const demoMarkers = useDemoMarkers();
  const { gatedAction } = useGatedAction();
  const { logEvent } = useAnalytics();
  const placingRef = useRef<boolean>(placingMode);

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
        const title = prompt("Título del sétal (3–40 caracteres):");
        if (!title) return;
        if (title.length < 3 || title.length > 40) {
          toast.error("El título debe tener entre 3 y 40 caracteres");
          return;
        }
        const description = prompt("Descripción (opcional, hasta 140):") || "";
        if (description.length > 140) {
          toast.error("La descripción no puede superar 140 caracteres");
          return;
        }
        const { lat, lng } = e.latlng;
        
        // Log setal_create antes de crear
        const setalId = Date.now().toString();
        logEvent('setal_create', {
          setal_id: setalId,
          coordinates: { lat, lng },
          especie: 'desconocida', // TODO: Obtener del formulario
          time_to_first_setal: 0 // TODO: Calcular tiempo desde registro
        });
        
        toast.promise(
          addSpot(lat, lng, title, description),
          {
            loading: "Guardando sétal...",
            success: () => "¡Sétal guardado correctamente!",
            error: "Error al guardar el sétal",
          }
        );
      });

      setIsLoaded(true);
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
    markers.forEach((marker) => {
      const leafletMarker = L.marker([marker.lat, marker.lng], { icon: createSetalIcon() })
        .addTo(leafletMapRef.current);

      const popupContent = `
        <div style="font-family: system-ui; min-width: 200px;">
          <div style="font-weight: 600; margin-bottom: 4px;">${marker.title}</div>
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
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2" />
            <p className="text-sm text-muted-foreground">Inicializando mapa...</p>
          </div>
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