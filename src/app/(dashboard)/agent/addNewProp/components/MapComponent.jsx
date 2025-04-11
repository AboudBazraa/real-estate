import React, { useEffect, useCallback, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
  LayersControl,
  ZoomControl,
} from "react-leaflet";
import L from "leaflet";
import { Search, Layers, MapPin, PlusSquare } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

// Fix Leaflet marker icon issue in Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

// Targeted precisely icon (for exact property location)
const preciseIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [30, 46], // Slightly larger for emphasis
  iconAnchor: [15, 46],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
  className: "precise-marker", // Added for custom styling
});

// Component to update map view when position changes
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

// Component to handle map interactions
function MapInteraction({ onPositionChange }) {
  const map = useMapEvents({
    click: (e) => {
      onPositionChange([e.latlng.lat, e.latlng.lng]);
    },
  });
  return null;
}

// Component to visualize accuracy radius
function AccuracyCircle({ center, accuracy }) {
  const map = useMap();

  useEffect(() => {
    if (!center || !accuracy) return;

    // Create circle to represent accuracy radius
    const circle = L.circle(center, {
      radius: accuracy,
      fillColor: "#3b82f6",
      fillOpacity: 0.1,
      color: "#3b82f6",
      weight: 1,
    }).addTo(map);

    return () => {
      map.removeLayer(circle);
    };
  }, [map, center, accuracy]);

  return null;
}

export default function MapComponent({
  position,
  height = "400px",
  onPositionChange = () => {},
  isDraggable = true,
  enableMapClick = true,
  accuracy = null,
}) {
  const [markerPosition, setMarkerPosition] = useState(position);
  const [mapType, setMapType] = useState("street"); // "street" or "satellite"
  const [searchText, setSearchText] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // Update marker position when props change
  useEffect(() => {
    setMarkerPosition(position);
  }, [position]);

  // Handle marker drag end
  const handleDragEnd = useCallback(
    (e) => {
      const { lat, lng } = e.target.getLatLng();
      setMarkerPosition([lat, lng]);
      onPositionChange([lat, lng]);
    },
    [onPositionChange]
  );

  // Handle address search
  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setIsSearching(true);
    try {
      // Using Nominatim for geocoding (OpenStreetMap)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchText
        )}&limit=1`
      );
      const data = await response.json();

      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const position = [parseFloat(lat), parseFloat(lon)];
        onPositionChange(position);
        setMarkerPosition(position);
      } else {
        alert("Address not found. Please try a different search term.");
      }
    } catch (error) {
      console.error("Error searching for address:", error);
      alert("Failed to search for address. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            placeholder="Search for address..."
            className="pr-9"
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <div className="absolute right-2 top-0 h-full flex items-center">
            {isSearching ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-r-transparent" />
            ) : (
              <Search
                className="h-4 w-4 text-muted-foreground cursor-pointer"
                onClick={handleSearch}
              />
            )}
          </div>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="h-10 w-10"
              title="Map Options"
            >
              <Layers className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-3">
            <div className="space-y-3">
              <div className="font-medium">Map Settings</div>
              <div className="space-y-1.5">
                <div className="text-sm font-medium text-muted-foreground">
                  Map Type
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    size="sm"
                    variant={mapType === "street" ? "default" : "outline"}
                    className="h-9"
                    onClick={() => setMapType("street")}
                  >
                    Street
                  </Button>
                  <Button
                    size="sm"
                    variant={mapType === "satellite" ? "default" : "outline"}
                    className="h-9"
                    onClick={() => setMapType("satellite")}
                  >
                    Satellite
                  </Button>
                </div>
              </div>
              <div className="space-y-1.5 pt-1.5 border-t">
                <div className="text-sm font-medium text-muted-foreground">
                  Tips
                </div>
                <div className="text-xs text-muted-foreground">
                  <ul className="space-y-1">
                    <li className="flex items-start gap-1.5">
                      <Search className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>Search your exact address</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <PlusSquare className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>Switch to satellite for better precision</span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <MapPin className="h-3 w-3 mt-0.5 flex-shrink-0" />
                      <span>Drag marker to your exact building</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      <div
        className="relative rounded-md overflow-hidden shadow-sm border"
        style={{ height }}
      >
        <MapContainer
          center={position}
          zoom={18}
          style={{ height: "100%", width: "100%" }}
          zoomControl={false}
          attributionControl={false}
        >
          <ZoomControl position="bottomright" />

          <LayersControl position="bottomright">
            <LayersControl.BaseLayer
              checked={mapType === "street"}
              name="Street Map"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                subdomains={["a", "b", "c"]}
                maxZoom={19}
              />
            </LayersControl.BaseLayer>
            <LayersControl.BaseLayer
              checked={mapType === "satellite"}
              name="Satellite"
            >
              <TileLayer
                attribution="Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community"
                url="https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
                maxZoom={19}
              />
            </LayersControl.BaseLayer>
          </LayersControl>

          {accuracy && <AccuracyCircle center={position} accuracy={accuracy} />}

          <Marker
            position={markerPosition}
            icon={preciseIcon}
            draggable={isDraggable}
            eventHandlers={{
              dragend: handleDragEnd,
            }}
          />
          <ChangeView center={position} zoom={18} />
          {enableMapClick && (
            <MapInteraction onPositionChange={onPositionChange} />
          )}
        </MapContainer>
      </div>

      <div className="text-xs text-center text-muted-foreground">
        {isDraggable
          ? "Click anywhere on the map or drag the marker to place your property exactly"
          : ""}
      </div>
    </div>
  );
}
