'use client'
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect, useRef } from 'react';

export default function RoundResult({ 
  result, 
  onNext 
}: {
  result: any;
  onNext: () => void;
}) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  
  useEffect(() => {
    if (!containerRef.current || !result) return;
    
    const actualPos: [number, number] = [result.city.lat, result.city.lon];
    const guessPos: [number, number] = [result.guess[1], result.guess[0]];
    
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        zoomControl: false,
        attributionControl: false,
        scrollWheelZoom: false,
        doubleClickZoom: false,
        touchZoom: false,
        boxZoom: false,
        keyboard: false,
        dragging: false
      });
      
      tileLayerRef.current = L.tileLayer(
        `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`, 
        { 
          maxZoom: 19,
          
        }
      ).addTo(mapRef.current);
      
      markersRef.current = L.layerGroup().addTo(mapRef.current);
    }

    const bounds = L.latLngBounds([actualPos, guessPos]);
    bounds.pad(1);
    
    mapRef.current.fitBounds(bounds);

    if (markersRef.current) {
      markersRef.current.clearLayers();
      
      L.marker(actualPos, {
        icon: L.divIcon({
          className: 'correct-marker',
          html: `<div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(markersRef.current);
      
      L.marker(guessPos, {
        icon: L.divIcon({
          className: 'guess-marker',
          html: `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white"></div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(markersRef.current);
      
      L.polyline([actualPos, guessPos], {
        color: '#ffffffff',
        weight: 2,
      }).addTo(markersRef.current);
    }
    
    setTimeout(() => {
      mapRef.current?.invalidateSize({ pan: false });
    }, 10);
    
    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        tileLayerRef.current = null;
        markersRef.current = null;
      }
    };
  }, [result]);
  
  return (
    <div className="fixed inset-0 bg-black/10 flex flex-col items-center justify-center z-50">
      <div className="bg-black/10 backdrop-blur-lg rounded-xl p-6 w-full max-w-3xl mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">ROUND {result.round}</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-black/10 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Location</h3>
              <p className="text-xl">{result.city.name}, {result.city.country}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-black/10 p-3 rounded-lg">
                <p className="text-sm text-white">Accuracy</p>
                <p className="text-xl font-bold text-green-600">{result.accuracy.toFixed(2)}%</p>
              </div>
              
              <div className="bg-black/10 p-3 rounded-lg">
                <p className="text-sm text-white">Distance</p>
                <p className="text-xl font-bold">{result.distance.toFixed(2)}</p>
              </div>
              
              <div className="bg-black/10 p-3 rounded-lg">
                <p className="text-sm text-white">Time</p>
                <p className="text-xl font-bold">{result.timeSpent}s</p>
              </div>
            </div>
          </div>
          
          <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
            <div ref={containerRef} className="w-full h-full" />
          </div>
        </div>
        
        <div className="flex gap-4 mt-6">
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-bold transition"
          >
            Quit to Menu
          </button>
          <button
            onClick={onNext}
            className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold transition"
          >
            {result.round < 5 ? 'Next Round' : 'See Final Results'}
          </button>
        </div>
      </div>
    </div>
  );
}