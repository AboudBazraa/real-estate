import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
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
import { Switch } from "@/shared/components/ui/switch";
import { PROPERTY_TYPES } from "@/app/(dashboard)/constants/propertype";

export function BasicInfoForm({ data, onChange, onTypeChange }) {
  const handleChange = (e) => {
    const { id, value } = e.target;
    onChange(id, value);
  };

  const handleNumberChange = (e) => {
    const { id, value } = e.target;
    onChange(id, value === "" ? 0 : Number(value));
  };

  const handleFeaturedChange = (checked) => {
    onChange("featured", checked);
  };

  const handleListingTypeChange = (value) => {
    onChange("listing_type", value);
  };

  const handleStatusChange = (value) => {
    onChange("status", value);
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
            <Label htmlFor="title">Property Title</Label>
            <Input
              id="title"
              type="text"
              value={data.title}
              placeholder="Enter property title"
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="property_type">Property Type</Label>
            <Select
              value={data.property_type.toString()}
              onValueChange={onTypeChange}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={PROPERTY_TYPES.APARTMENT}>
                  Apartment
                </SelectItem>
                <SelectItem value={PROPERTY_TYPES.HOUSE}>House</SelectItem>
                <SelectItem value={PROPERTY_TYPES.VILLA}>Villa</SelectItem>
                <SelectItem value={PROPERTY_TYPES.LAND}>Land</SelectItem>
                <SelectItem value={PROPERTY_TYPES.COMMERCIAL}>
                  Commercial
                </SelectItem>
                <SelectItem value={PROPERTY_TYPES.OTHER}>Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="price">Price</Label>
            <Input
              id="price"
              type="number"
              value={data.price || ""}
              placeholder="Enter price"
              onChange={handleNumberChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="listing_type">Listing Type</Label>
            <Select
              value={data.listing_type}
              onValueChange={handleListingTypeChange}
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
          <div>
            <Label htmlFor="status">Status</Label>
            <Select value={data.status} onValueChange={handleStatusChange}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="SOLD">Sold</SelectItem>
                <SelectItem value="RENTED">Rented</SelectItem>
                <SelectItem value="INACTIVE">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="year_built">Year Built</Label>
            <Input
              id="year_built"
              type="text"
              value={data.year_built || ""}
              placeholder="Year built"
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={data.description}
            placeholder="Enter property description"
            onChange={handleChange}
            rows={4}
          />
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="featured"
            checked={data.featured}
            onCheckedChange={handleFeaturedChange}
          />
          <Label htmlFor="featured">Featured Property</Label>
        </div>
      </CardContent>
    </Card>
  );
}
