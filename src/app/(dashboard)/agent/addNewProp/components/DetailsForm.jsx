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

export function DetailsForm({ data, onChange }) {
  const handleChange = (e) => {
    const { id, value } = e.target;
    onChange(id, value);
  };

  const handleNumberChange = (e) => {
    const { id, value } = e.target;
    onChange(id, value === "" ? 0 : Number(value));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Property Details</CardTitle>
        <CardDescription>
          Enter the specific details about the property features.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div>
            <Label htmlFor="bedrooms">Bedrooms</Label>
            <Input
              id="bedrooms"
              type="number"
              value={data.bedrooms || ""}
              placeholder="0"
              onChange={handleNumberChange}
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="bathrooms">Bathrooms</Label>
            <Input
              id="bathrooms"
              type="number"
              value={data.bathrooms || ""}
              placeholder="0"
              onChange={handleNumberChange}
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="area">Area (sqft)</Label>
            <Input
              id="area"
              type="number"
              value={data.area || ""}
              placeholder="0"
              onChange={handleNumberChange}
              min="0"
            />
          </div>
          <div>
            <Label htmlFor="lot_size">Lot Size (sqft)</Label>
            <Input
              id="lot_size"
              type="number"
              value={data.lot_size || ""}
              placeholder="0"
              onChange={handleNumberChange}
              min="0"
            />
          </div>
        </div>

        {/* Additional property features could be added here */}
        <div className="p-4 bg-gray-50 rounded-md">
          <p className="text-sm text-muted-foreground">
            You can add more property features like parking spaces, garage size,
            appliances, and other amenities in the property description.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
