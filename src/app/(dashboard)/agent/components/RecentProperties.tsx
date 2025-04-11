"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/shared/components/ui/button";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Building2, Plus } from "lucide-react";
import { PropertyCard } from "./PropertyCard";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";

export interface PropertyItem {
  id: string;
  title: string;
  price: number;
  status: string;
  primaryImage: string | null;
  address: string;
  bedrooms?: number;
  bathrooms?: number;
  property_type?: string;
  size?: number;
}

interface RecentPropertiesProps {
  properties: PropertyItem[];
  isLoading: boolean;
  onDelete: (propertyId: string) => Promise<void>;
}

export function RecentProperties({
  properties,
  isLoading,
  onDelete,
}: RecentPropertiesProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteProperty = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    setIsDeleting(true);
    try {
      await onDelete(propertyToDelete);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
      setPropertyToDelete(null);
    }
  };

  return (
    <div className="h-full">
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-xl font-semibold">Recent Properties</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/agent/agentProperties" className="text-sm">
            View all
          </Link>
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[...Array(2)].map((_, index) => (
            <PropertyCard
              key={index}
              id=""
              title=""
              price={0}
              status=""
              primaryImage={null}
              address=""
              isLoading={true}
            />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <Card className="text-center border-dashed flex items-center justify-center h-80">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="p-3 bg-blue-100 rounded-full mb-3">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">No properties yet</h3>
            <p className="text-gray-500 mb-4">
              Add your first property to see it here
            </p>
            <Button asChild>
              <Link href="/agent/addNewProp">
                <Plus className="mr-2 h-4 w-4" /> Add Property
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {properties.map((property) => (
            <PropertyCard
              key={property.id}
              id={property.id}
              title={property.title}
              price={property.price}
              status={property.status}
              primaryImage={property.primaryImage}
              address={property.address}
              bedrooms={property.bedrooms}
              bathrooms={property.bathrooms}
              property_type={property.property_type}
              size={property.size}
            />
          ))}
        </div>
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        isLoading={isDeleting}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
      />
    </div>
  );
}
