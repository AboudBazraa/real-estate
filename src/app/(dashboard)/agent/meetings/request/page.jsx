import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Calendar, Clock, MapPin, Search, User } from "lucide-react"
import { Input } from "@/shared/components/ui/input"

const meetingRequests = [
  {
    id: "req-1",
    propertyTitle: "Modern Apartment in Downtown",
    propertyAddress: "123 Main St, Downtown, City",
    clientName: "David Wilson",
    clientEmail: "david.wilson@example.com",
    clientPhone: "(555) 234-5678",
    requestedDate: "2025-03-10",
    requestedTime: "3:00 PM",
    message:
      "I'm interested in viewing this property. I'm looking for a 2-bedroom apartment in the downtown area and this seems perfect.",
    status: "Pending",
  },
  {
    id: "req-2",
    propertyTitle: "Family Home with Garden",
    propertyAddress: "101 Suburban Lane, Greenfield, City",
    clientName: "Jennifer Taylor",
    clientEmail: "jennifer.taylor@example.com",
    clientPhone: "(555) 876-5432",
    requestedDate: "2025-03-12",
    requestedTime: "11:00 AM",
    message:
      "My family is interested in this property. We're looking for a home with a garden in a good school district.",
    status: "Pending",
  },
  {
    id: "req-3",
    propertyTitle: "Penthouse with City Views",
    propertyAddress: "202 Skyline Drive, Downtown, City",
    clientName: "Robert Chen",
    clientEmail: "robert.chen@example.com",
    clientPhone: "(555) 345-6789",
    requestedDate: "2025-03-15",
    requestedTime: "4:30 PM",
    message:
      "I'd like to schedule a viewing for this penthouse. I'm particularly interested in the city views and amenities.",
    status: "Pending",
  },
]

export default function MeetingRequestsPage() {
  const pendingRequestsCount = meetingRequests.filter(
    (req) => req.status === "Pending"
  ).length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">Meeting Requests</h1>
        </div>
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="relative w-full md:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search requests..."
            className="w-full pl-8"
          />
      </div>
        <Badge className="w-fit">{pendingRequestsCount} Pending Requests</Badge>
              </div>
      <div className="space-y-4">
        {meetingRequests.map((request) => (
          <MeetingRequestCard key={request.id} request={request} />
        ))}
      </div>
    </div>
  )
}

function MeetingRequestCard({ request }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
          <CardTitle className="text-base">{request.propertyTitle}</CardTitle>
          <Badge className="w-fit">{request.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm">
              <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
              <span>{request.propertyAddress}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <User className="h-3.5 w-3.5 text-muted-foreground" />
              <span>
                {request.clientName} • {request.clientPhone} •{" "}
                {request.clientEmail}
              </span>
            </div>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{request.requestedDate}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{request.requestedTime}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              Decline
            </Button>
            <Button size="sm">Accept</Button>
          </div>
        </div>

        <div className="rounded-md bg-muted p-3 text-sm">
          <p>{request.message}</p>
        </div>
      </CardContent>
    </Card>
  )
}
