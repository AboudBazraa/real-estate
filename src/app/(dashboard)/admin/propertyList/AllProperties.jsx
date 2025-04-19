"use client";
import React, { useState } from "react";
import { Home } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyCard } from "../../agent/components/PropertyCard";
import { PropertyDetailsModal } from "../../agent/components/PropertyDetailsModal";
import { PropertyEditForm } from "../../agent/components/PropertyEditForm";
import { DeleteConfirmationModal } from "../../agent/components/DeleteConfirmationModal";
import { useToast } from "@/shared/hooks/use-toast";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    },
  },
};

const emptyStateVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      delay: 0.2,
      type: "spring",
      stiffness: 300,
      damping: 25,
    },
  },
};

export default function AllProperties({ data = [] }) {
  const [selectedPropertyId, setSelectedPropertyId] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();

  const handleViewProperty = (id) => {
    setSelectedPropertyId(id);
    setIsDetailsModalOpen(true);
  };

  const handleEditProperty = (id) => {
    console.log("Opening edit modal for  property ID:", id);
    setSelectedPropertyId(id);
    setIsEditModalOpen(true);
  };

  const handleDeleteProperty = (id) => {
    setSelectedPropertyId(id);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!selectedPropertyId) return;

    setIsDeleting(true);

    try {
      // Here would go actual delete API call
      // await deleteProperty(selectedPropertyId);

      toast({
        title: "Property deleted",
        description: "The property has been successfully deleted.",
        variant: "success",
      });

      // Close delete modal after successful deletion
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete the property. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div>
      <AnimatePresence>
        {data.length === 0 ? (
          <motion.div
            className="text-center py-20 bg-muted/20 rounded-lg border border-dashed"
            variants={emptyStateVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{
                scale: [0.8, 1.2, 1],
                opacity: 1,
              }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
              }}
            >
              <Home className="h-12 w-12 mx-auto text-muted-foreground/40 mb-4" />
            </motion.div>
            <motion.h3
              className="text-xl font-medium mb-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              No properties found
            </motion.h3>
            <motion.p
              className="text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              There are no properties available at the moment.
            </motion.p>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {data.map((property, index) => (
              <motion.div
                key={property.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      type: "spring",
                      stiffness: 300,
                      damping: 24,
                      delay: index * 0.05,
                    },
                  },
                }}
              >
                <PropertyCard
                  property={{
                    id: property.id,
                    title: property.title || "Untitled Property",
                    price: property.price || 0,
                    status:
                      property.featured === true
                        ? "ACTIVE"
                        : property.featured === false
                        ? "PENDING"
                        : "DRAFT",
                    primaryImage: property.image || property.primaryImage,
                    address: property.location || "Location not specified",
                    bedrooms: property.bedrooms || 0,
                    bathrooms: property.bathrooms || 0,
                    size: property.size || 0,
                    property_type: property.property_type || "Residential",
                  }}
                  showStatus={true}
                  onView={() => handleViewProperty(property.id)}
                  onEdit={() => handleEditProperty(property.id)}
                  onDelete={() => handleDeleteProperty(property.id)}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Property Details Modal */}
      {selectedPropertyId && (
        <PropertyDetailsModal
          propertyId={selectedPropertyId}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      {/* Property Edit Modal - Using your PropertyEditForm component */}
      {isEditModalOpen && selectedPropertyId && (
        <>
          {console.log(
            "Rendering PropertyEditForm with propertyId:",
            selectedPropertyId
          )}
          <PropertyEditForm
            propertyId={selectedPropertyId}
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            onSaved={() => {
              setIsEditModalOpen(false);
              toast({
                title: "Property updated",
                description: "The property has been successfully updated.",
                variant: "success",
              });
            }}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action cannot be undone."
        itemName={data.find((p) => p.id === selectedPropertyId)?.title || ""}
      />
    </div>
  );
}
