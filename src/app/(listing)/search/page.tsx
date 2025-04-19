"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import type { PropertyFilters } from "@/shared/hooks/useProperties";
import FiltersBar from "./components/filters-bar";
import FiltersFull from "./components/filters-full";
import Map from "./components/map";
import Listings from "./components/listings";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [isFiltersFullOpen, setIsFiltersFullOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Handle mounted state to avoid hydration issues with theme
  useEffect(() => {
    setMounted(true);
  }, []);

  // Initialize filters from URL search params
  useEffect(() => {
    const initialFilters: PropertyFilters = {};
    let hasChanges = false;

    // Extract search term from search params (location)
    const location = searchParams.get("location");
    if (location && location !== filters.search_term) {
      initialFilters.search_term = location;
      hasChanges = true;
    } else if (filters.search_term) {
      initialFilters.search_term = filters.search_term;
    }

    // Extract price range from search params
    const priceRange = searchParams.get("priceRange");
    if (priceRange) {
      const [min, max] = priceRange
        .split(",")
        .map((v) => (v === "" ? undefined : Number(v)));

      if (min !== filters.min_price || max !== filters.max_price) {
        initialFilters.min_price = min;
        initialFilters.max_price = max;
        hasChanges = true;
      } else {
        initialFilters.min_price = filters.min_price;
        initialFilters.max_price = filters.max_price;
      }
    }

    // Extract beds from search params
    const beds = searchParams.get("beds");
    if (beds) {
      const bedsNum = Number(beds);
      if (bedsNum !== filters.bedrooms) {
        initialFilters.bedrooms = bedsNum;
        hasChanges = true;
      } else if (filters.bedrooms) {
        initialFilters.bedrooms = filters.bedrooms;
      }
    }

    // Extract baths from search params
    const baths = searchParams.get("baths");
    if (baths) {
      const bathsNum = Number(baths);
      if (bathsNum !== filters.bathrooms) {
        initialFilters.bathrooms = bathsNum;
        hasChanges = true;
      } else if (filters.bathrooms) {
        initialFilters.bathrooms = filters.bathrooms;
      }
    }

    // Extract property type from search params
    const propertyType = searchParams.get("propertyType");
    if (propertyType && propertyType !== filters.property_type) {
      initialFilters.property_type = propertyType;
      hasChanges = true;
    } else if (filters.property_type) {
      initialFilters.property_type = filters.property_type;
    }

    // Only update filters if there are actual changes
    if (hasChanges) {
      setFilters(initialFilters);
    }
  }, [searchParams, filters]);

  const toggleFiltersFullOpen = () => {
    setIsFiltersFullOpen((prev) => !prev);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <div
      className="w-full mx-auto flex flex-col bg-background text-foreground transition-colors duration-300"
      style={{
        height: `calc(100vh - 4rem)`,
      }}
    >
      <div className="flex justify-between items-center p-2">
        <FiltersBar
          filters={filters}
          setFilters={setFilters}
          viewMode={viewMode}
          setViewMode={setViewMode}
          isFiltersFullOpen={isFiltersFullOpen}
          toggleFiltersFullOpen={toggleFiltersFullOpen}
        />

        {mounted && (
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="ml-2 h-8 w-8 rounded-full transition-all duration-300 hover:bg-accent"
          >
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        )}
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left side - Properties listings */}
        <div className="w-2/5 flex flex-col overflow-hidden">
          {isFiltersFullOpen && (
            <div className="bg-card dark:bg-slate-800 border-b border-border p-3">
              <FiltersFull filters={filters} setFilters={setFilters} />
            </div>
          )}
          <div className="flex-1 overflow-y-auto">
            <Listings filters={filters} viewMode={viewMode} />
          </div>
        </div>

        {/* Right side - Map */}
        <div className="w-3/5 border-l border-border">
          <Map filters={filters} />
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        @keyframes slideIn {
          from {
            width: 0;
            opacity: 0;
          }
          to {
            width: auto;
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
