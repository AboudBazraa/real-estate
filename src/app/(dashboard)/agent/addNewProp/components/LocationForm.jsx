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
import { MapPin } from "lucide-react";

export function LocationForm({ data, onChange }) {
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
        <CardTitle>Location Details</CardTitle>
        <CardDescription>
          Enter the location information for this property.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="address">Street Address</Label>
          <Input
            id="address"
            type="text"
            value={data.address}
            placeholder="Street address"
            onChange={handleChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              type="text"
              value={data.city}
              placeholder="City"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="state">State/Province</Label>
            <Input
              id="state"
              type="text"
              value={data.state}
              placeholder="State/Province"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="zip_code">Zip/Postal Code</Label>
            <Input
              id="zip_code"
              type="text"
              value={data.zip_code}
              placeholder="Zip/Postal code"
              onChange={handleChange}
            />
          </div>
          <div>
            <Label htmlFor="country">Country</Label>
            <Input
              id="country"
              type="text"
              value={data.country}
              placeholder="Country"
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="latitude">Latitude</Label>
            <Input
              id="latitude"
              type="number"
              step="0.000001"
              value={data.latitude || ""}
              placeholder="Latitude"
              onChange={handleNumberChange}
            />
          </div>
          <div>
            <Label htmlFor="longitude">Longitude</Label>
            <Input
              id="longitude"
              type="number"
              step="0.000001"
              value={data.longitude || ""}
              placeholder="Longitude"
              onChange={handleNumberChange}
            />
          </div>
        </div>

        <div className="h-[200px] bg-gray-100 rounded-md flex flex-col items-center justify-center gap-2">
          <MapPin className="h-8 w-8 text-muted-foreground" />
          <p className="text-sm text-muted-foreground">
            Map preview would be displayed here
          </p>
          <p className="text-xs text-muted-foreground">
            Enter latitude and longitude values for more precise location
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
