"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Badge } from "@/shared/components/ui/badge";
import ResponsiveContainer from "@/shared/components/layout/ResponsiveContainer";

const featuredProperties = [
  {
    id: 1,
    title: "Modern Waterfront Villa",
    location: "Miami, Florida",
    price: "$4,500,000",
    bedrooms: 5,
    bathrooms: 6,
    area: "6,200 sq ft",
    image:
      "https://images.unsplash.com/photo-1613490493576-7fde63acd811?q=80&w=2071&auto=format",
    tag: "Featured",
  },
  {
    id: 2,
    title: "Luxury Penthouse Suite",
    location: "New York City, NY",
    price: "$8,750,000",
    bedrooms: 4,
    bathrooms: 4.5,
    area: "4,300 sq ft",
    image:
      "https://images.unsplash.com/photo-1613977257363-707ba9348227?q=80&w=2070&auto=format",
    tag: "Premium",
  },
  {
    id: 3,
    title: "Beachfront Paradise Estate",
    location: "Malibu, California",
    price: "$12,900,000",
    bedrooms: 7,
    bathrooms: 8,
    area: "9,500 sq ft",
    image:
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format",
    tag: "New",
  },
];

export default function FeaturedProperties() {
  const [hoveredProperty, setHoveredProperty] = useState(null);

  return (
    <ResponsiveContainer noPadding>
      <div className="mb-8 sm:mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-semibold text-zinc-900 dark:text-white mb-2 sm:mb-4">
              Featured Properties
            </h2>
            <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Explore our handpicked selection of premium properties, each
              representing the pinnacle of luxury and comfort.
            </p>
          </div>
          <Link href="/properties">
            <Button
              variant="outline"
              className="self-start mt-4 md:mt-0 rounded-sm border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white group flex items-center gap-2"
            >
              <span>View All Properties</span>
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
        {featuredProperties.map((property) => (
          <motion.div
            key={property.id}
            className="relative bg-white dark:bg-zinc-900 rounded-lg overflow-hidden shadow-sm hover:shadow-md dark:shadow-zinc-800/20 transition-shadow duration-300"
            onMouseEnter={() => setHoveredProperty(property.id)}
            onMouseLeave={() => setHoveredProperty(null)}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: property.id * 0.1 }}
          >
            <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
              <motion.img
                src={property.image}
                alt={property.title}
                className="w-full h-full object-cover"
                initial={{ scale: 1 }}
                animate={{
                  scale: hoveredProperty === property.id ? 1.05 : 1,
                }}
                transition={{ duration: 0.4 }}
              />
              <Badge className="absolute top-2 right-2 bg-zinc-900/80 dark:bg-white/80 text-white dark:text-zinc-900 text-xs font-medium py-1 px-2">
                {property.tag}
              </Badge>
            </div>

            <div className="p-4 sm:p-5">
              <h3 className="text-lg sm:text-xl font-medium text-zinc-900 dark:text-white mb-1">
                {property.title}
              </h3>
              <p className="text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                {property.location}
              </p>
              <p className="text-base sm:text-lg font-semibold text-zinc-900 dark:text-white mb-3">
                {property.price}
              </p>

              <div className="flex justify-between text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 border-t border-zinc-200 dark:border-zinc-800 pt-3">
                <span>{property.bedrooms} Bedrooms</span>
                <span>{property.bathrooms} Bathrooms</span>
                <span>{property.area}</span>
              </div>

              <Button
                variant="outline"
                className="w-full mt-4 rounded-sm text-xs sm:text-sm border-zinc-300 dark:border-zinc-700 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-900 dark:text-white"
              >
                View Details
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </ResponsiveContainer>
  );
}
