"use client";

import Image from "next/image";
import Link from "next/link";
import { Heart, Bed, Bath, Square, MapPin } from "lucide-react";
import { useState, useEffect } from "react";
import { formatCurrency } from "@/shared/lib/utils";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import type { Property } from "@/shared/types/property";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface PropertyCardProps {
  property: Property;
  isFavorite?: boolean;
  onFavoriteToggle?: () => void;
  viewMode?: "grid" | "list";
}

export default function PropertyCard({
  property,
  isFavorite = false,
  onFavoriteToggle,
  viewMode = "grid",
}: PropertyCardProps) {
  const [isLiked, setIsLiked] = useState(isFavorite);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Update internal state when prop changes
  useEffect(() => {
    setIsLiked(isFavorite);
  }, [isFavorite]);

  const toggleLike = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (onFavoriteToggle) {
      onFavoriteToggle();
    } else {
      setIsLiked(!isLiked);
    }
  };

  const imageUrl =
    property.primaryImage ||
    property.images?.[0]?.image_url ||
    "/placeholder.svg?height=600&width=800";

  // List view card
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        whileHover={{ x: -3 }}
        className="w-full"
      >
        <Link href={`/search/${property.id}`}>
          <div className="flex w-full h-28 rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
            {/* Property image */}
            <div className="relative w-36 overflow-hidden bg-gray-100">
              <div
                className={`absolute inset-0 bg-gray-200 animate-pulse ${
                  imageLoaded ? "opacity-0" : "opacity-100"
                }`}
                style={{ transition: "opacity 0.5s ease" }}
              />
              <Image
                src={imageUrl}
                alt={property.title}
                fill
                sizes="(max-width: 768px) 33vw, 25vw"
                className={`object-cover transition-all duration-500 ${
                  imageLoaded ? "scale-100" : "scale-110 blur-sm"
                }`}
                priority={false}
                onLoad={() => setImageLoaded(true)}
              />

              {/* Favorite button */}
              <motion.div
                whileTap={{ scale: 0.9 }}
                className="absolute top-2 right-2"
              >
                <Button
                  variant="ghost"
                  size="icon"
                  className={`h-7 w-7 rounded-full ${
                    isLiked
                      ? "bg-red-500 text-white"
                      : "bg-white/90 dark:bg-slate-700/90 text-gray-700 dark:text-gray-200"
                  } hover:bg-white/90 dark:hover:bg-slate-700/90 hover:text-red-500 transition-all duration-300`}
                  onClick={toggleLike}
                >
                  <Heart
                    className={`h-3.5 w-3.5 transition-all duration-300 ${
                      isLiked ? "fill-current" : ""
                    }`}
                  />
                  <span className="sr-only">Toggle favorite</span>
                </Button>
              </motion.div>
            </div>

            {/* Property details */}
            <div className="flex flex-col justify-between flex-1 p-3">
              <div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium text-sm truncate text-gray-900 dark:text-white">
                      {property.title}
                    </h3>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                      <MapPin className="h-3 w-3 mr-1" />
                      <p className="truncate">{property.location}</p>
                    </div>
                  </div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-white">
                    {formatCurrency(property.price)}
                  </p>
                </div>
              </div>

              {/* Property specs */}
              <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                <div className="inline-flex items-center">
                  <Bed className="h-3.5 w-3.5 mr-1" />
                  <span>{property.bedrooms} bed</span>
                </div>
                <div className="inline-flex items-center">
                  <Bath className="h-3.5 w-3.5 mr-1" />
                  <span>{property.bathrooms} bath</span>
                </div>
                <div className="inline-flex items-center">
                  <Square className="h-3.5 w-3.5 mr-1" />
                  <span>{property.area} sqft</span>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  // Grid view card (default)
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -3 }}
      className="h-full"
    >
      <Link href={`/search/${property.id}`} className="h-full">
        <div className="relative h-full rounded-xl overflow-hidden bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-300">
          {/* Property image */}
          <div className="relative aspect-[3/2] w-full overflow-hidden bg-gray-100">
            <div
              className={`absolute inset-0 bg-gray-200 animate-pulse ${
                imageLoaded ? "opacity-0" : "opacity-100"
              }`}
              style={{ transition: "opacity 0.5s ease" }}
            />
            <Image
              src={imageUrl}
              alt={property.title}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className={`object-cover transition-all duration-500 ${
                imageLoaded ? "scale-100" : "scale-110 blur-sm"
              }`}
              priority={false}
              onLoad={() => setImageLoaded(true)}
            />

            {/* Price tag overlay */}
            <div className="absolute top-3 left-3 bg-white dark:bg-slate-700 px-3 py-1 rounded-lg shadow-sm">
              <p className="font-semibold text-sm text-gray-900 dark:text-white">
                {formatCurrency(property.price)}
              </p>
            </div>

            {/* Favorite button */}
            <motion.div
              whileTap={{ scale: 0.9 }}
              className="absolute top-3 right-3"
            >
              <Button
                variant="ghost"
                size="icon"
                className={`h-8 w-8 rounded-full ${
                  isLiked
                    ? "bg-red-500 text-white"
                    : "bg-white/90 dark:bg-slate-700/90 text-gray-700 dark:text-gray-200"
                } hover:bg-white/90 dark:hover:bg-slate-700/90 hover:text-red-500 transition-all duration-300`}
                onClick={toggleLike}
              >
                <Heart
                  className={`h-4 w-4 transition-all duration-300 ${
                    isLiked ? "fill-current" : ""
                  }`}
                />
                <span className="sr-only">Toggle favorite</span>
              </Button>
            </motion.div>
          </div>

          {/* Property details */}
          <div className="p-3">
            {/* Title and location */}
            <div className="mb-2">
              <h3 className="font-medium text-sm truncate text-gray-900 dark:text-white">
                {property.title}
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                {property.location}
              </p>
            </div>

            {/* Property specs */}
            <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 border-t border-gray-100 dark:border-gray-700 pt-2">
              <div className="inline-flex items-center">
                <Bed className="h-3.5 w-3.5 mr-1" />
                <span>{property.bedrooms} bed</span>
              </div>
              <div className="inline-flex items-center">
                <Bath className="h-3.5 w-3.5 mr-1" />
                <span>{property.bathrooms} bath</span>
              </div>
              <div className="inline-flex items-center">
                <Square className="h-3.5 w-3.5 mr-1" />
                <span>{property.area} sqft</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
