import { Badge } from "@/shared/components/ui/badge";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { PropertyCard } from "@/app/(dashboard)/agent/components/propertyCard";
import {
  Building,
  Home,
  Calendar,
  Users,
  ArrowUpRight,
  Plus,
} from "lucide-react";
import Link from "next/link";
import CardDashboard from "@/app/(dashboard)/components/card";

interface CardDashboard {
  title: string;
  value: number;
  icon: string;
  change: string;
}

const CardDashboardData: CardDashboard[] = [
  {
    title: "Total Properties",
    value: 24,
    icon: "M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6",
    change: "+20.1% from last month",
  },
  {
    title: "Available Properties",
    value: 4,
    // value: properties.filter(p => p.status === 'For Sale').length,
    icon: "M2 5h20v14H2zM2 10h20",
    change: "+19% from last month",
  },
  {
    title: "Scheduled Viewings",
    value: 3,
    icon: "M22 12h-4l-3 9L9 3l-3 9H2",
    change: "+201 since last hour",
  },
  {
    title: "New Inquiries",
    value: 4,
    icon: "M22 12h-4l-3 9L9 3l-3 9H2",
    change: "+4 since last hour",
  },
];

interface Property {
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
}
const properties: Property[] = [
  {
    id: "prop-1",
    title: "Modern Apartment in Downtown",
    address: "123 Main St, Downtown, City",
    price: "$450,000",
    bedrooms: 2,
    bathrooms: 2,
    sqft: 1200,
    type: "Apartment",
    status: "For Sale",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "prop-2",
    title: "Luxury Villa with Pool",
    address: "456 Ocean Ave, Beachside, City",
    price: "$1,250,000",
    bedrooms: 4,
    bathrooms: 3,
    sqft: 3200,
    type: "Villa",
    status: "For Sale",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "prop-3",
    title: "Cozy Studio near University",
    address: "789 College Blvd, University District, City",
    price: "$1,800/month",
    bedrooms: 1,
    bathrooms: 1,
    sqft: 650,
    type: "Studio",
    status: "For Rent",
    image: "/placeholder.svg?height=300&width=400",
  },
];

export default function AgentDashboard() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
            <p className="text-muted-foreground">
              See what&apos;s happening with your properties today.
            </p>
          </div>
        </div>
        <Button asChild>
          <Link href="/properties/add">
            <Plus className="mr-2 h-4 w-4" />
            Add Property
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {CardDashboardData.map((card) => (
          <CardDashboard
            key={card.title}
            title={card.title}
            icon={card.icon}
            value={card.value}
            change={card.change}
          />
        ))}
      </div>
      <RecentProperties properties={properties} />
      <UpcomingAppointmentsAndRecentActivity />
    </div>
  );
}

const RecentProperties = ({ properties }: { properties: Property[] }) => (
  <div className="grid gap-6">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold">Recent Properties</h2>
        <p className="text-sm text-muted-foreground">
          Your most recently added property listings
        </p>
      </div>
      <Button variant="ghost" size="sm" className="text-primary" asChild>
        <Link href="/properties" className="flex items-center gap-1">
          View all properties
          <ArrowUpRight className="h-4 w-4" />
        </Link>
      </Button>
    </div>

    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {properties.map((property) => (
        <PropertyCard key={property.id} property={property} />
      ))}
    </div>
  </div>
);

const UpcomingAppointmentsAndRecentActivity = () => (
  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-12">
    <UpcomingAppointments />
    <RecentActivity />
  </div>
);

const UpcomingAppointments = () => (
  <Card className="col-span-full lg:col-span-8">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">Upcoming Appointments</CardTitle>
      <Link href="/appointments/scheduled" className="text-sm font-medium text-primary hover:underline">
        View all <ArrowUpRight className="h-4 w-4 inline-block ml-1" />
      </Link>
    </CardHeader>
    <CardContent>
      {/* Implement actual appointment fetching and display logic here.  Placeholder below. */}
      <div className="divide-y divide-border">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex items-center py-4 gap-4">
            <Calendar className="h-6 w-6 text-muted-foreground" />
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium">Property Viewing</p>
              <p className="text-xs text-muted-foreground">
                Modern Apartment in Downtown • March {i + 4}, 2025 - 10:00 AM
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

const RecentActivity = () => (
  <Card className="col-span-full lg:col-span-4">
    <CardHeader>
      <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
      {/* Consider adding a view all link here if needed */}
    </CardHeader>
    <CardContent>
      {/* Implement actual activity fetching and display logic here. Placeholder below. */}
      <div className="divide-y divide-border">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="py-4 flex gap-4">
            <div className="relative mt-1 h-2 w-2 shrink-0">
              <div className="absolute h-2 w-2 rounded-full bg-primary" />
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-sm font-medium leading-none">
                New inquiry received
              </p>
              <p className="text-xs text-muted-foreground">
                {i * 15} minutes ago
              </p>
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);