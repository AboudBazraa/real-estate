"use client";

import { Skeleton } from "@/shared/components/ui/skeleton";

export default function AgentPropertiesLoading() {
  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Skeleton className="h-8 w-[200px]" />
        <Skeleton className="h-10 w-[160px]" />
      </div>

      {/* Search and Filter Skeletons */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="col-span-1 sm:col-span-2">
          <Skeleton className="h-10 w-full" />
        </div>
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>

      {/* Property Card Skeletons */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, index) => (
            <div
              key={index}
              className="h-[340px] bg-muted rounded-lg animate-pulse"
            />
          ))}
      </div>
    </div>
  );
}
