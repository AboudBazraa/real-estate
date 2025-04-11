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
import { Grid, List, SlidersHorizontal, Search, MapPin } from "lucide-react";
import Link from "next/link";

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

  return (
    <div
      className="flex flex-col sm:flex-row items-center justify-between border-b border-border py-2 bg-card dark:bg-slate-800 rounded-lg shadow-sm transition-colors duration-300 w-full"
      style={{ animation: "slideDown 0.3s ease-in-out forwards" }}
    >
      <div className="flex flex-wrap gap-2 w-full px-2">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 sm:px-4 py-1 rounded-xl border-r border-border"
        >
          <div
            className="bg-gradient-to-r from-blue-500 to-indigo-500 p-1 rounded-lg"
            style={{ animation: "scaleIn 0.3s ease-in-out forwards" }}
          >
            <MapPin className="h-5 w-5 text-white" />
          </div>
          <p className="text-lg font-semibold bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent hidden sm:block">
            RealEstate
          </p>
        </Link>

        <div className="relative flex-grow max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search location..."
            className="pl-9 py-1 border border-border rounded-xl text-sm w-full bg-background dark:bg-slate-900 focus-within:ring-1 focus-within:ring-blue-500 transition-all duration-200"
            value={filters.search_term || ""}
            onChange={handleLocationChange}
          />
        </div>

        <Select
          value={filters.property_type || "any"}
          onValueChange={handlePropertyTypeChange}
        >
          <SelectTrigger className="w-full sm:w-32 md:w-36 h-9 rounded-xl text-sm bg-background dark:bg-slate-900 border border-border">
            <SelectValue placeholder="Any type" />
          </SelectTrigger>
          <SelectContent className="dark:bg-slate-800">
            <SelectItem value="any">Any type</SelectItem>
            {Object.values(PropertyType).map((type) => (
              <SelectItem key={type} value={type}>
                {type.replace("_", " ")}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={filters.bedrooms?.toString() || "any"}
          onValueChange={handleBedsChange}
        >
          <SelectTrigger className="w-full sm:w-28 md:w-32 h-9 rounded-xl text-sm bg-background dark:bg-slate-900 border border-border">
            <SelectValue placeholder="Any beds" />
          </SelectTrigger>
          <SelectContent className="dark:bg-slate-800">
            <SelectItem value="any">Any beds</SelectItem>
            <SelectItem value="1">1+ Beds</SelectItem>
            <SelectItem value="2">2+ Beds</SelectItem>
            <SelectItem value="3">3+ Beds</SelectItem>
            <SelectItem value="4">4+ Beds</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2 mt-2 sm:mt-0 px-2">
        <div className="flex items-center border border-border rounded-lg overflow-hidden dark:bg-slate-900">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className={`h-8 w-8 rounded-none ${
              viewMode === "grid"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setViewMode("grid")}
          >
            <Grid className="h-4 w-4" />
            <span className="sr-only">Grid view</span>
          </Button>

          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className={`h-8 w-8 rounded-none ${
              viewMode === "list"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground"
            }`}
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
            <span className="sr-only">List view</span>
          </Button>
        </div>

        <Button
          variant={isFiltersFullOpen ? "default" : "outline"}
          size="sm"
          className={`h-8 rounded-xl text-xs px-3 transition-all duration-300 ${
            isFiltersFullOpen
              ? "bg-primary text-primary-foreground"
              : "border-border"
          }`}
          onClick={toggleFiltersFullOpen}
        >
          <SlidersHorizontal className="h-3 w-3 mr-1" />
          {isFiltersFullOpen ? "Hide Filters" : "Filters"}
        </Button>
      </div>

      <style jsx global>{`
        @keyframes slideDown {
          from {
            transform: translateY(-20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes scaleIn {
          from {
            transform: scale(0.8);
          }
          to {
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
}
