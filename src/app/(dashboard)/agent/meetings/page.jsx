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
import { AppointmentCard } from "@/app/(dashboard)/agent/components/appointmentCard";
import {
  Plus,
  Search,
  Calendar,
  Clock,
  User,
  MapPin,
  X,
  SunMoon,
  CalendarDays,
  Loader2,
} from "lucide-react";
import { Input } from "@/shared/components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/shared/components/ui/tabs";
import { useToast } from "@/shared/hooks/use-toast";
import { Badge } from "@/shared/components/ui/badge";
import { useTheme } from "next-themes";
import { useTranslation } from "@/shared/hooks/useTranslation";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/shared/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Separator } from "@/shared/components/ui/separator";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/components/ui/select";
import { Label } from "@/shared/components/ui/label";

const initialAppointments = [
  {
    id: "apt-1",
    propertyTitle: "Modern Apartment in Downtown",
    propertyAddress: "123 Main St, Downtown, City",
    clientName: "John Smith",
    clientPhone: "(555) 123-4567",
    date: "2025-03-05",
    time: "10:00 AM",
    type: "Showing",
    status: "Confirmed",
  },
  {
    id: "apt-2",
    propertyTitle: "Luxury Villa with Pool",
    propertyAddress: "456 Ocean Ave, Beachside, City",
    clientName: "Emma Johnson",
    clientPhone: "(555) 987-6543",
    date: "2025-03-05",
    time: "2:30 PM",
    type: "Showing",
    status: "Confirmed",
  },
  {
    id: "apt-3",
    propertyTitle: "Family Home with Garden",
    propertyAddress: "101 Suburban Lane, Greenfield, City",
    clientName: "Michael Brown",
    clientPhone: "(555) 456-7890",
    date: "2025-03-06",
    time: "11:15 AM",
    type: "Inspection",
    status: "Pending",
  },
  {
    id: "apt-4",
    propertyTitle: "Office Meeting",
    propertyAddress: "789 Business Blvd, Downtown, City",
    clientName: "Sarah Wilson",
    clientPhone: "(555) 234-5678",
    date: "2025-03-07",
    time: "9:00 AM",
    type: "Meeting",
    status: "Confirmed",
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

const ScheduledVisitsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("upcoming");
  const { theme, setTheme } = useTheme();
  const { currentLanguage, isRTL } = useTranslation();
  const [newAppointment, setNewAppointment] = useState({
    propertyTitle: "",
    propertyAddress: "",
    clientName: "",
    clientPhone: "",
    date: "",
    time: "",
    type: "Showing",
    status: "Pending",
  });
  const { toast } = useToast();

  // Translations
  const translations = {
    en: {
      scheduledVisits: "Scheduled Visits",
      newVisit: "New Visit",
      searchPlaceholder: "Search by property or client name...",
      upcoming: "Upcoming",
      past: "Past",
      all: "All",
      noVisits: "No scheduled visits found",
      noVisitsMessage:
        "Try creating a new appointment or change your search terms.",
      visitDetails: "Visit Details",
      loading: "Loading appointments...",
      // Add Appointment Form
      addNewAppointment: "Add New Appointment",
      scheduleNewVisit: "Schedule a new property visit or meeting",
      propertyTitle: "Property Title",
      propertyAddress: "Property Address",
      clientName: "Client Name",
      clientPhone: "Client Phone",
      date: "Date",
      time: "Time",
      appointmentType: "Appointment Type",
      showing: "Showing",
      inspection: "Inspection",
      meeting: "Meeting",
      consultation: "Consultation",
      status: "Status",
      pending: "Pending",
      confirmed: "Confirmed",
      cancel: "Cancel",
      schedule: "Schedule Visit",
      visitScheduled: "Visit Scheduled",
      newVisitMessage: "New property visit has been scheduled successfully.",
      // View Appointment
      contactClient: "Contact Client",
      visitDetails: "Visit Details",
      visitDate: "Visit Date",
      visitTime: "Visit Time",
      appointmentAdded: "Appointment Added",
      appointmentAddedMessage:
        "New appointment has been added to your calendar.",
    },
    ar: {
      scheduledVisits: "الزيارات المجدولة",
      newVisit: "زيارة جديدة",
      searchPlaceholder: "البحث حسب العقار أو اسم العميل...",
      upcoming: "القادمة",
      past: "السابقة",
      all: "الكل",
      noVisits: "لا توجد زيارات مجدولة",
      noVisitsMessage: "حاول إنشاء موعد جديد أو تغيير مصطلحات البحث الخاصة بك.",
      visitDetails: "تفاصيل الزيارة",
      loading: "جاري تحميل المواعيد...",
      // Add Appointment Form
      addNewAppointment: "إضافة موعد جديد",
      scheduleNewVisit: "جدولة زيارة عقار جديدة أو اجتماع",
      propertyTitle: "عنوان العقار",
      propertyAddress: "عنوان العقار",
      clientName: "اسم العميل",
      clientPhone: "هاتف العميل",
      date: "التاريخ",
      time: "الوقت",
      appointmentType: "نوع الموعد",
      showing: "عرض",
      inspection: "فحص",
      meeting: "اجتماع",
      consultation: "استشارة",
      status: "الحالة",
      pending: "قيد الانتظار",
      confirmed: "مؤكد",
      cancel: "إلغاء",
      schedule: "جدولة الزيارة",
      visitScheduled: "تم جدولة الزيارة",
      newVisitMessage: "تمت جدولة زيارة العقار الجديدة بنجاح.",
      // View Appointment
      contactClient: "الاتصال بالعميل",
      visitDetails: "تفاصيل الزيارة",
      visitDate: "تاريخ الزيارة",
      visitTime: "وقت الزيارة",
      appointmentAdded: "تمت إضافة الموعد",
      appointmentAddedMessage: "تمت إضافة موعد جديد إلى التقويم الخاص بك.",
    },
  };

  const t = translations[currentLanguage === "ar" ? "ar" : "en"];

  // Simulate loading data
  useEffect(() => {
    const timer = setTimeout(() => {
      setAppointments(initialAppointments);
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.propertyTitle
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      appointment.clientName.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter based on tab
    const today = new Date();
    const appointmentDate = new Date(appointment.date);

    if (activeTab === "upcoming") {
      return matchesSearch && appointmentDate >= today;
    } else if (activeTab === "past") {
      return matchesSearch && appointmentDate < today;
    } else {
      return matchesSearch;
    }
  });

  const handleAppointmentClick = (appointment) => {
    setSelectedAppointment(appointment);
  };

  const handleAddAppointment = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setNewAppointment({
      propertyTitle: "",
      propertyAddress: "",
      clientName: "",
      clientPhone: "",
      date: "",
      time: "",
      type: "Showing",
      status: "Pending",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Add a unique ID
    const newId = `apt-${appointments.length + 1}`;
    const appointmentToAdd = { id: newId, ...newAppointment };

    // Add to appointments
    setAppointments((prev) => [...prev, appointmentToAdd]);

    // Close modal and reset form
    handleModalClose();

    // Show success toast
    toast({
      title: t.appointmentAdded,
      description: t.appointmentAddedMessage,
      variant: "success",
    });
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Confirmed":
        return "bg-green-500/10 text-green-600 hover:bg-green-500/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600 hover:bg-yellow-500/20";
      case "Cancelled":
        return "bg-red-500/10 text-red-500 hover:bg-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 hover:bg-gray-500/20";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "Showing":
        return <Calendar className="h-4 w-4" />;
      case "Inspection":
        return <Search className="h-4 w-4" />;
      case "Meeting":
        return <User className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
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
            <h1 className="text-2xl font-bold">{t.scheduledVisits}</h1>
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

            <Button
              onClick={handleAddAppointment}
              className={`${
                isRTL ? "flex-row-reverse" : ""
              } bg-primary hover:bg-primary/90`}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.newVisit}
            </Button>
          </div>
        </div>

        {/* Search & Tabs */}
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

          <Tabs
            defaultValue="upcoming"
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full sm:w-auto"
          >
            <TabsList className="grid grid-cols-3 w-full sm:w-[300px]">
              <TabsTrigger value="upcoming">{t.upcoming}</TabsTrigger>
              <TabsTrigger value="past">{t.past}</TabsTrigger>
              <TabsTrigger value="all">{t.all}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </motion.div>

      {/* Appointments List */}
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
        ) : filteredAppointments.length === 0 ? (
          <motion.div
            key="empty"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center justify-center py-12 text-center"
          >
            <CalendarDays className="h-12 w-12 mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-1">{t.noVisits}</h3>
            <p className="text-muted-foreground max-w-sm">
              {t.noVisitsMessage}
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="appointments"
            variants={fadeInUp}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {filteredAppointments.map((appointment, index) => (
              <AppointmentItem
                key={appointment.id}
                appointment={appointment}
                onClick={handleAppointmentClick}
                index={index}
                getStatusBadgeColor={getStatusBadgeColor}
                getTypeIcon={getTypeIcon}
                t={t}
                isRTL={isRTL}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Appointment Dialog */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className={`sm:max-w-[425px] ${isRTL ? "rtl" : ""}`}>
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{t.addNewAppointment}</DialogTitle>
              <DialogDescription>{t.scheduleNewVisit}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="propertyTitle">{t.propertyTitle}</Label>
                <Input
                  id="propertyTitle"
                  value={newAppointment.propertyTitle}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      propertyTitle: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="propertyAddress">{t.propertyAddress}</Label>
                <Input
                  id="propertyAddress"
                  value={newAppointment.propertyAddress}
                  onChange={(e) =>
                    setNewAppointment({
                      ...newAppointment,
                      propertyAddress: e.target.value,
                    })
                  }
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="clientName">{t.clientName}</Label>
                  <Input
                    id="clientName"
                    value={newAppointment.clientName}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        clientName: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="clientPhone">{t.clientPhone}</Label>
                  <Input
                    id="clientPhone"
                    value={newAppointment.clientPhone}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        clientPhone: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="date">{t.date}</Label>
                  <Input
                    id="date"
                    type="date"
                    value={newAppointment.date}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        date: e.target.value,
                      })
                    }
                    required
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="time">{t.time}</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newAppointment.time}
                    onChange={(e) =>
                      setNewAppointment({
                        ...newAppointment,
                        time: e.target.value,
                      })
                    }
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="type">{t.appointmentType}</Label>
                  <Select
                    value={newAppointment.type}
                    onValueChange={(value) =>
                      setNewAppointment({ ...newAppointment, type: value })
                    }
                  >
                    <SelectTrigger id="type">
                      <SelectValue placeholder={t.appointmentType} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Showing">{t.showing}</SelectItem>
                      <SelectItem value="Inspection">{t.inspection}</SelectItem>
                      <SelectItem value="Meeting">{t.meeting}</SelectItem>
                      <SelectItem value="Consultation">
                        {t.consultation}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="status">{t.status}</Label>
                  <Select
                    value={newAppointment.status}
                    onValueChange={(value) =>
                      setNewAppointment({ ...newAppointment, status: value })
                    }
                  >
                    <SelectTrigger id="status">
                      <SelectValue placeholder={t.status} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">{t.pending}</SelectItem>
                      <SelectItem value="Confirmed">{t.confirmed}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter className={isRTL ? "flex-row-reverse" : ""}>
              <Button
                type="button"
                variant="outline"
                onClick={handleModalClose}
              >
                {t.cancel}
              </Button>
              <Button type="submit">{t.schedule}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* View Appointment Details Dialog */}
      <Dialog
        open={!!selectedAppointment}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        {selectedAppointment && (
          <DialogContent className={`sm:max-w-[425px] ${isRTL ? "rtl" : ""}`}>
            <DialogHeader>
              <DialogTitle>{t.visitDetails}</DialogTitle>
              <DialogDescription>
                {selectedAppointment.propertyTitle}
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                <span className="text-sm">
                  {selectedAppointment.propertyAddress}
                </span>
              </div>
              <Separator />
              <div className="grid gap-2">
                <h4 className="font-medium text-sm">{t.clientName}</h4>
                <p>{selectedAppointment.clientName}</p>
              </div>
              <div className="grid gap-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{t.visitDate}</h4>
                  <Badge variant="outline">{selectedAppointment.status}</Badge>
                </div>
                <p>
                  {formatDate(selectedAppointment.date)},{" "}
                  {selectedAppointment.time}
                </p>
              </div>

              <Button
                variant="secondary"
                className={`mt-2 ${isRTL ? "flex-row-reverse" : ""}`}
              >
                <User className={`h-4 w-4 ${isRTL ? "ml-2" : "mr-2"}`} />
                {t.contactClient}
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
};

export default ScheduledVisitsPage;

function AppointmentItem({
  appointment,
  onClick,
  index,
  getStatusBadgeColor,
  getTypeIcon,
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
      <Card
        className="overflow-hidden cursor-pointer border transition-all hover:shadow-md"
        onClick={() => onClick(appointment)}
      >
        <CardHeader className="p-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <CardTitle className="text-base">
                {appointment.propertyTitle}
              </CardTitle>
              <CardDescription className="line-clamp-1">
                {appointment.propertyAddress}
              </CardDescription>
            </div>
            <Badge
              variant="secondary"
              className={`${getStatusBadgeColor(
                appointment.status
              )} transition-colors`}
            >
              {appointment.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 space-y-3">
          <div
            className={`flex items-center ${
              isRTL ? "space-x-reverse" : "space-x-2"
            }`}
          >
            <User className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm">{appointment.clientName}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-1 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span>{formatDate(appointment.date)}</span>
            </div>
            <div className="flex items-center gap-1 text-sm">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{appointment.time}</span>
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 pt-0">
          <div
            className={`flex items-center ${
              isRTL ? "space-x-reverse" : "space-x-2"
            }`}
          >
            <Badge
              variant="outline"
              className={`${
                isRTL ? "flex-row-reverse" : ""
              } px-2 py-1 h-7 rounded-full`}
            >
              {getTypeIcon(appointment.type)}
              <span className={`text-xs ${isRTL ? "mr-1" : "ml-1"}`}>
                {appointment.type}
              </span>
            </Badge>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
