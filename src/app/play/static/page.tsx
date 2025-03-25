"use client";
import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import { distance } from "@turf/turf";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export default function StaticPage() {
  const satelliteContainer = useRef<HTMLDivElement>(null);
  const guessMapContainer = useRef<HTMLDivElement>(null);
  const satelliteMap = useRef<mapboxgl.Map | null>(null);
  const guessMap = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [actualLocation, setActualLocation] = useState<[number, number]>([0, 0]);
  const [guessLocation, setGuessLocation] = useState<[number, number] | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(90);
  const [cityName, setCityName] = useState<string>("");
  const [country, setCountry] = useState<string>("");
  const [timerEnded, setTimerEnded] = useState(false);
  const [mapHovered, setMapHovered] = useState(false);
  const router = useRouter();

  const resetGame = async () => {
    if (marker.current) {
      marker.current.remove();
      marker.current = null;
    }
    
    if (guessMap.current?.getLayer("result-line")) {
      guessMap.current.removeLayer("result-line");
      guessMap.current.removeSource("result-line");
    }

    setGuessLocation(null);
    setAccuracy(null);
    setTimeLeft(90);
    setTimerEnded(false);
    
    const response = await fetch("/data/cities.json");
    const cities = await response.json();
    const randomCity = cities[Math.floor(Math.random() * cities.length)];
    setActualLocation(randomCity.coords);
    setCityName(randomCity.name);
    setCountry(randomCity.country);

    if (satelliteMap.current) {
      satelliteMap.current.getContainer().style.visibility = "visible";
      satelliteMap.current.setStyle("mapbox://styles/mapbox/satellite-v9");
      satelliteMap.current.jumpTo({
        center: randomCity.coords,
        zoom: 14
      });
    }
    
    if (guessMap.current) {
      guessMap.current.setStyle("mapbox://styles/mapbox/light-v10");
      guessMap.current.jumpTo({
        center: [0, 0],
        zoom: 1
      });
    }
  };

  useEffect(() => {
    const loadRandomCity = async () => {
      const response = await fetch("/data/cities.json");
      const cities = await response.json();
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      setActualLocation(randomCity.coords);
      setCityName(randomCity.name);
      setCountry(randomCity.country);
    };
    loadRandomCity();
  }, []);

  useEffect(() => {
    if (!satelliteContainer.current || !guessMapContainer.current || actualLocation[0] === 0) return;

    satelliteMap.current = new mapboxgl.Map({
      container: satelliteContainer.current,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: actualLocation,
      zoom: 14,
      interactive: false,
      pitch: 0,
      bearing: 0
    });

    guessMap.current = new mapboxgl.Map({
      container: guessMapContainer.current,
      style: "mapbox://styles/mapbox/light-v10",
      center: [0, 0],
      zoom: 1,
      pitch: 0,
      bearing: 0
    });

    guessMap.current.on("click", (e) => {
      if (marker.current) marker.current.remove();
      const coords: [number, number] = [e.lngLat.lng, e.lngLat.lat];
      setGuessLocation(coords);
      marker.current = new mapboxgl.Marker({
        color: "#ff0000",
        draggable: false
      })
        .setLngLat(coords)
        .addTo(guessMap.current!);
    });

    const resizeObserver = new ResizeObserver(() => {
      guessMap.current?.resize();
    });
    if (guessMapContainer.current) {
      resizeObserver.observe(guessMapContainer.current);
    }

    return () => {
      if (satelliteMap.current) {
        satelliteMap.current.remove();
        satelliteMap.current = null;
      }
      if (guessMap.current) {
        guessMap.current.remove();
        guessMap.current = null;
      }
      if (marker.current) {
        marker.current.remove();
        marker.current = null;
      }
      resizeObserver.disconnect();
    };
  }, [actualLocation]);

  useEffect(() => {
    if (timeLeft === 0) {
      setTimerEnded(true);
      if (!guessLocation) {
        if (satelliteMap.current) {
          satelliteMap.current.getContainer().style.visibility = "hidden";
        }
      }
    }
    
    const interval = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [guessLocation]);

  const calculateAccuracy = () => {
    if (!guessLocation) return 0;
    const maxDistance = 5000;
    const dist = distance(actualLocation, guessLocation, { units: "kilometers" });
    return Math.max(0, 100 - (dist / maxDistance) * 100);
  };

  const handleConfirm = () => {
    const finalAccuracy = calculateAccuracy();
    setAccuracy(finalAccuracy);
    
    if (satelliteMap.current) {
      satelliteMap.current.getContainer().style.visibility = "hidden";
    }

    if (guessLocation && guessMap.current) {
      guessMap.current.addLayer({
        id: "result-line",
        type: "line",
        source: {
          type: "geojson",
          data: {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [actualLocation, guessLocation]
            },
            properties: {}
          }
        },
        paint: {
          "line-color": "#ff0000",
          "line-width": 3
        }
      });
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      <Navbar user={null} />
      <div className="relative h-screen w-full">
        <div
          ref={satelliteContainer}
          className="absolute inset-0 w-full h-full"
        />

        <div
          className={`absolute bottom-4 right-4 transition-all duration-300 ${
            mapHovered ? "w-[400px] h-[300px]" : "w-[200px] h-[150px]"
          } bg-white rounded-lg shadow-xl border-2 border-emerald-500 overflow-hidden`}
          onMouseEnter={() => setMapHovered(true)}
          onMouseLeave={() => setMapHovered(false)}
        >
          <div
            ref={guessMapContainer}
            className="w-full h-[calc(100%-40px)]"
          />
          <button
            onClick={handleConfirm}
            className="w-full h-10 bg-emerald-500 hover:bg-emerald-600 text-white font-bold flex items-center justify-center"
          >
            Confirm Pin
          </button>
        </div>

        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/50 text-white px-4 py-2 rounded-lg text-lg z-10">
          {formatTime(timeLeft)}
        </div>

        <button
          onClick={() => router.push("/play")}
          className="absolute bottom-4 left-4 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 shadow-lg z-10"
        >
          Exit Game
        </button>

        {(timerEnded || accuracy !== null) && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-20">
            <div className="bg-white p-8 rounded-lg text-center max-w-md mx-4">
              <h2 className="text-3xl text-black font-bold mb-4">
                {guessLocation ? "Results" : "Time's Up!"}
              </h2>
              {guessLocation ? (
                <>
                  <p className="text-2xl text-black mb-2">Accuracy: {accuracy?.toFixed(2)}%</p>
                  <p className="text-lg text-black">
                    Distance: {distance(actualLocation, guessLocation, { units: "kilometers" }).toFixed(2)} km
                  </p>
                </>
              ) : (
                <p className="text-xl text-black">You didn't guess a location!</p>
              )}
              <p className="text-lg mt-4 text-black">
                {cityName}, {country}
              </p>
              <div className="flex gap-4 justify-center mt-6">
                <button
                  onClick={resetGame}
                  className="px-6 py-2 bg-emerald-500 text-white rounded hover:bg-emerald-600"
                >
                  Play Again
                </button>
                <button
                  onClick={() => router.push("/play")}
                  className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                >
                  Back to Menu
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx global>{`
        .mapboxgl-control-container { display: none !important; }
        .mapboxgl-ctrl-attrib { display: none !important; }
        .mapboxgl-marker {
          width: 24px !important;
          height: 24px !important;
          background: #ff0000;
          border-radius: 50%;
          border: 2px solid white;
          box-shadow: 0 0 8px rgba(0,0,0,0.3);
        }
        .mapboxgl-canvas-container {
          height: 100% !important;
          width: 100% !important;
        }
      `}</style>
    </>
  );
}