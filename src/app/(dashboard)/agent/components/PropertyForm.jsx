"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Loader2, Upload, X, Image as ImageIcon } from "lucide-react";
import {
  PROPERTY_TYPES,
  PROPERTY_STATUS,
} from "@/app/(dashboard)/constants/propertype";
import Image from "next/image";

export function PropertyForm({
  property = null,
  onSubmit,
  isSubmitting = false,
}) {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm({
    defaultValues: property || {
      title: "",
      description: "",
      price: "",
      location: "",
      address: "",
      city: "",
      state: "",
      zip_code: "",
      country: "",
      latitude: "",
      longitude: "",
      bedrooms: 1,
      area: 0,
      lot_size: 0,
      year_built: "",
      property_type: "HOUSE",
      listing_type: "SALE",
      status: "For Sale",
      featured: false,
    },
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Initialize form with property data if editing
  useEffect(() => {
    if (property) {
      Object.entries(property).forEach(([key, value]) => {
        if (key === "property_type") {
          setValue("type", value);
        } else {
          setValue(key, value);
        }
      });

      // Set image previews if available
      if (property.images?.length) {
        setImagePreviews(property.images);
      }
    }
  }, [property, setValue]);

  // Handle multiple image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(`Image ${file.name} is too large. Maximum size is 5MB`);
        return false;
      }
      return true;
    });

    setImageFiles((prev) => [...prev, ...validFiles]);
    setValue("newImages", validFiles);

    // Create preview URLs
    validFiles.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  // Remove image
  const removeImage = (index) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
    const currentImages = watch("newImages") || [];
    setValue(
      "newImages",
      currentImages.filter((_, i) => i !== index)
    );
  };

  // Handle form submission
  const onFormSubmit = (data) => {
    // Add the image files to the form data if they exist
    if (imageFiles.length > 0) {
      data.newImages = imageFiles;
    }

    onSubmit(data);
  };

  return (
    <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle>Property Details</CardTitle>
          <CardDescription>
            Enter the basic information about the property
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">
              Title<span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              placeholder="Enter property title"
              {...register("title", { required: "Title is required" })}
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && (
              <p className="text-red-500 text-sm">{errors.title.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">
              Description<span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="description"
              placeholder="Describe the property"
              rows={4}
              {...register("description", {
                required: "Description is required",
              })}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price">
                Price<span className="text-red-500">*</span>
              </Label>
              <Input
                id="price"
                type="number"
                placeholder="Enter price"
                {...register("price", {
                  required: "Price is required",
                  min: { value: 0, message: "Price must be positive" },
                })}
                className={errors.price ? "border-red-500" : ""}
              />
              {errors.price && (
                <p className="text-red-500 text-sm">{errors.price.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">
                Location<span className="text-red-500">*</span>
              </Label>
              <Input
                id="location"
                placeholder="Property location"
                {...register("location", { required: "Location is required" })}
                className={errors.location ? "border-red-500" : ""}
              />
              {errors.location && (
                <p className="text-red-500 text-sm">
                  {errors.location.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              placeholder="Street address"
              {...register("address")}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" placeholder="City" {...register("city")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                placeholder="State/Province"
                {...register("state")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="zip_code">ZIP Code</Label>
              <Input
                id="zip_code"
                placeholder="ZIP/Postal Code"
                {...register("zip_code")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input
                id="country"
                placeholder="Country"
                {...register("country")}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="0.000001"
                placeholder="Latitude coordinates"
                {...register("latitude")}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="0.000001"
                placeholder="Longitude coordinates"
                {...register("longitude")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="property_type">
                Property Type<span className="text-red-500">*</span>
              </Label>
              <Select
                defaultValue={property?.property_type || "HOUSE"}
                onValueChange={(value) => setValue("property_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(PROPERTY_TYPES).map((key) => (
                    <SelectItem key={key} value={key}>
                      {key.charAt(0) + key.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">
                Status<span className="text-red-500">*</span>
              </Label>
              <Select
                defaultValue={property?.status || "For Sale"}
                onValueChange={(value) => setValue("status", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  {Object.values(PROPERTY_STATUS).map((status) => (
                    <SelectItem key={status} value={status}>
                      {status}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                min="0"
                {...register("bedrooms", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Cannot be negative" },
                })}
                className={errors.bedrooms ? "border-red-500" : ""}
              />
              {errors.bedrooms && (
                <p className="text-red-500 text-sm">
                  {errors.bedrooms.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area (sq ft)</Label>
              <Input
                id="area"
                type="number"
                min="0"
                {...register("area", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Cannot be negative" },
                })}
                className={errors.area ? "border-red-500" : ""}
              />
              {errors.area && (
                <p className="text-red-500 text-sm">{errors.area.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lot_size">Lot Size (sq ft)</Label>
              <Input
                id="lot_size"
                type="number"
                min="0"
                {...register("lot_size", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Cannot be negative" },
                })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="year_built">Year Built</Label>
              <Input
                id="year_built"
                type="number"
                placeholder="Year built"
                {...register("year_built")}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="listing_type">Listing Type</Label>
              <Select
                defaultValue={property?.listing_type || "SALE"}
                onValueChange={(value) => setValue("listing_type", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select listing type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SALE">For Sale</SelectItem>
                  <SelectItem value="RENT">For Rent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <input
              type="checkbox"
              id="featured"
              {...register("featured")}
              className="h-4 w-4"
            />
            <Label htmlFor="featured">Mark as Featured Property</Label>
          </div>

          <div className="space-y-4">
            <Label>Property Images</Label>
            <div className="flex flex-wrap gap-4">
              {imagePreviews.map((preview, index) => (
                <div
                  key={index}
                  className="relative w-32 h-32 border rounded-lg overflow-hidden group"
                >
                  <Image
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <label className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                <div className="text-center">
                  <Upload className="h-6 w-6 mx-auto mb-2" />
                  <span className="text-sm">Add Images</span>
                </div>
              </label>
            </div>
            <p className="text-sm text-muted-foreground">
              Upload up to 10 images (max 5MB each)
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            "Save Property"
          )}
        </Button>
      </div>
    </form>
  );
}
