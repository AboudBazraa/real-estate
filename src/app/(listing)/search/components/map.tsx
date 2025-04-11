"use client";

import { useProperties } from "@/shared/hooks/useProperties";
import type { PropertyFilters } from "@/shared/hooks/useProperties";
import { Skeleton } from "@/shared/components/ui/skeleton";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

// Import leaflet CSS
import "leaflet/dist/leaflet.css";

// Add custom styles for map popups
import "./map-styles.css";

// Define the map property type
interface MapProperty {
  id: string;
  name: string;
  description: string;
  location: string;
  coordinates: [number, number];
  featured: boolean;
  beds: number;
  baths: number;
  pricePerMonth: number;
  images: string[];
}

// Dynamically import the LeafletMap component with no SSR
const LeafletMap = dynamic(() => import("./map-component"), {
  ssr: false,
  loading: () => <MapSkeleton />,
});

interface MapProps {
  filters: PropertyFilters;
}

export default function Map({ filters }: MapProps) {
  const {
    fetchProperties,
    properties: fetchedProperties,
    loading,
  } = useProperties();
  const [properties, setProperties] = useState<MapProperty[]>([]);

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties(0, 100, filters);
  }, [filters, fetchProperties]);

  // Transform properties for map display
  useEffect(() => {
    if (!fetchedProperties) return;

    const transformedProperties = fetchedProperties.map((property) => ({
      id: property.id,
      name: property.title,
      description: property.description,
      location: property.location,
      coordinates:
        property.latitude && property.longitude
          ? ([property.latitude, property.longitude] as [number, number])
          : ([15.5527, 48.5164] as [number, number]), // Yemen's coordinates as fallback
      featured: property.featured,
      beds: property.bedrooms,
      baths: property.bathrooms,
      pricePerMonth: property.price,
      images:
        property.images?.map((img) => img.image_url) ||
        ([property.primaryImage].filter(Boolean) as string[]),
    }));

    setProperties(transformedProperties);
  }, [fetchedProperties]);

  if (loading) {
    return <MapSkeleton />;
  }

  return (
    <div className="w-full h-full rounded-lg overflow-hidden relative">
      <LeafletMap properties={properties} />
      <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium shadow-sm flex items-center">
        <MapPin className="h-3.5 w-3.5 mr-1.5 text-primary" />
        Yemen Real Estate
      </div>
    </div>
  );
}

function MapSkeleton() {
  return (
    <div className="h-full w-full bg-muted/20 rounded-lg flex items-center justify-center">
      <div className="text-center space-y-3">
        <Skeleton className="h-10 w-10 rounded-full mx-auto" />
        <Skeleton className="h-4 w-32 mx-auto" />
        <p className="text-muted-foreground text-sm">Loading map of Yemen...</p>
      </div>
    </div>
  );
}
