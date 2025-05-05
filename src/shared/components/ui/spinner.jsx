import React from "react";
import { cn } from "@/shared/lib/utils";

const sizeClasses = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-3",
  lg: "h-12 w-12 border-4",
};

export default function Spinner({ size = "md", className }) {
  return (
    <div className="flex items-center justify-center">
      <div
        className={cn(
          "animate-spin rounded-full border-solid border-zinc-300 dark:border-zinc-700 border-t-zinc-900 dark:border-t-zinc-200",
          sizeClasses[size],
          className
        )}
      />
    </div>
  );
}
