import React, { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/shared/components/ui/card";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { MapPin, Loader2, Target, Check, LocateFixed, Map } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/hooks/use-toast";
import dynamic from "next/dynamic";
import { useTranslation } from "@/shared/hooks/useTranslation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Dynamically import the Map component with no SSR
const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] flex items-center justify-center bg-gray-100 rounded-md">
      <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
    </div>
  ),
});

// IP-based fallback API endpoint
const IP_LOCATION_API = "https://ipapi.co/json/";

export function LocationForm({ data, onChange }) {
  const { currentLanguage, isRTL } = useTranslation();
  const [isLoading, setIsLoading] = useState(false);
  const [locationSource, setLocationSource] = useState("");
  const [permissionStatus, setPermissionStatus] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [tempCoordinates, setTempCoordinates] = useState(null);
  const { toast } = useToast();
  const [mapKey, setMapKey] = useState(0);
  const [accuracy, setAccuracy] = useState(null);
  const [isMapMode, setIsMapMode] = useState(false);

  // Translations
  const translations = {
    en: {
      locationDetails: "Location Details",
      locationDescription: "Enter the location information for this property.",
      showForm: "Show Form",
      showMap: "Show Map",
      streetAddress: "Street Address",
      streetAddressPlaceholder: "Street address",
      city: "City",
      cityPlaceholder: "City",
      stateProvince: "State/Province",
      stateProvincePlaceholder: "State/Province",
      zipPostalCode: "Zip/Postal Code",
      zipPostalCodePlaceholder: "Zip/Postal code",
      country: "Country",
      countryPlaceholder: "Country",
      latitude: "Latitude",
      latitudePlaceholder: "Latitude",
      longitude: "Longitude",
      longitudePlaceholder: "Longitude",
      gettingLocation: "Getting location...",
      getMyLocation: "Get My Location",
      locationPermissionRequired: "Location permission required",
      enableLocationAccess:
        "Please enable location access in your browser settings",
      locationUpdated: "Location updated",
      addressUpdated: "Address updated",
      addressUpdatedDescription:
        "Location details have been filled automatically.",
      mapPositionUpdated: "Map position has been updated.",
      mapPreview: "Map preview would be displayed here",
      mapInstructions:
        'Use "Get My Location" button or enter coordinates manually',
      currentLocation: "Current Location:",
      showOnMap: "Show on Map",
      confirmLocation: "Confirm Location",
      gpsLocationDetected:
        "Your location has been detected. The accuracy may vary based on your device and environment.",
      ipLocationDetected:
        "We've found an approximate location based on your IP address.",
      cancel: "Cancel",
      useThisLocation: "Use This Location",
      lowAccuracy: "Low accuracy detected",
      lowAccuracyDescription:
        "Your location was found with {{accuracy}}m accuracy. You can fine-tune it on the map.",
      usingApproxLocation: "Using approximate location",
      usingApproxDescription:
        "Precise location unavailable. Using IP-based location - please adjust manually on the map.",
      locationError: "Location error",
      locationErrorDescription:
        "Could not determine your location. Please enter coordinates manually or try again.",
      coordinatesSet:
        "Coordinates have been set. You can fine-tune by dragging the marker.",
      updateAddress: "Update Address Fields from Map Location",
    },
    ar: {
      locationDetails: "تفاصيل الموقع",
      locationDescription: "أدخل معلومات الموقع لهذا العقار.",
      showForm: "عرض النموذج",
      showMap: "عرض الخريطة",
      streetAddress: "عنوان الشارع",
      streetAddressPlaceholder: "عنوان الشارع",
      city: "المدينة",
      cityPlaceholder: "المدينة",
      stateProvince: "الولاية/المقاطعة",
      stateProvincePlaceholder: "الولاية/المقاطعة",
      zipPostalCode: "الرمز البريدي",
      zipPostalCodePlaceholder: "الرمز البريدي",
      country: "البلد",
      countryPlaceholder: "البلد",
      latitude: "خط العرض",
      latitudePlaceholder: "خط العرض",
      longitude: "خط الطول",
      longitudePlaceholder: "خط الطول",
      gettingLocation: "جاري تحديد الموقع...",
      getMyLocation: "الحصول على موقعي",
      locationPermissionRequired: "إذن الموقع مطلوب",
      enableLocationAccess: "يرجى تمكين الوصول إلى الموقع في إعدادات المتصفح",
      locationUpdated: "تم تحديث الموقع",
      addressUpdated: "تم تحديث العنوان",
      addressUpdatedDescription: "تم ملء تفاصيل الموقع تلقائيًا.",
      mapPositionUpdated: "تم تحديث موقع الخريطة.",
      mapPreview: "ستعرض معاينة الخريطة هنا",
      mapInstructions: 'استخدم زر "الحصول على موقعي" أو أدخل الإحداثيات يدويًا',
      currentLocation: "الموقع الحالي:",
      showOnMap: "عرض على الخريطة",
      confirmLocation: "تأكيد الموقع",
      gpsLocationDetected:
        "تم اكتشاف موقعك. قد تختلف الدقة بناءً على جهازك وبيئتك.",
      ipLocationDetected:
        "لقد وجدنا موقعًا تقريبيًا بناءً على عنوان IP الخاص بك.",
      cancel: "إلغاء",
      useThisLocation: "استخدم هذا الموقع",
      lowAccuracy: "تم اكتشاف دقة منخفضة",
      lowAccuracyDescription:
        "تم العثور على موقعك بدقة {{accuracy}} متر. يمكنك ضبطه على الخريطة.",
      usingApproxLocation: "استخدام موقع تقريبي",
      usingApproxDescription:
        "الموقع الدقيق غير متوفر. استخدام موقع يعتمد على IP - يرجى التعديل يدويًا على الخريطة.",
      locationError: "خطأ في الموقع",
      locationErrorDescription:
        "تعذر تحديد موقعك. يرجى إدخال الإحداثيات يدويًا أو المحاولة مرة أخرى.",
      coordinatesSet:
        "تم تعيين الإحداثيات. يمكنك الضبط الدقيق عن طريق سحب العلامة.",
      updateAddress: "تحديث حقول العنوان من موقع الخريطة",
    },
  };

  const t = translations[currentLanguage === "ar" ? "ar" : "en"];

  // Check for geolocation permissions when component mounts
  useEffect(() => {
    checkLocationPermission();
  }, []);

  // Update map when coordinates change
  useEffect(() => {
    if (data.latitude && data.longitude) {
      setMapKey((prev) => prev + 1);
    }
  }, [data.latitude, data.longitude]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    onChange(id, value);
  };

  const handleNumberChange = (e) => {
    const { id, value } = e.target;
    onChange(id, value === "" ? 0 : Number(value));
  };

  // Check for geolocation permission
  const checkLocationPermission = async () => {
    if (!navigator.permissions || !navigator.permissions.query) {
      // Browser doesn't support permissions API
      setPermissionStatus("unknown");
      return;
    }

    try {
      const result = await navigator.permissions.query({ name: "geolocation" });
      setPermissionStatus(result.state);

      result.addEventListener("change", () => {
        setPermissionStatus(result.state);
      });
    } catch (error) {
      console.error("Error checking geolocation permission:", error);
      setPermissionStatus("unknown");
    }
  };

  // Get location using GPS with timeout and high accuracy
  const getGPSLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation is not supported by this browser"));
        return;
      }

      // Set timeout for GPS (8 seconds)
      const timeoutId = setTimeout(() => {
        reject(new Error("GPS location request timed out"));
      }, 8000);

      navigator.geolocation.getCurrentPosition(
        (position) => {
          clearTimeout(timeoutId);
          setAccuracy(position.coords.accuracy);
          setLocationSource("GPS");
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
        },
        (error) => {
          clearTimeout(timeoutId);
          reject(error);
        },
        {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 7000,
        }
      );
    });
  };

  // Fallback to IP-based location
  const getIPBasedLocation = async () => {
    setLocationSource("IP");
    try {
      const response = await fetch(IP_LOCATION_API);
      const data = await response.json();

      if (data.latitude && data.longitude) {
        return {
          latitude: data.latitude,
          longitude: data.longitude,
          accuracy: 3000, // IP geolocation typically has lower accuracy (approx 3km)
        };
      } else {
        throw new Error("Unable to get location from IP");
      }
    } catch (error) {
      throw new Error("IP-based location failed");
    }
  };

  // Main location fetching logic with fallbacks
  const getCurrentLocation = async () => {
    setIsLoading(true);
    setAccuracy(null);

    try {
      // First try high-accuracy GPS
      const location = await getGPSLocation();

      // If accuracy is poor (> 100 meters), show confirmation dialog
      if (location.accuracy > 100) {
        toast({
          title: t.lowAccuracy,
          description: t.lowAccuracyDescription.replace(
            "{{accuracy}}",
            Math.round(location.accuracy)
          ),
          variant: "warning",
        });
      }

      // Set temporary coordinates and show confirmation dialog
      setTempCoordinates({
        latitude: location.latitude,
        longitude: location.longitude,
      });
      setShowConfirmDialog(true);
    } catch (gpsError) {
      console.error("GPS location error:", gpsError);

      // Try IP-based fallback
      try {
        const ipLocation = await getIPBasedLocation();
        setTempCoordinates({
          latitude: ipLocation.latitude,
          longitude: ipLocation.longitude,
        });
        setShowConfirmDialog(true);

        toast({
          title: t.usingApproxLocation,
          description: t.usingApproxDescription,
          variant: "warning",
        });
      } catch (ipError) {
        console.error("IP location error:", ipError);

        toast({
          variant: "destructive",
          title: t.locationError,
          description: t.locationErrorDescription,
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Confirm and apply location coordinates
  const confirmLocation = () => {
    if (tempCoordinates) {
      onChange("latitude", tempCoordinates.latitude);
      onChange("longitude", tempCoordinates.longitude);
      setShowConfirmDialog(false);
      setIsMapMode(true);

      toast({
        title: t.locationUpdated,
        description: t.coordinatesSet,
      });
    }
  };

  // Update address fields based on coordinates
  const updateAddressFromCoordinates = async (lat, lng) => {
    try {
      // Reverse geocoding using Nominatim
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`
      );
      const data = await response.json();

      if (data && data.address) {
        const address = data.address;

        // Update the address fields
        onChange("address", address.road || address.street || "");
        onChange("city", address.city || address.town || address.village || "");
        onChange("state", address.state || "");
        onChange("zip_code", address.postcode || "");
        onChange("country", address.country || "");

        toast({
          title: t.addressUpdated,
          description: t.addressUpdatedDescription,
        });
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Handle position change from map
  const handlePositionChange = (newPosition) => {
    if (newPosition && newPosition.length === 2) {
      onChange("latitude", newPosition[0]);
      onChange("longitude", newPosition[1]);

      // Try to update address fields based on new coordinates
      updateAddressFromCoordinates(newPosition[0], newPosition[1]);

      toast({
        title: t.locationUpdated,
        description: t.mapPositionUpdated,
      });
    }
  };

  // Toggle between map and form modes on mobile
  const toggleMapMode = () => {
    setIsMapMode(!isMapMode);
  };

  return (
    <>
      <Card className={isRTL ? "rtl" : ""}>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{t.locationDetails}</span>
            {data.latitude && data.longitude && (
              <Button
                variant="outline"
                size="sm"
                className="md:hidden"
                onClick={toggleMapMode}
              >
                {isMapMode ? t.showForm : t.showMap}
              </Button>
            )}
          </CardTitle>
          <CardDescription>{t.locationDescription}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div
            className={`space-y-4 ${isMapMode ? "hidden md:block" : "block"}`}
          >
            <div>
              <Label htmlFor="address">{t.streetAddress}</Label>
              <Input
                id="address"
                type="text"
                value={data.address}
                placeholder={t.streetAddressPlaceholder}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">{t.city}</Label>
                <Input
                  id="city"
                  type="text"
                  value={data.city}
                  placeholder={t.cityPlaceholder}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="state">{t.stateProvince}</Label>
                <Input
                  id="state"
                  type="text"
                  value={data.state}
                  placeholder={t.stateProvincePlaceholder}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zip_code">{t.zipPostalCode}</Label>
                <Input
                  id="zip_code"
                  type="text"
                  value={data.zip_code}
                  placeholder={t.zipPostalCodePlaceholder}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="country">{t.country}</Label>
                <Input
                  id="country"
                  type="text"
                  value={data.country}
                  placeholder={t.countryPlaceholder}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="latitude">{t.latitude}</Label>
                <Input
                  id="latitude"
                  type="number"
                  step="0.000001"
                  value={data.latitude || ""}
                  placeholder={t.latitudePlaceholder}
                  onChange={handleNumberChange}
                />
              </div>
              <div>
                <Label htmlFor="longitude">{t.longitude}</Label>
                <Input
                  id="longitude"
                  type="number"
                  step="0.000001"
                  value={data.longitude || ""}
                  placeholder={t.longitudePlaceholder}
                  onChange={handleNumberChange}
                />
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={getCurrentLocation}
                disabled={isLoading}
                className="flex-1"
                variant="outline"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t.gettingLocation}
                  </>
                ) : (
                  <>
                    <Target className="mr-2 h-4 w-4" />
                    {t.getMyLocation}
                  </>
                )}
              </Button>

              {permissionStatus === "denied" && (
                <Button
                  onClick={() => {
                    window.open("about:preferences#privacy", "_blank");
                    toast({
                      title: t.locationPermissionRequired,
                      description: t.enableLocationAccess,
                    });
                  }}
                  variant="destructive"
                  size="icon"
                  title={t.locationPermissionRequired}
                >
                  <LocateFixed className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>

          <div className={isMapMode ? "block" : "hidden md:block"}>
            {data.latitude && data.longitude ? (
              <div className="space-y-2">
                <MapComponent
                  key={mapKey}
                  position={[data.latitude, data.longitude]}
                  height="300px"
                  onPositionChange={handlePositionChange}
                  accuracy={accuracy}
                />

                {locationSource && (
                  <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                    <span>Source: {locationSource}</span>
                    {accuracy && (
                      <span>• Accuracy: ~{Math.round(accuracy)}m</span>
                    )}
                  </div>
                )}

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full mt-2"
                  onClick={() =>
                    updateAddressFromCoordinates(data.latitude, data.longitude)
                  }
                >
                  {t.updateAddress}
                </Button>
              </div>
            ) : (
              <div className="h-[300px] bg-gray-100 rounded-md flex flex-col items-center justify-center gap-2">
                <MapPin className="h-8 w-8 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t.mapPreview}</p>
                <p className="text-xs text-muted-foreground">
                  {t.mapInstructions}
                </p>
              </div>
            )}
          </div>
        </CardContent>

        {data.latitude && data.longitude && (
          <CardFooter className="flex justify-between border-t pt-4 mt-2">
            <div className="text-sm">
              <span className="font-medium">{t.currentLocation}</span>{" "}
              {data.latitude.toFixed(6)}, {data.longitude.toFixed(6)}
            </div>
            {!isMapMode && (
              <Button
                size="sm"
                variant="outline"
                className="hidden md:flex"
                onClick={() => {
                  setIsMapMode(true);
                  window.scrollTo({
                    top:
                      document.getElementById("location-map")?.offsetTop || 0,
                    behavior: "smooth",
                  });
                }}
              >
                <Map className="h-4 w-4 mr-2" />
                {t.showOnMap}
              </Button>
            )}
          </CardFooter>
        )}
      </Card>

      {/* Location confirmation dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent className={isRTL ? "rtl" : ""}>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmLocation}</AlertDialogTitle>
            <AlertDialogDescription>
              {locationSource === "GPS"
                ? t.gpsLocationDetected
                : t.ipLocationDetected}
            </AlertDialogDescription>
          </AlertDialogHeader>

          {tempCoordinates && (
            <MapComponent
              position={[tempCoordinates.latitude, tempCoordinates.longitude]}
              height="200px"
              onPositionChange={(pos) => {
                setTempCoordinates({
                  latitude: pos[0],
                  longitude: pos[1],
                });
              }}
              accuracy={accuracy}
            />
          )}

          <AlertDialogFooter className={isRTL ? "flex-row-reverse" : ""}>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmLocation}>
              <Check className="mr-2 h-4 w-4" />
              {t.useThisLocation}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
