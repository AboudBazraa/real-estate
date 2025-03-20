"use client";

import { useState, useEffect } from "react";
import { useSupabase } from "@/shared/providers/SupabaseProvider";
import { useUser } from "@/shared/providers/UserProvider";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { PlusCircle, Search, Filter, SlidersHorizontal } from "lucide-react";
import { PropertyFormModal } from "../components/PropertyFormModal";
import { PropertyCard } from "../components/PropertyCard";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  uploadPropertyImage,
  createPropertyImage,
} from "@/shared/utils/property-utils.js";
import {
  PROPERTY_TYPES,
  PROPERTY_STATUS,
} from "@/app/(dashboard)/constants/propertype";

export default function AgentPropertiesPage() {
  const { supabase } = useSupabase();
  const { user } = useUser();
  const { toast } = useToast();

  const [properties, setProperties] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch properties on component mount
  useEffect(() => {
    fetchProperties();

    // Set up real-time subscription
    const channel = supabase
      .channel("agent-properties")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "properties",
          filter: `agent_id=eq.${user?.id}`,
        },
        (payload) => {
          console.log("Change received!", payload);
          fetchProperties();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  // Fetch properties from Supabase
  const fetchProperties = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("properties")
        .select(
          `
          *,
          property_images(*)
        `
        )
        .eq("agent_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Process the properties to include images array
      const processedProperties = data.map((property) => {
        const images =
          property.property_images?.map((img) => img.image_url) || [];
        return {
          ...property,
          images: images,
          primaryImage: images[0] || null,
        };
      });

      setProperties(processedProperties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      toast({
        title: "Error",
        description: "Failed to load properties",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Filter properties based on search query and filters
  const filteredProperties = properties.filter((property) => {
    const matchesSearch =
      !searchQuery ||
      property.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      property.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType =
      !filterType ||
      filterType === "all" ||
      property.property_type === filterType;
    const matchesStatus =
      !filterStatus ||
      filterStatus === "all" ||
      property.status === filterStatus;

    return matchesSearch && matchesType && matchesStatus;
  });

  // Handle property submission (add/edit)
  const handlePropertySubmit = async (propertyData) => {
    setIsSubmitting(true);
    try {
      const isEditing = !!propertyData.id;

      // Prepare the property data
      const propertyRecord = {
        title: propertyData.title,
        description: propertyData.description,
        price: propertyData.price,
        property_type: propertyData.type,
        status: propertyData.status,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        area: propertyData.area,
        location: propertyData.location,
        agent_id: user.id,
        ...(isEditing ? {} : { created_at: new Date().toISOString() }),
        updated_at: new Date().toISOString(),
      };

      let propertyId;

      if (isEditing) {
        // Update existing property
        const { data, error } = await supabase
          .from("properties")
          .update(propertyRecord)
          .eq("id", propertyData.id)
          .select();

        if (error) throw error;
        propertyId = propertyData.id;
      } else {
        // Insert new property
        const { data, error } = await supabase
          .from("properties")
          .insert(propertyRecord)
          .select();

        if (error) throw error;
        propertyId = data[0].id;
      }

      // Handle image upload if new image is provided
      if (propertyData.newImage) {
        // Upload the image
        const imageUrl = await uploadPropertyImage(
          propertyData.newImage,
          supabase,
          propertyId
        );

        // Create image record in database
        await createPropertyImage(
          supabase,
          propertyId,
          imageUrl,
          true // set as primary image
        );
      }

      toast({
        title: isEditing ? "Property Updated" : "Property Added",
        description: isEditing
          ? "Your property has been successfully updated"
          : "Your new property has been successfully added",
      });

      // Close the modal and refresh properties
      isEditing ? setIsEditModalOpen(false) : setIsAddModalOpen(false);
      fetchProperties();
    } catch (error) {
      console.error("Error saving property:", error);
      toast({
        title: "Error",
        description: "Failed to save property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle property deletion
  const handleDeleteProperty = async (propertyId) => {
    setIsDeleting(true);
    try {
      // Delete property from Supabase
      const { error } = await supabase
        .from("properties")
        .delete()
        .eq("id", propertyId);

      if (error) throw error;

      toast({
        title: "Property Deleted",
        description: "Your property has been successfully deleted",
      });

      // Close the modal and refresh properties
      setIsDeleteModalOpen(false);
      setCurrentProperty(null);
      fetchProperties();
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Open edit modal with property data
  const handleEditProperty = (property) => {
    setCurrentProperty(property);
    setIsEditModalOpen(true);
  };

  // Open delete confirmation modal
  const handleDeleteConfirm = (property) => {
    setCurrentProperty(property);
    setIsDeleteModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <Button onClick={() => setIsAddModalOpen(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Add New Property
        </Button>
      </div>

      {/* Search and Filter Section */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="relative col-span-1 sm:col-span-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <Select value={filterType} onValueChange={setFilterType}>
          <SelectTrigger>
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {Object.entries(PROPERTY_TYPES).map(([key, value]) => (
              <SelectItem key={value} value={value}>
                {key.charAt(0) + key.slice(1).toLowerCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            {Object.values(PROPERTY_STATUS).map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Properties Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="h-80 bg-muted rounded-lg animate-pulse"
              />
            ))}
        </div>
      ) : filteredProperties.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onEdit={() => handleEditProperty(property)}
              onDelete={() => handleDeleteConfirm(property)}
              variant="grid"
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted rounded-full p-4 mb-4">
            <SlidersHorizontal className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No properties found</h3>
          <p className="text-muted-foreground mt-1 mb-4">
            {searchQuery || filterType || filterStatus
              ? "Try adjusting your filters or search query"
              : "Add your first property to get started"}
          </p>
          <Button onClick={() => setIsAddModalOpen(true)}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Property
          </Button>
        </div>
      )}

      {/* Add/Edit Property Modal */}
      <PropertyFormModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handlePropertySubmit}
        isSubmitting={isSubmitting}
      />

      <PropertyFormModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setCurrentProperty(null);
        }}
        property={currentProperty}
        onSubmit={handlePropertySubmit}
        isSubmitting={isSubmitting}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setCurrentProperty(null);
        }}
        onConfirm={() => handleDeleteProperty(currentProperty?.id)}
        isLoading={isDeleting}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action cannot be undone and all associated data will be permanently removed."
      />
    </div>
  );
}
