"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/shared/providers/UserProvider";
import { PropertyEditForm } from "../../components/PropertyEditForm";
import { Button } from "@/shared/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useSupabaseItem } from "@/shared/hooks/useSupabase";

export default function EditPropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const [isEditModalOpen, setIsEditModalOpen] = useState(true);

  // Convert id from params to a string
  const propertyId = id ? (Array.isArray(id) ? id[0] : id) : null;

  const {
    data: property,
    isLoading: propertyLoading,
    isError,
  } = useSupabaseItem<{ id: string; user_id: string }>(
    "properties",
    propertyId,
    {
      enabled: !!propertyId && !!user,
    }
  );

  // Check if the current user is the owner of the property
  const isOwner =
    property && user && "user_id" in property && property.user_id === user.id;

  // Redirect back to properties list when modal is closed
  const handleCloseModal = () => {
    setIsEditModalOpen(false);
    router.push("/agent/agentProperties");
  };

  // If user is not authenticated, redirect to login
  useEffect(() => {
    if (!userLoading && !user) {
      router.push("/login");
    }
  }, [user, userLoading, router]);

  // If property doesn't belong to user, redirect to properties list
  useEffect(() => {
    if (
      !propertyLoading &&
      property &&
      user &&
      "user_id" in property &&
      property.user_id !== user.id
    ) {
      router.push("/agent/agentProperties");
    }
  }, [property, propertyLoading, user, router]);

  if (userLoading || propertyLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4 text-muted-foreground">
          You must be logged in to edit properties.
        </p>
        <Button onClick={() => router.push("/login")}>Log In</Button>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p className="mb-4 text-muted-foreground">
          There was an error loading the property. It may not exist or you may
          not have permission to view it.
        </p>
        <Button onClick={() => router.push("/agent/agentProperties")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
      </div>
    );
  }

  if (!isOwner && property) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4 text-muted-foreground">
          You dont have permission to edit this property.
        </p>
        <Button onClick={() => router.push("/agent/agentProperties")}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center">
        <Button
          variant="outline"
          onClick={() => router.push("/agent/agentProperties")}
          className="mr-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Properties
        </Button>
        <h1 className="text-2xl font-bold">Edit Property</h1>
      </div>

      {isEditModalOpen && propertyId && (
        <PropertyEditForm
          propertyId={propertyId}
          isOpen={isEditModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}
