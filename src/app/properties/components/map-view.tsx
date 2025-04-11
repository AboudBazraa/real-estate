"use client";

import { useState } from "react";
import Map from "./map";
import {
  MapPin,
  Layers,
  AlertTriangle,
  ZoomIn,
  ZoomOut,
  CreditCard,
  Eye,
  EyeOff,
} from "lucide-react";

export default function MapView({
  onSelectProperty,
}: {
  onSelectProperty?: (id: string) => void;
}) {
  const [mapType, setMapType] = useState("roadmap");
  const [showPriceMarkers, setShowPriceMarkers] = useState(true);
  const [mapZoom, setMapZoom] = useState(12);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const hasApiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY &&
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY !==
      "YOUR_GOOGLE_MAPS_API_KEY_HERE";

  // Sample locations for map markers - modified to match reference image data
  const locations = [
    { id: "1", lat: 15.3694, lng: 44.191, price: 700000 }, // $700K marker
    { id: "2", lat: 15.3547, lng: 44.2066, price: 1200000 }, // $1.2K marker
    { id: "3", lat: 15.4855, lng: 44.3186, price: 1700000 }, // $1.7K marker
    { id: "4", lat: 15.3834, lng: 44.303, price: 900000 }, // Part of $900K-$1.8K range
    { id: "5", lat: 15.3888, lng: 44.3178, price: 1800000 }, // Part of $900K-$1.8K range
    { id: "6", lat: 15.3981, lng: 44.36, price: 2100000 }, // $2.1K marker
    { id: "7", lat: 15.4049, lng: 44.317, price: 2700000 }, // $2.7K marker
    { id: "8", lat: 15.325, lng: 44.217, price: 2100000 }, // $2.1K marker on west
    { id: "9", lat: 15.315, lng: 44.107, price: 1300000 }, // $1.3K-$2.7K range
    { id: "10", lat: 15.305, lng: 44.117, price: 2700000 }, // $1.3K-$2.7K range
    { id: "11", lat: 15.289, lng: 44.407, price: 780000 }, // $780K-$1.9K range
    { id: "12", lat: 15.279, lng: 44.417, price: 1900000 }, // $780K-$1.9K range
    { id: "13", lat: 15.355, lng: 44.39, price: 2200000 }, // $2.2K marker
  ];

  // Handle zoom in/out
  const handleZoomIn = () => {
    setMapZoom((prev) => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setMapZoom((prev) => Math.max(prev - 1, 1));
  };

  // Toggle boundaries
  const toggleBoundaries = () => {
    setShowBoundaries(!showBoundaries);
  };

  // Forward property selection to parent component
  const handleSelectProperty = (id: string) => {
    if (onSelectProperty) {
      onSelectProperty(id);
    }
  };

  return (
    <div className="flex flex-col w-full h-full bg-white relative">
      <div className="relative flex-grow">
        {hasApiKey ? (
          <>
            <Map
              locations={locations}
              mapType={mapType}
              showPriceMarkers={showPriceMarkers}
              center={{ lat: 15.3694, lng: 44.191 }}
              defaultZoom={mapZoom}
              darkMode={false}
              onSelectProperty={handleSelectProperty}
              showBoundaries={showBoundaries}
            />

            {/* Map type toggle */}
            <div className="absolute top-4 right-4 z-10 bg-white rounded-md shadow-md overflow-hidden flex">
              <button
                onClick={() => setMapType("roadmap")}
                className={`px-3 py-2 text-sm ${
                  mapType === "roadmap"
                    ? "bg-black text-white"
                    : "text-gray-700"
                }`}
              >
                Map
              </button>
              <button
                onClick={() => setMapType("satellite")}
                className={`px-3 py-2 text-sm ${
                  mapType === "satellite"
                    ? "bg-black text-white"
                    : "text-gray-700"
                }`}
              >
                Satellite
              </button>
            </div>

            {/* Toggle price markers */}
            <div className="absolute top-16 right-4 z-10 bg-white rounded-md shadow-md overflow-hidden">
              <button
                onClick={() => setShowPriceMarkers(!showPriceMarkers)}
                className="px-3 py-2 text-sm text-gray-700 flex items-center gap-2"
              >
                {showPriceMarkers ? (
                  <Eye className="h-4 w-4" />
                ) : (
                  <EyeOff className="h-4 w-4" />
                )}
                {showPriceMarkers ? "Hide Prices" : "Show Prices"}
              </button>
            </div>

            {/* Zoom controls */}
            <div className="absolute bottom-20 right-4 z-10 bg-white rounded-md shadow-md flex flex-col">
              <button
                onClick={handleZoomIn}
                className="p-2 text-gray-700 hover:bg-gray-50 border-b border-gray-100"
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                onClick={handleZoomOut}
                className="p-2 text-gray-700 hover:bg-gray-50"
              >
                <ZoomOut className="h-5 w-5" />
              </button>
            </div>

            {/* Remove boundaries button */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <button
                onClick={toggleBoundaries}
                className="bg-white rounded-md shadow-md px-4 py-2 text-sm font-medium text-gray-700 flex items-center"
              >
                <Layers className="h-4 w-4 mr-2" />
                {showBoundaries ? "Remove Boundaries" : "Show Boundaries"}
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 p-6">
            <div className="max-w-md text-center">
              <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Google Maps API Billing Required
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                You need to enable billing for your Google Cloud project to use
                the Maps JavaScript API.
              </p>
              <div className="flex flex-col gap-4">
                <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md text-left">
                  <p className="text-sm text-gray-700 dark:text-gray-300 mb-2 font-medium">
                    How to enable billing:
                  </p>
                  <ol className="text-sm text-gray-600 dark:text-gray-400 list-decimal pl-5 space-y-1">
                    <li>
                      Go to the{" "}
                      <a
                        href="https://console.cloud.google.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-emerald-600 dark:text-emerald-500 hover:underline"
                      >
                        Google Cloud Console
                      </a>
                    </li>
                    <li>Select the project associated with your API key</li>
                    <li>Go to &quot;Billing&quot; in the navigation menu</li>
                    <li>Link a billing account to your project</li>
                    <li>Enable the Maps JavaScript API again</li>
                  </ol>
                </div>
                <a
                  href="https://developers.google.com/maps/documentation/javascript/error-messages#billing-not-enabled-map-error"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 text-white bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-800 font-medium py-2 px-4 rounded-md mx-auto"
                >
                  <CreditCard className="h-4 w-4" />
                  Enable Billing on Google Cloud
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
