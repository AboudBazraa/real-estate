"use client";
import { useEffect, useState } from "react";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Plus,
  FolderIcon,
  Home,
  Building,
  Hotel,
  LayoutGrid,
  MapPin,
  Store,
  AlertCircle,
  RefreshCcw,
  Loader2,
} from "lucide-react";
import { PROPERTY_TYPES, PropertyTypeLabels } from "../../constants/propertype";
import { useApiQuery } from "@/shared/hooks/useApi";
import { useProperties } from "@/shared/hooks/useProperties";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/hooks/use-toast";

// Animation variants
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 25 },
  },
};

// Category icons mapping
const categoryIcons = {
  HOUSE: <Home className="h-6 w-6" />,
  APARTMENT: <Building className="h-6 w-6" />,
  CONDO: <Hotel className="h-6 w-6" />,
  TOWNHOUSE: <LayoutGrid className="h-6 w-6" />,
  LAND: <MapPin className="h-6 w-6" />,
  COMMERCIAL: <Store className="h-6 w-6" />,
  // Add more mappings as needed
};

export default function CategoriesPage() {
  const {
    fetchProperties,
    properties,
    loading: propLoading,
    error: propError,
  } = useProperties();
  const [isInitializing, setIsInitializing] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [activeTab, setActiveTab] = useState("all");
  const { toast } = useToast();

  useEffect(() => {
    let isMounted = true;
    const loadProperties = async () => {
      try {
        await fetchProperties(0, 500);
        if (isMounted) {
          setIsInitializing(false);
        }
      } catch (err) {
        console.error("Failed to load properties:", err);
        if (isMounted) {
          setIsInitializing(false);
        }
      }
    };

    loadProperties();

    return () => {
      isMounted = false;
    };
  }, [fetchProperties, retryCount]);

  const handleRetry = () => {
    setIsInitializing(true);
    setRetryCount((prev) => prev + 1);
  };

  const handleAddCategory = () => {
    toast({
      title: "Add Category",
      description: "Category creation feature will be available soon.",
    });
  };

  // Process and categorize properties
  const processProperties = () => {
    if (!properties || properties.length === 0) {
      return {
        categoryCount: {},
        categoriesWithCount: Object.keys(PROPERTY_TYPES).map((type) => ({
          type,
          count: 0,
          percentage: 0,
        })),
        totalProperties: 0,
      };
    }

    // Count properties by type
    const categoryCount = properties.reduce((acc, property) => {
      // Try to get property type from both type and property_type fields
      const typeValue = property.type || property.property_type;

      if (typeValue !== undefined) {
        // Convert to string key if needed
        const typeKey =
          typeof typeValue === "number"
            ? PropertyTypeLabels[typeValue]
            : String(typeValue).toUpperCase();

        if (typeKey) {
          acc[typeKey] = (acc[typeKey] || 0) + 1;
        }
      }
      return acc;
    }, {});

    // Calculate total
    const totalProperties = properties.length;

    // Create array of categories with counts and percentages
    const categoriesWithCount = Object.keys(PROPERTY_TYPES).map((type) => {
      const count = categoryCount[type] || 0;
      const percentage =
        totalProperties > 0 ? Math.round((count / totalProperties) * 100) : 0;

      return {
        type,
        count,
        percentage,
      };
    });

    return { categoryCount, categoriesWithCount, totalProperties };
  };

  const { categoryCount, categoriesWithCount, totalProperties } =
    processProperties();

  // Filter categories based on active tab
  const filteredCategories =
    activeTab === "all"
      ? categoriesWithCount
      : categoriesWithCount.filter((cat) => cat.count > 0);

  const isLoading = isInitializing || propLoading;
  const error = propError;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-64" />
            <Skeleton className="h-6 w-40 mt-2" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        <Skeleton className="h-10 w-64 mb-4" />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array(8)
            .fill()
            .map((_, i) => (
              <Card key={i} className="overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-6 w-24" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-10 w-16 mb-2" />
                  <Skeleton className="h-4 w-24" />
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-9 w-full" />
                </CardFooter>
              </Card>
            ))}
        </div>

        {/* Improved loading indicator */}
        <motion.div
          className="fixed bottom-6 right-6 bg-primary/90 backdrop-blur-sm text-primary-foreground px-4 py-3 shadow-lg flex items-center space-x-3 z-50 rounded-lg border border-primary/20"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <Loader2 className="h-5 w-5 animate-spin" />
          <span className="text-sm font-medium">
            Loading categories data...
          </span>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex justify-center items-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="w-full max-w-md p-6 text-center">
          <div className="mx-auto w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
            <AlertCircle className="h-6 w-6 text-red-600" />
          </div>

          <h3 className="text-xl font-semibold mb-2">
            Failed to load categories
          </h3>

          <p className="text-muted-foreground mb-6">{error}</p>

          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors flex items-center justify-center mx-auto"
          >
            <RefreshCcw className="h-4 w-4 mr-2" />
            Try Again
          </button>
        </Card>
      </motion.div>
    );
  }

  return (
    <AnimatePresence>
      <motion.div
        className="space-y-6"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={item}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-3xl font-bold">Categories & Types</h1>
            <p className="text-muted-foreground">
              Manage property categories and types
            </p>
            <p className="text-lg font-semibold mt-2">
              Total Properties: {totalProperties}
            </p>
          </div>
          <Button onClick={handleAddCategory}>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </motion.div>

        <motion.div variants={item}>
          <Tabs
            defaultValue="all"
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-4"
          >
            <TabsList>
              <TabsTrigger value="all">All Categories</TabsTrigger>
              <TabsTrigger value="used">Used Categories</TabsTrigger>
            </TabsList>
          </Tabs>
        </motion.div>

        <motion.div
          variants={container}
          className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
        >
          {filteredCategories.map((category, i) => (
            <CategoryCard
              key={category.type}
              category={category}
              icon={categoryIcons[category.type]}
              index={i}
            />
          ))}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

const CategoryCard = ({ category, icon, index }) => (
  <motion.div
    variants={item}
    transition={{ delay: index * 0.05 }}
    whileHover={{ y: -5, transition: { duration: 0.2 } }}
  >
    <Card className="overflow-hidden hover:shadow-md transition-all border-t-4 border-t-primary/80">
      <CardHeader className="">
        <CardTitle className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">
          <span className="bg-primary/10 rounded-md text-primary">
            {icon || <FolderIcon className="h-6 w-6" />}
          </span>
          {category.type}
        </CardTitle>
      </CardHeader>
      <CardContent className="">
        <div className="flex flex-col gap-2">
          <p className="text-3xl font-bold">{category.count}</p>
          <div className="flex items-center gap-2">
            <p className="text-muted-foreground">Properties</p>
            {category.percentage > 0 && (
              <span className="bg-primary/10 text-primary text-xs font-medium px-2 py-0.5 rounded-full">
                {category.percentage}%
              </span>
            )}
          </div>
        </div>

        {/* Progress bar showing percentage */}
        {category.percentage > 0 && (
          <div className="w-full bg-muted rounded-full h-1.5">
            <motion.div
              className="bg-primary h-1.5 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${category.percentage}%` }}
              transition={{ duration: 0.8, delay: 0.2 + index * 0.05 }}
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm" className="w-full">
          Manage
        </Button>
      </CardFooter>
    </Card>
  </motion.div>
);
