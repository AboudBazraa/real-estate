"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import {
  Check,
  X,
  Loader2,
  Mail,
  Home,
  MapPin,
  Calendar,
  AlertCircle,
  Grid,
  LayoutList,
  BedDouble,
  Bath,
  RefreshCcw,
} from "lucide-react";
import { useProperties } from "@/shared/hooks/useProperties";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTranslation } from "@/shared/hooks/useTranslation";
import pendingTranslations from "./translations";
import LanguageSwitcher from "./components/LanguageSwitcher";

const PLACEHOLDER_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

// Helper function to get the correct image URL from property data
function getPropertyImageUrl(property) {
  // For debugging
  if (property?.images && property.images.length > 0) {
    console.log("Property has images:", property.images);
  }

  // Check all possible image sources in priority order
  if (property?.primaryImage) {
    return property.primaryImage;
  } else if (property?.images && property.images.length > 0) {
    // If there's an image marked as primary, use that
    const primaryImage = property.images.find((img) => img.is_primary);
    if (primaryImage && primaryImage.image_url) {
      return primaryImage.image_url;
    }
    // Otherwise use the first image
    if (property.images[0]?.image_url) {
      return property.images[0].image_url;
    }
  }

  // Fallback to placeholder
  return "https://placehold.co/600x400";
}

