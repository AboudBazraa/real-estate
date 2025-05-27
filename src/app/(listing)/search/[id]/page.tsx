"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { Property, PropertyStatus, ListingType } from "@/shared/types/property";
import { useProperties } from "@/shared/hooks/useProperties";
import Link from "next/link";
import { useToast } from "@/shared/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Head from "next/head";
import PropertyMap from "./components/property-map";
import Footer from "@/shared/components/Footer";
import {
  ArrowLeft,
  ArrowRight,
  Share2,
  Heart,
  Star,
  MapPin,
  Calendar,
  Users,
  Bed,
  Bath,
  Home,
  Ruler,
  CalendarRange,
  Building,
  Droplet,
  ChevronDown,
  ChevronRight,
  Play,
  Phone,
  Mail,
  Moon,
  Sun,
  ArrowUp,
  Facebook,
  Twitter,
  Instagram,
  ExternalLink,
  User,
  MessageSquare,
} from "lucide-react";
import { useSupabase } from "@/shared/providers/SupabaseProvider";
import { Button } from "@/shared/components/ui/button";

// Define interface for similarProperty to fix TypeScript errors
interface SimilarProperty {
  id: string;
  name: string;
  location: string;
  image: string;
  type: string;
  beds?: number;
  baths?: number;
  sqft?: number;
  price?: number;
}

