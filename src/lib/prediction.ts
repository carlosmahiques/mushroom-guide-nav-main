export type GridCell = {
  id: string;
  bounds: [[number, number], [number, number]];
  score: number;      // 0..1
  rain7d: number;     // mm
  rh: number;         // %
  temp: number;       // °C
};

const clamp = (v: number, a = 0, b = 1) => Math.max(a, Math.min(b, v));

// Deterministic pseudo-random based on coordinates, stable between renders
function seedFrom(lat: number, lng: number) {
  const s = Math.sin(lat * 12.9898 + lng * 78.233) * 43758.5453;
  return s - Math.floor(s);
}

export function scoreCell({ rain7d, rh, temp, wind = 0 }: { rain7d: number; rh: number; temp: number; wind?: number }) {
  const rain7d_norm = clamp(rain7d / 40);
  const rain3d_bonus = clamp(rain7d / 20);
  const rh_norm = clamp((rh - 70) / 30);
  const temp_band = temp >= 8 && temp <= 18 ? 1 : (temp >= 5 && temp <= 22 ? 0.5 : 0);
  const wind_penalty = wind > 35 ? (wind - 35) / 25 : 0;
  const s = 0.4 * rain7d_norm + 0.3 * rh_norm + 0.25 * temp_band + 0.15 * rain3d_bonus - 0.1 * wind_penalty;
  return clamp(s);
}

// Red (0) → Yellow (0.5) → Green (1)
export function colorForScore(score: number) {
  const h = 120 * clamp(score);
  return `hsl(${h} 80% 45%)`;
}

function stepForZoom(zoom: number) {
  if (zoom <= 8) return 0.2;   // ~22 km
  if (zoom <= 10) return 0.1;  // ~11 km
  if (zoom <= 12) return 0.05; // ~5.5 km
  return 0.025;                // ~2.7 km
}

export function buildGrid(bounds: { getSouth: () => number; getWest: () => number; getNorth: () => number; getEast: () => number }, zoom: number): GridCell[] {
  const south = bounds.getSouth();
  const west = bounds.getWest();
  const north = bounds.getNorth();
  const east = bounds.getEast();
  const step = stepForZoom(zoom);

  const cells: GridCell[] = [];
  for (let lat = Math.floor(south / step) * step; lat < north; lat += step) {
    for (let lng = Math.floor(west / step) * step; lng < east; lng += step) {
      const cLat = lat + step / 2;
      const cLng = lng + step / 2;
      const r = seedFrom(cLat, cLng);
      // Mock plausible values for MVP
      const rain7d = Math.round(10 + r * 60); // 10..70 mm
      const rh = Math.round(60 + r * 40);     // 60..100 %
      const temp = Math.round(6 + r * 18);    // 6..24 ºC
      const score = scoreCell({ rain7d, rh, temp });

      cells.push({
        id: `${cLat.toFixed(3)}_${cLng.toFixed(3)}`,
        bounds: [[lat, lng], [lat + step, lng + step]],
        score,
        rain7d,
        rh,
        temp,
      });
    }
  }
  return cells;
}


