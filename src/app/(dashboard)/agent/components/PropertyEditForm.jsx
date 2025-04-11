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
import {
  useSupabaseItem,
  useSupabaseUpdate,
  useSupabaseQuery,
} from "@/shared/hooks/useSupabase";
import { useToast } from "@/shared/hooks/use-toast";
import { PROPERTY_TYPES } from "@/app/(dashboard)/constants/propertype";
import { Loader2, Upload, X, Image as ImageIcon, Check } from "lucide-react";
import Image from "next/image";
import { Switch } from "@/shared/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import { Checkbox } from "@/shared/components/ui/checkbox";
import { createClient } from "@/shared/utils/supabase/client";

// Property type enum mapping

export function PropertyEditForm({ propertyId, isOpen, onClose }) {
  const { toast } = useToast();
  const client = createClient();

  const [formData, setFormData] = useState({
    id: "",
    title: "",
    description: "",
    price: 0,
    property_type: "",
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    latitude: 0,
    longitude: 0,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    lot_size: 0,
    year_built: "",
    status: "For Sale",
    listing_type: "Sale",
    featured: false,
    user_id: "",
  });

  const [isUploading, setIsUploading] = useState(false);
  const [newImages, setNewImages] = useState([]);
  const [localImagesToDelete, setLocalImagesToDelete] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);

  // Fetch property data using Supabase hook
  const {
    data: property,
    isLoading: propertyLoading,
    isError: propertyError,
  } = useSupabaseItem("properties", propertyId, {
    enabled: isOpen && !!propertyId,
  });

  // Fetch property images
  const {
    data: propertyImages,
    isLoading: imagesLoading,
    isError: imagesError,
    refetch: refetchImages,
  } = useSupabaseQuery(
    ["property_images", propertyId],
    "property_images",
    {
      eq: [{ column: "property_id", value: propertyId }],
      order: { column: "display_order", ascending: true },
    },
    {
      enabled: isOpen && !!propertyId,
    }
  );

  const isLoading = propertyLoading || imagesLoading;
  const isError = propertyError || imagesError;

  // Update mutation with Supabase hook
  const updateProperty = useSupabaseUpdate("properties", {
    invalidateQueries: [["properties"], ["properties", propertyId]],
  });

  // Update image mutation
  const updateImage = useSupabaseUpdate("property_images", {
    invalidateQueries: [["property_images", propertyId]],
  });

  // Populate form when data is loaded
  useEffect(() => {
    if (property) {
      setFormData({
        id: property.id || propertyId,
        title: property.title || "",
        description: property.description || "",
        price: property.price || 0,
        property_type: property.property_type || "",
        address: property.address || "",
        city: property.city || "",
        state: property.state || "",
        zip_code: property.zip_code || "",
        country: property.country || "",
        latitude: property.latitude || 0,
        longitude: property.longitude || 0,
        bedrooms: property.bedrooms || 0,
        bathrooms: property.bathrooms || 0,
        area: property.area || 0,
        lot_size: property.lot_size || 0,
        year_built: property.year_built || "",
        status: property.status || "For Sale",
        listing_type: property.listing_type || "Sale",
        featured: property.featured || false,
        user_id: property.user_id,
      });
    }
  }, [property, propertyId]);

  // useEffect(() => {
  //   // Just check if we can access the storage bucket
  //   const checkStorage = async () => {
  //     try {
  //       // Check if we can access the bucket
  //       const { data, error } = await client.storage
  //         .from("properties")
  //         .getBucket();

  //       if (error) {
  //         console.warn(
  //           "Note: Storage bucket 'properties' might not be accessible. Make sure it exists in your Supabase project."
  //         );
  //       }
  //     } catch (err) {
  //       console.error("Storage access error:", err);
  //     }
  //   };

  //   checkStorage();
  // }, [client.storage]);

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
      property_type: value,
    }));
  };

  const handleStatusChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      status: value,
    }));
  };

  const handleListingTypeChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      listing_type: value,
    }));
  };

  const handleFeaturedChange = (checked) => {
    setFormData((prev) => ({
      ...prev,
      featured: checked,
    }));
  };

  // Handle file input change
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newFilesWithPreview = files.map((file) => ({
        file,
        preview: URL.createObjectURL(file),
        isUploaded: false,
        isPrimary: false,
      }));
      setNewImages((prev) => [...prev, ...newFilesWithPreview]);
    }
  };

  // Handle marking image as primary
  const handleSetPrimary = async (imageId) => {
    // For existing images
    if (typeof imageId === "string" || typeof imageId === "number") {
      try {
        // First set all images as not primary
        for (const img of propertyImages) {
          if (img.is_primary) {
            await updateImage.mutateAsync({
              match: { id: img.id },
              data: { is_primary: false },
            });
          }
        }

        // Then set the selected image as primary
        await updateImage.mutateAsync({
          match: { id: imageId },
          data: { is_primary: true },
        });

        refetchImages();

        toast({
          title: "Success",
          description: "Primary image updated",
        });
      } catch (error) {
        console.error("Error updating primary image:", error);
        toast({
          title: "Error",
          description: "Failed to update primary image",
          variant: "destructive",
        });
      }
    } else {
      // For new images that haven't been uploaded yet
      setNewImages(
        newImages.map((img) => ({
          ...img,
          isPrimary: img === imageId,
        }))
      );
    }
  };

  // Handle removing an image
  const handleRemoveImage = (image) => {
    // For new images
    if (typeof image === "object" && image.file) {
      setNewImages(newImages.filter((img) => img !== image));
      if (image.preview) {
        URL.revokeObjectURL(image.preview);
      }
    } else {
      // For existing images - mark for deletion
      setLocalImagesToDelete((prev) => [...prev, image.id]);
    }
  };

  // Upload images to Supabase Storage
  const uploadImageToStorage = async (file) => {
    try {
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = `${propertyId}/${fileName}`;

      const { data, error } = await client.storage
        .from("properties")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (error) {
        console.error("Storage upload error:", JSON.stringify(error));
        throw new Error(error.message || "Upload failed");
      }

      // Get public URL
      const { data: publicUrlData } = client.storage
        .from("properties")
        .getPublicUrl(filePath);

      return publicUrlData.publicUrl;
    } catch (err) {
      console.error("Upload error details:", err);
      throw err;
    }
  };

  // Process image uploads and updates
  const processImages = async () => {
    // Delete images marked for deletion
    if (localImagesToDelete.length > 0) {
      for (const imageId of localImagesToDelete) {
        // First get the image URL to delete from storage
        const imageToDelete = propertyImages.find((img) => img.id === imageId);
        if (imageToDelete) {
          // Extract the path from the URL
          const urlParts = imageToDelete.image_url.split("/");
          const filePath = urlParts.slice(-2).join("/"); // Get the last two parts as path

          // Delete from storage
          await client.storage.from("properties").remove([filePath]);

          // Delete from database
          await client.from("property_images").delete().eq("id", imageId);
        }
      }
    }

    // Upload new images
    if (newImages.length > 0) {
      setIsUploading(true);
      let currentProgress = 0;
      const progressIncrement = 100 / newImages.length;

      for (const [index, image] of newImages.entries()) {
        try {
          // Upload to storage
          const imageUrl = await uploadImageToStorage(image.file);

          // Insert into property_images table
          const { error: insertError } = await client
            .from("property_images")
            .insert({
              property_id: propertyId,
              image_url: imageUrl,
              is_primary:
                image.isPrimary || (index === 0 && propertyImages.length === 0),
              display_order: propertyImages.length + index,
              created_at: new Date().toISOString(),
            });

          if (insertError) {
            console.error(
              "Error inserting image record:",
              JSON.stringify(insertError)
            );
            toast({
              title: "Error",
              description: `Failed to save image record: ${insertError.message}`,
              variant: "destructive",
            });
          }

          currentProgress += progressIncrement;
          setUploadProgress(Math.round(currentProgress));
        } catch (error) {
          console.error("Error uploading image:", error);
          toast({
            title: "Error",
            description: `Failed to upload image: ${image.file.name}`,
            variant: "destructive",
          });
        }
      }

      setIsUploading(false);
      setUploadProgress(0);
      setNewImages([]);
    }

    // Refetch images to get the updated list
    await refetchImages();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // First update the property details
      await updateProperty.mutateAsync({
        match: { id: propertyId },
        data: {
          ...formData,
          updated_at: new Date().toISOString(),
          user_id: formData.user_id,
        },
      });

      // Then process images (upload new ones, delete marked ones)
      await processImages();

      toast({
        title: "Success",
        description: "Property updated successfully",
      });
      onClose();
    } catch (error) {
      console.error("Update error:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update property",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property</DialogTitle>
          <DialogDescription>
            Make changes to your property details below.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="py-6 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
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
                <Label htmlFor="property_type">Property Type</Label>
                <Select
                  value={
                    formData.property_type !== undefined &&
                    formData.property_type !== null
                      ? formData.property_type.toString()
                      : "0"
                  }
                  onValueChange={handleTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="HOUSE">House</SelectItem>
                    <SelectItem value="APARTMENT">Apartment</SelectItem>
                    <SelectItem value="CONDO">Condo</SelectItem>
                    <SelectItem value="TOWNHOUSE">Townhouse</SelectItem>
                    <SelectItem value="VILLA">Villa</SelectItem>
                    <SelectItem value="COMMERCIAL">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Listing Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={handleStatusChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="For Sale">For Sale</SelectItem>
                    <SelectItem value="For Rent">For Rent</SelectItem>
                    <SelectItem value="Sold">Sold</SelectItem>
                    <SelectItem value="Rented">Rented</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="listing_type">Listing Type</Label>
                <Select
                  value={formData.listing_type}
                  onValueChange={handleListingTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select listing type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sale">Sale</SelectItem>
                    <SelectItem value="Rent">Rent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={formData.featured}
                onCheckedChange={handleFeaturedChange}
              />
              <Label htmlFor="featured">Featured Property</Label>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zip_code">Zip Code</Label>
                <Input
                  id="zip_code"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                />
              </div>
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

            <div className="grid grid-cols-4 gap-4">
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

              <div className="space-y-2">
                <Label htmlFor="lot_size">Lot Size (sqft)</Label>
                <Input
                  id="lot_size"
                  name="lot_size"
                  type="number"
                  value={formData.lot_size}
                  onChange={handleNumberChange}
                  min="0"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="year_built">Year Built</Label>
              <Input
                id="year_built"
                name="year_built"
                value={formData.year_built}
                onChange={handleChange}
              />
            </div>

            {/* Property Images Section */}
            <div className="space-y-4 border rounded-md p-4">
              <div className="flex items-center justify-between">
                <Label>Property Images</Label>
                <div>
                  <Input
                    id="images"
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <Label htmlFor="images" className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-2"
                      asChild
                    >
                      <span>
                        <Upload className="h-4 w-4" />
                        Upload Images
                      </span>
                    </Button>
                  </Label>
                </div>
              </div>

              {/* Existing Images */}
              {propertyImages &&
                propertyImages.length > 0 &&
                !localImagesToDelete.includes(propertyImages[0]?.id) && (
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Existing Images:
                    </p>
                    <div className="grid grid-cols-3 gap-3">
                      {propertyImages
                        .filter((img) => !localImagesToDelete.includes(img.id))
                        .map((image) => (
                          <div
                            key={image.id}
                            className={`relative rounded-md overflow-hidden border-2 aspect-[3/2] ${
                              image.is_primary
                                ? "border-primary"
                                : "border-transparent"
                            }`}
                          >
                            <Image
                              src={image.image_url}
                              alt="Property"
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-2 right-2 flex space-x-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-7 w-7 bg-white/80 hover:bg-white text-red-500 rounded-full"
                                onClick={() => handleRemoveImage(image)}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              {!image.is_primary && (
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 bg-white/80 hover:bg-white text-primary rounded-full"
                                  onClick={() => handleSetPrimary(image.id)}
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            {image.is_primary && (
                              <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs py-1 text-center">
                                Primary Image
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>
                )}

              {/* New Images To Upload */}
              {newImages.length > 0 && (
                <div>
                  <p className="text-sm text-muted-foreground mb-2">
                    New Images:
                  </p>
                  <div className="grid grid-cols-3 gap-3">
                    {newImages.map((image, index) => (
                      <div
                        key={index}
                        className={`relative rounded-md overflow-hidden border-2 aspect-[3/2] ${
                          image.isPrimary
                            ? "border-primary"
                            : "border-transparent"
                        }`}
                      >
                        <Image
                          src={image.preview}
                          alt={`Upload preview ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2 flex space-x-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7 bg-white/80 hover:bg-white text-red-500 rounded-full"
                            onClick={() => handleRemoveImage(image)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {!image.isPrimary && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7 bg-white/80 hover:bg-white text-primary rounded-full"
                              onClick={() => handleSetPrimary(image)}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                        {image.isPrimary && (
                          <div className="absolute bottom-0 left-0 right-0 bg-primary text-white text-xs py-1 text-center">
                            Primary Image
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {isUploading && (
                <div className="mt-2">
                  <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-center mt-1">
                    Uploading: {uploadProgress}%
                  </p>
                </div>
              )}

              {propertyImages?.length === 0 && newImages.length === 0 && (
                <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-md">
                  <ImageIcon className="h-10 w-10 text-gray-400 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    No images. Click "Upload Images" to add some.
                  </p>
                </div>
              )}
            </div>

            <DialogFooter className="mt-6">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={updateProperty.isPending || isUploading}
              >
                {updateProperty.isPending || isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
