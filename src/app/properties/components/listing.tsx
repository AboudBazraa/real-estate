"use client";
import { useState, useEffect } from "react";
import CardProperty from "./card-property";
import {
  Search,
  MapPin,
  Home,
  ChevronDown,
  Building,
  Sliders,
  Filter,
  List,
  Grid,
  Settings,
} from "lucide-react";

// Sample property data for Yemen
const sampleProperties = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070",
    price: 125000,
    address: "Modern Villa in Sana'a",
    neighborhood: "Hadda District, Sana'a",
    bedrooms: 4,
    bathrooms: 3,
    area: 320,
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?q=80&w=2053",
    price: 89000,
    address: "Traditional Yemeni House",
    neighborhood: "Old City, Sana'a",
    bedrooms: 3,
    bathrooms: 2,
    area: 240,
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070",
    price: 165000,
    address: "Coastal Villa with Sea View",
    neighborhood: "Gold Mohur, Aden",
    bedrooms: 5,
    bathrooms: 4,
    area: 380,
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1613977257365-aaae5a9817ff?q=80&w=2071",
    price: 72000,
    address: "Mountain View Apartment",
    neighborhood: "Rawdah District, Sana'a",
    bedrooms: 2,
    bathrooms: 1,
    area: 120,
  },
];

// Property types
const propertyTypes = [
  {
    id: "apartment",
    name: "Apartment",
    icon: <Building className="h-4 w-4" />,
  },
  { id: "villa", name: "Villa", icon: <Home className="h-4 w-4" /> },
  { id: "house", name: "House", icon: <Home className="h-4 w-4" /> },
  { id: "land", name: "Land", icon: <MapPin className="h-4 w-4" /> },
];

// Cities in Yemen
const yemenCities = [
  "Sana'a",
  "Aden",
  "Taiz",
  "Hudaydah",
  "Ibb",
  "Dhamar",
  "Mukalla",
];

// Add to the interfaces
interface ListingProps {
  selectedProperty?: string | null;
  onSelectProperty?: (id: string) => void;
  searchQuery?: string;
}

