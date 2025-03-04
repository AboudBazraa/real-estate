import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/shared/components/ui/card";
import { Bed, Bath, Square, Heart } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    address: string;
    price: string;
    bedrooms: number;
    bathrooms: number;
    sqft: number;
    type: string;
    status: string;
    image: string;
  };
}

export function PropertyCard({ property }: PropertyCardProps) {
  const imageSrc = property.image || "/placeholder.svg";

  return (
    <Card className="group overflow-hidden rounded-lg shadow-md">
      <Link href={`/properties/${property.id}`}>
        <CardHeader className="relative">
          <Image
            src={imageSrc}
            alt={''}
            width={600}
            height={400}
            className="object-cover rounded-t-lg h-48 w-full sm:h-56 md:h-64 lg:h-72 transition-transform duration-300 group-hover:scale-105 -z-20"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent rounded-t-lg" />
          <div className="absolute top-4 left-4">
            <Badge variant="secondary">{property.type}</Badge>
            <Badge
              variant={property.status === "For Sale" ? "outline" : "default"}
              className="ml-2"
            >
              {property.status}
            </Badge>
          </div>
          <Button
            size="icon"
            variant="ghost"
            className="absolute top-4 right-4 rounded-full bg-black/20 backdrop-blur-sm"
          >
            <Heart className="h-5 w-5 text-white" />
          </Button>
        </CardHeader>
      </Link>
      <CardContent className="p-4">
        <h3 className="text-xl font-semibold line-clamp-1">
          <Link href={`/properties/${property.id}`}>{property.title}</Link>
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {property.address}
        </p>
        <p className="text-lg font-bold text-primary mt-2">{property.price}</p>
        <div className="flex gap-4 text-sm text-muted-foreground mt-1">
          <div className="flex items-center gap-1">
            <Bed className="h-4 w-4" />
            <span>{property.bedrooms} Bed</span>
          </div>
          <div className="flex items-center gap-1">
            <Bath className="h-4 w-4" />
            <span>{property.bathrooms} Bath</span>
          </div>
          <div className="flex items-center gap-1">
            <Square className="h-4 w-4" />
            <span>{property.sqft} sqft</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 grid grid-cols-2 gap-2">
        <Button variant="outline" className="w-full">
          <Link href={`/properties/${property.id}/edit`}>Edit</Link>
        </Button>
        <Button className="w-full">
          <Link href={`/properties/${property.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
