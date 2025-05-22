"use client";

import React, {
  useEffect,
  useState,
  useRef,
  useMemo,
  useCallback,
} from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { X, MapPin, Home, ExternalLink, Loader, MapIcon } from "lucide-react";
import { formatCurrency } from "@/shared/lib/utils";
import Image from "next/image";
import { Property } from "@/shared/types/property";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Badge } from "@/shared/components/ui/badge";

// Fix Leaflet icon issues in Next.js
const fixLeafletIcon = () => {
  // Only fix in client environment and only once
  if (typeof window !== "undefined" && typeof L !== "undefined") {
    delete (L.Icon.Default.prototype as any)._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
      iconRetinaUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
      shadowUrl:
        "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    });
  }
};

// Initialize Leaflet icons immediately
if (typeof window !== "undefined") {
  fixLeafletIcon();
}

// Define types
type MapBounds = [[number, number], [number, number]]; // [[south, west], [north, east]]

interface PropertyMapDialogProps {
  properties: Property[];
  selectedProperty: Property | null;
  onPropertySelect: (property: Property | null) => void;
  onClose: () => void;
  onBoundsChange?: (bounds: MapBounds) => void;
  onViewDetails?: (propertyId: string) => void;
}

// Helper component to track map bounds with debounce
function BoundsTracker({
  onChange,
}: {
  onChange?: (bounds: MapBounds) => void;
}) {
  const map = useMap();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!map || !onChange) return;

    // Clear any existing timeout on unmount
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!map || !onChange) return;

    const handleMoveEnd = () => {
      // Clear previous timeout if it exists
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Create a new debounced update
      timeoutRef.current = setTimeout(() => {
        const bounds = map.getBounds();
        const sw = bounds.getSouthWest();
        const ne = bounds.getNorthEast();

        // Format as [[south, west], [north, east]]
        const mapBounds: MapBounds = [
          [sw.lat, sw.lng],
          [ne.lat, ne.lng],
        ];

        onChange(mapBounds);
      }, 300); // Debounce by 300ms
    };

    // Set initial bounds after map is ready
    if (map.getZoom() !== undefined) {
      handleMoveEnd();
    }

    // Add event listener
    map.on("moveend", handleMoveEnd);

    // Cleanup
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      map.off("moveend", handleMoveEnd);
    };
  }, [map, onChange]);

  return null;
}

// Custom marker component with memoization
const PropertyMarker = React.memo(function PropertyMarker({
  property,
  isSelected,
  onSelect,
}: {
  property: Property;
  isSelected: boolean;
  onSelect: (property: Property) => void;
}) {
  // Only render if we have valid coordinates
  if (
    !property.latitude ||
    !property.longitude ||
    isNaN(property.latitude) ||
    isNaN(property.longitude)
  )
    return null;

  // Create custom icon
  const markerIcon = L.divIcon({
    className: `custom-marker ${isSelected ? "marker-selected" : ""}`,
    html: `<div class="${
      isSelected ? "bg-primary" : "bg-blue-600"
    } p-1 rounded-full shadow-lg flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" 
              stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
           </div>`,
    iconSize: [28, 28],
    iconAnchor: [14, 28],
    popupAnchor: [0, -25],
  });

  // Use event handler that doesn't capture the entire props closure
  const handleClick = () => {
    onSelect(property);
  };

  return (
    <Marker
      position={[property.latitude, property.longitude]}
      icon={markerIcon}
      eventHandlers={{
        click: handleClick,
      }}
    >
      <Popup>
        <div className="property-popup w-64">
          <div className="relative aspect-[16/9] w-full bg-muted overflow-hidden rounded-t-md">
            {property.primaryImage ? (
              <Image
                src={property.primaryImage}
                alt={property.title}
                fill
                className="object-cover hover:scale-105 transition-transform"
                sizes="(max-width: 768px) 100vw, 300px"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted">
                <Home className="h-8 w-8 text-muted-foreground" />
              </div>
            )}
          </div>

          <div className="p-3 space-y-2">
            <h3 className="font-medium text-sm line-clamp-1">
              {property.title}
            </h3>
            <div className="flex items-center text-xs text-muted-foreground">
              <MapPin className="h-3 w-3 mr-1" />
              <span className="truncate">{property.location}</span>
            </div>
            <div className="flex justify-between items-center">
              <p className="font-semibold">{formatCurrency(property.price)}</p>
              <p className="text-xs">
                {property.bedrooms} bed · {property.bathrooms} bath
              </p>
            </div>
          </div>
        </div>
      </Popup>
    </Marker>
  );
});

// Custom zoom controls that have access to the map instance
function ZoomControls() {
  const map = useMap();

  return (
    <div className="absolute left-4 top-20 z-[1000]">
      <div className="flex flex-col gap-2">
        <Button
          size="sm"
          className="h-8 w-8 rounded-full"
          onClick={() => map.zoomIn()}
        >
          +
        </Button>
        <Button
          size="sm"
          className="h-8 w-8 rounded-full"
          onClick={() => map.zoomOut()}
        >
          -
        </Button>
      </div>
    </div>
  );
}

