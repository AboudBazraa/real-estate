"use client";

import { useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Property } from "@/shared/hooks/useProperties";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { formatCurrency } from "@/shared/lib/utils";
import Link from "next/link";

// UI-specific property type for the map
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

interface LeafletMapProps {
  properties: Property[];
}

export default function LeafletMap({ properties }: LeafletMapProps) {
  // Transform the database properties into UI-friendly properties
  const uiProperties: MapProperty[] = properties.map((property) => ({
    id: property.id,
    name: property.title,
    description: property.description,
    location: property.location,
    coordinates:
      property.latitude && property.longitude
        ? ([property.latitude, property.longitude] as [number, number])
        : ([25.7617, -80.1918] as [number, number]), // Default to Miami
    featured: property.featured,
    beds: property.bedrooms,
    baths: property.bathrooms,
    pricePerMonth: property.price,
    images:
      property.images?.map((img) => img.image_url) ||
      ([property.primaryImage].filter(Boolean) as string[]),
  }));

  // Calculate map center based on properties
  const mapCenter = useMemo(() => {
    if (!uiProperties || uiProperties.length === 0) {
      return [25.7617, -80.1918] as [number, number]; // Default to Miami
    }

    // Calculate the average of all property coordinates
    const sum = uiProperties.reduce(
      (acc, property) => {
        return [
          acc[0] + property.coordinates[0],
          acc[1] + property.coordinates[1],
        ];
      },
      [0, 0]
    );

    return [sum[0] / uiProperties.length, sum[1] / uiProperties.length] as [
      number,
      number
    ];
  }, [uiProperties]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={13}
      style={{ height: "100%", width: "100%" }}
      className="z-0"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <LeafletMarkers properties={uiProperties} />
      <MapBoundsUpdater properties={uiProperties} />
    </MapContainer>
  );
}

// Separate component for markers to handle client-side icon creation
function LeafletMarkers({ properties }: { properties: MapProperty[] }) {
  // Create custom icon using homemark.svg
  useEffect(() => {
    let mounted = true;

    async function setupCustomIcon() {
      if (!mounted) return;

      try {
        const L = await import("leaflet");

        // Make sure the image is fully loaded before creating the icon
        const preloadImage = (src: string): Promise<boolean> => {
          return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => {
              console.error(`Failed to load image: ${src}`);
              resolve(false);
            };
            img.src = src;
          });
        };

        // Preload the icon image
        const iconLoaded = await preloadImage("/homemark.svg");

        if (iconLoaded && mounted) {
          // Create custom icon using homemark.svg
          const customIcon = L.icon({
            iconUrl: "/homemark.svg",
            iconSize: [24, 24],
            iconAnchor: [12, 24],
            popupAnchor: [0, -24],
            // Add shadow URL with a transparent pixel if needed
            shadowUrl:
              "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7",
            shadowSize: [0, 0],
          });

          // Make this icon available globally for all markers
          L.Marker.prototype.options.icon = customIcon;
        } else if (mounted) {
          // Fallback to default marker
          console.warn("Using default marker: custom icon failed to load");
        }
      } catch (error) {
        console.error("Error setting up custom marker:", error);
      }
    }

    setupCustomIcon();

    // Cleanup function
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <>
      {properties.map((property) => (
        <Marker key={property.id} position={property.coordinates}>
          <Popup>
            <div className="w-60">
              <Card className="border-0 shadow-none">
                <CardContent className="p-2 space-y-2">
                  <div className="font-medium">{property.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {property.location}
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge variant="outline">
                      {formatCurrency(property.pricePerMonth)}/mo
                    </Badge>
                    <div className="text-xs text-muted-foreground">
                      {property.beds} bed{property.beds !== 1 ? "s" : ""} •{" "}
                      {property.baths} bath
                      {property.baths !== 1 ? "s" : ""}
                    </div>
                  </div>
                  <Link
                    href={`/property/${property.id}`}
                    className="text-xs text-primary hover:underline block mt-2"
                  >
                    View details
                  </Link>
                </CardContent>
              </Card>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

// Component to update map bounds when properties change
function MapBoundsUpdater({ properties }: { properties: MapProperty[] }) {
  const map = useMap();

  useEffect(() => {
    if (!map || !properties.length) {
      return;
    }

    // Wait for map to be ready
    map.whenReady(() => {
      try {
        // Create bounds
        const bounds = map.getBounds();

        // Add each property to bounds
        properties.forEach((property) => {
          if (property.coordinates) {
            bounds.extend(property.coordinates);
          }
        });

        // Only fit bounds if we have valid bounds with properties
        if (bounds.isValid() && properties.length > 0) {
          map.fitBounds(bounds, { padding: [50, 50] });
        }
      } catch (error) {
        console.error("Error updating map bounds:", error);
      }
    });

    // Clean up function
    return () => {
      // Any cleanup needed
    };
  }, [map, properties]);

  return null;
}
