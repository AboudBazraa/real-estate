"use client";

import { useCallback, useEffect, useState } from "react";
import type { PropertyFilters } from "@/shared/hooks/useProperties";
import { PropertyType } from "@/shared/types/property";
import { Button } from "@/shared/components/ui/button";
import { Label } from "@/shared/components/ui/label";
import { Slider } from "@/shared/components/ui/slider";
import {
  Home,
  Building2,
  Store,
  Warehouse,
  LayoutGrid,
  Tag,
  Bed,
  Bath,
  DollarSign,
  SlidersHorizontal,
} from "lucide-react";

interface FiltersFullProps {
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
}

const propertyIcons: Record<string, React.ReactNode> = {
  house: <Home className="h-4 w-4" />,
  apartment: <Building2 className="h-4 w-4" />,
  condo: <Building2 className="h-4 w-4" />,
  townhouse: <Home className="h-4 w-4" />,
  commercial: <Store className="h-4 w-4" />,
  land: <LayoutGrid className="h-4 w-4" />,
  industrial: <Warehouse className="h-4 w-4" />,
};

export default function FiltersFull({ filters, setFilters }: FiltersFullProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.min_price || 0,
    filters.max_price || 5000000,
  ]);

  // Update the component state when the parent filters prop changes
  useEffect(() => {
    setPriceRange([filters.min_price || 0, filters.max_price || 5000000]);
  }, [filters.min_price, filters.max_price]);

  // Format price for display
  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `$${(price / 1000000).toFixed(1)}M`;
    } else if (price >= 1000) {
      return `$${(price / 1000).toFixed(0)}K`;
    }
    return `$${price}`;
  };

  // Handle price range changes
  const handlePriceRangeChange = useCallback(
    (value: number[]) => {
      setPriceRange([value[0], value[1]]);
    },
    [setPriceRange]
  );

  // Apply price filter to the main filters
  const applyPriceFilter = useCallback(() => {
    const [min, max] = priceRange;
    setFilters({
      ...filters,
      min_price: min === 0 ? undefined : min,
      max_price: max === 5000000 ? undefined : max,
    });
  }, [filters, priceRange, setFilters]);

  // Handle property type selection
  const handlePropertyTypeChange = (type: string) => {
    setFilters({
      ...filters,
      property_type: filters.property_type === type ? undefined : type,
    });
  };

  // Handle beds selection
  const handleBedsChange = (beds: number) => {
    setFilters({
      ...filters,
      bedrooms: filters.bedrooms === beds ? undefined : beds,
    });
  };

  // Handle baths selection
  const handleBathsChange = (baths: number) => {
    setFilters({
      ...filters,
      bathrooms: filters.bathrooms === baths ? undefined : baths,
    });
  };

  // Reset all filters
  const resetFilters = () => {
    setFilters({});
    setPriceRange([0, 5000000]);
  };

  return (
    <div className="p-4 overflow-y-auto h-full">
      <div
        className="flex items-center justify-between mb-6"
        style={{ animation: "fadeIn 0.3s ease-in-out forwards" }}
      >
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5" />
          <h2 className="text-lg font-medium">Filters</h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={resetFilters}
          className="text-xs hover:bg-muted"
        >
          Reset All
        </Button>
      </div>

      {/* Property Type Section */}
      <div
        className="mb-6"
        style={{
          animation: "slideUp 0.3s ease-in-out forwards 0.1s",
          opacity: 0,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Tag className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Property Type</h3>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {Object.values(PropertyType).map((type) => (
            <button
              key={type}
              className={`flex items-center gap-2 p-2 text-xs rounded-lg transition-all border ${
                filters.property_type === type
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border hover:border-primary/50 hover:bg-muted"
              }`}
              onClick={() => handlePropertyTypeChange(type)}
            >
              {propertyIcons[type.toLowerCase()] || (
                <Home className="h-4 w-4" />
              )}
              <span>{type.replace("_", " ")}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Bedrooms Section */}
      <div
        className="mb-6"
        style={{
          animation: "slideUp 0.3s ease-in-out forwards 0.2s",
          opacity: 0,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Bed className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Bedrooms</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((beds) => (
            <button
              key={beds}
              className={`flex items-center justify-center h-9 w-9 rounded-full text-xs transition-all border ${
                filters.bedrooms === beds
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border hover:border-primary/50 hover:bg-muted"
              }`}
              onClick={() => handleBedsChange(beds)}
            >
              {beds === 5 ? "5+" : beds}
            </button>
          ))}
        </div>
      </div>

      {/* Bathrooms Section */}
      <div
        className="mb-6"
        style={{
          animation: "slideUp 0.3s ease-in-out forwards 0.3s",
          opacity: 0,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <Bath className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Bathrooms</h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {[1, 2, 3, 4, 5].map((baths) => (
            <button
              key={baths}
              className={`flex items-center justify-center h-9 w-9 rounded-full text-xs transition-all border ${
                filters.bathrooms === baths
                  ? "border-primary bg-primary/10 text-primary font-medium"
                  : "border-border hover:border-primary/50 hover:bg-muted"
              }`}
              onClick={() => handleBathsChange(baths)}
            >
              {baths === 5 ? "5+" : baths}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Section */}
      <div
        className="mb-6"
        style={{
          animation: "slideUp 0.3s ease-in-out forwards 0.4s",
          opacity: 0,
        }}
      >
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-sm font-medium">Price Range</h3>
        </div>
        <div className="mt-4 px-1">
          <Slider
            value={[priceRange[0], priceRange[1]]}
            min={0}
            max={5000000}
            step={50000}
            onValueChange={handlePriceRangeChange}
            onValueCommit={applyPriceFilter}
            className="mb-6"
          />
          <div className="flex justify-between">
            <div>
              <Label className="text-muted-foreground text-xs">Min</Label>
              <div className="text-sm font-medium mt-1">
                {formatPrice(priceRange[0])}
              </div>
            </div>
            <div className="text-right">
              <Label className="text-muted-foreground text-xs">Max</Label>
              <div className="text-sm font-medium mt-1">
                {formatPrice(priceRange[1])}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          animation: "slideUp 0.3s ease-in-out forwards 0.5s",
          opacity: 0,
        }}
      >
        <Button className="w-full" onClick={applyPriceFilter}>
          Apply Filters
        </Button>
      </div>

      <style jsx global>{`
        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
