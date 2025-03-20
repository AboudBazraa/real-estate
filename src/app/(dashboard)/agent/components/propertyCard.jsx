"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Bed,
  Bath,
  Square,
  Heart,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  MapPin,
  Calendar,
  Star,
  ImageIcon,
  ExternalLink,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { PropertyDetailsModal } from "./PropertyDetailsModal";
import { PropertyEditForm } from "./PropertyEditForm";
import { PROPERTY_TYPES } from "@/app/(dashboard)/constants/propertype";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import {
  useSupabaseQuery,
  useSupabaseUpdate,
} from "@/shared/hooks/useSupabase";
import { useToast } from "@/shared/hooks/use-toast";
import { useUser } from "@/app/providers/UserProvider";
import Link from "next/link";
import {
  formatCurrency,
  getPropertyTypeLabel,
  getStatusColor,
} from "@/shared/utils/property-utils";
import { ArrowSquareOut, HeartFill, AreaChart } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { cn } from "@/shared/lib/utils";
import { Building, Pencil, Maximize, BedDouble } from "lucide-react";

const PROPERTY_TYPE_NAMES = {
  [PROPERTY_TYPES.HOUSE]: "House",
  [PROPERTY_TYPES.APARTMENT]: "Apartment",
  [PROPERTY_TYPES.CONDO]: "Condo",
  [PROPERTY_TYPES.TOWNHOUSE]: "Townhouse",
  [PROPERTY_TYPES.VILLA]: "Villa",
  [PROPERTY_TYPES.COMMERCIAL]: "Commercial",
};

