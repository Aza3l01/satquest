'use client'

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function SatelliteMap({ lat, lon }: { lat: number; lon: number }) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (!containerRef.current) return;
    const position: [number, number] = [lat, lon];
    
    if (!mapRef.current) {
      mapRef.current = L.map(containerRef.current, {
        center: position,
        zoom: 14,
        zoomControl: false,
        attributionControl: false,
        dragging: false,
        doubleClickZoom: false,
        boxZoom: false,
        scrollWheelZoom: false,
        keyboard: false
      });
      
      L.tileLayer('https://sierramapstiles.onrender.com/tiles/{x}/{y}/{z}?layer=s', {
        maxZoom: 19,
        tileSize: 256,
        detectRetina: true
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView(position, 14);
    }
    
    const marker = L.marker(position, {
      icon: L.divIcon({
        className: 'satellite-marker',
        html: `<div class="w-8 h-8 bg-green-500 rounded-full border-4 border-white"></div>`,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      })
    }).addTo(mapRef.current);
    
    return () => {
      marker.remove();
    };
  }, [lat, lon]);
  
  return <div ref={containerRef} className="w-full h-full" />;
}