"use client";

import { Property as BaseProperty } from "@/shared/hooks/useProperties";
import { Card, CardContent, CardFooter } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Heart,
  BedDouble,
  Bath,
  Home,
  MapPin,
  ArrowUpRight,
  Bed,
} from "lucide-react";
import { formatCurrency } from "@/shared/lib/utils";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/shared/lib/utils";

// UI Property with additional display fields
interface UIProperty {
  id: string;
  name: string;
  description: string;
  location: string;
  featured: boolean;
  beds: number;
  baths: number;
  squareFeet: number;
  pricePerMonth: number;
  propertyType: string;
  images: string[];
}

interface PropertyCardProps {
  property: UIProperty;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
  isCompact?: boolean;
}

export function PropertyCard({
  property,
  isFavorite,
  onFavoriteToggle,
  isCompact = false,
}: PropertyCardProps) {
  if (isCompact) {
    return (
      <Card className="overflow-hidden hover:shadow-md transition-all duration-300 rounded-xl border-0 p-0 h-44 bg-card">
        <CardContent className="p-2 flex">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative sm:w-2/5 overflow-hidden">
              <div className="aspect-video sm:h-40 relative">
                <Image
                  src={
                    property.images[0] ||
                    "/placeholder.svg?height=600&width=800"
                  }
                  alt={property.name}
                  fill
                  sizes="(max-width: 640px) 100vw, 40vw"
                  priority
                  className="object-cover transition-transform rounded-xl duration-700"
                  style={{ objectPosition: "center" }}
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-1 left-1 bg-background/90 hover:bg-background rounded-lg h-7 w-7 z-10 shadow-md"
                onClick={(e) => {
                  e.preventDefault();
                  onFavoriteToggle();
                }}
              >
                <Heart
                  className={`h-4 w-4 ${
                    isFavorite ? "fill-destructive text-destructive" : ""
                  }`}
                />
                <span className="sr-only">Toggle favorite</span>
              </Button>
            </div>

            <div className="flex flex-col justify-between">
              <div className="flex flex-col">
                <h3 className="font-semibold text-lg line-clamp-1">
                  {property.name}
                </h3>
                <div className="flex items-center text-muted-foreground text-sm">
                  <MapPin className="h-3.5 w-3.5 mr-1.5" />
                  <span className="line-clamp-1">
                    {property.location}, Yemen
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {property.description.slice(0, 20)}...
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-between">
                <div className="flex items-center gap-5 text-sm py-2 border-b border-border mb-3">
                  <div className="flex items-center">
                    <BedDouble className="h-6 w-6 mr-1.5 text-muted-foreground bg-muted rounded-md p-1" />
                    <span className="font-medium">{property.beds}</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className="h-6 w-6 mr-1.5 text-muted-foreground bg-muted rounded-md p-1" />
                    <span className="font-medium">{property.baths}</span>
                  </div>
                  <div className="flex items-center">
                    <Home className="h-6 w-6 mr-1.5 text-muted-foreground bg-muted rounded-md p-1" />
                    <span className="font-medium">
                      {property.squareFeet} m²
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-3 sm:mt-0">
                  <Badge
                    variant="secondary"
                    className="text-base font-semibold"
                  >
                    {formatCurrency(property.pricePerMonth)}/mo
                  </Badge>
                  <Button asChild variant="outline" size="sm" className="gap-1">
                    <Link href={`/search/${property.id}`}>
                      View
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Link href={`/search/${property.id}`}>
      <Card className="overflow-hidden hover:shadow-md duration-200 rounded-xl p-3 pb-5 border-0 bg-card">
        <div className="relative">
          <div className="aspect-[4/3] relative overflow-hidden">
            <Image
              src={
                property.images[0] || "/placeholder.svg?height=600&width=800"
              }
              alt={property.name}
              fill
              className="object-cover transition-transform duration-500 rounded-xl"
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/50 hover:bg-background rounded-2xl h-9 w-9"
            onClick={(e) => {
              e.preventDefault();
              onFavoriteToggle();
            }}
          >
            <Heart
              className={cn(
                "h-5 w-5",
                isFavorite ? "fill-destructive text-destructive" : ""
              )}
            />
            <span className="sr-only">Toggle favorite</span>
          </Button>
          <Badge
            variant="outline"
            className="absolute bottom-3 left-3 font-semibold bg-background/80 backdrop-blur-sm px-2"
          >
            {property.propertyType}
          </Badge>
        </div>

        <CardContent className="px-2 -mt-4">
          <div className="space-y-2 flex flex-col">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold text-xl line-clamp-1">
                {property.name}
              </h3>
              <div className="flex items-center text-muted-foreground font-bold text-xl">
                {formatCurrency(property.pricePerMonth)}/mo
              </div>
            </div>

            <div className="flex items-center text-muted-foreground text-sm">
              <MapPin className="h-3.5 w-3.5 mr-1.5" />
              <span className="line-clamp-1">{property.location}, Yemen</span>
            </div>
          </div>

          <div className="flex items-center gap-5 mt-2 text-sm">
            <div className="flex items-center">
              <BedDouble className="h-7 w-7 mr-1.5 text-muted-foreground border border-border rounded-md p-1 bg-muted" />
              <span className="font-medium">
                {property.beds} {property.beds === 1 ? "bed" : "beds"}
              </span>
            </div>
            <div className="flex items-center">
              <Bath className="h-7 w-7 mr-1.5 text-muted-foreground border border-border rounded-md p-1 bg-muted" />
              <span className="font-medium">
                {property.baths} {property.baths === 1 ? "bath" : "baths"}
              </span>
            </div>
            <div className="flex items-center">
              <Home className="h-7 w-7 mr-1.5 text-muted-foreground border border-border rounded-md p-1 bg-muted" />
              <span className="font-medium">{property.squareFeet} m²</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
