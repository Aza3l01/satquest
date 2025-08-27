'use client';

import { useState, useEffect } from 'react';

type SatelliteMapProps = {
  lat: number;
  lon: number;
  zoom: number;
  onMapLoad: () => void;
  width?: number;
  height?: number;
};

const SatelliteMap = ({ lat, lon, zoom, onMapLoad, width = 1280, height = 720 }: SatelliteMapProps) => {
  const accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN;
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
  }, [lat, lon, zoom]);


  if (!accessToken) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-red-900 text-white">
        Error: Mapbox access token is not configured or timed out. Contact the dev to fix it.
      </div>
    );
  }

  const imageUrl = `https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/${lon},${lat},${zoom},0/${width}x${height}@2x?access_token=${accessToken}`;

  const handleImageLoad = () => {
    setIsLoading(false);
    onMapLoad();
  };

  return (
    <div className="relative h-full w-full bg-black">
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
        </div>
      )}

      <img
        key={imageUrl}
        src={imageUrl}
        alt=""
        onLoad={handleImageLoad}
        onError={handleImageLoad}
        className={`h-full w-full object-cover transition-opacity duration-500 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
      />
    </div>
  );
};

export default SatelliteMap;