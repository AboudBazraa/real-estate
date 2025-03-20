"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useUser } from "@/shared/providers/UserProvider";
import { useSupabase } from "@/shared/providers/SupabaseProvider";
import { useToast } from "@/shared/hooks/use-toast";
import { Button } from "@/shared/components/ui/button";
import { Separator } from "@/shared/components/ui/separator";
import { ChevronLeft, Building2, Upload, Loader2, Check } from "lucide-react";
import {
  uploadPropertyImage,
  createPropertyImage,
} from "@/shared/utils/property-utils";
import {
  PROPERTY_TYPES,
  PROPERTY_STATUS,
} from "@/app/(dashboard)/constants/propertype";
import Link from "next/link";
import { PropertyForm } from "../components/PropertyForm";

export default function AddNewPropertyPage() {
  const router = useRouter();
  const { user } = useUser();
  const { supabase } = useSupabase();
  const { toast } = useToast();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleSubmit = async (formData) => {
    if (!user?.id) {
      toast({
        title: "Authentication Required",
        description: "You must be logged in to add a property",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Format property data for database
      const propertyData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        location: formData.location,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        zip_code: formData.zip_code,
        country: formData.country,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        bedrooms: parseInt(formData.bedrooms),
        area: parseInt(formData.area),
        lot_size: formData.lot_size ? parseInt(formData.lot_size) : null,
        year_built: formData.year_built ? parseInt(formData.year_built) : null,
        property_type: formData.property_type,
        listing_type: formData.listing_type,
        status: formData.status,
        featured: formData.featured || false,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log("Submitting property data:", propertyData);

      // Insert property into database
      const { data: propertyResult, error: propertyError } = await supabase
        .from("properties")
        .insert(propertyData)
        .select();

      if (propertyError) throw new Error(propertyError.message);

      const propertyId = propertyResult[0].id;

      // Handle multiple image uploads if provided
      if (formData.newImages && formData.newImages.length > 0) {
        const totalImages = formData.newImages.length;
        const progressPerImage = 90 / totalImages; // Reserve 10% for final processing

        // Upload all images in parallel
        const uploadPromises = formData.newImages.map(async (image, index) => {
          try {
            // Upload the image
            const imageUrl = await uploadPropertyImage(
              image,
              supabase,
              propertyId
            );

            // Update progress
            setUploadProgress((prevProgress) =>
              Math.min(90, prevProgress + progressPerImage)
            );

            // Create image record in database
            await createPropertyImage(
              supabase,
              propertyId,
              imageUrl,
              index === 0 // First image is primary
            );

            return { success: true, url: imageUrl };
          } catch (error) {
            console.error(`Error uploading image ${index + 1}:`, error);
            return { success: false, error };
          }
        });

        // Wait for all uploads to complete
        const results = await Promise.all(uploadPromises);

        // Check for any failed uploads
        const failedUploads = results.filter((r) => !r.success);
        if (failedUploads.length > 0) {
          console.error(`${failedUploads.length} images failed to upload`);
        }

        setUploadProgress(100);
      }

      toast({
        title: "Property Added",
        description: "Your new property has been successfully added",
      });

      // Navigate to properties list after successful addition
      router.push("/agent/agentProperties");
    } catch (error) {
      console.error("Error adding property:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to add property",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className="container max-w-5xl mx-auto py-6 px-4 md:px-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/agent/agentProperties">
              <ChevronLeft className="h-5 w-5" />
            </Link>
          </Button>
          <h1 className="text-2xl font-bold">Add New Property</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <PropertyForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>

        <div className="space-y-6">
          <div className="bg-muted rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Building2 className="h-5 w-5 text-primary" />
              <h3 className="font-medium text-lg">Adding a Property</h3>
            </div>
            <Separator className="my-4" />
            <div className="space-y-4 text-sm">
              <p>Complete the form with all required property details.</p>
              <p>Add high-quality images to showcase the property features.</p>
              <p>Provide accurate pricing and location information.</p>
              <p>
                Once added, your property will be visible to potential clients.
              </p>
            </div>
            {isSubmitting && (
              <div className="mt-6 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Uploading</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-secondary h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-primary h-full transition-all duration-300 ease-in-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground italic mt-2">
                  Please wait while we save your property...
                </p>
              </div>
            )}
          </div>

          <div className="flex flex-col gap-2">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/agent/agentProperties">View All Properties</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
