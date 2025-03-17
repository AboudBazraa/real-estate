"use client";

import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { ArrowLeft, Upload } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useApiMutation } from "@/shared/hooks/useApi";
import { useEffect } from "react";
import { useToast } from "@/shared/hooks/use-toast";

export default function AddPropertyPage() {
  const { toast } = useToast();
  const [images, setImages] = useState<string[]>([
    "/placeholder.svg?height=200&width=300",
  ]);
  const [propertyData, setPropertyData] = useState<{
    title: string;
    type: string;
    bedrooms: number;
    bathrooms: number;
    location: string;
    latitude: number;
    longitude: number;
    price: string;
    area: string;
    description: string;
  }>({
    title: "",
    type: "",
    bedrooms: 0,
    bathrooms: 0,
    location: "",
    latitude: 1,
    longitude: 1,
    price: "",
    area: "",
    description: "",
  });
  const [errors, setErrors] = useState({});

  const mutation = useApiMutation(
    ["addProperty"],
    { url: "/Properties/Create" },
    "POST"
  );

  const handleAddImage = (newImages) => {
    setImages((prevImages) => [...prevImages, ...newImages]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting property data:", propertyData);

    // Prepare the data to send to the backend
    const dataToSend = {
      title: propertyData.title || "unknown", // Use the correct title
      description: propertyData.description || "z",
      price: parseFloat(propertyData.price) || 0, // Ensure price is a number
      type: propertyData.type || 0, // Ensure this matches the expected type
      location: propertyData.location || "unknown", // Use the correct location
      latitude: propertyData.latitude || 1, // Use the correct latitude
      longitude: propertyData.longitude || -1, // Use the correct longitude
      bedrooms: propertyData.bedrooms || 0, // Ensure bedrooms is a number
      bathrooms: propertyData.bathrooms || 0, // Ensure bathrooms is a number
      area: propertyData.area || 0, // Ensure area is a number
      // images: images.filter(
      //   (image) => image !== "/placeholder.svg?height=200&width=300"
      // ), // Filter out placeholder images
    };

    try {
      await mutation.mutateAsync(dataToSend);
      toast({
        title: "Success",
        description: "Property added successfully.",
        type: "foreground",
      });
      setPropertyData({
        title: "",
        type: "",
        bedrooms: 0,
        bathrooms: 0,
        location: "",
        latitude: 1,
        longitude: 1,
        price: "",
        area: "",
        description: "",
      });
      setImages([]);
    } catch (error) {
      console.error("Error adding property:", error.message);
      if (error.response) {
        console.error("Error response data:", error.response.data);
        console.error("Error response status:", error.response.status);
      } else {
        console.error("Error without response:", error);
      }
      toast({
        title: "Error",
        description: "Failed to add property.",
        type: "foreground",
      });
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Add New Property
          </h1>
        </div>
        <Tabs defaultValue="details" className="w-full">
          <TabsList>
            <TabsTrigger value="details">Property Details</TabsTrigger>
            <TabsTrigger value="features">Features &amp; Amenities</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>
          <TabsContent value="details" className="pt-4">
            <PropertyDetailsForm
              setPropertyData={setPropertyData}
              errors={errors}
            />
          </TabsContent>
          <TabsContent value="features" className="pt-4">
            <FeaturesAmenitiesForm />
          </TabsContent>
          <TabsContent value="media" className="pt-4">
            <MediaDocumentsForm
              images={images}
              handleAddImage={handleAddImage}
            />
          </TabsContent>
        </Tabs>
        <CardFooter className="flex justify-end">
          <Button type="submit">Save Property</Button>
        </CardFooter>
      </form>
    </div>
  );
}

const PropertyDetailsForm = ({ setPropertyData, errors }) => {
  const handleChange = (e) => {
    setPropertyData((prev) => ({ ...prev, [e.target.id]: e.target.value }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Basic Information</CardTitle>
        <CardDescription>
          Enter the basic details about the property.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="propertyName">Property Name</Label>
            <Input
              id="title"
              type="text"
              placeholder="Enter property name"
              onChange={handleChange}
            />
            {errors.title && <p className="text-red-500">{errors.title}</p>}
          </div>
          <div>
            <Label htmlFor="propertyType">Property Type</Label>
            <Input
              id="type"
              type="number"
              placeholder="type"
              onChange={handleChange}
            />
            {/* <Select
              value={propertyData.type.toString()}
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
            </Select> */}
          </div>
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              placeholder="e.g., 2"
              onChange={handleChange}
            />
            {errors.bedrooms && (
              <p className="text-red-500">{errors.bedrooms}</p>
            )}
          </div>
          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              placeholder="e.g., 2"
              onChange={handleChange}
            />
            {errors.bathrooms && (
              <p className="text-red-500">{errors.bathrooms}</p>
            )}
          </div>
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              type="text"
              placeholder="Enter property location"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="text"
              placeholder="Enter property price"
              onChange={handleChange}
            />
            {errors.price && <p className="text-red-500">{errors.price}</p>}
          </div>
          <div>
            <Label htmlFor="area">Area (sqft)</Label>
            <Input
              id="area"
              type="text"
              placeholder="Enter property area"
              onChange={handleChange}
            />
          </div>
        </div>
        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Enter property description"
            onChange={handleChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const FeaturesAmenitiesForm = () => (
  <Card>
    <CardHeader>
      <CardTitle>Features &amp; Amenities</CardTitle>
      <CardDescription>
        Highlight the key features of this property.
      </CardDescription>
    </CardHeader>
    <CardContent>
      {/*  Actual form content would go here */}
      <div className="h-[300px] rounded-md border border-dashed flex items-center justify-center">
        <p className="text-muted-foreground">
          Features &amp; Amenities form would go here
        </p>
      </div>
    </CardContent>
  </Card>
);

const MediaDocumentsForm = ({ images, handleAddImage }) => {
  const handleImageDelete = (index) => {
    const updatedImages = images.filter((_, i) => i !== index);
    handleAddImage(updatedImages); // Update the state with the remaining images
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Images</CardTitle>
        <CardDescription>
          Upload images of the property (max 10).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <div
              key={index}
              className="relative aspect-video rounded-md border overflow-hidden"
            >
              <Image
                src={image}
                alt={`Property image ${index + 1}`}
                className="h-full w-full object-cover"
                layout="fill"
              />
              <button
                onClick={() => handleImageDelete(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1"
                title="Delete Image"
              >
                &times; {/* Close icon for delete */}
              </button>
            </div>
          ))}
          {images.length < 10 && (
            <div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="imageUpload"
              />
              <label
                htmlFor="imageUpload"
                className="flex aspect-video items-center justify-center rounded-md border border-dashed text-muted-foreground hover:bg-muted/50 cursor-pointer"
              >
                <Upload className="mr-2 h-4 w-4" />
                Add Image
              </label>
            </div>
          )}
        </div>
      </CardContent>
      {/* <CardFooter className="flex justify-end">
        <Button type="submit">Save Property</Button>
      </CardFooter> */}
    </Card>
  );
};
