"use client";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactElement,
  useCallback,
} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import type { Map as LeafletMap } from "leaflet";
import L from "leaflet";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { formatCurrency } from "@/shared/lib/utils";
import Link from "next/link";
import { Button } from "@/shared/components/ui/button";
import {
  ArrowUpRight,
  MapPin,
  Home,
  ChevronDown,
  ChevronUp,
  Expand,
  MinusSquare,
  Maximize2,
  Filter as FilterIcon,
  RefreshCw,
  Layers,
  Target,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import Image from "next/image";
import "leaflet/dist/leaflet.css";
import { cn } from "@/shared/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

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
  selectedProperty?: MapProperty | null;
  onPropertySelect?: (property: MapProperty | null) => void;
  loading?: boolean;
  onError?: (error: string) => void;
}

// Component to set the map reference when ready
function MapReadyHandler({
  onMapReady,
}: {
  onMapReady: (map: LeafletMap) => void;
}) {
  const map = useMap();

  useEffect(() => {
    if (map) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  return null;
}

export default function MapComponent({
  properties,
  selectedProperty = null,
  onPropertySelect,
  loading = false,
  onError,
}: MapComponentProps) {
  const [activeProperty, setActiveProperty] = useState<MapProperty | null>(
    selectedProperty
  );
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [map, setMap] = useState<LeafletMap | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<LeafletMap | null>(null);
  const initializationAttempted = useRef(false);

  // Use Yemen as default center, or calculate based on properties if available
  const mapCenter = useMemo(() => {
    if (!properties || properties.length === 0) {
      return YEMEN_CENTER;
    }

    // Check for valid coordinates first
    const validProperties = properties.filter(
      (property) =>
        property.coordinates &&
        Array.isArray(property.coordinates) &&
        property.coordinates.length === 2 &&
        !isNaN(property.coordinates[0]) &&
        !isNaN(property.coordinates[1])
    );

    if (validProperties.length === 0) {
      return YEMEN_CENTER;
    }

    // If properties exist, calculate their center but ensure we're still in Yemen region
    const sum = validProperties.reduce(
      (acc, property) => {
        return [
          acc[0] + property.coordinates[0],
          acc[1] + property.coordinates[1],
        ];
      },
      [0, 0]
    );

    const calculatedCenter = [
      sum[0] / validProperties.length,
      sum[1] / validProperties.length,
    ] as [number, number];

    // Check if calculated center is too far from Yemen
    const distance = Math.sqrt(
      Math.pow(calculatedCenter[0] - YEMEN_CENTER[0], 2) +
        Math.pow(calculatedCenter[1] - YEMEN_CENTER[1], 2)
    );

    // If too far (more than ~500km), use Yemen center
    return distance > 5 ? YEMEN_CENTER : calculatedCenter;
  }, [properties]);

  // Custom zoom functions
  const handleZoomIn = () => {
    if (map) {
      map.zoomIn(1);
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut(1);
    }
  };

  // Initialize map with improved error handling
  const onMapReady = (mapInstance: LeafletMap) => {
    try {
      // Check if map is already initialized to prevent duplicate initialization
      if (mapRef.current || initializationAttempted.current) {
        console.warn("Map already initialized or attempted");
        return;
      }

      initializationAttempted.current = true;

      // Validate map instance
      if (!mapInstance || typeof mapInstance.on !== "function") {
        throw new Error("Invalid map instance");
      }

      setMap(mapInstance);
      mapRef.current = mapInstance;

      // Use timeout to ensure map is rendered before proceeding
      setTimeout(() => {
        try {
          // Force map to recalculate its container size
          mapInstance.invalidateSize();
          setIsLoading(false);
        } catch (err) {
          console.error("Error during map initialization:", err);
          if (onError) onError("Map error: Unable to initialize map correctly");
        }
      }, 300);

      // Add map as part of the ref with error handling
      if (mapContainerRef.current) {
        try {
          (mapContainerRef.current as any).map = mapInstance;
        } catch (err) {
          console.error("Error attaching map to container ref:", err);
        }
      }

      // Add comprehensive error event listeners
      mapInstance.on("error", (e: any) => {
        console.error("Leaflet map error:", e);
        if (onError)
          onError("Map error occurred: " + (e.message || "Unknown error"));
      });

      // Add additional handling for tile loading errors
      mapInstance.on("tileerror", (e: any) => {
        console.warn("Tile loading error:", e);
        // Only report serious tile errors, not occasional network issues
        const tileErrorCount = (mapInstance as any)._tileErrorCount || 0;
        (mapInstance as any)._tileErrorCount = tileErrorCount + 1;

        // If more than 5 tile errors, report the issue
        if (tileErrorCount > 5 && onError) {
          onError("Map tile loading failed. Check your network connection.");
        }
      });
    } catch (err) {
      console.error("Error initializing map:", err);
      if (onError) onError("Failed to initialize map");
    }
  };

  // Handle selecting a property
  const handlePropertySelect = (property: MapProperty | null) => {
    setActiveProperty(property);
    if (onPropertySelect) {
      onPropertySelect(property);
    }

    // If the property is selected and has coordinates, center the map on it
    if (property && property.coordinates && map) {
      map.setView(property.coordinates, 12, {
        animate: true,
        duration: 1,
      });
    }
  };

  // Toggle fullscreen state
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    // Apply style changes to container
    if (mapContainerRef.current) {
      mapContainerRef.current.classList.toggle("fixed");
      mapContainerRef.current.classList.toggle("inset-0");
      mapContainerRef.current.classList.toggle("z-50");
      mapContainerRef.current.classList.toggle("rounded-none");
    }
  };

  // Toggle filter visibility
  const toggleFilter = () => {
    setIsFilterVisible(!isFilterVisible);
  };

  // Enhanced error handling at component level
  useEffect(() => {
    // Global error handler for Leaflet-related errors
    const handleWindowError = (event: ErrorEvent) => {
      // Only catch Leaflet errors
      if (
        event.message &&
        (event.message.includes("leaflet") ||
          event.message.includes("_leaflet_") ||
          event.message.includes("Cannot read properties of undefined") ||
          event.message.includes("Map container is already initialized"))
      ) {
        console.error("Caught Leaflet error:", event);
        event.preventDefault();

        // Reset map refs to allow for re-initialization
        if (
          event.message.includes("Map container is already initialized") ||
          event.message.includes("already initialized")
        ) {
          mapRef.current = null;
          initializationAttempted.current = false;
        }

        if (onError) onError("Map error: " + event.message);
      }
    };

    window.addEventListener("error", handleWindowError);
    return () => window.removeEventListener("error", handleWindowError);
  }, [onError]);

  return (
    <div
      ref={mapContainerRef}
      className="relative h-full w-full rounded-lg shadow-md overflow-hidden transition-all duration-300"
    >
      {loading && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-background/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-r-transparent"></div>
            <p className="text-sm font-medium">Loading map...</p>
          </div>
        </div>
      )}

      <MapContainer
        center={mapCenter}
        zoom={selectedProperty ? 13 : YEMEN_ZOOM}
        style={{ height: "100%", width: "100%" }}
        className="z-0 rounded-lg"
        zoomControl={false}
        whenCreated={onMapReady}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapMarkers
          properties={properties}
          activeProperty={activeProperty}
          onMarkerClick={handlePropertySelect}
        />
        {properties.length > 0 && (
          <MapBoundsUpdater properties={properties} onError={onError} />
        )}
        <YemenFocus />
        <MapReadyHandler onMapReady={onMapReady} />
      </MapContainer>

      {/* Enhanced Map Controls */}
      <TooltipProvider delayDuration={300}>
        <div className="absolute right-8 top-1/2 -translate-y-1/2 z-10 flex flex-col gap-2 bg-white/80 dark:bg-zinc-800/90 backdrop-blur-sm rounded-2xl shadow-lg p-2 border transition-all duration-300 hover:bg-white/90 dark:hover:bg-zinc-800/95">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={handleZoomIn}
              >
                <ZoomIn className="h-4 w-4 text-slate-700 dark:text-slate-200" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom In</TooltipContent>
          </Tooltip>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-700 mx-auto"></div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={handleZoomOut}
              >
                <ZoomOut className="h-4 w-4 text-slate-700 dark:text-slate-200" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Zoom Out</TooltipContent>
          </Tooltip>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-700 mx-auto"></div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-lg hover:bg-primary/10 transition-colors"
                onClick={() => {
                  if (mapRef.current) {
                    mapRef.current.setView(YEMEN_CENTER, YEMEN_ZOOM);
                  }
                }}
              >
                <Target className="h-4 w-4 text-slate-700 dark:text-slate-200" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">Reset View</TooltipContent>
          </Tooltip>

          <div className="w-full h-px bg-slate-200 dark:bg-slate-700 mx-auto"></div>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn(
                  "h-8 w-8 rounded-lg hover:bg-primary/10 transition-colors",
                  isFullscreen && "bg-primary/20 text-primary"
                )}
                onClick={toggleFullscreen}
              >
                {isFullscreen ? (
                  <MinusSquare className="h-4 w-4" />
                ) : (
                  <Maximize2 className="h-4 w-4 text-slate-700 dark:text-slate-200" />
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left">
              {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
            </TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>

      {/* Property count indicator */}

      {/* Attribution badge */}
      <div className="absolute bottom-8 left-4 z-10 bg-white/80 dark:bg-zinc-800/90 backdrop-blur-sm rounded-lg shadow-sm px-3 py-2 text-xs font-medium text-muted-foreground border border-border/30 flex items-center gap-1.5">
        <MapPin className="h-3 w-3 text-primary" />
        <span>Yemen Real Estate</span>
      </div>

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center z-20 animate-in fade-in duration-300">
          <div className="flex flex-col items-center gap-3 bg-card p-5 rounded-xl shadow-xl border border-border">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-r-transparent" />
            <p className="text-sm font-medium">Initializing map...</p>
          </div>
        </div>
      )}
    </div>
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

          // Clean up event listeners on unmount
          return () => {
            map.off("zoom", zoomHandler);
          };
        } catch (error) {
          console.error("Error initializing map focus:", error);
        }
      });
    }
  }, [map]);

  return null;
}

