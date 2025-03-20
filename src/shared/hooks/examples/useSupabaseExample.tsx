"use client";

import { useState, useEffect } from "react";
import {
  useSupabaseList,
  useSupabaseItem,
  useSupabaseInsert,
  useSupabaseUpdate,
  useSupabaseDelete,
  useSupabaseSubscription,
} from "@/shared/hooks/useSupabase";
import { useToast } from "@/shared/hooks/use-toast";

// Define a proper type for property
interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  description: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  user_id: string;
}

export default function PropertyManagement() {
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [newProperty, setNewProperty] = useState({
    title: "",
    price: 0,
    location: "",
    description: "",
    bedrooms: 2,
    bathrooms: 1,
    area: 1000,
  });

  // For editing properties
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);
  const { toast } = useToast();

  // Fetch all properties with filtering and pagination
  const {
    data: propertiesData,
    isLoading,
    isError,
  } = useSupabaseList("properties", {
    // Filter by title if search query exists
    filters: searchQuery
      ? [{ column: "title", operator: "ilike", value: `%${searchQuery}%` }]
      : undefined,
    // Order by creation date, newest first
    order: { column: "created_at", ascending: false },
    // Limit to 10 results
    limit: 10,
  });

  // Safely cast the data to Property[] type using double assertion for safety
  const properties = propertiesData as unknown as Property[] | null;

  // Fetch a single property by ID
  const { data: selectedPropertyData, isLoading: isLoadingProperty } =
    useSupabaseItem("properties", selectedPropertyId);

  // Safely cast the data to Property type using double assertion for safety
  const selectedProperty = selectedPropertyData as unknown as Property | null;

  // Update editingProperty when selectedProperty changes
  useEffect(() => {
    if (selectedProperty) {
      setEditingProperty(selectedProperty);
    }
  }, [selectedProperty]);

  // Create a new property
  const insertMutation = useSupabaseInsert<Property>("properties");

  // Update a property
  const updateMutation = useSupabaseUpdate<Property>("properties");

  // Delete a property
  const deleteMutation = useSupabaseDelete("properties");

  // Subscribe to property changes
  useSupabaseSubscription("properties", { event: "*" }, (payload) => {
    console.log("Property changed:", payload);
    // You could refetch data here or update the UI directly
  });

  // Form handlers
  const handleCreateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Create a new property with ID assigned for optimistic updates
      const newPropertyWithId = {
        ...newProperty,
        id: `temp-${Date.now()}`, // Temporary ID for optimistic UI
        user_id: "current-user", // Will be replaced by the server
        created_at: new Date().toISOString(),
      };

      await insertMutation.mutateAsync(newPropertyWithId, {
        onSuccess: () => {
          // Reset form after successful creation
          setNewProperty({
            title: "",
            price: 0,
            location: "",
            description: "",
            bedrooms: 2,
            bathrooms: 1,
            area: 1000,
          });
        },
      });
    } catch (error) {
      console.error("Error creating property:", error);
    }
  };

  const handleUpdateProperty = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProperty || !selectedPropertyId) return;

    const updatedFields = {
      title: editingProperty.title,
      price: editingProperty.price,
      description: editingProperty.description,
    };

    try {
      await updateMutation.mutateAsync(
        {
          data: updatedFields,
          match: { id: selectedPropertyId },
        },
        {
          onSuccess: () => {
            toast({
              title: "Success",
              description: "Property updated successfully",
              variant: "default",
            });
          },
        }
      );
    } catch (error) {
      console.error("Error updating property:", error);
    }
  };

  const handleDeleteProperty = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(
        { id },
        {
          onSuccess: () => {
            // Clear selection if the deleted property was selected
            if (selectedPropertyId === id) {
              setSelectedPropertyId(null);
              setEditingProperty(null);
            }
          },
        }
      );
    } catch (error) {
      console.error("Error deleting property:", error);
    }
  };

  // Loading and error states
  if (isLoading) return <div>Loading properties...</div>;
  if (isError) return <div>Error loading properties</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Property Management</h1>

      {/* Search */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search properties..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2 border rounded w-full"
        />
      </div>

      {/* Create Property Form */}
      <div className="mb-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">Add New Property</h2>
        <form onSubmit={handleCreateProperty}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1">Title</label>
              <input
                type="text"
                value={newProperty.title}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, title: e.target.value })
                }
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Price</label>
              <input
                type="number"
                value={newProperty.price}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    price: Number(e.target.value),
                  })
                }
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Location</label>
              <input
                type="text"
                value={newProperty.location}
                onChange={(e) =>
                  setNewProperty({ ...newProperty, location: e.target.value })
                }
                className="p-2 border rounded w-full"
                required
              />
            </div>
            <div>
              <label className="block mb-1">Description</label>
              <textarea
                value={newProperty.description}
                onChange={(e) =>
                  setNewProperty({
                    ...newProperty,
                    description: e.target.value,
                  })
                }
                className="p-2 border rounded w-full"
                rows={2}
              />
            </div>
          </div>
          <button
            type="submit"
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
            disabled={insertMutation.isPending}
          >
            {insertMutation.isPending ? "Creating..." : "Create Property"}
          </button>
        </form>
      </div>

      {/* Property List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {properties &&
          properties.map((property) => (
            <div key={property.id} className="border rounded p-4">
              <h3 className="text-lg font-semibold">{property.title}</h3>
              <p className="text-gray-700">
                ${property.price.toLocaleString()}
              </p>
              <p className="text-gray-600">{property.location}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setSelectedPropertyId(property.id)}
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  View
                </button>
                <button
                  onClick={() => handleDeleteProperty(property.id)}
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  disabled={deleteMutation.isPending}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
      </div>

      {/* Selected Property Details */}
      {selectedPropertyId && selectedProperty && (
        <div className="mt-8 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-4">
            Edit Property: {selectedProperty.title}
          </h2>
          {isLoadingProperty ? (
            <p>Loading property details...</p>
          ) : (
            <form onSubmit={handleUpdateProperty}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1">Title</label>
                  <input
                    type="text"
                    value={editingProperty?.title || ""}
                    onChange={(e) =>
                      editingProperty &&
                      setEditingProperty({
                        ...editingProperty,
                        title: e.target.value,
                      })
                    }
                    className="p-2 border rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Price</label>
                  <input
                    type="number"
                    value={editingProperty?.price || 0}
                    onChange={(e) =>
                      editingProperty &&
                      setEditingProperty({
                        ...editingProperty,
                        price: Number(e.target.value),
                      })
                    }
                    className="p-2 border rounded w-full"
                  />
                </div>
                <div>
                  <label className="block mb-1">Description</label>
                  <textarea
                    value={editingProperty?.description || ""}
                    onChange={(e) =>
                      editingProperty &&
                      setEditingProperty({
                        ...editingProperty,
                        description: e.target.value,
                      })
                    }
                    className="p-2 border rounded w-full"
                    rows={2}
                  />
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <button
                  type="submit"
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? "Updating..." : "Update Property"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedPropertyId(null);
                    setEditingProperty(null);
                  }}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
