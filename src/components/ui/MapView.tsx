import { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

export interface MapMarker {
  latitude: number;
  longitude: number;
  color: string;
  label?: string;
}

interface MapViewProps {
  markers: MapMarker[];
  height?: string;
  showRoute?: boolean;
}

export default function MapView({
  markers,
  height = "360px",
  showRoute = true,
}: MapViewProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  const validMarkers = markers.filter(
    (m) => Number.isFinite(m.latitude) && Number.isFinite(m.longitude),
  );

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current || validMarkers.length === 0)
      return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [validMarkers[0].longitude, validMarkers[0].latitude],
      zoom: 13,
    });

    mapRef.current.addControl(
      new mapboxgl.NavigationControl({ showCompass: false }),
      "top-right",
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [validMarkers.length > 0]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || validMarkers.length === 0) return;

    const applyMarkersAndRoute = () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const bounds = new mapboxgl.LngLatBounds();

      validMarkers.forEach((marker) => {
        const wrapper = document.createElement("div");
        wrapper.style.display = "flex";
        wrapper.style.alignItems = "center";
        wrapper.style.gap = "6px";

        const dot = document.createElement("div");
        dot.style.width = "16px";
        dot.style.height = "16px";
        dot.style.borderRadius = "50%";
        dot.style.backgroundColor = marker.color;
        dot.style.border = "3px solid white";
        dot.style.boxShadow = "0 1px 4px rgba(0,0,0,0.4)";
        dot.style.flexShrink = "0";
        wrapper.appendChild(dot);

        if (marker.label) {
          const labelEl = document.createElement("div");
          labelEl.textContent = marker.label;
          labelEl.style.background = "white";
          labelEl.style.padding = "3px 8px";
          labelEl.style.borderRadius = "5px";
          labelEl.style.fontSize = "12px";
          labelEl.style.fontWeight = "600";
          labelEl.style.color = "#1E293B";
          labelEl.style.boxShadow = "0 1px 4px rgba(0,0,0,0.25)";
          labelEl.style.whiteSpace = "nowrap";
          wrapper.appendChild(labelEl);
        }

        const mapboxMarker = new mapboxgl.Marker({
          element: wrapper,
          anchor: "left",
        })
          .setLngLat([marker.longitude, marker.latitude])
          .addTo(map);

        markersRef.current.push(mapboxMarker);
        bounds.extend([marker.longitude, marker.latitude]);
      });

      if (showRoute && validMarkers.length >= 2) {
        const routeCoords = validMarkers
          .slice(0, 2)
          .map((m) => [m.longitude, m.latitude]);

        const geojson = {
          type: "Feature" as const,
          properties: {},
          geometry: { type: "LineString" as const, coordinates: routeCoords },
        };

        if (map.getSource("route")) {
          (map.getSource("route") as mapboxgl.GeoJSONSource).setData(geojson);
        } else {
          map.addSource("route", { type: "geojson", data: geojson });
          map.addLayer({
            id: "route-line",
            type: "line",
            source: "route",
            layout: { "line-join": "round", "line-cap": "round" },
            paint: {
              "line-color": "#94A3B8",
              "line-width": 2.5,
              "line-dasharray": [1.5, 1.5],
            },
          });
        }
      }

      if (validMarkers.length > 1) {
        map.fitBounds(bounds, { padding: 80, maxZoom: 15 });
      } else {
        map.flyTo({
          center: [validMarkers[0].longitude, validMarkers[0].latitude],
          zoom: 14,
        });
      }
    };

    if (map.isStyleLoaded()) {
      applyMarkersAndRoute();
    } else {
      map.once("load", applyMarkersAndRoute);
    }
  }, [validMarkers, showRoute]);

  if (validMarkers.length === 0) {
    return (
      <div
        style={{ height, width: "100%" }}
        className="rounded-lg bg-slate-100 flex items-center justify-center"
      >
        <p className="text-slate-400 text-xs">Map data unavailable</p>
      </div>
    );
  }

  return (
    <div
      ref={mapContainerRef}
      style={{ height, width: "100%" }}
      className="rounded-lg overflow-hidden"
    />
  );
}
