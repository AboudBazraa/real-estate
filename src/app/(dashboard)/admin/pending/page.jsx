"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/shared/components/ui/card";
import {
  Check,
  X,
  Loader2,
  Mail,
  Home,
  MapPin,
  Calendar,
  AlertCircle,
  Grid,
  LayoutList,
  BedDouble,
  Bath,
} from "lucide-react";
import { useProperties } from "@/shared/hooks/useProperties";
import { useToast } from "@/shared/hooks/use-toast";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/shared/components/ui/avatar";
import { ScrollArea } from "@/shared/components/ui/scroll-area";
import { motion } from "framer-motion";
import Image from "next/image";

const PLACEHOLDER_IMAGE =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

// Helper function to get the correct image URL from property data
function getPropertyImageUrl(property) {
  // For debugging
  if (property?.images && property.images.length > 0) {
    console.log("Property has images:", property.images);
  }

  // Check all possible image sources in priority order
  if (property?.primaryImage) {
    return property.primaryImage;
  } else if (property?.images && property.images.length > 0) {
    // If there's an image marked as primary, use that
    const primaryImage = property.images.find((img) => img.is_primary);
    if (primaryImage && primaryImage.image_url) {
      return primaryImage.image_url;
    }
    // Otherwise use the first image
    if (property.images[0]?.image_url) {
      return property.images[0].image_url;
    }
  }

  // Fallback to placeholder
  return "https://placehold.co/600x400";
}

