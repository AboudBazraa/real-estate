"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import {
  Bed,
  Bath,
  Square,
  MapPin,
  Tag,
  Calendar,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Building2,
  Home,
  ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { useSupabaseItem, useSupabaseQuery } from "@/shared/hooks/useSupabase";
import { PROPERTY_TYPES } from "@/app/(dashboard)/constants/propertype";
import { useState } from "react";

// Create a mapping from numeric values to display names
const PROPERTY_TYPE_NAMES = {
  [PROPERTY_TYPES.HOUSE]: "House",
  [PROPERTY_TYPES.APARTMENT]: "Apartment",
  [PROPERTY_TYPES.CONDO]: "Condo",
  [PROPERTY_TYPES.TOWNHOUSE]: "Townhouse",
  [PROPERTY_TYPES.VILLA]: "Villa",
  [PROPERTY_TYPES.COMMERCIAL]: "Commercial",
};

export function PropertyDetailsModal({ propertyId, isOpen, onClose }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  const {
    data: property,
    isLoading: propertyLoading,
    isError: propertyError,
  } = useSupabaseItem("properties", propertyId, {
    enabled: isOpen && !!propertyId,
  });

  // Fetch property images
  const {
    data: propertyImages,
    isLoading: imagesLoading,
    isError: imagesError,
  } = useSupabaseQuery(
    ["property_images", propertyId],
    "property_images",
    {
      eq: [{ column: "property_id", value: propertyId }],
      order: { column: "display_order", ascending: true },
    },
    {
      enabled: isOpen && !!propertyId,
    }
  );

  const isLoading = propertyLoading || imagesLoading;
  const isError = propertyError || imagesError;

  // Reset active image when modal opens
  useState(() => {
    if (isOpen) {
      setActiveImageIndex(0);
    }
  }, [isOpen]);

  const nextImage = () => {
    if (propertyImages && propertyImages.length > 0) {
      setActiveImageIndex((prevIndex) =>
        prevIndex === propertyImages.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const prevImage = () => {
    if (propertyImages && propertyImages.length > 0) {
      setActiveImageIndex((prevIndex) =>
        prevIndex === 0 ? propertyImages.length - 1 : prevIndex - 1
      );
    }
  };

  const propertyTypeName = property
    ? PROPERTY_TYPE_NAMES[property.property_type] || "Property"
    : "";

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Property Details</DialogTitle>
          <DialogDescription>
            View detailed information about this property
          </DialogDescription>
        </DialogHeader>

        {isLoading && (
          <div className="py-10 text-center flex flex-col items-center gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p>Loading property details...</p>
          </div>
        )}

        {isError && (
          <div className="py-10 text-center text-red-500">
            Failed to load property details. Please try again.
          </div>
        )}

        {property && !isLoading && (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{property.title}</h2>

              {/* Image Gallery */}
              <div className="relative h-[300px] w-full rounded-md overflow-hidden">
                {propertyImages && propertyImages.length > 0 ? (
                  <>
                    <Image
                      src={propertyImages[activeImageIndex]?.image_url}
                      alt={`Property image ${activeImageIndex + 1}`}
                      fill
                      className="object-cover"
                      priority
                    />
                    {/* Image navigation */}
                    {propertyImages.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute left-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            prevImage();
                          }}
                        >
                          <ChevronLeft className="h-5 w-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            nextImage();
                          }}
                        >
                          <ChevronRight className="h-5 w-5" />
                        </Button>
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
                          {propertyImages.map((_, index) => (
                            <button
                              key={index}
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveImageIndex(index);
                              }}
                              className={`w-2 h-2 rounded-full ${
                                index === activeImageIndex
                                  ? "bg-white"
                                  : "bg-white/50"
                              }`}
                            />
                          ))}
                        </div>
                      </>
                    )}
                  </>
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <div className="text-center">
                      <ImageIcon className="h-10 w-10 mx-auto mb-2 text-gray-400" />
                      <div className="text-sm text-muted-foreground">
                        No image available
                      </div>
                    </div>
                  </div>
                )}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  <Badge
                    variant="secondary"
                    className="bg-white/90 text-black backdrop-blur-sm"
                  >
                    {propertyTypeName}
                  </Badge>
                  {property.status && (
                    <Badge
                      variant={
                        property.status.toLowerCase().includes("sale")
                          ? "outline"
                          : "default"
                      }
                      className="backdrop-blur-sm"
                    >
                      {property.status}
                    </Badge>
                  )}
                </div>

                <div className="absolute bottom-4 right-4">
                  <Badge
                    variant="default"
                    className="text-lg font-semibold py-1.5 px-3"
                  >
                    {new Intl.NumberFormat("en-US", {
                      style: "currency",
                      currency: "USD",
                      minimumFractionDigits: 0,
                    }).format(property.price || 0)}
                    {property.listing_type === "rent" && <span>/mo</span>}
                  </Badge>
                </div>
              </div>

              {/* Thumbnail gallery */}
              {propertyImages && propertyImages.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {propertyImages.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImageIndex(index)}
                      className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                        index === activeImageIndex
                          ? "border-primary"
                          : "border-transparent"
                      }`}
                    >
                      <Image
                        src={image.image_url}
                        alt={`Thumbnail ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {property.address
                    ? `${property.address}, ${property.city}, ${property.state} ${property.zip_code}`
                    : property.location}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">Features</h3>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/10 rounded-full">
                        <Bed className="h-4 w-4 text-primary" />
                      </div>
                      <span>{property.bedrooms || 0} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/10 rounded-full">
                        <Bath className="h-4 w-4 text-primary" />
                      </div>
                      <span>{property.bathrooms || 0} Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/10 rounded-full">
                        <Square className="h-4 w-4 text-primary" />
                      </div>
                      <span>{property.area || 0} sqft</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 bg-primary/10 rounded-full">
                        <Tag className="h-4 w-4 text-primary" />
                      </div>
                      <span>
                        {new Intl.NumberFormat("en-US", {
                          style: "currency",
                          currency: "USD",
                          minimumFractionDigits: 0,
                        }).format(property.price || 0)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Property Info</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      <span>Type: {propertyTypeName}</span>
                    </div>
                    {property.year_built && (
                      <div className="flex items-center gap-2">
                        <Home className="h-4 w-4" />
                        <span>Year Built: {property.year_built}</span>
                      </div>
                    )}
                    {property.created_at && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>
                          Listed on: {formatDate(property.created_at)}
                        </span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span>Property ID: {property.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {property.description && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {property.description}
                  </p>
                </div>
              )}

              {property.latitude && property.longitude && (
                <div>
                  <h3 className="font-semibold mb-2">Location</h3>
                  <div className="bg-gray-100 h-[200px] rounded-md flex items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                      Map view at coordinates: {property.latitude},{" "}
                      {property.longitude}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  // You can add logic here to open the edit modal
                }}
              >
                Edit Property
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
