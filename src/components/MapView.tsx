import React from "react";

type LatLng = { lat: number; lng: number };

type MapViewProps = {
  center: LatLng;          // Centro del mapa
  zoom?: number;           // 1–19 aprox
  marker?: LatLng | null;  // Marcador opcional
  height?: string;         // Alto del mapa (p.ej. "400px", "60vh")
  className?: string;      // Clases para el contenedor
};

function buildOsmEmbedUrl(center: LatLng, zoom: number, marker?: LatLng | null) {
  // BBOX aproximado a partir del centro y el zoom para que OSM renderice el encuadre.
  // (No es perfecto, pero funciona para un embed rápido sin dependencias)
  const latDelta = 180 / Math.pow(2, zoom + 1);
  const lngDelta = 360 / Math.pow(2, zoom + 1);

  const left   = center.lng - lngDelta;
  const right  = center.lng + lngDelta;
  const top    = center.lat + latDelta;
  const bottom = center.lat - latDelta;

  const base = "https://www.openstreetmap.org/export/embed.html";
  const bbox = `bbox=${left},${bottom},${right},${top}`;
  const layer = "layer=mapnik";
  const markerParam = marker
    ? `&mlat=${marker.lat}&mlon=${marker.lng}&marker=${marker.lat},${marker.lng}`
    : "";

  return `${base}?${bbox}&${layer}${markerParam}`;
}

export default function MapView({
  center,
  zoom = 14,
  marker = null,
  height = "60vh",
  className = "",
}: MapViewProps) {
  const src = buildOsmEmbedUrl(center, zoom, marker);

  return (
    <div className={`w-full overflow-hidden rounded-2xl shadow ${className}`} style={{ height }}>
      <iframe
        title="Mapa"
        src={src}
        style={{ border: 0, width: "100%", height: "100%" }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      {/* Enlace opcional para abrir en OSM */}
      <a
        className="sr-only"
        href={`https://www.openstreetmap.org/#map=${zoom}/${center.lat}/${center.lng}`}
        target="_blank"
        rel="noreferrer"
      >
        Ver en OpenStreetMap
      </a>
    </div>
  );
}