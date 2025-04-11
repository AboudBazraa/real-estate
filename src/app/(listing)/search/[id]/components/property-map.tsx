import { useEffect, useRef, useState } from "react";
import { Property } from "@/shared/types/property";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { MapPin, Navigation } from "lucide-react";

interface PropertyMapProps {
  property: Property;
}

export default function PropertyMap({ property }: PropertyMapProps) {
  const mapRef = useRef<L.Map | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const markerRef = useRef<L.Marker | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Clean up any previous map instance
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
      markerRef.current = null;
    }

    if (typeof window === "undefined") return;

    // Check if coordinates are valid
    if (
      !property.latitude ||
      !property.longitude ||
      isNaN(Number(property.latitude)) ||
      isNaN(Number(property.longitude))
    ) {
      setShowError(true);
      return;
    }

    // Make sure map container is visible before initializing
    let mapContainer = document.getElementById("property-map");
    if (!mapContainer || mapContainer.offsetParent === null) {
      // Container not visible yet, wait a bit longer
      const timer = setTimeout(() => {
        // Try again after delay
        if (mapRef.current) return; // Already initialized, exit

        mapContainer = document.getElementById("property-map");
        if (!mapContainer || mapContainer.offsetParent === null) {
          setShowError(true);
          return;
        }
        initializeMap();
      }, 500);

      return () => clearTimeout(timer);
    }

    const initializeMap = () => {
      try {
        // Check if the container is ready and visible
        if (!document.getElementById("property-map")) {
          console.error("Map container not found");
          setShowError(true);
          return;
        }

        if (!mapRef.current) {
          // Set a fixed height to the container before initializing
          const container = document.getElementById("property-map");
          if (container) {
            // Ensure the container has dimensions
            container.style.height = "300px";
          }

          const map = L.map("property-map", {
            center: [property.latitude, property.longitude],
            zoom: 15,
            zoomControl: true,
          });

          // Store reference
          mapRef.current = map;

          // Add tile layer
          L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
              '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
          }).addTo(map);

          // Fix for Leaflet "map container is already initialized" error
          setTimeout(() => {
            map.invalidateSize();
          }, 100);

          // Custom icon
          const icon = L.divIcon({
            html: `<div class="flex items-center justify-center w-10 h-10 bg-primary text-black rounded-full shadow-lg">
                   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                     <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"></path>
                     <circle cx="12" cy="10" r="3"></circle>
                   </svg>
                 </div>`,
            className: "custom-marker-icon",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
          });

          // Add marker
          markerRef.current = L.marker(
            [property.latitude, property.longitude],
            {
              icon,
            }
          ).addTo(map).bindPopup(`
            <div class="p-2">
              <div class="font-semibold">${property.title}</div>
              <div>${property.address}</div>
            </div>
          `);

          // Add a circle around the marker
          L.circle([property.latitude, property.longitude], {
            color: "rgba(59, 130, 246, 0.2)",
            fillColor: "rgba(59, 130, 246, 0.1)",
            fillOpacity: 0.5,
            radius: 200,
          }).addTo(map);

          setIsLoaded(true);
        }
      } catch (error) {
        console.error("Error loading map:", error);
        setShowError(true);
      }
    };

    // Use a short timeout to ensure DOM is ready
    const timer = setTimeout(() => {
      initializeMap();
    }, 300);

    return () => {
      clearTimeout(timer);
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
        markerRef.current = null;
      }
    };
  }, [property.latitude, property.longitude, property.title, property.address]);

  // Add a resize handler to update the map when container dimensions change
  useEffect(() => {
    const handleResize = () => {
      if (mapRef.current) {
        mapRef.current.invalidateSize();
      }
    };

    window.addEventListener("resize", handleResize);

    // Also invalidate size after a short delay to handle initial render
    const timer = setTimeout(() => {
      handleResize();
    }, 500);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, [isLoaded]);

  const handleGetDirections = () => {
    if (property.latitude && property.longitude) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${property.latitude},${property.longitude}`,
        "_blank"
      );
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100">
        <h3 className="text-lg font-semibold flex items-center">
          <MapPin size={18} className="mr-2 text-gray-500" />
          Location
        </h3>
      </div>

      {showError ? (
        <div className="h-64 flex items-center justify-center bg-gray-50 p-6 text-center">
          <div className="text-gray-500">
            <p>Map location unavailable</p>
            <p className="text-sm mt-1">
              The exact coordinates for this property couldn&apos;t be loaded.
            </p>
          </div>
        </div>
      ) : (
        <>
          <div
            id="property-map"
            ref={containerRef}
            className="h-64 w-full"
          ></div>

          <div className="p-4 flex items-center justify-between">
            <div className="text-sm text-gray-600">{property.address}</div>
            <button
              onClick={handleGetDirections}
              className="flex items-center text-sm text-primary hover:text-primary-dark"
            >
              <Navigation size={16} className="mr-1" />
              Directions
            </button>
          </div>
        </>
      )}
    </div>
  );
}
