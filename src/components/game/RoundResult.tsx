'use client'
import L from 'leaflet';
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
  
  useEffect(() => {
    if (!containerRef.current || !result) return;
    
    const actualPos: [number, number] = [result.city.lat, result.city.lon];
    const guessPos: [number, number] = [result.guess[1], result.guess[0]];
    
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center: actualPos,
        zoom: 4,
        zoomControl: false
      });
      
      L.tileLayer('https://sierramapstiles.onrender.com/tiles/{x}/{y}/{z}?layer=y', {
        maxZoom: 19
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView(actualPos, 4);
    }
    
    mapRef.current.eachLayer(layer => {
      if (layer instanceof L.Marker || layer instanceof L.Polyline) {
        mapRef.current?.removeLayer(layer);
      }
    });
    
    L.marker(actualPos, {
      icon: L.divIcon({
        className: 'correct-marker',
        html: `<div class="w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).addTo(mapRef.current);
    
    L.marker(guessPos, {
      icon: L.divIcon({
        className: 'guess-marker',
        html: `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white"></div>`,
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      })
    }).addTo(mapRef.current);
    
    L.polyline([actualPos, guessPos], {
      color: '#ff0000',
      weight: 2,
      dashArray: '5, 5'
    }).addTo(mapRef.current);
    
    return () => {
    };
  }, [result]);
  
  return (
    <div className="fixed inset-0 bg-black/80 flex flex-col items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-3xl mx-4">
        <h2 className="text-2xl font-bold mb-4 text-center">Round {result.round} Results</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="bg-gray-100 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Location</h3>
              <p className="text-xl">{result.city.name}, {result.city.country}</p>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Accuracy</p>
                <p className="text-xl font-bold text-green-600">{result.accuracy.toFixed(2)}%</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Distance</p>
                <p className="text-xl font-bold">{result.distance.toFixed(2)} km</p>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Time</p>
                <p className="text-xl font-bold">{result.timeSpent}s</p>
              </div>
            </div>
            
            <button
              onClick={onNext}
              className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-bold mt-4"
            >
              {result.round < 5 ? 'Next Round' : 'See Final Results'}
            </button>
          </div>
          
          <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
            <div ref={containerRef} className="w-full h-full" />
          </div>
        </div>
      </div>
    </div>
  );
}