export default function Listing({
  selectedProperty,
  onSelectProperty,
  searchQuery,
}: ListingProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState("");
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState(50000);
  const [maxPrice, setMaxPrice] = useState(200000);
  const [selectedBedrooms, setSelectedBedrooms] = useState<number | null>(null);
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [filtersVisible, setFiltersVisible] = useState(false);

  // Amenities state
  const [isFurnished, setIsFurnished] = useState(false);
  const [isPetsAllowed, setIsPetsAllowed] = useState(false);
  const [hasParking, setHasParking] = useState(true);

  // Update local search when parent search changes
  useEffect(() => {
    if (searchQuery !== undefined) {
      setLocalSearchQuery(searchQuery);
    }
  }, [searchQuery]);

  // Toggle property type selection
  const togglePropertyType = (typeId: string) => {
    if (selectedType === typeId) {
      setSelectedType(null);
    } else {
      setSelectedType(typeId);
    }
  };

  // Toggle bedroom selection
  const toggleBedroom = (count: number) => {
    if (selectedBedrooms === count) {
      setSelectedBedrooms(null);
    } else {
      setSelectedBedrooms(count);
    }
  };

  // Toggle city selection
  const toggleCity = (city: string) => {
    if (selectedCity === city) {
      setSelectedCity(null);
    } else {
      setSelectedCity(city);
    }
  };

  // Toggle filters visibility
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };

  // Function to handle property selection
  const handlePropertyClick = (propertyId: string) => {
    if (onSelectProperty) {
      onSelectProperty(propertyId);
    }
  };

  // Filter properties based on selections
  const filteredProperties = sampleProperties.filter((property) => {
    // Filter by property type
    if (selectedType === "apartment" && property.bedrooms < 3) return true;
    if (selectedType === "villa" && property.bedrooms >= 4) return true;
    if (
      selectedType === "house" &&
      property.bedrooms >= 3 &&
      property.bedrooms < 4
    )
      return true;
    if (selectedType && !["apartment", "villa", "house"].includes(selectedType))
      return false;

    // Filter by price
    if (property.price < minPrice || property.price > maxPrice) return false;

    // Filter by bedrooms
    if (selectedBedrooms !== null) {
      if (selectedBedrooms === 0 && property.bedrooms !== 1) return false; // Studio
      if (selectedBedrooms === 5 && property.bedrooms < 5) return false; // 5+
      if (
        selectedBedrooms > 0 &&
        selectedBedrooms < 5 &&
        property.bedrooms !== selectedBedrooms
      )
        return false;
    }

    // Filter by city
    if (selectedCity && !property.neighborhood.includes(selectedCity))
      return false;

    // Filter by search query
    if (
      localSearchQuery &&
      !property.address
        .toLowerCase()
        .includes(localSearchQuery.toLowerCase()) &&
      !property.neighborhood
        .toLowerCase()
        .includes(localSearchQuery.toLowerCase())
    )
      return false;

    return true;
  });

  return (
    <div className="flex flex-col w-full h-full bg-white dark:bg-gray-900 rounded-xl overflow-hidden border border-gray-100 dark:border-gray-800">
      {/* Header with count and view toggle */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 bg-gray-100 dark:bg-gray-800 rounded-md text-gray-600 dark:text-gray-300 text-sm font-medium flex items-center gap-1.5">
              <span>Recommended</span>
            </button>
            <button
              onClick={toggleFilters}
              className="px-3 py-1.5 flex items-center gap-1.5 text-gray-600 dark:text-gray-300 text-sm font-medium"
            >
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              {(selectedType || selectedBedrooms || selectedCity) && (
                <span
                  className={`${
                    selectedType || selectedBedrooms || selectedCity
                      ? "bg-emerald-600"
                      : "bg-gray-900 dark:bg-gray-700"
                  } text-white text-xs rounded-full h-5 w-5 flex items-center justify-center`}
                >
                  {(selectedType ? 1 : 0) +
                    (selectedBedrooms ? 1 : 0) +
                    (selectedCity ? 1 : 0)}
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-l-md ${
                viewMode === "grid"
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
              }`}
            >
              <Grid className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-r-md ${
                viewMode === "list"
                  ? "bg-gray-100 dark:bg-gray-800"
                  : "bg-white dark:bg-gray-900"
              }`}
            >
              <List className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="relative">
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full bg-white dark:bg-gray-800 overflow-hidden shadow-sm">
            <div className="pl-4 pr-2">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search properties in Yemen..."
              className="py-2.5 px-2 w-full outline-none text-gray-800 dark:text-gray-200 text-sm bg-transparent"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
            />
            <button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm py-1.5 px-4 mr-1 rounded-full">
              Search
            </button>
          </div>
        </div>
      </div>

      {/* Filter accordion */}
      {filtersVisible && (
        <div className="p-4 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800">
          {/* City selection */}
          <div className="mb-5">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              City
            </h3>
            <div className="flex flex-wrap gap-2">
              {yemenCities.map((city) => (
                <button
                  key={city}
                  onClick={() => toggleCity(city)}
                  className={`py-1.5 px-3 text-sm rounded-full ${
                    selectedCity === city
                      ? "bg-emerald-600 text-white"
                      : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-600"
                  }`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>

          {/* Property type */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Property Type
              </h3>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {propertyTypes.map((type) => (
                <button
                  key={type.id}
                  onClick={() => togglePropertyType(type.id)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border ${
                    selectedType === type.id
                      ? "border-emerald-600 bg-emerald-50 dark:bg-emerald-900/20"
                      : "border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600"
                  }`}
                >
                  <div
                    className={`mb-1 ${
                      selectedType === type.id
                        ? "text-emerald-600"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {type.icon}
                  </div>
                  <span
                    className={`text-xs ${
                      selectedType === type.id
                        ? "text-emerald-600 dark:text-emerald-500"
                        : "text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {type.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price range */}
          <div className="mb-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Price Range
              </h3>
            </div>
            <div className="flex flex-col">
              <div className="h-8 relative mb-2">
                {/* Price slider visualization */}
                <div className="absolute w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full top-3"></div>
                <div
                  className="absolute h-2 bg-emerald-500 rounded-full top-3"
                  style={{ left: "20%", right: "20%" }}
                ></div>
                <button
                  className="absolute h-7 w-7 bg-white dark:bg-gray-800 border-2 border-emerald-500 rounded-full top-0.5 -ml-3.5"
                  style={{ left: "20%" }}
                ></button>
                <button
                  className="absolute h-7 w-7 bg-white dark:bg-gray-800 border-2 border-emerald-500 rounded-full top-0.5 -ml-3.5"
                  style={{ left: "80%" }}
                ></button>
              </div>
              <div className="flex justify-between mt-2">
                <div className="relative">
                  <span className="absolute text-gray-500 dark:text-gray-400 text-xs left-2 top-2.5">
                    $
                  </span>
                  <input
                    type="text"
                    className="py-2 pl-6 pr-2 w-28 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    value={minPrice}
                    onChange={(e) => setMinPrice(Number(e.target.value))}
                  />
                </div>
                <div className="relative">
                  <span className="absolute text-gray-500 dark:text-gray-400 text-xs left-2 top-2.5">
                    $
                  </span>
                  <input
                    type="text"
                    className="py-2 pl-6 pr-2 w-28 border border-gray-200 dark:border-gray-700 rounded-md text-sm bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(Number(e.target.value))}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Bedrooms */}
          <div className="mb-5">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Bedrooms
            </h3>
            <div className="flex gap-2 mb-3">
              {["Studio", "1", "2", "3", "4", "5+"].map((count, index) => (
                <button
                  key={count}
                  onClick={() => toggleBedroom(index)}
                  className={`py-2 px-3 text-sm rounded-md ${
                    selectedBedrooms === index
                      ? "bg-emerald-600 text-white"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Amenities */}
          <div className="mb-3">
            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
              Amenities
            </h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="furnished"
                  className="h-4 w-4 text-emerald-500 border-gray-300 dark:border-gray-600 rounded"
                  checked={isFurnished}
                  onChange={() => setIsFurnished(!isFurnished)}
                />
                <label
                  htmlFor="furnished"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Furnished
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="pets"
                  className="h-4 w-4 text-emerald-500 border-gray-300 dark:border-gray-600 rounded"
                  checked={isPetsAllowed}
                  onChange={() => setIsPetsAllowed(!isPetsAllowed)}
                />
                <label
                  htmlFor="pets"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Pets allowed
                </label>
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="parking"
                  className="h-4 w-4 text-emerald-500 border-gray-300 dark:border-gray-600 rounded"
                  checked={hasParking}
                  onChange={() => setHasParking(!hasParking)}
                />
                <label
                  htmlFor="parking"
                  className="ml-2 text-sm text-gray-700 dark:text-gray-300"
                >
                  Parking
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              onClick={toggleFilters}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Results count */}
      <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <div className="flex justify-between">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Found {filteredProperties.length} properties in Yemen
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>Sort:</span>
            <button className="font-medium flex items-center text-gray-800 dark:text-gray-200">
              Newest <ChevronDown className="h-4 w-4 ml-1" />
            </button>
          </div>
        </div>
      </div>

      {/* Property listings */}
      <div
        className="p-4 overflow-y-auto flex-grow"
        style={{ maxHeight: "calc(100vh - 260px)" }}
      >
        {filteredProperties.length > 0 ? (
          <div
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 sm:grid-cols-2 gap-4"
                : "flex flex-col gap-4"
            }
          >
            {filteredProperties.map((property) => (
              <div
                key={property.id}
                className={`${viewMode === "grid" ? "" : "w-full"} ${
                  selectedProperty === property.id
                    ? "ring-2 ring-emerald-500 rounded-xl"
                    : ""
                }`}
                onClick={() => handlePropertyClick(property.id)}
              >
                <CardProperty
                  property={property}
                  isSelected={selectedProperty === property.id}
                />
                {viewMode === "list" && (
                  <hr className="mt-4 border-gray-100 dark:border-gray-800" />
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <Settings className="h-10 w-10 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
              No properties found
            </h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-sm">
              Try adjusting your search or filter parameters to find more
              properties.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
