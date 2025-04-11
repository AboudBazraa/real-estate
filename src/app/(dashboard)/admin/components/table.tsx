"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Button } from "@/shared/components/ui/button";
import { useToast } from "@/shared/hooks/use-toast";
import { CalendarClock, TrendingUp, DollarSign } from "lucide-react";
import { Card } from "@/shared/components/ui/card";
import { motion } from "framer-motion";
import { useProperties } from "@/shared/hooks/useProperties";

const ITEMS_PER_PAGE = 7;

export function TableDemo() {
  const { fetchProperties, properties, loading } = useProperties();
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPrice, setTotalPrice] = useState(0);
  const [lastAddedProperty, setLastAddedProperty] = useState<any>(null);
  const { toast } = useToast();

  // Fetch properties when component mounts
  useEffect(() => {
    const loadProperties = async () => {
      try {
        await fetchProperties(0, 20);
      } catch (error) {
        console.error("Failed to load properties:", error);
      }
    };
    loadProperties();
  }, [fetchProperties]);

  // Process properties when they're loaded
  useEffect(() => {
    if (properties && properties.length > 0) {
      // Sort properties by date (assuming there's a created_at field)
      const sortedProperties = [...properties].sort((a, b) => {
        const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
        const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
        return dateB - dateA; // Descending order (newest first)
      });

      // Get the most recently added property
      const latest = sortedProperties[0];
      setLastAddedProperty(latest);

      // Calculate total price of all properties
      const total = properties.reduce((sum, property) => {
        return sum + (property.price || 0);
      }, 0);
      setTotalPrice(total);
    }
  }, [properties]);

  const handleNextPage = () => {
    if ((currentPage + 1) * ITEMS_PER_PAGE < properties.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 0) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const startIndex = currentPage * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentProperties = properties?.slice(startIndex, endIndex) || [];

  // Format date
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Last Added Property Card */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="p-6 shadow-md h-full border-l-4 border-l-blue-500">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-muted-foreground mb-1">
                    Latest Added Property
                  </h3>
                  {lastAddedProperty ? (
                    <div className="space-y-2">
                      <p className="text-xl font-bold">
                        {lastAddedProperty.title || "Untitled Property"}
                      </p>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <CalendarClock className="h-4 w-4 mr-2" />
                        <span>
                          {formatDate(
                            lastAddedProperty.created_at ||
                              new Date().toISOString()
                          )}
                        </span>
                      </div>
                      <p className="text-primary font-semibold">
                        ${lastAddedProperty.price?.toLocaleString() || "0"}
                      </p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground">
                      No properties available
                    </p>
                  )}
                </div>
                <div className="bg-blue-50 p-3 rounded-full">
                  <DollarSign className="h-6 w-6 text-blue-500" />
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Total Properties Value Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="p-6 shadow-md h-full border-l-4 border-l-green-500">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium text-muted-foreground mb-1">
                    Total Properties Value
                  </h3>
                  <p className="text-2xl font-bold">
                    ${totalPrice.toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Across {properties?.length || 0} properties
                  </p>
                </div>
                <div className="bg-green-50 p-3 rounded-full">
                  <TrendingUp className="h-6 w-6 text-green-500" />
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Properties Table */}
        <Table className="rounded-lg overflow-hidden shadow-sm border">
          <TableCaption>Recent Properties</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Property</TableHead>
              <TableHead>Added Date</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  Loading properties...
                </TableCell>
              </TableRow>
            ) : currentProperties.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No properties found
                </TableCell>
              </TableRow>
            ) : (
              currentProperties.map((property, i) => (
                <TableRow key={property.id}>
                  <TableCell className="font-medium">
                    {typeof property.id === "string"
                      ? property.id.substring(0, 8) + "..."
                      : property.id}
                  </TableCell>
                  <TableCell>{property.title || "Untitled Property"}</TableCell>
                  <TableCell>
                    {formatDate(
                      property.created_at || new Date().toISOString()
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    ${(property.price || 0).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TableCell colSpan={3}>Total Value</TableCell>
              <TableCell className="text-right font-bold">
                ${totalPrice.toLocaleString()}
              </TableCell>
            </TableRow>
          </TableFooter>
        </Table>

        {properties && properties.length > ITEMS_PER_PAGE && (
          <div className="flex justify-between mt-4">
            <Button onClick={handlePreviousPage} disabled={currentPage === 0}>
              Previous
            </Button>
            <Button
              onClick={handleNextPage}
              disabled={(currentPage + 1) * ITEMS_PER_PAGE >= properties.length}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
