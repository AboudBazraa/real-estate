"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Skeleton } from "./ui/skeleton";

/**
 * OptimizedImage - A component for optimized image loading with blur-up effect
 *
 * @param {Object} props
 * @param {string} props.src - Image source URL
 * @param {string} props.alt - Alt text for the image
 * @param {number} props.width - Width of the image (optional if using fill)
 * @param {number} props.height - Height of the image (optional if using fill)
 * @param {boolean} props.fill - Whether to fill the container (default: false)
 * @param {string} props.sizes - Responsive size attribute (required if using fill)
 * @param {string} props.className - Additional classes for the image
 * @param {boolean} props.priority - Whether to prioritize loading this image
 * @param {string} props.quality - Image quality (1-100, default: 75)
 * @param {boolean} props.showSkeleton - Whether to show a skeleton while loading (default: true)
 * @param {('cover'|'contain'|'fill')} props.objectFit - Object-fit property (default: 'cover')
 */
export default function OptimizedImage({
  src,
  alt,
  width,
  height,
  fill = false,
  sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
  className = "",
  priority = false,
  quality = 75,
  showSkeleton = true,
  objectFit = "cover",
  ...props
}) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [imageSrc, setImageSrc] = useState(src);

  // Reset loading state when src changes
  useEffect(() => {
    setIsLoading(true);
    setError(false);
    setImageSrc(src);
  }, [src]);

  // Handle missing or empty src
  const finalSrc = imageSrc || "/placeholder-image.jpg";

  // Default placeholder for loading state
  const shimmerEffect = `
    <svg width="100%" height="100%" viewBox="0 0 ${width || 400} ${
    height || 300
  }" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="shimmer" x1="0" x2="100%" y1="0" y2="0">
          <stop offset="0%" stop-color="#f6f7f8">
            <animate attributeName="offset" values="-2; 1" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="50%" stop-color="#edeef1">
            <animate attributeName="offset" values="-1.5; 1.5" dur="2s" repeatCount="indefinite" />
          </stop>
          <stop offset="100%" stop-color="#f6f7f8">
            <animate attributeName="offset" values="-1; 2" dur="2s" repeatCount="indefinite" />
          </stop>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#shimmer)" />
    </svg>
  `;

  const toBase64 = (str) =>
    typeof window === "undefined"
      ? Buffer.from(str).toString("base64")
      : window.btoa(str);

  const blurDataURL = `data:image/svg+xml;base64,${toBase64(shimmerEffect)}`;

  return (
    <div
      className={`relative ${fill ? "h-full w-full" : ""} overflow-hidden`}
      style={{
        aspectRatio:
          !fill && width && height ? `${width}/${height}` : undefined,
      }}
    >
      {showSkeleton && isLoading && (
        <Skeleton
          className={`absolute inset-0 ${className}`}
          style={{
            zIndex: 0,
            borderRadius: "inherit",
          }}
        />
      )}

      <Image
        src={finalSrc}
        alt={alt}
        width={!fill ? width : undefined}
        height={!fill ? height : undefined}
        sizes={fill ? sizes : undefined}
        quality={quality}
        priority={priority}
        fill={fill}
        placeholder="blur"
        blurDataURL={blurDataURL}
        className={`transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        } ${className}`}
        style={{
          objectFit,
          objectPosition: "center",
          borderRadius: "inherit",
        }}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => {
          setIsLoading(false);
          setError(true);
          setImageSrc("/placeholder-error.jpg");
        }}
        {...props}
      />

      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 text-zinc-500 dark:text-zinc-400 text-sm font-medium">
          Failed to load image
        </div>
      )}
    </div>
  );
}
