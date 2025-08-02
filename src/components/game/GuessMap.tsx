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
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    
    if (!mapRef.current) {
      const mapInstance = L.map(containerRef.current, {
        center: [0, 0],
        zoom: 1,
        zoomControl: false,
        attributionControl: false
      });
      
      // tileLayerRef.current = L.tileLayer(
      //   'https://sierramaps.ftp.sh/tiles/{x}/{y}/{z}?layer=m', 
      //   {
      //     maxZoom: 19,
      //     tileSize: 256,
      //     detectRetina: false,
      //     attribution: '© AQUILA Maps',
      //     updateWhenIdle: false,
      //     updateInterval: 200,
      //     keepBuffer: 10
      //   }
      // ).addTo(mapInstance);

      tileLayerRef.current = L.tileLayer(
        `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`,
        {
          maxZoom: 19,
          tileSize: 256,
          detectRetina: true,
          attribution: '© Mapbox',
          // Remove non-standard options:
          // updateWhenIdle: false,
          // updateInterval: 200,
          // keepBuffer: 10
        }
      ).addTo(mapInstance);
      
      mapInstance.on('click', (e: L.LeafletMouseEvent) => {
        if (markerRef.current) {
          markerRef.current.remove();
          markerRef.current = null;
        }
        
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
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
      if (markerRef.current) {
        markerRef.current.remove();
        markerRef.current = null;
      }
      tileLayerRef.current = null;
    };
  }, []);
  
  return (
    <div 
      className={`relative transition-all duration-300 ${
        isExpanded 
          ? 'w-[40vw] h-[30vw] max-w-[700px] max-h-[525px]'
          : 'w-[15vw] h-[11.25vw] min-w-[180px] min-h-[135px]'
      } bg-white rounded-lg overflow-hidden border-2 border-emerald-500 shadow-lg ${
        !isExpanded && 'opacity-80 hover:opacity-100'
      }`}
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <div 
        ref={containerRef} 
        className="absolute top-0 left-0 w-[40vw] h-[30vw] max-w-[700px] max-h-[525px]"
      />
      
      <button
        onClick={onConfirm}
        disabled={!hasGuess}
        className={`w-full h-10 absolute bottom-0 left-0 flex items-center justify-center font-bold ${
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