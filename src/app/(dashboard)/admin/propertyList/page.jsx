import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { DataTableDemo } from "../../components/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";

const data = [
  {
    id: "m5gr84i9",
    title: "Cozy Cottage",
    type: "House",
    location: "London",
    agent: "John Doe",
    price: 250000,
  },
  {
    id: "3u1reuv4",
    title: "Modern Apartment",
    type: "Apartment",
    location: "New York",
    agent: "Jane Smith",
    price: 500000,
  },
  {
    id: "derv1ws0",
    title: "Luxury Villa",
    type: "Villa",
    location: "Los Angeles",
    agent: "David Lee",
    price: 1500000,
  },
  {
    id: "5kma53ae",
    title: "Spacious Townhouse",
    type: "Townhouse",
    location: "Chicago",
    agent: "Sarah Jones",
    price: 750000,
  },
  {
    id: "bhqecj4p",
    title: "Charming Bungalow",
    type: "Bungalow",
    location: "San Francisco",
    agent: "Michael Brown",
    price: 1000000,
  },
];

export default function PropertyListPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Proprety Management</h1>
          <p className="text-muted-foreground">
            List of all properties and their statuses.
          </p>
        </div>
      </div>
      <Tabs defaultValue="List" className="space-y-4">
        <TabsList className="w-48">
          <TabsTrigger value="List" className="w-full">
            List
          </TabsTrigger>
          <TabsTrigger value="View" className="w-full">
            View 
          </TabsTrigger>
        </TabsList>
        <TabsContent value="List" className="space-y-4">
          <DataTableDemo data={data} />
        </TabsContent>
        <TabsContent value="View" className="space-y-4">
          <AllProperties data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function AllProperties({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {data.map(({ title, type, location, agent, price, id }, i) => (
          <Card key={id}>
            <CardHeader>
              <CardTitle>
                {i + 1}# {title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-muted rounded-md mb-2">
                {/* Placeholder for image */}
                <img
                  src={`https://placehold.co/600x400?text=Property+${i + 1}`}
                  alt={title}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <p className="font-medium">Property Type: {type}</p>
              <p className="text-muted-foreground">Location: {location}</p>
              <p className="text-muted-foreground">Agent: {agent}</p>
              <p className="text-muted-foreground">Price: {price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
