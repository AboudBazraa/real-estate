"use client";
import { useState } from "react";
import { DataTableDemo } from "../../components/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import AllProperties from "./AllProperties";
import { motion, AnimatePresence } from "framer-motion";
import { PropertyDetailsModal } from "../../agent/components/PropertyDetailsModal";
import { PropertyEditForm } from "../../agent/components/PropertyEditForm";
import { DeleteConfirmationModal } from "../../agent/components/DeleteConfirmationModal";
import { useToast } from "@/shared/hooks/use-toast";

// Animation variants for tab transitions
const tabVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

export default function PropertyList({ properties }) {
  const [activeTab, setActiveTab] = useState("List");
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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Tabs
        defaultValue="List"
        className="space-y-4"
        onValueChange={setActiveTab}
      >
        <motion.div
          initial={{ y: -10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <TabsList className="w-48">
            <TabsTrigger value="List" className="w-full">
              List
            </TabsTrigger>
            <TabsTrigger value="View" className="w-full">
              View
            </TabsTrigger>
          </TabsList>
        </motion.div>

        <AnimatePresence mode="wait">
          {activeTab === "List" && (
            <TabsContent key="list-tab" value="List" className="space-y-4">
              <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <DataTableDemo
                  data={properties}
                  onView={handleViewProperty}
                  onEdit={handleEditProperty}
                  onDelete={handleDeleteProperty}
                />
              </motion.div>
            </TabsContent>
          )}

          {activeTab === "View" && (
            <TabsContent key="view-tab" value="View" className="space-y-4">
              <motion.div
                variants={tabVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
              >
                <AllProperties data={properties} />
              </motion.div>
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>

      {/* Property Details Modal */}
      {selectedPropertyId && (
        <PropertyDetailsModal
          propertyId={selectedPropertyId}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}

      {/* Property Edit Modal - Using PropertyEditForm component */}
      {isEditModalOpen && selectedPropertyId && (
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
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action cannot be undone."
        itemName={
          properties.find((p) => p.id === selectedPropertyId)?.title || ""
        }
      />
    </motion.div>
  );
}
