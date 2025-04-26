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
} from "lucide-react";

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
        setProperty(propertyData);

        // Check if this property is in favorites (could use local storage or API)
        const favorites = JSON.parse(localStorage.getItem("favorites") || "[]");
        setIsFavorite(favorites.includes(id));

        // Fetch similar properties after getting the property data
        setLoadingSimilar(true);
        const similarProps = await getSimilarProperties(id, 4);
        setSimilarProperties(similarProps);
        setLoadingSimilar(false);
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
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm z-30">
        <div className="container mx-auto max-w-7xl px-4 py-3 flex items-center justify-between">
          <div className="font-bold text-xl text-gray-800 dark:text-white">
            <Link href="/" className="flex items-center">
              <Home className="mr-2" size={24} />
              <span>RealEstate</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
              aria-label={
                darkMode ? "Switch to light mode" : "Switch to dark mode"
              }
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>
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

          <div
            ref={descriptionRef}
            className="text-gray-600 dark:text-gray-300 text-base leading-relaxed mb-2 overflow-hidden transition-all duration-300"
            style={{ maxHeight: "100px" }}
          >
            <p>{property.description}</p>
          </div>

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
                {property.features &&
                  property.features.map((feature, index) => (
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
            {/* Contact Agent Card */}
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 sticky top-24">
              {property.agent ? (
                <>
                  <h3 className="text-gray-800 dark:text-white font-semibold mb-4">
                    Contact Agent
                  </h3>
                  <div className="flex items-center mb-6">
                    <div className="w-14 h-14 bg-gray-200 dark:bg-gray-700 rounded-full mr-4 flex items-center justify-center">
                      <Users size={24} className="text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {property.agent.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Real Estate Agent
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <a
                      href={`tel:${property.agent.phone}`}
                      className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Phone size={18} className="mr-3" />
                      <span>{property.agent.phone}</span>
                    </a>
                    <a
                      href={`mailto:${property.agent.email}`}
                      className="flex items-center text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                    >
                      <Mail size={18} className="mr-3" />
                      <span>{property.agent.email}</span>
                    </a>
                  </div>
                </>
              ) : (
                <h3 className="text-gray-800 dark:text-white font-semibold mb-4">
                  Contact Information
                </h3>
              )}

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

              {/* Schedule Tour Form */}
              <div className="mb-6">
                <h4 className="text-gray-800 dark:text-white font-medium mb-3">
                  Schedule a Tour
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 dark:text-gray-400 mb-1">
                      Preferred Time
                    </label>
                    <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:border-blue-500 focus:ring-1 focus:ring-blue-500">
                      <option value="morning">Morning (9AM - 12PM)</option>
                      <option value="afternoon">Afternoon (12PM - 4PM)</option>
                      <option value="evening">Evening (4PM - 7PM)</option>
                    </select>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setIsContactModalOpen(true)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Schedule a Tour
              </button>
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
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Home className="mr-2" />
                RealEstate
              </h3>
              <p className="text-gray-300 mb-4">
                Connecting people with their perfect homes since 2010. Our
                mission is to make property search simple, efficient, and
                enjoyable.
              </p>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Twitter"
                >
                  <Twitter size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Facebook"
                >
                  <Facebook size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label="Instagram"
                >
                  <Instagram size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Home
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Properties
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Agents
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Blog
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Contact
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Property Types</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Houses
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Apartments
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Condos
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Commercial
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition-colors"
                  >
                    Land
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-lg mb-4">Contact Us</h4>
              <address className="not-italic text-gray-400">
                <p className="mb-2">123 Property Street</p>
                <p className="mb-2">Austin, TX 78701</p>
                <p className="mb-2">United States</p>
              </address>
              <p className="text-gray-400 mb-1">
                <a
                  href="tel:+15125551234"
                  className="hover:text-white transition-colors"
                >
                  (512) 555-1234
                </a>
              </p>
              <p className="text-gray-400">
                <a
                  href="mailto:info@realestate.com"
                  className="hover:text-white transition-colors"
                >
                  info@realestate.com
                </a>
              </p>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center">
            <div className="text-sm text-gray-400 mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} RealEstate. All rights reserved.
            </div>
            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <a href="#" className="hover:text-white transition-colors">
                Terms &amp; Conditions
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Cookie Policy
              </a>
              <a href="#" className="hover:text-white transition-colors">
                Sitemap
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Contact Modal - Would be implemented as a component */}
      <AnimatePresence>
        {isContactModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-gray-800 rounded-lg max-w-md w-full shadow-xl p-6"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Schedule a Tour
                </h3>
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Complete this form to schedule a tour of {property.title}
              </p>
              {/* Modal content would go here */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={() => setIsContactModalOpen(false)}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Request Tour
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
