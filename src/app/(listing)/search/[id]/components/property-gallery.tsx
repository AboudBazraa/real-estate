import { useState, useEffect } from "react";
import Image from "next/image";
import { PropertyImage } from "@/shared/types/property";
import { ChevronLeft, ChevronRight, Maximize, X } from "lucide-react";

interface PropertyGalleryProps {
  images: PropertyImage[];
}

export default function PropertyGallery({ images }: PropertyGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lightboxLoading, setLightboxLoading] = useState(true);

  useEffect(() => {
    // Reset loading state when selected image changes
    setIsLoading(true);
    if (lightboxOpen) {
      setLightboxLoading(true);
    }
  }, [selectedImage, lightboxOpen]);

  if (!images || images.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden aspect-video flex items-center justify-center">
        <div className="text-gray-500">No images available</div>
      </div>
    );
  }

  const goToPrevious = () => {
    setSelectedImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setSelectedImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (lightboxOpen) {
      if (e.key === "ArrowLeft") goToPrevious();
      else if (e.key === "ArrowRight") goToNext();
      else if (e.key === "Escape") setLightboxOpen(false);
    }
  };

  return (
    <>
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative aspect-[16/9] w-full group">
          <div
            className={`absolute inset-0 bg-gray-100 animate-pulse ${
              isLoading ? "block" : "hidden"
            }`}
          />
          <Image
            src={images[selectedImage].image_url}
            alt={`Property view ${selectedImage + 1}`}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            className="object-cover transition-opacity duration-300"
            priority
            onLoad={() => setIsLoading(false)}
            style={{ opacity: isLoading ? 0 : 1 }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

          {/* Image navigation arrows */}
          <button
            onClick={goToPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-md"
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            onClick={goToNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-md"
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>

          {/* Fullscreen button */}
          <button
            onClick={() => setLightboxOpen(true)}
            className="absolute right-4 top-4 bg-white/90 text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white shadow-md"
            aria-label="View fullscreen"
          >
            <Maximize size={20} />
          </button>

          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-sm font-medium shadow-md">
            {selectedImage + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex overflow-x-auto gap-2 p-4 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {images.map((image, index) => (
              <button
                key={image.id}
                onClick={() => setSelectedImage(index)}
                className={`relative flex-shrink-0 w-20 h-20 rounded-md overflow-hidden transition transform ${
                  selectedImage === index
                    ? "ring-2 ring-cyan-600 scale-105"
                    : "opacity-70 hover:opacity-100 hover:scale-105"
                }`}
              >
                <Image
                  src={image.image_url}
                  alt={`Property view ${index + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox */}
      {lightboxOpen && (
        <div
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center backdrop-blur-sm"
          onClick={() => setLightboxOpen(false)}
          onKeyDown={handleKeyDown}
          tabIndex={0}
        >
          <button
            className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              setLightboxOpen(false);
            }}
          >
            <X size={24} />
          </button>

          <div className="relative w-full max-w-6xl max-h-[90vh] p-4">
            <div className="relative h-[80vh]">
              {lightboxLoading && (
                <div className="absolute inset-0 bg-gray-800 animate-pulse rounded-lg" />
              )}
              <Image
                src={images[selectedImage].image_url}
                alt={`Property view ${selectedImage + 1}`}
                fill
                sizes="(max-width: 1200px) 90vw, 1200px"
                className="object-contain"
                quality={90}
                onClick={(e) => e.stopPropagation()}
                onLoad={() => setLightboxLoading(false)}
              />
            </div>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToPrevious();
              }}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goToNext();
              }}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/10 hover:bg-white/20 text-white p-3 rounded-full transition-colors"
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 bg-white/20 text-white px-4 py-2 rounded-full backdrop-blur-sm">
              {selectedImage + 1} / {images.length}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
