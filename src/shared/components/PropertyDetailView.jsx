"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/shared/components/ui/tabs";
import { Button } from "@/shared/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { useToast } from "@/shared/hooks/use-toast";
import OptimizedImage from "./OptimizedImage";
import {
  MapPin,
  Bed,
  Bath,
  Move,
  Calendar,
  Heart,
  Share2,
  Phone,
  Mail,
  ClipboardCheck,
  Home,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  Cube,
  GalleryHorizontal,
  Compass,
  Video,
} from "lucide-react";

export default function PropertyDetailView({ property }) {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [showVirtualTour, setShowVirtualTour] = useState(false);
  const [contactFormData, setContactFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `Hi, I'm interested in this property. Please contact me.`,
  });

  const { toast } = useToast();

  const {
    id,
    title,
    description,
    price,
    location,
    address,
    type,
    status,
    bedrooms,
    bathrooms,
    area,
    yearBuilt,
    features,
    amenities,
    images,
    virtualTourUrl,
    agent,
    createdAt,
    nearbyPlaces,
    floorPlan,
  } = property;

  // Prepare images array including main image and other images
  const allImages = images
    ? [property.mainImage, ...images].filter(Boolean)
    : [property.mainImage].filter(Boolean);

  // Format price with commas for thousands
  const formattedPrice = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(price);

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % allImages.length);
  };

  const handlePrevImage = () => {
    setActiveImageIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    );
  };

  const handleShareProperty = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: `Check out this property: ${title}`,
          url: window.location.href,
        });
      } catch (error) {
        console.error("Error sharing property:", error);
      }
    } else {
      // Fallback - copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied",
        description: "Property link copied to clipboard",
      });
    }
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!contactFormData.name || !contactFormData.email) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send this data to your API
    console.log("Contact form submitted:", contactFormData);

    toast({
      title: "Message sent",
      description: "Your inquiry has been sent to the agent",
    });

    // Reset message but keep other fields
    setContactFormData((prev) => ({
      ...prev,
      message: `Hi, I'm interested in this property. Please contact me.`,
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setContactFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      {/* Virtual Tour Modal */}
      {showVirtualTour && virtualTourUrl && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4">
          <div className="w-full max-w-6xl bg-white dark:bg-zinc-900 rounded-lg overflow-hidden relative">
            <div className="p-4 flex justify-between items-center border-b border-zinc-200 dark:border-zinc-800">
              <h3 className="font-medium">Virtual Tour</h3>
              <button
                onClick={() => setShowVirtualTour(false)}
                className="p-1.5 rounded-full bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
              >
                <span className="sr-only">Close</span>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18"></path>
                  <path d="m6 6 12 12"></path>
                </svg>
              </button>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={virtualTourUrl}
                className="w-full h-full"
                frameBorder="0"
                allowFullScreen
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              />
            </div>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center text-sm text-zinc-500 dark:text-zinc-400 space-x-2">
          <Link
            href="/"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Home
          </Link>
          <span>/</span>
          <Link
            href="/properties"
            className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            Properties
          </Link>
          <span>/</span>
          <span className="text-zinc-800 dark:text-zinc-200 font-medium">
            {title}
          </span>
        </nav>

        {/* Property Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-white">
              {title}
            </h1>
            <div className="flex items-center mt-2 text-zinc-600 dark:text-zinc-400">
              <MapPin size={16} className="mr-1 flex-shrink-0" />
              <span>{address || location}</span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {formattedPrice}
            </span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="icon"
                className={`rounded-full ${
                  isLiked
                    ? "text-red-500 bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800"
                    : ""
                }`}
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart size={18} className={isLiked ? "fill-current" : ""} />
                <span className="sr-only">
                  {isLiked ? "Remove from favorites" : "Add to favorites"}
                </span>
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full"
                onClick={handleShareProperty}
              >
                <Share2 size={18} />
                <span className="sr-only">Share property</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Property Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          <div className="lg:col-span-8 relative">
            <div className="aspect-[16/9] relative rounded-lg overflow-hidden">
              <OptimizedImage
                src={allImages[activeImageIndex] || "/placeholder-property.jpg"}
                alt={`Property image ${activeImageIndex + 1}`}
                fill
                priority
                className="object-cover"
              />

              {allImages.length > 1 && (
                <>
                  <button
                    onClick={handlePrevImage}
                    className="absolute left-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center text-zinc-800 dark:text-white hover:bg-white dark:hover:bg-black/70 transition-colors z-10"
                  >
                    <ChevronLeft size={20} />
                    <span className="sr-only">Previous image</span>
                  </button>
                  <button
                    onClick={handleNextImage}
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-10 w-10 rounded-full bg-white/80 dark:bg-black/50 flex items-center justify-center text-zinc-800 dark:text-white hover:bg-white dark:hover:bg-black/70 transition-colors z-10"
                  >
                    <ChevronRight size={20} />
                    <span className="sr-only">Next image</span>
                  </button>
                </>
              )}

              {/* Virtual tour button */}
              {virtualTourUrl && (
                <button
                  onClick={() => setShowVirtualTour(true)}
                  className="absolute bottom-4 right-4 bg-blue-600 hover:bg-blue-700 transition-colors text-white py-2 px-4 rounded-lg flex items-center gap-2 shadow-lg"
                >
                  <Video size={16} />
                  <span>Virtual Tour</span>
                </button>
              )}
            </div>

            {/* Thumbnail navigation */}
            {allImages.length > 1 && (
              <div className="flex mt-3 gap-2 overflow-x-auto pb-2 snap-x">
                {allImages.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`relative h-16 w-24 flex-shrink-0 rounded-md overflow-hidden snap-start ${
                      activeImageIndex === index
                        ? "ring-2 ring-blue-500"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  >
                    <OptimizedImage
                      src={img || "/placeholder-property.jpg"}
                      alt={`Thumbnail ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Property Actions and Quick Info */}
          <div className="lg:col-span-4 flex flex-col gap-4">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-4">
              <h3 className="font-semibold text-lg mb-4 text-zinc-900 dark:text-white">
                Property Details
              </h3>

              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                    <Home size={16} />
                    Type
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white capitalize">
                    {type}
                  </span>
                </div>

                {bedrooms != null && (
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                      <Bed size={16} />
                      Bedrooms
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {bedrooms}
                    </span>
                  </div>
                )}

                {bathrooms != null && (
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                      <Bath size={16} />
                      Bathrooms
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {bathrooms}
                    </span>
                  </div>
                )}

                {area != null && (
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                      <Move size={16} />
                      Area
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {area} sq ft
                    </span>
                  </div>
                )}

                {yearBuilt && (
                  <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                    <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                      <Calendar size={16} />
                      Year Built
                    </span>
                    <span className="font-medium text-zinc-900 dark:text-white">
                      {yearBuilt}
                    </span>
                  </div>
                )}

                <div className="flex justify-between items-center py-2 border-b border-zinc-100 dark:border-zinc-800">
                  <span className="text-zinc-600 dark:text-zinc-400 flex items-center gap-2">
                    <ClipboardCheck size={16} />
                    Status
                  </span>
                  <span className="font-medium text-zinc-900 dark:text-white capitalize">
                    {status || "Available"}
                  </span>
                </div>
              </div>
            </div>

            {/* Agent Info */}
            {agent && (
              <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 p-4">
                <h3 className="font-semibold text-lg mb-4 text-zinc-900 dark:text-white">
                  Contact Agent
                </h3>

                <div className="flex items-center gap-3 mb-4">
                  <Avatar className="h-14 w-14">
                    <AvatarImage src={agent.image} alt={agent.name} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-200 text-lg font-semibold">
                      {agent.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium text-zinc-900 dark:text-white">
                      {agent.name}
                    </h4>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400">
                      {agent.title || "Real Estate Agent"}
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  {agent.phone && (
                    <a
                      href={`tel:${agent.phone}`}
                      className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Phone size={16} />
                      <span>{agent.phone}</span>
                    </a>
                  )}

                  {agent.email && (
                    <a
                      href={`mailto:${agent.email}`}
                      className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Mail size={16} />
                      <span>{agent.email}</span>
                    </a>
                  )}
                </div>

                <form onSubmit={handleContactSubmit} className="space-y-3">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Your Name*
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      required
                      value={contactFormData.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Your Email*
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      required
                      value={contactFormData.email}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Your Phone
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={contactFormData.phone}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1"
                    >
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={3}
                      value={contactFormData.message}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 rounded-md border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Send Message
                  </Button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Detailed Information */}
        <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-sm border border-zinc-200 dark:border-zinc-800 overflow-hidden">
          <Tabs defaultValue="description">
            <TabsList className="w-full border-b border-zinc-200 dark:border-zinc-800 p-0 h-auto bg-transparent">
              <TabsTrigger
                value="description"
                className="py-4 px-6 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                Description
              </TabsTrigger>
              <TabsTrigger
                value="features"
                className="py-4 px-6 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
              >
                Features & Amenities
              </TabsTrigger>
              {floorPlan && (
                <TabsTrigger
                  value="floorplan"
                  className="py-4 px-6 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  Floor Plan
                </TabsTrigger>
              )}
              {nearbyPlaces && (
                <TabsTrigger
                  value="location"
                  className="py-4 px-6 border-b-2 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600 rounded-none text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white"
                >
                  Location
                </TabsTrigger>
              )}
            </TabsList>

            <TabsContent value="description" className="p-6">
              <div className="prose dark:prose-invert max-w-none prose-zinc">
                <p className="text-zinc-700 dark:text-zinc-300 leading-relaxed whitespace-pre-line">
                  {description || "No description available for this property."}
                </p>
              </div>
            </TabsContent>

            <TabsContent value="features" className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features && features.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white text-lg mb-3 flex items-center gap-2">
                      <Cube
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      Key Features
                    </h3>
                    <ul className="space-y-2">
                      {features.map((feature, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-1">
                            •
                          </span>
                          <span className="text-zinc-700 dark:text-zinc-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {amenities && amenities.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-white text-lg mb-3 flex items-center gap-2">
                      <GalleryHorizontal
                        size={18}
                        className="text-blue-600 dark:text-blue-400"
                      />
                      Amenities
                    </h3>
                    <ul className="space-y-2">
                      {amenities.map((amenity, index) => (
                        <li key={index} className="flex items-start gap-2">
                          <span className="text-blue-600 dark:text-blue-400 mt-1">
                            •
                          </span>
                          <span className="text-zinc-700 dark:text-zinc-300 capitalize">
                            {amenity}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </TabsContent>

            {floorPlan && (
              <TabsContent value="floorplan" className="p-6">
                <div className="flex justify-center">
                  <div className="relative max-w-2xl w-full aspect-[4/3] rounded-lg overflow-hidden">
                    <OptimizedImage
                      src={floorPlan}
                      alt="Floor plan"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              </TabsContent>
            )}

            {nearbyPlaces && (
              <TabsContent value="location" className="p-6">
                <h3 className="font-semibold text-zinc-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                  <Compass
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                  Nearby Places
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(nearbyPlaces).map(([category, places]) => (
                    <div
                      key={category}
                      className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-4"
                    >
                      <h4 className="font-medium text-zinc-900 dark:text-white capitalize mb-2">
                        {category}
                      </h4>
                      <ul className="space-y-1.5 text-sm">
                        {places.map((place, index) => (
                          <li key={index} className="flex items-start gap-2">
                            <span className="text-blue-600 dark:text-blue-400 mt-0.5">
                              •
                            </span>
                            <span className="text-zinc-700 dark:text-zinc-300">
                              {typeof place === "string"
                                ? place
                                : `${place.name} (${place.distance})`}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    </>
  );
}
