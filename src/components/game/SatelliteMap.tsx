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
      
      L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/tiles/256/{z}/{x}/{y}?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}`, {
        maxZoom: 19,
        tileSize: 256,
        crossOrigin: true,
        detectRetina: true
      }).addTo(mapRef.current);
    } else {
      mapRef.current.setView(position, 14);
    }
    
    const marker = L.marker(position, {
      icon: L.divIcon({
        className: 'satellite-marker',
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