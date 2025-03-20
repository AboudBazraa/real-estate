"use client";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { useApiQuery, useApiMutation } from "@/shared/hooks/useApi";
import { useToast } from "@/shared/hooks/use-toast";
import { PROPERTY_TYPES } from "@/app/(dashboard)/constants/propertype";

// Property type enum mapping

export function PropertyEditForm({ propertyId, isOpen, onClose }) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    price: 0,
    type: 0,
    location: "",
    latitude: 0,
    longitude: 0,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    images: [],
  });

  // Fetch property data
  const { data, isPending, isError } = useApiQuery(["property", propertyId], {
    url: `/Properties/GetById/${propertyId}`,
  });

  // Update mutation
  const updateMutation = useApiMutation(
    ["updateProperty", propertyId],
    { url: `/Properties/Update/${propertyId}` },
    "PUT"
  );

  // Populate form when data is loaded
  useEffect(() => {
    if (data?.data) {
      const property = data.data;
      setFormData({
        id: property.id || propertyId,
        title: property.title || "",
        description: property.description || "",
        price: property.price || 0,
        type: property.type || 0,
        location: property.location || "",
        latitude: property.latitude || 0,
        longitude: property.longitude || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        area: property.area || 0,
        images: property.images || [],
      });
    }
  }, [data, propertyId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value === "" ? 0 : Number(value),
    }));
  };

  const handleTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      type: Number(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // Use the single object format that worked in your retry
      //   console.log("Submitting data:", formData);
      const result = await updateMutation.mutateAsync(formData);
      //   console.log("Update result:", result);

      toast({
        title: "Success",
        description: "Property updated successfully",
        variant: "success",
      });
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update property",
        variant: "error",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogDescription>
            Make changes to your property details below.
          </DialogDescription>
        </DialogHeader>

        {isPending ? (
          <div className="py-4 text-center">Loading property data...</div>
        ) : isError ? (
          <div className="py-4 text-center text-red-500">
            Error loading property data
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleNumberChange}
                  min="0"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Property Type</Label>
                <Select
                  value={formData.type.toString()}
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={PROPERTY_TYPES.HOUSE.toString()}>
                      House
                    </SelectItem>
                    <SelectItem value={PROPERTY_TYPES.APARTMENT.toString()}>
                      Apartment
                    </SelectItem>
                    <SelectItem value={PROPERTY_TYPES.CONDO.toString()}>
                      Condo
                    </SelectItem>
                    <SelectItem value={PROPERTY_TYPES.TOWNHOUSE.toString()}>
                      Townhouse
                    </SelectItem>
                    <SelectItem value={PROPERTY_TYPES.VILLA.toString()}>
                      Villa
                    </SelectItem>
                    <SelectItem value={PROPERTY_TYPES.COMMERCIAL.toString()}>
                      Commercial
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  name="latitude"
                  type="number"
                  value={formData.latitude}
                  onChange={handleNumberChange}
                  step="0.000001"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  name="longitude"
                  type="number"
                  value={formData.longitude}
                  onChange={handleNumberChange}
                  step="0.000001"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bedrooms">Bedrooms</Label>
                <Input
                  id="bedrooms"
                  name="bedrooms"
                  type="number"
                  value={formData.bedrooms}
                  onChange={handleNumberChange}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bathrooms">Bathrooms</Label>
                <Input
                  id="bathrooms"
                  name="bathrooms"
                  type="number"
                  value={formData.bathrooms}
                  onChange={handleNumberChange}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="area">Area (sqft)</Label>
                <Input
                  id="area"
                  name="area"
                  type="number"
                  value={formData.area}
                  onChange={handleNumberChange}
                  min="0"
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
