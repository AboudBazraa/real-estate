'use client';
import { useState } from "react";
import { Button } from "@/shared/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/shared/components/ui/card"
import { Badge } from "@/shared/components/ui/badge"
import { Calendar, Clock, MapPin, Search, User } from "lucide-react"
import { Input } from "@/shared/components/ui/input"
import { useToast } from "@/shared/hooks/use-toast"

const initialMeetingRequests = [
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
  const [meetingRequests, setMeetingRequests] = useState(initialMeetingRequests);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const { toast } = useToast();

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredRequests = meetingRequests.filter((request) =>
    request.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAcceptRequest = (id) => {
    setMeetingRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "Accepted" } : request
      )
    );
    toast({ title: "Request Accepted", description: "You have accepted the request." });
  };

  const handleDeclineRequest = (id) => {
    setMeetingRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "Declined" } : request
      )
    );
    toast({ title: "Request Declined", description: "You have declined the request." });
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
  };

  const handleModalClose = () => {
    setSelectedRequest(null);
  };

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
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <Badge className="w-fit">
          {meetingRequests.filter((req) => req.status === "Pending").length} Pending Requests
        </Badge>
      </div>
      <div className="space-y-4">
        {filteredRequests.map((request) => (
          <MeetingRequestCard
            key={request.id}
            request={request}
            onAccept={handleAcceptRequest}
            onDecline={handleDeclineRequest}
            onClick={handleRequestClick}
          />
        ))}
      </div>

      {selectedRequest && (
        <RequestDetailsModal request={selectedRequest} onClose={handleModalClose} />
      )}
    </div>
  )
}

function MeetingRequestCard({ request, onAccept, onDecline, onClick }) {
  return (
    <Card onClick={() => onClick(request)} className="cursor-pointer">
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
            <Button variant="outline" size="sm" onClick={(e) => { e.stopPropagation(); onDecline(request.id); }}>
              Decline
            </Button>
            <Button size="sm" onClick={(e) => { e.stopPropagation(); onAccept(request.id); }}>
              Accept
            </Button>
          </div>
        </div>

        <div className="rounded-md bg-muted p-3 text-sm">
          <p>{request.message}</p>
        </div>
      </CardContent>
    </Card>
  )
}

function RequestDetailsModal({ request, onClose }) {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>{request.propertyTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p><strong>Client Name:</strong> {request.clientName}</p>
          <p><strong>Client Phone:</strong> {request.clientPhone}</p>
          <p><strong>Client Email:</strong> {request.clientEmail}</p>
          <p><strong>Requested Date:</strong> {request.requestedDate}</p>
          <p><strong>Requested Time:</strong> {request.requestedTime}</p>
          <p><strong>Message:</strong> {request.message}</p>
        </CardContent>
        <CardFooter>
          <Button onClick={onClose}>Close</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
