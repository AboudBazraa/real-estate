import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { Check, X } from "lucide-react";

const properties = Array.from({ length: 4 }).map((_, i) => ({
  id: i + 1,
  userId: i + 100,
  submissionDate: new Date(),
  status: "new",
  image: "https://placehold.co/600x400", // Placeholder image URL
}));

export default function PendingApprovalsPage() {
  const pendingCount = properties.filter((p) => p.status === "new").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Pending Approvals</h1>
          <p className="text-muted-foreground">
            Review and approve property listings
          </p>
        </div>
        <Badge variant="destructive" className="text-base px-3 py-1">
          {pendingCount} Pending
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  );
}

function PropertyCard({ property }) {
  const handleApprove = () => {
    // Implement approval logic here
    console.log(`Property ${property.id} approved`);
  };

  const handleReject = () => {
    // Implement reject logic here
    console.log(`Property ${property.id} rejected`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Property #{property.id}</span>
          <Badge variant="outline" className="ml-2">
            {property.status.toUpperCase()}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <img
          src={property.image}
          alt={`Property ${property.id}`}
          className="aspect-video rounded-md mb-2 object-cover"
        />
        <p className="font-medium">Submitted by: User #{property.userId}</p>
        <p className="text-muted-foreground">
          Submission Date: {property.submissionDate.toLocaleDateString()}
        </p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm">
          <X className="mr-2 h-4 w-4" />
          Reject
        </Button>
        <Button size="sm">
          <Check className="mr-2 h-4 w-4" />
          Approve
        </Button>
      </CardFooter>
    </Card>
  );
}