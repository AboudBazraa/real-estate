"use client";

import type React from "react";
import { type PropertyFilters } from "@/shared/hooks/useProperties";
import { PropertyType } from "@/shared/types/property";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { SlidersHorizontal, Search, Grid, List } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/shared/lib/utils";

interface FiltersBarProps {
  filters: PropertyFilters;
  setFilters: (filters: PropertyFilters) => void;
  viewMode: "grid" | "list";
  setViewMode: (mode: "grid" | "list") => void;
  isFiltersFullOpen: boolean;
  toggleFiltersFullOpen: () => void;
}

export default function FiltersBar({
  filters,
  setFilters,
  viewMode,
  setViewMode,
  isFiltersFullOpen,
  toggleFiltersFullOpen,
}: FiltersBarProps) {
  const handleLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, search_term: e.target.value });
  };

  const handlePropertyTypeChange = (value: string) => {
    // Only update if the value is actually different
    if (value !== (filters.property_type || "")) {
      setFilters({
        ...filters,
        property_type: value && value !== "any" ? value : undefined,
      });
    }
  };

  const handleBedsChange = (value: string) => {
    // Only update if the value is actually different
    const currentBeds = filters.bedrooms?.toString() || "";
    if (value !== currentBeds) {
      setFilters({
        ...filters,
        bedrooms: value && value !== "any" ? Number(value) : undefined,
      });
    }
  };

  const activeFiltersCount = Object.keys(filters).filter(
    (key) => filters[key as keyof PropertyFilters] !== undefined
  ).length;

  return (
    <div className="flex items-center justify-between w-full gap-4">
      <div className="flex-1 relative max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          type="text"
          placeholder="Search location..."
          className="pl-9 h-10 rounded-md bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
          value={filters.search_term || ""}
          onChange={handleLocationChange}
        />
      </div>

      <div className="flex items-center gap-3">
        {/* View Toggle */}
        <div className="bg-gray-100 dark:bg-slate-700 rounded-md flex items-center shadow-sm border border-gray-200 dark:border-gray-600">
          <motion.button
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center justify-center h-8 w-10 rounded transition-all duration-200",
              viewMode === "grid"
                ? "bg-white dark:bg-slate-800 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
            onClick={() => setViewMode("grid")}
            aria-label="Grid view"
          >
            <Grid className="h-4 w-4" />
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className={cn(
              "flex items-center justify-center h-8 w-10 rounded transition-all duration-200",
              viewMode === "list"
                ? "bg-white dark:bg-slate-800 shadow-sm"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            )}
            onClick={() => setViewMode("list")}
            aria-label="List view"
          >
            <List className="h-4 w-4" />
          </motion.button>
        </div>

        {/* Filter Button */}
        <motion.div whileHover={{ y: -2 }} whileTap={{ scale: 0.97 }}>
          <Button
            variant="outline"
            className={cn(
              "rounded-md border border-gray-200 dark:border-gray-700 flex items-center gap-1.5 transition-all duration-200",
              isFiltersFullOpen
                ? "bg-gray-100 dark:bg-gray-800"
                : "bg-white hover:bg-white hover:border-gray-300 dark:bg-slate-800 dark:hover:border-gray-600"
            )}
            onClick={toggleFiltersFullOpen}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filter
            {activeFiltersCount > 0 && (
              <motion.span
                className="ml-1 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 rounded-full w-5 h-5 flex items-center justify-center text-xs"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 20 }}
              >
                {activeFiltersCount}
              </motion.span>
            )}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
