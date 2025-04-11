"use client";
import { useState } from "react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import { BasicInfoForm } from "@/app/(dashboard)/agent/addNewProp/components/BasicInfoForm";
import { DetailsForm } from "@/app/(dashboard)/agent/addNewProp/components/DetailsForm";
import { LocationForm } from "@/app/(dashboard)/agent/addNewProp/components/LocationForm";
import { MediaDocumentsForm } from "@/app/(dashboard)/agent/addNewProp/components/MediaDocumentsForm";
import { PROPERTY_TYPES } from "@/app/(dashboard)/constants/propertype";
import { useProperties } from "@/shared/hooks/useProperties";
import { useRouter } from "next/navigation";
import { Property } from "@/shared/types/property";
import { useToast } from "@/shared/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function AddProperty() {
  const router = useRouter();
  const { toast } = useToast();
  const { createProperty, loading: hookLoading } = useProperties();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [propertyData, setPropertyData] = useState<
    Omit<
      Property,
      "id" | "created_at" | "updated_at" | "user_id" | "images" | "primaryImage"
    >
  >({
    title: "",
    property_type: PROPERTY_TYPES.HOUSE,
    price: 0,
    description: "",
    listing_type: "SALE",
    status: "ACTIVE",
    featured: false,
    year_built: "",
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    lot_size: 0,
    address: "",
    city: "",
    state: "",
    zip_code: "",
    country: "",
    latitude: 0,
    longitude: 0,
    location: "", // Will be set during submission based on city and state
  });

  const [images, setImages] = useState<File[]>([]);
  const [activeTab, setActiveTab] = useState("basic-info");

  const handleFormChange = (field, value) => {
    // Clear error when user makes changes
    if (error) setError(null);

    setPropertyData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTypeChange = (value) => {
    if (error) setError(null);

    setPropertyData((prev) => ({
      ...prev,
      property_type: value,
    }));
  };

  const validateForm = () => {
    // Required fields validation
    if (!propertyData.title) {
      setError("Property title is required");
      setActiveTab("basic-info");
      return false;
    }

    if (propertyData.price <= 0) {
      setError("Property price must be greater than 0");
      setActiveTab("basic-info");
      return false;
    }

    if (!propertyData.description) {
      setError("Property description is required");
      setActiveTab("basic-info");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Reset states
    setError(null);

    // Validate form
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: error,
        variant: "destructive",
      });
      return;
    }

    // Start submission
    setIsSubmitting(true);

    try {
      // Create the property in the database
      const newProperty = await createProperty(
        { ...propertyData, user_id: "" },
        images
      );

      if (newProperty) {
        toast({
          title: "Success!",
          description: "Property has been created successfully",
        });

        // Redirect to properties list
        router.push("/search");
      } else {
        throw new Error("Failed to create property");
      }
    } catch (err: any) {
      console.error("Error creating property:", err);
      setError(err.message || "Failed to create property");
      toast({
        title: "Error",
        description: err.message || "Failed to create property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const moveToNextTab = () => {
    if (activeTab === "basic-info") setActiveTab("details");
    else if (activeTab === "details") setActiveTab("location");
    else if (activeTab === "location") setActiveTab("media");
  };

  const moveToPreviousTab = () => {
    if (activeTab === "media") setActiveTab("location");
    else if (activeTab === "location") setActiveTab("details");
    else if (activeTab === "details") setActiveTab("basic-info");
  };

  return (
    <div className="w-full h-full mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Add New Property</h1>
        <p className="text-muted-foreground">
          Fill in the details to create a new property listing
        </p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="basic-info" disabled={isSubmitting}>
              Basic Info
            </TabsTrigger>
            <TabsTrigger value="details" disabled={isSubmitting}>
              Details
            </TabsTrigger>
            <TabsTrigger value="location" disabled={isSubmitting}>
              Location
            </TabsTrigger>
            <TabsTrigger value="media" disabled={isSubmitting}>
              Media
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="space-y-4">
            <BasicInfoForm
              data={propertyData}
              onChange={handleFormChange}
              onTypeChange={handleTypeChange}
            />
            <div className="flex justify-end">
              <Button
                type="button"
                onClick={moveToNextTab}
                disabled={isSubmitting}
              >
                Next: Details
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="details" className="space-y-4">
            <DetailsForm data={propertyData} onChange={handleFormChange} />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={moveToPreviousTab}
                disabled={isSubmitting}
              >
                Back: Basic Info
              </Button>
              <Button
                type="button"
                onClick={moveToNextTab}
                disabled={isSubmitting}
              >
                Next: Location
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="location" className="space-y-4">
            <LocationForm data={propertyData} onChange={handleFormChange} />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={moveToPreviousTab}
                disabled={isSubmitting}
              >
                Back: Details
              </Button>
              <Button
                type="button"
                onClick={moveToNextTab}
                disabled={isSubmitting}
              >
                Next: Media
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="media" className="space-y-4">
            <MediaDocumentsForm setImages={setImages} />
            <div className="flex justify-between">
              <Button
                type="button"
                variant="outline"
                onClick={moveToPreviousTab}
                disabled={isSubmitting}
              >
                Back: Location
              </Button>
              <Button
                type="submit"
                className="bg-primary border text-black hover:bg-zinc-200/50 dark:bg-primary/80 dark:text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> Saving...
                  </span>
                ) : (
                  "Save Property"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  );
}
