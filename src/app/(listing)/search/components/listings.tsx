"use client";

import { useProperties } from "@/shared/hooks/useProperties";
import { PropertyCard } from "./property-card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { PropertyFilters } from "@/shared/hooks/useProperties";
import { Button } from "@/shared/components/ui/button";
import { ArrowUpDown, Filter, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

interface ListingsProps {
  filters: PropertyFilters;
  viewMode: "grid" | "list";
}

type SortOption = "price-asc" | "price-desc" | "beds-desc" | "newest";

export default function Listings({ filters, viewMode }: ListingsProps) {
  const {
    fetchProperties,
    properties: fetchedProperties,
    loading,
    error,
    totalCount,
    toggleFavorite,
    checkIsFavorited,
  } = useProperties();
  const [properties, setProperties] = useState(fetchedProperties);
  const [sortBy, setSortBy] = useState<SortOption>("newest");
  const [favoriteStates, setFavoriteStates] = useState<Record<string, boolean>>(
    {}
  );

  // Fetch properties when filters change
  useEffect(() => {
    fetchProperties(0, 100, filters);
  }, [filters, fetchProperties]);

  // Update properties when fetchedProperties changes
  useEffect(() => {
    setProperties(fetchedProperties);

    // Initialize favorite states
    const initFavorites = async () => {
      const states: Record<string, boolean> = {};
      for (const property of fetchedProperties) {
        states[property.id] = await checkIsFavorited(property.id);
      }
      setFavoriteStates(states);
    };

    initFavorites();
  }, [fetchedProperties, checkIsFavorited]);

  // Sort properties based on selected option
  useEffect(() => {
    if (!fetchedProperties) return;

    const sorted = [...fetchedProperties].sort((a, b) => {
      switch (sortBy) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "beds-desc":
          return b.bedrooms - a.bedrooms;
        case "newest":
        default:
          // Use created_at for sorting by newest
          return (
            new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
          );
      }
    });

    setProperties(sorted);
  }, [sortBy, fetchedProperties]);

  const handleFavoriteToggle = async (propertyId: string) => {
    const result = await toggleFavorite(propertyId);
    if (result !== null) {
      setFavoriteStates((prev) => ({
        ...prev,
        [propertyId]: result,
      }));
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-9 w-32" />
        </div>
        <div
          className={`${
            viewMode === "grid"
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6"
              : "space-y-6"
          }`}
        >
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-48 sm:h-64 w-full rounded-lg" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-destructive/10 rounded-lg p-6">
          <h3 className="text-lg font-medium text-destructive">
            Error loading properties
          </h3>
          <p className="text-muted-foreground mt-2">Please try again later</p>
          <Button variant="outline" className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-12 px-4">
        <div className="bg-muted/40 rounded-lg p-6">
          <Filter className="mx-auto h-10 w-10 text-muted-foreground mb-2" />
          <h3 className="text-lg font-medium">No properties found</h3>
          <p className="text-muted-foreground mt-2">
            Try adjusting your filters or expanding your search area
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h3 className="text-lg font-semibold">
            {properties.length}{" "}
            {properties.length === 1 ? "property" : "properties"}
          </h3>
          {filters.search_term && (
            <div className="flex items-center text-sm text-muted-foreground mt-1">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{filters.search_term}</span>
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-9">
              <ArrowUpDown className="h-3.5 w-3.5 mr-2" />
              {sortBy === "price-asc" && "Price: Low to High"}
              {sortBy === "price-desc" && "Price: High to Low"}
              {sortBy === "beds-desc" && "Most Bedrooms"}
              {sortBy === "newest" && "Newest First"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={() => setSortBy("newest")}>
              Newest First
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("price-asc")}>
              Price: Low to High
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("price-desc")}>
              Price: High to Low
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setSortBy("beds-desc")}>
              Most Bedrooms
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div
        className={`${
          viewMode === "grid"
            ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6"
            : "space-y-6"
        }`}
      >
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={{
              ...property,
              name: property.title,
              beds: property.bedrooms,
              baths: property.bathrooms,
              squareFeet: property.area,
              pricePerMonth: property.price,
              propertyType: property.property_type,
              images:
                property.images?.map((img) => img.image_url) ||
                ([property.primaryImage].filter(Boolean) as string[]),
            }}
            isFavorite={favoriteStates[property.id] || false}
            onFavoriteToggle={() => handleFavoriteToggle(property.id)}
            isCompact={viewMode === "list"}
          />
        ))}
      </div>
    </div>
  );
}
