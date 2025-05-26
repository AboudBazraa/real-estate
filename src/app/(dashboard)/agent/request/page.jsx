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
import { useTranslation } from "@/shared/hooks/useTranslation";
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
  const { currentLanguage, isRTL } = useTranslation();

  // Translations
  const translations = {
    en: {
      meetingRequests: "Meeting Requests",
      searchPlaceholder: "Search by property or client name...",
      all: "All",
      pending: "Pending",
      accepted: "Accepted",
      declined: "Declined",
      noRequests: "No meeting requests found",
      noRequestsMessage:
        "When clients request property viewings, they will appear here.",
      loading: "Loading requests...",
      // Request Details
      requestDetails: "Request Details",
      clientInformation: "Client Information",
      email: "Email",
      phone: "Phone",
      requestedDateTime: "Requested Date & Time",
      message: "Message",
      property: "Property",
      accept: "Accept",
      decline: "Decline",
      close: "Close",
      // Toast Messages
      requestAccepted: "Request Accepted",
      requestAcceptedMessage:
        "You have accepted the request. A notification has been sent to the client.",
      requestDeclined: "Request Declined",
      requestDeclinedMessage:
        "You have declined the request. A notification has been sent to the client.",
    },
    ar: {
      meetingRequests: "طلبات الاجتماع",
      searchPlaceholder: "البحث حسب العقار أو اسم العميل...",
      all: "الكل",
      pending: "قيد الانتظار",
      accepted: "مقبول",
      declined: "مرفوض",
      noRequests: "لم يتم العثور على طلبات اجتماع",
      noRequestsMessage: "عندما يطلب العملاء مشاهدة العقارات، ستظهر هنا.",
      loading: "جاري تحميل الطلبات...",
      // Request Details
      requestDetails: "تفاصيل الطلب",
      clientInformation: "معلومات العميل",
      email: "البريد الإلكتروني",
      phone: "الهاتف",
      requestedDateTime: "التاريخ والوقت المطلوب",
      message: "الرسالة",
      property: "العقار",
      accept: "قبول",
      decline: "رفض",
      close: "إغلاق",
      // Toast Messages
      requestAccepted: "تم قبول الطلب",
      requestAcceptedMessage: "لقد قبلت الطلب. تم إرسال إشعار إلى العميل.",
      requestDeclined: "تم رفض الطلب",
      requestDeclinedMessage: "لقد رفضت الطلب. تم إرسال إشعار إلى العميل.",
    },
  };

  const t = translations[currentLanguage === "ar" ? "ar" : "en"];

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
      title: t.requestAccepted,
      description: t.requestAcceptedMessage,
    });
  };

  const handleDeclineRequest = (id) => {
    setMeetingRequests((prev) =>
      prev.map((request) =>
        request.id === id ? { ...request, status: "Declined" } : request
      )
    );
    toast({
      title: t.requestDeclined,
      description: t.requestDeclinedMessage,
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
    <div className={`w-full mx-auto ${isRTL ? "rtl" : ""}`}>
      <motion.div
        initial="hidden"
        animate="visible"
        variants={fadeIn}
        className="mb-8"
      >
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold">{t.meetingRequests}</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={toggleTheme}
              className="hidden sm:flex"
            >
              <SunMoon className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="mt-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="w-full sm:w-auto relative">
            <Search
              className={`absolute ${
                isRTL ? "left-3" : "left-3"
              } top-2.5 h-4 w-4 text-muted-foreground`}
            />
            <Input
              placeholder={t.searchPlaceholder}
              className={`${
                isRTL ? "pr-10" : "pl-10"
              } w-full sm:w-[300px] h-10`}
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <Select
            value={statusFilter}
            onValueChange={setStatusFilter}
            className="w-full sm:w-[150px]"
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t.all}</SelectItem>
              <SelectItem value="pending">{t.pending}</SelectItem>
              <SelectItem value="accepted">{t.accepted}</SelectItem>
              <SelectItem value="declined">{t.declined}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* Meeting Requests List */}
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {Array(6)
              .fill("")
              .map((_, index) => (
                <Card
                  key={`loading-${index}`}
                  className="overflow-hidden border"
                >
                  <CardHeader className="p-4">
                    <div className="flex justify-between items-start">
                      <div className="space-y-1.5 flex-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 space-y-3">
                    <Skeleton className="h-4 w-4/5" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex items-center justify-between mt-2">
                      <Skeleton className="h-8 w-20" />
                      <Skeleton className="h-8 w-8 rounded-full" />
                    </div>
                  </CardContent>
                </Card>
              ))}
          </motion.div>
        ) : filteredRequests.length === 0 ? (
          <motion.div
            key="empty"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <MessageCircle className="h-12 w-12 mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-1">{t.noRequests}</h3>
            <p className="text-muted-foreground max-w-sm">
              {t.noRequestsMessage}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="requests"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
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
                t={t}
                isRTL={isRTL}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Request Details Dialog */}
      <Dialog open={!!selectedRequest} onOpenChange={handleModalClose}>
        {selectedRequest && (
          <DialogContent className={`sm:max-w-[500px] ${isRTL ? "rtl" : ""}`}>
            <DialogHeader>
              <DialogTitle>{t.requestDetails}</DialogTitle>
              <DialogDescription>
                {selectedRequest.propertyTitle}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="space-y-2">
                <h4 className="font-medium text-sm">{t.clientInformation}</h4>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-xs text-muted-foreground">
                      {t.clientInformation}
                    </p>
                    <p className="text-sm">{selectedRequest.clientName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t.email}</p>
                    <p className="text-sm">{selectedRequest.clientEmail}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{t.phone}</p>
                    <p className="text-sm">{selectedRequest.clientPhone}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">{t.requestedDateTime}</h4>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {selectedRequest.requestedDate},{" "}
                    {selectedRequest.requestedTime}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">{t.property}</h4>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    {selectedRequest.propertyAddress}
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">{t.message}</h4>
                <p className="text-sm border rounded-md p-3 bg-muted/50">
                  {selectedRequest.message}
                </p>
              </div>
            </div>
            <DialogFooter
              className={`gap-2 ${isRTL ? "flex-row-reverse" : ""}`}
            >
              {selectedRequest.status === "Pending" ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => {
                      handleDeclineRequest(selectedRequest.id);
                      handleModalClose();
                    }}
                    className={`${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <XCircle className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                    {t.decline}
                  </Button>
                  <Button
                    onClick={() => {
                      handleAcceptRequest(selectedRequest.id);
                      handleModalClose();
                    }}
                    className={`${isRTL ? "flex-row-reverse" : ""}`}
                  >
                    <CheckCircle
                      className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`}
                    />
                    {t.accept}
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={handleModalClose}>
                  {t.close}
                </Button>
              )}
            </DialogFooter>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}

function MeetingRequestCard({
  request,
  onAccept,
  onDecline,
  onClick,
  index,
  getStatusColor,
  t,
  isRTL,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        y: 0,
        transition: { duration: 0.3, delay: index * 0.05 },
      }}
    >
      <Card className="overflow-hidden cursor-pointer border transition-all hover:shadow-md">
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-base">{request.clientName}</CardTitle>
              <CardDescription className="line-clamp-1">
                {request.propertyTitle}
              </CardDescription>
            </div>
            <Badge className={getStatusColor(request.status)}>
              {request.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm line-clamp-1">
              {request.propertyAddress}
            </span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{request.requestedDate}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{request.requestedTime}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0 flex justify-between">
          {request.status === "Pending" ? (
            <div className={`flex gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDecline(request.id);
                      }}
                    >
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.decline}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onAccept(request.id);
                      }}
                    >
                      <CheckCircle className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t.accept}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          ) : (
            <div className="flex-1"></div>
          )}
          <Button
            size="sm"
            variant="ghost"
            className="h-8"
            onClick={() => onClick(request)}
          >
            {t.requestDetails}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
