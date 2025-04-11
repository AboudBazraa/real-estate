"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/shared/hooks/use-toast";
import { useUser } from "@/shared/providers/UserProvider";
import { useProperties } from "@/shared/hooks/useProperties";
import {
  Property,
  PropertyFilters,
  PropertySort,
} from "@/shared/types/property";
import {
  formatCurrency,
  formatDate,
  getPropertyTypeLabel,
} from "@/shared/utils/property-utils";
import { DeleteConfirmationModal } from "../components/DeleteConfirmationModal";
import { PropertyCard } from "../components/PropertyCard";
import { PropertyDetailsModal } from "../components/PropertyDetailsModal";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import {
  Bed,
  Bath,
  Building,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Edit,
  Eye,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/shared/components/ui/dropdown-menu";
import { cn } from "@/shared/lib/utils";
import { PropertyEditForm } from "../components/PropertyEditForm";

export default function AgentProperties() {
  const { toast } = useToast();
  const router = useRouter();
  const { user, isLoading: userLoading } = useUser();
  const {
    properties,
    loading,
    error,
    totalCount,
    fetchProperties,
    deleteProperty,
  } = useProperties();

  const [pageIndex, setPageIndex] = useState(0);
  const pageSize = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(
    null
  );
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<PropertyFilters>({});
  const [sort, setSort] = useState<PropertySort>({
    column: "created_at",
    ascending: false,
  });

  // Fetch user's properties
  useEffect(() => {
    if (user) {
      const activeFilters: PropertyFilters = {
        ...filters,
      };

      if (searchTerm) {
        activeFilters.search_term = searchTerm;
      }

      fetchProperties(
        pageIndex,
        pageSize,
        Object.keys(activeFilters).length > 0 ? activeFilters : undefined,
        sort,
        true // Only fetch user's properties
      );
    }
  }, [user, pageIndex, searchTerm, filters, sort, fetchProperties]);

  const handlePageChange = (newPage: number) => {
    setPageIndex(newPage);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Reset to first page when searching
    setPageIndex(0);
  };

  const handleFilterChange = (filterKey: keyof PropertyFilters, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [filterKey]: value || undefined,
    }));
    setPageIndex(0); // Reset to first page when filtering
  };

  const handleSortChange = (value: string) => {
    const [column, ascending] = value.split("-");
    setSort({ column, ascending: ascending === "true" });
    setPageIndex(0); // Reset to first page when sorting
  };

  const clearFilters = () => {
    setFilters({});
    setSearchTerm("");
    setSort({ column: "created_at", ascending: false });
    setPageIndex(0);
  };

  const handleDeleteClick = (propertyId: string) => {
    setPropertyToDelete(propertyId);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (!propertyToDelete) return;

    const success = await deleteProperty(propertyToDelete);

    if (success) {
      toast({
        title: "Property Deleted",
        description: "The property has been successfully deleted",
      });
    }

    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  const handleViewProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowDetailsModal(true);
  };

  const handleEditProperty = (property: Property) => {
    setSelectedProperty(property);
    setShowEditModal(true);
  };

  // Dummy function to fix the onToggleFavorite prop requirement
  const handleToggleFavorite = () => {
    // This function is required by the PropertyCard component but not actually used in this view
    console.log("Favorite toggled - not implemented in agent view");
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "ACTIVE":
        return "default";
      case "PENDING":
        return "secondary";
      case "SOLD":
        return "outline";
      case "RENTED":
        return "outline";
      case "INACTIVE":
        return "destructive";
      default:
        return "destructive";
    }
  };

  if (userLoading) {
    return (
      <div className="container mx-auto p-6 flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
          <p className="text-muted-foreground font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto p-8 flex flex-col items-center justify-center min-h-[60vh]">
        <div className="w-full max-w-md p-8 space-y-6 bg-background rounded-xl border shadow-sm">
          <div className="text-center space-y-2">
            <div className="mx-auto w-fit p-3 rounded-full bg-muted mb-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-muted-foreground h-6 w-6"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M19 8v6" />
                <path d="M22 11h-6" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold mb-2">Sign In Required</h1>
            <p className="text-muted-foreground">
              You need to be logged in to view and manage your properties.
            </p>
          </div>
          <Button
            onClick={() => router.push("/login")}
            className="w-full shadow-sm"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-2 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h1 className="text-3xl font-bold tracking-tight">My Properties</h1>
        <Button
          onClick={() => router.push("/agent/addNewProp")}
          className="flex items-center gap-2 shadow-sm"
        >
          <Plus className="h-4 w-4" /> Add New Property
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] gap-4 mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search properties..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-10 bg-background border-muted"
            />
          </div>
          <Button type="submit" size="default" className="shadow-sm">
            Search
          </Button>
        </form>

        <Select
          value={`${sort.column}-${sort.ascending}`}
          onValueChange={handleSortChange}
        >
          <SelectTrigger className="h-10 bg-background border-muted">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at-false">Newest First</SelectItem>
            <SelectItem value="created_at-true">Oldest First</SelectItem>
            <SelectItem value="price-true">Price: Low to High</SelectItem>
            <SelectItem value="price-false">Price: High to Low</SelectItem>
            <SelectItem value="title-true">Title: A-Z</SelectItem>
            <SelectItem value="title-false">Title: Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex flex-wrap gap-2 mb-8">
        <Select
          value={filters.property_type || "all_types"}
          onValueChange={(value) =>
            handleFilterChange(
              "property_type",
              value === "all_types" ? "" : value
            )
          }
        >
          <SelectTrigger className="w-[180px] h-9 bg-background border-muted">
            <SelectValue placeholder="Property Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_types">All Property Types</SelectItem>
            <SelectItem value="house">House</SelectItem>
            <SelectItem value="apartment">Apartment</SelectItem>
            <SelectItem value="condo">Condo</SelectItem>
            <SelectItem value="townhouse">Townhouse</SelectItem>
            <SelectItem value="land">Land</SelectItem>
            <SelectItem value="commercial">Commercial</SelectItem>
            <SelectItem value="industrial">Industrial</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.status || "all_status"}
          onValueChange={(value) =>
            handleFilterChange("status", value === "all_status" ? "" : value)
          }
        >
          <SelectTrigger className="w-[180px] h-9 bg-background border-muted">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_status">All Status</SelectItem>
            <SelectItem value="available">Available</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="sold">Sold</SelectItem>
            <SelectItem value="off_market">Off Market</SelectItem>
          </SelectContent>
        </Select>

        <Select
          value={filters.listing_type || "all_listing_types"}
          onValueChange={(value) =>
            handleFilterChange(
              "listing_type",
              value === "all_listing_types" ? "" : value
            )
          }
        >
          <SelectTrigger className="w-[180px] h-9 bg-background border-muted">
            <SelectValue placeholder="Listing Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all_listing_types">All Listing Types</SelectItem>
            <SelectItem value="sale">For Sale</SelectItem>
            <SelectItem value="rent">For Rent</SelectItem>
            <SelectItem value="both">Sale/Rent</SelectItem>
          </SelectContent>
        </Select>

        {(Object.keys(filters).length > 0 ||
          searchTerm ||
          sort.column !== "created_at" ||
          sort.ascending) && (
          <Button
            variant="outline"
            onClick={clearFilters}
            size="sm"
            className="h-9"
          >
            Clear Filters
          </Button>
        )}
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-16 rounded-xl border border-dashed bg-muted/20">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary"></div>
            <p className="text-muted-foreground font-medium">
              Loading your properties...
            </p>
          </div>
        </div>
      ) : error ? (
        <div className="text-center py-10 rounded-xl border border-destructive/20 bg-destructive/5">
          <div className="mx-auto w-fit p-3 rounded-full bg-destructive/10 mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-destructive h-6 w-6"
            >
              <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
              <path d="M12 9v4" />
              <path d="M12 17h.01" />
            </svg>
          </div>
          <p className="text-lg font-medium text-destructive mb-2">
            Error Loading Properties
          </p>
          <p className="text-muted-foreground max-w-md mx-auto">{error}</p>
        </div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 rounded-xl border border-dashed bg-muted/20">
          <div className="mx-auto w-fit p-4 rounded-full bg-muted mb-4">
            <Building className="h-8 w-8 text-muted-foreground" />
          </div>
          <p className="text-xl font-medium mb-2">No properties found</p>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">
            You haven&apos;t added any properties to your portfolio yet. Get
            started by adding your first property.
          </p>
          <Button
            onClick={() => router.push("/agent/addNewProp")}
            className="px-6 py-2 shadow-sm"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Your First Property
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="hidden md:block overflow-hidden rounded-xl border shadow-sm">
            <Table className="w-full ">
              <TableHeader className="bg-muted/50">
                <TableRow>
                  <TableHead className="text-left font-medium text-muted-foreground">
                    Property
                  </TableHead>
                  <TableHead className="text-left font-medium text-muted-foreground">
                    Price
                  </TableHead>
                  <TableHead className="text-left font-medium text-muted-foreground">
                    Details
                  </TableHead>
                  <TableHead className="text-left font-medium text-muted-foreground">
                    Status
                  </TableHead>
                  <TableHead className="text-left font-medium text-muted-foreground">
                    Date Added
                  </TableHead>
                  <TableHead className="text-left font-medium text-muted-foreground">
                    Verification
                  </TableHead>
                  <TableHead className="text-right font-medium text-muted-foreground w-[100px]">
                    Actions
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.map((property) => (
                  <TableRow
                    key={property.id}
                    className="group border-b transition-colors hover:bg-muted/30 data-[state=selected]:bg-muted"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-14 w-14 rounded-md overflow-hidden bg-muted flex-shrink-0 transition-transform ">
                          {property.primaryImage ? (
                            <img
                              src={property.primaryImage}
                              alt={property.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <div className="h-full w-full bg-muted flex items-center justify-center text-muted-foreground text-xs">
                              No image
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium truncate max-w-[200px] group-hover:text-primary transition-colors">
                            {property.title}
                          </div>
                          <div className="text-sm text-muted-foreground truncate max-w-[200px]">
                            {property.location}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">
                        {formatCurrency(property.price)}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {property.listing_type === "rent" ? "/month" : ""}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {getPropertyTypeLabel(property.property_type)}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-3 mt-1.5">
                        <span className="flex items-center gap-1">
                          <Bed className="h-3.5 w-3.5" /> {property.bedrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Bath className="h-3.5 w-3.5" /> {property.bathrooms}
                        </span>
                        <span className="flex items-center gap-1">
                          <Building className="h-3.5 w-3.5" /> {property.area}{" "}
                          sqft
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={getStatusBadgeVariant(property.status)}
                        className="capitalize px-2 text-xs font-medium"
                      >
                        {property.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {formatDate(property.created_at)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          property.featured === true
                            ? "secondary"
                            : "destructive"
                        }
                        className="capitalize px-1 text-xs font-medium"
                      >
                        {property.featured ? "Verified" : "Not Verified"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Open menu</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[160px]">
                          <DropdownMenuItem
                            onClick={() => handleViewProperty(property)}
                            className="cursor-pointer flex items-center"
                          >
                            <Eye className="mr-2 h-4 w-4" /> View
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEditProperty(property)}
                            className="cursor-pointer flex items-center"
                          >
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-destructive focus:text-destructive cursor-pointer flex items-center"
                            onClick={() => handleDeleteClick(property.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" /> Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Mobile property cards */}
          <div className="md:hidden space-y-4">
            {properties.map((property) => (
              <div
                key={property.id}
                className="bg-background border rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <PropertyCard
                  property={property}
                  onView={() => handleViewProperty(property)}
                  onEdit={() => handleEditProperty(property)}
                  onDelete={() => handleDeleteClick(property.id)}
                  onToggleFavorite={handleToggleFavorite}
                  variant="compact"
                  showStatus={true}
                />
              </div>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 border-t pt-6">
            <div className="text-sm text-muted-foreground">
              Showing{" "}
              <span className="font-medium">{pageIndex * pageSize + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min((pageIndex + 1) * pageSize, totalCount)}
              </span>{" "}
              of <span className="font-medium">{totalCount}</span> properties
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pageIndex - 1)}
                disabled={pageIndex === 0}
                className="h-9 px-4"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(pageIndex + 1)}
                disabled={(pageIndex + 1) * pageSize >= totalCount}
                className="h-9 px-4"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={confirmDelete}
        title="Delete Property"
        description="Are you sure you want to delete this property? This action cannot be undone."
      />

      {/* Property Details Modal */}
      {selectedProperty && (
        <PropertyDetailsModal
          propertyId={selectedProperty.id}
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
      {selectedProperty && (
        <PropertyEditForm
          propertyId={selectedProperty.id}
          isOpen={showEditModal}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </div>
  );
}
