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
import { useTranslation } from "@/shared/hooks/useTranslation";
import propertyListTranslations from "./translations";

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

  // Add translation support
  const { currentLanguage, isRTL } = useTranslation();
  const t =
    propertyListTranslations[currentLanguage] || propertyListTranslations.en;

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
        title: t.propertyDeleted,
        description: t.propertyDeletedMessage,
        variant: "success",
      });

      // Close delete modal after successful deletion
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast({
        title: t.error,
        description: t.deleteError,
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
      className={isRTL ? "rtl" : ""}
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
          <TabsList className={`w-48 ${isRTL ? "tabs-list" : ""}`}>
            <TabsTrigger value="List" className="w-full">
              {t.list}
            </TabsTrigger>
            <TabsTrigger value="View" className="w-full">
              {t.view}
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
                className={isRTL ? "table-container" : ""}
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
          className={isRTL ? "modal-content" : ""}
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
              title: t.propertyUpdated,
              description: t.propertyUpdatedMessage,
              variant: "success",
            });
          }}
          className={isRTL ? "modal-content" : ""}
        />
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        isLoading={isDeleting}
        title={t.deleteProperty}
        description={t.deleteConfirmation}
        itemName={
          properties.find((p) => p.id === selectedPropertyId)?.title || ""
        }
        className={isRTL ? "modal-content" : ""}
      />
    </motion.div>
  );
}
