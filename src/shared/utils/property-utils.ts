import {
  Property,
  PropertyStatus,
  PropertyType,
  ListingType,
} from "../types/property";

/**
 * Format currency to USD format
 */
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(amount);
};

/**
 * Format date to readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
};

/**
 * Calculate time ago from a given date
 */
export const timeAgo = (dateString: string): string => {
  const date = new Date(dateString);
  const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

  let interval = seconds / 31536000;
  if (interval > 1) return `${Math.floor(interval)} years ago`;

  interval = seconds / 2592000;
  if (interval > 1) return `${Math.floor(interval)} months ago`;

  interval = seconds / 86400;
  if (interval > 1) return `${Math.floor(interval)} days ago`;

  interval = seconds / 3600;
  if (interval > 1) return `${Math.floor(interval)} hours ago`;

  interval = seconds / 60;
  if (interval > 1) return `${Math.floor(interval)} minutes ago`;

  return `${Math.floor(seconds)} seconds ago`;
};

/**
 * Get color for property status badge
 */
export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case PropertyStatus.AVAILABLE:
    case PropertyStatus.FOR_SALE:
    case PropertyStatus.FOR_RENT:
      return "bg-green-100 text-green-800";
    case PropertyStatus.PENDING:
      return "bg-yellow-100 text-yellow-800";
    case PropertyStatus.SOLD:
    case PropertyStatus.RENTED:
      return "bg-red-100 text-red-800";
    case PropertyStatus.OFF_MARKET:
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
};

/**
 * Get human-readable property type
 */
export const getPropertyTypeLabel = (type: string): string => {
  switch (type?.toLowerCase()) {
    case PropertyType.APARTMENT:
      return "Apartment";
    case PropertyType.HOUSE:
      return "House";
    case PropertyType.CONDO:
      return "Condominium";
    case PropertyType.TOWNHOUSE:
      return "Townhouse";
    case PropertyType.LAND:
      return "Land";
    case "commercial":
      return "Commercial Property";
    case "industrial":
      return "Industrial Property";
    case PropertyType.OTHER:
      return "Other Property";
    default:
      return type ? type.charAt(0).toUpperCase() + type.slice(1) : "Property";
  }
};

/**
 * Get human-readable listing type
 */
export const getListingTypeLabel = (type: string): string => {
  switch (type.toLowerCase()) {
    case ListingType.SALE:
      return "For Sale";
    case ListingType.RENT:
      return "For Rent";
    default:
      return type ? type.charAt(0).toUpperCase() + type.slice(1) : "Listing";
  }
};

/**
 * Get property short address for display
 */
export const getShortAddress = (property: Property): string => {
  if (property.location) return property.location;

  if (property.city && property.state) {
    return `${property.city}, ${property.state}`;
  }

  if (property.address) {
    // Truncate address if too long
    return property.address.length > 30
      ? property.address.substring(0, 30) + "..."
      : property.address;
  }

  return "Address not available";
};

/**
 * Get property full address
 */
export const getFullAddress = (property: Property): string => {
  const address = property.address || "";
  const city = property.city || "";
  const state = property.state || "";
  const zip = property.zip_code || "";
  const country = property.country || "";

  let fullAddress = address;

  if (city && state) {
    fullAddress += fullAddress ? `, ${city}, ${state}` : `${city}, ${state}`;
  } else if (city) {
    fullAddress += fullAddress ? `, ${city}` : city;
  } else if (state) {
    fullAddress += fullAddress ? `, ${state}` : state;
  }

  if (zip) {
    fullAddress += fullAddress ? ` ${zip}` : zip;
  }

  if (country) {
    fullAddress += fullAddress ? `, ${country}` : country;
  }

  return fullAddress || "Address not available";
};

/**
 * Get property features as a formatted string
 */
export const getPropertyFeatures = (property: Property): string => {
  const features: string[] = [];

  if (property.bedrooms) {
    features.push(
      `${property.bedrooms} ${property.bedrooms === 1 ? "bed" : "beds"}`
    );
  }

  if (property.bathrooms) {
    features.push(
      `${property.bathrooms} ${property.bathrooms === 1 ? "bath" : "baths"}`
    );
  }

  if (property.area) {
    features.push(`${property.area} sq ft`);
  }

  return features.join(" · ");
};

/**
 * Generate title for property if none exists
 */
export const generatePropertyTitle = (property: Property): string => {
  if (property.title) return property.title;

  const type = getPropertyTypeLabel(property.property_type);
  const location = property.city || property.location;

  if (location) {
    return `${type} in ${location}`;
  }

  return `${type} Property`;
};

/**
 * Get property image URL or placeholder
 */
export const getPropertyImageUrl = (property: Property): string => {
  if (property.primaryImage) return property.primaryImage;

  if (property.images && property.images.length > 0) {
    const primaryImage = property.images.find((img) => img.is_primary);
    return primaryImage?.image_url || property.images[0].image_url;
  }

  return "/images/property-placeholder.jpg";
};

/**
 * Filter properties by status
 */
export const filterPropertiesByStatus = (
  properties: Property[],
  status: string
): Property[] => {
  return properties.filter(
    (property) => property.status.toLowerCase() === status.toLowerCase()
  );
};

/**
 * Calculate total property value
 */
export const calculateTotalValue = (properties: Property[]): number => {
  return properties.reduce((total, property) => total + property.price, 0);
};
