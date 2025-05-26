"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { formatCurrency } from "@/shared/utils/property-utils";
import {
  Heart,
  Building2,
  Bed,
  Bath,
  Move,
  Eye,
  Info,
  Edit,
  Trash2,
  MapPin,
  ArrowUpRight,
  BedDouble,
  Home,
} from "lucide-react";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { cn } from "@/shared/lib/utils";

// This type represents individual property fields
export interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  status: string;
  primaryImage: string | null;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  property_type?: string;
  size?: number;
  isLoading?: boolean;
  isRTL?: boolean;

  // Support for alternative property object format
  property?: any;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onToggleFavorite?: () => void;
  variant?: string;
  showStatus?: boolean;
}

export function PropertyCard({
  id,
  title,
  price,
  status,
  primaryImage,
  address,
  bedrooms = 0,
  bathrooms = 0,
  property_type = "",
  size = 0,
  isLoading = false,
  isRTL = false,

  // Alternative property object format
  property,
  onView,
  onEdit,
  onDelete,
  onToggleFavorite,
  variant = "default",
  showStatus = false,
}: PropertyCardProps) {
  // If property object was provided, extract individual fields from it
  if (property) {
    id = property.id;
    title = property.title || property.name;
    price = property.price;
    status = property.status;
    primaryImage = property.primaryImage || property.images?.[0];
    address = property.address;
    bedrooms = property.bedrooms;
    bathrooms = property.bathrooms;
    property_type = property.property_type;
    size = property.size;
  }

  const [isFavorite, setIsFavorite] = useState(false);

  if (isLoading) {
    return (
      <Card className="overflow-hidden h-full transition-all">
        <div className="relative h-52 w-full">
          <Skeleton className="h-full w-full" />
        </div>
        <CardContent className="p-4">
          <Skeleton className="h-5 w-3/4 mb-2" />
          <Skeleton className="h-4 w-1/2 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-4" />
          <div className="flex justify-between mt-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <Skeleton className="h-9 w-full" />
        </CardFooter>
      </Card>
    );
  }

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onToggleFavorite) {
      onToggleFavorite();
    } else {
      setIsFavorite(!isFavorite);
    }
  };

  // Render compact variant if specified
  if (variant === "compact") {
    return (
      <Card
        className={`overflow-hidden hover:shadow-md dark:hover:shadow-zinc-800/30 transition-all duration-300 rounded-xl border-0 dark:bg-slate-900 p-0 h-auto sm:h-44 ${
          isRTL ? "rtl" : ""
        }`}
      >
        <CardContent className="p-2 flex">
          <div
            className={`flex flex-col sm:flex-row gap-4 w-full ${
              isRTL ? "sm:flex-row-reverse" : ""
            }`}
          >
            <div className="relative w-full sm:w-2/5 overflow-hidden">
              <div className="aspect-video h-48 sm:h-40 relative">
                {primaryImage ? (
                  <Image
                    src={primaryImage}
                    alt={title}
                    fill
                    sizes="(max-width: 640px) 100vw, 40vw"
                    priority
                    className="object-cover transition-transform rounded-xl duration-700"
                    style={{ objectPosition: "center" }}
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-muted dark:bg-zinc-800 rounded-xl">
                    <Building2 className="h-10 w-10 text-muted-foreground" />
                  </div>
                )}
              </div>
              {showStatus && (
                <Badge
                  variant="outline"
                  className={`absolute top-1 ${
                    isRTL ? "left-1" : "right-1"
                  } z-10 ${
                    status === "For Sale" || status === "ACTIVE"
                      ? "bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
                      : status === "For Rent" || status === "PENDING"
                      ? "bg-amber-600 hover:bg-amber-700 dark:bg-amber-700 dark:hover:bg-amber-800"
                      : "bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-800"
                  } text-white border-none`}
                >
                  {status}
                </Badge>
              )}
              <Button
                variant="ghost"
                size="icon"
                className={`absolute top-1 ${
                  isRTL ? "right-1" : "left-1"
                } bg-white/90 hover:bg-white dark:bg-zinc-800/90 dark:hover:bg-zinc-800 rounded-lg h-7 w-7 z-10 shadow-md`}
                onClick={toggleFavorite}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite ? "fill-red-500 text-red-500" : ""
                  }`}
                />
                <span className="sr-only">Toggle favorite</span>
              </Button>
            </div>

            <div
              className={`flex flex-col justify-between flex-1 ${
                isRTL ? "text-right" : ""
              }`}
            >
              <div className="flex flex-col">
                <h3 className="font-semibold text-lg line-clamp-1">{title}</h3>
                <div
                  className={`flex items-center text-muted-foreground text-sm ${
                    isRTL ? "flex-row-reverse justify-end" : ""
                  }`}
                >
                  <MapPin
                    className={`h-3.5 w-3.5 ${isRTL ? "ml-1.5" : "mr-1.5"}`}
                  />
                  <span className="line-clamp-1">{address}</span>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between">
                <div
                  className={`flex items-center gap-3 md:gap-5 text-sm py-2 border-b border-border dark:border-zinc-700 mb-3 w-full overflow-x-auto ${
                    isRTL ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`flex items-center ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <BedDouble
                      className={`h-6 w-6 ${
                        isRTL ? "ml-1.5" : "mr-1.5"
                      } text-muted-foreground bg-slate-100 dark:bg-zinc-800 rounded-md p-1`}
                    />
                    <span className="font-medium">{bedrooms}</span>
                  </div>
                  <div
                    className={`flex items-center ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Bath
                      className={`h-6 w-6 ${
                        isRTL ? "ml-1.5" : "mr-1.5"
                      } text-muted-foreground bg-slate-100 dark:bg-zinc-800 rounded-md p-1`}
                    />
                    <span className="font-medium">{bathrooms}</span>
                  </div>
                  <div
                    className={`flex items-center ${
                      isRTL ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Home
                      className={`h-6 w-6 ${
                        isRTL ? "ml-1.5" : "mr-1.5"
                      } text-muted-foreground bg-slate-100 dark:bg-zinc-800 rounded-md p-1`}
                    />
                    <span className="font-medium whitespace-nowrap">
                      {size} sqft
                    </span>
                  </div>
                </div>

                <div
                  className={`flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 mt-3 sm:mt-0 w-full ${
                    isRTL ? "xs:flex-row-reverse" : ""
                  }`}
                >
                  <Badge
                    variant="secondary"
                    className="text-base font-semibold dark:bg-zinc-800"
                  >
                    {formatCurrency(price)}
                  </Badge>
                  <div className="flex gap-1 w-full xs:w-auto justify-end">
                    {onView && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onView}
                        className={`gap-1 ${isRTL ? "flex-row-reverse" : ""}`}
                      >
                        <Eye className="h-3.5 w-3.5" />{" "}
                        <span className="hidden xs:inline">View</span>
                      </Button>
                    )}
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={onEdit}
                        className="gap-1"
                      >
                        <Edit className="h-3.5 w-3.5" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={onDelete}
                        className="gap-1 h-8 w-8 p-0"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Default variant - full property card
  return (
    <Card
      className={`overflow-hidden hover:shadow-md hover:scale-[1.01] dark:hover:shadow-zinc-800/30 transition-all duration-300 h-full relative ${
        isRTL ? "rtl" : ""
      }`}
    >
      <div className="relative h-52 w-full overflow-hidden">
        {primaryImage ? (
          <Link href={`/agent/properties/${id}`}>
            <Image
              src={primaryImage}
              alt={title}
              fill
              priority
              className="object-cover transition-transform hover:scale-105 duration-700"
              style={{ objectPosition: "center" }}
            />
          </Link>
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-muted dark:bg-zinc-800">
            <Building2 className="h-10 w-10 text-muted-foreground" />
          </div>
        )}

        <Button
          variant="ghost"
          size="icon"
          className={`absolute top-2 ${
            isRTL ? "right-2" : "left-2"
          } bg-white/90 hover:bg-white dark:bg-black/50 dark:hover:bg-black/70 rounded-full h-8 w-8 shadow-md`}
          onClick={toggleFavorite}
        >
          <Heart
            className={`h-4 w-4 ${
              isFavorite ? "fill-red-500 text-red-500" : ""
            }`}
          />
          <span className="sr-only">Toggle favorite</span>
        </Button>

        <Badge
          className={`absolute top-2 ${isRTL ? "left-2" : "right-2"} ${
            status === "For Sale"
              ? "bg-blue-600 hover:bg-blue-700"
              : status === "For Rent"
              ? "bg-amber-600 hover:bg-amber-700"
              : "bg-green-600 hover:bg-green-700"
          } text-white border-0`}
        >
          {status}
        </Badge>
      </div>

      <CardContent className={`p-4 ${isRTL ? "text-right" : ""}`}>
        <Link href={`/agent/properties/${id}`}>
          <h3 className="font-semibold text-xl hover:text-blue-600 transition-colors mb-2 line-clamp-1">
            {title}
          </h3>
        </Link>

        <div
          className={`flex items-center text-muted-foreground text-sm mb-3 ${
            isRTL ? "flex-row-reverse justify-end" : ""
          }`}
        >
          <MapPin
            className={`h-4 w-4 ${isRTL ? "ml-1" : "mr-1"} flex-shrink-0`}
          />
          <span className="truncate">{address}</span>
        </div>

        <div
          className={`flex items-center justify-between mb-4 flex-wrap ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          <p className="text-xl font-bold text-primary">
            {formatCurrency(price)}
          </p>
        </div>

        <div
          className={`flex justify-between border-t border-border pt-4 ${
            isRTL ? "flex-row-reverse" : ""
          }`}
        >
          {bedrooms > 0 && (
            <div
              className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              title="Bedrooms"
            >
              <Bed
                className={`h-4 w-4 ${
                  isRTL ? "ml-1.5" : "mr-1.5"
                } text-muted-foreground`}
              />
              <span>{bedrooms}</span>
            </div>
          )}
          {bathrooms > 0 && (
            <div
              className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              title="Bathrooms"
            >
              <Bath
                className={`h-4 w-4 ${
                  isRTL ? "ml-1.5" : "mr-1.5"
                } text-muted-foreground`}
              />
              <span>{bathrooms}</span>
            </div>
          )}
          {size > 0 && (
            <div
              className={`flex items-center ${isRTL ? "flex-row-reverse" : ""}`}
              title="Size"
            >
              <Move
                className={`h-4 w-4 ${
                  isRTL ? "ml-1.5" : "mr-1.5"
                } text-muted-foreground`}
              />
              <span>{size} sqft</span>
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className={`p-4 pt-0 ${isRTL ? "flex-row-reverse" : ""}`}>
        <Button asChild className={`w-full ${isRTL ? "flex-row-reverse" : ""}`}>
          <Link href={`/agent/properties/${id}`}>
            <ArrowUpRight className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />{" "}
            View Property
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
