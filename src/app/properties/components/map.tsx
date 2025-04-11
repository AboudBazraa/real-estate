import React, { useCallback, useState, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  InfoWindow,
  Circle,
  OverlayView,
} from "@react-google-maps/api";

interface Location {
  id: string;
  lat: number;
  lng: number;
  price: number;
}

interface PriceMarker {
  position: google.maps.LatLng | google.maps.LatLngLiteral;
  price: string;
  count?: number;
}

interface MapProps {
  locations: Location[];
  mapType: string;
  showPriceMarkers?: boolean;
  center?: google.maps.LatLngLiteral;
  defaultZoom?: number;
  darkMode?: boolean;
  showBoundaries?: boolean;
  onSelectProperty?: (id: string) => void;
}

const containerStyle = {
  width: "100%",
  height: "100%",
};

// Default center (Sana'a, Yemen)
const defaultCenter = {
  lat: 15.3694,
  lng: 44.191,
};

// Generate price markers based on locations
const generatePriceMarkers = (locations: Location[]): PriceMarker[] => {
  // Group nearby locations to avoid cluttering
  const groupedLocations: { [key: string]: Location[] } = {};

  locations.forEach((location) => {
    // Create a grid key based on truncated coordinates to group nearby locations
    const gridKey = `${Math.floor(location.lat * 50) / 50}_${
      Math.floor(location.lng * 50) / 50
    }`;

    if (!groupedLocations[gridKey]) {
      groupedLocations[gridKey] = [];
    }

    groupedLocations[gridKey].push(location);
  });

  // Create price markers from grouped locations
  return Object.values(groupedLocations).map((locationGroup) => {
    const avgLat =
      locationGroup.reduce((sum, loc) => sum + loc.lat, 0) /
      locationGroup.length;
    const avgLng =
      locationGroup.reduce((sum, loc) => sum + loc.lng, 0) /
      locationGroup.length;

    // The prices should be formatted to match the image (e.g. $1.9K, $700K, etc.)
    let priceLabel: string;
    if (locationGroup.length === 1) {
      priceLabel = formatPriceForDisplay(locationGroup[0].price);
    } else {
      const minPrice = Math.min(...locationGroup.map((loc) => loc.price));
      const maxPrice = Math.max(...locationGroup.map((loc) => loc.price));

      if (minPrice === maxPrice) {
        priceLabel = formatPriceForDisplay(minPrice);
      } else {
        priceLabel = `${formatPriceForDisplay(
          minPrice
        )}-${formatPriceForDisplay(maxPrice)}`;
      }
    }

    return {
      position: { lat: avgLat, lng: avgLng },
      price: priceLabel,
      count: locationGroup.length,
    };
  });
};

// Helper function to format prices like in the image
function formatPriceForDisplay(price: number): string {
  if (price >= 1000000) {
    return `$${(price / 1000000).toFixed(1)}M`;
  } else if (price >= 1000) {
    return `$${(price / 1000).toFixed(price % 1000 === 0 ? 0 : 1)}K`;
  } else {
    return `$${price}`;
  }
}

// Custom styled price marker to match the image
const PriceMarker = (props: {
  position: google.maps.LatLngLiteral | google.maps.LatLng;
  price: number;
  id: string;
  count?: number;
  onClick: (id: string) => void;
}) => {
  // Format price display
  const displayPrice = () => {
    if (props.price >= 1000000) {
      return `$${(props.price / 1000000).toFixed(1)}M`;
    } else if (props.price >= 1000) {
      return `$${(props.price / 1000).toFixed(0)}K`;
    } else {
      return `$${props.price}`;
    }
  };

  // Determine class colors based on price range
  const getPriceClass = () => {
    if (props.price > 200000) return "bg-black text-white";
    if (props.price > 100000) return "bg-black text-white";
    if (props.price > 50000)
      return "bg-white border border-gray-300 text-black";
    return "bg-white border border-gray-300 text-black";
  };

  return (
    <OverlayView
      position={props.position}
      mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
    >
      <div
        onClick={() => props.onClick(props.id)}
        className={`${getPriceClass()} px-2 py-0.5 rounded-full shadow-md cursor-pointer text-sm font-medium hover:scale-105 transition-transform flex items-center justify-center`}
        style={{ minWidth: "60px", textAlign: "center" }}
      >
        {displayPrice()}
        {props.count && props.count > 1 && (
          <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
            {props.count}
          </div>
        )}
      </div>
    </OverlayView>
  );
};

