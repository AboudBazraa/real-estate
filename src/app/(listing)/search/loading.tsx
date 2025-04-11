"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="w-full mx-auto px-2 sm:px-5 flex flex-col opacity-0 animate-[fadeIn_0.5s_ease-in-out_forwards]">
      {/* Filter bar skeleton */}
      <div className="py-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap gap-2">
            <Skeleton className="h-9 w-24 sm:w-40 rounded-xl" />
            <Skeleton className="h-9 w-28 sm:w-32 rounded-xl" />
            <Skeleton className="h-9 w-24 sm:w-28 rounded-xl" />
          </div>
          <div className="flex space-x-2">
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-8 rounded-lg" />
            <Skeleton className="h-8 w-20 rounded-xl" />
          </div>
        </div>
      </div>

      {/* Main content skeleton */}
      <div className="flex flex-col lg:flex-row justify-between mt-4 gap-4">
        {/* Filters panel - only visible on larger screens */}
        <div className="hidden lg:block lg:w-3/12">
          <Skeleton className="h-[calc(100vh-8rem)] w-full rounded-lg" />
        </div>

        {/* Map skeleton */}
        <div className="flex-1">
          <Skeleton className="h-[calc(100vh-8rem)] rounded-lg" />
        </div>

        {/* Listings skeleton */}
        <div className="w-full lg:w-4/12 space-y-4">
          <Skeleton className="h-8 w-40 mb-4" />

          {/* Property cards skeletons */}
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-lg overflow-hidden"
              style={{
                animation: `fadeIn 0.5s ease-in-out forwards ${i * 0.1}s`,
                opacity: 0,
              }}
            >
              <Skeleton className="h-48 w-full rounded-lg mb-2" />
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-1" />
              <Skeleton className="h-4 w-2/3 mb-1" />
              <div className="flex justify-between mt-2">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
