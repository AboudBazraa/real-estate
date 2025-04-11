"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/shared/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import {
  Calendar,
  Clock,
  MapPin,
  Search,
  User,
  CheckCircle,
  XCircle,
  MessageCircle,
  Loader2,
  SunMoon,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import { useToast } from "@/shared/hooks/use-toast";
import { useTheme } from "next-themes";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

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
];

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.4 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.2 } },
};

export default function MeetingRequestsPage() {
  const [meetingRequests, setMeetingRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setMeetingRequests(initialMeetingRequests);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const filteredRequests = meetingRequests.filter((request) => {
    const matchesSearch =
      request.propertyTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.clientName.toLowerCase().includes(searchTerm.toLowerCase());

    if (statusFilter === "all") return matchesSearch;
    return (
      matchesSearch &&
      request.status.toLowerCase() === statusFilter.toLowerCase()
    );
  });

  const handleAcceptRequest = (id) => {
    setMeetingRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "Accepted" } : request
      )
    );
    toast({
      title: "Request Accepted",
      description:
        "You have accepted the request. A notification has been sent to the client.",
    });
  };

  const handleDeclineRequest = (id) => {
    setMeetingRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "Declined" } : request
      )
    );
    toast({
      title: "Request Declined",
      description:
        "You have declined the request. A notification has been sent to the client.",
    });
  };

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
  };

  const handleModalClose = () => {
    setSelectedRequest(null);
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "declined":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "";
    }
  };

  return (
    <motion.div
      className="container mx-auto p-2 md:p-4 space-y-6"
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Meeting Requests
          </h1>
          <p className="text-muted-foreground text-sm">
            Manage your property viewing requests from clients
          </p>
        </div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="rounded-full"
              >
                <SunMoon className="h-5 w-5" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <div className="relative w-full md:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by property or client..."
              className="w-full pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="accepted">Accepted</SelectItem>
              <SelectItem value="declined">Declined</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Badge className="w-fit hidden md:flex">
          {meetingRequests.filter((req) => req.status === "Pending").length}{" "}
          Pending Requests
        </Badge>
      </div>

      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            className="space-y-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
          >
            {[1, 2, 3].map((i) => (
              <Card key={`skeleton-${i}`} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="space-y-2 w-full">
                      <Skeleton className="h-4 w-full max-w-[300px]" />
                      <Skeleton className="h-4 w-full max-w-[400px]" />
                      <div className="flex items-center gap-4">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-4 w-[100px]" />
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-20" />
                    </div>
                  </div>
                  <Skeleton className="h-20 w-full" />
                </CardContent>
              </Card>
            ))}
          </motion.div>
        ) : filteredRequests.length === 0 ? (
          <motion.div
            key="empty"
            className="text-center py-16 rounded-xl border border-dashed bg-muted/20"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
          >
            <div className="mx-auto w-fit p-4 rounded-full bg-muted mb-4">
              <MessageCircle className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-xl font-medium mb-2">No requests found</p>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              {searchTerm
                ? "No requests match your search criteria. Try adjusting your filters."
                : "You don't have any meeting requests yet."}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="content"
            className="space-y-4"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={fadeIn}
          >
            {filteredRequests.map((request, index) => (
              <MeetingRequestCard
                key={request.id}
                request={request}
                onAccept={handleAcceptRequest}
                onDecline={handleDeclineRequest}
                onClick={handleRequestClick}
                index={index}
                getStatusColor={getStatusColor}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <Dialog open={selectedRequest !== null} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Meeting Request Details</DialogTitle>
            <DialogDescription>
              View the complete details of this meeting request
            </DialogDescription>
          </DialogHeader>

          {selectedRequest && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">
                    {selectedRequest.propertyTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedRequest.propertyAddress}
                  </p>
                </div>
                <Badge className={`${getStatusColor(selectedRequest.status)}`}>
                  {selectedRequest.status}
                </Badge>
              </div>

              <div className="space-y-3 border-y py-4">
                <div className="flex items-start gap-2">
                  <User className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  <div>
                    <p className="font-medium">{selectedRequest.clientName}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.clientEmail}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.clientPhone}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedRequest.requestedDate}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">
                      {selectedRequest.requestedTime}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <p className="font-medium mb-2">Client Message:</p>
                <div className="rounded-md bg-muted p-3 text-sm">
                  <p>{selectedRequest.message}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between sm:space-x-0">
            {selectedRequest && selectedRequest.status === "Pending" && (
              <>
                <Button
                  variant="outline"
                  onClick={() => {
                    handleDeclineRequest(selectedRequest.id);
                    handleModalClose();
                  }}
                  className="w-full sm:w-auto"
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  Decline
                </Button>
                <Button
                  onClick={() => {
                    handleAcceptRequest(selectedRequest.id);
                    handleModalClose();
                  }}
                  className="w-full sm:w-auto"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accept
                </Button>
              </>
            )}
            {selectedRequest && selectedRequest.status !== "Pending" && (
              <Button onClick={handleModalClose} className="w-full sm:w-auto">
                Close
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}

function MeetingRequestCard({
  request,
  onAccept,
  onDecline,
  onClick,
  index,
  getStatusColor,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card
        onClick={() => onClick(request)}
        className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
      >
        <CardHeader className="pb-2">
          <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center">
            <CardTitle className="text-base">{request.propertyTitle}</CardTitle>
            <Badge className={`w-fit ${getStatusColor(request.status)}`}>
              {request.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{request.propertyAddress}</span>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:gap-2 text-sm">
                <div className="flex items-center gap-1">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{request.clientName}</span>
                </div>
                <span className="hidden sm:inline text-muted-foreground">
                  •
                </span>
                <span className="text-muted-foreground">
                  {request.clientPhone}
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

            {request.status === "Pending" && (
              <div className="flex gap-2 self-end md:self-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDecline(request.id);
                  }}
                  className="group"
                >
                  <XCircle className="mr-1 h-4 w-4 text-red-500 group-hover:text-red-600" />
                  Decline
                </Button>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    onAccept(request.id);
                  }}
                  className="group"
                >
                  <CheckCircle className="mr-1 h-4 w-4" />
                  Accept
                </Button>
              </div>
            )}
          </div>

          <div className="rounded-md bg-muted p-3 text-sm">
            <p className="line-clamp-2">{request.message}</p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