function Map({
  locations,
  mapType,
  showPriceMarkers = true,
  center = defaultCenter,
  defaultZoom = 10,
  darkMode = false,
  showBoundaries = true,
  onSelectProperty = (id: string) => {},
}: MapProps & { onSelectProperty?: (id: string) => void }) {
  const [selectedMarker, setSelectedMarker] = useState<string | null>(null);
  const [priceMarkers, setPriceMarkers] = useState<PriceMarker[]>([]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

  const { isLoaded } = useJsApiLoader({
    id: `google-map-script-${apiKey}`,
    googleMapsApiKey: apiKey,
  });

  // Generate price markers when locations change
  React.useEffect(() => {
    setPriceMarkers(generatePriceMarkers(locations));
  }, [locations]);

  const onLoad = useCallback(
    function callback(map: google.maps.Map) {
      // Auto-fit bounds to show all markers
      if (window.google && locations.length > 0) {
        const bounds = new window.google.maps.LatLngBounds();

        locations.forEach((location) => {
          bounds.extend(
            new window.google.maps.LatLng(location.lat, location.lng)
          );
        });

        map.fitBounds(bounds);

        // If there's only one marker or if bounds are too small, set to default zoom
        if (locations.length <= 1 || (map.getZoom?.() ?? 0) > 14) {
          map.setZoom(defaultZoom);
          map.setCenter(center);
        }
      } else {
        // If no locations, just set center and zoom
        map.setZoom(defaultZoom);
        map.setCenter(center);
      }
    },
    [locations, center, defaultZoom]
  );

  const onUnmount = useCallback(function callback(map: google.maps.Map) {
    // No need to set map to null here
  }, []);

  // Handle marker click by passing to parent component
  const handleMarkerClick = (markerId: string) => {
    setSelectedMarker(markerId);
    onSelectProperty(markerId);
  };

  const handleInfoWindowClose = () => {
    setSelectedMarker(null);
  };

  // Define dark mode styles for Google Maps
  const darkModeStyles = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
      featureType: "administrative.locality",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "poi.park",
      elementType: "geometry",
      stylers: [{ color: "#263c3f" }],
    },
    {
      featureType: "poi.park",
      elementType: "labels.text.fill",
      stylers: [{ color: "#6b9a76" }],
    },
    {
      featureType: "road",
      elementType: "geometry",
      stylers: [{ color: "#38414e" }],
    },
    {
      featureType: "road",
      elementType: "geometry.stroke",
      stylers: [{ color: "#212a37" }],
    },
    {
      featureType: "road",
      elementType: "labels.text.fill",
      stylers: [{ color: "#9ca5b3" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry",
      stylers: [{ color: "#746855" }],
    },
    {
      featureType: "road.highway",
      elementType: "geometry.stroke",
      stylers: [{ color: "#1f2835" }],
    },
    {
      featureType: "road.highway",
      elementType: "labels.text.fill",
      stylers: [{ color: "#f3d19c" }],
    },
    {
      featureType: "transit",
      elementType: "geometry",
      stylers: [{ color: "#2f3948" }],
    },
    {
      featureType: "transit.station",
      elementType: "labels.text.fill",
      stylers: [{ color: "#d59563" }],
    },
    {
      featureType: "water",
      elementType: "geometry",
      stylers: [{ color: "#17263c" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.fill",
      stylers: [{ color: "#515c6d" }],
    },
    {
      featureType: "water",
      elementType: "labels.text.stroke",
      stylers: [{ color: "#17263c" }],
    },
  ];

  // Add a clear circle for the region
  const RegionCircle = () => {
    return (
      <Circle
        center={center}
        radius={30000}
        options={{
          fillColor: "#10b981",
          fillOpacity: 0.05,
          strokeColor: "#10b981",
          strokeOpacity: 0.8,
          strokeWeight: 2,
        }}
      />
    );
  };

  // Combine base styles with conditional dark mode styles
  const mapStyles = [
    {
      featureType: "poi",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    {
      featureType: "transit",
      elementType: "labels",
      stylers: [{ visibility: "off" }],
    },
    ...(darkMode ? darkModeStyles : []),
  ];

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      options={{
        mapTypeId: mapType as google.maps.MapTypeId,
        styles: darkMode ? darkModeStyles : undefined,
        disableDefaultUI: false,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
      }}
      onLoad={onLoad}
      onUnmount={onUnmount}
    >
      {/* Region circle - only show if boundaries are enabled */}
      {showBoundaries && <RegionCircle />}

      {/* Property markers with price tags */}
      {isLoaded &&
        showPriceMarkers &&
        locations.map((location) => (
          <PriceMarker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            price={location.price}
            id={location.id}
            onClick={handleMarkerClick}
          />
        ))}

      {/* Small dot markers under price tags */}
      {locations.map((location) => (
        <Marker
          key={`dot-${location.id}`}
          position={{ lat: location.lat, lng: location.lng }}
          onClick={() => handleMarkerClick(location.id)}
          icon={{
            url: "/images/map-marker.svg",
            scaledSize: new window.google.maps.Size(15, 15),
          }}
          zIndex={1}
        />
      ))}

      {/* Info window for selected marker */}
      {selectedMarker && (
        <InfoWindow
          position={{
            lat: locations.find((loc) => loc.id === selectedMarker)!.lat,
            lng: locations.find((loc) => loc.id === selectedMarker)!.lng,
          }}
          onCloseClick={handleInfoWindowClose}
        >
          <div className="p-3 min-w-[200px]">
            <h3 className="font-semibold text-gray-900 mb-2">
              Property #{selectedMarker}
            </h3>
            <p className="text-emerald-600 font-bold text-lg mb-2">
              {locations
                .find((loc) => loc.id === selectedMarker)!
                .price.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
            </p>
            <button
              onClick={() => onSelectProperty(selectedMarker)}
              className="w-full mt-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded text-sm font-medium"
            >
              View Details
            </button>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  ) : (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <p className="text-gray-500 dark:text-gray-400">Loading map...</p>
    </div>
  );
}

export default React.memo(Map);
