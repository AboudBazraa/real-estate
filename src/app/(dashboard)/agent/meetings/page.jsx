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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAppointment((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Form validation
    if (
      !newAppointment.propertyTitle ||
      !newAppointment.clientName ||
      !newAppointment.date ||
      !newAppointment.time
    ) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    // Add appointment with animation
    const appointmentToAdd = {
      ...newAppointment,
      id: `apt-${appointments.length + 1}`,
    };

    setAppointments((prev) => [...prev, appointmentToAdd]);

    toast({
      title: "Appointment Added",
      description: "You have successfully added a new appointment.",
    });

    handleModalClose();
  };

  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300";
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
      default:
        return "";
    }
  };

  const getTypeIcon = (type) => {
    switch (type.toLowerCase()) {
      case "showing":
        return <Calendar className="h-4 w-4" />;
      case "inspection":
        return <Search className="h-4 w-4" />;
      case "meeting":
        return <User className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="container mx-auto p-2 md:p-4 space-y-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Appointments & Meetings
          </h1>
          <p className="text-muted-foreground">
            Manage your scheduled property viewings and client meetings
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={handleAddAppointment} className="group">
            <Plus className="mr-2 h-4 w-4 transition-transform group-hover:rotate-90" />
            Schedule New
          </Button>
        </div>
      </div>

      <Tabs
        defaultValue="upcoming"
        value={activeTab}
        onValueChange={setActiveTab}
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <TabsList>
            <TabsTrigger value="upcoming" className="relative">
              Upcoming
              {/* {!isLoading && (
                <Badge className="ml-1 px-1 h-5 absolute -top-2 -right-2 bg-primary text-white text-xs">
                  {
                    appointments.filter(
                      (apt) => new Date(apt.date) >= new Date()
                    ).length
                  }
                </Badge>
              )} */}
            </TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
            <TabsTrigger value="all">All</TabsTrigger>
          </TabsList>
          <div className="relative sm:w-72">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search appointments..."
              className="pl-8"
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              variants={fadeInUp}
              initial="hidden"
              animate="visible"
              exit="exit"
              className="space-y-4 mt-6"
            >
              {[1, 2, 3].map((i) => (
                <Card key={`skeleton-${i}`} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-6 w-20" />
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-col md:flex-row md:justify-between gap-4">
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-64" />
                        <Skeleton className="h-4 w-48" />
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                      <Skeleton className="h-10 w-28" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </motion.div>
          ) : (
            <TabsContent value={activeTab} className="pt-4">
              <AnimatePresence>
                {filteredAppointments.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={fadeInUp}
                    className="flex flex-col items-center justify-center py-12 text-center"
                  >
                    <div className="bg-muted rounded-full p-4 mb-4">
                      <CalendarDays className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      No appointments found
                    </h3>
                    <p className="text-muted-foreground max-w-md">
                      {searchTerm
                        ? "No appointments match your search criteria. Try adjusting your search."
                        : activeTab === "upcoming"
                        ? "You don't have any upcoming appointments scheduled."
                        : activeTab === "past"
                        ? "You don't have any past appointments."
                        : "You don't have any appointments yet."}
                    </p>
                    <Button
                      onClick={handleAddAppointment}
                      variant="outline"
                      className="mt-6"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Schedule an Appointment
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="appointments-list"
                    className="space-y-4"
                    layout
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={fadeIn}
                  >
                    {filteredAppointments.map((appointment, index) => (
                      <AppointmentItem
                        key={appointment.id}
                        appointment={appointment}
                        onClick={handleAppointmentClick}
                        index={index}
                        getStatusBadgeColor={getStatusBadgeColor}
                        getTypeIcon={getTypeIcon}
                      />
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>
          )}
        </AnimatePresence>
      </Tabs>

      {/* Appointment Details Dialog */}
      <Dialog
        open={selectedAppointment !== null}
        onOpenChange={() => setSelectedAppointment(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
            <DialogDescription>
              View details of this scheduled appointment
            </DialogDescription>
          </DialogHeader>

          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">
                    {selectedAppointment.propertyTitle}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedAppointment.propertyAddress}
                  </p>
                </div>
                <Badge
                  className={getStatusBadgeColor(selectedAppointment.status)}
                >
                  {selectedAppointment.status}
                </Badge>
              </div>

              <Separator />

              <div className="space-y-3">
                <div className="flex gap-2">
                  <User className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {selectedAppointment.clientName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.clientPhone}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <CalendarDays className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">
                      {formatDate(selectedAppointment.date)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.time}
                    </p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <MapPin className="h-4 w-4 mt-1 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Property Location</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedAppointment.propertyAddress}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-2">
                <Badge variant="outline" className="flex gap-1 items-center">
                  {getTypeIcon(selectedAppointment.type)}
                  {selectedAppointment.type}
                </Badge>

                <div className="flex gap-2">
                  <Button variant="destructive" size="sm">
                    Cancel
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Appointment Dialog */}
      <Dialog open={isModalOpen} onOpenChange={handleModalClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Schedule New Appointment</DialogTitle>
            <DialogDescription>
              Fill in the details to create a new appointment
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="propertyTitle">
                Property Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="propertyTitle"
                name="propertyTitle"
                placeholder="Enter property title"
                value={newAppointment.propertyTitle}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyAddress">
                Property Address <span className="text-red-500">*</span>
              </Label>
              <Input
                id="propertyAddress"
                name="propertyAddress"
                placeholder="Enter property address"
                value={newAppointment.propertyAddress}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientName">
                Client Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientName"
                name="clientName"
                placeholder="Enter client name"
                value={newAppointment.clientName}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="clientPhone">
                Client Phone <span className="text-red-500">*</span>
              </Label>
              <Input
                id="clientPhone"
                name="clientPhone"
                placeholder="Enter client phone"
                value={newAppointment.clientPhone}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">
                  Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="date"
                  name="date"
                  type="date"
                  value={newAppointment.date}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split("T")[0]}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="time">
                  Time <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="time"
                  name="time"
                  type="time"
                  value={newAppointment.time}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Appointment Type</Label>
              <Select
                name="type"
                value={newAppointment.type}
                onValueChange={(value) =>
                  setNewAppointment((prev) => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger id="type">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Showing">Property Showing</SelectItem>
                  <SelectItem value="Inspection">
                    Property Inspection
                  </SelectItem>
                  <SelectItem value="Meeting">Client Meeting</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <DialogFooter className="pt-4">
              <Button type="submit">Schedule Appointment</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

function AppointmentItem({
  appointment,
  onClick,
  index,
  getStatusBadgeColor,
  getTypeIcon,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
    >
      <Card
        onClick={() => onClick(appointment)}
        className="overflow-hidden cursor-pointer transition-all hover:shadow-md"
      >
        <CardHeader className="pb-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <CardTitle className="text-base">
              {appointment.propertyTitle}
            </CardTitle>
            <Badge
              className={`w-fit ${getStatusBadgeColor(appointment.status)}`}
            >
              {appointment.status}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-sm">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span>{appointment.propertyAddress}</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <User className="h-3.5 w-3.5 text-muted-foreground" />
                <span>
                  {appointment.clientName} • {appointment.clientPhone}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                  <span>{appointment.time}</span>
                </div>
              </div>
            </div>
            <Badge
              variant="outline"
              className="flex items-center gap-1 self-start"
            >
              {getTypeIcon(appointment.type)}
              <span>{appointment.type}</span>
            </Badge>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ScheduledVisitsPage;