export default function PendingApprovalsPage() {
  const { toast } = useToast();
  const {
    fetchProperties,
    updateProperty,
    loading: propertiesLoading,
    properties,
    getPropertyById,
  } = useProperties();
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [debugImageUrls, setDebugImageUrls] = useState(false);

  // Add these lines for translation support
  const { currentLanguage, isRTL } = useTranslation();
  const t = pendingTranslations[currentLanguage] || pendingTranslations.en;

  useEffect(() => {
    // Define the filters to get only non-featured properties
    const filters = {
      featured: false, // This uses the 'featured' field to filter pending properties
    };

    // Fetch properties on component mount
    const loadProperties = async () => {
      setLoading(true);
      try {
        // We pass a large page size to get all pending properties
        await fetchProperties(0, 100, filters, undefined, false, false);
      } catch (error) {
        console.error("Failed to fetch pending properties:", error);
        toast({
          title: "Error",
          description: "Failed to load pending properties",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [fetchProperties, toast]);

  // Update pendingProperties when properties change and fetch detailed info with user email
  useEffect(() => {
    const fetchDetailedProperties = async () => {
      if (properties && properties.length > 0) {
        const detailedProperties = await Promise.all(
          properties.map(async (property) => {
            // Get detailed property info including user data
            try {
              const detailedProperty = await getPropertyById(property.id);

              // Debug the image URLs if enabled
              if (debugImageUrls && detailedProperty) {
                console.log(`Property ID: ${detailedProperty.id}`);
                console.log(`Primary Image: ${detailedProperty.primaryImage}`);
                if (
                  detailedProperty.images &&
                  detailedProperty.images.length > 0
                ) {
                  detailedProperty.images.forEach((img, idx) => {
                    console.log(`Image ${idx}: ${img.image_url}`);
                  });
                } else {
                  console.log("No images found for this property");
                }
              }

              return detailedProperty;
            } catch (error) {
              console.error(
                `Error fetching details for property ${property.id}:`,
                error
              );
              return property; // Return original property if detailed fetch fails
            }
          })
        );
        setPendingProperties(detailedProperties);
        // Set the first property as selected by default if there's no selection
        if (detailedProperties.length > 0 && !selectedProperty) {
          setSelectedProperty(detailedProperties[0]);
        }
      } else {
        setPendingProperties([]);
        setSelectedProperty(null);
      }
    };

    fetchDetailedProperties();
  }, [properties, getPropertyById, selectedProperty, debugImageUrls]);

  // Add a new useEffect after existing ones to log the fetched properties data
  useEffect(() => {
    // Log property data for debugging when loading completes
    if (!loading && pendingProperties.length > 0) {
      console.log("Fetched property data sample:", pendingProperties[0]);

      // Enable debug for the first render to check image URLs
      if (!debugImageUrls) {
        setDebugImageUrls(true);
      }
    }
  }, [loading, pendingProperties, debugImageUrls]);

  // Get the count of pending properties
  const pendingCount = pendingProperties.length;

  // Function to handle property approval
  async function handleApprove(property) {
    try {
      // Update the property to set featured to true
      await updateProperty(property.id, { featured: true });

      // Update the local state to remove this property from the list
      setPendingProperties((prevProperties) =>
        prevProperties.filter((p) => p.id !== property.id)
      );

      // If the approved property was selected, clear the selection
      if (selectedProperty && selectedProperty.id === property.id) {
        setSelectedProperty(
          pendingProperties.length > 1 ? pendingProperties[0] : null
        );
      }

      toast({
        title: "Success",
        description: "Property has been approved",
      });
    } catch (error) {
      console.error("Failed to approve property:", error);
      toast({
        title: "Error",
        description: "Failed to approve property",
        variant: "destructive",
      });
    }
  }

  // Function to handle property rejection
  async function handleReject(property) {
    try {
      // Update the property to set featured to null (rejected)
      await updateProperty(property.id, { featured: null });

      // Update the local state to remove this property from the list
      setPendingProperties((prevProperties) =>
        prevProperties.filter((p) => p.id !== property.id)
      );

      // If the rejected property was selected, clear the selection
      if (selectedProperty && selectedProperty.id === property.id) {
        setSelectedProperty(
          pendingProperties.length > 1 ? pendingProperties[0] : null
        );
      }

      toast({
        title: "Success",
        description: "Property has been rejected",
      });
    } catch (error) {
      console.error("Failed to reject property:", error);
      toast({
        title: "Error",
        description: "Failed to reject property",
        variant: "destructive",
      });
    }
  }

  return (
    <div className={`p-6 ${isRTL ? "rtl" : ""}`}>
      <div
        className={`flex items-center justify-between mb-6 ${
          isRTL ? "rtl-flex-row-reverse" : ""
        }`}
      >
        <div>
          <h1 className="text-2xl font-bold">{t.pendingApprovals}</h1>
          <p className="text-muted-foreground">{t.waitingApproval}</p>
          {!loading && (
            <p className="text-sm text-muted-foreground mt-1">
              {pendingCount > 0
                ? t.propertiesFound.replace("{{count}}", pendingCount)
                : t.noProperties}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setPendingProperties([]);
              setSelectedProperty(null);
              fetchProperties(
                0,
                100,
                { featured: false },
                undefined,
                false,
                false
              );
            }}
            disabled={loading}
            className={isRTL ? "rtl-flex-row-reverse" : ""}
          >
            {loading ? (
              <Loader2
                className={`h-4 w-4 animate-spin ${isRTL ? "ml-2" : "mr-2"}`}
              />
            ) : (
              <RefreshCcw className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            )}
            {t.refresh}
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="h-[calc(100vh-180px)]">
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12 rounded-md" />
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-[200px]" />
                          <Skeleton className="h-4 w-[150px]" />
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-180px)]">
              <CardHeader>
                <Skeleton className="h-6 w-40" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-[250px] w-full rounded-md" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : pendingCount === 0 ? (
        <Card className="w-full p-6 text-center">
          <CardContent className="pt-6">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground" />
            <h3 className="mt-4 text-lg font-semibold">{t.noProperties}</h3>
            <p className="text-muted-foreground mt-2">
              {t.allPropertiesApproved}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Property List */}
          <div className="md:col-span-1">
            <Card className="h-[calc(100vh-180px)]">
              <CardHeader>
                <CardTitle>{t.property}</CardTitle>
              </CardHeader>
              <ScrollArea className="h-[calc(100vh-250px)]">
                <CardContent>
                  <div className="space-y-4">
                    {pendingProperties.map((property) => (
                      <div
                        key={property.id}
                        className={`flex items-center space-x-4 cursor-pointer p-2 rounded-md hover:bg-muted ${
                          selectedProperty?.id === property.id ? "bg-muted" : ""
                        } ${isRTL ? "flex-row-reverse space-x-reverse" : ""}`}
                        onClick={() => setSelectedProperty(property)}
                      >
                        <div className="relative h-12 w-12 rounded-md overflow-hidden">
                          <Image
                            src={getPropertyImageUrl(property)}
                            alt={property.title || "Property"}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              e.target.src = "https://placehold.co/600x400";
                            }}
                          />
                        </div>
                        <div className={isRTL ? "text-right" : ""}>
                          <p className="font-medium text-sm line-clamp-1">
                            {property.title || t.propertyTitle}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {property.address || t.location}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </ScrollArea>
            </Card>
          </div>

          {/* Property Details */}
          <div className="md:col-span-2">
            <Card className="h-[calc(100vh-180px)]">
              <CardHeader>
                <CardTitle>{t.propertyDetails}</CardTitle>
              </CardHeader>
              <ScrollArea className="h-[calc(100vh-250px)]">
                <CardContent>
                  {selectedProperty ? (
                    <PropertyDetail
                      property={selectedProperty}
                      onApprove={() => handleApprove(selectedProperty)}
                      onReject={() => handleReject(selectedProperty)}
                      isLoading={loading}
                      isRTL={isRTL}
                      translations={t}
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full py-12">
                      <Home className="h-12 w-12 text-muted-foreground mb-4" />
                      <h3 className="text-lg font-medium">
                        {t.selectProperty}
                      </h3>
                    </div>
                  )}
                </CardContent>
              </ScrollArea>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}

function PropertyCard({
  property,
  onApprove,
  onReject,
  isLoading,
  isRTL,
  translations,
}) {
  const t = translations || pendingTranslations.en;

  const handleApprove = async () => {
    if (isLoading) return;
    await onApprove();
  };

  const handleReject = async () => {
    if (isLoading) return;
    await onReject();
  };

  const handleImageError = () => {
    // Handle image error
  };

  return (
    <Card className={isRTL ? "rtl property-card" : "property-card"}>
      <CardHeader className={`pb-2 ${isRTL ? "property-card-header" : ""}`}>
        <CardTitle className="text-base font-medium">
          {property.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div
          className={`flex items-center gap-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <div className="h-12 w-12 rounded-md bg-muted flex items-center justify-center">
            <Home className="h-6 w-6 text-muted-foreground" />
          </div>
          <div className={isRTL ? "text-right" : ""}>
            <p className="font-medium">{property.address || t.location}</p>
            <p className="text-sm text-muted-foreground">
              {t.postedBy}: {property.user_email || "Unknown"}
            </p>
          </div>
        </div>
        <div
          className={`grid grid-cols-2 gap-4 mt-4 ${
            isRTL ? "property-card-actions" : ""
          }`}
        >
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={isLoading}
            className={isRTL ? "flex-row-reverse" : ""}
          >
            <X className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t.reject}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            className={isRTL ? "flex-row-reverse" : ""}
          >
            <Check className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t.approve}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function PropertyDetail({
  property,
  onApprove,
  onReject,
  isLoading,
  isRTL,
  translations,
}) {
  const t = translations || pendingTranslations.en;

  const handleApprove = async () => {
    if (isLoading) return;
    await onApprove();
  };

  const handleReject = async () => {
    if (isLoading) return;
    await onReject();
  };

  const handleImageError = () => {
    // Handle image error
  };

  return (
    <div className={isRTL ? "rtl property-details" : "property-details"}>
      <div className="relative h-[250px] w-full rounded-md overflow-hidden mb-6">
        <Image
          src={getPropertyImageUrl(property)}
          alt={property.title || "Property"}
          fill
          className="object-cover"
          onError={(e) => {
            e.target.src = "https://placehold.co/600x400";
          }}
        />
      </div>

      <div className="space-y-6">
        <div className={isRTL ? "text-right" : ""}>
          <h2 className="text-2xl font-bold">{property.title}</h2>
          <p className="text-muted-foreground">{property.address}</p>
        </div>

        <div
          className={`grid grid-cols-2 md:grid-cols-4 gap-4 ${
            isRTL ? "property-metadata" : ""
          }`}
        >
          <div
            className={`flex flex-col ${
              isRTL ? "items-end property-metadata-item" : ""
            }`}
          >
            <span className="text-sm text-muted-foreground">{t.price}</span>
            <span className="font-medium">
              ${property.price?.toLocaleString() || "N/A"}
            </span>
          </div>
          <div
            className={`flex flex-col ${
              isRTL ? "items-end property-metadata-item" : ""
            }`}
          >
            <span className="text-sm text-muted-foreground">{t.bedrooms}</span>
            <span className="font-medium">{property.bedrooms || "N/A"}</span>
          </div>
          <div
            className={`flex flex-col ${
              isRTL ? "items-end property-metadata-item" : ""
            }`}
          >
            <span className="text-sm text-muted-foreground">{t.bathrooms}</span>
            <span className="font-medium">{property.bathrooms || "N/A"}</span>
          </div>
          <div
            className={`flex flex-col ${
              isRTL ? "items-end property-metadata-item" : ""
            }`}
          >
            <span className="text-sm text-muted-foreground">{t.size}</span>
            <span className="font-medium">
              {property.size ? `${property.size} sqft` : "N/A"}
            </span>
          </div>
        </div>

        <div className={isRTL ? "property-description" : ""}>
          <h3 className="text-lg font-medium mb-2">{t.description}</h3>
          <p className="text-muted-foreground">
            {property.description || "No description provided."}
          </p>
        </div>

        <div
          className={`flex items-center gap-4 ${
            isRTL ? "property-features" : ""
          }`}
        >
          <div
            className={`flex items-center ${
              isRTL ? "flex-row-reverse feature-item" : ""
            }`}
          >
            <BedDouble
              className={`h-5 w-5 text-muted-foreground ${
                isRTL ? "ml-2" : "mr-2"
              }`}
            />
            <span>
              {property.bedrooms || 0} {t.bedrooms}
            </span>
          </div>
          <div
            className={`flex items-center ${
              isRTL ? "flex-row-reverse feature-item" : ""
            }`}
          >
            <Bath
              className={`h-5 w-5 text-muted-foreground ${
                isRTL ? "ml-2" : "mr-2"
              }`}
            />
            <span>
              {property.bathrooms || 0} {t.bathrooms}
            </span>
          </div>
          <div
            className={`flex items-center ${
              isRTL ? "flex-row-reverse feature-item" : ""
            }`}
          >
            <MapPin
              className={`h-5 w-5 text-muted-foreground ${
                isRTL ? "ml-2" : "mr-2"
              }`}
            />
            <span>{property.address || t.location}</span>
          </div>
        </div>

        <div
          className={`flex items-center gap-4 ${
            isRTL ? "property-metadata" : ""
          }`}
        >
          <div
            className={`flex flex-col ${
              isRTL ? "items-end property-metadata-item" : ""
            }`}
          >
            <span className="text-sm text-muted-foreground">{t.postedBy}</span>
            <span className="font-medium">
              {property.user_email || "Unknown"}
            </span>
          </div>
          <div
            className={`flex flex-col ${
              isRTL ? "items-end property-metadata-item" : ""
            }`}
          >
            <span className="text-sm text-muted-foreground">
              {t.datePosted}
            </span>
            <span className="font-medium">
              {property.created_at
                ? new Date(property.created_at).toLocaleDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        <div
          className={`grid grid-cols-2 gap-4 mt-6 ${
            isRTL ? "approval-buttons" : ""
          }`}
        >
          <Button
            variant="outline"
            onClick={handleReject}
            disabled={isLoading}
            className={isRTL ? "flex-row-reverse" : ""}
          >
            <X className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t.reject}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isLoading}
            className={isRTL ? "flex-row-reverse" : ""}
          >
            <Check className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
            {t.approve}
          </Button>
        </div>
      </div>
    </div>
  );
}
