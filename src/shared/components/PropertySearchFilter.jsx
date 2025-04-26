"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Search,
  X,
  Sliders,
  MapPin,
  Home,
  DollarSign,
  ArrowDownUp,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Slider } from "./ui/slider";
import { Checkbox } from "./ui/checkbox";

export default function PropertySearchFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [advancedOpen, setAdvancedOpen] = useState(false);

  // Get initial values from URL or set defaults
  const [filters, setFilters] = useState({
    keyword: searchParams.get("keyword") || "",
    location: searchParams.get("location") || "",
    type: searchParams.get("type") || "",
    minPrice: parseInt(searchParams.get("minPrice") || "0"),
    maxPrice: parseInt(searchParams.get("maxPrice") || "1000000"),
    bedrooms: searchParams.get("bedrooms") || "",
    bathrooms: searchParams.get("bathrooms") || "",
    minArea: parseInt(searchParams.get("minArea") || "0"),
    amenities: (searchParams.get("amenities") || "").split(",").filter(Boolean),
    sortBy: searchParams.get("sortBy") || "newest",
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle select changes (for dropdowns)
  const handleSelectChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  // Handle checkbox changes for amenities
  const handleAmenityToggle = (amenity) => {
    setFilters((prev) => {
      const currentAmenities = [...prev.amenities];
      if (currentAmenities.includes(amenity)) {
        return {
          ...prev,
          amenities: currentAmenities.filter((a) => a !== amenity),
        };
      } else {
        return { ...prev, amenities: [...currentAmenities, amenity] };
      }
    });
  };

  // Handle price range change
  const handlePriceRangeChange = (value) => {
    setFilters((prev) => ({
      ...prev,
      minPrice: value[0],
      maxPrice: value[1],
    }));
  };

  // Apply filters to URL and trigger search
  const applyFilters = () => {
    const params = new URLSearchParams();

    // Only add params that have values
    Object.entries(filters).forEach(([key, value]) => {
      if (
        value &&
        ((typeof value === "string" && value.trim() !== "") ||
          (Array.isArray(value) && value.length > 0) ||
          (typeof value === "number" && value > 0) ||
          key === "minPrice") // Always include minPrice even if 0
      ) {
        if (Array.isArray(value)) {
          params.set(key, value.join(","));
        } else {
          params.set(key, value.toString());
        }
      }
    });

    // Determine if we're on a properties page or need to navigate to one
    const targetPath = pathname.includes("/properties")
      ? pathname
      : "/properties";
    router.push(`${targetPath}?${params.toString()}`);
  };

  // Clear all filters
  const clearFilters = () => {
    setFilters({
      keyword: "",
      location: "",
      type: "",
      minPrice: 0,
      maxPrice: 1000000,
      bedrooms: "",
      bathrooms: "",
      minArea: 0,
      amenities: [],
      sortBy: "newest",
    });
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800 p-4 mb-8">
      {/* Basic Search Row */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-zinc-400" />
          <Input
            type="text"
            name="keyword"
            placeholder="Search properties..."
            className="pl-10"
            value={filters.keyword}
            onChange={handleChange}
          />
        </div>

        <div className="flex gap-2">
          <Button
            variant="default"
            className="bg-blue-600 hover:bg-blue-700 text-white"
            onClick={applyFilters}
          >
            Search
          </Button>

          <Button
            variant="outline"
            onClick={() => setAdvancedOpen(!advancedOpen)}
            className="flex items-center gap-1"
          >
            <Sliders className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {advancedOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden mt-4 pt-4 border-t border-zinc-200 dark:border-zinc-800"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Location */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                  <MapPin className="h-4 w-4" /> Location
                </label>
                <Input
                  type="text"
                  name="location"
                  placeholder="Any location"
                  value={filters.location}
                  onChange={handleChange}
                />
              </div>

              {/* Property Type */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                  <Home className="h-4 w-4" /> Property Type
                </label>
                <Select
                  value={filters.type}
                  onValueChange={(value) => handleSelectChange("type", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any type</SelectItem>
                    <SelectItem value="apartment">Apartment</SelectItem>
                    <SelectItem value="house">House</SelectItem>
                    <SelectItem value="villa">Villa</SelectItem>
                    <SelectItem value="land">Land Plot</SelectItem>
                    <SelectItem value="commercial">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1 flex items-center gap-1">
                  <ArrowDownUp className="h-4 w-4" /> Sort By
                </label>
                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleSelectChange("sortBy", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="price-asc">
                      Price: Low to High
                    </SelectItem>
                    <SelectItem value="price-desc">
                      Price: High to Low
                    </SelectItem>
                    <SelectItem value="area-asc">
                      Area: Small to Large
                    </SelectItem>
                    <SelectItem value="area-desc">
                      Area: Large to Small
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bedrooms */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Bedrooms
                </label>
                <Select
                  value={filters.bedrooms}
                  onValueChange={(value) =>
                    handleSelectChange("bedrooms", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                    <SelectItem value="5">5+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Bathrooms */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Bathrooms
                </label>
                <Select
                  value={filters.bathrooms}
                  onValueChange={(value) =>
                    handleSelectChange("bathrooms", value)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Any" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Any</SelectItem>
                    <SelectItem value="1">1+</SelectItem>
                    <SelectItem value="2">2+</SelectItem>
                    <SelectItem value="3">3+</SelectItem>
                    <SelectItem value="4">4+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Min Area */}
              <div>
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                  Min Area (sq ft)
                </label>
                <Input
                  type="number"
                  name="minArea"
                  placeholder="Any"
                  min="0"
                  value={filters.minArea}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Price Range Slider */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                  <DollarSign className="h-4 w-4" /> Price Range
                </label>
                <div className="text-sm text-zinc-500 dark:text-zinc-400">
                  {formatPrice(filters.minPrice)} -{" "}
                  {formatPrice(filters.maxPrice)}
                </div>
              </div>
              <Slider
                value={[filters.minPrice, filters.maxPrice]}
                min={0}
                max={1000000}
                step={10000}
                onValueChange={handlePriceRangeChange}
                className="my-4"
              />
            </div>

            {/* Amenities */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                Amenities
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                {[
                  "pool",
                  "garden",
                  "garage",
                  "balcony",
                  "elevator",
                  "security",
                  "gym",
                  "parking",
                ].map((amenity) => (
                  <div key={amenity} className="flex items-center space-x-2">
                    <Checkbox
                      id={amenity}
                      checked={filters.amenities.includes(amenity)}
                      onCheckedChange={() => handleAmenityToggle(amenity)}
                    />
                    <label
                      htmlFor={amenity}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 capitalize"
                    >
                      {amenity}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 mt-4">
              <Button
                variant="outline"
                onClick={clearFilters}
                className="flex items-center"
              >
                <X className="h-4 w-4 mr-1" /> Clear
              </Button>
              <Button
                onClick={applyFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply Filters
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
