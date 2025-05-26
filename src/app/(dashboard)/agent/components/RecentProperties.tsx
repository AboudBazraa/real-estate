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
  translations?: {
    recentProperties: string;
    viewAll: string;
    noPropertiesYet: string;
    addYourFirstProperty: string;
    addProperty: string;
  };
  isRTL?: boolean;
}

export function RecentProperties({
  properties,
  isLoading,
  onDelete,
  translations,
  isRTL = false,
}: RecentPropertiesProps) {
  const router = useRouter();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const t = translations || {
    recentProperties: "Recent Properties",
    viewAll: "View all",
    noPropertiesYet: "No properties yet",
    addYourFirstProperty: "Add your first property to see it here",
    addProperty: "Add Property",
  };

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
    <div className={`h-full ${isRTL ? "rtl" : ""}`}>
      <div
        className={`flex items-center justify-between pb-4 ${
          isRTL ? "flex-row-reverse" : ""
        }`}
      >
        <h3 className="text-xl font-semibold">{t.recentProperties}</h3>
        <Button variant="ghost" size="sm" asChild>
          <Link href="/agent/agentProperties" className="text-sm">
            {t.viewAll}
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
              isRTL={isRTL}
            />
          ))}
        </div>
      ) : properties.length === 0 ? (
        <Card
          className={`text-center border-dashed flex items-center justify-center h-80 ${
            isRTL ? "rtl" : ""
          }`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className="p-3 bg-blue-100 rounded-full mb-3">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-lg font-medium mb-2">{t.noPropertiesYet}</h3>
            <p className="text-gray-500 mb-4">{t.addYourFirstProperty}</p>
            <Button asChild>
              <Link
                href="/agent/addNewProp"
                className={isRTL ? "flex-row-reverse" : ""}
              >
                <Plus className={isRTL ? "ml-2 h-4 w-4" : "mr-2 h-4 w-4"} />{" "}
                {t.addProperty}
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
              isRTL={isRTL}
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
