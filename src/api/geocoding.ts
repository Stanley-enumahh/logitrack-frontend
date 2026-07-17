export interface GeocodeResult {
  address: string;
  latitude: number;
  longitude: number;
}

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

export async function searchAddress(query: string): Promise<GeocodeResult[]> {
  if (!query || query.length < 3) return [];

  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
    query,
  )}.json?access_token=${MAPBOX_TOKEN}&limit=5&country=ng`;

  const response = await fetch(url);
  if (!response.ok) throw new Error("Geocoding request failed");

  const data = await response.json();

  return data.features.map((feature: any) => ({
    address: feature.place_name,
    longitude: feature.center[0],
    latitude: feature.center[1],
  }));
}
