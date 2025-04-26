import { useState, useEffect, useCallback } from "react";
import { useSupabase } from "@/shared/providers/SupabaseProvider";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Property,
  PropertyImage,
  PropertyFilters,
  PropertySort,
} from "@/shared/types/property";

export type {
  Property,
  PropertyImage,
  PropertyFilters,
  PropertySort,
} from "@/shared/types/property";

export const useProperties = () => {
  const { supabase, user, isAdmin } = useSupabase();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [totalCount, setTotalCount] = useState(0);

  // Helper function to apply filters to the query
  const applyFilters = (query: any, filters?: PropertyFilters) => {
    let filteredQuery = query;

    if (!filters) return filteredQuery;

    // Apply property type filter
    if (filters.property_type) {
      filteredQuery = filteredQuery.eq("property_type", filters.property_type);
    }

    // Apply status filter
    if (filters.status) {
      filteredQuery = filteredQuery.eq("status", filters.status);
    }

    // Apply listing type filter
    if (filters.listing_type) {
      filteredQuery = filteredQuery.eq("listing_type", filters.listing_type);
    }

    // Apply featured filter
    if (filters.featured !== undefined) {
      filteredQuery = filteredQuery.eq("featured", filters.featured);
    }

    // Apply price range filters
    if (filters.min_price !== undefined) {
      filteredQuery = filteredQuery.gte("price", filters.min_price);
    }

    if (filters.max_price !== undefined) {
      filteredQuery = filteredQuery.lte("price", filters.max_price);
    }

    // Apply bedroom filter
    if (filters.bedrooms !== undefined) {
      filteredQuery = filteredQuery.gte("bedrooms", filters.bedrooms);
    }

    // Apply bathroom filter
    if (filters.bathrooms !== undefined) {
      filteredQuery = filteredQuery.gte("bathrooms", filters.bathrooms);
    }

    // Apply area filters
    if (filters.min_area !== undefined) {
      filteredQuery = filteredQuery.gte("area", filters.min_area);
    }

    if (filters.max_area !== undefined) {
      filteredQuery = filteredQuery.lte("area", filters.max_area);
    }

    // Apply text search filter
    if (filters.search_term) {
      filteredQuery = filteredQuery.or(
        `title.ilike.%${filters.search_term}%,description.ilike.%${filters.search_term}%,location.ilike.%${filters.search_term}%`
      );
    }

    return filteredQuery;
  };

  // Fetch properties with optional filtering, sorting, pagination
  const fetchProperties = useCallback(
    async (
      pageIndex = 0,
      pageSize = 10,
      filters?: PropertyFilters,
      sort?: PropertySort,
      fetchUserPropertiesOnly = false,
      fetchFeaturedPropertiesOnly = false
    ) => {
      setLoading(true);
      setError(null);

      try {
        // Calculate pagination range
        const from = pageIndex * pageSize;
        const to = from + pageSize - 1;

        // Start building the query
        let query = supabase.from("properties").select("*", { count: "exact" });

        // If fetching only user's properties
        if (fetchUserPropertiesOnly && user?.id) {
          query = query.eq("user_id", user.id);
        }

        // If fetching only featured properties
        if (fetchFeaturedPropertiesOnly) {
          query = query.eq("featured", true);
        }

        // Apply filters
        query = applyFilters(query, filters);

        // Apply sorting
        if (sort) {
          query = query.order(sort.column, { ascending: sort.ascending });
        } else {
          // Default sorting by created_at in descending order
          query = query.order("created_at", { ascending: false });
        }

        // Apply pagination
        query = query.range(from, to);

        // Execute the query
        const { data, error, count } = await query;

        if (error) throw error;

        // Store the total count for pagination
        if (count !== null) {
          setTotalCount(count);
        }

        // Fetch images for each property
        const propertiesWithImages = await Promise.all(
          (data || []).map(async (property) => {
            const { data: images } = await supabase
              .from("property_images")
              .select("*")
              .eq("property_id", property.id)
              .order("display_order", { ascending: true });

            // Get the primary image URL for dashboard display
            const primaryImage =
              images?.find((img) => img.is_primary)?.image_url ||
              (images && images.length > 0 ? images[0].image_url : null);

            return { ...property, images: images || [], primaryImage };
          })
        );

        setProperties(propertiesWithImages);
      } catch (err: any) {
        console.error("Error fetching properties:", err);
        setError(err.message || "Failed to fetch properties");
        toast({
          title: "Error",
          description: err.message || "Failed to fetch properties",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    },
    [supabase, user, toast]
  );

  // Fetch a single property by ID with its images
  const fetchPropertyById = useCallback(
    async (propertyId: string) => {
      setLoading(true);
      setError(null);

      try {
        // Fetch property details
        const { data: property, error: propertyError } = await supabase
          .from("properties")
          .select("*")
          .eq("id", propertyId)
          .single();

        if (propertyError) throw propertyError;

        // Fetch property images
        const { data: images, error: imagesError } = await supabase
          .from("property_images")
          .select("*")
          .eq("property_id", propertyId)
          .order("display_order", { ascending: true });

        if (imagesError) throw imagesError;

        // Get the primary image URL
        const primaryImage =
          images?.find((img) => img.is_primary)?.image_url ||
          (images && images.length > 0 ? images[0].image_url : null);

        // Combine property with its images
        const propertyWithImages = {
          ...property,
          images: images || [],
          primaryImage,
        };

        return propertyWithImages;
      } catch (err: any) {
        console.error("Error fetching property:", err);
        setError(err.message || "Failed to fetch property details");
        toast({
          title: "Error",
          description: err.message || "Failed to fetch property details",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [supabase, toast]
  );

  // Create a new property
  const createProperty = useCallback(
    async (
      propertyData: Omit<Property, "id" | "created_at" | "updated_at">,
      imageFiles: File[]
    ) => {
      setLoading(true);
      setError(null);

      try {
        if (!user) {
          throw new Error("You must be logged in to create a property");
        }

        // Validate required fields
        if (!propertyData.title) {
          throw new Error("Property title is required");
        }

        if (propertyData.price <= 0) {
          throw new Error("Property price must be greater than 0");
        }

        // Ensure location is set (required field)
        if (!propertyData.location) {
          propertyData.location =
            propertyData.city && propertyData.state
              ? `${propertyData.city}, ${propertyData.state}`
              : propertyData.address || "Not specified";
        }

        // Add user_id and timestamps to the property data
        const propertyForInsert = {
          ...propertyData,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        // Insert the property
        const { data: newProperty, error: propertyError } = await supabase
          .from("properties")
          .insert(propertyForInsert)
          .select()
          .single();

        if (propertyError) throw propertyError;

        if (!newProperty) {
          throw new Error("Failed to create property record");
        }

        // Handle image uploads if there are any
        if (imageFiles && imageFiles.length > 0) {
          // Track successful uploads
          let uploadSuccessCount = 0;
          const uploadErrors: string[] = [];

          // Upload each image
          for (let i = 0; i < imageFiles.length; i++) {
            try {
              const file = imageFiles[i];

              // Skip invalid files
              if (!file || !(file instanceof File)) {
                console.warn("Invalid file object, skipping", file);
                continue;
              }

              // Create a unique filename with extension
              const fileExt = file.name.split(".").pop() || "jpg";
              const fileName = `${Date.now()}-${i}.${fileExt}`;
              const filePath = `properties/${newProperty.id}/${fileName}`;

              // Upload to storage
              const { data: uploadData, error: uploadError } =
                await supabase.storage
                  .from("properties")
                  .upload(filePath, file, {
                    contentType: file.type || `image/${fileExt}`,
                    cacheControl: "3600",
                    upsert: false,
                  });

              if (uploadError) {
                console.error(`Error uploading image ${i}:`, uploadError);
                uploadErrors.push(
                  `Failed to upload image ${i + 1}: ${uploadError.message}`
                );
                continue; // Skip to next image on error
              }

              // Get the public URL
              const { data: publicUrlData } = supabase.storage
                .from("properties")
                .getPublicUrl(filePath);

              if (!publicUrlData || !publicUrlData.publicUrl) {
                console.error("Failed to get public URL for uploaded image");
                continue;
              }

              // Insert image record
              const { error: imageInsertError } = await supabase
                .from("property_images")
                .insert({
                  property_id: newProperty.id,
                  image_url: publicUrlData.publicUrl,
                  is_primary: i === 0, // First image is primary
                  display_order: i,
                  created_at: new Date().toISOString(),
                });

              if (imageInsertError) {
                console.error(
                  "Error inserting image record:",
                  imageInsertError
                );
                continue;
              }

              uploadSuccessCount++;
            } catch (uploadErr) {
              console.error("Error processing image upload:", uploadErr);
              // Continue with next image
            }
          }

          // Notify about image uploads
          if (uploadSuccessCount > 0) {
            toast({
              title: "Images Uploaded",
              description: `${uploadSuccessCount} of ${imageFiles.length} images uploaded successfully`,
            });
          }

          // Show upload errors if any
          if (uploadErrors.length > 0) {
            console.warn("Some images failed to upload:", uploadErrors);
            if (uploadSuccessCount === 0) {
              toast({
                title: "Image Upload Failed",
                description:
                  "Failed to upload any images. The property was created without images.",
                variant: "destructive",
              });
            }
          }
        }

        toast({
          title: "Success",
          description: "Property created successfully",
        });

        // Refresh the properties list
        fetchProperties();

        return newProperty;
      } catch (err: any) {
        console.error("Error creating property:", err);
        setError(err.message || "Failed to create property");
        toast({
          title: "Error",
          description: err.message || "Failed to create property",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [supabase, user, toast, fetchProperties]
  );

  // Update an existing property
  const updateProperty = useCallback(
    async (
      propertyId: string,
      propertyData: Partial<Property>,
      newImageFiles?: File[],
      imagesToDelete?: string[]
    ) => {
      setLoading(true);
      setError(null);

      try {
        if (!user) {
          throw new Error("You must be logged in to update a property");
        }

        // Get the current property to check ownership
        const { data: currentProperty, error: fetchError } = await supabase
          .from("properties")
          .select("user_id")
          .eq("id", propertyId)
          .single();

        if (fetchError) throw fetchError;

        // Check if the user owns this property or is an admin
        if (currentProperty.user_id !== user.id && !isAdmin) {
          throw new Error("You can only update your own properties");
        }

        // Ensure location is updated if city or state changed
        if (propertyData.city || propertyData.state) {
          // Fetch current property to get existing city/state
          const { data: fullProperty } = await supabase
            .from("properties")
            .select("city, state, location")
            .eq("id", propertyId)
            .single();

          if (fullProperty) {
            const city = propertyData.city || fullProperty.city;
            const state = propertyData.state || fullProperty.state;

            if (city && state) {
              propertyData.location = `${city}, ${state}`;
            }
          }
        }

        // Update timestamp
        const dataToUpdate = {
          ...propertyData,
          updated_at: new Date().toISOString(),
        };

        // Update the property
        const { data: updatedProperty, error: updateError } = await supabase
          .from("properties")
          .update(dataToUpdate)
          .eq("id", propertyId)
          .select()
          .single();

        if (updateError) throw updateError;

        // Handle image deletions if specified
        if (imagesToDelete && imagesToDelete.length > 0) {
          for (const imageId of imagesToDelete) {
            try {
              // Get the image record to find the filepath
              const { data: imageRecord } = await supabase
                .from("property_images")
                .select("image_url")
                .eq("id", imageId)
                .single();

              if (imageRecord) {
                // Extract the filepath from the URL
                const url = new URL(imageRecord.image_url);
                const pathMatch = url.pathname.match(/\/properties\/([^\/]+)/);

                if (pathMatch && pathMatch[1]) {
                  // Delete from storage
                  await supabase.storage
                    .from("properties")
                    .remove([pathMatch[1]]);
                }

                // Delete the image record
                await supabase
                  .from("property_images")
                  .delete()
                  .eq("id", imageId);
              }
            } catch (deleteErr) {
              console.error("Error deleting image:", deleteErr);
              // Continue with next image
            }
          }
        }

        // Handle new image uploads
        if (newImageFiles && newImageFiles.length > 0) {
          // Get current images count for ordering
          const { data: currentImages } = await supabase
            .from("property_images")
            .select("id, is_primary")
            .eq("property_id", propertyId);

          const startOrder = currentImages?.length || 0;
          const hasPrimaryImage =
            currentImages?.some((img) => img.is_primary) || false;

          // Upload each new image
          for (let i = 0; i < newImageFiles.length; i++) {
            try {
              const file = newImageFiles[i];

              // Create a unique filename
              const fileName = `${Date.now()}-${i}.${
                file.name.split(".").pop() || "jpg"
              }`;
              const filePath = `${propertyId}/${fileName}`;

              // Upload to storage
              const { error: uploadError } = await supabase.storage
                .from("properties")
                .upload(filePath, file, {
                  cacheControl: "3600",
                  upsert: true,
                });

              if (uploadError) {
                console.error("Error uploading image:", uploadError);
                continue; // Skip to next image on error
              }

              // Get the public URL
              const { data: publicUrlData } = supabase.storage
                .from("properties")
                .getPublicUrl(filePath);

              // Insert image record - set as primary if no primary exists and this is the first upload
              const isPrimary = !hasPrimaryImage && i === 0;

              await supabase.from("property_images").insert({
                property_id: propertyId,
                image_url: publicUrlData.publicUrl,
                is_primary: isPrimary,
                display_order: startOrder + i,
                created_at: new Date().toISOString(),
              });
            } catch (uploadErr) {
              console.error("Error processing new image:", uploadErr);
              // Continue with next image
            }
          }
        }

        toast({
          title: "Success",
          description: "Property updated successfully",
        });

        // Refresh the properties list
        fetchProperties();

        return updatedProperty;
      } catch (err: any) {
        console.error("Error updating property:", err);
        setError(err.message || "Failed to update property");
        toast({
          title: "Error",
          description: err.message || "Failed to update property",
          variant: "destructive",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [supabase, user, toast, fetchProperties, isAdmin]
  );

  // Delete a property
  const deleteProperty = useCallback(
    async (propertyId: string) => {
      setLoading(true);
      setError(null);

      try {
        if (!user) {
          throw new Error("You must be logged in to delete a property");
        }

        // Get the current property to check ownership
        const { data: currentProperty, error: fetchError } = await supabase
          .from("properties")
          .select("user_id")
          .eq("id", propertyId)
          .single();

        if (fetchError) throw fetchError;

        // Check if the user owns this property or is an admin
        if (currentProperty.user_id !== user.id && !isAdmin) {
          throw new Error("You can only delete your own properties");
        }

        // Delete property images from storage
        // This is handled automatically by cascade delete in the database
        // But we need to clean up the storage files
        const { data: images } = await supabase
          .from("property_images")
          .select("image_url")
          .eq("property_id", propertyId);

        if (images && images.length > 0) {
          for (const image of images) {
            try {
              // Extract the file path from the URL
              const url = new URL(image.image_url);
              const pathMatch = url.pathname.match(/\/properties\/([^\/]+)/);

              if (pathMatch && pathMatch[1]) {
                // Delete from storage
                await supabase.storage
                  .from("properties")
                  .remove([pathMatch[1]]);
              }
            } catch (deleteErr) {
              console.error("Error deleting storage file:", deleteErr);
              // Continue with next image
            }
          }
        }

        // Delete the property (this will cascade delete property_images records)
        const { error: deleteError } = await supabase
          .from("properties")
          .delete()
          .eq("id", propertyId);

        if (deleteError) throw deleteError;

        toast({
          title: "Success",
          description: "Property deleted successfully",
        });

        // Refresh the properties list
        fetchProperties();

        return true;
      } catch (err: any) {
        console.error("Error deleting property:", err);
        setError(err.message || "Failed to delete property");
        toast({
          title: "Error",
          description: err.message || "Failed to delete property",
          variant: "destructive",
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [supabase, user, toast, fetchProperties, isAdmin]
  );

  // Toggle property favorite status
  const toggleFavorite = useCallback(
    async (propertyId: string) => {
      try {
        if (!user) {
          throw new Error("You must be logged in to favorite properties");
        }

        // Check if the property is already favorited
        const { data: existingFavorite } = await supabase
          .from("favorites")
          .select("id")
          .eq("property_id", propertyId)
          .eq("user_id", user.id)
          .single();

        if (existingFavorite) {
          // Remove from favorites
          await supabase
            .from("favorites")
            .delete()
            .eq("id", existingFavorite.id);

          toast({
            title: "Removed from Favorites",
            description: "Property removed from your favorites",
          });

          return false; // Not favorited
        } else {
          // Add to favorites
          await supabase.from("favorites").insert({
            property_id: propertyId,
            user_id: user.id,
            created_at: new Date().toISOString(),
          });

          toast({
            title: "Added to Favorites",
            description: "Property added to your favorites",
          });

          return true; // Favorited
        }
      } catch (err: any) {
        console.error("Error toggling favorite:", err);
        toast({
          title: "Error",
          description: err.message || "Failed to update favorites",
          variant: "destructive",
        });
        return null;
      }
    },
    [supabase, user, toast]
  );

  // Check if a property is favorited by the current user
  const checkIsFavorited = useCallback(
    async (propertyId: string) => {
      if (!user) return false;

      try {
        const { data, error } = await supabase
          .from("favorites")
          .select("id")
          .eq("property_id", propertyId)
          .eq("user_id", user.id)
          .single();

        if (error && error.code !== "PGRST116") {
          // PGRST116 is "row not found"
          throw error;
        }

        return !!data;
      } catch (err) {
        console.error("Error checking favorite status:", err);
        return false;
      }
    },
    [supabase, user]
  );

  // Change primary image
  const setPrimaryImage = useCallback(
    async (imageId: string, propertyId: string) => {
      try {
        if (!user) {
          throw new Error("You must be logged in to update property images");
        }

        // First, check if the user owns this property
        const { data: property, error: propertyError } = await supabase
          .from("properties")
          .select("user_id")
          .eq("id", propertyId)
          .single();

        if (propertyError) throw propertyError;
        if (property.user_id !== user.id && !isAdmin) {
          throw new Error("You can only modify your own properties");
        }

        // Reset all images to non-primary
        await supabase
          .from("property_images")
          .update({ is_primary: false })
          .eq("property_id", propertyId);

        // Set the selected image as primary
        const { error } = await supabase
          .from("property_images")
          .update({ is_primary: true })
          .eq("id", imageId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Primary image updated",
        });

        return true;
      } catch (err: any) {
        console.error("Error setting primary image:", err);
        toast({
          title: "Error",
          description: err.message || "Failed to update primary image",
          variant: "destructive",
        });
        return false;
      }
    },
    [supabase, user, toast, isAdmin]
  );

  // Reorder images
  const reorderImages = useCallback(
    async (
      propertyId: string,
      imageOrders: { id: string; display_order: number }[]
    ) => {
      try {
        if (!user) {
          throw new Error("You must be logged in to reorder property images");
        }

        // Check if the user owns this property
        const { data: property, error: propertyError } = await supabase
          .from("properties")
          .select("user_id")
          .eq("id", propertyId)
          .single();

        if (propertyError) throw propertyError;
        if (property.user_id !== user.id && !isAdmin) {
          throw new Error("You can only modify your own properties");
        }

        // Update each image's display order
        for (const { id, display_order } of imageOrders) {
          await supabase
            .from("property_images")
            .update({ display_order })
            .eq("id", id);
        }

        toast({
          title: "Success",
          description: "Image order updated",
        });

        return true;
      } catch (err: any) {
        console.error("Error reordering images:", err);
        toast({
          title: "Error",
          description: err.message || "Failed to reorder images",
          variant: "destructive",
        });
        return false;
      }
    },
    [supabase, user, toast, isAdmin]
  );

  // Get user's favorited properties
  const getFavoritedProperties = useCallback(
    async (pageIndex = 0, pageSize = 10) => {
      setLoading(true);
      setError(null);

      try {
        if (!user) {
          throw new Error("You must be logged in to view favorited properties");
        }

        // Calculate pagination range
        const from = pageIndex * pageSize;
        const to = from + pageSize - 1;

        // First get the favorite IDs
        const {
          data: favorites,
          error: favError,
          count,
        } = await supabase
          .from("favorites")
          .select("property_id", { count: "exact" })
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .range(from, to);

        if (favError) throw favError;

        if (!favorites || favorites.length === 0) {
          setProperties([]);
          setTotalCount(0);
          setLoading(false);
          return [];
        }

        // Store the total count for pagination
        if (count !== null) {
          setTotalCount(count);
        }

        // Get property IDs from favorites
        const propertyIds = favorites.map((fav) => fav.property_id);

        // Fetch the actual properties
        const { data: propertiesData, error: propsError } = await supabase
          .from("properties")
          .select("*")
          .in("id", propertyIds);

        if (propsError) throw propsError;

        // Fetch images for each property
        const propertiesWithImages = await Promise.all(
          (propertiesData || []).map(async (property) => {
            const { data: images } = await supabase
              .from("property_images")
              .select("*")
              .eq("property_id", property.id)
              .order("display_order", { ascending: true });

            // Get the primary image URL
            const primaryImage =
              images?.find((img) => img.is_primary)?.image_url ||
              (images && images.length > 0 ? images[0].image_url : null);

            return { ...property, images: images || [], primaryImage };
          })
        );

        setProperties(propertiesWithImages);
        return propertiesWithImages;
      } catch (err: any) {
        console.error("Error fetching favorited properties:", err);
        setError(err.message || "Failed to fetch favorited properties");
        toast({
          title: "Error",
          description: err.message || "Failed to fetch favorited properties",
          variant: "destructive",
        });
        return [];
      } finally {
        setLoading(false);
      }
    },
    [supabase, user, toast]
  );

  // Set up real-time subscription for properties
  useEffect(() => {
    if (!supabase) return;

    const subscription = supabase
      .channel("public:properties")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "properties",
        },
        () => {
          // Refresh properties when changes occur
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [supabase, fetchProperties]);

  const getPropertyById = useCallback(
    async (id: string): Promise<Property> => {
      try {
        if (!id) {
          throw new Error("Property ID is required");
        }

        // First, get the property data
        const { data: propertyData, error: propertyError } = await supabase
          .from("properties")
          .select("*")
          .eq("id", id)
          .single();

        if (propertyError) {
          console.error("Supabase error:", propertyError);
          throw new Error(propertyError.message || "Failed to fetch property");
        }

        if (!propertyData) {
          throw new Error("Property not found");
        }

        // Get property images
        const { data: imagesData, error: imagesError } = await supabase
          .from("property_images")
          .select("*")
          .eq("property_id", id)
          .order("display_order", { ascending: true });

        if (imagesError) {
          console.error("Error fetching property images:", imagesError);
        }

        // Get user data (poster) from profiles table
        let userData: { name: string; email: string } | null = null;
        if (propertyData.user_id) {
          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("name, email")
            .eq("id", propertyData.user_id)
            .single();

          if (!profileError && profile) {
            userData = {
              name: profile.name || "Unknown User",
              email: profile.email || "No email provided",
            };
          }
        }

        return {
          ...propertyData,
          images: imagesData || [],
          agent: userData, // Using agent field to store the poster's info
          features: propertyData.features || [],
        };
      } catch (err) {
        console.error("Error fetching property:", err);
        throw err instanceof Error
          ? err
          : new Error("Failed to fetch property");
      }
    },
    [supabase]
  );

  // Get similar properties based on property type, listing type, and price range
  const getSimilarProperties = useCallback(
    async (propertyId: string, limit = 4): Promise<Property[]> => {
      try {
        // First, get the current property
        const { data: currentProperty, error: propertyError } = await supabase
          .from("properties")
          .select("*")
          .eq("id", propertyId)
          .single();

        if (propertyError) throw propertyError;
        if (!currentProperty) throw new Error("Property not found");

        // Calculate price range (±20% of the current property's price)
        const minPrice = Math.floor(currentProperty.price * 0.8);
        const maxPrice = Math.ceil(currentProperty.price * 1.2);

        // Find similar properties with matching property_type and price range
        const { data: similarPropertiesData, error: similarError } =
          await supabase
            .from("properties")
            .select("*")
            .neq("id", propertyId) // Exclude current property
            .eq("property_type", currentProperty.property_type)
            .eq("listing_type", currentProperty.listing_type)
            .gte("price", minPrice)
            .lte("price", maxPrice)
            .limit(limit);

        if (similarError) throw similarError;

        // If we don't have enough properties, do a broader search
        if (!similarPropertiesData || similarPropertiesData.length < limit) {
          const { data: broaderResults, error: broadError } = await supabase
            .from("properties")
            .select("*")
            .neq("id", propertyId)
            .eq("property_type", currentProperty.property_type)
            .limit(limit - (similarPropertiesData?.length || 0));

          if (!broadError && broaderResults) {
            // Combine results, avoiding duplicates
            const existingIds = new Set(
              similarPropertiesData?.map((p) => p.id)
            );
            const additionalProperties = broaderResults.filter(
              (p) => !existingIds.has(p.id)
            );
            similarPropertiesData?.push(
              ...additionalProperties.slice(
                0,
                limit - similarPropertiesData.length
              )
            );
          }
        }

        // Fetch images for each property
        const propertiesWithImages = await Promise.all(
          (similarPropertiesData || []).map(async (property) => {
            const { data: images } = await supabase
              .from("property_images")
              .select("*")
              .eq("property_id", property.id)
              .order("display_order", { ascending: true });

            // Get the primary image URL
            const primaryImage =
              images?.find((img) => img.is_primary)?.image_url ||
              (images && images.length > 0 ? images[0].image_url : null);

            return {
              ...property,
              images: images || [],
              primaryImage,
            };
          })
        );

        return propertiesWithImages;
      } catch (err) {
        console.error("Error fetching similar properties:", err);
        // Return empty array instead of throwing to avoid breaking the UI
        return [];
      }
    },
    [supabase]
  );

  return {
    properties,
    loading,
    error,
    totalCount,
    fetchProperties,
    fetchPropertyById,
    createProperty,
    updateProperty,
    deleteProperty,
    toggleFavorite,
    checkIsFavorited,
    setPrimaryImage,
    reorderImages,
    getFavoritedProperties,
    getPropertyById,
    getSimilarProperties,
  };
};
