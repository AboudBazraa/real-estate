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
      [filterKey]: value,
    }));
    setPageIndex(0); // Reset to first page when filtering
  };

  const handleSortChange = (column: string, ascending: boolean) => {
    setSort({ column, ascending });
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

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setPropertyToDelete(null);
  };

  if (userLoading) {
    return <div className="container mx-auto p-6">Loading...</div>;
  }

  if (!user) {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
        <p className="mb-4">You must be logged in to view your properties.</p>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Log In
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">My Properties</h1>
        <button
          onClick={() => router.push("/agent/addNewProp")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Add New Property
        </button>
      </div>

      <div className="mb-6">
        <form onSubmit={handleSearch} className="flex gap-2">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-2 border rounded"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Search
          </button>
        </form>
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        <div>
          <select
            value={filters.property_type || ""}
            onChange={(e) =>
              handleFilterChange("property_type", e.target.value || undefined)
            }
            className="p-2 border rounded"
          >
            <option value="">All Property Types</option>
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="townhouse">Townhouse</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
            <option value="industrial">Industrial</option>
          </select>
        </div>

        <div>
          <select
            value={filters.status || ""}
            onChange={(e) =>
              handleFilterChange("status", e.target.value || undefined)
            }
            className="p-2 border rounded"
          >
            <option value="">All Status</option>
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="off_market">Off Market</option>
          </select>
        </div>

        <div>
          <select
            value={filters.listing_type || ""}
            onChange={(e) =>
              handleFilterChange("listing_type", e.target.value || undefined)
            }
            className="p-2 border rounded"
          >
            <option value="">All Listing Types</option>
            <option value="sale">For Sale</option>
            <option value="rent">For Rent</option>
            <option value="both">Sale/Rent</option>
          </select>
        </div>

        <div>
          <select
            value={`${sort.column}-${sort.ascending}`}
            onChange={(e) => {
              const [column, ascending] = e.target.value.split("-");
              handleSortChange(column, ascending === "true");
            }}
            className="p-2 border rounded"
          >
            <option value="created_at-false">Newest First</option>
            <option value="created_at-true">Oldest First</option>
            <option value="price-true">Price: Low to High</option>
            <option value="price-false">Price: High to Low</option>
            <option value="title-true">Title: A-Z</option>
            <option value="title-false">Title: Z-A</option>
          </select>
        </div>

        {(Object.keys(filters).length > 0 ||
          searchTerm ||
          sort.column !== "created_at" ||
          sort.ascending) && (
          <button
            onClick={clearFilters}
            className="px-3 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Clear Filters
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-8">Loading properties...</div>
      ) : error ? (
        <div className="text-center py-8 text-red-500">{error}</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-8">
          <p className="mb-4">You havent added any properties yet.</p>
          <button
            onClick={() => router.push("/agent/addNewProp")}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Add Your First Property
          </button>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto bg-white rounded-lg shadow">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Property
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date Added
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {properties.map((property) => (
                  <tr key={property.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-14 w-14 mr-4">
                          {property.primaryImage ? (
                            <img
                              src={property.primaryImage}
                              alt={property.title}
                              className="h-14 w-14 object-cover rounded"
                            />
                          ) : (
                            <div className="h-14 w-14 bg-gray-200 rounded flex items-center justify-center text-gray-500">
                              No img
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 truncate max-w-xs">
                            {property.title}
                          </div>
                          <div className="text-sm text-gray-500 truncate max-w-xs">
                            {property.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(property.price)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.listing_type === "rent" ? "/month" : ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {getPropertyTypeLabel(property.property_type)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {property.bedrooms} bd | {property.bathrooms} ba |{" "}
                        {property.area} sqft
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          property.status === "available"
                            ? "bg-green-100 text-green-800"
                            : property.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : property.status === "sold"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {property.status.charAt(0).toUpperCase() +
                          property.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(property.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <div className="flex space-x-2">
                        <button
                          onClick={() =>
                            router.push(`/properties/${property.id}`)
                          }
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() =>
                            router.push(`/agent/editProperty/${property.id}`)
                          }
                          className="text-blue-600 hover:text-blue-900"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteClick(property.id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing{" "}
              <span className="font-medium">{pageIndex * pageSize + 1}</span> to{" "}
              <span className="font-medium">
                {Math.min((pageIndex + 1) * pageSize, totalCount)}
              </span>{" "}
              of <span className="font-medium">{totalCount}</span> properties
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => handlePageChange(pageIndex - 1)}
                disabled={pageIndex === 0}
                className={`px-3 py-1 rounded ${
                  pageIndex === 0
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Previous
              </button>
              <button
                onClick={() => handlePageChange(pageIndex + 1)}
                disabled={(pageIndex + 1) * pageSize >= totalCount}
                className={`px-3 py-1 rounded ${
                  (pageIndex + 1) * pageSize >= totalCount
                    ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete this property? This action cannot
              be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
