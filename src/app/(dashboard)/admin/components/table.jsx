"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Loader2, Eye, ArrowUpDown, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";

// Animation variants
const tableRowVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.2,
      ease: "easeInOut",
    },
  }),
  removed: { opacity: 0, y: -10 },
};

export function TableDemo({ properties = [], loading = false }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  // Filter properties based on search term
  const filteredProperties = properties.filter(
    (property) =>
      property.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.id?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort properties based on sort field and direction
  const sortedProperties = [...filteredProperties].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (sortField === "price") {
      return sortDirection === "asc"
        ? (a.price || 0) - (b.price || 0)
        : (b.price || 0) - (a.price || 0);
    }

    if (!aValue && !bValue) return 0;
    if (!aValue) return sortDirection === "asc" ? 1 : -1;
    if (!bValue) return sortDirection === "asc" ? -1 : 1;

    return sortDirection === "asc"
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue);
  });

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="w-full overflow-auto"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Properties</h3>
        <div className="relative w-64">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">
                <Button
                  variant="ghost"
                  className="p-0 hover:bg-transparent font-medium flex items-center text-xs"
                  onClick={() => handleSort("id")}
                >
                  ID
                  {sortField === "id" && (
                    <ArrowUpDown
                      className={`ml-1 h-3 w-3 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      } transition-transform`}
                    />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 hover:bg-transparent font-medium flex items-center text-xs"
                  onClick={() => handleSort("title")}
                >
                  Title
                  {sortField === "title" && (
                    <ArrowUpDown
                      className={`ml-1 h-3 w-3 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      } transition-transform`}
                    />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 hover:bg-transparent font-medium flex items-center text-xs"
                  onClick={() => handleSort("price")}
                >
                  Price
                  {sortField === "price" && (
                    <ArrowUpDown
                      className={`ml-1 h-3 w-3 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      } transition-transform`}
                    />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="p-0 hover:bg-transparent font-medium flex items-center text-xs"
                  onClick={() => handleSort("location")}
                >
                  Location
                  {sortField === "location" && (
                    <ArrowUpDown
                      className={`ml-1 h-3 w-3 ${
                        sortDirection === "desc" ? "rotate-180" : ""
                      } transition-transform`}
                    />
                  )}
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-[80px]">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <AnimatePresence>
              {sortedProperties.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="text-center py-6 text-muted-foreground"
                  >
                    {searchTerm
                      ? "No properties match your search"
                      : "No properties found"}
                  </TableCell>
                </TableRow>
              ) : (
                sortedProperties.map((property, index) => (
                  <motion.tr
                    key={property.id}
                    variants={tableRowVariants}
                    initial="hidden"
                    animate="visible"
                    exit="removed"
                    custom={index}
                    className="group hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <TableCell className="font-medium">
                      {typeof property.id === "string"
                        ? property.id.substring(0, 8) + "..."
                        : property.id}
                    </TableCell>
                    <TableCell className="font-medium">
                      {property.title || "Untitled Property"}
                    </TableCell>
                    <TableCell>
                      {property.price
                        ? `$${property.price.toLocaleString()}`
                        : "Not set"}
                    </TableCell>
                    <TableCell className="max-w-[150px] truncate">
                      {property.location || "Not specified"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          property.featured === true
                            ? "success"
                            : property.featured === false
                            ? "destructive"
                            : "outline"
                        }
                        className="transition-all"
                      >
                        {property.featured === true
                          ? "Approved"
                          : property.featured === false
                          ? "Pending"
                          : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-primary-foreground"
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View property details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </TableCell>
                  </motion.tr>
                ))
              )}
            </AnimatePresence>
          </TableBody>
        </Table>
      )}
    </motion.div>
  );
}
