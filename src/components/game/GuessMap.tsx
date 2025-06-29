'use client'

import { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function GuessMap({ 
  onGuess, 
  onConfirm,
  hasGuess
}: {
  onGuess: (coords: [number, number]) => void;
  onConfirm: () => void;
  hasGuess: boolean;
}) {
  const [isExpanded, setIsExpanded] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    if (!mapRef.current) {
      const mapInstance = L.map(containerRef.current, {
        center: [30, 0],
        zoom: 2,
        zoomControl: false,
        attributionControl: false
      });
      
      L.tileLayer('https://sierramapstiles.onrender.com/tiles/{x}/{y}/{z}?layer=m', {
        maxZoom: 19,
        tileSize: 256,
        detectRetina: true,
        attribution: '© AQUILA Maps'
      }).addTo(mapInstance);
      
      mapInstance.on('click', (e: L.LeafletMouseEvent) => {
        if (markerRef.current) markerRef.current.remove();
        
        const coords: [number, number] = [e.latlng.lng, e.latlng.lat];
        onGuess(coords);
        
        markerRef.current = L.marker(e.latlng, {
          icon: L.divIcon({
            className: 'guess-marker',
            html: `<div class="w-6 h-6 bg-red-500 rounded-full border-2 border-white"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          })
        }).addTo(mapInstance);
      });
      
      mapRef.current = mapInstance;
    }
    
    return () => {
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
    };
  }, []);
  
  useEffect(() => {
    if (mapRef.current) {
      setTimeout(() => {
        mapRef.current!.invalidateSize();
      }, 10);
    }
  }, [isExpanded]);

  return (
    <div 
      className={`relative transition-all duration-300 ${
        isExpanded 
          ? 'w-[50vw] h-[37.5vw] max-w-[800px] max-h-[600px]'
          : 'w-[15vw] h-[11.25vw] min-w-[180px] min-h-[135px]'
      } bg-white rounded-lg overflow-hidden border-2 border-emerald-500 shadow-lg ${
        !isExpanded && 'opacity-80 hover:opacity-100'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div ref={containerRef} className="w-full h-[calc(100%-40px)]" />
      
      <button
        onClick={onConfirm}
        disabled={!hasGuess}
        className={`w-full h-10 flex items-center justify-center font-bold ${
          hasGuess 
            ? 'bg-emerald-500 hover:bg-emerald-600 text-white' 
            : 'bg-gray-300 text-gray-500 cursor-not-allowed'
        } transition-colors`}
      >
        Confirm Guess
      </button>
    </div>
  );
}