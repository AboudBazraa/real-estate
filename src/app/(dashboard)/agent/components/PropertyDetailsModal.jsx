"use client";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
} from "@/shared/components/ui/drawer";
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
  ExternalLink,
  Share2,
  Maximize2,
  X,
  Heart,
  ArrowUpRight,
} from "lucide-react";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { useSupabaseItem, useSupabaseQuery } from "@/shared/hooks/useSupabase";
import { PROPERTY_TYPES } from "@/app/(dashboard)/constants/propertype";
import { useState, useEffect, useRef } from "react";
import { PropertyEditForm } from "./PropertyEditForm";
import { cn } from "@/shared/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/shared/components/ui/carousel";
import { Separator } from "@/shared/components/ui/separator";

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
  const [showEditForm, setShowEditForm] = useState(false);
  const [isImageFullscreen, setIsImageFullscreen] = useState(false);
  const [carouselApi, setCarouselApi] = useState(null);
  const [favorited, setFavorited] = useState(false);
  const thumbnailsRef = useRef(null);

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
  useEffect(() => {
    if (isOpen) {
      setActiveImageIndex(0);
      setIsImageFullscreen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!carouselApi) return;

    const onSelect = () => {
      setActiveImageIndex(carouselApi.selectedScrollSnap());

      // Scroll the thumbnail into view
      if (thumbnailsRef.current) {
        const thumbnails = thumbnailsRef.current.querySelectorAll("button");
        if (thumbnails[carouselApi.selectedScrollSnap()]) {
          thumbnails[carouselApi.selectedScrollSnap()].scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center",
          });
        }
      }
    };

    carouselApi.on("select", onSelect);
    return () => {
      carouselApi.off("select", onSelect);
    };
  }, [carouselApi]);

  const toggleImageFullscreen = () => {
    setIsImageFullscreen(!isImageFullscreen);
  };

  const selectThumbnail = (index) => {
    setActiveImageIndex(index);
    carouselApi?.scrollTo(index);
  };

  const toggleFavorite = () => {
    setFavorited(!favorited);
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

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  // Share property function
  const shareProperty = () => {
    // In a real implementation, this would open a share dialog
    console.log("Sharing property:", propertyId);
  };

  return (
    <>
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[90vh] overflow-hidden">
          <DrawerHeader className="px-4 py-3 border-b relative">
            <DrawerTitle className="text-lg font-semibold">
              Property Details
            </DrawerTitle>
            <DrawerDescription className="text-xs">
              View detailed information about this property
            </DrawerDescription>
            <div className="absolute right-4 top-4 flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-muted"
                onClick={toggleFavorite}
              >
                <Heart
                  className={cn(
                    "h-5 w-5 transition-colors",
                    favorited
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground"
                  )}
                />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full hover:bg-muted"
                onClick={shareProperty}
              >
                <Share2 className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto divide-y scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent">
            {isLoading && (
              <div className="py-16 text-center flex flex-col items-center gap-3">
                <div className="rounded-full bg-primary/10 p-3">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
                <p className="text-sm text-muted-foreground">
                  Loading property details...
                </p>
              </div>
            )}

            {isError && (
              <div className="py-10 mx-4 my-4 text-center text-destructive bg-destructive/5 rounded-lg p-4">
                <p className="font-medium">Failed to load property details</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Please try again later
                </p>
              </div>
            )}

            {property && !isLoading && (
              <div className="pb-20">
                {/* Image Gallery - Fullscreen View */}
                {isImageFullscreen &&
                  propertyImages &&
                  propertyImages.length > 0 && (
                    <div className="fixed inset-0 bg-black z-50 flex items-center justify-center animate-in fade-in duration-300">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-4 right-4 h-9 w-9 rounded-full bg-black/50 text-white backdrop-blur-sm z-50 hover:bg-black/70 transition-colors"
                        onClick={toggleImageFullscreen}
                      >
                        <X className="h-5 w-5" />
                      </Button>

                      <div className="w-full h-full max-w-6xl mx-auto px-8">
                        <Carousel
                          opts={{
                            align: "center",
                            loop: true,
                            startIndex: activeImageIndex,
                          }}
                          setApi={setCarouselApi}
                          className="w-full h-full flex items-center"
                        >
                          <CarouselContent className="h-full">
                            {propertyImages.map((image, index) => (
                              <CarouselItem
                                key={index}
                                className="h-full flex items-center justify-center p-4"
                              >
                                <div className="relative w-full h-4/5 max-h-[80vh]">
                                  <Image
                                    src={image.image_url}
                                    alt={`Property image ${index + 1}`}
                                    fill
                                    sizes="90vw"
                                    className="object-contain"
                                    priority={index === activeImageIndex}
                                  />
                                </div>
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                          <CarouselPrevious className="left-4 text-white bg-black/50 hover:bg-black/70 border-none transition-all" />
                          <CarouselNext className="right-4 text-white bg-black/50 hover:bg-black/70 border-none transition-all" />
                        </Carousel>

                        <div className="absolute bottom-8 left-0 right-0 flex justify-center">
                          <div className="flex gap-2 px-3 py-1.5 bg-black/60 backdrop-blur-sm rounded-full">
                            {propertyImages.map((_, index) => (
                              <button
                                key={index}
                                onClick={() => carouselApi?.scrollTo(index)}
                                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                  index === activeImageIndex
                                    ? "bg-white scale-110"
                                    : "bg-white/40 hover:bg-white/70"
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                {/* Image Gallery - Standard View */}
                <div className="relative">
                  {propertyImages && propertyImages.length > 0 ? (
                    <div className="h-96 bg-muted overflow-hidden">
                      <Carousel
                        opts={{
                          align: "start",
                          loop: true,
                        }}
                        setApi={setCarouselApi}
                        className="w-full h-full"
                      >
                        <CarouselContent>
                          {propertyImages.map((image, index) => (
                            <CarouselItem key={index} className="h-96">
                              <div className="relative h-full w-full overflow-hidden bg-muted">
                                <Image
                                  src={image.image_url}
                                  alt={`Property image ${index + 1}`}
                                  fill
                                  sizes="(max-width: 768px) 100vw, 50vw"
                                  className="object-contain transition-all hover:opacity-95 duration-300 ease-in-out cursor-pointer"
                                  onClick={toggleImageFullscreen}
                                  priority={index === 0}
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                        <CarouselPrevious className="left-3 h-9 w-9 bg-black/40 hover:bg-black/60 text-white border-none transition-colors" />
                        <CarouselNext className="right-3 h-9 w-9 bg-black/40 hover:bg-black/60 text-white border-none transition-colors" />
                      </Carousel>

                      {/* Property Type and Expand buttons */}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2 z-10">
                        <Badge
                          variant="secondary"
                          className="bg-black/60 text-white backdrop-blur-sm border-0 transition-colors"
                        >
                          {propertyTypeName}
                        </Badge>

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full bg-black/40 hover:bg-black/60 text-white p-1.5 transition-colors"
                          onClick={toggleImageFullscreen}
                        >
                          <Maximize2 className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Price badge */}
                      <div className="absolute bottom-3 right-3 z-10">
                        <Badge
                          variant="default"
                          className="text-base font-semibold py-1.5 px-3 bg-primary shadow-sm"
                        >
                          {formatCurrency(property.price)}
                          {property.listing_type === "rent" && <span>/mo</span>}
                        </Badge>
                      </div>

                      {/* Image indicators */}
                      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 px-2.5 py-1.5 rounded-full bg-black/40 backdrop-blur-sm z-10">
                        {propertyImages.map((_, index) => (
                          <button
                            key={index}
                            onClick={() => carouselApi?.scrollTo(index)}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              index === activeImageIndex
                                ? "bg-white scale-110"
                                : "bg-white/40 hover:bg-white/70"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-96 w-full flex items-center justify-center bg-muted">
                      <div className="text-center">
                        <div className="p-4 bg-muted-foreground/10 rounded-full mx-auto mb-3">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          No image available
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div className="px-4">
                  {/* Thumbnail gallery */}
                  {propertyImages && propertyImages.length > 1 && (
                    <div
                      ref={thumbnailsRef}
                      className="flex gap-2 overflow-x-auto py-3 scrollbar-thin scrollbar-thumb-muted-foreground/20 scrollbar-track-transparent"
                    >
                      {propertyImages.map((image, index) => (
                        <button
                          key={index}
                          onClick={() => selectThumbnail(index)}
                          className={cn(
                            "relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 transition-all duration-200",
                            index === activeImageIndex
                              ? "border-2 border-primary shadow ring-2 ring-primary/20 scale-105"
                              : "border border-muted/50 opacity-70 hover:opacity-100"
                          )}
                        >
                          <Image
                            src={image.image_url}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Property Header */}
                  <div className="pt-3 pb-4">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-xl font-semibold leading-tight">
                        {property.title}
                      </h2>
                      {property.status && (
                        <Badge
                          variant={
                            property.status === "ACTIVE"
                              ? "default"
                              : property.status === "PENDING"
                              ? "secondary"
                              : property.status === "SOLD" ||
                                property.status === "RENTED"
                              ? "outline"
                              : "destructive"
                          }
                          className="ml-2 px-2 text-xs font-medium"
                        >
                          {property.status}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="truncate">
                        {property.address
                          ? `${property.address}, ${property.city}, ${property.state} ${property.zip_code}`
                          : property.location}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Quick Facts */}
                <div className="px-4 py-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl hover:bg-muted/40 transition-colors">
                      <div className="p-1.5 bg-primary/10 rounded-full mb-1.5">
                        <Bed className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">
                        {property.bedrooms || 0}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Beds
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl hover:bg-muted/40 transition-colors">
                      <div className="p-1.5 bg-primary/10 rounded-full mb-1.5">
                        <Bath className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">
                        {property.bathrooms || 0}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Baths
                      </span>
                    </div>
                    <div className="flex flex-col items-center justify-center p-3 bg-muted/30 rounded-xl hover:bg-muted/40 transition-colors">
                      <div className="p-1.5 bg-primary/10 rounded-full mb-1.5">
                        <Square className="h-4 w-4 text-primary" />
                      </div>
                      <span className="text-sm font-medium">
                        {property.area || 0}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Sq Ft
                      </span>
                    </div>
                  </div>
                </div>

                {/* Property Info Section */}
                <div className="px-4 py-4">
                  <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                    Property Info
                  </h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-lg">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/50">
                        <Building2 className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Type
                        </span>
                        <p className="font-medium">{propertyTypeName}</p>
                      </div>
                    </div>
                    {property.year_built && (
                      <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-lg">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/50">
                          <Home className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">
                            Year Built
                          </span>
                          <p className="font-medium">{property.year_built}</p>
                        </div>
                      </div>
                    )}
                    {property.created_at && (
                      <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-lg">
                        <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/50">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div>
                          <span className="text-xs text-muted-foreground">
                            Listed
                          </span>
                          <p className="font-medium">
                            {formatDate(property.created_at)}
                          </p>
                        </div>
                      </div>
                    )}
                    <div className="flex items-center gap-2 bg-muted/20 p-3 rounded-lg">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted/50">
                        <Tag className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">
                          Property ID
                        </span>
                        <p className="font-medium">
                          {property.id.substring(0, 8)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {property.description && (
                  <div className="px-4 py-4">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                      Description
                    </h3>
                    <div className="bg-muted/10 p-4 rounded-xl border border-muted/30">
                      <p className="text-sm leading-relaxed">
                        {property.description}
                      </p>
                    </div>
                  </div>
                )}

                {property.latitude && property.longitude && (
                  <div className="px-4 py-4">
                    <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground mb-3">
                      Location
                    </h3>
                    <div className="bg-muted/20 border rounded-xl p-4 flex flex-col items-center justify-center">
                      <div className="text-center">
                        <div className="inline-flex items-center gap-1.5 text-sm">
                          <MapPin className="h-4 w-4 text-primary" />
                          <span className="font-medium">Map Location</span>
                        </div>
                        <div className="text-xs text-muted-foreground mt-1">
                          {property.latitude.toFixed(6)},{" "}
                          {property.longitude.toFixed(6)}
                        </div>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-3 h-8 text-xs group"
                      >
                        <ExternalLink className="h-3 w-3 mr-1.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        View on Map
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <DrawerFooter className="px-4 pt-2 pb-5 bg-background border-t shadow-md">
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={onClose} className="h-10">
                Close
              </Button>
              <Button
                onClick={() => {
                  setShowEditForm(true);
                  onClose();
                }}
                className="h-10 font-medium"
              >
                Edit Property
              </Button>
            </div>

            <div className="text-xs text-center text-muted-foreground mt-2">
              Last updated:{" "}
              {property &&
                formatDate(property.updated_at || property.created_at)}
            </div>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>

      {/* Property Edit Form */}
      {showEditForm && (
        <PropertyEditForm
          propertyId={propertyId}
          isOpen={showEditForm}
          onClose={() => setShowEditForm(false)}
        />
      )}
    </>
  );
}
