
export interface MapHotspot {
  id: string;
  label: string;
  lat: number;
  lng: number;
  value: number;
}

export const hotspots: MapHotspot[] = [
  { id: "1", label: "Nueva York", lat: 40.7128, lng: -74.0060, value: 65 },
  { id: "2", label: "Londres", lat: 51.5074, lng: -0.1278, value: 84 },
  { id: "3", label: "Tokio", lat: 35.6762, lng: 139.6503, value: 92 },
  { id: "4", label: "Sídney", lat: -33.8688, lng: 151.2093, value: 47 },
  { id: "5", label: "Rio de Janeiro", lat: -22.9068, lng: -43.1729, value: 38 },
  { id: "6", label: "Ciudad del Cabo", lat: -33.9249, lng: 18.4241, value: 29 },
  { id: "7", label: "Dubái", lat: 25.2048, lng: 55.2708, value: 76 },
  { id: "8", label: "Singapur", lat: 1.3521, lng: 103.8198, value: 88 },
];
