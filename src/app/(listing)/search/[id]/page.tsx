"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Property } from "@/shared/types/property";
import { useProperties } from "@/shared/hooks/useProperties";
import PropertyDetails from "./components/property-details";
import PropertyGallery from "./components/property-gallery";
import PropertyMap from "./components/property-map";
import PropertyContact from "./components/property-contact";
import { ArrowLeft, Share2, Heart, Printer } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/shared/hooks/use-toast";

export default function PropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { getPropertyById } = useProperties();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!id || typeof id !== "string") {
          throw new Error("Invalid property ID");
        }

        setLoading(true);
        setError(null);
        const propertyData = await getPropertyById(id);
        setProperty(propertyData);
      } catch (err) {
        console.error("Error in fetchProperty:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load property details"
        );
        // Redirect to search page after 3 seconds if property not found
        if (err instanceof Error && err.message === "Property not found") {
          setTimeout(() => {
            router.push("/search");
          }, 3000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id, getPropertyById, router]);

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Property link copied to clipboard",
    });
  };

  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
    toast({
      title: isFavorite ? "Removed from favorites" : "Added to favorites",
      description: isFavorite
        ? "Property removed from your favorites"
        : "Property added to your favorites",
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center space-x-2 mb-6">
            <Link
              href="/search"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to search
            </Link>
          </div>
          <div className="animate-pulse">
            <div className="w-full h-96 bg-gray-200 rounded-lg mb-8"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-10 bg-gray-200 rounded mb-4 w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded mb-8 w-1/2"></div>
                <div className="h-40 bg-gray-200 rounded mb-6"></div>
                <div className="h-60 bg-gray-200 rounded"></div>
              </div>
              <div className="lg:col-span-1">
                <div className="h-80 bg-gray-200 rounded mb-6"></div>
                <div className="h-60 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-semibold mb-4">Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => router.push("/search")}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark w-full"
          >
            Back to Search Results
          </button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-lg shadow-sm max-w-md w-full text-center">
          <div className="text-gray-400 text-5xl mb-4">🏠</div>
          <h2 className="text-2xl font-semibold mb-4">Property not found</h2>
          <p className="text-gray-600 mb-6">
            The property you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/search")}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark w-full"
          >
            Browse Properties
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 pb-4">
        {/* Breadcrumb and actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-2 bg-slate-200/50 py-1 px-2 rounded-lg ">
          <div className="flex items-center space-x-2 mb-4 md:mb-0">
            <Link
              href="/search"
              className="flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft size={16} className="mr-1" />
              Back to search
            </Link>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Share property"
            >
              <Share2 size={20} />
            </button>
            <button
              onClick={handleFavorite}
              className={`p-2 ${
                isFavorite
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-600 hover:text-gray-900"
              } hover:bg-gray-100 rounded-full transition-colors`}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart size={20} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handlePrint}
              className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-colors"
              aria-label="Print property details"
            >
              <Printer size={20} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <PropertyGallery images={property.images || []} />
            <PropertyDetails property={property} />
          </div>
          <div className="lg:col-span-1 space-y-6">
            <div className="sticky top-24">
              <PropertyContact property={property} />
              <div className="mt-6">
                <PropertyMap property={property} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
