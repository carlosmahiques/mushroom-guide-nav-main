import { MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UiMarker } from "@/hooks/useMapData";

interface SpotSelectorProps {
  spots: UiMarker[];
  selectedSpot: UiMarker | null;
  onSpotSelect: (spot: UiMarker | null) => void;
  loading?: boolean;
}

export function SpotSelector({ spots, selectedSpot, onSpotSelect, loading }: SpotSelectorProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <MapPin className="h-5 w-5 text-primary" />
        <span className="font-medium text-foreground">Localización:</span>
      </div>
      <Select 
        value={selectedSpot?.id || ""} 
        onValueChange={(value) => {
          const spot = spots.find(s => s.id === value) || null;
          onSpotSelect(spot);
        }}
        disabled={loading || spots.length === 0}
      >
        <SelectTrigger className="w-64">
          <SelectValue placeholder={
            spots.length === 0 
              ? "No hay sitios guardados" 
              : "Selecciona un sitio"
          } />
        </SelectTrigger>
        <SelectContent>
          {spots.map((spot) => (
            <SelectItem key={spot.id} value={spot.id}>
              <div className="flex flex-col">
                <span className="font-medium">{spot.title}</span>
                <span className="text-xs text-muted-foreground">
                  {spot.lat.toFixed(4)}°, {spot.lng.toFixed(4)}°
                </span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}