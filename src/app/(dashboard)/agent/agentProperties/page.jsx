import { Button } from "@/shared/components/ui/button"
import { PropertyCard } from "@/app/(dashboard)/agent/components/propertyCard"
import { SidebarTrigger } from "@/shared/components/ui/sidebar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select"
import { PlusCircle, Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import Link from "next/link"

// Sample property data
const properties = [
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
  {
    id: "prop-4",
    title: "Family Home with Garden",
    address: "101 Suburban Lane, Greenfield, City",
    price: "$675,000",
    bedrooms: 3,
    bathrooms: 2.5,
    sqft: 2100,
    type: "House",
    status: "For Sale",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "prop-5",
    title: "Penthouse with City Views",
    address: "202 Skyline Drive, Downtown, City",
    price: "$950,000",
    bedrooms: 3,
    bathrooms: 3,
    sqft: 2400,
    type: "Penthouse",
    status: "For Sale",
    image: "/placeholder.svg?height=300&width=400",
  },
  {
    id: "prop-6",
    title: "Commercial Space in Business District",
    address: "303 Commerce St, Business District, City",
    price: "$3,500/month",
    bedrooms: 0,
    bathrooms: 2,
    sqft: 1800,
    type: "Commercial",
    status: "For Rent",
    image: "/placeholder.svg?height=300&width=400",
  },
]

export default async function PropertiesPage() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SidebarTrigger />
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Properties</h1>
            <p className="text-muted-foreground">Manage and monitor all your property listings</p>
          </div>
        </div>
        <Button asChild>
          <Link href="/properties/add">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Property
          </Link>
        </Button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 items-center gap-4">
          <div className="relative flex-1 sm:max-w-[320px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search properties..." className="pl-8" />
          </div>
          <Button variant="outline" size="icon" className="shrink-0">
            <SlidersHorizontal className="h-4 w-4" />
            <span className="sr-only">Filter properties</span>
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="all">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Properties</SelectItem>
              <SelectItem value="for-sale">For Sale</SelectItem>
              <SelectItem value="for-rent">For Rent</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="newest">
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest First</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {properties.map((property) => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>
    </div>
  )
}

