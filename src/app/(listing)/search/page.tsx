"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  MapPin,
  Loader2,
  Search,
  Filter,
  X,
  List,
  MapIcon,
  Home,
  ArrowDownUp,
  SlidersHorizontal,
  ChevronDown,
  Bed,
  Bath,
  Square,
  Building,
  Bookmark,
  ArrowUpRight,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Toaster } from "@/shared/components/ui/toaster";
import { useToast } from "@/shared/hooks/use-toast";
import { Badge } from "@/shared/components/ui/badge";
import { Switch } from "@/shared/components/ui/switch";
import { Slider } from "@/shared/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuCheckboxItem,
} from "@/shared/components/ui/dropdown-menu";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/shared/components/ui/popover";
import Map from "./components/map";
import { ChatBot } from "./components/ChatBot";
import type { MapProperty } from "./components/map";
import { useProperties, PropertyFilters } from "@/shared/hooks/useProperties";
import { PageTransition } from "@/shared/components/animation/PageTransition";

export default function SearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // UI State
  const [isMapView, setIsMapView] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  // Get search parameters
  const location = searchParams.get("location") || "";
  const minPrice = searchParams.get("minPrice")
    ? Number(searchParams.get("minPrice"))
    : undefined;
  const maxPrice = searchParams.get("maxPrice")
    ? Number(searchParams.get("maxPrice"))
    : undefined;
  const bedrooms = searchParams.get("beds")
    ? Number(searchParams.get("beds"))
    : undefined;
  const bathrooms = searchParams.get("baths")
    ? Number(searchParams.get("baths"))
    : undefined;
  const propertyType = searchParams.get("type") || undefined;

  // Setup filters
  const [filters, setFilters] = useState<PropertyFilters>({
    search_term: location,
    min_price: minPrice,
    max_price: maxPrice,
    bedrooms,
    bathrooms,
    property_type: propertyType,
  });

  // Price range for sliders
  const [priceRange, setPriceRange] = useState<[number, number]>([
    filters.min_price || 0,
    filters.max_price || 1000000,
  ]);

  // Temporary search value
  const [searchValue, setSearchValue] = useState(location);

  // Sorting options
  const [sortBy, setSortBy] = useState<string>("newest");

  // Use the properties hook to fetch data
  const { properties, loading, error, fetchProperties } = useProperties();

  // Transform database properties to map properties
  const mapProperties: MapProperty[] = properties.map((property) => ({
    id: property.id,
    title: property.title,
    description: property.description || "",
    location: property.location,
    latitude: property.latitude || 15.5527,
    longitude: property.longitude || 48.5164,
    featured: property.featured || false,
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    price: property.price || 0,
    primaryImage: property.primaryImage || "/placeholder.jpg",
    propertyType: property.property_type || "unknown",
    squareFeet: property.area || 0,
    images: property.images || [],
  }));

  // State for selected property
  const [selectedProperty, setSelectedProperty] = useState<MapProperty | null>(
    null
  );

  // Load properties on mount and when filters change
  useEffect(() => {
    const sort = {
      column:
        sortBy === "price-low" || sortBy === "price-high"
          ? "price"
          : "created_at",
      ascending: sortBy === "price-low" || sortBy === "oldest",
    };

    fetchProperties(0, 100, filters, sort);

    if (initialLoad) {
      setInitialLoad(false);
    } else {
      // Update URL with filters
      const params = new URLSearchParams();
      if (filters.search_term) params.set("location", filters.search_term);
      if (filters.min_price)
        params.set("minPrice", filters.min_price.toString());
      if (filters.max_price)
        params.set("maxPrice", filters.max_price.toString());
      if (filters.bedrooms) params.set("beds", filters.bedrooms.toString());
      if (filters.bathrooms) params.set("baths", filters.bathrooms.toString());
      if (filters.property_type) params.set("type", filters.property_type);

      router.push(`/search?${params.toString()}`, { scroll: false });
    }
  }, [filters, sortBy, fetchProperties, initialLoad, router]);

  // Handle property selection from map
  const handlePropertySelect = (property: MapProperty | null) => {
    setSelectedProperty(property);
  };

  // Format price for display
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "YER",
      maximumFractionDigits: 0,
    }).format(price);
  };

  // Apply search
  const handleSearch = () => {
    setFilters((prev) => ({
      ...prev,
      search_term: searchValue,
    }));
  };

  // Apply price range
  const handlePriceChange = (values: number[]) => {
    setPriceRange([values[0], values[1]]);
  };

  // Apply price filter when slider done
  const handlePriceChangeEnd = () => {
    setFilters((prev) => ({
      ...prev,
      min_price: priceRange[0],
      max_price: priceRange[1],
    }));
  };

  // Filter by bedrooms
  const handleBedroomFilter = (value: number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      bedrooms: value,
    }));
  };

  // Filter by bathrooms
  const handleBathroomFilter = (value: number | undefined) => {
    setFilters((prev) => ({
      ...prev,
      bathrooms: value,
    }));
  };

  // Filter by property type
  const handlePropertyTypeFilter = (value: string | undefined) => {
    setFilters((prev) => ({
      ...prev,
      property_type: value,
    }));
  };

  // Reset all filters
  const resetFilters = () => {
    setSearchValue("");
    setPriceRange([0, 1000000]);
    setFilters({
      search_term: "",
      min_price: undefined,
      max_price: undefined,
      bedrooms: undefined,
      bathrooms: undefined,
      property_type: undefined,
    });
    toast({
      title: "Filters Reset",
      description: "All search filters have been cleared.",
    });
  };

  // Save search state
  const [searchSaved, setSearchSaved] = useState(false);
  const [searchName, setSearchName] = useState("");
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
    <PageTransition>
      <div className="w-screen h-screen overflow-hidden bg-background text-foreground relative">
        {/* Search Bar */}
        <div className="absolute top-2 sm:top-4 left-1/2 -translate-x-1/2 z-30 w-full max-w-3xl pr-6 pl-2 sm:pr-4 sm:pl-4">
          <div className="bg-white/70 dark:bg-zinc-900/70 backdrop-blur-sm rounded-xl shadow-lg overflow-hidden">
            <div className="flex sm:flex-row flex-col flex-wrap items-center p-2 sm:p-1 gap-2">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search by location, name, or description..."
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  className="w-full pl-9 pr-3 rounded-md bg-transparent focus:outline-none"
                />
              </div>
              <div className="flex gap-2">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="px-3 rounded-lg"
                    >
                      <Filter className="h-4 w-4 mr-2" />
                      Filters
                      <Badge
                        className="ml-2 bg-primary text-primary-foreground"
                        variant="secondary"
                      >
                        {Object.values(filters).filter(Boolean).length}
                      </Badge>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-0">
                    <div className="p-4 border-b">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Filters</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={resetFilters}
                        >
                          Clear All
                        </Button>
                      </div>
                    </div>
                    <div className="p-4 space-y-5">
                      {/* Price Range */}
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h4 className="text-sm font-medium flex items-center">
                            <Home className="h-4 w-4 mr-1.5" />
                            Price Range
                          </h4>
                          <span className="text-xs text-muted-foreground">
                            {formatPrice(priceRange[0])} -{" "}
                            {formatPrice(priceRange[1])}
                          </span>
                        </div>
                        <Slider
                          defaultValue={[0, 1000000]}
                          value={priceRange}
                          min={0}
                          max={1000000}
                          step={10000}
                          onValueChange={handlePriceChange}
                          onValueCommit={handlePriceChangeEnd}
                          className="mt-3"
                        />
                      </div>

                      {/* Bedrooms */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <Bed className="h-4 w-4 mr-1.5" />
                          Bedrooms
                        </h4>
                        <div className="flex gap-2">
                          <Button
                            variant={
                              filters.bedrooms === undefined
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handleBedroomFilter(undefined)}
                            className="flex-1"
                          >
                            Any
                          </Button>
                          {[1, 2, 3, 4].map((num) => (
                            <Button
                              key={num}
                              variant={
                                filters.bedrooms === num ? "default" : "outline"
                              }
                              size="sm"
                              onClick={() => handleBedroomFilter(num)}
                            >
                              {num}+
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Bathrooms */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <Bath className="h-4 w-4 mr-1.5" />
                          Bathrooms
                        </h4>
                        <div className="flex gap-2">
                          <Button
                            variant={
                              filters.bathrooms === undefined
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handleBathroomFilter(undefined)}
                            className="flex-1"
                          >
                            Any
                          </Button>
                          {[1, 2, 3].map((num) => (
                            <Button
                              key={num}
                              variant={
                                filters.bathrooms === num
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              onClick={() => handleBathroomFilter(num)}
                            >
                              {num}+
                            </Button>
                          ))}
                        </div>
                      </div>

                      {/* Property Type */}
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium flex items-center">
                          <Building className="h-4 w-4 mr-1.5" />
                          Property Type
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant={
                              filters.property_type === undefined
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePropertyTypeFilter(undefined)}
                          >
                            Any
                          </Button>
                          <Button
                            variant={
                              filters.property_type === "apartment"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() =>
                              handlePropertyTypeFilter("apartment")
                            }
                          >
                            Apartment
                          </Button>
                          <Button
                            variant={
                              filters.property_type === "house"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePropertyTypeFilter("house")}
                          >
                            House
                          </Button>
                          <Button
                            variant={
                              filters.property_type === "villa"
                                ? "default"
                                : "outline"
                            }
                            size="sm"
                            onClick={() => handlePropertyTypeFilter("villa")}
                          >
                            Villa
                          </Button>
                        </div>
                      </div>

                      {/* Apply Button */}
                      <Button className="w-full" onClick={() => {}}>
                        Apply Filters
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild className="px-3 rounded-lg">
                    <Button variant="outline" size="sm">
                      <ArrowDownUp className="h-4 w-4 mr-2" />
                      Sort
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Sort by</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuCheckboxItem
                      checked={sortBy === "newest"}
                      onCheckedChange={() => setSortBy("newest")}
                    >
                      Newest
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortBy === "oldest"}
                      onCheckedChange={() => setSortBy("oldest")}
                    >
                      Oldest
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortBy === "price-low"}
                      onCheckedChange={() => setSortBy("price-low")}
                    >
                      Price: Low to High
                    </DropdownMenuCheckboxItem>
                    <DropdownMenuCheckboxItem
                      checked={sortBy === "price-high"}
                      onCheckedChange={() => setSortBy("price-high")}
                    >
                      Price: High to Low
                    </DropdownMenuCheckboxItem>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsMapView(!isMapView)}
                  className="px-3 rounded-lg"
                >
                  {isMapView ? (
                    <>
                      <List className="h-4 w-4 mr-2" />
                      List
                    </>
                  ) : (
                    <>
                      <MapIcon className="h-4 w-4 mr-2" />
                      Map
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div
          ref={mapContainerRef}
          className="absolute inset-0 "
          style={{ display: isMapView ? "block" : "none" }}
        >
          <Map
            properties={mapProperties}
            loading={loading}
            selectedProperty={selectedProperty}
            onPropertySelect={handlePropertySelect}
          />
        </div>

        {/* List View */}
        {!isMapView && (
          <div className="absolute inset-0 pt-20 px-4 pb-8 overflow-y-auto bg-gradient-to-br from-white via-gray-50 to-blue-50 dark:bg-gradient-to-br dark:from-zinc-800/80 dark:via-zinc-900/80 dark:to-blue-950/20 backdrop-blur-sm">
            <div className="max-w-8xl mx-auto pb-20">
              {/* Results summary and count */}
              <div className="flex items-center justify-between mb-6 mt-2">
                {/* <div className="flex items-center gap-2">
                <Badge
                  variant="outline"
                  className="px-3 py-1.5 text-sm bg-white dark:bg-zinc-800 shadow-sm"
                >
                  <Home className="h-4 w-4 mr-2 text-primary" />
                  <span>{mapProperties.length} Properties</span>
                </Badge>
                {filters.search_term && (
                  <Badge
                    variant="outline"
                    className="px-3 py-1.5 text-sm bg-white dark:bg-zinc-800 shadow-sm"
                  >
                    <MapPin className="h-4 w-4 mr-2 text-primary" />
                    <span>{filters.search_term}</span>
                  </Badge>
                )}
              </div>
              <p className="text-sm text-muted-foreground">
                Showing {mapProperties.length} results
              </p> */}
              </div>

              {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {Array(8)
                    .fill(0)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="bg-card rounded-xl overflow-hidden shadow-sm border border-border/10 dark:border-zinc-700 h-[420px]"
                      >
                        <div className="h-48 bg-muted animate-pulse"></div>
                        <div className="p-4 space-y-3">
                          <div className="h-6 bg-muted animate-pulse rounded-md w-3/4"></div>
                          <div className="h-4 bg-muted animate-pulse rounded-md w-1/2"></div>
                          <div className="h-4 bg-muted animate-pulse rounded-md w-full"></div>
                          <div className="flex gap-2 pt-2">
                            <div className="h-8 bg-muted animate-pulse rounded-md w-1/3"></div>
                            <div className="h-8 bg-muted animate-pulse rounded-md w-1/3"></div>
                            <div className="h-8 bg-muted animate-pulse rounded-md w-1/3"></div>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : mapProperties.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="bg-muted/30 p-6 rounded-full mb-6">
                    <Home className="h-16 w-16 text-muted-foreground" />
                  </div>
                  <h3 className="text-2xl font-medium">No properties found</h3>
                  <p className="text-muted-foreground mt-2 max-w-md">
                    We couldn&apos;t find any properties matching your search
                    criteria. Try adjusting your filters or expanding your
                    search area.
                  </p>
                  <Button
                    variant="default"
                    className="mt-6"
                    onClick={resetFilters}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {mapProperties.map((property, index) => (
                    <div
                      key={property.id}
                      className="group relative bg-card rounded-xl overflow-hidden bg-white dark:bg-zinc-900 border border-border/10 dark:border-zinc-700 shadow hover:shadow-sm transition-all duration-500 transform hover:-translate-y-1 border-l-4"
                      style={{ animationDelay: `${index * 50}ms` }}
                      onClick={() => router.push(`/search/${property.id}`)}
                    >
                      {/* Property image with gradient overlay */}
                      <div className="relative h-60 overflow-hidden">
                        <img
                          src={property.primaryImage}
                          alt={property.title}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-70 group-hover:opacity-60 transition-opacity duration-300"></div>

                        {/* Price tag */}
                        <div className="absolute top-4 right-4 bg-white dark:bg-zinc-800 shadow-lg rounded-lg px-3 py-1.5 text-sm font-semibold text-primary">
                          {formatPrice(property.price)}
                          <span className="text-xs font-normal text-muted-foreground">
                            /mo
                          </span>
                        </div>

                        {/* Featured badge */}
                        {property.featured && (
                          <div className="absolute top-4 left-4 bg-gradient-to-r from-primary to-primary/80 text-white shadow-md rounded-lg px-3 py-1 text-xs font-medium flex items-center gap-1">
                            <svg
                              width="14"
                              height="14"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                            </svg>
                            Featured
                          </div>
                        )}

                        {/* Property type badge */}
                        <Badge
                          variant="outline"
                          className="absolute bottom-4 right-4 bg-black/50 text-white border-0 capitalize"
                        >
                          {property.propertyType}
                        </Badge>
                      </div>

                      {/* Property content */}
                      <div className="p-5">
                        <h3 className="text-lg font-semibold line-clamp-1 group-hover:text-primary transition-colors duration-300">
                          {property.title}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center mt-1.5 line-clamp-1">
                          <MapPin className="h-3.5 w-3.5 mr-1.5 flex-shrink-0 text-primary/70" />
                          <span>{property.location}</span>
                        </p>

                        <p className="mt-3 text-sm text-muted-foreground line-clamp-2">
                          {property.description.slice(0, 20)}...
                        </p>

                        {/* Property details */}
                        <div className="mt-4 grid grid-cols-3 gap-2">
                          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50 group-hover:bg-primary/5 transition-colors duration-300 dark:bg-zinc-800 bg-slate-100">
                            <Bed className="h-4 w-4 mb-1 text-primary/70" />
                            <span className="text-xs font-medium">
                              {property.bedrooms} Beds
                            </span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50 group-hover:bg-primary/5 transition-colors duration-300 dark:bg-zinc-800 bg-slate-100">
                            <Bath className="h-4 w-4 mb-1 text-primary/70" />
                            <span className="text-xs font-medium">
                              {property.bathrooms} Baths
                            </span>
                          </div>
                          <div className="flex flex-col items-center justify-center p-2 rounded-lg bg-muted/50 group-hover:bg-primary/5 transition-colors duration-300 dark:bg-zinc-800 bg-slate-100">
                            <Square className="h-4 w-4 mb-1 text-primary/70" />
                            <span className="text-xs font-medium">
                              {property.squareFeet} sqft
                            </span>
                          </div>
                        </div>

                        {/* Call to action */}
                        <div className="mt-2 flex items-center justify-between bg-slate-100 dark:bg-zinc-800 px-3 py-1 rounded-lg">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="px-0 text-primary text-sm font-medium"
                          >
                            View Details
                          </Button>
                          <Button
                            size="icon"
                            variant="outline"
                            className="h-8 w-8 rounded-full hover:bg-primary/5 transition-colors duration-300"
                          >
                            <ArrowUpRight className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Property accent line */}
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Property Info Overlay */}
        {isMapView && selectedProperty && (
          <div className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-30 bg-white/95 dark:bg-zinc-900/90 backdrop-blur-sm pl-2 pr-2 py-2 border border-border/10 border-l-4 border-l-primary dark:border-l-primary rounded-xl shadow-lg max-w-lg w-fit sm:w-full dark:border-zinc-700">
            <div className="flex flex-col sm:flex-row items-center gap-4">
              <div className="flex-shrink-0 w-full sm:w-32 h-24 bg-muted rounded-lg relative overflow-hidden">
                <img
                  src={selectedProperty.primaryImage || "/placeholder.jpg"}
                  alt={selectedProperty.title}
                  className="object-cover w-full h-full"
                />
                {/* {selectedProperty.featured && (
                <Badge className="absolute top-1 left-1 bg-yellow-500/90 text-white text-xs">
                  Featured
                </Badge>
              )} */}
              </div>
              <div className="flex flex-row gap-4 flex-1">
                <div className="flex-1 flex flex-col gap-1">
                  <h3 className="font-medium">{selectedProperty.title}</h3>
                  <p className="text-sm flex items-center text-muted-foreground gap-1">
                    <MapPin className="h-3.5 w-3.5" />
                    {selectedProperty.location}
                  </p>

                  <div className="flex gap-3 text-sm text-muted-foreground mt-1">
                    <div className="flex items-center justify-center gap-1 bg-slate-100 rounded-lg px-2 py-1 dark:bg-zinc-800">
                      <Bed className="h-3.5 w-3.5 mr-1" />
                      {selectedProperty.bedrooms}
                    </div>
                    <div className="flex items-center justify-center gap-1 bg-slate-100 rounded-lg px-2 py-1 dark:bg-zinc-800">
                      <Bath className="h-3.5 w-3.5 mr-1" />
                      {selectedProperty.bathrooms}
                    </div>
                    <div className="flex items-center justify-center gap-1 bg-slate-100 rounded-lg px-2 py-1 dark:bg-zinc-800">
                      <Square className="h-3.5 w-3.5 mr-1" />
                      {selectedProperty.squareFeet}
                    </div>
                  </div>
                </div>
                <div className="flex-1 flex flex-col gap-3 justify-center">
                  <p className="text-primary font-semibold mt-1">
                    {formatPrice(selectedProperty.price)}/mon
                  </p>
                  <Button
                    variant="default"
                    size="sm"
                    onClick={() =>
                      router.push(`/search/${selectedProperty.id}`)
                    }
                  >
                    View Details
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Search Button */}
        {/* {properties.length > 0 && (
        <div className="absolute bottom-4 right-4 z-30">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="bg-white/90 dark:bg-zinc-800/90 backdrop-blur-sm rounded-full px-4"
              >
                <Bookmark
                  className={`h-4 w-4 mr-2 ${
                    searchSaved ? "fill-primary text-primary" : ""
                  }`}
                />
                {searchSaved ? "Saved" : "Save Search"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-0" align="end">
              <div className="p-4 border-b">
                <h3 className="font-medium">Save this search</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Get notified when new properties match your criteria
                </p>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Search Name</label>
                  <input
                    type="text"
                    placeholder="e.g., Homes in Sanaa"
                    className="w-full h-9 px-3 rounded-md border border-input bg-transparent"
                    value={searchName}
                    onChange={(e) => setSearchName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium flex items-center justify-between">
                    <span>Email Notifications</span>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                    />
                  </label>
                  <p className="text-xs text-muted-foreground">
                    Receive email alerts for new properties
                  </p>
                </div>
                <Button
                  className="w-full"
                  onClick={() => {
                    setSearchSaved(true);
                    toast({
                      title: "Search saved",
                      description:
                        "You'll be notified when new properties match your criteria",
                    });
                  }}
                >
                  Save Search
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      )} */}

        {error && (
          <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 z-30 bg-destructive/95 text-destructive-foreground backdrop-blur-sm p-4 rounded-lg shadow-lg max-w-md">
            <p className="font-medium mb-2">Error loading properties</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Property count indicator */}
        {/* <div className="hidden sm:block absolute top-4.5 left-4 z-30 bg-white/70 dark:bg-black/70 backdrop-blur-sm px-3 py-2 rounded-xl text-sm font-medium shadow-sm">
          {loading ? (
            <div className="flex items-center gap-2">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Loading properties...
            </div>
          ) : (
            <div className="flex flex-row items-center justify-center gap-2">
              <Home className="h-4 w-4" />
              {properties.length} Properties found
            </div>
          )}
        </div> */}

        {/* Add the ChatBot component */}
        <ChatBot />

        <Toaster />
      </div>
    </PageTransition>
  );
}
