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

export default function AddPropertyPage() {
  const [images, setImages] = useState<string[]>([
    "/placeholder.svg?height=200&width=300",
  ]);

  const handleAddImage = () => {
    setImages([...images, "/placeholder.svg?height=200&width=300"]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Add New Property</h1>
      </div>

      <Tabs defaultValue="details" className="w-full">
        <TabsList>
          <TabsTrigger value="details">Property Details</TabsTrigger>
          <TabsTrigger value="features">Features &amp; Amenities</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
        </TabsList>
        <TabsContent value="details" className="pt-4">
          <PropertyDetailsForm />
        </TabsContent>
        <TabsContent value="features" className="pt-4">
          <FeaturesAmenitiesForm />
        </TabsContent>
        <TabsContent value="media" className="pt-4">
          <MediaDocumentsForm images={images} handleAddImage={handleAddImage} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

const PropertyDetailsForm = () => (
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
            id="propertyName"
            type="text"
            placeholder="Enter property name"
          />
        </div>
        <div>
          <Label htmlFor="propertyType">Property Type</Label>
          <Select>
            <SelectTrigger>
              <SelectValue placeholder="Select property type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apartment">Apartment</SelectItem>
              <SelectItem value="house">House</SelectItem>
              <SelectItem value="townhouse">Townhouse</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="bedrooms">Bedrooms</Label>
          <Input id="bedrooms" type="number" placeholder="e.g., 2" />
        </div>
        <div>
          <Label htmlFor="bathrooms">Bathrooms</Label>
          <Input id="bathrooms" type="number" placeholder="e.g., 2" />
        </div>
        <div>
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            type="text"
            placeholder="Enter property location"
          />
        </div>
        <div>
          <Label htmlFor="price">Price</Label>
          <Input id="price" type="text" placeholder="Enter property price" />
        </div>
        <div>
          <Label htmlFor="area">Area (sqft)</Label>
          <Input id="area" type="text" placeholder="Enter property area" />
        </div>
      </div>
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea id="description" placeholder="Enter property description" />
      </div>
    </CardContent>
  </Card>
);

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

const MediaDocumentsForm = ({ images, handleAddImage }) => (
  <Card>
    <CardHeader>
      <CardTitle>Property Images</CardTitle>
      <CardDescription>Upload images of the property (max 10).</CardDescription>
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
            />
          </div>
        ))}
        {images.length < 10 && (
          <button
            onClick={handleAddImage}
            className="flex aspect-video items-center justify-center rounded-md border border-dashed text-muted-foreground hover:bg-muted/50"
          >
            <Upload className="mr-2 h-4 w-4" />
            Add Image
          </button>
        )}
      </div>
    </CardContent>
    <CardFooter className="flex justify-end">
      <Button type="submit">Save Property</Button>
    </CardFooter>
  </Card>
);
