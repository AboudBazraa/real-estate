import * as React from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import { Eye, Edit, Trash2, ChevronDown, Search, Loader2 } from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import { PROPERTY_TYPES } from "@/app/(dashboard)/constants/propertype";

// Helper function to get the display label for property type
const getPropertyTypeLabel = (type) => {
  if (!type) return "Residential";

  // If it's already a full name string like "HOUSE", "APARTMENT", etc.
  if (typeof type === "string" && PROPERTY_TYPES[type]) {
    return type.charAt(0) + type.slice(1).toLowerCase();
  }

  // If it's a string that matches one of our PROPERTY_TYPES values
  if (Object.values(PROPERTY_TYPES).includes(type)) {
    return type.charAt(0) + type.slice(1).toLowerCase();
  }

  return type || "Residential";
};

export function DataTableDemo({
  data = [],
  isLoading = false,
  onView = (id) => console.log("View", id),
  onEdit = (id) => console.log("Edit", id),
  onDelete = (id) => console.log("Delete", id),
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [expandedRows, setExpandedRows] = React.useState({});

  const filteredData = React.useMemo(() => {
    if (!searchQuery.trim()) return data;

    return data.filter((property) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        (property.title &&
          property.title.toLowerCase().includes(searchLower)) ||
        (property.location &&
          property.location.toLowerCase().includes(searchLower)) ||
        (property.id && property.id.toString().includes(searchLower))
      );
    });
  }, [data, searchQuery]);

  const toggleExpandRow = (id) => {
    setExpandedRows((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  if (isLoading) {
    return (
      <div className="rounded-md border shadow">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground">Loading properties...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md border shadow">
      <div className="p-4 border-b">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search properties..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead className="w-[120px] hidden md:table-cell">
              Price
            </TableHead>
            <TableHead className="hidden md:table-cell">Location</TableHead>
            <TableHead className="hidden md:table-cell">Type</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="w-[150px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredData.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6">
                {searchQuery
                  ? "No properties match your search"
                  : "No properties found"}
              </TableCell>
            </TableRow>
          ) : (
            <AnimatePresence>
              {filteredData.map((property, index) => (
                <React.Fragment key={property.id}>
                  <motion.tr
                    className="border-b data-[state=selected]:bg-muted hover:bg-muted/50 cursor-pointer"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => toggleExpandRow(property.id)}
                  >
                    <TableCell className="font-medium">
                      {typeof property.id === "string"
                        ? property.id.substring(0, 8) + "..."
                        : property.id}
                    </TableCell>
                    <TableCell className="max-w-[300px] truncate">
                      <div className="flex items-center">
                        <span className="truncate">
                          {property.title || "Untitled Property"}
                        </span>
                        <ChevronDown
                          className={`h-4 w-4 ml-2 transition-transform ${
                            expandedRows[property.id] ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {property.price
                        ? `$${property.price.toLocaleString()}`
                        : "Not set"}
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate hidden md:table-cell">
                      {property.location || "Not specified"}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {getPropertyTypeLabel(property.property_type)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={
                          property.featured === true
                            ? "success"
                            : property.featured === false
                            ? "destructive"
                            : "outline"
                        }
                        className={
                          property.featured === true
                            ? "bg-green-100 text-green-800"
                            : property.featured === false
                            ? "bg-orange-100 text-orange-800"
                            : "bg-gray-100 text-gray-800"
                        }
                      >
                        {property.featured === true
                          ? "Approved"
                          : property.featured === false
                          ? "Pending"
                          : "Draft"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            title="View"
                            onClick={(e) => {
                              e.stopPropagation();
                              onView(property.id);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            title="Edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              onEdit(property.id);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </motion.div>
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          <Button
                            variant="outline"
                            size="icon"
                            title="Delete"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(property.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </motion.div>
                      </div>
                    </TableCell>
                  </motion.tr>

                  {/* Mobile expanded view */}
                  <AnimatePresence>
                    {expandedRows[property.id] && (
                      <motion.tr
                        className="md:hidden bg-muted/50"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <TableCell colSpan={6} className="p-4">
                          <div className="space-y-2">
                            <div>
                              <span className="font-medium text-sm text-muted-foreground">
                                Price:
                              </span>{" "}
                              <span>
                                {property.price
                                  ? `$${property.price.toLocaleString()}`
                                  : "Not set"}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-sm text-muted-foreground">
                                Location:
                              </span>{" "}
                              <span>
                                {property.location || "Not specified"}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-sm text-muted-foreground">
                                Type:
                              </span>{" "}
                              <span>
                                {getPropertyTypeLabel(property.property_type)}
                              </span>
                            </div>
                            <div>
                              <span className="font-medium text-sm text-muted-foreground">
                                Status:
                              </span>{" "}
                              <Badge
                                variant={
                                  property.featured === true
                                    ? "success"
                                    : property.featured === false
                                    ? "destructive"
                                    : "outline"
                                }
                                className={
                                  property.featured === true
                                    ? "bg-green-100 text-green-800"
                                    : property.featured === false
                                    ? "bg-orange-100 text-orange-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {property.featured === true
                                  ? "Approved"
                                  : property.featured === false
                                  ? "Pending"
                                  : "Draft"}
                              </Badge>
                            </div>
                            {property.bedrooms && (
                              <div>
                                <span className="font-medium text-sm text-muted-foreground">
                                  Bedrooms:
                                </span>{" "}
                                <span>{property.bedrooms}</span>
                              </div>
                            )}
                            {property.bathrooms && (
                              <div>
                                <span className="font-medium text-sm text-muted-foreground">
                                  Bathrooms:
                                </span>{" "}
                                <span>{property.bathrooms}</span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </motion.tr>
                    )}
                  </AnimatePresence>
                </React.Fragment>
              ))}
            </AnimatePresence>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