// Improved marker component with animations and better UI
function MapMarkers({
  properties,
  activeProperty,
  onMarkerClick,
}: {
  properties: MapProperty[];
  activeProperty: MapProperty | null;
  onMarkerClick: (property: MapProperty) => void;
}) {
  // Use useEffect to create icons client-side to avoid SSR issues
  const [mounted, setMounted] = useState(false);
  const [markers, setMarkers] = useState<ReactElement[]>([]);
  const map = useMap();

  useEffect(() => {
    setMounted(true);

    if (typeof window !== "undefined") {
      try {
        // Create markers only when client-side
        // Import directly to access TS definitions properly
        import("leaflet").then((L) => {
          const newMarkers = properties.map((property) => {
            const isActive = activeProperty?.id === property.id;

            // Create a simple marker icon with improved styling
            const houseIcon = L.divIcon({
              className: `house-marker-icon ${isActive ? "active" : ""}`,
              html: `
                <div class="marker-container ${
                  isActive ? "active" : ""
                }" style="
                  position: relative;
                  display: flex;
                  justify-content: center;
                  align-items: center;
                ">
                  <div class="marker-shadow" style="
                    position: absolute;
                    bottom: -4px;
                    width: 14px;
                    height: 4px;
                    background: rgba(0,0,0,0.3);
                    border-radius: 50%;
                    filter: blur(1px);
                    transform: ${isActive ? "scale(1.2)" : "scale(1)"};
                    transition: all 0.3s ease;
                  "></div>
                  <div class="marker-icon ${isActive ? "active" : ""}" style="
                    width: 28px;
                    height: 28px;
                    background-color: ${isActive ? "#0f56b3" : "#1a1a1a"};
                    border: 2px solid ${isActive ? "#ffffff" : "#f3f3f3"};
                    mask: url(/home-_1_.svg) no-repeat center / 18px;
                    -webkit-mask: url(/home-_1_.svg) no-repeat center / 18px;
                    border-radius: 50%;
                    transform: ${
                      isActive ? "scale(1.15) translateY(-3px)" : "scale(1)"
                    };
                    transition: transform 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
                    box-shadow: ${
                      isActive
                        ? "0 4px 8px rgba(0,0,0,0.2)"
                        : "0 2px 4px rgba(0,0,0,0.1)"
                    };
                  "></div>
                </div>
              `,
              iconSize: [28, 40],
              iconAnchor: [14, 28],
            });

            return (
              <Marker
                key={property.id}
                position={property.coordinates}
                // @ts-ignore - icon is valid but type defs don't include it
                icon={houseIcon}
                eventHandlers={{
                  click: () => {
                    onMarkerClick(property);
                    // Standard zoom behavior with native Leaflet animation
                    map.setView(
                      property.coordinates,
                      Math.max(map.getZoom(), 12),
                      { animate: true, duration: 0.5 }
                    );
                  },
                  mouseover: (e) => {
                    // Show a pulse effect on hover
                    const el = e.target.getElement();
                    if (el) {
                      const iconEl = el.querySelector(".marker-icon");
                      if (iconEl && !iconEl.classList.contains("active")) {
                        iconEl.style.transform = "scale(1.1)";
                      }
                    }
                  },
                  mouseout: (e) => {
                    // Remove pulse effect
                    const el = e.target.getElement();
                    if (el) {
                      const iconEl = el.querySelector(".marker-icon");
                      if (iconEl && !iconEl.classList.contains("active")) {
                        iconEl.style.transform = "scale(1)";
                      }
                    }
                  },
                }}
              >
                <Popup className="property-popup">
                  <Card className="border-0 shadow-lg overflow-hidden p-0 w-64 max-w-full">
                    <div className="relative aspect-video w-full overflow-hidden">
                      <Image
                        src={
                          property.images[0] ||
                          "/placeholder.svg?height=200&width=300"
                        }
                        alt={property.name}
                        fill
                        className="object-cover transition-transform duration-500 hover:scale-110"
                      />
                      {property.featured && (
                        <Badge className="absolute top-2 left-2 bg-primary text-white font-medium">
                          Featured
                        </Badge>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-3 py-2">
                        <p className="text-white font-bold text-sm">
                          ${formatCurrency(property.pricePerMonth)}/mo
                        </p>
                      </div>
                    </div>
                    <CardContent className="p-3">
                      <h3 className="font-semibold text-sm line-clamp-1">
                        {property.name}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">{property.location}</span>
                      </p>
                      <div className="flex items-center justify-between gap-2 mb-2 text-xs text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <span className="flex items-center">
                            <Home className="h-3 w-3 mr-1" />
                            {property.beds} bd
                          </span>
                          <span>•</span>
                          <span>{property.baths} ba</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <Link
                          href={`/properties/${property.id}`}
                          className="w-full"
                        >
                          <Button
                            size="sm"
                            className="w-full h-8 text-xs gap-1"
                          >
                            View Details
                            <ArrowUpRight className="h-3 w-3" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </Popup>
              </Marker>
            );
          });
          setMarkers(newMarkers);
        });
      } catch (error) {
        console.error("Error creating map markers:", error);
      }
    }
  }, [properties, activeProperty, map, onMarkerClick]);

  if (!mounted) return null;

  return <>{markers}</>;
}

// Component to update map bounds when properties change
function MapBoundsUpdater({
  properties,
  onError,
}: {
  properties: MapProperty[];
  onError?: (error: string) => void;
}) {
  const map = useMap();
  const [attemptCount, setAttemptCount] = useState(0);
  const [boundsSet, setBoundsSet] = useState(false);
  const maxAttempts = 7; // Increased from 5 for more retries
  const retryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Improved bounds setting function with better error handling
  const setBounds = useCallback(() => {
    if (!map || !properties.length || boundsSet) {
      return;
    }

    try {
      // More robust check that map is ready before continuing
      const mapInstance = map as any; // Type assertion to access internal properties
      if (
        !mapInstance._loaded ||
        !mapInstance._container ||
        !map.getContainer() ||
        typeof map.invalidateSize !== "function" ||
        !mapInstance._container.offsetWidth ||
        !mapInstance._container.offsetHeight ||
        document.hidden // Check if page is visible
      ) {
        if (attemptCount < maxAttempts) {
          // Try again with increasing delay using exponential backoff
          const delay = Math.pow(2, attemptCount) * 400;

          // Clear any existing timeout
          if (retryTimeoutRef.current) {
            clearTimeout(retryTimeoutRef.current);
          }

          retryTimeoutRef.current = setTimeout(() => {
            setAttemptCount((prev) => prev + 1);
            retryTimeoutRef.current = null;
          }, delay);
        } else if (onError) {
          // Report error after max attempts
          onError("Map initialization failed. Please try again.");
        }
        return;
      }

      // Force recalculation of map container size
      map.invalidateSize({ animate: false, pan: false, debounceMoveend: true });

      // Wait a moment after invalidating size
      setTimeout(() => {
        try {
          // Create bounds with explicit empty array
          const bounds = L.latLngBounds([]);

          // Make sure each property has valid coordinates before extending bounds
          let validCoordinatesFound = false;
          properties.forEach((property) => {
            if (
              property.coordinates &&
              Array.isArray(property.coordinates) &&
              property.coordinates.length === 2 &&
              !isNaN(property.coordinates[0]) &&
              !isNaN(property.coordinates[1]) &&
              property.coordinates[0] !== 0 &&
              property.coordinates[1] !== 0
            ) {
              bounds.extend(property.coordinates);
              validCoordinatesFound = true;
            }
          });

          // Only fit bounds if we have valid bounds
          if (validCoordinatesFound && bounds.isValid()) {
            // Add padding and use native Leaflet animations with error handling
            try {
              map.fitBounds(bounds, {
                padding: [50, 50],
                maxZoom: 12,
                animate: false, // Disable animation for more stability
                duration: 0.5,
              });
              setBoundsSet(true);
            } catch (fitError) {
              console.error("Error fitting bounds:", fitError);
              // Fallback to Yemen center on fitBounds error
              map.setView(YEMEN_CENTER, YEMEN_ZOOM, { animate: false });
              setBoundsSet(true);
            }
          } else {
            // No valid bounds, center on Yemen
            map.setView(YEMEN_CENTER, YEMEN_ZOOM, { animate: false });
            setBoundsSet(true);
          }
        } catch (innerErr) {
          console.error("Error in bounds calculation:", innerErr);
          if (onError) {
            onError("Error setting map view. Please try again.");
          }
        }
      }, 100);
    } catch (err) {
      console.error("Error updating map bounds:", err);
      if (onError) {
        onError(
          "Error updating map: " +
            (err instanceof Error ? err.message : "Unknown error")
        );
      }
      // Fallback to Yemen center
      if (map && (map as any)._loaded) {
        try {
          map.setView(YEMEN_CENTER, YEMEN_ZOOM, { animate: false });
          setBoundsSet(true);
        } catch (viewError) {
          console.error("Failed to set fallback view:", viewError);
        }
      }
    }
  }, [map, properties, attemptCount, boundsSet, maxAttempts, onError]);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    // Reset bounds set when properties change
    if (properties.length) {
      setBoundsSet(false);
      setAttemptCount(0);
    }
  }, [properties]);

  useEffect(() => {
    if (map && !boundsSet) {
      // Register one-time error handler for map
      const errorHandler = (e: any) => {
        console.error("Map error in bounds updater:", e);
        if (onError) onError("Map error occurred while updating bounds");
      };

      map.once("error", errorHandler);

      // Ensure map is actually loaded and ready
      if ((map as any)._loaded) {
        // Ensure the map container is properly sized before trying to set bounds
        map.invalidateSize({ animate: false });

        // Use a larger timeout to ensure the map is fully rendered
        setTimeout(() => {
          setBounds();
        }, 800);
      } else {
        // Wait for map load event if not loaded
        map.once("load", () => {
          setTimeout(() => {
            map.invalidateSize({ animate: false });
            setBounds();
          }, 800);
        });
      }

      return () => {
        // Clean up error handler
        map.off("error", errorHandler);
      };
    }
  }, [map, properties, setBounds, boundsSet, attemptCount, onError]);

  return null;
}