export default function PendingApprovalsPage() {
  const { toast } = useToast();
  const {
    fetchProperties,
    updateProperty,
    loading: propertiesLoading,
    properties,
    getPropertyById,
  } = useProperties();
  const [pendingProperties, setPendingProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [debugImageUrls, setDebugImageUrls] = useState(false);

  useEffect(() => {
    // Define the filters to get only non-featured properties
    const filters = {
      featured: false, // This uses the 'featured' field to filter pending properties
    };

    // Fetch properties on component mount
    const loadProperties = async () => {
      setLoading(true);
      try {
        // We pass a large page size to get all pending properties
        await fetchProperties(0, 100, filters, undefined, false, false);
      } catch (error) {
        console.error("Failed to fetch pending properties:", error);
        toast({
          title: "Error",
          description: "Failed to load pending properties",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadProperties();
  }, [fetchProperties, toast]);

  // Update pendingProperties when properties change and fetch detailed info with user email
  useEffect(() => {
    const fetchDetailedProperties = async () => {
      if (properties && properties.length > 0) {
        const detailedProperties = await Promise.all(
          properties.map(async (property) => {
            // Get detailed property info including user data
            try {
              const detailedProperty = await getPropertyById(property.id);

              // Debug the image URLs if enabled
              if (debugImageUrls && detailedProperty) {
                console.log(`Property ID: ${detailedProperty.id}`);
                console.log(`Primary Image: ${detailedProperty.primaryImage}`);
                if (
                  detailedProperty.images &&
                  detailedProperty.images.length > 0
                ) {
                  detailedProperty.images.forEach((img, idx) => {
                    console.log(`Image ${idx}: ${img.image_url}`);
                  });
                } else {
                  console.log("No images found for this property");
                }
              }

              return detailedProperty;
            } catch (error) {
              console.error(
                `Error fetching details for property ${property.id}:`,
                error
              );
              return property; // Return original property if detailed fetch fails
            }
          })
        );
        setPendingProperties(detailedProperties);
        // Set the first property as selected by default if there's no selection
        if (detailedProperties.length > 0 && !selectedProperty) {
          setSelectedProperty(detailedProperties[0]);
        }
      } else {
        setPendingProperties([]);
        setSelectedProperty(null);
      }
    };

    fetchDetailedProperties();
  }, [properties, getPropertyById, selectedProperty, debugImageUrls]);

  // Add a new useEffect after existing ones to log the fetched properties data
  useEffect(() => {
    // Log property data for debugging when loading completes
    if (!loading && pendingProperties.length > 0) {
      console.log("Fetched property data sample:", pendingProperties[0]);

      // Enable debug for the first render to check image URLs
      if (!debugImageUrls) {
        setDebugImageUrls(true);
      }
    }
  }, [loading, pendingProperties, debugImageUrls]);

  // Get the count of pending properties
  const pendingCount = pendingProperties.length;

  // Function to handle property approval
  async function handleApprove(property) {
    try {
      // Update the property to set featured to true
      await updateProperty(property.id, { featured: true });

      // Update the local state to remove this property from the list
      setPendingProperties((prevProperties) =>
        prevProperties.filter((p) => p.id !== property.id)
      );

      // If the approved property was selected, clear the selection
      if (selectedProperty && selectedProperty.id === property.id) {
        setSelectedProperty(
          pendingProperties.length > 1 ? pendingProperties[0] : null
        );
      }

      toast({
        title: "Success",
        description: "Property has been approved",
      });
    } catch (error) {
      console.error("Failed to approve property:", error);
      toast({
        title: "Error",
        description: "Failed to approve property",
        variant: "destructive",
      });
    }
  }

  // Function to handle property rejection
  async function handleReject(property) {
    try {
      // Update the property to set featured to null (rejected)
      await updateProperty(property.id, { featured: null });

      // Update the local state to remove this property from the list
      setPendingProperties((prevProperties) =>
        prevProperties.filter((p) => p.id !== property.id)
      );

      // If the rejected property was selected, clear the selection
      if (selectedProperty && selectedProperty.id === property.id) {
        setSelectedProperty(
          pendingProperties.length > 1 ? pendingProperties[0] : null
        );
      }

      toast({
        title: "Success",
        description: "Property has been rejected",
      });
    } catch (error) {
      console.error("Failed to reject property:", error);
      toast({
        title: "Error",
        description: "Failed to reject property",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Pending Approvals
          </h1>
          <p className="text-muted-foreground mt-1">
            Review and approve property listings
          </p>
        </div>
        <div className="flex items-center gap-3">
          {process.env.NODE_ENV === "development" && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setDebugImageUrls(!debugImageUrls)}
              className="text-xs"
            >
              {debugImageUrls ? "Disable" : "Enable"} Image Debug
            </Button>
          )}
          <Badge
            variant="destructive"
            className="text-base px-4 py-1.5 rounded-full"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
            ) : (
              `${pendingCount} Pending`
            )}
          </Badge>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center min-h-[400px]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center"
          >
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
            <p className="text-muted-foreground font-medium">
              Loading pending properties...
            </p>
          </motion.div>
        </div>
      ) : pendingProperties.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-20 bg-gradient-to-b from-muted/10 to-muted/30 rounded-xl border border-dashed"
        >
          <Home className="h-16 w-16 mx-auto text-muted-foreground/60 mb-6" />
          <h3 className="text-2xl font-medium mb-3">No pending properties</h3>
          <p className="text-muted-foreground max-w-md mx-auto">
            All properties have been reviewed. Check back later for new
            submissions.
          </p>
        </motion.div>
      ) : (
        <Tabs defaultValue="grid" className="space-y-6">
          <div className="flex items-center justify-between">
            <TabsList className="p-1">
              <TabsTrigger
                value="grid"
                className="flex items-center gap-2 px-4"
              >
                <Grid className="h-4 w-4" />
                Grid View
              </TabsTrigger>
              <TabsTrigger
                value="detail"
                className="flex items-center gap-2 px-4"
              >
                <LayoutList className="h-4 w-4" />
                Detail View
              </TabsTrigger>
            </TabsList>
            <p className="text-sm text-muted-foreground bg-muted/50 px-3 py-1 rounded-full">
              Showing {pendingProperties.length} pending properties
            </p>
          </div>

          <TabsContent value="grid" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ staggerChildren: 0.1 }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
            >
              {pendingProperties.map((property, index) => (
                <motion.div
                  key={property.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <PropertyCard
                    property={property}
                    onApprove={handleApprove}
                    onReject={handleReject}
                    isLoading={propertiesLoading}
                  />
                </motion.div>
              ))}
            </motion.div>
          </TabsContent>

          <TabsContent value="detail" className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="md:col-span-1">
                <Card className="h-full overflow-hidden border shadow-md">
                  <CardHeader className="bg-muted/30 pb-3">
                    <CardTitle>Property List</CardTitle>
                    <CardDescription>
                      Select a property to review
                    </CardDescription>
                  </CardHeader>
                  <ScrollArea className="h-[600px]">
                    <div className="px-4 pb-4 space-y-2">
                      {pendingProperties.map((property) => (
                        <motion.div
                          key={property.id}
                          whileHover={{ scale: 1.02 }}
                          className={`p-3 rounded-lg cursor-pointer transition-all border ${
                            selectedProperty &&
                            selectedProperty.id === property.id
                              ? "bg-primary text-primary-foreground shadow-md"
                              : "hover:bg-muted"
                          }`}
                          onClick={() => setSelectedProperty(property)}
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border relative">
                              {getPropertyImageUrl(property) ? (
                                <img
                                  src={getPropertyImageUrl(property)}
                                  alt=""
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    console.log(
                                      "List thumbnail failed to load for property:",
                                      property.id
                                    );
                                    // Replace with home icon on error
                                    e.target.style.display = "none";
                                    e.target.parentNode.innerHTML = `<div class="w-full h-full bg-muted flex items-center justify-center">
                                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="h-6 w-6 text-muted-foreground/40"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><polyline points="9 22 9 12 15 12 15 22"></polyline></svg>
                                    </div>`;
                                  }}
                                />
                              ) : (
                                <div className="w-full h-full bg-muted flex items-center justify-center">
                                  <Home className="h-6 w-6 text-muted-foreground/40" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium truncate">
                                {property.title || `Property #${property.id}`}
                              </p>
                              <p
                                className={`text-sm truncate ${
                                  selectedProperty &&
                                  selectedProperty.id === property.id
                                    ? "text-primary-foreground/80"
                                    : "text-muted-foreground"
                                }`}
                              >
                                {property.location || "Location not specified"}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                </Card>
              </div>

              <div className="md:col-span-2">
                {selectedProperty ? (
                  <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    key={selectedProperty.id}
                  >
                    <PropertyDetail
                      property={selectedProperty}
                      onApprove={handleApprove}
                      onReject={handleReject}
                      isLoading={propertiesLoading}
                    />
                  </motion.div>
                ) : (
                  <Card className="h-full flex items-center justify-center border-none shadow-md">
                    <CardContent className="text-center py-16">
                      <AlertCircle className="h-12 w-12 mx-auto text-muted-foreground/60 mb-4" />
                      <p className="text-muted-foreground text-lg">
                        Select a property to view details
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </motion.div>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}

function PropertyCard({ property, onApprove, onReject, isLoading }) {
  const [actionType, setActionType] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleApprove = async () => {
    setActionType("approve");
    setLocalLoading(true);
    await onApprove(property);
    setLocalLoading(false);
    setActionType(null);
  };

  const handleReject = async () => {
    setActionType("reject");
    setLocalLoading(true);
    await onReject(property);
    setLocalLoading(false);
    setActionType(null);
  };

  const isApprovingLoading = localLoading && actionType === "approve";
  const isRejectingLoading = localLoading && actionType === "reject";

  const handleImageError = () => {
    console.log("Image failed to load for property:", property.id);
    console.log("Image URL attempted:", getPropertyImageUrl(property));
    setImageError(true);
  };

  // Get the image URL
  const imageUrl = getPropertyImageUrl(property);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 shadow-md h-full border p-2 pb-3">
      <div className="relative aspect-video gap-0">
        {imageError ? (
          <div className="w-full h-full bg-muted flex items-center justify-center rounded-lg">
            <Home className="h-12 w-12 text-muted-foreground/40" />
          </div>
        ) : (
          <img
            src={imageUrl}
            alt={property.title || `Property ${property.id}`}
            className="object-cover w-full h-full rounded-lg"
            onError={handleImageError}
          />
        )}
        <Badge
          variant="secondary"
          className="absolute top-3 right-3 font-medium px-3 py-1 bg-black/70 text-white"
        >
          PENDING
        </Badge>
      </div>
      <CardHeader className="">
        <CardTitle className="line-clamp-1 text-xl">
          <div className="flex items-center justify-between gap-2">
            <p className="text-xl text-muted-foreground">
              {property.title || `Property #${property.id}`}
            </p>
            <p className="font-semibold text-xl text-primary">
              {property.price
                ? `$${property.price.toLocaleString()}`
                : "Price not set"}
            </p>
          </div>
        </CardTitle>
        <CardDescription className="flex items-center gap-1 text-sm">
          <MapPin className="h-3.5 w-3.5" />
          {property.location || "Location not specified"}
        </CardDescription>
      </CardHeader>
      <CardContent className="">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Avatar className="h-7 w-7 border-2 border-primary/10">
              <AvatarImage src={property.agent?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary">
                {property.agent?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate max-w-[120px]">
              {property.agent?.name || property.agent?.email || "Agent"}
            </span>
          </div>
          <div className="flex items-center text-xs text-muted-foreground bg-muted/30 rounded-md">
            <Calendar className="h-3.5 w-3.5 " />
            Submitted: {new Date(property.created_at).toLocaleDateString()}
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-start gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleReject}
          disabled={localLoading || isLoading}
          className="w-[48%] rounded-full"
        >
          {isRejectingLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <X className="mr-2 h-4 w-4" />
          )}
          Reject
        </Button>
        <Button
          size="sm"
          onClick={handleApprove}
          disabled={localLoading || isLoading}
          className="w-[48%] rounded-full bg-gradient-to-r from-primary to-primary/80"
        >
          {isApprovingLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Check className="mr-2 h-4 w-4" />
          )}
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
}

function PropertyDetail({ property, onApprove, onReject, isLoading }) {
  const [actionType, setActionType] = useState(null);
  const [localLoading, setLocalLoading] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleApprove = async () => {
    setActionType("approve");
    setLocalLoading(true);
    await onApprove(property);
    setLocalLoading(false);
    setActionType(null);
  };

  const handleReject = async () => {
    setActionType("reject");
    setLocalLoading(true);
    await onReject(property);
    setLocalLoading(false);
    setActionType(null);
  };

  const handleImageError = () => {
    console.log("Detail view: Image failed to load for property:", property.id);
    console.log("Image URL attempted:", getPropertyImageUrl(property));
    setImageError(true);
  };

  const isApprovingLoading = localLoading && actionType === "approve";
  const isRejectingLoading = localLoading && actionType === "reject";

  // Get the image URL
  const imageUrl = getPropertyImageUrl(property);

  return (
    <Card className="h-full border shadow-md overflow-hidden">
      <CardHeader className="bg-muted/30 ">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-2xl">
              {property.title || `Property #${property.id}`}
            </CardTitle>
            <CardDescription className="flex items-center mt-1">
              <MapPin className="h-4 w-4 mr-1" />
              {property.location || "Location not specified"}
            </CardDescription>
          </div>
          <Badge
            variant="outline"
            className="bg-black/70 text-white border-none px-3 py-1"
          >
            PENDING
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="">
        <div className="rounded-xl overflow-hidden shadow-md relative aspect-video">
          {imageError ? (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <Home className="h-16 w-16 text-muted-foreground/40" />
            </div>
          ) : (
            <img
              src={imageUrl}
              alt={property.title || `Property ${property.id}`}
              className="w-full h-full object-cover"
              onError={handleImageError}
            />
          )}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="bg-muted/20 p-4 rounded-xl space-y-1">
            <p className="text-sm text-muted-foreground">Price</p>
            <p className="font-semibold text-lg text-primary">
              {property.price
                ? `$${property.price.toLocaleString()}`
                : "Not specified"}
            </p>
          </div>
          <div className="bg-muted/20 p-4 rounded-xl space-y-1">
            <p className="text-sm text-muted-foreground">Property Type</p>
            <p className="font-semibold text-lg">
              {property.type || "Not specified"}
            </p>
          </div>
          <div className="bg-muted/20 p-4 rounded-xl space-y-1 bg-slate-100 mb-2">
            <p className="text-sm text-muted-foreground">Bedrooms :</p>
            <p className="font-semibold text-lg flex items-center gap-1">
              <BedDouble className="h-4 w-4 mr-1" />
              {property.bedrooms || "Not specified"}
            </p>
          </div>
          <div className="bg-muted/20 p-4 rounded-xl space-y-1 bg-slate-100 mb-2  ">
            <p className="text-sm text-muted-foreground">Bathrooms :</p>
            <p className="font-semibold text-lg flex items-center gap-1">
              <Bath className="h-4 w-4 mr-1" />
              {property.bathrooms || "Not specified"}
            </p>
          </div>
        </div>

        <div className="space-y-2 bg-slate-100 rounded-xl p-4 mb-2">
          <p className="text-sm font-medium">Description</p>
          <p className="text-sm bg-muted/20 p-4 rounded-xl">
            {property.description || "No description provided."}
          </p>
        </div>

        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl px-4 py-2 space-y-3 bg-slate-100">
          <p className="text-sm font-medium">Agent Information</p>
          <div className="flex items-center gap-4">
            <Avatar className="h-12 w-12 border-2 border-primary/20">
              <AvatarImage src={property.agent?.avatar} />
              <AvatarFallback className="bg-primary/10 text-primary text-lg">
                {property.agent?.name?.charAt(0) || "A"}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">
                {property.agent?.name || "Name not provided"}
              </p>
              <p className="text-sm text-muted-foreground flex items-center">
                <Mail className="h-3.5 w-3.5 mr-1" />
                {property.agent?.email || "Email not specified"}
              </p>
            </div>
          </div>
        </div>

        <div className="text-sm text-muted-foreground bg-muted/20 p-3 rounded-xl ">
          <p className="flex items-center">
            <Calendar className="h-4 w-4 mr-2" />
            Submitted on {new Date(
              property.created_at
            ).toLocaleDateString()} at{" "}
            {new Date(property.created_at).toLocaleTimeString()}
          </p>
        </div>
      </CardContent>
      <CardFooter className="flex gap-4 ">
        <Button
          variant="outline"
          onClick={handleReject}
          disabled={localLoading || isLoading}
          className="flex-1 py-6 rounded-xl"
        >
          {isRejectingLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <X className="mr-2 h-5 w-5" />
          )}
          Reject Property
        </Button>
        <Button
          onClick={handleApprove}
          disabled={localLoading || isLoading}
          className="flex-1 py-6 rounded-xl bg-gradient-to-r from-primary to-primary/80"
        >
          {isApprovingLoading ? (
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          ) : (
            <Check className="mr-2 h-5 w-5" />
          )}
          Approve Property
        </Button>
      </CardFooter>
    </Card>
  );
}
