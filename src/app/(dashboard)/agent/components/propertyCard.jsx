"use client";

import { useState, useEffect } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Bed,
  Bath,
  AreaChart,
  Heart,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  MapPin,
  Building,
  Share2,
} from "lucide-react";
import Image from "next/image";
import { useUser } from "@/shared/providers/UserProvider";
import {
  formatCurrency,
  getPropertyTypeLabel,
  getStatusColor,
} from "@/shared/utils/property-utils";
import { cn } from "@/shared/lib/utils";
import { Skeleton } from "@/shared/components/ui/skeleton";

export function PropertyCard({
  property,
  onView,
  onEdit,
  onDelete,
  showFavorite = false,
  variant = "default", // default, compact, grid
  className = "",
}) {
  const { user } = useUser();
  const [isImageLoading, setIsImageLoading] = useState(true);

  // Handle property actions
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

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (onDelete) onDelete(property);
  };

  // Get the primary image or placeholder
  const propertyImage = property.images?.[0] || "/images/house-placeholder.png";

  // For grid variant (card style)
  if (variant === "grid") {
    return (
      <Card
        className={cn(
          "overflow-hidden hover:shadow-md transition-shadow",
          className
        )}
      >
        {/* Property Image */}
        <div className="relative aspect-[4/3] w-full overflow-hidden">
          {isImageLoading && <Skeleton className="absolute inset-0 z-10" />}
          <Image
            src={propertyImage}
            alt={property.title}
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              isImageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsImageLoading(false)}
          />

          {/* Status Badge */}
          <Badge
            variant="outline"
            className={cn(
              "absolute top-2 left-2 z-20",
              getStatusColor(property.status)
            )}
          >
            {property.status}
          </Badge>

          {/* Actions Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 z-20 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90"
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleView}>
                <Eye className="mr-2 h-4 w-4" /> View
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={(e) => {
                  e.stopPropagation();
                  navigator.clipboard.writeText(
                    `${window.location.origin}/properties/${property.id}`
                  );
                }}
              >
                <Share2 className="mr-2 h-4 w-4" /> Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleDelete}
                className="text-destructive focus:text-destructive"
              >
                <Trash2 className="mr-2 h-4 w-4" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
          <h3 className="text-base font-medium line-clamp-1">
            {property.title}
          </h3>
          <p className="line-clamp-1 mt-1 flex items-center text-xs text-muted-foreground">
            <MapPin className="mr-1 h-3 w-3" />
            {property.location}
          </p>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-primary font-bold">
              {formatCurrency(property.price)}
            </p>
          </div>

          <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center">
              <Bed className="mr-1 h-3 w-3" /> {property.bedrooms}
            </span>
            <span className="flex items-center">
              <Bath className="mr-1 h-3 w-3" /> {property.bathrooms}
            </span>
            <span className="flex items-center">
              <AreaChart className="mr-1 h-3 w-3" /> {property.area} ft²
            </span>
          </div>
        </CardContent>

        {/* Footer Actions */}
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
      </Card>
    );
  }

  // Default variant (horizontal layout)
  return (
    <Card
      className={cn(
        "overflow-hidden hover:shadow-md transition-shadow",
        className
      )}
    >
      <div className="grid grid-cols-12 gap-4 p-4">
        {/* Property Image */}
        <div className="relative col-span-12 sm:col-span-4 min-h-[200px] sm:min-h-[180px] rounded-lg overflow-hidden">
          {isImageLoading && <Skeleton className="absolute inset-0 z-10" />}
          <Image
            src={propertyImage}
            alt={property.title}
            fill
            className={cn(
              "object-cover transition-opacity duration-300",
              isImageLoading ? "opacity-0" : "opacity-100"
            )}
            onLoad={() => setIsImageLoading(false)}
          />

          {/* Status Badge */}
          <Badge
            variant="outline"
            className={cn(
              "absolute top-2 left-2 z-20",
              getStatusColor(property.status)
            )}
          >
            {property.status}
          </Badge>
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={handleView}>
                    <Eye className="mr-2 h-4 w-4" /> View
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleEdit}>
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      navigator.clipboard.writeText(
                        `${window.location.origin}/properties/${property.id}`
                      );
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" /> Copy Link
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleDelete}
                    className="text-destructive focus:text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                <Bed className="mr-1 h-4 w-4" /> {property.bedrooms} Beds
              </span>
              <span className="flex items-center text-muted-foreground text-sm">
                <Bath className="mr-1 h-4 w-4" /> {property.bathrooms} Baths
              </span>
              <span className="flex items-center text-muted-foreground text-sm">
                <AreaChart className="mr-1 h-4 w-4" /> {property.area} ft²
              </span>
            </div>
          </div>

          <div className="flex items-center justify-between mt-2">
            <p className="text-primary text-lg font-bold">
              {formatCurrency(property.price)}
            </p>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleView}>
                View
              </Button>
              <Button variant="default" size="sm" onClick={handleEdit}>
                Edit
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