export function PropertyCard({
  property,
  onView,
  onEdit,
  onDelete,
  showFavorite = false,
  isFavorited = false,
  onToggleFavorite,
  actionPosition = "dropdown",
  showStatus = true,
  variant = "default", // default, compact, grid
  className = "",
}) {
  const { user } = useUser();
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();
  const [isImageLoading, setIsImageLoading] = useState(true);
  const statusColor = getStatusColor(property.status);

  // Determine if actions should be shown in dropdown, footer, or both
  const showDropdown =
    actionPosition === "dropdown" || actionPosition === "both";
  const showFooterActions =
    actionPosition === "footer" || actionPosition === "both";

  const propertyTypeName =
    PROPERTY_TYPE_NAMES[property.property_type] || "Property";

  // Format price with commas
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(property.price);

  // Fetch property images from property_images table
  const { data: propertyImages, isLoading: imagesLoading } = useSupabaseQuery(
    ["property_images", property.id],
    "property_images",
    {
      eq: [{ column: "property_id", value: property.id }],
      order: { column: "display_order", ascending: true },
    }
  );

  // Get the primary image or the first available image
  const primaryImage =
    propertyImages?.find((img) => img.is_primary)?.image_url ||
    propertyImages?.[0]?.image_url;

  // Fetch favorites status from Supabase
  const { data: favoriteData } = useSupabaseQuery(
    ["property_favorites", property.id, user?.id],
    "property_favorites",
    {
      eq: [
        { column: "property_id", value: property.id },
        { column: "user_id", value: user?.id },
      ],
      enabled: !!user?.id,
    }
  );

  // Update favorite status based on data from Supabase
  useEffect(() => {
    if (favoriteData?.length > 0) {
      setIsFavorite(true);
    }
  }, [favoriteData]);

  // Setup favorite mutation
  const updateFavorite = useSupabaseUpdate("property_favorites", {
    invalidateQueries: [["property_favorites", property.id, user?.id]],
  });

  // Toggle favorite status
  const handleToggleFavorite = async (e) => {
    e.stopPropagation();

    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to save favorites",
        variant: "destructive",
      });
      return;
    }

    try {
      if (isFavorite && favoriteData?.[0]?.id) {
        // Remove from favorites
        await updateFavorite.mutateAsync({
          match: { id: favoriteData[0].id },
          data: { is_favorite: false },
        });
      } else {
        // Add to favorites
        await updateFavorite.mutateAsync({
          match: favoriteData?.[0]?.id ? { id: favoriteData[0].id } : null,
          data: {
            property_id: property.id,
            user_id: user.id,
            is_favorite: true,
            created_at: new Date().toISOString(),
          },
        });
      }

      setIsFavorite(!isFavorite);

      toast({
        title: isFavorite ? "Removed from Favorites" : "Added to Favorites",
        description: `${property.title} ${
          isFavorite ? "removed from" : "added to"
        } your favorites`,
      });
    } catch (error) {
      console.error("Favorite error:", error);
      toast({
        title: "Error",
        description: "Could not update favorites. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Handle property deletion
  const handleDelete = async () => {
    try {
      // Use the parent component's delete function
      onDelete?.(property.id);
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    }
  };

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

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onEdit) onEdit(property);
  };

  const handleView = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onView) onView(property);
  };

  const propertyImage = primaryImage || "/placeholder-property.jpg";

  const renderPropertyDetails = () => (
    <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
      {property.bedrooms !== undefined && (
        <div className="flex items-center gap-1">
          <Bed className="h-4 w-4" />
          <span>{property.bedrooms}</span>
        </div>
      )}

      {property.bathrooms !== undefined && (
        <div className="flex items-center gap-1">
          <Bath className="h-4 w-4" />
          <span>{property.bathrooms}</span>
        </div>
      )}

      {property.area && (
        <div className="flex items-center gap-1">
          <AreaChart className="h-4 w-4" />
          <span>{property.area} sqft</span>
        </div>
      )}
    </div>
  );

  const renderPropertyActions = () => {
    if (actionPosition === "dropdown") {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 bg-white/80 backdrop-blur-sm hover:bg-white"
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleView}>
              <Eye className="mr-2 h-4 w-4" />
              View Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Property
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleDelete} className="text-red-600">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Property
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    }

    return (
      <div className="flex gap-2 mt-2">
        <Button size="sm" variant="outline" onClick={handleView}>
          <Eye className="mr-2 h-4 w-4" />
          View
        </Button>
        <Button size="sm" variant="outline" onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
        <Button
          size="sm"
          variant="outline"
          className="text-red-600"
          onClick={handleDelete}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete
        </Button>
      </div>
    );
  };

  const renderCardContent = () => {
    // Compact variant
    if (variant === "compact") {
      return (
        <div className="flex h-full overflow-hidden">
          {/* Property Image */}
          <div className="relative w-1/3 min-w-[120px]">
            {isImageLoading && <Skeleton className="absolute inset-0 z-10" />}
            <Image
              src={property.images?.[0] || "/images/house-placeholder.png"}
              alt={property.title}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsImageLoading(false)}
            />
            {showStatus && (
              <Badge
                variant="outline"
                className={cn("absolute top-2 left-2 z-20", statusColor.badge)}
              >
                {property.status}
              </Badge>
            )}
          </div>

          {/* Property Details */}
          <div className="flex flex-col justify-between p-3 flex-1">
            <div>
              <h3 className="font-medium line-clamp-1 text-sm">
                {property.title}
              </h3>
              <p className="text-muted-foreground text-xs line-clamp-1">
                <MapPin className="inline-block h-3 w-3 mr-1" />
                {property.location}
              </p>
              <p className="text-primary font-semibold text-sm mt-1">
                {formatCurrency(property.price)}
              </p>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center mt-2">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <BedDouble className="h-3 w-3" /> {property.bedrooms}
                </span>
                <span className="flex items-center gap-1">
                  <Bath className="h-3 w-3" /> {property.bathrooms}
                </span>
                <span className="flex items-center gap-1">
                  <Maximize className="h-3 w-3" /> {property.area} ft²
                </span>
              </div>

              {showDropdown && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleView}>
                      <ExternalLink className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEdit}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Grid variant
    if (variant === "grid") {
      return (
        <>
          {/* Property Image */}
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-t-lg">
            {isImageLoading && <Skeleton className="absolute inset-0 z-10" />}
            <Image
              src={property.images?.[0] || "/images/house-placeholder.png"}
              alt={property.title}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsImageLoading(false)}
            />

            {/* Status Badge */}
            {showStatus && (
              <Badge
                variant="outline"
                className={cn("absolute top-2 left-2 z-20", statusColor.badge)}
              >
                {property.status}
              </Badge>
            )}

            {/* Favorite Button */}
            {showFavorite && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 z-20 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleFavorite(e);
                }}
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground"
                  )}
                />
              </Button>
            )}

            {/* Property Type Badge */}
            <Badge
              variant="secondary"
              className="absolute bottom-2 left-2 z-20 bg-background/80 backdrop-blur-sm"
            >
              {getPropertyTypeLabel(property.property_type)}
            </Badge>
          </div>

          {/* Property Details */}
          <CardContent className="p-4">
            <CardTitle className="text-base line-clamp-1">
              {property.title}
            </CardTitle>
            <CardDescription className="line-clamp-1 mt-1 flex items-center text-xs">
              <MapPin className="mr-1 h-3 w-3" />
              {property.location}
            </CardDescription>

            <div className="mt-3 flex items-center justify-between">
              <p className="text-primary font-bold">
                {formatCurrency(property.price)}
              </p>
              {showDropdown && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleView}>
                      <ExternalLink className="mr-2 h-4 w-4" /> View
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleEdit}>
                      <Pencil className="mr-2 h-4 w-4" /> Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        navigator.clipboard.writeText(
                          `${window.location.origin}/properties/${property.id}`
                        )
                      }
                    >
                      <Share2 className="mr-2 h-4 w-4" /> Copy Link
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={handleDelete}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center">
                <BedDouble className="mr-1 h-3 w-3" /> {property.bedrooms}
              </span>
              <span className="flex items-center">
                <Bath className="mr-1 h-3 w-3" /> {property.bathrooms}
              </span>
              <span className="flex items-center">
                <Maximize className="mr-1 h-3 w-3" /> {property.area} ft²
              </span>
            </div>
          </CardContent>

          {/* Footer Actions */}
          {showFooterActions && (
            <CardFooter className="px-4 py-3 pt-0 flex gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={handleView}
              >
                View
              </Button>
              <Button
                variant="default"
                size="sm"
                className="flex-1"
                onClick={handleEdit}
              >
                Edit
              </Button>
            </CardFooter>
          )}
        </>
      );
    }

    // Default variant
    return (
      <>
        <div className="grid grid-cols-12 gap-4">
          {/* Property Image */}
          <div className="relative col-span-12 sm:col-span-4 min-h-[200px] sm:min-h-[180px] rounded-lg overflow-hidden">
            {isImageLoading && <Skeleton className="absolute inset-0 z-10" />}
            <Image
              src={property.images?.[0] || "/images/house-placeholder.png"}
              alt={property.title}
              fill
              className={cn(
                "object-cover transition-opacity duration-300",
                isImageLoading ? "opacity-0" : "opacity-100"
              )}
              onLoad={() => setIsImageLoading(false)}
            />

            {/* Status Badge */}
            {showStatus && (
              <Badge
                variant="outline"
                className={cn("absolute top-2 left-2 z-20", statusColor.badge)}
              >
                {property.status}
              </Badge>
            )}

            {/* Favorite Button */}
            {showFavorite && (
              <Button
                size="icon"
                variant="ghost"
                className="absolute top-2 right-2 z-20 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleToggleFavorite(e);
                }}
              >
                <Heart
                  className={cn(
                    "h-4 w-4",
                    isFavorite
                      ? "fill-red-500 text-red-500"
                      : "text-muted-foreground"
                  )}
                />
              </Button>
            )}
          </div>

          {/* Property Details */}
          <div className="col-span-12 sm:col-span-8 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-lg font-semibold line-clamp-1">
                    {property.title}
                  </h3>
                  <p className="text-muted-foreground text-sm flex items-center">
                    <MapPin className="inline-block h-4 w-4 mr-1" />
                    {property.location}
                  </p>
                </div>
                {showDropdown && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleView}>
                        <ExternalLink className="mr-2 h-4 w-4" /> View
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={handleEdit}>
                        <Pencil className="mr-2 h-4 w-4" /> Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          navigator.clipboard.writeText(
                            `${window.location.origin}/properties/${property.id}`
                          )
                        }
                      >
                        <Share2 className="mr-2 h-4 w-4" /> Copy Link
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={handleDelete}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash className="mr-2 h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>

              <div className="my-2">
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {property.description}
                </p>
              </div>

              <div className="flex items-center gap-4 my-3">
                <Badge variant="secondary" className="flex items-center">
                  <Building className="mr-1 h-3 w-3" />
                  {getPropertyTypeLabel(property.property_type)}
                </Badge>
                <span className="flex items-center text-muted-foreground text-sm">
                  <BedDouble className="mr-1 h-4 w-4" /> {property.bedrooms}{" "}
                  Beds
                </span>
                <span className="flex items-center text-muted-foreground text-sm">
                  <Bath className="mr-1 h-4 w-4" /> {property.bathrooms} Baths
                </span>
                <span className="flex items-center text-muted-foreground text-sm">
                  <Maximize className="mr-1 h-4 w-4" /> {property.area} ft²
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2">
              <p className="text-primary text-lg font-bold">
                {formatCurrency(property.price)}
              </p>

              {showFooterActions && (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleView}>
                    View
                  </Button>
                  <Button variant="default" size="sm" onClick={handleEdit}>
                    Edit
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </>
    );
  };

  const CardComponent = ({ children, onClick }) => {
    // If onView is provided, make the entire card clickable
    if (onClick) {
      return (
        <Card
          className={cn(
            "overflow-hidden hover:shadow-md transition-shadow",
            variant === "compact" ? "h-[120px]" : "",
            className
          )}
          onClick={onClick}
        >
          {children}
        </Card>
      );
    }
    // Otherwise, just render a regular card
    return (
      <Card
        className={cn(
          "overflow-hidden hover:shadow-md transition-shadow",
          variant === "compact" ? "h-[120px]" : "",
          className
        )}
      >
        {children}
      </Card>
    );
  };

  return <CardComponent onClick={onView}>{renderCardContent()}</CardComponent>;
}
