"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";
import dynamic from "next/dynamic";
import { MapPin, RefreshCw } from "lucide-react";
import { useEffect, useRef, useState, useCallback } from "react";
import { Button } from "@/shared/components/ui/button";

// Import leaflet CSS
import "leaflet/dist/leaflet.css";

// Add custom styles for map popups
import "./map-styles.css";

// Define the map property type to match database fields
export interface MapProperty {
  id: string;
  title: string;
  description: string;
  location: string;
  latitude: number;
  longitude: number;
  featured: boolean;
  bedrooms: number;
  bathrooms: number;
  price: number;
  primaryImage: string;
  images?: { image_url: string }[];
  propertyType: string;
  squareFeet: number;
}

// Dynamically import the LeafletMap component with no SSR
const LeafletMap = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface MapProps {
  properties: MapProperty[];
  loading: boolean;
  selectedProperty: MapProperty | null;
  onPropertySelect: (property: MapProperty | null) => void;
}

export default function Map({
  properties,
  loading,
  selectedProperty,
  onPropertySelect,
}: MapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapKey, setMapKey] = useState(Date.now()); // Force re-render on error
  const [retryCount, setRetryCount] = useState(0);
  const maxRetries = 3;
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Enhanced error handling with timeout tracking
  const handleMapError = useCallback(
    (error: string) => {
      console.error("Map error:", error);
      setMapError(error);

      // Clear any existing timeout
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
        retryTimeoutRef.current = null;
      }

      // Auto retry with increasing delay and exponential backoff
      if (retryCount < maxRetries) {
        const delay = Math.pow(2, retryCount) * 1000;
        retryTimeoutRef.current = setTimeout(() => {
          setMapKey(Date.now());
          setMapError(null);
          setRetryCount((prev) => prev + 1);
          retryTimeoutRef.current = null;
        }, delay);
      }
    },
    [retryCount, maxRetries]
  );

  // Manual retry function for user-initiated retry
  const handleManualRetry = useCallback(() => {
    // Clear any existing timeout
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
      retryTimeoutRef.current = null;
    }

    setMapKey(Date.now());
    setMapError(null);
    setRetryCount(0); // Reset retry count on manual retry
  }, []);

  // Reset retry count when properties change
  useEffect(() => {
    setRetryCount(0);
  }, [properties]);

  // Clean up timeouts on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  if (loading) {
    return <MapSkeleton />;
  }

  // Convert properties for the map component with enhanced validation
  const mapProperties = properties.map((property) => ({
    id: property.id,
    name: property.title,
    description: property.description,
    location: property.location,
    coordinates:
      property.latitude &&
      property.longitude &&
      !isNaN(Number(property.latitude)) &&
      !isNaN(Number(property.longitude))
        ? ([Number(property.latitude), Number(property.longitude)] as [
            number,
            number
          ])
        : ([15.5527, 48.5164] as [number, number]), // Yemen's coordinates as fallback
    featured: property.featured,
    beds: property.bedrooms,
    baths: property.bathrooms,
    pricePerMonth: property.price,
    images:
      property.images?.map((img) => img.image_url) ||
      ([property.primaryImage].filter(Boolean) as string[]),
  }));

  // Handler to convert between property types
  const handlePropertySelect = (mapProperty: any | null) => {
    if (!mapProperty) {
      onPropertySelect(null);
      return;
    }

    // Find the original property that matches this ID
    const originalProperty = properties.find((p) => p.id === mapProperty.id);
    onPropertySelect(originalProperty || null);
  };

  return (
    <div className="h-full w-full transition-all duration-300 overflow-hidden">
      <div className="w-full h-full rounded-lg overflow-hidden relative bg-muted/20 shadow-sm">
        {mapError ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm z-10 animate-in fade-in duration-200">
            <div className="bg-card border border-destructive/20 text-foreground p-6 rounded-xl max-w-md shadow-lg">
              <div className="flex items-center gap-3 mb-3 text-destructive">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="flex-shrink-0"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
                <p className="font-semibold text-lg">Map Error</p>
              </div>
              <p className="text-sm text-muted-foreground mb-4">{mapError}</p>
              {retryCount >= maxRetries ? (
                <>
                  <p className="text-sm mb-4">
                    Automatic retry failed. Please try manually:
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full gap-2"
                    onClick={handleManualRetry}
                  >
                    <RefreshCw className="h-4 w-4" />
                    Retry Loading Map
                  </Button>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent"></div>
                  <p className="text-sm">Reloading map automatically...</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          <LeafletMap
            key={mapKey}
            properties={mapProperties}
            selectedProperty={
              selectedProperty
                ? {
                    id: selectedProperty.id,
                    name: selectedProperty.title,
                    description: selectedProperty.description,
                    location: selectedProperty.location,
                    coordinates:
                      selectedProperty.latitude &&
                      selectedProperty.longitude &&
                      !isNaN(Number(selectedProperty.latitude)) &&
                      !isNaN(Number(selectedProperty.longitude))
                        ? ([
                            Number(selectedProperty.latitude),
                            Number(selectedProperty.longitude),
                          ] as [number, number])
                        : ([15.5527, 48.5164] as [number, number]), // Yemen's coordinates as fallback
                    featured: selectedProperty.featured,
                    beds: selectedProperty.bedrooms,
                    baths: selectedProperty.bathrooms,
                    pricePerMonth: selectedProperty.price,
                    images:
                      selectedProperty.images?.map((img) => img.image_url) ||
                      ([selectedProperty.primaryImage].filter(
                        Boolean
                      ) as string[]),
                  }
                : null
            }
            onPropertySelect={handlePropertySelect}
            onError={handleMapError}
          />
        )}
      </div>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="h-full w-full bg-muted/20 rounded-lg flex items-center justify-center border border-border/10">
      <div className="text-center space-y-3 bg-card/80 py-6 px-8 rounded-xl shadow-sm border border-border/10">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary/30 border-t-primary mx-auto"></div>
        <Skeleton className="h-5 w-40 mx-auto" />
        <p className="text-muted-foreground text-sm">Loading map of Yemen...</p>
      </div>
    </div>
  );
}
