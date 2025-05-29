
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef, useState } from "react";
// Using Leaflet directly (not react-leaflet)
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { hotspots } from "./MapHotspot";
import "./LeafletConfig";

const WorldMap = () => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const [ready, setReady] = useState(false);
  
  useEffect(() => {
    if (!ready) {
      setReady(true);
    }
  }, [ready]);
  
  useEffect(() => {
    if (ready && mapRef.current) {
      const mapContainer = mapRef.current;
      
      // Create map with modern style
      const map = L.map(mapContainer, {
        center: [20, 0],
        zoom: 2,
        scrollWheelZoom: false,
        zoomControl: false,
        attributionControl: false
      });
      
      // Position zoom controls in the bottom right corner
      L.control.zoom({
        position: 'bottomright'
      }).addTo(map);
      
      // Use a more modern, minimalist styled map
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      // Add a discreet attribution layer
      L.control.attribution({
        position: 'bottomleft',
        prefix: 'Trazabilidad & Ciclo de Vida'
      }).addTo(map);
      
      // Improve styling and visualization of data points
      hotspots.forEach(spot => {
        // Modern colors based on lifecycle efficiency
        const getMarkerColor = (value: number) => {
          if (value >= 80) return "#10b981"; // Green for high lifecycle efficiency
          if (value >= 50) return "#0ea5e9"; // Blue for medium efficiency
          return "#f43f5e"; // Pink for low efficiency
        };
        
        // Radius proportional to product footprint
        const getCircleRadius = (value: number) => {
          // Smaller sizes for a cleaner look
          return value * 800;
        };
        
        const circleColor = getMarkerColor(spot.value);
        const circleRadius = getCircleRadius(spot.value);
        
        // More stylized circles with better transparency
        L.circle([spot.lat, spot.lng], {
          radius: circleRadius,
          fillColor: circleColor,
          fillOpacity: 0.15,
          color: circleColor,
          weight: 1.5,
          className: 'pulse-animation'
        }).addTo(map);
        
        // Add a more visible central point
        L.circle([spot.lat, spot.lng], {
          radius: 70000,
          fillColor: circleColor,
          fillOpacity: 0.6,
          color: "#ffffff",
          weight: 1.5
        }).addTo(map);
        
        // More modern popup with traceability data
        const marker = L.marker([spot.lat, spot.lng]).addTo(map);
        marker.bindPopup(`
          <div class="p-3 shadow-sm">
            <div class="text-lg font-medium mb-2">${spot.label}</div>
            <div class="flex items-center mb-1">
              <span class="text-sm text-muted-foreground">Eficiencia del ciclo:</span>
              <span class="ml-auto font-medium">${spot.value}%</span>
            </div>
            <div class="w-full bg-gray-200 rounded-full h-1.5">
              <div class="h-1.5 rounded-full" style="width: ${spot.value}%; background-color: ${circleColor};"></div>
            </div>
          </div>
        `, {
          className: 'modern-popup',
          closeButton: false,
          maxWidth: 200
        });
      });
      
      // Add connection lines between points to show the supply chain
      const supplyChainLines = [
        [hotspots[0], hotspots[2]], // Nueva York - Tokio
        [hotspots[1], hotspots[6]], // Londres - Dubai
        [hotspots[2], hotspots[7]], // Tokio - Singapur
        [hotspots[4], hotspots[5]], // Rio - Ciudad del Cabo
      ];
      
      supplyChainLines.forEach(([source, target]) => {
        L.polyline([[source.lat, source.lng], [target.lat, target.lng]], {
          color: '#94a3b8',
          weight: 1,
          opacity: 0.5,
          dashArray: '5, 7',
          className: 'supply-chain-line'
        }).addTo(map);
      });
      
      // Add CSS styles dynamically for animations
      const style = document.createElement('style');
      style.innerHTML = `
        .pulse-animation {
          animation: pulse-animation 2.5s infinite;
        }
        
        @keyframes pulse-animation {
          0% { opacity: 0.15; }
          50% { opacity: 0.25; }
          100% { opacity: 0.15; }
        }
        
        .modern-popup .leaflet-popup-content-wrapper {
          border-radius: 8px;
          padding: 0;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .modern-popup .leaflet-popup-tip {
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }
        
        .supply-chain-line {
          animation: flow-animation 4s infinite linear;
          stroke-dasharray: 5, 7;
          stroke-width: 1.5;
        }
        
        @keyframes flow-animation {
          to { stroke-dashoffset: -24; }
        }
      `;
      document.head.appendChild(style);
      
      // Cleanup function
      return () => {
        map.remove();
        document.head.removeChild(style);
      };
    }
  }, [ready]);

  return (
    <Card className="col-span-3">
      <CardHeader className="pb-2">
        <CardTitle>Distribución Global</CardTitle>
      </CardHeader>
      <CardContent className="p-0 overflow-hidden relative">
        <div ref={mapRef} className="w-full h-[400px] relative" />
      </CardContent>
    </Card>
  );
};

export default WorldMap;
