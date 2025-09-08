import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./useAuth";

type SpotRow = {
  id: string;
  name: string;
  notes?: string | null;
  lat: number;
  lng: number;
  created_at?: string | null;
  user_id?: string;
  is_public?: boolean;
  is_active?: boolean | null;
};

export type UiMarker = { 
  id: string; 
  title: string; 
  description?: string | null; 
  lat: number; 
  lng: number; 
  createdAt?: string | null;
};

export function useMapData() {
  const [markers, setMarkers] = useState<UiMarker[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const sessionUserId = user?.id || null;
  const [totalSpots, setTotalSpots] = useState<number>(0);
  const [exploredZones, setExploredZones] = useState<number>(0);
  const [createdThisMonth, setCreatedThisMonth] = useState<number>(0);
  
  // Debug: Log state changes
  useEffect(() => {
    console.log('🔄 useMapData state changed:', { totalSpots, exploredZones, createdThisMonth });
  }, [totalSpots, exploredZones, createdThisMonth]);
  
  // Update metrics when markers change
  useEffect(() => {
    console.log('🔄 Updating metrics based on markers:', markers.length);
    
    // Update total spots
    setTotalSpots(markers.length);
    
    // Calculate explored zones
    const tileKeys = new Set(
      markers.map(m => `${Math.floor(m.lat * 20)}-${Math.floor(m.lng * 20)}`)
    );
    setExploredZones(tileKeys.size);
    
    // Calculate created this month
    const now = new Date();
    const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}`;
    setCreatedThisMonth(
      markers.filter(m => m.createdAt?.startsWith(ym)).length
    );
    
    console.log('📊 Metrics updated:', {
      totalSpots: markers.length,
      exploredZones: tileKeys.size,
      createdThisMonth: markers.filter(m => m.createdAt?.startsWith(ym)).length
    });
  }, [markers]);

  // Load spots using RPC function
  useEffect(() => {
    (async () => {
      try {
        console.log("Loading spots data...");
        
        const { data, error } = await supabase.rpc('get_spot_coordinates');
        
        if (error) { 
          console.error("Error loading spots:", error); 
          setLoading(false);
          return; 
        }

        console.log("Raw spots data from RPC:", data);

        // Filter spots based on user permissions
        let filteredData = data || [];
        if (sessionUserId) {
          // Only user's active spots
          filteredData = filteredData.filter((s: SpotRow) => 
            s.user_id === sessionUserId && (s.is_active ?? true)
          );
        } else {
          // Not authenticated → nothing (o públicos si los hubiera)
          filteredData = filteredData.filter((s: SpotRow) => s.is_public === true && (s.is_active ?? true));
        }

        console.log("Filtered spots data:", filteredData);

        const mapped: UiMarker[] = filteredData
          .map((s: SpotRow) => {
            if (!s.lat || !s.lng) {
              console.warn("Spot missing coordinates:", s);
              return null;
            }
            return { 
              id: s.id, 
              title: s.name, 
              description: s.notes ?? undefined, 
              lat: s.lat, 
              lng: s.lng,
              createdAt: s.created_at ?? null,
            };
          })
          .filter(Boolean) as UiMarker[];
        
        console.log("Final mapped markers:", mapped);
        setMarkers(mapped);
        // metrics
        setTotalSpots(mapped.length);
        const tileKeys = new Set(
          mapped.map(m => `${Math.floor(m.lat * 20)}-${Math.floor(m.lng * 20)}`)
        );
        setExploredZones(tileKeys.size);
        const now = new Date();
        const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}`;
        setCreatedThisMonth(
          mapped.filter(m => m.createdAt?.startsWith(ym)).length
        );
        setLoading(false);
      } catch (error) {
        console.error("Error loading map data:", error);
        setLoading(false);
      }
    })();
  }, [sessionUserId]);

  // Realtime subscription
  useEffect(() => {
    if (!sessionUserId) return;
    const channel = supabase
      .channel("spots-changes")
      .on("postgres_changes", { 
        event: "*", 
        schema: "public", 
        table: "spots",
        filter: `user_id=eq.${sessionUserId}`,
      }, (payload) => {
        const spotData = (payload.new || payload.old) as any;
        const belongsToUser = sessionUserId && spotData?.user_id === sessionUserId;
        if (!belongsToUser) return;
        
        if (payload.eventType === "INSERT" || payload.eventType === "UPDATE") {
          // Refresh data when spots change
          supabase.rpc('get_spot_coordinates').then(({ data }) => {
            if (data) {
              let filteredData = data;
              filteredData = data.filter((s: SpotRow) => 
                s.user_id === sessionUserId && (s.is_active ?? true)
              );
              
              const mapped: UiMarker[] = filteredData
                .map((s: SpotRow) => {
                  if (!s.lat || !s.lng) return null;
                  return { 
                    id: s.id, 
                    title: s.name, 
                    description: s.notes ?? undefined, 
                    lat: s.lat, 
                    lng: s.lng,
                    createdAt: s.created_at ?? null,
                  };
                })
                .filter(Boolean) as UiMarker[];
              
              setMarkers(mapped);
              setTotalSpots(mapped.length);
              const tileKeys = new Set(
                mapped.map(m => `${Math.floor(m.lat * 20)}-${Math.floor(m.lng * 20)}`)
              );
              setExploredZones(tileKeys.size);
              const now = new Date();
              const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}`;
              setCreatedThisMonth(
                mapped.filter(m => m.createdAt?.startsWith(ym)).length
              );
            }
          });
        } else if (payload.eventType === "DELETE") {
          setMarkers((prev) => prev.filter(marker => marker.id !== spotData.id));
          setTotalSpots((n) => Math.max(0, n - 1));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [sessionUserId]);

  const addSpot = async (lat: number, lng: number, title: string, description?: string) => {
    console.log('🔍 addSpot called:', { lat, lng, title, description, sessionUserId });
    
    if (!sessionUserId) {
      console.log('❌ No sessionUserId, cannot add spot');
      return false;
    }

    try {
      // Try GeoJSON first
      let { data, error } = await supabase
        .from("spots")
        .insert({
          user_id: sessionUserId,
          name: title,
          notes: description || null,
          geom: { type: "Point", coordinates: [lng, lat] },
        })
        .select()
        .single();

      // Fallback to WKT
      if (error) {
        ({ data, error } = await supabase
          .from("spots")
          .insert({
            user_id: sessionUserId,
            name: title,
            notes: description || null,
            geom: `SRID=4326;POINT(${lng} ${lat})`,
          })
          .select()
          .single());
      }

      if (error) {
        console.error("❌ Error adding spot:", error);
        return false;
      }

      console.log('✅ Spot added successfully:', data);
      
      // Actualizar la lista de marcadores inmediatamente
      const newMarker = {
        id: data.id,
        title: data.name,
        description: data.notes || undefined,
        lat: lat,
        lng: lng,
        createdAt: data.created_at || null,
      };
      
      // Actualizar marcadores y métricas directamente
      setMarkers(prev => {
        const updatedMarkers = [...prev, newMarker];
        console.log('📍 Markers updated, new count:', updatedMarkers.length);
        
        // Actualizar métricas inmediatamente
        setTotalSpots(updatedMarkers.length);
        
        // Calcular zonas exploradas
        const tileKeys = new Set(
          updatedMarkers.map(m => `${Math.floor(m.lat * 20)}-${Math.floor(m.lng * 20)}`)
        );
        setExploredZones(tileKeys.size);
        
        // Calcular setales creados este mes
        const now = new Date();
        const ym = `${now.getUTCFullYear()}-${String(now.getUTCMonth()+1).padStart(2,'0')}`;
        setCreatedThisMonth(
          updatedMarkers.filter(m => m.createdAt?.startsWith(ym)).length
        );
        
        console.log('📊 Metrics updated directly:', {
          totalSpots: updatedMarkers.length,
          exploredZones: tileKeys.size,
          createdThisMonth: updatedMarkers.filter(m => m.createdAt?.startsWith(ym)).length
        });
        
        return updatedMarkers;
      });
      
      return true;
    } catch (error) {
      console.error("Error adding spot:", error);
      return false;
    }
  };

  const deleteSpot = async (spotId: string) => {
    try {
      // Soft delete if column exists
      let { error } = await supabase
        .from("spots")
        .update({ is_active: false })
        .eq("id", spotId);

      if (error) {
        // Hard delete fallback
        ({ error } = await supabase
          .from("spots")
          .delete()
          .eq("id", spotId));
      }

      if (error) {
        console.error("Error deleting spot:", error);
        return false;
      }

      setMarkers((prev) => prev.filter(marker => marker.id !== spotId));
      return true;
    } catch (error) {
      console.error("Error deleting spot:", error);
      return false;
    }
  };

  return {
    markers,
    sessionUserId,
    loading,
    addSpot,
    deleteSpot,
    totalSpots,
    exploredZones,
    createdThisMonth,
  };
}