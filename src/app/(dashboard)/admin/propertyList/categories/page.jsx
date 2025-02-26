import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Plus } from "lucide-react";

const categories = [
  { name: "Apartments", count: 45 },
  { name: "Houses", count: 32 },
  { name: "Villas", count: 18 },
  { name: "Land", count: 12 },
];

const CategoryCard = ({ category }) => (
  <Card>
    <CardHeader>
      <CardTitle>{category.name}</CardTitle>
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

export default function CategoriesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categories & Types</h1>
          <p className="text-muted-foreground">
            Manage property categories and types
          </p>
        </div>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((category) => (
          <CategoryCard key={category.name} category={category} />
        ))}
      </div>
    </div>
  );
}
