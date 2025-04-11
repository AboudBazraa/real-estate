import Image from "next/image";
import { Heart, Bed, Bath, Square, MapPin } from "lucide-react";
import { useState } from "react";

interface PropertyCardProps {
  property: {
    id: string;
    image: string;
    price: number;
    address: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    neighborhood?: string;
  };
  isSelected?: boolean;
}

export default function CardProperty({
  property,
  isSelected = false,
}: PropertyCardProps) {
  const [isFavorite, setIsFavorite] = useState(false);

  const toggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click event
    setIsFavorite(!isFavorite);
  };

  // Format price with commas for thousands
  const formatPrice = (price: number) => {
    return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div
      className={`rounded-lg overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow transition-all duration-300 mb-3 ${
        isSelected ? "ring-1 ring-black" : ""
      }`}
    >
      <div className="relative h-48 w-full">
        <Image
          src={property.image}
          alt={property.address}
          fill
          className="object-cover"
        />
        <button
          className={`absolute top-3 right-3 p-1.5 rounded-full ${
            isFavorite
              ? "bg-rose-500 text-white"
              : "bg-white text-gray-600 hover:bg-white/90"
          } transition-all duration-200 shadow-sm z-10`}
          onClick={toggleFavorite}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
        >
          <Heart
            className={`h-5 w-5 ${
              isFavorite ? "fill-white" : "fill-transparent"
            }`}
          />
        </button>
      </div>
      <div className="p-3">
        <div className="flex items-center justify-between mb-1">
          <div className="font-bold text-xl text-gray-900">
            ${formatPrice(property.price)}
          </div>
          {property.id === "7" && (
            <div className="text-sm text-gray-500">
              From ${formatPrice(property.price - 20000)}
            </div>
          )}
        </div>

        <h3 className="font-semibold text-gray-800 text-base mb-1">
          {property.address}
        </h3>

        {property.neighborhood && (
          <div className="flex items-center mb-2 text-gray-500 text-sm">
            <MapPin className="h-3.5 w-3.5 mr-1 flex-shrink-0" />
            <span className="line-clamp-1">{property.neighborhood}</span>
          </div>
        )}

        <div className="flex items-center gap-4 text-gray-500 text-sm mt-2">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms} bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms} bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{property.area} sqft</span>
          </div>
        </div>
      </div>
    </div>
  );
}
