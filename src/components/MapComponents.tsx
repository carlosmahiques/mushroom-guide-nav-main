import { useMapEvents } from "react-leaflet";
import { UiMarker } from "@/hooks/useMapData";

interface ClickToAddSpotProps {
  onAddSpot: (lat: number, lng: number, title: string, description?: string) => Promise<boolean>;
  isAuthenticated: boolean;
}

export function ClickToAddSpot({ onAddSpot, isAuthenticated }: ClickToAddSpotProps) {
  useMapEvents({
    async click(e) {
      if (!isAuthenticated) return;
      
      const title = prompt("Título del punto:");
      if (!title) return;
      
      const description = prompt("Descripción (opcional):") || "";
      const { lat, lng } = e.latlng;

      const success = await onAddSpot(lat, lng, title, description);
      if (!success) {
        alert("No se pudo guardar el punto.");
      }
    },
  });
  
  return null;
}

interface MarkerPopupContentProps {
  marker: UiMarker;
  onDelete: (id: string) => Promise<boolean>;
}

export function MarkerPopupContent({ marker, onDelete }: MarkerPopupContentProps) {
  const handleDelete = async () => {
    if (!confirm("¿Eliminar punto?")) return;
    
    const success = await onDelete(marker.id);
    if (!success) {
      alert("No se pudo eliminar.");
    }
  };

  return (
    <div className="space-y-1">
      <div className="font-medium">{marker.title}</div>
      {marker.description && (
        <div className="text-sm opacity-80">{marker.description}</div>
      )}
      <div className="text-xs opacity-60">
        ({marker.lat.toFixed(5)}, {marker.lng.toFixed(5)})
      </div>
      <button
        className="mt-2 px-2 py-1 text-xs rounded bg-black/10 hover:bg-black/20 transition-colors"
        onClick={handleDelete}
      >
        Eliminar
      </button>
    </div>
  );
}