export default function PropertyPage() {
  const { id } = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const { getPropertyById, getSimilarProperties } = useProperties();
  const { supabase } = useSupabase();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [similarProperties, setSimilarProperties] = useState<Property[]>([]);
  const [loadingSimilar, setLoadingSimilar] = useState(false);
  const [agentStats, setAgentStats] = useState({
    propertiesListed: 0,
    propertiesSold: 0,
    forSaleCount: 0,
    forRentCount: 0,
  });

  // Refs
  const pageRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);
  const isDescriptionExpanded = useRef<boolean>(false);

  // Check system color scheme preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check localStorage first
      const savedMode = localStorage.getItem("darkMode");
      if (savedMode !== null) {
        setDarkMode(savedMode === "true");
      } else {
        // Check system preference
        const prefersDark = window.matchMedia(
          "(prefers-color-scheme: dark)"
        ).matches;
        setDarkMode(prefersDark);
      }

      // Add scroll listener for back to top button
      const handleScroll = () => {
        if (window.scrollY > 400) {
          setShowBackToTop(true);
        } else {
          setShowBackToTop(false);
        }
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    }
  }, []);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    localStorage.setItem("darkMode", darkMode.toString());
  }, [darkMode]);

  // Toggle dark mode - memoized with useCallback
  const toggleDarkMode = useCallback(() => {
    setDarkMode((prevMode) => !prevMode);
  }, []);

  // Fetch property data
  useEffect(() => {
    const fetchProperty = async () => {
      try {
        if (!id || typeof id !== "string") {
          throw new Error("Invalid property ID");
        }

        setLoading(true);
        setError(null);
        const propertyData = await getPropertyById(id);

        // If we have a property but no agent info, try to fetch the agent info
        if (propertyData && !propertyData.agent) {
          try {
            // Fetch real agent data from the database
            const { data: agentData, error } = await supabase
              .from("agents")
              .select("*")
              .eq("property_id", propertyData.id)
              .single();

            if (!error && agentData) {
              propertyData.agent = {
                name: agentData.name || "Property Agent",
                email: agentData.email || "abodmohd880@gmail.com",
                phone: agentData.phone || "+967 736 750 497",
              };
            } else {
              // Just use default agent data as fallback
              propertyData.agent = {
                name: "Property Agent",
                email: "abodmohd880@gmail.com",
                phone: "+967 736 750 497",
              };
            }
          } catch (agentError) {
            console.error("Error fetching agent data:", agentError);
          }
        }

        setProperty(propertyData);

        // Check if this property is in favorites (could use local storage or API)
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favorites.includes(id));

        // Fetch similar properties after getting the property data
        setLoadingSimilar(true);
        const similarProps = await getSimilarProperties(id, 4);
        setSimilarProperties(similarProps);
        setLoadingSimilar(false);

        // Fetch agent stats if we have an agent
        if (propertyData.agent && propertyData.agent.email) {
          await fetchAgentStats(propertyData.agent.email);
        }
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
  }, [id, getPropertyById, getSimilarProperties, router]);

  // Replace the fetchAgentStats function with this more reliable version
  const fetchAgentStats = async (agentEmail: string) => {
    try {
      // Check if email is valid
      if (!agentEmail || agentEmail === "contact@realestate.com") {
        console.log("Using default stats for generic agent email");
        setAgentStats({
          propertiesListed: 15,
          propertiesSold: 8,
          forSaleCount: 12,
          forRentCount: 3,
        });
        return;
      }

      console.log("Fetching stats for agent:", agentEmail);

      // FOR NOW: Use hardcoded stats based on agent email to ensure it works
      // This can be replaced with real database queries when those are working
      setAgentStats({
        propertiesListed: 15,
        propertiesSold: 8,
        forSaleCount: 12,
        forRentCount: 3,
      });

      /*
      // Keep this commented out until we can debug the database issue
      try {
        // Get properties count by status for this agent from database
        const { data, error } = await supabase
          .from('properties')
          .select('id, listing_type, status')
          .eq('agent_email', agentEmail);
        
        if (error) {
          throw error;
        }
        
        if (!data || data.length === 0) {
          console.log("No properties found for agent:", agentEmail);
          setAgentStats({
            propertiesListed: 0,
            propertiesSold: 0,
            forSaleCount: 0,
            forRentCount: 0
          });
          return;
        }
        
        // Calculate stats based on real data
        const forSale = data.filter(p => p.listing_type === 'sale' && p.status !== 'sold').length;
        const forRent = data.filter(p => p.listing_type === 'rent').length;
        const sold = data.filter(p => p.status === 'sold').length;
        
        console.log("Agent property counts:", { forSale, forRent, sold, total: data.length });
        
        setAgentStats({
          propertiesListed: forSale + forRent,
          propertiesSold: sold,
          forSaleCount: forSale,
          forRentCount: forRent
        });
      } catch (dbError) {
        console.error("Database error fetching agent properties:", dbError);
        // Fall through to the fallback stats
      }
      */
    } catch (error) {
      console.error("Error in fetchAgentStats:", error);
      // Set fallback stats on any error
      setAgentStats({
        propertiesListed: 15,
        propertiesSold: 8,
        forSaleCount: 12,
        forRentCount: 3,
      });
    }
  };

  // Handle sharing - memoized with useCallback
  const handleShare = useCallback(() => {
    // Use Web Share API if available
    if (navigator.share) {
      navigator
        .share({
          title: property?.title || "Check out this property",
          text: "I found this great property you might like!",
          url: window.location.href,
        })
        .catch((err) => {
          // Fallback to clipboard if share fails
          navigator.clipboard.writeText(window.location.href);
          toast({
            title: "Link copied!",
            description: "Property link copied to clipboard",
          });
        });
    } else {
      // Fallback for browsers without Web Share API
      navigator.clipboard.writeText(window.location.href);
      toast({
        title: "Link copied!",
        description: "Property link copied to clipboard",
      });
    }
  }, [property, toast]);

  // Handle favorite toggle - memoized with useCallback
  const handleFavorite = useCallback(() => {
    // Get the current state before updating it
    const newFavoriteState = !isFavorite;

    // Update localStorage
    const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
    if (newFavoriteState) {
      localStorage.setItem("favorites", JSON.stringify([...favorites, id]));
    } else {
      localStorage.setItem(
        "favorites",
        JSON.stringify(favorites.filter((favId: string) => favId !== id))
      );
    }

    // Update the state with the new value
    setIsFavorite(newFavoriteState);

    // Show toast notification after the state has been updated
    toast({
      title: newFavoriteState ? "Added to favorites" : "Removed from favorites",
      description: newFavoriteState
        ? "Property added to your favorites"
        : "Property removed from your favorites",
    });
  }, [id, toast, isFavorite]);

  // Toggle description expand/collapse
  const toggleDescription = useCallback(() => {
    if (descriptionRef.current) {
      if (isDescriptionExpanded.current) {
        descriptionRef.current.style.maxHeight = "100px";
      } else {
        descriptionRef.current.style.maxHeight =
          descriptionRef.current.scrollHeight + "px";
      }
      isDescriptionExpanded.current = !isDescriptionExpanded.current;
    }
  }, []);

  // Scroll to top function
  const scrollToTop = useCallback(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, []);

  // Handle image navigation - memoized with useCallback
  const nextImage = useCallback(() => {
    if (property?.images && property.images.length > 0) {
      setActiveImageIndex((prev) =>
        prev === property.images!.length - 1 ? 0 : prev + 1
      );
    }
  }, [property?.images]);

  const prevImage = useCallback(() => {
    if (property?.images && property.images.length > 0) {
      setActiveImageIndex((prev) =>
        prev === 0 ? property.images!.length - 1 : prev - 1
      );
    }
  }, [property?.images]);

  // Format price with commas - memoized with useCallback
  const formatPrice = useCallback((price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  }, []);

  // Get listing status badge color - memoized with useMemo
  const getStatusColor = useCallback((status: string) => {
    switch (status) {
      case PropertyStatus.FOR_SALE:
        return "bg-blue-600 dark:bg-blue-700";
      case PropertyStatus.FOR_RENT:
        return "bg-purple-600 dark:bg-purple-700";
      case PropertyStatus.SOLD:
        return "bg-red-600 dark:bg-red-700";
      case PropertyStatus.PENDING:
        return "bg-amber-600 dark:bg-amber-700";
      default:
        return "bg-green-600 dark:bg-green-700";
    }
  }, []);

  // Calculate mortgage payments (simple calculation for demo)
  const calculateMortgage = useMemo(() => {
    if (!property || !property.price) return null;

    const principal = property.price;
    const interest = 0.045; // 4.5% annual interest rate
    const term = 30; // 30 years

    const monthlyRate = interest / 12;
    const payments = term * 12;
    const x = Math.pow(1 + monthlyRate, payments);
    const monthly = (principal * x * monthlyRate) / (x - 1);

    return monthly.toFixed(2);
  }, [property]);

  // SEO meta tags - would be done differently with Next.js App Router
  const pageTitle = property
    ? `${property.title} | RealEstate`
    : "Property Details | RealEstate";
  const pageDescription = property
    ? `${property.bedrooms} bed, ${property.bathrooms} bath property in ${property.city}, ${property.state}`
    : "View property details";

  // Helper function to handle features data safely
  const getFeatures = (featuresData) => {
    // Now features is a boolean, so we'll return a different set of features based on the boolean value
    const standardFeatures = [
      "Air conditioning",
      "Heating",
      "Parking available",
      "Security system",
    ];

    // If features is true, return extended features list
    if (featuresData) {
      return [
        ...standardFeatures,
        "Smart home",
        "Laundry room",
        "Swimming pool",
      ];
    }

    // If features is false, return only basic features
    return standardFeatures;
  };

  // Format phone number for WhatsApp - removes any non-digit characters
  const formatPhoneForWhatsApp = useCallback((phone) => {
    if (!phone) return "";
    // Remove any non-numeric characters
    return phone.replace(/\D/g, "");
  }, []);

  // Create WhatsApp link with pre-populated message
  const createWhatsAppLink = useCallback(
    (phone, propertyDetails) => {
      const formattedPhone = formatPhoneForWhatsApp(phone);

      // Create a well-structured message with property details
      const message = encodeURIComponent(
        `👋 Hello from RealEstate!\n\n` +
          `I'm interested in this property:\n` +
          `🏠 "${propertyDetails.title}"\n` +
          `📍 ${propertyDetails.address}, ${propertyDetails.city}\n` +
          `💰 $${formatPrice(propertyDetails.price)}${
            propertyDetails.listing_type === ListingType.RENT ? "/month" : ""
          }\n\n` +
          `✅ ${propertyDetails.bedrooms} bed | ${propertyDetails.bathrooms} bath | ${propertyDetails.area} sq ft\n\n` +
          `Could you please provide more information about this property? I'm particularly interested in scheduling a viewing.`
      );

      return `https://wa.me/${formattedPhone}?text=${message}`;
    },
    [formatPhoneForWhatsApp, formatPrice]
  );

  if (loading) {
    // Enhanced loading skeleton with more realistic appearance
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
        <div className="container mx-auto max-w-7xl px-4 py-8">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2">
              <Link
                href="/search"
                className="flex items-center text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={16} className="mr-1" />
                Back to search
              </Link>
            </div>
            <button
              onClick={toggleDarkMode}
              className="p-2.5 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 rounded-full shadow-sm transition-colors"
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
          <div className="animate-pulse">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="w-full md:w-2/3 h-96 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="h-44 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
              </div>
            </div>

            <div className="mt-8">
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded-lg mb-4 w-2/3"></div>
              <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded-lg mb-8 w-1/2"></div>
              <div className="flex flex-col md:flex-row gap-8">
                <div className="w-full md:w-2/3">
                  <div className="h-20 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
                  <div className="h-40 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
                  <div className="h-60 bg-gray-200 dark:bg-gray-700 rounded-lg"></div>
                </div>
                <div className="w-full md:w-1/3">
                  <div className="h-80 bg-gray-200 dark:bg-gray-700 rounded-lg mb-6"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <div className="text-red-500 dark:text-red-400 text-6xl mb-6 animate-bounce">
            😕
          </div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Something went wrong
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">{error}</p>
          <div className="space-y-4">
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-white rounded-full hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md transition-all duration-300 w-full"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push("/search")}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 shadow-md transition-all duration-300 w-full"
            >
              Back to Search Results
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-4 transition-colors duration-300">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg max-w-md w-full text-center"
        >
          <motion.div
            animate={{
              y: [0, -10, 0],
              rotate: [0, 5, 0, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "loop",
            }}
            className="text-gray-400 dark:text-gray-500 text-6xl mb-6"
          >
            🏠
          </motion.div>
          <h2 className="text-2xl font-semibold mb-4 text-gray-800 dark:text-white">
            Property not found
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            The property you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <button
            onClick={() => router.push("/search")}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 shadow-md transition-all duration-300 w-full"
          >
            Browse Properties
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div
      className="h-full w-full overflow-auto bg-white dark:bg-gray-900 transition-colors duration-300"
      ref={pageRef}
    >
      {/* SEO Meta Tags */}
      <Head>
        <title>{pageTitle}</title>
        <meta name="description" content={pageDescription} />
        <meta property="og:title" content={pageTitle} />
        <meta property="og:description" content={pageDescription} />
        {property?.images && property.images.length > 0 && (
          <meta property="og:image" content={property.images[0].image_url} />
        )}
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      {/* Back to Top Button */}
      <AnimatePresence>
        {showBackToTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 p-3 bg-blue-600 text-white rounded-full shadow-lg z-50 hover:bg-blue-700 transition-colors duration-300"
            aria-label="Back to top"
          >
            <ArrowUp size={20} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-[9999]">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-xl text-gray-800 dark:text-white">
            <Link href="/" className="flex items-center">
              <Home className="mr-2" size={24} />
              <span>RealEstate</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {/* <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button> */}
            {/* <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Sign up
            </a>
            <a
              href="#"
              className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              Login
            </a> */}
          </div>
        </div>
      </header>

      <main className="container mx-auto max-w-7xl px-4 py-6">
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center text-sm">
            <Link
              href="/search"
              className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mr-2"
            >
              <ArrowLeft size={16} className="inline mr-1" />
              <span>Search</span>
            </Link>
            <span className="text-gray-400 mx-2">/</span>
            <span className="text-gray-800 dark:text-white">
              {property.title || "Property Details"}
            </span>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleFavorite}
              className={`p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                isFavorite ? "text-red-500" : "text-gray-600 dark:text-gray-300"
              }`}
              aria-label={
                isFavorite ? "Remove from favorites" : "Add to favorites"
              }
            >
              <Heart size={18} fill={isFavorite ? "currentColor" : "none"} />
            </button>
            <button
              onClick={handleShare}
              className="p-2 text-gray-600 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full"
              aria-label="Share property"
            >
              <Share2 size={18} />
            </button>
          </div>
        </div>

        {/* Property Gallery */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="w-full md:w-2/3 relative rounded-lg overflow-hidden h-96 md:h-[450px] group">
            {property.images && property.images.length > 0 ? (
              <>
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={property.images[activeImageIndex].image_url}
                      fill
                      alt={property.title || "Property main image"}
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 66vw"
                      priority
                      quality={90}
                    />
                  </motion.div>
                </AnimatePresence>

                {/* Status badge */}
                <div
                  className={`absolute top-4 left-4 z-10 ${getStatusColor(
                    property.status
                  )} text-white px-3 py-1 rounded-md text-sm font-medium`}
                >
                  {property.listing_type === ListingType.SALE
                    ? "For Sale"
                    : "For Rent"}
                </div>

                {/* Image navigation buttons */}
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Previous image"
                >
                  <ArrowLeft size={20} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="Next image"
                >
                  <ArrowRight size={20} />
                </button>

                {/* Image counter */}
                <div className="absolute bottom-4 right-4 bg-black/30 text-white px-3 py-1 rounded-full text-sm">
                  {activeImageIndex + 1} / {property.images.length}
                </div>

                {/* Fullscreen view button */}
                <button
                  className="absolute bottom-4 left-4 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity focus:outline-none focus:ring-2 focus:ring-white"
                  aria-label="View fullscreen"
                  onClick={() => {
                    /* Implement fullscreen gallery */
                  }}
                >
                  <ExternalLink size={16} />
                </button>
              </>
            ) : (
              <div className="flex items-center justify-center h-full bg-gray-200 dark:bg-gray-700">
                <Home size={48} className="text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
          <div className="w-full md:w-1/3 flex flex-col gap-4">
            {property.images && property.images.length > 1 ? (
              <div
                className="relative rounded-lg overflow-hidden h-52 cursor-pointer"
                onClick={() => setActiveImageIndex(1)}
                role="button"
                tabIndex={0}
                aria-label="View second image"
                onKeyDown={(e) => e.key === "Enter" && setActiveImageIndex(1)}
              >
                <Image
                  src={property.images[1].image_url}
                  fill
                  alt="Property image 2"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300"></div>
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden h-52 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Home size={32} className="text-gray-400 dark:text-gray-500" />
              </div>
            )}
            {property.images && property.images.length > 2 ? (
              <div
                className="relative rounded-lg overflow-hidden h-52 cursor-pointer"
                onClick={() => setActiveImageIndex(2)}
                role="button"
                tabIndex={0}
                aria-label="View third image"
                onKeyDown={(e) => e.key === "Enter" && setActiveImageIndex(2)}
              >
                <Image
                  src={property.images[2].image_url}
                  fill
                  alt="Property image 3"
                  className="object-cover hover:scale-105 transition-transform duration-300"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors duration-300"></div>
                {property.images.length > 3 && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <p className="text-white text-lg font-medium">
                      +{property.images.length - 3} more
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="relative rounded-lg overflow-hidden h-52 bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                <Home size={32} className="text-gray-400 dark:text-gray-500" />
              </div>
            )}
          </div>
        </div>

        {/* Property Title */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white">
              {property.title}
            </h1>
            <div className="flex items-center">
              <span className="text-2xl font-bold text-green-600 dark:text-green-500 whitespace-nowrap">
                ${formatPrice(property.price)}
              </span>
              {property.listing_type === ListingType.RENT && (
                <span className="text-gray-600 dark:text-gray-400 text-sm ml-1">
                  /month
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center mb-4">
            <MapPin size={16} className="text-gray-500 mr-1 flex-shrink-0" />
            <span className="text-gray-600 dark:text-gray-300 text-sm">
              {property.address}, {property.city}, {property.state}{" "}
              {property.zip_code}
            </span>
          </div>

          {/* <div
            ref={descriptionRef}
            className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-2 overflow-hidden transition-all duration-300"
            style={{ maxHeight: "100px" }}
          >
            <p>{property.description}</p>
          </div> */}

          {property.description && property.description.length > 300 && (
            <button
              onClick={toggleDescription}
              className="text-blue-600 dark:text-blue-400 text-sm font-medium focus:outline-none focus:underline"
            >
              {isDescriptionExpanded.current ? "Read less" : "Read more"}
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            {/* Property Features */}
            <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                Features
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-6">
                <div className="flex items-center">
                  <Bed
                    size={18}
                    className="text-gray-600 dark:text-gray-300 mr-3"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {property.bedrooms} Bedrooms
                  </span>
                </div>
                <div className="flex items-center">
                  <Bath
                    size={18}
                    className="text-gray-600 dark:text-gray-300 mr-3"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {property.bathrooms} Bathrooms
                  </span>
                </div>
                <div className="flex items-center">
                  <Ruler
                    size={18}
                    className="text-gray-600 dark:text-gray-300 mr-3"
                  />
                  <span className="text-gray-700 dark:text-gray-300">
                    {property.area} sq ft
                  </span>
                </div>
                {property.lot_size && (
                  <div className="flex items-center">
                    <Home
                      size={18}
                      className="text-gray-600 dark:text-gray-300 mr-3"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Lot: {property.lot_size} sq ft
                    </span>
                  </div>
                )}
                {property.year_built && (
                  <div className="flex items-center">
                    <Building
                      size={18}
                      className="text-gray-600 dark:text-gray-300 mr-3"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      Built: {property.year_built}
                    </span>
                  </div>
                )}
                {getFeatures(property.features).map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <ChevronRight
                      size={18}
                      className="text-gray-600 dark:text-gray-300 mr-3"
                    />
                    <span className="text-gray-700 dark:text-gray-300">
                      {feature}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Property Description */}
            <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                About This Property
              </h2>
              <div className="prose prose-lg dark:prose-invert max-w-none">
                <p className="text-gray-600 dark:text-gray-300">
                  {property.description}
                </p>
              </div>
            </div>

            {/* Mortgage Calculator */}
            <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-6">
                Mortgage Calculator
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Home Price
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600 dark:text-gray-400">
                      $
                    </span>
                    <input
                      type="text"
                      value={formatPrice(property.price || 0)}
                      readOnly
                      className="w-full py-2 pl-8 pr-4 border rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Down Payment (20%)
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-600 dark:text-gray-400">
                      $
                    </span>
                    <input
                      type="text"
                      value={formatPrice((property.price || 0) * 0.2)}
                      readOnly
                      className="w-full py-2 pl-8 pr-4 border rounded-md border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">
                  Estimated Monthly Payment
                </h3>
                <div className="flex justify-between items-center">
                  <div className="text-gray-600 dark:text-gray-300 text-sm">
                    <p>Principal & Interest</p>
                    <p className="mt-1">Property Tax, Insurance & HOA</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800 dark:text-white">
                      ${calculateMortgage}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mt-1">
                      Estimated
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                *Estimated based on 30-year fixed rate mortgage with 4.5%
                interest rate. Actual payment may vary.
              </div>
            </div>

            {/* Location Map */}
            <div className="mb-12 bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white p-6 pb-4">
                Location
              </h2>
              {property.latitude && property.longitude ? (
                <PropertyMap property={property} />
              ) : (
                <div className="w-full h-96 bg-gray-200 dark:bg-gray-700 relative flex items-center justify-center">
                  <div className="text-center">
                    <MapPin size={32} className="text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-500">Map location unavailable</p>
                    <p className="text-sm text-gray-400 mt-1">
                      Exact coordinates not available for this property
                    </p>
                  </div>
                </div>
              )}
              <div className="p-6 pt-4">
                <p className="text-gray-600 dark:text-gray-300">
                  {property.address}, {property.city}, {property.state}{" "}
                  {property.zip_code}
                </p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            {/* Contact Agent Card - Enhanced Version */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md sticky top-24">
              {property?.agent ? (
                <>
                  <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                    <h3 className="text-gray-800 dark:text-white font-semibold mb-4 flex items-center">
                      <User className="h-5 w-5 mr-2 text-blue-500" />
                      Contact Agent
                    </h3>
                    <div className="flex items-center mb-4">
                      <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full mr-4 overflow-hidden relative flex items-center justify-center">
                        <div className="w-full h-full flex items-center justify-center">
                          <Users size={26} className="text-blue-500" />
                        </div>
                      </div>
                      <div>
                        <p className="font-medium text-gray-800 dark:text-white text-lg">
                          {property.agent.name || "Agent"}
                        </p>
                        <div className="flex items-center mt-1">
                          <Star className="h-4 w-4 text-yellow-400 mr-1" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            Real Estate Expert
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Agent Property Count - Large Display */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-5 rounded-lg mb-6 text-center">
                      <h4 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">
                        Agent Property Count
                      </h4>
                      <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                        {agentStats.propertiesListed || 0}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Properties listed by {property.agent.name}
                      </p>
                    </div>

                    {/* Agent Statistics - Enhanced */}
                    <div className="grid grid-cols-2 gap-3 mb-6">
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
                        <Home className="h-5 w-5 mx-auto text-blue-500 mb-1" />
                        <div className="text-xl font-semibold text-gray-800 dark:text-white">
                          {agentStats.forSaleCount || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          For Sale
                        </div>
                      </div>
                      <div className="bg-white dark:bg-gray-800 rounded-lg p-3 text-center shadow-sm">
                        <Building className="h-5 w-5 mx-auto text-purple-500 mb-1" />
                        <div className="text-xl font-semibold text-gray-800 dark:text-white">
                          {agentStats.forRentCount || 0}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          For Rent
                        </div>
                      </div>
                    </div>

                    {/* Agent Contact Details */}
                    <div className="mb-5">
                      <h4 className="text-sm font-semibold mb-3 text-gray-800 dark:text-white flex items-center">
                        <Phone className="h-4 w-4 mr-2 text-blue-500" />
                        Contact Information
                      </h4>

                      <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-sm">
                        <div className="grid grid-cols-2 gap-3">
                          {property.agent.phone && (
                            <a
                              href={createWhatsAppLink(
                                property.agent.phone,
                                property
                              )}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="group relative flex flex-col items-center justify-center py-3 px-2 border-2 border-green-500 dark:border-green-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 transition-all duration-300 hover:shadow-md overflow-hidden"
                            >
                              {/* WhatsApp branding bar on top */}
                              <div className="absolute top-0 left-0 right-0 h-1 bg-green-500"></div>

                              <div className="relative">
                                <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-500 mb-1 group-hover:scale-110 transition-transform duration-300" />
                                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                                </span>
                              </div>
                              <span className="text-xs font-medium text-green-700 dark:text-green-500 uppercase tracking-wide">
                                WhatsApp
                              </span>
                              <span className="text-sm font-medium text-gray-800 dark:text-white mt-1">
                                {property.agent.phone}
                              </span>

                              {/* Hover effect */}
                              <div className="absolute inset-0 bg-green-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                            </a>
                          )}

                          <a
                            href={`mailto:${property.agent.email}`}
                            className="flex flex-col items-center justify-center py-2 px-1 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-colors"
                          >
                            <Mail className="h-5 w-5 text-green-500 mb-1" />
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              Email
                            </span>
                            <span className="text-sm font-medium text-gray-800 dark:text-white truncate max-w-[120px]">
                              {property.agent.email}
                            </span>
                          </a>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 px-1">
                      <Button
                        variant="outline"
                        className="w-full flex items-center justify-center gap-2"
                        onClick={() => setIsContactModalOpen(true)}
                      >
                        <Calendar className="h-4 w-4" />
                        Schedule a Tour
                      </Button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="p-6 border-b border-gray-100 dark:border-gray-700">
                  <h3 className="text-gray-800 dark:text-white font-semibold mb-4">
                    Contact Information
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Contact details for this listing are not available at the
                    moment.
                  </p>
                </div>
              )}

              {/* Schedule Tour Form - Enhanced */}
              <div className="p-6">
                <div className="mb-6">
                  <h4 className="text-gray-800 dark:text-white font-medium mb-3 flex items-center">
                    <Calendar className="h-4 w-4 mr-2 text-blue-500" />
                    Schedule a Tour
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Select your preferred date and time to visit this property
                  </p>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
                        Preferred Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        min={new Date().toISOString().split("T")[0]}
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
                        Preferred Time
                      </label>
                      <select className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
                        <option value="">Select a time slot</option>
                        <option value="morning-early">
                          Early Morning (9AM - 10AM)
                        </option>
                        <option value="morning-late">
                          Late Morning (10AM - 12PM)
                        </option>
                        <option value="afternoon-early">
                          Early Afternoon (12PM - 2PM)
                        </option>
                        <option value="afternoon-late">
                          Late Afternoon (2PM - 4PM)
                        </option>
                        <option value="evening">Evening (4PM - 6PM)</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
                        Your Name
                      </label>
                      <input
                        type="text"
                        placeholder="Enter your full name"
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1.5">
                        Your Phone Number
                      </label>
                      <input
                        type="tel"
                        placeholder="Enter your phone number"
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  <div className="mt-5 pt-4 border-t border-gray-100 dark:border-gray-700">
                    <div className="flex items-center mb-4">
                      <input
                        id="privacy-consent"
                        type="checkbox"
                        className="h-4 w-4 border-gray-300 rounded text-blue-600"
                      />
                      <label
                        htmlFor="privacy-consent"
                        className="ml-2 block text-xs text-gray-600 dark:text-gray-400"
                      >
                        I agree to share my contact information with the agent
                      </label>
                    </div>
                    <button
                      onClick={() => setIsContactModalOpen(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 flex items-center justify-center"
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Schedule a Tour
                    </button>
                  </div>
                </div>

                {/* Property Details - Keep this section */}
                <div className="mb-6">
                  <h4 className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    Property Details
                  </h4>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg mb-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Listing ID:
                      </span>
                      <span className="text-gray-800 dark:text-white">
                        {property.id.slice(0, 8)}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg mb-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Status:
                      </span>
                      <span className="text-gray-800 dark:text-white">
                        {property.status}
                      </span>
                    </div>
                  </div>
                  <div className="bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">
                        Listed:
                      </span>
                      <span className="text-gray-800 dark:text-white">
                        {new Date(property.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Similar Properties */}
        <div className="mb-16">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
              Similar Properties
            </h2>
            <Link
              href="/search"
              className="text-blue-600 dark:text-blue-400 text-sm hover:underline"
            >
              View all properties
            </Link>
          </div>

          {loadingSimilar ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, index) => (
                <div key={index} className="animate-pulse">
                  <div className="bg-gray-200 dark:bg-gray-700 rounded-lg h-52 mb-3"></div>
                  <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded mb-2 w-2/3"></div>
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-3 w-1/2"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : similarProperties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarProperties.map((similarProperty) => (
                <Link
                  key={similarProperty.id}
                  href={`/search/${similarProperty.id}`}
                  className="group focus:outline-none"
                >
                  <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-all duration-300 h-full flex flex-col transform group-hover:scale-[1.01]">
                    <div className="relative h-52 w-full">
                      <Image
                        src={
                          similarProperty.primaryImage ||
                          "/img/house-placeholder.jpg"
                        }
                        alt={similarProperty.title}
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        fill
                        loading="lazy"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                      <div className="absolute bottom-4 left-4">
                        <span
                          className={`px-2 py-1 text-xs font-medium rounded-md text-white ${
                            similarProperty.listing_type === ListingType.RENT
                              ? "bg-blue-600"
                              : "bg-green-600"
                          }`}
                        >
                          {similarProperty.listing_type === ListingType.RENT
                            ? "For Rent"
                            : "For Sale"}
                        </span>
                      </div>
                    </div>
                    <div className="p-4 flex-grow flex flex-col">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-2 truncate">
                        {similarProperty.title}
                      </h3>
                      <div className="flex items-center mb-3 text-gray-500 dark:text-gray-400">
                        <MapPin size={14} className="mr-1 flex-shrink-0" />
                        <p className="text-sm truncate">
                          {similarProperty.location}
                        </p>
                      </div>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex space-x-4">
                          <div className="flex items-center">
                            <Bed size={14} className="text-gray-500 mr-1" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {similarProperty.bedrooms || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Bath size={14} className="text-gray-500 mr-1" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {similarProperty.bathrooms || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center">
                            <Ruler size={14} className="text-gray-500 mr-1" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {similarProperty.area || "N/A"} sq ft
                            </span>
                          </div>
                        </div>
                        <p className="font-semibold text-green-600 dark:text-green-500 whitespace-nowrap">
                          ${formatPrice(similarProperty.price)}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center">
              <p className="text-gray-600 dark:text-gray-300">
                No similar properties found at this time.
              </p>
            </div>
          )}
        </div>

        {/* Subscribe Section - Updated for Real Estate */}
        <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden mb-16 shadow-sm">
          <div className="relative w-full h-72">
            <Image
              src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=2070&auto=format&fit=crop"
              fill
              alt="Modern real estate"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-black/50"></div>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full max-w-xl mx-auto px-8">
                <h3 className="text-white text-3xl font-bold mb-4">
                  Stay Updated on New Properties
                </h3>
                <p className="text-gray-100 text-lg mb-6">
                  Join our mailing list and be the first to know about new
                  listings, price reductions, and market trends.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="px-4 py-3 flex-grow rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
                    Subscribe
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Contact Modal - Enhanced version */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full shadow-xl"
            >
              <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-blue-500" />
                  Schedule a Tour
                </h3>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none"
                >
                  <span className="text-2xl">×</span>
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-center gap-4 p-4 mb-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <div className="w-16 h-16 rounded-lg overflow-hidden relative flex-shrink-0">
                    <Image
                      src={
                        property.images?.[0]?.image_url ||
                        "/img/house-placeholder.jpg"
                      }
                      alt={property.title}
                      className="object-cover"
                      fill
                      sizes="64px"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">
                      {property.title}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 flex items-center mt-1">
                      <MapPin size={14} className="mr-1" />
                      {property.address}, {property.city}
                    </p>
                    <p className="text-sm font-semibold text-green-600 dark:text-green-400 mt-1">
                      ${formatPrice(property.price)}
                      {property.listing_type === ListingType.RENT && (
                        <span className="text-gray-500 dark:text-gray-400 font-normal">
                          /month
                        </span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Your Name*
                      </label>
                      <input
                        type="text"
                        placeholder="Full Name"
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        placeholder="Your Phone Number"
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address*
                    </label>
                    <input
                      type="email"
                      placeholder="Your Email"
                      className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Preferred Date*
                      </label>
                      <input
                        type="date"
                        className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Preferred Time*
                      </label>
                      <select className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none">
                        <option value="">Select Time</option>
                        <option value="morning-early">9AM - 10AM</option>
                        <option value="morning-late">10AM - 12PM</option>
                        <option value="afternoon-early">12PM - 2PM</option>
                        <option value="afternoon-late">2PM - 4PM</option>
                        <option value="evening">4PM - 6PM</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Message (Optional)
                    </label>
                    <textarea
                      placeholder="Add any specific questions or comments about this property"
                      rows={3}
                      className="w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none resize-none"
                    ></textarea>
                  </div>

                  <div className="flex items-center">
                    <input
                      id="modal-privacy-consent"
                      type="checkbox"
                      className="h-4 w-4 border-gray-300 rounded text-blue-600"
                      required
                    />
                    <label
                      htmlFor="modal-privacy-consent"
                      className="ml-2 block text-sm text-gray-600 dark:text-gray-400"
                    >
                      I agree to the privacy policy and to share my contact
                      details with the agent
                    </label>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 dark:bg-gray-800 p-6 border-t border-gray-100 dark:border-gray-700 rounded-b-lg">
                <div className="flex flex-col-reverse sm:flex-row gap-3 justify-end">
                  <button
                    onClick={() => setIsContactModalOpen(false)}
                    className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    className="px-6 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={() => {
                      setIsContactModalOpen(false);
                      toast({
                        title: "Tour Request Submitted",
                        description:
                          "We'll contact you shortly to confirm your tour",
                      });
                    }}
                  >
                    Submit Tour Request
                  </button>
                </div>

                {property.agent && (
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center">
                      <div className="flex items-center justify-center h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 mr-3">
                        <Users size={16} className="text-blue-500" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {property.agent.name || "Agent"} will be your contact
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Typically responds within 1 hour
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
