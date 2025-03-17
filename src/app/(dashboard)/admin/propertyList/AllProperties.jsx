"use client";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";

export default function AllProperties({ data }) {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        {data.map(({ title, type, location, price }, i) => (
          <Card key={i}>
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
              <p className="text-muted-foreground">Price: {price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
