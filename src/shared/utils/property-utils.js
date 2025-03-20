/**
 * Formats a price value as currency
 * @param {number} price - The price to format
 * @param {string} currency - Currency code (default: USD)
 * @returns {string} Formatted price string
 */
export const formatCurrency = (price, currency = "USD") => {
  if (price === undefined || price === null) return "";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

/**
 * Formats a date string into a human-readable format
 * @param {string} dateString - ISO date string to format
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

/**
 * Gets the appropriate color for a property status
 * @param {string} status - The property status
 * @returns {string} Color class for the status
 */
export const getStatusColor = (status) => {
  const statusMap = {
    "For Sale": "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
    "For Rent":
      "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
    Sold: "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300",
    Pending:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
    Rented: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
    Featured: "bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300",
  };

  return (
    statusMap[status] ||
    "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
  );
};

/**
 * Gets a readable label for a property type
 * @param {string} type - The property type code
 * @returns {string} Human-readable property type
 */
export const getPropertyTypeLabel = (type) => {
  const typeMap = {
    house: "House",
    apartment: "Apartment",
    condo: "Condo",
    villa: "Villa",
    townhouse: "Townhouse",
    land: "Land",
    commercial: "Commercial",
  };

  return typeMap[type?.toLowerCase()] || type || "Property";
};

/**
 * Formats a size in square feet/meters
 * @param {number} size - The size to format
 * @param {string} unit - Unit to display (sqft or sqm)
 * @returns {string} Formatted size string
 */
export const formatSize = (size, unit = "sqft") => {
  if (size === undefined || size === null) return "";

  return `${size.toLocaleString()} ${unit}`;
};

/**
 * Formats an address for display
 * @param {Object} addressParts - Object containing address components
 * @returns {string} Formatted address string
 */
export const formatAddress = (addressParts) => {
  if (!addressParts) return "";

  const { street, city, state, zipCode, country } = addressParts;
  const parts = [];

  if (street) parts.push(street);
  if (city) parts.push(city);
  if (state) {
    if (zipCode) {
      parts.push(`${state} ${zipCode}`);
    } else {
      parts.push(state);
    }
  } else if (zipCode) {
    parts.push(zipCode);
  }
  if (country) parts.push(country);

  return parts.join(", ");
};

/**
 * Truncates text to a specific length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length before truncation
 * @returns {string} Truncated text with ellipsis if needed
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text || "";
  return `${text.substring(0, maxLength).trim()}...`;
};

/**
 * Returns property amenities in a usable format
 * @param {Array|string} amenities - Amenities as array or comma-separated string
 * @returns {Array} Formatted array of amenities
 */
export const getAmenities = (amenities) => {
  if (!amenities) return [];
  if (Array.isArray(amenities)) return amenities;
  if (typeof amenities === "string")
    return amenities.split(",").map((a) => a.trim());
  return [];
};

/**
 * Calculates mortgage payment
 * @param {number} price - Property price
 * @param {number} downPayment - Down payment amount
 * @param {number} interestRate - Annual interest rate (as decimal)
 * @param {number} termYears - Mortgage term in years
 * @returns {number} Monthly payment
 */
export const calculateMortgage = (
  price,
  downPayment,
  interestRate,
  termYears
) => {
  if (!price || price <= 0) return 0;

  const principal = price - (downPayment || 0);
  const monthlyRate = interestRate / 12;
  const numberOfPayments = termYears * 12;

  if (interestRate === 0) return principal / numberOfPayments;

  const payment =
    (principal * (monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments))) /
    (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

  return payment;
};

/**
 * Handles property image upload to Supabase storage
 * @param {File} file - The image file to upload
 * @param {Object} supabase - Supabase client
 * @param {string} propertyId - The ID of the property
 * @returns {Promise<string>} The URL of the uploaded image
 */
export const uploadPropertyImage = async (file, supabase, propertyId) => {
  if (!file || !supabase || !propertyId) return null;

  // Generate a unique filename
  const fileExt = file.name.split(".").pop();
  const fileName = `${propertyId}/${Date.now()}.${fileExt}`;
  const filePath = `properties/${fileName}`;

  try {
    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from("property-images")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (error) throw error;

    // Get the public URL
    const { data: urlData } = supabase.storage
      .from("property-images")
      .getPublicUrl(filePath);

    return urlData.publicUrl;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

/**
 * Creates a property image record in the database
 * @param {Object} supabase - Supabase client
 * @param {string} propertyId - The ID of the property
 * @param {string} imageUrl - The URL of the uploaded image
 * @param {boolean} isPrimary - Whether this is the primary image
 * @returns {Promise<Object>} The created image record
 */
export const createPropertyImage = async (
  supabase,
  propertyId,
  imageUrl,
  isPrimary = false
) => {
  try {
    // Get current highest display order
    const { data: existingImages } = await supabase
      .from("property_images")
      .select("display_order")
      .eq("property_id", propertyId)
      .order("display_order", { ascending: false })
      .limit(1);

    const displayOrder =
      existingImages?.length > 0 ? existingImages[0].display_order + 1 : 0;

    // Insert new image
    const { data, error } = await supabase
      .from("property_images")
      .insert({
        property_id: propertyId,
        image_url: imageUrl,
        is_primary: isPrimary,
        display_order: displayOrder,
        created_at: new Date().toISOString(),
      })
      .select();

    if (error) throw error;

    return data[0];
  } catch (error) {
    console.error("Error creating property image record:", error);
    throw error;
  }
};
