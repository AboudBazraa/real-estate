import { useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent, CardHeader } from "@/shared/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Bed,
  Bath,
  Square,
  Heart,
  MoreVertical,
  Edit,
  Eye,
  Trash2,
  MapPin,
} from "lucide-react";
import Image from "next/image";
import { PropertyDetailsModal } from "./PropertyDetailsModal";
import { PropertyEditForm } from "./PropertyEditForm";
import { PROPERTY_TYPES } from "@/app/(dashboard)/constants/propertype";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { useApiMutation } from "@/shared/hooks/useApi";
import { useToast } from "@/shared/hooks/use-toast";

const PROPERTY_TYPE_NAMES = {
  [PROPERTY_TYPES.HOUSE]: "House",
  [PROPERTY_TYPES.APARTMENT]: "Apartment",
  [PROPERTY_TYPES.CONDO]: "Condo",
  [PROPERTY_TYPES.TOWNHOUSE]: "Townhouse",
  [PROPERTY_TYPES.VILLA]: "Villa",
  [PROPERTY_TYPES.COMMERCIAL]: "Commercial",
};

export const PropertyCard = ({ property, onDelete }) => {
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const { toast } = useToast();

  const propertyTypeName = PROPERTY_TYPE_NAMES[property.type] || "Property";

  // Format price with commas
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
  }).format(property.price);

  // Add delete mutation
  const deleteMutation = useApiMutation(
    ["deleteProperty", property.id],
    { url: `/Properties/Delete/${property.id}` },
    "DELETE"
  );

  // Add delete handler
  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync();

      toast({
        title: "Success",
        description: "Property has been deleted successfully.",
      });

      // Notify parent component to update the list
      onDelete?.(property.id);
    } catch (error) {
      console.error("Delete error:", error);
      toast({
        title: "Error",
        description: "Failed to delete property. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
      <Card className="group h-[400px] w-full flex flex-col overflow-hidden rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 bg-white p-0">
        <div
          onClick={() => setIsViewModalOpen(true)}
          className="cursor-pointer flex-shrink-0  "
        >
          <CardHeader className="relative p-2">
            {/* Image Container - Fixed height */}
            <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl">
              {property.images?.[0] ? (
                <Image
                  src={property.images[0]}
                  alt={property.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110 "
                  priority
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                  <div className="text-gray-400 text-center p-4">
                    <div className="text-4xl mb-2">🏠</div>
                    <div className="text-sm">No image available</div>
                  </div>
                </div>
              )}

              {/* Top badges and buttons */}
              <div className="absolute top-3 left-3 flex flex-wrap gap-2 max-w-[70%]">
                <Badge
                  variant="secondary"
                  className="bg-white/90 text-black backdrop-blur-sm text-xs sm:text-sm"
                >
                  {propertyTypeName}
                </Badge>
                {property.status && (
                  <Badge
                    variant={
                      property.status.toLowerCase().includes("sale")
                        ? "outline"
                        : "default"
                    }
                    className="backdrop-blur-sm bg-primary/90 text-white text-xs sm:text-sm"
                  >
                    {property.status ?? "For Sale"}
                  </Badge>
                )}
              </div>

              {/* Action buttons */}
              <div className="absolute top-3 right-3 flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className={`rounded-xl h-8 w-8 sm:h-9 sm:w-9 ${
                    isFavorite
                      ? "bg-red-500/90 hover:bg-red-600/90"
                      : "bg-black/20 hover:bg-black/30"
                  } backdrop-blur-sm transition-colors`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsFavorite(!isFavorite);
                  }}
                >
                  <Heart
                    className={`h-4 w-4 sm:h-5 sm:w-5 ${
                      isFavorite ? "text-white fill-current" : "text-white"
                    }`}
                  />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button
                      size="icon"
                      variant="ghost"
                      className="rounded-xl h-8 w-8 sm:h-9 sm:w-9 bg-black/20 hover:bg-black/30 backdrop-blur-sm transition-colors"
                    >
                      <MoreVertical className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsViewModalOpen(true);
                      }}
                      className="hover:bg-gray-100"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsEditModalOpen(true);
                      }}
                      className="hover:bg-gray-100"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit Property
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 focus:text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsDeleteModalOpen(true);
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Property
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>

              {/* Price tag */}
            </div>
          </CardHeader>
        </div>

        <CardContent className="flex flex-col">
          {/* Title and Location */}
          <div className="mb-4 flex flex-row-reverse justify-between items-end">
            <div className="text-white text-lg sm:text-2xl font-bold drop-shadow-lg">
              {formattedPrice}
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-semibold line-clamp-1 group-hover:text-primary transition-colors">
                {property.title}
              </h3>
              <div className="flex items-center gap-1 text-muted-foreground mt-1">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm line-clamp-1">{property.location}</p>
              </div>
            </div>
          </div>

          {/* Property Features */}
          <div className="grid grid-cols-3 gap-2 sm:gap-4 border-t border-gray-600">
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full">
                <Bed className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-medium">{property.bedrooms}</span>
                <span className="text-muted-foreground ml-1">Beds</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full">
                <Bath className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-medium">{property.bathrooms}</span>
                <span className="text-muted-foreground ml-1">Baths</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 sm:p-2 bg-primary/10 rounded-full">
                <Square className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
              <div className="text-xs sm:text-sm">
                <span className="font-medium">{property.area}</span>
                <span className="text-muted-foreground ml-1">sqft</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Modals */}
      <PropertyDetailsModal
        propertyId={property.id}
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
      />
      <PropertyEditForm
        propertyId={property.id}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        propertyTitle={property.title}
        isDeleting={deleteMutation.isPending}
      />
    </>
  );
};
