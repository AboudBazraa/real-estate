"use client";

import { useEffect, useMemo, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { formatCurrency } from "@/shared/lib/utils";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";
// Yemen's coordinates
const YEMEN_CENTER: [number, number] = [15.5527, 48.5164];
const YEMEN_ZOOM = 7;

// Define the property type expected by the map component
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

interface MapComponentProps {
  properties: MapProperty[];
}

export default function MapComponent({ properties }: MapComponentProps) {
  // Use Yemen as default center, or calculate based on properties if available
  const mapCenter = useMemo(() => {
    if (!properties || properties.length === 0) {
      return YEMEN_CENTER;
    }

    // If properties exist, calculate their center but ensure we're still in Yemen region
    const sum = properties.reduce(
      (acc, property) => {
        return [
          acc[0] + property.coordinates[0],
          acc[1] + property.coordinates[1],
        ];
      },
      [0, 0]
    );

    const calculatedCenter = [
      sum[0] / properties.length,
      sum[1] / properties.length,
    ] as [number, number];

    // Check if calculated center is too far from Yemen
    const distance = Math.sqrt(
      Math.pow(calculatedCenter[0] - YEMEN_CENTER[0], 2) +
        Math.pow(calculatedCenter[1] - YEMEN_CENTER[1], 2)
    );

    // If too far (more than ~500km), use Yemen center
    return distance > 5 ? YEMEN_CENTER : calculatedCenter;
  }, [properties]);

  return (
    <MapContainer
      center={mapCenter}
      zoom={YEMEN_ZOOM}
      style={{ height: "100%", width: "100%" }}
      className="z-0 rounded-lg shadow-sm"
      zoomControl={false} // Move zoom control to right side
      key={properties.length} // Add key to force re-render when properties change
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <MapMarkers properties={properties} />
      <MapBoundsUpdater properties={properties} />
      <YemenFocus />
      <MapControls />
    </MapContainer>
  );
}

// Component to ensure map stays focused on Yemen
function YemenFocus() {
  const map = useMap();
  const initializedRef = useRef(false);

  useEffect(() => {
    // Use whenReady event to ensure map is fully initialized
    if (!initializedRef.current && map) {
      map.whenReady(() => {
        try {
          // Set initial view to Yemen
          map.setView(YEMEN_CENTER, YEMEN_ZOOM);
          initializedRef.current = true;

          // Add event listener to prevent zooming out too far
          const zoomHandler = () => {
            if (map.getZoom() < 5) {
              map.setZoom(5);
            }
          };
          map.on("zoom", zoomHandler);

          // Add event listener to keep map within Yemen region
          const moveEndHandler = () => {
            try {
              const center = map.getCenter();
              if (center) {
                const distance = Math.sqrt(
                  Math.pow(center.lat - YEMEN_CENTER[0], 2) +
                    Math.pow(center.lng - YEMEN_CENTER[1], 2)
                );

                // If too far from Yemen (more than ~800km), bring back
                if (distance > 8) {
                  map.panTo(YEMEN_CENTER, { animate: true, duration: 1 });
                }
              }
            } catch (error) {
              console.error("Error in moveend handler:", error);
            }
          };
          map.on("moveend", moveEndHandler);

          // Clean up event listeners on unmount
          return () => {
            map.off("zoom", zoomHandler);
            map.off("moveend", moveEndHandler);
          };
        } catch (error) {
          console.error("Error initializing map focus:", error);
        }
      });
    }
  }, [map]);

  return null;
}

// Move zoom controls to right side
function MapControls() {
  const map = useMap();

  useEffect(() => {
    async function setupControls() {
      try {
        // Check if zoomControl exists before trying to remove it
        if (map.zoomControl) {
          map.zoomControl.remove();
        }

        // Add zoom control to the right side
        const L = await import("leaflet");
        L.control.zoom({ position: "topright" }).addTo(map);
      } catch (error) {
        console.error("Error setting up map controls:", error);
      }
    }

    setupControls();
  }, [map]);

  return null;
}

// Separate component for markers to handle client-side icon creation
function MapMarkers({ properties }: { properties: MapProperty[] }) {
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
            const img = new window.Image();
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

        if (iconLoaded) {
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

          // Only apply if component is still mounted
          if (mounted) {
            // Make this icon available globally for all markers
            L.Marker.prototype.options.icon = customIcon;
          }
        } else {
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
            <div className="property-popup w-96">
              <Card className="border-0 shadow-none">
                <CardContent className="px-2 space-x-3 flex gap-2 justify-between items-center">
                  <div className="relative aspect-[3/2] w-24 overflow-hidden rounded-md">
                    <Image
                      src={
                        property.images[0] ||
                        "/placeholder.svg?height=600&width=800"
                      }
                      alt={property.name}
                      fill
                      className="object-cover w-full h-full"
                    />
                    {property.featured && (
                      <Badge className="absolute top-2 left-2 bg-primary">
                        Featured
                      </Badge>
                    )}
                  </div>

                  <div>
                    <h4 className="font-medium text-sm">{property.name}</h4>
                    <div className="text-xs text-muted-foreground mt-1">
                      {property.location}, Yemen
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {property.beds} bed{property.beds !== 1 ? "s" : ""} •{" "}
                      {property.baths} bath
                      {property.baths !== 1 ? "s" : ""}
                    </div>
                  </div>

                  <div className="flex flex-col justify-between items-center">
                    <Badge
                      variant="outline"
                      className="text-md px-4 py-1 font-semibold"
                    >
                      {formatCurrency(property.pricePerMonth)}/mo
                    </Badge>
                    <Button
                      asChild
                      size="sm"
                      className="w-28 mt-3 gap-1 rounded-xl text-white hover:bg-primary"
                    >
                      <Link
                        href={`/property/${property.id}`}
                        className="hover:bg-zinc-800 text-xs font-semibold "
                      >
                        <p className="text-xs font-semibold text-white">
                          View details
                        </p>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>
                    </Button>
                  </div>
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
    async function updateBounds() {
      if (!map || !properties.length) {
        return;
      }

      // Wait for map to be ready
      map.whenReady(async () => {
        try {
          // Use dynamic import instead of require
          const L = await import("leaflet");

          // Create bounds using the imported Leaflet
          const bounds = L.latLngBounds([]);

          // Add each property to bounds
          properties.forEach((property) => {
            if (property.coordinates) {
              bounds.extend(property.coordinates);
            }
          });

          // Only fit bounds if we have valid bounds
          if (bounds.isValid()) {
            // Add padding and fit bounds
            map.fitBounds(bounds, {
              padding: [50, 50],
              maxZoom: 12, // Don't zoom in too far
            });

            // Ensure we're not too far from Yemen after fitting bounds
            try {
              const center = map.getCenter();
              if (center) {
                const distance = Math.sqrt(
                  Math.pow(center.lat - YEMEN_CENTER[0], 2) +
                    Math.pow(center.lng - YEMEN_CENTER[1], 2)
                );

                // If too far from Yemen, reset view
                if (distance > 8) {
                  map.setView(YEMEN_CENTER, YEMEN_ZOOM);
                }
              }
            } catch (error) {
              console.error("Error checking map center:", error);
              map.setView(YEMEN_CENTER, YEMEN_ZOOM);
            }
          } else {
            // No valid bounds, center on Yemen
            map.setView(YEMEN_CENTER, YEMEN_ZOOM);
          }
        } catch (error) {
          console.error("Error updating map bounds:", error);
          // Fallback to Yemen center
          if (map) {
            map.setView(YEMEN_CENTER, YEMEN_ZOOM);
          }
        }
      });
    }

    updateBounds();

    // Clean up function
    return () => {
      // Any cleanup needed
    };
  }, [map, properties]);

  return null;
}
