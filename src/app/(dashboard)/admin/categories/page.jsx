"use client";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Plus } from "lucide-react";
import { PROPERTY_TYPES, PropertyTypeLabels } from "../../constants/propertype";
import { useApiQuery } from "@/shared/hooks/useApi";

export default function CategoriesPage() {
  const { data, isLoading } = useApiQuery(["properties"], {
    url: "/Properties/GetAll",
  });

  const properties = data?.data || [];

  const categoryCount = properties.reduce((acc, property) => {
    const typeKey = PropertyTypeLabels[property.type]; // Get the string key from the numeric type
    if (typeKey) {
      acc[typeKey] = (acc[typeKey] || 0) + 1; // Increment the count for the corresponding type
    }
    return acc;
  }, {});

  const categoriesWithCount = Object.keys(PROPERTY_TYPES).map((type) => ({
    type: type,
    count: categoryCount[type] || 0,
  }));

  console.log(categoriesWithCount);

  // Calculate total categories
  const totalCategories = categoriesWithCount.reduce(
    (acc, category) => acc + category.count,
    0
  );

  // Get specific counts for House and Land
  const houseCount = categoryCount["HOUSE"] || 0; // Adjust the key based on your PROPERTY_TYPES
  const landCount = categoryCount["LAND"] || 0; // Adjust the key based on your PROPERTY_TYPES

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories & Types</h1>
          <p className="text-muted-foreground">
            Manage property categories and types
          </p>
          {/* Display total categories */}
          <p className="text-lg font-semibold">
            Total Categories: {totalCategories}
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          categoriesWithCount.map((category, i) => (
            <CategoryCard key={i} category={category} />
          ))
        )}
      </div>
    </div>
  );
}

const CategoryCard = ({ category }) => (
  <Card>
    <CardHeader>
      <CardTitle>{category.type}</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-2xl font-bold">{category.count}</p>
      <p className="text-muted-foreground">Properties</p>
    </CardContent>
    <CardFooter>
      <Button variant="outline" size="sm" className="w-full">
        Manage
      </Button>
    </CardFooter>
  </Card>
);
