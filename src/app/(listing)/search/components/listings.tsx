"use client";

import { useProperties } from "@/shared/hooks/useProperties";
import PropertyCard from "./property-card";
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
import { Property } from "@/shared/types/property";
import { motion, AnimatePresence } from "framer-motion";

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
    fetchProperties(0, 100, filters, undefined, false, true);
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
      <div className="space-y-4 p-4 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-7 w-32" />
          <Skeleton className="h-8 w-40" />
        </div>
        <div
          className={`grid ${
            viewMode === "grid" ? "grid-cols-2" : "grid-cols-1"
          } gap-4`}
        >
          {Array.from({ length: viewMode === "grid" ? 4 : 2 }).map((_, i) => (
            <Skeleton
              key={i}
              className={`${
                viewMode === "list" ? "h-28" : "h-64"
              } w-full rounded-xl animate-pulse`}
              // Using CSS classes instead of inline style for animations
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 px-4"
      >
        <div className="bg-red-50 dark:bg-red-900/20 rounded-xl p-6">
          <Filter className="mx-auto h-10 w-10 text-red-500 mb-2" />
          <h3 className="text-lg font-medium text-red-600 dark:text-red-400">
            Error loading properties
          </h3>
          <p className="text-red-500/80 dark:text-red-300/80 mt-2">
            Please try again later
          </p>
          <Button
            variant="outline"
            className="mt-4 border-red-200 text-red-600"
          >
            Retry
          </Button>
        </div>
      </motion.div>
    );
  }

  if (!properties || properties.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center py-12 px-4"
      >
        <div className="bg-gray-50 dark:bg-slate-800/50 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
          <Filter className="mx-auto h-10 w-10 text-gray-400 mb-2" />
          <h3 className="text-lg font-medium">No properties found</h3>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Try adjusting your filters or expanding your search area
          </p>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="p-4 h-full overflow-y-auto">
      <div className="flex justify-between items-center mb-4 sticky top-0 z-10 bg-white dark:bg-slate-900 py-2">
        <div>
          <h3 className="text-base font-medium text-gray-900 dark:text-white">
            {properties.length}{" "}
            {properties.length === 1 ? "property" : "properties"}
          </h3>
          {filters.search_term && (
            <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              <MapPin className="h-3 w-3 mr-1" />
              <span>{filters.search_term}</span>
            </div>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="h-8 text-xs px-3 border-gray-200 dark:border-gray-700"
            >
              <ArrowUpDown className="h-3 w-3 mr-2" />
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
          viewMode === "grid" ? "grid grid-cols-2 gap-4" : "space-y-4"
        } pb-4`}
      >
        <AnimatePresence>
          {properties.map((property, index) => (
            <motion.div
              key={property.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
              }}
              className={viewMode === "list" ? "flex w-full" : ""}
            >
              <PropertyCard
                property={property}
                isFavorite={favoriteStates[property.id] || false}
                onFavoriteToggle={() => handleFavoriteToggle(property.id)}
                viewMode={viewMode}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