export default function PropertyMapDialog({
  properties,
  selectedProperty,
  onPropertySelect,
  onClose,
  onBoundsChange,
  onViewDetails,
}: PropertyMapDialogProps) {
  const [isMapReady, setIsMapReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const didInitRef = useRef(false);
  const selectedIdRef = useRef<string | null>(null);
  const [visiblePropertyCount, setVisiblePropertyCount] = useState(0);

  // Prevent unnecessary re-renders when property selection changes
  useEffect(() => {
    selectedIdRef.current = selectedProperty?.id || null;
  }, [selectedProperty?.id]);

  // Calculate map center based on properties or use default Yemen center - memoized
  const mapCenter = useMemo(() => {
    // Default to Yemen center
    const defaultCenter: [number, number] = [15.5527, 48.5164];

    if (!properties || properties.length === 0) return defaultCenter;

    // If we have a selected property with coordinates, center on it
    if (selectedProperty?.latitude && selectedProperty?.longitude) {
      return [selectedProperty.latitude, selectedProperty.longitude] as [
        number,
        number
      ];
    }

    // Filter properties with valid coordinates
    const validProperties = properties.filter(
      (p) =>
        p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)
    );

    if (validProperties.length === 0) return defaultCenter;

    // Calculate average coordinates
    const avgLat =
      validProperties.reduce((sum, p) => sum + p.latitude!, 0) /
      validProperties.length;
    const avgLng =
      validProperties.reduce((sum, p) => sum + p.longitude!, 0) /
      validProperties.length;

    return [avgLat, avgLng] as [number, number];
  }, [properties, selectedProperty?.latitude, selectedProperty?.longitude]);

  // Filter valid properties and count them
  const validProperties = useMemo(() => {
    const filtered = properties.filter(
      (p) =>
        p.latitude && p.longitude && !isNaN(p.latitude) && !isNaN(p.longitude)
    );

    // Update visible property count
    setVisiblePropertyCount(filtered.length);

    return filtered;
  }, [properties]);

  // Memoize property markers
  const propertyMarkers = useMemo(() => {
    return validProperties.map((property) => (
      <PropertyMarker
        key={property.id}
        property={property}
        isSelected={selectedProperty?.id === property.id}
        onSelect={onPropertySelect}
      />
    ));
  }, [validProperties, selectedProperty?.id, onPropertySelect]);

  // Handle map ready state
  const handleMapReady = useCallback(() => {
    setIsMapReady(true);
    // Add a small delay before removing loading state for smoother UX
    setTimeout(() => setIsLoading(false), 300);
  }, []);

  // Safe property selection handler
  const handlePropertyButtonClick = useCallback(
    (propertyId: string) => {
      if (onViewDetails) {
        onViewDetails(propertyId);
      }
    },
    [onViewDetails]
  );

  // Safe close handler
  const handleClose = useCallback(() => {
    if (onClose) {
      onClose();
    }
  }, [onClose]);

  const handlePropertyClose = useCallback(() => {
    if (onPropertySelect) {
      onPropertySelect(null);
    }
  }, [onPropertySelect]);

  return (
    <Dialog open={true} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl w-[90vw] h-[80vh] p-0">
        <DialogHeader className="absolute top-0 left-0 right-0 z-10 bg-background/80 backdrop-blur-sm p-4 flex flex-row justify-between items-center">
          <div className="flex items-center gap-3">
            <DialogTitle>Property Map</DialogTitle>

            {/* Property count badge */}
            <Badge
              variant="outline"
              className="bg-background/80 gap-1.5 flex items-center py-1"
            >
              <MapIcon className="h-3.5 w-3.5" />
              <span>{visiblePropertyCount} Properties</span>
            </Badge>
          </div>

          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="w-full h-full relative">
          {/* Loading indicator */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/50 z-20">
              <div className="flex flex-col items-center gap-2">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading map...</p>
              </div>
            </div>
          )}

          {/* Property details sidebar */}
          {selectedProperty && (
            <div className="absolute right-4 top-16 bottom-4 z-10 w-72 bg-background/90 backdrop-blur-sm rounded-md shadow-lg p-4 overflow-auto">
              <div className="space-y-4">
                <div className="relative aspect-[4/3] w-full rounded-md overflow-hidden">
                  {selectedProperty.primaryImage ? (
                    <Image
                      src={selectedProperty.primaryImage}
                      alt={selectedProperty.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 300px"
                      loading="eager"
                      priority
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-muted">
                      <Home className="h-12 w-12 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h2 className="font-semibold text-lg">
                    {selectedProperty.title}
                  </h2>

                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 mr-1.5" />
                    <span>{selectedProperty.location}</span>
                  </div>

                  <p className="text-xl font-bold">
                    {formatCurrency(selectedProperty.price)}
                  </p>

                  <div className="grid grid-cols-3 gap-2 py-2">
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="font-bold">{selectedProperty.bedrooms}</p>
                      <p className="text-xs text-muted-foreground">Beds</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="font-bold">{selectedProperty.bathrooms}</p>
                      <p className="text-xs text-muted-foreground">Baths</p>
                    </div>
                    <div className="text-center p-2 bg-muted rounded">
                      <p className="font-bold">{selectedProperty.area}</p>
                      <p className="text-xs text-muted-foreground">Sqft</p>
                    </div>
                  </div>

                  <p className="text-sm line-clamp-3">
                    {selectedProperty.description}
                  </p>
                </div>

                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() =>
                      handlePropertyButtonClick(selectedProperty.id)
                    }
                    className="w-full flex items-center justify-center gap-2"
                  >
                    View Details <ExternalLink className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handlePropertyClose}
                    className="w-full"
                  >
                    Close Details
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Main map */}
          <MapContainer
            center={mapCenter}
            zoom={selectedProperty ? 15 : 10}
            className="w-full h-full"
            whenReady={handleMapReady}
            zoomControl={false} // Disable default zoom control for better UX
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {/* Add custom zoom controls */}
            <ZoomControls />

            {/* Track bounds for filtering properties - only when ready */}
            {isMapReady && onBoundsChange && (
              <BoundsTracker onChange={onBoundsChange} />
            )}

            {/* Render memoized property markers */}
            {propertyMarkers}
          </MapContainer>
        </div>
      </DialogContent>
    </Dialog>
  );
}
