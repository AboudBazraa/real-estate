"use client";

import { Button } from "@/shared/components/ui/button";
import { PropertyCard } from "@/app/(dashboard)/agent/components/propertyCard";
import { SidebarTrigger } from "@/shared/components/ui/sidebar";
import { Input } from "@/shared/components/ui/input";
import Link from "next/link";
import { useState, useEffect } from "react";
import {
  useSupabaseList,
  useSupabaseDelete,
  useSupabaseSubscription,
} from "@/shared/hooks/useSupabase";
import { useToast } from "@/shared/hooks/use-toast";
import { useSearchParams, useRouter } from "next/navigation";
import { Loader2, Plus, Search, SlidersHorizontal } from "lucide-react";
import { useUser } from "@/app/providers/UserProvider";
import { Badge } from "@/shared/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

export default function PropertiesPage() {
  const { toast } = useToast();
  const { user } = useUser();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const searchParams = useSearchParams();
  const filterType = searchParams.get("type");
  const filterStatus = searchParams.get("status");
  const sortBy = searchParams.get("sort") || "created_at";
  const sortOrder = searchParams.get("order") || "desc";
  const featured = searchParams.get("featured") === "true";

  // Fetch properties with Supabase
  const {
    data: properties,
    isLoading,
    isError,
    refetch,
  } = useSupabaseList("properties", {
    filters: searchTerm
      ? [{ column: "title", operator: "ilike", value: `%${searchTerm}%` }]
      : undefined,
    eq: [
      ...(user?.id ? [{ column: "agent_id", value: user.id }] : []),
      ...(filterType ? [{ column: "property_type", value: filterType }] : []),
      ...(filterStatus ? [{ column: "status", value: filterStatus }] : []),
      ...(featured ? [{ column: "featured", value: true }] : []),
    ],
    order: { column: sortBy, ascending: sortOrder === "asc" },
  });

  // Setup delete mutation
  const deleteProperty = useSupabaseDelete("properties", {
    invalidateQueries: [["properties"]],
  });

  // Handle property deletion
  const handleDeleteProperty = async (propertyId) => {
    try {
      await deleteProperty.mutateAsync({ id: propertyId });
      toast({
        title: "Success",
        description: "Property deleted successfully.",
      });
    } catch (error) {
      console.error("Error deleting property:", error);
      toast({
        title: "Error",
        description: "Failed to delete property.",
        variant: "destructive",
      });
    }
  };

  // Setup real-time subscription for property changes
  useSupabaseSubscription("properties", { event: "*" }, (payload) => {
    refetch();
  });

  // Apply additional filtering if needed
  const filteredProperties =
    properties?.filter((property) => {
      if (searchTerm) {
        return (
          property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          property.description
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          property.location?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    }) || [];

  const handleSortChange = (value) => {
    const [sort, order] = value.split("-");
    const params = new URLSearchParams(searchParams);
    params.set("sort", sort);
    params.set("order", order);
    router.push(`?${params.toString()}`);
  };

  const applyFilter = (param, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) {
      params.set(param, value);
    } else {
      params.delete(param);
    }
    router.push(`?${params.toString()}`);
  };

  const clearFilters = () => {
    router.push("");
  };

  if (isError) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-2">
            Failed to load properties
          </p>
          <Button variant="outline" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  const hasActiveFilters = filterType || filterStatus || featured;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <h1 className="text-2xl font-bold tracking-tight">My Properties</h1>
          {filteredProperties.length > 0 && (
            <Badge variant="outline" className="ml-2">
              {filteredProperties.length}{" "}
              {filteredProperties.length === 1 ? "property" : "properties"}
            </Badge>
          )}
        </div>
        <Button asChild>
          <Link href="/agent/addNewProp">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
            placeholder="Search by title, description or location..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2 items-center">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-1"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <Badge
                    variant="secondary"
                    className="ml-1 h-5 w-5 p-0 flex items-center justify-center rounded-full"
                  >
                    !
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Filter Properties</DropdownMenuLabel>
              <DropdownMenuSeparator />

              <div className="p-2">
                <label className="text-xs font-medium mb-1 block">
                  Property Type
                </label>
                <Select
                  value={filterType || ""}
                  onValueChange={(value) => applyFilter("type", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Types</SelectItem>
                    <SelectItem value="1">House</SelectItem>
                    <SelectItem value="2">Apartment</SelectItem>
                    <SelectItem value="3">Condo</SelectItem>
                    <SelectItem value="4">Townhouse</SelectItem>
                    <SelectItem value="5">Villa</SelectItem>
                    <SelectItem value="6">Commercial</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-2">
                <label className="text-xs font-medium mb-1 block">Status</label>
                <Select
                  value={filterStatus || ""}
                  onValueChange={(value) => applyFilter("status", value)}
                >
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="All Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All Status</SelectItem>
                    <SelectItem value="for-sale">Available</SelectItem>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="sold">Sold</SelectItem>
                    <SelectItem value="rented">Rented</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="p-2 flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="featured-filter"
                  checked={featured}
                  onChange={(e) =>
                    applyFilter("featured", e.target.checked ? "true" : "")
                  }
                  className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <label htmlFor="featured-filter" className="text-sm">
                  Featured Properties Only
                </label>
              </div>

              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="justify-center font-medium"
              >
                Clear All Filters
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Select
            value={`${sortBy}-${sortOrder}`}
            onValueChange={handleSortChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="created_at-desc">Newest First</SelectItem>
              <SelectItem value="created_at-asc">Oldest First</SelectItem>
              <SelectItem value="price-desc">Price (High to Low)</SelectItem>
              <SelectItem value="price-asc">Price (Low to High)</SelectItem>
              <SelectItem value="title-asc">Title (A-Z)</SelectItem>
              <SelectItem value="title-desc">Title (Z-A)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filterType && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Type:{" "}
              {filterType === "1"
                ? "House"
                : filterType === "2"
                ? "Apartment"
                : filterType === "3"
                ? "Condo"
                : filterType === "4"
                ? "Townhouse"
                : filterType === "5"
                ? "Villa"
                : filterType === "6"
                ? "Commercial"
                : filterType}
              <button
                onClick={() => applyFilter("type", "")}
                className="ml-1 hover:bg-muted rounded-full"
              >
                ×
              </button>
            </Badge>
          )}
          {filterStatus && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Status:{" "}
              {filterStatus === "for-sale"
                ? "Available"
                : filterStatus === "pending"
                ? "Pending"
                : filterStatus === "sold"
                ? "Sold"
                : filterStatus === "rented"
                ? "Rented"
                : filterStatus}
              <button
                onClick={() => applyFilter("status", "")}
                className="ml-1 hover:bg-muted rounded-full"
              >
                ×
              </button>
            </Badge>
          )}
          {featured && (
            <Badge variant="secondary" className="flex gap-1 items-center">
              Featured Only
              <button
                onClick={() => applyFilter("featured", "")}
                className="ml-1 hover:bg-muted rounded-full"
              >
                ×
              </button>
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-xs"
          >
            Clear All
          </Button>
        </div>
      )}

        {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
        ) : (
        <>
          {filteredProperties.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 w-full">
            {filteredProperties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  onDelete={handleDeleteProperty}
                />
              ))}
            </div>
          ) : (
            <div className="text-center p-12 border rounded-lg bg-background">
              <div className="mb-3 text-4xl">🏠</div>
              <h3 className="text-lg font-medium mb-2">No properties found</h3>
              <p className="text-muted-foreground mb-4">
                {searchTerm || hasActiveFilters
                  ? "Try changing your search or filter criteria"
                  : "Start by adding your first property"}
              </p>
              <Button asChild>
                <Link href="/agent/addNewProp">Add New Property</Link>
              </Button>
          </div>
        )}
        </>
      )}
    </div>
  );
}
