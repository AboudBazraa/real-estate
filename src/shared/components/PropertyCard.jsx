"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart, MapPin, Bed, Bath, Move, Tag, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function PropertyCard({ property, priority = false }) {
  const [isLiked, setIsLiked] = useState(false);

  const {
    id,
    title,
    price,
    location,
    bedrooms,
    bathrooms,
    area,
    type,
    mainImage,
    slug,
  } = property;

  // Format price with commas for thousands
  const formattedPrice = new Intl.NumberFormat("en-US").format(price);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-zinc-900 rounded-lg overflow-hidden border border-zinc-200 dark:border-zinc-800 shadow-sm hover:shadow-md transition-all duration-200 h-full flex flex-col"
    >
      <div className="relative">
        <Link
          href={`/properties/${slug || id}`}
          className="block aspect-[4/3] relative overflow-hidden"
        >
          <Image
            src={mainImage || "/placeholder-property.jpg"}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 hover:scale-110"
            priority={priority}
          />

          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsLiked(!isLiked);
              }}
              aria-label={
                isLiked ? "Remove from favorites" : "Add to favorites"
              }
              className={`h-8 w-8 rounded-full flex items-center justify-center transition-colors ${
                isLiked
                  ? "bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400"
                  : "bg-white/90 text-zinc-600 dark:bg-zinc-800/90 dark:text-zinc-400 hover:text-red-500"
              }`}
            >
              <Heart className={`h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-10">
            <div className="inline-block px-2 py-1 bg-blue-500 text-white text-xs font-medium rounded-full mb-2">
              {type}
            </div>
            <h3 className="text-white font-semibold line-clamp-1">{title}</h3>
          </div>
        </Link>
      </div>

      <div className="p-4 flex-grow flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <div>
            <p className="font-medium text-zinc-800 dark:text-white text-lg">
              ${formattedPrice}
            </p>
          </div>
          <div className="flex items-center text-zinc-600 dark:text-zinc-400 text-sm">
            <MapPin size={14} className="mr-1" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-2 py-3 border-t border-b border-zinc-100 dark:border-zinc-800 my-2">
          {bedrooms != null && (
            <div className="flex flex-col items-center">
              <div className="flex items-center text-zinc-500 dark:text-zinc-400">
                <Bed size={16} className="mr-1" />
                <span>{bedrooms}</span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                Beds
              </span>
            </div>
          )}

          {bathrooms != null && (
            <div className="flex flex-col items-center">
              <div className="flex items-center text-zinc-500 dark:text-zinc-400">
                <Bath size={16} className="mr-1" />
                <span>{bathrooms}</span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                Baths
              </span>
            </div>
          )}

          {area != null && (
            <div className="flex flex-col items-center">
              <div className="flex items-center text-zinc-500 dark:text-zinc-400">
                <Move size={16} className="mr-1" />
                <span>{area}</span>
              </div>
              <span className="text-xs text-zinc-500 dark:text-zinc-500 mt-1">
                Sq Ft
              </span>
            </div>
          )}
        </div>

        <div className="mt-auto pt-2">
          <Link
            href={`/properties/${slug || id}`}
            className="w-full inline-flex items-center justify-center px-4 py-2 border border-zinc-200 dark:border-zinc-700 text-sm font-medium rounded-md text-zinc-700 dark:text-zinc-200 bg-white dark:bg-zinc-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            View Details
            <ArrowRight size={16} className="ml-1.5" />
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
