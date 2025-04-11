"use client";

import type { Property } from "@/shared/hooks/useProperties";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Heart, Bed, Bath, Home, MapPin } from "lucide-react";
import { formatCurrency } from "@/shared/lib/utils";
import Link from "next/link";
import Image from "next/image";

// UI-specific property type for display
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
  images: string[];
}

interface PropertyCardCompactProps {
  property: Property;
  isFavorite: boolean;
  onFavoriteToggle: () => void;
}

export function PropertyCardCompact({
  property,
  isFavorite,
  onFavoriteToggle,
}: PropertyCardCompactProps) {
  // Transform the database Property into a UI-friendly property object
  const uiProperty: UIProperty = {
    id: property.id,
    name: property.title,
    description: property.description,
    location: property.location,
    featured: property.featured,
    beds: property.bedrooms,
    baths: property.bathrooms,
    squareFeet: property.area,
    pricePerMonth: property.price,
    images:
      property.images?.map((img) => img.image_url) ||
      ([property.primaryImage].filter(Boolean) as string[]),
  };

  return (
    <Card className="overflow-hidden ">
      <CardContent className="p-0 ">
        <div className="flex flex-col sm:flex-row">
          <div className="relative sm:w-1/3">
            <div className="aspect-video sm:h-full relative">
              <Image
                src={
                  uiProperty.images[0] ||
                  "/placeholder.svg?height=600&width=800"
                }
                alt={uiProperty.name}
                className="object-cover"
                fill
              />
            </div>
            {uiProperty.featured && (
              <Badge className="absolute top-2 left-2">Featured</Badge>
            )}
          </div>

          <div className="p-4 flex-1 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold line-clamp-1">
                    {uiProperty.name}
                  </h3>
                  <div className="flex items-center text-muted-foreground text-sm mt-1">
                    <MapPin className="h-3 w-3 mr-1" />
                    <span className="line-clamp-1">{uiProperty.location}</span>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={(e) => {
                    e.preventDefault();
                    onFavoriteToggle();
                  }}
                >
                  <Heart
                    className={`h-4 w-4 ${
                      isFavorite ? "fill-red-500 text-red-500" : ""
                    }`}
                  />
                  <span className="sr-only">Toggle favorite</span>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 mt-2">
                {uiProperty.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between mt-4">
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  <Bed className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{uiProperty.beds}</span>
                </div>
                <div className="flex items-center">
                  <Bath className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{uiProperty.baths}</span>
                </div>
                <div className="flex items-center">
                  <Home className="h-4 w-4 mr-1 text-muted-foreground" />
                  <span>{uiProperty.squareFeet} sq ft</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mt-2 sm:mt-0">
                <Badge variant="outline" className="text-sm font-semibold">
                  {formatCurrency(uiProperty.pricePerMonth)}/mo
                </Badge>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/property/${uiProperty.id}`}>View</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
