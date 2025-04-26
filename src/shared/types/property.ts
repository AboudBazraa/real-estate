// Property types and interfaces

/**
 * Represents a property image
 */
export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  is_primary: boolean;
  display_order: number;
  created_at: string;
}

/**
 * Represents a property listing
 */
export interface Property {
  id: string;
  title: string;
  description: string;
  price: number;
  property_type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  location: string;
  latitude?: number;
  longitude?: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  lot_size?: number;
  year_built?: string;
  listing_type: string;
  status: string;
  featured: boolean;
  user_id: string;
  created_at: string;
  updated_at: string;
  images?: PropertyImage[];
  primaryImage?: string; // URL to primary image, for dashboard view
  features: boolean;
  agent?: {
    name: string;
    phone: string;
    email: string;
  };
}

/**
 * Property status options
 */
export enum PropertyStatus {
  AVAILABLE = "AVAILABLE",
  FOR_SALE = "FOR_SALE",
  FOR_RENT = "FOR_RENT",
  SOLD = "SOLD",
  RENTED = "RENTED",
  PENDING = "PENDING",
  OFF_MARKET = "OFF_MARKET",
}

/**
 * Property types
 */
export enum PropertyType {
  APARTMENT = "APARTMENT",
  HOUSE = "HOUSE",
  CONDO = "CONDO",
  TOWNHOUSE = "TOWNHOUSE",
  LAND = "LAND",
  INDUSTRIAL = "INDUSTRIAL",
  OTHER = "OTHER",
}

/**
 * Listing types
 */
export enum ListingType {
  SALE = "SALE",
  RENT = "RENT",
}

/**
 * Property filter options
 */
export interface PropertyFilters {
  status?: string;
  property_type?: string;
  listing_type?: string;
  featured?: boolean;
  min_price?: number;
  max_price?: number;
  bedrooms?: number;
  bathrooms?: number;
  min_area?: number;
  max_area?: number;
  search_term?: string;
}

/**
 * Property sorting options
 */
export interface PropertySort {
  column: string;
  ascending: boolean;
}

/**
 * Property form data structure for creating/editing properties
 */
export interface PropertyFormData {
  title: string;
  description: string;
  price: number;
  property_type: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
  location: string;
  latitude: number;
  longitude: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  lot_size?: number;
  year_built?: string;
  listing_type: string;
  status: string;
  featured: boolean;
  user_id?: string; // Optional because it's added by the hook
}

/**
 * Property dashboard statistics
 */
export interface PropertyStats {
  totalProperties: number;
  availableProperties: number;
  soldProperties: number;
  rentedProperties: number;
  averagePrice: number;
  totalValue: number;
}

/**
 * Property favorite
 */
export interface PropertyFavorite {
  id: string;
  property_id: string;
  user_id: string;
  created_at: string;
}
