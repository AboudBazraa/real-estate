"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Bed, Bath, Square, MapPin, Tag, Calendar } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/shared/components/ui/badge";
import { useApiQuery } from "@/shared/hooks/useApi";
import { PROPERTY_TYPES } from "@/app/(dashboard)/constants/propertype";

// Create a mapping from numeric values to display names
const PROPERTY_TYPE_NAMES = {
  [PROPERTY_TYPES.HOUSE]: "House",
  [PROPERTY_TYPES.APARTMENT]: "Apartment",
  [PROPERTY_TYPES.CONDO]: "Condo",
  [PROPERTY_TYPES.TOWNHOUSE]: "Townhouse",
  [PROPERTY_TYPES.VILLA]: "Villa",
  [PROPERTY_TYPES.COMMERCIAL]: "Commercial",
};

export function PropertyDetailsModal({ propertyId, isOpen, onClose }) {
  const { data, isPending, isError } = useApiQuery(["property", propertyId], {
    url: `/Properties/GetById/${propertyId}`,
  });

  const property = data?.data;
  const propertyTypeName = property
    ? PROPERTY_TYPE_NAMES[property.type] || "Property"
    : "";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Property Details</DialogTitle>
          <DialogDescription>
            View detailed information about this property
          </DialogDescription>
        </DialogHeader>

        {isPending && (
          <div className="py-10 text-center">Loading property details...</div>
        )}

        {isError && (
          <div className="py-10 text-center text-red-500">
            Failed to load property details. Please try again.
          </div>
        )}

        {property && (
          <>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold">{property.title}</h2>

              <div className="relative h-[300px] w-full rounded-md overflow-hidden">
                {property.images && property.images.length > 0 ? (
                  <Image
                    src={property.images[0]}
                    alt={property.title}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    No image available
                  </div>
                )}
                <div className="absolute top-4 left-4">
                  <Badge variant="secondary">{propertyTypeName}</Badge>
                  {property.status && (
                    <Badge
                      variant={
                        property.status.toLowerCase().includes("sale")
                          ? "outline"
                          : "default"
                      }
                      className="ml-2"
                    >
                      {property.status}
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-2 text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{property.location}</span>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h3 className="font-semibold">Details</h3>
                  <div className="grid grid-cols-2 gap-y-2">
                    <div className="flex items-center gap-2">
                      <Bed className="h-4 w-4" />
                      <span>{property.bedrooms} Bedrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bath className="h-4 w-4" />
                      <span>{property.bathrooms} Bathrooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Square className="h-4 w-4" />
                      <span>{property.area} sqft</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span>${property.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h3 className="font-semibold">Property Info</h3>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      <span>
                        Type: {propertyTypeName} (Type ID: {property.type})
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4" />
                      <span>Property ID: {property.id}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-2">Description</h3>
                <p className="text-sm text-muted-foreground">
                  {property.description}
                </p>
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
              <Button
                onClick={() => {
                  onClose();
                  // You can add logic here to open the edit modal
                }}
              >
                Edit Property
              </Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
